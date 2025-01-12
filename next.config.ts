import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['www.youtube2.com', 'nzwupaofdqmbbcqqyfax.supabase.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.vercel-storage.com',
      }
    ]
  },
  // Ensure favicon and other static assets are handled correctly
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(ico|png|jpg|jpeg|gif|svg)$/,
      type: 'asset/resource'
    })
  }
}

export default nextConfig;




