# Calculate Future

A scalable, SEO-first Indian finance calculator platform built on Next.js 14 (App Router) + TypeScript. Designed to grow from a handful of calculators to 500+ pages **without creating new files per page** — every calculator, guide, category, and sitemap entry is derived from two configuration files.

## Quick start

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build — statically pre-renders every page
npm run start    # serve the production build
```

## The core idea: one config file drives everything

```
config/calculators.config.ts   ← every calculator on the site
config/guides.config.ts        ← every guide/article on the site
```

Adding calculator #10, #50, or #500 means **appending one object** to the `CALCULATORS` array in `config/calculators.config.ts`. That single edit automatically:

1. Creates a live, statically-generated page at `/{slug}` (e.g. `/lumpsum-calculator`) — via `generateStaticParams()` in `app/[slug]/page.tsx`, which reads directly from the config array.
2. Generates the page's `<title>`, meta description, canonical URL, Open Graph tags, and Twitter Card tags — via `lib/seo.ts`'s `buildMetadata()`.
3. Adds the URL to `sitemap.xml` — `app/sitemap.ts` maps over the same `CALCULATORS` array.
4. Lists the calculator on `/calculators` and its `/category/{category}` page.
5. Makes it available to the **Related Calculators** widget on any other calculator page that lists its slug in `relatedSlugs`.
6. Wires up FAQ schema (`FAQPage`), Breadcrumb schema (`BreadcrumbList`), and calculator schema (`WebApplication`) automatically.
7. Renders a fully interactive calculator widget — the generic `<CalculatorWidget />` component reads `fields[]` (sliders/inputs) and `compute()` (the math) straight from your config entry. No bespoke React component needed per calculator.

**Nothing else needs to be touched.** No new route files, no manual sitemap edits, no separate metadata files.

### Adding a new calculator — example

```ts
// config/calculators.config.ts
{
  slug: 'lumpsum-calculator',
  id: 'lumpsum',
  name: 'Lumpsum Calculator',
  shortName: 'Lumpsum',
  category: 'investment',
  metaTitle: 'Lumpsum Calculator — ...',
  metaDescription: '...',
  keywords: ['lumpsum calculator', ...],
  h1: 'Lumpsum Calculator — ...',
  introParagraph: '...',
  explanation: `Paragraph one.\n\nParagraph two. (Aim for 800+ words for strong SEO.)`,
  formula: { title: '...', expression: 'FV = P × (1 + r)^n', variables: [...] },
  example: { title: '...', steps: [...], result: '...' },
  benefits: ['...', '...'],
  faqs: [{ question: '...', answer: '...' }],
  fields: [
    { id: 'principal', label: 'Investment Amount', unit: '₹', min: 1000, max: 10000000, step: 1000, defaultValue: 100000 },
    { id: 'rate', label: 'Expected Return', unit: '%', min: 1, max: 30, step: 0.5, defaultValue: 12 },
    { id: 'years', label: 'Duration', unit: 'years', min: 1, max: 40, step: 1, defaultValue: 10 },
  ],
  compute: (v) => {
    const fv = lumpsumFutureValue(v.principal, v.rate, v.years);
    return {
      headline: { label: 'Future Value', value: formatINR(fv) },
      items: [{ label: 'Gains', value: formatINR(fv - v.principal) }],
    };
  },
  relatedSlugs: ['sip-calculator', 'cagr-calculator'],
}
```

Run `npm run build` and `/lumpsum-calculator` exists, fully SEO-optimized, in the sitemap, and cross-linked — with zero other files touched.

## Adding a new guide

Same pattern in `config/guides.config.ts` — append one `GuideConfig` object and `/guides/{slug}` is live, in the sitemap, and cross-linked to relevant calculators/guides.

## Folder structure

```
app/
  layout.tsx              Root layout — <html>, global metadata defaults, Header/Footer
  page.tsx                Homepage
  sitemap.ts              Auto-generated sitemap.xml (reads both config files)
  robots.ts               Auto-generated robots.txt
  not-found.tsx           404 page
  [slug]/page.tsx         ★ Dynamic calculator page — one file serves every calculator
  calculators/page.tsx    Calculator index, grouped by category
  category/[category]/page.tsx   Category pages (investment, loan, savings, retirement, tax, planning)
  guides/page.tsx         Guide index
  guides/[slug]/page.tsx  ★ Dynamic guide page — one file serves every guide

