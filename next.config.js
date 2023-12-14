/** @type {import("next").NextConfig} */
const nextConfig = {
  logging: {
    fetches: {
      fullUrl: true,
    },
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
