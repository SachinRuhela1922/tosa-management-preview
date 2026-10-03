import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Documentation.module.css";

/* ====================================================================
   CONTENT: yahin se saara docs content badal sakta hai
   (package name "tosa-ui" placeholder hai, apna asli naam daal dena)
   ==================================================================== */
const PKG = "tosa-ui";
const PMS = { npm: `npm install ${PKG}`, yarn: `yarn add ${PKG}`, pnpm: `pnpm add ${PKG}`, bun: `bun add ${PKG}` };

const SECTIONS = [
  { id: "introduction", label: "Introduction", icon: "book" },
  { id: "installation", label: "Installation", icon: "terminal" },
  { id: "quick-start", label: "Quick start", icon: "zap" },
  { id: "using-components", label: "Using components", icon: "code" },
  { id: "theming", label: "Theming", icon: "palette" },
  { id: "api", label: "API reference", icon: "layers" },
  { id: "animations", label: "Animations", icon: "spark" },
  { id: "accessibility", label: "Accessibility", icon: "shield" },
  { id: "changelog", label: "Changelog", icon: "clock" },
  { id: "faq", label: "FAQ", icon: "help" },
  { id: "download", label: "Download docs", icon: "download" },
  { id: "contributing", label: "Contributing", icon: "users" },
];

const LANGS = [
  { id: "html", label: "HTML", desc: "Plain HTML with the Tosa stylesheet. No build step needed.",
    setup: `<link rel="stylesheet" href="tosa.min.css">\n<script src="tosa.min.js" defer></script>`,
    usage: `<button class="tosa-btn tosa-btn--primary">\n  Get started\n</button>`,
    theme: `<html data-theme="dark">` },
  { id: "css", label: "CSS", desc: "Import the styles and override design tokens with custom properties.",
    setup: `@import "tosa-ui/styles.css";`,
    usage: `.tosa-btn {\n  --tosa-radius: 12px;\n  --tosa-pad: 10px 18px;\n}`,
    theme: `:root { --tosa-accent: #58a6ff; }\n[data-theme="dark"] { --tosa-bg: #05060a; }` },
  { id: "javascript", label: "JavaScript", desc: "Behaviour helpers such as toasts, modals and theme switching.",
    setup: `import Tosa from "tosa-ui";\nTosa.init();`,
    usage: `Tosa.toast("Saved!", { type: "success" });`,
    theme: `Tosa.setTheme("dark");` },
  { id: "react", label: "React", desc: "Ready-made components with props, hooks and a theme provider.",
    setup: `import { Button, TosaProvider } from "tosa-ui/react";`,
    usage: `<Button variant="primary" onClick={save}>\n  Save changes\n</Button>`,
    theme: `<TosaProvider theme="dark">\n  <App />\n</TosaProvider>` },
  { id: "tailwind", label: "Tailwind", desc: "A Tailwind plugin that adds Tosa tokens and component classes.",
    setup: `// tailwind.config.js\nplugins: [require("tosa-ui/tailwind")]`,
    usage: `<button class="tosa-btn bg-tosa-accent">\n  Save changes\n</button>`,
    theme: `theme: { extend: { colors: {\n  tosa: { accent: "#58a6ff" }\n} } }` },
];

const FEATURES = [
  ["code", "Copy and paste", "Pick a component, copy the code, ship it. No lock-in."],
  ["layers", "Five languages", "Every component in HTML, CSS, JavaScript, React and Tailwind."],
  ["palette", "Fully themeable", "Design tokens as CSS variables, with dark mode built in."],
  ["shield", "Accessible", "Keyboard support and ARIA roles from the first release."],
  ["spark", "Animated", "Smooth, tasteful motion that respects reduced-motion settings."],
  ["users", "Open source", "Built in public and improved by the community."],
];

const STEPS = [
  { t: "Install the package", c: PMS.npm },
  { t: "Import the styles once", c: `// main.jsx\nimport "tosa-ui/styles.css";` },
  { t: "Use your first component", c: `import { Button } from "tosa-ui/react";\n\nexport default () => <Button>Hello Tosa</Button>;` },
  { t: "Customize with tokens", c: `:root {\n  --tosa-accent: #8b7bff;\n  --tosa-radius: 14px;\n}` },
];

const TREE = `my-app/
├─ src/
│  ├─ components/
│  │  └─ tosa/          copied components live here
│  ├─ styles/
│  │  └─ tosa.css       tokens and base styles
│  └─ main.jsx
└─ package.json`;

