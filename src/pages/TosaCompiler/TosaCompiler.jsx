import React, {
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  useReducer,
} from "react";
import { LiveProvider, LiveEditor, LiveError, LivePreview } from "react-live";
import { themes } from "prism-react-renderer";
import * as Tosa from "tosa-ui";

import styles from "./TosaCompiler.module.css";

/* ------------------------------------------------------------------ */
/* Scope: yahan jo bhi dalega, user bina import ke use kar sakta hai.  */
/* ------------------------------------------------------------------ */
const scope = {
  ...Tosa,
  React,
  useState,
  useEffect,
  useRef,
  useMemo,
  useCallback,
  useReducer,
};

/* ------------------------------------------------------------------ */
/* Ready-made examples                                                 */
/* Rule: single JSX expression likho, ya noInline ke liye render(...)  */
/* ------------------------------------------------------------------ */
const EXAMPLES = [
  {
    id: "button",
    label: "Button",
    icon: "◉",
    code: `<div style={{ display: "flex", gap: 12, padding: 24, flexWrap: "wrap" }}>
  <Button color="#7c3aed" size="lg" radius="999px">
    Start building
  </Button>
  <Button variant="outline" size="lg" radius="999px">
    Back to top
  </Button>
</div>`,
  },
  {
    id: "badge",
    label: "Badge",
    icon: "✦",
    code: `<div style={{ display: "flex", gap: 12, padding: 24 }}>
  <Badge variant="solid" color="#7c3aed">SYSTEM / 01</Badge>
  <Badge variant="outline" color="#7c3aed">SYSTEM / 02</Badge>
</div>`,
  },
  {
    id: "announcement",
    label: "Announcement",
    icon: "◈",
    code: `<AnnouncementBar
  message="TOSA / COMPONENTS FOR THE NEXT WEB"
  linkText="Explore"
  link="#showcase"
  icon="✦"
  variant="default"
  background="#0b0d12"
  textColor="#ffffff"
  accentColor="#8b5cf6"
  height="40px"
  position="static"
  dismissible={false}
  animation="slide"
  showArrow={true}
/>`,
  },
  {
    id: "navbar",
    label: "Navbar",
    icon: "☰",
    code: `<Navbar
  logo="TOSA"
  links={[
    { label: "Home", href: "#home" },
    { label: "Showcase", href: "#showcase" },
    { label: "Contact", href: "#contact" },
  ]}
  variant="default"
  background="#0b0d12"
  textColor="#ffffff"
  accentColor="#a78bfa"
  height="76px"
  sticky={false}
  shadow={false}
  showSearch={false}
  showWishlist={false}
  showCart={false}
  showAccount={false}
/>`,
  },
  {
    id: "features",
    label: "FeatureStrip",
    icon: "▤",
    code: `<FeatureStrip
  items={[
    { icon: "✦", title: "Build faster", text: "Reusable interface blocks." },
    { icon: "⌁", title: "Stay consistent", text: "One visual language." },
    { icon: "◈", title: "Ship confidently", text: "Responsive components." },
  ]}
  background="#ffffff"
  textColor="#111827"
  accentColor="#7c3aed"
  borderColor="#e5e7eb"
/>`,
  },
  {
    id: "testimonials",
    label: "Testimonials",
    icon: "❝",
    code: `<Testimonials
  title="Built with TOSA"
  subtitle="A few fictional voices"
  columns={2}
  items={[
    {
      name: "Aarav Mehta",
      role: "Product Designer",
      rating: 5,
      text: "Composition is the useful part.",
    },
    {
      name: "Mira Shah",
      role: "Frontend Engineer",
      rating: 4.5,
      text: "The API stays readable.",
    },
  ]}
/>`,
  },
  {
    id: "modal",
    label: "Modal + State",
    icon: "❐",
    code: `function Demo() {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ padding: 24 }}>
      <Button color="#7c3aed" onClick={() => setOpen(true)}>
        Open modal
      </Button>

      <Modal
        id="playground-modal"
        open={open}
        title="TOSA Component Lab"
        description="Rendered live from the TOSA package."
        size="medium"
        position="center"
        background="#ffffff"
        textColor="#111111"
        accentColor="#7c3aed"
        borderRadius="20px"
        showCloseButton={true}
        closeOnOverlay={true}
        closeOnEscape={true}
        onClose={() => setOpen(false)}
      >
        <Button color="#7c3aed" onClick={() => setOpen(false)}>
          Close demo
        </Button>
      </Modal>
    </div>
  );
}

render(<Demo />);`,
  },
  {
    id: "hero",
    label: "Hero",
    icon: "▣",
    code: `<Hero
  badge="TOSA / FUTURE INTERFACE LAB"
  title="Build interfaces that feel impossible to ignore."
  subtitle="A component system for bold digital experiences."
  description="Compose landing pages and dashboards from reusable React components."
  image="https://images.unsplash.com/photo-1518770660439-4636190af475"
  primaryButtonText="Explore components"
  primaryButtonLink="#showcase"
  secondaryButtonText="Open demo"
  secondaryButtonLink="#experience"
  variant="split"
  layout="image-right"
  alignment="left"
  height="520px"
  background="#0b0d12"
  textColor="#ffffff"
  accentColor="#a78bfa"
  overlay={true}
  overlayOpacity={0.25}
  showBadge={true}
  showDescription={true}
  showButtons={true}
  showSecondaryButton={true}
/>`,
  },
];

