/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: "/docs/deploy/cloud-sandbox",
        destination: "/docs/deploy/cloud-sandbox-host",
        permanent: true,
      },
      {
        source: "/docs/deploy/cloud-runner",
        destination: "/docs/deploy/cloud-sandbox-host",
        permanent: true,
      },
      {
        source: "/docs/collaborate/overview",
        destination: "/docs/collaborate",
        permanent: true,
      },
      {
        source: "/download/mac",
        destination:
          "https://diksk5m140cfbma7.public.blob.vercel-storage.com/mac/Omnigent-0.1.1-arm64.dmg",
        permanent: false,
      },
      {
        source: "/download/mac/v0.1.1",
        destination:
          "https://diksk5m140cfbma7.public.blob.vercel-storage.com/mac/Omnigent-0.1.1-arm64.dmg",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: "/install.sh",
        destination:
          "https://raw.githubusercontent.com/omnigent-ai/omnigent/main/scripts/install_oss.sh",
      },
    ];
  },
};

export default nextConfig;
