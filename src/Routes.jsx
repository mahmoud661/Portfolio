import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AnimatedCursor from "react-animated-cursor";


function App() {
  return (
    <Router>
      <div>
        <div className="mouseee">
          <AnimatedCursor
            innerSize={4}
            outerSize={20}
            innerScale={1}
            outerScale={2}
            outerAlpha={0}
            innerStyle={{
              backgroundColor: "white",
            }}
            outerStyle={{
              border: "2px solid white",
            }}
          />
        </div>
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
