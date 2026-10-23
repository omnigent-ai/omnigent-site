import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { convertMdx } from "../scripts/llms/mdx-to-markdown.mjs";
import GithubActionsExample from "../components/GithubActionsExample";

const escape = (text) =>
  text.replace(
    /[&<>"']/g,
    (character) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#x27;",
      })[character],
  );

test("example pages render complete maintained sources as escaped, copyable code", () => {
  for (const file of [
    "review.yml",
    "review-single.yml",
    "triage.yml",
    "validate_output.jq",
    "claude/config.yaml",
    "codex/config.yaml",
    "gateway/config.yaml",
  ]) {
    const source = readFileSync(`examples/github-actions/${file}`, "utf8");
    expect(renderToStaticMarkup(<GithubActionsExample file={file} />)).toBe(
      `<pre><code>${escape(source)}</code></pre>`,
    );
  }
});

test("LLM Markdown includes the same complete example sources", async () => {
  for (const file of ["review.yml", "triage.yml", "validate_output.jq"]) {
    const { markdown, warnings } = await convertMdx({
      source: `<GithubActionsExample file="${file}" />`,
      file: "example-fixture.mdx",
      siteUrl: "https://omnigent.ai",
    });
    expect(warnings).toEqual([]);
    expect(markdown).toContain(
      readFileSync(`examples/github-actions/${file}`, "utf8"),
    );
  }
});

test("credential YAML stays nested in source and exported Markdown", async () => {
  const file = "app/docs/programmatic/github-actions/page.mdx";
  const source = readFileSync(file, "utf8");
  const { markdown, warnings } = await convertMdx({
    source,
    file,
    siteUrl: "https://omnigent.ai",
  });
  expect(warnings).toEqual([]);
  for (const text of [source, markdown]) {
    const credentials = text
      .split("### Configure credentials")[1]
      .split("### Choose an agent")[0];
    const blocks = [...credentials.matchAll(/```yaml\n([\s\S]*?)\n```/g)];
    expect(blocks).toHaveLength(2);
    for (const [index, block] of blocks.entries()) {
      const provider = index === 0 ? "ANTHROPIC_API_KEY" : "OPENAI_API_KEY";
      const model = index === 0 ? "CLAUDE_MODEL" : "CODEX_MODEL";
      const parsed = Bun.YAML.parse(block[1]);
      expect(Object.keys(parsed)).toEqual(["env"]);
      expect(parsed.env).toEqual({
        [provider]: "${{ secrets." + provider + " }}",
        [model]: "${{ vars." + model + " }}",
      });
    }
  }
  expect(source).not.toContain("MODEL_API_KEY");
  expect(source).not.toContain("executor.auth");
  const task = source
    .split("### Run a task")[1]
    .split("## Connect inputs and outputs")[0];
  expect(task).toContain('omnigent run --harness codex --model "$CODEX_MODEL"');
  expect(task).not.toContain("--no-session \\");
  expect(source).toContain(
    "withholds GitHub write tokens from the agent's environment and posts the results itself.",
  );
  expect(source).toContain(
    "Use the CLI versions listed in the [Omnigent harness manifest]",
  );
});
