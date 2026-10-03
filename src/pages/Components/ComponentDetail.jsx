import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import Icon from "../../components/Icon/Icon";
import DocsLayout from "../../components/DocsLayout/DocsLayout";
import CodeBlock from "../../components/DocsLayout/CodeBlock";
import { idOf, useLibrary, useVariants } from "../../api/library";
import docs from "../../components/DocsLayout/DocsLayout.module.css";
import styles from "./ComponentDetail.module.css";

// [key, heading, variant field, code label (null = plain text)]
const SECTIONS = [
  ["description", "Description", "description", null],
  ["installation", "Installation Command", "installationCommand", "terminal"],
  ["usage", "Usage Code", "usageCode", "usage.jsx"],
  ["preview", "Preview Code", "previewCode", "preview.jsx"],
  ["structure", "Folder Structure", "folderStructure", "structure"],
];

const filled = (v, field) => typeof v[field] === "string" && v[field].trim().length > 0;
const vid = (v) => v.slug || v._id;

const ComponentDetail = () => {
  const { id } = useParams();
  const { categories, components, loading: libLoading, error: libError } = useLibrary();

  const index = components.findIndex((c) => c.slug === id || c._id === id);
  const item = components[index];
  const category = item && categories.find((c) => c._id === idOf(item.categoryId));

  const { variants, loading: varLoading, error: varError } = useVariants(item?._id);

  /* right sidebar entries */
  const toc = useMemo(() => {
    if (!item) return [];
    const multi = variants.length > 1;
    const out = [{ id: "overview", label: "Overview", depth: 0 }];
    variants.forEach((v) => {
      if (multi) out.push({ id: `v-${vid(v)}`, label: v.name, depth: 0 });
      SECTIONS.forEach(([key, label, field]) => {
        if (filled(v, field)) out.push({ id: `${vid(v)}-${key}`, label, depth: multi ? 1 : 0 });
      });
    });
    return out;
  }, [item, variants]);

  /* ---------- not found / loading ---------- */
  if (libLoading) {
    return (
      <DocsLayout>
        <div className={docs.skel} /><div className={docs.skel} /><div className={docs.skel} />
      </DocsLayout>
    );
  }

  if (!item) {
    return (
      <DocsLayout>
        <div className={docs.empty}>
          <h2>{libError ? "Couldn't load library" : "Component not found"}</h2>
          {libError && <p>{libError}</p>}
          <Link to="/components" className={docs.btnLink}>
            <span style={{ display: "flex", transform: "rotate(180deg)" }}><Icon name="arrow" size={14} /></span> Back to library
          </Link>
        </div>
      </DocsLayout>
    );
  }

  const prev = components[(index - 1 + components.length) % components.length];
  const next = components[(index + 1) % components.length];

  return (
    <DocsLayout toc={toc}>
      <Link to="/components" className={styles.back}>
        <Icon name="arrow" size={14} /> All components
      </Link>

      {/* ---------- component head ---------- */}
      <header id="overview" style={{ scrollMarginTop: 100 }}>
        {category && <span className={docs.badge}>{category.name}</span>}
        <h1 className={docs.title}>{item.name}</h1>
        {item.description && <p className={docs.lead}>{item.description}</p>}
      </header>

      {/* ---------- variants ---------- */}
      {varLoading && <><div className={docs.skel} /><div className={docs.skel} /></>}
      {varError && <div className={docs.empty}><p>⚠️ {varError}</p></div>}
      {!varLoading && !varError && variants.length === 0 && (
        <div className={docs.empty}><p>No variants added for this component yet.</p></div>
      )}

      {variants.map((v) => (
        <div key={v._id}>
          <div id={`v-${vid(v)}`} className={docs.variantHead}>
            <h2>
              {v.name}
              <span className={`${docs.status} ${v.status === "deprecated" ? docs.deprecated : ""}`}>{v.status}</span>
            </h2>
            {v.shortDescription && <p className={docs.lead}>{v.shortDescription}</p>}
            <div className={docs.meta}>
              {v.version && <b>v{v.version}</b>}
              {v.author && <em>by {v.author}</em>}
              {(v.tags || []).map((t) => <em key={t}>#{t}</em>)}
            </div>
          </div>

          {SECTIONS.map(([key, label, field, codeLabel]) =>
            filled(v, field) ? (
              <section key={key} id={`${vid(v)}-${key}`} className={docs.section}>
                <h2>{label}</h2>
                {codeLabel ? <CodeBlock code={v[field]} label={codeLabel} /> : <p>{v[field]}</p>}
              </section>
            ) : null
          )}
        </div>
      ))}

      {/* ---------- prev / next ---------- */}
      {components.length > 1 && (
        <div className={styles.pager}>
          <Link to={`/components/${prev.slug}`} className={styles.pBtn}>
            <small>Previous</small>
            <strong>← {prev.name}</strong>
          </Link>
          <Link to={`/components/${next.slug}`} className={`${styles.pBtn} ${styles.right}`}>
            <small>Next</small>
            <strong>{next.name} →</strong>
          </Link>
        </div>
      )}
    </DocsLayout>
  );
};

export default ComponentDetail;