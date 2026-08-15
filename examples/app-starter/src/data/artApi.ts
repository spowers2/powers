/**
 * Creative public API — Art Institute of Chicago (no key required).
 * Powers createQuery + fine-grained UI demo for designlab206.
 */

export type ArtWork = {
  id: number;
  title: string;
  artist: string;
  date: string;
  imageUrl: string | null;
  pageUrl: string;
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

const FIELDS = "id,title,image_id,artist_title,date_display";

/** Map IIIF image id → CDN URL (Artic convention). */
export function articImageUrl(
  iiifBase: string,
  imageId: string,
  width = 400,
): string {
  const base = iiifBase.replace(/\/$/, "");
  return `${base}/${imageId}/full/${width},/0/default.jpg`;
}

/**
 * Search the Art Institute collection. Safe for demos — CORS-friendly public API.
 */
export async function searchArtworks(
  query: string,
  limit = 6,
): Promise<ArtWork[]> {
  const q = query.trim() || "design";
  const url =
    `https://api.artic.edu/api/v1/artworks/search` +
    `?q=${encodeURIComponent(q)}` +
    `&limit=${limit}` +
    `&fields=${FIELDS}`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`Art API ${res.status}`);
  const json = (await res.json()) as ArticSearchResponse;
  const iiif = json.config?.iiif_url ?? "https://www.artic.edu/iiif/2";

  return (json.data ?? []).map((row) => ({
    id: row.id,
    title: row.title?.trim() || "Untitled",
    artist: row.artist_title?.trim() || "Unknown artist",
    date: row.date_display?.trim() || "",
    imageUrl: row.image_id
      ? articImageUrl(iiif, row.image_id, 420)
      : null,
    pageUrl: `https://www.artic.edu/artworks/${row.id}`,
  }));
}

/** Curated topics for the inspiration board. */
export const ART_TOPICS = [
  { value: "poster design", label: "Posters" },
  { value: "architecture", label: "Architecture" },
  { value: "textile", label: "Textiles" },
  { value: "photography", label: "Photo" },
  { value: "ceramics", label: "Ceramics" },
  { value: "color field", label: "Color field" },
] as const;
