/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['natural'],
  transpilePackages: ['@lexforge/ui', '@lexforge/motion', '@lexforge/design-tokens', '@lexforge/shared-types'],
  async redirects() {
    return [
      {
        source: '/get-started',
        destination: '/generate',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
