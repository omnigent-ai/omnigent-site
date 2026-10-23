// Generates public/llms.txt and public/llms-full.txt.
//
// Runs before `next build` (and `next dev`); the outputs are gitignored. See
// docs in the PR that introduced this for the storage decision.
//
// Inclusion rules (nothing here lists individual pages, so a new page.mdx is
// picked up automatically):
//   - every app/quickstart/**/page.mdx and app/docs/**/page.mdx
//   - every blog post from getBlogPosts() (lib/blog.js)
//   - every release from getReleases() (lib/releases.js)
//   - plus the homepage and FAQ summaries below (those pages are JSX, not MDX)
// llms.txt links docs/quickstart in full and keeps blog posts and releases
// under "Optional"; llms-full.txt contains the full text of everything.
//
// Output is deterministic: no timestamps, network, or LLM calls, and a stable
// sort. It fails (non-zero exit) only on real breakage: a missing source file
// or MDX that does not parse.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";
import { getBlogPosts } from "../lib/blog.js";
import { getReleases } from "../lib/releases.js";
import { discoverPages } from "../lib/routes.js";
import { productionSiteUrl } from "../lib/site.js";
import { convertMdx } from "./llms/mdx-to-markdown.mjs";

const SITE_URL = productionSiteUrl;

// Optional overrides. Everything is derived from the filesystem; this only
// controls how sections are labelled and ordered. A page whose route matches
// no rule still appears, in a section named after its first path segments.
// First matching prefix wins.
const SECTION_RULES = [
  { prefix: "/quickstart", title: "Quickstart" },
  { prefix: "/docs/use", title: "Agent Use Cases" },
  { prefix: "/docs/build/harnesses", title: "Harnesses" },
  { prefix: "/docs/build", title: "Build Custom Agents" },
  { prefix: "/docs/interact", title: "Interfaces" },
  { prefix: "/docs/collaborate", title: "Collaboration And Deployment" },
  { prefix: "/docs/deploy", title: "Collaboration And Deployment" },
  { prefix: "/docs/policies", title: "Policies" },
  { prefix: "/docs/omnibox", title: "Omnibox" },
  { prefix: "/docs/programmatic", title: "Programmatic Usage" },
  { prefix: "/docs/reference", title: "Reference" },
];
const RELEASES_LISTED_FIRST = 5; // newest releases get a description in llms.txt

const homepageSummary = `# Omnigent

Omnigent is a common layer over Claude Code, Codex, Pi, and custom agents. It lets teams swap or combine harnesses without rewriting agents, govern them with policies and secure sandboxes, and collaborate in real time on the same live session from terminal, web, desktop, mobile, or API interfaces.

Core capabilities:

- Built-in multi-AI agents, including Polly for coding orchestration and Debby for model debate.
- Custom agents written in YAML with configurable harnesses, models, prompts, skills, tools, and policies.
- Contextual policies for safety, spend caps, model routing, and risk-based escalation.
- Secure sandboxes for any agent: local OS sandboxing on Linux and macOS for filesystem, network, environment, and credential boundaries, or remote cloud sandbox hosts.
- Shared sessions, comments, forks, and multi-device collaboration.
- Deployable shared server with database, authentication, and cloud sandbox host options.`;

const faqSummary = `# FAQ

## What is Omnigent?

Omnigent is a framework that runs AI agents behind one interface. It wraps Claude Code, Codex, and Pi, plus custom agents written in YAML, and gives them a shared server and UI, with configurable sandboxing and policies.

## Which models can I use?

Bring your own API key, Claude or ChatGPT plan, OpenAI- or Anthropic-compatible gateway such as OpenRouter, LiteLLM, Ollama, Azure, or vLLM, or a Databricks workspace.

## How do I run my own agent?

Write a YAML file with a prompt and harness, then run \`omni run\` on it. See the custom agent guide.

## Is it safe to let an agent run on my machine?

Omnigent can run agents in a local OS sandbox or a remote [cloud sandbox](${absolute("/docs/deploy/cloud-sandbox-host")}). On Linux and macOS, the [OS sandbox](${absolute("/docs/omnibox")}) restricts filesystem and network access and brokers credentials without exposing them to the agent. Policies can also pause, block, or cap what an agent does.

## Do I need Databricks?

No. Omnigent is open source and runs on your own machine and models. Databricks is one supported model provider.

## Is it ready for production?

Teams use Omnigent for real work today. It also moves quickly: releases ship often and can include breaking changes, which recent release notes call out. Pin a version and read the release notes before you upgrade.`;

