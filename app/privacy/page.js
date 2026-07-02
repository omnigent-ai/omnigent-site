import { pageMeta } from "@/lib/og";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { DATABRICKS_PRIVACY_URL, DATABRICKS_AUP_URL } from "@/components/links";

export const metadata = pageMeta(
  "Privacy Notice",
  "How Omnigent collects and processes personal information.",
  {
    eyebrow: "Legal",
    path: "/privacy",
  },
);

export default function Page() {
  return (
    <>
      <Nav />

      <main>
        <div className="wrap">
          <section className="section" style={{ paddingTop: "3.5rem" }}>
            <h1>Privacy Notice</h1>

            <p className="muted">
              Omnigent only collects or processes personal information from
              users of the Omnigent Managed Service, under the terms of
              users&rsquo; existing agreements with Databricks, including the{" "}
              <a href={DATABRICKS_PRIVACY_URL} target="_blank" rel="noreferrer">
                Databricks Privacy Notice
              </a>
              ,{" "}
              <a href={DATABRICKS_AUP_URL} target="_blank" rel="noreferrer">
                Acceptable Use Policy
              </a>
              , and other related terms. Users can use this app to connect with
              third-party services, which are not subject to Databricks legal
              terms, including the{" "}
              <a href={DATABRICKS_PRIVACY_URL} target="_blank" rel="noreferrer">
                Databricks Privacy Notice
              </a>
              .
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
