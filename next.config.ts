import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/v0/b/band-manager-d1cb7.firebasestorage.app/**',
      },
    ],
  },
};

export default nextConfig;
