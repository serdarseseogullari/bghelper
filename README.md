# BGHelper

Digital companions for party board games - never lose the prompt cards again!

## What is this?

A web app that generates random prompts for board games:

- **ito** - 350+ categories with spectrum labels (1-100)
- **A Fake Artist Goes to New York** - 100+ drawing prompts with hide/reveal
- **Just One** - 300+ words for cooperative guessing game
- **Phantom Ink** - 100 object cards (5 per card) with parchment aesthetic
- **Wavelength** - 481 spectrum cards across 5 packs (Original, Family, Edgy, Abstract, Generated)

## Features

- 3D shelf interface with realistic shadows
- Smart randomization (no duplicate categories in a row)
- Mobile-friendly responsive design with swipe gesture support
- Landscape mode optimisation for horizontal cards (Wavelength)
- Per-game theming faithful to each game's visual identity
- Pack filter with localStorage persistence (Wavelength)
- Error handling

## Tech Stack

- Next.js 14 with App Router
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui components

## Getting Started

```bash
# Install dependencies
npm install

# Run dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Project Structure

```
app/
├── components/        # GameShelf, ErrorBoundary
├── games/            # ito, fake-artist, just-one, phantom-ink, wavelength
└── page.tsx          # Main orchestrator

data/                 # Categories, prompts and card data for all games
lib/utils/           # Random selection, constants
```

## Scripts

```bash
npm run dev          # Development server
npm run build        # Production build
npm run lint         # Check code quality
npm run test         # Run Playwright tests
npm run format       # Format code with Prettier
```

## Adding a New Game

1. Create data file in `data/your-game-prompts.ts`
2. Create component in `app/games/your-game/`
3. Add to `lib/utils/constants.ts`
4. Import in `app/page.tsx`

See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

## License

MIT - See [LICENSE](LICENSE)

## Contact

Serdar - [GitHub](https://github.com/serdarseseogullari)

---

Built with Next.js • Deployed on Vercel
