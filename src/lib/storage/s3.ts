import { createHash, createHmac } from "node:crypto";
import { env } from "@/lib/env";

/**
 * Генерация pre-signed URL для Yandex Object Storage (S3-совместимое API)
 * по алгоритму AWS Signature Version 4 (query-string подпись для GET).
 *
 * Реализовано без зависимости от aws-sdk: подпись считается на node:crypto.
 * Документация SigV4: presigned URL содержит подпись в query-параметрах,
 * поэтому ссылку можно открыть напрямую в браузере/плеере.
 */

function sha256Hex(data: string): string {
  return createHash("sha256").update(data, "utf8").digest("hex");
}

function hmac(key: Buffer | string, data: string): Buffer {
  return createHmac("sha256", key).update(data, "utf8").digest();
}

/** Кодирование пути по правилам AWS (каждый сегмент, слэши сохраняются). */
function encodeKey(key: string): string {
  return key
    .split("/")
    .map((seg) => encodeURIComponent(seg))
    .join("/");
}

interface PresignOptions {
  key: string;
  /** Время жизни ссылки в секундах (по умолчанию 1 час). */
  expiresIn?: number;
  bucket?: string;
}

export function isStorageConfigured(): boolean {
  return Boolean(
    env.YANDEX_S3_ACCESS_KEY_ID &&
      env.YANDEX_S3_SECRET_ACCESS_KEY &&
      env.YANDEX_S3_BUCKET,
  );
}

/**
 * Возвращает временную подписанную ссылку на объект в Yandex Object Storage.
 */
export function getPresignedUrl({
  key,
  expiresIn = 3600,
  bucket,
}: PresignOptions): string {
  const accessKeyId = env.YANDEX_S3_ACCESS_KEY_ID;
  const secretAccessKey = env.YANDEX_S3_SECRET_ACCESS_KEY;
  const bucketName = bucket ?? env.YANDEX_S3_BUCKET;

  if (!accessKeyId || !secretAccessKey || !bucketName) {
    throw new Error("storage_not_configured");
  }

  const region = env.YANDEX_S3_REGION;
  const endpoint = new URL(env.YANDEX_S3_ENDPOINT);
  const host = endpoint.host;

  // Path-style URL: https://storage.yandexcloud.net/<bucket>/<key>
  const canonicalUri = `/${encodeKey(bucketName)}/${encodeKey(key)}`;

  const now = new Date();
  const amzDate = `${now.toISOString().replace(/[:-]|\.\d{3}/g, "")}`; // YYYYMMDDTHHMMSSZ
  const dateStamp = amzDate.slice(0, 8); // YYYYMMDD

  const service = "s3";
  const credentialScope = `${dateStamp}/${region}/${service}/aws4_request`;
  const signedHeaders = "host";

  const query: Record<string, string> = {
    "X-Amz-Algorithm": "AWS4-HMAC-SHA256",
    "X-Amz-Credential": `${accessKeyId}/${credentialScope}`,
    "X-Amz-Date": amzDate,
    "X-Amz-Expires": String(expiresIn),
    "X-Amz-SignedHeaders": signedHeaders,
  };

  const canonicalQuerystring = Object.keys(query)
    .sort()
    .map(
      (k) => `${encodeURIComponent(k)}=${encodeURIComponent(query[k] as string)}`,
    )
    .join("&");

  const canonicalHeaders = `host:${host}\n`;
  const payloadHash = "UNSIGNED-PAYLOAD";

  const canonicalRequest = [
    "GET",
    canonicalUri,
    canonicalQuerystring,
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join("\n");

  const stringToSign = [
    "AWS4-HMAC-SHA256",
    amzDate,
    credentialScope,
    sha256Hex(canonicalRequest),
  ].join("\n");

  const kDate = hmac(`AWS4${secretAccessKey}`, dateStamp);
  const kRegion = hmac(kDate, region);
  const kService = hmac(kRegion, service);
  const kSigning = hmac(kService, "aws4_request");
  const signature = createHmac("sha256", kSigning)
    .update(stringToSign, "utf8")
    .digest("hex");

  return `${endpoint.origin}${canonicalUri}?${canonicalQuerystring}&X-Amz-Signature=${signature}`;
}
