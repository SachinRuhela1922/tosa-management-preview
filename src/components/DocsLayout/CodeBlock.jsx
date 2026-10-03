import { useState } from "react";
import Icon from "../Icon/Icon";
import styles from "./DocsLayout.module.css";

const CodeBlock = ({ code = "", label = "code" }) => {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked */
    }
  };

  return (
    <div className={styles.code}>
      <div className={styles.codeBar}>
        <span>{label}</span>
        <button onClick={copy} className={copied ? styles.done : ""}>
          <Icon name={copied ? "check" : "file"} size={13} />
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
      <pre>{code}</pre>
    </div>
  );
};

export default CodeBlock;