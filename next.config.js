/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  experimental: {
    appDir: true,  // enable App Router in src/app
  },
};

module.exports = nextConfig;
