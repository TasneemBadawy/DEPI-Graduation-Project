"use client";
import { useState, useMemo } from "react";
import {
  Plus, Plane, MapPin, CalendarIcon, Clock, Users,
  Star, ChevronRight, Heart, GripVertical, Sparkles,
} from "lucide-react";

import StatusPill from "../ui/StatusPill";
import Navbar from "../ui/Navbar";

/* ── Types ── */

/* ── Seed data (mirrors design) ── */
const BOOKINGS = [
  { id: "b1", title: "Pyramids of Giza & Sphinx — Private Half Day", guide: { name: "Yara Adel", rating: 4.92 }, city: "Giza, Egypt", date: "May 12, 2026 · 08:30", duration: "4h", travelers: 2, price: 240, status: "Confirmed" },
  { id: "b2", title: "Felucca Sunset on the Nile", guide: { name: "Mahmoud Said", rating: 4.88 }, city: "Cairo, Egypt", date: "May 14, 2026 · 17:30", duration: "2h", travelers: 2, price: 90, status: "Pending Guide" },
  { id: "b3", title: "Valley of the Kings & Karnak", guide: { name: "Nadia El-Sayed", rating: 4.95 }, city: "Luxor, Egypt", date: "May 16, 2026 · 06:00", duration: "Full day", travelers: 2, price: 320, status: "Confirmed" },
  { id: "b4", title: "Red Sea Snorkeling Adventure", guide: { name: "Omar Hassan", rating: 4.9 }, city: "Hurghada, Egypt", date: "Apr 22, 2026", duration: "5h", travelers: 2, price: 180, status: "Completed" },
];

const TABS = ["All", "Confirmed", "Pending Guide", "Completed"];

const ITINERARY = [
  { day: "Day 1", title: "Arrival & rest",         time: "—",     tone: "muted"     },
  { day: "Day 2", title: "Pyramids of Giza tour",  time: "08:30", tone: "primary"   },
  { day: "Day 3", title: "Khan el-Khalili Bazaar", time: "Free",  tone: "muted"     },
  { day: "Day 4", title: "Felucca Sunset on Nile", time: "17:30", tone: "secondary" },
  { day: "Day 5", title: "Fly to Luxor",           time: "06:00", tone: "muted"     },
  { day: "Day 6", title: "Karnak & Valley of Kings",time:"06:00", tone: "primary"   },
  { day: "Day 7", title: "Departure",              time: "—",     tone: "muted"     },
];

const SAVED = [
  { title: "White Desert Overnight Camp", city: "Bahariya", price: 220 },
  { title: "Hot Air Balloon over Luxor",  city: "Luxor",    price: 145 },
  { title: "Cairo Street Food Walk",      city: "Cairo",    price: 55  },
];

function dayBoxStyle(tone) {
  if (tone === "primary")   return { background: "oklch(0.62 0.18 42 / 0.1)",  color: "var(--primary)"  };
  if (tone === "secondary") return { background: "oklch(0.52 0.12 175 / 0.15)", color: "oklch(0.52 0.12 175)" };
  return { background: "var(--muted)", color: "var(--muted-foreground)" };
}

/* ── Component ── */

