import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import { logosFor } from "@/components/Logos";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const CMS = process.env.REACT_APP_NEWS_API_BASE;
const CMS_SITE = process.env.REACT_APP_NEWS_SITE_PATH;
const TONES = ["p", "o", "n", "k"];

let direct = false;

export const imgUrl = (src, w = 1200) => (src && !direct ? `${API}/img?src=${encodeURIComponent(src)}&w=${w}` : src);

// Use the site backend; if it is unreachable, read the CMS directly.
const load = async (apiPath, cmsPath) => {
  try {
    return (await axios.get(`${API}${apiPath}`, { timeout: 20000 })).data;
  } catch (e) {
    if (e.response?.status === 404 || !CMS) throw e;
    const data = (await axios.get(`${CMS}${cmsPath}`, { timeout: 20000 })).data;
    direct = true;
    return data;
  }
};

export const useExperiences = () =>
  useQuery({ queryKey: ["experiences"], queryFn: () => load("/experiences", CMS_SITE).then((d) => d.items || []) });

export const useExperience = (id) =>
  useQuery({
    queryKey: ["experience", id],
    queryFn: () => load(`/experiences/${id}`, `/articles/${encodeURIComponent(id)}`),
    retry: (n, e) => e.response?.status !== 404 && n < 2,
  });

const tagName = (t) => (typeof t === "string" ? t : t?.name);

export const toCard = (a, i) => ({
  id: a.id,
  tone: TONES[i % 4],
  pt: 4 + (i % 4),
  small: tagName(a.tags?.[0]) || "Experience",
  title: a.title,
  logos: logosFor(a.title),
  text: a.excerpt,
  img: imgUrl(a.image_url, 800),
  to: `/work/${a.id}`,
});
