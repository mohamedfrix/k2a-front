import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['127.0.0.1', 'localhost'],
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '9000',
        pathname: '/vehicle-images/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000',
        pathname: '/vehicle-images/**',
      },
      {
        protocol: 'https',
        hostname: '127.0.0.1',
        port: '9000',
        pathname: '/vehicle-images/**',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '9000',
        pathname: '/vehicle-images/**',
      },
    ],
  },
};

export default nextConfig;
