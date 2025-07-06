# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Fermilabs.xyz is a website for a research lab focused on building the future of quantum computing. Built with React 19, TypeScript, and Vite.

## Essential Commands

```bash
# Development
bun run dev        # Start development server on port 3000

# Build & Preview
bun run build      # Production build with TypeScript checking
bun run serve      # Preview production build locally

# Code Quality
bun run lint       # Lint with Biome
bun run format     # Format with Biome
bun run check      # Combined lint + format check

# Testing
bun run test       # Run tests with Vitest
```

## Architecture & Key Patterns


### Styling
- Tailwind CSS v4 with Vite plugin
- Custom fonts defined in `src/styles.css`:
  - Sans: "Arimo"
  - Display: "Instrument Serif"
- Use Tailwind utility classes for styling

### Path Aliases
- `@/*` maps to `src/*` - use this for imports (e.g., `import { Header } from '@/components/Header'`)

### Code Quality
- Biome handles both linting and formatting
- Uses tabs for indentation and double quotes for strings
- Import organization is automatic

### TypeScript
- Strict mode enabled
- Target: ES2022
- No emit (Vite handles compilation)

