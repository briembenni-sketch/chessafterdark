"use client";

import Link from "next/link";
import Image from "next/image";
import { Fragment, Suspense, useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ChevronRight, ChevronDown } from "lucide-react";
import type { Episode } from "@/lib/rss";
import { CATEGORIES, CATEGORY_ORDER, type Category } from "@/lib/categorization";

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

function EpisodesPageSkeleton() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <section
        className="px-8 pt-12 pb-6"
        style={{
          background: "radial-gradient(ellipse at top, rgba(0,79,254,0.12) 0%, #0a1428 70%)",
        }}
      >
        <div className="max-w-6xl mx-auto">
          <div className="h-3 w-24 bg-cad-mid/40 rounded animate-pulse mb-3" />
          <div className="h-10 w-64 bg-cad-mid/40 rounded animate-pulse mb-2" />
          <div className="h-4 w-48 bg-cad-mid/40 rounded animate-pulse" />
        </div>
      </section>

      {/* Filter pills + search */}
      <section className="px-8 pt-5 pb-8">
        <div className="max-w-6xl mx-auto flex flex-wrap gap-4 items-center">
          <div className="h-12 w-full max-w-[360px] bg-cad-mid/40 rounded-lg animate-pulse" />
          <div className="flex gap-2">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="h-10 w-24 bg-cad-mid/40 rounded-full animate-pulse" />
            ))}
          </div>
        </div>
      </section>

      {/* Episode card grid */}
      <section className="px-8 pb-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="rounded-[14px] overflow-hidden" style={{ background: "#0f1f3d", border: "0.5px solid rgba(255,255,255,0.06)" }}>
              <div className="aspect-square bg-cad-mid/40 animate-pulse" />
              <div className="p-4 space-y-3">
                <div className="h-2.5 bg-cad-mid/40 rounded animate-pulse w-24" />
                <div className="h-4 bg-cad-mid/40 rounded animate-pulse w-3/4" />
                <div className="h-3 bg-cad-mid/40 rounded animate-pulse w-full" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default function ThaettirPage() {
  return (
    <Suspense fallback={<EpisodesPageSkeleton />}>
      <ThaettirContent />
    </Suspense>
  );
}

function ThaettirContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);

  // Audio player state
  const [playingEp, setPlayingEp] = useState<Episode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Derive filter state directly from URL params
  const guestFilter = searchParams.get("gestur");
  const flokkurParam = searchParams.get("flokkur");
  const activeCategory: Category | null =
    flokkurParam && CATEGORY_ORDER.includes(flokkurParam as Category)
      ? (flokkurParam as Category)
      : null;

  type SortMode = "nyjast" | "elst";
  const SORT_OPTIONS: { value: SortMode; label: string }[] = [
    { value: "nyjast", label: "Nýjast fyrst" },
    { value: "elst", label: "Elst fyrst" },
  ];
  const radunParam = searchParams.get("radun");
  const activeSort: SortMode =
    radunParam === "elst" ? "elst" : "nyjast";

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

  function getGuestDisplayName(slug: string): string {
    const ep = episodes.find(
      (e) => e.guestSlug === slug || e.guestSlugs?.includes(slug)
    );
    if (!ep) return slug;
    if (ep.guestSlug === slug) return ep.guest;
    const idx = ep.guestSlugs?.indexOf(slug) ?? -1;
    return ep.guests?.[idx] ?? ep.guest;
  }

  // Dynamic document title for filtered views
  useEffect(() => {
    if (guestFilter) {
      document.title = `Þættir með ${getGuestDisplayName(guestFilter)} — Chess After Dark`;
    } else if (activeCategory) {
      document.title = `Þættir · ${CATEGORIES[activeCategory].label} — Chess After Dark`;
    } else {
      document.title = "Allir þættir — Chess After Dark";
    }
  });

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

  // Build URL from filter state (preserves all active params)
  function buildParams(overrides: { flokkur?: string | null; gestur?: string | null; radun?: string | null }) {
    const params = new URLSearchParams();
    const cat = overrides.flokkur !== undefined ? overrides.flokkur : flokkurParam;
    const guest = overrides.gestur !== undefined ? overrides.gestur : guestFilter;
    const sort = overrides.radun !== undefined ? overrides.radun : radunParam;
    if (cat) params.set("flokkur", cat);
    if (guest) params.set("gestur", guest);
    if (sort && sort !== "nyjast") params.set("radun", sort);
    return params;
  }

  function pushFilterUrl(cat: Category | null, guest: string | null) {
    const params = buildParams({ flokkur: cat, gestur: guest });
    const qs = params.toString();
    router.push(qs ? `/thaettir?${qs}` : "/thaettir", { scroll: false });
  }

  function handleSortChange(sort: SortMode) {
    const params = buildParams({ radun: sort });
    const qs = params.toString();
    router.push(qs ? `/thaettir?${qs}` : "/thaettir", { scroll: false });
  }

  function handleCategoryClick(cat: Category | null) {
    pushFilterUrl(cat, guestFilter);
  }

  // Category counts (multi-category: each ep counts once per category)
  const categoryCounts: Record<string, number> = {};
  for (const ep of episodes) {
    for (const cat of ep.categories) {
      categoryCounts[cat] = (categoryCounts[cat] || 0) + 1;
    }
  }

  const filtered = episodes.filter((ep) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      ep.title.toLowerCase().includes(q) ||
      ep.description.toLowerCase().includes(q) ||
      ep.guest.toLowerCase().includes(q) ||
      ep.categories.some((c) => CATEGORIES[c].label.toLowerCase().includes(q));
    const matchesCategory = !activeCategory || ep.categories.includes(activeCategory);
    const matchesGuest =
      !guestFilter ||
      ep.guestSlug === guestFilter ||
      ep.guestSlugs?.includes(guestFilter);
    return matchesSearch && matchesCategory && matchesGuest;
  });

  // Apply sort after filtering
  const sorted = [...filtered].sort((a, b) => {
    if (activeSort === "elst") return new Date(a.date).getTime() - new Date(b.date).getTime();
    // Default: nyjast (newest first) — episodes already come sorted by number desc,
    // but use date for consistency
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });

  const pageTitle = guestFilter
    ? `Þættir með ${getGuestDisplayName(guestFilter)}`
    : activeCategory
    ? `Þættir · ${CATEGORIES[activeCategory].label}`
    : "Allir þættir";

  const pageSubtitle = guestFilter
    ? `${filtered.length} ${filtered.length === 1 ? "þáttur fundinn" : "þættir fundust"} með þessum gesti`
    : episodes.length > 0
    ? `${episodes.length} þættir síðan 2019`
    : "Hleð þáttum...";

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
            <h1 className="text-4xl font-medium text-white mb-2">{pageTitle}</h1>
            <p className="text-white/55 text-sm">{pageSubtitle}</p>
          </div>
          <div className="relative">
            <select
              value={activeSort}
              onChange={(e) => handleSortChange(e.target.value as SortMode)}
              className="h-10 appearance-none bg-cad-mid text-cad-light text-sm rounded-full pl-4 pr-9 border-none focus:outline-none focus:ring-1 focus:ring-cad-electric cursor-pointer hover:bg-cad-mid/80 transition-colors"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-cad-light pointer-events-none" />
          </div>
        </div>
      </section>

      {/* ─── GUEST FILTER PILL ─── */}
      {guestFilter && (
        <section className="px-8 pt-5 pb-0">
          <div className="max-w-6xl mx-auto flex items-center gap-3 flex-wrap">
            <span className="text-white/60 text-sm">Sía virk:</span>
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 bg-cad-electric/15 border border-cad-electric/35 rounded-full text-cad-light text-sm">
              <span className="text-cad-light font-medium">
                Gestur: {getGuestDisplayName(guestFilter)}
              </span>
              <Link
                href="/thaettir"
                className="w-5 h-5 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 text-xs transition-colors"
                aria-label="Fjarlægja síu"
              >
                ×
              </Link>
            </div>
            <span className="text-white/50 text-sm">
              {filtered.length} {filtered.length === 1 ? "þáttur" : "þættir"}
            </span>
          </div>
        </section>
      )}

      {/* ─── SEARCH + FILTER BAR ─── */}
      <section className="px-8 pt-5 pb-8">
        <div className="max-w-6xl mx-auto flex flex-wrap gap-4 items-center">
          {/* Search */}
          <div className="relative max-w-[360px] w-full">
            <input
              ref={searchRef}
              type="text"
              placeholder="Leita að gesti eða efni..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white/[0.04] border border-white/10 rounded-lg py-[11px] pr-3.5 pl-3.5 text-sm text-white placeholder:text-white/35 focus:outline-none focus:border-cad-electric transition-colors"
            />
          </div>

          {/* Category pills (single-select) */}
          <div className="flex gap-2 overflow-x-auto pb-1">
            <button
              onClick={() => handleCategoryClick(null)}
              className={`px-3.5 py-[7px] rounded-full text-xs whitespace-nowrap transition-colors ${
                !activeCategory
                  ? "bg-cad-electric text-white font-medium"
                  : "border border-cad-electric/30 text-cad-light hover:border-cad-electric/60"
              }`}
            >
              Allir · {episodes.length}
            </button>
            {CATEGORY_ORDER.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategoryClick(activeCategory === cat ? null : cat)}
                className={`px-3.5 py-[7px] rounded-full text-xs whitespace-nowrap transition-colors ${
                  activeCategory === cat
                    ? "bg-cad-electric text-white font-medium"
                    : "border border-cad-electric/30 text-cad-light hover:border-cad-electric/60"
                }`}
              >
                {CATEGORIES[cat].label} <span className="text-cad-light/60">· {categoryCounts[cat] || 0}</span>
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
      {!loading && sorted.length > 0 && (
        <section className="px-8 pb-12">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sorted.map((ep) => (
              <EpisodeCard
                key={ep.guid}
                ep={ep}
                playingGuid={playingEp?.guid}
                isPlaying={isPlaying}
                onPlay={handlePlay}
              />
            ))}
          </div>
        </section>
      )}

      {/* ─── EMPTY STATE ─── */}
      {!loading && filtered.length === 0 && (
        <section className="px-8 pb-12">
          <div className="max-w-6xl mx-auto text-center py-20">
            <div className="text-5xl mb-4 opacity-30">&#x265F;</div>
            <h2 className="text-xl font-medium text-white mb-2">
              Engir þættir fundust
            </h2>
            <p className="text-white/50 text-sm mb-6">
              Prófaðu aðra leit eða fjarlægðu síur
            </p>
            <button
              onClick={() => {
                setSearch("");
                router.push("/thaettir", { scroll: false });
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
                {isPlaying ? "&#x23F8;" : "&#x25B6;"}
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
  const router = useRouter();
  const [imgError, setImgError] = useState(false);
  const isActive = playingGuid === ep.guid && isPlaying;

  return (
    <Link
      href={`/thaettir/${ep.slug}`}
      aria-label={`Skoða þátt: ${ep.title}`}
      className="group block rounded-[14px] overflow-hidden transition-all duration-200 hover:-translate-y-[3px] hover:shadow-lg hover:shadow-cad-electric/5"
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
          className="object-cover transition-transform duration-300 group-hover:scale-105"
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
            {isActive ? "\u23F8" : "\u25B6"}
          </button>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        {/* Meta row: categories + date */}
        <div className="flex items-center gap-1.5 mb-2.5">
          <span className="text-cad-light text-[11px] uppercase tracking-widest font-medium">
            {ep.categories.map((c) => CATEGORIES[c].label).join(" · ")}
          </span>
          <span className="text-white/30">&middot;</span>
          <span className="text-white/50 text-[10px]">
            {formatDisplayDate(ep.date)}
          </span>
        </div>

        {/* Title */}
        <h2 className="text-[15px] font-medium text-white leading-[1.35] mb-1.5 line-clamp-2 group-hover:text-cad-electric transition-colors">
          {ep.title}
        </h2>

        {/* Guest name(s) */}
        <div className="mb-2">
          {ep.guests && ep.guests.length > 1 ? (
            ep.guests.map((g, i) => (
              <Fragment key={i}>
                {i > 0 && <span className="text-white/30"> &middot; </span>}
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    router.push(`/thaettir?gestur=${ep.guestSlugs?.[i] || ep.guestSlug}`);
                  }}
                  className="text-cad-light hover:text-white transition-colors hover:underline underline-offset-2 decoration-dotted text-xs font-medium"
                >
                  {g}
                </button>
              </Fragment>
            ))
          ) : (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                router.push(`/thaettir?gestur=${ep.guestSlug}`);
              }}
              className="text-cad-light hover:text-white transition-colors hover:underline underline-offset-2 decoration-dotted text-xs font-medium"
            >
              {ep.guest}
            </button>
          )}
        </div>

        {/* Short description */}
        <p className="text-white/50 text-xs leading-relaxed line-clamp-2">
          {ep.shortDescription}
        </p>

        {/* Hover CTA */}
        <span className="flex items-center gap-1 mt-3 text-[11px] uppercase tracking-widest text-cad-electric font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          Skoða þátt
          <ChevronRight className="w-3.5 h-3.5" />
        </span>
      </div>
    </Link>
  );
}

