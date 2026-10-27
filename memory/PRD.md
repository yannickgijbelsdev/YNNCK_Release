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

## Backlog
- Short cache on the CMS proxy; show `excerpt` on cards once filled in the CMS.
- P1: Full CV page in same style (currently links to ynnck.dev/cv); social share titles/preview images.
- P2: Mobile menu for nav links, "now on air" badge, more projects, real project texts/images from Yannick.
