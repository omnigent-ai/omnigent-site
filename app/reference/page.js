import ApiReference from "@/components/ApiReference";
import { productionSiteUrl } from "@/lib/site";

export const metadata = {
  title: "API Reference",
  description:
    "REST API reference for the Omnigent server — create and drive sessions, manage agents, hosts, runners, contextual policies, comments, and session resources.",
  alternates: { canonical: `${productionSiteUrl}/reference` },
};

export default function ReferencePage() {
  return <ApiReference />;
}
