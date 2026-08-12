export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  // Plain 11-char id
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed;
  try {
    const u = new URL(trimmed);
    if (u.hostname === "youtu.be") return u.pathname.slice(1).split("/")[0] || null;
    if (u.hostname.includes("youtube.com")) {
      const v = u.searchParams.get("v");
      if (v) return v;
      const parts = u.pathname.split("/").filter(Boolean);
      const i = parts.findIndex((p) => p === "embed" || p === "shorts" || p === "live");
      if (i >= 0 && parts[i + 1]) return parts[i + 1];
    }
  } catch {
    // fall through
  }
  const m = trimmed.match(/[a-zA-Z0-9_-]{11}/);
  return m ? m[0] : null;
}

export function youtubeEmbedUrl(videoId: string): string {
  return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1`;
}

export function youtubeThumbnail(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}
