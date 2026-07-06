import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ReleasesSidebar from "@/components/ReleasesSidebar";
import CopyCodeButtons from "@/components/CopyCodeButtons";
import HeadingAnchors from "@/components/HeadingAnchors";
import { getReleases } from "@/lib/releases";

// Reuses the docs grid (.docs / .docs-main) for consistent typography, but
// swaps the docs sidebar for a version list. Release versions are discovered
// from the app/releases/<x.y.z>/ folders at build time.
export default function ReleasesLayout({ children }) {
  const releases = getReleases();
  return (
    <>
      <Nav />
      <div className="docs">
        <ReleasesSidebar releases={releases} />
        <article className="docs-main" data-pagefind-body>
          {children}
          <CopyCodeButtons />
          <HeadingAnchors />
        </article>
      </div>
      <Footer />
    </>
  );
}
