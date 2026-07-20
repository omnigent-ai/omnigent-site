import { pageMeta } from "@/lib/og";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import {
  DATABRICKS_PRIVACY_URL,
  DATABRICKS_TERMS_URL,
  DATABRICKS_AUP_URL,
  DATABRICKS_FE_TERMS_URL,
  DATABRICKS_FE_AUP_URL,
} from "@/components/links";

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
              Omnigent collects anonymized usage data (telemetry) by default.
              This data contains no sensitive or personally identifiable
              information. If you&apos;re using Omnigent through a managed
              service or distribution, please consult your managed service
              agreement to determine any data collection that may impact your
              use of the service. To opt out, follow our instructions in{" "}
              <a href="/docs/deploy/telemetry">Usage Telemetry</a>.
            </p>

            <p className="muted">
              Users can use this app to connect with non-Databricks third-party
              services, which are not subject to Databricks terms and may be
              subject to their own privacy terms or practices.
            </p>

            <p className="muted">
              Omnigent only collects or processes personal information from
              Databricks users under the terms of users&rsquo; existing
              agreements with Databricks. If you are using Omnigent as a
              Databricks-managed service, your use of this app is subject to the
              applicable terms below:
            </p>

            <ul className="muted">
              <li>
                Databricks Free Edition:{" "}
                <a
                  href={DATABRICKS_FE_TERMS_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  Terms
                </a>
                ,{" "}
                <a
                  href={DATABRICKS_PRIVACY_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  Privacy Notice
                </a>
                ,{" "}
                <a
                  href={DATABRICKS_FE_AUP_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  Acceptable Use Policy
                </a>
              </li>
              <li>
                Databricks:{" "}
                <a href={DATABRICKS_TERMS_URL} target="_blank" rel="noreferrer">
                  Terms
                </a>
                ,{" "}
                <a
                  href={DATABRICKS_PRIVACY_URL}
                  target="_blank"
                  rel="noreferrer"
                >
                  Privacy Notice
                </a>
                ,{" "}
                <a href={DATABRICKS_AUP_URL} target="_blank" rel="noreferrer">
                  Acceptable Use Policy
                </a>
              </li>
            </ul>

            <p className="muted">
              Azure Databricks customers may refer to their Microsoft Azure
              Databricks terms.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
