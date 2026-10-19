export const VEHICLE_FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?auto=format&fit=crop&w=1000&q=85",
];

export const COMPANY_FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1560179707-f14e90ef3623?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&w=1000&q=85",
];

const IMAGE_FIELDS = ["image", "logo", "logoUrl", "coverImage"] as const;

function readImageCandidates(entity: object) {
  const record = entity as Record<string, unknown>;
  const images = Array.isArray(record.images)
    ? record.images.filter((item): item is string => typeof item === "string")
    : [];
  const singles = IMAGE_FIELDS.map((field) => record[field]).filter(
    (value): value is string => typeof value === "string",
  );

  return [...images, ...singles];
}

function pickFromArray(images: readonly string[], seed: string) {
  if (images.length === 0) {
    return "";
  }

  let hash = 0;

  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }

  return images[hash % images.length];
}

export function resolveEntityImage(
  entity: object,
  fallbacks: readonly string[],
  seed: string,
) {
  const image = readImageCandidates(entity).find(
    (value) => typeof value === "string" && value.trim().length > 0,
  );

  return image?.trim() || pickFromArray(fallbacks, seed);
}

export function applyImageFallback(
  image: HTMLImageElement,
  fallbacks: readonly string[],
  seed: string,
) {
  const fallback = pickFromArray(fallbacks, seed);

  if (!fallback || image.src === fallback) {
    return;
  }

  image.src = fallback;
}
