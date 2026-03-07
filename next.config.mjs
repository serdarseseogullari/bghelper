/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  eslint: {
    // Lint locally with `npm run lint`; skip during CI build to save time
    ignoreDuringBuilds: true,
  },
}

export default nextConfig
