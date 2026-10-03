import { useEffect, useRef, useState } from "react";
import Card from "../Card/Card";
import Icon from "../Icon/Icon";
import styles from "./Studio.module.css";

const fmt = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

/* ================= Kanban ================= */

const initial = {
  todo: [
    { id: 1, t: "Explore Tosa components", tag: "Components" },
    { id: 2, t: "Read component docs", tag: "Docs" },
    { id: 3, t: "Setup Tosa package", tag: "Setup" },
  ],
  doing: [
    { id: 4, t: "Build with Tosa UI", tag: "Dev" },
    { id: 5, t: "Customize components", tag: "UI" },
  ],
  done: [{ id: 6, t: "Install Tosa locally", tag: "Done" }],
};

const cols = [
  ["todo", "To do"],
  ["doing", "In progress"],
  ["done", "Done"],
];

const Kanban = () => {
  const [board, setBoard] = useState(initial);
  const [text, setText] = useState("");
  const [dragId, setDragId] = useState(null);
  const [over, setOver] = useState(null);
  const nextId = useRef(100);

  const total = Object.values(board).flat().length;
  const pct = Math.round((board.done.length / total) * 100) || 0;

  const move = (id, to) =>
    setBoard((prev) => {
      let card;
      const next = {};

      for (const k in prev) {
        next[k] = prev[k].filter((c) => {
          if (c.id === id) {
            card = c;
            return false;
          }
          return true;
        });
      }

      if (!card) return prev;
      next[to] = [...next[to], card];
      return next;
    });

  const add = () => {
    const t = text.trim();
    if (!t) return;

    setBoard((p) => ({
      ...p,
      todo: [
        ...p.todo,
        { id: nextId.current++, t, tag: "New" },
      ],
    }));

    setText("");
  };

  return (
    <Card className={styles.kanban}>
      <div className={styles.rowBetween}>
        <div>
          <h3 className={styles.title}>Tosa Project Board</h3>
          <p className={styles.muted}>
            Drag Tosa development tasks between columns.
          </p>
        </div>

        <div className={styles.ringSmall} style={{ "--p": pct }}>
          <span>{pct}%</span>
        </div>
      </div>

      <div className={styles.addRow}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="Add a new Tosa task and press Enter..."
        />
        <button onClick={add}>Add</button>
      </div>

      <div className={styles.board}>
        {cols.map(([key, label], ci) => (
          <div
            key={key}
            className={`${styles.col} ${over === key ? styles.over : ""}`}
            onDragOver={(e) => {
              e.preventDefault();
              setOver(key);
            }}
            onDragLeave={() => setOver(null)}
            onDrop={() => {
              if (dragId) move(dragId, key);
              setDragId(null);
              setOver(null);
            }}
          >
            <div className={styles.colHead}>
              <span>{label}</span>
              <em>{board[key].length}</em>
            </div>

            {board[key].map((c) => (
              <div
                key={c.id}
                draggable
                onDragStart={() => setDragId(c.id)}
                onDragEnd={() => {
                  setDragId(null);
                  setOver(null);
                }}
                className={`${styles.task} ${
                  dragId === c.id ? styles.dragging : ""
                }`}
              >
                <p>{c.t}</p>

                <div className={styles.taskFoot}>
                  <span className={styles.chip}>{c.tag}</span>

                  {ci < 2 ? (
                    <button
                      onClick={() =>
                        move(c.id, cols[ci + 1][0])
                      }
                      aria-label="move next"
                    >
                      <Icon name="arrow" size={13} />
                    </button>
                  ) : (
                    <span className={styles.tick}>
                      <Icon name="check" size={12} />
                    </span>
                  )}
                </div>
              </div>
            ))}

            {!board[key].length && (
              <div className={styles.drop}>Drop here</div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

/* ================= Timer ================= */

const modes = { Focus: 25 * 60, Break: 5 * 60 };
const R = 54;
const C = 2 * Math.PI * R;

const Timer = () => {
  const [mode, setMode] = useState("Focus");
  const [left, setLeft] = useState(modes.Focus);
  const [run, setRun] = useState(false);

  useEffect(() => {
    if (!run) return;

    const t = setInterval(
      () =>
        setLeft((p) => {
          if (p <= 1) {
            setRun(false);
            return 0;
          }
          return p - 1;
        }),
      1000
    );

    return () => clearInterval(t);
  }, [run]);

  const change = (m) => {
    setMode(m);
    setLeft(modes[m]);
    setRun(false);
  };

  return (
    <Card className={styles.timer}>
      <div className={styles.seg}>
        {Object.keys(modes).map((m) => (
          <button
            key={m}
            className={mode === m ? styles.segOn : ""}
            onClick={() => change(m)}
          >
            {m}
          </button>
        ))}
      </div>

      <div className={styles.clock}>
        <svg viewBox="0 0 128 128">
          <circle
            cx="64"
            cy="64"
            r={R}
            className={styles.trackC}
          />

          <circle
            cx="64"
            cy="64"
            r={R}
            className={styles.fillC}
            strokeDasharray={C}
            strokeDashoffset={
              C * (1 - left / modes[mode])
            }
            transform="rotate(-90 64 64)"
          />
        </svg>

        <div className={styles.time}>
          <strong>{fmt(left)}</strong>
          <small>
            {left === 0
              ? "Finished!"
              : run
                ? "Keep building"
                : "Ready"}
          </small>
        </div>
      </div>

      <div className={styles.ctrl}>
        <button
          className={styles.round}
          onClick={() => change(mode)}
          aria-label="reset"
        >
          <Icon name="refresh" size={15} />
        </button>

        <button
          className={styles.play}
          onClick={() => setRun(!run)}
        >
          {run ? "Pause" : "Start"}
        </button>
      </div>
    </Card>
  );
};

/* ================= Music ================= */

const tracks = [
  { t: "Code Mode", a: "Tosa Studio", d: 184, h: 260 },
  { t: "Deep Focus", a: "Tosa Sounds", d: 212, h: 190 },
  { t: "Build Flow", a: "Developer Mix", d: 167, h: 330 },
];

const Music = () => {
  const [i, setI] = useState(0);
  const [play, setPlay] = useState(false);
  const [pos, setPos] = useState(0);
  const tr = tracks[i];

  useEffect(() => {
    if (!play) return;

    const t = setInterval(() => setPos((p) => p + 1), 1000);

    return () => clearInterval(t);
  }, [play]);

  useEffect(() => {
    if (pos >= tr.d) {
      setI((p) => (p + 1) % tracks.length);
      setPos(0);
    }
  }, [pos, tr.d]);

  const go = (dir) => {
    setI((p) => (p + dir + tracks.length) % tracks.length);
    setPos(0);
  };

  return (
    <Card className={styles.music}>
      <div
        className={`${styles.cover} ${play ? styles.spin : ""}`}
        style={{ "--h": tr.h }}
      >
        <div className={styles.eq}>
          {[0, 1, 2, 3, 4].map((n) => (
            <i
              key={n}
              className={play ? styles.eqOn : ""}
              style={{ "--d": `${n * 0.13}s` }}
            />
          ))}
        </div>
      </div>

      <div key={i} className={styles.meta}>
        <strong>{tr.t}</strong>
        <small>{tr.a}</small>
      </div>

      <div className={styles.bar}>
        <span style={{ width: `${(pos / tr.d) * 100}%` }} />
      </div>

      <div className={styles.times}>
        <small>{fmt(pos)}</small>
        <small>{fmt(tr.d)}</small>
      </div>

      <div className={styles.ctrl}>
        <button
          className={styles.round}
          onClick={() => go(-1)}
          aria-label="previous"
        >
          ‹
        </button>

        <button
          className={styles.play}
          onClick={() => setPlay(!play)}
        >
          {play ? "Pause" : "Play"}
        </button>

        <button
          className={styles.round}
          onClick={() => go(1)}
          aria-label="next"
        >
          ›
        </button>
      </div>
    </Card>
  );
};

/* ================= Calendar ================= */

const events = {
  3: ["Component review", "10:00 AM"],
  8: ["Tosa team sync", "09:30 AM"],
  12: ["Release planning", "02:00 PM"],
  17: ["Documentation update", "04:30 PM"],
  21: ["Sprint planning", "11:00 AM"],
  26: ["Tosa component release", "06:00 PM"],
};

const Calendar = () => {
  const today = new Date();
  const [off, setOff] = useState(0);
  const [sel, setSel] = useState(today.getDate());

  const d = new Date(
    today.getFullYear(),
    today.getMonth() + off,
    1
  );

  const first = d.getDay();
  const days = new Date(
    d.getFullYear(),
    d.getMonth() + 1,
    0
  ).getDate();

  const isNow = off === 0;
  const ev = events[sel];

  return (
    <Card className={styles.calendar}>
      <div className={styles.rowBetween}>
        <h3 className={styles.title}>
          {d.toLocaleString("en", { month: "long" })}{" "}
          <span>{d.getFullYear()}</span>
        </h3>

        <div className={styles.nav}>
          <button
            onClick={() => setOff(off - 1)}
            aria-label="prev month"
          >
            ‹
          </button>

          <button
            onClick={() => setOff(off + 1)}
            aria-label="next month"
          >
            ›
          </button>
        </div>
      </div>

      <div className={styles.week}>
        {["S", "M", "T", "W", "T", "F", "S"].map((x, i) => (
          <span key={i}>{x}</span>
        ))}
      </div>

      <div className={styles.days}>
        {Array.from({ length: first }, (_, i) => (
          <i key={"b" + i} />
        ))}

        {Array.from({ length: days }, (_, i) => {
          const n = i + 1;

          return (
            <button
              key={n}
              onClick={() => setSel(n)}
              className={`${sel === n ? styles.sel : ""} ${
                isNow && n === today.getDate()
                  ? styles.today
                  : ""
              }`}
            >
              {n}
              {events[n] && <b />}
            </button>
          );
        })}
      </div>

      <div
        key={`${off}-${sel}`}
        className={styles.event}
      >
        {ev ? (
          <>
            <span className={styles.evBar} />

            <div>
              <strong>{ev[0]}</strong>
              <small>{ev[1]}</small>
            </div>
          </>
        ) : (
          <small>No Tosa events on this day.</small>
        )}
      </div>
    </Card>
  );
};

/* ================= Personalize ================= */

const accents = [
  ["Blue", 212],
  ["Purple", 270],
  ["Green", 145],
  ["Orange", 28],
  ["Pink", 335],
];

const team = [
  ["T", 210],
  ["O", 330],
  ["S", 150],
  ["A", 30],
];

const Personalize = ({ hue, setHue }) => (
  <Card className={styles.person}>
    <h3 className={styles.title}>Customize Tosa</h3>

    <p className={styles.muted}>
      Choose an accent color and personalize your Tosa workspace.
    </p>

    <div className={styles.swatches}>
      {accents.map(([name, h]) => (
        <button
          key={name}
          title={name}
          aria-label={name}
          className={hue === h ? styles.swOn : ""}
          style={{ "--c": `hsl(${h} 85% 60%)` }}
          onClick={() => setHue(h)}
        >
          {hue === h && <Icon name="check" size={13} />}
        </button>
      ))}
    </div>

    <div className={styles.line} />

    <p className={styles.muted}>Tosa community</p>

    <div className={styles.team}>
      {team.map(([c, h]) => (
        <span key={c} style={{ "--h": h }}>
          {c}
          <i />
        </span>
      ))}

      <em>+3</em>
    </div>
  </Card>
);

/* ================= Section ================= */

const Studio = () => {
  const [hue, setHue] = useState(212);

  return (
    <section
      className={styles.section}
      style={{ "--hue": hue }}
    >
      <i className={styles.orb} />

      <div className={styles.head}>
        <span className={styles.badge}>
          <i /> Tosa Interactive Studio
        </span>

        <h2>
          Build with Tosa, <span>fully interactive</span>
        </h2>

        <p>
          Explore Tosa components, developer tools and interactive
          features. Drag, play, choose and customize.
        </p>
      </div>

      <div className={styles.grid}>
        <Kanban />
        <Timer />
        <Music />
        <Calendar />
        <Personalize hue={hue} setHue={setHue} />
      </div>
    </section>
  );
};

export default Studio;