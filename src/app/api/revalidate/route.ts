import { revalidatePath, revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { getCategorySlugFor } from "@/lib/categories";

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
      // Revalida listing individual
      if (slug) revalidatePath(`/propiedades/${slug}/`);

      // Revalida todas las páginas de listado que podrían mostrar esta propiedad
      revalidatePath("/");
      revalidatePath("/propiedades-en-venta/");
      revalidatePath("/propiedades-en-alquiler/");

      // Revalida categoría específica si tenemos los datos
      if (body.businessType && body.propertyType) {
        const categorySlug = getCategorySlugFor(
          body.propertyType,
          body.businessType as "venta" | "alquiler"
        );
        revalidatePath(`/${categorySlug}/`);
        if (body.zone) {
          const zoneSlug = body.zone
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/\s+/g, "-");
          revalidatePath(`/${categorySlug}/${zoneSlug}/`);
        }
      }

      revalidateTag("properties");
    }

    if (docType === "neighborhood") {
      if (slug) revalidatePath(`/barrios/${slug}/`);
      revalidatePath("/barrios/");
      revalidateTag("neighborhoods");
    }

    if (docType === "guide") {
      if (slug) revalidatePath(`/guias/${slug}/`);
      revalidatePath("/guias/");
      revalidateTag("guides");
    }

    if (docType === "agent") {
      if (slug) revalidatePath(`/agentes/${slug}/`);
      revalidatePath("/agentes/");
      revalidateTag("agents");
    }

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
