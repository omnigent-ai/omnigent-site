import { readFileSync, writeFileSync } from "node:fs";

const SITE_URL = "https://omnigent.ai";
const LASTMOD = "2026-06-23";

const docsRoutes = [
  {
    section: "Quickstart",
    href: "/quickstart/install",
    label: "Install Omnigent",
    source: "app/quickstart/install/page.mdx",
    description:
      "Requirements, installation, credentials, launching Debby, and adding the macOS app.",
    priority: "0.9",
  },
  {
    section: "Quickstart",
    href: "/quickstart/coding-agent",
    label: "Tutorial: Coding Agent",
    source: "app/quickstart/coding-agent/page.mdx",
    description:
      "Start a coding agent, give it a task, use comments, edit files, paste images, fork sessions, and add policies.",
    priority: "0.8",
  },
  {
    section: "Quickstart",
    href: "/quickstart/polly",
    label: "Tutorial: Polly",
    source: "app/quickstart/polly/page.mdx",
    description:
      "Run Polly, Omnigent's multi-AI coding orchestrator, and follow progress in the UI.",
    priority: "0.8",
  },
  {
    section: "Quickstart",
    href: "/quickstart/collaborate",
    label: "Tutorial: Collaborate",
    source: "app/quickstart/collaborate/page.mdx",
    description:
      "Deploy a shared server, connect from laptop and phone, share a session, and run a cloud sandbox host.",
    priority: "0.8",
  },
  {
    section: "Quickstart",
    href: "/quickstart/policies",
    label: "Tutorial: Contextual Policies",
    source: "app/quickstart/policies/page.mdx",
    description:
      "Add plain-language policies and see soft and hard limits in action.",
    priority: "0.8",
  },
  {
    section: "Agent Use Cases",
    href: "/docs/use/coding-agents",
    label: "Coding Agents",
    source: "app/docs/use/coding-agents/page.mdx",
    description: "Use Omnigent with coding agents and shared agent sessions.",
  },
  {
    section: "Agent Use Cases",
    href: "/docs/use/builtin-agents",
    label: "Built-in Multi-AI Agents",
    source: "app/docs/use/builtin-agents/page.mdx",
    description: "Overview of Omnigent's built-in multi-agent workflows.",
  },
  {
    section: "Agent Use Cases",
    href: "/docs/use/builtin-agents/polly",
    label: "Polly",
    source: "app/docs/use/builtin-agents/polly/page.mdx",
    description:
      "Multi-AI coding orchestrator, workflow, skills, and when to use it.",
  },
  {
    section: "Agent Use Cases",
    href: "/docs/use/builtin-agents/debby",
    label: "Debby",
    source: "app/docs/use/builtin-agents/debby/page.mdx",
    description: "Model debate agent, debate workflow, and when to use it.",
  },
  {
    section: "Agent Use Cases",
    href: "/docs/use/custom-agents",
    label: "Custom Agents",
    source: "app/docs/use/custom-agents/page.mdx",
    description:
      "Create custom agents in YAML and configure harnesses, models, prompts, skills, tools, and policies.",
  },
  {
    section: "Build Custom Agents",
    href: "/docs/build/harnesses",
    label: "Harnesses",
    source: "app/docs/build/harnesses/page.mdx",
    description:
      "Runtime harnesses for executing agent loops and switching between Claude, Codex, and other runtimes.",
  },
  {
    section: "Build Custom Agents",
    href: "/docs/build/models",
    label: "Models & Credentials",
    source: "app/docs/build/models/page.mdx",
    description:
      "Declare models and configure API keys, subscriptions, gateways, and Databricks credentials.",
  },
  {
    section: "Build Custom Agents",
    href: "/docs/build/prompts",
    label: "Prompts & Skills",
    source: "app/docs/build/prompts/page.mdx",
    description:
      "Shape agent behavior with system prompts and reusable skills.",
  },
  {
    section: "Build Custom Agents",
    href: "/docs/build/tools",
    label: "MCP & Tools",
    source: "app/docs/build/tools/page.mdx",
    description:
      "Add MCP servers, Python function tools, sub-agent tools, authentication, and tool inheritance.",
  },
  {
    section: "Interfaces",
    href: "/docs/interact/terminal",
    label: "Terminal",
    source: "app/docs/interact/terminal/page.mdx",
    description: "Start and manage sessions from the command line.",
  },
  {
    section: "Interfaces",
    href: "/docs/interact/web-ui",
    label: "Web UI",
    source: "app/docs/interact/web-ui/page.mdx",
    description:
      "Browser session management, file editing, code diffs, inline comments, multimodal input, and collaboration.",
  },
  {
    section: "Interfaces",
    href: "/docs/interact/mobile",
    label: "Mobile",
    source: "app/docs/interact/mobile/page.mdx",
    description: "Access Omnigent sessions from mobile devices.",
  },
  {
    section: "Interfaces",
    href: "/docs/interact/desktop",
    label: "Desktop App",
    source: "app/docs/interact/desktop/page.mdx",
    description:
      "Install and use the native desktop app with one or more servers.",
  },
  {
    section: "Collaboration And Deployment",
    href: "/docs/collaborate",
    label: "Pair Programming",
    source: "app/docs/collaborate/page.mdx",
    description: "Co-drive and fork shared live sessions.",
  },
  {
    section: "Collaboration And Deployment",
    href: "/docs/collaborate/auth",
    label: "Auth & SSO",
    source: "app/docs/collaborate/auth/page.mdx",
    description:
      "Built-in accounts, OIDC SSO, header-based auth, access control, and migration.",
  },
  {
    section: "Collaboration And Deployment",
    href: "/docs/deploy/overview",
    label: "Shared Server",
    source: "app/docs/deploy/overview/page.mdx",
    description:
      "Deploy the Omnigent server, runner, UI, and collaboration stack.",
  },
  {
    section: "Collaboration And Deployment",
    href: "/docs/deploy/database",
    label: "Database",
    source: "app/docs/deploy/database/page.mdx",
    description: "Postgres, SQLite, comparison, and first boot behavior.",
  },
  {
    section: "Collaboration And Deployment",
    href: "/docs/deploy/cloud-sandbox-host",
    label: "Cloud Sandbox Host",
    source: "app/docs/deploy/cloud-sandbox-host/page.mdx",
    description: "Configure server-managed or CLI cloud sandbox hosts.",
  },
  {
    section: "Policies And Sandboxing",
    href: "/docs/policies/overview",
    label: "Contextual Policies",
    source: "app/docs/policies/overview/page.mdx",
    description:
      "Policy concepts, enforcement targets, levels, and configuration.",
  },
  {
    section: "Policies And Sandboxing",
    href: "/docs/policies/builtin",
    label: "Builtin Policies",
    source: "app/docs/policies/builtin/page.mdx",
    description: "Safety and cost-control policies.",
  },
  {
    section: "Policies And Sandboxing",
    href: "/docs/policies/custom",
    label: "Custom Policies",
    source: "app/docs/policies/custom/page.mdx",
    description: "Write, register, and use custom policy functions.",
  },
  {
    section: "Policies And Sandboxing",
    href: "/docs/policies/os-sandbox",
    label: "OS Sandbox Config",
    source: "app/docs/policies/os-sandbox/page.mdx",
    description:
      "Filesystem, network, and environment restrictions for Omnibox sandboxing.",
  },
  {
    section: "Policies And Sandboxing",
    href: "/docs/omnibox",
    label: "Omnibox",
    source: "app/docs/omnibox/page.mdx",
    description:
      "Filesystem isolation, network isolation, and credential injection.",
  },
];

