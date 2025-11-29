import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "movie-app-uploads-ayaz.s3.us-east-1.amazonaws.com" }]
  }
};

export default nextConfig;
