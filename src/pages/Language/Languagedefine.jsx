import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Languagedefine.module.css";

/* ================= CONTENT (yahin se naye languages add kar) ================= */
const LANGS = [
  {
    id: "html", name: "HTML", short: "Ht", hue: 18, kind: "Markup", year: 1993, level: 20, file: "index.html",
    tagline: "The skeleton of every web page.",
    def: "HyperText Markup Language describes the structure of a page: headings, paragraphs, buttons, forms and links. Browsers read it first and build everything else on top of it.",
    features: ["Semantic tags like <nav> and <main> help SEO and screen readers", "Works in every browser with zero setup", "Pairs with CSS for looks and JS for behaviour"],
    uses: ["Static landing pages", "Email templates", "Accessible form layouts"],
    code: `<button class="btn" aria-label="Save">\n  <svg class="icon"></svg>\n  Save changes\n</button>`,
  },
  {
    id: "css", name: "CSS", short: "Cs", hue: 212, kind: "Style", year: 1996, level: 40, file: "button.css",
    tagline: "Colour, layout and motion.",
    def: "Cascading Style Sheets control how HTML looks. Grid and Flexbox handle layout, variables handle themes, and transitions and keyframes bring components to life.",
    features: ["Custom properties make dark and light themes easy", "Grid and Flexbox build responsive layouts", "Transitions and keyframes need no JavaScript"],
    uses: ["Animated buttons and cards", "Theming a whole design system", "Responsive layouts"],
    code: `.btn {\n  padding: 10px 18px;\n  border-radius: 12px;\n  transition: transform .25s;\n}\n.btn:hover { transform: translateY(-2px); }`,
  },
  {
    id: "tailwind", name: "Tailwind CSS", short: "Tw", hue: 190, kind: "Style", year: 2017, level: 45, file: "Button.html",
    tagline: "Style by composing small utility classes.",
    def: "Tailwind gives you tiny single-purpose classes like px-4 and rounded-xl. You style straight in your markup, so there are no separate CSS files to chase.",
    features: ["Fast to build with, and consistent by default", "Unused styles are removed in production", "Variants like hover: and md: are built in"],
    uses: ["Rapid prototypes", "Design systems on a team", "Dashboards and admin panels"],
    code: `<button class="rounded-xl bg-blue-500 px-4 py-2\n  font-semibold text-white hover:-translate-y-0.5">\n  Save changes\n</button>`,
  },
  {
    id: "javascript", name: "JavaScript", short: "Js", hue: 48, kind: "Script", year: 1995, level: 60, file: "copy.js",
    tagline: "The language that makes pages respond.",
    def: "JavaScript runs in the browser and reacts to clicks, typing and scrolling. It fetches data, updates the page and powers almost every interactive component.",
    features: ["Runs natively in all browsers", "Async/await makes API calls readable", "Huge ecosystem on npm"],
    uses: ["Modals, tabs and dropdowns", "Form validation", "Fetching live data"],
    code: `const copy = async (text) => {\n  await navigator.clipboard.writeText(text);\n  console.log("Copied!");\n};`,
  },
  {
    id: "typescript", name: "TypeScript", short: "Ts", hue: 220, kind: "Script", year: 2012, level: 70, file: "Card.tsx",
    tagline: "JavaScript with a safety net.",
    def: "TypeScript adds types on top of JavaScript. Your editor catches mistakes before the code runs, and component props document themselves.",
    features: ["Autocomplete for every prop", "Errors show up while you type", "Compiles to plain JavaScript"],
    uses: ["Large codebases", "Shared component libraries", "Safer API contracts"],
    code: `type CardProps = {\n  title: string;\n  tone?: "info" | "warn";\n};\nconst Card = ({ title, tone = "info" }: CardProps) => <h3>{title}</h3>;`,
  },
  {
    id: "react", name: "React", short: "Re", hue: 196, kind: "Framework", year: 2013, level: 75, file: "Counter.jsx",
    tagline: "Build the UI out of reusable components.",
    def: "React lets you describe the interface as small components that hold their own state. When data changes, React updates only the parts of the page that need it.",
    features: ["Hooks keep logic reusable", "One-way data flow is easy to debug", "Works with Next.js, Vite and more"],
    uses: ["Single page apps", "Component libraries like this one", "Dashboards with live state"],
    code: `export default function Counter() {\n  const [n, setN] = useState(0);\n  return <button onClick={() => setN(n + 1)}>Clicked {n}</button>;\n}`,
  },
];
const KINDS = ["All", "Markup", "Style", "Script", "Framework"];

