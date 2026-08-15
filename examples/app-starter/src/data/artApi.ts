/**
 * Creative public APIs for designlab206 inspiration board.
 *
 * Strategy (always fill a full grid with real photos):
 * 1. Met Museum `hasImages=true` — primaryImageSmall is browser-reliable
 * 2. Art Institute of Chicago public-domain IIIF when Met is thin
 * 3. Seeded Lorem Picsum so we never show empty / broken tiles
 *
 * No API keys required.
 */

export type ArtWork = {
  id: number;
  title: string;
  artist: string;
  date: string;
  /** Always a loadable URL — never null. */
  imageUrl: string;
  pageUrl: string;
  source: "met" | "artic" | "picsum";
};

type ArticSearchResponse = {
  data?: Array<{
    id: number;
    title?: string;
    artist_title?: string | null;
    date_display?: string | null;
    image_id?: string | null;
  }>;
  config?: { iiif_url?: string };
};

type MetSearchResponse = { objectIDs?: number[] | null };
type MetObject = {
  objectID: number;
  title?: string;
  artistDisplayName?: string;
  objectDate?: string;
  primaryImageSmall?: string;
  primaryImage?: string;
  objectURL?: string;
};

const ARTIC_FIELDS = "id,title,image_id,artist_title,date_display";

/** Reliable free photo when museum CDNs fail (seeded = stable per id). */
export function picsumUrl(seed: string | number, w = 420, h = 320): string {
  return `https://picsum.photos/seed/${encodeURIComponent(String(seed))}/${w}/${h}`;
}

/** Artic IIIF — width-only form is most compatible. */
export function articImageUrl(
  iiifBase: string,
  imageId: string,
  width = 420,
): string {
  const base = iiifBase.replace(/\/$/, "");
  return `${base}/${imageId}/full/${width},/0/default.jpg`;
}

async function searchMet(query: string, limit: number): Promise<ArtWork[]> {
  const q = query.trim() || "design";
  const searchUrl =
    `https://collectionapi.metmuseum.org/public/collection/v1/search` +
    `?hasImages=true&q=${encodeURIComponent(q)}`;

  const searchRes = await fetch(searchUrl);
  if (!searchRes.ok) return [];
  const searchJson = (await searchRes.json()) as MetSearchResponse;
  const ids = searchJson.objectIDs ?? [];
  if (!ids.length) return [];

  const works: ArtWork[] = [];
  // Sequential enough to avoid stampede; stop once full
  for (const id of ids.slice(0, 40)) {
    if (works.length >= limit) break;
    try {
      const r = await fetch(
        `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`,
      );
      if (!r.ok) continue;
      const o = (await r.json()) as MetObject;
      const img = (o.primaryImageSmall || o.primaryImage || "").trim();
      if (!img.startsWith("http")) continue;
      works.push({
        id: o.objectID,
        title: o.title?.trim() || "Untitled",
        artist: o.artistDisplayName?.trim() || "Unknown artist",
        date: o.objectDate?.trim() || "",
        imageUrl: img,
        pageUrl:
          o.objectURL?.trim() ||
          `https://www.metmuseum.org/art/collection/search/${o.objectID}`,
        source: "met",
      });
    } catch {
      /* skip */
    }
  }
  return works;
}

async function searchArtic(query: string, limit: number): Promise<ArtWork[]> {
  const q = query.trim() || "design";
  const url =
    `https://api.artic.edu/api/v1/artworks/search` +
    `?q=${encodeURIComponent(q)}` +
    `&query[term][is_public_domain]=true` +
    `&limit=${Math.max(limit * 4, 24)}` +
    `&fields=${ARTIC_FIELDS}`;

  const res = await fetch(url);
  if (!res.ok) return [];
  const json = (await res.json()) as ArticSearchResponse;
  const iiif = json.config?.iiif_url ?? "https://www.artic.edu/iiif/2";

  return (json.data ?? [])
    .filter((row) => !!row.image_id)
    .slice(0, limit)
    .map((row) => ({
      id: row.id,
      title: row.title?.trim() || "Untitled",
      artist: row.artist_title?.trim() || "Unknown artist",
      date: row.date_display?.trim() || "",
      imageUrl: articImageUrl(iiif, row.image_id!, 420),
      pageUrl: `https://www.artic.edu/artworks/${row.id}`,
      source: "artic" as const,
    }));
}

/**
 * Search museum collections and always return `limit` cards with real photos.
 */
export async function searchArtworks(
  query: string,
  limit = 6,
): Promise<ArtWork[]> {
  const q = query.trim() || "design";
  const out: ArtWork[] = [];
  const seen = new Set<number>();

  // Met first — hasImages + primaryImageSmall is very reliable in browsers
  try {
    for (const w of await searchMet(q, limit)) {
      if (seen.has(w.id)) continue;
      seen.add(w.id);
      out.push(w);
      if (out.length >= limit) break;
    }
  } catch {
    /* continue */
  }

  if (out.length < limit) {
    try {
      for (const w of await searchArtic(q, limit - out.length)) {
        if (seen.has(w.id)) continue;
        seen.add(w.id);
        out.push(w);
        if (out.length >= limit) break;
      }
    } catch {
      /* continue */
    }
  }

  // Guarantee full grid with seeded free photography
  let i = 0;
  while (out.length < limit) {
    const seed = `designlab-${q.replace(/\s+/g, "-").slice(0, 32)}-${i}`;
    out.push({
      id: 900_000 + i,
      title: `${q} study`,
      artist: "Open photo reference",
      date: "",
      imageUrl: picsumUrl(seed, 420, 320),
      pageUrl: `https://picsum.photos/seed/${encodeURIComponent(seed)}/info`,
      source: "picsum",
    });
    i++;
  }

  return out.slice(0, limit);
}

/** Swap a dead museum URL for a stable free photo. */
export function fallbackImageUrl(work: Pick<ArtWork, "id" | "title">): string {
  return picsumUrl(
    `designlab-fallback-${work.id}-${work.title.slice(0, 20)}`,
    420,
    320,
  );
}

/** Curated topics for the inspiration board. */
export const ART_TOPICS = [
  { value: "poster", label: "Posters" },
  { value: "architecture", label: "Architecture" },
  { value: "textile", label: "Textiles" },
  { value: "photography", label: "Photo" },
  { value: "ceramics", label: "Ceramics" },
  { value: "painting", label: "Painting" },
] as const;
