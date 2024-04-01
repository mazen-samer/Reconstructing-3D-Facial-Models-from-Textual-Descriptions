import "./App.css";
import { Box } from "@mui/material";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import { Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <Box sx={{ display: "flex", minHeight: "100vh", width: "100%" }}>
        <Sidebar />
        <Box sx={{ flex: 1 }}>
          <Navbar />
          <Box min-height="100%">
            <Routes>
              <Route path="/" element={<>Home</>} />
            </Routes>
          </Box>
        </Box>
      </Box>
    </div>
  );
}

export default App;