/* ================= helpers ================= */
const Svg = ({ d, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={d} /></svg>
);
const I = {
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3",
  copy: "M9 9h11v11H9zM5 15H4V4h11v1",
  check: "M5 12l5 5 9-10",
  arrow: "M5 12h14M12 5l7 7-7 7",
  up: "M12 19V5M5 12l7-7 7 7",
  dot: "M12 12h.01",
};

/* element viewport me aate hi "in" class lagta hai */
const Reveal = ({ as: Tag = "div", className = "", children, ...rest }) => {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setOn(true), io.disconnect()), { threshold: 0.12 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return <Tag ref={ref} className={`${styles.reveal} ${on ? styles.in : ""} ${className}`} {...rest}>{children}</Tag>;
};

/* typewriter */
const useTyper = (text) => {
  const [n, setN] = useState(0);
  useEffect(() => {
    setN(0);
    const id = setInterval(() => setN((v) => (v >= text.length ? (clearInterval(id), v) : v + 1)), 20);
    return () => clearInterval(id);
  }, [text]);
  return text.slice(0, n);
};

const Code = ({ file, code, hue }) => {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(code); setDone(true); setTimeout(() => setDone(false), 1500); } catch { /* blocked */ }
  };
  return (
    <div className={styles.code} style={{ "--h": hue }}>
      <div className={styles.codeBar}>
        <span className={styles.lights}><i /><i /><i /></span>
        <span className={styles.file}>{file}</span>
        <button onClick={copy} className={done ? styles.done : ""}><Svg d={done ? I.check : I.copy} size={13} /> {done ? "Copied" : "Copy"}</button>
      </div>
      <pre><code>{code}</code></pre>
    </div>
  );
};

