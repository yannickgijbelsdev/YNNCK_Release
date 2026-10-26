import { useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Logo, UpRight } from "@/components/Bits";
import { EMAIL } from "@/data/site";

const EXPLORE = [["work", "Experiences"], ["skills", "What I do"], ["cv", "CV"], ["contact", "Contact"]];
const COMPANIES = [["Koodh", "https://koodh.com"], ["Koodh Media Group", "https://koodhmediagroup.com"], ["127.be", "https://127.be"]];

export const Footer = () => {
  const ref = useRef(null);
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isHome = pathname === "/";

  useEffect(() => {
    const el = ref.current;
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && el.classList.add("in")), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const go = (id) => (e) => { if (!isHome) { e.preventDefault(); navigate(`/#${id}`); } };

  return (
    <footer className="ft2" ref={ref} data-testid="site-footer">
      <div className="ftin">
        <i className="pt pt10" aria-hidden="true" /><i className="pt pt3" aria-hidden="true" />
        <div className="ftop">
          <div className="fbrand">
            <Logo className="fym" color="#ffffff" />
            <p>Developer, broadcast engineer and radio imaging producer from Pelt, Belgium.</p>
            <a className="fmail" href={`mailto:${EMAIL}`} data-testid="footer-email-link">{EMAIL} <span><UpRight /></span></a>
          </div>
          <div className="fcol"><small>Explore</small>
            {EXPLORE.map(([id, l]) => <a key={id} href={`${isHome ? "" : "/"}#${id}`} onClick={go(id)} data-testid={`footer-link-${id}`}>{l}</a>)}
          </div>
          <div className="fcol"><small>Companies</small>
            {COMPANIES.map(([l, h]) => <a key={h} href={h} data-testid={`footer-company-${l.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}>{l}</a>)}
          </div>
          <div className="fcol" data-testid="footer-on-air"><small>On air</small><span>Social Club</span><span>Fridays, 6–8 p.m.</span><span>Radio GRK</span></div>
        </div>
        <div className="fword" aria-hidden="true">YNNCK</div>
        <div className="fbot">
          <span>© 2026 YNNCK · Yannick Gijbels</span><span>Pelt, Limburg · NL &amp; BE</span>
          <a className="totop" href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }} aria-label="Back to top" data-testid="footer-back-to-top"><UpRight /></a>
        </div>
      </div>
    </footer>
  );
};
