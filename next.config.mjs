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
    ];
  },
  async rewrites() {
    return [
      {
        source: "/install.sh",
        destination:
          "https://raw.githubusercontent.com/omnigent-ai/omnigent/main/scripts/install_oss.sh",
      },
      {
        source: "/download/mac",
        destination:
          "https://diksk5m140cfbma7.public.blob.vercel-storage.com/mac/Omnigent-0.1.0-arm64.dmg",
      },
    ];
  },
};

export default nextConfig;
