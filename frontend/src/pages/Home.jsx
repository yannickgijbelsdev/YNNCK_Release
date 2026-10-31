import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { Card, Right, SectionPanel } from "@/components/Bits";
import { Timeline } from "@/components/Timeline";
import { useReveal } from "@/hooks/useReveal";
import { useMeta } from "@/hooks/useMeta";
import { ExperienceCards } from "@/components/ExperienceCards";
import { useExperiences } from "@/lib/api";
import { DOTS, EMAIL, HIGHLIGHTS, INTRO, SKILLS, STEPS } from "@/data/site";

const K = () => <svg viewBox="66 26 42 51"><polygon points="91.95,30.476 98.589,30.476 77.733,47.939 102.696,72.502 96.441,72.502 71.467,47.939" /></svg>;
const slug = (s) => s.toLowerCase().replace(/[^a-z0-9]+/g, "-");

const Hero = () => {
  const pim = useRef(null);
  useEffect(() => {
    const sc = () => pim.current && pim.current.style.setProperty("--py", Math.min(80, window.scrollY * 0.12).toFixed(1) + "px");
    window.addEventListener("scroll", sc, { passive: true });
    sc();
    return () => window.removeEventListener("scroll", sc);
  }, []);
  return (
    <div className="hero2 wrap" id="hero" data-testid="section-hero">
      <div className="panel">
        <div className="ptxt">
          <h1 data-testid="hero-title"><span className="sr-only">Yannick Gijbels: developer, broadcast engineer and radio imaging producer from Pelt, Belgium. </span><span className="w" style={{ "--d": 0 }} aria-hidden="true">Building</span><br /><span className="w" style={{ "--d": 1 }} aria-hidden="true">stories.</span></h1>
          <p className="ask w" style={{ "--d": 3 }}>What can I help you with?</p>
          <div className="dots" aria-label="Worked with" data-testid="hero-logos">
            {DOTS.map((d, i) => (
              <span key={d.title} style={{ "--i": i }} title={d.title} className={d.cls} data-testid={`hero-logo-${slug(d.title)}`}>
                {d.svg ? <K /> : <img src={d.img} alt={d.title} />}
              </span>
            ))}
          </div>
        </div>
        <div className="pimg"><img ref={pim} src="/img/portrait.webp" alt="Portrait of Yannick Gijbels, developer and broadcast engineer from Pelt" width="752" height="781" fetchPriority="high" data-testid="hero-portrait" /></div>
      </div>
      <div className="cards3">
        {INTRO.map((c) => <Card key={c.title} c={c} testid={`intro-card-${slug(c.title)}`} />)}
      </div>
    </div>
  );
};

export default function Home() {
  const { hash } = useLocation();
  const exp = useExperiences();
  useReveal(`home-${exp.status}`);
  useMeta({ title: "YNNCK · Yannick Gijbels · Developer & broadcast engineer, Pelt", path: "/" });

  useEffect(() => {
    if (!hash) return;
    const t = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView(), 60);
    return () => clearTimeout(t);
  }, [hash]);

  const cards = (list, cls, pre) => (
    <div className={`cards3${cls ? " " + cls : ""}`}>
      {list.map((c) => <Card key={c.title} c={c} testid={`${pre}-${slug(c.title)}`} />)}
    </div>
  );

  return (
    <main id="top">
      <Hero />
      <SectionPanel id="work" label="Experiences" lines={["Selected", "experiences."]} ask="Projects and work I’ve been part of over the years."
        cards={<ExperienceCards q={exp} prefix="project-card" />} />
      <SectionPanel id="skills" label="What I do" lines={["Code, cloud", "and sound."]} ask="Most of my work sits where IT and media meet."
        cards={cards(SKILLS, "c3", "skill-card")} />
      <SectionPanel id="cv" label="Curriculum vitae" lines={["Experience."]} tall wide cards={cards(HIGHLIGHTS, "", "highlight-card")}>
        <p className="ask">From radio host in 2015 to co-founding Koodh. Scroll through the years. <a href="https://ynnck.dev/cv" data-testid="full-cv-link">Full CV →</a></p>
        <Timeline />
      </SectionPanel>
      <SectionPanel id="contact" label="Contact" lines={["Let’s talk."]} ask="Got a project or an idea in mind? Drop me a line. A real person, no ticket numbers."
        cards={cards(STEPS, "", "contact-step")}>
        <a className="btn primary" style={{ marginTop: 26 }} href={`mailto:${EMAIL}?subject=Project%20enquiry`} data-testid="contact-email-button">{EMAIL} <Right /></a>
      </SectionPanel>
    </main>
  );
}
