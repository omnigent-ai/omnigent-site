import Link from "next/link";
import { getBlogPosts } from "@/lib/blog";

export const metadata = {
  title: "Blog",
  description: "Product updates and feature deep-dives from the Omnigent team.",
};

// The /blog index (MLflow-style): the newest post gets a large featured card,
// the rest fill a thumbnail card grid. Each post lives in
// app/blog/<slug>/page.mdx and exports a `meta` object; the automation only
// ever adds a new folder, so this index picks up new posts with no edits here.
function formatDate(date) {
  if (!date) return null;
  const d = new Date(`${date}T00:00:00Z`);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });
}

function PostThumb({ post }) {
  if (post.heroArt) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={post.heroArt} alt="" className="blog-thumb" />;
  }
  // Placeholder keeps the card shape consistent until a human adds hero art.
  return (
    <div className="blog-thumb blog-thumb-empty" aria-hidden="true">
      <span>{post.category || "Omnigent"}</span>
    </div>
  );
}

export default function BlogIndex() {
  const posts = getBlogPosts();

  if (posts.length === 0) {
    return (
      <div className="blog-index">
        <header className="blog-header">
          <h1>Blog</h1>
          <p>Product updates and feature deep-dives from the Omnigent team.</p>
        </header>
      </div>
    );
  }

  const [featured, ...rest] = posts;

  return (
    <div className="blog-index">
      <header className="blog-header">
        <h1>Blog</h1>
        <p>Product updates and feature deep-dives from the Omnigent team.</p>
      </header>

      <Link href={featured.href} className="blog-featured">
        <PostThumb post={featured} />
        <div className="blog-featured-body">
          <div className="blog-card-meta">
            {featured.category ? (
              <span className="blog-card-cat">{featured.category}</span>
            ) : null}
            {featured.date ? <span>{formatDate(featured.date)}</span> : null}
          </div>
          <h2>{featured.title}</h2>
          {featured.description ? <p>{featured.description}</p> : null}
        </div>
      </Link>

      {rest.length > 0 ? (
        <ul className="blog-grid">
          {rest.map((post) => (
            <li key={post.slug}>
              <Link href={post.href} className="blog-card">
                <PostThumb post={post} />
                <div className="blog-card-body">
                  <div className="blog-card-meta">
                    {post.category ? (
                      <span className="blog-card-cat">{post.category}</span>
                    ) : null}
                    {post.date ? <span>{formatDate(post.date)}</span> : null}
                  </div>
                  <h3>{post.title}</h3>
                  {post.description ? <p>{post.description}</p> : null}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
