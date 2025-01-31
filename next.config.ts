import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    inlineCss: true,
    ppr: true,
    reactCompiler: true,
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
