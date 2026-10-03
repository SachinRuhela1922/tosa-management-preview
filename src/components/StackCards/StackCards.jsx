import { useEffect, useRef } from "react";
import Icon from "../Icon/Icon";
import styles from "./StackCards.module.css";

const cards = [
  {
    icon: "chart",
    tag: "Components",
    title: "Reusable components for every project",
    text: "Use ready-to-use Tosa components instead of rebuilding common UI from scratch. Pick what you need and integrate it into your project.",
    chips: ["60+ components", "Reusable UI", "Live preview"],
    hue: 210,
  },
  {
    icon: "target",
    tag: "Languages",
    title: "Built for multiple technologies",
    text: "Explore reusable components and utilities across frontend technologies and programming languages supported by Tosa.",
    chips: ["HTML & CSS", "JavaScript", "Java & C++"],
    hue: 150,
  },
  {
    icon: "file",
    tag: "Developer Tools",
    title: "Build faster with ready-made tools",
    text: "Reduce repetitive development work with prebuilt components, utilities, examples and documentation designed for developers.",
    chips: ["NPM", "CDN", "Documentation"],
    hue: 275,
  },
  {
    icon: "globe",
    tag: "AI",
    title: "Add intelligent components to your projects",
    text: "Use Tosa AI models and components to build AI-powered projects without starting every integration from scratch.",
    chips: ["AI models", "AI components", "1M tokens"],
    hue: 20,
  },
];

const Visual = ({ v }) => {
  if (v === 0)
    return (
      <div className={styles.bars}>
        {[42, 70, 55, 92, 66, 84].map((h, i) => (
          <i
            key={i}
            style={{ "--h": `${h}%`, "--d": `${i * 0.12}s` }}
          />
        ))}
      </div>
    );

  if (v === 1)
    return (
      <div className={styles.rings}>
        <i />
        <i />
        <i />
        <span>
          <Icon name="check" size={26} />
        </span>
      </div>
    );

  if (v === 2)
    return (
      <div className={styles.lines}>
        {[90, 65, 80, 50, 72].map((w, i) => (
          <i
            key={i}
            style={{ "--w": `${w}%`, "--d": `${i * 0.2}s` }}
          />
        ))}
        <b>Ready to use ✓</b>
      </div>
    );

  return (
    <div className={styles.dots}>
      {Array.from({ length: 48 }, (_, i) => (
        <i
          key={i}
          style={{ "--d": `${((i * 37) % 17) * 0.18}s` }}
        />
      ))}
    </div>
  );
};

const StackCards = () => {
  const wraps = useRef([]);

  useEffect(() => {
    const onScroll = () => {
      wraps.current.forEach((w, i) => {
        const next = wraps.current[i + 1];
        if (!w || !next) return;

        const d =
          next.getBoundingClientRect().top -
          w.getBoundingClientRect().top;

        const p = Math.min(
          Math.max(1 - d / w.offsetHeight, 0),
          1
        );

        const card = w.firstChild;

        card.style.transform = `scale(${1 - p * 0.07})`;
        card.style.filter = `brightness(${1 - p * 0.35})`;
      });
    };

    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });

    return () =>
      window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className={styles.section}>
      <div className={styles.head}>
        <span className={styles.badge}>Tosa Features</span>

        <h2>
          Build faster, <span>with reusable components</span>
        </h2>

        <p>
          Explore Tosa's components, developer tools, supported
          technologies and AI capabilities.
        </p>
      </div>

      <div className={styles.stack}>
        {cards.map((c, i) => (
          <div
            key={c.title}
            ref={(el) => (wraps.current[i] = el)}
            className={styles.wrap}
            style={{ "--i": i, "--h": c.hue }}
          >
            <article className={styles.card}>
              <div className={styles.info}>
                <span className={styles.num}>0{i + 1}</span>

                <span className={styles.tag}>
                  <Icon name={c.icon} size={14} /> {c.tag}
                </span>

                <h3>{c.title}</h3>

                <p>{c.text}</p>

                <div className={styles.chips}>
                  {c.chips.map((x) => (
                    <em key={x}>{x}</em>
                  ))}
                </div>

                <a className={styles.link}>
                  Explore Tosa <Icon name="arrow" size={14} />
                </a>
              </div>

              <div className={styles.visual}>
                <Visual v={i} />
              </div>
            </article>
          </div>
        ))}
      </div>
    </section>
  );
};

export default StackCards;