import { useEffect, useRef } from "react";
import { Logo, UpRight } from "@/components/Bits";
import { EMAIL } from "@/data/site";

export const Footer = () => {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && el.classList.add("in")), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <footer className="ft2" ref={ref} data-testid="site-footer">
      <div className="ftin">
        <i className="pt pt10" aria-hidden="true" /><i className="pt pt3" aria-hidden="true" />
        <div className="ftop ftop-min">
          <Logo className="fym" color="#ffffff" />
          <a className="fmail" href={`mailto:${EMAIL}`} data-testid="footer-email-link">{EMAIL} <span><UpRight /></span></a>
        </div>
        <div className="fword" aria-hidden="true">YNNCK</div>
        <div className="fbot">
          <span>© 2026 YNNCK · Yannick Gijbels</span>
          <a className="totop" href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: "smooth" }); }} aria-label="Back to top" data-testid="footer-back-to-top"><UpRight /></a>
        </div>
      </div>
    </footer>
  );
};
