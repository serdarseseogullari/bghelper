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

export function GameShelf({ games, onGameSelect }: GameShelfProps) {
  const [wallColor, setWallColor] = useState("")

  useEffect(() => {
    const randomColor = WALL_COLORS[Math.floor(Math.random() * WALL_COLORS.length)]
    setWallColor(randomColor)
  }, [])

  return (
    <div className={`min-h-screen ${wallColor} relative flex items-center justify-center p-4 sm:p-8`}>
      {/* Kallax Shelf Unit */}
      <div className="relative w-full max-w-4xl">
        {/* Shelf Structure - White/Wood Kallax style */}
        <div
          className="relative bg-white rounded-sm shadow-2xl"
          style={{
            aspectRatio: "4/3",
          }}
        >
          {/* Shelf Grid - 4 cubes wide, 3 tall */}
          <div className="grid grid-cols-4 grid-rows-3 h-full gap-0">
            {/* Each cell represents a cube in the Kallax */}
            {/* Row 1 */}
            <GameBoxCell game={games[0]} onClick={() => onGameSelect(games[0].id)} />
            <EmptyCell />
            <GameBoxCell game={games[1]} onClick={() => onGameSelect(games[1].id)} />
            <EmptyCell />
            
            {/* Row 2 */}
            <EmptyCell />
            <EmptyCell />
            <EmptyCell />
            <EmptyCell />
            
            {/* Row 3 */}
            <EmptyCell />
            <EmptyCell />
            <EmptyCell />
            <EmptyCell />
          </div>

          {/* Kallax vertical dividers */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(3)].map((_, i) => (
              <div
                key={`v-${i}`}
                className="absolute top-0 bottom-0 w-3 sm:w-4 bg-white shadow-md"
                style={{
                  left: `${(i + 1) * 25}%`,
                  transform: "translateX(-50%)",
                }}
              />
            ))}
          </div>

          {/* Kallax horizontal dividers */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(2)].map((_, i) => (
              <div
                key={`h-${i}`}
                className="absolute left-0 right-0 h-3 sm:h-4 bg-white shadow-md"
                style={{
                  top: `${(i + 1) * 33.333}%`,
                  transform: "translateY(-50%)",
                }}
              />
            ))}
          </div>
        </div>

        {/* Floor shadow */}
        <div className="absolute -bottom-4 left-8 right-8 h-8 bg-black/10 rounded-full blur-2xl" />
      </div>
    </div>
  )
}

// Empty cell component
function EmptyCell() {
  return <div className="relative bg-gray-50" />
}

// Game box cell - vertical board game box
interface GameBoxCellProps {
  game: Game
  onClick: () => void
}

function GameBoxCell({ game, onClick }: GameBoxCellProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div 
      className="relative p-2 sm:p-3 bg-gray-50 cursor-pointer"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Board game box standing vertically */}
      <div
        className={`
          h-full w-full rounded-sm shadow-lg transition-all duration-300 relative overflow-hidden
          ${game.bgColor}
          ${isHovered ? "scale-105 shadow-2xl" : "scale-100"}
        `}
        style={{
          transform: isHovered ? "translateY(-4px)" : "translateY(0)",
        }}
      >
        {/* Box spine with game title (vertical text) */}
        <div className="absolute inset-0 flex items-center justify-center p-2 sm:p-3">
          <div className="transform -rotate-90 origin-center whitespace-nowrap">
            <h3 className={`font-bold text-sm sm:text-base md:text-lg ${game.textColor} tracking-wider uppercase`}>
              {game.name === "A Fake Artist Goes to New York" ? "A Fake Artist" : game.name}
            </h3>
          </div>
        </div>

        {/* Texture overlay for realistic paper/cardboard feel */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-black/20 pointer-events-none" />
        
        {/* Edge highlight */}
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-r from-black/30 to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 w-1 bg-gradient-to-l from-black/20 to-transparent" />
        
        {/* Wear and tear effect */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.15)_0%,transparent_50%)] pointer-events-none" />
      </div>
    </div>
  )
}
