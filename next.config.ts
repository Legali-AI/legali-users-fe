import type { NextConfig } from "next";

const isNetlifyBuild =
  process.env.NETLIFY === "true" || process.env.NODE_ENV === "production";

const nextConfig: NextConfig = {
  /* config options here */
  // Only use static export for production builds
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

  // Only apply experimental settings for production builds
  ...(isNetlifyBuild && {
    experimental: {
      esmExternals: false,
    },
  }),
};

export default nextConfig;
