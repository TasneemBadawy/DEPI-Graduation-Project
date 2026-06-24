import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import GuidePage from "./dashboard/guide/page";
import TouristPage from "./dashboard/tourist/page";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Register />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard/guide" element={<GuidePage />} />
      <Route path="/dashboard/tourist" element={<TouristPage />} />
    </Routes>
  );
}

export default App;