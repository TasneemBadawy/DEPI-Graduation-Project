import { CalendarIcon, Clock, Users } from "lucide-react";
import { Booking } from "../../lib/api";
import StatusPill from "./StatusPill";

export default function BookingCard({ booking, onLeaveReview }) {
  const { status, location, tourTitle, date, time, duration, travelers, price, guideName } = booking;
  return (
    <div style={{ background: "var(--card)", borderRadius: 14, border: "1px solid var(--border-faint)", padding: "14px 16px", display: "flex", gap: 14, alignItems: "flex-start" }}>
      <div style={{ width: 64, height: 64, borderRadius: 10, background: "oklch(0.92 0.04 155)", flexShrink: 0 }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, flexWrap: "wrap" }}>
          <div>
            <StatusPill status={status} />
            <p style={{ fontSize: 11, color: "var(--muted-foreground)", margin: "4px 0 2px" }}>{location}</p>
            <p style={{ fontSize: 15, fontWeight: 600, margin: 0 }}>{tourTitle}</p>
          </div>
          <p style={{ fontSize: 15, fontWeight: 600, margin: 0, whiteSpace: "nowrap" }}>${price}</p>
        </div>
        <div style={{ display: "flex", gap: 12, marginTop: 6, flexWrap: "wrap", alignItems: "center" }}>
          <span style={{ fontSize: 12, color: "var(--muted-foreground)", display: "flex", alignItems: "center", gap: 4 }}><CalendarIcon size={12} /> {date}{time ? ` · ${time}` : ""}</span>
          <span style={{ fontSize: 12, color: "var(--muted-foreground)", display: "flex", alignItems: "center", gap: 4 }}><Clock size={12} /> {duration}</span>
          <span style={{ fontSize: 12, color: "var(--muted-foreground)", display: "flex", alignItems: "center", gap: 4 }}><Users size={12} /> {travelers}</span>
          <span style={{ fontSize: 12, color: "var(--muted-foreground)" }}>Guide · {guideName}</span>
          {status === "completed" && onLeaveReview && (
            <button onClick={() => onLeaveReview(booking)} style={{ marginLeft: "auto", background: "none", border: "1px solid var(--border)", borderRadius: 7, padding: "4px 12px", fontSize: 12, color: "var(--muted-foreground)", cursor: "pointer" }}>
              Leave review
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
