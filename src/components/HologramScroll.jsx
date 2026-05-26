'use client'
import { useEffect, useRef, useState, useCallback } from 'react'

const TOTAL          = 122
const DIR            = '/hologram/'
const INITIAL_BATCH  = 15
const BATCH_SIZE     = 15
const MOBILE_BP      = 768
const MOBILE_STEP    = 2

function pad(n) {
  return String(n).padStart(4, '0')
}

const PHASES = [
  { num: '01', title: 'Análisis',     desc: 'Datos de mercado y viabilidad'        },
  { num: '02', title: 'Desarrollo',   desc: 'Planificación y ejecución del activo' },
  { num: '03', title: 'Rentabilidad', desc: 'Retorno optimizado desde día 1'       },
]

export default function HologramScroll() {
  const imgRef      = useRef(null)
  const sectionRef  = useRef(null)
  const imgsRef     = useRef([])
  const lastFrame   = useRef(-1)
  const tickingRef  = useRef(false)
  const isMobileRef = useRef(false)

  const [loaded,         setLoaded]         = useState(0)
  const [ready,          setReady]          = useState(false)
  const [phase,          setPhase]          = useState(-1)
  const [isMobile,       setIsMobile]       = useState(false)
  const [reducedMotion,  setReducedMotion]  = useState(false)

  // ── Mobile detection ──────────────────────────────────────────────
  useEffect(() => {
    const check = () => {
      const m = window.innerWidth < MOBILE_BP
      setIsMobile(m)
      isMobileRef.current = m
    }
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  // ── Reduced-motion detection ──────────────────────────────────────
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReducedMotion(mq.matches)
    const handler = (e) => setReducedMotion(e.matches)
    mq.addEventListener
      ? mq.addEventListener('change', handler)
      : mq.addListener(handler)
    return () => {
      mq.removeEventListener
        ? mq.removeEventListener('change', handler)
        : mq.removeListener(handler)
    }
  }, [])

  // ── Single-frame loader (used by batched preload) ─────────────────
  const loadFrame = useCallback((i) => {
    return new Promise((resolve) => {
      const img = new Image()
      const done = () => {
        if (img.complete && img.naturalWidth > 0) imgsRef.current[i] = img
        setLoaded((prev) => prev + 1)
        resolve()
      }
      img.onload  = done
      img.onerror = done
      img.src = DIR + 'frame_' + pad(i + 1) + '.webp'
    })
  }, [])

  // ── Lazy-load in batches ──────────────────────────────────────────
  const preload = useCallback(async () => {
    const step = isMobileRef.current ? MOBILE_STEP : 1

    // 1) Priority batch — first INITIAL_BATCH frames
    const initial = []
    for (let i = 0; i < Math.min(INITIAL_BATCH, TOTAL); i += step) {
      initial.push(loadFrame(i))
    }
    await Promise.all(initial)
    setReady(true)

    // 2) Background batches of BATCH_SIZE
    for (let start = INITIAL_BATCH; start < TOTAL; start += BATCH_SIZE) {
      const end = Math.min(start + BATCH_SIZE, TOTAL)
      const batch = []
      for (let i = start; i < end; i += step) batch.push(loadFrame(i))
      // eslint-disable-next-line no-await-in-loop
      await Promise.all(batch)
    }
  }, [loadFrame])

  // ── Trigger preload via IntersectionObserver (unless reduced-motion)
  useEffect(() => {
    if (reducedMotion) return
    const section = sectionRef.current
    if (!section) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          obs.disconnect()
          preload()
        }
      },
      { rootMargin: '300px' }
    )
    obs.observe(section)
    return () => obs.disconnect()
  }, [preload, reducedMotion])

  // ── Reduced-motion path: load only the final frame statically ─────
  useEffect(() => {
    if (!reducedMotion) return
    const img = new Image()
    img.onload = () => {
      if (imgRef.current) imgRef.current.src = img.src
      setReady(true)
    }
    img.onerror = () => setReady(true)
    img.src = DIR + 'frame_' + pad(TOTAL) + '.webp'
  }, [reducedMotion])

  // ── Once ready, paint first frame (animated path) ─────────────────
  useEffect(() => {
    if (reducedMotion) return
    if (ready && imgsRef.current[0] && imgRef.current) {
      imgRef.current.src = imgsRef.current[0].src
    }
  }, [ready, reducedMotion])

  // ── Frame update logic (called inside rAF) ────────────────────────
  const updateFrame = useCallback(() => {
    tickingRef.current = false
    const section = sectionRef.current
    const imgEl   = imgRef.current
    if (!section || !imgEl) return

    const rect       = section.getBoundingClientRect()
    const scrollable = section.offsetHeight - window.innerHeight
    const progress   = Math.max(0, Math.min(1, -rect.top / scrollable))
    const fi         = Math.min(TOTAL - 1, Math.floor(progress * TOTAL))

    if (fi !== lastFrame.current) {
      lastFrame.current = fi
      let img = imgsRef.current[fi]
      // Fallback: if requested frame not yet loaded, use nearest earlier one
      if (!img) {
        for (let j = fi - 1; j >= 0; j--) {
          if (imgsRef.current[j]) { img = imgsRef.current[j]; break }
        }
      }
      if (img) imgEl.src = img.src
    }

    const p = progress < 0.33 ? 0 : progress < 0.66 ? 1 : 2
    setPhase(progress > 0.02 && progress < 0.98 ? p : -1)
  }, [])

  // ── Scroll handler wrapped in requestAnimationFrame ───────────────
  const onScroll = useCallback(() => {
    if (tickingRef.current) return
    tickingRef.current = true
    requestAnimationFrame(updateFrame)
  }, [updateFrame])

  useEffect(() => {
    if (!ready || reducedMotion) return
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [ready, reducedMotion, onScroll])

  const pct = Math.round((loaded / TOTAL) * 100)

  // Section height: 400vh on mobile, 600vh on desktop, 100vh w/ reduced-motion
  const sectionHeight = reducedMotion ? '100vh' : (isMobile ? '400vh' : '600vh')

  return (
    <section
      ref={sectionRef}
      style={{ position: 'relative', height: sectionHeight, background: '#0A0A0A' }}
    >
      <div style={{
        position: reducedMotion ? 'relative' : 'sticky', top: 0, height: '100vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', background: '#0A0A0A',
      }}>
        {!ready && !reducedMotion && (
          <div style={{ textAlign: 'center' }}>
            <p style={{
              fontFamily: 'Georgia, serif', fontSize: 14,
              color: '#3FB7E4', letterSpacing: '0.1em', marginBottom: 20,
            }}>
              ESTEBAN MOLINA
            </p>
            <div style={{ width: 180, height: 1, background: '#1A1F2E', margin: '0 auto' }}>
              <div style={{
                height: '100%', width: pct + '%',
                background: '#3FB7E4', transition: 'width 0.08s linear',
              }} />
            </div>
            <p style={{
              fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase',
              color: '#6B7280', marginTop: 10,
            }}>
              {pct > 0 ? pct + '%' : 'Iniciando…'}
            </p>
          </div>
        )}

        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          ref={imgRef}
          alt="Holographic building — Esteban Molina proptech"
          style={{
            display: ready ? 'block' : 'none',
            width: 'min(88vw, 960px)',
            height: 'auto',
            mixBlendMode: 'screen',
            filter: 'brightness(1.2) saturate(1.1)',
            willChange: 'transform',
            userSelect: 'none',
            pointerEvents: 'none',
          }}
        />

        {!reducedMotion && PHASES.map((p, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              ...(isMobile
                ? {
                    bottom: 80,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    textAlign: 'center',
                  }
                : {
                    top: '50%',
                    right: 48,
                    transform: 'translateY(-50%)',
                    textAlign: 'right',
                  }),
              opacity: phase === i ? 1 : 0,
              transition: 'opacity 0.45s ease',
              pointerEvents: 'none',
            }}
          >
            <div style={{
              fontFamily: 'Georgia, serif',
              fontSize: isMobile ? 48 : 64,
              lineHeight: 1, color: '#3FB7E4', opacity: 0.12,
            }}>
              {p.num}
            </div>
            <div style={{
              fontSize: 11, letterSpacing: '0.2em',
              textTransform: 'uppercase', color: '#3FB7E4', marginTop: 4,
            }}>
              {p.title}
            </div>
            <div style={{
              fontSize: 12, color: '#6B7280', marginTop: 4,
              maxWidth: 150,
              marginLeft: isMobile ? 'auto' : undefined,
              marginRight: isMobile ? 'auto' : undefined,
            }}>
              {p.desc}
            </div>
          </div>
        ))}

        {ready && !reducedMotion && !isMobile && (
          <div style={{
            position: 'absolute', bottom: 36, left: '50%',
            transform: 'translateX(-50%)',
            fontSize: 11, letterSpacing: '0.2em', textTransform: 'uppercase',
            color: '#6B7280', whiteSpace: 'nowrap',
            opacity: phase >= 0 ? 1 : 0, transition: 'opacity 0.3s',
          }}>
            Scroll para construir
          </div>
        )}
      </div>
    </section>
  )
}
