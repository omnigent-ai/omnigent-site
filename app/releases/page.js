import { getReleases } from "@/lib/releases";
import {
  filterRecentReleases,
  groupReleasesByMonth,
} from "@/lib/group-releases";

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
  // Cap the feed to the last 6 months (anchored on the newest release). Older
  // versions stay reachable via the sidebar and their own /releases/<x.y.z> URL.
  const releases = filterRecentReleases(getReleases());

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

  // Group the stacked posts under "Month Year" headings (mirroring the sidebar),
  // keeping the newest-first order. `flatIndex` tracks the running position so a
  // divider is drawn before every post except the very first across all groups.
  const groups = groupReleasesByMonth(posts);
  let flatIndex = 0;

  return (
    <>
      <h1>Omnigent Releases</h1>
      {groups.map((group) => (
        <div key={group.label} className="release-month">
          <h2 className="release-month-heading">{group.label}</h2>
          {group.releases.map(({ version, Body }) => {
            const showDivider = flatIndex > 0;
            flatIndex += 1;
            return (
              <section key={version} className="release-entry">
                {showDivider ? <hr /> : null}
                <Body />
              </section>
            );
          })}
        </div>
      ))}
    </>
  );
}
