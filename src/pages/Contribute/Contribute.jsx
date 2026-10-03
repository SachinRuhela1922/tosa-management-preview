// src/pages/Contribute.jsx
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Contribute.module.css";
import { getProfile, getToken, clearSession } from "../../utils/auth";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

// =====================================================
// Language -> contribute question types
// =====================================================

const COMMON = [
  { id: "dsa", icon: "∑", title: "DSA Problem", desc: "Algorithm / data-structure problem with a solution." },
  { id: "mcq", icon: "◉", title: "MCQ", desc: "Multiple choice question with 4 options." },
  { id: "output", icon: "▶", title: "Output Prediction", desc: "Snippet jiska output guess karna hai." },
  { id: "debug", icon: "✕", title: "Debug the Code", desc: "Buggy code jise fix karna hai." },
];

const BY_LANGUAGE = {
  javascript: [
    { id: "async", icon: "⟳", title: "Async / Promises", desc: "Event loop, promises, async-await puzzles." },
    { id: "closure", icon: "{}", title: "Closures & Scope", desc: "Closures, hoisting, this-binding questions." },
    { id: "react", icon: "⚛", title: "React / DOM", desc: "Hooks, rendering, DOM manipulation tasks." },
  ],
  python: [
    { id: "pythonic", icon: "🐍", title: "Pythonic Tricks", desc: "Comprehensions, generators, decorators." },
    { id: "pandas", icon: "▦", title: "Data / Pandas", desc: "Data manipulation and analysis problems." },
    { id: "oop", icon: "◇", title: "OOP & Dunder", desc: "Classes, inheritance, magic methods." },
  ],
  java: [
    { id: "oop", icon: "◇", title: "OOP Concepts", desc: "Inheritance, polymorphism, interfaces." },
    { id: "collections", icon: "☰", title: "Collections", desc: "List, Map, Set, Streams based questions." },
    { id: "concurrency", icon: "⇄", title: "Multithreading", desc: "Threads, synchronization, executors." },
  ],
  cpp: [
    { id: "stl", icon: "☰", title: "STL", desc: "Vectors, maps, iterators, algorithms." },
    { id: "pointers", icon: "→", title: "Pointers & Memory", desc: "Pointers, references, smart pointers." },
    { id: "oop", icon: "◇", title: "OOP Concepts", desc: "Classes, virtual functions, templates." },
  ],
  c: [
    { id: "pointers", icon: "→", title: "Pointers & Memory", desc: "Pointers, malloc/free, arrays." },
    { id: "strings", icon: "“”", title: "Strings & Arrays", desc: "String handling and array tricks." },
  ],
  typescript: [
    { id: "types", icon: "T", title: "Type System", desc: "Generics, unions, utility types." },
    { id: "async", icon: "⟳", title: "Async / Promises", desc: "Typed async flows and patterns." },
  ],
  go: [
    { id: "goroutines", icon: "⇄", title: "Goroutines & Channels", desc: "Concurrency patterns in Go." },
    { id: "interfaces", icon: "◇", title: "Interfaces & Structs", desc: "Go-style composition questions." },
  ],
  sql: [
    { id: "query", icon: "⌸", title: "Query Writing", desc: "Joins, grouping, window functions." },
    { id: "design", icon: "▤", title: "Schema Design", desc: "Normalization, indexes, keys." },
  ],
};

const ALIASES = {
  js: "javascript", node: "javascript", nodejs: "javascript", "node.js": "javascript",
  react: "javascript", reactjs: "javascript", ts: "typescript",
  py: "python", "c++": "cpp", golang: "go", mysql: "sql", postgresql: "sql",
};

const normalizeLanguage = (raw = "") => {
  const key = raw.trim().toLowerCase();
  return ALIASES[key] || key;
};

