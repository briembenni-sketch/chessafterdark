import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "storage.buzzsprout.com",
      },
      {
        protocol: "https",
        hostname: "*.buzzsprout.com",
      },
    ],
  },
};

export default nextConfig;
