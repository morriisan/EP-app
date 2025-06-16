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
    // MINIMAL config: 640px for thumbnails + 1200px for dialogs + 1280px for high-DPI thumbnails
    deviceSizes: [640, 1200], 
    imageSizes: [], // Empty array = no additional image sizes
    minimumCacheTTL: 2678400, // Cache for 1 year
    formats: ['image/webp'],
    
    },
  };

export default nextConfig;