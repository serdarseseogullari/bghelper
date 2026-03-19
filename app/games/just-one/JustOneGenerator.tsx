"use client"

import { useState, useRef, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Shuffle, Eye, EyeOff } from "lucide-react"
import { justOneWords } from "@/data/just-one-words"
import { getRandomItem } from "@/lib/utils/random"
import { ANIMATION_DURATION } from "@/lib/utils/constants"

interface JustOneGeneratorProps {
  onBack: () => void
}

const TITLE_LETTERS = ["J", "U", "S", "T", null, "O", "N", "E"]
const WDTH_VALUES = [85, 105, 90, 75, 0, 110, 80, 100]

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min)
}

export function JustOneGenerator({ onBack }: JustOneGeneratorProps) {
  const letterStyles = useMemo(() =>
    TITLE_LETTERS.map((letter, i) => {
      if (!letter) return null
      return {
        scale: randomBetween(0.85, 1.05),
        rotate: randomBetween(-2.5, 2.5),
        translateY: randomBetween(-2, 2),
        wdth: WDTH_VALUES[i],
      }
    }), [])

  const [currentWord, setCurrentWord] = useState<string | null>(null)
  const [isRevealed, setIsRevealed] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const touchStart = useRef<number | null>(null)
  const touchEnd = useRef<number | null>(null)

  const generateRandomWord = () => {
    setIsAnimating(true)
    setIsRevealed(false)

    setTimeout(() => {
      try {
        const newWord = getRandomItem([...justOneWords], currentWord)
        setCurrentWord(newWord)
      } catch (error) {
        console.error("Error generating word:", error)
        setCurrentWord(justOneWords[0])
      } finally {
        setIsAnimating(false)
      }
    }, ANIMATION_DURATION)
  }

  const toggleReveal = () => {
    setIsRevealed(!isRevealed)
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

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStart.current === null || touchEnd.current === null) return

    const distance = touchStart.current - touchEnd.current
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe || isRightSwipe) {
      e.stopPropagation()
      if (!isAnimating) generateRandomWord()
    }
  }

  return (
    <div className="h-[100dvh] overflow-hidden flex flex-col" style={{ background: "linear-gradient(135deg, #7c3aed 0%, #6d28d9 50%, #5b21b6 100%)" }}>

      {/* Header row */}
      <div className="shrink-0 h-14 flex items-center px-4 md:px-6 z-50">
        <Button
          onClick={onBack}
          className="bg-white/10 border-2 border-white/30 text-white hover:bg-white/20 shadow-lg font-medium transition-colors backdrop-blur-sm"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Shelf
        </Button>
      </div>

      {/* Title zone — ~25vh */}
      <div className="shrink-0 h-[25dvh] flex items-center justify-center pointer-events-none">
        <div className="relative">
          <h1
            className="font-[family-name:var(--font-anybody)] select-none flex items-baseline uppercase text-white text-[clamp(3rem,12vw,6rem)]"
            style={{ gap: "clamp(0.05rem, 0.3vw, 0.15rem)" }}
            aria-label="Just One"
          >
            {TITLE_LETTERS.map((letter, i) => {
              if (!letter) return <span key={i} className="inline-block w-[0.25em]" />
              const s = letterStyles[i]!
              return (
                <span
                  key={i}
                  className="inline-block"
                  style={{
                    fontSize: `${s.scale}em`,
                    fontVariationSettings: `'wght' 800, 'wdth' ${s.wdth}`,
                    transform: `rotate(${s.rotate}deg) translateY(${s.translateY}px)`,
                  }}
                >{letter}</span>
              )
            })}
          </h1>
        </div>
      </div>

      {/* Card zone — fills remaining space */}
      <div className="flex-1 flex items-stretch px-4 sm:px-6 pb-4 sm:pb-6 min-h-0">
        <div className="w-full max-w-lg mx-auto flex flex-col">
          {/* Main card */}
          <div
            className={`bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(0,0,0,0.4)] border-4 border-white/20 transition-all duration-300 flex-1 flex flex-col ${
              isAnimating ? "scale-95 opacity-90" : "scale-100 opacity-100"
            }`}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div className="p-6 sm:p-10 flex-1 flex flex-col">
              {currentWord ? (
                <div
                  className={`transition-all duration-300 flex-1 flex flex-col ${
                    isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
                  }`}
                >
                  {/* Word display — grows to fill */}
                  <div className="flex-1 flex items-center justify-center">
                    <div className="relative w-full">
                      {!isRevealed && (
                        <button
                          onClick={toggleReveal}
                          className="w-full rounded-xl py-12 sm:py-20 transition-all duration-200 group shadow-lg hover:shadow-xl text-white"
                          style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}
                        >
                          <Eye className="w-10 h-10 sm:w-16 sm:h-16 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                          <p className="text-lg sm:text-2xl font-semibold">Tap to Reveal Word</p>
                          <p className="text-sm text-white/60 mt-1">One player only</p>
                        </button>
                      )}

                      {isRevealed && (
                        <div className="w-full text-white rounded-xl py-12 sm:py-20 shadow-lg" style={{ background: "linear-gradient(135deg, #7c3aed, #6d28d9)" }}>
                          <div className="text-center px-6">
                            <h2 className="text-[clamp(2.5rem,10vw,5rem)] font-bold tracking-tight break-words">
                              {currentWord}
                            </h2>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="flex flex-col gap-3 mt-6">
                    {isRevealed && (
                      <Button
                        onClick={toggleReveal}
                        variant="outline"
                        className="w-full h-11 border-2 border-[#7c3aed] text-[#7c3aed] hover:bg-[#7c3aed]/10 font-medium rounded-lg"
                      >
                        <EyeOff className="mr-2 h-5 w-5" />
                        Hide Word
                      </Button>
                    )}
                    <Button
                      onClick={generateRandomWord}
                      disabled={isAnimating}
                      className="w-full h-12 sm:h-14 bg-[#7c3aed] hover:bg-[#6d28d9] text-white shadow-lg font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 text-base sm:text-lg"
                    >
                      <Shuffle className={`mr-2 h-5 w-5 transition-transform ${isAnimating ? "animate-spin" : ""}`} />
                      {isAnimating ? "Getting New Word..." : "Next Word"}
                    </Button>
                  </div>
                </div>
              ) : (
                // Empty state
                <div className="flex-1 flex flex-col items-center justify-center text-[#4c1d95]">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#7c3aed]/10 rounded-full flex items-center justify-center mb-4">
                    <Shuffle className="w-8 h-8 sm:w-10 sm:h-10 text-[#7c3aed]" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-semibold mb-3 text-center">Ready to Play?</p>
                  <p className="text-sm sm:text-base text-[#7c3aed]/70 text-center max-w-sm mb-8 px-4">
                    Generate a mystery word. One player tries to guess it using clues from others!
                  </p>
                  <Button
                    onClick={generateRandomWord}
                    disabled={isAnimating}
                    className="w-full h-12 sm:h-14 bg-[#7c3aed] hover:bg-[#6d28d9] text-white shadow-lg font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 text-base sm:text-lg"
                  >
                    <Shuffle className={`mr-2 h-5 w-5 transition-transform ${isAnimating ? "animate-spin" : ""}`} />
                    Generate Word
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
