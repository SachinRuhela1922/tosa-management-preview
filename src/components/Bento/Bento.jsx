import { useEffect, useRef, useState } from "react";
import Card from "../Card/Card";
import Icon from "../Icon/Icon";
import styles from "./Bento.module.css";

/* ---------- hooks ---------- */

const useInView = () => {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return [ref, seen];
};

/* ---------- Count up number ---------- */

const CountUp = ({ to, suffix = "", decimals = 0, duration = 1800 }) => {
  const [ref, seen] = useInView();
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!seen) return;
    let raf;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 4);
      setVal(to * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [seen, to, duration]);

  return (
    <span ref={ref}>
      {val.toLocaleString(undefined, {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}
      {suffix}
    </span>
  );
};

/* ---------- Terminal (typing effect) ---------- */

const script = `$ npm create vite@latest my-app
✔ Project created in 1.2s
$ cd my-app && npm install
✔ 148 packages installed
$ git push origin main
✔ Deployed to production 🚀`;

const Terminal = () => {
  const [i, setI] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setI((p) => (p > script.length + 40 ? 0 : p + 1)),
      45
    );
    return () => clearInterval(t);
  }, []);

  const lines = script.slice(0, i).split("\n");

  return (
    <Card className={styles.terminal}>
      <div className={styles.dots}>
        <i /> <i /> <i />
        <span>bash — 80×24</span>
      </div>
      <pre className={styles.pre}>
        {lines.map((l, idx) => (
          <div key={idx}>
            {l.startsWith("$") ? (
              <>
                <b className={styles.prompt}>$</b>
                {l.slice(1)}
              </>
            ) : (
              <span className={styles.ok}>{l}</span>
            )}
            {idx === lines.length - 1 && <em className={styles.cursor} />}
          </div>
        ))}
      </pre>
    </Card>
  );
};

/* ---------- Orbit ---------- */

const ring1 = ["file", "chart", "target"];
const ring2 = ["message", "globe", "book", "wallet", "calendar"];

const Ring = ({ items, r, d, cls }) => (
  <div
    className={`${styles.ring} ${cls || ""}`}
    style={{ "--r": `${r}px`, "--d": `${d}s` }}
  >
    {items.map((name, idx) => (
      <div
        key={name}
        className={styles.orbitItem}
        style={{ "--a": `${(360 / items.length) * idx}deg` }}
      >
        <span className={styles.orbitDot}>
          <Icon name={name} size={15} />
        </span>
      </div>
    ))}
  </div>
);

const Orbit = () => (
  <Card className={styles.orbitCard}>
    <h3 className={styles.title}>Connected everywhere</h3>
    <p className={styles.muted}>Tools that orbit around your workflow.</p>
    <div className={styles.orbit}>
      <div className={styles.core}>
        <Icon name="activity" size={22} />
      </div>
      <Ring items={ring1} r={62} d={14} />
      <Ring items={ring2} r={104} d={24} cls={styles.reverse} />
    </div>
  </Card>
);

/* ---------- Stats + sparkline ---------- */

const Stats = () => (
  <Card className={styles.stats}>
    <p className={styles.muted}>Total stars</p>
    <h2 className={styles.big}>
      <CountUp to={128400} />
    </h2>

    <svg viewBox="0 0 200 60" className={styles.spark}>
      <path
        d="M0 50 C20 46 30 20 55 28 S90 50 110 30 S150 5 200 10"
        pathLength="1"
      />
    </svg>

    <div className={styles.divider} />

    <p className={styles.muted}>Uptime</p>
    <h2 className={styles.big}>
      <CountUp to={99.99} decimals={2} suffix="%" />
    </h2>

    <div className={styles.divider} />

    <p className={styles.muted}>Developers</p>
    <h2 className={styles.big}>
      <CountUp to={4.2} decimals={1} suffix="M+" />
    </h2>
  </Card>
);

/* ---------- Heatmap ---------- */

const cells = Array.from({ length: 26 * 7 }, (_, i) => {
  const r = Math.abs(Math.sin(i * 12.9898) * 43758.5453) % 1;
  return r < 0.3 ? 0 : Math.ceil(r * 4);
});

const Heatmap = () => (
  <Card className={styles.heat}>
    <div className={styles.rowBetween}>
      <div>
        <h3 className={styles.title}>Contributions</h3>
        <p className={styles.muted}>1,284 commits in the last year</p>
      </div>
      <div className={styles.legend}>
        Less
        {[0, 1, 2, 3, 4].map((l) => (
          <i key={l} style={{ "--l": l }} />
        ))}
        More
      </div>
    </div>

    <div className={styles.heatGrid}>
      {cells.map((l, i) => (
        <i
          key={i}
          title={`${l * 3} contributions`}
          style={{ "--l": l, animationDelay: `${(i % 26) * 25}ms` }}
        />
      ))}
    </div>
  </Card>
);

