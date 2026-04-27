import { fetchEpisodes, getDisplayCount } from "@/lib/rss";
import ThattastjornendurContent from "./ThattastjornendurContent";

export const revalidate = 3600;

export default async function ThattastjornendurPage() {
  const episodes = await fetchEpisodes();
  const displayCount = getDisplayCount(episodes);
  return <ThattastjornendurContent displayCount={displayCount} />;
}
