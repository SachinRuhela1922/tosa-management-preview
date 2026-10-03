import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { isAuthenticated } from "../../utils/auth";
import styles from "./Profile.module.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000";

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Jis protected page se bheja gaya tha, login ke baad wahin wapas jayenge
  const redirectTo = location.state?.from?.pathname || "/view-profile";


  const [mode, setMode] = useState("login");

  const [form, setForm] = useState({
    name: "",
    place: "",
    education: "",
    github: "",
    leetcode: "",
    preferredLanguage: "",
    languageLevel: "Beginner",
    password: "",
    confirmPassword: "",
  });

  const [loginData, setLoginData] = useState({
    uniqueId: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Protected page se redirect hone par message dikhao
  useEffect(() => {
    if (location.state?.notice) setError(location.state.notice);
  }, [location.state]);
  const [createdId, setCreatedId] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;

    setLoginData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setError("");
    setMessage("");
  };

  // =====================================================
  // CREATE PROFILE
  // =====================================================

  const handleCreateProfile = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");
    setCreatedId("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (form.password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/profile/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: form.name.trim(),
            place: form.place.trim(),
            education: form.education.trim(),
            github: form.github.trim(),
            leetcode: form.leetcode.trim(),
            preferredLanguage:
              form.preferredLanguage.trim(),
            languageLevel: form.languageLevel,
            password: form.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Profile creation failed."
        );
      }

      setCreatedId(data.uniqueId);

      setMessage(
        "Your developer profile has been created successfully."
      );

      setForm({
        name: "",
        place: "",
        education: "",
        github: "",
        leetcode: "",
        preferredLanguage: "",
        languageLevel: "Beginner",
        password: "",
        confirmPassword: "",
      });

    } catch (err) {
      setError(
        err.message || "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // LOGIN
  // =====================================================

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (
      !loginData.uniqueId.trim() ||
      !loginData.password
    ) {
      setError(
        "Please enter your TOSA ID and password."
      );
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(
        `${API_URL}/api/profile/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            uniqueId: loginData.uniqueId
              .trim()
              .toUpperCase(),
            password: loginData.password,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Login failed."
        );
      }

      // =================================================
      // SAVE JWT
      // =================================================

      if (!data.token) {
        throw new Error(
          "Login successful but JWT token was not returned by server."
        );
      }

      localStorage.setItem(
        "tosaToken",
        data.token
      );

      // =================================================
      // SAVE PROFILE
      // =================================================

      const profile = data.profile || {
        id: data.id || data.uniqueId,
        uniqueId: data.uniqueId,
        name: data.name,
        place: data.place,
        education: data.education,
        github: data.github,
        leetcode: data.leetcode,
        preferredLanguage:
          data.preferredLanguage,
        languageLevel: data.languageLevel,
        createdAt: data.createdAt,
        activationAt: data.activationAt,
        isActive: data.isActive,
      };

      localStorage.setItem(
        "tosaProfile",
        JSON.stringify(profile)
      );

      // =================================================
      // GO TO VIEW PROFILE
      // =================================================

      navigate(redirectTo, {
        replace: true,
      });
    } catch (err) {
      setError(
        err.message || "Login failed."
      );
    } finally {
      setLoading(false);
    }
  };

  // Already logged in hai to login page dobara mat dikhao
  if (isAuthenticated()) {
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <div className={styles.page}>
      <div className={styles.progressBar} />

      <div className={styles.aurora} />
      <div className={styles.grid} />

      <div className={styles.container}>

        {/* =================================================
            BRAND
        ================================================= */}

        <div className={styles.topBrand}>
          <div className={styles.brandMark}>
            T
          </div>

          <div>
            <strong>TOSA</strong>
            <span>Developer Identity</span>
          </div>
        </div>

        {/* =================================================
            MAIN LAYOUT
        ================================================= */}

        <div className={styles.layout}>

          {/* =================================================
              LEFT / INTRO
          ================================================= */}

          <section className={styles.intro}>

            <div className={styles.livePill}>
              <span />
              TOSA DEVELOPER NETWORK
            </div>

            <h1>
              Build your
              <br />
              <em>developer identity.</em>
            </h1>

            <p>
              Create your TOSA developer profile,
              connect your coding platforms and
              become part of the developer ecosystem.
            </p>

            {/* FEATURES */}

            <div className={styles.featureList}>

              <div className={styles.feature}>
                <div className={styles.featureIcon}>
                  01
                </div>

                <div>
                  <b>Unique Developer Identity</b>
                  <span>
                    Get your own TOSA developer ID
                    generated securely.
                  </span>
                </div>
              </div>

              <div className={styles.feature}>
                <div className={styles.featureIcon}>
                  02
                </div>

                <div>
                  <b>Connect Your Coding Profiles</b>
                  <span>
                    Add GitHub and LeetCode to your
                    developer identity.
                  </span>
                </div>
              </div>

              <div className={styles.feature}>
                <div className={styles.featureIcon}>
                  03
                </div>

                <div>
                  <b>Contribute to TOSA</b>
                  <span>
                    Login and access the contribution
                    ecosystem.
                  </span>
                </div>
              </div>

            </div>

            {/* MINI PROFILE */}

            <div className={styles.miniCard}>

              <div className={styles.avatar}>
                {form.name
                  ? form.name
                      .charAt(0)
                      .toUpperCase()
                  : "T"}
              </div>

              <div className={styles.miniInfo}>
                <small>
                  DEVELOPER PROFILE
                </small>

                <b>
                  {form.name ||
                    "Your Developer Identity"}
                </b>

                <span>
                  {form.preferredLanguage ||
                    "Your preferred language"}
                </span>
              </div>

              <div
                className={styles.statusDot}
              />

            </div>

          </section>

          {/* =================================================
              RIGHT / PANEL
          ================================================= */}

          <section className={styles.panel}>

            <div className={styles.panelHeader}>

              <div>
                <span className={styles.panelKicker}>
                  {mode === "login"
                    ? "WELCOME BACK"
                    : "JOIN TOSA"}
                </span>

                <h2>
                  {mode === "login"
                    ? "Login to TOSA"
                    : "Create your profile"}
                </h2>

                <p>
                  {mode === "login"
                    ? "Use your unique TOSA developer ID to access your profile."
                    : "Create your developer identity and connect with the TOSA ecosystem."}
                </p>
              </div>

            </div>

            {/* =================================================
                TABS
            ================================================= */}

            <div className={styles.tabs}>

              <button
                type="button"
                className={
                  mode === "login"
                    ? styles.activeTab
                    : ""
                }
                onClick={() =>
                  switchMode("login")
                }
              >
                Login
              </button>

              <button
                type="button"
                className={
                  mode === "create"
                    ? styles.activeTab
                    : ""
                }
                onClick={() =>
                  switchMode("create")
                }
              >
                Create Profile
              </button>

            </div>

            {/* =================================================
                ALERTS
            ================================================= */}

            {error && (
              <div
                className={`${styles.alert} ${styles.error}`}
              >
                <span>!</span>
                {error}
              </div>
            )}

            {message && (
              <div
                className={`${styles.alert} ${styles.success}`}
              >
                <span>✓</span>
                {message}
              </div>
            )}

            {/* =================================================
                LOGIN
            ================================================= */}

            {mode === "login" && (
              <form
                className={styles.loginForm}
                onSubmit={handleLogin}
              >

                <div className={styles.loginVisual}>

                  <div className={styles.loginOrb}>
                    ◈
                  </div>

                  <div>
                    <strong>
                      Secure Developer Login
                    </strong>

                    <span>
                      Your TOSA ID is your
                      developer identity.
                    </span>
                  </div>

                </div>

                <div className={styles.loginHint}>
                  <span>⌁</span>

                  <span>
                    Login with the unique ID
                    generated when you created
                    your profile.
                  </span>
                </div>

                {/* ID */}

                <label className={styles.field}>

                  <span>
                    TOSA DEVELOPER ID
                  </span>

                  <div
                    className={
                      styles.inputWrap
                    }
                  >

                    <div
                      className={
                        styles.inputIcon
                      }
                    >
                      #
                    </div>

                    <input
                      type="text"
                      name="uniqueId"
                      value={
                        loginData.uniqueId
                      }
                      onChange={
                        handleLoginChange
                      }
                      placeholder="TOSA-XXXXXXXX"
                      autoComplete="username"
                    />

                  </div>

                </label>

                {/* PASSWORD */}

                <label className={styles.field}>

                  <span>
                    PASSWORD
                  </span>

                  <div
                    className={
                      styles.inputWrap
                    }
                  >

                    <div
                      className={
                        styles.inputIcon
                      }
                    >
                      •
                    </div>

                    <input
                      type={
                        showLoginPassword
                          ? "text"
                          : "password"
                      }
                      name="password"
                      value={
                        loginData.password
                      }
                      onChange={
                        handleLoginChange
                      }
                      placeholder="Enter your password"
                      autoComplete="current-password"
                    />

                    <button
                      type="button"
                      className={styles.eye}
                      onClick={() =>
                        setShowLoginPassword(
                          (prev) => !prev
                        )
                      }
                    >
                      {showLoginPassword
                        ? "◉"
                        : "○"}
                    </button>

                  </div>

                </label>

                <button
                  type="submit"
                  className={styles.submit}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className={
                          styles.spinner
                        }
                      />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      Login to TOSA
                      <span>→</span>
                    </>
                  )}
                </button>

                <p className={styles.terms}>
                  By continuing, you agree to use
                  TOSA responsibly and securely.
                </p>

              </form>
            )}

            {/* =================================================
                CREATE PROFILE
            ================================================= */}

            {mode === "create" && (
              <form
                className={styles.form}
                onSubmit={
                  handleCreateProfile
                }
              >

                {/* BASIC INFO */}

                <div
                  className={
                    styles.sectionTitle
                  }
                >
                  <span>01</span>
                  Basic Information
                </div>

                <div
                  className={
                    styles.formGrid
                  }
                >

                  <label
                    className={styles.field}
                  >
                    <span>FULL NAME</span>

                    <div
                      className={
                        styles.inputWrap
                      }
                    >
                      <div
                        className={
                          styles.inputIcon
                        }
                      >
                        ◉
                      </div>

                      <input
                        type="text"
                        name="name"
                        value={form.name}
                        onChange={
                          handleChange
                        }
                        placeholder="Sachin Ruhela"
                        required
                      />
                    </div>
                  </label>

                  <label
                    className={styles.field}
                  >
                    <span>PLACE</span>

                    <div
                      className={
                        styles.inputWrap
                      }
                    >
                      <div
                        className={
                          styles.inputIcon
                        }
                      >
                        ⌖
                      </div>

                      <input
                        type="text"
                        name="place"
                        value={form.place}
                        onChange={
                          handleChange
                        }
                        placeholder="Ghaziabad"
                        required
                      />
                    </div>
                  </label>

                </div>

                <label className={styles.field}>
                  <span>EDUCATION</span>

                  <div
                    className={
                      styles.inputWrap
                    }
                  >
                    <div
                      className={
                        styles.inputIcon
                      }
                    >
                      ◆
                    </div>

                    <input
                      type="text"
                      name="education"
                      value={
                        form.education
                      }
                      onChange={
                        handleChange
                      }
                      placeholder="B.Tech CSE"
                      required
                    />
                  </div>
                </label>

                {/* CODING PROFILES */}

                <div
                  className={
                    styles.sectionTitle
                  }
                >
                  <span>02</span>
                  Coding Profiles
                </div>

                <div
                  className={
                    styles.formGrid
                  }
                >

                  <label
                    className={styles.field}
                  >
                    <span>GITHUB</span>

                    <div
                      className={
                        styles.inputWrap
                      }
                    >
                      <div
                        className={
                          styles.inputIcon
                        }
                      >
                        GH
                      </div>

                      <input
                        type="url"
                        name="github"
                        value={
                          form.github
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="https://github.com/username"
                        required
                      />
                    </div>
                  </label>

                  <label
                    className={styles.field}
                  >
                    <span>LEETCODE</span>

                    <div
                      className={
                        styles.inputWrap
                      }
                    >
                      <div
                        className={
                          styles.inputIcon
                        }
                      >
                        LC
                      </div>

                      <input
                        type="url"
                        name="leetcode"
                        value={
                          form.leetcode
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="https://leetcode.com/u/username"
                        required
                      />
                    </div>
                  </label>

                </div>

                {/* SKILLS */}

                <div
                  className={
                    styles.sectionTitle
                  }
                >
                  <span>03</span>
                  Developer Skills
                </div>

                <div
                  className={
                    styles.formGrid
                  }
                >

                  <label
                    className={styles.field}
                  >
                    <span>
                      PREFERRED LANGUAGE
                    </span>

                    <div
                      className={
                        styles.inputWrap
                      }
                    >
                      <div
                        className={
                          styles.inputIcon
                        }
                      >
                        &lt;/&gt;
                      </div>

                      <input
                        type="text"
                        name="preferredLanguage"
                        value={
                          form.preferredLanguage
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="JavaScript"
                        required
                      />
                    </div>
                  </label>

                  <label
                    className={styles.field}
                  >
                    <span>
                      LANGUAGE LEVEL
                    </span>

                    <div
                      className={
                        styles.inputWrap
                      }
                    >

                      <select
                        name="languageLevel"
                        value={
                          form.languageLevel
                        }
                        onChange={
                          handleChange
                        }
                      >
                        <option value="Beginner">
                          Beginner
                        </option>

                        <option value="Intermediate">
                          Intermediate
                        </option>

                        <option value="Advanced">
                          Advanced
                        </option>

                        <option value="Expert">
                          Expert
                        </option>
                      </select>

                      <span
                        className={
                          styles.selectArrow
                        }
                      >
                        ▼
                      </span>

                    </div>
                  </label>

                </div>

                {/* SECURITY */}

                <div
                  className={
                    styles.sectionTitle
                  }
                >
                  <span>04</span>
                  Account Security
                </div>

                <div
                  className={
                    styles.formGrid
                  }
                >

                  <label
                    className={styles.field}
                  >
                    <span>PASSWORD</span>

                    <div
                      className={
                        styles.inputWrap
                      }
                    >

                      <div
                        className={
                          styles.inputIcon
                        }
                      >
                        *
                      </div>

                      <input
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        name="password"
                        value={
                          form.password
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="Minimum 8 characters"
                        required
                      />

                      <button
                        type="button"
                        className={
                          styles.eye
                        }
                        onClick={() =>
                          setShowPassword(
                            (prev) => !prev
                          )
                        }
                      >
                        {showPassword
                          ? "◉"
                          : "○"}
                      </button>

                    </div>
                  </label>

                  <label
                    className={styles.field}
                  >
                    <span>
                      CONFIRM PASSWORD
                    </span>

                    <div
                      className={
                        styles.inputWrap
                      }
                    >

                      <div
                        className={
                          styles.inputIcon
                        }
                      >
                        *
                      </div>

                      <input
                        type={
                          showPassword
                            ? "text"
                            : "password"
                        }
                        name="confirmPassword"
                        value={
                          form.confirmPassword
                        }
                        onChange={
                          handleChange
                        }
                        placeholder="Repeat password"
                        required
                      />

                    </div>
                  </label>

                </div>

                {/* SECURITY NOTE */}

                <div
                  className={
                    styles.securityNote
                  }
                >
                  <span>🔐</span>

                  <div>
                    <b>
                      Your password is protected
                    </b>

                    <span>
                      Passwords are hashed on the
                      server before being stored.
                    </span>
                  </div>
                </div>

                {/* SUBMIT */}

                <button
                  type="submit"
                  className={styles.submit}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span
                        className={
                          styles.spinner
                        }
                      />
                      Creating Profile...
                    </>
                  ) : (
                    <>
                      Create Developer Profile
                      <span>→</span>
                    </>
                  )}
                </button>

                <p className={styles.terms}>
                  Your unique TOSA ID will be
                  generated automatically after
                  successful registration.
                </p>

                {/* =================================================
                    GENERATED ID
                ================================================= */}

                {createdId && (
                  <div
                    className={
                      styles.idReveal
                    }
                  >

                    <div
                      className={
                        styles.idGlow
                      }
                    />

                    <div
                      className={
                        styles.idIcon
                      }
                    >
                      ✓
                    </div>

                    <span>
                      PROFILE CREATED
                    </span>

                    <h3>
                      Your TOSA Developer ID
                    </h3>

                    <div
                      className={
                        styles.uniqueId
                      }
                    >
                      {createdId}
                    </div>

                    <p>
                      Save this ID. You will use
                      it together with your password
                      to login to your TOSA profile.
                    </p>

                    <div
                      className={
                        styles.activation
                      }
                    >
                      <span>◷</span>

                      <div>
                        <b>
                          Account activation
                        </b>

                        <span>
                          Your account follows the
                          activation period configured
                          by TOSA.
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className={styles.submit}
                      onClick={() => {
                        setMode("login");

                        setLoginData({
                          uniqueId:
                            createdId,
                          password: "",
                        });

                        setCreatedId("");
                        setMessage("");
                      }}
                    >
                      Continue to Login →
                    </button>

                  </div>
                )}

              </form>
            )}

          </section>

        </div>
      </div>
    </div>
  );
};

export default Profile;