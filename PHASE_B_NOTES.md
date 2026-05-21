# Phase B notes — theme + gap-fill content

Phase B of the docs-site build: theme the Fumadocs site to the Cursor docs aesthetic (dark, brand-consistent) and write the content Phase A left as gaps — a card-grid landing, a top-level introduction, and the four per-section index pages. No infrastructure, no deploy.

Builds on Phase A (`29b5795`). Verified: `next build` static-exports clean; `next dev` serves every route `200`.

## Theming

Cursor-style three-column docs (Fumadocs provides the layout natively), dark by default, themed to the bkstr brand. Done entirely within Fumadocs' supported customization surface — CSS variables and the Next.js font setup; no framework internals were forked.

### Brand cues used

Pulled from the bkstr app (`bkstr.tmrwgroup.ai`, read-only) — `tailwind.config.ts` and `src/app/globals.css`:

- **Palette** — the app's `paper` / `ink` / `saffron` tokens. `paper #F4EFE5`, `ink #161613`, `saffron #C46A1F` / `saffron-dk #B05A14`.
- **Typefaces** — Newsreader (display), Geist (body / UI), JetBrains Mono (code) — the app's three families.
- **Wordmark** — `bkstr` always lowercase; the nav title is `bkstr docs`.

### What changed

- **`src/app/global.css`** — the theme. Overrides Fumadocs' `--color-fd-*` variables (from `fumadocs-ui/css/lib/default-colors.css`) in two blocks:
  - `:root` (light mode) — the bkstr app's literal cream palette: paper background, ink text, `saffron-dk` primary.
  - `.dark` (dark mode, the default) — a **warm near-black** built off the app's ink (`#141310` background, `#1a1813` cards) rather than a neutral grey, with a brightened saffron (`#e0904a`) as the accent so it carries contrast on dark. The neutral preset's grey sidebar tint is warmed to match.
  - `@theme` wires `--font-sans` (Geist), `--font-mono` (JetBrains Mono), `--font-serif` (Newsreader).
  - `h1, h2` use Newsreader — the bkstr editorial signature for page titles and section headings; body, nav, and code stay sans/mono.
- **`src/app/layout.tsx`** — swapped the scaffold's Inter for Geist + Newsreader + JetBrains Mono via `next/font/google`, exposed as CSS variables.
- **`src/components/provider.tsx`** — `RootProvider` set to `theme={{ defaultTheme: 'dark' }}`. Dark is the default; Fumadocs' light/dark toggle stays available, and light mode is themed to the bkstr cream palette.
- **`src/lib/shared.ts`** — `appName` → `bkstr docs`; `gitConfig` → the real `animesh-2tmorrow/bkstr-docs.tmrwgroup.ai` repo (was the Fumadocs scaffold default).
- **`src/app/(home)/page.tsx`** — replaced the scaffold's "Hello World" root page with a minimal branded splash (wordmark, one-line description, links into `/docs`). The site root is `docs.bkstr.tmrwgroup.ai/`; the documentation home is `/docs`.

Code blocks, the three-column layout, the on-page TOC, the search dialog, and the light/dark toggle are all Fumadocs-native — they inherit the themed CSS variables, no per-component styling needed.

## New content

All new pages are product documentation — declarative, low-marketing, matched to the 15 migrated pages' tone. Every factual claim was cross-checked against the migrated docs and the bkstr app. No emojis. Card descriptions reuse each target page's own `description` frontmatter for accuracy.

- **`content/docs/index.mdx`** — replaced the Phase A placeholder. The `/docs` landing: a short intro line, a four-card grid into the sections, and a three-card "Start here" grid (getting-started, installing, mcp). Uses Fumadocs' `<Cards>` / `<Card>`.
- **`content/docs/introduction.mdx`** — a new top-level "what is bkstr" orientation page: books vs skills, what owning an item means, the four ways an agent reaches bkstr, and where to go next. Kept tight — it links to `reference/concepts` for the deep model rather than duplicating it. **Decision:** the introduction is a standalone page, first in the nav (not folded into the landing) — the landing is a navigation surface, the introduction is a reading surface; separating them reads best.
- **Four section index pages** — `subscriber/index.mdx`, `agent/index.mdx`, `publisher/index.mdx`, `reference/index.mdx`. Each: a one-paragraph framing of who the track is for, then a card grid of the track's pages. These make `/docs/<section>` resolve instead of 404-ing (the Phase A gap).

### meta.json

- Root `content/docs/meta.json` — added `introduction` as the first nav entry: `["introduction", "subscriber", "agent", "publisher", "reference"]`.
- The four folder `meta.json` files were left unchanged. Fumadocs auto-detects a folder's `index.mdx` as that folder's index page and links the nav-group title to it; listing `index` in the `pages` array would duplicate it. The content pages keep their existing order.

## Verification

- `next build` — static export builds clean, no MDX errors. 20 doc pages: the `/docs` landing, `/docs/introduction`, the 4 section indexes, and the 15 migrated pages.
- `next dev` — every route returns `200`: `/`, `/docs`, `/docs/introduction`, all four `/docs/<section>`, and the migrated pages. No 404s on the section routes.
- Theme — the built CSS chunk carries the dark overrides (`#141310` background, `#e0904a` saffron), the light cream palette (`#f4efe5`, `#b05a14`), and all three font families. The `<html>` element carries the Geist / Newsreader / JetBrains Mono variable classes; dark is applied as the default theme.
- Search — `/api/search` serves `200`; the static Orama index covers the new pages.
- The 15 migrated pages render under the new theme — screenshots (bundled assets), code blocks, and cross-links intact (no migrated-page content was changed in Phase B).

## Open questions for Phase C / D / operator

1. **`metadataBase`** — still unset; Next.js warns during build (OG/social image base URL). Set it in Phase C once `docs.bkstr.tmrwgroup.ai` is the known origin.
2. **Card icons** — the `<Card>` grids use title + description + link, no icons. Fumadocs `<Card>` supports an `icon` prop; adding lucide icons would be a small polish if the operator wants the section cards more visual. Left out for v1.
3. **Light mode** — themed to the bkstr cream palette and kept (the toggle is free from Fumadocs). Dark is the default per the brief. If light mode should be dropped entirely, that is a one-line change in `provider.tsx`.
4. **The root `/` splash** — minimal by design. If `docs.bkstr.tmrwgroup.ai/` should instead redirect straight to `/docs`, note that a static export cannot do a server redirect; it would need a meta-refresh or a CloudFront rule (Phase C).
5. **Serif headings** — `h1, h2` site-wide use Newsreader. If a heading appears in UI chrome later (it does not today), the rule may need scoping to the content area.
