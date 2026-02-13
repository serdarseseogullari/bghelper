"use client"

import { useState } from "react"
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

  const generateRandomWord = () => {
    setIsAnimating(true)
    setIsRevealed(false)

    setTimeout(() => {
      try {
        const newWord = getRandomItem([...justOneWords], currentWord)
        setCurrentWord(newWord)
      } catch (error) {
        console.error("Error generating word:", error)
        // Fallback to first word if something goes wrong
        setCurrentWord(justOneWords[0])
      } finally {
        setIsAnimating(false)
      }
    }, ANIMATION_DURATION)
  }

  const toggleReveal = () => {
    setIsRevealed(!isRevealed)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-purple-100 to-violet-100">
      {/* Header - Back button only */}
      <div className="absolute top-4 left-4 md:top-6 md:left-6 z-50">
        <Button
          onClick={onBack}
          variant="outline"
          className="bg-white border-2 border-purple-600 text-purple-600 hover:bg-purple-600 hover:text-white shadow-lg font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Shelf
        </Button>
      </div>

      {/* Just One Logo - Brush style, positioned above content */}
      <div className="absolute top-20 sm:top-24 md:top-28 left-1/2 -translate-x-1/2 pointer-events-none z-0">
        <div className="relative">
          <h1
            className="text-purple-600 font-[family-name:var(--font-permanent-marker)] text-6xl sm:text-7xl md:text-8xl lg:text-9xl whitespace-nowrap select-none"
            style={{
              transform: "rotate(-3deg)",
              textShadow: "3px 3px 0px rgba(139, 92, 246, 0.2)",
            }}
          >
            Just One
          </h1>

          {/* Underline accent */}
          <div
            className="absolute -bottom-3 sm:-bottom-4 left-0 right-0 h-1 sm:h-1.5 bg-purple-400/40 rounded-full"
            style={{ transform: "rotate(-1deg)" }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 pt-48 sm:pt-56 md:pt-64 pb-8">
        <div className="w-full max-w-lg">
          {/* Main card - clean purple minimalist design */}
          <div
            className={`bg-white rounded-2xl shadow-2xl border-4 border-purple-500 transition-all duration-300 ${
              isAnimating ? "scale-95 opacity-90" : "scale-100 opacity-100"
            }`}
          >
            <div className="p-8 sm:p-12">
              <div className="min-h-[400px] sm:min-h-[450px] flex flex-col">
                {currentWord ? (
                  <div
                    className={`transition-all duration-300 flex-1 flex flex-col ${
                      isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
                    }`}
                  >
                    {/* Word Display Area */}
                    <div className="flex-1 flex items-center justify-center">
                      <div className="relative w-full">
                        {/* Hidden state - tap to reveal */}
                        {!isRevealed && (
                          <button
                            onClick={toggleReveal}
                            className="w-full bg-purple-500 hover:bg-purple-600 text-white rounded-xl py-16 sm:py-20 transition-all duration-200 group shadow-lg hover:shadow-xl"
                          >
                            <Eye className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 group-hover:scale-110 transition-transform" />
                            <p className="text-xl sm:text-2xl font-semibold">Tap to Reveal Word</p>
                            <p className="text-sm sm:text-base text-purple-100 mt-2">One player only</p>
                          </button>
                        )}

                        {/* Revealed state - show word */}
                        {isRevealed && (
                          <div className="w-full bg-purple-500 text-white rounded-xl py-16 sm:py-20 shadow-lg">
                            <div className="text-center px-6">
                              <h2 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight break-words">
                                {currentWord}
                              </h2>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-col gap-3 mt-8">
                      {isRevealed && (
                        <Button
                          onClick={toggleReveal}
                          variant="outline"
                          className="w-full h-12 border-2 border-purple-500 text-purple-700 hover:bg-purple-50 font-medium rounded-lg"
                        >
                          <EyeOff className="mr-2 h-5 w-5" />
                          Hide Word
                        </Button>
                      )}
                      <Button
                        onClick={generateRandomWord}
                        disabled={isAnimating}
                        className="w-full h-14 sm:h-16 bg-purple-600 hover:bg-purple-700 text-white shadow-lg font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 text-base sm:text-lg"
                      >
                        <Shuffle className={`mr-2 h-5 w-5 transition-transform ${isAnimating ? "animate-spin" : ""}`} />
                        {isAnimating ? "Getting New Word..." : "Next Word"}
                      </Button>
                    </div>
                  </div>
                ) : (
                  // Empty state
                  <div className="flex-1 flex flex-col items-center justify-center text-purple-900">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-purple-100 rounded-full flex items-center justify-center mb-6">
                      <Shuffle className="w-10 h-10 sm:w-12 sm:h-12 text-purple-600" />
                    </div>
                    <p className="text-2xl sm:text-3xl font-semibold mb-3 text-center">Ready to Play?</p>
                    <p className="text-sm sm:text-base text-purple-700 text-center max-w-sm mb-8 px-4">
                      Generate a word for one player to see. Everyone else gives one-word clues!
                    </p>
                    <Button
                      onClick={generateRandomWord}
                      disabled={isAnimating}
                      className="w-full h-14 sm:h-16 bg-purple-600 hover:bg-purple-700 text-white shadow-lg font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 text-base sm:text-lg"
                    >
                      <Shuffle className={`mr-2 h-5 w-5 transition-transform ${isAnimating ? "animate-spin" : ""}`} />
                      Generate Word
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Helper text */}
          <div className="mt-6 text-center text-sm text-purple-700 px-4">
            <p className="font-medium mb-1">How to Play:</p>
            <p className="text-purple-600">
              One player sees the word. Others write one-word clues. Duplicates cancel out!
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
