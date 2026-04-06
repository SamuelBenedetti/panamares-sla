import { NextResponse } from "next/server";
import { createClient } from "next-sanity";

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

const writeClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || "placeholder",
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || "production",
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

    if (!name || !email) {
      return NextResponse.json(
        { error: "Nombre y email son requeridos" },
        { status: 400 }
      );
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

    // Send email via Resend (if configured)
    if (process.env.RESEND_API_KEY) {
      try {
        const { Resend } = await import("resend");
        const resend = new Resend(process.env.RESEND_API_KEY);
        await resend.emails.send({
          from: process.env.RESEND_FROM || "onboarding@resend.dev",
          to: process.env.LEADS_EMAIL || "info@panamarealtor.com",
          subject: `Nuevo lead: ${name}`,
          html: `
            <h2>Nuevo lead desde panamarealtor.com</h2>
            <p><strong>Nombre:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            ${phone ? `<p><strong>Teléfono:</strong> ${phone}</p>` : ""}
            ${message ? `<p><strong>Mensaje:</strong> ${message}</p>` : ""}
            ${propertyId ? `<p><strong>Propiedad ID:</strong> ${propertyId}</p>` : ""}
          `,
        });
      } catch {
        // Email sending is non-critical
        console.error("Failed to send email notification");
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
