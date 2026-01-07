/** @type {import('next').NextConfig} */
const nextConfig = {
  // Vercel deployment configuration (supports API routes)
  // output: 'export', // ❌ Removed for Vercel - allows API routes
  images: { 
    unoptimized: false, // ✅ Vercel has built-in image optimization
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '**.upstash.io',
      },
      {
        protocol: 'https',
        hostname: '**.vercel.app',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
      },
      // Add your image CDN domains here
    ],
  },
  trailingSlash: false, // Vercel doesn't require trailing slash
  
  // Environment variables that will be available in the client
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || '',
  },
  
  // Optimize for production
  reactStrictMode: true,
};

module.exports = nextConfig;

