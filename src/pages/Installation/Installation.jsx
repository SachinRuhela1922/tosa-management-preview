import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./installation.module.css";

/* ====== EDIT THESE: apni real package details yahan daalo ====== */
const PKG = "tosa";
const REPO = "https://github.com/your-org/tosa";

const LANGS = [
  { id: "js", name: "JavaScript / TypeScript", ico: "🟨", note: "Node 18+, browsers, Bun, Deno",
    installs: { npm: `npm install ${PKG}`, yarn: `yarn add ${PKG}`, pnpm: `pnpm add ${PKG}`, bun: `bun add ${PKG}` },
    file: "index.ts", use: `import { Tosa } from "${PKG}";\n\nconst app = new Tosa({ apiKey: process.env.TOSA_KEY });\nconst res = await app.run("hello");\nconsole.log(res);` },
  { id: "py", name: "Python", ico: "🐍", note: "Python 3.9+",
    installs: { pip: `pip install ${PKG}`, uv: `uv add ${PKG}`, poetry: `poetry add ${PKG}`, conda: `conda install -c conda-forge ${PKG}` },
    file: "main.py", use: `from ${PKG} import Tosa\n\napp = Tosa(api_key="YOUR_KEY")\nprint(app.run("hello"))` },
  { id: "go", name: "Go", ico: "🐹", note: "Go 1.21+",
    installs: { "go get": `go get github.com/your-org/${PKG}@latest` },
    file: "main.go", use: `package main\n\nimport "github.com/your-org/${PKG}"\n\nfunc main() {\n  c := ${PKG}.New("YOUR_KEY")\n  c.Run("hello")\n}` },
  { id: "rs", name: "Rust", ico: "🦀", note: "Rust 1.75+",
    installs: { cargo: `cargo add ${PKG}` },
    file: "main.rs", use: `use ${PKG}::Tosa;\n\nfn main() {\n    let app = Tosa::new("YOUR_KEY");\n    println!("{:?}", app.run("hello"));\n}` },
  { id: "java", name: "Java", ico: "☕", note: "JDK 11+",
    installs: { maven: `<dependency>\n  <groupId>com.yourorg</groupId>\n  <artifactId>${PKG}</artifactId>\n  <version>LATEST</version>\n</dependency>`, gradle: `implementation("com.yourorg:${PKG}:LATEST")` },
    file: "Main.java", use: `Tosa app = new Tosa("YOUR_KEY");\nSystem.out.println(app.run("hello"));` },
  { id: "kt", name: "Kotlin / Android", ico: "🤖", note: "Gradle",
    installs: { gradle: `implementation("com.yourorg:${PKG}:LATEST")` },
    file: "Main.kt", use: `val app = Tosa("YOUR_KEY")\nprintln(app.run("hello"))` },
  { id: "cs", name: "C# / .NET", ico: "🟣", note: ".NET 6+",
    installs: { dotnet: `dotnet add package ${PKG}`, nuget: `Install-Package ${PKG}` },
    file: "Program.cs", use: `var app = new Tosa("YOUR_KEY");\nConsole.WriteLine(await app.RunAsync("hello"));` },
  { id: "php", name: "PHP", ico: "🐘", note: "PHP 8.1+",
    installs: { composer: `composer require your-org/${PKG}` },
    file: "index.php", use: `<?php\nrequire "vendor/autoload.php";\n$app = new Tosa\\Client("YOUR_KEY");\necho $app->run("hello");` },
  { id: "rb", name: "Ruby", ico: "💎", note: "Ruby 3.0+",
    installs: { gem: `gem install ${PKG}`, bundler: `bundle add ${PKG}` },
    file: "app.rb", use: `require "${PKG}"\n\napp = Tosa::Client.new(api_key: "YOUR_KEY")\nputs app.run("hello")` },
  { id: "swift", name: "Swift / iOS", ico: "🍎", note: "Swift 5.9+",
    installs: { SPM: `.package(url: "${REPO}", from: "1.0.0")`, cocoapods: `pod '${PKG}'` },
    file: "App.swift", use: `import Tosa\n\nlet app = Tosa(apiKey: "YOUR_KEY")\nprint(try await app.run("hello"))` },
  { id: "dart", name: "Dart / Flutter", ico: "🎯", note: "Dart 3+",
    installs: { flutter: `flutter pub add ${PKG}`, dart: `dart pub add ${PKG}` },
    file: "main.dart", use: `import 'package:${PKG}/${PKG}.dart';\n\nfinal app = Tosa('YOUR_KEY');\nprint(await app.run('hello'));` },
  { id: "cpp", name: "C / C++", ico: "⚙️", note: "CMake / vcpkg / conan",
    installs: { vcpkg: `vcpkg install ${PKG}`, conan: `conan install --requires=${PKG}/latest`, cmake: `git clone ${REPO}\ncd ${PKG} && cmake -B build && cmake --build build && sudo cmake --install build` },
    file: "main.cpp", use: `#include <${PKG}/${PKG}.hpp>\n\nint main() {\n  ${PKG}::Client c("YOUR_KEY");\n  c.run("hello");\n}` },
  { id: "ex", name: "Elixir", ico: "💧", note: "mix.exs",
    installs: { mix: `{:${PKG}, "~> 1.0"}` },
    file: "mix.exs", use: `{:ok, res} = Tosa.run("hello")\nIO.inspect(res)` },
  { id: "sh", name: "CLI / Docker", ico: "🐳", note: "Linux, macOS, Windows",
    installs: { curl: `curl -fsSL ${REPO}/raw/main/install.sh | sh`, brew: `brew install ${PKG}`, docker: `docker pull your-org/${PKG}:latest`, winget: `winget install ${PKG}` },
    file: "terminal", use: `${PKG} --version\n${PKG} init my-project\ncd my-project && ${PKG} dev` },
];

