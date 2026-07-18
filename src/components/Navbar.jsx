import { Link, useNavigate } from "react-router-dom";
import { Menu, X, MapPin } from "lucide-react";
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
            <Link to="/guides" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Guides
            </Link>
            <Link to="/tours" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Tours
            </Link>
            <Link to="/experiences" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Experiences
            </Link>

            {user ? (
              <div className="flex items-center gap-4">
                <Link 
                  to={user.role === "guide" ? "/dashboard/guide" : "/dashboard/tourist"}
                  className="flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1.5 text-sm font-medium text-primary hover:brightness-95"
                >
                  <Avatar src={user.profileImage} name={user.name} size="sm" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-muted-foreground hover:text-destructive"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground">
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
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted md:hidden"
          >
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="border-t border-border py-4 md:hidden">
            <div className="flex flex-col gap-3">
              <Link to="/guides" className="text-sm font-medium text-muted-foreground hover:text-foreground" onClick={() => setIsOpen(false)}>
                Guides
              </Link>
              <Link to="/tours" className="text-sm font-medium text-muted-foreground hover:text-foreground" onClick={() => setIsOpen(false)}>
                Tours
              </Link>
              <Link to="/experiences" className="text-sm font-medium text-muted-foreground hover:text-foreground" onClick={() => setIsOpen(false)}>
                Experiences
              </Link>

              {user ? (
                <>
                  <Link 
                    to={user.role === "guide" ? "/dashboard/guide" : "/dashboard/tourist"}
                    className="flex items-center gap-2 rounded-lg bg-primary-soft px-3 py-2 text-sm font-medium text-primary"
                    onClick={() => setIsOpen(false)}
                  >
                    <Avatar src={user.profileImage} name={user.name} size="sm" />
                    Dashboard
                  </Link>
                  <button
                    onClick={() => { handleLogout(); setIsOpen(false); }}
                    className="text-left text-sm font-medium text-destructive"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-sm font-medium text-muted-foreground hover:text-foreground" onClick={() => setIsOpen(false)}>
                    Sign in
                  </Link>
                  <Link to="/register" className="btn btn-warm btn-sm text-center" onClick={() => setIsOpen(false)}>
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