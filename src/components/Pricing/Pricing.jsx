import { useEffect, useRef, useState } from "react";
import Icon from "../Icon/Icon";

import styles from "./Pricing.module.css";

const plans = [
  {
    name: "Frontend",
    desc: "All Tosa frontend components, free for everyone.",
    m: 0,
    y: 0,
    features: [
      "Unlimited component usage",
      "Unlimited projects",
      "All frontend components",
      "HTML & CSS components",
      "JavaScript components",
      "NPM & CDN support",
    ],
  },
  {
    name: "Developer",
    desc: "Advanced backend tools and developer components.",
    m: 19,
    y: 15,
    popular: true,
    features: [
      "Everything in Frontend",
      "Advanced backend components",
      "Backend integrations",
      "Advanced developer utilities",
      "Priority documentation",
      "Extended API components",
    ],
  },
  {
    name: "AI",
    desc: "AI models and intelligent components for your projects.",
    m: 49,
    y: 39,
    features: [
      "Everything in Developer",
      "AI models & components",
      "1M AI tokens included",
      "AI project creation",
      "Advanced AI integrations",
      "Additional tokens available",
    ],
  },
];

/* smooth number tween */
const useTween = (target) => {
  const [v, setV] = useState(target);
  const from = useRef(target);

  useEffect(() => {
    const s = from.current;
    const t0 = performance.now();
    let raf;

    const tick = (now) => {
      const p = Math.min((now - t0) / 600, 1);
      const val = s + (target - s) * (1 - Math.pow(1 - p, 3));

      from.current = val;
      setV(val);

      if (p < 1) raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);

    return () => cancelAnimationFrame(raf);
  }, [target]);

  return Math.round(v);
};

const Plan = ({ p, yearly }) => {
  const ref = useRef(null);
  const price = useTween(yearly ? p.y : p.m);

  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();

    ref.current.style.setProperty("--x", `${e.clientX - r.left}px`);
    ref.current.style.setProperty("--y", `${e.clientY - r.top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      className={`${styles.wrap} ${p.popular ? styles.popular : ""}`}
    >
      <div className={styles.card}>
        {p.popular && <span className={styles.ribbon}>Most popular</span>}

        <h3>{p.name}</h3>

        <p className={styles.desc}>{p.desc}</p>

        <div className={styles.price}>
          <span>$</span>
          <strong>{price}</strong>
          <small>/ month</small>
        </div>

        <p className={styles.billed}>
          {p.m === 0
            ? "Free forever"
            : yearly
              ? `Billed $${p.y * 12} yearly`
              : "Billed monthly"}
        </p>

        <button className={styles.btn}>
          {p.m === 0 ? "Start free" : "Get " + p.name}{" "}
          <Icon name="arrow" size={14} />
        </button>

        <ul>
          {p.features.map((f, i) => (
            <li key={f} style={{ "--i": i }}>
              <span>
                <Icon name="check" size={11} />
              </span>{" "}
              {f}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const Pricing = () => {
  const [yearly, setYearly] = useState(true);

  return (
    <section className={styles.section}>
      <div className={styles.head}>
        <span className={styles.badge}>Tosa Pricing</span>

        <h2>
          Build free, <span>scale when needed</span>
        </h2>

        <p>
          Tosa frontend components are completely free. Pay only for advanced
          backend tools and AI usage.
        </p>

        <div className={styles.toggle}>
          <span
            className={styles.pill}
            style={{
              transform: `translateX(${yearly ? 100 : 0}%)`,
            }}
          />

          <button
            className={!yearly ? styles.act : ""}
            onClick={() => setYearly(false)}
          >
            Monthly
          </button>

          <button
            className={yearly ? styles.act : ""}
            onClick={() => setYearly(true)}
          >
            Yearly <em>-20%</em>
          </button>
        </div>
      </div>

      <div className={styles.plans}>
        {plans.map((p) => (
          <Plan key={p.name} p={p} yearly={yearly} />
        ))}
      </div>

      <p className={styles.note}>
        <Icon name="check" size={13} /> Frontend components are free forever
        &nbsp;·&nbsp; Unlimited usage &nbsp;·&nbsp; 1M AI tokens included
      </p>
    </section>
  );
};

export default Pricing;