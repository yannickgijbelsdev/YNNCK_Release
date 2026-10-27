import { useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import { Right, SectionPanel } from "@/components/Bits";
import { ExperienceCards } from "@/components/ExperienceCards";
import { useReveal } from "@/hooks/useReveal";
import { useExperience, useExperiences } from "@/lib/api";
import { EMAIL } from "@/data/site";

const Back = () => <Link className="pback" to="/#work" data-testid="project-back-link"><span><Right /></span> All experiences</Link>;

const fmt = (d) => d && new Date(d).toLocaleDateString("en-GB", { month: "long", year: "numeric" });

export default function Project() {
  const { id } = useParams();
  const a = useExperience(id);
  const list = useExperiences();
  const p = a.data;
  const html = useMemo(() => (p?.body ? DOMPurify.sanitize(p.body) : ""), [p]);
  useReveal(`${id}-${a.status}-${list.status}`);

  useEffect(() => { window.scrollTo(0, 0); }, [id]);
  useEffect(() => {
    if (p) document.title = `${p.title} · YNNCK · Yannick Gijbels`;
    return () => { document.title = "YNNCK · Yannick Gijbels"; };
  }, [p]);

  if (a.isLoading) return <main id="top" className="wrap pstate" data-testid="project-loading">Loading…</main>;
  if (a.isError && a.error?.response?.status !== 404)
    return (
      <main id="top" data-testid="project-error">
        <SectionPanel id="project" label="Experiences" lines={["Hmm."]} ask="This experience couldn’t be loaded right now." solo>
          <button className="pback pretry" onClick={() => a.refetch()} data-testid="project-retry"><span><Right /></span> Try again</button>
        </SectionPanel>
      </main>
    );
  if (a.isError)
    return (
      <main id="top" data-testid="project-not-found">
        <SectionPanel id="project" label="Experiences" lines={["Not found."]} ask="This experience isn’t available (anymore)." solo><Back /></SectionPanel>
      </main>
    );

  const credit = p.image_attribution?.credit;
  const excerpt = p.excerpt || list.data?.find((x) => x.id === p.id)?.excerpt;
  return (
    <main id="top" data-testid={`project-page-${p.id}`}>
      <SectionPanel id="project" label={fmt(p.published_at) || "Experience"} lines={[p.title]} ask={excerpt} solo><Back /></SectionPanel>

      <div className="wrap pdetail">
        {p.image_url && (
          <figure className="pfig" data-testid="project-image">
            <img src={p.image_url} alt={p.title} />
            {credit && <figcaption>© {credit}</figcaption>}
          </figure>
        )}
        <div className="pcopy">
          <div className="pbody" data-testid="project-body" dangerouslySetInnerHTML={{ __html: html }} />
          <div className="pactions">
            <a className="btn primary" href={`mailto:${EMAIL}?subject=${encodeURIComponent(`About ${p.title}`)}`} data-testid="project-email-button">Ask about this project <Right /></a>
          </div>
        </div>
      </div>

      <SectionPanel id="more" label="Experiences" lines={["More work."]} ask="Other projects I’ve been part of."
        cards={<ExperienceCards q={list} exclude={p.id} prefix="more-card" />} />
    </main>
  );
}
