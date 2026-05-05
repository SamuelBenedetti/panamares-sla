// English copy. Empty in PR1 — populated in PR2 by translation pass.
// Shape MUST match `es.ts` exactly. The `: Copy` annotation is the parity guard:
// TypeScript fails the build if any key is missing or has the wrong type.

import type { Copy } from "./types";

export const en: Copy = {
  layout: {
    nav: {
      comprar: "Buy",
      alquilar: "Rent",
      barrios: "Neighborhoods",
      nosotros: "About",
      verTodas: "View all",
      verTodos: "View all",
      apartamentos: "Apartments",
      apartaestudios: "Studios",
      casas: "Houses",
      penthouses: "Penthouses",
      oficinas: "Offices",
      locales: "Retail spaces",
      terrenos: "Land",
      casasDePlaya: "Beach houses",
      edificios: "Buildings",
      fincas: "Farms",
      lotesComerciales: "Commercial lots",
    },
    cta: {
      whatsapp: "WhatsApp",
      contactenos: "Contact us",
      whatsappDefaultMessage:
        "Hi, I'd like to learn more about your properties.",
    },
    footer: {
      tagline:
        "Luxury real estate specialists in Panama City. Over 15 years connecting clients with exceptional properties.",
      sectionPropiedades: "Properties",
      sectionBarrios: "Neighborhoods",
      sectionContacto: "Contact",
      copyrightText: (year: number) =>
        `© ${year} Panamares. All rights reserved.`,
      linkPrivacidad: "Privacy",
      linkTerminos: "Terms",
    },
    breadcrumb: {
      inicio: "Home",
      barrios: "Neighborhoods",
      agentes: "Agents",
    },
  },

  pages: {
    home: {
      hero: {
        eyebrow: "Panama City & Luxury Properties",
        titleLine1: "Real Estate ",
        titleLine2Italic: "in Panama",
        subtitle: {
          regular: "Exclusive properties in ",
          bold: "the city's most desirable areas.",
        },
      },
      propertyTypeShortcuts: {
        eyebrow: "Browse by type",
        heading: "What kind of property are you looking for?",
        labels: {
          apartamentos: "Apartments",
          casas: "Houses",
          penthouses: "Penthouses",
          oficinas: "Offices",
          locales: "Retail",
          terrenos: "Land",
        },
        countSuffix: (n: number) => (n > 0 ? `${n} prop.` : "—"),
      },
      featured: {
        eyebrow: "Featured selection",
        heading: "Properties for Sale",
        emptyState: "Featured properties coming soon.",
        verMas: "View more properties",
      },
      neighborhoodCards: {
        eyebrow: "Top neighborhoods",
        heading: "Browse by Location",
        precioPromedio: "Average price",
        propiedades: "Properties",
        propiedadesEn: (name: string) => `Properties in ${name}`,
      },
      trustStrip: {
        labelActiveListings: "Active Listings",
        labelAgents: "Specialized Agents",
        labelYears: "Years in the Market",
        labelClientsSatisfied: "Satisfied Clients",
      },
    },
    sobreNosotros: {
      meta: {
        title: "About Us",
        description:
          "Panamares is a luxury real estate agency in Panama City. Meet our team and learn about our track record in the Panamanian market.",
      },
      breadcrumbLabel: "About Us",
      hero: {
        eyebrow: "Who we are",
        titleLine1: "Over 15 years ",
        titleLine2Italic: "connecting dreams ",
        titleLine3: "with properties",
        body: {
          bold: "Panamares was born from one conviction: that the luxury real estate market in Panama ",
          light:
            "deserved a different kind of representation — more honest, more refined, more human.",
        },
      },
      oficina: {
        eyebrow: "Our office",
        locationLine1: "Punta Pacífica,",
        locationLine2: "Panama City",
        imageAlt: "Our office in Punta Pacífica, Panama City",
      },
      stats: {
        labelAnos: "Years in the Market",
        labelPropiedadesVendidas: "Properties Sold",
        labelTransacciones: "In Transactions",
        labelSatisfechos: "Satisfied Clients",
      },
      ubicacion: {
        eyebrow: "Find us",
        heading: "Torre Oceánica, 18th Floor — Punta Pacífica",
      },
      historia: {
        eyebrow: "Our story",
        titleLine1: "Built on ",
        titleLine2Italic: "trust",
        p1: "Panamares was founded in 2009 by Valeria Moreno, with the vision of building a firm that put the client — not the commission — at the center of every decision.",
        p2: "Over more than a decade, we've built a reputation based on transparency, honest investment advice and a deep understanding of the Panamanian market.",
        p3Lead:
          "Today we are a team of 18 specialized agents, present in the main residential and commercial corridors of ",
        p3Cities:
          "Panama City: Punta Pacífica, Punta Paitilla, Avenida Balboa and Costa del Este.",
        ctaVerPropiedades: "View our properties",
        cards: {
          confianza: {
            title: "Absolute trust",
            bodyPrefix: "Every transaction is handled with full ",
            bodyBold: "transparency",
            bodySuffix: ", ethics and care for our clients.",
          },
          servicio: {
            title: "Premium service",
            body: "Personalized attention from the first contact through the final signing, with no middlemen.",
          },
          inversion: {
            title: "Investment perspective",
            body: "We advise with real market data to secure the best wealth decision.",
          },
          conocimiento: {
            title: "Local knowledge",
            body: "Deep expertise in every Panama City neighborhood and how property values move there.",
          },
        },
      },
      equipo: {
        eyebrow: "The team",
        heading: "Agents you can trust",
      },
      reconocimientos: {
        eyebrow: "Recognitions",
        titleLine1: "Recognized as the ",
        titleLine2Italic: "top real estate firm",
        awards: {
          excelencia: {
            title: "Real Estate Excellence Award",
            sub: "Panamá 2023",
          },
          topAgencias: {
            title: "Top 5 Luxury Agencies",
            sub: "LAMag 2022",
          },
          servicio: {
            title: "Best Customer Service",
            sub: "ACOBIR 2021",
          },
          remax: {
            title: "RE/MAX Platinum Certification",
            sub: "2019–2024",
          },
        },
      },
      ctaContacto: {
        eyebrow: "Have a question?",
        heading: "We're here to help",
        bodyLight: "Reach out directly to one of our agents ",
        bodyBold: "for personalized guidance with no commitment required.",
        button: "Contact Us Now",
      },
    },
    contacto: {
      meta: {
        title: "Contact",
        description:
          "Contact Panamares, a luxury real estate firm in Panama City. Call us, message us on WhatsApp or visit us in Punta Pacífica. Agents available Monday through Saturday.",
      },
      breadcrumbLabel: "Contact",
      hero: {
        eyebrow: "Contact us",
        titleLine1: "Get in touch with ",
        titleLine2Italic: "Panamares",
        bodyBold:
          "Our team of agents is available to answer your questions,",
        bodyRegular:
          "schedule tours and guide you through every step of the process.",
      },
      whatsappBanner: {
        heading: "Want an immediate reply?",
        subtitle: "Message us on WhatsApp — we'll respond in minutes.",
        button: "Open WhatsApp",
        message: "Hi, I'm interested in a property at Panamares.",
      },
      sidebar: {
        labelDireccion: "Address",
        labelTelefono: "Phone",
        labelCorreo: "Email",
        labelHorario: "Hours",
        cityLine: (locality: string) => `${locality}, Panama City`,
        horario: {
          lunVie: { label: "Mon – Fri:", range: "8:00 – 18:00" },
          sabados: { label: "Saturday:", range: "9:00 – 13:00" },
        },
        ubicacionEyebrow: "Our location",
        mapTitle: (street: string, locality: string) =>
          `Panamares — ${street}, ${locality}`,
      },
      conoceMejor: {
        eyebrow: "Get to know us",
        body: "Over 15 years connecting families and investors with the best properties in Panama.",
        cta: "About Panamares →",
      },
      uneteEquipo: {
        eyebrow: "Are you an independent agent?",
        heading: "Join the Panamares team",
        button: "Message us",
        message: "Hi, I'm a real estate agent and I'd like to join the Panamares team.",
      },
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
      meta: {
        title: "Panama City Neighborhoods | Area Guide",
        description:
          "Explore Panama City's top neighborhoods: Punta Pacífica, Punta Paitilla, Avenida Balboa, Costa del Este and more. A complete guide to properties by area.",
      },
      breadcrumbLabel: "Neighborhoods",
      h1Prefix: "Neighborhoods of ",
      h1Italic: "Panama City",
      zonesAvailableLabel: "Areas with available properties",
      masZonasEyebrow: "MORE AREAS",
      masZonasTitleLine1: "Other",
      masZonasTitleLine2Italic: "neighborhoods",
      precioPromedio: "Average price",
      propiedades: "Properties",
      ctaEyebrow: "Not sure where to start?",
      ctaHeading: "We'll help you choose",
      ctaBody:
        "Our agents know every area inside out. Tell us what you're looking for and we'll guide you to the perfect neighborhood for you.",
      ctaButton: "Talk to an agent",
    },
    agentesIndex: {
      meta: {
        title: "Our Real Estate Agents",
        description:
          "Meet the Panamares team. Real estate experts in Panama City with years of experience in Punta Pacífica, Punta Paitilla and the capital's top areas.",
      },
      breadcrumbLabel: "Agents",
      h1: "Real Estate Agents in Panama",
      agentesDisponiblesSuffix: "agents available",
      teamEyebrow: "Panamares Team",
      hablarConElEquipo: "Talk to the team",
      noAgentsYet: "No agents registered yet.",
      ctaEyebrow: "Are you an independent agent?",
      ctaHeading: "Join the Panamares team",
      ctaBody:
        "If you're an independent real estate agent and want to grow with us, get in touch. We're always looking for talent.",
      ctaButton: "Contact us",
    },
    propiedadesEnVenta: {
      meta: {
        title: "Properties for Sale in Panama",
        description:
          "Panamares brings together the largest selection of properties for sale in Panama City. Apartments, houses, penthouses, offices, retail spaces and land in Punta Pacífica, Punta Paitilla, Costa del Este and other top areas. Every listing comes with full details on price, area, bedrooms and amenities. Filter by property type, neighborhood or budget and find the right option to buy or invest in Central America's most solid real estate market.",
      },
      h1: "Properties for Sale in Panama",
      description:
        "Panamares brings together the largest selection of properties for sale in Panama City. Apartments, houses, penthouses, offices, retail spaces and land in Punta Pacífica, Punta Paitilla, Costa del Este and other top areas. Every listing comes with full details on price, area, bedrooms and amenities. Filter by property type, neighborhood or budget and find the right option to buy or invest in Central America's most solid real estate market.",
      breadcrumbLabel: "Properties for Sale in Panama",
      whatsappMessage: "Hi, I'm looking for properties for sale in Panama",
    },
    propiedadesEnAlquiler: {
      meta: {
        title: "Properties for Rent in Panama",
        description:
          "Panamares has the most complete selection of properties for rent in Panama City. Furnished and unfurnished apartments, houses, offices and retail spaces in Punta Pacífica, Punta Paitilla, Obarrio, Calle 50 and more areas. Dollar contracts, English-friendly service and specialized agents who walk you through the whole process. Find your next rental in the city with the most dynamic real estate market in the region.",
      },
      h1: "Properties for Rent in Panama",
      description:
        "Panamares has the most complete selection of properties for rent in Panama City. Furnished and unfurnished apartments, houses, offices and retail spaces in Punta Pacífica, Punta Paitilla, Obarrio, Calle 50 and more areas. Dollar contracts, English-friendly service and specialized agents who walk you through the whole process. Find your next rental in the city with the most dynamic real estate market in the region.",
      breadcrumbLabel: "Properties for Rent in Panama",
      whatsappMessage: "Hi, I'm looking for properties for rent in Panama",
    },
    buscar: {
      meta: {
        title: "Search Properties",
        description:
          "Search properties in Panama City with our guided assistant: define intent, type, bedrooms and budget in four steps.",
      },
      stepLabel: "step",
      stepSeparator: "/04",
      steps: {
        intencion: {
          line1: "What are you",
          line2Italic: "looking for?",
          options: { comprar: "Buy", alquilar: "Rent" },
        },
        tipo: {
          line1: "What type of",
          line2Italic: "property?",
          options: {
            residencial: "Residential",
            comercial: "Commercial",
            terreno: "Land",
          },
        },
        habitaciones: {
          line1: "How many",
          line2Italic: "bedrooms?",
          options: {
            uno: "1 bedroom",
            dos: "2 bedrooms",
            tres: "3 bedrooms",
            cuatroPlus: "4+ bedrooms",
          },
        },
        presupuesto: {
          line1: "What is your",
          line2Italic: "budget?",
          comprarOptions: {
            menos150k: "Under $150k",
            r150_350: "$150k – $350k",
            r350_700: "$350k – $700k",
            r700_1500: "$700k – $1.5M",
            mas1500: "Over $1.5M",
            flexible: "Flexible",
          },
          alquilarOptions: {
            menos800: "Under $800/mo",
            r800_1500: "$800 – $1,500/mo",
            r1500_3000: "$1,500 – $3,000/mo",
            r3000_6000: "$3,000 – $6,000/mo",
            mas6000: "Over $6,000/mo",
            flexible: "Flexible",
          },
        },
      },
      retornar: "Back",
      omitir: "Skip",
    },
  },

  components: {
    propertyCard: {
      tagRecomendado: "Recommended",
      tagPrecioJusto: "Fair Price",
      tagAlquilado: "Rented",
      tagFeatured: "Featured",
      verPropiedad: "View property",
      labelHabitacionesShort: "bd.",
      labelBanos: "ba.",
      labelMetros: "m²",
      whatsappPrefix: "Hi, I'm interested in this property: ",
    },
    whatsappButton: {
      cta: "Inquire via WhatsApp",
      ariaFloating: "Contact via WhatsApp",
    },
    shareButton: {
      label: "Share",
      copied: "Copied!",
      aria: "Share property",
    },
    agentCard: {
      verPerfil: "View profile",
      defaultRole: "Agent",
    },
    seoBlock: {
      leerMas: "Read more",
      leerMenos: "Read less",
    },
    neighborhoodSlider: {
      eyebrow: "FEATURED",
    },
    contactForm: {
      labelNombre: "Full name *",
      placeholderNombre: "e.g. María González",
      labelCorreo: "Email *",
      placeholderCorreo: "email@example.com",
      labelTelefono: "Phone / WhatsApp",
      placeholderTelefono: "+507 6587-1849",
      labelMotivo: "Reason for contact",
      motivoPlaceholder: "Select…",
      motivos: {
        compra: "Buying a property",
        alquiler: "Renting a property",
        inversion: "Investment",
        visita: "Schedule a tour",
        otro: "Other",
      },
      labelMensaje: "Message",
      placeholderMensaje:
        "Tell us what you're looking for: budget range, areas of interest…",
      buttonSend: "Send message",
      buttonSending: "Sending...",
      successHeading: "Message sent!",
      successBody: "We'll get back to you shortly.",
      successButtonWhatsapp: "Open WhatsApp",
      errorMessage:
        "Couldn't send. Try again or reach us on WhatsApp.",
    },
    faq: {
      defaultTitle: "Frequently asked questions",
    },
    faqSection: {
      eyebrow: "FAQ",
      heading: "Frequently asked questions",
    },
    pagination: {
      previous: "← Previous",
      next: "Next →",
      ariaLabel: "Pagination",
    },
    breadcrumb: {
      inicio: "Home",
      barrios: "Neighborhoods",
      agentes: "Agents",
    },
    ctaSection: {
      eyebrow: "Contact us",
      titleLine1: "Ready to find your ",
      titleLine2Italic: "ideal property?",
      subtitle:
        "Our agents are available to help you find the perfect property in Panama.",
      whatsappMessage:
        "Hi, I'd like to learn more about your Panamares properties.",
      buttonContactenos: "Contact Us Now",
    },
    neighborhoodDetail: {
      heroH1Prefix: "Living in ",
      heroH1Italic: " Panama",
      heroPropActiva: "active listing",
      heroPropActivasPlural: "active listings",
      heroVentaSuffix: "for sale",
      heroAlquilerSuffix: "for rent",
      heroPromedioSuffix: "average",
      aboutEyebrow: "Neighborhood guide",
      aboutHeadingPrefix: "About ",
      currentlyThereAre: "There are currently",
      propiedadDisponible: "property available",
      propiedadesDisponibles: "properties available",
      enConnector: "in",
      ctaWhatsapp: "WhatsApp",
      ctaContactenos: "Contact Us Now",
      statsPrecioPromedio: "Average price",
      statsPropiedadesActivas: "Active listings",
      statsPropiedadSingular: "property",
      statsPropiedadPlural: "properties",
      statsTipoMasDisponible: "Most available type",
      ctaEyebrow: "Contact us",
      ctaHeadingPrefix: "Ready to live in ",
      ctaHeadingSuffixItalicTpl: (name: string) => `${name}?`,
      ctaBody:
        "Our agents know every building and street in the area. Tell us what you're looking for and we'll show you the best options available.",
      listingsEyebrow: "Featured selection",
      listingsHeadingVenta: "Properties for Sale",
      listingsHeadingAlquiler: "Properties for Rent",
      tabComprar: "Buy",
      tabAlquilar: "Rent",
      verPorTipoEnTpl: (name: string) => `Browse by type in ${name}`,
      noListingsEmpty: "No active listings at the moment.",
      otrosBarriosEyebrow: "Keep exploring",
      otrosBarriosHeading: "Other neighborhoods",
      whatsappMessageTpl: (name: string) =>
        `Hi, I'd like to know more about properties in ${name}`,
      breadcrumbLabel: "Neighborhoods",
    },
    agentDetail: {
      heroEyebrow: "Agent",
      heroListingCountTooltip: "active listings",
      waCtaMobile: "Message on WhatsApp",
      waCtaDesktop: "WhatsApp",
      cardPropertiesActivePrefix: "",
      cardPropertiesActiveLabel: "active listings",
      cardRoleFallback: "Agent",
      cardHoursLine: "Available Monday through Saturday ",
      cardHoursBold: "8am – 7pm",
      consultarPorWhatsapp: "Message on WhatsApp",
      llamarAhora: "Call now",
      noPropertiesEmpty:
        "This agent has no active listings at the moment.",
      consultarDisponibilidad: "Check availability",
      whatsappMessageTpl: (name: string) =>
        `Hi ${name}, I'd like to know more about your Panamares properties.`,
      breadcrumbLabel: "Agents",
      titleSuffix: " — Real Estate Agent",
      descriptionTpl: (name: string, role: string) =>
        `${name}${role ? `, ${role}` : ""} at Panamares. Learn about their background and available properties in Panama City.`,
    },
    categoryHub: {
      tipoDeInvestigacion: "Listing type",
      tabComprar: "Buy",
      tabAlquilar: "Rent",
      gamaDePrecios: "Price range",
      tamano: "Size",
      tipoDePropiedad: "Property type",
      todosLosTipos: "All types",
      barrio: "Neighborhood",
      todosLosBarrios: "All neighborhoods",
      habitaciones: "Bedrooms",
      banos: "Bathrooms",
      verMas: "More",
      cerrar: "Close",
      limpiarFiltros: "Clear filters",
      todos: "All",
      filtros: "Filters",
      propiedadesDisponiblesSuffix: "properties available",
      ordenarPorAria: "Sort by",
      sortRelevancia: "Relevance",
      sortRecientes: "Most recent",
      sortPrecioAsc: "Price: low to high",
      sortPrecioDesc: "Price: high to low",
      sortAreaDesc: "Largest area",
      noEncontramosTpl: (q: string) => `We couldn't find properties for "${q}".`,
      noPropiedadesConFiltros: "No properties match these filters.",
      filtrosDrawerTitle: "Filters",
      cerrarFiltrosAria: "Close filters",
      aplicarFiltros: "Apply filters",
      whatsappMessageVenta: "Hi, I'm looking for properties for sale in Panama",
      whatsappMessageAlquiler: "Hi, I'm looking for properties for rent in Panama",
      whatsappMessageCategoryTpl: (h1: string) =>
        `Hi, I'm looking for properties in ${h1}`,
    },
  },

  categories: {
    "apartamentos-en-venta": {
      h1: "Apartments for Sale in Panama",
      metaTitle: "Apartments for Sale in Panama City",
      metaDescription:
        "Find apartments for sale in Panama City. The best options in Punta Pacífica, Punta Paitilla, Obarrio and other exclusive areas.",
      seoBlock:
        "Panamares offers the largest selection of apartments for sale in Panama City. From studios to penthouses, you'll find options in the most exclusive areas: Punta Pacífica, Punta Paitilla, Avenida Balboa and Obarrio. All listings are verified and include full details on price, square meters, bedrooms, bathrooms, parking and building amenities. Whether for a primary residence, second home or rental investment, we have the right property for every profile. Our specialized agents guide you through every step of the buying process, from the property tour to contract signing.",
    },
    "apartamentos-en-alquiler": {
      h1: "Apartments for Rent in Panama",
      metaTitle: "Apartments for Rent in Panama City",
      metaDescription:
        "Rent an apartment in Panama City. Wide selection in Punta Pacífica, Punta Paitilla, Avenida Balboa and more.",
      seoBlock:
        "Find the right apartment for rent in Panama City with Panamares. We have options in Punta Pacífica, Punta Paitilla, Avenida Balboa, Obarrio and other high-demand residential areas. Furnished and unfurnished apartments, with one or several bedrooms, in buildings with full amenities: pool, gym, 24/7 security and social areas. Competitive prices in dollars, transparent contracts in Spanish and personalized service from our agents. Filter by area, number of bedrooms or budget and book a tour the same day. Finding your next home in Panama has never been easier.",
    },
    "casas-en-venta": {
      h1: "Houses for Sale in Panama",
      metaTitle: "Houses for Sale in Panama City",
      metaDescription:
        "Buy a house in Panama City. Selection of family homes in the best gated communities.",
      seoBlock:
        "Panamares has a wide selection of houses for sale in Panama City and surrounding areas. From family residences in Clayton and Altos del Golf to exclusive properties in Costa del Este, Santa María and Las Cumbres. Each house includes detailed information on total area, bedrooms, bathrooms, finishes and community. Our properties include options with private gardens, pools and staff quarters in gated communities with private security. Our agents help you find the right property based on your budget, household size and lifestyle in Panama City.",
    },
    "casas-en-alquiler": {
      h1: "Houses for Rent in Panama",
      metaTitle: "Houses for Rent in Panama City",
      metaDescription:
        "Rent a house in Panama City. Find the right option for your family.",
      seoBlock:
        "Find the perfect house for rent for your family in Panama City with Panamares. We offer houses in Clayton, Altos del Golf, Costa del Este, Las Cumbres and other residential communities. Furnished and unfurnished options, with garden, pool, staff quarters and play areas for kids. Our properties are in gated communities with private security, offering comfort and peace of mind for the whole family. Flexible contracts in dollars, negotiable deposits and our agents' support throughout the rental process.",
    },
    "penthouses-en-venta": {
      h1: "Penthouses for Sale in Panama",
      metaTitle: "Penthouses for Sale in Panama City",
      metaDescription:
        "Luxury penthouses for sale in Panama City. Panoramic views, premium finishes in Punta Pacífica and Punta Paitilla.",
      seoBlock:
        "Penthouses for sale in Panama City represent the most exclusive segment of the Panamanian real estate market. Panamares offers a curated selection in Punta Pacífica, Punta Paitilla and Avenida Balboa, with panoramic views of the Pacific Ocean, private terraces and top-tier finishes. Each property includes full details on price, terrace square meters, bedrooms and building amenities. The most sought-after penthouses in the city offer double-height ceilings, private pools and exclusive elevator access. Talk to our agents who specialize in luxury properties for personalized advice and access to the best market opportunities.",
    },
    "penthouses-en-alquiler": {
      h1: "Penthouses for Rent in Panama",
      metaTitle: "Penthouses for Rent in Panama City",
      metaDescription:
        "Luxury penthouses for rent in Panama City. Panoramic views, premium finishes in Punta Pacífica and Punta Paitilla.",
      seoBlock:
        "Rent a luxury penthouse in Panama City with Panamares. We have an exclusive selection in Punta Pacífica, Punta Paitilla and Avenida Balboa, with panoramic views of the Pacific Ocean, private terraces and top-tier finishes. Ideal for executives, diplomats and families who want the best of Panamanian living without the long-term commitment. Our penthouses for rent include furnished options, exclusive elevator access and premium building amenities. Our agents who specialize in luxury properties help you find the right penthouse based on your needs and budget.",
    },
    "apartaestudios-en-venta": {
      h1: "Studios for Sale in Panama",
      metaTitle: "Studios for Sale in Panama City",
      metaDescription:
        "Studios for sale in Panama City. Ideal for investment or first-time buyers.",
      seoBlock:
        "Studios for sale in Panama City are the right choice for investment, first-time buyers or central residence. Panamares offers studios in Obarrio, El Cangrejo, Marbella and central areas with high rental demand, ensuring returns from day one. Compact and well-designed properties in modern buildings with full amenities: gym, pool and professional lobby. A solid investment in one of Latin America's most active real estate markets, with accessible entry prices and high liquidity. Our agents advise you on the best options based on your investment profile and budget.",
    },
    "oficinas-en-venta": {
      h1: "Offices for Sale in Panama",
      metaTitle: "Offices for Sale in Panama City",
      metaDescription:
        "Offices for sale in Panama City. Corporate spaces in Calle 50, Punta Pacífica and business areas.",
      seoBlock:
        "Panamares offers offices for sale in the main corporate areas of Panama City. From small units in Obarrio and Marbella to full floors in Calle 50, Punta Pacífica and the Vía España financial corridor. Modern spaces with professional finishes, included parking and access to top-tier services. Buying your own office in Panama City is a strategic move: dollar-denominated contracts, a growing corporate market and high rental demand. Invest in Latin America's financial hub with the support of our agents who specialize in commercial and corporate real estate.",
    },
    "oficinas-en-alquiler": {
      h1: "Offices for Rent in Panama",
      metaTitle: "Offices for Rent in Panama City",
      metaDescription:
        "Rent an office in Panama City. Spaces in the main commercial and financial areas.",
      seoBlock:
        "Rent an office in Panama City with Panamares and set up your business in the region's financial hub. We have options in Calle 50, Obarrio, Marbella and Punta Pacífica for companies of any size, from individual units to full floors. Move-in-ready spaces with parking, security, meeting rooms and telecom services included. We also offer coworking spaces and offices for startups and independent consultants. Flexible contracts in dollars and personalized advice to find the space that best fits your company's needs.",
    },
    "locales-comerciales-en-venta": {
      h1: "Retail Spaces for Sale in Panama",
      metaTitle: "Retail Spaces for Sale in Panama",
      metaDescription:
        "Retail spaces for sale in Panama City. Invest in the Panamanian commercial sector.",
      seoBlock:
        "Invest in retail spaces for sale in Panama City with Panamares. You'll find options in high-traffic areas like San Francisco, Obarrio and Vía España — ideal for retail stores, restaurants, medical offices and professional services. Each property includes full details on total area, linear meters of frontage and price per square meter, making it easier to assess your business's viability. Panama City is one of Central America's most active commercial markets, with high demand for well-located retail spaces. Our agents help you evaluate each space's return potential.",
    },
    "locales-comerciales-en-alquiler": {
      h1: "Retail Spaces for Rent in Panama",
      metaTitle: "Retail Spaces for Rent in Panama",
      metaDescription:
        "Rent a retail space in Panama City. Options in Obarrio, San Francisco and other areas.",
      seoBlock:
        "Panamares has retail spaces for rent in Panama City's busiest areas. From small spaces in Vía España and El Dorado to large units in shopping centers in Obarrio, San Francisco and Marbella. Ideal to start or expand your business in one of Latin America's most active consumer markets. Our retail spaces for rent include options with street-front access, loading and unloading zones and accessibility for people with reduced mobility. Flexible contracts in dollars and our agents' guidance to choose the location that maximizes your brand's visibility.",
    },
    "terrenos-en-venta": {
      h1: "Land for Sale in Panama",
      metaTitle: "Land for Sale in Panama",
      metaDescription:
        "Land for sale in Panama City and provinces. For residential or commercial construction.",
      seoBlock:
        "Find land for sale in Panama for your next residential or commercial project with Panamares. We offer lots in Panama City, Panamá Oeste, La Chorrera and the provinces, with access to basic services and main roads. Each lot includes details on square meters, permitted zoning, topography and price per square meter. Ideal for construction firms, developers and private investors looking for development opportunities in a market with strong appreciation. We also have lots with approved plans ready to build. Our agents support you through the analysis and negotiation of each opportunity.",
    },
    "terrenos-en-alquiler": {
      h1: "Land for Rent in Panama",
      metaTitle: "Land for Rent in Panama",
      metaDescription:
        "Land for rent in Panama City and provinces. For commercial, industrial or agricultural use.",
      seoBlock:
        "Find land for rent in Panama for your commercial, industrial or agricultural project with Panamares. We offer lots in Panama City, Panamá Oeste and the provinces, with access to main roads and basic services. Each lot includes details on square meters, permitted zoning and monthly price. Ideal for companies that need temporary space for operations, storage or project development without committing to a purchase. Our agents help you find the rental land that best fits your business needs.",
    },
    "casas-de-playa-en-alquiler": {
      h1: "Beach Houses for Rent in Panama",
      metaTitle: "Beach Houses for Rent in Panama",
      metaDescription:
        "Beach houses for rent in Panama. Properties in Coclé, Farallón and the best Panamanian coastlines.",
      seoBlock:
        "Rent a beach house in Panama with Panamares. Oceanfront properties in Farallón, Coronado, Santa Clara and the best beaches in Coclé, less than two hours from Panama City. From private cabins to villas with pool and direct beach access. Ideal for vacations, weekends or temporary stays in one of Central America's most sought-after coastal destinations. We also have options for short-term tourist rentals. Our agents know each coastal community to help you find the right beach house.",
    },
    "casas-de-playa-en-venta": {
      h1: "Beach Houses for Sale in Panama",
      metaTitle: "Beach Houses for Sale in Panama",
      metaDescription:
        "Beach houses for sale in Panama. Properties in Coclé, Farallón and the best Panamanian coastlines.",
      seoBlock:
        "Discover beach houses for sale in Panama with Panamares. Oceanfront properties in Farallón, Coronado, Santa Clara and the best beaches in Coclé, less than two hours from Panama City via the Pan-American Highway. From private cabins and single-level villas to luxury residences with pool, direct beach access and Pacific views. The best investment for a second home, vacation residence or short-term rental project in one of Central America's most sought-after coastal destinations. Our agents know every project and coastal community to guide you to the right decision.",
    },
    "edificios-en-venta": {
      h1: "Buildings for Sale in Panama",
      metaTitle: "Buildings for Sale in Panama City",
      metaDescription:
        "Buildings for sale in Panama City. Large-scale real estate investment.",
      seoBlock:
        "Panamares presents buildings for sale in Panama City for institutional and private investors looking for large-scale returns. From residential buildings with rented units and immediate cash flow to office towers in prime areas of the city. Each property includes details on total built area, number of units or floors, current occupancy, rental income and total price. The Panamanian market offers legal certainty, dollar-denominated contracts and high rental demand. A unique opportunity to scale your real estate portfolio in the region's most stable market.",
    },
    "fincas-en-venta": {
      h1: "Farms for Sale in Panama",
      metaTitle: "Farms for Sale in Panama",
      metaDescription:
        "Farms for sale in Panama. Rural and agricultural properties in Coclé and other provinces.",
      seoBlock:
        "Find farms for sale in Panama with Panamares. Rural properties in Coclé, Chiriquí, Veraguas and other provinces, with hectares for agricultural, livestock, ecotourism or country residential use. Each farm includes detailed information on total area, road access, water sources, soil type and permitted use. We also have farms with existing infrastructure: corrals, irrigation systems and support housing. A solid and diversified investment for those looking for opportunities outside the city, with appreciation potential in areas of growing tourism and agricultural interest in Panama.",
    },
    "lotes-comerciales-en-venta": {
      h1: "Commercial Lots for Sale in Panama",
      metaTitle: "Commercial Lots for Sale in Panama",
      metaDescription:
        "Commercial lots and land for sale in Panama City. Development opportunities.",
      seoBlock:
        "Panamares offers commercial lots for sale in Panama City and urban expansion areas for long-term developers and investors. Ideal for mixed-use projects, shopping centers, hotels, office buildings or high-rise residential developments. Strategic locations in high-growth corridors with access to main roads, utility networks and current commercial zoning approvals. Panama City is one of the most actively developing cities in Latin America, with growing demand for well-located developable land. Our agents provide zoning analysis and full advice to maximize each lot's potential.",
    },
  },

  faqs: {
    answers: {
      processCompra:
        "The buying process in Panama has four stages: property selection, signing the promise of purchase, notarial procedures and registration in the Public Registry. Contracts are signed in Spanish and prices are in US dollars. Panamares walks you through every step, coordinating with attorneys and procedural agents so the process is fast and secure.",
      extranjeroCompra:
        "Yes. Foreigners have the same property rights as Panamanian citizens. No residency or special permit is required to buy real estate. Panama offers legal certainty backed by the Public Registry and dollar-denominated contracts, making it one of the most attractive markets for international investors in Latin America.",
      extranjeroAlquiler:
        "Yes. Foreigners can rent freely in Panama without needing a special permit. Rental contracts are signed in Spanish and payments are made in US dollars. A valid passport, references and one or two months' deposit are usually required. Panamares advises you so the process is straightforward from the first contact.",
      preciosDolares:
        "Yes. Panama uses the US dollar as its official currency, which removes exchange rate risk for international investors and tenants. All rental contracts and listing prices are quoted in USD.",
      mejoresBarriosCompra: (typeLabel: string, zones: string) =>
        `The most sought-after areas for ${typeLabel} are ${zones}. Each neighborhood has its own price profile, lifestyle and appreciation potential. Panamares has active listings in all these areas and can advise you on which one best fits your budget and goals.`,
      mejoresBarriosAlquiler: (typeLabel: string, zones: string) =>
        `The areas with the most ${typeLabel} for rent are ${zones}. Choosing a neighborhood depends on your budget, transportation needs, proximity to work and lifestyle. Our agents help you find the option that best fits your priorities.`,
      documentosAlquilerCategory: (typeLabel: string) =>
        `A valid ID (passport or national ID), personal or work references, proof of income and one or two months' deposit are usually required. For foreigners, a passport is enough. Panamares coordinates with the owner to speed up document review and contract signing.${typeLabel ? "" : ""}`,
      documentosAlquilerGeo: (typeLabel: string) =>
        `A valid ID (passport or national ID), references and one or two months' deposit are usually required. For foreigners, a passport is enough. Panamares coordinates with the owner to speed up document review and contract signing.${typeLabel ? "" : ""}`,
      porQueComprarBarrio: (typeLabel: string, neighborhoodName: string) =>
        `${neighborhoodName} is one of Panama City's most valued areas thanks to its strategic location, quality of life and appreciation potential. Sustained demand for properties in this neighborhood makes it a solid choice for both a primary residence and long-term investment.${typeLabel ? "" : ""}`,
      porQueAlquilarBarrio: (typeLabel: string, neighborhoodName: string) =>
        `${neighborhoodName} combines access to services, transportation and an established community that makes it ideal for families, professionals and expatriates. The supply of ${typeLabel} for rent in this neighborhood is varied, with furnished and unfurnished options that fit different budgets and lifestyles.`,
    },
    questions: {
      cuantoCuestaComprar: (typeLabel: string) =>
        `How much does it cost to buy ${typeLabel} in Panama City?`,
      cuantoCuestaAlquilar: (typeLabel: string) =>
        `How much does it cost to rent ${typeLabel} in Panama City?`,
      cuantoCuestaComprarBarrio: (typeLabel: string, neighborhoodName: string) =>
        `How much does it cost to buy ${typeLabel} in ${neighborhoodName}?`,
      cuantoCuestaAlquilarBarrio: (
        typeLabel: string,
        neighborhoodName: string,
      ) => `How much does it cost to rent ${typeLabel} in ${neighborhoodName}?`,
      mejoresBarriosCompra: (typeLabel: string) =>
        `What are the best neighborhoods to buy ${typeLabel} in Panama?`,
      mejoresBarriosAlquiler: (typeLabel: string) =>
        `What are the best neighborhoods to rent ${typeLabel} in Panama?`,
      procesoCompra: (typeLabel: string) =>
        `How does the buying process for ${typeLabel} work in Panama?`,
      procesoCompraSimple: "How does the buying process work in Panama?",
      extranjeroCompraCategory: (typeLabel: string) =>
        `Can a foreigner buy ${typeLabel} in Panama?`,
      extranjeroCompraGeo: (typeLabel: string, neighborhoodName: string) =>
        `Can a foreigner buy ${typeLabel} in ${neighborhoodName}?`,
      documentosAlquiler: (typeLabel: string) =>
        `What documents do I need to rent ${typeLabel} in Panama?`,
      preciosEnDolares: "Are rental prices in dollars in Panama?",
      porQueComprarBarrio: (typeLabel: string, neighborhoodName: string) =>
        `Why buy ${typeLabel} in ${neighborhoodName}, Panama?`,
      porQueAlquilarBarrio: (typeLabel: string, neighborhoodName: string) =>
        `Why rent ${typeLabel} in ${neighborhoodName}, Panama?`,
      extranjeroAlquilar: "Can a foreigner rent in Panama?",
    },
    priceRefs: {
      apartamento: {
        venta:
          "Apartments for sale in Panama City range from $120,000 for studios to $1,500,000+ for penthouses in oceanfront towers. Standard 2-3 bedroom apartments in Punta Pacífica or Punta Paitilla typically list between $280,000 and $600,000, with price per square meter varying by building and view.",
        alquiler:
          "Apartment rentals in Panama City start at $700/month for studios and go up to $5,000+/month for luxury units on the waterfront. A 2-bedroom apartment in an exclusive area like Punta Pacífica or Avenida Balboa runs $1,200–$2,500/month depending on building and amenities.",
      },
      penthouse: {
        venta:
          "Penthouses for sale in Panama City start at $500,000 and can exceed $3,000,000 in waterfront towers with Pacific views. The price difference compared to a standard apartment reflects the private terrace, premium finishes and the exclusivity of the building's top floor.",
        alquiler:
          "Penthouse rentals in Panama City range from $3,000 to $10,000/month depending on the tower, neighborhood and amenities. They are the preferred choice for executives and families who want space, privacy and panoramic views without giving up a central location.",
      },
      casa: {
        venta:
          "Houses for sale in Panama City range from $250,000 for basic residences to $3,000,000+ for villas in luxury gated communities. Clayton, Altos del Golf and Costa del Este offer options between $400,000 and $1,200,000 with garden, pool and private security.",
        alquiler:
          "House rentals in Panama City start at $1,200/month and can reach $8,000/month for luxury villas. The most in-demand communities like Clayton, Santa María and Costa del Este have prices between $2,000 and $5,000/month, including green areas and access to a private club.",
      },
      oficina: {
        venta:
          "Offices for sale in Panama City range from $80,000 for small units to $2,000,000+ for full floors in corporate towers on Calle 50. Price per square meter in prime areas runs between $2,000 and $4,500 USD depending on finishes, floor and proximity to the financial center.",
        alquiler:
          "Office rentals in Panama City start at $500/month for small spaces and go up to $15,000+/month for full floors in Calle 50 or Marbella. The average price per square meter in the corporate area is $18–$35 USD/month, generally not including parking.",
      },
      local: {
        venta:
          "Retail spaces for sale in Panama City range from $60,000 for small units to $1,500,000+ for spaces in high-traffic areas. Price per square meter depends on street frontage, the area and foot traffic.",
        alquiler:
          "Retail space rentals in Panama City range from $400 to $15,000/month. In high-traffic areas like Obarrio and San Francisco, the average price runs $20–$45 USD/m² per month, while secondary areas can be between $10 and $20 USD/m².",
      },
      apartaestudio: {
        venta:
          "Studios for sale in Panama City range from $80,000 to $250,000. Their main appeal is the rental return, which can exceed 6% annually in areas with high demand from corporate tenants like El Cangrejo or Obarrio.",
        alquiler:
          "Studio rentals in Panama City start at $600/month. Their high demand among executives and students makes them one of the market's most active segments, especially in central neighborhoods with access to services.",
      },
      terreno: {
        venta:
          "Land for sale in Panama varies widely by area: from $50/m² in rural areas to $2,000+/m² in prime areas of Panama City. Lots in gated communities in Costa del Este or Santa María typically cost between $300 and $800/m².",
        alquiler: "—",
      },
      "casa de playa": {
        venta:
          "Beach houses for sale in Panama range from $150,000 for basic cabins to $2,000,000+ for oceanfront villas in Farallón or Coronado. Value per square meter keeps rising thanks to tourism growth and demand for vacation rentals.",
        alquiler: "—",
      },
      default: {
        venta:
          "Prices vary based on area, finishes and property features. Talk to our agents for an updated range and to compare the options available in the market.",
        alquiler:
          "Rental prices vary based on the area and property features. Contact our agents for updated prices and to compare the options available.",
      },
    },
    zonesByType: {
      apartamento: "Punta Pacífica, Punta Paitilla, Avenida Balboa and Obarrio",
      penthouse: "Punta Pacífica, Punta Paitilla and Avenida Balboa",
      casa: "Clayton, Altos del Golf, Costa del Este and Santa María",
      oficina: "Calle 50, Obarrio and Marbella",
      local: "Obarrio, San Francisco and Vía España",
      apartaestudio:
        "El Cangrejo, Obarrio and the historic center of Panama City",
      terreno: "expansion areas of Panama City, Panamá Oeste and Coclé",
      "casa de playa": "Farallón, Coronado and the Coclé coastlines",
      default: "the main areas of Panama City",
    },
  },
};
