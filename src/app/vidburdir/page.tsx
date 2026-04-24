import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getUpcomingEvents, getPastEvents } from "@/lib/events";
import { formatIcelandicDate } from "@/lib/formatters";

export const metadata: Metadata = {
  title: "Viðburðir | Chess After Dark",
  description:
    "Komandi og liðnir viðburðir Chess After Dark. Einvígi, upptökur og sérstakir þættir.",
  openGraph: {
    title: "Viðburðir Chess After Dark",
    description: "Frá einvígjum stórmeistara til afmælisþátta.",
    images: ["/images/brand/cover-art.png"],
  },
};

export default function VidburdirPage() {
  const upcoming = getUpcomingEvents();
  const past = getPastEvents();
  const featured = upcoming[0] ?? null;

  return (
    <div className="min-h-screen bg-cad-dark">
      {/* Hero */}
      <section
        className="relative overflow-hidden text-center"
        style={{
          background:
            "radial-gradient(ellipse at top, rgba(0,79,254,0.18) 0%, #0a1428 65%)",
          padding: "64px 32px 48px",
        }}
      >
        <div
          className="pointer-events-none absolute -left-20 -top-20 rounded-full"
          style={{
            width: 350,
            height: 350,
            background: "rgba(0,79,254,0.2)",
            filter: "blur(50px)",
          }}
        />
        <div className="relative z-10 mx-auto max-w-2xl">
          <h1 className="mb-4 text-5xl font-medium tracking-tight text-white">
            Viðburðir
          </h1>
          <p className="mx-auto max-w-[560px] text-sm leading-relaxed text-white/70">
            Viðburðir Chess After Dark. Frá einvígjum stórmeistara til sérstakra
            upptaka með áhorfendum. Hér eru allir viðburðir á einum stað.
          </p>
        </div>
      </section>

      {/* Upcoming section */}
      <section className="mx-auto max-w-5xl" style={{ padding: "40px 32px" }}>
        <div className="mb-6 flex items-center gap-2.5">
          <div className="h-[18px] w-[3px] rounded-sm bg-cad-electric" />
          <span className="text-xs tracking-[0.2em] text-cad-light">
            NÆSTI VIÐBURÐUR
          </span>
        </div>

        {featured ? (
          <Link
            href={`/vidburdir/${featured.slug}`}
            className="group block overflow-hidden rounded-2xl bg-cad-mid border border-cad-electric/10 hover:border-cad-electric/40 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cad-electric/5"
          >
            <div className="relative aspect-[21/9] overflow-hidden">
              <Image
                src={featured.coverImage}
                alt={featured.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cad-dark via-cad-dark/40 to-transparent" />
              <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-full bg-cad-electric text-white text-[10px] uppercase tracking-widest font-medium">
                <span className="block w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                Næsti viðburður
              </div>
            </div>

            <div className="p-8">
              <div className="flex items-center gap-3 text-[11px] uppercase tracking-widest text-cad-light font-medium mb-3">
                <span>{formatIcelandicDate(featured.dateObj)}</span>
                {featured.time && (
                  <>
                    <span className="text-cad-light/40">·</span>
                    <span>Kl. {featured.time}</span>
                  </>
                )}
                <span className="text-cad-light/40">·</span>
                <span>{featured.location}</span>
              </div>

              <h2 className="text-3xl md:text-4xl font-medium text-white mb-3 group-hover:text-cad-electric transition-colors">
                {featured.title}
              </h2>

              <p className="text-cad-light/80 text-base leading-relaxed mb-6 max-w-3xl">
                {featured.excerpt}
              </p>

              <div className="flex items-center gap-2 flex-wrap">
                {featured.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded-md bg-cad-dark/60 text-cad-light text-[10px] uppercase tracking-widest font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ) : (
          <div className="rounded-2xl border border-white/[0.08] bg-cad-mid p-12 text-center">
            <p className="text-sm text-white/50">
              Engir komandi viðburðir núna. Fylgstu með samfélagsmiðlum fyrir
              tilkynningar.
            </p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <a
                href="https://twitch.tv/chessafterdark"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-cad-electric hover:underline"
              >
                Twitch
              </a>
              <a
                href="https://www.instagram.com/chessafterdark/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-cad-electric hover:underline"
              >
                Instagram
              </a>
            </div>
          </div>
        )}
      </section>

      {/* Past events section */}
      {past.length > 0 && (
        <section
          className="mx-auto max-w-5xl"
          style={{ padding: "0 32px 48px" }}
        >
          <div className="mb-6 flex items-center gap-2.5">
            <div className="h-[18px] w-[3px] rounded-sm bg-white/20" />
            <span className="text-xs tracking-[0.2em] text-white/50">
              LIÐNIR VIÐBURÐIR
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {past.map((event) => (
              <Link
                key={event.slug}
                href={`/vidburdir/${event.slug}`}
                className="group block rounded-xl overflow-hidden bg-cad-mid border border-cad-electric/10 hover:border-cad-electric/40 transition-all hover:-translate-y-0.5"
              >
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={event.coverImage}
                    alt={event.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <div className="text-[10px] uppercase tracking-widest text-cad-light/60 font-medium mb-2">
                    {formatIcelandicDate(event.dateObj)}
                  </div>
                  <h3 className="text-lg font-medium text-white mb-2 group-hover:text-cad-electric transition-colors line-clamp-2">
                    {event.title}
                  </h3>
                  <p className="text-cad-light/70 text-sm leading-relaxed line-clamp-2 mb-3">
                    {event.excerpt}
                  </p>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {event.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-[10px] uppercase tracking-widest text-cad-light/60 font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* CTA band */}
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
            className="inline-flex items-center gap-2 rounded-lg bg-cad-electric px-5 py-2.5 text-sm font-medium text-white transition-all duration-200 hover:brightness-110"
          >
            Fylgja á Twitch
          </a>
          <a
            href="https://www.instagram.com/chessafterdark/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-5 py-2.5 text-sm text-white/80 transition-all duration-200 hover:border-white/30 hover:text-white"
          >
            Instagram
          </a>
        </div>
      </section>
    </div>
  );
}
