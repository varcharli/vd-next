import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname:'*.doubanio.com',
        port:'',
        pathname:'/**',
      },
      {
        protocol: 'https',
        hostname:'pics.dmm.co.jp',
        port:'',
        pathname:'/**',
      },
    ]
    // domains: [
    //   'localhost', 
    //   'img3.doubanio.com',
    //   'img1.doubanio.com',
    //   'img2.doubanio.com',
    //   'img9.doubanio.com',
    //   'img7.doubanio.com',
    //   'img8.doubanio.com',
    //   'img4.doubanio.com',
    //   'img5.doubanio.com',
    //   'img6.doubanio.com',
    //   'pics.dmm.co.jp',
    // ],
  },
  // webpack: (config, { isServer }) => {
  //   if (!isServer) {
  //     config.resolve.fallback = { fs: false };
  //   }
  //   return config;
  // },
};

export default nextConfig;
