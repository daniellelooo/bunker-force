import { supabase, supabaseAdmin } from "@/lib/supabase";

export type SiteConfig = {
  heroVideo: string | null;
  heroDesktopImage: string | null;
  heroMobileImage: string | null;
  categorySuperiorImage: string | null;
  categoryInferiorImage: string | null;
  categoryCalzadoImage: string | null;
  categoryAccessoriesImage: string | null;
};

export type ResolvedSiteConfig = {
  heroVideo: string | null;
  heroDesktopImage: string;
  heroMobileImage: string;
  categorySuperiorImage: string;
  categoryInferiorImage: string;
  categoryCalzadoImage: string;
  categoryAccessoriesImage: string;
};

export const DEFAULTS: ResolvedSiteConfig = {
  heroVideo: "/hero.mp4",
  heroDesktopImage: "/img-hero.webp",
  heroMobileImage: "/img-hero.webp",
  categorySuperiorImage: "/ropa-superior.webp",
  categoryInferiorImage: "/ropa-inferior.webp",
  categoryCalzadoImage: "/calzado.webp",
  categoryAccessoriesImage: "/accesorios.webp",
};

function resolve(raw: SiteConfig | null): ResolvedSiteConfig {
  if (!raw) return DEFAULTS;
  return {
    heroVideo: raw.heroVideo ?? DEFAULTS.heroVideo,
    heroDesktopImage: raw.heroDesktopImage ?? DEFAULTS.heroDesktopImage,
    heroMobileImage: raw.heroMobileImage ?? DEFAULTS.heroMobileImage,
    categorySuperiorImage: raw.categorySuperiorImage ?? DEFAULTS.categorySuperiorImage,
    categoryInferiorImage: raw.categoryInferiorImage ?? DEFAULTS.categoryInferiorImage,
    categoryCalzadoImage: raw.categoryCalzadoImage ?? DEFAULTS.categoryCalzadoImage,
    categoryAccessoriesImage: raw.categoryAccessoriesImage ?? DEFAULTS.categoryAccessoriesImage,
  };
}

function fromRow(row: Record<string, unknown> | null): SiteConfig | null {
  if (!row) return null;
  return {
    heroVideo: (row.hero_video as string | null) ?? null,
    heroDesktopImage: (row.hero_desktop_image as string | null) ?? null,
    heroMobileImage: (row.hero_mobile_image as string | null) ?? null,
    categorySuperiorImage: (row.category_superior_image as string | null) ?? null,
    categoryInferiorImage: (row.category_inferior_image as string | null) ?? null,
    categoryCalzadoImage: (row.category_calzado_image as string | null) ?? null,
    categoryAccessoriesImage: (row.category_accessories_image as string | null) ?? null,
  };
}

export async function getSiteConfig(): Promise<ResolvedSiteConfig> {
  try {
    const { data } = await supabase.from("site_config").select("*").eq("id", 1).maybeSingle();
    return resolve(fromRow(data));
  } catch {
    return DEFAULTS;
  }
}

export async function getRawSiteConfig(): Promise<SiteConfig> {
  const { data } = await supabaseAdmin.from("site_config").select("*").eq("id", 1).maybeSingle();
  return fromRow(data) ?? {
    heroVideo: null,
    heroDesktopImage: null,
    heroMobileImage: null,
    categorySuperiorImage: null,
    categoryInferiorImage: null,
    categoryCalzadoImage: null,
    categoryAccessoriesImage: null,
  };
}

export async function updateSiteConfig(patch: Partial<SiteConfig>): Promise<SiteConfig> {
  const dbPatch: Record<string, string | null> = {};
  if ("heroVideo" in patch) dbPatch.hero_video = patch.heroVideo ?? null;
  if ("heroDesktopImage" in patch) dbPatch.hero_desktop_image = patch.heroDesktopImage ?? null;
  if ("heroMobileImage" in patch) dbPatch.hero_mobile_image = patch.heroMobileImage ?? null;
  if ("categorySuperiorImage" in patch) dbPatch.category_superior_image = patch.categorySuperiorImage ?? null;
  if ("categoryInferiorImage" in patch) dbPatch.category_inferior_image = patch.categoryInferiorImage ?? null;
  if ("categoryCalzadoImage" in patch) dbPatch.category_calzado_image = patch.categoryCalzadoImage ?? null;
  if ("categoryAccessoriesImage" in patch) dbPatch.category_accessories_image = patch.categoryAccessoriesImage ?? null;

  const { data, error } = await supabaseAdmin
    .from("site_config")
    .upsert({ id: 1, ...dbPatch, updated_at: new Date().toISOString() })
    .eq("id", 1)
    .select("*")
    .single();

  if (error) throw error;
  return fromRow(data)!;
}
