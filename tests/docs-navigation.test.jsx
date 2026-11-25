import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import { AppRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { PathnameContext } from "next/dist/shared/lib/hooks-client-context.shared-runtime";
import ReferenceLayout from "../app/reference/layout";
import PrevNextNav from "../components/PrevNextNav";
import { docsPages } from "../lib/docs-navigation";
import { discoverPages } from "../lib/routes";

function renderAt(path, children) {
  return renderToStaticMarkup(
    <AppRouterContext.Provider value={{}}>
      <PathnameContext.Provider value={path}>
        {children}
      </PathnameContext.Provider>
    </AppRouterContext.Provider>,
  );
}

function neighborLinks(html) {
  return {
    previous: html.match(/prev-next-link--prev" href="([^"]+)"/)?.[1],
    next: html.match(/prev-next-link--next" href="([^"]+)"/)?.[1],
  };
}

test("each pagination entry points to a distinct page", () => {
  const routes = new Set(discoverPages().map(({ route }) => route));
  const hrefs = docsPages.map(({ href }) => href);
  expect(new Set(hrefs).size).toBe(hrefs.length);
  expect(hrefs.filter((href) => !routes.has(href))).toEqual([]);
});

test("the footer follows sidebar order through nested pages and sections", () => {
  const sequences = [
    [
      "/docs/use/builtin-agents",
      "/docs/use/builtin-agents/polly",
      "/docs/use/builtin-agents/debby",
      "/docs/use/custom-agents",
      "/docs/build/models",
    ],
    [
      "/docs/deploy/credential-store",
      "/docs/deploy/github-connect",
      "/docs/deploy/databricks-connect",
      "/docs/deploy/cloud-sandbox-host",
      "/docs/deploy/community-sandbox-providers",
      "/docs/deploy/sandbox-profiles",
      "/docs/policies/overview",
      "/docs/policies/builtin",
      "/docs/policies/custom",
      "/docs/omnibox",
      "/docs/programmatic",
      "/docs/programmatic/github-actions",
      "/docs/reference/configuration",
    ],
  ];
  for (const paths of sequences) {
    for (const [index, path] of paths.slice(1, -1).entries()) {
      expect(neighborLinks(renderAt(path, <PrevNextNav />)), path).toEqual({
        previous: paths[index],
        next: paths[index + 2],
      });
    }
  }
});

test("the first and last docs pages expose only their actual neighbor", () => {
  expect(
    neighborLinks(renderAt("/quickstart/install", <PrevNextNav />)),
  ).toEqual({ previous: undefined, next: "/quickstart/coding-agent" });
  expect(
    neighborLinks(renderAt("/docs/deploy/telemetry", <PrevNextNav />)),
  ).toEqual({ previous: "/docs/reference/routing-api", next: undefined });
});

test("the REST API layout lets readers continue in both directions", () => {
  const html = renderAt(
    "/reference",
    <ReferenceLayout>REST API content</ReferenceLayout>,
  );
  expect(neighborLinks(html)).toEqual({
    previous: "/docs/reference/configuration/routing",
    next: "/docs/reference/routing-api",
  });
});
