// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // WARNING: temporarily ignore ESLint errors during builds
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;