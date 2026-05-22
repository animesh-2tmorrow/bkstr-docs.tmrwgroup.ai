# bkstr-docs.tmrwgroup.ai

The bkstr documentation site — [Fumadocs](https://fumadocs.dev) on Next.js,
built as a static export and served at **docs.bkstr.tmrwgroup.ai** from S3 +
CloudFront.

## Develop

```bash
npm install
npm run dev
```

Open http://localhost:3000. Documentation content lives in `content/docs/`
(MDX + `meta.json` nav files); the three-column layout, theme, and search are
Fumadocs.

## Build

```bash
npm run build
```

`next build` produces a static export in `out/` (`output: 'export'` in
`next.config.mjs`) — flat-file HTML, no server runtime.

## Deploy

The site is hosted on AWS in account `049405321468`:

| Resource | Value |
|---|---|
| S3 bucket | `bkstr-docs-site-049405321468` (private; CloudFront-only via OAC) |
| CloudFront distribution | `E2HM3KB7UUXCJR` |
| Domain | `docs.bkstr.tmrwgroup.ai` |

Deploy with:

```bash
npm run deploy
```

That runs `deploy/deploy.sh`, which:

1. `next build` — produces the static export in `out/`.
2. `aws s3 sync out/ s3://bkstr-docs-site-049405321468/ --delete` — uploads
   the site; `--delete` prunes pages removed since the last deploy.
3. `aws cloudfront create-invalidation … --paths "/*"` — clears the CDN cache
   so the new content is served immediately.

Prerequisite: the AWS CLI configured with the default profile (account
`049405321468`). The deploy is a manual script; a push-to-`main` GitHub Action
is a possible future enhancement.

## Project layout

| Path | Description |
|---|---|
| `content/docs/` | MDX documentation pages + `meta.json` nav files |
| `public/docs/screenshots/` | Screenshot assets referenced by the docs |
| `src/app/` | Next.js App Router — `(home)`, `docs`, `api/search` |
| `src/lib/source.ts` | Fumadocs content-source adapter |
| `src/app/global.css` | Theme — the bkstr palette, fonts, dark default |
| `deploy/deploy.sh` | Build + S3 sync + CloudFront invalidation |
