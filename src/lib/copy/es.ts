// Spanish copy. Source of truth for all user-visible strings on the ES site.
// PR1: shape-complete. Sections marked TODO_PR2_* will be wired to components
// in PR2 — strings here are still real, but no component reads them yet.

import type { Copy } from "./types";

export const es: Copy = {
  layout: {
    nav: {
      comprar: "Comprar",
      alquilar: "Alquilar",
      barrios: "Barrios",
      nosotros: "Nosotros",
      verTodas: "Ver todas",
      verTodos: "Ver todos",
      apartamentos: "Apartamentos",
      apartaestudios: "Apartaestudios",
      casas: "Casas",
      penthouses: "Penthouses",
      oficinas: "Oficinas",
      locales: "Locales",
      terrenos: "Terrenos",
      casasDePlaya: "Casas de playa",
      edificios: "Edificios",
      fincas: "Fincas",
      lotesComerciales: "Lotes comerciales",
    },
    cta: {
      whatsapp: "WhatsApp",
      contactenos: "Contáctenos",
      whatsappDefaultMessage:
        "Hola, me interesa conocer más sobre sus propiedades.",
    },
    footer: {
      tagline:
        "Especialistas en bienes raíces de lujo en Ciudad de Panamá. Más de 15 años conectando clientes con propiedades excepcionales.",
      sectionPropiedades: "Propiedades",
      sectionBarrios: "Barrios",
      sectionContacto: "Contacto",
      copyrightText: (year: number) =>
        `© ${year} Panamares. Todos los derechos reservados.`,
      linkPrivacidad: "Privacidad",
      linkTerminos: "Términos",
    },
    breadcrumb: {
      inicio: "Inicio",
      barrios: "Barrios",
      agentes: "Agentes",
    },
  },

  pages: {
    home: {
      hero: {
        eyebrow: "Ciudad de Panamá & Propiedades de Lujo",
        titleLine1: "Bienes Raíces ",
        titleLine2Italic: "en Panama",
        subtitle: {
          regular: "Propiedades exclusivas en ",
          bold: "las mejores zonas de la ciudad.",
        },
      },
      propertyTypeShortcuts: {
        eyebrow: "Explorar por tipo",
        heading: "¿Qué tipo de propiedad buscas?",
        labels: {
          apartamentos: "Apartamentos",
          casas: "Casas",
          penthouses: "Penthouses",
          oficinas: "Oficinas",
          locales: "Locales",
          terrenos: "Terrenos",
        },
        countSuffix: (n: number) => (n > 0 ? `${n} prop.` : "—"),
      },
      featured: {
        eyebrow: "Selección destacada",
        heading: "Propiedades en Venta",
        emptyState: "Pronto agregaremos propiedades destacadas.",
        verMas: "Ver más propiedades",
      },
      neighborhoodCards: {
        eyebrow: "Los mejores barrios",
        heading: "Explorar por Ubicación",
        precioPromedio: "Precio promedio",
        propiedades: "Propiedades",
        propiedadesEn: (name: string) => `Propiedades en ${name}`,
      },
      trustStrip: {
        labelActiveListings: "Propiedades Activas",
        labelAgents: "Agentes Especializados",
        labelYears: "Años en el Mercado",
        labelClientsSatisfied: "Clientes Satisfechos",
      },
    },
    sobreNosotros: {
      meta: {
        title: "Sobre Nosotros",
        description:
          "Panamares es una agencia inmobiliaria de lujo en Panama City. Conoce nuestro equipo y nuestra trayectoria en el mercado panameño.",
      },
      breadcrumbLabel: "Sobre Nosotros",
      hero: {
        eyebrow: "Quiénes somos",
        titleLine1: "Más de 15 años ",
        titleLine2Italic: "conectando sueños ",
        titleLine3: "con propiedades",
        body: {
          bold: "Panamares nació con una convicción: que el mercado inmobiliario de lujo en Panamá ",
          light:
            "merecía una representación diferente, más honesta, más elegante, más humana.",
        },
      },
      oficina: {
        eyebrow: "Nuestra oficina",
        locationLine1: "Punta Pacífica,",
        locationLine2: "Ciudad de Panamá",
        imageAlt: "Nuestra oficina en Punta Pacífica, Ciudad de Panamá",
      },
      stats: {
        labelAnos: "Años en el Mercado",
        labelPropiedadesVendidas: "Propiedades vendidas",
        labelTransacciones: "En transacciones",
        labelSatisfechos: "Clientes Satisfechos",
      },
      ubicacion: {
        eyebrow: "Encuéntranos",
        heading: "Torre Oceánica, Piso 18 — Punta Pacífica",
      },
      historia: {
        eyebrow: "Nuestra historia",
        titleLine1: "Fundada sobre ",
        titleLine2Italic: "la confianza",
        p1: "Panamares fue fundada en 2009 por Valeria Moreno, con la visión de crear una firma que pusiera al cliente, no la comisión, en el centro de cada decisión.",
        p2: "A lo largo de más de una década, hemos construido una reputación basada en la transparencia, el asesoramiento patrimonial honesto y un conocimiento profundo del mercado panameño.",
        p3Lead:
          "Hoy somos un equipo de 18 asesores especializados, con presencia en los principales corredores residenciales y comerciales de ",
        p3Cities:
          "Ciudad de Panamá: Punta Pacífica, Punta Paitilla, Avenida Balboa y Costa del Este.",
        ctaVerPropiedades: "Ver nuestras propiedades",
        cards: {
          confianza: {
            title: "Confianza absoluta",
            bodyPrefix: "Cada transacción se gestiona con total ",
            bodyBold: "transparencia",
            bodySuffix: ", ética y cuidado hacia nuestros clientes.",
          },
          servicio: {
            title: "Servicio premium",
            body: "Atención personalizada desde el primer contacto hasta la firma final, sin intermediarios.",
          },
          inversion: {
            title: "Visión de inversión",
            body: "Asesoramos con datos de mercado reales para asegurar la mejor decisión patrimonial.",
          },
          conocimiento: {
            title: "Conocimiento local",
            body: "Profundo expertise en cada barrio de Ciudad de Panamá y sus dinámicas de valorización.",
          },
        },
      },
      equipo: {
        eyebrow: "El equipo",
        heading: "Asesores de confianza",
      },
      reconocimientos: {
        eyebrow: "Reconocimientos",
        titleLine1: "Reconocida como la ",
        titleLine2Italic: "mejor firma inmobiliaria",
        awards: {
          excelencia: {
            title: "Premio Excelencia Inmobiliaria",
            sub: "Panamá 2023",
          },
          topAgencias: {
            title: "Top 5 Agencias de Lujo",
            sub: "LAMag 2022",
          },
          servicio: {
            title: "Mejor Servicio al Cliente",
            sub: "ACOBIR 2021",
          },
          remax: {
            title: "Certificación RE/MAX Platinum",
            sub: "2019–2024",
          },
        },
      },
      ctaContacto: {
        eyebrow: "¿Tienes alguna consulta?",
        heading: "Estamos para ayudarte",
        bodyLight: "Contacta directamente con uno de nuestros asesores ",
        bodyBold: "y recibe orientación personalizada sin compromisos.",
        button: "Contáctenos Ahora",
      },
    },
    contacto: {
      meta: {
        title: "Contacto",
        description:
          "Contacta con Panamares, inmobiliaria de lujo en Panama City. Llámanos, escríbenos por WhatsApp o visítanos en Punta Pacífica. Asesores disponibles de lunes a sábado.",
      },
      breadcrumbLabel: "Contacto",
      hero: {
        eyebrow: "Contáctenos",
        titleLine1: "Contacta con ",
        titleLine2Italic: "Panamares",
        bodyBold:
          "Nuestro equipo de asesores está disponible para responder tus preguntas,",
        bodyRegular:
          "agendar visitas y orientarte en cada paso del proceso.",
      },
      whatsappBanner: {
        heading: "¿Prefieres respuesta inmediata?",
        subtitle: "Escríbenos por WhatsApp y te atendemos en minutos.",
        button: "Abrir WhatsApp",
      },
      sidebar: {
        labelDireccion: "Dirección",
        labelTelefono: "Teléfono",
        labelCorreo: "Correo",
        labelHorario: "Horario",
        cityLine: (locality: string) => `${locality}, Ciudad de Panamá`,
        horario: {
          lunVie: { label: "Lun – Vie:", range: "8:00 – 18:00" },
          sabados: { label: "Sábados:", range: "9:00 – 13:00" },
        },
        ubicacionEyebrow: "Nuestra ubicación",
        mapTitle: (street: string, locality: string) =>
          `Panamares — ${street}, ${locality}`,
      },
      conoceMejor: {
        eyebrow: "Conócenos mejor",
        body: "Más de 15 años conectando a familias e inversionistas con las mejores propiedades de Panamá.",
        cta: "Sobre Panamares →",
      },
      uneteEquipo: {
        eyebrow: "¿Eres agente independiente?",
        heading: "Únete al equipo Panamares",
        button: "Escríbenos",
      },
    },
    terminos: {
      meta: {
        title: "TODO_PR2_pages.terminos.meta.title",
        description: "TODO_PR2_pages.terminos.meta.description",
      },
      todoPr2Marker: "TODO_PR2_pages.terminos",
    },
    privacidad: {
      meta: {
        title: "TODO_PR2_pages.privacidad.meta.title",
        description: "TODO_PR2_pages.privacidad.meta.description",
      },
      todoPr2Marker: "TODO_PR2_pages.privacidad",
    },
    barriosIndex: {
      meta: {
        title: "Barrios de Panamá | Guía de Zonas",
        description:
          "Explora los mejores barrios de Ciudad de Panamá: Punta Pacífica, Punta Paitilla, Avenida Balboa, Costa del Este y más. Guía completa de propiedades por zona.",
      },
      breadcrumbLabel: "Barrios",
      h1Prefix: "Barrios de ",
      h1Italic: "Panama City",
      zonesAvailableLabel: "Zonas con propiedades disponibles",
      masZonasEyebrow: "más zonas",
      masZonasTitleLine1: "Otro",
      masZonasTitleLine2Italic: "barrios",
      precioPromedio: "Precio promedio",
      propiedades: "Propiedades",
      ctaEyebrow: "¿No sabes por dónde empezar?",
      ctaHeading: "Te ayudamos a elegir",
      ctaBody:
        "Nuestros asesores conocen cada zona a fondo. Cuéntanos qué buscas y te guiamos hacia el barrio perfecto para ti.",
      ctaButton: "Hablar con un asesor",
    },
    agentesIndex: {
      meta: {
        title: "Nuestros Agentes Inmobiliarios",
        description:
          "Conoce al equipo de agentes de Panamares. Expertos en el mercado inmobiliario de Panamá City con años de experiencia en Punta Pacífica, Punta Paitilla y las mejores zonas de la capital.",
      },
      breadcrumbLabel: "Agentes",
      h1: "Agentes Inmobiliarios en Panama",
      agentesDisponiblesSuffix: "agentes disponibles",
      teamEyebrow: "Equipo Panamares",
      hablarConElEquipo: "Hablar con el equipo",
      noAgentsYet: "No hay agentes registrados todavía.",
      ctaEyebrow: "¿Eres agente independiente?",
      ctaHeading: "Únete al equipo Panamares",
      ctaBody:
        "Si eres agente inmobiliario independiente y quieres crecer con nosotros, escríbenos. Siempre buscamos talento.",
      ctaButton: "Contáctenos",
    },
    propiedadesEnVenta: {
      meta: {
        title: "Propiedades en Venta en Panama",
        description:
          "Panamares reúne la mayor oferta de propiedades en venta en Panama City. Apartamentos, casas, penthouses, oficinas, locales y terrenos en Punta Pacífica, Punta Paitilla, Costa del Este y más zonas exclusivas. Cada inmueble cuenta con información completa de precio, área, habitaciones y amenidades. Filtra por tipo de propiedad, barrio o presupuesto y encuentra la opción ideal para comprar o invertir en el mercado inmobiliario más sólido de Centroamérica.",
      },
      h1: "Propiedades en Venta en Panamá",
      description:
        "Panamares reúne la mayor oferta de propiedades en venta en Panama City. Apartamentos, casas, penthouses, oficinas, locales y terrenos en Punta Pacífica, Punta Paitilla, Costa del Este y más zonas exclusivas. Cada inmueble cuenta con información completa de precio, área, habitaciones y amenidades. Filtra por tipo de propiedad, barrio o presupuesto y encuentra la opción ideal para comprar o invertir en el mercado inmobiliario más sólido de Centroamérica.",
      breadcrumbLabel: "Propiedades en Venta en Panamá",
      whatsappMessage: "Hola, busco propiedades en venta en Panamá",
    },
    propiedadesEnAlquiler: {
      meta: {
        title: "Propiedades en Alquiler en Panama",
        description:
          "Panamares tiene la selección más completa de propiedades en alquiler en Panama City. Apartamentos amueblados y sin amueblar, casas, oficinas y locales comerciales en Punta Pacífica, Punta Paitilla, Obarrio, Calle 50 y más zonas. Contratos en dólares, atención en español y agentes especializados que te acompañan en todo el proceso. Encuentra tu próxima propiedad en alquiler en la ciudad con el mercado inmobiliario más dinámico de la región.",
      },
      h1: "Propiedades en Alquiler en Panamá",
      description:
        "Panamares tiene la selección más completa de propiedades en alquiler en Panama City. Apartamentos amueblados y sin amueblar, casas, oficinas y locales comerciales en Punta Pacífica, Punta Paitilla, Obarrio, Calle 50 y más zonas. Contratos en dólares, atención en español y agentes especializados que te acompañan en todo el proceso. Encuentra tu próxima propiedad en alquiler en la ciudad con el mercado inmobiliario más dinámico de la región.",
      breadcrumbLabel: "Propiedades en Alquiler en Panamá",
      whatsappMessage: "Hola, busco propiedades en alquiler en Panamá",
    },
    buscar: {
      meta: {
        title: "Buscar Propiedades",
        description:
          "Busca propiedades en Panama City con nuestro asistente guiado: define intención, tipo, habitaciones y presupuesto en cuatro pasos.",
      },
      stepLabel: "paso",
      stepSeparator: "/04",
      steps: {
        intencion: {
          line1: "¿Qué estás",
          line2Italic: "buscando?",
          options: { comprar: "Comprar", alquilar: "Alquilar" },
        },
        tipo: {
          line1: "¿Qué tipo de",
          line2Italic: "propiedad?",
          options: {
            residencial: "Residencial",
            comercial: "Comercial",
            terreno: "Terreno",
          },
        },
        habitaciones: {
          line1: "¿Cuántas",
          line2Italic: "habitaciones?",
          options: {
            uno: "1 habitación",
            dos: "2 habitaciones",
            tres: "3 habitaciones",
            cuatroPlus: "4+ habitaciones",
          },
        },
        presupuesto: {
          line1: "¿Cuál es su",
          line2Italic: "presupuesto?",
          comprarOptions: {
            menos150k: "Menos de $150k",
            r150_350: "$150k – $350k",
            r350_700: "$350k – $700k",
            r700_1500: "$700k – $1.5M",
            mas1500: "Más de $1.5M",
            flexible: "Flexible",
          },
          alquilarOptions: {
            menos800: "Menos de $800/mes",
            r800_1500: "$800 – $1,500/mes",
            r1500_3000: "$1,500 – $3,000/mes",
            r3000_6000: "$3,000 – $6,000/mes",
            mas6000: "Más de $6,000/mes",
            flexible: "Flexible",
          },
        },
      },
      retornar: "Retornar",
      omitir: "Omitir",
    },
  },

  components: {
    propertyCard: {
      tagRecomendado: "Recomendado",
      tagPrecioJusto: "Precio Justo",
      tagAlquilado: "Alquilado",
      verPropiedad: "Ver propiedad",
      labelHabitacionesShort: "hab.",
      labelBanos: "baños",
      labelMetros: "m²",
      whatsappPrefix: "Hola, me interesa esta propiedad: ",
    },
    agentCard: {
      verPerfil: "Ver perfil",
      defaultRole: "Agente",
    },
    seoBlock: {
      leerMas: "Leer más",
      leerMenos: "Leer menos",
    },
    contactForm: {
      labelNombre: "Nombre completo *",
      placeholderNombre: "Ej. María González",
      labelCorreo: "Correo electrónico *",
      placeholderCorreo: "correo@ejemplo.com",
      labelTelefono: "Teléfono / WhatsApp",
      placeholderTelefono: "+507 6587-1849",
      labelMotivo: "Motivo de contacto",
      motivoPlaceholder: "Seleccionar…",
      motivos: {
        compra: "Compra de propiedad",
        alquiler: "Alquiler de propiedad",
        inversion: "Inversión",
        visita: "Agendar visita",
        otro: "Otro",
      },
      labelMensaje: "Mensaje",
      placeholderMensaje:
        "Cuéntanos qué estás buscando, presupuesto aproximado, zona de interés…",
      buttonSend: "Enviar mensaje",
      buttonSending: "Enviando...",
      successHeading: "¡Mensaje enviado!",
      successBody: "Nos pondremos en contacto contigo a la brevedad.",
      successButtonWhatsapp: "Abrir WhatsApp",
      errorMessage:
        "Error al enviar. Intenta de nuevo o escríbenos por WhatsApp.",
    },
    faq: {
      defaultTitle: "Preguntas frecuentes",
    },
    faqSection: {
      eyebrow: "FAQ",
      heading: "Preguntas frecuentes",
    },
    pagination: {
      previous: "← Anterior",
      next: "Siguiente →",
      ariaLabel: "Paginación",
    },
    breadcrumb: {
      inicio: "Inicio",
      barrios: "Barrios",
      agentes: "Agentes",
    },
    ctaSection: {
      eyebrow: "Contáctenos",
      titleLine1: "¿Listo para encontrar tu ",
      titleLine2Italic: "propiedad ideal?",
      subtitle:
        "Nuestros asesores están disponibles para ayudarte a encontrar la propiedad perfecta en Panamá.",
      whatsappMessage:
        "Hola, me interesa conocer más sobre sus propiedades en Panamares.",
      buttonContactenos: "Contáctenos Ahora",
    },
    neighborhoodDetail: {
      heroH1Prefix: "Vivir en ",
      heroH1Italic: " Panama",
      heroPropActiva: "propiedad activa",
      heroPropActivasPlural: "propiedades activas",
      heroVentaSuffix: "venta",
      heroAlquilerSuffix: "alquiler",
      heroPromedioSuffix: "promedio",
      aboutEyebrow: "Guía del barrio",
      aboutHeadingPrefix: "Sobre ",
      currentlyThereAre: "Actualmente hay",
      propiedadDisponible: "propiedad disponible",
      propiedadesDisponibles: "propiedades disponibles",
      enConnector: "en",
      ctaWhatsapp: "WhatsApp",
      ctaContactenos: "Contáctenos Ahora",
      statsPrecioPromedio: "Precio promedio",
      statsPropiedadesActivas: "Propiedades activas",
      statsPropiedadSingular: "propiedad",
      statsPropiedadPlural: "propiedades",
      statsTipoMasDisponible: "Tipo más disponible",
      ctaEyebrow: "Contáctenos",
      ctaHeadingPrefix: "¿Listo para vivir en ",
      ctaHeadingSuffixItalicTpl: (name: string) => `${name}?`,
      ctaBody:
        "Nuestros asesores conocen cada edificio y cada calle de la zona. Cuéntanos qué buscas y te mostramos las mejores opciones disponibles.",
      listingsEyebrow: "Selección destacada",
      listingsHeadingVenta: "Propiedades en Venta",
      listingsHeadingAlquiler: "Propiedades en Alquiler",
      tabComprar: "Comprar",
      tabAlquilar: "Alquilar",
      verPorTipoEnTpl: (name: string) => `Ver por tipo en ${name}`,
      noListingsEmpty: "No hay propiedades activas en este momento.",
      otrosBarriosEyebrow: "Sigue explorando",
      otrosBarriosHeading: "Otros barrios",
      whatsappMessageTpl: (name: string) =>
        `Hola, me interesa conocer propiedades en ${name}`,
      breadcrumbLabel: "Barrios",
    },
    agentDetail: {
      heroEyebrow: "Agente",
      heroListingCountTooltip: "propiedades activas",
      waCtaMobile: "Consultar por WhatsApp",
      waCtaDesktop: "WhatsApp",
      cardPropertiesActivePrefix: "",
      cardPropertiesActiveLabel: "propiedades activas",
      cardRoleFallback: "Agente",
      cardHoursLine: "Atención disponible de lunes a sábado ",
      cardHoursBold: "8am – 7pm",
      consultarPorWhatsapp: "Consultar por WhatsApp",
      llamarAhora: "Llamar ahora",
      noPropertiesEmpty:
        "Este agente no tiene propiedades activas en este momento.",
      consultarDisponibilidad: "Consultar disponibilidad",
      whatsappMessageTpl: (name: string) =>
        `Hola ${name}, me interesa conocer más sobre sus propiedades en Panamares.`,
      breadcrumbLabel: "Agentes",
      titleSuffix: " — Asesor Inmobiliario",
      descriptionTpl: (name: string, role: string) =>
        `${name}${role ? `, ${role}` : ""} en Panamares. Conoce su trayectoria y propiedades disponibles en Panama City.`,
    },
    categoryHub: {
      tipoDeInvestigacion: "Tipo de investigación",
      tabComprar: "Comprar",
      tabAlquilar: "Alquilar",
      gamaDePrecios: "Gama de precios",
      tamano: "Tamaño",
      tipoDePropiedad: "Tipo de propiedad",
      todosLosTipos: "Todos los tipos",
      barrio: "Barrio",
      todosLosBarrios: "Todos los barrios",
      habitaciones: "Habitaciones",
      banos: "Baños",
      verMas: "Ver más",
      cerrar: "Cerrar",
      limpiarFiltros: "Limpiar filtros",
      todos: "Todos",
      filtros: "Filtros",
      propiedadesDisponiblesSuffix: "propiedades disponibles",
      ordenarPorAria: "Ordenar por",
      sortRelevancia: "Relevancia",
      sortRecientes: "Más recientes",
      sortPrecioAsc: "Precio: menor a mayor",
      sortPrecioDesc: "Precio: mayor a menor",
      sortAreaDesc: "Mayor área",
      noEncontramosTpl: (q: string) => `No encontramos propiedades para "${q}".`,
      noPropiedadesConFiltros: "No hay propiedades con estos filtros.",
      filtrosDrawerTitle: "Filtros",
      cerrarFiltrosAria: "Cerrar filtros",
      aplicarFiltros: "Aplicar filtros",
      whatsappMessageVenta: "Hola, busco propiedades en venta en Panamá",
      whatsappMessageAlquiler: "Hola, busco propiedades en alquiler en Panamá",
      whatsappMessageCategoryTpl: (h1: string) =>
        `Hola, busco propiedades en ${h1}`,
    },
  },

  categories: {
    "apartamentos-en-venta": {
      h1: "Apartamentos en Venta en Panama",
      metaTitle: "Apartamentos en Venta en Panama City",
      metaDescription:
        "Encuentra apartamentos en venta en Panama City. Las mejores opciones en Punta Pacífica, Punta Paitilla, Obarrio y más zonas exclusivas.",
      seoBlock:
        "Panamares ofrece la mayor selección de apartamentos en venta en Panama City. Desde estudios hasta penthouses, encontrarás opciones en las zonas más exclusivas: Punta Pacífica, Punta Paitilla, Avenida Balboa y Obarrio. Todos los inmuebles son verificados y cuentan con información completa de precio, área en m², habitaciones, baños, estacionamientos y amenidades del edificio. Ya sea para primera vivienda, segunda residencia o inversión con retorno en alquiler, tenemos la propiedad ideal para cada perfil. Nuestros agentes especializados te acompañan en cada paso del proceso de compra, desde la visita hasta la firma del contrato.",
    },
    "apartamentos-en-alquiler": {
      h1: "Apartamentos en Alquiler en Panama",
      metaTitle: "Apartamentos en Alquiler en Panama City",
      metaDescription:
        "Alquila un apartamento en Panama City. Amplia selección en Punta Pacífica, Punta Paitilla, Avenida Balboa y más.",
      seoBlock:
        "Encuentra el apartamento en alquiler ideal en Panama City con Panamares. Tenemos opciones en Punta Pacífica, Punta Paitilla, Avenida Balboa, Obarrio y más zonas residenciales de alta demanda. Apartamentos amueblados y sin amueblar, con una o varias habitaciones, en edificios con amenidades completas: piscina, gimnasio, seguridad 24/7 y áreas sociales. Precios competitivos en dólares, contratos transparentes en español y atención personalizada de nuestros agentes. Filtra por zona, número de habitaciones o presupuesto y agenda una visita el mismo día. Encontrar tu próximo hogar en Panamá nunca fue tan fácil.",
    },
    "casas-en-venta": {
      h1: "Casas en Venta en Panama",
      metaTitle: "Casas en Venta en Panama City",
      metaDescription:
        "Compra una casa en Panama City. Selección de casas residenciales en las mejores urbanizaciones.",
      seoBlock:
        "Panamares tiene una amplia selección de casas en venta en Panama City y sus alrededores. Desde residencias familiares en Clayton y Altos del Golf hasta propiedades exclusivas en Costa del Este, Santa María y Las Cumbres. Cada casa cuenta con información detallada de área total, habitaciones, baños, acabados y urbanización. Nuestras propiedades incluyen opciones con jardín privado, piscina y área de empleados en urbanizaciones cerradas con seguridad. Nuestros agentes te orientan para encontrar la propiedad ideal según tu presupuesto, número de integrantes del hogar y estilo de vida en Panama City.",
    },
    "casas-en-alquiler": {
      h1: "Casas en Alquiler en Panama",
      metaTitle: "Casas en Alquiler en Panama City",
      metaDescription:
        "Alquila una casa en Panama City. Encuentra la opción ideal para tu familia.",
      seoBlock:
        "Encuentra la casa en alquiler perfecta para tu familia en Panama City con Panamares. Ofrecemos casas en Clayton, Altos del Golf, Costa del Este, Las Cumbres y más urbanizaciones residenciales. Opciones amuebladas y sin amueblar, con jardín, piscina, cuarto de empleados y áreas de juego para niños. Nuestras propiedades están en urbanizaciones cerradas con seguridad privada, ofreciendo comodidad y tranquilidad para toda la familia. Contratos flexibles en dólares, depósitos negociables y acompañamiento de nuestros agentes durante todo el proceso de arrendamiento.",
    },
    "penthouses-en-venta": {
      h1: "Penthouses en Venta en Panama",
      metaTitle: "Penthouses en Venta en Panama City",
      metaDescription:
        "Penthouses de lujo en venta en Panama City. Vistas panorámicas, acabados premium en Punta Pacífica y Punta Paitilla.",
      seoBlock:
        "Los penthouses en venta en Panama City representan lo más exclusivo del mercado inmobiliario panameño. Panamares cuenta con una selección curada en Punta Pacífica, Punta Paitilla y Avenida Balboa, con vistas panorámicas al océano Pacífico, terrazas privadas y acabados de primera línea. Cada propiedad incluye información completa de precio, metros cuadrados de terraza, habitaciones y amenidades del edificio. Los penthouses más cotizados de la ciudad ofrecen doble altura, piscinas privadas y acceso exclusivo desde el ascensor. Habla con nuestros agentes especializados en propiedades de lujo para recibir asesoramiento personalizado y acceder a las mejores oportunidades del mercado.",
    },
    "penthouses-en-alquiler": {
      h1: "Penthouses en Alquiler en Panama",
      metaTitle: "Penthouses en Alquiler en Panama City",
      metaDescription:
        "Penthouses de lujo en alquiler en Panama City. Vistas panorámicas, acabados premium en Punta Pacífica y Punta Paitilla.",
      seoBlock:
        "Alquila un penthouse de lujo en Panama City con Panamares. Contamos con una selección exclusiva en Punta Pacífica, Punta Paitilla y Avenida Balboa, con vistas panorámicas al océano Pacífico, terrazas privadas y acabados de primera línea. Ideales para ejecutivos, diplomáticos y familias que buscan lo mejor de la vida en Panamá sin el compromiso de compra. Nuestros penthouses en alquiler incluyen opciones amuebladas, acceso exclusivo desde el ascensor y amenidades premium del edificio. Nuestros agentes especializados en propiedades de lujo te acompañan para encontrar el penthouse perfecto según tus requerimientos y presupuesto.",
    },
    "apartaestudios-en-venta": {
      h1: "Apartaestudios en Venta en Panama",
      metaTitle: "Apartaestudios en Venta en Panama City",
      metaDescription:
        "Apartaestudios en venta en Panama City. Ideales para inversión o primera vivienda.",
      seoBlock:
        "Los apartaestudios en venta en Panama City son la opción ideal para inversión, primera vivienda o residencia céntrica. Panamares ofrece estudios en Obarrio, El Cangrejo, Marbella y zonas céntricas con alta demanda de alquiler, garantizando rentabilidad desde el primer día. Propiedades compactas y bien diseñadas, en edificios modernos con amenidades completas: gimnasio, piscina y lobby profesional. Una inversión rentable en uno de los mercados inmobiliarios más dinámicos de Latinoamérica, con precios de entrada accesibles y alta liquidez. Nuestros agentes te asesoran sobre las mejores opciones según tu perfil de inversión y presupuesto.",
    },
    "oficinas-en-venta": {
      h1: "Oficinas en Venta en Panama",
      metaTitle: "Oficinas en Venta en Panama City",
      metaDescription:
        "Oficinas en venta en Panama City. Espacios corporativos en Calle 50, Punta Pacífica y zonas empresariales.",
      seoBlock:
        "Panamares ofrece oficinas en venta en las principales zonas corporativas de Panama City. Desde pequeñas unidades en Obarrio y Marbella hasta plantas completas en Calle 50, Punta Pacífica y el corredor financiero de Via España. Espacios modernos con acabados profesionales, estacionamiento incluido y acceso a servicios de primer nivel. Adquirir tu oficina propia en Panama City es una decisión estratégica: contratos en dólares, mercado corporativo en crecimiento y alta demanda de arrendamiento. Invierte en el hub financiero de Latinoamérica con el respaldo de nuestros agentes especializados en inmuebles comerciales y corporativos.",
    },
    "oficinas-en-alquiler": {
      h1: "Oficinas en Alquiler en Panama",
      metaTitle: "Oficinas en Alquiler en Panama City",
      metaDescription:
        "Alquila una oficina en Panama City. Espacios en las principales zonas comerciales y financieras.",
      seoBlock:
        "Alquila una oficina en Panama City con Panamares y establece tu empresa en el hub financiero de la región. Tenemos opciones en Calle 50, Obarrio, Marbella y Punta Pacífica para empresas de cualquier tamaño, desde unidades individuales hasta plantas completas. Espacios listos para operar, con estacionamiento, seguridad, salas de reuniones y servicios de telecomunicaciones incluidos. También disponemos de espacios de coworking y oficinas para startups y consultores independientes. Contratos flexibles en dólares y asesoría personalizada para encontrar el espacio que mejor se adapta a las necesidades de tu empresa.",
    },
    "locales-comerciales-en-venta": {
      h1: "Locales Comerciales en Venta en Panama",
      metaTitle: "Locales Comerciales en Venta en Panama",
      metaDescription:
        "Locales comerciales en venta en Panama City. Invierte en el sector comercial panameño.",
      seoBlock:
        "Invierte en locales comerciales en venta en Panama City con Panamares. Encontrarás opciones en zonas de alto tráfico peatonal y vehicular como San Francisco, Obarrio y Via España — ideales para retail, restaurantes, consultorios médicos y servicios profesionales. Cada propiedad incluye información completa de área total, frente en metros lineales y precio por metro cuadrado, facilitando el análisis de viabilidad de tu negocio. Panama City es uno de los mercados comerciales más activos de Centroamérica, con alta demanda de locales bien ubicados. Nuestros agentes te ayudan a evaluar el potencial de retorno de cada local.",
    },
    "locales-comerciales-en-alquiler": {
      h1: "Locales Comerciales en Alquiler en Panama",
      metaTitle: "Locales Comerciales en Alquiler en Panama",
      metaDescription:
        "Alquila un local comercial en Panama City. Opciones en Obarrio, San Francisco y más zonas.",
      seoBlock:
        "Panamares tiene locales comerciales en alquiler en las zonas más transitadas de Panama City. Desde pequeños locales en Via España y El Dorado hasta espacios amplios en centros comerciales de Obarrio, San Francisco y Marbella. Ideales para arrancar o expandir tu negocio en uno de los mercados de consumo más dinámicos de Latinoamérica. Nuestros locales en alquiler incluyen opciones con fachada a calle, zona de carga y descarga y acceso para personas con movilidad reducida. Contratos flexibles en dólares y orientación de nuestros agentes para elegir la ubicación que maximice la visibilidad de tu marca.",
    },
    "terrenos-en-venta": {
      h1: "Terrenos en Venta en Panama",
      metaTitle: "Terrenos en Venta en Panama",
      metaDescription:
        "Terrenos en venta en Panama City y provincia. Para construcción residencial o comercial.",
      seoBlock:
        "Encuentra terrenos en venta en Panama para tu próximo proyecto residencial o comercial con Panamares. Ofrecemos lotes en Panama City, Panamá Oeste, La Chorrera y provincia, con acceso a servicios básicos y vías principales de comunicación. Cada terreno incluye información de área en m², zonificación permitida, topografía y precio por metro cuadrado. Ideal para constructoras, desarrolladoras e inversores privados que buscan oportunidades de desarrollo en un mercado con alta valorización. También disponemos de terrenos con planos aprobados listos para construir. Nuestros agentes te acompañan en el análisis y la negociación de cada oportunidad.",
    },
    "terrenos-en-alquiler": {
      h1: "Terrenos en Alquiler en Panama",
      metaTitle: "Terrenos en Alquiler en Panama",
      metaDescription:
        "Terrenos en alquiler en Panama City y provincia. Para uso comercial, industrial o agrícola.",
      seoBlock:
        "Encuentra terrenos en alquiler en Panama para tu proyecto comercial, industrial o agropecuario con Panamares. Ofrecemos lotes en Panama City, Panamá Oeste y provincia, con acceso a vías principales y servicios básicos. Cada terreno incluye información de área en m², zonificación permitida y precio mensual. Ideal para empresas que necesitan espacio temporal para operaciones, almacenaje o desarrollo de proyectos sin invertir en compra. Nuestros agentes te orientan para encontrar el terreno en alquiler que mejor se adapta a las necesidades de tu negocio.",
    },
    "casas-de-playa-en-alquiler": {
      h1: "Casas de Playa en Alquiler en Panama",
      metaTitle: "Casas de Playa en Alquiler en Panama",
      metaDescription:
        "Casas de playa en alquiler en Panama. Propiedades en Coclé, Farallón y las mejores costas panameñas.",
      seoBlock:
        "Alquila una casa de playa en Panama con Panamares. Propiedades frente al mar en Farallón, Coronado, Santa Clara y las mejores playas de Coclé, a menos de dos horas de Panama City. Desde cabañas privadas hasta villas con piscina y acceso directo a la playa. Ideal para vacaciones, fines de semana o estancias temporales en uno de los destinos costeros más cotizados de Centroamérica. También disponemos de opciones para alquiler turístico de corta estancia. Nuestros agentes conocen cada comunidad costera para ayudarte a encontrar la casa de playa perfecta.",
    },
    "casas-de-playa-en-venta": {
      h1: "Casas de Playa en Venta en Panama",
      metaTitle: "Casas de Playa en Venta en Panama",
      metaDescription:
        "Casas de playa en venta en Panama. Propiedades en Coclé, Farallón y las mejores costas panameñas.",
      seoBlock:
        "Descubre casas de playa en venta en Panama con Panamares. Propiedades frente al mar en Farallón, Coronado, Santa Clara y las mejores playas de Coclé, a menos de dos horas de Panama City por la autopista Panamericana. Desde cabañas privadas y villas de un nivel hasta residencias de lujo con piscina, acceso directo a la playa y vistas al Pacífico. La mejor inversión para segunda vivienda, residencia vacacional o proyecto de alquiler turístico en uno de los destinos costeros más cotizados de Centroamérica. Nuestros agentes conocen cada proyecto y comunidad costera para orientarte en la mejor decisión.",
    },
    "edificios-en-venta": {
      h1: "Edificios en Venta en Panama",
      metaTitle: "Edificios en Venta en Panama City",
      metaDescription:
        "Edificios en venta en Panama City. Inversión inmobiliaria de gran escala.",
      seoBlock:
        "Panamares presenta edificios en venta en Panama City para inversores institucionales y privados que buscan rentabilidad a gran escala. Desde edificios residenciales con unidades rentadas y flujo de caja inmediato hasta torres de oficinas en zonas prime de la ciudad. Cada propiedad incluye información de área total construida, número de unidades o plantas, ocupación actual, ingresos por alquiler y precio total. El mercado panameño ofrece seguridad jurídica, contratos en dólares y alta demanda de arrendamiento. Una oportunidad única para escalar tu portafolio inmobiliario en el mercado más estable de la región.",
    },
    "fincas-en-venta": {
      h1: "Fincas en Venta en Panama",
      metaTitle: "Fincas en Venta en Panama",
      metaDescription:
        "Fincas en venta en Panama. Propiedades rurales y agropecuarias en Coclé y provincias.",
      seoBlock:
        "Encuentra fincas en venta en Panama con Panamares. Propiedades rurales en Coclé, Chiriquí, Veraguas y otras provincias, con hectáreas para uso agropecuario, ganadero, ecoturístico o residencial de campo. Cada finca incluye información detallada de superficie total, acceso vial, fuentes de agua, tipo de suelo y uso permitido. También disponemos de fincas con infraestructura existente: corrales, sistemas de riego y viviendas de apoyo. Una inversión sólida y diversificada para quienes buscan oportunidades fuera de la ciudad, con potencial de valorización en zonas de creciente interés turístico y agroproductivo en Panamá.",
    },
    "lotes-comerciales-en-venta": {
      h1: "Lotes Comerciales en Venta en Panama",
      metaTitle: "Lotes Comerciales en Venta en Panama",
      metaDescription:
        "Lotes comerciales y terrenos en venta en Panama City. Oportunidades para desarrollo.",
      seoBlock:
        "Panamares ofrece lotes comerciales en venta en Panama City y zonas de expansión urbana para desarrolladores e inversores de largo plazo. Ideales para proyectos mixtos, centros comerciales, hoteles, edificios de oficinas o desarrollos residenciales en altura. Ubicaciones estratégicas en corredores de alto crecimiento con acceso a vías principales, redes de servicios y aprobaciones de zonificación comercial vigentes. Panama City es una de las ciudades de mayor dinamismo constructivo de Latinoamérica, con demanda creciente de suelo urbanizable bien ubicado. Nuestros agentes te brindan análisis de zonificación y asesoría completa para maximizar el potencial de cada lote.",
    },
  },

  faqs: {
    answers: {
      processCompra:
        "El proceso de compra en Panama consta de cuatro etapas: selección del inmueble, firma de la promesa de compraventa, trámites notariales y registro en el Registro Público. Los contratos se firman en español y los precios están en dólares americanos. Panamares te acompaña en cada paso, coordinando con abogados y gestores de trámites para que el proceso sea ágil y seguro.",
      extranjeroCompra:
        "Sí. Los extranjeros tienen los mismos derechos de propiedad que los ciudadanos panameños. No se requiere residencia ni permiso especial para adquirir inmuebles. Panama ofrece seguridad jurídica respaldada por el Registro Público y contratos en dólares, lo que lo convierte en uno de los mercados más atractivos para inversores internacionales en Latinoamérica.",
      extranjeroAlquiler:
        "Sí. Los extranjeros pueden alquilar libremente en Panama sin necesidad de permiso especial. Los contratos de arrendamiento se firman en español y los pagos se realizan en dólares americanos. Generalmente se solicita pasaporte vigente, referencias y uno o dos meses de depósito. Panamares te asesora para que el proceso sea sencillo desde el primer contacto.",
      preciosDolares:
        "Sí. Panama usa el dólar americano como moneda oficial, lo que elimina el riesgo cambiario para inversores y arrendatarios internacionales. Todos los contratos de alquiler y los precios de los listados están expresados en USD.",
      mejoresBarriosCompra: (typeLabel: string, zones: string) =>
        `Las zonas más demandadas para ${typeLabel} son ${zones}. Cada barrio tiene su propio perfil de precio, estilo de vida y potencial de revalorización. Panamares tiene listados activos en todas estas zonas y puede asesorarte sobre cuál se adapta mejor a tu presupuesto y objetivos.`,
      mejoresBarriosAlquiler: (typeLabel: string, zones: string) =>
        `Las zonas con mayor oferta y demanda de ${typeLabel} en alquiler son ${zones}. La elección del barrio depende de tu presupuesto, necesidad de transporte, proximidad al trabajo y estilo de vida. Nuestros asesores te orientan para encontrar la opción que mejor se adapta a tus prioridades.`,
      documentosAlquilerCategory: (typeLabel: string) =>
        `Generalmente se solicita identificación vigente (pasaporte o cédula), referencias personales o laborales, comprobante de ingresos y uno o dos meses de depósito en garantía. Para extranjeros basta con el pasaporte. Panamares coordina con el propietario para agilizar la revisión de documentos y la firma del contrato.${typeLabel ? "" : ""}`,
      documentosAlquilerGeo: (typeLabel: string) =>
        `Generalmente se solicita identificación vigente (pasaporte o cédula), referencias y uno o dos meses de depósito en garantía. Para extranjeros basta con el pasaporte. Panamares coordina con el propietario para agilizar la revisión de documentos y la firma del contrato.${typeLabel ? "" : ""}`,
      porQueComprarBarrio: (typeLabel: string, neighborhoodName: string) =>
        `${neighborhoodName} es una de las zonas más valoradas de Panama City por su ubicación estratégica, calidad de vida y potencial de revalorización. La demanda sostenida de propiedades en este barrio lo convierte en una opción sólida tanto para residencia propia como para inversión a largo plazo.${typeLabel ? "" : ""}`,
      porQueAlquilarBarrio: (typeLabel: string, neighborhoodName: string) =>
        `${neighborhoodName} combina acceso a servicios, transporte y una comunidad consolidada que lo hace ideal para familias, profesionales y expatriados. La oferta de ${typeLabel} en este barrio es variada, con opciones amuebladas y sin amueblar que se adaptan a distintos presupuestos y estilos de vida.`,
    },
    questions: {
      cuantoCuestaComprar: (typeLabel: string) =>
        `¿Cuánto cuesta comprar ${typeLabel} en Panama City?`,
      cuantoCuestaAlquilar: (typeLabel: string) =>
        `¿Cuánto cuesta alquilar ${typeLabel} en Panama City?`,
      cuantoCuestaComprarBarrio: (typeLabel: string, neighborhoodName: string) =>
        `¿Cuánto cuesta comprar ${typeLabel} en ${neighborhoodName}?`,
      cuantoCuestaAlquilarBarrio: (
        typeLabel: string,
        neighborhoodName: string,
      ) => `¿Cuánto cuesta alquilar ${typeLabel} en ${neighborhoodName}?`,
      mejoresBarriosCompra: (typeLabel: string) =>
        `¿Cuáles son los mejores barrios para comprar ${typeLabel} en Panama?`,
      mejoresBarriosAlquiler: (typeLabel: string) =>
        `¿Cuáles son los mejores barrios para alquilar ${typeLabel} en Panama?`,
      procesoCompra: (typeLabel: string) =>
        `¿Cómo funciona el proceso de compra de ${typeLabel} en Panama?`,
      procesoCompraSimple: "¿Cómo funciona el proceso de compra en Panama?",
      extranjeroCompraCategory: (typeLabel: string) =>
        `¿Puede un extranjero comprar ${typeLabel} en Panama?`,
      extranjeroCompraGeo: (typeLabel: string, neighborhoodName: string) =>
        `¿Puede un extranjero comprar ${typeLabel} en ${neighborhoodName}?`,
      documentosAlquiler: (typeLabel: string) =>
        `¿Qué documentos necesito para alquilar ${typeLabel} en Panama?`,
      preciosEnDolares: "¿Los precios de alquiler son en dólares en Panama?",
      porQueComprarBarrio: (typeLabel: string, neighborhoodName: string) =>
        `¿Por qué comprar ${typeLabel} en ${neighborhoodName}, Panama?`,
      porQueAlquilarBarrio: (typeLabel: string, neighborhoodName: string) =>
        `¿Por qué alquilar ${typeLabel} en ${neighborhoodName}, Panama?`,
      extranjeroAlquilar: "¿Puede un extranjero alquilar en Panama?",
    },
    priceRefs: {
      apartamento: {
        venta:
          "Los apartamentos en venta en Panama City oscilan entre $120,000 para estudios y $1,500,000+ para penthouses en torres frente al mar. Los apartamentos estándar de 2-3 habitaciones en Punta Pacífica o Punta Paitilla suelen cotizarse entre $280,000 y $600,000, con precio por metro cuadrado que varía según el edificio y la vista.",
        alquiler:
          "El alquiler de apartamentos en Panama City parte desde $700/mes para estudios hasta $5,000+/mes para unidades de lujo en primera línea. Un apartamento de 2 habitaciones en zona exclusiva como Punta Pacífica o Avenida Balboa ronda los $1,200–$2,500/mes dependiendo del edificio y amenidades.",
      },
      penthouse: {
        venta:
          "Los penthouses en venta en Panama City parten desde $500,000 y pueden superar los $3,000,000 en torres de primera línea con vistas al Pacífico. La diferencia de precio frente a un apartamento estándar refleja la terraza privada, los acabados premium y la exclusividad del piso más alto del edificio.",
        alquiler:
          "El alquiler de penthouses en Panama City varía entre $3,000 y $10,000/mes según la torre, el barrio y las amenidades. Son la opción preferida de ejecutivos y familias que buscan espacio, privacidad y vistas panorámicas sin comprometer la ubicación céntrica.",
      },
      casa: {
        venta:
          "Las casas en venta en Panama City oscilan entre $250,000 para residencias básicas y $3,000,000+ para villas en urbanizaciones cerradas de lujo. Clayton, Altos del Golf y Costa del Este ofrecen opciones entre $400,000 y $1,200,000 con jardín, piscina y seguridad privada.",
        alquiler:
          "El alquiler de casas en Panama City parte desde $1,200/mes y puede llegar a $8,000/mes para villas de lujo. Las urbanizaciones más demandadas como Clayton, Santa María y Costa del Este tienen precios entre $2,000 y $5,000/mes, incluidas áreas verdes y acceso a club privado.",
      },
      oficina: {
        venta:
          "Las oficinas en venta en Panama City van desde $80,000 para módulos pequeños hasta $2,000,000+ para plantas completas en torres corporativas de Calle 50. El precio por metro cuadrado en zona prime oscila entre $2,000 y $4,500 USD según acabados, piso y proximidad al centro financiero.",
        alquiler:
          "El alquiler de oficinas en Panama City parte desde $500/mes para espacios pequeños hasta $15,000+/mes para plantas completas en Calle 50 o Marbella. El precio promedio por metro cuadrado en zona corporativa es de $18–$35 USD/mes, generalmente sin incluir estacionamiento.",
      },
      local: {
        venta:
          "Los locales comerciales en venta en Panama City oscilan entre $60,000 para pequeños módulos y $1,500,000+ para locales en zonas de alto tráfico. El precio por metro cuadrado depende del frente a la calle, la zona y la afluencia de público.",
        alquiler:
          "El alquiler de locales comerciales en Panama City varía entre $400 y $15,000/mes. En zonas de alta afluencia como Obarrio y San Francisco, el precio promedio ronda los $20–$45 USD/m² al mes, mientras que en zonas secundarias puede estar entre $10 y $20 USD/m².",
      },
      apartaestudio: {
        venta:
          "Los apartaestudios en venta en Panama City oscilan entre $80,000 y $250,000. Su principal atractivo es el retorno por alquiler, que puede superar el 6% anual en zonas con alta demanda de inquilinos corporativos como El Cangrejo u Obarrio.",
        alquiler:
          "El alquiler de apartaestudios en Panama City parte desde $600/mes. Su alta demanda entre ejecutivos y estudiantes los convierte en uno de los segmentos más dinámicos del mercado, especialmente en barrios céntricos con acceso a servicios.",
      },
      terreno: {
        venta:
          "Los terrenos en venta en Panama varían enormemente según la zona: desde $50/m² en áreas rurales hasta $2,000+/m² en zonas prime de Panama City. Los lotes en urbanizaciones cerradas de Costa del Este o Santa María suelen costar entre $300 y $800/m².",
        alquiler: "—",
      },
      "casa de playa": {
        venta:
          "Las casas de playa en venta en Panama oscilan entre $150,000 para cabañas básicas y $2,000,000+ para villas frente al mar en Farallón o Coronado. El valor por metro cuadrado sigue creciendo gracias al auge del turismo y la demanda de alquiler vacacional.",
        alquiler: "—",
      },
      default: {
        venta:
          "Los precios varían según zona, acabados y características del inmueble. Consulta con nuestros asesores para obtener un rango actualizado y comparar las opciones disponibles en el mercado.",
        alquiler:
          "Los precios de alquiler varían según la zona y las características del inmueble. Contacta con nuestros asesores para obtener precios actualizados y comparar las opciones disponibles.",
      },
    },
    zonesByType: {
      apartamento: "Punta Pacífica, Punta Paitilla, Avenida Balboa y Obarrio",
      penthouse: "Punta Pacífica, Punta Paitilla y Avenida Balboa",
      casa: "Clayton, Altos del Golf, Costa del Este y Santa María",
      oficina: "Calle 50, Obarrio y Marbella",
      local: "Obarrio, San Francisco y Vía España",
      apartaestudio:
        "El Cangrejo, Obarrio y el centro histórico de Panama City",
      terreno: "zonas de expansión de Panama City, Panamá Oeste y Coclé",
      "casa de playa": "Farallón, Coronado y las costas de Coclé",
      default: "las principales zonas de Panama City",
    },
  },
};
