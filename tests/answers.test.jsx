import { expect, test } from "bun:test";
import { readFileSync, readdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { renderToStaticMarkup } from "react-dom/server";
import { compile } from "@mdx-js/mdx";
import { AppRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import {
  answers,
  answerPath,
  answerText,
  answerMarkdown,
  answerCheckedDate,
  answerCheckedVersion,
  answerCheckedLabel,
  getAnswer,
} from "../lib/answers";
import { ORGANIZATION_ID } from "../lib/structured-data";
import { answerSchema, answerMetadata } from "../lib/answer-schema";
import nextConfig from "../next.config.mjs";
import AnswerPage, { AnswerArticle } from "../components/AnswerPage";
import Hub, { metadata as hubMetadata } from "../app/answers/page";
import Footer from "../components/Footer";
import JsonLd from "../components/JsonLd";
import sitemap from "../app/sitemap";
import { discoverPages } from "../lib/routes";
import { buildLlmsFiles } from "../scripts/generate-llms-files.mjs";
import { convertMdx } from "../scripts/llms/mdx-to-markdown.mjs";

const slugs = [
  "meta-harness",
  "contextual-policy",
  "orchestrate-codex-and-claude-code",
  "hand-off-a-session-to-a-teammate",
  "schedule-recurring-agent-tasks",
  "continue-a-session-on-your-phone",
  "set-spending-limits-for-coding-agents",
];
const normalize = (s) => s.replace(/\s+/g, " ").trim();
function text(html) {
  return normalize(
    html
      .replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "")
      .replace(/<[^>]*>/g, " ")
      .replace(/&#x27;/g, "'")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"')
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">"),
  );
}
// Mount the real Nav/DocSearch in the minimal Next context required for SSR.
// No module mocks or production behavior changes.
function renderPage(page) {
  return renderToStaticMarkup(
    <AppRouterContext.Provider value={{}}>{page}</AppRouterContext.Provider>,
  );
}
function jsonLd(html) {
  return JSON.parse(html.match(/<script[^>]*>([\s\S]*?)<\/script>/)[1]);
}

test("hub exposes exactly seven questions, one H1 and normal shell", () => {
  expect(answers.map(({ id }) => id)).toEqual(slugs);
  const html = renderPage(<Hub />);
  expect(html.match(/<h1\b/g)).toHaveLength(1);
  expect(html).toContain("<h1>Answers</h1>");
  expect(html).toContain("<header");
  expect(html).toContain("<footer");
  for (const answer of answers)
    expect(html).toContain(`href="${answerPath(answer.id)}"`);
  expect(hubMetadata.alternates.canonical).toBe("https://omnigent.ai/answers");
  const intro =
    "Common questions about running coding agents together, from what a meta-harness is to setting spending limits.";
  expect(html).toContain(intro);
  expect(hubMetadata.description).toBe(intro);
  expect(hubMetadata.openGraph.description).toBe(intro);
  expect(hubMetadata.twitter.description).toBe(intro);
  expect(answers.find(({ id }) => id === "meta-harness").question).toBe(
    "What is a meta-harness?",
  );
  expect(
    answers.find(({ id }) => id === "set-spending-limits-for-coding-agents")
      .question,
  ).toBe("How do I set spending limits for coding agents?");
  expect(
    readdirSync("app/answers")
      .filter((file) => file !== "page.js")
      .sort(),
  ).toEqual([...slugs].sort());
});

for (const answer of answers) {
  test(`${answer.id}: actual wrapper, initial HTML, one question H1, complete schema and same-source export`, async () => {
    const { default: Page, metadata } = await import(
      `../app/answers/${answer.id}/page.js`
    );
    const html = renderPage(<Page />);
    expect(html.match(/<h1\b/g)).toHaveLength(1);
    expect(html).toContain(`<h1>${answer.question}</h1>`);
    expect(html).toContain("<header");
    expect(html).toContain("<footer");
    expect(html).not.toContain("noindex");
    if (answer.evidence) expect(html).not.toContain(answer.evidence);
    const article = renderToStaticMarkup(<AnswerArticle answer={answer} />);
    const schema = jsonLd(article);
    expect(schema).toEqual(answerSchema(answer));
    expect(schema["@type"]).toBe("WebPage");
    expect(schema.mainEntity["@type"]).toBe("TechArticle");
    expect(schema.mainEntity.articleBody).toBe(answerText(answer));
    expect(text(article)).toBe(normalize(schema.mainEntity.articleBody));
    expect(metadata.alternates.canonical).toBe(
      `https://omnigent.ai${answerPath(answer.id)}`,
    );
    expect(answer.summary.length).toBeGreaterThanOrEqual(145);
    expect(answer.summary.length).toBeLessThanOrEqual(160);
    expect(metadata.description).toBe(answer.summary);
    expect(metadata.openGraph.description).toBe(answer.summary);
    expect(metadata.twitter.description).toBe(answer.summary);
    expect(schema.description).toBe(answer.answer);
    expect(schema.mainEntity.description).toBe(answer.answer);
    expect(schema.dateModified).toBe(answer.checkedDate ?? answerCheckedDate);
    expect(schema.mainEntity.dateModified).toBe(
      answer.checkedDate ?? answerCheckedDate,
    );
    expect(schema.mainEntity.author).toEqual({ "@id": ORGANIZATION_ID });
    expect(schema.mainEntity.publisher).toEqual({ "@id": ORGANIZATION_ID });
    expect(
      text(article).split(answer.checkedLabel ?? answerCheckedLabel),
    ).toHaveLength(2);
    expect(schema.url).toBe(metadata.alternates.canonical);
    expect(schema["@id"]).toBe(`${schema.url}#webpage`);
    expect(schema.mainEntity.mainEntityOfPage["@id"]).toBe(schema["@id"]);
    const markdown = answerMarkdown(answer, "https://omnigent.ai");
    expect(markdown.replace(/```[\s\S]*?```/g, "").match(/^# /gm)).toHaveLength(
      1,
    );
    expect(
      markdown.split(answer.checkedLabel ?? answerCheckedLabel),
    ).toHaveLength(2);
    for (const part of contentParts(answer)) {
      expect(text(article)).toContain(normalize(part));
      if (answer.sections) expect(markdown).toContain(part);
      else expect(markdown.split(part)).toHaveLength(2);
    }
    const routes = new Set(discoverPages().map(({ route }) => route));
    for (const { href } of contentLinks(answer)) {
      expect(article).toContain(`href="${href}"`);
      expect(markdown).toContain(
        new URL(href, "https://omnigent.ai").toString(),
      );
      if (href.startsWith("/"))
        expect(routes.has(href.split("#")[0])).toBe(true);
    }
  });
}

test("shared freshness uses an explicit editorial date and version label", () => {
  expect(answerCheckedDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  expect(
    new Date(`${answerCheckedDate}T00:00:00Z`).toISOString().slice(0, 10),
  ).toBe(answerCheckedDate);
  expect(answerCheckedVersion).toBe("v0.19.0");
  expect(answerCheckedDate).toBe("2026-10-23");
  expect(answerCheckedLabel).toBe(
    `Last checked against Omnigent ${answerCheckedVersion} · ${answerCheckedDate}`,
  );
});

test("scheduling gives UI and tool routes with their timezone and state controls", () => {
  const answer = getAnswer("schedule-recurring-agent-tasks");
  const prose = answerText(answer);
  expect(prose).toContain("Automations in the sidebar at /tasks");
  expect(prose).toContain("New automation");
  expect(prose).toContain("sys_scheduled_task_create");
  expect(prose).toContain(
    "sys_scheduled_task_update always require interactive approval",
  );
  expect(prose).toContain("default timezone is UTC");
  expect(prose).toContain("workspace without host_id is rejected");
  expect(prose).toContain("Omitting both is valid");
  expect(prose).toContain("fresh sandbox per firing");
  expect(prose).toContain(
    "Missed fires while the server is down are not replayed",
  );
  expect(prose).not.toContain("FREQ=WEEKLY");
  expect(prose).not.toContain("next_run_at");
  expect(prose).not.toContain("at least two occurrences");
  expect(prose).toContain("Active/Paused toggle");
  expect(answer.answer).not.toContain("no more often than once per hour");
  expect(prose).toContain(
    "prompting permission mode can leave an unattended run waiting",
  );
});

test("orchestration answers neutrally before app setup and keeps Polly as one late example", () => {
  const answer = getAnswer("orchestrate-codex-and-claude-code");
  expect(answer.answer.split(/\s+/).length).toBeGreaterThanOrEqual(40);
  expect(answer.answer.split(/\s+/).length).toBeLessThanOrEqual(60);
  expect(answer.answer).toContain("run separate sessions");
  expect(answer.answer).not.toContain("Omnigent");
  expect(answer.answer).not.toContain("Polly");
  expect(answer.summary.length).toBeGreaterThanOrEqual(150);
  expect(answer.summary.length).toBeLessThanOrEqual(160);
  const html = renderToStaticMarkup(<AnswerArticle answer={answer} />);
  expect(html).toMatch(/<h1>[^<]+<\/h1><p[^>]*>To orchestrate Codex/);
  const wholePage = renderPage(<AnswerPage answer={answer} />);
  const main = wholePage.match(/<main[^>]*>([\s\S]*?)<\/main>/)[1];
  expect(main).toContain('<nav aria-label="Answer library"');
  expect(text(main.match(/<p[^>]*>([\s\S]*?)<\/p>/)[1])).toBe(
    normalize(answer.answer),
  );
  expect(answer.sections).toHaveLength(4);
  for (const section of answer.sections) {
    expect(section.question).toEndWith("?");
    expect(section.blocks[0].type).toBe("paragraph");
  }
  const all = answerText(answer);
  // Current user-approved bound applies to all seven pages.
  expect(all.split(/\s+/).length).toBeGreaterThanOrEqual(500);
  expect(all.split(/\s+/).length).toBeLessThanOrEqual(850);
  expect(all.match(/\bPolly\b/g)).toHaveLength(1);
  expect(all.indexOf("Polly")).toBeGreaterThan(
    all.indexOf(answer.sections.find((s) => s.id === "comparison").question),
  );
  expect(all).toContain("sys_session_create");
  expect(all).toContain("sys_session_send");
  expect(all).toContain("sys_session_get_history");
  const coreExample = answer.sections
    .flatMap((s) => s.blocks)
    .find((b) => b.type === "code");
  expect(coreExample.text).not.toMatch(/polly/i);
  expect(all).not.toContain("before launching Polly");
  expect(all).toContain(
    "not create its worktree or automatically give Codex everything",
  );
  expect(all).toContain("not executed as a model-backed run");
  expect(all).toContain("Conductor");
  expect(all).toContain("Superset");
  expect(all).toContain("Codex subagents");
  const blocks = answer.sections.flatMap((s) => s.blocks);
  expect(blocks.find((b) => b.type === "table").rows).toHaveLength(5);
  expect(html).toContain('scope="col"');
  expect(html).toContain('scope="row"');
  const example = blocks.find((b) => b.type === "code");
  expect(example.text).toContain("git worktree add ../nav-labels");
  expect(example.text).not.toContain("omni ");
  expect(all).toContain(
    "omni claude and omni codex are optional launch routes",
  );
  expect(answerMarkdown(answer, "https://omnigent.ai")).toContain(example.text);
});

test("release-safe mobile and policy wording retain host and enforcement boundaries", () => {
  const mobile = getAnswer("continue-a-session-on-your-phone");
  expect(answerText(mobile)).not.toMatch(
    /hold sends|held.send|offline agent execution/i,
  );
  expect(mobile.answer).toContain("Keep the execution host online");
  expect(answerText(mobile)).toContain("execution host remains available");
  expect(answerText(mobile)).toContain(
    "does not wake it or move the process elsewhere",
  );
  expect(mobile.answer).toContain("does not move execution");
  const policy = getAnswer("contextual-policy");
  expect(policy.answer.match(/human approval/g)).toHaveLength(1);
  expect(answerText(policy)).toContain("A check after an action cannot undo");
  expect(answerText(policy)).toContain(
    "new user turns and tool calls at supported gates",
  );
});

test("handoff explicitly links the documented fork workflow and warns about permissioned host execution", () => {
  const answer = getAnswer("hand-off-a-session-to-a-teammate");
  const forkLink = contentLinks(answer).find(
    ({ label }) => label === "Sharing, co-driving, and conversation forks",
  );
  expect(forkLink.href).toBe("/docs/collaborate");
  expect(readFileSync("app/docs/collaborate/page.mdx", "utf8")).toMatch(
    /^## Fork$/m,
  );
  expect(answerText(answer)).toContain(
    "grant your trusted teammate Edit access",
  );
  expect(answer.answer).not.toContain("Omnigent");
  expect(answerText(answer)).toContain("the agent’s work still happens there");
  expect(answerText(answer)).toContain("policy, approval, and sandbox gates");
});

test("all answer routes are concrete sitemap entries", () => {
  const routes = new Set(discoverPages().map(({ route }) => route));
  const urls = sitemap().map(({ url }) => url);
  for (const href of ["/answers", ...slugs.map(answerPath)]) {
    expect(routes.has(href)).toBe(true);
    expect(
      sitemap().find(({ url }) => url === `https://omnigent.ai${href}`)
        .lastModified,
    ).toBe(
      answers.find((a) => answerPath(a.id) === href)?.checkedDate ??
        answerCheckedDate,
    );
    expect(
      urls.filter((url) => url === `https://omnigent.ai${href}`),
    ).toHaveLength(1);
  }
});

test("LLM files discover hub and six answers; only canonical answer entries own full prose", async () => {
  const { llmsTxt, llmsFullTxt, pages, warnings } = await buildLlmsFiles();
  expect(warnings).toEqual([]);
  for (const href of ["/answers", ...slugs.map(answerPath)]) {
    expect(llmsTxt).toContain(`](https://omnigent.ai${href})`);
    expect(llmsFullTxt).toContain(`\n## https://omnigent.ai${href}\n`);
  }
  const entries = llmsFullTxt.split("\n---\n");
  for (const answer of answers) {
    expect(llmsTxt).toContain(
      `](https://omnigent.ai${answerPath(answer.id)}): ${answer.summary}`,
    );
    const owner = `\n## https://omnigent.ai${answerPath(answer.id)}\n`;
    const entry = entries.find((section) => section.startsWith(owner));
    expect(entry).toBeDefined();
    expect(pages.find(({ href }) => href === answerPath(answer.id)).kind).toBe(
      "answer",
    );
    for (const part of contentParts(answer)) {
      expect(entry).toContain(part);
      if (!answer.sections) expect(llmsFullTxt.split(part)).toHaveLength(2);
      for (const other of entries.filter((section) => section !== entry))
        if (!answer.sections || part === answer.answer)
          expect(other).not.toContain(part);
    }
  }
});

test("footer links the answers hub; nav and sidebar do not", async () => {
  expect(renderToStaticMarkup(<Footer />)).toContain(
    '<a href="/answers">Answers</a>',
  );
  for (const file of ["components/Nav.js", "components/DocsSidebarFull.js"]) {
    expect(readFileSync(file, "utf8")).not.toContain("/answers");
  }
});

for (const override of ["https://preview.example", "https://tunnel.example"]) {
  test(`production identity and discovery stay stable under ${override}`, () => {
    const result = spawnSync(
      process.execPath,
      [
        "--eval",
        `
      import { answers } from "./lib/answers.js";
      import { answerMetadata, answerSchema } from "./lib/answer-schema.js";
      import { metadata as hub } from "./app/answers/page.js";
      import sitemap from "./app/sitemap.js";
      import { buildLlmsFiles } from "./scripts/generate-llms-files.mjs";
      const llms = await buildLlmsFiles();
      console.log(JSON.stringify({ hub, answers: answers.map(a => ({metadata: answerMetadata(a), schema: answerSchema(a)})),
        sitemap: sitemap(), llmsTxt: llms.llmsTxt, llmsFullTxt: llms.llmsFullTxt }));
    `,
      ],
      {
        encoding: "utf8",
        env: { ...process.env, NEXT_PUBLIC_SITE_URL: override },
        maxBuffer: 10 * 1024 * 1024,
      },
    );
    expect(result.status, result.stderr).toBe(0);
    const data = JSON.parse(result.stdout);
    expect(data.hub.alternates.canonical).toBe("https://omnigent.ai/answers");
    for (const [i, { metadata, schema }] of data.answers.entries()) {
      expect(metadata.alternates.canonical).toBe(
        `https://omnigent.ai${answerPath(slugs[i])}`,
      );
      expect(schema.url).toBe(metadata.alternates.canonical);
      expect(metadata.openGraph.images[0].url).toStartWith(override);
    }
    expect(
      JSON.stringify([
        data.answers.map(({ schema }) => schema),
        data.sitemap,
        data.llmsTxt,
        data.llmsFullTxt,
      ]),
    ).not.toContain(override);
  });
}

test("answer schema uses safe existing JSON escaping, including hostile prose", () => {
  const hostile = {
    ...answers[2],
    answer: '</script><script>alert("answer")</script>',
  };
  const schema = answerSchema(hostile);
  const html = renderToStaticMarkup(<JsonLd data={schema} />);
  expect(html.match(/<script/g)).toHaveLength(1);
  expect(html).toContain("\\u003c/script>");
  expect(jsonLd(html)).toEqual(schema);
});

test("new answer layout has a bounded reading width, mobile gutters and wrapping without hiding content", () => {
  const css = readFileSync("components/AnswerPage.module.css", "utf8");
  expect(css).toContain("max-width: 52rem");
  expect(css).toContain("padding: 1.75rem 1.5rem");
  expect(css).toContain("overflow-wrap: anywhere");
  expect(css).not.toMatch(
    /display:\s*none|visibility:\s*hidden|overflow:\s*hidden/,
  );
});

test("answers keep concise, specific limits without repeated disclaimers", () => {
  for (const answer of answers) {
    if (answer.boundary)
      expect(answer.boundary.split(/\s+/).length).toBeLessThanOrEqual(50);
    expect(answerText(answer)).not.toMatch(
      /Capabilities vary by harness|not mean identical capabilities|illustrative policy design/,
    );
  }
});

function contentParts(answer) {
  const atoms = (b) =>
    b.type === "links"
      ? b.items.map((i) => i.label)
      : b.type === "list"
        ? b.items
        : b.type === "table"
          ? [b.headers, ...b.rows].flat()
          : [b.text];
  return answer.sections
    ? [
        answer.answer,
        ...answer.introduction.flatMap(atoms),
        ...answer.sections.flatMap((s) => s.blocks.flatMap(atoms)),
      ]
    : [
        answer.answer,
        answer.explanation,
        ...(answer.steps ?? []),
        answer.example,
        answer.boundary,
      ];
}
function contentLinks(answer) {
  return answer.sections
    ? [...answer.introduction, ...answer.sections.flatMap((s) => s.blocks)]
        .filter((b) => b.type === "links")
        .flatMap((b) => b.items)
    : answer.links;
}

test("all seven rich drafts meet the approved editorial bounds and source freshness", () => {
  for (const answer of answers) {
    const words = answerText(answer).split(/\s+/).length;
    expect(words).toBeGreaterThanOrEqual(500);
    expect(words).toBeLessThanOrEqual(850);
    expect(answer.answer.split(/\s+/).length).toBeGreaterThanOrEqual(40);
    expect(answer.answer.split(/\s+/).length).toBeLessThanOrEqual(60);
    expect(answer.sections.length).toBeGreaterThanOrEqual(3);
    expect(answer.sections.length).toBeLessThanOrEqual(4);
    expect(answer.checkedDate).toBe("2026-10-23");
    expect(answer.checkedLabel).toContain("v0.19.0");
    expect(
      (answerText(answer).match(/\bPolly\b/g) ?? []).length,
    ).toBeLessThanOrEqual(1);
    for (const section of answer.sections)
      expect(section.question).toEndWith("?");
  }
});

test("budgets distinguish turn gates, root DENY, child ASK, pricing exceptions and billing", () => {
  const answer = getAnswer("set-spending-limits-for-coding-agents");
  const prose = answerText(answer);
  const example = answer.sections
    .flatMap((section) => section.blocks)
    .find((block) => block.type === "code");
  expect(example.language).toBe("yaml");
  expect(example.text).toContain(
    "handler: omnigent.policies.builtins.cost.cost_budget",
  );
  expect(example.text).toContain("expensive_models: []");
  expect(example.text).toContain("ask_thresholds_usd: [1.0, 2.5]");
  expect(prose).toContain(
    "both an omitted value and [] select an all-model stop",
  );
  expect(prose).toContain("does not automatically switch models");
  expect(prose).toContain("new user turns and tool calls");
  expect(prose).toContain("do not gate every internal model API call");
  expect(prose).toContain("original conversation) returns DENY");
  expect(prose).toContain("returns ASK to lift that child cap");
  expect(prose).toContain("does not lift an inherited root-session cap");
  expect(prose).toContain("continue untracked");
  expect(prose).toContain("not a provider billing limit");
  expect(prose).not.toContain("older comments");
  expect(prose).not.toContain("expensive_model_tiers");
});



test("neutral worktree example is parseable Bash without mandatory CLI launches", () => {
  const answer = getAnswer("orchestrate-codex-and-claude-code");
  const blocks = answer.sections
    .flatMap((s) => s.blocks)
    .filter((b) => b.type === "code");
  expect(blocks).toHaveLength(1);
  expect(blocks[0].language).toBe("bash");
  const result = spawnSync("bash", ["-n"], {
    input: blocks[0].text,
    encoding: "utf8",
  });
  expect(result.status, result.stderr).toBe(0);
  expect(blocks[0].text.match(/git worktree add/g)).toHaveLength(2);
  expect(answerMetadata(answer).title).toEqual({ absolute: answer.title });
  expect(answerMetadata(answer).openGraph.title).toBe(answer.title);
});

test("rich full prose appears once in HTML and the full LLM export, without treating repeated table labels as duplicate prose", async () => {
  const answer = getAnswer("orchestrate-codex-and-claude-code");
  const { llmsFullTxt } = await buildLlmsFiles();
  const html = text(renderToStaticMarkup(<AnswerArticle answer={answer} />));
  const prose = [
    answer.answer,
    ...[
      ...answer.introduction,
      ...answer.sections.flatMap((s) => s.blocks),
    ].flatMap((b) =>
      b.type === "paragraph" ? [b.text] : b.type === "list" ? b.items : [],
    ),
  ];
  for (const part of prose) {
    expect(llmsFullTxt.split(part)).toHaveLength(2);
    expect(html.split(normalize(part))).toHaveLength(2);
  }
});

test("production Node ESM imports build the rich LLM answer in memory", () => {
  const opener = getAnswer("orchestrate-codex-and-claude-code").answer;
  const script = `
    import { buildLlmsFiles } from "./scripts/generate-llms-files.mjs";
    const files = await buildLlmsFiles();
    console.log(JSON.stringify({ hasRichOpener: files.llmsFullTxt.includes(${JSON.stringify(opener)}) }));
  `;
  const result = spawnSync("node", ["--input-type=module", "--eval", script], {
    cwd: new URL("..", import.meta.url),
    encoding: "utf8",
  });
  expect(result.status, result.stderr).toBe(0);
  expect(JSON.parse(result.stdout)).toEqual({ hasRichOpener: true });
});

test("scheduled budgets disclose best-effort attachment separately from overshoot", () => {
  for (const id of [
    "schedule-recurring-agent-tasks",
    "set-spending-limits-for-coding-agents",
  ]) {
    const prose = answerText(getAnswer(id));
    expect(prose).toContain("attachment is best-effort");
    expect(prose).toContain("missing policy store or attachment error");
    expect(prose).toContain("without that cap");
    expect(prose).toContain("fired session");
    expect(prose).not.toContain(
      "Each fired session gets its own cost-budget policy",
    );
    expect(prose).not.toContain(
      "it attaches a fresh session cap for each firing",
    );
  }
});

test("cross-agent review identifies the actual uncommitted implementation", () => {
  const prose = answerText(getAnswer("orchestrate-codex-and-claude-code"));
  expect(prose).toContain(
    "For the navigation-label task, pass that worktree’s absolute path and base SHA",
  );
  expect(prose).toContain("working-tree diff against BASE");
  expect(prose).toContain("staged edits and untracked navigation files");
  expect(prose).not.toContain("Review task/nav-labels against its base commit");
});

test("scheduling distinguishes web timezone defaults from API-only settings", () => {
  const answer = getAnswer("schedule-recurring-agent-tasks");
  const prose = answerText(answer);
  expect(prose).toContain("web UI uses your browser’s timezone");
  expect(answer.answer).toContain("ask Omnigent in plain language");
  expect(prose).toContain("preserves an existing task’s timezone when editing");
  expect(prose).toContain(
    "For a different IANA timezone, use the API or agent tools",
  );
  expect(prose).toContain("Set max_cost_usd through the API or agent tools");
  expect(prose).toContain("the web dialog has no budget field");
  expect(prose).not.toContain("gaps below one hour");
  expect(prose).not.toContain(
    "Set an explicit IANA timezone rather than relying on an interface default",
  );
});

test("phone browser instructions configure LAN binding before creating the session", () => {
  const prose = answerText(getAnswer("continue-a-session-on-your-phone"));
  expect(prose).toContain("LAN interface before starting the session");
  expect(prose).toContain("omnigent server --host <LAN-IP>");
  expect(prose).toContain("default bind is 127.0.0.1");
  expect(prose).toContain("Non-loopback binds enable sign-in by default");
  expect(prose).toContain(
    "unless explicit authentication settings override it",
  );
  expect(prose).toContain(
    "Test access from your phone with the same account before starting work",
  );
});

test("answers lead directly, and every comparison includes Omnigent", () => {
  for (const answer of answers) {
    // Scheduling explicitly leads with the user-requested plain-language route.
    expect(answer.answer).not.toMatch(/Polly|best|seamless/i);
    if (answer.id !== "schedule-recurring-agent-tasks")
      expect(answer.answer).not.toContain("Omnigent");
    const general = answer.sections[0];
    expect(general.blocks[0].text).not.toMatch(/Omnigent|Polly/);
    const comparisonIndex = answer.sections.findIndex((s) =>
      [
        "alternatives",
        "permissions-comparison",
        "comparison",
        "handoff-options",
        "scheduler-options",
        "budget-options",
        "mobile-options",
      ].includes(s.id),
    );
    const fitIndex = answer.sections.findIndex((s) =>
      /Omnigent/.test(s.question),
    );
    expect(comparisonIndex).toBeGreaterThanOrEqual(0);
    expect(JSON.stringify(answer.sections[comparisonIndex])).toContain(
      "Omnigent",
    );
    expect(fitIndex).toBeGreaterThan(comparisonIndex);
  }
});

test("policy comparison credits contextual native hooks and cites primary documentation", () => {
  const answer = getAnswer("contextual-policy");
  const prose = answerText(answer);
  const comparison = answer.sections.find(
    (s) => s.id === "permissions-comparison",
  );
  const rows = comparison.blocks.find((b) => b.type === "table").rows;
  expect(rows.map((row) => row[0])).toEqual([
    "Claude Code",
    "Codex",
    "Cursor",
    "Omnigent",
  ]);
  expect(rows.find((row) => row[0] === "Omnigent")).toEqual([
    "Omnigent",
    "Policies can allow, deny, or request approval at supported integration gates.",
    "The same policy works across every harness.",
  ]);
  expect(prose).toContain(
    "the available context and action gates still depend on the integration",
  );
  expect(prose).toContain(
    "inaccurate to say these harnesses cannot make contextual decisions",
  );
  expect(prose).toContain(
    "prompt and agent hook handlers as parsed but skipped",
  );
  expect(prose).toContain(
    "Conversation labels are available in server-side context",
  );
  for (const host of ["code.claude.com", "learn.chatgpt.com", "cursor.com"])
    expect(
      contentLinks(answer).some(
        ({ href }) => new URL(href, "https://omnigent.ai").host === host,
      ),
    ).toBe(true);
});

test("orchestration includes UI setup, conditional CLI authentication, and optional terminal launch", () => {
  const prose = answerText(getAnswer("orchestrate-codex-and-claude-code"));
  expect(prose).toContain("during Omnigent setup");
  expect(prose).toContain("app or web UI");
  expect(prose).toContain(
    "Subscription sign-in may still require a CLI login step",
  );
  expect(prose).toContain("terminal launch commands are optional");
});

test("alternatives acknowledge native budgets, cloud continuation, and hosted scheduling", () => {
  const budgets = answerText(
    getAnswer("set-spending-limits-for-coding-agents"),
  );
  expect(budgets).toContain("optional enforced hard limit");
  expect(budgets).toContain("Alerts do not stop requests");
  expect(budgets).toContain("--max-budget-usd");
  const mobile = answerText(getAnswer("continue-a-session-on-your-phone"));
  expect(mobile).toContain("Claude Code Remote Control");
  expect(mobile).toContain("Codex Cloud");
  const schedule = answerText(getAnswer("schedule-recurring-agent-tasks"));
  expect(schedule).toContain("GitHub Actions");
  expect(schedule).toContain("Claude Code documents cloud scheduled tasks");
});

test("orchestration comparison explicitly identifies both-agent support without superiority claims", () => {
  const answer = getAnswer("orchestrate-codex-and-claude-code");
  const comparison = answer.sections.find(({ id }) => id === "comparison");
  const table = comparison.blocks.find(({ type }) => type === "table");
  for (const product of ["Conductor", "Superset"]) {
    const row = table.rows.find(([name]) => name === product);
    expect(row[1]).toContain("Runs Claude Code and Codex");
    expect(row.join(" ")).not.toMatch(
      /\b(best|better|superior|fastest|most capable)\b/i,
    );
  }
  expect(
    contentLinks(answer).some(
      ({ href }) => href === "https://www.conductor.build/docs",
    ),
  ).toBe(true);
  expect(
    contentLinks(answer).some(
      ({ href }) => href === "https://github.com/superset-sh/superset#readme",
    ),
  ).toBe(true);
});

test("budget policy flexibility distinguishes agent declarations from pooled allowances", () => {
  const prose = answerText(getAnswer("set-spending-limits-for-coding-agents"));
  expect(prose).toContain(
    "Contextual policies let you structure limits per session or delegated subtree",
  );
  expect(prose).toContain("user-wide daily or period budgets");
  expect(prose).toContain("does not create a single pooled allowance");
});
