import { getBlogPost, getReadingMinutes } from "@/lib/blog";

// Header rendered at the top of every blog post: title, then a byline row with
// the author avatar, author name, publish date, and estimated reading time.
// A post renders it with just its slug — <BlogPostHeader slug="my-post" /> —
// and everything else is read from the post's own `meta` + body at build time,
// so the automation-generated posts get a consistent header for free.
//
// Auto-generated posts use `author: "omnigent"`; for that byline the avatar is
// the square Omnigent mark. A human author name falls back to a monogram tile.

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

function Avatar({ author }) {
  const isOmnigent = !author || author.toLowerCase() === "omnigent";
  if (isOmnigent) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src="/images/favicon.svg"
        alt=""
        className="blog-post-avatar"
        width={36}
        height={36}
      />
    );
  }
  const initial = author.trim().charAt(0).toUpperCase();
  return (
    <span
      className="blog-post-avatar blog-post-avatar-monogram"
      aria-hidden="true"
    >
      {initial}
    </span>
  );
}

export default function BlogPostHeader({ slug }) {
  const { title, date, category, author } = getBlogPost(slug);
  const displayAuthor = author || "omnigent";
  const minutes = getReadingMinutes(slug);
  const formattedDate = formatDate(date);

  return (
    <header className="blog-post-header">
      {category ? <span className="blog-card-cat">{category}</span> : null}
      <h1>{title}</h1>
      <div className="blog-post-byline">
        <Avatar author={author} />
        <div className="blog-post-byline-text">
          <span className="blog-post-author">{displayAuthor}</span>
          <span className="blog-post-meta">
            {formattedDate ? <span>{formattedDate}</span> : null}
            {formattedDate ? <span aria-hidden="true">·</span> : null}
            <span>{minutes} min read</span>
          </span>
        </div>
      </div>
    </header>
  );
}
