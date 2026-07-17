import { redirect } from "next/navigation";
import { getReleases } from "@/lib/releases";

export const metadata = {
  title: "Releases",
  description:
    "What's new in each version of Omnigent — release highlights, version by version.",
};

// /releases has no index of its own — it routes to the latest release post.
// getReleases() is newest-first, so [0] is the latest; fall back to the site
// root if no release has been published yet.
export default function ReleasesIndex() {
  const releases = getReleases();
  redirect(releases[0]?.href ?? "/");
}
