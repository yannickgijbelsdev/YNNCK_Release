import { useEffect } from "react";

const SITE = process.env.REACT_APP_SITE_URL;
export const DEFAULT_DESC = "Yannick Gijbels (YNNCK) is a developer, broadcast engineer and radio imaging producer from Pelt, Belgium. Co-founder of Koodh and founder of Koodh Media Group.";
export const abs = (u) => (u && !/^https?:/.test(u) ? `${SITE}${u}` : u);

const setTag = (sel, attrs, tag = "meta") => {
  let el = document.head.querySelector(sel);
  if (!el) { el = document.createElement(tag); document.head.appendChild(el); }
  Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
};

export function useMeta({ title, description = DEFAULT_DESC, path = "/", image = "/og-image.jpg", type = "website", jsonLd }) {
  useEffect(() => {
    const url = `${SITE}${path}`;
    const img = abs(image);
    document.title = title;
    setTag('meta[name="description"]', { name: "description", content: description });
    setTag('link[rel="canonical"]', { rel: "canonical", href: url }, "link");
    [["og:title", title], ["og:description", description], ["og:url", url], ["og:image", img], ["og:type", type]].forEach(([p, c]) =>
      setTag(`meta[property="${p}"]`, { property: p, content: c }));
    [["twitter:title", title], ["twitter:description", description], ["twitter:image", img]].forEach(([n, c]) =>
      setTag(`meta[name="${n}"]`, { name: n, content: c }));
    document.getElementById("ld-page")?.remove();
    if (jsonLd) {
      const s = document.createElement("script");
      s.type = "application/ld+json";
      s.id = "ld-page";
      s.textContent = JSON.stringify(jsonLd);
      document.head.appendChild(s);
    }
  }, [title, description, path, image, type, jsonLd]);
}
