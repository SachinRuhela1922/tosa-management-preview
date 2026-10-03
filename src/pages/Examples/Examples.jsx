import { useEffect, useRef, useState } from "react";
import styles from "./Examples.module.css";

/* ---------- DATA (tumhare App.jsx + index.html se) ---------- */
const COMPONENTS = [
  { id: "navbar", ico: "☰", name: "Navbar", desc: "Sticky nav, dropdowns, CTA",
    react: `<Navbar\n  logo="TOSA"\n  links={navLinks}\n  background="#0b0d12"\n  accentColor="#a78bfa"\n  sticky\n/>`,
    html: `<custom-navbar\n  logo="FORGE" accent="#ff5b2e"\n  cta="true" ctatext="Join Now" ctaurl="#pricing"\n  links='[{"name":"Pricing","url":"#pricing"}]'\n></custom-navbar>`,
    mini: <><b>TOSA</b><span>Home · Showcase · Contact</span><u>Join</u></> },
  { id: "hero", ico: "🚀", name: "Hero", desc: "Split / image / video hero",
    react: `<Hero\n  badge="TOSA / FUTURE LAB"\n  title="Build interfaces that feel impossible to ignore."\n  primaryButtonText="Explore"\n  variant="split"\n  layout="image-right"\n  height="620px"\n/>`,
    html: `<site-hero\n  badge="🔥 1,200 transformations"\n  heading="Train with a real coach."\n  ctatext="Get Matched Free"\n  align="left" height="82vh"\n></site-hero>`,
    mini: <><div><b>Big bold headline</b><br /><em /></div><u>Explore</u></> },
  { id: "stats", ico: "📊", name: "Stats", desc: "Animated counters",
    react: `<FeatureStrip items={features} accentColor="#7c3aed" />`,
    html: `<site-stats\n  heading="Numbers our members care about"\n  items='[{"label":"Members","value":12600,"suffix":"+"}]'\n></site-stats>`,
    mini: <><b>12,600+</b><b>91%</b><b>4.8/5</b></> },
  { id: "pricing", ico: "💳", name: "Pricing", desc: "Plans with highlight badge",
    react: `<Button size="lg" radius="999px" color="#7c3aed">\n  Start building\n</Button>`,
    html: `<site-pricing\n  heading="Pick your plan"\n  plans='[{"name":"Coached","price":"$89","period":"/mo","highlighted":true}]'\n></site-pricing>`,
    mini: <><span>$19</span><b>$89 ★</b><span>$219</span></> },
  { id: "features", ico: "✦", name: "Features", desc: "Icon grid, 2–4 columns",
    react: `<FeatureStrip\n  items={[{ icon: "✦", title: "Build faster", text: "Reusable blocks." }]}\n/>`,
    html: `<site-features\n  columns="3"\n  items='[{"icon":"🎯","title":"Custom programming","desc":"..."}]'\n></site-features>`,
    mini: <><div className={styles.bars}><em /><em /><em /></div><span>6 features</span></> },
  { id: "faq", ico: "❓", name: "FAQ", desc: "Accordion, multi-open",
    react: `{/* FAQ ke liye HTML web component use karo ya Modal + custom list */}`,
    html: `<site-faq\n  multiopen="true"\n  items='[{"question":"Gym needed?","answer":"No."}]'\n></site-faq>`,
    mini: <><b>Do I need a gym?</b><span>▾</span></> },
  { id: "testimonials", ico: "💬", name: "Testimonials", desc: "Autoplay carousel / grid",
    react: `<Testimonials\n  title="Built with TOSA"\n  columns={3}\n  items={[{ name: "Aarav", role: "Designer", rating: 5, text: "Great." }]}\n/>`,
    html: `<site-testimonials\n  autoplay="true" interval="6000"\n  items='[{"name":"Priya","role":"Member","text":"..."}]'\n></site-testimonials>`,
    mini: <><span>“Only thing that stuck.”</span><b>★★★★★</b></> },
  { id: "newsletter", ico: "✉️", name: "Newsletter / CTA", desc: "Email capture section",
    react: `<Newsletter\n  layout="split"\n  title="Get the next TOSA build"\n  accentColor="#a78bfa"\n/>`,
    html: `<site-cta\n  newsletter="true"\n  heading="Free weekly tips"\n  buttontext="Sign me up"\n></site-cta>`,
    mini: <><span>you@email.com</span><u>Sign me up</u></> },
];

