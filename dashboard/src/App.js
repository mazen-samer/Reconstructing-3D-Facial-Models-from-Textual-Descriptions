import "./App.css";
import { Box } from "@mui/material";
import Sidebar from "./components/Sidebar";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import AddCase from "./pages/AddCase";
import ViewEmployees from "./pages/ViewEmployees";
import AssignCase from "./pages/AssignCase";
import AddEmployee from "./pages/AddEmployee";
import ViewCases from "./pages/ViewCases";
import ViewCase from "./pages/ViewCase";

function App() {
  return (
    <div className="App">
      <Box sx={{ display: "flex", minHeight: "100vh", width: "100%" }}>
        <Sidebar />
        <Box sx={{ flex: 1 }}>
          <Box height="100%" backgroundColor="">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/addcase" element={<AddCase />} />
              <Route path="/addemployee" element={<AddEmployee />} />
              <Route path="/viewemployees" element={<ViewEmployees />} />
              <Route path="/assign/:id" element={<AssignCase />} />
              <Route path="/viewcases" element={<ViewCases />} />
              <Route path="/incident/:id" element={<ViewCase />} />
            </Routes>
          </Box>
        </Box>
      </Box>
    </div>
  );
}

export default App;