const optionalRoutes = [
  {
    href: "/",
    label: "Homepage",
    description: "Product overview and architecture.",
    priority: "1.0",
  },
  {
    href: "/faq",
    label: "FAQ",
    description:
      "Answers to common questions about Omnigent, models, custom agents, safety, Databricks, and production readiness.",
    priority: "0.6",
  },
];

const homepageSummary = `# Omnigent

Omnigent is a common layer over Claude Code, Codex, Pi, and custom agents. It lets teams swap or combine harnesses without rewriting agents, govern them with policies and OS sandboxing, and collaborate in real time on the same live session from terminal, web, desktop, mobile, or API interfaces.

Core capabilities:

- Built-in multi-AI agents, including Polly for coding orchestration and Debby for model debate.
- Custom agents written in YAML with configurable harnesses, models, prompts, skills, tools, and policies.
- Contextual policies for safety, spend caps, model routing, and risk-based escalation.
- OS sandboxing for filesystem, network, environment, and credential boundaries.
- Shared sessions, comments, forks, and multi-device collaboration.
- Deployable shared server with database, authentication, and cloud sandbox host options.`;

const faqSummary = `# FAQ

## What is Omnigent?

Omnigent is a framework that runs AI agents behind one interface. It wraps Claude Code, Codex, and Pi, plus custom agents written in YAML, and gives each one a server, UI, sandboxing, and policies.

## Which models can I use?

Bring your own API key, Claude or ChatGPT plan, OpenAI- or Anthropic-compatible gateway such as OpenRouter, LiteLLM, Ollama, Azure, or vLLM, or a Databricks workspace.

## How do I run my own agent?

Write a YAML file with a prompt and harness, then run \`omni run\` on it. See the custom agent guide.

## Is it safe to let an agent run on my machine?

Every command runs in an OS-level sandbox, and policies can pause, block, or cap what an agent does.

## Do I need Databricks?

No. Omnigent is open source and runs on your own machine and models. Databricks is one supported model provider.

## Is it ready for production?

No. Omnigent is alpha.`;

function absolute(href) {
  return `${SITE_URL}${href}`;
}