const API = {
  Button: [
    ["variant", '"primary" | "ghost" | "danger"', '"primary"', "Visual style of the button."],
    ["size", '"sm" | "md" | "lg"', '"md"', "Controls height and padding."],
    ["loading", "boolean", "false", "Shows a spinner and blocks clicks."],
    ["icon", "ReactNode", "none", "Icon rendered before the label."],
    ["onClick", "(e) => void", "none", "Called when the button is pressed."],
  ],
  Modal: [
    ["open", "boolean", "false", "Controls whether the modal is visible."],
    ["onClose", "() => void", "none", "Called on Esc, backdrop click or close button."],
    ["title", "string", "none", "Heading shown at the top."],
    ["size", '"sm" | "md" | "lg"', '"md"', "Maximum width of the dialog."],
    ["closeOnBackdrop", "boolean", "true", "Close when the dimmed area is clicked."],
  ],
  Tabs: [
    ["items", "{ id, label }[]", "[]", "The tabs to render."],
    ["value", "string", "first id", "Currently selected tab id."],
    ["onChange", "(id) => void", "none", "Called when another tab is selected."],
    ["animated", "boolean", "true", "Slides the indicator between tabs."],
  ],
};

const ANIMS = [
  ["tosa-fade", "Fade in", "Opacity from 0 to 1."],
  ["tosa-slide", "Slide up", "Moves up 20px while fading in."],
  ["tosa-pop", "Pop", "Scales from 0.8 with a soft bounce."],
  ["tosa-shake", "Shake", "Quick horizontal shake for errors."],
  ["tosa-pulse", "Pulse", "Gentle grow and shrink for attention."],
  ["tosa-spin", "Spin", "Continuous rotation for loaders."],
];

const SWATCHES = ["#58a6ff", "#8b7bff", "#3fb950", "#ff8a4c", "#ff5fa2"];

const A11Y = [
  ["Keyboard first", "Every control can be reached with Tab and used with Enter, Space or the arrow keys."],
  ["Screen readers", "Components ship with the right roles, labels and live regions."],
  ["Readable colour", "Default tokens meet WCAG AA contrast in both light and dark themes."],
  ["Reduced motion", "Animations switch off when the visitor prefers reduced motion."],
];

const LOG = [
  ["1.0.0", "Stable release", "Five languages, dark mode and the full animation set."],
  ["0.9.0", "Theme provider", "Added TosaProvider and runtime theme switching."],
  ["0.8.0", "Tailwind plugin", "New plugin with tokens and component classes."],
];

const FAQ = [
  ["Is Tosa free to use?", "Yes. Tosa is open source, so you can use it in personal and commercial projects."],
  ["Do I need React?", "No. Every component also comes in plain HTML, CSS and JavaScript, plus a Tailwind plugin."],
  ["How do I change the colours?", "Override the CSS variables such as --tosa-accent. See the Theming section for a live preview."],
  ["Does it support dark mode?", "Yes. Set data-theme=\"dark\" on the html element, or call Tosa.setTheme(\"dark\")."],
  ["Can I copy a single component?", "Yes. Open any component page and copy only the language you need."],
  ["How do I report a bug?", "Open an issue on GitHub, or use the Contribute button in the navbar."],
];

/* ====================================================================
   small helpers
   ==================================================================== */
const P = {
  book: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14zM20 17v4H6.5A2.5 2.5 0 0 1 4 18.5",
  terminal: "M4 17l6-6-6-6M12 19h8", zap: "M13 2 3 14h9l-1 8 10-12h-9z", code: "M16 18l6-6-6-6M8 6l-6 6 6 6",
  palette: "M12 22a10 10 0 1 1 10-10c0 3-2 4-4 4h-2a2 2 0 0 0-1 3.7c.5.5.3 2.3-3 2.3zM7.5 10.5h.01M12 7h.01M16.5 10.5h.01",
  layers: "M12 2 2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  spark: "M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", clock: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 6v6l4 2",
  help: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3M12 17h.01",
  download: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3",
  users: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8",
  copy: "M9 9h11v11H9zM5 15H4V4h11v1", check: "M5 12l5 5 9-10", arrow: "M5 12h14M12 5l7 7-7 7", up: "M12 19V5M5 12l7-7 7 7",
  chev: "M6 9l6 6 6-6", info: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 16v-4M12 8h.01",
  alert: "M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0zM12 9v4M12 17h.01",
  thumb: "M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.3a2 2 0 0 0 2-1.7l1.4-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3",
  replay: "M3 12a9 9 0 1 0 3-6.7L3 8M3 3v5h5",
};
const Ic = ({ n, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={P[n]} /></svg>
);

const Reveal = ({ as: Tag = "div", className = "", delay = 0, children, ...rest }) => {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  const [settled, setSettled] = useState(false); // delay hata do, warna hover lag karta hai
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setOn(true), io.disconnect()), { threshold: 0.1 });
    ref.current && io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  useEffect(() => {
    if (!on) return;
    const t = setTimeout(() => setSettled(true), delay + 900);
    return () => clearTimeout(t);
  }, [on, delay]);
  return <Tag ref={ref} style={settled ? undefined : { transitionDelay: `${delay}ms` }} className={`${styles.reveal} ${on ? styles.in : ""} ${className}`} {...rest}>{children}</Tag>;
};

