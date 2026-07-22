import { Link, useNavigate } from "react-router-dom";
import { Menu, X, MapPin, Shield, User, LogOut, LayoutDashboard } from "lucide-react";
import { useState, useEffect } from "react";
import { getCurrentUser, logout } from "../lib/auth";
import Avatar from "./ui/Avatar";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setUser(getCurrentUser());
    // Listen for storage changes (login/logout in other tabs)
    const handleStorage = () => setUser(getCurrentUser());
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const handleLogout = () => {
    logout();
    setUser(null);
    navigate("/");
    setIsOpen(false);
  };

  // Determine dashboard link based on user role
  const getDashboardLink = () => {
    if (!user) return "/login";
    if (user.role === "admin") return "/dashboard/admin";
    if (user.role === "guide") return "/dashboard/guide";
    return "/dashboard/tourist";
  };

  // Determine dashboard label based on user role
  const getDashboardLabel = () => {
    if (!user) return "Dashboard";
    if (user.role === "admin") return "Admin Panel";
    if (user.role === "guide") return "Guide Dashboard";
    return "My Dashboard";
  };

  return (
    <nav className="border-b border-border bg-card/95 backdrop-blur-md sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-foreground">
            <MapPin className="h-6 w-6 text-primary" />
            <span>Nomade</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden items-center gap-6 md:flex">
            <Link to="/guides" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Guides
            </Link>
            <Link to="/tours" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Tours
            </Link>
            <Link to="/experiences" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Experiences
            </Link>

            {user ? (
              <div className="flex items-center gap-4">
                {/* Dashboard Link - Role based */}
                <Link 
                  to={getDashboardLink()}
                  className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                    user.role === "admin" 
                      ? "bg-primary-soft text-primary hover:brightness-95" 
                      : "bg-secondary-soft text-secondary hover:brightness-95"
                  }`}
                >
                  {user.role === "admin" ? (
                    <Shield className="h-4 w-4" />
                  ) : (
                    <LayoutDashboard className="h-4 w-4" />
                  )}
                  {getDashboardLabel()}
                </Link>
                
                {/* Admin badge */}
                {user.role === "admin" && (
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary-soft px-2 py-0.5 rounded-full">
                    Admin
                  </span>
                )}

                {/* User Avatar */}
                <Link 
                  to={getDashboardLink()}
                  className="hover:opacity-80 transition-opacity"
                >
                  <Avatar 
                    src={user.profileImage} 
                    name={user.name} 
                    size="sm"
                  />
                </Link>

                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                  Sign in
                </Link>
                <Link to="/register" className="btn btn-warm btn-sm">
                  Get started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted md:hidden transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="border-t border-border py-4 md:hidden">
            <div className="flex flex-col gap-3">
              <Link 
                to="/guides" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-lg hover:bg-muted" 
                onClick={() => setIsOpen(false)}
              >
                Guides
              </Link>
              <Link 
                to="/tours" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-lg hover:bg-muted" 
                onClick={() => setIsOpen(false)}
              >
                Tours
              </Link>
              <Link 
                to="/experiences" 
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-lg hover:bg-muted" 
                onClick={() => setIsOpen(false)}
              >
                Experiences
              </Link>

              {user ? (
                <>
                  {/* Admin Badge in Mobile */}
                  {user.role === "admin" && (
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary-soft px-3 py-1 rounded-full inline-block w-fit">
                      Admin
                    </span>
                  )}

                  <Link 
                    to={getDashboardLink()}
                    className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                      user.role === "admin" 
                        ? "bg-primary-soft text-primary" 
                        : "bg-secondary-soft text-secondary"
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {user.role === "admin" ? (
                      <Shield className="h-4 w-4" />
                    ) : (
                      <LayoutDashboard className="h-4 w-4" />
                    )}
                    {getDashboardLabel()}
                  </Link>

                  <div className="flex items-center gap-3 px-2 py-1">
                    <Avatar 
                      src={user.profileImage} 
                      name={user.name} 
                      size="sm"
                    />
                    <span className="text-sm font-medium text-foreground">
                      {user.name || "User"}
                    </span>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="text-left text-sm font-medium text-destructive hover:bg-destructive/5 transition-colors px-3 py-2 rounded-lg flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors px-2 py-1 rounded-lg hover:bg-muted" 
                    onClick={() => setIsOpen(false)}
                  >
                    Sign in
                  </Link>
                  <Link 
                    to="/register" 
                    className="btn btn-warm btn-sm text-center" 
                    onClick={() => setIsOpen(false)}
                  >
                    Get started
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}