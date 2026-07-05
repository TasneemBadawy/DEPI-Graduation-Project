import { useEffect, useState } from "react";
import { cn } from "../lib/utils";
import { Compass } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";

// Every link here targets a section on the homepage, not a separate route.
// Dedicated listing pages (/guides, /tours, /experiences) are still reachable
// from buttons within those homepage sections ("View all guides", etc.).
const NAV_LINKS = [
  { label: "Guides", sectionId: "top-guides" },
  { label: "Tours", sectionId: "popular-tours" },
  { label: "Activities", sectionId: "things-to-do" },
  { label: "Testimonials", sectionId: "testimonials" },
  { label: "About", sectionId: "about" },
];

// Pages that show only the logo + wordmark, with no nav links or auth buttons.
function isMinimalPath(pathname) {
  if (pathname === "/login" || pathname === "/register") return true;
  if (pathname.startsWith("/guides/") && pathname !== "/guides/") return true; // individual guide profile
  return false;
}

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { pathname } = location;

  const isHome = pathname === "/";
  const minimal = isMinimalPath(pathname);

  // On the homepage the bar starts transparent over the hero image, then
  // turns solid once you've scrolled past it — it's sticky the whole time.
  const [scrolled, setScrolled] = useState(!isHome);

  useEffect(() => {
    if (!isHome) {
      setScrolled(true);
      return;
    }
    const onScroll = () => setScrolled(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const transparent = isHome && !scrolled;

  const handleNavClick = (e, sectionId) => {
    e.preventDefault();
    if (pathname === "/") {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" });
    } else {
      navigate(`/#${sectionId}`);
    }
  };

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 flex h-16 w-full items-center justify-between px-6 transition-colors duration-300 sm:px-12",
        transparent ? "bg-transparent text-white" : "border-b border-border bg-card/95 text-foreground backdrop-blur-sm"
      )}
    >
      {/* Logo — always present */}
      <Link to="/" className="flex items-center gap-2.5">
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-full border backdrop-blur-sm",
            transparent ? "border-white/20 bg-black/10" : "border-border bg-primary-soft"
          )}
        >
          <Compass className={cn("h-[18px] w-[18px]", transparent ? "text-black" : "text-primary")} />
        </div>
        <span className={cn("text-xl font-bold tracking-tight", transparent ? "text-black" : "text-foreground")}>
          Nomade
        </span>
      </Link>

      {!minimal && (
        <>
          {/* Middle nav links — smooth-scroll to homepage sections */}
          <div className="hidden items-center gap-1 md:flex">
            {NAV_LINKS.map((item) => (
              <a
                key={item.label}
                href={`/#${item.sectionId}`}
                onClick={(e) => handleNavClick(e, item.sectionId)}
                className={cn(
                  "rounded-xl px-4 py-2 text-sm font-medium transition-all",
                  transparent
                    ? "text-black/90 hover:bg-black/10 hover:text-black"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Auth buttons */}
          <div className="flex items-center gap-6">
            <Link
              to="/login"
              className={cn(
                "text-sm font-semibold transition-all",
                transparent ? "text-black/90 hover:text-black" : "text-foreground hover:text-primary"
              )}
            >
              Log in
            </Link>
            <Link
              to="/register"
              className="rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-all duration-150 hover:brightness-110 active:scale-[0.98]"
            >
              Join Nomade
            </Link>
          </div>
        </>
      )}
    </nav>
  );
}
