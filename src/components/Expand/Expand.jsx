import { useState } from "react";
import Icon from "../Icon/Icon";
import styles from "./Expand.module.css";

const projects = [
  {
    tag: "Frontend",
    title: "Tosa UI",
    text: "Reusable frontend components designed to help developers build modern interfaces faster.",
    hue: 215,
    stats: [["60+", "Components"], ["NPM", "Package"], ["CDN", "Support"]]
  },
  {
    tag: "HTML & CSS",
    title: "Tosa Web",
    text: "Ready-to-use HTML and CSS components for building responsive websites without starting from scratch.",
    hue: 340,
    stats: [["40+", "Components"], ["100%", "Responsive"], ["CSS", "Based"]]
  },
  {
    tag: "JavaScript",
    title: "Tosa JS",
    text: "Reusable JavaScript components and utilities that make everyday frontend development simpler.",
    hue: 150,
    stats: [["30+", "Components"], ["ES6+", "Support"], ["Fast", "Setup"]]
  },
  {
    tag: "Java",
    title: "Tosa Java",
    text: "Reusable Java components and utilities created to reduce repetitive development work.",
    hue: 30,
    stats: [["20+", "Components"], ["Java", "Support"], ["Easy", "Integration"]]
  },
  {
    tag: "C++",
    title: "Tosa C++",
    text: "Developer-focused C++ components and utilities for building projects with reusable code.",
    hue: 275,
    stats: [["20+", "Components"], ["C++", "Support"], ["Open", "Documentation"]]
  },
];

const Expand = () => {
  const [active, setActive] = useState(0);

  return (
    <section className={styles.section}>
      <div className={styles.head}>
        <div>
          <span className={styles.badge}>Tosa Components</span>
          <h2>Build faster with <span>Tosa</span></h2>
        </div>
        <p>Explore Tosa components, choose a technology, and start building with reusable code.</p>
      </div>

      <div className={styles.gallery}>
        {projects.map((p, i) => (
          <div
            key={p.title}
            className={`${styles.panel} ${active === i ? styles.on : ""}`}
            style={{ "--h": p.hue }}
            onMouseEnter={() => setActive(i)}
            onClick={() => setActive(i)}
          >
            <div className={styles.grid} />
            <i className={styles.blob} />

            <span className={styles.vLabel}>
              <b>0{i + 1}</b> {p.title}
            </span>

            <div className={styles.content}>
              <span className={styles.tag}>{p.tag}</span>
              <h3>{p.title}</h3>
              <p>{p.text}</p>
              <div className={styles.stats}>
                {p.stats.map(([v, k]) => (
                  <div key={k}><strong>{v}</strong><small>{k}</small></div>
                ))}
              </div>
              <button className={styles.btn}>Explore components <Icon name="arrow" size={14} /></button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Expand;