export default function TouristDashboard({ user }) {
  const [tab, setTab] = useState("All");

  const filtered = useMemo(
    () => (tab === "All" ? BOOKINGS : BOOKINGS.filter((b) => b.status === tab)),
    [tab],
  );

  const next = BOOKINGS.find((b) => b.status === "Confirmed");

  return (
    <div style={{ minHeight: "100vh", background: "var(--background)" }}>
      <Navbar role="tourist" pendingCount={1} unreadMessages={2} />

      <main style={{ margin: "0 auto", maxWidth: 1280, padding: "32px 24px" }}>

        {/* Greeting */}
        <section style={{ marginBottom: 32, display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 16 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "oklch(0.52 0.12 175)", margin: 0 }}>My Trips</p>
            <h1 style={{ marginTop: 4, fontSize: 32, fontWeight: 600, letterSpacing: "-0.5px", margin: "4px 0 6px" }}>
              Welcome back, {user.name.split(" ")[0]}
            </h1>
            <p style={{ fontSize: 14, color: "var(--muted-foreground)", margin: 0 }}>
              Your next adventure starts in <strong style={{ color: "var(--foreground)" }}>13 days</strong>.
            </p>
          </div>
          <button className="btn btn-warm" style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Plus size={16} /> Book new tour
          </button>
        </section>

        {/* Hero next-trip card */}
        {next && (
          <section className="card-3xl" style={{ overflow: "hidden", marginBottom: 24 }}>
            <div style={{ display: "grid", gridTemplateColumns: "1.1fr 1fr" }}>
              {/* Image side */}
              <div style={{ position: "relative", minHeight: 240, background: "oklch(0.25 0.04 240)" }}>
                <div style={{ position: "absolute", inset: 0, background: "linear-gradient(135deg, oklch(0.15 0.02 60 / 0.6), oklch(0.15 0.02 60 / 0.1), transparent)" }} />
                <div style={{
                  position: "absolute", bottom: 16, left: 16,
                  display: "flex", alignItems: "center", gap: 8,
                  background: "rgba(255,255,255,0.92)", backdropFilter: "blur(8px)",
                  borderRadius: 999, padding: "4px 12px", fontSize: 12, fontWeight: 600,
                }}>
                  <Plane size={13} style={{ color: "var(--primary)" }} /> Next up
                </div>
              </div>
              {/* Info side */}
              <div style={{ padding: 24, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <StatusPill status={next.status} />
                    <span style={{ fontSize: 12, color: "var(--muted-foreground)" }}>Booking #NMD-{next.id.toUpperCase()}</span>
                  </div>
                  <h2 style={{ marginTop: 12, fontSize: 22, fontWeight: 600, letterSpacing: "-0.3px", margin: "12px 0 8px" }}>{next.title}</h2>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 16px", fontSize: 13, color: "var(--muted-foreground)" }}>
                    <span style={{ display: "flex", alignItems: "center", gap: 5 }}><MapPin size={15} />{next.city}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 5 }}><CalendarIcon size={15} />{next.date}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 5 }}><Clock size={15} />{next.duration}</span>
                  </div>
                  <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 12, borderRadius: 14, background: "var(--muted)", padding: 12 }}>
                    <div className="avatar avatar-secondary" style={{ width: 40, height: 40 }}>YA</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 500, margin: 0 }}>Guided by {next.guide.name}</p>
                      <p style={{ fontSize: 12, color: "var(--muted-foreground)", display: "flex", alignItems: "center", gap: 4, margin: 0 }}>
                        <Star size={11} style={{ fill: "var(--primary)", color: "var(--primary)" }} />
                        {next.guide.rating} · Verified guide
                      </p>
                    </div>
                    <button className="btn btn-outline btn-sm">Message</button>
                  </div>
                </div>
                <div style={{ marginTop: 20, display: "flex", flexWrap: "wrap", gap: 8 }}>
                  <button className="btn btn-outline btn-sm">View tickets</button>
                  <button className="btn btn-outline btn-sm">Reschedule</button>
                  <button className="btn btn-ghost btn-sm" style={{ color: "var(--destructive)" }}>Cancel</button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Bookings + Sidebar */}
        <section style={{ display: "grid", gridTemplateColumns: "1fr 300px", gap: 24 }}>

          {/* My Bookings */}
          <div className="card" style={{ padding: 0, overflow: "hidden" }}>
            <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between", gap: 12, borderBottom: "1px solid var(--border-faint)", padding: "16px 24px" }}>
              <div>
                <h2 style={{ fontSize: 17, fontWeight: 600, letterSpacing: "-0.2px", margin: 0 }}>My Bookings</h2>
                <p style={{ fontSize: 12, color: "var(--muted-foreground)", margin: "2px 0 0" }}>Track every trip from request to memories.</p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 4, background: "var(--muted)", borderRadius: 999, padding: 4 }}>
                {TABS.map((t) => (
                  <button key={t} onClick={() => setTab(t)} style={{
                    padding: "5px 12px", borderRadius: 999, fontSize: 12, fontWeight: 500,
                    border: "none", cursor: "pointer", transition: "all 0.15s",
                    background: tab === t ? "var(--card)" : "transparent",
                    color: tab === t ? "var(--foreground)" : "var(--muted-foreground)",
                    boxShadow: tab === t ? "0 1px 3px rgba(0,0,0,0.1)" : "none",
                  }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }} className="divide-y">
              {filtered.map((b) => (
                <li key={b.id} style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: 16, padding: "20px 24px" }}>
                  <div style={{ width: 112, height: 80, borderRadius: 12, background: "oklch(0.92 0.04 155)", flexShrink: 0 }} />
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 8 }}>
                      <StatusPill status={b.status} />
                      <span style={{ fontSize: 12, color: "var(--muted-foreground)" }}>{b.city}</span>
                    </div>
                    <p style={{ marginTop: 4, fontSize: 14, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", margin: "4px 0 4px" }}>{b.title}</p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "2px 16px", fontSize: 12, color: "var(--muted-foreground)" }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}><CalendarIcon size={12} />{b.date}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Clock size={12} />{b.duration}</span>
                      <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Users size={12} />{b.travelers}</span>
                      <span style={{ fontWeight: 500, color: "var(--foreground)" }}>${b.price}</span>
                    </div>
                    <p style={{ marginTop: 4, fontSize: 12, color: "var(--muted-foreground)", margin: "4px 0 0" }}>Guide · {b.guide.name}</p>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8, flexShrink: 0 }}>
                    <button className="btn btn-ghost btn-sm" style={{ color: "oklch(0.52 0.12 175)", display: "flex", alignItems: "center", gap: 4 }}>
                      Details <ChevronRight size={14} />
                    </button>
                    {b.status === "Completed" && (
                      <button className="btn btn-outline btn-sm">Leave review</button>
                    )}
                  </div>
                </li>
              ))}
              {filtered.length === 0 && (
                <li style={{ padding: "48px 24px", textAlign: "center", fontSize: 13, color: "var(--muted-foreground)" }}>
                  No bookings in this category yet.
                </li>
              )}
            </ul>
          </div>

          {/* Sidebar */}
          <aside style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Itinerary */}
            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border-faint)", padding: "16px 20px" }}>
                <div>
                  <h2 style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.2px", margin: 0 }}>Cairo Itinerary</h2>
                  <p style={{ fontSize: 12, color: "var(--muted-foreground)", margin: "2px 0 0" }}>May 12 – May 18 · 7 days</p>
                </div>
                <button className="btn btn-ghost" style={{ width: 32, height: 32, padding: 0, borderRadius: 8 }}><Plus size={16} /></button>
              </div>
              <ul style={{ listStyle: "none", padding: "10px 12px", margin: 0, display: "flex", flexDirection: "column", gap: 2 }}>
                {ITINERARY.map((item, i) => (
                  <li key={i}
                    style={{ display: "flex", alignItems: "center", gap: 8, borderRadius: 12, padding: "8px", cursor: "default", transition: "background 0.15s" }}
                    onMouseEnter={(e) => { (e.currentTarget).style.background = "var(--muted)"; }}
                    onMouseLeave={(e) => { (e.currentTarget).style.background = "transparent"; }}
                  >
                    <GripVertical size={16} style={{ color: "var(--muted-foreground)", opacity: 0.4, flexShrink: 0 }} />
                    <div style={{ ...dayBoxStyle(item.tone), width: 44, height: 36, borderRadius: 8, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                      {item.day}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <p style={{ fontSize: 13, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", margin: 0 }}>{item.title}</p>
                      <p style={{ fontSize: 11, color: "var(--muted-foreground)", margin: 0 }}>{item.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
              <div style={{ borderTop: "1px solid var(--border-faint)", padding: "12px 20px" }}>
                <button className="btn btn-outline" style={{ width: "100%", justifyContent: "center" }}>Manage itinerary</button>
              </div>
            </div>

            {/* Saved tours */}
            <div className="card" style={{ padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.2px", margin: 0 }}>Saved tours</h3>
                <Heart size={16} style={{ color: "var(--primary)" }} />
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: "14px 0 0", display: "flex", flexDirection: "column", gap: 12 }}>
                {SAVED.map((s) => (
                  <li key={s.title} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", margin: 0 }}>{s.title}</p>
                      <p style={{ fontSize: 12, color: "var(--muted-foreground)", margin: 0 }}>{s.city}</p>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 600, color: "var(--primary)", flexShrink: 0 }}>${s.price}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Referral CTA */}
            <div style={{ borderRadius: 16, border: "1px solid oklch(0.62 0.18 42 / 0.2)", background: "var(--gradient-warm)", padding: 20, color: "white", boxShadow: "var(--shadow-soft)" }}>
              <Sparkles size={20} />
              <p style={{ marginTop: 12, fontSize: 15, fontWeight: 600, margin: "12px 0 4px" }}>Unlock 10% off your next tour</p>
              <p style={{ fontSize: 12, opacity: 0.85, margin: "0 0 16px" }}>
                Refer a friend and you both get a discount on your next adventure.
              </p>
              <button style={{ background: "white", color: "var(--foreground)", border: "none", borderRadius: 8, padding: "7px 16px", fontSize: 13, fontWeight: 500, cursor: "pointer" }}>
                Invite friends
              </button>
            </div>
          </aside>
        </section>
      </main>
    </div>
  );
}
