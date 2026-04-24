import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { getEventBySlug, getAllEvents } from "@/lib/events";
import { formatIcelandicDate } from "@/lib/formatters";
import { MDXRemote } from "next-mdx-remote/rsc";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return getAllEvents().map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) return {};
  return {
    title: `${event.title} | Chess After Dark`,
    description: event.excerpt,
    openGraph: {
      title: event.title,
      description: event.excerpt,
      images: [event.coverImage],
    },
  };
}

export default async function EventPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = getEventBySlug(slug);
  if (!event) notFound();

  return (
    <article className="max-w-3xl mx-auto px-6 py-16">
      {/* Back link */}
      <Link
        href="/vidburdir"
        className="inline-flex items-center gap-2 text-cad-light/60 hover:text-cad-light text-sm font-medium mb-8"
      >
        <ChevronLeft className="w-4 h-4" />
        Allir viðburðir
      </Link>

      {/* Meta */}
      <div className="flex items-center gap-3 text-[11px] uppercase tracking-widest text-cad-light font-medium mb-4">
        <span>{formatIcelandicDate(event.dateObj)}</span>
        {event.time && (
          <>
            <span className="text-cad-light/40">·</span>
            <span>Kl. {event.time}</span>
          </>
        )}
        <span className="text-cad-light/40">·</span>
        <span>{event.location}</span>
      </div>

      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-medium text-white leading-tight mb-6">
        {event.title}
      </h1>

      {/* Excerpt */}
      <p className="text-xl text-cad-light/80 leading-relaxed mb-10 max-w-2xl">
        {event.excerpt}
      </p>

      {/* Cover */}
      <div className="relative aspect-[21/9] rounded-xl overflow-hidden mb-12">
        <Image
          src={event.coverImage}
          alt={event.title}
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Optional upcoming CTAs */}
      {event.status === "upcoming" &&
        (event.ticketUrl || event.liveStream) && (
          <div className="flex gap-3 mb-12">
            {event.ticketUrl && (
              <a
                href={event.ticketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-lg bg-cad-electric text-white font-medium hover:bg-cad-electric/90 transition-colors"
              >
                Tryggja miða
              </a>
            )}
            {event.liveStream && (
              <a
                href={event.liveStream}
                target="_blank"
                rel="noopener noreferrer"
                className="px-6 py-3 rounded-lg border border-cad-electric/40 text-cad-light hover:border-cad-electric hover:text-white transition-colors font-medium"
              >
                Horfa í beinni
              </a>
            )}
          </div>
        )}

      {/* MDX body */}
      <div
        className="prose prose-invert prose-lg max-w-none
        prose-headings:font-medium prose-headings:text-white
        prose-p:text-cad-light/90 prose-p:leading-relaxed
        prose-a:text-cad-electric prose-a:no-underline hover:prose-a:underline
        prose-img:rounded-xl prose-img:my-8
        prose-strong:text-white prose-strong:font-medium
        prose-blockquote:border-l-cad-electric prose-blockquote:text-cad-light"
      >
        <MDXRemote source={event.body} />
      </div>

      {/* Recap video for past events */}
      {event.status === "past" && event.recapVideo && (
        <div className="mt-12 aspect-video rounded-xl overflow-hidden">
          <iframe
            src={event.recapVideo}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            title={`${event.title} recap`}
          />
        </div>
      )}

      {/* Tags */}
      <div className="flex items-center gap-2 flex-wrap mt-12 pt-8 border-t border-cad-electric/10">
        {event.tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1.5 rounded-md bg-cad-mid text-cad-light text-[11px] uppercase tracking-widest font-medium"
          >
            #{tag}
          </span>
        ))}
      </div>
    </article>
  );
}
