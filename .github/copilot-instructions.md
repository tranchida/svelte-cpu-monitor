# Copilot Instructions

## Commands

```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run preview      # Preview production build
npm run check        # Type-check with svelte-check (one-shot)
npm run check:watch  # Type-check in watch mode
```

There are no test or lint commands.

## Architecture

This is a SvelteKit 2 app that monitors CPU usage in real time.

**Data flow:**
1. `src/lib/cpu.ts` — server-side utility that calls Node.js `os.cpus()` to get raw CPU timing data
2. `src/routes/api/cpu/+server.ts` — SvelteKit API route (`GET /api/cpu`) that calls `getCpuInfo()` and returns JSON
3. `src/routes/+page.svelte` — client-side page that polls `/api/cpu` every 2 seconds and renders a Chart.js line graph + per-core usage cards

CPU usage % is derived by diffing two successive snapshots of `cpu.times` (idle vs total ticks). The first API response only initializes `prevCpus`; actual usage values appear from the second poll onward.

## Key Conventions

- **Svelte 5 Runes only** — use `$state`, `$effect`, `$derived`, `$props` etc. Do not use the legacy `let`/`$:` reactive syntax.
- **`$effect` cleanup** — return a cleanup function from `$effect` for intervals and Chart.js instances (see `+page.svelte`).
- **Tailwind CSS 4** — CSS is imported with `@import "tailwindcss"` in `app.css`, not the old `@tailwind base/components/utilities` directives.
- **`$lib` alias** — import shared code via `$lib/...` (maps to `src/lib/`).
- **API routes typed with generated types** — use `import type { RequestHandler } from './$types'` in `+server.ts` files.
- **Chart.js tree-shaking** — register only the Chart.js components actually used; do not import `Chart` with `import 'chart.js/auto'`.
- Source files use `.ts` (TypeScript), not `.js`, despite older README references to `.js`.
