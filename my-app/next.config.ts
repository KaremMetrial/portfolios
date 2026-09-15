import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,

  images: {
    remotePatterns: [
      // API media origin (FR-FE-11 pipeline). Tune hosts in .env.example when known.
      {
        protocol: "https",
        hostname: "**.metrial.dev",
      },
      {
        protocol: "https",
        hostname: "localhost",
      },
    ],
  },
};

export default nextConfig;
