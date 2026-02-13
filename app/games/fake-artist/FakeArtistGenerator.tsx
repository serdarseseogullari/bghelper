"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Eye, EyeOff, Shuffle } from "lucide-react"
import { fakeArtistPrompts, type FakeArtistPrompt } from "@/data/fake-artist-prompts"
import { getRandomItem } from "@/lib/utils/random"
import { ANIMATION_DURATION } from "@/lib/utils/constants"

interface FakeArtistGeneratorProps {
  onBack: () => void
}

export function FakeArtistGenerator({ onBack }: FakeArtistGeneratorProps) {
  const [currentPrompt, setCurrentPrompt] = useState<FakeArtistPrompt | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isPromptHidden, setIsPromptHidden] = useState(true) // Hidden by default

  const generateRandomPrompt = () => {
    setIsAnimating(true)
    setIsPromptHidden(true) // Always hide when generating new
    setTimeout(() => {
      const newPrompt = getRandomItem(fakeArtistPrompts, currentPrompt || undefined)
      setCurrentPrompt(newPrompt)
      setIsAnimating(false)
    }, ANIMATION_DURATION)
  }

  return (
    <div className="min-h-screen bg-[#D21B7F] font-[family-name:var(--font-roboto)] relative overflow-hidden">
      {/* Back button - minimal, corner */}
      <div className="absolute top-4 left-4 md:top-6 md:left-6 z-50">
        <Button
          onClick={onBack}
          variant="outline"
          className="bg-[#FBF332] border-2 border-[#D21B7F] text-[#D21B7F] hover:bg-[#D21B7F] hover:text-[#FBF332] shadow-lg font-bold transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Shelf
        </Button>
      </div>

      {/* Art Deco Title - Above the card */}
      <div className="absolute top-24 sm:top-28 md:top-32 left-1/2 -translate-x-1/2 pointer-events-none z-0">
        <div className="relative">
          {/* Decorative top lines - Art Deco style */}
          <div
            className="absolute -top-8 sm:-top-10 left-1/2 -translate-x-1/2 w-32 sm:w-40 h-0.5 bg-[#FBF332]/40"
            style={{ transform: "translateX(-50%) rotate(-22.5deg)" }}
          />
          <div
            className="absolute -top-5 sm:-top-6 left-1/2 -translate-x-1/2 w-40 sm:w-48 h-0.5 bg-[#FBF332]/30"
            style={{ transform: "translateX(-50%) rotate(-22.5deg)" }}
          />

          {/* Main title with vintage flat drop shadow */}
          <h1
            className="text-[#FBF332] font-bold uppercase tracking-[0.05em] font-[family-name:var(--font-macondo)] text-[48px] sm:text-[64px] md:text-6xl lg:text-7xl whitespace-nowrap select-none"
            style={{
              transform: "rotate(-15deg)",
              textShadow: "4px 4px 0px rgba(0, 0, 0, 0.4)",
              letterSpacing: "0.05em",
            }}
          >
            A FAKE ARTIST
            <br />
            GOES TO NEW YORK
          </h1>

          {/* Decorative bottom lines - Art Deco style */}
          <div
            className="absolute -bottom-5 sm:-bottom-6 left-1/2 -translate-x-1/2 w-40 sm:w-48 h-0.5 bg-[#FBF332]/30"
            style={{ transform: "translateX(-50%) rotate(-22.5deg)" }}
          />
          <div
            className="absolute -bottom-8 sm:-bottom-10 left-1/2 -translate-x-1/2 w-32 sm:w-40 h-0.5 bg-[#FBF332]/40"
            style={{ transform: "translateX(-50%) rotate(-22.5deg)" }}
          />

          {/* Art Deco corner ornaments */}
          <div
            className="absolute -left-16 sm:-left-20 top-1/2 w-8 h-8 border-2 border-[#FBF332]/30"
            style={{ transform: "translateY(-50%) rotate(45deg)" }}
          />
          <div
            className="absolute -right-16 sm:-right-20 top-1/2 w-8 h-8 border-2 border-[#FBF332]/30"
            style={{ transform: "translateY(-50%) rotate(45deg)" }}
          />
        </div>
      </div>

      <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 pt-48 sm:pt-56 md:pt-64 relative z-10">
        <div className="w-full max-w-md">
          <div className="bg-[#D21B7F]/90 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border-2 border-[#FBF332]/30 shadow-2xl">
            <div className="min-h-[320px] flex flex-col justify-between">
              {currentPrompt ? (
                <div
                  className={`transition-all duration-300 ${isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
                >
                  <div className="mb-8">
                    <div className="text-[#FBF332] text-xs sm:text-sm font-medium mb-3 uppercase tracking-wide">
                      Category
                    </div>
                    <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#FBF332] uppercase font-[family-name:var(--font-macondo)] leading-tight">
                      {currentPrompt.category}
                    </h2>
                  </div>

                  <div className="mb-8">
                    <div className="text-[#FBF332] text-xs sm:text-sm font-medium mb-3 uppercase tracking-wide">
                      Prompt
                    </div>
                    {isPromptHidden ? (
                      <div className="text-[#FBF332] text-4xl sm:text-5xl md:text-6xl font-bold opacity-30 uppercase tracking-widest font-[family-name:var(--font-macondo)]">
                        *****
                      </div>
                    ) : (
                      <h3 className="text-4xl sm:text-5xl md:text-6xl font-bold text-[#FBF332] uppercase font-[family-name:var(--font-macondo)] leading-tight">
                        {currentPrompt.prompt}
                      </h3>
                    )}
                  </div>

                  <div className="flex gap-3 mb-4">
                    <Button
                      onClick={() => setIsPromptHidden(!isPromptHidden)}
                      variant="outline"
                      className="flex-1 h-11 sm:h-12 bg-transparent border-2 border-[#FBF332] text-[#FBF332] hover:bg-[#FBF332]/10 shadow-lg font-bold rounded-xl transition-all duration-200 text-sm sm:text-base uppercase"
                    >
                      {isPromptHidden ? (
                        <>
                          <Eye className="mr-2 h-4 w-4" />
                          Show Prompt
                        </>
                      ) : (
                        <>
                          <EyeOff className="mr-2 h-4 w-4" />
                          Hide Prompt
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-[#FBF332] flex-1 flex flex-col justify-center mb-6">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 border-2 border-[#FBF332] rounded-full flex items-center justify-center mb-4 mx-auto">
                    <Shuffle className="w-7 h-7 sm:w-8 sm:h-8 text-[#FBF332]" />
                  </div>
                  <p className="text-base sm:text-lg font-bold uppercase">Generate your first prompt</p>
                </div>
              )}

              <Button
                onClick={generateRandomPrompt}
                disabled={isAnimating}
                variant="outline"
                className="w-full h-11 sm:h-12 bg-transparent border-2 border-[#FBF332] text-[#FBF332] hover:bg-[#FBF332]/10 shadow-lg font-bold rounded-xl transition-all duration-200 disabled:opacity-50 text-sm sm:text-base uppercase"
              >
                <Shuffle className={`mr-2 h-4 w-4 transition-transform ${isAnimating ? "animate-spin" : ""}`} />
                {isAnimating ? "Generating..." : currentPrompt ? "New Prompt" : "Generate"}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
