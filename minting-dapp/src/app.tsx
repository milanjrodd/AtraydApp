import { AnimatePresence } from "framer-motion";
import { Route, Routes, useLocation } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { lightTheme } from "./styles/Themes";
import GlobalStyle from "./styles/globalStyles";
import "./index.css";
import "./App.css";
import { Suspense, lazy } from "react";
import Loading from "./components/Loading";

const HomePage = lazy(() => import("./pages/HomePage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const MySkillsPage = lazy(() => import("./pages/MySkillsPage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const WorkPage = lazy(() => import("./pages/WorkPage"));
const SoundBar = lazy(() => import("./components/SoundBar"));

function App() {
  const location = useLocation();
  return (
    <>
      <GlobalStyle />

      <ThemeProvider theme={lightTheme}>
        <Suspense fallback={<Loading />}>
          <SoundBar />

          {/* For framer-motion animation on page change! */}
          {/* Changed prop from exitBefore to mode */}
          <AnimatePresence mode="wait">
            {/* Changed Switch to Routes */}

            <Routes key={location.pathname} location={location}>
              {/* Changed component to element */}

              <Route path="/" element={<HomePage />} />

              <Route path="/about" element={<AboutPage />} />

              <Route path="/blog" element={<BlogPage />} />

              <Route path="/work" element={<WorkPage />} />

              <Route path="/skills" element={<MySkillsPage />} />
              {/* Below is to catch all the other routes and send the user to main component,
you can add custom 404 component or message instead of Main component*/}
              <Route path="*" element={<HomePage />} />
            </Routes>
          </AnimatePresence>
        </Suspense>
      </ThemeProvider>
    </>
  );
}

export default App;
