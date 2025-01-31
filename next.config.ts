import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    reactCompiler: true,
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
