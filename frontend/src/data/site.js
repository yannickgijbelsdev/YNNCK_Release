export const EMAIL = "yannick@ynnck.dev";

export const DOTS = [
  { title: "Koodh", svg: true },
  { title: "Koodh Media Group", svg: true, cls: "mg" },
  { title: "Radio GRK", img: "/img/radio-grk.png" },
  { title: "Radiogroep", img: "/img/radiogroep.png" },
  { title: "TOPradio", img: "/img/topradio.png" },
  { title: "Thomas More", img: "/img/thomas-more.png" },
  { title: "OVB Congres", img: "/img/ovb-congres.png" },
];

export const INTRO = [
  { tone: "p", pt: 1, small: "Founder", title: "Koodh Media Group", text: "Audio branding for radio and event photography.", href: "https://koodhmediagroup.com" },
  { tone: "o", pt: 2, small: "Broadcast & radio", title: "On air", text: "Broadcast engineering, radio imaging and Social Club on Radio GRK.", href: "#skills" },
  { tone: "n", pt: 3, small: "Co-founder", title: "Koodh", text: "Websites, Microsoft 365, AI and IT for businesses.", href: "https://koodh.com" },
];

// Detail write-ups are placeholders based on the card line and CV; replace with Yannick's own text.
export const PROJECTS = [
  {
    slug: "ovb-congres", tone: "p", pt: 4, small: "Radio Magie", title: "OVB Congres",
    text: "On-air branding for the OVB congress.", img: "/img/work-ovb.webp",
    facts: [["Discipline", "Radio imaging · Audio branding"], ["Client", "OVB Congres"], ["Station", "Radio Magie"]],
    body: [
      "For the OVB congress, Radio Magie needed an on-air sound that felt like the event itself: recognisable, warm and confident from the first second.",
      "I produced the on-air branding: station IDs, sweepers and beds that tie every link, announcement and break together, so listeners always know where they are.",
      "The result is a consistent audio identity that carried the congress through the full programme, built with the same care I bring to radio imaging for national stations.",
    ],
  },
  {
    slug: "nostalgie", tone: "o", pt: 5, small: "Broadcast", title: "Nostalgie",
    text: "Broadcast engineering for Radiogroep.", img: "/img/work-nostalgie.webp",
    facts: [["Role", "Broadcast Engineer"], ["Client", "Radiogroep · Nostalgie Vlaanderen"], ["Period", "May 2022 – Nov 2025"]],
    body: [
      "At Radiogroep I worked as broadcast engineer for Nostalgie Vlaanderen, keeping the station on air and sounding the way it should.",
      "That meant looking after studio and playout systems, audio routing and the technical chain from microphone to transmitter, and stepping in fast when something needed fixing.",
      "Alongside the engineering I developed Radiobox, the web application Radiogroep used for company radio, Thomas More, Zoo Media and Radio Roem.",
    ],
  },
  {
    slug: "koodh", tone: "n", pt: 6, small: "Two companies", title: "Koodh & Media Group",
    text: "IT, websites, audio branding and photography.", img: "/img/work-koodh.webp",
    facts: [["Koodh", "Co-Founder"], ["Koodh Media Group", "Founder"], ["Since", "May 2026"]],
    links: [["koodh.com", "https://koodh.com"], ["koodhmediagroup.com", "https://koodhmediagroup.com"]],
    body: [
      "Koodh and Koodh Media Group are the two companies I run, each covering one half of what I do.",
      "Koodh brings IT solutions to businesses and individuals: e-mail signatures, Microsoft 365, consulting, websites, AI and custom web systems.",
      "Koodh Media Group focuses on the creative side, with event photography and audio imaging for a range of companies and radio stations.",
    ],
  },
  {
    slug: "127", tone: "k", pt: 7, small: "Tool platform", title: "127",
    text: "IT tools in one place, used daily at Autosoft.", img: "/img/work-127.webp",
    facts: [["Type", "Tool platform"], ["Used at", "Autosoft IT Solutions"], ["Web", "127.be"]],
    links: [["127.be", "https://127.be"]],
    body: [
      "127 bundles the IT tools I kept reaching for into one place, so support work starts in a single tab instead of ten.",
      "It grew out of daily B2B support at Autosoft, where speed matters: quick lookups, checks and handy utilities for Microsoft 365 and beyond.",
      "Today it is used every day by the team at Autosoft, and it keeps growing whenever a new routine task deserves its own tool.",
    ],
  },
];

