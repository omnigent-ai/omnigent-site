import Link from "next/link";

export const metadata = { title: "Policies" };

export default function Page() {
  return (
    <>
      <h1>Policies</h1>

      <p>
        Policies are declarative guardrails that intercept agent actions and decide whether to
        allow, deny, or ask for approval. For the full reference (built-in policies, enforcement
        levels, and how to add them), see{" "}
        <Link href="/docs/policies/overview">Contextual Policies</Link>.
      </p>
    </>
  );
}
