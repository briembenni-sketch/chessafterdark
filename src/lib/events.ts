import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const EVENTS_DIR = path.join(process.cwd(), "content", "events");

export interface EventFrontmatter {
  title: string;
  slug: string;
  date: string;
  time?: string;
  location: string;
  coverImage: string;
  tags: string[];
  excerpt: string;
  recapVideo?: string;
  liveStream?: string;
  ticketUrl?: string;
}

export interface Event extends EventFrontmatter {
  body: string;
  status: "upcoming" | "past";
  dateObj: Date;
}

export function getAllEvents(): Event[] {
  if (!fs.existsSync(EVENTS_DIR)) return [];

  const files = fs.readdirSync(EVENTS_DIR).filter((f) => f.endsWith(".mdx"));

  return files.map((filename) => {
    const raw = fs.readFileSync(path.join(EVENTS_DIR, filename), "utf-8");
    const { data, content } = matter(raw);
    const dateObj = new Date(data.date);
    return {
      ...(data as EventFrontmatter),
      body: content,
      dateObj,
      status: dateObj.getTime() > Date.now() ? "upcoming" : "past",
    };
  });
}

export function getUpcomingEvents(): Event[] {
  return getAllEvents()
    .filter((e) => e.status === "upcoming")
    .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());
}

export function getPastEvents(): Event[] {
  return getAllEvents()
    .filter((e) => e.status === "past")
    .sort((a, b) => b.dateObj.getTime() - a.dateObj.getTime());
}

export function getEventBySlug(slug: string): Event | null {
  return getAllEvents().find((e) => e.slug === slug) ?? null;
}
