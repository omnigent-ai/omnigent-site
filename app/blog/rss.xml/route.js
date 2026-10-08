import { blogFeedXml } from "@/lib/feed";

// Rendered once at build time; new posts appear on the next deploy.
export const dynamic = "force-static";

export function GET() {
  return new Response(blogFeedXml(), {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
