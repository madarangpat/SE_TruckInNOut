/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "d29egpme33rzre.cloudfront.net",
      },
    ],
  },
};

export default nextConfig;
