import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import DocsSidebar from "@/components/DocsSidebar";

export default function DocsLayout({ children }) {
  return (
    <>
      <Nav />
      <div className="docs">
        <DocsSidebar />
        <article className="docs-main">{children}</article>
      </div>
      <Footer />
    </>
  );
}
