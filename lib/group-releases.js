// Pure, fs-free helper shared by the releases feed (server) and sidebar
// (client). Kept separate from lib/releases.js because that module imports
// `fs` at the top level and can't be pulled into a client bundle.

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const RECENT_WINDOW_MONTHS = 6;

function parseDate(date) {
  const match = date && date.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  return {
    year: Number(match[1]),
    month: Number(match[2]),
    day: Number(match[3]),
  };
}

// Keeps only releases dated within RECENT_WINDOW_MONTHS of the NEWEST release
// (not "today"), so the feed never empties during a quiet stretch. Releases
// arrive newest-first. Undated releases are always kept — we can't window them
// out safely. Returns the input unchanged when nothing is dated.
export function filterRecentReleases(releases) {
  const newest = releases.map((r) => parseDate(r.date)).find(Boolean);
  if (!newest) return releases;

  // Cutoff = newest date shifted back RECENT_WINDOW_MONTHS, borrowing across the
  // year boundary. A release is kept if its date is >= this cutoff.
  let cutoffMonth = newest.month - RECENT_WINDOW_MONTHS;
  let cutoffYear = newest.year;
  while (cutoffMonth <= 0) {
    cutoffMonth += 12;
    cutoffYear -= 1;
  }
  const cutoff = cutoffYear * 10000 + cutoffMonth * 100 + newest.day;

  return releases.filter((r) => {
    const d = parseDate(r.date);
    if (!d) return true;
    return d.year * 10000 + d.month * 100 + d.day >= cutoff;
  });
}

// Buckets releases into "Month Year" sections (e.g. "July 2026") keyed off each
// release's date. Releases arrive already sorted newest-first, so we preserve
// that order and emit one section per distinct month, with a trailing "Undated"
// bucket for any release whose date couldn't be parsed.
export function groupReleasesByMonth(releases) {
  const groups = [];
  let current = null;
  for (const release of releases) {
    const match = release.date && release.date.match(/^(\d{4})-(\d{2})-\d{2}$/);
    const label = match
      ? `${MONTHS[Number(match[2]) - 1]} ${match[1]}`
      : "Undated";
    if (!current || current.label !== label) {
      current = { label, releases: [] };
      groups.push(current);
    }
    current.releases.push(release);
  }
  return groups;
}
