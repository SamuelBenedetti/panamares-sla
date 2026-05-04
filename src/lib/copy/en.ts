// English copy. Empty in PR1 — populated in PR2 by translation pass.
// Shape MUST match `es.ts` exactly. The `: Copy` annotation is the parity guard:
// TypeScript fails the build if any key is missing or has the wrong type.

import type { Copy } from "./types";

export const en: Copy = {
  layout: {
    nav: {
      comprar: "",
      alquilar: "",
      barrios: "",
      nosotros: "",
      verTodas: "",
      verTodos: "",
      apartamentos: "",
      apartaestudios: "",
      casas: "",
      penthouses: "",
      oficinas: "",
      locales: "",
      terrenos: "",
      casasDePlaya: "",
      edificios: "",
      fincas: "",
      lotesComerciales: "",
    },
    cta: {
      whatsapp: "",
      contactenos: "",
      whatsappDefaultMessage: "",
    },
    footer: {
      tagline: "",
      sectionPropiedades: "",
      sectionBarrios: "",
      sectionContacto: "",
      copyrightText: () => "",
      linkPrivacidad: "",
      linkTerminos: "",
    },
    breadcrumb: {
      inicio: "",
      barrios: "",
      agentes: "",
    },
  },

  pages: {
    home: {
      hero: {
        eyebrow: "",
        titleLine1: "",
        titleLine2Italic: "",
        subtitle: { regular: "", bold: "" },
      },
      propertyTypeShortcuts: {
        eyebrow: "",
        heading: "",
        labels: {
          apartamentos: "",
          casas: "",
          penthouses: "",
          oficinas: "",
          locales: "",
          terrenos: "",
        },
        countSuffix: () => "",
      },
      featured: {
        eyebrow: "",
        heading: "",
        emptyState: "",
        verMas: "",
      },
      neighborhoodCards: {
        eyebrow: "",
        heading: "",
        precioPromedio: "",
        propiedades: "",
        propiedadesEn: () => "",
      },
      trustStrip: {
        labelActiveListings: "",
        labelAgents: "",
        labelYears: "",
        labelClientsSatisfied: "",
      },
    },
    sobreNosotros: {
      meta: { title: "", description: "" },
      todoPr2Marker: "",
    },
    contacto: {
      meta: { title: "", description: "" },
      todoPr2Marker: "",
    },
    terminos: {
      meta: { title: "", description: "" },
      todoPr2Marker: "",
    },
    privacidad: {
      meta: { title: "", description: "" },
      todoPr2Marker: "",
    },
    barriosIndex: {
      meta: { title: "", description: "" },
      todoPr2Marker: "",
    },
    agentesIndex: {
      meta: { title: "", description: "" },
      todoPr2Marker: "",
    },
    propiedadesEnVenta: {
      meta: { title: "", description: "" },
      todoPr2Marker: "",
    },
    propiedadesEnAlquiler: {
      meta: { title: "", description: "" },
      todoPr2Marker: "",
    },
    buscar: {
      meta: { title: "", description: "" },
      todoPr2Marker: "",
    },
  },

  components: {
    propertyCard: {
      tagRecomendado: "",
      tagPrecioJusto: "",
      tagAlquilado: "",
      verPropiedad: "",
      labelHabitacionesShort: "",
      labelBanos: "",
      labelMetros: "",
      whatsappPrefix: "",
    },
    agentCard: {
      verPerfil: "",
      defaultRole: "",
    },
    seoBlock: {
      leerMas: "",
      leerMenos: "",
    },
    contactForm: {
      todoPr2Marker: "",
    },
    faq: {
      defaultTitle: "",
    },
    faqSection: {
      eyebrow: "",
      heading: "",
    },
    pagination: {
      previous: "",
      next: "",
      ariaLabel: "",
    },
    breadcrumb: {
      inicio: "",
      barrios: "",
      agentes: "",
    },
    ctaSection: {
      eyebrow: "",
      titleLine1: "",
      titleLine2Italic: "",
      subtitle: "",
      whatsappMessage: "",
      buttonContactenos: "",
    },
    neighborhoodDetail: {
      todoPr2Marker: "",
    },
    agentDetail: {
      todoPr2Marker: "",
    },
    categoryHub: {
      todoPr2Marker: "",
    },
  },

  categories: {
    "apartamentos-en-venta": {
      h1: "",
      metaTitle: "",
      metaDescription: "",
      seoBlock: "",
    },
    "apartamentos-en-alquiler": {
      h1: "",
      metaTitle: "",
      metaDescription: "",
      seoBlock: "",
    },
    "casas-en-venta": {
      h1: "",
      metaTitle: "",
      metaDescription: "",
      seoBlock: "",
    },
    "casas-en-alquiler": {
      h1: "",
      metaTitle: "",
      metaDescription: "",
      seoBlock: "",
    },
    "penthouses-en-venta": {
      h1: "",
      metaTitle: "",
      metaDescription: "",
      seoBlock: "",
    },
    "penthouses-en-alquiler": {
      h1: "",
      metaTitle: "",
      metaDescription: "",
      seoBlock: "",
    },
    "apartaestudios-en-venta": {
      h1: "",
      metaTitle: "",
      metaDescription: "",
      seoBlock: "",
    },
    "oficinas-en-venta": {
      h1: "",
      metaTitle: "",
      metaDescription: "",
      seoBlock: "",
    },
    "oficinas-en-alquiler": {
      h1: "",
      metaTitle: "",
      metaDescription: "",
      seoBlock: "",
    },
    "locales-comerciales-en-venta": {
      h1: "",
      metaTitle: "",
      metaDescription: "",
      seoBlock: "",
    },
    "locales-comerciales-en-alquiler": {
      h1: "",
      metaTitle: "",
      metaDescription: "",
      seoBlock: "",
    },
    "terrenos-en-venta": {
      h1: "",
      metaTitle: "",
      metaDescription: "",
      seoBlock: "",
    },
    "terrenos-en-alquiler": {
      h1: "",
      metaTitle: "",
      metaDescription: "",
      seoBlock: "",
    },
    "casas-de-playa-en-alquiler": {
      h1: "",
      metaTitle: "",
      metaDescription: "",
      seoBlock: "",
    },
    "casas-de-playa-en-venta": {
      h1: "",
      metaTitle: "",
      metaDescription: "",
      seoBlock: "",
    },
    "edificios-en-venta": {
      h1: "",
      metaTitle: "",
      metaDescription: "",
      seoBlock: "",
    },
    "fincas-en-venta": {
      h1: "",
      metaTitle: "",
      metaDescription: "",
      seoBlock: "",
    },
    "lotes-comerciales-en-venta": {
      h1: "",
      metaTitle: "",
      metaDescription: "",
      seoBlock: "",
    },
  },

  faqs: {
    answers: {
      processCompra: "",
      extranjeroCompra: "",
      extranjeroAlquiler: "",
      preciosDolares: "",
      mejoresBarriosCompra: () => "",
      mejoresBarriosAlquiler: () => "",
      documentosAlquilerCategory: () => "",
      documentosAlquilerGeo: () => "",
      porQueComprarBarrio: () => "",
      porQueAlquilarBarrio: () => "",
    },
    questions: {
      cuantoCuestaComprar: () => "",
      cuantoCuestaAlquilar: () => "",
      cuantoCuestaComprarBarrio: () => "",
      cuantoCuestaAlquilarBarrio: () => "",
      mejoresBarriosCompra: () => "",
      mejoresBarriosAlquiler: () => "",
      procesoCompra: () => "",
      procesoCompraSimple: "",
      extranjeroCompraCategory: () => "",
      extranjeroCompraGeo: () => "",
      documentosAlquiler: () => "",
      preciosEnDolares: "",
      porQueComprarBarrio: () => "",
      porQueAlquilarBarrio: () => "",
      extranjeroAlquilar: "",
    },
    priceRefs: {
      apartamento: { venta: "", alquiler: "" },
      penthouse: { venta: "", alquiler: "" },
      casa: { venta: "", alquiler: "" },
      oficina: { venta: "", alquiler: "" },
      local: { venta: "", alquiler: "" },
      apartaestudio: { venta: "", alquiler: "" },
      terreno: { venta: "", alquiler: "" },
      "casa de playa": { venta: "", alquiler: "" },
      default: { venta: "", alquiler: "" },
    },
    zonesByType: {
      apartamento: "",
      penthouse: "",
      casa: "",
      oficina: "",
      local: "",
      apartaestudio: "",
      terreno: "",
      "casa de playa": "",
      default: "",
    },
  },
};
