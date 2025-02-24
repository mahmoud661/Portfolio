import { useState, useEffect, lazy, Suspense, memo } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/navbar/navbar";
import LoadingScreen from "./components/loading/loading-screen";

// Lazy load pages
const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const Projects = lazy(() => import("./pages/Projects"));
const Certificates = lazy(() => import("./pages/Certificates"));
const Contact = lazy(() => import("./pages/Contact"));

// ScrollToTop component
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isPageReady, setIsPageReady] = useState(false);

  useEffect(() => {
    const handleLoad = () => setIsPageReady(true);

    if (document.readyState === "complete") {
      handleLoad();
    } else {
      window.addEventListener("load", handleLoad);
    }

    return () => window.removeEventListener("load", handleLoad);
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <div className="bg-background text-foreground min-h-screen">
        {isLoading ? (
          <LoadingScreen
            onLoaded={() => setIsLoading(false)}
            isPageReady={isPageReady}
          />
        ) : (
          <>
            <Navbar />
            <Suspense fallback={<LoadingScreen onLoaded={() => {}} isPageReady={false} />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/certificates" element={<Certificates />} />
                <Route path="/contact" element={<Contact />} />
              </Routes>
            </Suspense>
          </>
        )}
      </div>
    </Router>
  );
}

export default memo(App);