/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  productionBrowserSourceMaps: false, // Disable source maps in production
  webpack: (config, { dev }) => {
    if (!dev) {
      config.devtool = false // Disable source maps in production
    }
    return config
  }
}

export default nextConfig
