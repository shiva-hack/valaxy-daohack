/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/graphql',
        destination: 'https://the-secret-project.herokuapp.com/v1/graphql',
      },
    ]
  },
}

module.exports = nextConfig
