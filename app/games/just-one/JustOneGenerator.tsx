"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Shuffle, Eye, EyeOff } from "lucide-react"
import { justOneWords } from "@/data/just-one-words"
import { getRandomItem } from "@/lib/utils/random"
import { ANIMATION_DURATION } from "@/lib/utils/constants"

interface JustOneGeneratorProps {
  onBack: () => void
}

export function JustOneGenerator({ onBack }: JustOneGeneratorProps) {
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
    <div className="h-[100dvh] overflow-hidden bg-gradient-to-br from-purple-50 via-purple-100 to-violet-100 flex flex-col">

      {/* Header row */}
      <div className="shrink-0 h-14 flex items-center px-4 md:px-6 z-50">
        <Button
          onClick={onBack}
          className="bg-white border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white shadow-lg font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Shelf
        </Button>
      </div>

      {/* Title zone — ~25vh */}
      <div className="shrink-0 h-[25dvh] flex items-center justify-center pointer-events-none">
        <div className="relative">
          <h1
            className="font-[family-name:var(--font-dela-gothic)] select-none flex items-baseline"
            style={{ gap: "0.02em" }}
            aria-label="Just One"
          >
            {/* J */}
            <span
              className="text-purple-700 text-[clamp(2.8rem,11vw,5.5rem)] inline-block"
              style={{ transform: "rotate(-8deg) translateY(2px)", textShadow: "2px 3px 0px rgba(139, 92, 246, 0.25)" }}
            >J</span>
            {/* U */}
            <span
              className="text-purple-600 text-[clamp(2.5rem,10vw,5rem)] inline-block"
              style={{ transform: "rotate(3deg) translateY(-3px)", textShadow: "2px 3px 0px rgba(139, 92, 246, 0.25)" }}
            >U</span>
            {/* S */}
            <span
              className="text-purple-800 text-[clamp(2.2rem,9vw,4.5rem)] inline-block"
              style={{ transform: "rotate(-5deg) translateY(4px)", textShadow: "2px 3px 0px rgba(139, 92, 246, 0.25)" }}
            >S</span>
            {/* T */}
            <span
              className="text-purple-600 text-[clamp(2.9rem,11.5vw,5.8rem)] inline-block"
              style={{ transform: "rotate(6deg) translateY(-1px)", textShadow: "2px 3px 0px rgba(139, 92, 246, 0.25)" }}
            >T</span>

            {/* space */}
            <span className="inline-block w-[0.3em]" />

            {/* O */}
            <span
              className="text-purple-700 text-[clamp(3rem,12vw,6rem)] inline-block"
              style={{ transform: "rotate(-4deg) translateY(3px)", textShadow: "3px 3px 0px rgba(139, 92, 246, 0.25)" }}
            >O</span>
            {/* N */}
            <span
              className="text-purple-600 text-[clamp(2.6rem,10.5vw,5.2rem)] inline-block"
              style={{ transform: "rotate(7deg) translateY(-2px)", textShadow: "2px 3px 0px rgba(139, 92, 246, 0.25)" }}
            >N</span>
            {/* E */}
            <span
              className="text-purple-800 text-[clamp(2.4rem,9.5vw,4.8rem)] inline-block"
              style={{ transform: "rotate(-6deg) translateY(5px)", textShadow: "2px 3px 0px rgba(139, 92, 246, 0.25)" }}
            >E</span>
          </h1>
        </div>
      </div>

      {/* Card zone — fills remaining space */}
      <div className="flex-1 flex items-stretch px-4 sm:px-6 pb-4 sm:pb-6 min-h-0">
        <div className="w-full max-w-lg mx-auto flex flex-col">
          {/* Main card */}
          <div
            className={`bg-white rounded-2xl shadow-[0_20px_60px_-15px_rgba(139,92,246,0.5)] border-4 border-purple-500 transition-all duration-300 flex-1 flex flex-col ${
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
                          className="w-full bg-purple-500 hover:bg-purple-600 text-white rounded-xl py-12 sm:py-20 transition-all duration-200 group shadow-lg hover:shadow-xl"
                        >
                          <Eye className="w-10 h-10 sm:w-16 sm:h-16 mx-auto mb-3 group-hover:scale-110 transition-transform" />
                          <p className="text-lg sm:text-2xl font-semibold">Tap to Reveal Word</p>
                          <p className="text-sm text-purple-100 mt-1">One player only</p>
                        </button>
                      )}

                      {isRevealed && (
                        <div className="w-full bg-purple-500 text-white rounded-xl py-12 sm:py-20 shadow-lg">
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
                        className="w-full h-11 border-2 border-purple-500 text-purple-700 hover:bg-purple-50 font-medium rounded-lg"
                      >
                        <EyeOff className="mr-2 h-5 w-5" />
                        Hide Word
                      </Button>
                    )}
                    <Button
                      onClick={generateRandomWord}
                      disabled={isAnimating}
                      className="w-full h-12 sm:h-14 bg-purple-600 hover:bg-purple-700 text-white shadow-lg font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 text-base sm:text-lg"
                    >
                      <Shuffle className={`mr-2 h-5 w-5 transition-transform ${isAnimating ? "animate-spin" : ""}`} />
                      {isAnimating ? "Getting New Word..." : "Next Word"}
                    </Button>
                  </div>
                </div>
              ) : (
                // Empty state
                <div className="flex-1 flex flex-col items-center justify-center text-purple-900">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                    <Shuffle className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600" />
                  </div>
                  <p className="text-2xl sm:text-3xl font-semibold mb-3 text-center">Ready to Play?</p>
                  <p className="text-sm sm:text-base text-purple-700 text-center max-w-sm mb-8 px-4">
                    Generate a mystery word. One player tries to guess it using clues from others!
                  </p>
                  <Button
                    onClick={generateRandomWord}
                    disabled={isAnimating}
                    className="w-full h-12 sm:h-14 bg-purple-600 hover:bg-purple-700 text-white shadow-lg font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 text-base sm:text-lg"
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