const TERMS = [
  { t: "Original work only", d: "Sirf apna banaya hua content submit karo. Kisi book, website ya course se copy-paste allowed nahi hai." },
  { t: "Accuracy matters", d: "Question aur answer dono sahi hone chahiye. Code ko submit karne se pehle run karke test kar lo." },
  { t: "Licence to TOSA", d: "Submit karte hi tum TOSA ko is content ko platform par dikhane, edit karne aur share karne ka non-exclusive right dete ho. Credit tumhare TOSA ID ke saath milega." },
  { t: "Review process", d: "Har contribution review hota hai. TOSA kisi bhi submission ko approve, edit ya reject kar sakta hai." },
  { t: "Respectful content", d: "Offensive, misleading, spam ya plagiarised content par account action liya ja sakta hai." },
  { t: "No sensitive data", d: "Code ya examples me password, API key ya personal data mat daalo." },
];


// =====================================================
// Rewards helpers
// =====================================================

const TYPE_TITLES = Object.fromEntries(
  [...COMMON, ...Object.values(BY_LANGUAGE).flat()].map((t) => [t.id, t.title])
);

const pad2 = (n) => String(n).padStart(2, "0");

const fmtDate = (d) =>
  new Date(d).toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });

const fmtLeft = (ms) => {
  if (ms <= 0) return "Processing…";
  const s = Math.floor(ms / 1000);
  return `${pad2(Math.floor(s / 3600))}:${pad2(Math.floor((s % 3600) / 60))}:${pad2(s % 60)}`;
};

const REVIEW_MS = 24 * 60 * 60 * 1000;

// smooth number count-up
const useCountUp = (target, ms = 1100) => {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf, start;
    const step = (t) => {
      start = start ?? t;
      const p = Math.min(1, (t - start) / ms);
      setV(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, ms]);
  return v;
};

const RAIN = Array.from({ length: 14 }, (_, i) => ({
  left: `${4 + i * 7}%`,
  delay: `${(i % 7) * 0.35}s`,
  dur: `${2.6 + (i % 5) * 0.4}s`,
}));

