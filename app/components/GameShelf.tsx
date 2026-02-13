"use client"

import { useEffect, useState } from "react"
import { WALL_COLORS, type GameId } from "@/lib/utils/constants"

interface Game {
  id: GameId
  name: string
  available: boolean
  bgColor: string
  textColor: string
}

interface GameShelfProps {
  games: Game[]
  onGameSelect: (gameId: GameId) => void
}

// Fixed Kallax cube dimensions
const CUBE_SIZE = 160 // Interior cube space
const DIVIDER_SIZE = 16 // White divider thickness

// Responsive grid configurations
const GRID_CONFIGS = {
  mobile: { rows: 6, cols: 2 },
  sm: { rows: 4, cols: 3 },
  md: { rows: 3, cols: 4 },
  xl: { rows: 2, cols: 6 },
}

export function GameShelf({ games, onGameSelect }: GameShelfProps) {
  const [wallColor, setWallColor] = useState("")
  const [isDark, setIsDark] = useState(false)
  const [showTexture, setShowTexture] = useState(false)

  useEffect(() => {
    const randomColor = WALL_COLORS[Math.floor(Math.random() * WALL_COLORS.length)]
    setWallColor(randomColor)

    // Check system preference for dark mode
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    if (prefersDark) {
      setIsDark(true)
      document.documentElement.classList.add("dark")
    }

    // Preload dark mode texture
    const img = new Image()
    img.src = "https://www.transparenttextures.com/patterns/3px-tile.png"

    // Show texture after a small delay to ensure smooth load
    setTimeout(() => setShowTexture(true), 200)
  }, [])

  const toggleDarkMode = () => {
    if (!isDark) {
      // Switching to dark mode: hide texture, set dark, wait for transition, then show texture
      setShowTexture(false)
      setIsDark(true)
      document.documentElement.classList.add("dark")
      // Wait for background transition to complete (500ms) before showing texture
      setTimeout(() => setShowTexture(true), 500)
    } else {
      // Switching to light mode: immediate
      setIsDark(false)
      setShowTexture(true)
      document.documentElement.classList.remove("dark")
    }
  }

  // Render a single Kallax unit with proper layering
  const renderKallax = (rows: number, cols: number) => {
    const cells = []
    let gameIndex = 0

    // Generate all cells
    for (let row = 0; row < rows; row++) {
      for (let col = 0; col < cols; col++) {
        const game = gameIndex < games.length ? games[gameIndex] : null
        cells.push(
          <div
            key={`${row}-${col}`}
            className="relative bg-gray-50"
            style={{
              width: `${CUBE_SIZE}px`,
              height: `${CUBE_SIZE}px`,
            }}
          >
            {game ? <GameBox game={game} onClick={() => onGameSelect(game.id)} /> : null}
          </div>
        )
        if (game) gameIndex++
      }
    }

    // Calculate total dimensions
    const totalWidth = cols * CUBE_SIZE + (cols + 1) * DIVIDER_SIZE
    const totalHeight = rows * CUBE_SIZE + (rows + 1) * DIVIDER_SIZE

    return (
      <div className="relative">
        <div
          className="relative"
          style={{
            width: `${totalWidth}px`,
            height: `${totalHeight}px`,
          }}
        >
          {/* Grid of cubes */}
          <div
            className="absolute inset-0 grid"
            style={{
              gridTemplateColumns: `repeat(${cols}, ${CUBE_SIZE}px)`,
              gridTemplateRows: `repeat(${rows}, ${CUBE_SIZE}px)`,
              gap: `${DIVIDER_SIZE}px`,
              padding: `${DIVIDER_SIZE}px`,
              backgroundColor: "white",
            }}
          >
            {cells}
          </div>
        </div>
        {/* Floor shadow */}
        <div className="absolute -bottom-4 left-8 right-8 h-8 bg-black/10 rounded-full blur-2xl" />
      </div>
    )
  }

  return (
    <div
      className={`min-h-screen relative flex flex-col items-center justify-center p-4 sm:p-6 md:p-8 transition-colors duration-500`}
      style={
        isDark
          ? {
              backgroundColor: "#010a00",
              backgroundImage: showTexture
                ? 'url("https://www.transparenttextures.com/patterns/3px-tile.png")'
                : "none",
            }
          : {
              backgroundColor: "#f7f7f5",
              backgroundImage: showTexture
                ? 'url("https://www.transparenttextures.com/patterns/concrete-wall.png")'
                : "none",
            }
      }
    >
      {/* Light switch toggle */}
      <button
        onClick={toggleDarkMode}
        className="absolute top-6 right-6 z-50 p-3 rounded-full bg-white/90 dark:bg-gray-800 shadow-lg hover:shadow-xl transition-all duration-200"
        aria-label="Toggle lights"
      >
        {isDark ? (
          <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
            <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
          </svg>
        ) : (
          <svg className="w-6 h-6 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
            <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
          </svg>
        )}
      </button>

      {/* Subtle background text - only in light mode */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden dark:hidden">
        <h1
          className="font-[family-name:var(--font-space-grotesk)] font-bold text-[12vw] sm:text-[10vw] md:text-[8vw] tracking-wider opacity-[0.04] select-none"
          style={{
            letterSpacing: "0.2em",
          }}
        >
          BGHELPER
        </h1>
      </div>

      {/* Neon Sign - BGHelper Logo */}
      <div className="mb-16 md:mb-20 lg:mb-24 z-20 relative">
        {/* Light mode: Simple black text */}
        <h1 className="font-[family-name:var(--font-pacifico)] text-5xl sm:text-6xl md:text-7xl lg:text-8xl select-none text-gray-900 dark:hidden">
          BGHelper
        </h1>

        {/* Dark mode: Neon effect - exact CodePen style */}
        <h1
          className="font-[family-name:var(--font-pacifico)] text-5xl sm:text-6xl md:text-7xl lg:text-8xl select-none hidden dark:block"
          style={{
            color: "#fff",
            textShadow: `
              0 0 5px #fff,
              0 0 10px #fff,
              0 0 20px #fff,
              0 0 40px #0ff,
              0 0 80px #0ff,
              0 0 90px #0ff,
              0 0 100px #0ff,
              0 0 150px #0ff
            `,
          }}
        >
          BGHelper
        </h1>
      </div>

      {/* Kallax Shelf Units - Responsive */}
      <div className="relative z-10">
        {/* Mobile: 6x2 */}
        <div className="block sm:hidden">{renderKallax(GRID_CONFIGS.mobile.rows, GRID_CONFIGS.mobile.cols)}</div>

        {/* Small: 4x3 */}
        <div className="hidden sm:block md:hidden">{renderKallax(GRID_CONFIGS.sm.rows, GRID_CONFIGS.sm.cols)}</div>

        {/* Medium: 3x4 */}
        <div className="hidden md:block xl:hidden">{renderKallax(GRID_CONFIGS.md.rows, GRID_CONFIGS.md.cols)}</div>

        {/* Extra Large: 2x6 */}
        <div className="hidden xl:block">{renderKallax(GRID_CONFIGS.xl.rows, GRID_CONFIGS.xl.cols)}</div>
      </div>
    </div>
  )
}

// Game box component - fills the entire cube interior
interface GameBoxProps {
  game: Game
  onClick: () => void
}

function GameBox({ game, onClick }: GameBoxProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="absolute inset-0 cursor-pointer group"
    >
      {/* Game box filling the cube interior 100% */}
      <div
        className={`
          h-full w-full rounded-sm shadow-lg transition-all duration-200 relative overflow-hidden
          ${game.bgColor}
          ${isHovered ? "shadow-2xl brightness-105" : ""}
        `}
      >
        {/* Game title - vertical text with fixed size */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="transform -rotate-90 origin-center whitespace-nowrap">
            <h3 className={`font-bold text-base ${game.textColor} tracking-wider uppercase`}>
              {game.name === "A Fake Artist Goes to New York" ? "A Fake Artist" : game.name}
            </h3>
          </div>
        </div>

        {/* Texture overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/20 pointer-events-none" />

        {/* Edge highlights */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-r from-black/30 to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-l from-black/20 to-transparent" />

        {/* Wear effect */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15)_0%,transparent_50%)] pointer-events-none" />
      </div>
    </button>
  )
}
