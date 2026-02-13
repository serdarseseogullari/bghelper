"use client"

import { useState } from "react"
import { GameShelf } from "./components/GameShelf"
import { ItoGenerator } from "./games/ito/ItoGenerator"
import { FakeArtistGenerator } from "./games/fake-artist/FakeArtistGenerator"
import { JustOneGenerator } from "./games/just-one/JustOneGenerator"
import { ErrorBoundary } from "./components/ErrorBoundary"
import { GAME_IDS, type GameId } from "@/lib/utils/constants"

const games = [
  {
    id: GAME_IDS.ITO,
    name: "ito",
    available: true,
    bgColor: "bg-yellow-400",
    textColor: "text-gray-800",
  },
  {
    id: GAME_IDS.FAKE_ARTIST,
    name: "A Fake Artist Goes to New York",
    available: true,
    bgColor: "bg-[#D21B7F]",
    textColor: "text-[#FBF332]",
  },
  {
    id: GAME_IDS.JUST_ONE,
    name: "Just One",
    available: true,
    bgColor: "bg-purple-500",
    textColor: "text-white",
  },
]

type ViewType = "shelf" | GameId

export default function Home() {
  const [currentView, setCurrentView] = useState<ViewType>("shelf")

  const handleGameSelect = (gameId: GameId) => {
    if (gameId === GAME_IDS.ITO || gameId === GAME_IDS.FAKE_ARTIST || gameId === GAME_IDS.JUST_ONE) {
      setCurrentView(gameId)
    }
  }

  const handleBackToShelf = () => {
    setCurrentView("shelf")
  }

  return (
    <ErrorBoundary>
      {currentView === "shelf" && <GameShelf games={games} onGameSelect={handleGameSelect} />}
      {currentView === GAME_IDS.ITO && <ItoGenerator onBack={handleBackToShelf} />}
      {currentView === GAME_IDS.FAKE_ARTIST && <FakeArtistGenerator onBack={handleBackToShelf} />}
      {currentView === GAME_IDS.JUST_ONE && <JustOneGenerator onBack={handleBackToShelf} />}
    </ErrorBoundary>
  )
}
