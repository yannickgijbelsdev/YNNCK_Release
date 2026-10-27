import { useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import { Right, SectionPanel } from "@/components/Bits";
import { ExperienceCards } from "@/components/ExperienceCards";
import { useReveal } from "@/hooks/useReveal";
import { useMeta } from "@/hooks/useMeta";
import { useExperience, useExperiences } from "@/lib/api";
import { EMAIL } from "@/data/site";

const Back = () => <Link className="pback" to="/#work" data-testid="project-back-link"><span><Right /></span> All experiences</Link>;

const fmt = (d) => d && new Date(d).toLocaleDateString("en-GB", { month: "long", year: "numeric" });

export default function Project() {
  const { id } = useParams();
  const a = useExperience(id);
  const list = useExperiences();
  const p = a.data;
  const { html, text } = useMemo(() => {
    if (!p?.body) return { html: "", text: "" };
    const t = document.createElement("template");
    t.innerHTML = DOMPurify.sanitize(p.body);
    t.content.querySelectorAll("img").forEach((img) => {
      img.loading = "lazy";
      if (!img.alt) img.alt = p.title;
    });
    t.content.querySelectorAll(".clara-image-credit").forEach((n, i) => i === 0 && n.remove());
    return { html: t.innerHTML, text: (t.content.textContent || "").replace(/\s+/g, " ").trim() };
  }, [p]);
  useReveal(`${id}-${a.status}-${list.status}`);

  const excerpt = p && (p.excerpt || list.data?.find((x) => x.id === p.id)?.excerpt);
  const desc = excerpt || (text ? (text.length > 158 ? `${text.slice(0, 155).replace(/\s+\S*$/, "")}…` : text) : undefined);
  const jsonLd = useMemo(() => p && ({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: p.title,
    description: desc,
    image: p.image_url ? [p.image_url] : undefined,
    datePublished: p.published_at,
    inLanguage: "nl",
    url: `${process.env.REACT_APP_SITE_URL}/work/${p.id}`,
    author: { "@type": "Person", name: "Yannick Gijbels", url: `${process.env.REACT_APP_SITE_URL}/` },
    publisher: { "@type": "Person", name: "Yannick Gijbels" },
    isPartOf: { "@id": `${process.env.REACT_APP_SITE_URL}/#website` },
  }), [p, desc]);
  useMeta({
    title: p ? `${p.title} · YNNCK · Yannick Gijbels` : "YNNCK · Yannick Gijbels",
    description: desc,
    path: `/work/${id}`,
    image: p?.image_url || undefined,
    type: p ? "article" : "website",
    jsonLd,
  });

  useEffect(() => { window.scrollTo(0, 0); }, [id]);

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
  return (
    <main id="top" data-testid={`project-page-${p.id}`}>
      <article>
      <SectionPanel id="project" h1 label={<time dateTime={p.published_at}>{fmt(p.published_at) || "Experience"}</time>} lines={[p.title]} ask={excerpt} solo><Back /></SectionPanel>

      <div className="wrap pdetail">
        {p.image_url && (
          <figure className="pfig" data-testid="project-image">
            <img src={p.image_url} alt={p.title} fetchpriority="high" />
            {credit && <figcaption>© {credit}</figcaption>}
          </figure>
        )}
        <div className="pcopy">
          <div className="pbody" lang="nl" data-testid="project-body" dangerouslySetInnerHTML={{ __html: html }} />
          <div className="pactions">
            <a className="btn primary" href={`mailto:${EMAIL}?subject=${encodeURIComponent(`About ${p.title}`)}`} data-testid="project-email-button">Ask about this project <Right /></a>
          </div>
        </div>
      </div>
      </article>

      <SectionPanel id="more" label="Experiences" lines={["More work."]} ask="Other projects I’ve been part of."
        cards={<ExperienceCards q={list} exclude={p.id} prefix="more-card" />} />
    </main>
  );
}
