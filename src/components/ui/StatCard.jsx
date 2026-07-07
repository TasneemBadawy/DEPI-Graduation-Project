

export default function StatCard({ label, value, delta, Icon, accent = "primary" }) {
  return (
    <div
      className="card"
      style={{ padding: 20, flex: 1, minWidth: 0, transition: "transform 0.15s", cursor: "default" }}
      onMouseEnter={(e) => { (e.currentTarget).style.transform = "translateY(-2px)"; }}
      onMouseLeave={(e) => { (e.currentTarget).style.transform = "translateY(0)"; }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: 11, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--muted-foreground)" }}>
          {label}
        </span>
        <div className={accent === "primary" ? "icon-box-warm" : "icon-box-secondary"}>
          <Icon size={16} />
        </div>
      </div>
      <div style={{ marginTop: 16, fontSize: 30, fontWeight: 600, letterSpacing: "-0.5px", color: "var(--foreground)" }}>
        {value}
      </div>
      <div style={{ marginTop: 4, fontSize: 12, color: "var(--muted-foreground)" }}>{delta}</div>
    </div>
  );
}
