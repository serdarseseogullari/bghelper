/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  eslint: {
    // Lint locally with `npm run lint`; skip during CI build to save time
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Type-check locally with `npm run type-check`; skip during CI build to save time
    ignoreBuildErrors: true,
  },
}

export default nextConfig
