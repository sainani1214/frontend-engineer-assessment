# Frontend Engineer Assessment

This project implements the ClearSpot.ai assessment requirements using Next.js App Router, React Query, and a mock WebSocket setup.

## What’s Included

- **API client utility** with token handling and refresh support (`src/lib/api.ts`).
- **React Query data fetching** for sites with pagination and polling (`app/components/SiteList.tsx`).
- **Optimistic UI updates** for creating sites (`app/components/OptimisticSiteForm.tsx`).
- **WebSocket hook** with reconnect logic and a mock WebSocket implementation (`src/hooks/useWebSocket.ts`).
- **Real-time alarm list** with visual indicators for new items (`app/components/RealtimeAlarms.tsx`).
- **Error boundary** for UI-level error handling (`src/components/ErrorBoundary.tsx`).

## Running Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the demo.

## Useful Scripts

- `npm run dev` – start development server
- `npm run lint` – run ESLint
- `npm run test:unit` – run unit tests

## Notes & Assumptions

- API endpoints are mocked using Next.js route handlers under `app/api`.
- WebSocket updates use a **mock** URL defined in `config/app.config.ts` (`mock://alarms`) so the demo works without external dependencies.
- Token refresh is simulated via `POST /api/token/refresh`.

## File Map

- `app/page.tsx` – Demo page composition
- `app/components/*` – UI components for each requirement
- `src/lib/api.ts` – API client implementation
- `src/hooks/useSites.ts` – React Query sites hook
- `src/hooks/useWebSocket.ts` – WebSocket hook with reconnection
- `src/components/ErrorBoundary.tsx` – Error boundary component
- `config/app.config.ts` – App-level configuration
