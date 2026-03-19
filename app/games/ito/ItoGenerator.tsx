"use client"

import { useState, useRef } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Shuffle, Languages } from "lucide-react"
import { itoCategories, type ItoCategory } from "@/data/ito-categories"
import { itoCategoriesTR } from "@/data/ito-categories-tr"
import { getRandomItem } from "@/lib/utils/random"
import { ANIMATION_DURATION } from "@/lib/utils/constants"

type Language = "en" | "tr"

export function ItoGenerator() {
  const [currentCategory, setCurrentCategory] = useState<ItoCategory | null>(null)
  const [currentIndex, setCurrentIndex] = useState<number | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [language, setLanguage] = useState<Language>("en")
  const touchStart = useRef<number | null>(null)
  const touchEnd = useRef<number | null>(null)

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

      if (currentIndex !== null) {
        const newCategories = newLang === "tr" ? itoCategoriesTR : itoCategories
        const safeIndex = currentIndex < newCategories.length ? currentIndex : newCategories.length - 1
        setCurrentCategory(newCategories[safeIndex])
      }
    } catch (error) {
      console.error("Error switching language:", error)
      const newLang = language === "en" ? "tr" : "en"
      const fallbackCategories = newLang === "tr" ? itoCategoriesTR : itoCategories
      setCurrentIndex(0)
      setCurrentCategory(fallbackCategories[0])
    }
  }

  return (
    <div className="h-[100dvh] overflow-hidden bg-gradient-to-br from-amber-50 via-yellow-50 to-orange-50 font-ito flex flex-col">

      {/* Header row */}
      <div className="shrink-0 h-14 flex items-center justify-between px-4 md:px-6 z-50">
        <Button asChild
          className="bg-white border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white shadow-lg font-medium transition-colors"
        >
          <Link href="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Shelf
          </Link>
        </Button>

        <Button
          onClick={toggleLanguage}
          className="bg-white border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white shadow-lg font-medium transition-colors"
        >
          <Languages className="w-4 h-4 mr-2" />
          {language === "tr" ? "EN" : "TR"}
        </Button>
      </div>

      {/* Title zone — ~25vh */}
      <div className="shrink-0 h-[25dvh] flex items-center justify-center pointer-events-none">
        <div className="relative flex items-center justify-center">
          <div className="absolute -left-16 sm:-left-20 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full border-3 border-gray-800/20" />
          <div className="absolute -right-16 sm:-right-20 top-1/2 -translate-y-1/2 w-8 h-8 sm:w-10 sm:h-10 rounded-full border-3 border-gray-800/20" />

          <h1
            className="text-gray-900 font-[family-name:var(--font-space-grotesk)] text-[clamp(4rem,12vw,10rem)] font-light select-none"
            style={{ letterSpacing: "0.15em" }}
          >
            ito
          </h1>

          <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-24 sm:w-32 h-0.5 bg-gray-800/30" />
        </div>
      </div>

      {/* Card zone — fills remaining space */}
      <div className="flex-1 flex items-stretch px-4 sm:px-6 pb-4 sm:pb-6 min-h-0">
        <div className="relative w-full max-w-md mx-auto flex flex-col">
          {/* Stacked cards effect */}
          <div className="absolute inset-0 bg-yellow-400/60 rounded-lg shadow-lg transform rotate-2 translate-x-2 translate-y-2 scale-[0.98]" />
          <div className="absolute inset-0 bg-yellow-400/80 rounded-lg shadow-xl transform rotate-1 translate-x-1 translate-y-1 scale-[0.99]" />

          {/* Main card */}
          <div
            className={`relative bg-yellow-400 rounded-lg shadow-2xl transition-all duration-300 flex-1 flex flex-col ${
              isAnimating ? "scale-95 opacity-90" : "scale-100 rotate-0 opacity-100"
            }`}
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <div className="relative p-6 sm:p-10 md:p-14 flex-1 flex flex-col">
              {currentCategory ? (
                <div
                  className={`transition-all duration-300 flex-1 flex flex-col justify-between ${
                    isAnimating ? "opacity-0 scale-95" : "opacity-100 scale-100"
                  }`}
                >
                  {/* Category text */}
                  <div className="flex-1 flex items-center justify-center">
                    <h2 className="text-[clamp(1.5rem,6vw,3rem)] font-medium text-gray-900 text-center leading-tight px-4">
                      {currentCategory.text}
                    </h2>
                  </div>

                  {/* Spectrum */}
                  <div className="space-y-6 mt-auto">
                    <div className="relative py-4">
                      <div className="h-0.5 bg-gray-900" />
                      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-3 h-3 bg-gray-900 rounded-full" />
                      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-3 h-3 bg-gray-900 rounded-full" />
                    </div>

                    <div className="flex items-center justify-between text-gray-900">
                      <div className="text-left">
                        <div className="text-[clamp(1.5rem,5vw,2.25rem)] font-medium mb-1">1</div>
                        <div className="text-sm sm:text-base">{currentCategory.lowLabel}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-[clamp(1.5rem,5vw,2.25rem)] font-medium mb-1">100</div>
                        <div className="text-sm sm:text-base">{currentCategory.highLabel}</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-900">
                  <div className="w-16 h-16 bg-gray-900/10 rounded-full flex items-center justify-center mb-4">
                    <Shuffle className="w-8 h-8 text-gray-900" />
                  </div>
                  <p className="text-xl sm:text-2xl font-medium mb-2">
                    {language === "tr" ? "Oynamaya hazır mısın?" : "Ready to play?"}
                  </p>
                  <p className="text-sm sm:text-base text-gray-800 text-center max-w-xs">
                    {language === "tr"
                      ? "Gizli sayılarını tanımlamak için kategori üret"
                      : "Generate a theme category to help describe your secret numbers"}
                  </p>
                </div>
              )}

              {/* Generate button */}
              <Button
                onClick={generateRandomCategory}
                disabled={isAnimating}
                className="w-full h-12 sm:h-14 bg-gray-900 hover:bg-gray-800 text-white shadow-xl font-medium rounded-lg transition-all duration-200 disabled:opacity-50 text-base sm:text-lg mt-6"
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
  )
}