const NAV = [["start", "🚀", "Quick start"], ["langs", "🌍", "Languages"], ["steps", "🧭", "Setup steps"], ["cdn", "🔌", "Copy-paste"], ["faq", "💬", "FAQ"]];

const CDN = {
  HTML: `<script src="https://cdn.jsdelivr.net/npm/${PKG}"></script>\n<script>\n  const app = new Tosa();\n</script>`,
  React: `import { TosaProvider } from "${PKG}/react";\n\nexport default function App() {\n  return <TosaProvider><Home /></TosaProvider>;\n}`,
  "Next.js": `// app/layout.tsx\nimport { TosaProvider } from "${PKG}/react";\n\nexport default function Root({ children }) {\n  return <TosaProvider>{children}</TosaProvider>;\n}`,
  Vue: `import { createApp } from "vue";\nimport Tosa from "${PKG}/vue";\n\ncreateApp(App).use(Tosa).mount("#app");`,
};

const STEPS = [
  ["Install the package", "Apni language ka package manager chuno aur command copy-paste karo."],
  ["Set your API key", `.env me TOSA_KEY=xxxx daalo. Key ko kabhi git me commit mat karo.`],
  ["Initialize", "Client create karo aur pehla request chalao."],
  ["Verify", `Terminal me \`${PKG} --version\` chalao. Version dikhe to setup ready hai.`],
];

const FAQ = [
  ["Kaunse versions supported hain?", "Har language section me minimum version likha hai. Latest LTS use karna best hai."],
  ["Install fail ho raha hai, kya karu?", "Cache clear karo, package manager update karo, aur check karo ki network/proxy block to nahi kar raha."],
  ["Kya offline install possible hai?", "Haan, package ko ek baar download karke local mirror ya vendor folder se install kar sakte ho."],
];

function useCopy() {
  const [k, setK] = useState(null);
  const copy = async (text, key) => {
    try { await navigator.clipboard.writeText(text); } catch {}
    setK(key); setTimeout(() => setK(null), 1600);
  };
  return [k, copy];
}

function Reveal({ children, className = "", as: T = "div", ...p }) {
  const ref = useRef(null);
  const [on, setOn] = useState(false);
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => e.isIntersecting && (setOn(true), io.disconnect()), { threshold: 0.12 });
    ref.current && io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  return <T ref={ref} className={`${styles.reveal} ${on ? styles.in : ""} ${className}`} {...p}>{children}</T>;
}

