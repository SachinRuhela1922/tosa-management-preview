import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";
import { idOf, useLibrary } from "../../api/library";
import styles from "./DocsLayout.module.css";

/* ---------- inline icons (koi extra dependency nahi) ---------- */
const PATHS = {
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3",
  close: "M18 6 6 18M6 6l12 12",
  chevron: "M9 6l6 6-6 6",
  book: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20V3H6.5A2.5 2.5 0 0 0 4 5.5v14zM20 17v4H6.5A2.5 2.5 0 0 1 4 18.5",
  terminal: "M4 17l6-6-6-6M12 19h8",
  layers: "M12 2 2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5",
  grid: "M3 3h7v7H3zM14 3h7v7h-7zM14 14h7v7h-7zM3 14h7v7H3z",
  box: "M21 16V8l-9-5-9 5v8l9 5 9-5zM3.3 7 12 12l8.7-5M12 22V12",
  spark: "M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9zM19 16l.8 2.2L22 19l-2.2.8L19 22l-.8-2.2L16 19l2.2-.8z",
  zap: "M13 2 3 14h9l-1 8 10-12h-9z",
  cursor: "M4 4l7 16 2.5-6.5L20 11z",
  up: "M12 19V5M5 12l7-7 7 7",
  left: "M15 18l-6-6 6-6",
  right: "M9 18l6-6-6-6",
  home: "M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z",
  menu: "M3 6h18M3 12h18M3 18h18",
  link: "M10 13a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1M14 11a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1",
  fold: "M7 15l5 5 5-5M7 9l5-5 5 5",
};
const Svg = ({ n, size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={PATHS[n]} />
  </svg>
);

const CAT_ICONS = ["layers", "grid", "box", "spark", "zap", "cursor"];
const HUES = [212, 268, 150, 28, 340, 190, 52];

/* search match highlight */
const Hl = ({ text, q }) => {
  const s = q.trim();
  if (!s) return text;
  const i = text.toLowerCase().indexOf(s.toLowerCase());
  if (i < 0) return text;
  return (
    <>
      {text.slice(0, i)}
      <mark className={styles.mark}>{text.slice(i, i + s.length)}</mark>
      {text.slice(i + s.length)}
    </>
  );
};

/**
 * Left sidebar (Getting started + Categories > Components)
 * + centre (breadcrumb, children, prev/next) + right "On this page" (scroll-spy)
 * + reading progress bar, Ctrl/Cmd+K search, back-to-top
 *
 * props: toc = [{ id, label, depth }]
 */
const DocsLayout = ({ toc = [], children }) => {
  const { id: currentSlug } = useParams();
  const { pathname, hash } = useLocation();
  const { categories, components, loading, error } = useLibrary();

  const [q, setQ] = useState("");
  const [open, setOpen] = useState({});
  const [menu, setMenu] = useState(false);
  const [active, setActive] = useState("");
  const [thumb, setThumb] = useState({ top: 0, height: 0 });
  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);
  const [copied, setCopied] = useState(false);
  const itemRefs = useRef({});
  const inputRef = useRef(null);

  /* ---------- sidebar data ---------- */
  const groups = useMemo(() => {
    const s = q.trim().toLowerCase();
    return categories
      .map((cat, i) => ({
        cat,
        i,
        list: components.filter(
          (c) => idOf(c.categoryId) === cat._id && (!s || c.name.toLowerCase().includes(s))
        ),
      }))
      .filter((g) => !s || g.list.length);
  }, [categories, components, q]);

  /* prev / next (sidebar order me) */
  const flat = useMemo(
    () => categories.flatMap((cat) => components.filter((c) => idOf(c.categoryId) === cat._id)),
    [categories, components]
  );
  const idx = flat.findIndex((c) => c.slug === currentSlug || c._id === currentSlug);
  const cur = idx >= 0 ? flat[idx] : null;
  const prev = idx > 0 ? flat[idx - 1] : null;
  const next = idx >= 0 && idx < flat.length - 1 ? flat[idx + 1] : null;
  const curCat = cur ? categories.find((c) => c._id === idOf(cur.categoryId)) : null;

  // current component ki category apne aap khul jaye
  useEffect(() => {
    if (cur) setOpen((o) => ({ ...o, [idOf(cur.categoryId)]: true }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cur?._id]);

  useEffect(() => setMenu(false), [pathname]);

  // drawer khula ho to body scroll lock
  useEffect(() => {
    document.body.style.overflow = menu ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menu]);

  /* ---------- shortcuts: Ctrl/Cmd+K ya "/" ---------- */
  useEffect(() => {
    const onKey = (e) => {
      const typing = /input|textarea/i.test(e.target.tagName);
      if (((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") || (e.key === "/" && !typing)) {
        e.preventDefault();
        setMenu(true);
        inputRef.current?.focus();
      }
      if (e.key === "Escape") { setMenu(false); if (typing) e.target.blur(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* ---------- scroll to top / hash ---------- */
  useEffect(() => {
    if (!hash) { window.scrollTo(0, 0); return; }
    const t = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth" }), 80);
    return () => clearTimeout(t);
  }, [pathname, hash]);

  /* ---------- reading progress + back-to-top ---------- */
  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(100, Math.round((window.scrollY / max) * 100)) : 0);
      setShowTop(window.scrollY > 600);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  /* ---------- scroll spy ---------- */
  const tocKey = toc.map((t) => t.id).join("|");
  useEffect(() => {
    if (!toc.length) return;
    const onScroll = () => {
      let c = toc[0].id;
      for (const t of toc) {
        const el = document.getElementById(t.id);
        if (el && el.getBoundingClientRect().top <= 130) c = t.id;
      }
      if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 4) c = toc[toc.length - 1].id;
      setActive(c);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tocKey]);

  // animated thumb active item pe slide karta hai
  useEffect(() => {
    const el = itemRefs.current[active];
    if (!el) return;
    setThumb({ top: el.offsetTop, height: el.offsetHeight });
  }, [active, tocKey]);

  const jump = (e, id) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch { /* clipboard blocked */ }
  };

  const allOpen = categories.length > 0 && categories.every((c) => open[c._id]);
  const toggleAll = () => setOpen(allOpen ? {} : Object.fromEntries(categories.map((c) => [c._id, true])));

  const isIntro = pathname === "/components" && (!hash || hash === "#introduction" || hash === "#how-it-works");
  const isInstall = pathname === "/components" && (hash === "#installation" || hash === "#using-a-component");

  return (
    <div className={styles.shell}>
      <div className={styles.progress} style={{ transform: `scaleX(${progress / 100})` }} />
      <div className={styles.glow} aria-hidden="true" />

      <button className={styles.menuBtn} onClick={() => setMenu(true)}>
        <Svg n="menu" size={15} /> Browse components
      </button>
      {menu && <div className={styles.scrim} onClick={() => setMenu(false)} />}

      {/* ================= LEFT ================= */}
      <aside className={`${styles.side} ${menu ? styles.sideOpen : ""}`}>
        <button className={styles.drawerClose} onClick={() => setMenu(false)} aria-label="Close menu">
          <Svg n="close" size={16} />
        </button>

        <div className={styles.find}>
          <Svg n="search" size={15} />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search components..."
            spellCheck="false"
          />
          {q ? (
            <button onClick={() => setQ("")} aria-label="clear"><Svg n="close" size={12} /></button>
          ) : (
            <kbd className={styles.kbd}>Ctrl K</kbd>
          )}
        </div>

        <p className={styles.group}>Getting started</p>
        <Link to="/components#introduction" className={`${styles.link} ${isIntro ? styles.on : ""}`}>
          <span className={styles.ico}><Svg n="book" size={15} /></span> Introduction
        </Link>
        <Link to="/components#installation" className={`${styles.link} ${isInstall ? styles.on : ""}`}>
          <span className={styles.ico}><Svg n="terminal" size={15} /></span> Installation
        </Link>

        <div className={styles.groupRow}>
          <p className={styles.group}>Categories</p>
          {categories.length > 1 && !q && (
            <button className={styles.fold} onClick={toggleAll} title={allOpen ? "Collapse all" : "Expand all"}>
              <Svg n="fold" size={14} />
            </button>
          )}
        </div>

        {loading && <><div className={styles.sk} /><div className={styles.sk} /><div className={styles.sk} /></>}
        {error && <p className={styles.err}>⚠️ {error}</p>}

        {groups.map(({ cat, list, i }) => {
          const isOpen = !!q || !!open[cat._id];
          return (
            <div key={cat._id} className={styles.cat} style={{ "--h": HUES[i % HUES.length] }}>
              <button
                className={`${styles.catBtn} ${isOpen ? styles.catOpen : ""}`}
                onClick={() => setOpen((o) => ({ ...o, [cat._id]: !o[cat._id] }))}
                aria-expanded={isOpen}
              >
                <span className={styles.catIco}><Svg n={CAT_ICONS[i % CAT_ICONS.length]} size={14} /></span>
                <span className={styles.catName}>{cat.name}</span>
                <small>{list.length}</small>
                <i className={isOpen ? styles.chevOpen : ""}><Svg n="chevron" size={13} /></i>
              </button>
              <div className={`${styles.sub} ${isOpen ? styles.subOpen : ""}`}>
                <div>
                  {list.length === 0 && <p className={styles.none}>No components yet</p>}
                  {list.map((c) => (
                    <Link
                      key={c._id}
                      to={`/components/${c.slug}`}
                      className={`${styles.subLink} ${c.slug === currentSlug || c._id === currentSlug ? styles.on : ""}`}
                    >
                      <Hl text={c.name} q={q} />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
        {!loading && !error && q && !groups.length && <p className={styles.none}>“{q}” nahi mila.</p>}

        {!loading && !error && (
          <div className={styles.stats}>
            <span className={styles.pulse} />
            <div>
              <b>{components.length}</b> components
              <br />
              <b>{categories.length}</b> categories
            </div>
          </div>
        )}
      </aside>

      {/* ================= CENTRE ================= */}
      <main className={styles.main}>
        <nav className={styles.crumbs} aria-label="Breadcrumb">
          <Link to="/components"><Svg n="home" size={13} /> Components</Link>
          {curCat && (<><Svg n="chevron" size={11} /><span>{curCat.name}</span></>)}
          {cur && (<><Svg n="chevron" size={11} /><b>{cur.name}</b></>)}
        </nav>

        {children}

        {(prev || next) && (
          <nav className={styles.pager} aria-label="Previous and next component">
            {prev ? (
              <Link to={`/components/${prev.slug}`} className={styles.pagerPrev}>
                <small><Svg n="left" size={12} /> Previous</small>
                <span>{prev.name}</span>
              </Link>
            ) : <span />}
            {next ? (
              <Link to={`/components/${next.slug}`} className={styles.pagerNext}>
                <small>Next <Svg n="right" size={12} /></small>
                <span>{next.name}</span>
              </Link>
            ) : <span />}
          </nav>
        )}
      </main>

      {/* ================= RIGHT ================= */}
      <aside className={styles.toc}>
        {toc.length > 0 && (
          <>
            <p className={styles.tocTitle}>
              On this page <em>{progress}%</em>
            </p>
            <ul className={styles.tocList}>
              <span className={styles.track} />
              <span className={styles.thumb} style={{ transform: `translateY(${thumb.top}px)`, height: thumb.height }} />
              {toc.map((t) => (
                <li
                  key={t.id}
                  ref={(el) => (itemRefs.current[t.id] = el)}
                  className={`${t.depth ? styles.sm : ""} ${active === t.id ? styles.tocOn : ""}`}
                >
                  <a href={`#${t.id}`} onClick={(e) => jump(e, t.id)}>{t.label}</a>
                </li>
              ))}
            </ul>
            <div className={styles.tocActions}>
              <button onClick={copyLink} className={copied ? styles.done : ""}>
                <Svg n="link" size={13} /> {copied ? "Link copied" : "Copy page link"}
              </button>
              <button onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
                <Svg n="up" size={13} /> Back to top
              </button>
            </div>
          </>
        )}
      </aside>

      <button
        className={`${styles.fab} ${showTop ? styles.fabOn : ""}`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        aria-label="Back to top"
      >
        <svg className={styles.ring} viewBox="0 0 36 36" aria-hidden="true">
          <circle cx="18" cy="18" r="16" />
          <circle cx="18" cy="18" r="16" style={{ strokeDashoffset: 100.5 - (100.5 * progress) / 100 }} />
        </svg>
        <Svg n="up" size={16} />
      </button>
    </div>
  );
};

export default DocsLayout;