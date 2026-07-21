import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import CopyCodeButtons from "@/components/CopyCodeButtons";
import HeadingAnchors from "@/components/HeadingAnchors";

// MLflow-style blog: a centered, full-width column (no docs sidebar). The index
// renders a featured card + card grid; an individual post renders as a centered
// article. Both share this shell.
export default function BlogLayout({ children }) {
  return (
    <>
      <Nav />
      <main className="blog-main" data-pagefind-body>
        {children}
        <CopyCodeButtons />
        <HeadingAnchors />
      </main>
      <Footer />
    </>
  );
}
