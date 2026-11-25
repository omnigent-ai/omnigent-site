import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PrevNextNav from "@/components/PrevNextNav";

// The API reference lives outside app/docs/ on purpose: Scalar brings
// its own full-width three-panel layout and endpoint sidebar, which
// would fight the docs grid (16rem sidebar / content / TOC).
export default function ReferenceLayout({ children }) {
  return (
    <>
      <Nav />
      <div className="reference-shell">{children}</div>
      <div className="wrap">
        <PrevNextNav />
      </div>
      <Footer />
    </>
  );
}
