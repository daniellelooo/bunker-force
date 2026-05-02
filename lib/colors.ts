export const PRESET_COLOR_MAP: Record<string, { label: string; hex: string }> = {
  "black-ops":    { label: "Black Ops",     hex: "#000000" },
  "od-green":     { label: "Verde Militar", hex: "#3d4231" },
  "wolf-grey":    { label: "Gris Lobo",     hex: "#6b7280" },
  "navy":         { label: "Azul Marino",   hex: "#1e3a5f" },
  "coyote-tan":   { label: "Coyote Tan",    hex: "#937b5d" },
  "multicam":     { label: "MultiCam",      hex: "#6b6e56" },
  "ranger-green": { label: "Verde Ranger",  hex: "#3d4a35" },
  "dark-brown":   { label: "Café Oscuro",   hex: "#4a3728" },
};

/**
 * Resolves a stored color ID to display label and hex.
 * Supports:
 *  - Preset slugs:   "od-green"            → { label: "Verde Militar", hex: "#3d4231" }
 *  - Custom format:  "Azul Royal|#1a73e8"  → { label: "Azul Royal",    hex: "#1a73e8" }
 *  - Legacy hex:     "#1a73e8"             → { label: "#1a73e8",        hex: "#1a73e8" }
 */
export function resolveColor(colorId: string): { label: string; hex: string } {
  if (PRESET_COLOR_MAP[colorId]) return PRESET_COLOR_MAP[colorId];
  if (colorId.includes("|")) {
    const [label, hex] = colorId.split("|");
    return { label, hex };
  }
  // Legacy hex-only (saved before the "Name|#hex" format)
  const hex = colorId.startsWith("#") ? colorId : "#888";
  return { label: colorId, hex };
}

export function resolveColorLabel(colorId: string): string {
  return resolveColor(colorId).label;
}

export function resolveColorHex(colorId: string): string {
  return resolveColor(colorId).hex;
}
