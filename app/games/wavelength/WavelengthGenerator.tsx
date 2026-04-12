"use client"

import { useState, useRef, useMemo, useEffect, useCallback } from "react"
import Link from "next/link"
import { ArrowLeft as ArrowLeftIcon, SlidersHorizontal, ChevronRight } from "lucide-react"
import { wavelengthCards, PACK_LABELS, type WavelengthCard, type WavelengthPack } from "@/data/wavelength-cards"
import { ANIMATION_DURATION } from "@/lib/utils/constants"

const ALL_PACKS: WavelengthPack[] = ["original", "family", "edgy", "abstract", "generated"]

function getPackCounts() {
  const counts = { original: 0, family: 0, edgy: 0, abstract: 0, generated: 0 } as Record<WavelengthPack, number>
  for (const c of wavelengthCards) counts[c.pack]++
  return counts
}
const PACK_COUNTS = getPackCounts()

// Deterministic pastel-ish hue pair from card's position in the full array
function getCardColors(globalIndex: number) {
  const hue1 = (globalIndex * 137.508) % 360
  const hue2 = (hue1 + 155 + (globalIndex * 41) % 50) % 360
  // Muted, readable palette: 55% sat, 62% lightness — similar to the card in the reference
  const leftBg = `hsl(${Math.round(hue1)}, 52%, 62%)`
  const rightBg = `hsl(${Math.round(hue2)}, 58%, 58%)`
  return { leftBg, rightBg }
}

// Long SVG spectrum arrows
function SpectrumArrowLeft() {
  return (
    <svg width="64" height="18" viewBox="0 0 64 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="56" y1="9" x2="8" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <polyline points="18,2 8,9 18,16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}
function SpectrumArrowRight() {
  return (
    <svg width="64" height="18" viewBox="0 0 64 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="8" y1="9" x2="56" y2="9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      <polyline points="46,2 56,9 46,16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  )
}

// Floating orb background
// Canvas-based starfield — tiny particles drift slowly left→right, matching wavelength.zone
function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef = useRef<number>(0)

  const init = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const W = (canvas.width = window.innerWidth)
    const H = (canvas.height = window.innerHeight)

    type P = { x: number; y: number; r: number; alpha: number; vx: number; soft: boolean }
    const particles: P[] = []

    // 180 tiny star dots
    for (let i = 0; i < 180; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 1.2 + 0.3,
        alpha: Math.random() * 0.55 + 0.15,
        vx: Math.random() * 0.08 + 0.02,
        soft: false,
      })
    }
    // 6 large soft glow orbs
    for (let i = 0; i < 6; i++) {
      particles.push({
        x: Math.random() * W,
        y: Math.random() * H,
        r: Math.random() * 130 + 90,
        alpha: Math.random() * 0.09 + 0.05,
        vx: Math.random() * 0.03 + 0.01,
        soft: true,
      })
    }

    const draw = () => {
      ctx.clearRect(0, 0, W, H)
      for (const p of particles) {
        if (p.soft) {
          const g = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r)
          g.addColorStop(0,   `rgba(60,110,235,${p.alpha})`)
          g.addColorStop(0.5, `rgba(30,70,190,${p.alpha * 0.35})`)
          g.addColorStop(1,   "transparent")
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
          ctx.fillStyle = g
          ctx.fill()
        } else {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
          ctx.fillStyle = `rgba(200,220,255,${p.alpha})`
          ctx.fill()
        }
        p.x += p.vx
        if (p.x - p.r > W) p.x = -p.r
      }
      rafRef.current = requestAnimationFrame(draw)
    }
    draw()
  }, [])

  useEffect(() => {
    init()
    const onResize = () => { cancelAnimationFrame(rafRef.current); init() }
    window.addEventListener("resize", onResize)
    return () => {
      cancelAnimationFrame(rafRef.current)
      window.removeEventListener("resize", onResize)
    }
  }, [init])

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{ position: "absolute", inset: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }}
    />
  )
}

