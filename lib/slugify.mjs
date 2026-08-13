// @ts-check
/**
 * Convert an arbitrary value into a URL-friendly slug.
 *
 * The input is coerced with `String(input)`, lowercased, and trimmed. Any run
 * of non-alphanumeric characters is collapsed into a single hyphen, and any
 * leading or trailing hyphens are stripped.
 *
 * @example
 * slugify('Hello, World!');          // 'hello-world'
 * slugify('  Omnigent  Agents  ');   // 'omnigent-agents'
 * slugify('a---b');                  // 'a-b'
 * slugify('');                       // ''
 *
 * @param {unknown} input - The value to slugify.
 * @returns {string} The slugified string.
 */
export function slugify(input) {
  return String(input)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
