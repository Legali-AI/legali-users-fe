import type { NextConfig } from "next";

const isNetlifyBuild = process.env.NETLIFY === "true";

const nextConfig: NextConfig = {
  /* config options here */
  ...(isNetlifyBuild && {
    output: "export",
    trailingSlash: true,
    skipTrailingSlashRedirect: true,
    distDir: "out",
  }),

  images: {
    // Only disable optimization for static export
    unoptimized: isNetlifyBuild,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        port: "",
        pathname: "/**",
      },
    ],
  },

  // Removed experimental.esmExternals as it's deprecated in Next.js 15
};

export default nextConfig;
