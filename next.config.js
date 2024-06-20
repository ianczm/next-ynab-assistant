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
      {
        source: "/investments",
        destination: "/investments/",
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
