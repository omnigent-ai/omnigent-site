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
          "https://diksk5m140cfbma7.public.blob.vercel-storage.com/mac/Omnigent-0.6.0-arm64.dmg",
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
      {
        source: "/download/windows",
        destination:
          "https://diksk5m140cfbma7.public.blob.vercel-storage.com/win/Omnigent%20Setup%200.6.0.exe",
        permanent: false,
      },
      {
        source: "/download/linux-deb",
        destination:
          "https://diksk5m140cfbma7.public.blob.vercel-storage.com/linux/omnigent-desktop-electron_0.6.0_amd64.deb",
        permanent: false,
      },
      {
        source: "/download/linux-appimage",
        destination:
          "https://diksk5m140cfbma7.public.blob.vercel-storage.com/linux/Omnigent-0.6.0.AppImage",
        permanent: false,
      },
      // Desktop auto-update feed. The manifests (latest-mac.yml /
      // latest-linux.yml / latest.yml) are served as static files from
      // public/_desktop/updates/; the binaries (~120 MB) live on the vercel
      // blob bucket and are 307-redirected here so electron-updater resolves
      // them relative to the omnigent.ai feed URL (keeps big binaries out of
      // the git repo / Next static dir).
      //
      // We redirect (not rewrite) because electron-updater issues multi-Range
      // requests for .blockmap-based delta downloads and resumable full
      // downloads; proxying that through an edge rewrite has historically
      // mangled the Range headers (returns the full body / 501 / wrong
      // content-type), so we point the client straight at the blob CDN, which
      // answers ranges natively. electron-updater's HttpExecutor follows up
      // to 10 redirects. `permanent: false` (307) so version-specific blob
      // URLs aren't cached long-term across releases.
      //
      // electron-updater fetches every artifact (and its .blockmap) by bare
      // filename from the feed base, so route each to its platform subdir by
      // the filename token. The .yml manifests don't match any of these, so
      // they fall through to the static files in public/.
      {
        source: "/_desktop/updates/:file(.*(?:mac\\.zip|\\.dmg).*)",
        destination:
          "https://diksk5m140cfbma7.public.blob.vercel-storage.com/mac/:file",
        permanent: false,
      },
      {
        source: "/_desktop/updates/:file(.*(?:\\.AppImage|\\.deb).*)",
        destination:
          "https://diksk5m140cfbma7.public.blob.vercel-storage.com/linux/:file",
        permanent: false,
      },
      {
        source: "/_desktop/updates/:file(.*\\.exe.*)",
        destination:
          "https://diksk5m140cfbma7.public.blob.vercel-storage.com/win/:file",
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