function cleanMdx(sourcePath) {
  const source = readFileSync(sourcePath, "utf8");
  const lines = source.split("\n");
  const kept = [];
  let skippingMetadata = false;

  for (const line of lines) {
    if (line.startsWith("import ")) continue;
    if (line.startsWith("export const metadata = pageMeta")) {
      skippingMetadata = true;
      continue;
    }
    if (skippingMetadata) {
      if (line.trim() === ");" || line.trim() === "});") {
        skippingMetadata = false;
      }
      continue;
    }
    kept.push(line);
  }

  return kept
    .join("\n")
    .replace(
      /<InstallCommandTabs \/>/g,
      [
        "```sh",
        "curl -fsSL https://omnigent.ai/install.sh | sh",
        "# or",
        "uv tool install omnigent",
        "# or",
        "pip install omnigent",
        "# or",
        "brew install omnigent-ai/tap/omnigent",
        "```",
      ].join("\n"),
    )
    .replace(
      /<MacDownloadButton \/>/g,
      "[Download macOS App](https://omnigent.ai/download/mac)",
    )
    .replace(
      /<ProviderKeyTable \/>/g,
      "Provider credentials can be configured for supported model providers using API keys, subscriptions, gateways, or Databricks profiles.",
    )
    .replace(
      /<GatewayLogos \/>/g,
      "Supported OpenAI- or Anthropic-compatible gateways include OpenRouter, LiteLLM, Ollama, Azure, vLLM, and similar providers.",
    )
    .replace(/^<ContentTabs[^\n]*>\n?/gm, "")
    .replace(/^<\/ContentTabs>\n?/gm, "")
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")
    .replace(/<img\s+([\s\S]*?)\/>/g, (_match, attrs) => {
      const src = attrs.match(/src="([^"]+)"/)?.[1];
      const alt = attrs.match(/alt="([^"]+)"/)?.[1] ?? "";
      return src ? `![${alt}](${src})` : "";
    })
    .replace(/\{" "\}/g, " ")
    .replace(/<Link href="([^"]+)">([^<]+)<\/Link>/g, "[$2]($1)")
    .replace(/<[^>\n]+>/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function buildLlmsTxt() {
  const sections = new Map();
  for (const route of docsRoutes) {
    if (!sections.has(route.section)) sections.set(route.section, []);
    sections.get(route.section).push(route);
  }

  const lines = [
    "# Omnigent",
    "",
    "> Omnigent is an open-source meta-harness for AI agents. It provides a common layer over Claude Code, Codex, Pi, and custom agents, with shared sessions, contextual policies, OS sandboxing, model and credential configuration, real-time collaboration, and multiple interfaces.",
    "",
    "Use this file to find the most relevant Omnigent documentation for coding agents, custom agents, deployment, collaboration, policies, sandboxing, and end-user interfaces.",
    "",
    `For a single-file expanded context, use [llms-full.txt](${absolute("/llms-full.txt")}).`,
    "",
  ];

  for (const [section, routes] of sections) {
    lines.push(`## ${section}`, "");
    for (const route of routes) {
      lines.push(
        `- [${route.label}](${absolute(route.href)}): ${route.description}`,
      );
    }
    lines.push("");
  }

  lines.push("## Optional", "");
  for (const route of optionalRoutes) {
    lines.push(
      `- [${route.label}](${absolute(route.href)}): ${route.description}`,
    );
  }
  lines.push(
    "- [GitHub repository](https://github.com/omnigent-ai/omnigent-site): Website source code.",
    `- [Sitemap](${absolute("/sitemap.xml")}): Full public route index.`,
    "",
  );

  return lines.join("\n");
}

function buildLlmsFullTxt() {
  const lines = [
    "# Omnigent Full Documentation",
    "",
    "> Expanded LLM context for Omnigent. This file contains the homepage summary and cleaned Markdown content for the primary quickstart and documentation pages listed in /llms.txt.",
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

  for (const route of docsRoutes) {
    lines.push(
      "---",
      "",
      `## ${absolute(route.href)}`,
      "",
      cleanMdx(route.source),
      "",
    );
  }

  lines.push("---", "", `## ${absolute("/faq")}`, "", faqSummary, "");

  return lines.join("\n").replace(/\n{4,}/g, "\n\n\n");
}

function buildSitemap() {
  const sitemapRoutes = [
    optionalRoutes.find((route) => route.href === "/"),
    ...docsRoutes,
    optionalRoutes.find((route) => route.href === "/faq"),
  ];

  const lines = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    "",
  ];

  for (const route of sitemapRoutes) {
    const priority =
      route.priority ?? (route.href.startsWith("/quickstart/") ? "0.8" : "0.7");
    lines.push(
      "  <url>",
      `    <loc>${absolute(route.href)}</loc>`,
      `    <lastmod>${LASTMOD}</lastmod>`,
      "    <changefreq>weekly</changefreq>",
      `    <priority>${priority}</priority>`,
      "  </url>",
      "",
    );
  }

  lines.push("</urlset>", "");
  return lines.join("\n");
}

writeFileSync("public/llms.txt", buildLlmsTxt());
writeFileSync("public/llms-full.txt", buildLlmsFullTxt());
writeFileSync("public/sitemap.xml", buildSitemap());
