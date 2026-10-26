import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { mountYnnck } from "@/lib/ynnckLogo";

export const UpRight = () => (
  <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 10L10 4M5 4h5v5" /></svg>
);

export const Right = () => (
  <svg viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 7h10M8 3l4 4-4 4" /></svg>
);

export const Logo = ({ className, color, replayEvery }) => {
  const ref = useRef(null);
  useEffect(() => {
    const l = mountYnnck(ref.current, { color, weight: 14 });
    const t = replayEvery && setInterval(() => !document.hidden && l.replay(), replayEvery);
    return () => { l.stop(); clearInterval(t); };
  }, [color, replayEvery]);
  return <span className={className} ref={ref} />;
};

export const Words = ({ lines }) => {
  let d = 0;
  return lines.map((line, i) => (
    <span key={i}>
      {i > 0 && <br />}
      {line.split(" ").map((w, j) => (
        <span key={j}>{j > 0 && " "}<span className="w" style={{ "--d": d++ }}>{w}</span></span>
      ))}
    </span>
  ));
};

export const Card = ({ c, testid }) => {
  const cls = `c3 ${c.tone}${c.img ? " ph" : ""}`;
  const style = c.img ? { "--bg": `url(${c.img})` } : undefined;
  const inner = (
    <>
      <i className={`pt pt${c.pt}`} aria-hidden="true" />
      <small>{c.small}</small>
      <h3>{c.title}</h3>
      <p>{c.text}</p>
      {(c.to || c.href) && <span className="go"><UpRight /></span>}
    </>
  );
  if (c.to) return <Link className={cls} style={style} to={c.to} data-testid={testid}>{inner}</Link>;
  if (c.href) return <a className={cls} style={style} href={c.href} data-testid={testid}>{inner}</a>;
  return <div className={cls} style={style} data-testid={testid}>{inner}</div>;
};

export const SectionPanel = ({ id, label, lines, ask, children, tall, wide, cards, solo }) => (
  <div className={`hero2 wrap blk${solo ? " solo" : ""}`} id={id} data-testid={`section-${id}`}>
    <div className={`panel sm${tall ? " tall" : ""}`}>
      <div className={`ptxt${wide ? " wide" : ""}`}>
        <span className="plabel">{label}</span>
        <h2 className="ptitle"><Words lines={lines} /></h2>
        {ask && <p className="ask">{ask}</p>}
        {children}
      </div>
    </div>
    {cards}
  </div>
);
