import { AnimatePresence } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import AboutPage from "./pages/AboutPage";
import BlogPage from "./pages/BlogPage";
import Main from "./pages/HomePage";
import MySkillsPage from "./components/MySkillsPage";
import SoundBar from "./components/SoundBar";
import { lightTheme } from "./styles/Themes";
import WorkPage from "./pages/WorkPage";
import GlobalStyle from "./styles/globalStyles";

function App() {
  const location = useLocation();
  return (
    <>
      <GlobalStyle />

      <ThemeProvider theme={lightTheme}>
        <SoundBar />

        {/* For framer-motion animation on page change! */}
        {/* Changed prop from exitBefore to mode */}
        <AnimatePresence mode="wait">
          {/* Changed Switch to Routes */}

          <Routes key={location.pathname} location={location}>
            {/* Changed component to element */}

            <Route path="/" element={<Main />} />

            <Route path="/about" element={<AboutPage />} />

            <Route path="/blog" element={<BlogPage />} />

            <Route path="/work" element={<WorkPage />} />

            <Route path="/skills" element={<MySkillsPage />} />
            {/* Below is to catch all the other routes and send the user to main component,
you can add custom 404 component or message instead of Main component*/}
            <Route path="*" element={<Main />} />
          </Routes>
        </AnimatePresence>
      </ThemeProvider>
    </>
  );
}

export default App;
