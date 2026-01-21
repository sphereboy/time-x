# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Time-X is a timezone comparison tool built with Next.js 14. It displays multiple timezone clocks with visual day/night gradients based on the time of day. Users can add locations, customize labels, and manually adjust the time for comparison purposes.

## Commands

```bash
npm run dev     # Start development server (http://localhost:3000)
npm run build   # Production build
npm run start   # Start production server
```

No test suite is configured.

## Architecture

### State Management
- **Zustand store** (`src/store/timeZoneStore.ts`): Central state for locations, current time, and settings
- State is persisted to localStorage via zustand/middleware `persist`
- Locations are auto-sorted by offset relative to the home timezone

### Key Components
- `TimeZoneComparer` (`src/components/TimeZoneComparer.tsx`): Main component containing:
  - Clock display with editable hours (click to adjust time manually)
  - Day/night background colors interpolated from a 24-hour color palette
  - `timeZoneMapping` object mapping friendly names to IANA timezone identifiers
- `AddLocationDialog`: Modal for adding new timezone locations
- UI components in `src/components/ui/`: Radix UI primitives (dialog, select, button, etc.)

### Data Flow
1. `useTimeZoneStore` hook provides locations and settings
2. `TimeZoneComparer` renders location columns with real-time updates (1s interval)
3. Time formatting uses `Intl.DateTimeFormat` with IANA timezone identifiers
4. Manual time adjustments set `isManuallyAdjusted` flag, pausing auto-updates

### Types
- `TimeZoneLocation` (`src/types/Location.ts`): Core type with id, name, label (IANA tz), offset, isCurrent flag, and optional secondaryLabels

### Styling
- Tailwind CSS with CSS Modules for component-specific styles
- `TimeZoneComparer.module.css` contains the main layout styles
- Dynamic background colors calculated from hour (0-23) via color interpolation

## Path Alias

`@/*` maps to `./src/*` (configured in tsconfig.json)