/* ---------- Notification stack ---------- */

const notes = [
  { icon: "check", t: "Build passed", s: "main • 2s ago" },
  { icon: "message", t: "New comment on PR #42", s: "Aarav • 1m ago" },
  { icon: "target", t: "Issue closed", s: "#318 • 5m ago" },
  { icon: "globe", t: "Deployed to production", s: "v2.4.0 • 9m ago" },
];

const Notifications = () => {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setActive((p) => (p + 1) % notes.length), 2400);
    return () => clearInterval(t);
  }, []);

  return (
    <Card className={styles.notif}>
      <h3 className={styles.title}>Live activity</h3>
      <p className={styles.muted}>Real-time updates.</p>

      <div className={styles.stack}>
        {notes.map((n, i) => {
          const p = (i - active + notes.length) % notes.length;
          return (
            <div
              key={n.t}
              className={styles.note}
              style={{
                "--p": p,
                zIndex: 10 - p,
                opacity: p > 2 ? 0 : 1 - p * 0.3,
              }}
            >
              <span className={styles.noteIcon}>
                <Icon name={n.icon} size={15} />
              </span>
              <div>
                <strong>{n.t}</strong>
                <small>{n.s}</small>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

/* ---------- Tabs ---------- */

const tabs = [
  { name: "Code", icon: "file", text: "Write, edit and review code with blazing-fast tools built for teams." },
  { name: "Review", icon: "message", text: "Discuss changes inline, suggest edits and approve with confidence." },
  { name: "Ship", icon: "target", text: "One click deploys with automatic rollbacks and zero downtime." },
];

const Tabs = () => {
  const [tab, setTab] = useState(0);

  return (
    <Card className={styles.tabs}>
      <div className={styles.tabList}>
        <span
          className={styles.indicator}
          style={{ transform: `translateX(${tab * 100}%)` }}
        />
        {tabs.map((t, i) => (
          <button
            key={t.name}
            className={`${styles.tabBtn} ${tab === i ? styles.tabActive : ""}`}
            onClick={() => setTab(i)}
          >
            {t.name}
          </button>
        ))}
      </div>

      <div key={tab} className={styles.tabBody}>
        <div className={styles.tabIcon}>
          <Icon name={tabs[tab].icon} size={22} />
        </div>
        <p>{tabs[tab].text}</p>
        <ul>
          <li><Icon name="check" size={13} /> Unlimited projects</li>
          <li><Icon name="check" size={13} /> Team collaboration</li>
          <li><Icon name="check" size={13} /> 24/7 support</li>
        </ul>
      </div>
    </Card>
  );
};

/* ---------- Glow CTA ---------- */

const GlowCta = () => (
  <div className={styles.glow}>
    <div className={styles.glowInner}>
      <span className={styles.spark2}>✦</span>
      <h3>Ready to build?</h3>
      <p>Start free. No credit card needed.</p>
      <button className={styles.ctaBtn}>
        Get started <Icon name="arrow" size={14} />
      </button>
    </div>
  </div>
);

/* ---------- Marquee ---------- */

const techs = ["React", "Vite", "Node.js", "TypeScript", "Next.js", "Tailwind", "GraphQL", "Docker", "Postgres", "Redis", "Vercel", "Figma"];

const MarqueeRow = ({ reverse }) => (
  <div className={`${styles.track} ${reverse ? styles.trackRev : ""}`}>
    {[...techs, ...techs].map((t, i) => (
      <span key={i} className={styles.tag}>{t}</span>
    ))}
  </div>
);

const Marquee = () => (
  <Card className={styles.marquee}>
    <div className={styles.mask}>
      <MarqueeRow />
      <MarqueeRow reverse />
    </div>
  </Card>
);

/* ---------- Section ---------- */

const Bento = () => (
  <section className={styles.section}>
    <h2 className={styles.heading}>
      Built for <span>speed</span>
    </h2>
    <p className={styles.sub}>Ek se badhkar ek animated blocks, sab kuch live.</p>

    <div className={styles.grid}>
      <Terminal />
      <Orbit />
      <Stats />
      <Heatmap />
      <Notifications />
      <Tabs />
      <GlowCta />
      <Marquee />
    </div>
  </section>
);

export default Bento;