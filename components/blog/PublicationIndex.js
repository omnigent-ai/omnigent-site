import Link from "next/link";
import { getBlogPosts } from "@/lib/blog";
import { getBlogFormat } from "@/lib/blog-formats";
import { PostCollection, PostGrid } from "./PublicationParts";
import "./publication.css";

export default function PublicationIndex({ notesSelected = false }) {
  const posts = getBlogPosts();
  const articles = posts.filter(
    (post) => getBlogFormat(post.slug).kind === "article",
  );
  const notes = posts.filter(
    (post) => getBlogFormat(post.slug).kind === "feature-note",
  );
  return (
    <div className="blog-index">
      <header className="blog-header">
        <h1>{notesSelected ? "Feature notes" : "Blog"}</h1>
        <p>
          {notesSelected
            ? "Short posts spotlighting individual Omnigent features."
            : "Product updates and feature deep-dives from the Omnigent team."}
        </p>
      </header>
      <nav className="publication-tabs" aria-label="Post format">
        <Link href="/blog" aria-current={!notesSelected ? "page" : undefined}>
          Articles
        </Link>
        <Link
          href="/feature-notes"
          aria-current={notesSelected ? "page" : undefined}
        >
          Feature notes
        </Link>
      </nav>
      <section aria-label={notesSelected ? "Feature notes" : "Articles"}>
        <PostCollection
          posts={notesSelected ? notes : articles}
          featuredHeading={notesSelected ? "h2" : "h3"}
        />
      </section>
      {!notesSelected && notes.length > 0 ? (
        <section
          className="publication-preview"
          aria-labelledby="feature-notes-heading"
        >
          <h2 id="feature-notes-heading">Feature notes</h2>
          <p>Short posts spotlighting individual Omnigent features.</p>
          <PostGrid posts={notes.slice(0, 3)} />
          <Link className="publication-see-all" href="/feature-notes">
            See all feature notes →
          </Link>
        </section>
      ) : null}
    </div>
  );
}