/* ================= page ================= */
const LanguagesDefine = () => {
  const [q, setQ] = useState("");
  const [kind, setKind] = useState("All");
  const [active, setActive] = useState(LANGS[0].id);
  const [hero, setHero] = useState(0);

  const list = useMemo(() => {
    const s = q.trim().toLowerCase();
    return LANGS.filter((l) => (kind === "All" || l.kind === kind) && (!s || `${l.name} ${l.tagline} ${l.def}`.toLowerCase().includes(s)));
  }, [q, kind]);

  /* hero me languages rotate */
  useEffect(() => {
    const id = setInterval(() => setHero((h) => (h + 1) % LANGS.length), 4800);
    return () => clearInterval(id);
  }, []);
  const hl = LANGS[hero];
  const typed = useTyper(hl.code);

  /* scroll spy */
  const key = list.map((l) => l.id).join("|");
  useEffect(() => {
    const els = list.map((l) => document.getElementById(l.id)).filter(Boolean);
    if (!els.length) return;
    const io = new IntersectionObserver(
      (es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-25% 0px -65% 0px" }
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  const pos = Math.max(0, list.findIndex((l) => l.id === active)) + 1;

  return (
    <div className={styles.page}>
      <div className={styles.aurora} aria-hidden="true" />

      {/* ============ HERO ============ */}
      <header className={styles.hero}>
        <div className={styles.heroText}>
          <span className={styles.pill}><i /> {LANGS.length} languages, one component library</span>
          <h1>Pick the language.<br />Copy the component.</h1>
          <p>Every component here ships in the languages below. Read what each one is for, see real code, and choose the one that fits your project.</p>
          <div className={styles.heroCta}>
            <button onClick={() => go(LANGS[0].id)} className={styles.primary}>Start reading <Svg d={I.arrow} size={15} /></button>
            <Link to="/components" className={styles.ghost}>Browse components</Link>
          </div>
        </div>

        <div className={styles.live} style={{ "--h": hl.hue }}>
          <div className={styles.liveTabs}>
            {LANGS.map((l, i) => (
              <button key={l.id} onClick={() => setHero(i)} className={i === hero ? styles.tabOn : ""} style={{ "--h": l.hue }}>{l.short}</button>
            ))}
          </div>
          <div className={styles.liveBody}>
            <b key={hl.id} className={styles.liveName}>{hl.name}</b>
            <pre><code>{typed}<span className={styles.caret} /></code></pre>
          </div>
        </div>
      </header>

      {/* marquee */}
      <div className={styles.marquee} aria-hidden="true">
        <div>
          {[...LANGS, ...LANGS, ...LANGS].map((l, i) => (
            <span key={i} style={{ "--h": l.hue }}><i />{l.name}</span>
          ))}
        </div>
      </div>

      {/* ============ TOOLBAR ============ */}
      <div className={styles.tools}>
        <label className={styles.find}>
          <Svg d={I.search} size={15} />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search a language or topic..." spellCheck="false" />
        </label>
        <div className={styles.kinds}>
          {KINDS.map((k) => (
            <button key={k} onClick={() => setKind(k)} className={kind === k ? styles.kindOn : ""}>{k}</button>
          ))}
        </div>
      </div>

      <div className={styles.shell}>
        {/* ============ SIDEBAR ============ */}
        <nav className={styles.side} aria-label="Languages">
          <p className={styles.sideTitle}>Languages <em>{list.length ? `${pos}/${list.length}` : "0"}</em></p>
          <div className={styles.sideList}>
            {list.map((l) => (
              <button key={l.id} onClick={() => go(l.id)} className={`${styles.sideItem} ${active === l.id ? styles.sideOn : ""}`} style={{ "--h": l.hue }}>
                <span className={styles.mono}>{l.short}</span>
                <span className={styles.sideName}>{l.name}</span>
                <small>{l.kind}</small>
              </button>
            ))}
          </div>
          <button className={styles.top} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}><Svg d={I.up} size={13} /> Back to top</button>
        </nav>

        {/* ============ CONTENT ============ */}
        <main className={styles.main}>
          {list.length === 0 && (
            <div className={styles.empty}>
              <h2>No language matches “{q}”</h2>
              <p>Try a shorter word, or reset the filter.</p>
              <button className={styles.ghost} onClick={() => { setQ(""); setKind("All"); }}>Reset filters</button>
            </div>
          )}

          {list.map((l) => (
            <Reveal as="section" key={l.id} id={l.id} className={styles.card}>
              <div style={{ "--h": l.hue }} className={styles.cardInner}>
                <div className={styles.cardHead}>
                  <span className={styles.badge}>{l.short}</span>
                  <div>
                    <h2>{l.name}</h2>
                    <p className={styles.tagline}>{l.tagline}</p>
                  </div>
                </div>

                <div className={styles.meta}>
                  <em>{l.kind}</em><em>Since {l.year}</em>
                  <span className={styles.meter} title={`Learning curve ${l.level}%`}>
                    <small>Learning curve</small>
                    <i><b style={{ "--w": `${l.level}%` }} /></i>
                  </span>
                </div>

                <p className={styles.def}>{l.def}</p>

                <div className={styles.cols}>
                  <div>
                    <h3>Why it's good</h3>
                    <ul>{l.features.map((f) => <li key={f}><Svg d={I.check} size={14} />{f}</li>)}</ul>
                  </div>
                  <div>
                    <h3>Where you'll use it</h3>
                    <div className={styles.tags}>{l.uses.map((u) => <span key={u}>{u}</span>)}</div>
                  </div>
                </div>

                <Code file={l.file} code={l.code} hue={l.hue} />

                <Link to="/components" className={styles.more}>Browse {l.name} components <Svg d={I.arrow} size={14} /></Link>
              </div>
            </Reveal>
          ))}

          {list.length > 0 && (
            <Reveal className={styles.cta}>
              <h2>Not sure which one to start with?</h2>
              <p>Begin with HTML and CSS. Add JavaScript when you need things to move, and React when your pages grow into apps.</p>
              <div className={styles.heroCta}>
                <Link to="/installation" className={styles.primary}>Read installation <Svg d={I.arrow} size={15} /></Link>
                <Link to="/components" className={styles.ghost}>See all components</Link>
              </div>
            </Reveal>
          )}
        </main>
      </div>
    </div>
  );
};

export default LanguagesDefine;