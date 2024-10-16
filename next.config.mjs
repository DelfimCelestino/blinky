/** @type {import('next').NextConfig} */
import withPWA from "next-pwa";

const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      {
        source: "/ads.txt",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, max-age=0",
          },
          {
            key: "Content-Type",
            value: "text/plain",
          },
        ],
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/ads.txt",
        destination: "/api/ads-txt",
      },
    ];
  },
  ...withPWA({
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === "development",
  }),
  httpAgentOptions: {
    keepAlive: true,
  },
};

export default nextConfig;
