// Animation durations (in milliseconds)
export const ANIMATION_DURATION = 200 // Matches CSS transition duration

// Game configuration
export const GAME_IDS = {
  ITO: "ito",
  FAKE_ARTIST: "fake-artist",
  JUST_ONE: "just-one",
  WAVELENGTH: "wavelength",
} as const

export type GameId = (typeof GAME_IDS)[keyof typeof GAME_IDS]

// Shelf colors
export const WALL_COLORS = ["bg-stone-200", "bg-neutral-200", "bg-amber-100", "bg-rose-100", "bg-orange-50"] as const


