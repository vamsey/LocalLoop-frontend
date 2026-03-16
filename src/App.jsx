import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Explore from "./pages/Explore";
import RegisterBusiness from "./pages/RegisterBusiness";
import Admin from "./pages/Admin";
import OwnerDashboard from "./pages/OwnerDashboard";

function App() {
  return (
    <BrowserRouter>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/register" element={<RegisterBusiness />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/dashboard" element={<OwnerDashboard />} />
      </Routes>

    </BrowserRouter>
  );
}

export default App;