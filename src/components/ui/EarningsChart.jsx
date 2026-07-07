

export default function EarningsChart({ data }) {
  if (!data.length) return null;
  const max = Math.max(...data.map((d) => d.value), 1);

  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 100 }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <div style={{
            width: "100%", borderRadius: "6px 6px 0 0",
            height: `${Math.max((d.value / max) * 84, 4)}px`,
            background: i === data.length - 1 ? "var(--gradient-warm)" : "oklch(0.52 0.12 175 / 0.25)",
            transition: "height 0.3s ease",
          }} />
          <span style={{ fontSize: 11, color: "var(--muted-foreground)" }}>{d.label}</span>
        </div>
      ))}
    </div>
  );
}
