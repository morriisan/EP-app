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
  },
};

export default nextConfig;