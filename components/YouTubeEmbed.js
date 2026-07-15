"use client";

import { useState } from "react";

/**
 * Click-to-load YouTube embed. Shows a lightweight poster (the YouTube
 * thumbnail, or a supplied image) until the user clicks play, then swaps in
 * the real iframe. Keeps a third-party iframe out of the initial render so the
 * homepage stays fast.
 */
export default function YouTubeEmbed({ id, title, poster }) {
  const [playing, setPlaying] = useState(false);
  const thumb = poster || `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;

  return (
    <div className="yt-embed">
      {playing ? (
        <iframe
          className="yt-embed-frame"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
          title={title}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
        />
      ) : (
        <button
          type="button"
          className="yt-embed-poster"
          onClick={() => setPlaying(true)}
          aria-label={`Play video: ${title}`}
          style={{ backgroundImage: `url(${thumb})` }}
        >
          <span className="yt-embed-play" aria-hidden="true">
            <svg viewBox="0 0 68 48" width="68" height="48">
              <path
                className="yt-embed-play-bg"
                d="M66.52 7.74c-.78-2.93-2.49-5.41-5.42-6.19C55.79.13 34 0 34 0S12.21.13 6.9 1.55c-2.93.78-4.63 3.26-5.42 6.19C.06 13.05 0 24 0 24s.06 10.95 1.48 16.26c.78 2.93 2.49 5.41 5.42 6.19C12.21 47.87 34 48 34 48s21.79-.13 27.1-1.55c2.93-.78 4.64-3.26 5.42-6.19C67.94 34.95 68 24 68 24s-.06-10.95-1.48-16.26z"
              />
              <path d="M45 24 27 14v20" fill="#fff" />
            </svg>
          </span>
        </button>
      )}
    </div>
  );
}
