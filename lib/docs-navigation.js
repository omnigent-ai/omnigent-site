export const docsSections = [
  {
    title: "Get Started",
    pages: [
      { href: "/quickstart/install", label: "Install Omnigent" },
      { href: "/quickstart/coding-agent", label: "Tutorial: Coding Agent" },
      { href: "/quickstart/polly", label: "Tutorial: Polly (Multi-AI Coding)" },
      { href: "/quickstart/collaborate", label: "Tutorial: Collaborate" },
      { href: "/quickstart/policies", label: "Tutorial: Contextual Policies" },
    ],
  },
  {
    title: "Use Cases",
    pages: [],
    subsections: [
      {
        title: "Coding Agents",
        collapsed: false,
        href: "/docs/use/coding-agents",
        pages: [],
      },
      {
        title: "Built-in Multi-AI Agents",
        collapsed: true,
        href: "/docs/use/builtin-agents",
        pages: [
          { href: "/docs/use/builtin-agents/polly", label: "Polly" },
          { href: "/docs/use/builtin-agents/debby", label: "Debby" },
        ],
      },
      {
        title: "Custom Agents",
        collapsed: true,
        href: "/docs/use/custom-agents",
        pages: [
          { href: "/docs/build/models", label: "Models & Credentials" },
          { href: "/docs/build/routing", label: "Smart Routing" },
          { href: "/docs/build/prompts", label: "Prompts & Skills" },
          { href: "/docs/build/tools", label: "MCP & Tools" },
          { href: "/docs/build/scheduled-tasks", label: "Scheduled Tasks" },
        ],
      },
    ],
  },
  {
    title: "Harnesses",
    pages: [
      { href: "/docs/build/harnesses", label: "Overview" },
      {
        href: "/docs/build/harnesses/supported",
        label: "Supported Harnesses",
      },
      {
        href: "/docs/build/harnesses/configuration",
        label: "Configuration",
      },
      {
        href: "/docs/build/harnesses/community",
        label: "Community Harnesses",
      },
    ],
  },
  {
    title: "Interfaces",
    pages: [
      { href: "/docs/interact/terminal", label: "Terminal" },
      { href: "/docs/interact/web-ui", label: "Web UI" },
      { href: "/docs/interact/mobile", label: "Mobile" },
      { href: "/docs/interact/desktop", label: "Desktop App" },
      { href: "/docs/interact/slack", label: "Slack" },
    ],
  },
  {
    title: "Collaboration",
    pages: [
      { href: "/docs/collaborate", label: "Pair Programming" },
      { href: "/docs/deploy/overview", label: "Shared Server" },
      { href: "/docs/collaborate/auth", label: "Auth & SSO" },
      { href: "/docs/deploy/database", label: "Database" },
      { href: "/docs/deploy/credential-store", label: "Credential Store" },
      { href: "/docs/deploy/github-connect", label: "Connect GitHub" },
      { href: "/docs/deploy/databricks-connect", label: "Connect Databricks" },
      { href: "/docs/deploy/cloud-sandbox-host", label: "Cloud Sandbox Host" },
      {
        href: "/docs/deploy/community-sandbox-providers",
        label: "Community Sandbox Providers",
      },
      { href: "/docs/deploy/sandbox-profiles", label: "Sandbox Profiles" },
    ],
  },
  {
    title: "Contextual Policies",
    pages: [{ href: "/docs/policies/overview", label: "Overview" }],
    subsections: [
      {
        title: "Builtin Policies",
        collapsed: false,
        href: "/docs/policies/builtin",
        pages: [
          { href: "/docs/policies/builtin#safety", label: "Safety" },
          {
            href: "/docs/policies/builtin#cost-control",
            label: "Cost Control",
          },
        ],
      },
      {
        title: "Custom Policies",
        collapsed: false,
        href: "/docs/policies/custom",
        pages: [],
      },
    ],
  },
  {
    title: "Omnibox",
    pages: [{ href: "/docs/omnibox", label: "Overview" }],
  },
  {
    title: "Programmatic Usage",
    pages: [
      { href: "/docs/programmatic", label: "Overview" },
      { href: "/docs/programmatic/github-actions", label: "GitHub Actions" },
    ],
  },
  {
    title: "Reference",
    pages: [],
    subsections: [
      {
        title: "Configuration",
        collapsed: true,
        pages: [
          {
            href: "/docs/reference/configuration",
            label: "Server Settings",
          },
          {
            href: "/docs/reference/configuration/kubernetes",
            label: "Kubernetes Sandbox",
          },
          {
            href: "/docs/reference/configuration/os-sandbox",
            label: "OS Sandbox",
          },
          {
            href: "/docs/reference/configuration/cloud-sandbox",
            label: "Cloud Sandbox",
          },
          {
            href: "/docs/reference/configuration/routing",
            label: "Smart Routing",
          },
        ],
      },
      { title: "REST API", href: "/reference", pages: [] },
      {
        title: "Routing Provider API",
        href: "/docs/reference/routing-api",
        pages: [],
      },
      {
        title: "Usage Telemetry",
        href: "/docs/deploy/telemetry",
        pages: [],
      },
    ],
  },
];

export const docsPages = docsSections.flatMap(
  ({ title, pages, subsections }) => {
    const subsectionPages = (subsections ?? []).flatMap((subsection) =>
      subsection.href
        ? [
            { href: subsection.href, label: subsection.title },
            ...subsection.pages,
          ]
        : subsection.pages,
    );

    return [...pages, ...subsectionPages]
      .filter(({ href }) => !href.includes("#"))
      .map((page) => ({ ...page, section: title }));
  },
);
