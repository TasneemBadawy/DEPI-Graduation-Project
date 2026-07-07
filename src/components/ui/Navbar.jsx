"use client";
import { Compass, Bell, MessageCircle, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Navbar({ role = "guide", pendingCount = 0, unreadMessages = 0 }) {
  const navigate = useNavigate();
  const otherRole = role === "guide" ? "tourist" : "guide";

  return (
    <header style={{
      position: "sticky", top: 0, zIndex: 40,
      borderBottom: "1px solid var(--border-faint)",
      background: "oklch(1 0 0 / 0.8)",
      backdropFilter: "blur(12px)",
    }}>
      <div style={{
        margin: "0 auto", maxWidth: 1280, height: 64,
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: 16, padding: "0 24px",
      }}>
        {/* Logo + nav */}
        <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
          <a href="/" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div className="icon-box-warm" style={{ width: 36, height: 36, borderRadius: "0.75rem" }}>
              <Compass size={18} />
            </div>
            <span style={{ fontSize: 17, fontWeight: 600, letterSpacing: "-0.3px" }}>Nomade</span>
          </a>
          <nav style={{ display: "flex", gap: 4 }}>
            {[
              { label: "Dashboard", active: true },
              { label: "Tours", active: false },
              { label: "Guides", active: false },
            ].map((item) => (
              <a key={item.label} href="#" style={{
                padding: "6px 12px", borderRadius: 8, fontSize: 14, fontWeight: 500,
                background: item.active ? "var(--muted)" : "transparent",
                color: item.active ? "var(--foreground)" : "var(--muted-foreground)",
                transition: "all 0.15s",
              }}>
                {item.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Search */}
        <div style={{ flex: 1, maxWidth: 340, position: "relative" }}>
          <Search size={16} style={{
            position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)",
            color: "var(--muted-foreground)", pointerEvents: "none",
          }} />
          <input
            type="search"
            placeholder={role === "guide" ? "Search bookings, travelers…" : "Search tours, guides…"}
            style={{
              width: "100%", height: 36, borderRadius: 999,
              border: "1px solid var(--border)", background: "var(--card)",
              padding: "0 14px 0 36px", fontSize: 13, outline: "none", color: "var(--foreground)",
            }}
          />
        </div>

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <button
            onClick={() => navigate(`/dashboard/${otherRole}`)}
            style={{
              padding: "6px 14px", borderRadius: 999,
              border: "1px solid var(--border)", background: "var(--card)",
              fontSize: 12, fontWeight: 500, color: "var(--muted-foreground)", cursor: "pointer",
            }}
          >
            View as {otherRole}
          </button>

          <IconButton aria-label="Notifications" badge={pendingCount > 0 ? String(pendingCount) : undefined} badgeTone="primary">
            <Bell size={20} />
          </IconButton>

          <IconButton aria-label="Messages" dot={unreadMessages > 0}>
            <MessageCircle size={20} />
          </IconButton>

          <div className="avatar avatar-secondary" style={{ width: 36, height: 36, marginLeft: 4, outline: "2px solid var(--card)" }}>
            {role === "guide" ? "YR" : "TR"}
          </div>
        </div>
      </div>
    </header>
  );
}

function IconButton({ children, badge, dot, badgeTone = "primary", ...props }) {
  return (
    <button className="btn-icon" {...props}>
      {children}
      {badge && (
        <span style={{
          position: "absolute", top: -2, right: -2, minWidth: 16, height: 16,
          borderRadius: 999, padding: "0 4px", fontSize: 10, fontWeight: 700,
          color: "white", display: "flex", alignItems: "center", justifyContent: "center",
          background: badgeTone === "primary" ? "var(--primary)" : "var(--secondary)",
          outline: "2px solid var(--card)",
        }}>
          {badge}
        </span>
      )}
      {dot && !badge && (
        <span style={{
          position: "absolute", top: 6, right: 6, width: 8, height: 8,
          borderRadius: 999, background: "var(--destructive)", outline: "2px solid var(--card)",
        }} />
      )}
    </button>
  );
}