const RewardsOverlay = ({ data, loading, error, onClose, onRefresh }) => {
  const [now, setNow] = useState(Date.now());
  const lastRefresh = useRef(0);

  const stats = data?.stats;
  const list = data?.contributions || [];

  const coins = useCountUp(stats?.coins || 0);
  const rank = stats?.rank ?? 9;

  // live ticker + Esc to close
  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 1000);
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      clearInterval(tick);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  // jab kisi pending ka 24h poora ho jaye -> server se fresh data (coins credit)
  useEffect(() => {
    const due = list.some((c) => c.status === "pending" && new Date(c.acceptAt).getTime() <= now);
    if (due && now - lastRefresh.current > 15000) {
      lastRefresh.current = now;
      onRefresh();
    }
  }, [now, list, onRefresh]);

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true" aria-label="Your rewards">
      <div className={styles.panel} onClick={(e) => e.stopPropagation()}>
        <div className={styles.rain} aria-hidden="true">
          {RAIN.map((c, i) => (
            <i key={i} style={{ left: c.left, animationDelay: c.delay, animationDuration: c.dur }} />
          ))}
        </div>

        <button type="button" className={styles.close} onClick={onClose} aria-label="Close">✕</button>

        <div className={styles.panelBody}>
          <h2 className={styles.rTitle}>Your rewards</h2>
          <p className={styles.rSub}>
            Har contribution 24 ghante review me rehta hai. Accept hote hi coins credit ho jaate hain aur rank upar jaata hai.
          </p>

          {error && <div className={`${styles.alert} ${styles.err}`}>! {error}</div>}
          {!stats && loading && <div className={styles.rLoading}><span className={styles.spinner} /> Loading rewards…</div>}

          {stats && (
            <>
              {/* HERO: coins + rank */}
              <div className={styles.rHero}>
                <div className={styles.coinBox}>
                  <div className={styles.coin}><span>◎</span></div>
                  <div>
                    <b className={styles.coinNum}>{coins}</b>
                    <small>COINS EARNED</small>
                    {stats.pendingCoins > 0 && (
                      <em className={styles.incoming}>+{stats.pendingCoins} incoming after review</em>
                    )}
                  </div>
                </div>

                <div className={styles.rankBox}>
                  <div className={styles.rankBadge} key={rank}>
                    <small>RANK</small>
                    <b>#{rank}</b>
                  </div>
                  <div className={styles.rankInfo}>
                    {rank === 1 ? (
                      <strong>Top rank reached 🏆</strong>
                    ) : (
                      <strong>
                        {stats.nextRankIn} more accepted contribution{stats.nextRankIn > 1 ? "s" : ""} → Rank #{rank - 1}
                      </strong>
                    )}
                    <div className={styles.bar}>
                      <div className={styles.barFill} style={{ width: `${Math.round(stats.rankProgress * 100)}%` }} />
                    </div>
                  </div>
                </div>
              </div>

              {/* RANK LADDER */}
              <div className={styles.ladder} aria-label="Rank ladder">
                {Array.from({ length: stats.startRank }, (_, i) => stats.startRank - i).map((n) => (
                  <div
                    key={n}
                    className={`${styles.rung} ${n >= rank ? styles.rungOn : ""} ${n === rank ? styles.rungNow : ""}`}
                    title={`Rank ${n}`}
                  >
                    {n}
                  </div>
                ))}
              </div>

              {/* MINI STATS */}
              <div className={styles.miniStats}>
                <div><b>{stats.total}</b><small>CONTRIBUTED</small></div>
                <div><b>{stats.accepted}</b><small>ACCEPTED</small></div>
                <div><b>{stats.pending}</b><small>IN REVIEW</small></div>
              </div>

              {/* HISTORY */}
              <h3 className={styles.hTitle}>Contribution history</h3>

              {list.length === 0 ? (
                <div className={styles.empty}>
                  Abhi tak koi contribution nahi. Pehla submit karo aur coins kamaana shuru karo!
                </div>
              ) : (
                <ul className={styles.history}>
                  {list.map((c, idx) => {
                    const acceptMs = new Date(c.acceptAt).getTime();
                    const left = acceptMs - now;
                    const pct = Math.min(100, Math.max(0, ((REVIEW_MS - left) / REVIEW_MS) * 100));
                    return (
                      <li key={c._id} className={styles.hItem} style={{ animationDelay: `${Math.min(idx, 8) * 60}ms` }}>
                        <div className={styles.hTop}>
                          <div className={styles.hMain}>
                            <b>{c.title}</b>
                            <span>
                              {c.typeTitle || TYPE_TITLES[c.type] || c.type}
                              {c.language ? ` • ${c.language}` : ""} • {c.difficulty}
                            </span>
                          </div>
                          <div className={styles.hCoins}>
                            {c.status === "accepted" && <strong className={styles.gain}>+{c.coinsAwarded}</strong>}
                            {c.status === "pending" && <strong className={styles.wait}>+{c.coinsPotential}</strong>}
                            {c.status === "rejected" && <strong className={styles.lost}>0</strong>}
                            <small>coins</small>
                          </div>
                        </div>

                        <div className={styles.hMeta}>
                          <span className={`${styles.chip} ${styles[`chip_${c.status}`]}`}>
                            {c.status === "pending" ? "In review" : c.status === "accepted" ? "Accepted" : "Rejected"}
                          </span>
                          <span>Submitted {fmtDate(c.createdAt)}</span>
                          {c.status === "accepted" && c.acceptedAt && <span>Accepted {fmtDate(c.acceptedAt)}</span>}
                        </div>

                        {c.status === "pending" && (
                          <div className={styles.countdown}>
                            <div className={styles.bar}><div className={styles.barFill} style={{ width: `${pct}%` }} /></div>
                            <small>Coins unlock in <b>{fmtLeft(left)}</b></small>
                          </div>
                        )}
                      </li>
                    );
                  })}
                </ul>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const emptyForm = {
  title: "", difficulty: "Easy", question: "", code: "",
  options: ["", "", "", ""], correct: 0, answer: "", explanation: "", tags: "",
};

const Contribute = () => {
  const navigate = useNavigate();
  const profile = getProfile() || {};
  const uid = profile.uniqueId || "guest";
  const termsKey = `tosaContributeTerms:${uid}`;

  const [accepted, setAccepted] = useState(
    () => localStorage.getItem(termsKey) === "yes"
  );
  const [agree, setAgree] = useState(false);
  const [scrolledEnd, setScrolledEnd] = useState(false);
  const [type, setType] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // rewards (coins + rank + history)
  const [rewards, setRewards] = useState(null);
  const [rLoading, setRLoading] = useState(false);
  const [rError, setRError] = useState("");
  const [showRewards, setShowRewards] = useState(false);

  const language = normalizeLanguage(profile.preferredLanguage);
  const types = useMemo(
    () => [...(BY_LANGUAGE[language] || []), ...COMMON],
    [language]
  );
  const selected = types.find((t) => t.id === type);

  const loadRewards = useCallback(async () => {
    try {
      setRLoading(true);
      setRError("");
      const res = await fetch(`${API_URL}/api/contribute/me`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      // NOTE: yahan session clear / redirect nahi karte. Rewards sirf ek extra
      // widget hai, uski wajah se user ko page se bahar nahi phenkna chahiye.
      if (res.status === 401 || res.status === 403) {
        console.warn("[rewards] /api/contribute/me returned", res.status);
        setRError(`Rewards load nahi hue (server ne ${res.status} diya). Backend auth check karo.`);
        return;
      }
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Could not load rewards.");
      setRewards({ stats: data.stats, contributions: data.contributions });
    } catch (err) {
      setRError(err.message || "Could not load rewards.");
    } finally {
      setRLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRewards();
  }, [loadRewards]);

  const closeRewards = useCallback(() => setShowRewards(false), []);

  const handleScroll = (e) => {
    const el = e.target;
    if (el.scrollTop + el.clientHeight >= el.scrollHeight - 8) setScrolledEnd(true);
  };

  const acceptTerms = () => {
    localStorage.setItem(termsKey, "yes");
    setAccepted(true);
  };

  const set = (name, value) => setForm((p) => ({ ...p, [name]: value }));
  const setOption = (i, v) =>
    setForm((p) => ({ ...p, options: p.options.map((o, idx) => (idx === i ? v : o)) }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.question.trim().length < 20) {
      setError("Question thoda detail me likho (kam se kam 20 characters).");
      return;
    }
    if (type === "mcq" && form.options.some((o) => !o.trim())) {
      setError("MCQ ke saare 4 options bharo.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/api/contribute`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          language: profile.preferredLanguage,
          languageLevel: profile.languageLevel,
          type,
          typeTitle: selected?.title,
          profile: {
            name: profile.name,
            uniqueId: profile.uniqueId,
            email: profile.email,
          },
          title: form.title.trim(),
          difficulty: form.difficulty,
          question: form.question.trim(),
          code: form.code,
          options: type === "mcq" ? form.options : undefined,
          correct: type === "mcq" ? form.correct : undefined,
          answer: form.answer.trim(),
          explanation: form.explanation.trim(),
          tags: form.tags.split(",").map((t) => t.trim()).filter(Boolean),
        }),
      });

      // Token invalid / expire => session khatam, login par bhejo
      if (res.status === 401 || res.status === 403) {
        clearSession();
        navigate("/profile", {
          replace: true,
          state: { from: { pathname: "/contribute" }, notice: "Session expired. Please login again." },
        });
        return;
      }

      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Submission failed.");

      setSuccess(
        "Thank you! Contribution review me hai. 24 ghante baad accept hote hi coins tumhare account me aa jayenge."
      );
      setForm(emptyForm);
      setType(null);
      loadRewards();
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    clearSession();
    navigate("/profile", { replace: true });
  };

  return (
    <div className={styles.page}>
      <div className={styles.aurora} />
      <div className={styles.grid} />

      {showRewards && (
        <RewardsOverlay
          data={rewards}
          loading={rLoading}
          error={rError}
          onClose={closeRewards}
          onRefresh={loadRewards}
        />
      )}

      <div className={styles.container}>
        {/* TOP BAR */}
        <header className={styles.topbar}>
          <div className={styles.brand}>
            <div className={styles.brandMark}>T</div>
            <div>
              <strong>TOSA</strong>
              <span>Contribute</span>
            </div>
          </div>
          <div className={styles.topActions}>
            <button type="button" className={styles.rewardBtn} onClick={() => { setShowRewards(true); loadRewards(); }}>
              <span className={styles.rewardCoin}>◎</span>
              {rewards?.stats ? `${rewards.stats.coins} · Rank #${rewards.stats.rank}` : "Rewards"}
            </button>
            <button type="button" onClick={() => navigate("/view-profile")}>My Profile</button>
            <button type="button" onClick={logout}>Logout</button>
          </div>
        </header>

        {/* HERO */}
        <section className={styles.hero}>
          <div className={styles.pill}><span /> CONTRIBUTION HUB</div>
          <h1>
            Share what you know in <em>{profile.preferredLanguage || "your language"}</em>.
          </h1>
          <p>
            Tumhari chosen language ke hisaab se question types niche diye gaye hain.
            Ek achha question kisi aur developer ki prep badal sakta hai.
          </p>

          <div className={styles.stats}>
            <div><small>DEVELOPER</small><b>{profile.name || "—"}</b></div>
            <div><small>TOSA ID</small><b>{profile.uniqueId || "—"}</b></div>
            <div><small>LANGUAGE</small><b>{profile.preferredLanguage || "—"}</b></div>
            <div><small>LEVEL</small><b>{profile.languageLevel || "—"}</b></div>
          </div>
        </section>

        {/* STEP 1: TERMS */}
        {!accepted && (
          <section className={styles.card}>
            <div className={styles.cardHead}>
              <span className={styles.step}>01</span>
              <div>
                <h2>Terms &amp; Conditions</h2>
                <p>Contribute karne se pehle neeche scroll karke sab padho.</p>
              </div>
            </div>

            <div className={styles.terms} onScroll={handleScroll}>
              {TERMS.map((x, i) => (
                <div key={x.t} className={styles.term}>
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <div>
                    <b>{x.t}</b>
                    <p>{x.d}</p>
                  </div>
                </div>
              ))}
              <div className={styles.endMark}>— End of terms —</div>
            </div>

            <label className={`${styles.check} ${!scrolledEnd ? styles.disabled : ""}`}>
              <input
                type="checkbox"
                checked={agree}
                disabled={!scrolledEnd}
                onChange={(e) => setAgree(e.target.checked)}
              />
              <span>
                Maine saari Terms &amp; Conditions padh li hain aur main agree karta/karti hu.
              </span>
            </label>

            <button
              type="button"
              className={styles.primary}
              disabled={!agree}
              onClick={acceptTerms}
            >
              Accept &amp; Continue <span>→</span>
            </button>
          </section>
        )}

        {/* STEP 2: PICK TYPE */}
        {accepted && !type && (
          <section className={styles.card}>
            <div className={styles.cardHead}>
              <span className={styles.step}>02</span>
              <div>
                <h2>Choose a question type</h2>
                <p>
                  {profile.preferredLanguage
                    ? `${profile.preferredLanguage} ke liye specially curated types.`
                    : "Apna contribution type chuno."}
                </p>
              </div>
            </div>

            {success && <div className={`${styles.alert} ${styles.ok}`}>✓ {success}</div>}

            <div className={styles.typeGrid}>
              {types.map((t) => (
                <button key={t.id} type="button" className={styles.typeCard} onClick={() => { setType(t.id); setSuccess(""); }}>
                  <div className={styles.typeIcon}>{t.icon}</div>
                  <b>{t.title}</b>
                  <span>{t.desc}</span>
                  <i>→</i>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* STEP 3: FORM */}
        {accepted && type && (
          <section className={styles.card}>
            <div className={styles.cardHead}>
              <span className={styles.step}>03</span>
              <div>
                <h2>{selected?.title}</h2>
                <p>{selected?.desc}</p>
              </div>
              <button type="button" className={styles.back} onClick={() => setType(null)}>← Change type</button>
            </div>

            {error && <div className={`${styles.alert} ${styles.err}`}>! {error}</div>}

            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.row}>
                <label className={styles.field}>
                  <span>TITLE</span>
                  <input value={form.title} onChange={(e) => set("title", e.target.value)} placeholder="Short, clear title" required />
                </label>
                <label className={styles.field}>
                  <span>DIFFICULTY</span>
                  <select value={form.difficulty} onChange={(e) => set("difficulty", e.target.value)}>
                    <option>Easy</option><option>Medium</option><option>Hard</option>
                  </select>
                </label>
              </div>

              <label className={styles.field}>
                <span>QUESTION</span>
                <textarea rows={5} value={form.question} onChange={(e) => set("question", e.target.value)} placeholder="Question detail me likho..." required />
              </label>

              {type !== "mcq" && (
                <label className={styles.field}>
                  <span>CODE SNIPPET (OPTIONAL)</span>
                  <textarea className={styles.mono} rows={7} value={form.code} onChange={(e) => set("code", e.target.value)} placeholder={`// ${profile.preferredLanguage || "your"} code`} spellCheck={false} />
                </label>
              )}

              {type === "mcq" && (
                <div className={styles.options}>
                  <span className={styles.label}>OPTIONS — correct wala select karo</span>
                  {form.options.map((o, i) => (
                    <label key={i} className={`${styles.opt} ${form.correct === i ? styles.optOn : ""}`}>
                      <input type="radio" name="correct" checked={form.correct === i} onChange={() => set("correct", i)} />
                      <b>{String.fromCharCode(65 + i)}</b>
                      <input value={o} onChange={(e) => setOption(i, e.target.value)} placeholder={`Option ${String.fromCharCode(65 + i)}`} required />
                    </label>
                  ))}
                </div>
              )}

              {type !== "mcq" && (
                <label className={styles.field}>
                  <span>{type === "output" ? "EXPECTED OUTPUT" : type === "debug" ? "FIXED CODE / SOLUTION" : "ANSWER / SOLUTION"}</span>
                  <textarea className={styles.mono} rows={6} value={form.answer} onChange={(e) => set("answer", e.target.value)} required />
                </label>
              )}

              <label className={styles.field}>
                <span>EXPLANATION</span>
                <textarea rows={4} value={form.explanation} onChange={(e) => set("explanation", e.target.value)} placeholder="Answer kyu sahi hai?" required />
              </label>

              <label className={styles.field}>
                <span>TAGS (COMMA SEPARATED)</span>
                <input value={form.tags} onChange={(e) => set("tags", e.target.value)} placeholder="arrays, recursion, closures" />
              </label>

              <button type="submit" className={styles.primary} disabled={loading}>
                {loading ? "Submitting..." : <>Submit Contribution <span>→</span></>}
              </button>
              <p className={styles.note}>Submit karke tum accepted Terms &amp; Conditions se agree rehte ho.</p>
            </form>
          </section>
        )}
      </div>
    </div>
  );
};

export default Contribute;