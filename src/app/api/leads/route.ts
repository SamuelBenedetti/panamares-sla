import { NextResponse } from "next/server";
import { createClient } from "next-sanity";
import { escapeHtml, isValidEmail } from "@/lib/utils";

// Simple in-memory rate limiter: max 5 requests per IP per 10 minutes
const rateMap = new Map<string, { count: number; resetAt: number }>();
const LIMIT = 5;
const WINDOW_MS = 10 * 60 * 1000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + WINDOW_MS });
    return false;
  }
  if (entry.count >= LIMIT) return true;
  entry.count++;
  return false;
}

const sanityProjectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
if (!sanityProjectId) {
  throw new Error(
    "Missing env var NEXT_PUBLIC_SANITY_PROJECT_ID — set it in your environment before starting the server."
  );
}

const writeClient = createClient({
  projectId: sanityProjectId,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

export async function POST(req: Request) {
  try {
    const ip =
      req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
      req.headers.get("x-real-ip") ??
      "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Demasiadas solicitudes. Intenta de nuevo en unos minutos." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { name, email, phone, message, propertyId } = body;

    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json({ error: "Nombre inválido" }, { status: 400 });
    }
    if (!email || typeof email !== "string" || !isValidEmail(email)) {
      return NextResponse.json({ error: "Email inválido" }, { status: 400 });
    }

    // Save lead to Sanity
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const doc: any = {
      _type: "lead",
      name,
      email,
      phone: phone || undefined,
      message: message || undefined,
      createdAt: new Date().toISOString(),
    };

    if (propertyId) {
      doc.property = { _type: "reference", _ref: propertyId };
    }

    await writeClient.create(doc);

    // Send email via Resend (requires both RESEND_API_KEY and LEADS_EMAIL)
    const leadsEmail = process.env.LEADS_EMAIL;
    if (process.env.RESEND_API_KEY && leadsEmail) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: process.env.RESEND_FROM ?? "onboarding@resend.dev",
          to: leadsEmail,
          subject: `Nuevo lead: ${name}`,
          html: `
            <h2>Nuevo lead desde Panamares</h2>
            <p><strong>Nombre:</strong> ${escapeHtml(String(name))}</p>
            <p><strong>Email:</strong> ${escapeHtml(String(email))}</p>
            ${phone ? `<p><strong>Teléfono:</strong> ${escapeHtml(String(phone))}</p>` : ""}
            ${message ? `<p><strong>Mensaje:</strong> ${escapeHtml(String(message))}</p>` : ""}
            ${propertyId ? `<p><strong>Propiedad ID:</strong> ${escapeHtml(String(propertyId))}</p>` : ""}
          `,
        });
      } catch {
        // Email is non-critical — lead already saved to Sanity
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lead creation failed:", error);
    return NextResponse.json(
      { error: "Error al crear el lead" },
      { status: 500 }
    );
  }
}
