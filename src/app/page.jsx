'use client';

import { useState, useEffect, useRef } from "react";
import HologramScroll from "../components/HologramScroll";

/* ═══════════════════════════════════════════════
   DESIGN SYSTEM
   ═══════════════════════════════════════════════ */

const F = {
  display: "'Instrument Serif', Georgia, serif",
  body: "'DM Sans', sans-serif",
  mono: "'JetBrains Mono', monospace",
};

const C = {
  bg: "#0a0a0a",
  surface: "#111111",
  surface2: "#161616",
  border: "#1e1e1e",
  border2: "#2a2a2a",
  text: "#e0e0e0",
  // Contraste AAA sobre #0a0a0a: ~7.6:1 (antes #777 → 4.42:1)
  muted: "#a0a0a0",
  // Contraste AA sobre #0a0a0a: ~4.66:1 (antes #444 → 2.03:1)
  dim: "#7a7a7a",
  accent: "#38bdf8",
  accentDim: "rgba(56,189,248,0.07)",
  accentGlow: "rgba(56,189,248,0.15)",
  white: "#ffffff",
  green: "#4a766e",
  gold: "#c4a44a",
};

const FAQ_DATA = [
  {
    q: "¿Se puede vender una casa en Colombia sin agencia inmobiliaria?",
    a: "Sí, es completamente legal. La ley colombiana no obliga a usar una agencia para vender un inmueble. El propietario puede comercializar directamente, negociar el precio y firmar la escritura pública en notaría. Lo que se necesita: certificado de tradición y libertad vigente, paz y salvos (predial, valorización y administración si aplica), avalúo cuando lo solicita el comprador o su banco, y la escritura pública otorgada en notaría seguida del registro en la Oficina de Registro de Instrumentos Públicos. El reto al vender sin agencia no es legal sino operativo: filtrar compradores serios, manejar el ciclo de visitas y negociación, y coordinar el cierre con la fiduciaria o el banco hipotecario.",
  },
  {
    q: "¿Cuánto cobra una agencia inmobiliaria en Colombia?",
    a: "La comisión estándar para venta de inmueble usado en Colombia es 3% sobre el valor de la transacción, según las tarifas referenciales gremiales (Fedelonjas y las lonjas regionales). En arrendamiento la comisión típica es entre 8% y 10% del canon mensual recaudado, más un mes de canon como comisión inicial. Algunas agencias adicionan honorarios al comprador (1% a 2% extra), aunque esa práctica es controversial. Sobre una propiedad de 6.500 millones de pesos, la comisión del vendedor equivale a unos 195 millones más IVA. Vender directo elimina ese costo, pero exige asumir el trabajo comercial y de cierre que normalmente hace la agencia.",
  },
  {
    q: "¿Qué es coliving y cómo se diferencia del arriendo tradicional?",
    a: "Coliving es un modelo de vivienda donde una empresa operadora arrienda habitaciones privadas dentro de pisos amueblados con servicios incluidos (internet, limpieza, electricidad, gas, agua, mobiliario y áreas comunes diseñadas para convivencia). El inquilino firma con la operadora — no con el propietario — y suele tener contratos flexibles desde un mes. El arriendo tradicional, en cambio, entrega un inmueble vacío con servicios por separado, contrato anual y trato directo con el propietario o su inmobiliaria. Coliving cuesta más por habitación que el arriendo tradicional, pero es todo-incluido y elimina la fricción del setup. El modelo creció fuerte en Europa entre 2018 y 2024 — Flaternity escaló a 200+ habitaciones operativas en Barcelona y Valencia bajo este formato.",
  },
  {
    q: "¿Cómo se usa IA para vender propiedades inmobiliarias en 2026?",
    a: "A 2026 hay tres usos consolidados. Primero, agentes conversacionales en WhatsApp que califican leads 24/7, filtran curiosos de compradores serios, agendan visitas y mantienen contexto entre conversaciones — esto reemplaza el rol de un asistente comercial. Segundo, landings dedicadas por propiedad con galería, video, descripción y schema markup, generadas semi-automáticamente a partir de fotos y datos básicos del inmueble. Tercero, producción de contenido en escala: reels, descripciones, copys para redes y portales generados con IA a partir del mismo asset base, lo que baja el costo marginal de publicar en múltiples canales a casi cero. El stack típico es: una landing por propiedad, un agente IA en WhatsApp, tracking de conversación en CRM y contenido programado en redes y portales.",
  },
  {
    q: "¿Conviene comprar finca raíz en Bogotá en 2026?",
    a: "Depende del horizonte y de la zona. Algunos datos factuales: el m² promedio en Bogotá creció en torno a 5-7% nominal en 2024-2025 según Galería Inmobiliaria y La Lonja, por debajo de inflación en años de alta inflación pero positivo en 2025-2026. Zonas con demanda sostenida y restricción de suelo (Chapinero, Usaquén) defienden mejor el precio. Zonas con mucho lanzamiento sobre plano (norte de Suba, Mosquera, Soacha) tienen mayor riesgo de saturación. La tasa hipotecaria sigue alta frente a 2019-2021, lo que comprime la demanda de comprador apalancado. Para compradores de contado el momento es favorable porque hay menor competencia. Para inversionistas la pregunta clave es renta vs valorización: en Bogotá la renta bruta típica está entre 4% y 6% anual, valorización proyectada similar. Quien compre necesita estar cómodo con un retorno total cercano a 9-11% anual, no esperar plusvalías explosivas.",
  },
];

