import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const API = `${process.env.REACT_APP_BACKEND_URL}/api`;
const TONES = ["p", "o", "n", "k"];

export const useExperiences = () =>
  useQuery({ queryKey: ["experiences"], queryFn: () => axios.get(`${API}/experiences`).then((r) => r.data.items || []) });

export const useExperience = (id) =>
  useQuery({ queryKey: ["experience", id], queryFn: () => axios.get(`${API}/experiences/${id}`).then((r) => r.data), retry: false });

const tagName = (t) => (typeof t === "string" ? t : t?.name);

export const toCard = (a, i) => ({
  id: a.id,
  tone: TONES[i % 4],
  pt: 4 + (i % 4),
  small: tagName(a.tags?.[0]) || "Experience",
  title: a.title,
  text: a.excerpt,
  img: a.image_url,
  to: `/work/${a.id}`,
});
