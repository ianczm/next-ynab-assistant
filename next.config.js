/** @type {import("next").NextConfig} */
const nextConfig = {
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
