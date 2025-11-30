import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'beta.lappaz.fi',
      },
      {
        protocol: 'https',
        hostname: 'beta.lappaz.fi',
      },
    ],
  },
};

export default nextConfig;
