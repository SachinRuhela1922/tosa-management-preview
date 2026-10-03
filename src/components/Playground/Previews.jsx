import { useEffect, useState } from "react";
import Icon from "../Icon/Icon";
import s from "./Previews.module.css";

/* 1. Navbar */
const NavbarP = () => {
  const [a, setA] = useState(0);
  return (
    <div className={s.navbar}>
      <b className={s.logo}>◆ Brand</b>
      <nav>
        {["Home", "About", "Work", "Contact"].map((l, i) => (
          <button key={l} className={a === i ? s.navOn : ""} onClick={() => setA(i)}>{l}</button>
        ))}
      </nav>
      <button className={s.solid}>Sign up</button>
    </div>
  );
};

/* 2. Buttons */
const ButtonP = () => {
  const [load, setLoad] = useState(false);
  const go = () => { setLoad(true); setTimeout(() => setLoad(false), 1800); };
  return (
    <div className={s.wrapRow}>
      <button className={s.solid}>Primary</button>
      <button className={s.soft}>Secondary</button>
      <button className={s.outline}>Outline</button>
      <button className={s.ghost}>Ghost</button>
      <button className={s.solid} onClick={go} disabled={load}>
        {load ? <i className={s.spinner} /> : <>Click me <Icon name="arrow" size={14} /></>}
      </button>
    </div>
  );
};

/* 3. Card */
const CardP = () => {
  const [liked, setLiked] = useState(false);
  return (
    <div className={s.pcard}>
      <div className={s.cover} />
      <div className={s.pcardBody}>
        <h4>Design System</h4>
        <p>Reusable blocks to ship faster with consistent UI.</p>
        <div className={s.rowBetween}>
          <button className={s.solid}>Open</button>
          <button className={`${s.heart} ${liked ? s.liked : ""}`} onClick={() => setLiked(!liked)}>♥</button>
        </div>
      </div>
    </div>
  );
};

/* 4. Modal */
const ModalP = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button className={s.solid} onClick={() => setOpen(true)}>Open modal</button>
      {open && (
        <div className={s.overlay} onClick={() => setOpen(false)}>
          <div className={s.modal} onClick={(e) => e.stopPropagation()}>
            <button className={s.x} onClick={() => setOpen(false)}><Icon name="close" size={14} /></button>
            <span className={s.bigIcon}><Icon name="check" size={20} /></span>
            <h4>Changes saved</h4>
            <p>Your project has been updated successfully.</p>
            <button className={s.solid} onClick={() => setOpen(false)}>Done</button>
          </div>
        </div>
      )}
    </>
  );
};

/* 5. Tabs */
const TabsP = () => {
  const [t, setT] = useState(0);
  const tabs = ["Overview", "Analytics", "Reports"];
  const text = ["A quick summary of everything.", "Deep dive into your numbers.", "Export and share reports."];
  return (
    <div className={s.tabsBox}>
      <div className={s.tabList}>
        <span className={s.pill} style={{ transform: `translateX(${t * 100}%)` }} />
        {tabs.map((x, i) => (
          <button key={x} className={t === i ? s.tabOn : ""} onClick={() => setT(i)}>{x}</button>
        ))}
      </div>
      <p key={t} className={s.fade}>{text[t]}</p>
    </div>
  );
};

/* 6. Accordion */
const AccordionP = () => {
  const [o, setO] = useState(0);
  const data = [
    ["What is included?", "Every plan includes unlimited projects and updates."],
    ["Can I cancel anytime?", "Yes, cancel in one click. No hidden fees."],
    ["Do you offer support?", "24/7 chat support with real humans."],
  ];
  return (
    <div className={s.acc}>
      {data.map(([q, a], i) => (
        <div key={q} className={`${s.accItem} ${o === i ? s.accOpen : ""}`}>
          <button onClick={() => setO(o === i ? -1 : i)}>
            {q} <Icon name="down" size={15} />
          </button>
          <div className={s.accBody}><p>{a}</p></div>
        </div>
      ))}
    </div>
  );
};

/* 7. Switch */
const SwitchP = () => {
  const [v, setV] = useState([true, false, true]);
  const names = ["Notifications", "Dark mode", "Auto save"];
  return (
    <div className={s.list}>
      {names.map((n, i) => (
        <div key={n} className={s.rowBetween}>
          <span>{n}</span>
          <button
            className={`${s.switch} ${v[i] ? s.switchOn : ""}`}
            onClick={() => setV(v.map((x, j) => (j === i ? !x : x)))}
          ><i /></button>
        </div>
      ))}
    </div>
  );
};

/* 8. Badge */
const BadgeP = () => (
  <div className={s.wrapRow}>
    <span className={`${s.badge} ${s.bSolid}`}>New</span>
    <span className={`${s.badge} ${s.bBlue}`}>Beta</span>
    <span className={`${s.badge} ${s.bGreen}`}><i /> Online</span>
    <span className={`${s.badge} ${s.bRed}`}>Urgent</span>
    <span className={`${s.badge} ${s.bOutline}`}>v2.4.0</span>
  </div>
);

