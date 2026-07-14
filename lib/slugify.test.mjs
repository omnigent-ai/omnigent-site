// @ts-check
import { test } from "node:test";
import assert from "node:assert/strict";

import { slugify } from "./slugify.mjs";

test("slugifies a phrase with punctuation", () => {
  assert.equal(slugify("Hello, World!"), "hello-world");
});

test("lowercases, trims, and collapses internal whitespace", () => {
  assert.equal(slugify("  Omnigent  Agents  "), "omnigent-agents");
});

test("collapses a run of separators into a single hyphen", () => {
  assert.equal(slugify("a---b"), "a-b");
});

test("returns an empty string for empty or separator-only input", () => {
  assert.equal(slugify(""), "");
  assert.equal(slugify("   "), "");
  assert.equal(slugify("!!!"), "");
});

test("strips leading and trailing hyphens", () => {
  assert.equal(slugify("--Hello--"), "hello");
  assert.equal(slugify("  -trailing- "), "trailing");
});

test("coerces non-string input via String()", () => {
  assert.equal(slugify(12345), "12345");
  assert.equal(slugify(null), "null");
  assert.equal(slugify(undefined), "undefined");
});
