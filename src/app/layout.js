import "./globals.css";

export const metadata = {
  metadataBase: new URL("https://estebanmolina.co"),
  title: "Esteban Molina — Operador inmobiliario que construye sistemas",
  description:
    "Fundador de Flaternity (€1.5M ARR, 200+ habitaciones). Aplicando sistemas, IA y automatización al real estate colombiano desde Bogotá.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "es_CO",
    url: "https://estebanmolina.co",
    siteName: "Esteban Molina",
    title: "Esteban Molina — Operador inmobiliario que construye sistemas",
    description:
      "Fundador de Flaternity (€1.5M ARR). Aplico sistemas, IA y automatización al real estate colombiano. Venta directa de propiedades sin agencia.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Esteban Molina — Operador inmobiliario que construye sistemas",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Esteban Molina — Operador inmobiliario que construye sistemas",
    description:
      "Fundador de Flaternity (€1.5M ARR). Sistemas, IA y automatización aplicados al real estate colombiano.",
    images: ["/og-image.jpg"],
  },
  robots: { index: true, follow: true },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  "@id": "https://estebanmolina.co/#person",
  name: "Esteban Molina",
  givenName: "Esteban",
  familyName: "Molina",
  jobTitle: "Operador inmobiliario",
  description:
    "Operador inmobiliario que construye sistemas. Fundador de Flaternity (coliving en Europa, €1.5M ARR). Aplicando sistemas, IA y automatización al real estate colombiano desde Bogotá.",
  url: "https://estebanmolina.co",
  image: "https://estebanmolina.co/esteban.png",
  nationality: { "@type": "Country", name: "Colombia" },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Bogotá",
    addressCountry: "CO",
  },
  worksFor: { "@id": "https://flaternity.eu/#organization" },
  founder: { "@id": "https://flaternity.eu/#organization" },
  knowsAbout: [
    "Real estate",
    "Coliving operations",
    "Proptech",
    "Sistemas de automatización inmobiliaria",
    "Venta directa de propiedad sin agencia",
    "Desarrollo inmobiliario Colombia",
    "Levantamiento de capital early-stage",
  ],
  sameAs: [
    "https://www.linkedin.com/in/emolinam",
    "https://flaternity.eu",
  ],
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://flaternity.eu/#organization",
  name: "Flaternity",
  url: "https://flaternity.eu",
  description:
    "Operadora de coliving en España. 200+ habitaciones operativas, €1.5M ARR, €1M de capital levantado.",
  foundingDate: "2021",
  founder: { "@id": "https://estebanmolina.co/#person" },
  areaServed: [
    { "@type": "City", name: "Barcelona" },
    { "@type": "City", name: "Valencia" },
  ],
  address: { "@type": "PostalAddress", addressCountry: "ES" },
  industry: "Coliving / Real Estate",
};

