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

## Backlog
- P1: Full CV page in same style (currently links to ynnck.dev/cv); social share titles/preview images.
- P2: Mobile menu for nav links, "now on air" badge, more projects, real project texts/images from Yannick.