export function WavelengthGenerator() {
  // Store the actual card object — so pack changes don't disrupt the current display
  const [currentCard, setCurrentCard] = useState<WavelengthCard | null>(null)
  const [globalIndex, setGlobalIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [showPackFilter, setShowPackFilter] = useState(false)
  const [enabledPacks, setEnabledPacks] = useState<Set<WavelengthPack>>(() => {
    if (typeof window === "undefined") return new Set(ALL_PACKS)
    try {
      const saved = localStorage.getItem("wl-packs")
      if (saved) {
        const parsed = JSON.parse(saved) as WavelengthPack[]
        if (Array.isArray(parsed) && parsed.length > 0) return new Set(parsed)
      }
    } catch { /* ignore */ }
    return new Set(ALL_PACKS)
  })

  const touchStart = useRef<number | null>(null)
  const touchEnd = useRef<number | null>(null)
  const filterRef = useRef<HTMLDivElement>(null)

  // Filtered pool — only used when picking the NEXT card
  const cardPool = useMemo(
    () => wavelengthCards.filter(c => enabledPacks.has(c.pack)),
    [enabledPacks]
  )

  const colors = useMemo(() => getCardColors(globalIndex), [globalIndex])

  const pickNextCard = () => {
    if (isAnimating || cardPool.length === 0) return
    setIsAnimating(true)
    setTimeout(() => {
      try {
        // Pick a random card from the enabled pool, different from current
        let idx: number
        do {
          idx = Math.floor(Math.random() * cardPool.length)
        } while (cardPool[idx] === currentCard && cardPool.length > 1)
        const picked = cardPool[idx]
        setCurrentCard(picked)
        setGlobalIndex(wavelengthCards.indexOf(picked))
      } catch {
        setCurrentCard(cardPool[0])
        setGlobalIndex(0)
      } finally {
        setIsAnimating(false)
      }
    }, ANIMATION_DURATION)
  }

  const togglePack = (pack: WavelengthPack) => {
    setEnabledPacks(prev => {
      const next = new Set(prev)
      if (next.has(pack)) {
        if (next.size <= 1) return prev // keep at least one pack
        next.delete(pack)
      } else {
        next.add(pack)
      }
      try { localStorage.setItem("wl-packs", JSON.stringify([...next])) } catch { /* ignore */ }
      return next
    })
    // No card reset — current card stays until "Next Card" is pressed
  }

  // Close filter on outside click
  useEffect(() => {
    if (!showPackFilter) return
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setShowPackFilter(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [showPackFilter])

  const minSwipeDistance = 50
  const onTouchStart = (e: React.TouchEvent) => {
    touchEnd.current = null
    touchStart.current = e.targetTouches[0].clientX
  }
  const onTouchMove = (e: React.TouchEvent) => {
    e.preventDefault()
    touchEnd.current = e.targetTouches[0].clientX
  }
  const onTouchEnd = () => {
    if (touchStart.current === null || touchEnd.current === null) return
    if (Math.abs(touchStart.current - touchEnd.current) > minSwipeDistance && !isAnimating) pickNextCard()
  }

  return (
    <div
      className="h-[100dvh] overflow-hidden flex flex-col relative"
      style={{ background: "rgb(1,6,37)", fontFamily: "var(--font-questrial), sans-serif" }}
    >
      <Starfield />

      {/* Pack filter panel */}
      {showPackFilter && (
        <div
          ref={filterRef}
          className="absolute top-14 right-4 z-50 rounded-2xl shadow-2xl overflow-hidden"
          style={{
            background: "rgba(14,10,38,0.96)",
            border: "1px solid rgba(160,100,255,0.3)",
            minWidth: "210px",
            backdropFilter: "blur(16px)",
          }}
        >
          <div
            className="px-4 py-3 text-xs font-semibold uppercase tracking-widest border-b"
            style={{ color: "rgba(210,190,255,0.6)", borderColor: "rgba(160,100,255,0.15)" }}
          >
            Card Packs
          </div>
          {ALL_PACKS.map(pack => {
            const active = enabledPacks.has(pack)
            return (
              <label
                key={pack}
                className="flex items-center justify-between gap-4 px-4 py-2.5 cursor-pointer transition-colors select-none"
                style={{
                  color: active ? "#e8e0ff" : "rgba(210,190,255,0.65)",
                  background: "transparent",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(160,100,255,0.1)" }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent" }}
              >
                <span className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    checked={active}
                    onChange={() => togglePack(pack)}
                    className="accent-purple-400 w-3.5 h-3.5 shrink-0"
                  />
                  <span className="text-sm font-medium">{PACK_LABELS[pack]}</span>
                </span>
                <span className="text-xs tabular-nums" style={{ color: "rgba(210,190,255,0.45)" }}>
                  {PACK_COUNTS[pack]}
                </span>
              </label>
            )
          })}
          <div
            className="px-4 py-2.5 text-xs text-center border-t"
            style={{ color: "rgba(210,190,255,0.45)", borderColor: "rgba(160,100,255,0.15)" }}
          >
            {cardPool.length} cards active
          </div>
        </div>
      )}

      {/* Header */}
      <div className="shrink-0 h-14 flex items-center justify-between px-4 md:px-6 z-40 relative">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors"
          style={{
            border: "1px solid rgba(160,100,255,0.35)",
            color: "rgba(210,190,255,0.7)",
            background: "transparent",
          }}
        >
          <ArrowLeftIcon className="w-4 h-4" />
          <span className="hidden sm:inline">Back to Shelf</span>
        </Link>

        <button
          onClick={() => setShowPackFilter(v => !v)}
          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-colors"
          style={{
            border: `1px solid ${showPackFilter ? "rgba(160,100,255,0.7)" : "rgba(160,100,255,0.35)"}`,
            color: showPackFilter ? "#c084fc" : "rgba(210,190,255,0.7)",
            background: showPackFilter ? "rgba(160,100,255,0.12)" : "transparent",
          }}
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span className="font-medium">Packs</span>
        </button>
      </div>

      {/* Title */}
      <div className="shrink-0 h-[18dvh] landscape:h-[12dvh] flex flex-col items-center justify-center pointer-events-none px-4 z-10 relative">
        <h1
          className="font-black text-[clamp(2.2rem,9vw,4.5rem)] select-none tracking-tight"
          style={{
            fontFamily: "var(--font-questrial), sans-serif",
            color: "#fff",
            textShadow: "0 0 24px rgba(180,130,255,0.55), 0 0 70px rgba(100,80,200,0.25)",
            letterSpacing: "-0.01em",
          }}
        >
          Wavelength
        </h1>
        <div className="mt-1.5 flex items-center gap-2">
          <div className="w-16 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(180,130,255,0.45))" }} />
          <div className="w-1 h-1 rounded-full bg-purple-400/40" />
          <div className="w-16 h-px" style={{ background: "linear-gradient(to left, transparent, rgba(180,130,255,0.45))" }} />
        </div>
      </div>

      {/* Card zone */}
      <div className="flex-1 flex items-stretch px-4 sm:px-6 pb-4 sm:pb-5 min-h-0 z-10 relative landscape:pb-3">
        <div className="w-full max-w-2xl mx-auto flex flex-col landscape:max-w-3xl">

          {/* Split spectrum card */}
          <div
            className={`relative flex-1 flex flex-col rounded-2xl overflow-hidden transition-all duration-200 ${
              isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
            }`}
            style={{ boxShadow: "0 16px 60px rgba(0,0,0,0.55)" }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {currentCard ? (
              <div className="flex flex-row flex-1">
                {/* LEFT half */}
                <div
                  className="flex-1 flex flex-col items-center justify-center p-5 sm:p-8 landscape:p-5 gap-3 sm:gap-5"
                  style={{ background: colors.leftBg }}
                >
                  <div className="text-[#1a120a]/50">
                    <SpectrumArrowLeft />
                  </div>
                  <h2
                    className="text-center text-[clamp(1.1rem,3.5vw,1.9rem)] font-semibold leading-tight"
                    style={{ color: "#1a120a", letterSpacing: "-0.01em" }}
                  >
                    {currentCard.left}
                  </h2>
                </div>

                {/* Divider */}
                <div className="w-px self-stretch" style={{ background: "rgba(0,0,0,0.12)" }} />

                {/* RIGHT half */}
                <div
                  className="flex-1 flex flex-col items-center justify-center p-5 sm:p-8 landscape:p-5 gap-3 sm:gap-5"
                  style={{ background: colors.rightBg }}
                >
                  <div className="text-[#1a120a]/50">
                    <SpectrumArrowRight />
                  </div>
                  <h2
                    className="text-center text-[clamp(1.1rem,3.5vw,1.9rem)] font-semibold leading-tight"
                    style={{ color: "#1a120a", letterSpacing: "-0.01em" }}
                  >
                    {currentCard.right}
                  </h2>
                </div>
              </div>
            ) : (
              /* Empty state */
              <div className="flex-1 flex flex-col items-center justify-center gap-5 p-8"
                style={{ background: "linear-gradient(135deg, #1a1040, #120d35)" }}>
                <div
                  className="w-14 h-14 rounded-full flex items-center justify-center"
                  style={{ border: "1px solid rgba(160,100,255,0.25)", background: "rgba(160,100,255,0.07)" }}
                >
                  <span className="text-xl" style={{ filter: "drop-shadow(0 0 8px rgba(180,130,255,0.5))" }}>✦</span>
                </div>
                <p className="text-white/70 text-base font-medium">Ready to play?</p>
                <p className="text-white/35 text-sm text-center">
                  {cardPool.length} cards · {enabledPacks.size} pack{enabledPacks.size !== 1 ? "s" : ""}
                </p>
              </div>
            )}

            {/* Next card button — pinned to bottom of card */}
            <div
              className="shrink-0 flex items-center justify-between px-5 sm:px-8 py-3 sm:py-4 landscape:py-3"
              style={{ background: "rgba(8,6,25,0.65)", backdropFilter: "blur(8px)", borderTop: "1px solid rgba(255,255,255,0.07)" }}
            >
              {/* Pack badge */}
              <span
                className="text-xs px-2.5 py-1 rounded-full font-medium"
                style={{
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "rgba(255,255,255,0.4)",
                  fontFamily: "var(--font-questrial), sans-serif",
                }}
              >
                {currentCard ? PACK_LABELS[currentCard.pack] : "–"}
              </span>

              <button
                onClick={pickNextCard}
                disabled={isAnimating || cardPool.length === 0}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 disabled:opacity-40"
                style={{
                  border: "1px solid rgba(255,255,255,0.7)",
                  color: "#fff",
                  background: "transparent",
                  fontFamily: "var(--font-questrial), sans-serif",
                  letterSpacing: "0.01em",
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.1)" }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = "transparent" }}
              >
                {isAnimating ? "..." : (
                  <>
                    {currentCard ? "Next Card" : "Draw Card"}
                    <ChevronRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
