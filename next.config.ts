import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Remove swcMinify as it's deprecated in newer Next.js versions
  images: {
    domains: ['www.youtube2.com', 'nzwupaofdqmbbcqqyfax.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.vercel-storage.com',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true, // Ignores ESLint errors during builds
  },
  webpack: (config) => {
    if (!config) {
      throw new Error('Webpack config is undefined. Ensure you are returning a valid config.');
    }

    // Add custom asset/resource handling for images and icons
    config.module.rules.push({
      test: /\.(ico|png|jpg|jpeg|gif|svg)$/,
      type: 'asset/resource',
    });

    return config;
  },
};

export default nextConfig;
