import createMDX from "@next/mdx";
import remarkGfm from "remark-gfm";

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Allow .mdx files to be treated as pages alongside .js.
  pageExtensions: ["js", "jsx", "md", "mdx"],
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
          "https://diksk5m140cfbma7.public.blob.vercel-storage.com/mac/Omnigent-0.5.0-arm64.dmg",
        permanent: false,
      },
      {
        source: "/download/mac/v0.1.1",
        destination:
          "https://diksk5m140cfbma7.public.blob.vercel-storage.com/mac/Omnigent-0.1.1-arm64.dmg",
        permanent: false,
      },
      {
        source: "/download/mac/v0.3.0",
        destination:
          "https://diksk5m140cfbma7.public.blob.vercel-storage.com/mac/Omnigent-0.3.0-arm64.dmg",
        permanent: false,
      },
      {
        source: "/download/mac/v0.5.0",
        destination:
          "https://diksk5m140cfbma7.public.blob.vercel-storage.com/mac/Omnigent-0.5.0-arm64.dmg",
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

const withMDX = createMDX({
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [],
  },
});

export default withMDX(nextConfig);
