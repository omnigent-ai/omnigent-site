import { pageMeta } from "@/lib/og";

// The install page is a Client Component and cannot export metadata itself,
// so the per-page social card lives in this server layout.
export const metadata = pageMeta("Install", "Install the Omnigent CLI with a single command — via the installer script, uv, pip, or Homebrew — and grab the macOS desktop app.", {
  eyebrow: "Quickstart",
  path: "/quickstart/install",
});

export default function InstallLayout({ children }) {
  return children;
}
