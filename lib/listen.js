const YT_PREFIX = "https://www.youtube.com/";

export const buildListenUrl = (track) => {
  if (!track) return null;
  if (track.listen_url && typeof track.listen_url === "string") {
    return track.listen_url;
  }
  const query = `${track.artist || ""} ${track.title || ""}`.trim();
  if (!query) return null;
  return `${YT_PREFIX}results?search_query=${encodeURIComponent(query)}`;
};