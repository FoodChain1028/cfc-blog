const withPWA = require("next-pwa")({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

module.exports = withPWA({
  // next.js config
  reactStrictMode: true,
  basePath: process.env.NODE_ENV === 'production' ? '/blogs' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/blogs' : '',
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  async rewrites() {
    return [
      {
        source: "/rss",
        destination: "/api/rss",
      },
    ];
  },
});
