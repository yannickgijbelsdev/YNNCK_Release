import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Logo, Right } from "@/components/Bits";

const LINKS = [["work", "Experiences"], ["skills", "What I do"], ["cv", "CV"]];

export const Header = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const isHome = pathname === "/";
  const [scrolled, setScrolled] = useState(false);
  const prog = useRef(null), nl = useRef(null), ind = useRef(null);

  useEffect(() => {
    let tk = false;
    const sc = () => {
      const y = window.scrollY, H = document.documentElement.scrollHeight - window.innerHeight;
      prog.current.style.setProperty("--p", (y / Math.max(1, H)).toFixed(4));
      setScrolled(y > 10);
      tk = false;
    };
    const on = () => { if (!tk) { tk = true; requestAnimationFrame(sc); } };
    window.addEventListener("scroll", on, { passive: true });
    sc();
    return () => window.removeEventListener("scroll", on);
  }, [pathname]);

  useEffect(() => {
    const links = [...nl.current.querySelectorAll("a")];
    const move = (a) => {
      if (!a) { ind.current.style.opacity = 0; links.forEach((l) => l.classList.remove("on")); return; }
      const r = a.getBoundingClientRect(), p = nl.current.getBoundingClientRect();
      ind.current.style.width = r.width + "px";
      ind.current.style.transform = `translateX(${r.left - p.left}px)`;
      ind.current.style.opacity = 1;
      links.forEach((l) => l.classList.toggle("on", l === a));
    };
    const spy = () => {
      let cur = null;
      if (isHome) {
        links.forEach((a) => { const s = document.getElementById(a.dataset.target); if (s && s.getBoundingClientRect().top < window.innerHeight * 0.45) cur = a; });
        const ct = document.getElementById("contact");
        if (ct && ct.getBoundingClientRect().top < window.innerHeight * 0.45) cur = null;
      }
      move(cur);
    };
    const on = () => requestAnimationFrame(spy);
    const enters = links.map((a) => { const f = () => move(a); a.addEventListener("mouseenter", f); return f; });
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", spy);
    nl.current.addEventListener("mouseleave", spy);
    const nlEl = nl.current;
    spy();
    return () => {
      window.removeEventListener("scroll", on);
      window.removeEventListener("resize", spy);
      nlEl.removeEventListener("mouseleave", spy);
      links.forEach((a, i) => a.removeEventListener("mouseenter", enters[i]));
    };
  }, [isHome]);

  const go = (id) => (e) => { if (!isHome) { e.preventDefault(); navigate(`/#${id}`); } };

  return (
    <>
      <div className="progress" ref={prog} data-testid="scroll-progress" />
      <header className={`nav2${scrolled ? " s" : ""}`} data-testid="site-header">
        <div className="bar">
          <Link className="nlogo" to="/" onClick={() => isHome && window.scrollTo({ top: 0 })} aria-label="YNNCK, back to top" data-testid="nav-logo">
            <Logo className="ym" color="#233466" replayEvery={12000} />
          </Link>
          <nav className="nlinks" ref={nl} aria-label="Main">
            <span className="ind" ref={ind} />
            {LINKS.map(([id, label]) => (
              <a key={id} href={`${isHome ? "" : "/"}#${id}`} data-target={id} onClick={go(id)} data-testid={`nav-link-${id}`}>{label}</a>
            ))}
          </nav>
          <a className="ncta" href={`${isHome ? "" : "/"}#contact`} onClick={go("contact")} data-testid="nav-cta-contact">
            Let’s talk <span><Right /></span>
          </a>
        </div>
      </header>
    </>
  );
};
