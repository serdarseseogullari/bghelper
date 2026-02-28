"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Shuffle, Languages } from "lucide-react"
import { itoCategories, type ItoCategory } from "@/data/ito-categories"
import { itoCategoriesTR } from "@/data/ito-categories-tr"
import { getRandomItem } from "@/lib/utils/random"
import { ANIMATION_DURATION } from "@/lib/utils/constants"

type Language = "en" | "tr"

interface ItoGeneratorProps {
  onBack: () => void
}

export function ItoGenerator({ onBack }: ItoGeneratorProps) {
  const [currentCategory, setCurrentCategory] = useState<ItoCategory | null>(null)
  const [currentIndex, setCurrentIndex] = useState<number | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [language, setLanguage] = useState<Language>("en")
  const [touchStart, setTouchStart] = useState(0)
  const [touchEnd, setTouchEnd] = useState(0)

  const generateRandomCategory = () => {
    setIsAnimating(true)
    setTimeout(() => {
      try {
        const categories = language === "tr" ? itoCategoriesTR : itoCategories
        let newIndex: number

        // Make sure we don't get the same index twice in a row
        do {
          newIndex = Math.floor(Math.random() * categories.length)
        } while (newIndex === currentIndex && categories.length > 1)

        setCurrentIndex(newIndex)
        setCurrentCategory(categories[newIndex])
      } catch (error) {
        console.error("Error generating category:", error)
        // Fallback to first category if something goes wrong
        const fallbackCategories = language === "tr" ? itoCategoriesTR : itoCategories
        setCurrentIndex(0)
        setCurrentCategory(fallbackCategories[0])
      } finally {
        setIsAnimating(false)
      }
    }, ANIMATION_DURATION)
  }

  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(0)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if ((isLeftSwipe || isRightSwipe) && !isAnimating) {
      generateRandomCategory()
    }
  }

  const toggleLanguage = () => {
    try {
      const newLang = language === "en" ? "tr" : "en"
      setLanguage(newLang)

      // Keep the same category by index, just switch language
      if (currentIndex !== null) {
        const newCategories = newLang === "tr" ? itoCategoriesTR : itoCategories
        // Use the same index, or fallback to last if out of bounds
        const safeIndex = currentIndex < newCategories.length ? currentIndex : newCategories.length - 1
        setCurrentCategory(newCategories[safeIndex])
      }
    } catch (error) {
      console.error("Error switching language:", error)
      // Fallback to first category of new language
      const newLang = language === "en" ? "tr" : "en"
      const fallbackCategories = newLang === "tr" ? itoCategoriesTR : itoCategories
      setCurrentIndex(0)
      setCurrentCategory(fallbackCategories[0])
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 font-ito">
      {/* Header - Back button and Language switcher */}
      <div className="absolute top-4 left-4 md:top-6 md:left-6 right-4 md:right-6 z-50 flex items-center justify-between">
        <Button
          onClick={onBack}
          variant="outline"
          className="bg-white border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white shadow-lg font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Shelf
        </Button>

        {/* Language Switcher */}
        <Button
          onClick={toggleLanguage}
          variant="outline"
          className="bg-white border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white shadow-lg font-medium transition-colors"
        >
          <Languages className="w-4 h-4 mr-2" />
          {language === "tr" ? "EN" : "TR"}
        </Button>
      </div>

      {/* ito Logo - Geometric, minimalist */}
      <div className="absolute top-20 sm:top-24 md:top-28 left-1/2 -translate-x-1/2 pointer-events-none z-0">
        <div className="relative flex items-center justify-center">
          {/* Geometric circles accent - like the ito game design */}
          <div className="absolute -left-16 sm:-left-20 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full border-3 border-gray-800/20" />
          <div className="absolute -right-16 sm:-right-20 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full border-3 border-gray-800/20" />

          <h1
            className="text-gray-900 font-[family-name:var(--font-space-grotesk)] text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] font-light tracking-wider select-none"
            style={{
              letterSpacing: "0.15em",
            }}
          >
            ito
          </h1>

          {/* Minimalist underline */}
          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 sm:w-32 h-0.5 bg-gray-800/30" />
        </div>

        {/* Subtitle */}
        <p className="text-center text-gray-600 text-xs sm:text-sm mt-6 tracking-widest font-[family-name:var(--font-space-grotesk)] font-light">
          {language === "tr" ? "" : ""}
        </p>
      </div>

      {/* Main Content */}
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 pt-52 sm:pt-60 md:pt-72 pb-8">
        <div className="relative w-full max-w-md">
          {/* Stacked cards effect - background cards */}
          <div className="absolute inset-0 bg-yellow-400/60 rounded-lg shadow-lg transform rotate-2 translate-x-2 translate-y-2 scale-[0.98]" />
          <div className="absolute inset-0 bg-yellow-400/80 rounded-lg shadow-xl transform rotate-1 translate-x-1 translate-y-1 scale-[0.99]" />

          {/* Main card - clean yellow like real ITO game cards */}
          <div
            className={`relative bg-yellow-400 rounded-lg shadow-2xl transition-all duration-300 ${
              isAnimating ? "scale-95 opacity-90" : "scale-100 rotate-0 opacity-100"
            }`}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Card content */}
            <div className="relative p-10 sm:p-14">
              <div className="min-h-[500px] sm:min-h-[550px] flex flex-col">
                {currentCategory ? (
                  <div
                    className={`transition-all duration-300 flex-1 flex flex-col justify-between ${
                      isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
                    }`}
                  >
                    {/* Category Text - large and centered */}
                    <div className="flex-1 flex items-center justify-center">
                      <h2 className="text-3xl sm:text-4xl md:text-5xl font-medium text-gray-900 text-center leading-tight px-4">
                        {currentCategory.text}
                      </h2>
                    </div>

                    {/* Spectrum - simple like real cards */}
                    <div className="space-y-8 mt-auto">
                      {/* Simple horizontal line with dots */}
                      <div className="relative py-4">
                        <div className="h-0.5 bg-gray-900" />
                        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-3 h-3 bg-gray-900 rounded-full" />
                        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-3 h-3 bg-gray-900 rounded-full" />
                      </div>

                      {/* Labels below the line */}
                      <div className="flex items-center justify-between text-gray-900">
                        <div className="text-left">
                          <div className="text-3xl sm:text-4xl font-medium mb-2">1</div>
                          <div className="text-base sm:text-lg">{currentCategory.lowLabel}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl sm:text-4xl font-medium mb-2">100</div>
                          <div className="text-base sm:text-lg">{currentCategory.highLabel}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Empty state
                  <div className="flex-1 flex flex-col items-center justify-center text-gray-900">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-900/10 rounded-full flex items-center justify-center mb-6">
                      <Shuffle className="w-10 h-10 sm:w-12 sm:h-12 text-gray-900" />
                    </div>
                    <p className="text-xl sm:text-2xl font-medium mb-2">
                      {language === "tr" ? "Oynamaya hazır mısın?" : "Ready to play?"}
                    </p>
                    <p className="text-sm sm:text-base text-gray-800 text-center max-w-xs">
                      {language === "tr"
                        ? "Kategori üret ve 1-100 arası sayını seç"
                        : "Generate a theme category to help describe your secret numbers"}
                    </p>
                  </div>
                )}

                {/* Generate button */}
                <Button
                  onClick={generateRandomCategory}
                  disabled={isAnimating}
                  className="w-full h-14 sm:h-16 bg-gray-900 hover:bg-gray-800 text-white shadow-xl font-medium rounded-lg transition-all duration-200 disabled:opacity-50 text-base sm:text-lg mt-8"
                >
                  <Shuffle className={`mr-2 h-5 w-5 transition-transform ${isAnimating ? "animate-spin" : ""}`} />
                  {language === "tr"
                    ? isAnimating
                      ? "Karıştırılıyor..."
                      : currentCategory
                        ? "Yeni Kategori"
                        : "Kategori Üret"
                    : isAnimating
                      ? "Shuffling..."
                      : currentCategory
                        ? "New Category"
                        : "Generate Category"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
