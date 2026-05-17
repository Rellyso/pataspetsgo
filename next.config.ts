import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        hostname: "127.0.0.1",
      },
    ],
  },
};

export default nextConfig;
