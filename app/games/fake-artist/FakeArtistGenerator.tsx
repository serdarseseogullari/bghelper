"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Eye, EyeOff, Shuffle } from "lucide-react"
import { fakeArtistPrompts, type FakeArtistPrompt } from "@/data/fake-artist-prompts"
import { getRandomItem } from "@/lib/utils/random"
import { ANIMATION_DURATION } from "@/lib/utils/constants"

export function FakeArtistGenerator() {
  const [currentPrompt, setCurrentPrompt] = useState<FakeArtistPrompt | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isPromptHidden, setIsPromptHidden] = useState(true)

  const generateRandomPrompt = () => {
    setIsAnimating(true)
    setIsPromptHidden(true)
    setTimeout(() => {
      const newPrompt = getRandomItem(fakeArtistPrompts, currentPrompt || undefined)
      setCurrentPrompt(newPrompt)
      setIsAnimating(false)
    }, ANIMATION_DURATION)
  }

  return (
    <div className="h-[100dvh] overflow-hidden bg-[#D21B7F] font-[family-name:var(--font-roboto)] flex flex-col">

      {/* Header row */}
      <div className="shrink-0 h-14 flex items-center px-4 md:px-6 z-50">
        <Button asChild
          className="bg-[#FBF332] border-2 border-[#D21B7F] text-[#D21B7F] hover:bg-[#e8b800] hover:border-[#D21B7F] shadow-lg font-bold transition-colors"
        >
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shelf
          </Link>
        </Button>
      </div>

      {/* Title zone — ~28vh, clipped so rotation stays contained */}
      <div className="shrink-0 h-[28dvh] flex items-center justify-center pointer-events-none overflow-hidden">
        <div className="relative">
          {/* Decorative lines */}
          <div
            className="absolute -top-8 left-1/2 w-32 sm:w-40 h-0.5 bg-[#FBF332]/40"
            style={{ transform: "translateX(-50%) rotate(-22.5deg)" }}
          />
          <div
            className="absolute -top-5 left-1/2 w-40 sm:w-48 h-0.5 bg-[#FBF332]/30"
            style={{ transform: "translateX(-50%) rotate(-22.5deg)" }}
          />

          <h1
            className="text-[#FBF332] font-bold uppercase font-[family-name:var(--font-macondo)] select-none text-center text-[clamp(1.6rem,7vw,4rem)] leading-[1.1]"
            style={{
              transform: "rotate(-12deg)",
              textShadow: "3px 3px 0px rgba(0,0,0,1)",
              letterSpacing: "0.05em",
            }}
          >
            A FAKE ARTIST
            <br />
            GOES TO NEW YORK
          </h1>

          <div
            className="absolute -bottom-5 left-1/2 w-40 sm:w-48 h-0.5 bg-[#FBF332]/30"
            style={{ transform: "translateX(-50%) rotate(-22.5deg)" }}
          />
          <div
            className="absolute -bottom-8 left-1/2 w-32 sm:w-40 h-0.5 bg-[#FBF332]/40"
            style={{ transform: "translateX(-50%) rotate(-22.5deg)" }}
          />

          {/* Art Deco corner ornaments — sm+ only */}
          <div
            className="hidden sm:block absolute -left-20 top-1/2 w-8 h-8 border-2 border-[#FBF332]/30"
            style={{ transform: "translateY(-50%) rotate(45deg)" }}
          />
          <div
            className="hidden sm:block absolute -right-20 top-1/2 w-8 h-8 border-2 border-[#FBF332]/30"
            style={{ transform: "translateY(-50%) rotate(45deg)" }}
          />
        </div>
      </div>

      {/* Card zone — fills remaining space */}
      <div className="flex-1 flex items-stretch px-4 sm:px-6 pb-4 sm:pb-6 min-h-0">
        <div className="w-full max-w-md mx-auto flex flex-col">
          <div className="bg-[#D21B7F]/90 backdrop-blur-sm rounded-2xl border-2 border-[#FBF332]/30 shadow-2xl flex-1 flex flex-col">
            <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
              {currentPrompt ? (
                <div
                  className={`transition-all duration-300 flex-1 flex flex-col justify-between ${isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"}`}
                >
                  <div>
                    <div className="mb-6">
                      <div className="text-[#FBF332] text-xs font-medium mb-2 uppercase tracking-wide">
                        Category
                      </div>
                      <h2 className="text-[clamp(2rem,8vw,3.5rem)] font-bold text-[#FBF332] uppercase font-[family-name:var(--font-macondo)] leading-tight">
                        {currentPrompt.category}
                      </h2>
                    </div>

                    <div className="mb-6">
                      <div className="text-[#FBF332] text-xs font-medium mb-2 uppercase tracking-wide">
                        Prompt
                      </div>
                      {isPromptHidden ? (
                        <div className="text-[#FBF332] text-[clamp(2rem,8vw,3.5rem)] font-bold opacity-30 uppercase tracking-widest font-[family-name:var(--font-macondo)]">
                          *****
                        </div>
                      ) : (
                        <h3 className="text-[clamp(2rem,8vw,3.5rem)] font-bold text-[#FBF332] uppercase font-[family-name:var(--font-macondo)] leading-tight">
                          {currentPrompt.prompt}
                        </h3>
                      )}
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Button
                      onClick={() => setIsPromptHidden(!isPromptHidden)}
                      variant="outline"
                      className="w-full h-11 bg-transparent border-2 border-[#FBF332] text-[#FBF332] hover:bg-[#FBF332]/10 shadow-lg font-bold rounded-xl transition-all duration-200 text-sm uppercase"
                    >
                      {isPromptHidden ? (
                        <><Eye className="mr-2 h-4 w-4" />Show Prompt</>
                      ) : (
                        <><EyeOff className="mr-2 h-4 w-4" />Hide Prompt</>
                      )}
                    </Button>
                    <Button
                      onClick={generateRandomPrompt}
                      disabled={isAnimating}
                      variant="outline"
                      className="w-full h-11 bg-transparent border-2 border-[#FBF332] text-[#FBF332] hover:bg-[#FBF332]/10 shadow-lg font-bold rounded-xl transition-all duration-200 disabled:opacity-50 text-sm uppercase"
                    >
                      <Shuffle className={`mr-2 h-4 w-4 transition-transform ${isAnimating ? "animate-spin" : ""}`} />
                      {isAnimating ? "Generating..." : "New Prompt"}
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex-1 flex flex-col items-center justify-center text-[#FBF332]">
                    <div className="w-14 h-14 border-2 border-[#FBF332] rounded-full flex items-center justify-center mb-4">
                      <Shuffle className="w-7 h-7 text-[#FBF332]" />
                    </div>
                    <p className="text-base font-bold uppercase">Generate your first prompt</p>
                  </div>

                  <Button
                    onClick={generateRandomPrompt}
                    disabled={isAnimating}
                    variant="outline"
                    className="w-full h-11 bg-transparent border-2 border-[#FBF332] text-[#FBF332] hover:bg-[#FBF332]/10 shadow-lg font-bold rounded-xl transition-all duration-200 disabled:opacity-50 text-sm uppercase"
                  >
                    <Shuffle className={`mr-2 h-4 w-4 transition-transform ${isAnimating ? "animate-spin" : ""}`} />
                    {isAnimating ? "Generating..." : "Generate"}
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
