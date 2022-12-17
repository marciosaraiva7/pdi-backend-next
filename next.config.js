/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://pdi-backend-next.vercel.app/api/:path*',
      },
    ]
  },
}

module.exports = nextConfig
