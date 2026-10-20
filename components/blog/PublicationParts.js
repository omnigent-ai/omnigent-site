import Link from "next/link";

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

export function PostMeta({ post }) {
  return (
    <div className="blog-card-meta">
      {post.category ? (
        <span className="blog-card-cat">{post.category}</span>
      ) : null}
      {post.date ? <span>{formatDate(post.date)}</span> : null}
    </div>
  );
}

export function PostCollection({ posts, featuredHeading: Heading = "h2" }) {
  const [featured, ...rest] = posts;
  if (!featured) return null;
  return (
    <>
      <article className="blog-featured">
        <PostThumb post={featured} />
        <div className="blog-featured-body">
          <PostMeta post={featured} />
          <Heading>
            <Link href={featured.href} className="blog-title-link">
              {featured.title}
            </Link>
          </Heading>
          {featured.description ? <p>{featured.description}</p> : null}
        </div>
      </article>
      <PostGrid posts={rest} />
    </>
  );
}

export function PostGrid({ posts }) {
  if (!posts.length) return null;
  return (
    <ul className="blog-grid">
      {posts.map((post) => (
        <li key={post.slug}>
          <article className="blog-card">
            <PostThumb post={post} />
            <div className="blog-card-body">
              <PostMeta post={post} />
              <h3>
                <Link href={post.href} className="blog-title-link">
                  {post.title}
                </Link>
              </h3>
              {post.description ? <p>{post.description}</p> : null}
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}
