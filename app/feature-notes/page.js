import PublicationIndex from "@/components/blog/PublicationIndex";
import { productionSiteUrl } from "@/lib/site";

export const metadata = {
  title: "Feature notes",
  description: "Focused feature walkthroughs from the Omnigent team.",
  alternates: { canonical: `${productionSiteUrl}/feature-notes` },
};

export default function FeatureNotesIndex() {
  return <PublicationIndex notesSelected />;
}