function Tabs({ items, value, onChange }) {
  const i = Math.max(0, items.indexOf(value));
  return (
    <div className={styles.tabs} style={{ "--n": items.length, "--i": i }}>
      <i />
      {items.map((t) => (
        <button key={t} className={t === value ? styles.tabOn : ""} onClick={() => onChange(t)}>{t}</button>
      ))}
    </div>
  );
}

function Code({ file, code, id, copied, onCopy }) {
  return (
    <div className={styles.code}>
      <div className={styles.codeBar}>
        <div className={styles.lights}><i /><i /><i /></div>
        <span className={styles.file}>{file}</span>
        <button className={copied === id ? styles.done : ""} onClick={() => onCopy(code, id)}>{copied === id ? "Copied ✓" : "Copy"}</button>
      </div>
      <pre key={code}><code>{code}</code></pre>
    </div>
  );
}

function Cube({ rig }) {
  return (
    <div className={styles.scene} onMouseMove={(e) => {
      const r = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      rig.current.style.transform = `rotateX(${-y * 30}deg) rotateY(${x * 40}deg)`;
    }} onMouseLeave={() => (rig.current.style.transform = "")}>
      <div ref={rig} className={styles.rig}>
        <div className={styles.orbit + " " + styles.o1}><b /></div>
        <div className={styles.orbit + " " + styles.o2}><b /></div>
        <div className={styles.cube}>
          {["f1", "f2", "f3", "f4", "f5", "f6"].map((f) => <div key={f} className={`${styles.face} ${styles[f]}`}>{PKG}</div>)}
          <div className={styles.core} />
        </div>
      </div>
    </div>
  );
}

