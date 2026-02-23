# Tars Chat — Real-time Messaging App

A full-stack real-time chat application built with **Next.js**, **Convex**, **Clerk**, and **Tailwind CSS**.

## Features

- **Authentication** — Sign up / sign in with email or social login via Clerk
- **User List & Search** — Browse and search all registered users by name
- **1-on-1 Direct Messages** — Private conversations with real-time updates via Convex subscriptions
- **Group Chat** — Create group conversations with multiple members
- **Message Timestamps** — Smart formatting: today → time only, this year → date+time, older → full date
- **Date Separators** — "Today", "Yesterday", or date label between message day groups
- **Empty States** — Helpful messages throughout the UI when there's nothing to show
- **Responsive Layout** — Desktop: sidebar + chat side-by-side; Mobile: full-screen chat with back button
- **Online/Offline Status** — Green indicator for online users, updated in real time via heartbeat
- **Typing Indicator** — "Alex is typing…" with animated pulsing dots, clears on send or 2s inactivity
- **Unread Message Badges** — Per-conversation unread count badge, cleared automatically when opened
- **Smart Auto-Scroll** — Auto-scrolls to newest messages; shows "↓ New messages" button when scrolled up
- **Soft Delete Own Messages** — Shows "This message was deleted" in italics (record kept in DB)
- **Emoji Reactions** — React with 👍 ❤️ 😂 😮 😢; click again to remove; reaction counts displayed
- **Skeleton Loaders** — Skeleton UI for all async loading states
- **Error Handling** — Send failure shows error with retry button

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Backend / DB / Realtime | Convex |
| Authentication | Clerk |
| Styling | Tailwind CSS v4 |
| Component Library | shadcn/ui |
| Deployment | Vercel |

## Local Development Setup

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd tars-assig
pnpm install
```

### 2. Create a Convex Project

```bash
npx convex dev
```

Follow the prompts to create a new project. This generates `convex/_generated/` with proper TypeScript types.

### 3. Set Up Clerk

1. Create an account at [clerk.com](https://clerk.com) and create a new application
2. Go to **Configure → JWT Templates** → Create a template named `convex`
3. Copy the **Issuer Domain** (e.g. `https://xxxx.clerk.accounts.dev`)

### 4. Configure Environment Variables

Create `.env.local` with:

```env
NEXT_PUBLIC_CONVEX_URL=https://xxxx.convex.cloud
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/chat
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/chat
CLERK_JWT_ISSUER_DOMAIN=https://xxxx.clerk.accounts.dev
```

### 5. Set Convex Environment Variable

```bash
npx convex env set CLERK_JWT_ISSUER_DOMAIN https://xxxx.clerk.accounts.dev
```

### 6. Run Dev Servers

```bash
# Terminal 1: Convex backend
npx convex dev

# Terminal 2: Next.js frontend
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000)

## Deployment (Vercel)

1. Push to a public GitHub repo
2. Import into [Vercel](https://vercel.com) — it detects Next.js automatically
3. Add all environment variables in Vercel project settings
4. For Convex: run `npx convex deploy` or configure it in CI/CD