const spot = (e) => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
};

const Divider = () => <Reveal className={styles.divider}><i /><b /><i /></Reveal>;

const Head = ({ icon, title, lead }) => (
  <div className={styles.secHead}>
    <span className={styles.secIco}><Ic n={icon} size={20} /></span>
    <div><h2>{title}</h2><p>{lead}</p></div>
  </div>
);

const Callout = ({ kind = "info", title, children }) => (
  <div className={`${styles.callout} ${styles[kind]}`}>
    <Ic n={kind === "warn" ? "alert" : "info"} size={18} />
    <div><b>{title}</b><p>{children}</p></div>
  </div>
);

const Tabs = ({ items, value, onChange }) => (
  <div className={styles.tabs} style={{ "--n": items.length, "--i": Math.max(0, items.findIndex((t) => t.id === value)) }} role="tablist">
    <i />
    {items.map((t) => (
      <button key={t.id} role="tab" aria-selected={t.id === value} className={t.id === value ? styles.tabOn : ""} onClick={() => onChange(t.id)}>{t.label}</button>
    ))}
  </div>
);

const CodeBlock = ({ code, file }) => {
  const [done, setDone] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(code); setDone(true); setTimeout(() => setDone(false), 1500); } catch { /* blocked */ }
  };
  return (
    <div className={styles.code}>
      <div className={styles.codeBar}>
        <span className={styles.lights}><i /><i /><i /></span>
        <span className={styles.file}>{file}</span>
        <button onClick={copy} className={done ? styles.done : ""}><Ic n={done ? "check" : "copy"} size={13} /> {done ? "Copied" : "Copy"}</button>
      </div>
      <pre key={code}><code>{code}</code></pre>
    </div>
  );
};

/* ====================================================================
   .docx generator ("docx" package chahiye: npm i docx)
   ==================================================================== */
const buildDocx = async (langs, name) => {
  const { Document, Packer, Paragraph, TextRun, HeadingLevel, ShadingType } = await import("docx");
  const h = (text, heading) => new Paragraph({ text, heading, spacing: { before: 320, after: 120 } });
  const p = (text) => new Paragraph({ children: [new TextRun(text)], spacing: { after: 140 } });
  const code = (t) =>
    t.split("\n").map((line) =>
      new Paragraph({
        children: [new TextRun({ text: line || " ", font: "Consolas", size: 20 })],
        shading: { type: ShadingType.CLEAR, fill: "F1F3F6", color: "auto" },
        spacing: { after: 0 },
      })
    );

  const kids = [
    h(`Tosa documentation: ${name}`, HeadingLevel.TITLE),
    p("Tosa is a component library you can use in HTML, CSS, JavaScript, React and Tailwind. This guide covers installation, usage and theming."),
    h("Installation", HeadingLevel.HEADING_1),
    ...Object.values(PMS).flatMap((c) => code(c)),
  ];
  langs.forEach((l) => {
    kids.push(h(l.label, HeadingLevel.HEADING_1), p(l.desc));
    kids.push(h("Setup", HeadingLevel.HEADING_2), ...code(l.setup));
    kids.push(h("Usage", HeadingLevel.HEADING_2), ...code(l.usage));
    kids.push(h("Theming", HeadingLevel.HEADING_2), ...code(l.theme));
  });
  if (langs.length > 1) {
    kids.push(h("Frequently asked questions", HeadingLevel.HEADING_1));
    FAQ.forEach(([q, a]) => kids.push(new Paragraph({ children: [new TextRun({ text: q, bold: true })] }), p(a)));
  }

  const blob = await Packer.toBlob(new Document({ sections: [{ children: kids }] }));
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `tosa-${name.toLowerCase().replace(/\s+/g, "-")}-docs.docx`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
};

