import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import * as authLib from "../lib/auth";

const AuthContext = createContext(null);

/**
 * Wraps the whole app (see main.jsx) so any component can subscribe to the
 * signed-in user via `useAuth()` and re-render when it changes — plain
 * `getCurrentUser()` reads from localStorage but doesn't trigger re-renders.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => authLib.getCurrentUser());
  const [initializing, setInitializing] = useState(true);
  const [error, setError] = useState("");

  // The initial useState() above already reads localStorage synchronously,
  // so on mount we only need to flip `initializing` off. There's no
  // "verify token" endpoint on the backend yet, so a stored user + token is
  // trusted as a valid session as-is.
  useEffect(() => {
    setInitializing(false);
  }, []);

  // Keep multiple tabs in sync: if the user logs out in one tab, the others
  // should notice.
  useEffect(() => {
    function onStorage(e) {
      if (e.key === "nomade_token" || e.key === "nomade_current_user") {
        setUser(authLib.getCurrentUser());
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const login = useCallback(async (role, credentials) => {
    setError("");
    try {
      const loggedInUser = await authLib.login(role, credentials);
      setUser(loggedInUser);
      return loggedInUser;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  const register = useCallback(async (role, payload, credentials) => {
    setError("");
    try {
      const newUser = await authLib.register(role, payload, credentials);
      setUser(newUser);
      return newUser;
    } catch (err) {
      setError(err.message);
      throw err;
    }
  }, []);

  /** For screens (like GuideDashboard's profile editor) that patch the
   *  cached user without a full re-login. */
  const updateUser = useCallback((patch) => {
    setUser((current) => {
      const next = { ...current, ...patch };
      authLib.setCurrentUser(next);
      return next;
    });
  }, []);

  const logout = useCallback(() => {
    authLib.logout();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      initializing,
      error,
      clearError: () => setError(""),
      login,
      register,
      logout,
      updateUser,
      dashboardPathForRole: authLib.dashboardPathForRole,
    }),
    [user, initializing, error, login, register, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an <AuthProvider>");
  return ctx;
}