/* 9. Avatar group */
const AvatarP = () => (
  <div className={s.avatars}>
    {["A", "R", "S", "K", "M"].map((c, i) => (
      <span key={c} style={{ "--h": i * 60 + 200 }}>{c}</span>
    ))}
    <span className={s.more}>+5</span>
  </div>
);

/* 10. Progress */
const ProgressP = () => {
  const [v, setV] = useState([72, 45, 90]);
  const names = ["Design", "Frontend", "Backend"];
  return (
    <div className={s.list}>
      {names.map((n, i) => (
        <div key={n}>
          <div className={s.rowBetween}><span>{n}</span><b>{v[i]}%</b></div>
          <div className={s.track}><span style={{ width: `${v[i]}%` }} /></div>
        </div>
      ))}
      <button className={s.outline} onClick={() => setV(v.map(() => Math.floor(Math.random() * 100)))}>
        Randomize
      </button>
    </div>
  );
};

/* 11. Toast */
const ToastP = () => {
  const [t, setT] = useState([]);
  const add = () => {
    const id = Date.now();
    setT((p) => [...p, id]);
    setTimeout(() => setT((p) => p.filter((x) => x !== id)), 2600);
  };
  return (
    <>
      <button className={s.solid} onClick={add}>Show toast</button>
      <div className={s.toasts}>
        {t.map((id) => (
          <div key={id} className={s.toast}>
            <span><Icon name="check" size={11} /></span> Saved successfully
          </div>
        ))}
      </div>
    </>
  );
};

/* 12. Tooltip */
const TooltipP = () => (
  <div className={s.wrapRow}>
    {["Top", "Info", "Help"].map((x) => (
      <button key={x} className={`${s.outline} ${s.tipWrap}`}>
        {x}
        <em className={s.tip}>Tooltip for {x}</em>
      </button>
    ))}
  </div>
);

