"use client";

import { useState } from "react";
import {
  Calendar,
  MapPin,
  Users,
  Trophy,
  Cake,
  Sparkles,
  Landmark,
  Crown,
  ChevronRight,
  Tv,
  Timer,
} from "lucide-react";
import { events, type Event } from "@/data/events";

/* ─── helpers ─── */

const MONTHS_IS = [
  "janúar", "febrúar", "mars", "apríl", "maí", "júní",
  "júlí", "ágúst", "september", "október", "nóvember", "desember",
];
const MONTHS_SHORT = [
  "JAN", "FEB", "MAR", "APR", "MAÍ", "JÚN",
  "JÚL", "ÁGÚ", "SEP", "OKT", "NÓV", "DES",
];

function formatDateLong(dateStr: string, time?: string) {
  const d = new Date(dateStr + "T00:00:00");
  const day = d.getDate();
  const month = MONTHS_IS[d.getMonth()].toUpperCase();
  const year = d.getFullYear();
  const base = `${day}. ${month} ${year}`;
  return time ? `${base} · KL. ${time}` : base;
}

function formatMonthYear(dateStr: string) {
  const d = new Date(dateStr + "T00:00:00");
  return `${MONTHS_IS[d.getMonth()].toUpperCase()} ${d.getFullYear()}`;
}

