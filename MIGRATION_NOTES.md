# Migration notes — Phase A

Phase A of the docs-site build: scaffold a Fumadocs static-export site and migrate the 15 existing bkstr docs pages + 65 screenshots into it. No theming, no new content, no infrastructure — those are Phases B–D.

Source (read-only): `C:\animesh\bkstr.tmrwgroup.ai\src\content\docs\` — the 15 markdown pages from the writing pass + the MCP polish pass.

## Scaffold

`create-fumadocs-app` v16, template `+next+fuma-docs-mdx+static`, Orama search, ESLint, `src/` layout. Next.js 16.2.6, fumadocs-ui / fumadocs-core 16.8.12, fumadocs-mdx 15.0.7, React 19.

- `next.config.mjs` ships `output: 'export'` (from the `+static` template) — the site builds to static HTML/CSS/JS, no server runtime.
- `package.json` `name` set to `bkstr-docs`, `private: true`.
- One config change beyond the scaffold: `images: { unoptimized: true }` added to `next.config.mjs` — see "MDX / build fixes" below.

The `create-fumadocs-app` CLI is interactive and its clack select-prompts ignore piped stdin (a piped newline toggles the selection instead of confirming). Every prompt had to be pre-answered with a flag: `--template`, `--search`, `--pm`, `--linter`, `--src`, `--og-image`, `--install`, `--no-git`. Recorded here so the scaffold is reproducible.

## Folder mapping

The 15 flat source files carried a `track` frontmatter field (`subscriber` / `agent` / `publisher` / `shared`). Fumadocs groups nav by folder, so each track became a folder under `content/docs/`:

| Folder | meta.json title | Pages (in order) |
|---|---|---|
| `subscriber/` | Subscribers | getting-started, installing, your-library, billing |
| `agent/` | Agent developers | cli, api, qa-endpoint, scripting, mcp |
| `publisher/` | Publishers | authoring-books, authoring-skills, pricing, catalog-management |
| `reference/` | Reference | concepts, glossary |

**Decision — the two `shared`-track pages (`concepts`, `glossary`) went into a `reference/` folder**, not loose at the top level of `content/docs/`. A folder gives them a clean fourth nav group ("Reference"); loose top-level files would sit oddly alongside the three section folders, and "shared" is an in-app-renderer concept that does not need to surface to readers. Operator can rename `reference/` in Phase B if preferred.

Nav order is encoded in `meta.json` files (Fumadocs' `pages` array), using the old `order` frontmatter values. The root `content/docs/meta.json` orders the four sections: `subscriber, agent, publisher, reference`.

## Frontmatter transform

Applied to all 15 files:

| Source field | Action |
|---|---|
| `title` | kept verbatim |
| `summary` | renamed to `description` (Fumadocs' field name) |
| `track` | dropped — folder placement replaces it |
| `order` | dropped — `meta.json` `pages` arrays replace it |
| `role` | dropped — all pages are public on the standalone site |

The transform was applied by a one-off script (`C:\tmp\migrate-docs.js`), not committed to the repo.

## Screenshots

65 PNGs copied from `bkstr.tmrwgroup.ai/public/docs/screenshots/` to `bkstr-docs.tmrwgroup.ai/public/docs/screenshots/`.

**Decision — image reference paths were left unchanged.** The source MDX references images as `/docs/screenshots/<name>.png`; keeping the same `public/docs/screenshots/` path means zero edits to 65 image references across the files (less churn, less risk). Under `output: 'export'` there is no `/docs/*` route-vs-static-file collision — the static export writes plain files.

Note on how Fumadocs handles these: fumadocs-mdx resolves the absolute `/docs/screenshots/...` paths against `public/` and imports each image as a static asset, bundled into `/_next/static/media/<name>.<hash>.png`. The built pages reference the bundled hashed path; the verbatim `public/docs/screenshots/` copies are also emitted to `out/docs/screenshots/` but are then unreferenced. This duplication (~a few MB) is harmless; a later phase could prune it. The `public/docs/screenshots/` copies must stay — they are the source fumadocs-mdx imports from.

## MDX / build fixes

Fumadocs compiles `.mdx`, which is stricter than the CommonMark the old in-app renderer (`react-markdown`) used. Three classes of issue:

1. **HTML comments → MDX comments.** MDX has no `<!-- ... -->` syntax; an HTML comment breaks the compile. The source uses `<!-- capture: <id> -->` markers above every screenshot (editorial cross-references to the screenshot-capture tooling), plus `<!-- SCREENSHOT NEEDED: ... -->` placeholders in `mcp.md`. **60 occurrences across 11 files** were converted to `{/* ... */}` (MDX comment syntax), preserving the marker text. Per-file counts: `cli` 17, `getting-started` 9, `authoring-books` 7, `installing` 7, `mcp` 4, `your-library` 4, `pricing` 4, `authoring-skills` 3, `catalog-management` 3, `billing` 1, `scripting` 1. (`api`, `qa-endpoint`, `concepts`, `glossary` had none.)

2. **Angle-bracket placeholders — audited, no fix needed.** The recon flagged `<slug>`, `<book-id>`, `<dir>`, `<path>`, `<uuid>`, `<message>`, `<CODE>` etc. as an MDX hazard (an angle-bracket in prose parses as a JSX tag). Audit result: **every `<...>` occurrence in all 15 files was already inside a fenced code block or inline-code backticks** — MDX does not parse inside code, so none would break the build and none needed a fix. The writing-pass authors were consistent about backticking placeholders. A clean `next build` confirms it (zero MDX parse errors).

3. **`images: { unoptimized: true }`.** Not a content fix — a static-export requirement. Fumadocs renders markdown images through `next/image`. Without `unoptimized`, the built `<img>` `src` is `/_next/image?url=...` — the Next.js image-optimization endpoint, which **does not exist on a static host** (S3/CloudFront); all 65 screenshots would 404. With `unoptimized: true`, `next/image` emits direct asset paths (`/_next/static/media/<name>.<hash>.png`) which are real files in the static export. Verified: after the change, the first CLI-page image `src` resolves to a file present in `out/`.

## Internal link rewrites

Two kinds, both mechanical (applied by the migration script):

- **Doc-to-doc links — 30 rewrites.** `/dashboard/docs/<slug>` → `/docs/<track>/<slug>`. The new site mounts docs at `/docs` (Fumadocs default) and the page now lives under its track folder, so both the route prefix and the path gained a segment. Example: `/dashboard/docs/api` → `/docs/agent/api`.
- **bkstr-app links — 24 rewrites.** `/dashboard/...` and `/storefront...` (e.g. `/dashboard/api-keys`, `/dashboard/library`, `/storefront`) → absolute `https://bkstr.tmrwgroup.ai/...`. On the separate docs domain a root-relative `/dashboard/...` would resolve to `docs.bkstr.tmrwgroup.ai/dashboard/...` and 404; absolutizing to the canonical production host is required. This assumes `https://bkstr.tmrwgroup.ai` is the permanent production host — it is, per the deployed app.

