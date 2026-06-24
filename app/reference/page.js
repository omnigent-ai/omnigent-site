import ApiReference from "@/components/ApiReference";

export const metadata = {
  title: "API Reference",
  description:
    "REST API reference for the Omnigent server — create and drive sessions, manage agents, hosts, runners, contextual policies, comments, and session resources.",
};

export default function ReferencePage() {
  return <ApiReference />;
}
