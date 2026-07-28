# W4 Pest Management Website

Marketing site for W4 Pest Management, built with React and Vite.

## Local development

Requires [Node.js](https://nodejs.org/) 22+ and [pnpm](https://pnpm.io/) 9.

```bash
pnpm install
pnpm dev
```

The dev server runs at http://localhost:5173 by default.

## Deploy to Cloudflare Pages (Git)

This repo is set up for a **static** Cloudflare Pages deploy of the site in `artifacts/w4-pest-management`.

1. Push this repository to GitHub (or GitLab).
2. In the [Cloudflare dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**.
3. Select the repository and use these build settings:

| Setting | Value |
|--------|--------|
| **Framework preset** | None |
| **Build command** | `pnpm run build` (or `pnpm run build:pages`) |
| **Build output directory** | `artifacts/w4-pest-management/dist/public` |

Do **not** add a `wrangler.toml` at the repo root in this monorepo — Cloudflare will run Wrangler workspace detection and fail. Configure build command and output directory in the dashboard only.

4. Under **Environment variables**, you usually do not need any for a static build. Optional overrides:

| Variable | Purpose |
|----------|---------|
| `BASE_PATH` | Asset and router base path (default `/`) |
| `NODE_VERSION` | Set to `22` if the dashboard does not pick up [`.node-version`](.node-version) |

5. Deploy. Client-side routes work automatically: Cloudflare Pages treats the site as an SPA when there is no top-level `404.html` in the build output (see [Serving Pages](https://developers.cloudflare.com/pages/configuration/serving-pages/#single-page-application-spa-rendering)). Do **not** add `/* /index.html 200` to `_redirects` — Cloudflare rejects that rule as an infinite loop.

### Custom domain

After the first deploy, add your domain under **Custom domains** in the Pages project.

## Monorepo layout

| Path | Purpose |
|------|---------|
| `artifacts/w4-pest-management` | **Production static site** (deploy this) |
| `artifacts/api-server` | Replit API server (not used for static Pages hosting) |
| `artifacts/mockup-sandbox` | Internal mockup tooling |
| `lib/*` | Shared packages (workspace dependencies) |
