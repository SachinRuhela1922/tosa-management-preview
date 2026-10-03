import { useRef, useState } from "react";
import Card from "../Card/Card";
import Icon from "../Icon/Icon";
import styles from "./Workflow.module.css";

const DURATION = 6000; // ms per step

const steps = [
  { key: "code", icon: "file", title: "Write", text: "Clean editor, instant feedback. Focus on the code, not the setup.", file: "App.jsx" },
  { key: "review", icon: "message", title: "Review", text: "Inline comments and suggestions so your team ships with confidence.", file: "Pull request #42" },
  { key: "test", icon: "activity", title: "Test", text: "Every push runs automated checks in parallel, in seconds.", file: "CI pipeline" },
  { key: "deploy", icon: "globe", title: "Deploy", text: "One click to production with zero downtime and instant rollbacks.", file: "Production" },
];

/* ---------- Panels ---------- */

const codeLines = [
  [["kw", "import"], ["", " { useState } "], ["kw", "from"], ["str", ' "react"']],
  [],
  [["kw", "export default function"], ["fn", " App"], ["", "() {"]],
  [["", "  "], ["kw", "const"], ["", " [count, setCount] = "], ["fn", "useState"], ["", "(0);"]],
  [],
  [["", "  "], ["kw", "return"], ["", " ("]],
  [["", "    <"], ["fn", "button"], ["", " onClick={() => "], ["fn", "setCount"], ["", "(count + 1)}>"]],
  [["", "      Stars: {count}"]],
  [["", "    </"], ["fn", "button"], ["", ">"]],
  [["", "  );"]],
  [["", "}"]],
];

const CodePanel = () => (
  <div className={styles.code}>
    {codeLines.map((line, i) => (
      <div key={i} className={styles.line} style={{ "--i": i }}>
        <span className={styles.ln}>{i + 1}</span>
        <span>
          {line.map(([c, t], j) => (
            <span key={j} className={styles[c]}>{t}</span>
          ))}
        </span>
      </div>
    ))}
    <span className={styles.caret} />
  </div>
);

const diff = [
  { t: "ctx", s: "function total(items) {" },
  { t: "del", s: "  return items.reduce((a, b) => a + b.price)" },
  { t: "add", s: "  return items.reduce((a, b) => a + b.price, 0)" },
  { t: "ctx", s: "}" },
];

const ReviewPanel = () => (
  <div className={styles.review}>
    {diff.map((d, i) => (
      <div key={i} className={`${styles.diff} ${styles[d.t]}`} style={{ "--i": i }}>
        <b>{d.t === "add" ? "+" : d.t === "del" ? "−" : " "}</b>
        <code>{d.s}</code>
      </div>
    ))}

    <div className={styles.comment}>
      <span className={styles.avatar}>A</span>
      <div>
        <strong>Aarav <small>just now</small></strong>
        <p>Nice catch, the initial value avoids a crash on empty carts. Approving.</p>
      </div>
    </div>

    <div className={styles.approve}>
      <Icon name="check" size={14} /> Approved
    </div>
  </div>
);

const checks = ["Install dependencies", "Lint & type check", "Unit tests (248)", "Build bundle"];

const TestPanel = () => (
  <div className={styles.tests}>
    {checks.map((c, i) => (
      <div key={c} className={styles.check} style={{ "--i": i }}>
        <span className={styles.status}>
          <i className={styles.spin} />
          <em className={styles.done}><Icon name="check" size={12} /></em>
        </span>
        <span>{c}</span>
        <small>{(0.8 + i * 0.7).toFixed(1)}s</small>
      </div>
    ))}
  </div>
);

const DeployPanel = () => (
  <div className={styles.deploy}>
    <div className={styles.deployTop}>
      <span>Deploying to production</span>
      <span className={styles.live}><i /> Live</span>
    </div>

    <div className={styles.track}>
      <span className={styles.fill} />
    </div>

    <div className={styles.url}>
      <Icon name="globe" size={15} /> my-app.vercel.app
    </div>

    <div className={styles.metrics}>
      {[["Build", "12s"], ["Regions", "24"], ["Uptime", "99.99%"]].map(([k, v], i) => (
        <div key={k} className={styles.metric} style={{ "--i": i }}>
          <small>{k}</small>
          <strong>{v}</strong>
        </div>
      ))}
    </div>
  </div>
);

const panels = { code: CodePanel, review: ReviewPanel, test: TestPanel, deploy: DeployPanel };

/* ---------- Feature cards ---------- */

const features = [
  { icon: "activity", title: "Zero config", text: "Sensible defaults out of the box. Start shipping in minutes, not days." },
  { icon: "globe", title: "Global edge network", text: "Your app is served from the location closest to every user." },
  { icon: "target", title: "Secure by default", text: "Automatic HTTPS, secret scanning and dependency alerts built in." },
];

/* ---------- Section ---------- */

const Workflow = () => {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const stageRef = useRef(null);

  const next = () => setActive((p) => (p + 1) % steps.length);

  // 3D tilt
  const onMove = (e) => {
    const el = stageRef.current;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--ry", `${x * 8}deg`);
    el.style.setProperty("--rx", `${-y * 8}deg`);
  };
  const onLeave = () => {
    stageRef.current.style.setProperty("--ry", "0deg");
    stageRef.current.style.setProperty("--rx", "0deg");
  };

  const Panel = panels[steps[active].key];

  return (
    <section className={styles.section}>
      <div className={styles.bg}>
        <i className={styles.orb1} />
        <i className={styles.orb2} />
      </div>

      <div className={styles.head}>
        <span className={styles.badge}>Workflow</span>
        <h2 className={styles.heading}>
          From idea to production, <br />
          <span>in one flow</span>
        </h2>
        <p className={styles.sub}>
          Four simple steps that take your code from your editor to millions of users.
        </p>
      </div>

      <div className={styles.layout}>
        {/* Steps */}
        <div
          className={styles.steps}
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          {steps.map((s, i) => (
            <button
              key={s.key}
              className={`${styles.step} ${i === active ? styles.stepActive : ""}`}
              onClick={() => setActive(i)}
            >
              <span className={styles.stepIcon}>
                <Icon name={s.icon} size={18} />
              </span>
              <span className={styles.stepBody}>
                <strong>
                  <em>0{i + 1}</em> {s.title}
                </strong>
                <span className={styles.stepText}>{s.text}</span>
              </span>

              {i === active && (
                <span className={styles.progress}>
                  <span
                    key={active}
                    className={styles.progressFill}
                    style={{
                      animationDuration: `${DURATION}ms`,
                      animationPlayState: paused ? "paused" : "running",
                    }}
                    onAnimationEnd={next}
                  />
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Stage */}
        <div
          className={styles.stage}
          ref={stageRef}
          onMouseMove={onMove}
          onMouseLeave={onLeave}
        >
          <div className={styles.window}>
            <div className={styles.winBar}>
              <span className={styles.winDots}><i /><i /><i /></span>
              <span className={styles.winTitle}>{steps[active].file}</span>
              <span className={styles.winSpacer} />
            </div>
            <div key={active} className={styles.winBody}>
              <Panel />
            </div>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className={styles.features}>
        {features.map((f) => (
          <Card key={f.title} className={styles.feature}>
            <span className={styles.fIcon}>
              <Icon name={f.icon} size={20} />
            </span>
            <h3>{f.title}</h3>
            <p>{f.text}</p>
            <span className={styles.more}>
              Learn more <Icon name="arrow" size={13} />
            </span>
          </Card>
        ))}
      </div>
    </section>
  );
};

export default Workflow;