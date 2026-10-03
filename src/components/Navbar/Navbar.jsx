import { useEffect, useMemo, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { idOf, useLibrary } from "../../api/library";
import styles from "./Navbar.module.css";

// `to` = internal page (router), `href` = external link
const links = [
  { label: "Home", to: "/" },
  { label: "Components", to: "/components" },
  { label: "Languages", to: "/languages" },
  { label: "Documentation", to: "/docs" },
  { label: "Installation", to: "/installation" },
  { label: "Examples", to: "/examples" },
  { label: "Community", to: "/community" },
];

/* search me dikhne wale fixed pages / sections */
const PAGES = [
  {
    label: "Introduction",
    sub: "Components",
    to: "/components#introduction",
    keys: "intro start overview",
  },
  {
    label: "Installation",
    sub: "Components · setup",
    to: "/components#installation",
    keys: "install setup npm add copy",
  },
  {
    label: "Using a component",
    sub: "Components",
    to: "/components#using-a-component",
    keys: "use usage how",
  },
  { label: "Home", sub: "Page", to: "/" },
  {
    label: "Components",
    sub: "Page",
    to: "/components",
    keys: "library all",
  },
  { label: "Languages", sub: "Page", to: "/languages" },
  {
    label: "Documentation",
    sub: "Page",
    to: "/docs",
    keys: "docs guide",
  },
  {
    label: "Installation guide",
    sub: "Page",
    to: "/installation",
    keys: "install setup",
  },
  { label: "Examples", sub: "Page", to: "/examples", keys: "demo" },
  { label: "Community", sub: "Page", to: "/community" },
];

/* GitHub icon wale overlay ke cards */
const CONTRIBUTE = [
  {
    key: "source",
    title: "Contribute Source",
    desc: "Add new components, fix bugs and improve the docs.",
    to: "/contribute",
    icon: "code",
  },
  {
    key: "profile",
    title: "Create Profile",
    desc: "Set up your profile to share components and get credit.",
    to: "/create-profile",
    icon: "user",
  },
];

/* ---------- icons ---------- */

const GithubIcon = () => (
  <svg viewBox="0 0 16 16" width="22" height="22" fill="currentColor">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
  </svg>
);
const Svg = ({ d, size = 20, children }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    {children || <path d={d} />}
  </svg>
);

const SunIcon = () => (
  <Svg>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
  </Svg>
);

const MoonIcon = () => (
  <Svg d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
);

const MenuIcon = () => (
  <Svg size={22} d="M3 6h18M3 12h18M3 18h18" />
);

const CloseIcon = () => (
  <Svg size={22} d="M6 6l12 12M18 6L6 18" />
);

const SearchIcon = ({ size = 16 }) => (
  <Svg
    size={size}
    d="M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3"
  />
);

const BoxIcon = () => (
  <Svg size={16} d="M21 16V8l-9-5-9 5v8l9 5 9-5zM3.3 7 12 12l8.7-5M12 22V12" />
);

const PageIcon = () => (
  <Svg
    size={16}
    d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8zM14 3v5h5"
  />
);

const CodeIcon = () => (
  <Svg size={22} d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
);

const UserIcon = () => (
  <Svg
    size={22}
    d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z"
  />
);

const ArrowIcon = () => (
  <Svg size={16} d="M5 12h14M12 5l7 7-7 7" />
);

const CARD_ICONS = {
  code: <CodeIcon />,
  user: <UserIcon />,
};

const EnterIcon = () => (
  <Svg size={14} d="M9 10l-5 5 5 5M20 4v7a4 4 0 0 1-4 4H4" />
);

/* match highlight */
const Hl = ({ text, q }) => {
  const s = q.trim();
  const i = s ? text.toLowerCase().indexOf(s.toLowerCase()) : -1;

  if (i < 0) return text;

  return (
    <>
      {text.slice(0, i)}
      <mark className={styles.mark}>{text.slice(i, i + s.length)}</mark>
      {text.slice(i + s.length)}
    </>
  );
};

/* 0 = best, -1 = no match */
const score = (text, q) => {
  const t = text.toLowerCase();

  if (t.startsWith(q)) return 0;

  if (t.split(/[\s\-_/]+/).some((w) => w.startsWith(q))) {
    return 1;
  }

  return t.includes(q) ? 2 : -1;
};

/* Ek link: internal ho toh NavLink, external ho toh normal <a> */
const Item = ({ l, cls, activeCls, onClick }) => {
  if (l.to) {
    return (
      <NavLink
        to={l.to}
        end={l.to === "/"}
        onClick={onClick}
        className={({ isActive }) =>
          `${cls} ${isActive ? activeCls : ""}`
        }
      >
        {l.label}
      </NavLink>
    );
  }

  return (
    <a
      href={l.href}
      target="_blank"
      rel="noreferrer"
      className={cls}
      onClick={onClick}
    >
      {l.label}
    </a>
  );
};

/* ================= Search overlay ================= */

const SearchOverlay = ({ onClose }) => {
  const navigate = useNavigate();
  const { categories, components, loading } = useLibrary();

  const [q, setQ] = useState("");
  const [cursor, setCursor] = useState(0);

  const inputRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    inputRef.current?.focus();
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const results = useMemo(() => {
    const s = q.trim().toLowerCase();

    const catName = Object.fromEntries(
      categories.map((c) => [c._id, c.name])
    );

    const compItems = components.map((c) => ({
      key: `c-${c._id}`,
      label: c.name,
      sub: catName[idOf(c.categoryId)] || "Component",
      to: `/components/${c.slug}`,
      type: "component",
    }));

    const pageItems = PAGES.map((p) => ({
      key: `p-${p.to}-${p.label}`,
      ...p,
      type: "page",
    }));

    if (!s) {
      return {
        pages: pageItems.slice(0, 3),
        comps: compItems.slice(0, 6),
      };
    }

    const rank = (list, textOf) =>
      list
        .map((it) => ({
          it,
          r: score(textOf(it), s),
        }))
        .filter((x) => x.r >= 0)
        .sort((a, b) => a.r - b.r)
        .map((x) => x.it);

    return {
      pages: rank(
        pageItems,
        (p) => `${p.label} ${p.keys || ""}`
      ).slice(0, 5),

      comps: rank(
        compItems,
        (c) => c.label
      ).slice(0, 8),
    };
  }, [q, categories, components]);

  const flat = [...results.pages, ...results.comps];

  useEffect(() => {
    setCursor(0);
  }, [q]);

  useEffect(() => {
    listRef.current
      ?.querySelector(`[data-i="${cursor}"]`)
      ?.scrollIntoView({
        block: "nearest",
      });
  }, [cursor]);

  const go = (it) => {
    if (!it) return;

    onClose();
    navigate(it.to);
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();

      setCursor((c) =>
        flat.length ? (c + 1) % flat.length : 0
      );
    } else if (e.key === "ArrowUp") {
      e.preventDefault();

      setCursor((c) =>
        flat.length ? (c - 1 + flat.length) % flat.length : 0
      );
    } else if (e.key === "Enter") {
      e.preventDefault();
      go(flat[cursor]);
    }
  };

  const row = (it, i) => (
    <button
      key={it.key}
      data-i={i}
      className={`${styles.result} ${
        i === cursor ? styles.resultOn : ""
      }`}
      onMouseEnter={() => setCursor(i)}
      onClick={() => go(it)}
    >
      <span className={styles.resIco}>
        {it.type === "component" ? <BoxIcon /> : <PageIcon />}
      </span>

      <span className={styles.resText}>
        <b>
          <Hl text={it.label} q={q} />
        </b>
        <small>{it.sub}</small>
      </span>

      {i === cursor && (
        <span className={styles.resEnter}>
          <EnterIcon />
        </span>
      )}
    </button>
  );

  return (
    <div
      className={styles.overlay}
      onMouseDown={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Search"
    >
      <div
        className={styles.modal}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className={styles.modalTop}>
          <SearchIcon size={18} />

          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search components, installation, docs..."
            spellCheck="false"
          />

          <button className={styles.esc} onClick={onClose}>
            Esc
          </button>
        </div>

        <div className={styles.results} ref={listRef}>
          {loading && !components.length && (
            <p className={styles.empty}>
              Components load ho rahe hain...
            </p>
          )}

          {results.pages.length > 0 && (
            <p className={styles.groupTitle}>
              {q ? "Pages" : "Quick links"}
            </p>
          )}

          {results.pages.map((it, i) => row(it, i))}

          {results.comps.length > 0 && (
            <p className={styles.groupTitle}>
              {q ? "Components" : "Popular components"}
            </p>
          )}

          {results.comps.map((it, i) =>
            row(it, results.pages.length + i)
          )}

          {q && !flat.length && !loading && (
            <p className={styles.empty}>
              “{q}” ka koi result nahi mila.
            </p>
          )}
        </div>

        <div className={styles.modalFoot}>
          <span>
            <kbd>↑</kbd>
            <kbd>↓</kbd> navigate
          </span>

          <span>
            <kbd>Enter</kbd> open
          </span>

          <span>
            <kbd>Esc</kbd> close
          </span>
        </div>
      </div>
    </div>
  );
};

/* ================= Contribute overlay ================= */

const ContributeOverlay = ({ onClose }) => {
  const navigate = useNavigate();

  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const go = (to) => {
    onClose();
    navigate(to);
  };

  return (
    <div
      className={styles.overlay}
      onMouseDown={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Contribute"
    >
      <div
        className={`${styles.modal} ${styles.cModal}`}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <div className={styles.cHead}>
          <div>
            <h2>Contribute Content</h2>
            <p>
              Help grow the library. Pick where you want to start.
            </p>
          </div>

          <button className={styles.esc} onClick={onClose}>
            Esc
          </button>
        </div>

        <div className={styles.cGrid}>
          {CONTRIBUTE.map((c) => (
            <button
              key={c.key}
              className={styles.cCard}
              onClick={() => go(c.to)}
            >
              <span className={styles.cIco}>
                {CARD_ICONS[c.icon]}
              </span>

              <b>{c.title}</b>
              <small>{c.desc}</small>

              <span className={styles.cGo}>
                <ArrowIcon />
              </span>
            </button>
          ))}
        </div>

        <div className={styles.modalFoot}>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className={styles.cRepo}
          >
            <GithubIcon />
            View on GitHub
          </a>
        </div>
      </div>
    </div>
  );
};

/* ================= Navbar ================= */

const Navbar = ({ theme, onToggleTheme, onCreate }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [contribOpen, setContribOpen] = useState(false);

  const { pathname } = useLocation();

  // NEW: React Router navigation
  const navigate = useNavigate();

  const closeMenu = () => setMenuOpen(false);

  const openSearch = () => {
    setMenuOpen(false);
    setContribOpen(false);
    setSearchOpen(true);
  };

  const openContrib = () => {
    setMenuOpen(false);
    setSearchOpen(false);
    setContribOpen(true);
  };

  const closeSearch = () => setSearchOpen(false);

  // NEW: Tosa AI page open
  const openTosaAI = () => {
    setMenuOpen(false);
    setSearchOpen(false);
    setContribOpen(false);

    navigate("/tosa-compiler");
  };

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e) => {
      if (
        (e.ctrlKey || e.metaKey) &&
        e.key.toLowerCase() === "k"
      ) {
        e.preventDefault();
        openSearch();
      } else if (e.key === "Escape") {
        setMenuOpen(false);
        setSearchOpen(false);
        setContribOpen(false);
      }
    };

    window.addEventListener("keydown", onKey);

    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, []);

  return (
    <header className={styles.navbar}>
      <div className={styles.bar}>

        {/* Menu button */}
        <button
          className={`${styles.iconBtn} ${styles.menuBtn}`}
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <CloseIcon /> : <MenuIcon />}
        </button>

        {/* Desktop links */}
        <nav className={styles.links}>
          {links.map((l) => (
            <Item
              key={l.label}
              l={l}
              cls={styles.link}
              activeCls={styles.active}
            />
          ))}
        </nav>

        {/* Right side */}
        <div className={styles.actions}>

          <button
            className={styles.search}
            onClick={openSearch}
            aria-label="Open search"
          >
            <SearchIcon size={14} />
            <span>Search Tosa components...</span>
            <kbd className={styles.kbd}>Ctrl K</kbd>
          </button>

          <button
            className={styles.iconBtn}
            onClick={openContrib}
            aria-label="Contribute"
          >
            <GithubIcon />
          </button>

          <button
            className={styles.iconBtn}
            onClick={onToggleTheme}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <SunIcon /> : <MoonIcon />}
          </button>

          {/* UPDATED Tosa AI button */}
          <button
            className={styles.createBtn}
            onClick={openTosaAI}
          >
            Tosa Compiler
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      <div
        className={`${styles.mobileMenu} ${
          menuOpen ? styles.open : ""
        }`}
      >
        <button
          className={styles.mobileSearch}
          onClick={openSearch}
        >
          <SearchIcon size={15} />
          Search Tosa
        </button>

        {links.map((l) => (
          <Item
            key={l.label}
            l={l}
            cls={styles.mobileLink}
            activeCls={styles.active}
            onClick={closeMenu}
          />
        ))}
      </div>

      {searchOpen && (
        <SearchOverlay onClose={closeSearch} />
      )}

      {contribOpen && (
        <ContributeOverlay
          onClose={() => setContribOpen(false)}
        />
      )}
    </header>
  );
};

export default Navbar;