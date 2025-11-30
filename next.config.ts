import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "beta.lappaz.fi",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "wp.lappaz.fi",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
};

export default nextConfig;
