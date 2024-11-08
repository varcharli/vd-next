import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol:'http',
        hostname:'**',
        port:'',
        pathname:'**',
      },
      {
        protocol:'https',
        hostname:'**',
        port:'',
        pathname:'**',
      },
    ]
  },
  crossOrigin: 'anonymous',
  // webpack: (config, { isServer }) => {
  //   if (!isServer) {
  //     config.resolve.fallback = { fs: false };
  //   }
  //   return config;
  // },
};

export default nextConfig;
