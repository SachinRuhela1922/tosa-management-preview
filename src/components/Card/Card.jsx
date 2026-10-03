import { useRef } from "react";
import styles from "./Card.module.css";

// Reusable card: hover pe mouse ke peeche glow chalta hai
const Card = ({ children, className = "" }) => {
  const ref = useRef(null);

  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect();
    ref.current.style.setProperty("--x", `${e.clientX - rect.left}px`);
    ref.current.style.setProperty("--y", `${e.clientY - rect.top}px`);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      className={`${styles.card} ${className}`}
    >
      {children}
    </div>
  );
};

export default Card;