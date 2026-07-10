"use client";
import { Compass } from "lucide-react";

export default function Navbar({ role = "guide" }) {
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
        {/* Logo */}
        <a href="/" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div className="icon-box-warm" style={{ width: 36, height: 36, borderRadius: "0.75rem" }}>
            <Compass size={18} />
          </div>
          <span style={{ fontSize: 17, fontWeight: 600, letterSpacing: "-0.3px" }}>Nomade</span>
        </a>

        {/* Avatar */}
        <div className="avatar avatar-secondary" style={{ width: 36, height: 36, outline: "2px solid var(--card)" }}>
          {role === "guide" ? "YR" : "TR"}
        </div>
      </div>
    </header>
  );
}
