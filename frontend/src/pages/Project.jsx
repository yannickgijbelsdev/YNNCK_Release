import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { Card, Right, SectionPanel, UpRight } from "@/components/Bits";
import { useReveal } from "@/hooks/useReveal";
import { EMAIL, PROJECTS } from "@/data/site";

export default function Project() {
  const { slug } = useParams();
  const p = PROJECTS.find((x) => x.slug === slug);
  useReveal(slug);
  useEffect(() => {
    window.scrollTo(0, 0);
    if (p) document.title = `${p.title} · YNNCK · Yannick Gijbels`;
    return () => { document.title = "YNNCK · Yannick Gijbels"; };
  }, [slug, p]);
  if (!p) return <Navigate to="/" replace />;
  const others = PROJECTS.filter((x) => x.slug !== slug).map((x) => ({ ...x, to: `/work/${x.slug}` }));

  return (
    <main id="top" data-testid={`project-page-${p.slug}`}>
      <SectionPanel id="project" label={p.small} lines={[p.title]} ask={p.text} solo>
        <Link className="pback" to="/#work" data-testid="project-back-link"><span><Right /></span> All experiences</Link>
      </SectionPanel>

      <div className="wrap pdetail">
        <figure className={`pfig ${p.tone}`} data-testid="project-image"><img src={p.img} alt={p.title} /></figure>
        <div className="pcopy">
          <dl className="pfacts" data-testid="project-facts">
            {p.facts.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
          </dl>
          <div className="pbody" data-testid="project-body">{p.body.map((t, i) => <p key={i}>{t}</p>)}</div>
          <div className="pactions">
            <a className="btn primary" href={`mailto:${EMAIL}?subject=${encodeURIComponent(`About ${p.title}`)}`} data-testid="project-email-button">Ask about this project <Right /></a>
            {p.links?.map(([l, h]) => <a key={h} className="btn ghost" href={h} data-testid={`project-ext-link-${l.replace(/\W+/g, "-")}`}>{l} <UpRight /></a>)}
          </div>
        </div>
      </div>

      <SectionPanel id="more" label="Experiences" lines={["More work."]} ask="Other projects I’ve been part of."
        cards={<div className="cards3">{others.map((c) => <Card key={c.slug} c={c} testid={`more-card-${c.slug}`} />)}</div>} />
    </main>
  );
}
