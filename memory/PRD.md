# YNNCK · Yannick Gijbels — portfolio rebuild

## Original problem
"Bouw dit na" — rebuild the uploaded one-page HTML portfolio (YNNCK · Yannick Gijbels) faithfully, plus a detail page per project.

## Architecture
- Static React frontend (no backend usage). Routes: `/` and `/work/:slug` (ovb-congres, nostalgie, koodh, 127).
- Original CSS ported verbatim to `src/ynnck.css`; detail styles in `src/detail.css`.
- Images extracted from the HTML into `public/img/`. Content in `src/data/site.js` (editable).
- Animated YNNCK logo (`src/lib/ynnckLogo.js`), scroll reveal hook, timeline fill, nav spy, progress bar.

## Implemented (2026-06)
- Hero, intro cards, experiences (4 cards), What I do, CV timeline (9 roles), highlights, contact (mailto), footer.
- 4 project detail pages with placeholder write-ups (based on the card line + CV), facts, mail button, more-work cards.
- Tested: 100% frontend pass (iteration_1).

## Iteration 2 (2026-06)
- Selected experiences + detail pages now load live from the Koodh CMS (clr.koodh.com) through backend proxy `/api/experiences` and `/api/experiences/{article_id}` (env: NEWS_API_BASE, NEWS_SITE_PATH).
- Routes `/work/{article_id}`; detail shows title, date, image + credit, sanitized HTML body (images/video), more-work cards. Loading, error/retry and not-found states.

## Iteration 3 (2026-06)
- Favicon set (svg, ico, png 32/180/192/512) + manifest.json, based on the YNNCK logo.
- Removed all platform/AI-tool traces: tracking + platform scripts from index.html, dev overlay/visual-edit packages + craco hooks, unused AI libraries from backend, template leftovers.

## Iteration 4 (2026-06): SEO & GEO
- index.html: full meta (description, canonical, robots, geo.* Pelt/BE-VLI, Open Graph, Twitter card), JSON-LD graph (WebSite, ProfilePage, Person, ProfessionalService with address/geo/areaServed), noscript text version of the profile.
- og-image.jpg (1200x630). robots.txt, llms.txt, dynamic sitemap at /api/sitemap.xml (home + CMS articles).
- useMeta hook: per-page title/description/canonical/OG + Article JSON-LD on project pages; h1 per page; lang="nl" on CMS bodies; lazy images with alt.
- Env: REACT_APP_SITE_URL, SITE_URL (https://ynnck.dev).

## Backlog
- Server-side rendering/prerender of /work/* so social previews show each project's own image.
- Short cache on the CMS proxy; show `excerpt` on cards once filled in the CMS.
- P1: Full CV page in same style (currently links to ynnck.dev/cv); social share titles/preview images.
- P2: Mobile menu for nav links, "now on air" badge, more projects, real project texts/images from Yannick.