/* 13. Dropdown */
const DropdownP = () => {
  const [o, setO] = useState(false);
  const [v, setV] = useState("Select option");
  return (
    <div className={s.dd}>
      <button className={s.select} onClick={() => setO(!o)}>
        {v} <Icon name="down" size={14} />
      </button>
      {o && (
        <ul>
          {["Profile", "Settings", "Billing", "Sign out"].map((x, i) => (
            <li key={x} style={{ "--i": i }} onClick={() => { setV(x); setO(false); }}>{x}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

/* 14. Pagination */
const PaginationP = () => {
  const [p, setP] = useState(3);
  return (
    <div className={s.pager}>
      <button onClick={() => setP(Math.max(1, p - 1))}>←</button>
      {[1, 2, 3, 4, 5, 6, 7].map((n) => (
        <button key={n} className={p === n ? s.pageOn : ""} onClick={() => setP(n)}>{n}</button>
      ))}
      <button onClick={() => setP(Math.min(7, p + 1))}>→</button>
    </div>
  );
};

/* 15. Breadcrumb */
const BreadcrumbP = () => (
  <div className={s.crumbs}>
    {["Home", "Projects", "Dashboard", "Settings"].map((x, i, a) => (
      <span key={x}>
        <a className={i === a.length - 1 ? s.crumbNow : ""}>{x}</a>
        {i < a.length - 1 && <i>/</i>}
      </span>
    ))}
  </div>
);

/* 16. Stepper */
const StepperP = () => {
  const [st, setSt] = useState(1);
  const steps = ["Account", "Profile", "Plan", "Done"];
  return (
    <div className={s.stepper}>
      <div className={s.steps}>
        {steps.map((x, i) => (
          <div key={x} className={`${s.step} ${i <= st ? s.stepOn : ""}`}>
            <span>{i < st ? <Icon name="check" size={13} /> : i + 1}</span>
            <small>{x}</small>
          </div>
        ))}
        <div className={s.line}><i style={{ width: `${(st / (steps.length - 1)) * 100}%` }} /></div>
      </div>
      <div className={s.wrapRow}>
        <button className={s.outline} onClick={() => setSt(Math.max(0, st - 1))}>Back</button>
        <button className={s.solid} onClick={() => setSt(Math.min(3, st + 1))}>Next</button>
      </div>
    </div>
  );
};

/* 17. Skeleton */
const SkeletonP = () => (
  <div className={s.skel}>
    <i className={s.sCircle} />
    <div>
      <i style={{ width: "70%" }} />
      <i style={{ width: "45%" }} />
    </div>
    <i className={s.sBlock} />
    <i style={{ width: "90%" }} />
    <i style={{ width: "60%" }} />
  </div>
);

/* 18. Alert */
const AlertP = () => {
  const all = [
    ["info", "New update available."],
    ["ok", "Payment completed."],
    ["warn", "Storage almost full."],
    ["err", "Connection failed."],
  ];
  const [list, setList] = useState(all);
  return (
    <div className={s.list}>
      {list.map(([t, m]) => (
        <div key={t} className={`${s.alert} ${s["a_" + t]}`}>
          <i /> <span>{m}</span>
          <button onClick={() => setList(list.filter((x) => x[0] !== t))}><Icon name="close" size={12} /></button>
        </div>
      ))}
      {!list.length && <button className={s.outline} onClick={() => setList(all)}>Reset alerts</button>}
    </div>
  );
};

/* 19. Input */
const InputP = () => (
  <div className={s.list}>
    <div className={s.float}>
      <input placeholder=" " id="p1" />
      <label htmlFor="p1">Full name</label>
    </div>
    <div className={s.float}>
      <input placeholder=" " id="p2" type="email" />
      <label htmlFor="p2">Email address</label>
    </div>
    <button className={s.solid}>Submit</button>
  </div>
);

/* 20. Rating */
const RatingP = () => {
  const [v, setV] = useState(3);
  const [h, setH] = useState(0);
  return (
    <div className={s.rating}>
      <div onMouseLeave={() => setH(0)}>
        {[1, 2, 3, 4, 5].map((n) => (
          <button
            key={n}
            className={(h || v) >= n ? s.starOn : ""}
            onMouseEnter={() => setH(n)}
            onClick={() => setV(n)}
          >★</button>
        ))}
      </div>
      <p>{["", "Poor", "Fair", "Good", "Great", "Excellent"][h || v]}</p>
    </div>
  );
};

/* ---------- registry ---------- */
export const items = [
  { id: "navbar", name: "Navbar", cat: "Navigation", icon: "globe", tags: "menu header nav top", desc: "Top bar with animated active link.", C: NavbarP },
  { id: "button", name: "Button", cat: "Actions", icon: "arrow", tags: "btn click loading", desc: "Variants plus a loading state.", C: ButtonP },
  { id: "card", name: "Card", cat: "Display", icon: "file", tags: "tile box product", desc: "Hover lift card with like button.", C: CardP },
  { id: "modal", name: "Modal", cat: "Overlay", icon: "message", tags: "dialog popup alert", desc: "Dialog with backdrop and pop animation.", C: ModalP },
  { id: "tabs", name: "Tabs", cat: "Navigation", icon: "book", tags: "tab switch segmented", desc: "Sliding pill indicator.", C: TabsP },
  { id: "accordion", name: "Accordion", cat: "Display", icon: "down", tags: "faq collapse", desc: "Smooth expand and collapse.", C: AccordionP },
  { id: "switch", name: "Switch", cat: "Form", icon: "activity", tags: "toggle checkbox", desc: "Toggle switches with spring feel.", C: SwitchP },
  { id: "badge", name: "Badge", cat: "Display", icon: "target", tags: "tag label chip status", desc: "Status and label pills.", C: BadgeP },
  { id: "avatar", name: "Avatar Group", cat: "Display", icon: "globe", tags: "user profile people", desc: "Stacked avatars that pop on hover.", C: AvatarP },
  { id: "progress", name: "Progress Bar", cat: "Feedback", icon: "chart", tags: "loader percent", desc: "Animated bars, click randomize.", C: ProgressP },
  { id: "toast", name: "Toast", cat: "Feedback", icon: "check", tags: "notification snackbar", desc: "Stacked toasts that auto dismiss.", C: ToastP },
  { id: "tooltip", name: "Tooltip", cat: "Overlay", icon: "help", tags: "hint hover", desc: "Hover hint bubbles.", C: TooltipP },
  { id: "dropdown", name: "Dropdown", cat: "Form", icon: "down", tags: "select menu options", desc: "Menu with staggered items.", C: DropdownP },
  { id: "pagination", name: "Pagination", cat: "Navigation", icon: "calendar", tags: "pages next prev", desc: "Page controls with active state.", C: PaginationP },
  { id: "breadcrumb", name: "Breadcrumb", cat: "Navigation", icon: "arrow", tags: "path trail", desc: "Location trail with hover underline.", C: BreadcrumbP },
  { id: "stepper", name: "Stepper", cat: "Feedback", icon: "target", tags: "wizard steps progress", desc: "Multi step flow with filling line.", C: StepperP },
  { id: "skeleton", name: "Skeleton", cat: "Feedback", icon: "refresh", tags: "loading shimmer placeholder", desc: "Shimmer loading placeholder.", C: SkeletonP },
  { id: "alert", name: "Alert", cat: "Feedback", icon: "help", tags: "banner warning error", desc: "Dismissible colored alerts.", C: AlertP },
  { id: "input", name: "Input", cat: "Form", icon: "search", tags: "field text floating label", desc: "Floating label text fields.", C: InputP },
  { id: "rating", name: "Rating", cat: "Form", icon: "wallet", tags: "star review", desc: "Interactive star rating.", C: RatingP },
];