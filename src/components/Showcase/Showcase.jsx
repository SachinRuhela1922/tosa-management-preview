import { useMemo, useState } from "react";
import Card from "../Card/Card";
import Icon from "../Icon/Icon";
import styles from "./Showcase.module.css";

/* ---------- small pieces ---------- */

const MenuCard = ({ title, items }) => (
  <Card className={styles.menuCard}>
    <p className={styles.menuTitle}>{title}</p>
    <ul className={styles.menuList}>
      {items.map(([icon, label]) => (
        <li key={label} className={styles.menuItem}>
          <Icon name={icon} />
          <span>{label}</span>
        </li>
      ))}
    </ul>
  </Card>
);

// Fake QR (random-looking grid)
const QR = () => {
  const cells = useMemo(() => {
    const n = 21;
    const out = [];
    const inFinder = (x, y) =>
      (x < 7 && y < 7) || (x > 13 && y < 7) || (x < 7 && y > 13);
    for (let y = 0; y < n; y++) {
      for (let x = 0; x < n; x++) {
        if (!inFinder(x, y) && Math.sin(x * 12.9 + y * 78.2) * 43758 % 1 > 0.5)
          out.push([x, y]);
      }
    }
    return out;
  }, []);

  const Finder = ({ x, y }) => (
    <g transform={`translate(${x} ${y})`}>
      <rect width="7" height="7" fill="#000" />
      <rect x="1" y="1" width="5" height="5" fill="#fff" />
      <rect x="2" y="2" width="3" height="3" fill="#000" />
    </g>
  );

  return (
    <svg viewBox="0 0 21 21" className={styles.qr}>
      <rect width="21" height="21" fill="#fff" />
      {cells.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="#000" />
      ))}
      <Finder x={0} y={0} />
      <Finder x={14} y={0} />
      <Finder x={0} y={14} />
    </svg>
  );
};

/* ---------- main section ---------- */

const bars = [
  { label: "HTML", h: 62 },
  { label: "CSS", h: 100 },
  { label: "JS", h: 76 },
  { label: "Java", h: 106 },
  { label: "C++", h: 55 },
];

