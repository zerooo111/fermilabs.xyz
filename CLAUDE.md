# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Fermilabs.xyz is a website for a research lab focused on building the future of decentralized finance. Built with HTML-first approach using vanilla JavaScript, Motion, a canvas dither animation, and Vite. Most content is in HTML for better SEO and performance, with minimal JavaScript for interactivity and animations.

## Essential Commands

```bash
# Development
bun run dev        # Start development server on port 3000

# Build & Preview
bun run build      # Production build
bun run serve      # Preview production build locally

# Code Quality
bun run lint       # Lint with Biome
bun run format     # Format with Biome
bun run check      # Combined lint + format check

# Testing
bun run test       # Run tests with Vitest
```

## Architecture & Key Patterns

### Tech Stack
- **HTML-first**: Most content is static HTML in index.html for better SEO and initial load
- **Vanilla JavaScript**: Minimal JS (year display, lazy loading animations)
- **Motion** (`motion/mini`): Hero intro fade (lazy loaded)
- **Canvas 2D**: Dithered "sequencer" field animation (lazy loaded)
- **PostHog**: Analytics tracking
- **Tailwind CSS v4**: Utility-first styling

### Architecture
- **HTML-first approach**: All content structure is in index.html and research/index.html
- **Progressive enhancement**: JavaScript enhances the experience but isn't required
- **Lazy loading**: Animations are loaded on demand to reduce initial bundle
- **Minimal JS**: Only ~4KB initial JS for basic setup
- **Code splitting**: Animations are separate chunks loaded asynchronously

### Styling
- Tailwind CSS v4 with Vite plugin
- Custom fonts loaded via Google Fonts:
  - Serif (headlines, reading): "Newsreader"
  - Sans (UI, body): "Hanken Grotesk"
- Use Tailwind utility classes for styling

### Path Aliases
- `@/*` maps to `src/*` - use this for imports (e.g., `import { createHeader } from '@/components/Header.js'`)

### Code Quality
- Biome handles both linting and formatting
- Uses tabs for indentation and double quotes for strings
- Import organization is automatic

### File Structure
```
index.html              # Landing page
research/index.html     # Research page: Substack articles grouped by topic
src/
  main.js              # Entry point - year, lazy loads animations
  styles.css           # Tailwind imports and theme tokens
  animations/
    sequencer.js       # Canvas dither field: unordered -> sequenced transactions
public/dither/         # Pre-rendered Bayer dither PNGs (section bands, footer, hover corners)
```

### Key Features
- **Sequencer field**: Bayer-dithered canvas where transactions drift in, queue at a gate and leave in FIFO lanes; reacts to the pointer, pauses offscreen, renders a still frame for reduced motion
- **Layout**: Pages sit in a `.frame` (1280px, ruled sides); sections are separated by rules with `.reg` registration marks. Illustrations are inline blueprint SVGs styled by `.bp`
- **Research page**: Articles are hardcoded; add new Substack posts to research/index.html and update counts on the landing page

