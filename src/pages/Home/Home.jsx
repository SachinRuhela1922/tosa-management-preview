import { useNavigate, useOutletContext } from "react-router-dom";
import Hero from "../../components/Hero/Hero";
import Showcase from "../../components/Showcase/Showcase";
import Bento from "../../components/Bento/Bento";
import Workflow from "../../components/Workflow/Workflow";
import Spotlight from "../../components/Spotlight/Spotlight";
import Playground from "../../components/Playground/Playground";
import StackCards from "../../components/StackCards/StackCards";
import Expand from "../../components/Expand/Expand";
import Reviews from "../../components/Reviews/Reviews";
import Studio from "../../components/Studio/Studio";
import Pricing from "../../components/Pricing/Pricing";

const Home = () => {
  const navigate = useNavigate();
  const { toggleTheme } = useOutletContext();

  return (
    <>
      <Hero
        onPrimary={() => navigate("/components")}
        onSecondary={() => console.log("Learn More")}
      />
      <Showcase />
      <Bento />
      <Workflow />
      <Spotlight onToggleTheme={toggleTheme} />
      <Playground />
      <StackCards />
      <Expand />
      <Reviews />
      <Studio />
      <Pricing />
    </>
  );
};

export default Home;