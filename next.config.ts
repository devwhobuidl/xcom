import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@prisma/client", "prisma"],
  experimental: {
    forceSwcTransforms: true,
  },
  // Force Webpack instead of Turbopack for production stability
  webpack: (config) => {
    return config;
  },
};

export default nextConfig;
