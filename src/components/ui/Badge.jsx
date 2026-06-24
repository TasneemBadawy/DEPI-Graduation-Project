import { } from "react";

const BADGE_STYLES = {
  "confirmed":    { bg: "#E1F5EE", color: "#0F6E56", icon: "✓", label: "Confirmed" },
  "pending guide":{ bg: "#FAEEDA", color: "#854F0B", icon: "⏳", label: "Pending Guide" },
  "pending":      { bg: "#FAEEDA", color: "#854F0B", icon: "⏳", label: "Pending" },
  "completed":    { bg: "#E6F1FB", color: "#185FA5", icon: "★", label: "Completed" },
  "declined":     { bg: "#FCEBEB", color: "#A32D2D", icon: "✕", label: "Declined" },
  "accepted":     { bg: "#E1F5EE", color: "#0F6E56", icon: "✓", label: "Accepted" },
  "new":          { bg: "#FAECE7", color: "#993C1D", icon: "",  label: "New" },
};

export default function Badge({ type = "confirmed", children }) {
  const s = BADGE_STYLES[type] ?? BADGE_STYLES["confirmed"];
  return (
    <span style={{
      background: s.bg, color: s.color,
      padding: "3px 10px", borderRadius: 999,
      fontSize: 12, fontWeight: 500,
      display: "inline-flex", alignItems: "center", gap: 4,
    }}>
      {s.icon && <span style={{ fontSize: 10 }}>{s.icon}</span>}
      {children ?? s.label}
    </span>
  );
}
