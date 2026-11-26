# The Listening Room

A personal vinyl collection site with a warm 1970s hi-fi aesthetic. The first milestone is a static React + TypeScript + Vite app with a responsive collection grid, search, genre filtering, sorting, favorites, and shareable album-detail URLs.

> **Sample data:** Every record currently shown is fictional sample data. The UI, source data, detail view, and footer label it accordingly. No Discogs account is needed for this milestone.

## Run locally

Requirements: Node.js 20.19+ or 22.12+ (Node 22 recommended) and pnpm. Corepack, included with Node, can enable pnpm for you.

```bash
corepack enable
pnpm install
pnpm dev
```

Open the local URL printed by Vite. Other useful commands:

```bash
pnpm typecheck
pnpm build
pnpm preview
```

The production build is written to `dist/`.

## Deploy to GitHub Pages

The repository includes `.github/workflows/deploy.yml`, and Vite uses relative asset paths so the site works at either a repository URL (`username.github.io/repository`) or a custom domain.

1. Create a GitHub repository and push this project to its `main` branch.
2. On GitHub, open **Settings → Pages**.
3. Under **Build and deployment**, set **Source** to **GitHub Actions**.
4. Push to `main`, or run **Deploy to GitHub Pages** from the Actions tab.
5. When the workflow completes, the Pages URL appears in the deployment summary.

Album details use hash URLs (for example `#/album/sample-afterglow`), so direct links work on GitHub Pages without server-side rewrite rules.

## Catalog shape and future Discogs sync

The app renders the normalized types in `src/types.ts`, not raw Discogs responses. This keeps the UI stable if the upstream API changes. A future sync should:

1. Run outside the browser—preferably in a scheduled GitHub Action, small serverless function, or local script.
2. Read a Discogs personal access token from a protected server environment or GitHub Actions secret such as `DISCOGS_TOKEN`.
3. Fetch the collection, normalize it into `CatalogSnapshot`, and write a public JSON snapshot containing only fields intended for the site.
4. Let the frontend fetch that generated JSON at build time or runtime.

Never add a Discogs token to a `VITE_...` variable: Vite exposes those values to every visitor. `.env` files are ignored as an extra safeguard, but secrets should still live only in the sync environment.

The normalized album schema already includes optional Discogs release, master, collection-instance, and last-sync identifiers. Placeholder covers can later be replaced by the generated `image` field.

## Project structure

```text
src/
  components/       Album card, artwork, and detail dialog
  data/             Explicitly labeled sample catalog
  App.tsx            Catalog experience and URL state
  types.ts           Discogs-ready normalized schema
  styles.css         Responsive hi-fi visual system
.github/workflows/   GitHub Pages deployment
```
