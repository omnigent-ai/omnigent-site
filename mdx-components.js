import Link from "next/link";
import BlogPostHeader from "@/components/BlogPostHeader";

// Maps Markdown/MDX elements onto the site's components. Required by @next/mdx
// for the App Router; applied to every .mdx page.
export function useMDXComponents(components) {
  return {
    // Blog posts render their title + byline header via <BlogPostHeader slug=… />.
    BlogPostHeader,
    // Internal links go through next/link for client-side navigation; external
    // http(s) links open in a new tab; in-page anchors fall back to a plain <a>.
    a: ({ href = "", ...props }) => {
      if (href.startsWith("/")) {
        return <Link href={href} {...props} />;
      }
      if (href.startsWith("http")) {
        return <a href={href} target="_blank" rel="noreferrer" {...props} />;
      }
      return <a href={href} {...props} />;
    },
    // Markdown images get the same styling the JSX pages applied inline.
    img: ({ style, ...props }) => (
      // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
      <img
        {...props}
        style={{
          width: "100%",
          borderRadius: "8px",
          margin: "1rem 0",
          ...style,
        }}
      />
    ),
    ...components,
  };
}
