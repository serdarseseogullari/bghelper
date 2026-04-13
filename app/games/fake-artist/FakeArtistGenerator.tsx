"use client"

import { useState, useEffect } from "react"
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
  const [dateMonth, setDateMonth] = useState("")
  const [dateDay, setDateDay] = useState("")

  useEffect(() => {
    const d = new Date()
    setDateMonth(d.toLocaleDateString("en-US", { month: "short" }))
    setDateDay(d.toLocaleDateString("en-US", { day: "numeric" }))
  }, [])

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

      {/* Title zone */}
      <div className="shrink-0 h-[28dvh] flex items-center justify-center pointer-events-none overflow-hidden">
        <div className="relative flex items-center justify-center">
          <div
            className="hidden sm:block absolute -left-20 top-1/2 w-8 h-8 border-2 border-[#FBF332]/30"
            style={{ transform: "translateY(-50%) rotate(45deg)" }}
          />
          <div
            className="hidden sm:block absolute -right-20 top-1/2 w-8 h-8 border-2 border-[#FBF332]/30"
            style={{ transform: "translateY(-50%) rotate(45deg)" }}
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
        </div>
      </div>

      {/* Card zone */}
      <div className="flex-1 flex items-stretch px-4 sm:px-6 pb-4 sm:pb-6 min-h-0">
        <div className="w-full max-w-md mx-auto flex flex-col">
          <div
            className={`relative rounded-xl flex-1 flex flex-col overflow-hidden transition-all duration-200 ${
              isAnimating ? "opacity-0 scale-[0.97]" : "opacity-100 scale-100"
            }`}
            style={{
              backgroundColor: "#fff",
              /* outer black border via box-shadow so it sits outside the card, doesn't eat into content */
              boxShadow: "0 0 0 6px #000000, 0 20px 60px rgba(0,0,0,0.45)",
            }}
          >
            {/* Paper texture overlay */}
            <div
              className="absolute inset-0 pointer-events-none z-10"
              style={{
                backgroundImage: 'url("/textures/paper.png")',
                backgroundRepeat: "repeat",
                opacity: 0.22,
                mixBlendMode: "multiply",
              }}
            />

            {/* Card info header — CSS grid: 2 cols × 3 rows (theme | separator | title), date spans all rows */}
            <div
              className="relative z-20"
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gridTemplateRows: "auto 2px auto",
                borderBottom: "2px solid #D21B7F",
              }}
            >
              {/* Theme row — col 1, row 1 */}
              <div className="px-5 sm:px-7 pt-4 pb-3" style={{ gridArea: "1 / 1" }}>
                <div className="flex items-baseline gap-2">
                  <span
                    className="text-[#D21B7F] text-xs uppercase tracking-widest font-medium shrink-0"
                    style={{ width: "2.8rem" }}
                  >
                    Theme
                  </span>
                  <span className="text-[#D21B7F] font-bold uppercase font-[family-name:var(--font-macondo)] text-base sm:text-lg leading-tight truncate">
                    {currentPrompt?.category ?? "—"}
                  </span>
                </div>
              </div>

              {/* Separator — row 2, left column only (date cell stays merged/clean) */}
              <div style={{ gridArea: "2 / 1 / 3 / 2", background: "#D21B7F" }} />

              {/* Title row — col 1, row 3 */}
              <div className="px-5 sm:px-7 pt-3 pb-4" style={{ gridArea: "3 / 1" }}>
                <div className="flex items-center gap-2">
                  <span
                    className="text-[#D21B7F] text-xs uppercase tracking-widest font-medium shrink-0"
                    style={{ width: "2.8rem" }}
                  >
                    Title
                  </span>
                  {/* Fixed-height container so show/hide never shifts layout */}
                  <div style={{ minHeight: "1.65rem", display: "flex", alignItems: "center" }}>
                    {!currentPrompt ? (
                      <span className="text-[#D21B7F]/25 text-sm">—</span>
                    ) : isPromptHidden ? (
                      <span className="text-[#D21B7F]/40 font-bold font-[family-name:var(--font-macondo)] text-base sm:text-lg tracking-widest">
                        {"*".repeat(Math.min(currentPrompt.prompt.length, 8))}
                      </span>
                    ) : (
                      <span className="text-[#D21B7F] font-bold uppercase font-[family-name:var(--font-macondo)] text-base sm:text-lg leading-tight">
                        {currentPrompt.prompt}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Date — col 2, spans all 3 rows (theme + separator + title) */}
              <div
                style={{
                  gridArea: "1 / 2 / 4 / 3",
                  borderLeft: "2px solid #D21B7F",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 1.1rem",
                  minWidth: "70px",
                }}
              >
                <div className="flex flex-col items-center leading-none gap-0.5">
                  <span className="text-[#D21B7F] text-xs uppercase tracking-widest font-medium">
                    {dateMonth}
                  </span>
                  <span className="text-[#D21B7F] text-4xl font-bold font-[family-name:var(--font-macondo)] leading-none">
                    {dateDay}
                  </span>
                </div>
              </div>
            </div>

            {/* Canvas / action area */}
            <div className="relative z-20 flex-1 flex flex-col items-center justify-center gap-3 p-6 sm:p-8">
              {currentPrompt ? (
                <>
                  <Button
                    onClick={() => setIsPromptHidden(v => !v)}
                    className="w-full max-w-xs h-12 bg-[#D21B7F] hover:bg-[#b81870] text-white font-bold rounded-xl shadow-md transition-colors"
                  >
                    {isPromptHidden
                      ? <><Eye className="mr-2 h-4 w-4" />Show Title</>
                      : <><EyeOff className="mr-2 h-4 w-4" />Hide Title</>
                    }
                  </Button>
                  <Button
                    onClick={generateRandomPrompt}
                    disabled={isAnimating}
                    className="w-full max-w-xs h-12 bg-[#D21B7F] hover:bg-[#b81870] text-white font-bold rounded-xl shadow-md transition-colors disabled:opacity-50"
                  >
                    <Shuffle className={`mr-2 h-4 w-4 ${isAnimating ? "animate-spin" : ""}`} />
                    {isAnimating ? "Generating..." : "New Prompt"}
                  </Button>
                </>
              ) : (
                <Button
                  onClick={generateRandomPrompt}
                  disabled={isAnimating}
                  className="w-full max-w-xs h-12 bg-[#D21B7F] hover:bg-[#b81870] text-white font-bold rounded-xl shadow-md transition-colors disabled:opacity-50"
                >
                  <Shuffle className={`mr-2 h-4 w-4 ${isAnimating ? "animate-spin" : ""}`} />
                  {isAnimating ? "Generating..." : "Generate Prompt"}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
