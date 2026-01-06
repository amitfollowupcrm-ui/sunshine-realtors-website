/** @type {import('next').NextConfig} */
const nextConfig = {
  // For Firebase Hosting static export, uncomment:
  // output: 'export',
  // images: { unoptimized: true },
  // trailingSlash: true,
  
  // For Vercel or full Next.js hosting (recommended):
  images: {
    domains: ['localhost'],
    // Add your image domains here (CDN, S3, etc.)
  },
  
  // Environment variables that will be available in the client
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL || '/api',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || '',
  },
  
  // Optimize for production
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;

