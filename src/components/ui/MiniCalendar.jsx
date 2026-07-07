"use client";

export default function MiniCalendar() {
  const today = 12;
  const busy = new Set([12, 14, 16, 18, 20, 24]);
  const days = Array.from({ length: 35 }, (_, i) => i - 3);

  const getDayClass = (d) => {
    const valid = d > 0 && d <= 31;
    if (!valid) return "cal-day cal-day-empty";
    if (d === today) return "cal-day cal-day-today";
    if (busy.has(d)) return "cal-day cal-day-busy";
    return "cal-day cal-day-valid";
  };

  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h3 style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.2px", margin: 0 }}>May 2026</h3>
        <span style={{ fontSize: 12, color: "var(--muted-foreground)" }}>6 booked</span>
      </div>
      <div style={{ marginTop: 16, display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, textAlign: "center" }}>
        {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
          <div key={i} style={{ fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--muted-foreground)", padding: "4px 0" }}>
            {d}
          </div>
        ))}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4, marginTop: 4 }}>
        {days.map((d, i) => (
          <div key={i} className={getDayClass(d)}>
            {d > 0 && d <= 31 ? d : ""}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 16, display: "flex", gap: 14, fontSize: 11, color: "var(--muted-foreground)" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "oklch(0.52 0.12 175 / 0.4)", display: "inline-block" }} />
          Booked
        </span>
        <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 8, height: 8, borderRadius: "50%", background: "var(--primary)", display: "inline-block" }} />
          Today
        </span>
      </div>
    </div>
  );
}
