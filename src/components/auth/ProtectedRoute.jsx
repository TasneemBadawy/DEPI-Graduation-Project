import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getCurrentUser } from "../../lib/auth";

export default function ProtectedRoute({ children, role }) {
  const { user, isAuthenticated, initializing } = useAuth();
  const location = useLocation();

  // 🔓 DEV BYPASS: Always allow access to /dashboard/admin
  const isAdminRoute = location.pathname.startsWith("/dashboard/admin");
  
  // Force check for admin in localStorage
  const storedUser = getCurrentUser();
  
  // If it's an admin route, always allow access
  if (isAdminRoute) {
    // If no user exists, create a dev admin session
    if (!storedUser) {
      const tempAdmin = {
        id: "admin-dev",
        name: "Admin User",
        email: "admin@nomade.com",
        role: "admin",
        isDev: true,
      };
      localStorage.setItem("nomade_current_user", JSON.stringify(tempAdmin));
      localStorage.setItem("nomade_token", "dev-token-12345");
      console.log("🔓 DEV MODE: Auto-logged in as admin");
      return children;
    }
    
    // If user exists but role doesn't match, check if it's dev
    if (role && storedUser.role !== role) {
      // If it's admin route and user is admin or dev, allow
      if (storedUser.role === "admin" || storedUser.isDev) {
        return children;
      }
      // Force admin role for dev
      if (storedUser.isDev) {
        const updatedUser = { ...storedUser, role: "admin" };
        localStorage.setItem("nomade_current_user", JSON.stringify(updatedUser));
        return children;
      }
      return <Navigate to={`/dashboard/${storedUser.role}`} replace />;
    }
    
    return children;
  }

  // Avoid a flash-redirect to /login while we're still reading localStorage.
  if (initializing) return null;

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && user?.role !== role) {
    return <Navigate to={user ? `/dashboard/${user.role}` : "/login"} replace />;
  }

  return children;
}