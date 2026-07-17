"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

// Mirrors the releases sidebar (.docs-side) but lists blog posts, which are
// discovered at build time and passed in from the layout.
export default function BlogSidebar({ posts }) {
  const path = usePathname();
  return (
    <aside className="docs-side">
      <h4>Blog</h4>
      <ul>
        <li>
          <Link href="/blog" className={path === "/blog" ? "active" : ""}>
            All posts
          </Link>
        </li>
        {posts.map((post) => (
          <li key={post.slug}>
            <Link
              href={post.href}
              className={path === post.href ? "active" : ""}
            >
              {post.title}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
