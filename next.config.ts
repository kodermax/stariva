import "./src/lib/env";

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      // Ozon CDN domains for product images
      { protocol: "https", hostname: "cdn1.ozon.ru" },
      { protocol: "https", hostname: "cdn2.ozon.ru" },
      { protocol: "https", hostname: "cdn3.ozon.ru" },
      { protocol: "https", hostname: "cdn1.ozone.ru" },
      { protocol: "https", hostname: "cdn2.ozone.ru" },
      { protocol: "https", hostname: "cdn3.ozone.ru" },
      { protocol: "https", hostname: "ir.ozone.ru" },
      { protocol: "https", hostname: "s3.ozone.ru" },
    ],
  },
  async redirects() {
    return [
      {
        source: "/catalog/decor",
        destination: "/catalog/interior",
        permanent: true,
      },
      {
        source: "/catalog/decor/:slug*",
        destination: "/catalog/interior/:slug*",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
