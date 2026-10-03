import { Link } from "react-router-dom";
import DocsLayout from "../../components/DocsLayout/DocsLayout";
import CodeBlock from "../../components/DocsLayout/CodeBlock";
import { idOf, useLibrary } from "../../api/library";
import docs from "../../components/DocsLayout/DocsLayout.module.css";
import styles from "./ComponentsPage.module.css";

const TOC = [
  { id: "introduction", label: "Introduction", depth: 0 },
  { id: "how-it-works", label: "How it works", depth: 0 },
  { id: "installation", label: "Installation", depth: 0 },
  { id: "using-a-component", label: "Using a component", depth: 0 },
];

const ComponentsPage = () => {
  const { categories, components, loading } = useLibrary();

  return (
    <DocsLayout toc={TOC}>
      {/* ---------- Introduction ---------- */}
      <section id="introduction" className={`${docs.section} ${styles.hero}`} style={{ marginTop: 0 }}>
        <span className={styles.live}><i /> Component library</span>
        <h1 className={docs.title}>
          Build faster with <span className={styles.grad}>ready-made</span> components
        </h1>
        <p className={docs.lead}>
          Copy-paste friendly UI components for every stack. Pick a category from the sidebar,
          open a component and grab its install command, usage code and folder structure.
        </p>

        <div className={styles.stats}>
          <div className={styles.stat}><b>{loading ? "–" : categories.length}</b><span>Categories</span></div>
          <div className={styles.stat}><b>{loading ? "–" : components.length}</b><span>Components</span></div>
          <div className={styles.stat}><b>Free</b><span>Copy &amp; use anywhere</span></div>
        </div>

        <div className={styles.cards}>
          {categories.map((cat) => {
            const list = components.filter((c) => idOf(c.categoryId) === cat._id);
            const body = (
              <>
                <strong>{cat.name}</strong>
                <small>{list.length} component{list.length === 1 ? "" : "s"}{cat.version ? ` · v${cat.version}` : ""}</small>
              </>
            );
            return list[0] ? (
              <Link key={cat._id} to={`/components/${list[0].slug}`} className={styles.card}>{body}</Link>
            ) : (
              <div key={cat._id} className={styles.card} style={{ opacity: 0.6 }}>{body}</div>
            );
          })}
        </div>
      </section>

      {/* ---------- How it works ---------- */}
      <section id="how-it-works" className={docs.section}>
        <h2>How it works</h2>
        <p>
          Every component lives inside a category (React, HTML, Tailwind...). Each component can have
          one or more variants, and every variant ships with a description, an installation command,
          usage code, preview code and the recommended folder structure.
        </p>
      </section>

      {/* ---------- Installation ---------- */}
      <section id="installation" className={docs.section}>
        <h2>Installation</h2>
        <p>Start with any project. For React, a fresh Vite app works great:</p>
        <CodeBlock label="terminal" code={`npm create vite@latest my-app -- --template react\ncd my-app\nnpm install`} />
      </section>

      {/* ---------- Using a component ---------- */}
      <section id="using-a-component" className={docs.section}>
        <h2>Using a component</h2>
        <ol className={styles.steps}>
          <li><b>Pick a category</b> from the left sidebar, e.g. React.</li>
          <li><b>Open a component</b> like Navbar or Footer.</li>
          <li><b>Run the installation command</b> shown on the page.</li>
          <li><b>Copy the usage &amp; preview code</b> and follow the folder structure.</li>
        </ol>
      </section>
    </DocsLayout>
  );
};

export default ComponentsPage;