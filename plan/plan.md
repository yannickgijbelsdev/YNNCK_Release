# YNNCK · Yannick Gijbels — portfolio rebuild

A faithful rebuild of the uploaded one-page portfolio for Yannick Gijbels: developer, broadcast engineer and radio imaging producer from Pelt, Belgium.
It presents his companies, selected work, skills and CV, and invites visitors to get in touch by e-mail. Each project gets its own detail page.

## Who it's for
- Potential clients and employers looking for IT, web/AI, broadcast or audio branding work
- Radio and media contacts who want to see Yannick's experience at a glance
- Yannick himself, as his personal calling card online

## Core features and experience
- **Hero "Building stories."**: big headline, the line "What can I help you with?", a portrait, and a row of logos he has worked with (Koodh, Koodh Media Group, Radio GRK, Radiogroep, TOPradio, Thomas More, OVB Congres).
- **Three intro cards**: Founder at Koodh Media Group, Broadcast & radio (on air), Co-founder at Koodh. Each links to the matching site or section.
- **Selected experiences**: four project cards with background images (Radio Magie / OVB Congres, Broadcast / Nostalgie, Two companies / Koodh & Media Group, Tool platform / 127). Each opens its own detail page.
- **Project detail pages**: one page per project with title, category, summary, a longer write-up, images and a way back to the overview.
- **What I do**: "Code, cloud and sound." with three cards: Development & AI, Broadcast & audio, IT support.
- **CV timeline**: nine roles from 2015 to now, current ones marked "Current". A line fills up as you scroll through the timeline. Includes a "Full CV" link.
- **Highlight cards**: Top skills, Tools and Education (SyntraPXL).
- **Contact "Let's talk."**: an e-mail button (yannick@ynnck.dev, subject "Project enquiry") and three steps: You reach out, I think along, We get to work.
- **Footer**: short bio, e-mail, links to sections and companies (Koodh, Koodh Media Group, 127.be), the "On air: Social Club, Fridays 6–8 p.m., Radio GRK" note, and copyright.
- **Navigation**: a top bar with Experiences, What I do, CV and a "Let's talk" button, plus a reading progress bar at the top.

## User flow
1. The visitor lands on the hero, sees the headline, portrait and logos.
2. They scroll, or use the top menu to jump to Experiences, What I do, CV or Contact.
3. Clicking a project card opens its detail page. From there they go back to the overview.
4. Scrolling through the CV fills the timeline line as they move through the years.
5. They click the e-mail button, and their own mail app opens with a message to Yannick.

## UI/UX feel
- Same look as the original: Archivo for text, JetBrains Mono for small labels, and colour-coded cards in three accent tones that repeat through the page.
- Large rounded panels, generous spacing, and words in headings that appear one after another as the page loads.
- Cards fade in on scroll, with a small arrow that moves on hover.
- Fully responsive. On a phone, cards stack and the timeline stays readable.

## Implementation phases
**Phase 1 — MVP (built now)**
- Full one-page site with every section, text, logo and image from the uploaded file, plus animations and the scroll progress.
- Four project detail pages.
- E-mail contact button and all outbound links.

**Phase 2**
- Full CV page (now linked to ynnck.dev/cv) rebuilt in the same style.
- Page titles and preview images for sharing, so links look good on social media and WhatsApp.

**Phase 3**
- Extra polish, such as a dark/light switch or a "now on air" badge for Social Club.
- More projects added as Yannick provides them.

## Assumptions
- All content is fixed in the site. Changes go through a request, and there is no login or admin page.
- Contact works only through the e-mail button. No form, and nothing is stored.
- The site is in English, the same as the original.
- Logos, portrait and project images are taken from the uploaded HTML file.
- The uploaded file only has a one-line summary for each project. Detail pages get a longer placeholder write-up based on that line and the CV, clearly editable, until Yannick sends the real text and images.
- "Full CV" keeps linking to the existing ynnck.dev/cv page for now.
- Links to koodh.com, koodhmediagroup.com and 127.be stay external.
