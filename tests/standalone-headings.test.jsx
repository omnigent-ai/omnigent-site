import { expect, test } from "bun:test";
import { readFileSync } from "node:fs";
import { renderToStaticMarkup } from "react-dom/server";
import { AnswerArticle } from "../components/AnswerPage";
import { answers, answerMarkdown, answerText } from "../lib/answers";
import { answerSchema } from "../lib/answer-schema";
import { buildLlmsFiles } from "../scripts/generate-llms-files.mjs";
import expected from "./fixtures/standalone-headings.json";

const visibleText = (html) =>
  html
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"');

test("standalone heading coverage includes all seven active answers and all 25 sections", () => {
  expect(Object.keys(expected)).toEqual(answers.map((answer) => answer.id));
  expect(Object.values(expected).flat()).toHaveLength(25);
});

for (const answer of answers) {
  test(`${answer.id}: every section asks a standalone question, opens with an answer, and retains its anchor`, () => {
    const sections = expected[answer.id];
    expect(answer.sections).toHaveLength(sections.length);
    const html = renderToStaticMarkup(<AnswerArticle answer={answer} />);
    const headings = [
      ...html.matchAll(/<h([23]) id="([^"]+)">([^<]+)<\/h\1>/g),
    ];
    expect(
      headings.map(([, level, id, question]) => [
        level,
        id,
        visibleText(question),
      ]),
    ).toEqual(sections.map(({ id, question }) => ["2", id, question]));
    expect(html.match(/<h[23]\b/g)).toHaveLength(sections.length);
    expect(new Set(sections.map(({ id }) => id)).size).toBe(sections.length);
    const markdown = answerMarkdown(answer, "https://omnigent.ai");
    expect(markdown.match(/^#{2,3} .+$/gm)).toEqual(
      sections.map(({ question }) => `## ${question}`),
    );
    const body = answerSchema(answer).mainEntity.articleBody;
    expect(body).toBe(answerText(answer));
    for (const [i, { id, question, opening }] of sections.entries()) {
      const section = answer.sections[i];
      expect(section.id).toBe(id);
      expect(section.question).toBe(question);
      expect(question).toMatch(/^(What|When|How|Should|Which) .+\?$/);
      expect(question).not.toMatch(
        /both agents|the same session|the other’s|what .*remain/i,
      );
      expect(section.blocks[0].type).toBe("paragraph");
      expect(section.blocks[0].text.startsWith(opening)).toBe(true);
      // The direct answer is the first visible block after the heading, not a
      // later paragraph or text hidden in schema. Fixtures list the expected openers.
      expect(visibleText(html)).toContain(
        `<section aria-labelledby="${id}"><h2 id="${id}">${question}</h2><p>${opening}`,
      );
      expect(body).toContain(`${question}\n\n${section.blocks[0].text}`);
      expect(markdown).toContain(`## ${question}\n\n${section.blocks[0].text}`);
    }
  });
}

test("generated full LLM export uses every updated question and immediate direct answer", async () => {
  // Build the strings in memory only: no build or generated public-file writes.
  const { llmsFullTxt, warnings } = await buildLlmsFiles();
  expect(warnings).toEqual([]);
  for (const answer of answers) {
    const entry = llmsFullTxt
      .split("\n---\n")
      .find((part) =>
        part.startsWith(`\n## https://omnigent.ai/answers/${answer.id}\n`),
      );
    expect(entry).toBeDefined();
    for (const { question, opening } of expected[answer.id])
      expect(entry).toContain(`## ${question}\n\n${opening}`);
  }
});
