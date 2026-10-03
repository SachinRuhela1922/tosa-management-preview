import { useEffect, useMemo, useRef, useState } from "react";
import Icon from "../Icon/Icon";
import { items } from "./Previews";
import styles from "./Playground.module.css";

const Playground = () => {
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const [replay, setReplay] = useState(0);
  const [ph, setPh] = useState("");
  const inputRef = useRef(null);
  const sectionRef = useRef(null);

  /* filter */
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return items;
    return items
      .filter((c) => `${c.name} ${c.cat} ${c.tags}`.toLowerCase().includes(q))
      .sort((a, b) => Number(b.name.toLowerCase().startsWith(q)) - Number(a.name.toLowerCase().startsWith(q)));
  }, [query]);

  const active = results[index];

  useEffect(() => setIndex(0), [query]);

  /* typing placeholder */
  useEffect(() => {
    let w = 0, i = 0, dir = 1, hold = 0;
    const t = setInterval(() => {
      if (hold > 0) { hold--; return; }
      const word = items[w].name.toLowerCase();
      i += dir;
      setPh(word.slice(0, i));
      if (dir === 1 && i === word.length) { dir = -1; hold = 12; }
      else if (dir === -1 && i === 0) { dir = 1; w = (w + 1) % items.length; }
    }, 90);
    return () => clearInterval(t);
  }, []);

  /* Ctrl + K focus */
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        setTimeout(() => inputRef.current?.focus(), 400);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const onKeyDown = (e) => {
    if (!results.length) return;
    if (e.key === "ArrowDown") { e.preventDefault(); setIndex((p) => (p + 1) % results.length); }
    if (e.key === "ArrowUp") { e.preventDefault(); setIndex((p) => (p - 1 + results.length) % results.length); }
    if (e.key === "Enter") setReplay((p) => p + 1);
    if (e.key === "Escape") setQuery("");
  };

  const Preview = active?.C;

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.grid} />

      <div className={styles.head}>
        <span className={styles.badge}><i /> Tosa Component Playground</span>
        <h2 className={styles.heading}>
          Explore it. <span>See it live.</span>
        </h2>
        <p className={styles.sub}>
          {items.length} interactive Tosa components. Search karo (jaise <b>navbar</b>, <b>modal</b>, <b>toast</b>) aur live preview instantly dekho.
        </p>
      </div>

      <div className={styles.shell}>
        {/* ---------- left: search + list ---------- */}
        <aside className={styles.side}>
          <div className={styles.search}>
            <Icon name="search" size={17} />
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder={`Try: ${ph}`}
              spellCheck="false"
            />
            {query ? (
              <button onClick={() => setQuery("")} aria-label="clear"><Icon name="close" size={13} /></button>
            ) : (
              <kbd>Ctrl K</kbd>
            )}
          </div>

          <div className={styles.list}>
            {results.map((c, i) => (
              <button
                key={c.id}
                className={`${styles.item} ${i === index ? styles.itemOn : ""}`}
                style={{ "--i": i }}
                onClick={() => setIndex(i)}
              >
                <span className={styles.itemIcon}><Icon name={c.icon} size={15} /></span>
                <span className={styles.itemText}>
                  <strong>{c.name}</strong>
                  <small>{c.cat}</small>
                </span>
                <Icon name="arrow" size={13} />
              </button>
            ))}

            {!results.length && (
              <div className={styles.empty}>
                <Icon name="search" size={22} />
                <p>“{query}” naam ka Tosa component nahi mila.</p>
              </div>
            )}
          </div>
        </aside>

        {/* ---------- right: preview ---------- */}
        <div className={styles.window}>
          <div className={styles.bar}>
            <span className={styles.dots}><i /><i /><i /></span>
            <span className={styles.path}>
              Tosa <b>/</b> {active ? active.id : "—"}
            </span>
            <button className={styles.replay} onClick={() => setReplay((p) => p + 1)} title="Replay">
              <Icon name="refresh" size={14} />
            </button>
          </div>

          <div className={styles.stage}>
            {Preview ? (
              <div key={`${active.id}-${replay}`} className={styles.stageInner}>
                <Preview />
              </div>
            ) : (
              <p className={styles.muted}>Search for a Tosa component to see its live preview.</p>
            )}
          </div>

          {active && (
            <div className={styles.info}>
              <div>
                <h3>{active.name}</h3>
                <p>{active.desc}</p>
              </div>
              <span className={styles.tag}>{active.cat}</span>
            </div>
          )}
        </div>
      </div>

      {/* quick chips */}
      <div className={styles.chips}>
        {["navbar", "modal", "tabs", "toast", "stepper", "rating"].map((c) => (
          <button key={c} onClick={() => setQuery(c)}>{c}</button>
        ))}
      </div>
    </section>
  );
};

export default Playground;