const Showcase = () => {
  const [checked, setChecked] = useState(true);
  const [switchOn, setSwitchOn] = useState(true);
  const [radio, setRadio] = useState(true);

  return (
    <section className={styles.section}>
      <h2 className={styles.title}>Everything you need</h2>
      <p className={styles.subtitle}>
        Explore Tosa components and see them working live.
      </p>

      <div className={styles.grid}>
        {/* ===== Buttons / inputs ===== */}
        <Card className={styles.item}>
          <div className={styles.row}>
            <button className={styles.btnLight}>
              Get Started <Icon name="arrow" size={14} />
            </button>
            <button className={styles.btnDark}>Secondary</button>
            <button className={styles.btnOutline}>Outline</button>
          </div>

          <div className={styles.inputWrap}>
            <input className={styles.input} placeholder="Search components" />
            <Icon name="search" size={15} />
          </div>

          <textarea
            className={styles.textarea}
            placeholder="Write your component description..."
            rows="3"
          />

          <div className={styles.controls}>
            <div className={styles.row}>
              <span className={styles.badgeLight}>Frontend</span>
              <span className={styles.badgeDark}>Backend</span>
            </div>

            <div className={styles.row}>
              <button
                className={`${styles.radio} ${radio ? styles.radioOn : ""}`}
                onClick={() => setRadio(!radio)}
                aria-label="radio"
              />

              <button
                className={`${styles.checkbox} ${checked ? styles.checkOn : ""}`}
                onClick={() => setChecked(!checked)}
                aria-label="checkbox"
              >
                {checked && <Icon name="check" size={12} />}
              </button>

              <button
                className={`${styles.switch} ${switchOn ? styles.switchOn : ""}`}
                onClick={() => setSwitchOn(!switchOn)}
                aria-label="switch"
              >
                <span />
              </button>
            </div>
          </div>

          <div className={styles.rowBetween}>
            <button className={styles.btnOutline}>Component Preview</button>
            <button className={styles.btnOutline}>
              Component Group <Icon name="up" size={14} />
            </button>
          </div>
        </Card>

        {/* ===== Menu cards ===== */}
        <div className={styles.pair}>
          <MenuCard
            title="Tosa Components"
            items={[
              ["file", "Frontend"],
              ["wallet", "Backend"],
              ["chart", "AI Components"],
              ["target", "Utilities"],
              ["calendar", "Templates"],
            ]}
          />

          <MenuCard
            title="Developer Resources"
            items={[
              ["help", "Getting Started"],
              ["book", "Documentation"],
              ["message", "Community"],
              ["activity", "Examples"],
              ["globe", "Languages"],
            ]}
          />
        </div>

        {/* ===== Chart ===== */}
        <Card className={styles.item}>
          <h3 className={styles.cardTitle}>Component Usage</h3>
          <p className={styles.muted}>Recent Tosa component activity</p>

          <div className={styles.chart}>
            {bars.map((b, i) => (
              <div key={b.label} className={styles.barCol}>
                <div
                  className={styles.bar}
                  style={{
                    height: `${b.h * 1.6}px`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
                <span className={styles.barLabel}>{b.label}</span>
              </div>
            ))}
          </div>

          <div className={styles.twoCol}>
            <div className={styles.stat}>
              <span className={styles.statTop}>NEXT</span>
              <strong>Component Update</strong>
              <span className={styles.muted}>Coming soon</span>
            </div>

            <div className={styles.stat}>
              <span className={styles.statTop}>PROJECT</span>
              <strong>Tosa UI</strong>
              <span className={styles.muted}>Active</span>
            </div>
          </div>

          <button className={styles.btnWide}>View Components</button>
        </Card>

        {/* ===== Balance ===== */}
        <Card className={styles.item}>
          <p className={styles.muted}>Available Components</p>
          <h2 className={styles.balance}>60+</h2>
          <span className={styles.pending}>
            <i /> Ready to Use
          </span>
        </Card>

        {/* ===== Milestone ===== */}
        <Card className={styles.item}>
          <h3 className={styles.cardTitle}>Create a new project</h3>
          <p className={styles.muted}>
            Choose Tosa components and build your project faster.
          </p>

          <label className={styles.label}>Project Name</label>
          <input
            className={styles.field}
            placeholder="e.g. Portfolio, Dashboard"
          />

          <div className={styles.twoCol}>
            <div>
              <label className={styles.label}>Technology</label>
              <input className={styles.field} defaultValue="JavaScript" />
            </div>

            <div>
              <label className={styles.label}>Components</label>
              <input className={styles.field} defaultValue="12 Components" />
            </div>
          </div>

          <button className={styles.btnWide}>Create Project</button>
          <button className={styles.btnWideOutline}>Cancel</button>
        </Card>

        {/* ===== Payout ===== */}
        <Card className={styles.item}>
          <div className={styles.rowBetween}>
            <h3 className={styles.cardTitle}>Component Settings</h3>

            <button className={styles.roundBtn} aria-label="close">
              <Icon name="close" size={14} />
            </button>
          </div>

          <p className={styles.muted}>
            Configure how you want to use Tosa components in your project.
          </p>

          <label className={styles.label}>Preferred Technology</label>

          <div className={styles.select}>
            <span>JavaScript — Frontend</span>
            <Icon name="down" size={14} />
          </div>

          <div className={styles.rowBetween} style={{ marginTop: 18 }}>
            <label className={styles.label} style={{ margin: 0 }}>
              Components Selected
            </label>

            <strong className={styles.amount}>24</strong>
          </div>
        </Card>

        {/* ===== QR ===== */}
        <Card className={`${styles.item} ${styles.center}`}>
          <div className={styles.qrBox}>
            <QR />
          </div>

          <h3 className={styles.cardTitle}>
            Scan to explore Tosa
          </h3>

          <p className={styles.muted}>
            Scan this code to open the Tosa documentation and component
            playground.
          </p>
        </Card>

        {/* ===== Chat ===== */}
        <Card className={styles.item}>
          <div className={styles.rowBetween}>
            <div>
              <h3 className={styles.cardTitle}>Tosa Assistant</h3>
              <p className={styles.muted}>
                Need help with a component?
              </p>
            </div>

            <button className={styles.roundBtn} aria-label="refresh">
              <Icon name="refresh" size={14} />
            </button>
          </div>

          <div className={styles.chatEmpty}>
            <div className={styles.chatIcon}>
              <Icon name="message" size={20} />
            </div>

            <strong>Build something with Tosa.</strong>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default Showcase;