import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**.ufs.sh", // Allows any UploadThing-hosted images
      },
    ],
    // Optimize image generation to reduce cache writes while maintaining quality
    deviceSizes: [640, 768, 1024, 1280, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384, 512, 640],
    minimumCacheTTL: 31536000, // Cache for 1 year (31536000 seconds)
    formats: ['image/webp'],
  },
};

export default nextConfig;