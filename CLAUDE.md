# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

RouteHair is a sales route optimization web app targeting hair salons/beauty shops in Seoul and Gyeonggi regions. The app helps sales representatives optimize their daily visit routes by selecting 5-10 locations and generating an optimized route.

**Key constraint**: No database is used. All data management relies on mock data and browser localStorage.

## Development Commands

```bash
# Development server with Turbopack
npm run dev

# Production build
npm run build

# Start production server
npm start

# Lint
npm run lint
```

Development server runs at http://localhost:3000

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS with blue-themed color scheme
- **UI Components**: Shadcn UI (Radix UI primitives)
- **Icons**: Lucide React
- **State Management**: React hooks (no external state library)
- **Data Storage**: Mock data + localStorage (no database)

## Architecture

### Component Structure

The app follows a three-column layout (filters | map | list/details):

- **`app/`**: Next.js App Router pages
  - `page.tsx`: Main dashboard (Client Component with state management)
  - `history/page.tsx`: Visit history page
  - `layout.tsx`: Root layout with metadata

- **`components/`**: Organized by feature
  - `filters/`: Region/category filtering components
  - `map/`: Kakao Map integration (currently placeholder)
  - `salon/`: Salon list and selection UI
  - `route/`: Route optimization panel
  - `visit/`: Visit checklist and tracking
  - `ui/`: Shadcn UI primitives

- **`lib/`**: Core logic and data
  - `types.ts`: TypeScript type definitions for Salon, Route, Visit, etc.
  - `utils.ts`: Utility functions (cn helper)
  - `utils/filters.ts`: Filtering logic
  - `mock-data/`: Sample data for salons, visits, regions

### Key Type Definitions

See `lib/types.ts` for complete definitions:
- `Salon`: Business location with coordinates, address, category
- `Route`: Optimized route with stops and distance/time calculations
- `Visit`: Visit record with completion status and memo
- `RegionFilter`: City/district filtering
- `CategoryFilter`: "미용실" | "헤어샵" | "살롱" | "전체"

### Data Flow

1. **Filtering**: User selects city (서울/경기) → district → category → filters salon list
2. **Selection**: User checks 5-10 salons from filtered list
3. **Optimization**: Algorithm calculates optimal visit order (Phase 4 - not yet implemented)
4. **Tracking**: User checks off visits and adds memos → saved to localStorage (Phase 5 - not yet implemented)

### Regional Data Structure

- **Seoul**: 25 districts (구) defined in `lib/mock-data/regions.ts`
- **Gyeonggi**: 28 cities (시) defined in `lib/mock-data/regions.ts`
- District/city dropdown dynamically updates based on selected city

## Implementation Phases

Development follows a phased approach detailed in `SPEC.md`:

- **Phase 1** ✅: Filter functionality with state management
- **Phase 2** ✅: Salon selection (5-10 limit) and route optimizer panel integration
- **Phase 3** ⏳: Kakao Map API integration with markers
- **Phase 4** ⏳: Route optimization algorithm (Nearest Neighbor/TSP)
- **Phase 5** ⏳: Visit checklist with localStorage persistence
- **Phase 6** ⏳: Mobile responsiveness and UX improvements
- **Phase 7** ⏳: Performance optimization and deployment

When implementing new features, refer to the relevant phase in `SPEC.md` for detailed requirements and verification checklist.

## Important Patterns

### Server vs Client Components

- Default to Server Components for Next.js App Router
- Use `"use client"` directive only when necessary:
  - State management (useState, useReducer)
  - Event handlers (onClick, onChange)
  - Browser APIs (localStorage, geolocation)
  - Effects (useEffect)

### Styling Conventions

- Use Tailwind utility classes
- Blue color scheme: `bg-blue-50`, `text-blue-600`, `border-blue-200`, etc.
- Shadcn UI components in `components/ui/` should not be modified directly
- Custom styling via className props and Tailwind

### Path Aliases

TypeScript paths are configured with `@/*` pointing to the root:
```typescript
import { Salon } from "@/lib/types"
import { cn } from "@/lib/utils"
```

## Data Management

### Mock Data Location

- Salons: `lib/mock-data/salons.ts` (25 sample salons across Seoul/Gyeonggi)
- Visits: `lib/mock-data/visits.ts` (sample visit records)
- Regions: `lib/mock-data/regions.ts` (Seoul districts, Gyeonggi cities)
- Export aggregation: `lib/mock-data/index.ts`

### localStorage Strategy (Phase 5)

Visit records will be stored as:
```typescript
// Key: "routehair_visits"
// Value: Visit[] serialized as JSON
```

No database connection required - all persistence is browser-based.

## Future Integrations

### Kakao Map API (Phase 3)

- API key will be stored in `.env.local` as `NEXT_PUBLIC_KAKAO_MAP_KEY`
- Script tag to be added in `app/layout.tsx`
- Map component: `components/map/kakao-map.tsx`

### Route Optimization (Phase 4)

- Algorithm location: `lib/utils/route-optimizer.ts` (to be created)
- Use Haversine formula for distance calculation
- Implement Nearest Neighbor heuristic for TSP
- Modes: "time" (distance × 1.2 weight) or "distance"

## Testing Checklist for Changes

When modifying filters or selection:
1. Verify Seoul/Gyeonggi city selection updates district dropdown
2. Confirm 5-10 salon selection limit enforcement
3. Check that selected salon count badge updates in route optimizer panel
4. Ensure filter changes reflect immediately in salon list
5. Test mobile responsiveness (375px, 768px, 1024px+)

## Known Limitations

- Map is currently a placeholder (gray box) - Phase 3 required for Kakao Map
- Route optimization button is disabled until 5+ salons selected
- Visit checklist displays only first selected salon - full implementation in Phase 5
- No backend - all data is static or localStorage-based