const REACT_FULL = `// 1) Import
import { Navbar, Hero, Button, Badge, Testimonials, Newsletter, Modal } from "tosa-ui";

// 2) Compose
export default function App() {
  const [open, setOpen] = useState(false);
  return (
    <main>
      <Navbar logo="TOSA" links={navLinks} background="#0b0d12" />
      <Hero title="Build interfaces that feel impossible to ignore."
            variant="split" onSecondaryClick={() => setOpen(true)} />
      <Testimonials title="Built with TOSA" columns={3} items={items} />
      <Newsletter layout="split" title="Get the next TOSA build" />
      <Modal open={open} onClose={() => setOpen(false)} title="Component Lab" />
    </main>
  );
}`;

const HTML_FULL = `<!-- 1) Tags use karo -->
<custom-navbar logo="FORGE" accent="#ff5b2e" cta="true" ctatext="Join Now"></custom-navbar>
<site-hero heading="Train with a real coach." ctatext="Get Matched"></site-hero>
<site-pricing heading="Pick your plan" plans='[...]'></site-pricing>
<site-faq heading="Questions" items='[...]'></site-faq>
<site-footer logo="FORGE" copyright="© 2026"></site-footer>

<!-- 2) Scripts load karo (end of body) -->
<script type="module" src="./src/components/navbar/navbar.js"></script>
<script type="module" src="./src/components/hero/hero.js"></script>
<script type="module" src="./src/components/pricing/pricing.js"></script>
<script type="module" src="./src/components/faq/faq.js"></script>
<script type="module" src="./src/components/footer/footer.js"></script>`;

/* Web components kisi bhi framework me kaam karte hain (HTML tags hain). */
const FW = {
  Vue: ["App.vue", `<template>\n  <site-hero heading="Hello from Vue" ctatext="Start"></site-hero>\n</template>\n<script setup>\nimport "./components/hero/hero.js";\n// vite.config: vue({ template: { compilerOptions: {\n//   isCustomElement: (t) => t.startsWith("site-") || t.startsWith("custom-") } } })\n</script>`],
  Angular: ["app.component.html", `<site-hero heading="Hello from Angular" ctatext="Start"></site-hero>\n\n// app.module.ts\n// schemas: [CUSTOM_ELEMENTS_SCHEMA]\n// main.ts:  import "./components/hero/hero.js";`],
  Svelte: ["+page.svelte", `<script>\n  import "$lib/components/hero/hero.js";\n</script>\n\n<site-hero heading="Hello from Svelte" ctatext="Start"></site-hero>`],
  "Next.js": ["app/page.tsx", `"use client";\nimport { useEffect } from "react";\n\nexport default function Page() {\n  useEffect(() => { import("@/components/hero/hero.js"); }, []);\n  return <site-hero heading="Hello from Next" ctatext="Start" />;\n}`],
  PHP: ["index.php", `<?php $plans = json_encode($plansArray); ?>\n<site-pricing heading="Pick your plan" plans='<?= htmlspecialchars($plans, ENT_QUOTES) ?>'></site-pricing>\n<script type="module" src="/assets/pricing.js"></script>`],
  Django: ["page.html", `{% load static %}\n<site-hero heading="{{ title }}" ctatext="Start"></site-hero>\n<script type="module" src="{% static 'components/hero/hero.js' %}"></script>`],
  Laravel: ["welcome.blade.php", `<site-hero heading="{{ $title }}" ctatext="Start"></site-hero>\n<script type="module" src="{{ asset('components/hero/hero.js') }}"></script>`],
  Rails: ["index.html.erb", `<site-hero heading="<%= @title %>" ctatext="Start"></site-hero>\n<%= javascript_include_tag "hero", type: "module" %>`],
};

const NAV = [["start", "🚀", "Overview"], ["react", "⚛️", "React"], ["html", "🧩", "HTML"], ["fw", "🌍", "Any framework"], ["lab", "🎛️", "Component lab"], ["build", "🏗️", "Build a page"]];
const SW = ["#58a6ff", "#8b5cf6", "#ff5b2e", "#3fb950", "#ff7bb5"];

/* ---------- helpers ---------- */
function useCopy() {
  const [k, setK] = useState(null);
  return [k, async (t, key) => { try { await navigator.clipboard.writeText(t); } catch {} setK(key); setTimeout(() => setK(null), 1600); }];
}

function Reveal({ children, className = "", as: T = "div", ...p }) {
  const ref = useRef(null); const [on, setOn] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setOn(true), io.disconnect()), { threshold: 0.1 });
    ref.current && io.observe(ref.current); return () => io.disconnect();
  }, []);
  return <T ref={ref} className={`${styles.reveal} ${on ? styles.in : ""} ${className}`} {...p}>{children}</T>;
}

