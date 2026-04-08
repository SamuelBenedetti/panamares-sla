import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Clock, ChevronRight } from "lucide-react";
import { PortableText } from "@portabletext/react";
import { sanityFetch } from "@/sanity/lib/client";
import { groq } from "next-sanity";
import { urlFor } from "@/sanity/lib/image";
import type { Guide } from "@/lib/types";
import { breadcrumbSchema } from "@/lib/jsonld";

const BASE_URL = "https://panamares.com";

const guideBySlugQuery = groq`
  *[_type == "guide" && slug.current == $slug][0] {
    _id, title, slug, category, excerpt, readTime, coverImage, body
  }
`;

const CATEGORY_LABELS: Record<string, string> = {
  comprar:  "Comprar",
  alquilar: "Alquilar",
  invertir: "Invertir",
  vivir:    "Vivir en Panamá",
};

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const guide = await sanityFetch<Guide | null>(guideBySlugQuery, { slug: params.slug });
  if (!guide) return {};
  return {
    title: `${guide.title}`,
    description: guide.excerpt,
    alternates: { canonical: `${BASE_URL}/guias/${params.slug}/` },
  };
}

export default async function GuideDetailPage({ params }: Props) {
  const guide = await sanityFetch<Guide | null>(guideBySlugQuery, { slug: params.slug });
  if (!guide) notFound();

  const imgUrl = guide.coverImage
    ? urlFor(guide.coverImage).width(1400).height(700).url()
    : "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1400&h=700&fit=crop";

  const catLabel = CATEGORY_LABELS[guide.category] ?? "";

  const jsonLdBreadcrumb = breadcrumbSchema([
    { name: "Inicio",  url: "/" },
    { name: "Guías",   url: "/guias/" },
    { name: guide.title, url: `/guias/${params.slug}/` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />

      {/* ── Hero ── */}
      <section className="bg-[#0c1834] px-[30px] xl:px-[20px] 2xl:px-[120px] pt-[120px] xl:pt-[160px] pb-[60px] xl:pb-[80px]">
        <div className="max-w-[1600px] mx-auto flex flex-col gap-[24px]">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-[8px] flex-wrap">
            <Link href="/" className="font-body text-[13px] text-white/40 hover:text-white/70 transition-colors">Inicio</Link>
            <ChevronRight size={12} className="text-white/25" />
            <Link href="/guias/" className="font-body text-[13px] text-white/40 hover:text-white/70 transition-colors">Guías</Link>
            <ChevronRight size={12} className="text-white/25" />
            <span className="font-body text-[13px] text-white/70 line-clamp-1">{guide.title}</span>
          </nav>

          {/* Meta */}
          <div className="flex items-center gap-[16px]">
            {catLabel && (
              <span className="font-body font-medium text-[11px] text-[#d4a435] tracking-[3px] uppercase">
                {catLabel}
              </span>
            )}
            {guide.readTime && (
              <span className="flex items-center gap-[5px] font-body text-[12px] text-white/40">
                <Clock size={12} />
                {guide.readTime} min de lectura
              </span>
            )}
          </div>

          {/* Title */}
          <h1 className="font-heading font-normal text-[clamp(32px,4.5vw,60px)] text-white leading-none tracking-[-1.8px] max-w-[800px]">
            {guide.title}
          </h1>

          {guide.excerpt && (
            <p className="font-body font-light text-[16px] xl:text-[18px] text-white/70 leading-relaxed max-w-[640px]">
              {guide.excerpt}
            </p>
          )}
        </div>
      </section>

      {/* ── Cover image ── */}
      <div className="relative h-[240px] sm:h-[380px] xl:h-[500px] overflow-hidden">
        <Image
          src={imgUrl}
          alt={guide.title}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
      </div>

      {/* ── Article body ── */}
      <section className="bg-[#f9f9f9] px-[30px] xl:px-[20px] 2xl:px-[120px] py-[60px] xl:py-[100px]">
        <div className="max-w-[1600px] mx-auto">
          <div className="max-w-[740px]">
            {guide.body ? (
              <div className="
                font-body text-[16px] xl:text-[17px] text-[#3a3a3a] leading-[1.8]
                [&_h2]:font-heading [&_h2]:font-normal [&_h2]:text-[clamp(24px,3vw,36px)] [&_h2]:text-[#0c1834] [&_h2]:tracking-[-1px] [&_h2]:leading-none [&_h2]:mt-[48px] [&_h2]:mb-[16px]
                [&_h3]:font-heading [&_h3]:font-normal [&_h3]:text-[22px] [&_h3]:text-[#0c1834] [&_h3]:mt-[32px] [&_h3]:mb-[12px]
                [&_p]:mb-[20px] [&_p:last-child]:mb-0
                [&_ul]:list-disc [&_ul]:pl-[24px] [&_ul]:mb-[20px] [&_ul_li]:mb-[8px]
                [&_ol]:list-decimal [&_ol]:pl-[24px] [&_ol]:mb-[20px] [&_ol_li]:mb-[8px]
                [&_strong]:font-semibold [&_strong]:text-[#0c1834]
                [&_a]:text-[#0c1834] [&_a]:underline [&_a]:underline-offset-2 [&_a:hover]:opacity-60
                [&_blockquote]:border-l-[3px] [&_blockquote]:border-[#d4a435] [&_blockquote]:pl-[20px] [&_blockquote]:text-[#737b8c] [&_blockquote]:italic [&_blockquote]:my-[32px]
              ">
                <PortableText value={guide.body} />
              </div>
            ) : (
              <p className="font-body text-[16px] text-[#737b8c]">Contenido próximamente.</p>
            )}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[#121e3e] px-[30px] xl:px-[20px] 2xl:px-[120px] py-[70px] xl:py-[90px]">
        <div className="max-w-[1600px] mx-auto flex flex-col xl:flex-row xl:items-center xl:justify-between gap-[32px]">
          <div className="flex flex-col gap-[14px]">
            <p className="font-body font-medium text-[12px] text-white/50 tracking-[5px] uppercase leading-4">
              ¿Listo para dar el siguiente paso?
            </p>
            <h2 className="font-heading font-normal text-[clamp(30px,4vw,50px)] text-white tracking-[-1.5px] leading-none">
              Habla con un asesor
            </h2>
            <p className="font-body font-light text-[15px] text-white/60 leading-relaxed max-w-[440px]">
              Nuestros expertos están disponibles para guiarte en cada paso de tu decisión inmobiliaria.
            </p>
          </div>
          <Link
            href="/contacto/"
            className="inline-flex items-center justify-center gap-[8px] bg-white w-full xl:w-fit px-[32px] py-[15px] font-body font-medium text-[14px] text-[#0c1834] tracking-[1.4px] uppercase hover:bg-[#f9f9f9] transition-colors whitespace-nowrap"
          >
            Contactar ahora
          </Link>
        </div>
      </section>
    </>
  );
}
