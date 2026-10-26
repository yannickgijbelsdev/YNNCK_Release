import { useEffect, useRef } from "react";
import { JOBS } from "@/data/site";

export const Timeline = () => {
  const ref = useRef(null), fill = useRef(null);

  useEffect(() => {
    const tline = ref.current, tis = [...tline.querySelectorAll(".ti")];
    const upd = () => {
      const rail = tline.querySelector(".rail").getBoundingClientRect();
      const mark = window.innerHeight * 0.62;
      const p = Math.max(0, Math.min(1, (mark - rail.top) / Math.max(1, rail.height)));
      fill.current.parentElement.style.setProperty("--fill", p.toFixed(4));
      fill.current.style.transform = `scaleY(${p.toFixed(4)})`;
      tis.forEach((t) => t.classList.toggle("lit", t.querySelector(".node").getBoundingClientRect().top < mark || p >= 0.999));
    };
    const on = () => requestAnimationFrame(upd);
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", upd);
    upd();
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", upd); };
  }, []);

  return (
    <ol className="tline" ref={ref} data-testid="cv-timeline">
      <span className="rail"><i ref={fill} data-testid="cv-timeline-fill" /></span>
      {JOBS.map((j, k) => (
        <li key={j.org} className={`ti ${j.tone}${j.now ? " now" : ""}`} style={{ "--k": k }} data-testid={`cv-item-${k}`}>
          <span className="node" />
          <div className="tc">
            <span className="when">{j.when}{j.now && <> · <b>Current</b></>}</span>
            <h4>{j.org}</h4>
            <b className="jrole">{j.role}</b>
            <p>{j.text}</p>
          </div>
        </li>
      ))}
    </ol>
  );
};