function Counter({ to, suffix = "" }) {
  const ref = useRef(null); const [v, setV] = useState(0);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return; io.disconnect();
      const t0 = performance.now();
      const tick = (t) => { const p = Math.min(1, (t - t0) / 1400); setV(Math.round(to * (1 - Math.pow(1 - p, 3)))); p < 1 && requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    }, { threshold: 0.5 });
    ref.current && io.observe(ref.current); return () => io.disconnect();
  }, [to]);
  return <b ref={ref}>{v}{suffix}</b>;
}

function Tabs({ items, value, onChange }) {
  return (
    <div className={styles.scrollTabs}>
      <div className={styles.tabs} style={{ "--n": items.length, "--i": Math.max(0, items.indexOf(value)) }}>
        <i />{items.map((t) => <button key={t} className={t === value ? styles.tabOn : ""} onClick={() => onChange(t)}>{t}</button>)}
      </div>
    </div>
  );
}

function Code({ file, code, id, copied, onCopy }) {
  return (
    <div className={styles.code}>
      <div className={styles.codeBar}>
        <div className={styles.lights}><i /><i /><i /></div><span className={styles.file}>{file}</span>
        <button className={copied === id ? styles.done : ""} onClick={() => onCopy(code, id)}>{copied === id ? "Copied ✓" : "Copy"}</button>
      </div>
      <pre key={code}><code>{code}</code></pre>
    </div>
  );
}

function Head({ ico, title, sub }) {
  return <div className={styles.secHead}><div className={styles.secIco}>{ico}</div><div><h2>{title}</h2><p>{sub}</p></div></div>;
}

const Div = () => <div className={styles.divider}><i /><b /><i /></div>;

