/** @type {import('next').NextConfig} */
const nextConfig = {
  // Removed 'output: export' to enable API routes on Vercel
  trailingSlash: true,
  images: {
    unoptimized: true
  }
}

export default nextConfig