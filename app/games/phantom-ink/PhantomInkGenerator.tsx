"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, ChevronRight } from "lucide-react"
import { phantomInkCards } from "@/data/phantom-ink-cards"
import { ANIMATION_DURATION } from "@/lib/utils/constants"

// Corner flourish SVG for parchment card decoration
function CornerFlourish({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M2 2 L10 2 L10 4 L4 4 L4 10 L2 10 Z" fill="#8B6914" opacity="0.6" />
      <path d="M2 2 L6 2 L6 3 L3 3 L3 6 L2 6 Z" fill="#8B6914" opacity="0.9" />
      <circle cx="2" cy="2" r="1.5" fill="#8B6914" opacity="0.7" />
      <circle cx="10" cy="2" r="0.8" fill="#8B6914" opacity="0.5" />
      <circle cx="2" cy="10" r="0.8" fill="#8B6914" opacity="0.5" />
    </svg>
  )
}

export function PhantomInkGenerator() {
  const [cardIndex, setCardIndex] = useState<number | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const touchStart = useRef<number | null>(null)
  const touchEnd = useRef<number | null>(null)

  const currentCard = cardIndex !== null ? phantomInkCards[cardIndex] : null

  const nextCard = () => {
    if (isAnimating) return
    setIsAnimating(true)
    setTimeout(() => {
      try {
        let newIndex: number
        do {
          newIndex = Math.floor(Math.random() * phantomInkCards.length)
        } while (newIndex === cardIndex && phantomInkCards.length > 1)
        setCardIndex(newIndex)
      } catch {
        setCardIndex(0)
      } finally {
        setIsAnimating(false)
      }
    }, ANIMATION_DURATION)
  }

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
    const distance = touchStart.current - touchEnd.current
    if (Math.abs(distance) > minSwipeDistance && !isAnimating) nextCard()
  }

  return (
    <div
      className="h-[100dvh] overflow-hidden flex flex-col"
      style={{ background: "#0d0b08" }}
    >
      {/* Header row */}
      <div className="shrink-0 h-14 flex items-center px-4 md:px-6 z-50">
        <Button
          asChild
          variant="outline"
          className="border border-[#C9A84C]/50 text-[#C9A84C] bg-transparent hover:bg-[#C9A84C]/10 hover:text-[#C9A84C] hover:border-[#C9A84C] shadow-lg transition-colors"
        >
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shelf
          </Link>
        </Button>
      </div>

      {/* Title zone */}
      <div className="shrink-0 h-[22dvh] flex flex-col items-center justify-center pointer-events-none px-4">
        <h1
          className="text-[clamp(1.8rem,7vw,3.5rem)] font-[family-name:var(--font-cinzel-decorative)] select-none text-center leading-tight"
          style={{
            color: "#C9A84C",
            textShadow: "0 0 30px rgba(201,168,76,0.25), 0 2px 4px rgba(0,0,0,0.8)",
            letterSpacing: "0.08em",
          }}
        >
          Phantom Ink
        </h1>
        {/* Decorative divider */}
        <div className="mt-3 flex items-center gap-3 w-full max-w-xs">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#C9A84C]/50" />
          <div
            className="w-1.5 h-1.5 rotate-45 border border-[#C9A84C]/60"
            style={{ background: "transparent" }}
          />
          <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#C9A84C]/50" />
        </div>
        <p
          className="mt-2 text-xs font-[family-name:var(--font-cinzel)] uppercase tracking-widest"
          style={{ color: "#C9A84C", opacity: 0.75, letterSpacing: "0.2em" }}
        >
          Object Cards
        </p>
      </div>

      {/* Card zone */}
      <div className="flex-1 flex items-stretch px-4 sm:px-6 pb-4 sm:pb-6 min-h-0">
        <div className="w-full max-w-md mx-auto flex flex-col">

          {/* Parchment card */}
          <div
            className={`relative flex-1 flex flex-col rounded-sm transition-all duration-200 ${
              isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
            }`}
            style={{
              background: "linear-gradient(160deg, #f5e9ce 0%, #ede0c0 40%, #e8d5a8 100%)",
              boxShadow: "0 8px 40px rgba(0,0,0,0.6), inset 0 0 60px rgba(139,105,20,0.08)",
              border: "1px solid #8B6914",
              outline: "1px solid rgba(139,105,20,0.4)",
              outlineOffset: "-5px",
            }}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Corner flourishes */}
            <CornerFlourish className="absolute top-2 left-2 w-8 h-8" />
            <CornerFlourish className="absolute top-2 right-2 w-8 h-8 scale-x-[-1]" />
            <CornerFlourish className="absolute bottom-2 left-2 w-8 h-8 scale-y-[-1]" />
            <CornerFlourish className="absolute bottom-2 right-2 w-8 h-8 scale-[-1]" />

            {/* Card number badge */}
            {cardIndex !== null && (
              <div
                className="absolute top-4 right-10 text-xs font-[family-name:var(--font-cinzel)] tracking-widest"
                style={{ color: "#8B6914", opacity: 0.5 }}
              >
                {String(cardIndex + 1).padStart(3, "0")}
              </div>
            )}

            {/* Card content */}
            <div className="flex-1 flex flex-col p-7 sm:p-10 justify-center">
              {currentCard ? (
                <div className="flex-1 flex flex-col justify-center">
                  {/* Decorative header rule */}
                  <div className="flex items-center gap-2 mb-6 sm:mb-8">
                    <div className="flex-1 h-px bg-[#8B6914]/30" />
                    <div className="w-1 h-1 rounded-full bg-[#8B6914]/50" />
                    <div className="w-1.5 h-1.5 rotate-45 bg-[#8B6914]/40" />
                    <div className="w-1 h-1 rounded-full bg-[#8B6914]/50" />
                    <div className="flex-1 h-px bg-[#8B6914]/30" />
                  </div>

                  {/* Objects list */}
                  <ol className="space-y-3 sm:space-y-4">
                    {currentCard.objects.map((obj, i) => (
                      <li
                        key={i}
                        className="flex items-baseline gap-3 sm:gap-4"
                      >
                        <span
                          className="shrink-0 text-xs font-[family-name:var(--font-cinzel-decorative)] w-5 text-right"
                          style={{ color: "#8B6914", opacity: 0.7 }}
                        >
                          {i + 1}
                        </span>
                        <span
                          className="text-[clamp(1.4rem,4.5vw,2rem)] font-[family-name:var(--font-cinzel)] leading-tight lowercase"
                          style={{
                            color: "#2C1810",
                            letterSpacing: "0.03em",
                          }}
                        >
                          {obj}
                        </span>
                      </li>
                    ))}
                  </ol>

                  {/* Decorative footer rule */}
                  <div className="flex items-center gap-2 mt-6 sm:mt-8">
                    <div className="flex-1 h-px bg-[#8B6914]/30" />
                    <div className="w-1 h-1 rounded-full bg-[#8B6914]/50" />
                    <div className="w-1.5 h-1.5 rotate-45 bg-[#8B6914]/40" />
                    <div className="w-1 h-1 rounded-full bg-[#8B6914]/50" />
                    <div className="flex-1 h-px bg-[#8B6914]/30" />
                  </div>
                </div>
              ) : (
                /* Empty state */
                <div className="flex-1 flex flex-col items-center justify-center text-center gap-5">
                  <div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{
                      border: "1px solid rgba(139,105,20,0.3)",
                      background: "rgba(139,105,20,0.05)",
                    }}
                  >
                    <span
                      className="text-2xl font-[family-name:var(--font-cinzel-decorative)]"
                      style={{ color: "#8B6914", opacity: 0.7 }}
                    >
                      ✦
                    </span>
                  </div>
                  <p
                    className="font-[family-name:var(--font-cinzel)] text-base sm:text-lg lowercase tracking-wide"
                    style={{ color: "#4A2E0A", opacity: 0.7 }}
                  >
                    draw a card to begin
                  </p>
                </div>
              )}
            </div>

            {/* Next Card button — inside card at bottom */}
            <div className="px-7 sm:px-10 pb-7 sm:pb-10">
              <button
                onClick={nextCard}
                disabled={isAnimating}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-sm transition-all duration-200 disabled:opacity-40"
                style={{
                  border: "1px solid rgba(139,105,20,0.5)",
                  color: "#4A2E0A",
                  background: "rgba(139,105,20,0.07)",
                  fontFamily: "var(--font-cinzel)",
                  fontSize: "clamp(0.75rem, 2.5vw, 0.875rem)",
                  letterSpacing: "0.15em",
                  textTransform: "uppercase",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = "rgba(139,105,20,0.15)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "rgba(139,105,20,0.07)"
                }}
              >
                {isAnimating ? (
                  "..."
                ) : (
                  <>
                    {currentCard ? "next card" : "draw first card"}
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
