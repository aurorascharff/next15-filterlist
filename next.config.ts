import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    inlineCss: true,
    reactCompiler: true,
    staleTimes: {
      dynamic: 30,
    },
    useCache: true,
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
