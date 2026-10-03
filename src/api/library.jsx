import { useEffect, useState } from "react";

// Dashboard wala hi API. Production me .env me VITE_API_URL set kar do.
export const API = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path) {
  const res = await fetch(`${API}/${path}`);
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json.message || "Something went wrong.");
  return json.data || [];
}

// same request dobara nahi jayegi (sidebar + pages share karte hain)
const cache = new Map();
const cached = (path) => {
  if (!cache.has(path)) {
    cache.set(path, request(path).catch((e) => { cache.delete(path); throw e; }));
  }
  return cache.get(path);
};

export const idOf = (v) => (v && v._id) || v;
const live = (x) => !x.status || x.status === "active";
const byOrder = (a, b) => (a.order || 0) - (b.order || 0);

/** categories + components (sirf active wale, order ke hisaab se) */
export function useLibrary() {
  const [state, setState] = useState({ categories: [], components: [], loading: true, error: "" });

  useEffect(() => {
    let off = false;
    Promise.all([cached("categories"), cached("components")])
      .then(([cats, comps]) => {
        if (off) return;
        setState({
          categories: cats.filter(live).sort(byOrder),
          components: comps.filter(live).sort(byOrder),
          loading: false,
          error: "",
        });
      })
      .catch((e) => !off && setState((s) => ({ ...s, loading: false, error: e.message })));
    return () => { off = true; };
  }, []);

  return state;
}

/** ek component ke variants (draft hide) */
export function useVariants(componentId) {
  const [state, setState] = useState({ variants: [], loading: true, error: "" });

  useEffect(() => {
    if (!componentId) return;
    let off = false;
    setState({ variants: [], loading: true, error: "" });
    cached(`variants/component/${componentId}`)
      .then((list) => {
        if (!off) setState({ variants: list.filter((v) => v.status !== "draft").sort(byOrder), loading: false, error: "" });
      })
      .catch((e) => !off && setState({ variants: [], loading: false, error: e.message }));
    return () => { off = true; };
  }, [componentId]);

  return state;
}