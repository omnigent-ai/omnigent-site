import { expect, test } from "bun:test";
import { renderToStaticMarkup } from "react-dom/server";
import InstallCommand from "../components/InstallCommand";
import InstallTerminal from "../components/InstallTerminal";
import { buildLlmsFiles } from "../scripts/generate-llms-files.mjs";
import { getReleases } from "../lib/releases";
import { productionSiteUrl } from "../lib/site";

// Package-manager installs skip the installer's Node.js and tmux checks, so the
// site advertises only the installer script.
const packageManagerInstall =
  /\b(uv tool install|uv pip install|pip install|brew install)\b/;
const installer = "curl -fsSL https://omnigent.ai/install.sh | sh";

test("homepage install terminal shows only the installer script", () => {
  const html = renderToStaticMarkup(<InstallTerminal />);
  expect(html).toContain(installer);
  expect(html).not.toContain('role="tablist"');
  expect(html).not.toMatch(packageManagerInstall);
});

test("install page command block shows only the installer script", () => {
  const html = renderToStaticMarkup(<InstallCommand />);
  expect(html).toContain(`${installer} -s -- --extra databricks,modal`);
  expect(html).not.toMatch(packageManagerInstall);
});

test("install page and release posts never suggest a package-manager install", async () => {
  const { llmsFullTxt } = await buildLlmsFiles();
  const sections = llmsFullTxt.split("\n---\n");
  const routes = [
    "/quickstart/install",
    ...getReleases().map((release) => release.href),
  ];
  for (const route of routes) {
    const entry = sections.find((section) =>
      section.includes(`## ${productionSiteUrl}${route}\n`),
    );
    expect(entry).toBeDefined();
    expect(entry).not.toMatch(packageManagerInstall);
  }
});
