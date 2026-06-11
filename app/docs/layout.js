import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import DocsSidebarFull from "@/components/DocsSidebarFull";

export default function DocsLayout({ children }) {
  return (
    <>
      <Nav />
      <div className="docs">
        <DocsSidebarFull />
        <article className="docs-main">{children}</article>
      </div>
      <Footer />
    </>
  );
}
