# Weight Tracker App

Simple full‑stack app to log daily weight & calories and track weekly/monthly goals.

```bash
# Prerequisites
npm i -g pnpm prisma
pnpm create vite weight-tracker --template react-ts
cd weight-tracker
pnpm add react-router-dom@6 tailwindcss postcss autoprefixer
npx tailwindcss init -p
# backend deps
pnpm add -w express cors prisma @prisma/client zod
pnpm add -w -D ts-node-dev typescript @types/express @types/cors
# tests
pnpm add -w -D jest ts-jest @types/jest supertest @types/supertest
```

1. Configure `.env` ⇒ `DATABASE_URL="postgresql://postgres:password@localhost:5432/weight_tracker?schema=public"`
2. `pnpm prisma migrate dev --name init`
3. `pnpm ts-node-dev backend/src/server.ts`
4. `pnpm dev` (frontend)

## Features

- **Daily Entry**: Log weight and calories for each day
- **Progress Tracking**: View weekly and monthly weight loss progress
- **Goal Tracking**: Set and monitor weekly/monthly weight loss goals
- **Visual Feedback**: Green for achieved goals, red for missed targets

## Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS
- **Backend**: Express + Prisma + PostgreSQL
- **Testing**: Jest + Supertest