/* ═══ Helpers ═══ */
function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 768px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return isMobile;
}

function AnimNum({ target, suffix = "", prefix = "" }) {
  const [v, setV] = useState(0);
  const ref = useRef(null);
  const [go, setGo] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !go) {
          setGo(true);
          const t0 = performance.now();
          const tick = (n) => {
            const p = Math.min((n - t0) / 1500, 1);
            setV(Math.round((1 - Math.pow(1 - p, 3)) * target));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [target, go]);
  return (
    <span ref={ref}>
      {prefix}
      {v.toLocaleString()}
      {suffix}
    </span>
  );
}

function Marquee({ children, speed = 30, reverse = false }) {
  return (
    <div style={{ overflow: "hidden", whiteSpace: "nowrap", width: "100%" }}>
      <div
        style={{
          display: "inline-flex",
          animation: `${reverse ? "marqueeR" : "marqueeL"} ${speed}s linear infinite`,
        }}
      >
        {children}
        {children}
      </div>
    </div>
  );
}

function MarqueeText({ text, style }) {
  const item = (
    <span style={{ padding: "0 3rem", ...style }}>{text}</span>
  );
  return (
    <>
      {item}{item}{item}{item}{item}{item}
    </>
  );
}

/* ═══════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════ */
export default function EstebanSite() {
  const [scrollY, setScrollY] = useState(0);
  const [hoveredCraft, setHoveredCraft] = useState(null);
  const [hoveredZone, setHoveredZone] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFAQ, setOpenFAQ] = useState(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    const h = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  return (
    <div style={{ fontFamily: F.body, color: C.text, background: C.bg, overflowX: "hidden" }}>
      <link
        href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300;1,9..40,400&family=JetBrains+Mono:wght@300;400&display=swap"
        rel="stylesheet"
      />

      {/* ═══ NAV ═══ */}
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 100,
          padding: isMobile ? "1rem 1.25rem" : "1.2rem 2.5rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: scrollY > 80 || menuOpen ? "rgba(10,10,10,0.92)" : "transparent",
          backdropFilter: scrollY > 80 || menuOpen ? "blur(20px)" : "none",
          transition: "all 0.5s ease",
          borderBottom: scrollY > 80 || menuOpen ? `1px solid ${C.border}` : "none",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <div style={{ width: "8px", height: "8px", background: C.accent, borderRadius: "50%" }} />
          <span style={{ fontFamily: F.mono, fontSize: "12px", letterSpacing: "3px", textTransform: "uppercase", color: C.white, fontWeight: 400 }}>
            Esteban Molina
          </span>
        </div>

        {!isMobile && (
          <div style={{ display: "flex", gap: "2.5rem", fontFamily: F.mono, fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: C.muted }}>
            {["propiedades", "sistemas", "faq", "flaternity", "bogotá", "contacto"].map((i) => (
              <a
                key={i}
                href={`#${i}`}
                style={{
                  color: "inherit",
                  textDecoration: "none",
                  transition: "color 0.3s",
                  // Touch target ≥44px (Apple HIG): mantiene el look mono delgado
                  // pero amplía el área tocable/clickeable vertical.
                  padding: "16px 2px",
                  display: "inline-flex",
                  alignItems: "center",
                }}
                onMouseEnter={e => e.target.style.color = C.accent}
                onMouseLeave={e => e.target.style.color = C.muted}
              >
                {i}
              </a>
            ))}
          </div>
        )}

        {isMobile && (
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
            style={{ background: "transparent", border: "none", color: C.white, cursor: "pointer", padding: "8px", display: "flex", flexDirection: "column", gap: "5px", width: "32px" }}
          >
            <span style={{ display: "block", width: "20px", height: "1.5px", background: C.white, transition: "transform 0.3s, opacity 0.3s", transformOrigin: "center", transform: menuOpen ? "translateY(6.5px) rotate(45deg)" : "none" }} />
            <span style={{ display: "block", width: "20px", height: "1.5px", background: C.white, transition: "opacity 0.3s", opacity: menuOpen ? 0 : 1 }} />
            <span style={{ display: "block", width: "20px", height: "1.5px", background: C.white, transition: "transform 0.3s", transformOrigin: "center", transform: menuOpen ? "translateY(-6.5px) rotate(-45deg)" : "none" }} />
          </button>
        )}
      </nav>

      {/* ═══ MOBILE MENU OVERLAY ═══ */}
      {isMobile && menuOpen && (
        <div
          style={{
            position: "fixed",
            top: "60px",
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 99,
            background: "rgba(10,10,10,0.96)",
            backdropFilter: "blur(20px)",
            display: "flex",
            flexDirection: "column",
            padding: "3rem 2rem",
            gap: "2rem",
          }}
        >
          {["propiedades", "sistemas", "faq", "flaternity", "bogotá", "contacto"].map((i) => (
            <a
              key={i}
              href={`#${i}`}
              onClick={() => setMenuOpen(false)}
              style={{
                fontFamily: F.mono,
                fontSize: "16px",
                letterSpacing: "3px",
                textTransform: "uppercase",
                color: C.white,
                textDecoration: "none",
                paddingBottom: "1rem",
                borderBottom: `1px solid ${C.border}`,
              }}
            >
              {i}
            </a>
          ))}
        </div>
      )}

      {/* ═══ HERO ═══ */}
      <section style={{ minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", padding: "clamp(6rem, 18vw, 8rem) clamp(1.25rem, 4vw, 3rem) 4rem", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, backgroundImage: `linear-gradient(${C.border} 1px, transparent 1px), linear-gradient(90deg, ${C.border} 1px, transparent 1px)`, backgroundSize: "100px 100px", opacity: 0.15, maskImage: "radial-gradient(ellipse at 20% 60%, black 10%, transparent 60%)", WebkitMaskImage: "radial-gradient(ellipse at 20% 60%, black 10%, transparent 60%)" }} />

        <div style={{ position: "relative", maxWidth: "1100px" }}>
          <div style={{ fontFamily: F.mono, fontSize: "11px", letterSpacing: "4px", textTransform: "uppercase", color: C.dim, marginBottom: "2rem", display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ width: "40px", height: "1px", background: C.dim, display: "inline-block" }} />
            Esteban Molina · Real estate systems operator
          </div>

          <h1 style={{ fontFamily: F.display, fontSize: "clamp(2.5rem, 9vw, 7rem)", fontWeight: 400, lineHeight: 0.95, margin: "0 0 2.5rem", letterSpacing: "clamp(-1.5px, -0.3vw, -3px)", color: C.white }}>
            No vendo
            <br />
            propiedades.
            <br />
            <em style={{ fontStyle: "italic", color: C.accent }}>Construyo</em>
            <br />
            <em style={{ fontStyle: "italic", color: C.accent }}>sistemas.</em>
          </h1>

          <p style={{ fontSize: "17px", lineHeight: 1.8, color: C.muted, maxWidth: "540px", fontWeight: 300 }}>
            Llegué a España sin contactos y sin capital.{" "}
            <span style={{ color: C.white, fontWeight: 400 }}>Creé, crecí y operé</span>{" "}
            una empresa de coliving desde cero hasta{" "}
            <span style={{ color: C.white, fontWeight: 400 }}>€1.5M de facturación anual</span>{" "}
            y 200+ habitaciones. Ahora aplico los mismos sistemas al real estate colombiano.
          </p>
        </div>

        {/* Scroll cue */}
        <div style={{ position: "absolute", bottom: "2rem", left: "50%", transform: "translateX(-50%)", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "1px", height: "50px", background: `linear-gradient(to bottom, transparent, ${C.dim})` }} />
          <span style={{ fontFamily: F.mono, fontSize: "9px", color: C.dim, letterSpacing: "3px" }}>SCROLL</span>
        </div>
      </section>

      {/* ═══ MARQUEE 1 ═══ */}
      <div style={{ borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, padding: "1.8rem 0", overflow: "hidden" }}>
        <Marquee speed={35}>
          <MarqueeText
            text="Sistemas inmobiliarios · Flaternity · €1.5M ARR · 200+ habitaciones · WhatsApp IA · Contenido · Desarrollo · Bogotá ·"
            style={{ fontFamily: F.display, fontSize: "clamp(1.2rem, 2.5vw, 1.6rem)", color: C.dim, fontWeight: 400, letterSpacing: "-0.5px" }}
          />
        </Marquee>
      </div>

      {/* ═══ FEATURED: MALABAR ═══ */}
      <section id="propiedades" style={{ padding: "clamp(4rem, 8vw, 6rem) clamp(1.25rem, 4vw, 3rem)" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ fontFamily: F.mono, fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: C.accent, marginBottom: "0.5rem" }}>
            Proyecto destacado
          </div>
          <p style={{ fontFamily: F.mono, fontSize: "12px", color: C.dim, marginBottom: "3rem" }}>
            Página web dedicada · Tour virtual 360° · Estrategia de marketing digital — sistema completo operando en vivo
          </p>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1.4fr 1fr", gap: "2rem" }}>
            {/* Malabar photo */}
            <div style={{ aspectRatio: "16/10", position: "relative", overflow: "hidden" }}>
              <picture>
                <source
                  type="image/webp"
                  srcSet="/malabar-hero-640.webp 640w, /malabar-hero-1024.webp 1024w, /malabar-hero-1600.webp 1600w"
                  sizes="(max-width: 768px) 100vw, 60vw"
                />
                <img
                  src="/malabar-hero.jpg"
                  alt="Casa Malabar Vista — Cerritos, Pereira"
                  width="1600"
                  height="1000"
                  loading="eager"
                  fetchPriority="high"
                  decoding="async"
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }}
                />
              </picture>
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.45) 0%, transparent 50%)" }} />
              {/* Live badge */}
              <div style={{ position: "absolute", top: "1.2rem", left: "1.2rem", fontFamily: F.mono, fontSize: "9px", letterSpacing: "2px", padding: "5px 12px", border: `1px solid ${C.accent}`, color: C.accent, background: C.accentDim, display: "flex", alignItems: "center", gap: "6px", backdropFilter: "blur(8px)" }}>
                <span style={{ width: "5px", height: "5px", background: C.accent, borderRadius: "50%", animation: "pulse 2s infinite" }} />
                DEMO EN VIVO
              </div>
            </div>

            {/* Info */}
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <h3 style={{ fontFamily: F.display, fontSize: "2.2rem", fontWeight: 400, color: C.white, margin: "0 0 0.5rem", letterSpacing: "-1px" }}>
                  Casa campestre con vista al lago
                </h3>
                <div style={{ fontFamily: F.mono, fontSize: "11px", color: C.dim, marginBottom: "1.5rem" }}>
                  Cerritos Malabar · Pereira, Colombia
                </div>
                <p style={{ fontSize: "14px", lineHeight: 1.7, color: C.muted, fontWeight: 300, marginBottom: "2rem" }}>
                  596 m² construidos con vista directa al espejo de agua en Cerritos Malabar. Sistema integral de venta activado: página web dedicada, tour virtual 360° y estrategia de marketing digital — sin intermediarios.
                </p>
              </div>

              {/* Tour link */}
              <a
                href="https://malabar-vista.vercel.app/"
                target="_blank"
                rel="noopener"
                style={{ display: "inline-flex", alignItems: "center", gap: "10px", fontFamily: F.mono, fontSize: "11px", letterSpacing: "2px", textTransform: "uppercase", color: C.accent, textDecoration: "none", borderBottom: `1px solid ${C.accent}`, paddingBottom: "4px", marginBottom: "2rem" }}
              >
                <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: C.accent, animation: "pulse 2s infinite", flexShrink: 0 }} />
                Ver página
              </a>

              {/* Metrics */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1px", background: C.border }}>
                {[
                  { val: "$6.500M", label: "Precio COP" },
                  { val: "596 m²", label: "Construidos" },
                  { val: "Sin agencia", label: "Venta directa" },
                ].map((m, i) => (
                  <div key={i} style={{ padding: "1.2rem", background: C.surface, textAlign: "center" }}>
                    <div style={{ fontFamily: F.display, fontSize: "1.3rem", color: C.white, marginBottom: "4px" }}>{m.val}</div>
                    <div style={{ fontFamily: F.mono, fontSize: "9px", color: C.dim, letterSpacing: "1.5px", textTransform: "uppercase" }}>{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ QUOTE ═══ */}
      <section style={{ padding: "clamp(3rem, 7vw, 5rem) clamp(1.25rem, 4vw, 3rem)", borderTop: `1px solid ${C.border}`, borderBottom: `1px solid ${C.border}`, textAlign: "center" }}>
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          <h2 style={{ fontFamily: F.display, fontSize: "clamp(1.6rem, 3.5vw, 2.5rem)", fontWeight: 400, color: C.white, lineHeight: 1.3, letterSpacing: "-0.5px" }}>
            Si crees que un buen sistema de ventas es caro, mira cuánto cuesta vender{" "}
            <em style={{ fontStyle: "italic", color: C.accent }}>sin uno.</em>
          </h2>
        </div>
      </section>

      {/* ═══ HOLOGRAM SCROLL ═══ */}
      <HologramScroll />

      {/* ═══ MARQUEE 2 + INTRO ═══ */}
      <section style={{ padding: "5rem 0 0" }}>
        <div style={{ padding: "2rem 0", overflow: "hidden" }}>
          <Marquee speed={25} reverse>
            <MarqueeText
              text="Soy Esteban, operador inmobiliario que programa —"
              style={{ fontFamily: F.display, fontSize: "clamp(2rem, 4vw, 3.5rem)", color: C.white, fontWeight: 400, fontStyle: "italic", letterSpacing: "-1px" }}
            />
          </Marquee>
        </div>

        <div style={{ maxWidth: "700px", margin: "0 auto", padding: "3rem clamp(1.25rem, 4vw, 3rem) 5rem" }}>
          <p style={{ fontSize: "17px", lineHeight: 2, color: C.muted, fontWeight: 300 }}>
            Fundé <strong style={{ color: C.white, fontWeight: 500 }}>Flaternity</strong> en España — de 4 pisos en Barcelona a 200+ habitaciones, un edificio propio y €1.5M de ARR.
            Levanté €500k en financiación. Construí{" "}
            <strong style={{ color: C.white, fontWeight: 500 }}>todos los sistemas</strong> de la empresa — marketing, operaciones, finanzas, automatizaciones, agentes IA.
            Ahora aplico ese mismo enfoque al real estate colombiano: tecnología, contenido y automatización para
            vender propiedades sin intermediarios y desarrollar proyectos inmobiliarios propios.
          </p>
          <div style={{ display: "flex", gap: "2rem", marginTop: "2.5rem" }}>
            <a href="#flaternity" style={{ fontFamily: F.mono, fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", color: C.accent, textDecoration: "none", borderBottom: `1px solid ${C.accent}`, paddingBottom: "4px" }}>
              Ver historia completa →
            </a>
            <a href="#contacto" style={{ fontFamily: F.mono, fontSize: "12px", letterSpacing: "2px", textTransform: "uppercase", color: C.muted, textDecoration: "none", borderBottom: `1px solid ${C.border2}`, paddingBottom: "4px" }}>
              Contacto
            </a>
          </div>
        </div>
      </section>

      {/* ═══ MY CRAFT ═══ */}
      <section id="sistemas" style={{ padding: "clamp(3rem, 7vw, 5rem) clamp(1.25rem, 4vw, 3rem)", borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ fontFamily: F.mono, fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: C.accent, marginBottom: "0.5rem" }}>
            Mis sistemas
          </div>
          <h2 style={{ fontFamily: F.display, fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 400, color: C.white, margin: "0 0 2.5rem", letterSpacing: "-1px", lineHeight: 1.1 }}>
            Lo que opero hoy
          </h2>

          {/* === SISTEMA ACTIVO — destacado === */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: isMobile ? "1fr" : "1.2fr 1fr",
              gap: "2rem",
              padding: "clamp(1.5rem, 3vw, 2rem)",
              background: C.surface,
              border: `1px solid ${C.border}`,
              marginBottom: "4rem",
              alignItems: "center",
            }}
          >
            {/* Preview */}
            <div style={{ aspectRatio: "16/10", overflow: "hidden", border: `1px solid ${C.border2}`, position: "relative" }}>
              <picture>
                <source type="image/webp" srcSet="/preview-landing.webp" />
                <img
                  src="/preview-landing.jpg"
                  alt="landing pages"
                  width="800"
                  height="500"
                  loading="lazy"
                  decoding="async"
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "top", display: "block" }}
                />
              </picture>
              {/* Active badge */}
              <div style={{ position: "absolute", top: "0.8rem", left: "0.8rem", fontFamily: F.mono, fontSize: "9px", letterSpacing: "2px", padding: "5px 10px", border: `1px solid ${C.accent}`, color: C.accent, background: C.accentDim, display: "flex", alignItems: "center", gap: "6px", backdropFilter: "blur(8px)" }}>
                <span style={{ width: "5px", height: "5px", background: C.accent, borderRadius: "50%", animation: "pulse 2s infinite" }} />
                ACTIVO
              </div>
            </div>

            {/* Info */}
            <div>
              <div style={{ fontFamily: F.mono, fontSize: "11px", color: C.dim, marginBottom: "0.8rem" }}>_01</div>
              <h3 style={{ fontFamily: F.display, fontSize: "clamp(1.6rem, 3vw, 2rem)", fontWeight: 400, color: C.white, margin: "0 0 1rem", letterSpacing: "-0.5px" }}>
                landing pages
              </h3>
              <p style={{ fontSize: "14px", lineHeight: 1.75, color: C.muted, margin: "0 0 1.5rem", fontWeight: 300 }}>
                Página dedicada por propiedad con galería, video, tour virtual y CTA optimizado. SEO local + schema markup inmobiliario. Cada propiedad merece su propia vitrina.
              </p>
              <a
                href="https://malabar-vista.vercel.app/"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  fontFamily: F.mono,
                  fontSize: "11px",
                  letterSpacing: "2px",
                  textTransform: "uppercase",
                  color: C.accent,
                  textDecoration: "none",
                  padding: "12px 0",
                  borderBottom: `1px solid ${C.accent}`,
                }}
              >
                Ver demo en vivo →
              </a>
            </div>
          </div>

          {/* === ROADMAP — sub-bloque más discreto === */}
          <div style={{ fontFamily: F.mono, fontSize: "10px", letterSpacing: "3px", textTransform: "uppercase", color: C.dim, marginBottom: "1rem", display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ width: "30px", height: "1px", background: C.dim, display: "inline-block" }} />
            En construcción · Próximos 6 meses
          </div>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: "1px", background: C.border }}>
            {[
              { id: "_02", title: "whatsApp IA", desc: "Agente que califica leads 24/7, agenda visitas y filtra curiosos. Integrado con CRM." },
              { id: "_03", title: "contenido & drone", desc: "Video, fotografía, drone 4K y calendario editorial de 12+ piezas mensuales." },
              { id: "_04", title: "sistema completo", desc: "Landing + WhatsApp IA + contenido + pauta + CRM + analytics — el paquete integral." },
            ].map((c3, i) => (
              <div
                key={c3.id}
                onMouseEnter={() => setHoveredCraft(i)}
                onMouseLeave={() => setHoveredCraft(null)}
                style={{
                  padding: "1.75rem 1.5rem",
                  background: hoveredCraft === i ? C.surface2 : C.surface,
                  transition: "background 0.3s ease",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <span style={{ fontFamily: F.mono, fontSize: "11px", color: C.dim }}>{c3.id}</span>
                  <span style={{ fontFamily: F.mono, fontSize: "9px", letterSpacing: "2px", color: C.dim, textTransform: "uppercase" }}>Próximo</span>
                </div>
                <h3 style={{ fontFamily: F.display, fontSize: "1.25rem", fontWeight: 400, color: C.white, margin: "0 0 0.6rem", letterSpacing: "-0.3px" }}>
                  {c3.title}
                </h3>
                <p style={{ fontSize: "12.5px", lineHeight: 1.7, color: C.muted, margin: 0, fontWeight: 300 }}>
                  {c3.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      <section id="faq" style={{ padding: "clamp(3rem, 7vw, 5rem) clamp(1.25rem, 4vw, 3rem)", borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          <div style={{ fontFamily: F.mono, fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: C.accent, marginBottom: "0.5rem" }}>
            FAQ
          </div>
          <h2 style={{ fontFamily: F.display, fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 400, color: C.white, margin: "0 0 2.5rem", letterSpacing: "-1px", lineHeight: 1.1 }}>
            Preguntas que me hacen
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            {FAQ_DATA.map((item, i) => {
              const isOpen = openFAQ === i;
              return (
                <div
                  key={i}
                  style={{
                    background: isOpen ? C.surface2 : C.surface,
                    border: `1px solid ${isOpen ? C.border2 : C.border}`,
                    transition: "all 0.3s ease",
                  }}
                >
                  <button
                    onClick={() => setOpenFAQ(isOpen ? null : i)}
                    style={{
                      width: "100%",
                      padding: "1.25rem 1.5rem",
                      background: "transparent",
                      border: "none",
                      color: C.white,
                      fontFamily: F.body,
                      fontSize: "clamp(0.95rem, 1.6vw, 1.1rem)",
                      fontWeight: 400,
                      textAlign: "left",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      gap: "1rem",
                    }}
                  >
                    <span>{item.q}</span>
                    <span style={{ fontFamily: F.mono, fontSize: "1.25rem", color: C.accent, lineHeight: 1, flexShrink: 0 }}>
                      {isOpen ? "−" : "+"}
                    </span>
                  </button>
                  {isOpen && (
                    <div style={{ padding: "0 1.5rem 1.5rem", fontFamily: F.body, fontSize: "14px", lineHeight: 1.75, color: C.muted, fontWeight: 300 }}>
                      {item.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ FLATERNITY ═══ */}
      <section id="flaternity" style={{ padding: "clamp(4rem, 8vw, 6rem) clamp(1.25rem, 4vw, 3rem)", borderTop: `1px solid ${C.border}`, background: C.surface }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ fontFamily: F.mono, fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: C.green, marginBottom: "0.5rem" }}>
            Case study — Track record
          </div>
          <div style={{ fontFamily: F.mono, fontSize: "11px", color: C.dim, marginBottom: "3rem" }}>
            <a href="https://www.flaternity.eu" target="_blank" rel="noopener" style={{ color: C.green, textDecoration: "none", borderBottom: `1px solid ${C.green}`, paddingBottom: "2px" }}>flaternity.eu</a>
            {" "}· Barcelona & Valencia · 2021–2025
          </div>

          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? "2rem" : "4rem", marginBottom: "3rem" }}>
            <div>
              <h2 style={{ fontFamily: F.display, fontSize: "clamp(2rem, 4vw, 3rem)", fontWeight: 400, color: C.white, margin: "0 0 1.5rem", lineHeight: 1.1, letterSpacing: "-1px" }}>
                De 4 pisos a{" "}
                <em style={{ fontStyle: "italic" }}>200+ habitaciones</em> y{" "}
                <em style={{ fontStyle: "italic", color: C.accent }}>€1.5M ARR</em>
              </h2>
              <p style={{ fontSize: "15px", lineHeight: 1.9, color: C.muted, fontWeight: 300 }}>
                Tras 5 años como consultor de M&A me quemé. Desde que llegué a España en 2014
                viví el problema de primera mano: los estudiantes extranjeros no encontraban
                donde vivir — los arrendadores pedían nóminas, avales y contratos de un año
                que nadie joven tenía. En 2021 fundé{" "}
                <strong style={{ color: C.white, fontWeight: 500 }}>Flaternity</strong>:
                alquiler de habitaciones para estudiantes, fácil, flexible y sin burocracia.
              </p>
            </div>
            <div>
              <p style={{ fontSize: "15px", lineHeight: 1.9, color: C.muted, fontWeight: 300, marginBottom: "1.5rem" }}>
                El primer año abrimos 4 pisos en Barcelona. El segundo llegamos a 12 y levantamos
                nuestra primera ronda de <strong style={{ color: C.white, fontWeight: 500 }}>€500k</strong>,
                seguida de una segunda ronda de <strong style={{ color: C.white, fontWeight: 500 }}>€1M</strong>.
                Nos expandimos a Valencia. Hoy operamos{" "}
                <strong style={{ color: C.white, fontWeight: 500 }}>50 apartamentos, 200+ habitaciones y un edificio completo</strong>{" "}
                entre Barcelona y Valencia.
              </p>
              <p style={{ fontSize: "15px", lineHeight: 1.9, color: C.muted, fontWeight: 300 }}>
                La empresa corre prácticamente sola. Construí{" "}
                <strong style={{ color: C.white, fontWeight: 500 }}>todos los sistemas</strong> desde cero —
                marketing, operaciones, finanzas, automatizaciones y agentes de IA.
                La misma mentalidad que ahora aplico al mercado colombiano.
              </p>
            </div>
          </div>

          {/* Flaternity gallery */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: "4px", marginBottom: "3rem" }}>
            {["flaternity-1", "flaternity-2", "flaternity-3", "flaternity-4"].map((base, i) => (
              <div key={i} style={{ aspectRatio: "4/3", overflow: "hidden" }}>
                <picture>
                  <source type="image/webp" srcSet={`/${base}.webp`} />
                  <img
                    src={`/${base}.jpg`}
                    alt={`Flaternity — apartamento ${i + 1}`}
                    width="800"
                    height="600"
                    loading="lazy"
                    decoding="async"
                    style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block", filter: "brightness(0.88)", transition: "filter 0.3s, transform 0.4s", cursor: "default" }}
                    onMouseEnter={e => { e.currentTarget.style.filter = "brightness(1)"; e.currentTarget.style.transform = "scale(1.04)"; }}
                    onMouseLeave={e => { e.currentTarget.style.filter = "brightness(0.88)"; e.currentTarget.style.transform = "scale(1)"; }}
                  />
                </picture>
              </div>
            ))}
          </div>

          {/* Flaternity metrics */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "1px", background: C.border }}>
            {[
              { val: "50+", label: "Apartamentos" },
              { val: "200+", label: "Habitaciones" },
              { val: "€1.5M", label: "ARR" },
              { val: "€1.5M", label: "Financiación levantada" },
              { val: "1", label: "Edificio en operación" },
            ].map((m, i) => (
              <div key={i} style={{ padding: "2rem 1rem", background: C.bg, textAlign: "center" }}>
                <div style={{ fontFamily: F.display, fontSize: "clamp(1.4rem, 2.5vw, 2rem)", color: C.white, letterSpacing: "-0.5px", marginBottom: "8px" }}>{m.val}</div>
                <div style={{ fontFamily: F.mono, fontSize: "9px", letterSpacing: "1.5px", textTransform: "uppercase", color: C.dim }}>{m.label}</div>
              </div>
            ))}
          </div>

          {/* What I built */}
          <div style={{ marginTop: "3rem" }}>
            <div style={{ fontFamily: F.mono, fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: C.dim, marginBottom: "1rem" }}>
              Sistemas que construí en Flaternity
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
              {["Funnel de adquisición", "Revenue management", "CRM operativo", "Automatización financiera", "Agentes IA", "Content marketing", "Pricing dinámico", "Onboarding tenants", "Mantenimiento predictivo", "Reporting inversionistas"].map((s) => (
                <span key={s} style={{ fontFamily: F.mono, fontSize: "10px", padding: "6px 14px", border: `1px solid ${C.border2}`, color: C.muted, letterSpacing: "0.5px" }}>{s}</span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══ EVOLUTION ARC ═══ */}
      <section style={{ padding: "clamp(3rem, 6vw, 4rem) clamp(1.25rem, 4vw, 3rem)", borderTop: `1px solid ${C.border}` }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{
            display: "grid",
            gridTemplateColumns: isMobile ? "1fr" : "repeat(4, 1fr)",
            gap: isMobile ? "2rem" : 0,
            position: "relative",
            padding: "2rem 0",
          }}>
            {!isMobile && (
              <div style={{ position: "absolute", top: "42px", left: "12.5%", right: "12.5%", height: "2px", background: `linear-gradient(to right, ${C.green}, ${C.green}, ${C.accent}, ${C.gold})`, zIndex: 1 }} />
            )}
            {[
              { label: "Números", sub: "Consultoría financiera", period: "2016–2021", color: C.green },
              { label: "Escala", sub: "Flaternity · €1.5M ARR", period: "2021–2025", color: C.green },
              { label: "Sistemas", sub: "Tech + Real Estate", period: "2025–hoy", color: C.accent, active: true },
              { label: "Desarrollo", sub: "Bogotá", period: "2026+", color: C.gold },
            ].map((n, i) => (
              isMobile ? (
                <div key={i} style={{ position: "relative", zIndex: 2, display: "flex", alignItems: "center", gap: "1rem" }}>
                  <div style={{ width: "14px", height: "14px", borderRadius: "50%", background: n.color, position: "relative", boxShadow: n.active ? `0 0 20px ${C.accentGlow}` : "none", flexShrink: 0 }}>
                    {n.active && <div style={{ position: "absolute", inset: "-5px", borderRadius: "50%", border: `1px solid ${C.accent}`, animation: "pulse 2s infinite" }} />}
                  </div>
                  <div>
                    <div style={{ fontFamily: F.mono, fontSize: "10px", color: C.dim, marginBottom: "2px" }}>{n.period}</div>
                    <div style={{ fontSize: "15px", fontWeight: 500, color: C.white, marginBottom: "4px" }}>{n.label}</div>
                    <div style={{ fontFamily: F.mono, fontSize: "10px", color: C.dim }}>{n.sub}</div>
                  </div>
                </div>
              ) : (
                <div key={i} style={{ textAlign: "center", position: "relative", zIndex: 2 }}>
                  <div style={{ fontFamily: F.mono, fontSize: "10px", color: C.dim, marginBottom: "12px" }}>{n.period}</div>
                  <div style={{ width: "14px", height: "14px", borderRadius: "50%", background: n.color, margin: "0 auto 1.2rem", position: "relative", boxShadow: n.active ? `0 0 20px ${C.accentGlow}` : "none" }}>
                    {n.active && <div style={{ position: "absolute", inset: "-5px", borderRadius: "50%", border: `1px solid ${C.accent}`, animation: "pulse 2s infinite" }} />}
                  </div>
                  <div style={{ fontSize: "15px", fontWeight: 500, color: C.white, marginBottom: "4px" }}>{n.label}</div>
                  <div style={{ fontFamily: F.mono, fontSize: "10px", color: C.dim }}>{n.sub}</div>
                </div>
              )
            ))}
          </div>
        </div>
      </section>

      {/* ═══ BOGOTÁ ═══ */}
      <section id="bogotá" style={{ padding: "clamp(4rem, 8vw, 6rem) clamp(1.25rem, 4vw, 3rem)", borderTop: `1px solid ${C.border}`, background: C.surface, position: "relative", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: "50%", right: "-8%", transform: "translateY(-50%)", width: "450px", height: "450px", borderRadius: "50%", border: `1px solid ${C.border}`, opacity: 0.2, pointerEvents: "none" }} />

        <div style={{ maxWidth: "1100px", margin: "0 auto", position: "relative" }}>
          <div style={{ fontFamily: F.mono, fontSize: "11px", letterSpacing: "3px", textTransform: "uppercase", color: C.gold, marginBottom: "1.5rem" }}>
            Próximo capítulo — 2026+
          </div>
          <h2 style={{ fontFamily: F.display, fontSize: "clamp(2rem, 4vw, 3.2rem)", fontWeight: 400, margin: "0 0 1rem", lineHeight: 1.1, color: C.white, letterSpacing: "-1px" }}>
            Desarrollo inmobiliario en <em style={{ fontStyle: "italic" }}>Bogotá</em>
          </h2>
          <p style={{ fontSize: "15px", lineHeight: 1.8, color: C.muted, fontWeight: 300, maxWidth: "600px", marginBottom: "3rem" }}>
            El mismo enfoque de sistemas aplicado a compra, reforma, construcción y venta.
            Buscando activamente oportunidades y socios en la capital.
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "1.5rem" }}>
            {[
              { zone: "Chapinero", type: "Reforma + densificación", desc: "Casas antiguas con potencial de subdivisión. Alta demanda de arriendos." },
              { zone: "Usaquén", type: "Vivienda de lujo", desc: "Mercado consolidado, estrato 5-6. Reventa o renta de largo plazo." },
              { zone: "Centro", type: "Renovación urbana", desc: "POT favorable, Metro de Bogotá como catalizador de valorización." },
            ].map((z, i) => (
              <div
                key={z.zone}
                onMouseEnter={() => setHoveredZone(i)}
                onMouseLeave={() => setHoveredZone(null)}
                style={{
                  padding: "2rem",
                  background: hoveredZone === i ? C.surface2 : C.bg,
                  border: `1px solid ${hoveredZone === i ? C.gold : C.border}`,
                  transition: "all 0.3s ease",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
                  <span style={{ fontFamily: F.display, fontSize: "1.4rem", color: C.white }}>{z.zone}</span>
                  <span style={{ fontFamily: F.mono, fontSize: "8px", letterSpacing: "1.5px", textTransform: "uppercase", color: C.gold, padding: "3px 8px", border: `1px solid ${C.gold}` }}>{z.type}</span>
                </div>
                <p style={{ fontFamily: F.mono, fontSize: "12px", color: C.dim, margin: 0, lineHeight: 1.6 }}>{z.desc}</p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "3rem", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "1.5rem" }}>
            {[
              { icon: "◇", title: "Casas para reforma", sub: "$800M–$2.000M COP" },
              { icon: "□", title: "Lotes para desarrollo", sub: "6-12 unidades residenciales" },
              { icon: "△", title: "Socios & inversionistas", sub: "Capital + expertise local" },
              { icon: "○", title: "Propiedades para vender", sub: "Mis sistemas, tu propiedad" },
            ].map((b) => (
              <div key={b.title} style={{ padding: "1.5rem", borderLeft: `2px solid ${C.border2}` }}>
                <div style={{ fontSize: "20px", color: C.accent, marginBottom: "10px" }}>{b.icon}</div>
                <div style={{ fontSize: "14px", fontWeight: 500, color: C.white, marginBottom: "4px" }}>{b.title}</div>
                <div style={{ fontFamily: F.mono, fontSize: "11px", color: C.dim }}>{b.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CONTACT ═══ */}
      <section id="contacto" style={{ padding: "clamp(5rem, 10vw, 8rem) clamp(1.25rem, 4vw, 3rem)", textAlign: "center", position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse at center, ${C.accentDim}, transparent 60%)`, pointerEvents: "none" }} />
        <div style={{ position: "relative" }}>
          <h2 style={{ fontFamily: F.display, fontSize: "clamp(2.5rem, 5vw, 4rem)", fontWeight: 400, color: C.white, margin: "0 0 1rem", lineHeight: 1.05, letterSpacing: "-2px" }}>
            Construyamos algo{" "}
            <em style={{ fontStyle: "italic", color: C.accent }}>juntos.</em>
          </h2>
          <p style={{ fontSize: "16px", color: C.muted, maxWidth: "480px", margin: "0 auto 3rem", lineHeight: 1.7, fontWeight: 300 }}>
            ¿Tienes una propiedad, un proyecto, o una idea?
            En 24 horas te digo exactamente qué se puede hacer.
          </p>
          <a
            href="https://wa.me/57XXXXXXXXXX?text=Hola%20Esteban%2C%20me%20interesa%20hablar%20sobre%20un%20proyecto%20inmobiliario"
            target="_blank" rel="noopener"
            style={{ display: "inline-block", fontFamily: F.mono, fontSize: "13px", letterSpacing: "2.5px", textTransform: "uppercase", color: C.bg, background: C.accent, padding: "18px 48px", textDecoration: "none", fontWeight: 400 }}
          >
            Escribir por WhatsApp
          </a>
          <div style={{ marginTop: "3rem", display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "1.5rem 2.5rem" }}>
            {[
              { label: "// Flaternity", val: "www.flaternity.eu", href: "https://www.flaternity.eu" },
              { label: "// LinkedIn", val: "linkedin.com/in/emolinam", href: "https://www.linkedin.com/in/emolinam" },
              { label: "// Email", val: "emolina920@gmail.com", href: "mailto:emolina920@gmail.com" },
            ].map((c2) => (
              <div key={c2.label} style={{ textAlign: "center" }}>
                <div style={{ fontFamily: F.mono, fontSize: "10px", color: C.dim, letterSpacing: "1.5px", marginBottom: "4px" }}>{c2.label}</div>
                <a href={c2.href} target="_blank" rel="noopener" style={{ fontFamily: F.mono, fontSize: "12px", color: C.muted, textDecoration: "none", borderBottom: `1px solid ${C.border2}`, paddingBottom: "2px", transition: "color 0.3s" }}
                  onMouseEnter={e => e.currentTarget.style.color = C.accent}
                  onMouseLeave={e => e.currentTarget.style.color = C.muted}>{c2.val}</a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer style={{ padding: "2rem clamp(1.25rem, 4vw, 3rem)", borderTop: `1px solid ${C.border}`, display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "6px", height: "6px", background: C.accent, borderRadius: "50%" }} />
          <span style={{ fontFamily: F.mono, fontSize: "10px", letterSpacing: "2px", textTransform: "uppercase", color: C.dim }}>
            Esteban · Sistemas inmobiliarios · Colombia
          </span>
        </div>
        <div style={{ fontFamily: F.mono, fontSize: "10px", color: C.dim }}>
          Diseñado por humano. Potenciado por sistemas.
        </div>
      </footer>

    </div>
  );
}
