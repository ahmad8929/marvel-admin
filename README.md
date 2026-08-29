# marvels-admin

Staff admin panel for **Marvel's Online Clothings**.
Vite · React 19 · TypeScript · **Refine** · **Ant Design**.

Static SPA — built and deployed to the Hostinger `admin.marvelsonline.in` subdomain.
Consumes `marvels-api` at `VITE_API_URL` (`/api/v1/admin/*`).
Full spec: [`../docs/BUILD_BRIEF.md`](../docs/BUILD_BRIEF.md).

## Getting started

```bash
npm install
cp .env.example .env.local
npm run dev            # http://localhost:5173
```

## Scripts

| Command | What |
|---|---|
| `npm run dev` | Vite dev server on :5173 |
| `npm run build` | Type-check + production build to `dist/` |
| `npm run preview` | Serve the production build |
| `npm run lint` | oxlint |

## Structure

```
src/
  App.tsx              Refine provider + AntD ConfigProvider + routes
  theme.ts             brand palette mapped to Ant Design tokens
  config.ts            env-derived API / media URLs
  providers/           dataProvider (simple-rest) · authProvider (JWT stub → Phase 5)
  pages/               screens (Dashboard placeholder now; CRUD in Phase 5)
```

## Deployment

`npm run build` → upload `dist/` to the `admin.marvelsonline.in` docroot.
Add an `.htaccess` SPA fallback (rewrite non-file requests to `/index.html`) and,
optionally, an IP allow-list.

## Status

Phase 0 — scaffold. Refine + AntD wired with the brand theme; resources registered;
Dashboard is a placeholder.
