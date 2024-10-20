import { useContext, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import "./App.css";
import SignIn from "./pages/SignIn";
import { ConfigProvider } from "antd";
import { themeData } from "./constants/theme";
import { UserContext } from "./contexts/UserContext";
import Home from "./pages/Home";
import Compare from "./pages/Compare";
import View3dModel from "./pages/View3dModel";
import EndTestimonial from "./pages/EndTestimonial";

function App() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user.isAuthenticated) {
      navigate("/signin", { replace: true });
    }
  }, [user.isAuthenticated, navigate]);

  return (
    <div className="App">
      <ConfigProvider theme={themeData}>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/" element={<Home />} />
          <Route path="/compare" element={<Compare />} />
          <Route path="/view3d" element={<View3dModel />} />
          <Route path="/endtestimonial" element={<EndTestimonial />} />
        </Routes>
      </ConfigProvider>
    </div>
  );
}

export default App;
