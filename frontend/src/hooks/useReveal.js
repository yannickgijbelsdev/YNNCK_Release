import { useEffect } from "react";

export function useReveal(key) {
  useEffect(() => {
    document.documentElement.classList.add("js");
    const sel = ".blk .panel,.c3";
    const els = [...document.querySelectorAll(sel)];
    els.forEach((el) => {
      el.classList.add("rv");
      const sib = [...el.parentElement.children].filter((c) => c.matches(sel));
      el.style.setProperty("--d", Math.min(sib.indexOf(el), 6));
    });
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      }),
      { rootMargin: "0px 0px -12% 0px", threshold: 0.08 }
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [key]);
}
