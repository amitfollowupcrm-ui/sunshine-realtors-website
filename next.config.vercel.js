/** @type {import('next').NextConfig} */
// Configuration for Vercel deployment (with API routes support)
const nextConfig = {
  // Remove 'output: export' for Vercel - allows API routes
  // output: 'export', // ❌ Not for Vercel
  
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
  
  // Environment variables that will be available in the client
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || '',
  },
  
  // Optimize for production
  reactStrictMode: true,
  
  // Enable experimental features if needed
  experimental: {
    // Add any experimental features here
  },
};

module.exports = nextConfig;

