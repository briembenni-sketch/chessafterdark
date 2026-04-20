"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef, useCallback } from "react";
import type { Episode } from "@/lib/rss";

const TOPIC_FILTERS = ["Allir", "Knattspyrna", "Pólitík", "Viðskipti", "Skák", "Almennt"];

function formatDisplayDate(dateStr: string): string {
  const d = new Date(dateStr);
  const day = d.getDate();
  const months = [
    "janúar", "febrúar", "mars", "apríl", "maí", "júní",
    "júlí", "ágúst", "september", "október", "nóvember", "desember",
  ];
  return `${day}. ${months[d.getMonth()]}`;
}

function parseDurationSeconds(duration: string): number {
  const parts = duration.split(":").map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return 0;
}

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${m}:${String(s).padStart(2, "0")}`;
}

export default function ThaettirPage() {
  const [search, setSearch] = useState("");
  const [activeTopic, setActiveTopic] = useState("Allir");
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  // Audio player state
  const [playingEp, setPlayingEp] = useState<Episode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem("cad-view-mode");
    if (saved === "list" || saved === "grid") setViewMode(saved);
  }, []);

  useEffect(() => {
    fetch("/api/episodes")
      .then((res) => res.json())
      .then((data) => {
        setEpisodes(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Keyboard shortcut: "/" to focus search
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, []);

  // Audio time update
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const onTime = () => setCurrentTime(audio.currentTime);
    const onDuration = () => setAudioDuration(audio.duration);
    const onEnded = () => { setIsPlaying(false); setCurrentTime(0); };
    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onDuration);
    audio.addEventListener("ended", onEnded);
    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onDuration);
      audio.removeEventListener("ended", onEnded);
    };
  }, [playingEp]);

  const handlePlay = useCallback((ep: Episode, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (playingEp?.guid === ep.guid) {
      // Toggle play/pause
      if (isPlaying) {
        audioRef.current?.pause();
        setIsPlaying(false);
      } else {
        audioRef.current?.play();
        setIsPlaying(true);
      }
    } else {
      setPlayingEp(ep);
      setCurrentTime(0);
      setAudioDuration(parseDurationSeconds(ep.duration));
      setTimeout(() => {
        audioRef.current?.play();
        setIsPlaying(true);
      }, 100);
    }
  }, [playingEp, isPlaying]);

  const seek = useCallback((offset: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, audioRef.current.currentTime + offset);
    }
  }, []);

  const toggleView = (mode: "grid" | "list") => {
    setViewMode(mode);
    localStorage.setItem("cad-view-mode", mode);
  };

  // Topic counts
  const topicCounts: Record<string, number> = {};
  for (const ep of episodes) {
    for (const t of ep.topics) {
      topicCounts[t] = (topicCounts[t] || 0) + 1;
    }
  }

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
    <div className="min-h-screen">
      {/* ─── HERO ─── */}
      <section
        className="px-8 pt-12 pb-6"
        style={{
          background: "radial-gradient(ellipse at top, rgba(0,79,254,0.12) 0%, #0a1428 70%)",
        }}
      >
        <div className="max-w-6xl mx-auto flex items-end justify-between flex-wrap gap-4">
          <div>
            <p className="text-cad-light text-xs tracking-widest uppercase mb-2">
              HLAÐVARPIÐ
            </p>
            <h1 className="text-4xl font-medium text-white mb-2">Allir þættir</h1>
            <p className="text-white/55 text-sm">
              {episodes.length > 0
                ? `${episodes.length} þættir síðan 2019`
                : "Hleð þáttum..."}
            </p>
          </div>
          <div className="flex bg-white/5 p-1 rounded-lg">
            <button
              onClick={() => toggleView("grid")}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                viewMode === "grid"
                  ? "bg-cad-electric text-white"
                  : "text-white/50 hover:text-white/70"
              }`}
            >
              ▦ Grid
            </button>
            <button
              onClick={() => toggleView("list")}
              className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
                viewMode === "list"
                  ? "bg-cad-electric text-white"
                  : "text-white/50 hover:text-white/70"
              }`}
            >
              ☰ Listi
            </button>
          </div>
        </div>
      </section>

      {/* ─── SEARCH + FILTER BAR ─── */}
      <section className="px-8 pt-5 pb-8">
        <div className="max-w-6xl mx-auto flex flex-wrap gap-4 items-center">
          {/* Search */}
          <div className="relative max-w-[360px] w-full">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/40 text-sm pointer-events-none">
              ⌕
            </span>
            <input
              ref={searchRef}
              type="text"
              placeholder="Leita að gesti eða efni..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/10 rounded-lg py-[11px] pr-3.5 pl-[38px] text-sm text-white placeholder:text-white/35 focus:outline-none focus:border-cad-electric transition-colors"
            />
          </div>

          {/* Category pills */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            {TOPIC_FILTERS.map((topic) => (
              <button
                key={topic}
                onClick={() => setActiveTopic(topic)}
                className={`px-3.5 py-[7px] rounded-full text-xs whitespace-nowrap transition-colors ${
                  activeTopic === topic
                    ? "bg-cad-electric text-white font-medium"
                    : "bg-white/5 border border-white/10 text-white/75 hover:bg-white/10"
                }`}
              >
                {topic === "Allir"
                  ? "Allir"
                  : `${topic} · ${topicCounts[topic] || 0}`}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ─── LOADING SKELETONS ─── */}
      {loading && (
        <section className="px-8 pb-12">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-[14px] overflow-hidden" style={{ background: "#0f1f3d", border: "0.5px solid rgba(255,255,255,0.06)" }}>
                <div className="aspect-square bg-white/5 animate-pulse" />
                <div className="p-4 space-y-3">
                  <div className="h-2.5 bg-white/5 rounded animate-pulse w-24" />
                  <div className="h-4 bg-white/5 rounded animate-pulse w-3/4" />
                  <div className="h-3 bg-white/5 rounded animate-pulse w-full" />
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─── EPISODE GRID ─── */}
      {!loading && filtered.length > 0 && (
        <section className="px-8 pb-12">
          <div
            className={`max-w-6xl mx-auto ${
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                : "flex flex-col gap-3"
            }`}
          >
            {filtered.map((ep) => (
              viewMode === "grid" ? (
                <EpisodeCard
                  key={ep.guid}
                  ep={ep}
                  playingGuid={playingEp?.guid}
                  isPlaying={isPlaying}
                  onPlay={handlePlay}
                />
              ) : (
                <EpisodeListItem
                  key={ep.guid}
                  ep={ep}
                  playingGuid={playingEp?.guid}
                  isPlaying={isPlaying}
                  onPlay={handlePlay}
                />
              )
            ))}
          </div>
        </section>
      )}

      {/* ─── EMPTY STATE ─── */}
      {!loading && filtered.length === 0 && (
        <section className="px-8 pb-12">
          <div className="max-w-6xl mx-auto text-center py-20">
            <div className="text-5xl mb-4 opacity-30">♟</div>
            <h2 className="text-xl font-medium text-white mb-2">
              Engir þættir fundust
            </h2>
            <p className="text-white/50 text-sm mb-6">
              Prófaðu aðra leit eða fjarlægðu síur
            </p>
            <button
              onClick={() => {
                setSearch("");
                setActiveTopic("Allir");
              }}
              className="px-5 py-2 bg-cad-electric text-white text-sm rounded-lg hover:bg-cad-electric/80 transition-colors"
            >
              Hreinsa síur
            </button>
          </div>
        </section>
      )}

      {/* ─── FLOATING MINI PLAYER ─── */}
      {playingEp && (
        <div
          className="fixed bottom-4 left-4 right-4 z-50 md:rounded-2xl rounded-none md:border border-t"
          style={{
            background: "#0f1f3d",
            borderColor: "rgba(0,79,254,0.2)",
          }}
        >
          <div className="max-w-6xl mx-auto flex items-center gap-4 p-4 md:p-5">
            {/* Thumbnail */}
            <div className="w-[50px] h-[50px] rounded-lg overflow-hidden flex-shrink-0 relative">
              <Image
                src={playingEp.image}
                alt={playingEp.title}
                fill
                className="object-cover"
                sizes="50px"
              />
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <p className="text-cad-light text-[10px] tracking-widest uppercase">
                NÚ AÐ SPILA
              </p>
              <p className="text-sm font-medium text-white truncate">
                {playingEp.title}
              </p>
              {/* Progress bar */}
              <div className="mt-1.5 h-[3px] bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cad-electric rounded-full transition-[width] duration-300"
                  style={{
                    width: audioDuration > 0 ? `${(currentTime / audioDuration) * 100}%` : "0%",
                  }}
                />
              </div>
            </div>

            {/* Time */}
            <span className="text-white/55 text-xs tabular-nums hidden sm:block flex-shrink-0">
              {formatTime(currentTime)} / {formatTime(audioDuration)}
            </span>

            {/* Controls */}
            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => seek(-15)}
                className="w-[34px] h-[34px] bg-white/[0.06] rounded-lg flex items-center justify-center text-white/70 hover:bg-white/10 transition-colors text-xs"
                aria-label="Spóla til baka 15 sekúndur"
              >
                -15
              </button>
              <button
                onClick={(e) => handlePlay(playingEp, e)}
                className="w-[34px] h-[34px] bg-cad-electric rounded-lg flex items-center justify-center text-white transition-colors text-xs"
                aria-label={isPlaying ? "Pása" : "Spila"}
              >
                {isPlaying ? "⏸" : "▶"}
              </button>
              <button
                onClick={() => seek(15)}
                className="w-[34px] h-[34px] bg-white/[0.06] rounded-lg flex items-center justify-center text-white/70 hover:bg-white/10 transition-colors text-xs"
                aria-label="Spóla áfram 15 sekúndur"
              >
                +15
              </button>
            </div>
          </div>
          <audio ref={audioRef} src={playingEp.audioUrl} preload="metadata" />
        </div>
      )}

      {/* Bottom spacer when mini player is visible */}
      {playingEp && <div className="h-24" />}
    </div>
  );
}

/* ─── EPISODE CARD (Grid View) ─── */
function EpisodeCard({
  ep,
  playingGuid,
  isPlaying,
  onPlay,
}: {
  ep: Episode;
  playingGuid?: string;
  isPlaying: boolean;
  onPlay: (ep: Episode, e: React.MouseEvent) => void;
}) {
  const [imgError, setImgError] = useState(false);
  const isActive = playingGuid === ep.guid && isPlaying;

  return (
    <Link
      href={`/thaettir/${ep.slug}`}
      className="group rounded-[14px] overflow-hidden transition-all duration-300 hover:-translate-y-[3px] focus-visible:ring-2 focus-visible:ring-cad-electric focus-visible:outline-none"
      style={{
        background: "#0f1f3d",
        border: "0.5px solid rgba(255,255,255,0.06)",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(0,79,254,0.4)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.06)";
      }}
    >
      {/* Thumbnail */}
      <div className="aspect-square relative overflow-hidden">
        <Image
          src={imgError ? "/images/brand/cover-art.png" : ep.image}
          alt={ep.title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          onError={() => setImgError(true)}
        />

        {/* Episode number pill */}
        <span className="absolute top-3 left-3 bg-black/50 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-md font-medium">
          #{ep.number}
        </span>

        {/* Duration pill */}
        <span className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-md text-white text-xs px-2.5 py-1 rounded-md tabular-nums">
          {ep.duration}
        </span>

        {/* Play button */}
        {ep.audioUrl && (
          <button
            onClick={(e) => onPlay(ep, e)}
            className={`absolute bottom-3 left-3 w-9 h-9 bg-white text-cad-electric rounded-full flex items-center justify-center text-xs transition-opacity duration-300 ${
              isActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}
            aria-label={`Spila ${ep.title}`}
          >
            {isActive ? "⏸" : "▶"}
          </button>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        {/* Meta row */}
        <div className="flex items-center gap-1.5 mb-2.5">
          <span className="text-cad-light text-[10px] tracking-widest uppercase">
            {ep.topics[0] || "Almennt"}
          </span>
          <span className="text-white/30">·</span>
          <span className="text-white/50 text-[10px]">
            {formatDisplayDate(ep.date)}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-[15px] font-medium text-white leading-[1.35] mb-1.5 line-clamp-2">
          {ep.title}
        </h2>

        {/* Short description */}
        <p className="text-white/50 text-xs leading-relaxed line-clamp-2">
          {ep.shortDescription}
        </p>
      </div>
    </Link>
  );
}

