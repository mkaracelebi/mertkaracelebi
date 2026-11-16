# Lydion Energy website

Static site for Lydion Energy, built with [Astro](https://astro.build) and hosted on Cloudflare.

## Run it locally

```sh
npm install
npm run dev        # http://localhost:4321
npm run build      # builds to dist/ and runs the copy check
npm run preview    # serves the built site
```

Needs Node 22.23 or newer (`.node-version` pins 24 for Cloudflare builds).

## Where to edit things

| What | File |
|---|---|
| Email, links, KvK and BTW numbers, location | `src/data/site.ts` |
| Final domain (canonical URLs, sitemap, Open Graph) | `astro.config.mjs` (`SITE_URL`) and `public/robots.txt` |
| Publications, abstracts, BibTeX | `src/data/publications.ts` |
| Services copy | `src/components/Services.astro` |
| Expertise and the RMS/EMT table | `src/components/Expertise.astro` |
| About, timeline, short bio | `src/components/About.astro` |
| Neural dynamics project page | `src/pages/research/neural-dynamics.astro` |
| Colours and type scale | `src/styles/tokens.css` |

Fields left empty in `site.ts` are not rendered, so nothing half-finished shows up.

## Brand assets

- `src/lib/mark.js` is the Lydion mark as vector geometry, traced from the original artwork. The header, hero, favicon and social image all draw from it.
- `src/lib/flow.js` is the potential-flow maths behind the hero lines, the dividers and the social image.
- `npm run og` regenerates `public/og.png`, `favicon.svg`, `favicon.ico` and `apple-touch-icon.png`. Run it after changing the mark or the tagline. It uses the fonts in `scripts/fonts/` (SIL Open Font License).

## Copy rules

`npm run build` ends with `scripts/check-copy.mjs`, which fails the build on em dashes, en dashes and a short list of banned words. Use a plain hyphen for ranges.

## Deploy on Cloudflare (GitHub connection)

The site is fully static, so either Cloudflare product works.

**Workers (recommended):** Workers & Pages, Create, Import a repository, pick this repo.

- Build command: `npm run build`
- Deploy command: `npx wrangler deploy` (reads `wrangler.jsonc`)

**Pages:** Workers & Pages, Create, Pages, Connect to Git.

- Framework preset: Astro
- Build command: `npm run build`
- Build output directory: `dist`

Either way, every push to `main` redeploys. Then add the custom domain under the project's Domains settings and update `SITE_URL`.

`public/_headers` sets security headers and long-lived caching for hashed assets. Both Workers static assets and Pages apply it.

## Before going live

- [ ] Final domain in `astro.config.mjs` and `public/robots.txt`
- [ ] Google Scholar link, KvK and BTW numbers in `src/data/site.ts`
- [ ] Read through the service wording and the first-person bio
- [ ] Co-authors of the 2022 CIGRE paper, if it should list them
- [ ] Confirm the photo of Mert at the whiteboard can be used (credited to Marieke de Lorijn)
