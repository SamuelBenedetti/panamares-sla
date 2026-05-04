// Shared TypeScript shape for site copy.
// Both `es.ts` and `en.ts` must satisfy `Copy` — TypeScript fails the build if
// either file drifts from this shape, which is the parity guard for P0-05.

export type Locale = "es" | "en";

export interface Copy {
  // ── Layout (chrome shared en todas las páginas) ───────────────────────────
  layout: {
    nav: {
      comprar: string;
      alquilar: string;
      barrios: string;
      nosotros: string;
      verTodas: string;
      verTodos: string;
      apartamentos: string;
      apartaestudios: string;
      casas: string;
      penthouses: string;
      oficinas: string;
      locales: string;
      terrenos: string;
      casasDePlaya: string;
      edificios: string;
      fincas: string;
      lotesComerciales: string;
    };
    cta: {
      whatsapp: string;
      contactenos: string;
      whatsappDefaultMessage: string;
    };
    footer: {
      tagline: string;
      sectionPropiedades: string;
      sectionBarrios: string;
      sectionContacto: string;
      copyrightText: (year: number) => string;
      linkPrivacidad: string;
      linkTerminos: string;
    };
    breadcrumb: {
      inicio: string;
      barrios: string;
      agentes: string;
    };
  };

  // ── Páginas ───────────────────────────────────────────────────────────────
  pages: {
    home: {
      hero: {
        eyebrow: string;
        titleLine1: string;
        titleLine2Italic: string;
        subtitle: { regular: string; bold: string };
      };
      propertyTypeShortcuts: {
        eyebrow: string;
        heading: string;
        labels: {
          apartamentos: string;
          casas: string;
          penthouses: string;
          oficinas: string;
          locales: string;
          terrenos: string;
        };
        countSuffix: (n: number) => string;
      };
      featured: {
        eyebrow: string;
        heading: string;
        emptyState: string;
        verMas: string;
      };
      neighborhoodCards: {
        eyebrow: string;
        heading: string;
        precioPromedio: string;
        propiedades: string;
        propiedadesEn: (name: string) => string;
      };
      trustStrip: {
        labelActiveListings: string;
        labelAgents: string;
        labelYears: string;
        labelClientsSatisfied: string;
      };
    };
    sobreNosotros: {
      meta: { title: string; description: string };
      todoPr2Marker: string;
    };
    contacto: {
      meta: { title: string; description: string };
      todoPr2Marker: string;
    };
    terminos: {
      meta: { title: string; description: string };
      todoPr2Marker: string;
    };
    privacidad: {
      meta: { title: string; description: string };
      todoPr2Marker: string;
    };
    barriosIndex: {
      meta: { title: string; description: string };
      todoPr2Marker: string;
    };
    agentesIndex: {
      meta: { title: string; description: string };
      todoPr2Marker: string;
    };
    propiedadesEnVenta: {
      meta: { title: string; description: string };
      todoPr2Marker: string;
    };
    propiedadesEnAlquiler: {
      meta: { title: string; description: string };
      todoPr2Marker: string;
    };
    buscar: {
      meta: { title: string; description: string };
      todoPr2Marker: string;
    };
  };

  // ── Componentes shared ────────────────────────────────────────────────────
  components: {
    propertyCard: {
      tagRecomendado: string;
      tagPrecioJusto: string;
      tagAlquilado: string;
      verPropiedad: string;
      labelHabitacionesShort: string; // "hab."
      labelBanos: string; // "baños"
      labelMetros: string; // "m²"
      whatsappPrefix: string;
    };
    agentCard: {
      verPerfil: string;
      defaultRole: string;
    };
    seoBlock: {
      leerMas: string;
      leerMenos: string;
    };
    contactForm: {
      labelNombre: string;
      placeholderNombre: string;
      labelCorreo: string;
      placeholderCorreo: string;
      labelTelefono: string;
      placeholderTelefono: string;
      labelMotivo: string;
      motivoPlaceholder: string;
      motivos: {
        compra: string;
        alquiler: string;
        inversion: string;
        visita: string;
        otro: string;
      };
      labelMensaje: string;
      placeholderMensaje: string;
      buttonSend: string;
      buttonSending: string;
      successHeading: string;
      successBody: string;
      successButtonWhatsapp: string;
      errorMessage: string;
    };
    faq: {
      defaultTitle: string;
    };
    faqSection: {
      eyebrow: string;
      heading: string;
    };
    pagination: {
      previous: string;
      next: string;
      ariaLabel: string;
    };
    breadcrumb: {
      inicio: string;
      barrios: string;
      agentes: string;
    };
    ctaSection: {
      eyebrow: string;
      titleLine1: string;
      titleLine2Italic: string;
      subtitle: string;
      whatsappMessage: string;
      buttonContactenos: string;
    };
    neighborhoodDetail: {
      todoPr2Marker: string;
    };
    agentDetail: {
      todoPr2Marker: string;
    };
    categoryHub: {
      todoPr2Marker: string;
    };
  };

  // ── Categorías (extraído de lib/categories.ts) ────────────────────────────
  categories: Record<
    string,
    {
      h1: string;
      metaTitle: string;
      metaDescription: string;
      seoBlock: string;
    }
  >;

  // ── FAQs (refactor de lib/faqs.ts con templates función) ──────────────────
  faqs: {
    answers: {
      processCompra: string;
      extranjeroCompra: string;
      extranjeroAlquiler: string;
      preciosDolares: string;
      mejoresBarriosCompra: (typeLabel: string, zones: string) => string;
      mejoresBarriosAlquiler: (typeLabel: string, zones: string) => string;
      documentosAlquilerCategory: (typeLabel: string) => string;
      documentosAlquilerGeo: (typeLabel: string) => string;
      porQueComprarBarrio: (
        typeLabel: string,
        neighborhoodName: string,
      ) => string;
      porQueAlquilarBarrio: (
        typeLabel: string,
        neighborhoodName: string,
      ) => string;
    };
    questions: {
      cuantoCuestaComprar: (typeLabel: string) => string;
      cuantoCuestaAlquilar: (typeLabel: string) => string;
      cuantoCuestaComprarBarrio: (
        typeLabel: string,
        neighborhoodName: string,
      ) => string;
      cuantoCuestaAlquilarBarrio: (
        typeLabel: string,
        neighborhoodName: string,
      ) => string;
      mejoresBarriosCompra: (typeLabel: string) => string;
      mejoresBarriosAlquiler: (typeLabel: string) => string;
      procesoCompra: (typeLabel: string) => string;
      procesoCompraSimple: string;
      extranjeroCompraCategory: (typeLabel: string) => string;
      extranjeroCompraGeo: (
        typeLabel: string,
        neighborhoodName: string,
      ) => string;
      documentosAlquiler: (typeLabel: string) => string;
      preciosEnDolares: string;
      porQueComprarBarrio: (
        typeLabel: string,
        neighborhoodName: string,
      ) => string;
      porQueAlquilarBarrio: (
        typeLabel: string,
        neighborhoodName: string,
      ) => string;
      extranjeroAlquilar: string;
    };
    priceRefs: Record<string, { venta: string; alquiler: string }>;
    zonesByType: Record<string, string>;
  };
}