export default function Installation() {
  const [lang, setLang] = useState(LANGS[0]);
  const [mgr, setMgr] = useState(Object.keys(LANGS[0].installs)[0]);
  const [q, setQ] = useState("");
  const [cdn, setCdn] = useState("HTML");
  const [open, setOpen] = useState(0);
  const [active, setActive] = useState("start");
  const [progress, setProgress] = useState(0);
  const [copied, copy] = useCopy();
  const rig = useRef(null);

  const list = useMemo(() => LANGS.filter((l) => (l.name + l.note).toLowerCase().includes(q.toLowerCase())), [q]);
  const managers = Object.keys(lang.installs);
  const curMgr = managers.includes(mgr) ? mgr : managers[0];

  const pick = (l) => { setLang(l); setMgr(Object.keys(l.installs)[0]); };
  const go = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const spot = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
  };

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      setProgress(h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: "-30% 0px -60% 0px" });
    NAV.forEach(([id]) => { const el = document.getElementById(id); el && io.observe(el); });
    return () => { window.removeEventListener("scroll", onScroll); io.disconnect(); };
  }, []);

  return (
    <div className={styles.page}>
      <div className={styles.bar} style={{ transform: `scaleX(${progress})` }} />
      <div className={styles.aurora} />

      <header className={styles.hero}>
        <div className={styles.heroText}>
          <span className={styles.pill}><i /> Works with {LANGS.length}+ languages</span>
          <h1>Install <span className={styles.grad}>{PKG}</span> anywhere.</h1>
          <p>Ek command, har language. Apna stack chuno, command copy karo, aur 60 seconds me chalu ho jao.</p>
          <div className={styles.cta}>
            <button className={styles.primary} onClick={() => copy(LANGS[0].installs.npm, "hero")}>
              {copied === "hero" ? "Copied ✓" : `$ npm i ${PKG}`}
            </button>
            <button className={styles.ghost} onClick={() => go("langs")}>Browse languages →</button>
          </div>
        </div>
        <Cube rig={rig} />
      </header>

      <div className={styles.shell}>
        <aside className={styles.side}>
          <p className={styles.sideTitle}>On this page</p>
          <nav className={styles.sideList}>
            {NAV.map(([id, ico, label]) => (
              <button key={id} className={`${styles.sideItem} ${active === id ? styles.sideOn : ""}`} onClick={() => go(id)}>
                <span>{ico}</span>{label}
              </button>
            ))}
          </nav>
        </aside>

        <main className={styles.main}>
          <Reveal as="section" id="start" className={styles.sec}>
            <div className={styles.secHead}>
              <div className={styles.secIco}>🚀</div>
              <div><h2>Quick start</h2><p>Sabse popular tareeke se install karo.</p></div>
            </div>
            <Tabs items={["npm", "pip", "cargo", "go get"]} value={mgr} onChange={(t) => { setMgr(t); }} />
            <Code id="qs" file="terminal" copied={copied} onCopy={copy}
              code={{ npm: `npm install ${PKG}`, pip: `pip install ${PKG}`, cargo: `cargo add ${PKG}`, "go get": `go get github.com/your-org/${PKG}` }[mgr] || `npm install ${PKG}`} />
            <div className={styles.callout}>
              <span>💡</span>
              <div><b>Tip</b><p>Neeche har language ke liye full install + usage code milega, copy button ke saath.</p></div>
            </div>
          </Reveal>

          <div className={styles.divider}><i /><b /><i /></div>

          <Reveal as="section" id="langs" className={styles.sec}>
            <div className={styles.secHead}>
              <div className={styles.secIco}>🌍</div>
              <div><h2>Every language</h2><p>Language select karo, package manager chuno, copy-paste karo.</p></div>
            </div>
            <input className={styles.search} placeholder="Search language… (python, go, flutter)" value={q} onChange={(e) => setQ(e.target.value)} />
            <div className={styles.grid3}>
              {list.map((l) => (
                <button key={l.id} onMouseMove={spot} onClick={() => pick(l)}
                  className={`${styles.card} ${styles.spot} ${lang.id === l.id ? styles.cardOn : ""}`}>
                  <div className={styles.cardIco}>{l.ico}</div>
                  <b>{l.name}</b><p>{l.note}</p>
                </button>
              ))}
            </div>
            {!list.length && <div className={styles.empty}>Koi language nahi mili 😅</div>}

            <h3 style={{ margin: "30px 0 0" }}>{lang.ico} {lang.name}</h3>
            <Tabs items={managers} value={curMgr} onChange={setMgr} />
            <Code id="inst" file={`install · ${curMgr}`} code={lang.installs[curMgr]} copied={copied} onCopy={copy} />
            <Code id="use" file={lang.file} code={lang.use} copied={copied} onCopy={copy} />
          </Reveal>

          <div className={styles.divider}><i /><b /><i /></div>

          <Reveal as="section" id="steps" className={styles.sec}>
            <div className={styles.secHead}>
              <div className={styles.secIco}>🧭</div>
              <div><h2>Setup steps</h2><p>Install se pehle run tak, 4 simple steps.</p></div>
            </div>
            <ol className={styles.steps}>
              {STEPS.map(([t, d], i) => (
                <li key={t}><span className={styles.dot}>{i + 1}</span><h3>{t}</h3><p>{d}</p></li>
              ))}
            </ol>
            <Code id="env" file=".env" code={`TOSA_KEY=your_secret_key\nTOSA_ENV=production`} copied={copied} onCopy={copy} />
          </Reveal>

          <div className={styles.divider}><i /><b /><i /></div>

          <Reveal as="section" id="cdn" className={styles.sec}>
            <div className={styles.secHead}>
              <div className={styles.secIco}>🔌</div>
              <div><h2>Copy-paste integration</h2><p>Framework me seedha paste karo.</p></div>
            </div>
            <Tabs items={Object.keys(CDN)} value={cdn} onChange={setCdn} />
            <Code id="cdn" file={cdn} code={CDN[cdn]} copied={copied} onCopy={copy} />
          </Reveal>

          <div className={styles.divider}><i /><b /><i /></div>

          <Reveal as="section" id="faq" className={styles.sec}>
            <div className={styles.secHead}>
              <div className={styles.secIco}>💬</div>
              <div><h2>FAQ</h2><p>Common problems aur unke jawab.</p></div>
            </div>
            <div className={styles.acc}>
              {FAQ.map(([q2, a], i) => (
                <div key={q2} className={`${styles.item} ${open === i ? styles.itemOpen : ""}`}>
                  <button onClick={() => setOpen(open === i ? -1 : i)}>{q2}<span>▾</span></button>
                  <div className={styles.panel}><div><p>{a}</p></div></div>
                </div>
              ))}
            </div>
          </Reveal>
        </main>
      </div>
    </div>
  );
}