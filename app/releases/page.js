import { getReleases } from "@/lib/releases";

export const metadata = {
  title: "Releases",
  description:
    "What's new in each version of Omnigent — release highlights, version by version.",
};

// The /releases index is a feed: it renders each release post's full content
// inline, newest first (mirroring MLflow's release listing). Each version lives
// in app/releases/<x.y.z>/page.mdx and default-exports its rendered body, so we
// dynamically import and stack them. The automation only ever adds a new folder,
// so this feed picks up new releases with no edits here.
export default async function ReleasesIndex() {
  const releases = getReleases();

  if (releases.length === 0) {
    return (
      <>
        <h1>Releases</h1>
        <p>No releases published yet.</p>
      </>
    );
  }

  const posts = await Promise.all(
    releases.map(async (release) => {
      const mod = await import(`./${release.version}/page.mdx`);
      return { ...release, Body: mod.default };
    }),
  );

  return (
    <>
      <h1>Omnigent Releases</h1>
      {posts.map(({ version, Body }, i) => (
        <section key={version} className="release-entry">
          {i > 0 ? <hr /> : null}
          <Body />
        </section>
      ))}
    </>
  );
}
