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
      { protocol: "https", hostname: "ir.ozone.ru" },
    ],
  },
};

export default nextConfig;
