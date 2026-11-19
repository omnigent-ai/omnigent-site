import { releaseFeedXml } from "@/lib/feed";

// Rendered once at build time; new releases appear on the next deploy.
export const dynamic = "force-static";

export function GET() {
  return new Response(releaseFeedXml(), {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