/* ─── EPISODE LIST ITEM (List View) ─── */
function EpisodeListItem({
  ep,
  playingGuid,
  isPlaying,
  onPlay,
}: {
  ep: Episode;
  playingGuid?: string;
  isPlaying: boolean;
  onPlay: (ep: Episode, e: React.MouseEvent) => void;
}) {
  const isActive = playingGuid === ep.guid && isPlaying;

  return (
    <Link
      href={`/thaettir/${ep.slug}`}
      className="group flex items-center gap-4 rounded-xl p-4 transition-all duration-300 hover:bg-white/[0.03] focus-visible:ring-2 focus-visible:ring-cad-electric focus-visible:outline-none"
      style={{
        background: "#0f1f3d",
        border: "0.5px solid rgba(255,255,255,0.06)",
      }}
    >
      {/* Play button */}
      {ep.audioUrl && (
        <button
          onClick={(e) => onPlay(ep, e)}
          className="w-10 h-10 bg-white/[0.06] hover:bg-cad-electric rounded-full flex items-center justify-center text-white text-xs flex-shrink-0 transition-colors"
          aria-label={`Spila ${ep.title}`}
        >
          {isActive ? "⏸" : "▶"}
        </button>
      )}

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-cad-light text-[10px] tracking-widest uppercase">
            #{ep.number}
          </span>
          <span className="text-white/30">·</span>
          <span className="text-white/50 text-[10px]">
            {formatDisplayDate(ep.date)}
          </span>
        </div>
        <h2 className="text-sm font-medium text-white truncate">{ep.title}</h2>
      </div>

      {/* Duration */}
      <span className="text-white/40 text-xs tabular-nums flex-shrink-0">
        {ep.duration}
      </span>
    </Link>
  );
}
