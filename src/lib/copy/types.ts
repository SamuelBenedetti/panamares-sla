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
      breadcrumbLabel: string;
      hero: {
        eyebrow: string;
        titleLine1: string;
        titleLine2Italic: string;
        titleLine3: string;
        body: { bold: string; light: string };
      };
      oficina: {
        eyebrow: string;
        locationLine1: string;
        locationLine2: string;
        imageAlt: string;
      };
      stats: {
        labelAnos: string;
        labelPropiedadesVendidas: string;
        labelTransacciones: string;
        labelSatisfechos: string;
      };
      ubicacion: {
        eyebrow: string;
        heading: string;
      };
      historia: {
        eyebrow: string;
        titleLine1: string;
        titleLine2Italic: string;
        p1: string;
        p2: string;
        p3Lead: string;
        p3Cities: string;
        ctaVerPropiedades: string;
        cards: {
          confianza: { title: string; bodyPrefix: string; bodyBold: string; bodySuffix: string };
          servicio: { title: string; body: string };
          inversion: { title: string; body: string };
          conocimiento: { title: string; body: string };
        };
      };
      equipo: {
        eyebrow: string;
        heading: string;
      };
      reconocimientos: {
        eyebrow: string;
        titleLine1: string;
        titleLine2Italic: string;
        awards: {
          excelencia: { title: string; sub: string };
          topAgencias: { title: string; sub: string };
          servicio: { title: string; sub: string };
          remax: { title: string; sub: string };
        };
      };
      ctaContacto: {
        eyebrow: string;
        heading: string;
        bodyLight: string;
        bodyBold: string;
        button: string;
      };
    };
    contacto: {
      meta: { title: string; description: string };
      breadcrumbLabel: string;
      hero: {
        eyebrow: string;
        titleLine1: string;
        titleLine2Italic: string;
        bodyBold: string;
        bodyRegular: string;
      };
      whatsappBanner: {
        heading: string;
        subtitle: string;
        button: string;
        message: string;
      };
      sidebar: {
        labelDireccion: string;
        labelTelefono: string;
        labelCorreo: string;
        labelHorario: string;
        cityLine: (locality: string) => string;
        horario: {
          lunVie: { label: string; range: string };
          sabados: { label: string; range: string };
        };
        ubicacionEyebrow: string;
        mapTitle: (street: string, locality: string) => string;
      };
      conoceMejor: {
        eyebrow: string;
        body: string;
        cta: string;
      };
      uneteEquipo: {
        eyebrow: string;
        heading: string;
        button: string;
        message: string;
      };
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
      breadcrumbLabel: string;
      h1Prefix: string;
      h1Italic: string;
      zonesAvailableLabel: string;
      masZonasEyebrow: string;
      masZonasTitleLine1: string;
      masZonasTitleLine2Italic: string;
      precioPromedio: string;
      propiedades: string;
      ctaEyebrow: string;
      ctaHeading: string;
      ctaBody: string;
      ctaButton: string;
    };
    agentesIndex: {
      meta: { title: string; description: string };
      breadcrumbLabel: string;
      h1: string;
      agentesDisponiblesSuffix: string;
      teamEyebrow: string;
      hablarConElEquipo: string;
      noAgentsYet: string;
      ctaEyebrow: string;
      ctaHeading: string;
      ctaBody: string;
      ctaButton: string;
    };
    propiedadesEnVenta: {
      meta: { title: string; description: string };
      h1: string;
      description: string;
      breadcrumbLabel: string;
      whatsappMessage: string;
    };
    propiedadesEnAlquiler: {
      meta: { title: string; description: string };
      h1: string;
      description: string;
      breadcrumbLabel: string;
      whatsappMessage: string;
    };
    buscar: {
      meta: { title: string; description: string };
      stepLabel: string; // "paso"
      stepSeparator: string; // "/04"
      steps: {
        intencion: { line1: string; line2Italic: string; options: { comprar: string; alquilar: string } };
        tipo: { line1: string; line2Italic: string; options: { residencial: string; comercial: string; terreno: string } };
        habitaciones: {
          line1: string;
          line2Italic: string;
          options: { uno: string; dos: string; tres: string; cuatroPlus: string };
        };
        presupuesto: {
          line1: string;
          line2Italic: string;
          comprarOptions: {
            menos150k: string;
            r150_350: string;
            r350_700: string;
            r700_1500: string;
            mas1500: string;
            flexible: string;
          };
          alquilarOptions: {
            menos800: string;
            r800_1500: string;
            r1500_3000: string;
            r3000_6000: string;
            mas6000: string;
            flexible: string;
          };
        };
      };
      retornar: string;
      omitir: string;
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
    neighborhoodSlider: {
      eyebrow: string;
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
      // Hero
      heroH1Prefix: string;
      heroH1Italic: string;
      heroPropActiva: string;
      heroPropActivasPlural: string;
      heroVentaSuffix: string;
      heroAlquilerSuffix: string;
      heroPromedioSuffix: string;
      // About / SEO block
      aboutEyebrow: string;
      aboutHeadingPrefix: string;
      currentlyThereAre: string;
      propiedadDisponible: string;
      propiedadesDisponibles: string;
      enConnector: string;
      ctaWhatsapp: string;
      ctaContactenos: string;
      // Sidebar stats
      statsPrecioPromedio: string;
      statsPropiedadesActivas: string;
      statsPropiedadSingular: string;
      statsPropiedadPlural: string;
      statsTipoMasDisponible: string;
      // CTA section
      ctaEyebrow: string;
      ctaHeadingPrefix: string;
      ctaHeadingSuffixItalicTpl: (name: string) => string;
      ctaBody: string;
      // Listings section (was hardcoded in NeighborhoodListingsSection)
      listingsEyebrow: string;
      listingsHeadingVenta: string;
      listingsHeadingAlquiler: string;
      tabComprar: string;
      tabAlquilar: string;
      verPorTipoEnTpl: (name: string) => string;
      noListingsEmpty: string;
      // Other neighborhoods
      otrosBarriosEyebrow: string;
      otrosBarriosHeading: string;
      // WhatsApp / breadcrumb
      whatsappMessageTpl: (name: string) => string;
      breadcrumbLabel: string;
    };
    agentDetail: {
      heroEyebrow: string;
      heroListingCountTooltip: string;
      waCtaMobile: string;
      waCtaDesktop: string;
      cardPropertiesActivePrefix: string;
      cardPropertiesActiveLabel: string;
      cardRoleFallback: string;
      cardHoursLine: string;
      cardHoursBold: string;
      consultarPorWhatsapp: string;
      llamarAhora: string;
      noPropertiesEmpty: string;
      consultarDisponibilidad: string;
      whatsappMessageTpl: (name: string) => string;
      breadcrumbLabel: string;
      titleSuffix: string;
      descriptionTpl: (name: string, role: string) => string;
    };
    categoryHub: {
      // FilterPanel
      tipoDeInvestigacion: string;
      tabComprar: string;
      tabAlquilar: string;
      gamaDePrecios: string;
      tamano: string;
      tipoDePropiedad: string;
      todosLosTipos: string;
      barrio: string;
      todosLosBarrios: string;
      habitaciones: string;
      banos: string;
      verMas: string;
      cerrar: string;
      limpiarFiltros: string;
      todos: string; // stepper "0" label
      // Sort + count row
      filtros: string;
      propiedadesDisponiblesSuffix: string; // "propiedades disponibles"
      ordenarPorAria: string;
      sortRelevancia: string;
      sortRecientes: string;
      sortPrecioAsc: string;
      sortPrecioDesc: string;
      sortAreaDesc: string;
      // Empty / drawer
      noEncontramosTpl: (q: string) => string;
      noPropiedadesConFiltros: string;
      filtrosDrawerTitle: string;
      cerrarFiltrosAria: string;
      aplicarFiltros: string;
      // Floating WA
      whatsappMessageVenta: string;
      whatsappMessageAlquiler: string;
      whatsappMessageCategoryTpl: (h1: string) => string;
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
