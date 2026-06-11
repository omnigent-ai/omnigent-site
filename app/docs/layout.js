import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import DocsSidebarFull from "@/components/DocsSidebarFull";
import CopyCodeButtons from "@/components/CopyCodeButtons";

export default function DocsLayout({ children }) {
  return (
    <>
      <Nav />
      <div className="docs">
        <DocsSidebarFull />
        <article className="docs-main">
          {children}
          <CopyCodeButtons />
        </article>
      </div>
      <Footer />
    </>
  );
}