const DEVICES = [
  { id: "desktop", label: "Desktop", width: "100%" },
  { id: "tablet", label: "Tablet", width: "768px" },
  { id: "mobile", label: "Mobile", width: "390px" },
];

const BACKGROUNDS = [
  { id: "dark", label: "Dark", color: "#0b0d12" },
  { id: "light", label: "Light", color: "#ffffff" },
];

const STORAGE_KEY = "tosa-compiler-code";

/* Prism theme: Examples.module.css ke palette se match */
const editorTheme = {
  ...themes.vsDark,
  plain: { color: "#a5d6ff", backgroundColor: "transparent" },
};

function loadInitial() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return saved;
  } catch {
    /* ignore */
  }
  return EXAMPLES[0].code;
}

export default function TosaCompiler() {
  const [code, setCode] = useState(loadInitial);
  const [activeId, setActiveId] = useState(EXAMPLES[0].id);
  const [device, setDevice] = useState("desktop");
  const [bg, setBg] = useState("dark");
  const [copied, setCopied] = useState(false);
  const copyTimer = useRef(null);

  /* auto-save */
  useEffect(() => {
    const t = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, code);
      } catch {
        /* ignore */
      }
    }, 400);
    return () => clearTimeout(t);
  }, [code]);

  useEffect(() => () => clearTimeout(copyTimer.current), []);

  /* render(...) mile to noInline mode */
  const noInline = useMemo(() => /\brender\s*\(/.test(code), [code]);

  const pickExample = (ex) => {
    setActiveId(ex.id);
    setCode(ex.code);
  };

  const reset = () => {
    const ex = EXAMPLES.find((e) => e.id === activeId) || EXAMPLES[0];
    setCode(ex.code);
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      clearTimeout(copyTimer.current);
      copyTimer.current = setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked */
    }
  };

  const deviceWidth = DEVICES.find((d) => d.id === device)?.width ?? "100%";
  const bgColor = BACKGROUNDS.find((b) => b.id === bg)?.color ?? "#0b0d12";

  return (
    <div className={styles.page}>
      <div className={styles.aurora} />
      <div className={styles.grid} />

      <header className={styles.hero}>
        <span className={styles.pill}>
          <i /> Live compiler
        </span>
        <h1>
          Write a <span className={styles.grad}>TOSA</span> component. See it
          instantly.
        </h1>
        <p>
          Har TOSA component bina import ke available hai. Code likho, preview
          turant update hoga.
        </p>
      </header>

      <section className={styles.shell}>
        {/* examples */}
        <div className={styles.chips} role="tablist" aria-label="Examples">
          {EXAMPLES.map((ex) => (
            <button
              key={ex.id}
              role="tab"
              aria-selected={activeId === ex.id}
              className={`${styles.chip} ${
                activeId === ex.id ? styles.chipOn : ""
              }`}
              onClick={() => pickExample(ex)}
            >
              <span aria-hidden="true">{ex.icon}</span> {ex.label}
            </button>
          ))}
        </div>

        <LiveProvider
          code={code}
          scope={scope}
          noInline={noInline}
          theme={editorTheme}
          language="jsx"
        >
          <div className={styles.workspace}>
            {/* editor */}
            <div className={styles.panel}>
              <div className={styles.bar}>
                <span className={styles.lights}>
                  <i />
                  <i />
                  <i />
                </span>
                <span className={styles.file}>
                  Playground.jsx {noInline ? "· render mode" : ""}
                </span>
                <button onClick={reset}>Reset</button>
                <button
                  onClick={copy}
                  className={copied ? styles.done : undefined}
                >
                  {copied ? "Copied" : "Copy"}
                </button>
              </div>
              <div className={styles.editor}>
                <LiveEditor onChange={setCode} />
              </div>
            </div>

            {/* preview */}
            <div className={styles.panel}>
              <div className={styles.bar}>
                <span className={styles.lights}>
                  <i />
                  <i />
                  <i />
                </span>
                <span className={styles.file}>Preview</span>

                <div className={styles.seg} role="group" aria-label="Device">
                  {DEVICES.map((d) => (
                    <button
                      key={d.id}
                      className={device === d.id ? styles.segOn : undefined}
                      onClick={() => setDevice(d.id)}
                    >
                      {d.label}
                    </button>
                  ))}
                </div>
                <div className={styles.seg} role="group" aria-label="Background">
                  {BACKGROUNDS.map((b) => (
                    <button
                      key={b.id}
                      className={bg === b.id ? styles.segOn : undefined}
                      onClick={() => setBg(b.id)}
                    >
                      {b.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.stage} style={{ background: bgColor }}>
                <div
                  className={styles.device}
                  style={{ width: deviceWidth, background: bgColor }}
                >
                  <LivePreview />
                </div>
              </div>

              <LiveError className={styles.error} />
            </div>
          </div>
        </LiveProvider>

        <div className={styles.callout}>
          <span aria-hidden="true">✦</span>
          <div>
            <b>Tip</b>
            <p>
              Simple component ke liye seedha JSX likho. State ya hooks chahiye
              to function banao aur end me <code>render(&lt;Demo /&gt;)</code>{" "}
              likho. <code>import</code> likhne ki zaroorat nahi.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}