All 30 doc-to-doc targets resolve — every link points at one of the 15 migrated pages, and all 16 doc routes (`/docs` + 15) return `200` in `next dev`.

## Placeholder index page

`content/docs/index.mdx` is a minimal placeholder — a title and a four-item list linking the tracks — so `/docs` does not 404. It carries a `{/* Phase A placeholder */}` marker. The scaffold's demo `index.mdx` and `test.mdx` were deleted. The real card-grid landing page is Phase B.

## Verification

- `npm run build` — static export succeeds, no MDX parse errors. 16 doc pages generated (`/docs` + 15), 54 static routes total (including the per-page `llms.mdx` and `og` variants).
- `next dev` — all 16 doc routes return `200`. Screenshots resolve to bundled asset files present in `out/`. The four-track nav grouping (Subscribers / Agent developers / Publishers / Reference) renders in the page HTML.
- Search — `/api/search` serves the static Orama index (≈671 KB JSON); a `query=install` request returns the indexed document set across all pages. Search is fully static (client downloads the index — no server).

## Open questions for Phase B / operator

1. **`reference/` folder name** — chosen over `shared` or loose top-level placement. Rename if a different label reads better.
2. **No per-section landing pages.** `/docs/subscriber`, `/docs/agent`, `/docs/publisher`, `/docs/reference` have no page — the folders are nav groups only, so hitting a bare section URL 404s. Per-section card-grid intro pages are a Phase B gap (recon §4).
3. **Placeholder `index.mdx`** — replace with the themed card-grid landing in Phase B.
4. **`metadataBase` build warning** — Next.js wants an absolute base URL for OG/social image resolution; set it in Phase C once `docs.bkstr.tmrwgroup.ai` is wired.
5. **Screenshot duplication in `out/`** — bundled (`/_next/static/media/`) plus verbatim (`/docs/screenshots/`); cosmetic, prune in a later phase if desired.
