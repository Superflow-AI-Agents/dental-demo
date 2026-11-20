import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Steady builds (F3): the build id must not change between builds of the same content.
  generateBuildId: async () => "larkmoor",
  poweredByHeader: false,
  reactStrictMode: true,
  images: { unoptimized: true },
};

export default nextConfig;
