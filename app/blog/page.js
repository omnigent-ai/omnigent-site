import PublicationIndex from "@/components/blog/PublicationIndex";
import { productionSiteUrl } from "@/lib/site";

export const metadata = {
  title: "Blog",
  description: "Product updates and feature deep-dives from the Omnigent team.",
  alternates: { canonical: `${productionSiteUrl}/blog` },
};

export default function BlogIndex() {
  return <PublicationIndex />;
}
