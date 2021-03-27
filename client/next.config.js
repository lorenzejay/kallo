module.exports = {
  async rewrites() {
    return [
      {
        source: "/api/:slug*",
        destination: "http://localhost:5000/api/:slug*",
      },
    ];
  },
};
