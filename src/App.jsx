import { Routes, Route } from "react-router-dom";
import Layout from "./layouts/Layouts";
import Home from "./pages/Home/Home";
import ComponentsPage from "./pages/Components/ComponentsPage";
import ComponentDetail from "./pages/Components/ComponentDetail";
import LanguagesDefine from "./pages/Language/Languagedefine";
import Documentation from "./pages/Documentation/Documentation";
import Installation from "./pages/Installation/Installation";
import Examples from "./pages/Examples/Examples";
import Profile from "./pages/Profile/Profile";
import ViewProfile from "./pages/Profile/ViewProfile";
import Contribute from "./pages/Contribute/Contribute";
import ProtectedRoute from "./pages/Contribute/Protectedroute";
import TosaCompiler from "./pages/TosaCompiler/TosaCompiler";



const App = () => (
  <Routes>
    <Route element={<Layout />}>
      <Route path="/" element={<Home />} />
      <Route path="/components" element={<ComponentsPage />} />
      <Route path="/components/:id" element={<ComponentDetail />} />
      <Route path="/languages" element={<LanguagesDefine />} />
      <Route path="/docs" element={<Documentation />} />
      <Route path="/installation" element={<Installation />} />
      <Route path="/examples" element={<Examples />} />
      <Route path="/create-profile" element={<Profile />} />
      <Route path="/tosa-compiler" element={<TosaCompiler />} />
      
      <Route
  path="/contribute"
  element={<ProtectedRoute><Contribute /></ProtectedRoute>}
/>

{/* view-profile ko bhi protect kar do */}
<Route
  path="/view-profile"
  element={<ProtectedRoute><ViewProfile /></ProtectedRoute>}
/>
      
      <Route path="*" element={<p style={{ padding: 80, textAlign: "center" }}>404 - Page not found</p>} />
    </Route>
  </Routes>
);

export default App;