export const SKILLS = [
  { tone: "p", pt: 8, small: "Development & AI", title: "Websites & AI", text: "Websites, web apps like Radiobox and AI that takes routine work off people’s hands.", href: "https://koodh.com" },
  { tone: "o", pt: 9, small: "Broadcast & audio", title: "Radio", text: "AXIA networks, Unraid and Proxmox servers, vMix and radio imaging for TOPradio.", href: "#cv" },
  { tone: "n", pt: 10, small: "IT support", title: "Microsoft 365", text: "B2B support at Autosoft by phone and ticket, focused on Microsoft 365 and CodeTwo.", href: "#cv" },
];

export const JOBS = [
  { tone: "p", now: true, when: "May 2026 – now", org: "Koodh", role: "Co-Founder", text: "IT solutions for businesses and individuals: signatures, Microsoft 365, consulting, websites, AI and custom web systems." },
  { tone: "o", now: true, when: "May 2026 – now", org: "Koodh Media Group", role: "Founder", text: "Event photography and audio imaging for a range of companies." },
  { tone: "n", now: true, when: "Sep 2024 – now", org: "Autosoft IT Solutions", role: "IT Support Specialist B2B", text: "First-line support for business customers, focused on Microsoft 365 and CodeTwo. Earlier technician B2C and RMA specialist." },
  { tone: "p", now: true, when: "Jul 2020 – now", org: "Radio GRK", role: "Co-Technical Lead · Radio Host", text: "Unraid, Proxmox and the AXIA audio network, and how the station sounds on air. Host of Social Club on Fridays." },
  { tone: "o", when: "Sep 2023 – Oct 2024", org: "TOPradio", role: "Radio Imaging Producer", text: "Sweepers, beds and IDs for Dance Top 1000, TOPHit40, Allez Xander! and Dance Top 500." },
  { tone: "n", when: "May 2022 – Nov 2025", org: "Radiogroep", role: "Broadcast Engineer · Web Application Developer", text: "Broadcast engineering for Nostalgie Vlaanderen and Radiobox for company radio, Thomas More, Zoo Media and Radio Roem." },
  { tone: "p", when: "Jul 2021 – May 2024", org: "Studio Sonart", role: "vMix Operator · Radiobox Lead Developer", text: "Built Radiobox so company-radio employees could send messages and follow the live show." },
  { tone: "o", when: "Aug 2020 – Apr 2024", org: "Telenet Group", role: "Technical Advisor · Digital Specialist", text: "Helped customers with modems, networks and fibre appointments, by phone and WhatsApp." },
  { tone: "n", when: "May 2015 – Jul 2026", org: "Lokale Radio MFY", role: "General Lead · Technical Lead · Radio Host", text: "Eleven years at the station, from presenting Social Club to leading the technology and the station." },
];

export const HIGHLIGHTS = [
  { tone: "p", pt: 11, small: "Top skills", title: "AI · Development · Microsoft 365", text: "What I spend most of my days on." },
  { tone: "o", pt: 12, small: "Tools", title: "Pro Tools, Ableton, vMix", text: "Proxmox, Unraid, AXIA, CodeTwo and Adobe." },
  { tone: "n", pt: 2, small: "Education", title: "SyntraPXL", text: "Network & System Administration and Full Stack Development." },
];

export const STEPS = [
  { tone: "p", pt: 5, small: "01", title: "You reach out", text: "A short e-mail about your project or idea is enough.", href: `mailto:${EMAIL}` },
  { tone: "o", pt: 3, small: "02", title: "I think along", text: "You get honest feedback and a clear next step." },
  { tone: "n", pt: 9, small: "03", title: "We get to work", text: "Once it clicks, I turn the plan into something real." },
];
