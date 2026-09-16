/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Pin the Turbopack workspace root so an ancestor lockfile can't shift it.
  turbopack: {
    root: import.meta.dirname,
  },
};

export default nextConfig;
