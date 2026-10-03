import React from "react";
import { useNavigate } from "react-router-dom";
import styles from "./ViewProfile.module.css";

const ViewProfile = () => {
  const navigate = useNavigate();

  const token = localStorage.getItem("tosaToken");
  const savedProfile = localStorage.getItem("tosaProfile");

  if (!token || !savedProfile) {
    navigate("/profile", { replace: true });
    return null;
  }

  const profile = JSON.parse(savedProfile);

  const handleLogout = () => {
    localStorage.removeItem("tosaToken");
    localStorage.removeItem("tosaProfile");

    navigate("/profile", { replace: true });
  };

  const memberSince = profile.createdAt
    ? new Date(profile.createdAt).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "—";

  return (
    <div className={styles.page}>
      <div className={styles.aurora}></div>

      <div className={styles.container}>
        {/* SIDEBAR */}
        <aside className={styles.sidebar}>
          <div className={styles.logo}>TOSA</div>

          <div className={styles.profileMini}>
            <div className={styles.avatar}>
              {profile.name?.charAt(0)?.toUpperCase()}
            </div>

            <div>
              <strong>{profile.name}</strong>
              <span>{profile.uniqueId}</span>
            </div>
          </div>

          <nav>
            <button className={styles.navActive}>
              <span>◈</span>
              View Profile
            </button>

            <button
              className={styles.navButton}
              onClick={() => navigate("/contribute")}
            >
              <span>+</span>
              Contribute
            </button>
          </nav>

          <button className={styles.logout} onClick={handleLogout}>
            Logout
          </button>
        </aside>

        {/* MAIN */}
        <main className={styles.main}>
          <div className={styles.topbar}>
            <div>
              <span className={styles.eyebrow}>DEVELOPER PROFILE</span>

              <h1>
                Welcome, <span>{profile.name}</span>
              </h1>

              <p>Your TOSA developer identity and activity overview.</p>
            </div>

            <div className={styles.status}>
              <span></span>
              {profile.isActive ? "Active Account" : "Inactive"}
            </div>
          </div>

          {/* HERO PROFILE */}
          <section className={styles.profileHero}>
            <div className={styles.bigAvatar}>
              {profile.name?.charAt(0)?.toUpperCase()}
            </div>

            <div className={styles.identity}>
              <span className={styles.idLabel}>TOSA DEVELOPER ID</span>

              <h2>{profile.name}</h2>

              <div className={styles.uniqueId}>
                {profile.uniqueId}
              </div>

              <p>
                {profile.education} · {profile.place}
              </p>
            </div>

            <div className={styles.heroAction}>
              <button
                onClick={() => navigate("/contribute")}
                className={styles.contributeButton}
              >
                Start Contributing →
              </button>
            </div>
          </section>

          {/* STATS */}
          <section className={styles.stats}>
            <div className={styles.statCard}>
              <span>Preferred Language</span>
              <strong>{profile.preferredLanguage || "—"}</strong>
            </div>

            <div className={styles.statCard}>
              <span>Skill Level</span>
              <strong>{profile.languageLevel || "—"}</strong>
            </div>

            <div className={styles.statCard}>
              <span>Education</span>
              <strong>{profile.education || "—"}</strong>
            </div>

            <div className={styles.statCard}>
              <span>Member Since</span>
              <strong>{memberSince}</strong>
            </div>
          </section>

          {/* DETAILS */}
          <section className={styles.contentGrid}>
            <div className={styles.infoCard}>
              <div className={styles.sectionTitle}>
                <div>
                  <span>PROFILE</span>
                  <h3>Developer Information</h3>
                </div>
              </div>

              <div className={styles.details}>
                <div>
                  <span>Full Name</span>
                  <strong>{profile.name}</strong>
                </div>

                <div>
                  <span>Location</span>
                  <strong>{profile.place}</strong>
                </div>

                <div>
                  <span>Education</span>
                  <strong>{profile.education}</strong>
                </div>

                <div>
                  <span>Preferred Language</span>
                  <strong>{profile.preferredLanguage}</strong>
                </div>

                <div>
                  <span>Language Level</span>
                  <strong>{profile.languageLevel}</strong>
                </div>

                <div>
                  <span>Developer ID</span>
                  <strong>{profile.uniqueId}</strong>
                </div>
              </div>
            </div>

            {/* LINKS */}
            <div className={styles.infoCard}>
              <div className={styles.sectionTitle}>
                <div>
                  <span>CODING</span>
                  <h3>Developer Links</h3>
                </div>
              </div>

              <div className={styles.links}>
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noreferrer"
                >
                  <div>
                    <span>GitHub</span>
                    <strong>{profile.github}</strong>
                  </div>

                  <span>↗</span>
                </a>

                <a
                  href={profile.leetcode}
                  target="_blank"
                  rel="noreferrer"
                >
                  <div>
                    <span>LeetCode</span>
                    <strong>{profile.leetcode}</strong>
                  </div>

                  <span>↗</span>
                </a>
              </div>
            </div>
          </section>

          {/* CONTRIBUTE CTA */}
          <section className={styles.contributeCard}>
            <div>
              <span>OPEN SOURCE</span>

              <h2>Ready to contribute to TOSA?</h2>

              <p>
                Build components, improve the ecosystem and share your work
                with other developers.
              </p>
            </div>

            <button
              onClick={() => navigate("/contribute")}
              className={styles.contributeButton}
            >
              Contribute to TOSA →
            </button>
          </section>
        </main>
      </div>
    </div>
  );
};

export default ViewProfile;