/* ---------- page ---------- */
export default function Examples() {
  const [copied, copy] = useCopy();
  const [active, setActive] = useState("start");
  const [progress, setProgress] = useState(0);
  const [fw, setFw] = useState("Vue");
  const [sel, setSel] = useState(COMPONENTS[0]);
  const [mode, setMode] = useState("React");
  const [picked, setPicked] = useState(["navbar", "hero", "pricing"]);
  const [acc, setAcc] = useState(SW[0]);
  const rig = useRef(null);

  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const tilt = (e) => {
    const el = e.currentTarget, r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `rotateX(${-y * 14}deg) rotateY(${x * 14}deg)`;
    el.style.setProperty("--mx", `${e.clientX - r.left}px`); el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  const untilt = (e) => (e.currentTarget.style.transform = "");
  const toggle = (id) => setPicked((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  useEffect(() => {
    const onScroll = () => { const h = document.documentElement; setProgress(h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight)); };
    onScroll(); window.addEventListener("scroll", onScroll, { passive: true });
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: "-30% 0px -60% 0px" });
    NAV.forEach(([id]) => { const el = document.getElementById(id); el && io.observe(el); });
    return () => { window.removeEventListener("scroll", onScroll); io.disconnect(); };
  }, []);

  const built = COMPONENTS.filter((c) => picked.includes(c.id));
  const builtCode = built.map((c) => c.html.replace(/#ff5b2e/g, acc)).join("\n\n");

  return (
    <div className={styles.page}>
      <div className={styles.bar} style={{ transform: `scaleX(${progress})` }} />
      <div className={styles.aurora} /><div className={styles.grid} />

      <header className={styles.hero}>
        <div className={styles.heroText}>
          <span className={styles.pill}><i /> React · HTML · Any framework</span>
          <h1>See <span className={styles.grad}>TOSA</span> in action.</h1>
          <p>Ek hi component library se studio site, SaaS landing, portfolio ya docs bana lo. Live examples, copy-paste code aur ek interactive page builder.</p>
          <div className={styles.cta}>
            <button className={styles.primary} onClick={() => go("build")}>Build a page →</button>
            <button className={styles.ghost} onClick={() => go("react")}>View code</button>
          </div>
        </div>
        <div className={styles.scene}
          onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5; rig.current.style.transform = `rotateX(${58 - y * 20}deg) rotateZ(${-38 + x * 30}deg)`; }}
          onMouseLeave={() => (rig.current.style.transform = "")}>
          <div ref={rig} className={styles.rig}>
            {["NAVBAR", "HERO", "FEATURES", "PRICING", "FOOTER"].map((l, k) => <div key={l} className={styles.layer} style={{ "--k": k }}>{l}</div>)}
          </div>
        </div>
      </header>

      <div className={styles.marquee}><div className={styles.track}>
        {[...COMPONENTS, ...COMPONENTS, ...COMPONENTS, ...COMPONENTS].map((c, i) => <span key={i}>{c.ico} {c.name}</span>)}
      </div></div>

      <div className={styles.stats}>
        {[[10, "", "React components"], [10, "", "Web components"], [8, "+", "Frameworks covered"], [100, "%", "Composable"]].map(([n, s, l]) => (
          <Reveal key={l} className={styles.stat}><Counter to={n} suffix={s} /><span>{l}</span></Reveal>
        ))}
      </div>

      <div className={styles.shell}>
        <aside className={styles.side}>
          <p className={styles.sideTitle}>On this page</p>
          <nav className={styles.sideList}>
            {NAV.map(([id, ico, l]) => <button key={id} className={`${styles.sideItem} ${active === id ? styles.sideOn : ""}`} onClick={() => go(id)}><span>{ico}</span>{l}</button>)}
          </nav>
        </aside>

        <main className={styles.main}>
          <Reveal as="section" id="start" className={styles.sec}>
            <Head ico="🚀" title="Overview" sub="TOSA 2 tareeke se use hota hai: React components (tosa-ui) ya framework-free HTML web components." />
            <div className={styles.callout}><span>💡</span><div><b>Kaunsa choose karein?</b><p>React project hai to <code>tosa-ui</code> import karo. Plain HTML, PHP, Django, Laravel ya kisi bhi stack me <code>&lt;site-hero&gt;</code> jaise tags use karo.</p></div></div>
          </Reveal>
          <Div />

          <Reveal as="section" id="react" className={styles.sec}>
            <Head ico="⚛️" title="React example" sub="Import karo, compose karo, ship karo." />
            <Code id="r" file="App.jsx" code={REACT_FULL} copied={copied} onCopy={copy} />
          </Reveal>
          <Div />

          <Reveal as="section" id="html" className={styles.sec}>
            <Head ico="🧩" title="HTML example" sub="Custom tags + type=module scripts. Build step ki zarurat nahi." />
            <Code id="h" file="index.html" code={HTML_FULL} copied={copied} onCopy={copy} />
          </Reveal>
          <Div />

          <Reveal as="section" id="fw" className={styles.sec}>
            <Head ico="🌍" title="Any framework" sub="Web components standard HTML hain, isliye har stack me chalte hain. (Paths/config apne project ke hisab se badlo.)" />
            <Tabs items={Object.keys(FW)} value={fw} onChange={setFw} />
            <Code id="fw" file={FW[fw][0]} code={FW[fw][1]} copied={copied} onCopy={copy} />
          </Reveal>
          <Div />

          <Reveal as="section" id="lab" className={styles.sec}>
            <Head ico="🎛️" title="Component lab" sub="Card pe hover karo (3D tilt), click karke React/HTML code dekho." />
            <div className={styles.cards}>
              {COMPONENTS.map((c) => (
                <button key={c.id} onMouseMove={tilt} onMouseLeave={untilt} onClick={() => setSel(c)} className={`${styles.card} ${sel.id === c.id ? styles.cardOn : ""}`}>
                  <div className={styles.cardIco}>{c.ico}</div><b>{c.name}</b><p>{c.desc}</p>
                </button>
              ))}
            </div>
            <Tabs items={["React", "HTML"]} value={mode} onChange={setMode} />
            <Code id="sel" file={`${sel.name} · ${mode}`} code={mode === "React" ? sel.react : sel.html} copied={copied} onCopy={copy} />
          </Reveal>
          <Div />

          <Reveal as="section" id="build" className={styles.sec}>
            <Head ico="🏗️" title="Build a page" sub="Components on/off karo, accent color badlo, aur ready-made HTML copy karo." />
            <div className={styles.chips}>
              {COMPONENTS.map((c) => <button key={c.id} className={`${styles.chip} ${picked.includes(c.id) ? styles.chipOn : ""}`} onClick={() => toggle(c.id)}>{c.ico} {c.name}</button>)}
            </div>
            <div className={styles.swatches}>Accent:
              {SW.map((c) => <button key={c} aria-label={c} style={{ background: c, color: c }} className={acc === c ? styles.swOn : ""} onClick={() => setAcc(c)} />)}
            </div>
            <div className={styles.frame} style={{ "--acc": acc }}>
              <div className={styles.frameBar}><div className={styles.lights}><i /><i /><i /></div><span className={styles.url}>https://your-site.com</span></div>
              <div className={styles.canvas}>
                {built.length ? built.map((c) => <div key={c.id} className={styles.mini}>{c.mini}</div>) : <span style={{ color: "var(--mu)" }}>Koi component select karo…</span>}
              </div>
            </div>
            <Code id="built" file="index.html" code={builtCode || "<!-- empty -->"} copied={copied} onCopy={copy} />
          </Reveal>
        </main>
      </div>
    </div>
  );
}