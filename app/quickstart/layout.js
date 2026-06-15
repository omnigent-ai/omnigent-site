import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import DocsSidebarFull from "@/components/DocsSidebarFull";
import CopyCodeButtons from "@/components/CopyCodeButtons";
import HeadingAnchors from "@/components/HeadingAnchors";
import PrevNextNav from "@/components/PrevNextNav";
import { DocsSidebarProvider } from "@/components/DocsSidebarContext";
import DocsSidebarToggle from "@/components/DocsSidebarToggle";
import TableOfContents from "@/components/TableOfContents";

export default function DocsLayout({ children }) {
  return (
    <DocsSidebarProvider>
      <Nav menuToggle={<DocsSidebarToggle />} />
      <div className="docs">
        <DocsSidebarFull />
        <article className="docs-main">
          {children}
          <PrevNextNav />
          <CopyCodeButtons />
          <HeadingAnchors />
        </article>
        <TableOfContents />
      </div>
      <Footer />
    </DocsSidebarProvider>
  );
}
