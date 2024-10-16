/** @type {import('next').NextConfig} */
import withPWA from "next-pwa";

const nextConfig = {
  ...withPWA({
    dest: "public",
    register: true,
    skipWaiting: true,
  }),
  httpAgentOptions: {
    keepAlive: true,
  },
};

export default nextConfig;