const compare = (a, b) => (a < b ? -1 : a > b ? 1 : 0);

function absolute(href) {
  return new URL(href, `${SITE_URL}/`).toString();
}

function titleCase(segment) {
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function sectionFor(route) {
  const rule = SECTION_RULES.find(
    ({ prefix }) => route === prefix || route.startsWith(`${prefix}/`),
  );
  if (rule) return { title: rule.title, rank: SECTION_RULES.indexOf(rule) };
  const [, first, second] = route.split("/");
  const title =
    first === "docs" && second ? titleCase(second) : titleCase(first);
  return { title, rank: SECTION_RULES.length };
}

function truncate(text, max) {
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  const sentence = cut.match(/^(.*[.!?])\s/s);
  return sentence && sentence[1].length > max / 2
    ? sentence[1]
    : `${cut.slice(0, cut.lastIndexOf(" "))}\u2026`;
}

async function loadPage({ href, file, fallbackTitle }) {
  if (!existsSync(file)) {
    throw new Error(`llms: ${href} has no source file at ${file}`);
  }
  const converted = await convertMdx({
    source: readFileSync(file, "utf8"),
    file,
    siteUrl: SITE_URL,
  });
  return {
    href,
    file,
    title: converted.title ?? converted.h1 ?? fallbackTitle,
    description: converted.description ?? converted.firstParagraph ?? "",
    h1: converted.h1,
    markdown: converted.markdown,
    warnings: converted.warnings,
  };
}

/**
 * Builds both files in memory.
 * @returns {Promise<{ llmsTxt: string, llmsFullTxt: string, pages: object[] }>}
 */
export async function buildLlmsFiles() {
  // 1. Docs and quickstart: auto-discovered from the filesystem.
  const docs = [];
  for (const { route, file } of discoverPages()) {
    if (!file.endsWith(".mdx")) continue;
    if (!(route.startsWith("/quickstart/") || route.startsWith("/docs/"))) {
      continue;
    }
    const page = await loadPage({
      href: route,
      file,
      fallbackTitle: titleCase(route.split("/").at(-1)),
    });
    docs.push({ ...page, kind: "docs", section: sectionFor(route) });
  }
  docs.sort(
    (a, b) =>
      a.section.rank - b.section.rank ||
      compare(a.section.title, b.section.title) ||
      compare(a.href, b.href),
  );

  // 2. Blog posts and releases from their existing discovery helpers.
  const blog = [];
  for (const post of [...getBlogPosts()].sort(
    (a, b) => compare(b.date ?? "", a.date ?? "") || compare(a.slug, b.slug),
  )) {
    const page = await loadPage({
      href: post.href,
      file: `app/blog/${post.slug}/page.mdx`,
      fallbackTitle: post.title,
    });
    blog.push({
      ...page,
      kind: "blog",
      date: post.date,
      category: post.category,
    });
  }
  const releases = [];
  for (const release of getReleases()) {
    const page = await loadPage({
      href: release.href,
      file: `app/releases/${release.version}/page.mdx`,
      fallbackTitle: `v${release.version}`,
    });
    releases.push({
      ...page,
      kind: "release",
      description: release.description,
      date: release.date,
      version: release.version,
    });
  }

  const pages = [...docs, ...blog, ...releases];
  const warnings = pages.flatMap((page) => page.warnings);
  for (const warning of warnings) console.warn(`llms: warning: ${warning}`);

  return {
    llmsTxt: buildLlmsTxt({ docs, blog, releases }),
    llmsFullTxt: buildLlmsFullTxt({ docs, blog, releases }),
    pages,
    warnings,
  };
}

function link(page, description = page.description) {
  const text = description
    ? `: ${description.replace(/\s+/g, " ").trim()}`
    : "";
  return `- [${page.title}](${absolute(page.href)})${text}`;
}

function buildLlmsTxt({ docs, blog, releases }) {
  const lines = [
    "# Omnigent",
    "",
    "> Omnigent is an open-source meta-harness for AI agents. It provides a common layer over Claude Code, Codex, Pi, and custom agents, with shared sessions, contextual policies, local and cloud sandboxing, model and credential configuration, real-time collaboration, and multiple interfaces.",
    "",
    "Use this file to find the most relevant Omnigent documentation for coding agents, custom agents, deployment, collaboration, policies, sandboxing, and end-user interfaces.",
    "",
    `For a single-file expanded context, use [llms-full.txt](${absolute("/llms-full.txt")}).`,
    "",
  ];

  let current = null;
  for (const page of docs) {
    if (page.section.title !== current) {
      if (current !== null) lines.push("");
      current = page.section.title;
      lines.push(`## ${current}`, "");
    }
    lines.push(link(page, truncate(page.description, 220)));
  }
  lines.push("");

  lines.push("## Optional", "");
  lines.push(
    `- [Homepage](${absolute("/")}): Product overview and architecture.`,
    `- [FAQ](${absolute("/faq")}): Answers to common questions about Omnigent, models, custom agents, safety, Databricks, and production readiness.`,
    `- [Feature notes](${absolute("/feature-notes")}): Short posts spotlighting individual Omnigent features.`,
  );
  lines.push("", "### Blog", "");
  for (const post of blog)
    lines.push(link(post, truncate(post.description, 220)));
  lines.push(
    "",
    `### Releases`,
    "",
    `Release notes for all ${releases.length} versions are in [llms-full.txt](${absolute("/llms-full.txt")}); the newest are summarized here.`,
    "",
  );
  releases.forEach((release, i) => {
    const date = release.date ? `Released ${release.date}. ` : "";
    const summary =
      i < RELEASES_LISTED_FIRST ? truncate(release.description, 160) : "";
    lines.push(
      `- [${release.title}](${absolute(release.href)}): ${`${date}${summary}`.trim()}`,
    );
  });
  lines.push(
    "",
    "### Other",
    "",
    "- [GitHub repository](https://github.com/omnigent-ai/omnigent-site): Website source code.",
    `- [Sitemap](${absolute("/sitemap.xml")}): Full public route index.`,
    "",
  );
  return lines.join("\n");
}

function fullEntry(page) {
  const body = [];
  if (!page.h1) {
    body.push(`# ${page.title}`);
    if (page.kind === "blog") {
      const byline = [page.date && `Published ${page.date}`, page.category]
        .filter(Boolean)
        .join(" \u00b7 ");
      if (byline) body.push(`_${byline}_`);
    }
  }
  body.push(page.markdown);
  return ["---", "", `## ${absolute(page.href)}`, "", body.join("\n\n"), ""];
}

function buildLlmsFullTxt({ docs, blog, releases }) {
  const lines = [
    "# Omnigent Full Documentation",
    "",
    "> Expanded LLM context for Omnigent. This file contains the homepage summary and cleaned Markdown content for every quickstart, documentation, blog, and release page listed in /llms.txt.",
    "",
    `Source: ${SITE_URL}`,
    "Generated from: https://github.com/omnigent-ai/omnigent-site",
    "",
    "---",
    "",
    `## ${absolute("/")}`,
    "",
    homepageSummary,
    "",
  ];
  for (const page of docs) lines.push(...fullEntry(page));
  lines.push("---", "", `## ${absolute("/faq")}`, "", faqSummary, "");
  for (const page of [...blog, ...releases]) lines.push(...fullEntry(page));
  return lines.join("\n");
}

export async function writeLlmsFiles(outDir = "public") {
  const { llmsTxt, llmsFullTxt, pages } = await buildLlmsFiles();
  mkdirSync(outDir, { recursive: true });
  writeFileSync(path.join(outDir, "llms.txt"), llmsTxt);
  writeFileSync(path.join(outDir, "llms-full.txt"), llmsFullTxt);
  return { llmsTxt, llmsFullTxt, pages };
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? "").href) {
  try {
    const { llmsTxt, llmsFullTxt, pages } = await writeLlmsFiles();
    console.log(
      `llms: wrote public/llms.txt (${llmsTxt.length} bytes) and public/llms-full.txt (${llmsFullTxt.length} bytes) from ${pages.length} pages`,
    );
  } catch (error) {
    console.error(`llms: ${error.message}`);
    process.exit(1);
  }
}
