// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Skip ESLint errors in production builds
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
