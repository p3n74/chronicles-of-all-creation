# chronicles-of-all-creation

This project was created with [Better-T-Stack](https://github.com/AmanVarshney01/create-better-t-stack), a modern TypeScript stack that combines React, TanStack Router, Hono, TRPC, and more.

## Features

- **TypeScript** - For type safety and improved developer experience
- **TanStack Router** - File-based routing with full type safety
- **TailwindCSS** - Utility-first CSS for rapid UI development
- **Shared UI package** - shadcn/ui primitives live in `packages/ui`
- **Hono** - Lightweight, performant server framework
- **tRPC** - End-to-end type-safe APIs
- **Node.js** - Runtime environment
- **Turborepo** - Optimized monorepo build system

## Getting Started

First, install the dependencies:

```bash
pnpm install
```

Copy the example env files (required for local validation):

```bash
cp apps/web/.env.example apps/web/.env
cp apps/server/.env.example apps/server/.env
```

Then, run the development server:

```bash
pnpm run dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser to see the modpack landing page.
The API is running at [http://localhost:3000](http://localhost:3000).

### Landing page

The public site lives in `apps/web` and includes Hero, About, Features, and Footer sections.

- Edit copy, server IP, and footer URLs in `apps/web/src/lib/constants.ts`
- Assets live in `apps/web/public/` (`logo.png`, `hero.png`, `icons/*`)
- Landing UI components live in `apps/web/src/components/landing/`

## UI Customization

React web apps in this stack share shadcn/ui primitives through `packages/ui`.

- Change design tokens and global styles in `packages/ui/src/styles/globals.css`
- Update shared primitives in `packages/ui/src/components/*`
- Adjust shadcn aliases or style config in `packages/ui/components.json` and `apps/web/components.json`

### Add more shared components

Run this from the project root to add more primitives to the shared UI package:

```bash
npx shadcn@latest add accordion dialog popover sheet table -c packages/ui
```

Import shared components like this:

```tsx
import { Button } from "@chronicles-of-all-creation/ui/components/button";
```

### Add app-specific blocks

If you want to add app-specific blocks instead of shared primitives, run the shadcn CLI from `apps/web`.

## Project Structure

```
chronicles-of-all-creation/
├── apps/
│   ├── web/         # Frontend application (React + TanStack Router)
│   └── server/      # Backend API (Hono, TRPC)
├── packages/
│   ├── ui/          # Shared shadcn/ui components and styles
│   ├── api/         # API layer / business logic
```

## Questbook data pipeline

The `/quests` page renders the real FTB Quests book from the pack's SNBT files.

- `quests/` holds the FTB Quests SNBT (chapters, groups, lang)
- `icons/` holds jar-extracted item/block textures (`unique_items/`, `by_chapter/`)
- `pnpm export:quests` assembles flat block faces into isometric cubes, then
  regenerates `apps/web/src/lib/generated/quests.json` and
  `apps/web/public/quest-icons/`

Re-run it whenever the SNBT files or the icon pack change.

## Available Scripts

- `pnpm run dev`: Start all applications in development mode
- `pnpm run build`: Build all applications
- `pnpm run dev:web`: Start only the web application
- `pnpm run dev:server`: Start only the server
- `pnpm run check-types`: Check TypeScript types across all apps
- `pnpm run export:quests`: Regenerate quest data + icons from `quests/` and `icons/`

## Deployment (Docker)

The `Dockerfile` builds the static web app and serves it with nginx (SPA
fallback included, so `/quests` works on refresh).

```bash
# VITE_SERVER_URL is baked into the client bundle at build time
docker build -t chronicles-web --build-arg VITE_SERVER_URL=https://api.example.com .
docker run -p 8080:80 chronicles-web
```

If you are not using the tRPC server yet, the default build arg
(`http://localhost:3000`) is fine; the landing and quest pages are fully static.
