/** @type {import("next").NextConfig} */
const nextConfig = {
  experimental: {
    serverActions: true,
  },
  async redirects() {
    return [
      {
        source: "/transactions/create",
        destination: "/transactions/create/transportation",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
