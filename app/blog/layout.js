import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import BlogSidebar from "@/components/BlogSidebar";
import CopyCodeButtons from "@/components/CopyCodeButtons";
import HeadingAnchors from "@/components/HeadingAnchors";
import { getBlogPosts } from "@/lib/blog";

// Reuses the docs grid (.docs / .docs-main) for consistent typography, but
// swaps the docs sidebar for a post list. Posts are discovered from the
// app/blog/<slug>/ folders at build time — mirrors the releases layout.
export default function BlogLayout({ children }) {
  const posts = getBlogPosts();
  return (
    <>
      <Nav />
      <div className="docs">
        <BlogSidebar posts={posts} />
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
