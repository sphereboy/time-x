# TZGrid

Compare time zones at a glance. Each location is a column with a day/night gradient that tracks the time of day, so you can see who's awake, who's asleep, and what hours overlap.

Live at [tzgrid.com](https://tzgrid.com).

## Run locally

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

Other scripts:

| Command | What it does |
| --- | --- |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | Next.js ESLint |
| `npm run type-check` | `tsc --noEmit` |
| `npm run validate` | type-check + lint + build |

## How it's built

- **Framework:** Next.js 14 (App Router) + TypeScript
- **State:** [Zustand](https://github.com/pmndrs/zustand) with `persist` middleware → `localStorage`. See `src/store/timeZoneStore.ts`.
- **Main view:** `src/components/TimeZoneComparer.tsx` — clock columns, editable hours, gradient backgrounds.
- **Time math:** `Intl.DateTimeFormat` with IANA identifiers; helpers in `src/lib/timeFormatting.ts`.
- **Styling:** Tailwind CSS + a CSS Module (`src/styles/TimeZoneComparer.module.css`) for the column layout. Radix UI primitives in `src/components/ui/`.
- **SEO surface:** programmatic `/compare/[slug]` and `/time-in/[city]` routes for high-intent search traffic.

## Project layout

```
src/
├── app/             # routes (App Router)
├── components/      # TimeZoneComparer, dialogs, ui/ primitives
├── store/           # zustand store + persistence
├── lib/             # time formatting, colors, validation
├── constants/       # IANA timezone mapping
└── types/           # shared types
```

## Docs

Deeper notes live in [`docs/`](./docs):

- [`architecture.md`](./docs/architecture.md) — component + data-flow overview
- [`state-and-persistence.md`](./docs/state-and-persistence.md) — store shape, hydration, schema drift
- [`styling-and-theming.md`](./docs/styling-and-theming.md) — gradient palette, theming
- [`seo-and-tentacles.md`](./docs/seo-and-tentacles.md) — programmatic SEO routes
- [`analytics-and-privacy.md`](./docs/analytics-and-privacy.md) — GA setup and dev guard
- [`monetization-roadmap.md`](./docs/monetization-roadmap.md) — speculative product directions
