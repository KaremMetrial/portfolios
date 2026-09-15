import type { NextConfig } from "next";

// Media is served by the API origin (Media module), so next/image may only
// optimize images from there.
const apiUrl = new URL(
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1",
);

const nextConfig: NextConfig = {
  cacheComponents: true,

  experimental: {
    // app/global-not-found.tsx: the root layout lives under [lang], so
    // unmatched URLs need their own document (FR-FE-40, FR-FE-95).
    globalNotFound: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: apiUrl.protocol === "http:" ? "http" : "https",
        hostname: apiUrl.hostname,
        port: apiUrl.port,
      },
    ],
  },
};

export default nextConfig;
