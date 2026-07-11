import { Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import Guides from "./pages/Guides/Guides";
import GuideProfile from "./pages/GuideProfile/GuideProfile";
import Tours from "./pages/Tours/Tours";
import TourDetail from "./pages/TourDetail/TourDetail";
import Experiences from "./pages/Experiences/Experiences";
import ExperienceDetail from "./pages/ExperienceDetail/ExperienceDetail";
import GuidePage from "./dashboard/guide/page";
import TouristPage from "./dashboard/tourist/page";
import DashboardRoot from "./dashboard/page";
import TourManagement from "./pages/TourManagement/TourManagement";
import AdminDashboard from "./pages/AdminDashboard/AdminDashboard";

function App() {
  const { pathname } = useLocation();
  // Dashboards render their own full header (components/ui/Navbar.jsx),
  // so the global marketing nav is skipped there entirely instead of
  // stacking two navbars.
  const hideGlobalNavbar = pathname.startsWith("/dashboard");

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      {!hideGlobalNavbar && <Navbar />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/guides" element={<Guides />} />
          <Route path="/guides/:slug" element={<GuideProfile />} />
          <Route path="/tours" element={<Tours />} />
          <Route path="/tours/:slug" element={<TourDetail />} />
          <Route path="/experiences" element={<Experiences />} />
          <Route path="/experiences/:slug" element={<ExperienceDetail />} />
          <Route path="/dashboard" element={<DashboardRoot />} />
          <Route path="/dashboard/guide" element={<GuidePage />} />
          <Route path="/dashboard/guide/tours" element={<TourManagement />} />
          <Route path="/dashboard/tourist" element={<TouristPage />} />
          <Route path="/dashboard/admin" element={<AdminDashboard />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
