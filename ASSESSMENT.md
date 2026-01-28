# Frontend Engineer Assessment – Implementation Notes

## Summary
This repository implements the assessment requirements in a minimal Next.js App Router project. The core features (API client, React Query integration, WebSocket hook, real‑time UI updates, error handling, and optimistic updates) are included and documented.

## Deliverables Mapping

- **API Client Utility** ✅
  - File: `src/lib/api.ts`
  - Auth header support + refresh endpoint handling

- **Replace Mock Data with Real API** ✅
  - Files: `src/hooks/useSites.ts`, `app/components/SiteList.tsx`
  - Pagination, loading/error UI, refetch interval

- **WebSocket Hook** ✅
  - File: `src/hooks/useWebSocket.ts`
  - Connection lifecycle + reconnection

- **Real-time Updates Component** ✅
  - File: `app/components/RealtimeAlarms.tsx`
  - Visual indicator for new alarms

- **Error Handling & UX** ✅
  - File: `src/components/ErrorBoundary.tsx`
  - Retry UI and safe fallback

- **Optimistic Updates** ✅
  - File: `app/components/OptimisticSiteForm.tsx`

- **Testing** ✅
  - File: `src/lib/api.test.ts`, `src/hooks/useWebSocket.test.tsx`

## How to Run

```bash
npm run dev
```

## Assumptions

- Local mock API endpoints are sufficient for assessment demonstration.
- WebSocket demo uses a mock URL by default (`mock://alarms`).
