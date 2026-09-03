import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CopyCodeButtons from "@/components/CopyCodeButtons";
import HeadingAnchors from "@/components/HeadingAnchors";
import TableOfContents from "@/components/TableOfContents";

// MLflow-style blog: a centered, full-width column (no docs sidebar). The index
// renders a featured card + card grid; an individual post renders as a centered
// article. Both share this shell. On an individual post (gated by the
// .blog-post-header the post renders) a sticky ToC floats in the right margin;
// it stays dormant on the index, whose card grid also contains h2/h3.
export default function BlogLayout({ children }) {
  return (
    <>
      <Nav />
      <main className="blog-main" data-pagefind-body>
        {children}
        <CopyCodeButtons />
        <HeadingAnchors
          containerSelector=".blog-main"
          requireSelector=".blog-post-header"
        />
      </main>
      <TableOfContents
        containerSelector=".blog-main"
        requireSelector=".blog-post-header"
        className="docs-toc blog-toc"
      />
      <Footer />
    </>
  );
}
