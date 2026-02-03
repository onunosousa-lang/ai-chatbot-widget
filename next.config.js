/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allow existing static files
  async rewrites() {
    return [
      {
        source: '/chatbot.js',
        destination: '/chatbot.js',
      },
      {
        source: '/onboarding.html',
        destination: '/onboarding.html',
      },
    ];
  },
};

module.exports = nextConfig;
