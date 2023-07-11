/** @type {import('next').NextConfig} */
const nextConfig = {
  // this makes all useEffect run twice
  reactStrictMode: false,
  appDir: true,
  future: {
    webpack5: true
  },
  webpack(config) {
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false
    };
    return config;
  }
};

module.exports = nextConfig;