function daysUntil(dateStr: string): number {
  const eventDate = new Date(dateStr + "T00:00:00");
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  const diffMs = eventDate.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

function countdownText(dateStr: string, time?: string) {
  const days = daysUntil(dateStr);
  if (days < 0) return "Viðburður er liðinn";
  if (days === 0) return time ? `Í dag · kl. ${time}` : "Í dag";
  if (days === 1) return time ? `Á morgun · kl. ${time}` : "Á morgun";
  if (days < 7) return `Eftir ${days} daga`;
  const d = new Date(dateStr + "T00:00:00");
  return `${d.getDate()}. ${MONTHS_IS[d.getMonth()]}${time ? ` · kl. ${time}` : ""}`;
}

function iconForEvent(icon?: string) {
  const cls = "w-4 h-4";
  switch (icon) {
    case "crown":   return <Crown className={cls} />;
    case "trophy":  return <Trophy className={cls} />;
    case "cake":    return <Cake className={cls} />;
    case "party":   return <Sparkles className={cls} />;
    case "stadium": return <Landmark className={cls} />;
    default:        return <Calendar className={cls} />;
  }
}

/* ─── derived data ─── */

const upcomingEvents = events
  .filter((e) => e.status === "upcoming" || e.status === "live")
  .sort((a, b) => a.date.localeCompare(b.date));

const pastEvents = events
  .filter((e) => e.status === "past")
  .sort((a, b) => b.date.localeCompare(a.date));

const upcomingCount = upcomingEvents.length;
const pastCount = pastEvents.length;

const categoryFilters = [
  { key: "all", label: "Allir" },
  { key: "einvigi", label: "Einvígi" },
  { key: "upptaka", label: "Upptökur" },
  { key: "afmaeli", label: "Afmæli" },
] as const;

/* ─── component ─── */

export function VidburdirContent() {
  const defaultTab = upcomingCount > 0 ? "upcoming" : "past";
  const [tab, setTab] = useState<"upcoming" | "past">(defaultTab);
  const [categoryFilter, setCategoryFilter] = useState<string>("all");

  const filteredPast =
    categoryFilter === "all"
      ? pastEvents
      : pastEvents.filter((e) => e.category === categoryFilter);

  const featured = upcomingEvents.find((e) => e.featured);
  const otherUpcoming = upcomingEvents.filter((e) => !e.featured);

  return (
    <div className="min-h-screen bg-cad-dark">
      {/* ═══ SECTION 1: HERO ═══ */}
      <section
        className="relative overflow-hidden text-center"
        style={{
          background:
            "radial-gradient(ellipse at top, rgba(0,79,254,0.18) 0%, #0a1428 65%)",
          padding: "64px 32px 48px",
        }}
      >
        {/* decorative blurs */}
        <div
          className="pointer-events-none absolute -left-20 -top-20 rounded-full"
          style={{
            width: 350,
            height: 350,
            background: "rgba(0,79,254,0.2)",
            filter: "blur(50px)",
          }}
        />
        <div
          className="pointer-events-none absolute -right-16 -top-10 rounded-full"
          style={{
            width: 300,
            height: 300,
            background: "rgba(0,79,254,0.15)",
            filter: "blur(40px)",
          }}
        />

        <div className="relative z-10 mx-auto max-w-2xl">
          <p className="mb-3 text-xs tracking-[0.2em] text-cad-light">
            EKKERT BORÐFAST
          </p>
          <h1 className="mb-4 text-5xl font-medium tracking-tight text-white">
            Viðburðir
          </h1>
          <p className="mx-auto max-w-[560px] text-sm leading-relaxed text-white/70">
            Frá einvígjum stórmeistara til sérstakra upptöku með áhorfendum.
            Hér eru allir viðburðir Chess After Dark á einum stað.
          </p>

          {/* stats */}
          <div className="mx-auto mt-8 flex max-w-[480px] items-center justify-center gap-10 border-t border-white/[0.08] pt-6">
            {[
              { value: `${upcomingCount + pastCount}+`, label: "viðburðir" },
              { value: "2.400+", label: "gestir" },
              { value: "2019", label: "síðan" },
            ].map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-xl font-medium text-white">{s.value}</p>
                <p className="text-xs text-white/45">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTION 2: TAB TOGGLE ═══ */}
      <div
        className="border-y border-white/[0.05] bg-cad-mid"
        style={{ padding: "12px 32px" }}
      >
        <div
          className="mx-auto flex max-w-[400px] gap-1 rounded-lg bg-white/[0.04] p-1"
          role="tablist"
        >
          <button
            role="tab"
            aria-selected={tab === "upcoming"}
            onClick={() => setTab("upcoming")}
            className={`flex-1 rounded-md px-4 py-2 text-sm transition-all duration-200 ${
              tab === "upcoming"
                ? "bg-cad-electric font-medium text-white"
                : "text-white/55 hover:text-white/75"
            }`}
          >
            Komandi · {upcomingCount}
          </button>
          <button
            role="tab"
            aria-selected={tab === "past"}
            onClick={() => setTab("past")}
            className={`flex-1 rounded-md px-4 py-2 text-sm transition-all duration-200 ${
              tab === "past"
                ? "bg-cad-electric font-medium text-white"
                : "text-white/55 hover:text-white/75"
            }`}
          >
            Liðin · {pastCount}
          </button>
        </div>
      </div>

      {/* ═══ SECTION 3A: UPCOMING ═══ */}
      {tab === "upcoming" && (
        <section className="mx-auto max-w-5xl" style={{ padding: "40px 32px 16px" }}>
          {/* section label */}
          <div className="mb-5 flex items-center gap-2.5">
            <div className="h-[18px] w-[3px] rounded-sm bg-cad-electric" />
            <span className="text-xs tracking-[0.2em] text-cad-light">
              NÆSTU VIÐBURÐIR
            </span>
          </div>

          {/* featured hero card */}
          {featured && <FeaturedCard event={featured} />}

          {/* other upcoming */}
          <div className="mt-4 flex flex-col gap-3">
            {otherUpcoming.map((e) => (
              <UpcomingCard key={e.slug} event={e} />
            ))}
          </div>
        </section>
      )}

      {/* ═══ SECTION 3B: PAST TIMELINE ═══ */}
      {tab === "past" && (
        <section className="mx-auto max-w-5xl" style={{ padding: "40px 32px" }}>
          {/* header row */}
          <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <div className="h-[18px] w-[3px] rounded-sm bg-white/20" />
              <span className="text-xs tracking-[0.2em] text-white/50">
                LIÐNIR VIÐBURÐIR
              </span>
            </div>

            {/* category filters */}
            <div className="flex flex-wrap gap-2">
              {categoryFilters.map((f) => (
                <button
                  key={f.key}
                  onClick={() => setCategoryFilter(f.key)}
                  className={`rounded-full px-3 py-1.5 text-xs transition-all duration-200 ${
                    categoryFilter === f.key
                      ? "bg-cad-electric font-medium text-white"
                      : "border border-white/10 bg-white/[0.05] text-white/70 hover:border-white/20"
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* timeline */}
          <div className="relative">
            {/* vertical line */}
            <div
              className="pointer-events-none absolute left-[19px] hidden md:block"
              style={{
                top: 30,
                bottom: 30,
                width: 1,
                background:
                  "linear-gradient(180deg, rgba(0,79,254,0.4) 0%, rgba(255,255,255,0.1) 100%)",
              }}
            />

            <div className="flex flex-col gap-4">
              {filteredPast.map((e) => (
                <TimelineCard key={e.slug} event={e} />
              ))}
              {filteredPast.length === 0 && (
                <p className="py-10 text-center text-sm text-white/40">
                  Engir viðburðir í þessum flokki.
                </p>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ═══ SECTION 4: CTA BAND ═══ */}
      <section
        className="border-t border-white/[0.05] bg-cad-mid text-center"
        style={{ padding: "40px 32px" }}
      >
        <p className="mb-2 text-xs tracking-[0.2em] text-cad-light">
          MISSTU EKKI AF NÆSTA VIÐBURÐI
        </p>
        <h3 className="mb-6 text-2xl font-medium text-white">
          Fylgstu með okkur
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <a
            href="https://twitch.tv/chessafterdark"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg bg-cad-electric px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:brightness-110 focus-visible:ring-2 focus-visible:ring-cad-electric focus-visible:ring-offset-2 focus-visible:ring-offset-cad-dark"
          >
            <Tv className="h-4 w-4" />
            Fylgja á Twitch
          </a>
          <a
            href="https://www.instagram.com/chessafterdark/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-5 py-2.5 text-sm text-white/80 transition-all duration-200 hover:border-white/30 hover:text-white focus-visible:ring-2 focus-visible:ring-cad-electric focus-visible:ring-offset-2 focus-visible:ring-offset-cad-dark"
          >
            Instagram
          </a>
        </div>
      </section>
    </div>
  );
}

/* ─── FEATURED CARD ─── */

function FeaturedCard({ event }: { event: Event }) {
  const days = daysUntil(event.date);
  const isNear = days >= 0 && days <= 7;

  return (
    <div
      className="overflow-hidden rounded-[20px]"
      style={{
        background:
          "linear-gradient(135deg, #0f1f3d 0%, #0a1428 60%, rgba(0,79,254,0.15) 100%)",
        border: "0.5px solid rgba(0,79,254,0.35)",
      }}
    >
      <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1fr]">
        {/* left */}
        <div className="p-6 md:p-8">
          {isNear && (
            <span className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-red-500/40 bg-red-500/15 px-3 py-1 text-xs text-red-300">
              <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-red-400" />
              NÆSTI VIÐBURÐUR
            </span>
          )}

          <p className="mb-1 text-xs tracking-wider text-white/50">
            {formatDateLong(event.date, event.time)}
          </p>

          <h2 className="mb-3 text-2xl font-medium text-white md:text-3xl">
            {event.title}
          </h2>

          <p className="mb-4 text-sm leading-relaxed text-white/70">
            {event.description}
          </p>

          {/* meta row */}
          <div className="mb-5 flex flex-wrap items-center gap-4 text-xs text-white/50">
            {event.location && (
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5" />
                {event.location}
              </span>
            )}
            {event.highlights?.map((h) => (
              <span key={h} className="inline-flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5" />
                {h}
              </span>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap gap-3">
            {event.twitchUrl && (
              <a
                href={event.twitchUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg bg-cad-electric px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:brightness-110 focus-visible:ring-2 focus-visible:ring-cad-electric focus-visible:ring-offset-2 focus-visible:ring-offset-cad-dark"
              >
                Horfa í beinni
                <ChevronRight className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        {/* right – participants VS */}
        {event.participants && event.participants.length === 2 && (
          <div
            className="flex flex-col items-center justify-center p-6 md:p-8"
            style={{
              background:
                "linear-gradient(180deg, rgba(0,79,254,0.08) 0%, transparent 100%)",
            }}
          >
            <div className="flex items-center gap-6">
              {/* player 1 */}
              <div className="flex flex-col items-center">
                <div className="mb-2 flex h-[70px] w-[70px] items-center justify-center rounded-full border border-white/25 bg-white/10 text-2xl">
                  ♔
                </div>
                <p className="text-xs font-medium text-white">
                  {event.participants[0].name}
                </p>
                {event.participants[0].subtitle && (
                  <p className="text-[10px] text-white/50">
                    {event.participants[0].subtitle}
                  </p>
                )}
              </div>

              <span className="text-lg font-medium text-cad-light">VS</span>

              {/* player 2 */}
              <div className="flex flex-col items-center">
                <div className="mb-2 flex h-[70px] w-[70px] items-center justify-center rounded-full border border-white/25 bg-white/10 text-2xl">
                  ♚
                </div>
                <p className="text-xs font-medium text-white">
                  {event.participants[1].name}
                </p>
                {event.participants[1].subtitle && (
                  <p className="text-[10px] text-white/50">
                    {event.participants[1].subtitle}
                  </p>
                )}
              </div>
            </div>

            {/* countdown */}
            <div
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-black/30 px-3.5 py-2 text-xs text-white/70"
              aria-live="polite"
            >
              <Timer className="h-3.5 w-3.5" />
              {countdownText(event.date, event.time)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ─── UPCOMING CARD (non-featured) ─── */

function UpcomingCard({ event }: { event: Event }) {
  const d = new Date(event.date + "T00:00:00");

  return (
    <div
      className="group flex items-center gap-5 rounded-2xl border transition-all duration-300 hover:translate-x-1 focus-visible:ring-2 focus-visible:ring-cad-electric"
      style={{
        background: "#0f1f3d",
        borderColor: "rgba(255,255,255,0.08)",
        padding: "20px 24px",
      }}
    >
      {/* date tile */}
      <div
        className="flex h-[60px] w-[60px] shrink-0 flex-col items-center justify-center rounded-xl text-white"
        style={{
          background: "linear-gradient(135deg, #004FFE, #0C447C)",
        }}
      >
        <span className="text-[10px] tracking-widest opacity-80">
          {MONTHS_SHORT[d.getMonth()]}
        </span>
        <span className="text-2xl font-medium leading-none">{d.getDate()}</span>
      </div>

      {/* middle */}
      <div className="min-w-0 flex-1">
        <p className="mb-0.5 text-[11px]">
          <span className="text-cad-light">{event.categoryLabel}</span>
          {event.time && (
            <span className="text-white/50"> · {event.time}</span>
          )}
        </p>
        <p className="font-medium text-white">{event.title}</p>
        <p className="mt-0.5 text-xs text-white/55">{event.shortDescription}</p>
      </div>

      {/* arrow */}
      <ChevronRight className="h-5 w-5 shrink-0 text-cad-light opacity-50 transition-opacity group-hover:opacity-100" />
    </div>
  );
}

/* ─── TIMELINE CARD (past) ─── */

function TimelineCard({ event }: { event: Event }) {
  const now = new Date();
  const eventDate = new Date(event.date + "T00:00:00");
  const daysDiff = Math.floor(
    (now.getTime() - eventDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const isRecent = daysDiff <= 30;

  return (
    <div className="flex gap-4">
      {/* timeline dot */}
      <div
        className={`z-[1] hidden h-10 w-10 shrink-0 items-center justify-center rounded-full border bg-cad-mid md:flex ${
          isRecent ? "border-cad-electric" : "border-white/15"
        }`}
      >
        {iconForEvent(event.icon)}
      </div>

      {/* card */}
      <div className="min-w-0 flex-1 rounded-xl border border-white/[0.08] bg-cad-mid p-5 transition-all duration-300 hover:border-cad-electric/30">
        {/* header */}
        <div className="mb-1 flex items-center justify-between">
          <span className="text-[10px] tracking-[0.2em] text-cad-light">
            {event.categoryLabel}
          </span>
          <span className="text-[11px] text-white/50">
            {formatMonthYear(event.date)}
          </span>
        </div>

        <h3 className="mb-1.5 font-medium text-white">{event.title}</h3>

        <p className="line-clamp-2 text-xs leading-relaxed text-white/60">
          {event.description}
        </p>

        {/* meta row */}
        {event.highlights && event.highlights.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-3.5 text-[11px] text-white/45">
            {event.highlights.map((h) => (
              <span key={h} className="inline-flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {h}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
