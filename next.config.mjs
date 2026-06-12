/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/docs/deploy/cloud-sandbox",
        destination: "/docs/deploy/cloud-runner",
        permanent: true,
      },
      {
        source: "/docs/interact/overview",
        destination: "/docs/interact/terminal",
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/download/mac",
        destination:
          "https://diksk5m140cfbma7.public.blob.vercel-storage.com/mac/Omnigent-0.1.0-arm64.dmg",
      },
    ];
  },
};

export default nextConfig;
