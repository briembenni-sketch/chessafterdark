"use client";

import Link from "next/link";
import { useState } from "react";
import { episodes } from "@/data/episodes";

export default function ThaettirPage() {
  const [search, setSearch] = useState("");

  const filtered = episodes.filter((ep) => {
    const q = search.toLowerCase();
    return (
      ep.title.toLowerCase().includes(q) ||
      ep.description.toLowerCase().includes(q) ||
      ep.guests.some((g) => g.toLowerCase().includes(q)) ||
      ep.topics.some((t) => t.toLowerCase().includes(q))
    );
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-2">Allir þættir</h1>
      <p className="text-muted mb-8">
        Skoðaðu alla þætti Chess After Dark hér að neðan.
      </p>

      {/* Search */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Leita í þáttum..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md bg-bg-secondary border border-blue-main/30 rounded-lg px-4 py-3 text-white placeholder:text-muted focus:outline-none focus:border-blue-bright transition-colors"
        />
      </div>

      {/* Episodes list */}
      <div className="flex flex-col gap-4">
        {filtered.map((ep) => (
          <Link
            key={ep.slug}
            href={`/thaettir/${ep.slug}`}
            className="bg-bg-secondary border border-blue-main/20 rounded-xl p-5 hover:border-blue-bright/50 transition-colors group flex flex-col md:flex-row gap-4"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-blue-main/20 text-blue-bright text-xs font-bold px-2 py-1 rounded">
                  #{ep.episodeNumber}
                </span>
                <span className="text-muted text-sm">{ep.date}</span>
                {ep.guests.length > 0 && (
                  <span className="text-blue-light text-sm">
                    Gestur: {ep.guests.join(", ")}
                  </span>
                )}
              </div>
              <h2 className="text-xl font-semibold text-white group-hover:text-blue-light transition-colors mb-2">
                {ep.title}
              </h2>
              <p className="text-muted text-sm">{ep.description}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {ep.topics.map((topic) => (
                  <span
                    key={topic}
                    className="bg-blue-main/10 text-blue-light text-xs px-2 py-1 rounded"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            {/* Spotify embed placeholder */}
            <div className="md:w-80 flex-shrink-0">
              <iframe
                src={`https://open.spotify.com/embed/episode/${ep.spotifyEmbedId}?theme=0`}
                width="100%"
                height="152"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="rounded-lg"
                title={`Spotify player - ${ep.title}`}
              />
            </div>
          </Link>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-muted text-center py-12">
          Enginn þáttur fannst fyrir &ldquo;{search}&rdquo;
        </p>
      )}
    </div>
  );
}
