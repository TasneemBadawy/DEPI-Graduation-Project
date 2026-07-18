"use client";
import { useState } from "react";
import { Check, X, CalendarIcon, Users, DollarSign } from "lucide-react";
import { updateBookingStatus } from "../../lib/bookingStore";

function getInitials(name) {
  if (!name) return "U";
  return name.split(" ").map((p) => p[0]).join("").toUpperCase().slice(0, 2);
}

export default function PendingRequestCard({ request, onUpdate }) {
  const [loading, setLoading] = useState(false);

  const handle = async (id, status) => {
    setLoading(true);
    try {
      // Update booking status in localStorage
      updateBookingStatus(id, status);
      // Call the onUpdate callback to refresh the parent component
      if (onUpdate) {
        await onUpdate();
      }
    } catch (e) {
      console.error("Error updating booking status:", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: "var(--card)", borderRadius: 14, border: "1px solid var(--border-faint)", padding: "16px 18px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
        <div className="avatar avatar-secondary" style={{ width: 44, height: 44, fontSize: 14, outline: "2px solid var(--card)" }}>
          {getInitials(request.touristName)}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <p style={{ fontWeight: 500, fontSize: 14, margin: 0 }}>{request.touristName}</p>
            <span style={{ fontSize: 12, color: "var(--muted-foreground)" }}>{request.ago ?? request.receivedAgo ?? "Just now"}</span>
          </div>
          <p style={{ fontSize: 12, color: "var(--muted-foreground)", margin: 0 }}>{request.touristCountry}</p>
        </div>
      </div>
      <p style={{ fontWeight: 500, fontSize: 14, margin: "0 0 4px" }}>{request.tourTitle}</p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: request.note ? 8 : 12 }}>
        <span style={{ fontSize: 12, color: "var(--muted-foreground)", display: "flex", alignItems: "center", gap: 4 }}>
          <CalendarIcon size={13} /> {request.date} {request.time && `· ${request.time}`}
        </span>
        <span style={{ fontSize: 12, color: "var(--muted-foreground)", display: "flex", alignItems: "center", gap: 4 }}>
          <Users size={13} /> {request.travelers} traveler{request.travelers > 1 ? 's' : ''}
        </span>
        <span style={{ fontSize: 12, color: "var(--primary)", fontWeight: 500, display: "flex", alignItems: "center", gap: 4 }}>
          <DollarSign size={13} />{request.price || request.total}
        </span>
        {request.paymentMethod && (
          <span style={{ fontSize: 11, color: "var(--muted-foreground)", display: "flex", alignItems: "center", gap: 4 }}>
            💳 {request.paymentMethod}
          </span>
        )}
      </div>
      {request.note && (
        <div style={{ background: "var(--muted)", borderRadius: 8, padding: "8px 12px", marginBottom: 12 }}>
          <p style={{ fontSize: 13, color: "var(--muted-foreground)", margin: 0, fontStyle: "italic" }}>
            &ldquo;{request.note}&rdquo;
          </p>
        </div>
      )}
      <div style={{ display: "flex", gap: 8 }}>
        <button 
          className="btn btn-warm btn-sm" 
          onClick={() => handle(request.id, "accepted")} 
          disabled={loading} 
          style={{ opacity: loading ? 0.7 : 1 }}
        >
          <Check size={14} /> {loading ? "Accepting…" : "Accept"}
        </button>
        <button 
          className="btn btn-danger btn-sm" 
          style={{ border: "1px solid oklch(0.55 0.22 27 / 0.3)", borderRadius: 8, padding: "5px 12px" }} 
          onClick={() => handle(request.id, "declined")} 
          disabled={loading}
        >
          <X size={14} /> {loading ? "Declining…" : "Decline"}
        </button>
      </div>
    </div>
  );
}