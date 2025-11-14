# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Fermilabs.xyz is a website for a research lab focused on building the future of decentralized finance. Built with HTML-first approach using vanilla JavaScript, GSAP, Three.js, and Vite. Most content is in HTML for better SEO and performance, with minimal JavaScript for interactivity and animations.

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
- **Vanilla JavaScript**: Minimal JS for interactivity (mobile menu, year display)
- **GSAP**: Text shuffle animations with ScrollTrigger and SplitText (lazy loaded)
- **Three.js**: WebGL dither effect background (lazy loaded)
- **PostHog**: Analytics tracking
- **Tailwind CSS v4**: Utility-first styling

### Architecture
- **HTML-first approach**: All content structure is in index.html
- **Progressive enhancement**: JavaScript enhances the experience but isn't required
- **Lazy loading**: Animations (GSAP, Three.js) are loaded on demand to reduce initial bundle
- **Minimal JS**: Only ~4KB initial JS for menu toggle and basic setup
- **Code splitting**: Animations are separate chunks loaded asynchronously

### Styling
- Tailwind CSS v4 with Vite plugin
- Custom fonts loaded via Google Fonts:
  - Sans: "Arimo"
  - Display: "Bricolage Grotesque"
- Use Tailwind utility classes for styling

### Path Aliases
- `@/*` maps to `src/*` - use this for imports (e.g., `import { createHeader } from '@/components/Header.js'`)

### Code Quality
- Biome handles both linting and formatting
- Uses tabs for indentation and double quotes for strings
- Import organization is automatic

### File Structure
```
index.html              # Main HTML file with all content
src/
  main.js              # Entry point (~4KB) - menu toggle, year, lazy loads animations
  styles.css           # Tailwind imports
  animations/
    shuffle.js         # GSAP text shuffle animation (lazy loaded)
    dither.js          # Three.js dither background effect (lazy loaded)
```

### Key Features
- **Mobile menu**: Animated hamburger menu with CSS transitions
- **Text shuffle**: GSAP-powered text animation on scroll and hover
- **Dither effect**: Three.js WebGL background with wave patterns and mouse interaction
- **Lazy loaded animations**: GSAP and Three.js only load when needed

