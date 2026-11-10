import { orchestrationAnswer } from "./orchestration-answer.js";
import {
  metaHarnessAnswer,
  contextualPolicyAnswer,
  handoffAnswer,
  schedulingAnswer,
  mobileAnswer,
  budgetsAnswer,
} from "./library-answers.js";

// One source for visible answers, structured data and generated LLM full text.
// Product source pin: d43340fec4e7d2d767f319d715e84aa82f4d1bc8.
// Release check: v0.19.0.

// Explicit editorial check date, not a build timestamp or a promise about main-only features.
export const answerCheckedDate = "2026-10-23";
export const answerCheckedVersion = "v0.19.0";
export const answerCheckedLabel = `Last checked against Omnigent ${answerCheckedVersion} · ${answerCheckedDate}`;

export const answerPath = (id) => `/answers/${id}`;
export const answers = [
  metaHarnessAnswer,
  contextualPolicyAnswer,
  orchestrationAnswer,
  handoffAnswer,
  schedulingAnswer,
  mobileAnswer,
  budgetsAnswer,
];

export function getAnswer(id) {
  const answer = answers.find((item) => item.id === id);
  if (!answer) throw new Error(`Unknown answer: ${id}`);
  return answer;
}

export function answerText(answer) {
  if (answer.sections) return richAnswerParts(answer).join("\n\n");
  return [
    answer.question,
    answer.checkedLabel ?? answerCheckedLabel,
    answer.answer,
    answer.explanation,
    ...(answer.steps ? ["Steps", ...answer.steps] : []),
    "Example",
    answer.example,
    "Boundaries",
    answer.boundary,
    "Read more",
    ...answer.links.map(({ label }) => label),
  ].join("\n\n");
}

export function answerMarkdown(answer, siteUrl) {
  if (answer.sections) {
    return [
      `# ${answer.question}`,
      answer.answer,
      answer.checkedLabel,
      ...answer.introduction.map((block) => blockMarkdown(block, siteUrl)),
      ...answer.sections.flatMap((section) => [
        `## ${section.question}`,
        ...section.blocks.map((block) => blockMarkdown(block, siteUrl)),
      ]),
    ].join("\n\n");
  }
  return [
    `# ${answer.question}`,
    answer.checkedLabel ?? answerCheckedLabel,
    answer.answer,
    answer.explanation,
    ...(answer.steps
      ? [
          "## Steps",
          answer.steps.map((step, i) => `${i + 1}. ${step}`).join("\n"),
        ]
      : []),
    "## Example",
    answer.example,
    "## Boundaries",
    answer.boundary,
    "## Read more",
    answer.links
      .map(({ href, label }) => `- [${label}](${new URL(href, siteUrl + "/")})`)
      .join("\n"),
  ].join("\n\n");
}

// Answers use the same typed blocks in HTML, schema and LLM Markdown.
export function answerBlockText(block) {
  switch (block.type) {
    case "paragraph":
    case "code":
      return block.text;
    case "links":
      return block.items.map(({ label }) => label).join("\n\n");
    case "list":
      return block.items.join("\n\n");
    case "table":
      return [block.headers, ...block.rows].flat().join("\n\n");
    default:
      throw new Error(`Unknown answer block: ${block.type}`);
  }
}

function richAnswerParts(answer) {
  return [
    answer.question,
    answer.answer,
    answer.checkedLabel,
    ...answer.introduction.map(answerBlockText),
    ...answer.sections.flatMap((section) => [
      section.question,
      ...section.blocks.map(answerBlockText),
    ]),
  ];
}

function blockMarkdown(block, siteUrl) {
  switch (block.type) {
    case "paragraph":
      return block.text;
    case "code":
      return `\`\`\`${block.language}\n${block.text}\n\`\`\``;
    case "links":
      return block.items
        .map(
          ({ label, href }) => `- [${label}](${new URL(href, siteUrl + "/")})`,
        )
        .join("\n");
    case "list":
      return block.items
        .map((item, i) => `${block.ordered ? `${i + 1}.` : "-"} ${item}`)
        .join("\n");
    case "table":
      return [block.headers, block.headers.map(() => "---"), ...block.rows]
        .map((row) => `| ${row.join(" | ")} |`)
        .join("\n");
    default:
      throw new Error(`Unknown answer block: ${block.type}`);
  }
}
