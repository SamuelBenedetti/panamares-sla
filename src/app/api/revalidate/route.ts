import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { getCategorySlugFor } from "@/lib/categories";
import { SLUG_MAP_ES_TO_EN, deriveEnSlug } from "@/lib/i18n";

// Tier-2 category EN slugs (e.g. "apartments-for-sale"). Derived once at module
// load from the canonical ES → EN map. Used to revalidate every
// /en/{category}/{neighborhood}/ that could surface a given neighborhood when
// its humanReviewed flag flips.
const EN_CATEGORY_SLUGS: string[] = Object.entries(SLUG_MAP_ES_TO_EN)
  .filter(([es]) => /^\/[a-z-]+-en-(venta|alquiler)$/.test(es))
  .map(([, en]) => en.replace(/^\/en\//, ""));

function slugifyZone(raw: string): string {
  return raw
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/\s+/g, "-");
}

export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");

  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }

  let body: { _type?: string; slug?: { current?: string }; businessType?: string; propertyType?: string; zone?: string } = {};
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const docType = body._type;
  const slug = body.slug?.current;

  try {
    if (docType === "property") {
      // ── ES paths ───────────────────────────────────────────────────────────
      if (slug) revalidatePath(`/propiedades/${slug}/`);
      revalidatePath("/");
      revalidatePath("/propiedades-en-venta/");
      revalidatePath("/propiedades-en-alquiler/");

      if (body.businessType && body.propertyType) {
        const categorySlug = getCategorySlugFor(
          body.propertyType,
          body.businessType as "venta" | "alquiler"
        );
        revalidatePath(`/${categorySlug}/`);

        const enCategoryPath = SLUG_MAP_ES_TO_EN[`/${categorySlug}`];
        if (enCategoryPath) revalidatePath(`${enCategoryPath}/`);

        if (body.zone) {
          const zoneSlug = slugifyZone(body.zone);
          revalidatePath(`/${categorySlug}/${zoneSlug}/`);
          if (enCategoryPath) {
            revalidatePath(`${enCategoryPath}/${zoneSlug}/`);
          }
        }
      }

      // ── EN paths ───────────────────────────────────────────────────────────
      if (slug) revalidatePath(`/en/properties/${deriveEnSlug(slug)}/`);
      revalidatePath("/en");
      revalidatePath("/en/properties-for-sale/");
      revalidatePath("/en/properties-for-rent/");

      revalidateTag("properties");
    }

    if (docType === "neighborhood") {
      // ── ES paths ───────────────────────────────────────────────────────────
      if (slug) revalidatePath(`/barrios/${slug}/`);
      revalidatePath("/barrios/");

      // ── EN paths ───────────────────────────────────────────────────────────
      if (slug) {
        revalidatePath(`/en/neighborhoods/${slug}/`);
        // Every /en/{category}/{neighborhood} that could surface or hide the
        // neighborhood when its humanReviewed gate flips.
        for (const enCat of EN_CATEGORY_SLUGS) {
          revalidatePath(`/en/${enCat}/${slug}/`);
        }
      }
      revalidatePath("/en/neighborhoods/");

      revalidateTag("neighborhoods");
    }

    if (docType === "guide") {
      if (slug) {
        revalidatePath(`/guias/${slug}/`);
        revalidatePath(`/en/guides/${slug}/`);
      }
      revalidatePath("/guias/");
      revalidatePath("/en/guides/");
      revalidateTag("guides");
    }

    if (docType === "agent") {
      if (slug) {
        revalidatePath(`/agentes/${slug}/`);
        revalidatePath(`/en/agents/${slug}/`);
      }
      revalidatePath("/agentes/");
      revalidatePath("/en/agents/");
      revalidateTag("agents");
    }

    // Blanket Sanity-query cache invalidation — every sanityFetch call is
    // tagged with "sanity" (see src/sanity/lib/client.ts). Without this, path
    // revalidation regenerates the page but reads stale doc data from the
    // 60s-cached fetch layer, which masks humanReviewed gate flips.
    revalidateTag("sanity");

    return NextResponse.json({
      revalidated: true,
      docType,
      slug: slug ?? null,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Revalidation failed", detail: String(err) },
      { status: 500 }
    );
  }
}

// Health check
export async function GET(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get("secret");
  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ error: "Invalid secret" }, { status: 401 });
  }
  return NextResponse.json({ ok: true, timestamp: new Date().toISOString() });
}