const listingSchema = {
  "@context": "https://schema.org",
  "@type": "RealEstateListing",
  "@id": "https://estebanmolina.co/#casa-malabar",
  name: "Casa Malabar Vista — Cerritos, Pereira",
  description:
    "Casa de 596 m² construidos sobre lote de 2.000 m² en condominio Malabar, Cerritos (Pereira, Colombia). 3 habitaciones, 4 baños. Venta directa por el propietario, sin intermediación de agencia.",
  url: "https://estebanmolina.co/#casa-malabar",
  datePosted: "2026-05-20",
  image: "https://estebanmolina.co/malabar-hero.jpg",
  mainEntity: {
    "@type": "SingleFamilyResidence",
    name: "Casa Malabar Vista",
    numberOfRooms: 3,
    numberOfBedrooms: 3,
    numberOfBathroomsTotal: 4,
    floorSize: {
      "@type": "QuantitativeValue",
      value: 596,
      unitCode: "MTK",
    },
    lotSize: {
      "@type": "QuantitativeValue",
      value: 2000,
      unitCode: "MTK",
    },
    address: {
      "@type": "PostalAddress",
      addressLocality: "Cerritos",
      addressRegion: "Risaralda",
      addressCountry: "CO",
    },
    image: "https://estebanmolina.co/malabar-hero.jpg",
  },
  offers: {
    "@type": "Offer",
    price: 6500000000,
    priceCurrency: "COP",
    availability: "https://schema.org/InStock",
    seller: { "@id": "https://estebanmolina.co/#person" },
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "¿Se puede vender una casa en Colombia sin agencia inmobiliaria?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Sí, es completamente legal. La ley colombiana no obliga a usar una agencia para vender un inmueble. El propietario puede comercializar directamente, negociar el precio y firmar la escritura pública en notaría. Se necesita certificado de tradición y libertad vigente, paz y salvos (predial, valorización y administración si aplica), avalúo cuando lo solicita el comprador o su banco, y la escritura pública otorgada en notaría seguida del registro en la Oficina de Registro de Instrumentos Públicos. El reto al vender sin agencia no es legal sino operativo: filtrar compradores serios, manejar visitas y coordinar el cierre con la fiduciaria o el banco hipotecario.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cuánto cobra una agencia inmobiliaria en Colombia?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "La comisión estándar para venta de inmueble usado en Colombia es 3% sobre el valor de la transacción, según tarifas referenciales gremiales (Fedelonjas y lonjas regionales). En arrendamiento la comisión típica es entre 8% y 10% del canon mensual recaudado, más un mes de canon como comisión inicial. Algunas agencias adicionan honorarios al comprador (1% a 2% extra), aunque esa práctica es controversial. Sobre una propiedad de 6.500 millones de pesos, la comisión del vendedor equivale a unos 195 millones más IVA.",
      },
    },
    {
      "@type": "Question",
      name: "¿Qué es coliving y cómo se diferencia del arriendo tradicional?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Coliving es un modelo donde una empresa operadora arrienda habitaciones privadas dentro de pisos amueblados con servicios incluidos: internet, limpieza, electricidad, gas, agua, mobiliario y áreas comunes diseñadas para convivencia. El inquilino firma con la operadora — no con el propietario — y suele tener contratos flexibles desde un mes. El arriendo tradicional entrega un inmueble vacío con servicios por separado, contrato anual y trato directo con el propietario o su inmobiliaria. Coliving cuesta más por habitación pero es todo-incluido y elimina la fricción del setup. Flaternity escaló a 200+ habitaciones operativas en Barcelona y Valencia bajo este modelo.",
      },
    },
    {
      "@type": "Question",
      name: "¿Cómo se usa IA para vender propiedades inmobiliarias en 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "A 2026 hay tres usos consolidados. Primero, agentes conversacionales en WhatsApp que califican leads 24/7, filtran curiosos de compradores serios, agendan visitas y mantienen contexto entre conversaciones. Segundo, landings dedicadas por propiedad con galería, video, descripción y schema markup, generadas semi-automáticamente a partir de fotos y datos básicos del inmueble. Tercero, producción de contenido en escala: reels, descripciones, copys para redes y portales generados con IA a partir del mismo asset base. El stack típico es: una landing por propiedad, un agente IA en WhatsApp, tracking de conversación en CRM y contenido programado en redes y portales.",
      },
    },
    {
      "@type": "Question",
      name: "¿Conviene comprar finca raíz en Bogotá en 2026?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Depende del horizonte y de la zona. El m² promedio en Bogotá creció en torno a 5-7% nominal en 2024-2025 según Galería Inmobiliaria y La Lonja, por debajo de inflación en años de alta inflación pero positivo en 2025-2026. Zonas con demanda sostenida y restricción de suelo (Chapinero, Usaquén) defienden mejor el precio. Zonas con mucho lanzamiento sobre plano (norte de Suba, Mosquera, Soacha) tienen mayor riesgo de saturación. La tasa hipotecaria sigue alta frente a 2019-2021, lo que comprime la demanda apalancada. Para compradores de contado el momento es favorable. Para inversionistas la renta bruta típica está entre 4% y 6% anual con valorización proyectada similar — retorno total cercano a 9-11% anual.",
      },
    },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        {/* Preload de la imagen LCP (hero Malabar) — el navegador la pide
            en cuanto parsea <head>, sin esperar a que React hidrate. */}
        <link
          rel="preload"
          as="image"
          type="image/webp"
          href="/malabar-hero-1024.webp"
          imageSrcSet="/malabar-hero-640.webp 640w, /malabar-hero-1024.webp 1024w, /malabar-hero-1600.webp 1600w"
          imageSizes="(max-width: 768px) 100vw, 60vw"
          fetchPriority="high"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(listingSchema) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      </head>
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
