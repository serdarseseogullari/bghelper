# Contributing

Thanks for your interest in BGHelper!

## Reporting Issues

Found a bug? Create an issue with:
- Steps to reproduce
- Expected vs actual behavior
- Screenshots if applicable

## Adding New Game Helpers

1. **Create data file** in `data/`:
```typescript
// data/game-name-prompts.ts
export interface GamePrompt {
  category: string
  prompt: string
}

export const gamePrompts: GamePrompt[] = [
  { category: "Example", prompt: "Something" },
  // ... more prompts
]
```

2. **Create component** in `app/games/game-name/`:
```typescript
// app/games/game-name/GameGenerator.tsx
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Shuffle } from "lucide-react"
import { gamePrompts } from "@/data/game-name-prompts"
import { getRandomItem } from "@/lib/utils/random"
import { ANIMATION_DURATION } from "@/lib/utils/constants"

interface GameGeneratorProps {
  onBack: () => void
}

export function GameGenerator({ onBack }: GameGeneratorProps) {
  const [current, setCurrent] = useState(null)
  const [isAnimating, setIsAnimating] = useState(false)

  const generate = () => {
    setIsAnimating(true)
    setTimeout(() => {
      setCurrent(getRandomItem(gamePrompts, current || undefined))
      setIsAnimating(false)
    }, ANIMATION_DURATION)
  }

  // Your UI here
}
```

3. **Update constants** in `lib/utils/constants.ts`:
```typescript
export const GAME_IDS = {
  // ... existing
  YOUR_GAME: "your-game",
} as const
```

4. **Add to main page** in `app/page.tsx`

5. Test thoroughly!

## Pull Request Process

1. Fork the repo
2. Create a branch: `git checkout -b feature/your-feature`
3. Make your changes
4. Run checks:
   ```bash
   npm run lint
   npm run type-check
   npm run build
   npm run test
   ```
5. Commit: `git commit -m "feat: add something"`
6. Push: `git push origin feature/your-feature`
7. Open a Pull Request

## Commit Convention

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code restructure
- `test:` Tests
- `chore:` Maintenance

## Code Style

- Use TypeScript
- Format with Prettier
- Follow existing patterns
- Keep components focused
- Test on mobile and desktop

## Questions?

Open an issue with the "question" label.

Thanks for contributing! 🎮
