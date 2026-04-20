# Issue Tracker — Frontend

A React + TypeScript + Vite single-page application for tracking and managing issues. Built with Tailwind CSS, shadcn/ui, TanStack Query, and Zustand.

## Tech Stack

| Layer       | Choice                          |
| ----------- | ------------------------------- |
| Framework   | React 18                        |
| Language    | TypeScript 5 (strict)           |
| Build tool  | Vite                            |
| Styling     | Tailwind CSS + shadcn/ui        |
| State       | Zustand (auth), TanStack Query (server state) |
| HTTP Client | Axios (with interceptors)       |
| Routing     | React Router v6                 |
| Validation  | Zod                             |
| Package mgr | pnpm                            |

## Features

- **Authentication** — register, login, logout with JWT access token + httpOnly refresh cookie
- **Session persistence** — auto-restores session on page refresh via `/auth/me`
- **Issue list** — paginated, filterable by status/priority/severity, searchable, sortable
- **Issue detail** — full issue view with comments
- **Dashboard** — issue stats and overview
- **Protected routes** — redirects unauthenticated users to login
- **Token refresh** — silent access token rotation on 401 responses

## Project Structure

```
src/
├── api/
│   ├── client.ts         # Axios instance with auth interceptors + token refresh
│   └── auth.api.ts       # Auth endpoint calls
├── components/
│   ├── UI/               # Reusable UI primitives (shadcn/ui)
│   ├── auth/             # Auth-specific components
│   ├── dashboard/        # Dashboard widgets
│   ├── issues/           # Issue list, filters, cards
│   └── layout/           # App shell, navbar, sidebar
├── features/
│   ├── auth/             # Login/register pages + hooks
│   └── issues/           # Issues list, detail pages + hooks
├── hooks/
│   └── useAuthInitializer.ts  # Restores session on app load
├── store/
│   └── authStore.ts      # Zustand auth state
├── router.tsx            # Route definitions + guards
├── types/                # Shared TypeScript types
└── utils/                # Helper functions
```

## Getting Started

### Prerequisites

- Node.js 20+
- pnpm 9+
- Backend API running (see [issue-tracker-backend](../issue-tracker-backend))

### Installation

```bash
# 1. Install dependencies
pnpm install

# 2. Set up environment variables
cp .env.example .env
# Set VITE_API_URL to your backend URL

# 3. Start dev server
pnpm dev
```

Dev server runs at [http://localhost:3000](http://localhost:3000).

### Environment Variables

| Variable        | Description                  | Example                          |
| --------------- | ---------------------------- | -------------------------------- |
| `VITE_API_URL`  | Backend API base URL         | `http://localhost:8080`          |

### Scripts

| Script         | Purpose                          |
| -------------- | -------------------------------- |
| `pnpm dev`     | Start dev server (port 3000)     |
| `pnpm build`   | Type-check + build for production |
| `pnpm lint`    | Run ESLint                       |

## Demo Account

```
Email:    demo@example.com
Password: Demo1234!
```

## Deployment

Deployed on **Vercel** with automatic deploys on push to `main`.

- Set `VITE_API_URL` in Vercel environment variables to your backend HTTPS URL
- `vercel.json` handles SPA routing (all paths serve `index.html`)

## License

MIT
