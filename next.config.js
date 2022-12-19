/** @type {import('next').NextConfig} */
module.exports = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "/:path*",
      },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "Access-Control-Allow-Credentials",
            value: "true",
          },
          { key: "Access-Control-Allow-Origin", value: "*" },
          {
            key: "Access-Control-Allow-Methods",
            value: "*",
          },
          {
            key: "Access-Control-Allow-Headers",
            value: "*",
          },
          {
            key: "X-Custom-Page-Only-Header",
            value: "ok",
          },
        ],
      },
    ];
  },
};
