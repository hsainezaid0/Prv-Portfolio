import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Recommended by React Three Fiber so three.js modules are compiled consistently.
  transpilePackages: ["three"],
};

export default nextConfig;
