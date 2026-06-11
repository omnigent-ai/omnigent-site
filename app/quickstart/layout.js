import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import DocsSidebar from "@/components/DocsSidebar";
import CopyCodeButtons from "@/components/CopyCodeButtons";

export default function DocsLayout({ children }) {
  return (
    <>
      <Nav />
      <div className="docs">
        <DocsSidebar />
        <article className="docs-main">
          {children}
          <CopyCodeButtons />
        </article>
      </div>
      <Footer />
    </>
  );
}
