import { expect, test } from "bun:test";
import { getBlogPosts } from "../lib/blog";
import { blogFeedXml, FEED_PATH } from "../lib/feed";

test("blog posts only include folders with a post page", () => {
  const slugs = getBlogPosts().map((post) => post.slug);
  expect(slugs.length).toBeGreaterThan(0);
  expect(slugs).not.toContain("rss.xml");
});

test("feed lists every post with production URLs and its own dates", () => {
  const posts = getBlogPosts();
  const xml = blogFeedXml(posts);
  expect(xml).toStartWith('<?xml version="1.0" encoding="UTF-8"?>');
  expect(xml).toContain(
    `<atom:link href="https://omnigent.ai${FEED_PATH}" rel="self" type="application/rss+xml" />`,
  );
  expect(xml.match(/<item>/g)).toHaveLength(posts.length);
  for (const post of posts) {
    expect(xml).toContain(
      `<guid isPermaLink="true">https://omnigent.ai/blog/${post.slug}</guid>`,
    );
    if (post.date) {
      expect(xml).toContain(
        `<pubDate>${new Date(`${post.date}T00:00:00Z`).toUTCString()}</pubDate>`,
      );
    }
  }
  const newest = posts.find((post) => post.date);
  expect(xml).toContain(
    `<lastBuildDate>${new Date(`${newest.date}T00:00:00Z`).toUTCString()}</lastBuildDate>`,
  );
});

test("feed escapes XML special characters", () => {
  const xml = blogFeedXml([
    {
      slug: "x",
      href: "/blog/x",
      title: 'A & B <C> "D"',
      date: "2026-10-01",
      author: "omnigent",
      description: "Tom's <b>",
    },
  ]);
  expect(xml).toContain("<title>A &amp; B &lt;C&gt; &quot;D&quot;</title>");
  expect(xml).toContain("<description>Tom&apos;s &lt;b&gt;</description>");
  expect(xml).toContain("<dc:creator>Omnigent</dc:creator>");
});
