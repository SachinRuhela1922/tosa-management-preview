import styles from "./Reviews.module.css";

const data = [
  ["Aarav Mehta", "Frontend Developer", "Tosa helped me replace repetitive UI work with reusable components. I can build interfaces much faster now.", 5, 210],
  ["Sara Khan", "UI/UX Designer", "The components are clean and the live previews make it much easier to see how everything fits together.", 5, 330],
  ["Rohan Verma", "Indie Developer", "I used Tosa for my landing page and had the basic UI ready in a few hours instead of building everything from scratch.", 5, 150],
  ["Priya Nair", "Full Stack Developer", "Having frontend components ready to use saves a lot of development time. The documentation makes integration straightforward.", 5, 275],
  ["Daniel Cruz", "Engineering Manager", "Tosa makes it easier for new developers to understand and reuse common components across our projects.", 4, 30],
  ["Meera Iyer", "Web Developer", "The NPM and CDN options make Tosa easy to integrate into different types of projects.", 5, 190],
  ["Kabir Singh", "Full Stack Dev", "I like that the frontend components can be used without paying. Unlimited usage makes it practical for multiple projects.", 5, 60],
  ["Emma Wilson", "Frontend Engineer", "The interactive playground is useful for testing components before adding them to a project.", 5, 300],
  ["Vikram Rao", "Startup Developer", "Tosa gives developers a solid collection of reusable building blocks without having to recreate everything from scratch.", 5, 120],
];

const cols = [data.slice(0, 3), data.slice(3, 6), data.slice(6, 9)];

const Card = ({ r }) => {
  const [name, role, text, stars, hue] = r;

  return (
    <figure className={styles.card}>
      <div className={styles.stars}>
        {"★★★★★".split("").map((s, i) => (
          <span key={i} className={i < stars ? styles.on : ""}>
            {s}
          </span>
        ))}
      </div>

      <blockquote>{text}</blockquote>

      <figcaption>
        <span className={styles.avatar} style={{ "--h": hue }}>
          {name[0]}
        </span>

        <div>
          <strong>{name}</strong>
          <small>{role}</small>
        </div>
      </figcaption>
    </figure>
  );
};

const Reviews = () => (
  <section className={styles.section}>
    <div className={styles.head}>
      <span className={styles.badge}>Developer feedback</span>

      <h2>
        Built for <span>developers</span>
      </h2>

      <div className={styles.summary}>
        <strong>4.9</strong>
        <span className={styles.big}>★★★★★</span>
        <small>developer community feedback</small>
      </div>
    </div>

    <div className={styles.wall}>
      {cols.map((c, i) => (
        <div
          key={i}
          className={`${styles.col} ${i === 1 ? styles.rev : ""} ${i > 0 ? styles.hideSm : ""}`}
        >
          <div
            className={styles.track}
            style={{ "--s": `${34 + i * 6}s` }}
          >
            {[...c, ...c].map((r, j) => (
              <Card key={j} r={r} />
            ))}
          </div>
        </div>
      ))}
    </div>
  </section>
);

export default Reviews;