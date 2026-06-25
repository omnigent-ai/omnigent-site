import Nav from "@/components/Nav";
import Footer from "@/components/Footer";

// The API reference lives outside app/docs/ on purpose: Scalar brings
// its own full-width three-panel layout and endpoint sidebar, which
// would fight the docs grid (16rem sidebar / content / TOC). Here it
// gets the site's Nav + Footer and the full width in between.
export default function ReferenceLayout({ children }) {
  return (
    <>
      <Nav />
      <div className="reference-shell">{children}</div>
      <Footer />
    </>
  );
}