/* ====================================================================
   PAGE
   ==================================================================== */
const Documentation = () => {
  const [active, setActive] = useState(SECTIONS[0].id);
  const [progress, setProgress] = useState(0);
  const [pm, setPm] = useState("npm");
  const [lang, setLang] = useState("react");
  const [part, setPart] = useState("usage");
  const [comp, setComp] = useState("Button");
  const [accent, setAccent] = useState(SWATCHES[0]);
  const [replay, setReplay] = useState({});
  const [open, setOpen] = useState(0);
  const [busy, setBusy] = useState("");
  const [saved, setSaved] = useState("");
  const [vote, setVote] = useState("");
  const [err, setErr] = useState("");

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(100, (window.scrollY / max) * 100) : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: "-25% 0px -65% 0px" });
    SECTIONS.forEach((s) => { const el = document.getElementById(s.id); el && io.observe(el); });
    return () => io.disconnect();
  }, []);

  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  const L = LANGS.find((l) => l.id === lang);
  const langTabs = LANGS.map((l) => ({ id: l.id, label: l.label }));

  const download = async (key, list, name) => {
    setBusy(key); setErr("");
    try { await buildDocx(list, name); setSaved(key); setTimeout(() => setSaved(""), 2200); }
    catch { setErr('Download failed. Run "npm i docx" in your project and try again.'); }
    setBusy("");
  };

  return (
    <div className={styles.page}>
      <div className={styles.bar} style={{ transform: `scaleX(${progress / 100})` }} />
      <div className={styles.aurora} aria-hidden="true" />

      {/* ================= HERO ================= */}
      <header className={styles.hero}>
        <div className={styles.heroText}>
          <span className={styles.pill}><i /> Version 1.0 · Updated this month</span>
          <h1>Everything you need to build with Tosa</h1>
          <p>Install it, use it in your favourite language, make it yours, and take the guide offline. Start anywhere, every section stands on its own.</p>
          <div className={styles.cta}>
            <button className={styles.primary} onClick={() => go("quick-start")}>Quick start <Ic n="arrow" size={15} /></button>
            <button className={styles.ghost} onClick={() => go("download")}><Ic n="download" size={15} /> Download docs</button>
          </div>
        </div>
        <div className={styles.stack} aria-hidden="true">
          {[["50+", "components"], ["5", "languages"], ["2", "themes"]].map(([n, t], i) => (
            <div key={t} className={styles.stat} style={{ "--d": `${i * 0.9}s` }}><b>{n}</b><span>{t}</span></div>
          ))}
        </div>
      </header>

      <div className={styles.shell}>
        {/* ================= SIDEBAR ================= */}
        <nav className={styles.side} aria-label="Documentation">
          <p className={styles.sideTitle}>On this page <em>{Math.round(progress)}%</em></p>
          <div className={styles.sideList}>
            {SECTIONS.map((s) => (
              <button key={s.id} onClick={() => go(s.id)} className={`${styles.sideItem} ${active === s.id ? styles.sideOn : ""}`}>
                <Ic n={s.icon} size={15} /> <span>{s.label}</span>
              </button>
            ))}
          </div>
          <button className={styles.top} onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}><Ic n="up" size={13} /> Back to top</button>
        </nav>

        <main className={styles.main}>
          {/* ---------- introduction ---------- */}
          <Reveal as="section" id="introduction" className={styles.sec}>
            <Head icon="book" title="Introduction" lead="Tosa is a component library for people who want good-looking interfaces without fighting a framework." />
            <p className={styles.text}>Each component is small, readable and yours to change. You can install the package, or copy a single component into your project. Tosa works with plain HTML and with modern frameworks, so you never have to rewrite what you already built.</p>
            <div className={styles.grid3}>
              {FEATURES.map(([ic, t, d], i) => (
                <Reveal key={t} delay={i * 70} className={`${styles.card} ${styles.spot}`} onMouseMove={spot}>
                  <span className={styles.cardIco}><Ic n={ic} size={18} /></span>
                  <b>{t}</b><p>{d}</p>
                </Reveal>
              ))}
            </div>
          </Reveal>
          <Divider />

          {/* ---------- installation ---------- */}
          <Reveal as="section" id="installation" className={styles.sec}>
            <Head icon="terminal" title="Installation" lead="Add Tosa to a new or existing project in under a minute." />
            <Tabs items={Object.keys(PMS).map((k) => ({ id: k, label: k }))} value={pm} onChange={setPm} />
            <CodeBlock code={PMS[pm]} file="terminal" />
            <Callout title="Requirements">Node.js 18 or newer. React 17+ is only needed if you use the React components.</Callout>
            <h3 className={styles.sub}>Suggested project structure</h3>
            <CodeBlock code={TREE} file="structure" />
          </Reveal>
          <Divider />

          {/* ---------- quick start ---------- */}
          <Reveal as="section" id="quick-start" className={styles.sec}>
            <Head icon="zap" title="Quick start" lead="Four steps from an empty project to your first Tosa component." />
            <ol className={styles.steps}>
              {STEPS.map((s, i) => (
                <Reveal as="li" key={s.t} delay={i * 90}>
                  <span className={styles.dot}>{i + 1}</span>
                  <h3>{s.t}</h3>
                  <CodeBlock code={s.c} file={i === 3 ? "tokens.css" : i === 2 ? "App.jsx" : i === 1 ? "main.jsx" : "terminal"} />
                </Reveal>
              ))}
            </ol>
          </Reveal>
          <Divider />

          {/* ---------- using components ---------- */}
          <Reveal as="section" id="using-components" className={styles.sec}>
            <Head icon="code" title="Using components" lead="The same Button, shown in every language. Pick yours." />
            <Tabs items={langTabs} value={lang} onChange={setLang} />
            <Tabs items={[{ id: "setup", label: "Setup" }, { id: "usage", label: "Usage" }, { id: "theme", label: "Theming" }]} value={part} onChange={setPart} />
            <CodeBlock code={L[part]} file={`${L.label.toLowerCase()}-${part}`} />
            <p className={styles.text}>{L.desc}</p>
          </Reveal>
          <Divider />

          {/* ---------- theming ---------- */}
          <Reveal as="section" id="theming" className={styles.sec}>
            <Head icon="palette" title="Theming" lead="Every colour, radius and shadow is a CSS variable. Try changing the accent below." />
            <div className={styles.playground} style={{ "--acc": accent }}>
              <div className={styles.swatches}>
                {SWATCHES.map((c) => (
                  <button key={c} aria-label={`Accent ${c}`} onClick={() => setAccent(c)} className={accent === c ? styles.swOn : ""} style={{ background: c }} />
                ))}
              </div>
              <div className={styles.preview}>
                <button className={styles.pvBtn}>Primary button</button>
                <span className={styles.pvBadge}>New</span>
                <div className={styles.pvBar}><b /></div>
              </div>
              <code className={styles.token}>--tosa-accent: {accent};</code>
            </div>
            <Callout title="Dark mode">Set data-theme="dark" on the html element. Tokens switch automatically, with a short cross-fade.</Callout>
          </Reveal>
          <Divider />

          {/* ---------- api ---------- */}
          <Reveal as="section" id="api" className={styles.sec}>
            <Head icon="layers" title="API reference" lead="Props for the most used React components." />
            <Tabs items={Object.keys(API).map((k) => ({ id: k, label: k }))} value={comp} onChange={setComp} />
            <div className={styles.tableWrap}>
              <table key={comp} className={styles.table}>
                <thead><tr><th>Prop</th><th>Type</th><th>Default</th><th>Description</th></tr></thead>
                <tbody>
                  {API[comp].map((r, i) => (
                    <tr key={r[0]} style={{ animationDelay: `${i * 60}ms` }}>
                      <td><code>{r[0]}</code></td><td><code className={styles.type}>{r[1]}</code></td><td><code>{r[2]}</code></td><td>{r[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
          <Divider />

          {/* ---------- animations ---------- */}
          <Reveal as="section" id="animations" className={styles.sec}>
            <Head icon="spark" title="Animations" lead="Add motion with one class. Click any card to replay it." />
            <div className={styles.grid3}>
              {ANIMS.map(([cls, name, d]) => (
                <button key={cls} className={`${styles.card} ${styles.anim}`} onClick={() => setReplay((r) => ({ ...r, [cls]: (r[cls] || 0) + 1 }))}>
                  <span key={replay[cls] || 0} className={`${styles.box} ${styles[cls.replace("tosa-", "a_")]}`} />
                  <b>{name}</b><code>.{cls}</code><p>{d}</p>
                  <small><Ic n="replay" size={12} /> Replay</small>
                </button>
              ))}
            </div>
          </Reveal>
          <Divider />

          {/* ---------- accessibility ---------- */}
          <Reveal as="section" id="accessibility" className={styles.sec}>
            <Head icon="shield" title="Accessibility" lead="Good interfaces work for everyone. Tosa handles the basics for you." />
            <div className={styles.grid2}>
              {A11Y.map(([t, d], i) => (
                <Reveal key={t} delay={i * 80} className={`${styles.card} ${styles.spot}`} onMouseMove={spot}>
                  <span className={styles.cardIco}><Ic n="check" size={18} /></span><b>{t}</b><p>{d}</p>
                </Reveal>
              ))}
            </div>
          </Reveal>
          <Divider />

          {/* ---------- changelog ---------- */}
          <Reveal as="section" id="changelog" className={styles.sec}>
            <Head icon="clock" title="Changelog" lead="What changed in recent releases." />
            <ul className={styles.log}>
              {LOG.map(([v, t, d], i) => (
                <Reveal as="li" key={v} delay={i * 90}><em>v{v}</em><div><b>{t}</b><p>{d}</p></div></Reveal>
              ))}
            </ul>
          </Reveal>
          <Divider />

          {/* ---------- faq ---------- */}
          <Reveal as="section" id="faq" className={styles.sec}>
            <Head icon="help" title="Frequently asked questions" lead="Quick answers to common questions." />
            <div className={styles.acc}>
              {FAQ.map(([q, a], i) => (
                <div key={q} className={`${styles.item} ${open === i ? styles.itemOpen : ""}`}>
                  <button onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>{q}<Ic n="chev" size={16} /></button>
                  <div className={styles.panel}><div><p>{a}</p></div></div>
                </div>
              ))}
            </div>
          </Reveal>
          <Divider />

          {/* ---------- download ---------- */}
          <Reveal as="section" id="download" className={styles.sec}>
            <Head icon="download" title="Download the docs" lead="Take the guide offline as a Word document, one per language or all in one file." />
            <div className={`${styles.full} ${styles.spot}`} onMouseMove={spot}>
              <div><b>Complete guide</b><p>All five languages, installation and FAQ in one .docx file.</p></div>
              <button className={`${styles.primary} ${saved === "all" ? styles.ok : ""}`} disabled={!!busy} onClick={() => download("all", LANGS, "Complete guide")}>
                <Ic n={saved === "all" ? "check" : "download"} size={15} /> {busy === "all" ? "Preparing..." : saved === "all" ? "Downloaded" : "Download .docx"}
              </button>
            </div>
            <div className={styles.grid3}>
              {LANGS.map((l, i) => (
                <Reveal key={l.id} delay={i * 70} className={`${styles.card} ${styles.spot}`} onMouseMove={spot}>
                  <span className={styles.cardIco}><Ic n="code" size={18} /></span>
                  <b>{l.label} guide</b><p>{l.desc}</p>
                  <button className={`${styles.dlBtn} ${saved === l.id ? styles.ok : ""}`} disabled={!!busy} onClick={() => download(l.id, [l], l.label)}>
                    <Ic n={saved === l.id ? "check" : "download"} size={14} /> {busy === l.id ? "Preparing..." : saved === l.id ? "Downloaded" : ".docx"}
                  </button>
                </Reveal>
              ))}
            </div>
            {err && <Callout kind="warn" title="Could not create the file">{err}</Callout>}
          </Reveal>
          <Divider />

          {/* ---------- contributing ---------- */}
          <Reveal as="section" id="contributing" className={`${styles.sec} ${styles.end}`}>
            <Head icon="users" title="Contributing" lead="Found a bug or built something great? Add it to Tosa." />
            <div className={styles.cta}>
              <Link to="/contribute" className={styles.primary}>Contribute <Ic n="arrow" size={15} /></Link>
              <Link to="/components" className={styles.ghost}>Browse components</Link>
            </div>
            <div className={styles.vote}>
              <span>{vote ? "Thanks for the feedback!" : "Was this page helpful?"}</span>
              {!vote && (
                <>
                  <button onClick={() => setVote("up")} aria-label="Yes"><Ic n="thumb" size={16} /></button>
                  <button onClick={() => setVote("down")} aria-label="No" className={styles.flip}><Ic n="thumb" size={16} /></button>
                </>
              )}
            </div>
          </Reveal>
        </main>
      </div>
    </div>
  );
};

export default Documentation;