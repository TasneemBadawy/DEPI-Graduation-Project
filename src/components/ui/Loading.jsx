"use client";

export default function Loading({ label = "Loading..." }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", alignItems: "center",
      justifyContent: "center", minHeight: 300, gap: 14,
    }}>
      <div style={{
        width: 32, height: 32,
        border: "2.5px solid var(--muted)", borderTopColor: "var(--primary)",
        borderRadius: "50%", animation: "spin 0.85s linear infinite",
      }} />
      <p style={{ fontSize: 13, color: "var(--muted-foreground)", margin: 0 }}>{label}</p>
    </div>
  );
}
