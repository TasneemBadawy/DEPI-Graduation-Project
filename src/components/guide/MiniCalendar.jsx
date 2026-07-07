// Matches MiniCalendar from dashboard_guide.tsx exactly
export default function MiniCalendar() {
  const today = 12;
  const busy = new Set([12,14,16,18,20,24]);
  const days = Array.from({ length: 35 }, (_, i) => i - 3);
  const weekDays = ["S","M","T","W","T","F","S"];

  return (
    <div className="card" style={{ padding:20 }}>
      <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16 }}>
        <h3 style={{ fontSize:15, fontWeight:600, letterSpacing:"-0.01em", color:"var(--foreground)" }}>May 2026</h3>
        <span style={{ fontSize:12, color:"var(--muted-foreground)" }}>6 booked</span>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:4, textAlign:"center", marginBottom:4 }}>
        {weekDays.map((d,i) => (
          <div key={i} style={{ fontSize:10, fontWeight:500, textTransform:"uppercase", letterSpacing:"0.05em", color:"var(--muted-foreground)", padding:"4px 0" }}>{d}</div>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(7,1fr)", gap:4 }}>
        {days.map((d,i) => {
          const valid = d > 0 && d <= 31;
          const isToday = d === today;
          const isBusy  = busy.has(d);
          let bg = "transparent", color = "var(--muted-foreground)", fontWeight = 400;
          if (valid && !isBusy && !isToday) color = "var(--foreground)";
          if (isBusy && !isToday) { bg="oklch(0.52 0.13 195 / 0.15)"; color="oklch(0.52 0.13 195)"; fontWeight=600; }
          if (isToday) { bg="var(--gradient-warm)"; color="var(--primary-foreground)"; fontWeight=600; }
          return (
            <div key={i} style={{
              aspectRatio:"1", display:"flex", alignItems:"center", justifyContent:"center",
              borderRadius:6, fontSize:12, background:bg, color, fontWeight,
              opacity: valid ? 1 : 0.25,
            }}>
              {valid ? d : ""}
            </div>
          );
        })}
      </div>
      <div style={{ marginTop:16, display:"flex", alignItems:"center", gap:12, fontSize:11, color:"var(--muted-foreground)" }}>
        <span style={{ display:"inline-flex", alignItems:"center", gap:6 }}>
          <span style={{ width:8, height:8, borderRadius:"50%", background:"oklch(0.52 0.13 195 / 0.4)", display:"inline-block" }} /> Booked
        </span>
        <span style={{ display:"inline-flex", alignItems:"center", gap:6 }}>
          <span style={{ width:8, height:8, borderRadius:"50%", background:"var(--primary)", display:"inline-block" }} /> Today
        </span>
      </div>
    </div>
  );
}
