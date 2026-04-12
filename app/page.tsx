import { GameShelf } from "./components/GameShelf"
import { ErrorBoundary } from "./components/ErrorBoundary"
import { GAME_IDS } from "@/lib/utils/constants"

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
  {
    id: GAME_IDS.PHANTOM_INK,
    name: "Phantom Ink",
    available: true,
    bgColor: "bg-[#0d0b08]",
    textColor: "text-[#C9A84C]",
  },
  {
    id: GAME_IDS.WAVELENGTH,
    name: "Wavelength",
    available: true,
    bgColor: "bg-[#07071a]",
    textColor: "text-[#a78bfa]",
  },
]

export default function Home() {
  return (
    <ErrorBoundary>
      <GameShelf games={games} />
    </ErrorBoundary>
  )
}
