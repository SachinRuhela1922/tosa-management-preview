import { useEffect, useMemo, useRef, useState } from "react";
import Icon from "../Icon/Icon";
import styles from "./Spotlight.module.css";

const commands = [
  {
    id: "components",
    group: "Navigate",
    icon: "file",
    label: "Browse Components",
    desc: "Explore reusable Tosa components for your projects.",
    keys: ["G", "C"],
  },
  {
    id: "docs",
    group: "Navigate",
    icon: "book",
    label: "Open Documentation",
    desc: "Read installation guides, usage examples and component docs.",
    keys: ["G", "D"],
  },
  {
    id: "playground",
    group: "Navigate",
    icon: "activity",
    label: "Open Playground",
    desc: "Try Tosa components interactively before using them.",
    keys: ["G", "P"],
  },
  {
    id: "languages",
    group: "Navigate",
    icon: "globe",
    label: "Explore Languages",
    desc: "See the languages and technologies supported by Tosa.",
    keys: ["G", "L"],
  },
  {
    id: "project",
    group: "Actions",
    icon: "target",
    label: "Create new project",
    desc: "Start a new project using reusable Tosa components.",
    keys: ["N"],
  },
  {
    id: "refresh",
    group: "Actions",
    icon: "refresh",
    label: "Refresh components",
    desc: "Check for the latest available Tosa components and updates.",
    keys: ["R"],
  },
  {
    id: "theme",
    group: "Actions",
    icon: "activity",
    label: "Switch theme",
    desc: "Toggle between dark and light mode.",
    keys: ["T"],
  },
  {
    id: "support",
    group: "Help",
    icon: "message",
    label: "Contact support",
    desc: "Get help with Tosa components, setup or integration.",
    keys: ["?"],
  },
  {
    id: "guide",
    group: "Help",
    icon: "book",
    label: "Read getting started guide",
    desc: "Learn how to install and start using Tosa step by step.",
    keys: ["H"],
  },
  {
    id: "help",
    group: "Help",
    icon: "help",
    label: "Tosa Help Center",
    desc: "Find answers to common questions about Tosa.",
    keys: ["F1"],
  },
];

const Spotlight = ({ onToggleTheme }) => {
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const [toast, setToast] = useState(null);
  const [pressed, setPressed] = useState("");

  const sectionRef = useRef(null);
  const inputRef = useRef(null);
  const activeRef = useRef(null);

  /* filter */
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return commands.filter(
      (c) =>
        c.label.toLowerCase().includes(q) ||
        c.group.toLowerCase().includes(q)
    );
  }, [query]);

  /* group with flat index */
  const groups = useMemo(() => {
    const map = [];
    results.forEach((c, i) => {
      let g = map.find((x) => x.name === c.group);
      if (!g) map.push((g = { name: c.group, items: [] }));
      g.items.push({ ...c, i });
    });
    return map;
  }, [results]);

  const active = results[index];

  useEffect(() => setIndex(0), [query]);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "nearest" });
  }, [index, results]);

  /* toast auto hide */
  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  /* Ctrl/Cmd + K */
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        sectionRef.current?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        setTimeout(() => inputRef.current?.focus(), 400);
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  /* cursor spotlight */
  const onMove = (e) => {
    const r = sectionRef.current.getBoundingClientRect();
    sectionRef.current.style.setProperty("--mx", `${e.clientX - r.left}px`);
    sectionRef.current.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  const run = (cmd) => {
    if (!cmd) return;
    if (cmd.id === "theme") onToggleTheme?.();
    setToast({ id: Date.now(), text: cmd.label });
  };

  const flash = (k) => {
    setPressed(k);
    setTimeout(() => setPressed(""), 160);
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      flash("down");
      setIndex((p) => (results.length ? (p + 1) % results.length : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      flash("up");
      setIndex((p) =>
        results.length ? (p - 1 + results.length) % results.length : 0
      );
    } else if (e.key === "Enter") {
      flash("enter");
      run(active);
    } else if (e.key === "Escape") {
      flash("esc");
      setQuery("");
    }
  };

  return (
    <section
      ref={sectionRef}
      className={styles.section}
      onMouseMove={onMove}
    >
      <div className={styles.dots} />
      <div className={styles.beam} />

      <div className={styles.head}>
        <span className={styles.badge}>
          <i /> Tosa Command Palette
        </span>

        <h2 className={styles.heading}>
          Build faster, <span>without leaving the keyboard</span>
        </h2>

        <p className={styles.sub}>
          Press <kbd>Ctrl</kbd> <kbd>K</kbd> to search components, open docs
          and run Tosa actions instantly. Type karke dekho, demo real hai.
        </p>
      </div>

      <div className={styles.wrap}>
        <div className={styles.glow} />

        <div className={styles.palette}>
          {/* Search */}
          <div className={styles.searchRow}>
            <Icon name="search" size={18} />

            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Search Tosa components or commands..."
              className={styles.input}
              spellCheck="false"
            />

            <kbd className={styles.escKey}>Esc</kbd>
          </div>

          <div className={styles.body}>
            {/* List */}
            <div className={styles.list}>
              {groups.length === 0 && (
                <div className={styles.empty}>
                  <Icon name="search" size={22} />
                  <p>No Tosa results for “{query}”</p>
                </div>
              )}

              {groups.map((g) => (
                <div key={g.name}>
                  <p className={styles.groupName}>{g.name}</p>

                  {g.items.map((c) => (
                    <button
                      key={c.id}
                      ref={c.i === index ? activeRef : null}
                      className={`${styles.item} ${
                        c.i === index ? styles.itemActive : ""
                      }`}
                      onMouseEnter={() => setIndex(c.i)}
                      onClick={() => run(c)}
                    >
                      <span className={styles.itemIcon}>
                        <Icon name={c.icon} size={15} />
                      </span>

                      <span className={styles.itemLabel}>{c.label}</span>

                      <span className={styles.keys}>
                        {c.keys.map((k) => (
                          <kbd key={k}>{k}</kbd>
                        ))}
                      </span>
                    </button>
                  ))}
                </div>
              ))}
            </div>

            {/* Preview */}
            <div className={styles.preview}>
              {active && (
                <div key={active.id} className={styles.previewInner}>
                  <span className={styles.bigIcon}>
                    <Icon name={active.icon} size={26} />
                  </span>

                  <h3>{active.label}</h3>
                  <p>{active.desc}</p>

                  <div className={styles.skeleton}>
                    <i style={{ "--w": "90%" }} />
                    <i style={{ "--w": "70%" }} />
                    <i style={{ "--w": "82%" }} />
                  </div>

                  <button
                    className={styles.run}
                    onClick={() => run(active)}
                  >
                    Run command <Icon name="arrow" size={13} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className={styles.footer}>
            <span className={pressed === "up" ? styles.hit : ""}>
              <kbd>↑</kbd>
            </span>

            <span className={pressed === "down" ? styles.hit : ""}>
              <kbd>↓</kbd> navigate
            </span>

            <span className={pressed === "enter" ? styles.hit : ""}>
              <kbd>↵</kbd> run
            </span>

            <span className={pressed === "esc" ? styles.hit : ""}>
              <kbd>Esc</kbd> clear
            </span>

            <em>{results.length} results</em>
          </div>
        </div>

        {/* Toast */}
        {toast && (
          <div key={toast.id} className={styles.toast}>
            <span>
              <Icon name="check" size={12} />
            </span>
            Ran: {toast.text}
          </div>
        )}
      </div>
    </section>
  );
};

export default Spotlight;