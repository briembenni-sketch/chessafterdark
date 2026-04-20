"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import type { Episode } from "@/lib/rss";

const TOPIC_FILTERS = ["Allir", "Knattspyrna", "Pólitík", "Viðskipti", "Skák"];

export default function ThaettirPage() {
  const [search, setSearch] = useState("");
  const [activeTopic, setActiveTopic] = useState("Allir");
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/episodes")
      .then((res) => res.json())
      .then((data) => {
        setEpisodes(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = episodes.filter((ep) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      ep.title.toLowerCase().includes(q) ||
      ep.description.toLowerCase().includes(q) ||
      ep.guest.toLowerCase().includes(q) ||
      ep.topics.some((t) => t.toLowerCase().includes(q));
    const matchesTopic =
      activeTopic === "Allir" || ep.topics.includes(activeTopic);
    return matchesSearch && matchesTopic;
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold text-white mb-2">Allir þættir</h1>
      <p className="text-muted mb-8">
        Skoðaðu alla þætti Chess After Dark hér að neðan.
      </p>

      {/* Topic filter chips */}
      <div className="flex flex-wrap gap-2 mb-6">
        {TOPIC_FILTERS.map((topic) => (
          <button
            key={topic}
            onClick={() => setActiveTopic(topic)}
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
              activeTopic === topic
                ? "bg-cad-electric text-white"
                : "bg-white/5 text-white/60 hover:bg-white/10 hover:text-white border border-white/10"
            }`}
          >
            {topic}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Leita í þáttum..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full max-w-md bg-cad-mid border border-cad-blue/30 rounded-lg px-4 py-3 text-white placeholder:text-muted focus:outline-none focus:border-cad-bright transition-colors"
        />
      </div>

      {loading && (
        <p className="text-muted text-center py-12">Hleð þáttum...</p>
      )}

      {/* Episodes list */}
      <div className="flex flex-col gap-4">
        {filtered.map((ep) => (
          <Link
            key={ep.guid}
            href={`/thaettir/${ep.slug}`}
            className="bg-cad-mid border border-cad-blue/20 rounded-xl p-5 hover:border-cad-bright/50 transition-colors group flex flex-col md:flex-row gap-4"
          >
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-cad-blue/20 text-cad-bright text-xs font-bold px-2 py-1 rounded">
                  #{ep.number}
                </span>
                <span className="text-muted text-sm">
                  {new Date(ep.date).toLocaleDateString("is-IS", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <span className="text-muted text-sm">{ep.duration}</span>
                {ep.guest && (
                  <span className="text-cad-light text-sm">
                    Gestur: {ep.guest}
                  </span>
                )}
              </div>
              <h2 className="text-xl font-semibold text-white group-hover:text-cad-light transition-colors mb-2">
                {ep.title}
              </h2>
              <p className="text-muted text-sm">{ep.shortDescription}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {ep.topics.map((topic) => (
                  <span
                    key={topic}
                    className="bg-cad-blue/10 text-cad-light text-xs px-2 py-1 rounded"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>

            {/* Native audio player preview */}
            {ep.audioUrl && (
              <div className="md:w-80 flex-shrink-0 flex items-center">
                <audio
                  controls
                  src={ep.audioUrl}
                  className="w-full"
                  preload="none"
                  onClick={(e) => e.preventDefault()}
                />
              </div>
            )}
          </Link>
        ))}
      </div>

      {!loading && filtered.length === 0 && (
        <p className="text-muted text-center py-12">
          Enginn þáttur fannst{search ? ` fyrir "${search}"` : ""}
        </p>
      )}
    </div>
  );
}
