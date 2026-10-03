import { useEffect, useState } from "react";
import { Outlet, useLocation,useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar/Navbar";
import Footer from "../components/Footer/Footer";

const Layout = () => {
  const [theme, setTheme] = useState("dark");
  const { pathname } = useLocation();

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // page badalne pe top se start ho
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  // Layout component ke andar:
const navigate = useNavigate();

  const toggleTheme = () => setTheme((p) => (p === "dark" ? "light" : "dark"));

  return (
    <>
      <Navbar
  theme={theme}
  onToggleTheme={toggleTheme}
  onCreate={() => navigate("/installation")}
/>
      <Outlet context={{ toggleTheme }} />
      <Footer />
    </>
  );
};

export default Layout;