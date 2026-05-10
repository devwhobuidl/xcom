/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ["@prisma/client", "prisma"],
  // Force Webpack for stability (Turbopack is causing module factory errors)
  webpack: (config) => {
    return config;
  },
  // Optional: Disable Turbopack warnings
  experimental: {
    forceSwcTransforms: true,
  },
};

export default nextConfig;
