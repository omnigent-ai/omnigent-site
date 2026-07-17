import Link from "next/link";
import { getBlogPosts } from "@/lib/blog";

export const metadata = {
  title: "Blog",
  description:
    "Product updates and feature deep-dives from the Omnigent team.",
};

// The /blog index lists each post as a card linking to its page, newest first.
// Each post lives in app/blog/<slug>/page.mdx and exports a `meta` object; the
// automation only ever adds a new folder, so this index picks up new posts with
// no edits here.
export default function BlogIndex() {
  const posts = getBlogPosts();

  if (posts.length === 0) {
    return (
      <>
        <h1>Blog</h1>
        <p>No posts published yet.</p>
      </>
    );
  }

  return (
    <>
      <h1>Blog</h1>
      <ul>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link href={post.href}>{post.title}</Link>
            {post.date ? <span> — {post.date}</span> : null}
          </li>
        ))}
      </ul>
    </>
  );
}
