# Proyecto Esteban — Marca Personal

Sitio web personal de Esteban Molina. Portfolio + marca personal como operador inmobiliario que construye sistemas.

## Stack
Next.js 16 · React · JavaScript (JSX) · Inline styles
Dev server: `npm run dev` → http://localhost:3000

## Concepto visual
Estética oscura tipo terminal/operador. Paleta: negro carbón + azul eléctrico (#38bdf8) + oro (#c4a44a).
Fuentes: Instrument Serif (display) · DM Sans (cuerpo) · JetBrains Mono (datos/labels)

## Secciones actuales
1. **Hero** — "No vendo propiedades. Construyo sistemas."
2. **Marquee** — banda de texto animada con logros
3. **Proyecto destacado** — Malabar Vista (casa lago Cerritos)
4. **Quote** — argumento de venta de sistemas
5. **Intro** — historia personal + Flaternity
6. **Mis sistemas** — 4 servicios (landing, WhatsApp IA, contenido, paquete completo)
7. **Flaternity** — case study: 30 → 200+ hab, €1.5M ARR, €1M levantado
8. **Evolution arc** — línea de tiempo: Números → Escala → Sistemas → Desarrollo
9. **Bogotá** — próximo capítulo: desarrollo inmobiliario 2026+
10. **Contacto** — WhatsApp + Flaternity + LinkedIn + Email
11. **Footer**

## Pendientes de branding
- [ ] Foto real de Esteban (hero o sección intro)
- [ ] Foto real de Malabar Vista (sección proyecto destacado)
- [ ] Número de WhatsApp correcto en botón de contacto (actualmente: 57XXXXXXXXXX)
- [ ] Link real de LinkedIn
- [ ] Email real (hola@...)
- [ ] GIFs o videos de preview para las 4 tarjetas de servicios
- [ ] Foto/video hero de Malabar para la tarjeta de proyecto

## Archivos clave
```
src/app/
  page.jsx      ← todo el sitio en un solo componente
  layout.js     ← título SEO y metadata
  globals.css   ← animaciones (marquee, pulse) y reset base
```

## Cómo iniciar
Abrir terminal en la carpeta del proyecto y ejecutar:
```
npm run dev
```
Luego abrir http://localhost:3000 en el navegador.
