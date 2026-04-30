import { notFound } from "next/navigation";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Clock, ChevronRight, BadgeCheck } from "lucide-react";
import { PortableText } from "@portabletext/react";
import { sanityFetch } from "@/sanity/lib/client";
import { guideBySlugQuery } from "@/sanity/lib/queries";
import { urlFor } from "@/sanity/lib/image";
import type { Guide } from "@/lib/types";
import { breadcrumbSchema, articleSchema } from "@/lib/jsonld";
import { canonical } from "@/lib/seo";

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

  const ogImage = guide.coverImage
    ? urlFor(guide.coverImage).width(1200).height(630).url()
    : undefined;

  return {
    title: guide.title,
    description: guide.excerpt,
    robots: { index: true, follow: true },
    alternates: { canonical: canonical(`/guias/${params.slug}`) },
    openGraph: {
      title: guide.title,
      description: guide.excerpt,
      images: ogImage ? [{ url: ogImage }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: guide.title,
      description: guide.excerpt,
      images: ogImage ? [ogImage] : [],
    },
  };
}

export default async function GuideDetailPage({ params }: Props) {
  const guide = await sanityFetch<Guide | null>(guideBySlugQuery, { slug: params.slug });
  if (!guide) notFound();

  const imgUrl = guide.coverImage
    ? urlFor(guide.coverImage).width(1400).height(700).url()
    : "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1400&h=700&fit=crop";

  const catLabel = CATEGORY_LABELS[guide.category] ?? "";

  // JSON-LD schemas
  const jsonLdBreadcrumb = breadcrumbSchema([
    { name: "Inicio",  url: "/" },
    { name: "Guías",   url: "/guias/" },
    { name: guide.title, url: `/guias/${params.slug}/` },
  ]);

  const jsonLdArticle = articleSchema({
    title: guide.title,
    description: guide.excerpt,
    url: `/guias/${params.slug}/`,
    datePublished: guide._createdAt,
    dateModified: guide._updatedAt,
    authorName: guide.author?.name,
    authorUrl: guide.author?.slug?.current ? `/autores/${guide.author.slug.current}/` : undefined,
    image: guide.coverImage ? urlFor(guide.coverImage).width(1200).height(630).url() : undefined,
  });

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }} />

      {/* ── Hero ── */}
      <section className="bg-[#0c1834] px-[30px] xl:px-[60px] 2xl:px-[160px] pt-[120px] xl:pt-[160px] pb-[60px] xl:pb-[80px]">
        <div className="max-w-[1440px] mx-auto flex flex-col gap-[24px]">
          <nav className="flex items-center gap-[8px] flex-wrap">
            <Link href="/" className="font-body text-[13px] text-white/40 hover:text-white/70 transition-colors">Inicio</Link>
            <ChevronRight size={12} className="text-white/25" />
            <Link href="/guias/" className="font-body text-[13px] text-white/40 hover:text-white/70 transition-colors">Guías</Link>
            <ChevronRight size={12} className="text-white/25" />
            <span className="font-body text-[13px] text-white/70 line-clamp-1">{guide.title}</span>
          </nav>

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

          <h1 className="font-heading font-normal text-[clamp(28px,3.8vw,52px)] text-white leading-none tracking-[-1.8px] max-w-[800px]">
            {guide.title}
          </h1>

          {guide.excerpt && (
            <p className="font-body font-light text-[16px] xl:text-[18px] text-white/70 leading-relaxed max-w-[640px]">
              {guide.excerpt}
            </p>
          )}

          {/* Author byline in hero */}
          {guide.author && (
            <div className="flex items-center gap-[10px] pt-[4px]">
              {guide.author.photo && (
                <Image
                  src={urlFor(guide.author.photo).width(80).height(80).url()}
                  alt={guide.author.name}
                  width={36}
                  height={36}
                  className="rounded-full object-cover w-[36px] h-[36px] shrink-0"
                />
              )}
              <div>
                <p className="font-body font-medium text-[13px] text-white leading-4">
                  {guide.author.name}
                </p>
                {guide.author.role && (
                  <p className="font-body font-normal text-[11px] text-white/40 leading-4">
                    {guide.author.role}
                  </p>
                )}
              </div>
              {guide.author.credentials && (
                <span className="flex items-center gap-[4px] ml-[4px] bg-white/10 px-[8px] py-[3px]">
                  <BadgeCheck size={11} className="text-[#b8891e] shrink-0" />
                  <span className="font-body text-[10px] text-white/60 uppercase tracking-[0.8px]">
                    {guide.author.credentials}
                  </span>
                </span>
              )}
            </div>
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
      <section className="bg-[#f9f9f9] px-[30px] xl:px-[60px] 2xl:px-[160px] py-[60px] xl:py-[100px]">
        <div className="max-w-[1440px] mx-auto">
          <div className="max-w-[740px] flex flex-col gap-[48px]">

            {/* Body */}
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
                [&_blockquote]:border-l-[3px] [&_blockquote]:border-[#d4a435] [&_blockquote]:pl-[20px] [&_blockquote]:text-[#5a6478] [&_blockquote]:italic [&_blockquote]:my-[32px]
                [&_table]:w-full [&_table]:border-collapse [&_table]:text-[14px] [&_th]:bg-[#0c1834] [&_th]:text-white [&_th]:px-[12px] [&_th]:py-[8px] [&_th]:text-left [&_td]:px-[12px] [&_td]:py-[8px] [&_td]:border-b [&_td]:border-[#e8ecf2]
              ">
                <PortableText value={guide.body} />
              </div>
            ) : (
              <p className="font-body text-[16px] text-[#5a6478]">Contenido próximamente.</p>
            )}

            {/* Author bio card at the end */}
            {guide.author && (
              <div className="border border-[#dfe5ef] p-[24px] flex items-start gap-[16px]">
                {guide.author.photo && (
                  <Image
                    src={urlFor(guide.author.photo).width(120).height(120).url()}
                    alt={guide.author.name}
                    width={56}
                    height={56}
                    className="rounded-full object-cover w-[56px] h-[56px] shrink-0"
                  />
                )}
                <div className="flex flex-col gap-[4px]">
                  <p className="font-body font-medium text-[10px] text-[#8a95a3] uppercase tracking-[1.5px]">Escrito por</p>
                  <p className="font-body font-semibold text-[15px] text-[#0c1834]">{guide.author.name}</p>
                  {guide.author.role && (
                    <p className="font-body text-[12px] text-[#566070]">{guide.author.role}</p>
                  )}
                  {guide.author.credentials && (
                    <p className="font-body text-[11px] text-[#8a95a3] flex items-center gap-[4px] mt-[2px]">
                      <BadgeCheck size={11} className="text-[#16a34a]" />
                      {guide.author.credentials}
                    </p>
                  )}
                </div>
              </div>
            )}

          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[#121e3e] px-[30px] xl:px-[60px] 2xl:px-[160px] py-[70px] xl:py-[90px]">
        <div className="max-w-[1440px] mx-auto flex flex-col xl:flex-row xl:items-center xl:justify-between gap-[32px]">
          <div className="flex flex-col gap-[14px]">
            <p className="font-body font-medium text-[12px] text-white/50 tracking-[5px] uppercase leading-4">
              ¿Listo para dar el siguiente paso?
            </p>
            <h2 className="font-heading font-normal text-[clamp(26px,3.2vw,42px)] text-white tracking-[-1.5px] leading-none">
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
