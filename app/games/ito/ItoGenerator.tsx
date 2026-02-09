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
      {/* Header */}
      <div className="absolute top-4 left-4 md:top-6 md:left-6 right-4 md:right-6 z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            onClick={onBack}
            variant="outline"
            className="bg-white/90 backdrop-blur-sm border-gray-200 text-gray-700 hover:bg-white hover:border-gray-300 shadow-md"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Back to Shelf</span>
            <span className="sm:hidden">Back</span>
          </Button>
          <div className="hidden sm:block">
            <h1 className="text-gray-800 text-xl md:text-2xl font-medium tracking-wide">ito</h1>
            <p className="text-xs text-gray-500">
              {language === "tr" ? "1-100 arası bir sayı seç" : "Pick a number from 1 to 100"}
            </p>
          </div>
        </div>

        {/* Language Switcher */}
        <Button
          onClick={toggleLanguage}
          variant="outline"
          className="bg-white/90 backdrop-blur-sm border-gray-200 text-gray-700 hover:bg-white hover:border-gray-300 shadow-md font-medium"
        >
          <Languages className="w-4 h-4 mr-2" />
          {language === "tr" ? "EN" : "TR"}
        </Button>
      </div>

      {/* Main Content */}
      <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 pt-24 sm:pt-28 pb-8">
        <div className="relative w-full max-w-lg">
          {/* Stacked cards effect - background cards */}
          <div className="absolute inset-0 bg-yellow-300/40 rounded-2xl shadow-lg transform rotate-3 translate-x-3 translate-y-3 scale-[0.97]" />
          <div className="absolute inset-0 bg-yellow-300/60 rounded-2xl shadow-xl transform rotate-1.5 translate-x-1.5 translate-y-1.5 scale-[0.985]" />

          {/* Main card */}
          <div
            className={`relative bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-2xl shadow-2xl transition-all duration-300 ${
              isAnimating ? "scale-95 rotate-2 opacity-90" : "scale-100 rotate-0 opacity-100"
            }`}
          >
            {/* Card texture overlay */}
            <div className="absolute inset-0 rounded-2xl bg-[radial-gradient(circle_at_50%_120%,rgba(255,255,255,0.3),transparent_50%)]" />

            {/* Card content */}
            <div className="relative p-6 sm:p-8">
              <div className="min-h-[400px] sm:min-h-[450px] flex flex-col justify-between">
                {currentCategory ? (
                  <div
                    className={`transition-all duration-300 flex-1 flex flex-col ${
                      isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
                    }`}
                  >
                    {/* Category Badge */}
                    <div className="mb-6 text-center">
                      <div className="inline-block bg-gray-900 text-yellow-400 px-4 py-2 rounded-full text-xs font-medium uppercase tracking-wider shadow-lg">
                        {language === "tr" ? "Kategori" : "Category"}
                      </div>
                    </div>

                    {/* Category Text */}
                    <div className="flex-1 flex items-center justify-center mb-8">
                      <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 sm:p-8 shadow-xl">
                        <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium text-gray-900 text-center leading-tight">
                          {currentCategory.text}
                        </h2>
                      </div>
                    </div>

                    {/* Enhanced Spectrum Visualization */}
                    <div className="space-y-4">
                      {/* Labels */}
                      <div className="flex items-center justify-between px-2">
                        <div className="flex-1 text-left">
                          <div className="text-xs font-semibold text-gray-800/70 uppercase tracking-wide mb-1">Low</div>
                          <div className="text-sm sm:text-base font-medium text-gray-900 bg-white/80 px-3 py-1.5 rounded-lg inline-block">
                            {currentCategory.lowLabel}
                          </div>
                        </div>
                        <div className="flex-1 text-right">
                          <div className="text-xs font-semibold text-gray-800/70 uppercase tracking-wide mb-1">
                            {language === "tr" ? "Yüksek" : "High"}
                          </div>
                          <div className="text-sm sm:text-base font-medium text-gray-900 bg-white/80 px-3 py-1.5 rounded-lg inline-block">
                            {currentCategory.highLabel}
                          </div>
                        </div>
                      </div>

                      {/* Gradient spectrum bar */}
                      <div className="relative">
                        <div className="h-3 bg-gradient-to-r from-gray-300 via-gray-400 to-gray-800 rounded-full shadow-inner" />
                        {/* Tick marks */}
                        <div className="absolute inset-0 flex justify-between items-center px-0.5">
                          {[...Array(9)].map((_, i) => (
                            <div key={i} className="w-0.5 h-5 bg-gray-700/30" />
                          ))}
                        </div>
                      </div>

                      {/* Number indicators */}
                      <div className="flex items-center justify-between">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-gray-900">
                          <span className="text-xl sm:text-2xl font-medium text-gray-900">1</span>
                        </div>
                        <div className="flex-1 mx-4 h-1 bg-gray-900/20 rounded-full" />
                        <div className="w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-gray-900">
                          <span className="text-lg sm:text-xl font-medium text-gray-900">100</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  // Empty state
                  <div className="flex-1 flex flex-col items-center justify-center text-gray-900">
                    <div className="w-20 h-20 sm:w-24 sm:h-24 bg-white/90 rounded-full flex items-center justify-center mb-6 shadow-lg">
                      <Shuffle className="w-10 h-10 sm:w-12 sm:h-12 text-gray-900" />
                    </div>
                    <p className="text-xl sm:text-2xl font-medium mb-2">
                      {language === "tr" ? "Oynamaya hazır mısın?" : "Ready to play?"}
                    </p>
                    <p className="text-sm sm:text-base text-gray-800 text-center max-w-xs">
                      {language === "tr"
                        ? "Kategori üret ve 1-100 arası sayını seç"
                        : "Generate a category and pick your number from 1 to 100"}
                    </p>
                  </div>
                )}

                {/* Generate button */}
                <Button
                  onClick={generateRandomCategory}
                  disabled={isAnimating}
                  className="w-full h-14 sm:h-16 bg-gray-900 hover:bg-gray-800 text-yellow-400 shadow-xl font-medium rounded-xl transition-all duration-200 disabled:opacity-50 text-base sm:text-lg mt-6"
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
