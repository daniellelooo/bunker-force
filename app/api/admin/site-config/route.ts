import { NextRequest } from "next/server";
import { isAdminRequest, unauthorizedResponse } from "@/lib/auth";
import { getRawSiteConfig, updateSiteConfig, type SiteConfig } from "@/lib/site-config";

const ALLOWED_KEYS: (keyof SiteConfig)[] = [
  "heroVideo",
  "heroDesktopImage",
  "heroMobileImage",
  "categorySuperiorImage",
  "categoryInferiorImage",
  "categoryCalzadoImage",
  "categoryAccessoriesImage",
];

export async function GET(req: NextRequest) {
  if (!(await isAdminRequest(req))) return unauthorizedResponse();
  const config = await getRawSiteConfig();
  return Response.json(config);
}

export async function PUT(req: NextRequest) {
  if (!(await isAdminRequest(req))) return unauthorizedResponse();

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "JSON inválido" }, { status: 400 });
  }
  if (!body || typeof body !== "object") {
    return Response.json({ error: "Body inválido" }, { status: 400 });
  }

  const patch: Partial<SiteConfig> = {};
  for (const key of ALLOWED_KEYS) {
    if (key in (body as Record<string, unknown>)) {
      const val = (body as Record<string, unknown>)[key];
      if (val === null || typeof val === "string") {
        patch[key] = val;
      }
    }
  }

  try {
    const updated = await updateSiteConfig(patch);
    return Response.json(updated);
  } catch (err) {
    return Response.json({ error: (err as Error).message }, { status: 500 });
  }
}
