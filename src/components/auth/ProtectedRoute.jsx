import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

/**
 * Wrap any route element that requires a signed-in user:
 *
 *   <Route path="/dashboard/tourist" element={
 *     <ProtectedRoute><TouristPage /></ProtectedRoute>
 *   } />
 *
 * Optionally restrict by role:
 *
 *   <ProtectedRoute role="guide"><GuidePage /></ProtectedRoute>
 *
 * Unauthenticated visitors are bounced to /login, and Login redirects them
 * back to where they were headed once they sign in (see Login.jsx's use of
 * `location.state?.from`).
 */
export default function ProtectedRoute({ children, role }) {
  const { user, isAuthenticated, initializing } = useAuth();
  const location = useLocation();

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