config/
  site.ts                 Site-wide constants (name, domain, description, social handles)
  calculators.config.ts   ★★★ THE calculator database — add entries here
  guides.config.ts        ★★★ THE guide database — add entries here

lib/
  types.ts                TypeScript contracts for CalculatorConfig / GuideConfig
  formulas.ts             Pure calculation functions (SIP, EMI, FD, RD, PPF, NPS, CAGR, inflation, SWP, amortization)
  seo.ts                  buildMetadata() — single source of truth for <head> tags
  schema.ts               JSON-LD generators: FAQPage, BreadcrumbList, WebApplication, Article

components/
  CalculatorWidget.tsx    Generic, config-driven interactive calculator (client component)
  Breadcrumbs.tsx         Breadcrumb nav + BreadcrumbList schema
  FAQSection.tsx          FAQ accordion + FAQPage schema
  RelatedCalculators.tsx  Internal linking widget
  Header.tsx / Footer.tsx Site chrome
```

## SEO checklist (per calculator/guide page)

- [x] SEO-optimized `<title>` (via `generateMetadata` + `buildMetadata`)
- [x] Meta description
- [x] Open Graph tags (title, description, url, image, locale, type)
- [x] Twitter Card tags (summary_large_image)
- [x] Canonical URL (`alternates.canonical`)
- [x] Single `<h1>`
- [x] Interactive calculator component
- [x] Long-form, unique, India-focused explanation (1000+ words combined across sections)
- [x] Formula section with variable definitions
- [x] Worked example with real numbers
- [x] Benefits section
- [x] FAQ section
- [x] FAQPage JSON-LD schema
- [x] BreadcrumbList JSON-LD schema
- [x] WebApplication / Article JSON-LD schema
- [x] Internal links to related calculators/guides
- [x] Server-side rendered / statically pre-rendered (SSG via `generateStaticParams`)
- [x] Mobile-first responsive layout (Tailwind CSS)

## Important implementation notes

- **JSON-LD uses plain `<script>` tags, not `next/script`.** `next/script`'s default strategy (`afterInteractive`) injects the tag via client-side JS *after* hydration, meaning it's absent from the initial server-rendered HTML that crawlers fetch. Structured data must be part of the initial HTML — see `components/Breadcrumbs.tsx` / `FAQSection.tsx` / the schema `<script>` tags in the page files.
- **`CalculatorWidget` receives a `slug` string, not the config object.** React Server Components cannot serialize functions (like each calculator's `compute()`) across the server→client boundary. The client component re-imports the config and looks up its own entry by slug instead.
- **Page `<title>` is a plain string from `buildMetadata()`**, not `"${title} | Calculate Future"` — the root layout already defines a `title.template` that appends the site name, so appending it twice would duplicate it.
- All 9 example calculators (SIP, FD, RD, EMI, PPF, NPS, CAGR, Inflation, SWP) ship with fully written, unique, 1000+ word educational content — not placeholder text. Extending to more calculators means writing the same quality of content, not just filling in numeric fields.

## Deploying

This is a standard Next.js app — deploy to Vercel (recommended, zero-config), or any Node host / Docker. Before going live:

1. Update `config/site.ts` with your real production domain (`SITE.url`) — this feeds canonical URLs, the sitemap, and OG image URLs.
2. Add real OG/social images to `public/` (referenced as `SITE.ogImage`, `SITE.logo`).
3. Verify `sitemap.xml` and `robots.txt` at your production domain post-deploy.
