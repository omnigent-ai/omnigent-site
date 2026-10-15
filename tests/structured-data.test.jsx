import { expect, test } from "bun:test";
import { spawnSync } from "node:child_process";
import { renderToStaticMarkup } from "react-dom/server";
import JsonLd from "../components/JsonLd";
import {
  blogPosting,
  softwareApplication,
  siteGraph,
  ORGANIZATION_ID,
  WEBSITE_ID,
} from "../lib/structured-data";

const probe = `
  import { siteGraph, softwareApplication, blogPosting } from "./lib/structured-data.js";
  import { ogImageUrl } from "./lib/og.js";
  console.log(JSON.stringify({
    graph: siteGraph(),
    software: softwareApplication({ version: "0.17.0" }),
    article: blogPosting({
      slug: "example", title: "Example", description: "Description",
      date: "2026-10-06", author: "omnigent", heroArt: "/images/blog/example.png"
    }),
    socialImage: ogImageUrl("/blog/example")
  }));
`;

for (const override of [
  undefined,
  "https://preview.example",
  "https://tunnel.example",
]) {
  test(`structured-data URLs identify production with site URL ${override ?? "unset"}`, () => {
    const env = { ...process.env };
    delete env.NEXT_PUBLIC_SITE_URL;
    if (override) env.NEXT_PUBLIC_SITE_URL = override;
    const result = spawnSync(process.execPath, ["--eval", probe], {
      cwd: new URL("../", import.meta.url),
      env,
      encoding: "utf8",
    });
    expect(result.status, result.stderr).toBe(0);
    const { graph, software, article, socialImage } = JSON.parse(result.stdout);
    const organization = graph["@graph"].find(
      (node) => node["@type"] === "Organization",
    );
    const website = graph["@graph"].find((node) => node["@type"] === "WebSite");
    expect(organization["@id"]).toBe("https://omnigent.ai/#organization");
    expect(website["@id"]).toBe("https://omnigent.ai/#website");
    expect(organization.url).toBe("https://omnigent.ai/");
    expect(website.url).toBe(organization.url);
    expect(organization.logo.url).toBe("https://omnigent.ai/images/logo.png");
    expect(website.publisher["@id"]).toBe(organization["@id"]);
    expect(software["@id"]).toBe("https://omnigent.ai/#software");
    expect(software.url).toBe(organization.url);
    expect(software.publisher["@id"]).toBe(organization["@id"]);
    expect(software.softwareRequirements).toBeUndefined();
    expect(article["@id"]).toBe("https://omnigent.ai/blog/example#article");
    expect(article.url).toBe("https://omnigent.ai/blog/example");
    expect(article.mainEntityOfPage).toBe(article.url);
    expect(article.image).toBe("https://omnigent.ai/images/blog/example.png");
    expect(article.isPartOf["@id"]).toBe(website["@id"]);
    expect(article.author["@id"]).toBe(organization["@id"]);
    expect(article.publisher["@id"]).toBe(organization["@id"]);
    expect(socialImage).toBe(
      `${override ?? "https://omnigent.ai"}/og?path=%2Fblog%2Fexample&v=1`,
    );
  });
}

test("site graph preserves confirmed official organization profiles", () => {
  const graph = siteGraph();
  expect(graph["@context"]).toBe("https://schema.org");
  expect(graph["@graph"].map((node) => node["@type"])).toEqual(
    expect.arrayContaining(["Organization", "WebSite"]),
  );
  const organization = graph["@graph"].find(
    (node) => node["@type"] === "Organization",
  );
  expect(organization.sameAs).toEqual(
    expect.arrayContaining([
      "https://github.com/omnigent-ai",
      "https://x.com/omnigent_ai",
      "https://www.linkedin.com/company/omnigent-ai/",
      "https://www.youtube.com/@omnigent_ai",
      "https://discord.gg/omnigent",
      "https://luma.com/omnigent",
    ]),
  );
});

test("software describes all clients without server-only requirements or fabricated ratings", () => {
  const software = softwareApplication({ version: "0.17.0" });
  expect(software["@type"]).toBe("SoftwareApplication");
  expect(software.softwareVersion).toBe("0.17.0");
  for (const os of ["macOS", "Linux", "Windows", "iOS", "Android"]) {
    expect(software.operatingSystem).toContain(os);
  }
  expect(software).not.toHaveProperty("softwareRequirements");
  expect(software).not.toHaveProperty("aggregateRating");
  expect(software).not.toHaveProperty("review");
  expect(software.publisher["@id"]).toBe(ORGANIZATION_ID);
  expect(softwareApplication()).not.toHaveProperty("softwareVersion");
});

test("blog posts preserve human authors and optional fields", () => {
  const article = blogPosting({
    slug: "human",
    title: "A human post",
    description: "An excerpt",
    date: "2026-10-06",
    author: "Daniel Liden",
    authorProfile: { href: "https://www.linkedin.com/in/danielliden/" },
  });
  expect(article["@type"]).toBe("BlogPosting");
  expect(article.headline).toBe("A human post");
  expect(article.description).toBe("An excerpt");
  expect(article.datePublished).toBe("2026-10-06");
  expect(article.author).toEqual({
    "@type": "Person",
    name: "Daniel Liden",
    url: "https://www.linkedin.com/in/danielliden/",
  });
  expect(article.isPartOf["@id"]).toBe(WEBSITE_ID);
  expect(article).not.toHaveProperty("image");
  const minimal = blogPosting({ slug: "minimal", title: "Minimal" });
  expect(minimal.author).toEqual({ "@id": ORGANIZATION_ID });
  expect(minimal).not.toHaveProperty("description");
  expect(minimal).not.toHaveProperty("datePublished");
});

test("JSON-LD renderer prevents script termination and retains valid JSON", () => {
  const data = { headline: '</script><script>alert(1)</script> & quote: "' };
  const html = renderToStaticMarkup(<JsonLd data={data} />);
  expect(html.match(/<script/g)).toHaveLength(1);
  expect(html.match(/<\/script>/g)).toHaveLength(1);
  expect(html).toContain('type="application/ld+json"');
  const payload = html.match(/<script[^>]*>([\s\S]*)<\/script>/)[1];
  expect(payload).not.toContain("<");
  expect(JSON.parse(payload)).toEqual(data);
});
