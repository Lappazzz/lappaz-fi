import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lappaz.fi',
      },
      {
        protocol: 'https',
        hostname: 'www.lappaz.fi',
      },
    ],
  },
};

export default nextConfig;
