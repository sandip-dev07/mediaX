// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
      ignoreDuringBuilds: true, // ⛔ Ignore ESLint during builds
    },
    typescript: {
      ignoreBuildErrors: true,  // ⛔ Ignore TypeScript errors too
    },
  }
  
export default nextConfig
  