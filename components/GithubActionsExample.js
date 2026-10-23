import fs from "node:fs";
import path from "node:path";

// Server-render the maintained example source; no second copy in the docs.
export default function GithubActionsExample({ file }) {
  const source = fs.readFileSync(
    path.join(process.cwd(), "examples/github-actions", file),
    "utf8",
  );
  return (
    <pre>
      <code>{source}</code>
    </pre>
  );
}
