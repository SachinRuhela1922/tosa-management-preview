import styles from "./Hero.module.css";

const Hero = ({ onPrimary, onSecondary }) => {
  return (
    <section className={styles.hero}>
      <span className={styles.badge}>Build Faster with Tosa</span>

      <h1 className={styles.heading}>
        Development In Just <br /> 3 Lines Of Code
      </h1>

      <p className={styles.para}>
        Build modern projects faster with ready-to-use Tosa components.
        <br />
        Explore components, install them and start building in less time.
      </p>

      <div className={styles.buttons}>
        <button className={styles.primaryBtn} onClick={onPrimary}>
          Explore Components
        </button>
        <button className={styles.secondaryBtn} onClick={onSecondary}>
          Read Documentation
        </button>
      </div>
    </section>
  );
};

export default Hero;