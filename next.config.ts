import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    agenticAutoUpgrade: 'latest',
    inlineCss: true,
    staleTimes: {
      dynamic: 30,
    },
  },
  redirects: async () => {
    return [
      {
        destination: '/todo',
        permanent: false,
        source: '/',
      },
    ];
  },
};

module.exports = nextConfig;
