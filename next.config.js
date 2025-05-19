/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://zohaibk112-the-runners-bert-emotions.hf.space/api/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
