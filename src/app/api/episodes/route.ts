import { NextResponse } from "next/server";
import { fetchEpisodes } from "@/lib/rss";

export const revalidate = 3600;

export async function GET() {
  const episodes = await fetchEpisodes();
  return NextResponse.json(episodes);
}
