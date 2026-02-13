# BGHelper

Digital companions for party board games - never lose the prompt cards again!

## What is this?

A web app that generates random prompts for board games:

- **ito** - 350+ categories with spectrum labels (1-100)
- **A Fake Artist Goes to New York** - 100+ drawing prompts with hide/reveal
- **Just One** - 300+ words for cooperative guessing game
- **Wavelength** - Coming soon!

## Features

- 3D shelf interface with realistic shadows
- Smart randomization (no duplicate categories in a row)
- Mobile-friendly responsive design
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
├── games/            # ito, fake-artist, just-one
└── page.tsx          # Main orchestrator

data/                 # Categories and prompts
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

Serdar - [GitHub](https://github.com/serdar-q)

---

Built with Next.js • Deployed on Vercel
