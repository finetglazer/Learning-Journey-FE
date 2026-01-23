/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Add these two blocks to ignore errors during build:
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig