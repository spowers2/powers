/**
 * Free stock photography via Unsplash CDN.
 * Photos are free to use (Unsplash License). Credit shown in the app footer.
 * https://unsplash.com/license
 */

const u = (id: string, w = 900) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

export const PHOTOS = {
  hero: u("photo-1517248135467-4c7edcad34c4", 1600),
  ambiance: u("photo-1414235077428-338989a2e8c0", 900),
  pasta: u("photo-1473093295043-cdd812d0e601", 700),
  salad: u("photo-1512621776951-a57141f2eefd", 700),
  steak: u("photo-1544025162-d76694265947", 700),
  dessert: u("photo-1488477181946-6428a0291777", 700),
  cocktail: u("photo-1514362545857-3bc16c4c7d1b", 700),
  pizza: u("photo-1513104890138-7c749659a591", 700),
  brunch: u("photo-1504754524776-8f4f37790ca0", 700),
  soup: u("photo-1547592166-23ac45744acd", 700),
  fish: u("photo-1519708227418-c8fd9a32b7a2", 700),
  bread: u("photo-1509440159596-0249088772ff", 700),
} as const;

export const PHOTO_CREDIT =
  "Photos from Unsplash (free license) — restaurant interiors & food.";
