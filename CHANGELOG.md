# Changelog

All notable changes to BGHelper will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **Just One** game helper with 300+ curated words
- Purple theme for Just One with minimalist design
- Hide/reveal functionality for word display
- Helper text explaining game rules
- **Responsive Kallax shelf** with different grid layouts per breakpoint:
  - Mobile: 6 rows × 2 columns
  - Small screens: 4 rows × 3 columns
  - Full HD/Medium: 3 rows × 4 columns
  - Superwide/XL: 2 rows × 6 columns
- **BGHelper wall text logo** behind shelf with subtle opacity
- **Game logos** for all three games:
  - Just One: Permanent Marker font with brush style
  - ito: Space Grotesk geometric minimalist design
  - A Fake Artist: Already had Macondo Art Deco style

## [1.0.0] - 2025-02-08

### Added

- Complete refactor to modular architecture
- 3D realistic shelf effect with depth and shadows
- Enhanced ito interface with improved visual design
- Smart random selection (prevents consecutive duplicates)
- Error boundary for graceful error handling
- TypeScript strict mode throughout
- Constants file for magic numbers
- Comprehensive test suite with Playwright
- Portfolio-grade README and documentation
- Contributing guidelines
- ESLint and Prettier configuration
- MIT License
- Environment variables template

### Improved

- ito card design with stacked cards effect
- Spectrum visualization with gradient bar and tick marks
- Category badge design
- Button animations and micro-interactions
- Empty state messaging
- Responsive design across all breakpoints
- Font optimization (removed unused fonts)
- Code organization (separated data, components, utils)

### Changed

- Moved game data to separate files
- Split monolithic page.tsx into components
- Updated metadata for better SEO
- Optimized font loading with display: swap
- Removed TypeScript build error ignoring

### Technical

- Added error boundary component
- Created utility functions for random selection
- Implemented constants for consistent values
- Set up Playwright for E2E testing
- Added type definitions throughout
- Improved accessibility with proper ARIA labels

## [0.1.0] - Initial Release

### Added

- ito game helper with 350+ categories
- A Fake Artist Goes to New York helper with 100+ prompts
- Basic shelf interface
- Mobile-responsive design
- Next.js 14 App Router setup
- Tailwind CSS v4 styling
- shadcn/ui component library integration
