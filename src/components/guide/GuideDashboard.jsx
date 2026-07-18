"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  DollarSign,
  Check,
  Bell,
  Star,
  X,
  CalendarIcon,
  Users,
  Clock,
  MapPin,
  ChevronRight,
  ArrowUpRight,
  Settings,
  Pencil,
  Loader2,
} from "lucide-react";

import Navbar from "../ui/Navbar";
import StatCard from "../ui/StatCard";
import MiniCalendar from "../ui/MiniCalendar";
import Avatar from "../ui/Avatar";
import { setCurrentUser } from "../../lib/auth";
import { updateGuide, getGuideById } from "../../lib/guideStore";
import { uploadProfileImage, getProfileImageUrl, validateImageFile } from "../../lib/uploadStore";

/* ── Seed data (mirrors design) ── */
const SEED_REQUESTS = [
  { id: "r1", tourist: { name: "Sofia Martinez", country: "Spain" }, tour: "Pyramids of Giza & Sphinx — Private Half Day", date: "May 12, 2026 · 08:30", travelers: 2, total: 240, message: "Hi! We'd love a slower pace with extra time at the Sphinx for photos.", receivedAgo: "2h ago", status: "pending" },
  { id: "r2", tourist: { name: "Liam O'Connor", country: "Ireland" }, tour: "Old Cairo Walking Tour", date: "May 14, 2026 · 16:00", travelers: 4, total: 180, message: "Looking for something engaging for kids ages 9 and 12.", receivedAgo: "5h ago", status: "pending" },
  { id: "r3", tourist: { name: "Hana Tanaka", country: "Japan" }, tour: "Felucca Sunset on the Nile", date: "May 18, 2026 · 17:30", travelers: 2, total: 90, message: "Vegetarian-friendly snacks if possible — thank you!", receivedAgo: "1d ago", status: "pending" },
];

const UPCOMING = [
  { day: "MON", date: "12", title: "Pyramids of Giza — Private", time: "08:30 · 4h", guests: 2, city: "Giza" },
  { day: "WED", date: "14", title: "Khan el-Khalili Bazaar Walk", time: "10:00 · 3h", guests: 3, city: "Cairo" },
  { day: "FRI", date: "16", title: "Coptic Cairo & Citadel", time: "09:00 · 6h", guests: 5, city: "Cairo" },
  { day: "SUN", date: "18", title: "Felucca Sunset Sail", time: "17:30 · 2h", guests: 2, city: "Cairo" },
];

const EARNINGS_WEEKS = [
  { label: "W1", value: 320 }, { label: "W2", value: 540 }, { label: "W3", value: 410 },
  { label: "W4", value: 720 }, { label: "W5", value: 880 }, { label: "W6", value: 640 },
  { label: "W7", value: 980 }, { label: "W8", value: 1140 },
];

function getInitials(name) {
  return name.split(" ").map((p) => p[0]).join("").toUpperCase();
}

const DEFAULT_PROFILE = {
  about: "",
  cities: [],
  languages: [],
  specializations: [],
};

/* ── Component ── */

export default function GuideDashboard({ user }) {
  const navigate = useNavigate();
  const [requests, setRequests] = useState(SEED_REQUESTS);
  const [name, setName] = useState(user?.name || "");
  const [profile, setProfile] = useState({ ...DEFAULT_PROFILE, ...user?.profile });
  const [profileImage, setProfileImage] = useState(user?.profileImage || null);
  const [editOpen, setEditOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const fileInputRef = useRef(null);
  
  const pendingCount = requests.filter((r) => r.status === "pending").length;

  // Load guide data from backend
  useEffect(() => {
    const loadGuideData = async () => {
      if (!user?.id && !user?.Guide_ID) {
        setIsLoading(false);
        return;
      }
      
      try {
        const guideId = user.id || user.Guide_ID;
        const guideData = await getGuideById(guideId);
        if (guideData) {
          setName(guideData.FName + " " + guideData.LName || user.name);
          setProfile({
            about: guideData.About || "",
            cities: guideData.cities || [],
            languages: guideData.languages || [],
            specializations: guideData.specializations || [],
          });
          if (guideData.Profile_Image) {
            setProfileImage(getProfileImageUrl(guideData.Profile_Image));
          }
        }
      } catch (err) {
        console.error("Error loading guide data:", err);
      } finally {
        setIsLoading(false);
      }
    };
    loadGuideData();
  }, [user]);

  const stats = useMemo(() => [
    { label: "Earnings (30d)", value: "$4,820", delta: "+18%", Icon: DollarSign, accent: "primary" },
    { label: "Tours Completed", value: "23", delta: "+4", Icon: Check, accent: "secondary" },
    { label: "New Requests", value: String(pendingCount), delta: "Action needed", Icon: Bell, accent: "primary" },
    { label: "Avg. Rating", value: "4.92", delta: "From 187 reviews", Icon: Star, accent: "secondary" },
  ], [pendingCount]);

  const respond = (id, status) =>
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));

  const max = Math.max(...EARNINGS_WEEKS.map((x) => x.value));

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);
    if (!validation.valid) {
      setError(validation.error);
      return;
    }

    setUploading(true);
    setError("");
    
    try {
      const guideId = user.id || user.Guide_ID;
      if (!guideId) throw new Error("Guide ID not found");

      const result = await uploadProfileImage(file, guideId, "guide");
      
      const imageUrl = getProfileImageUrl(result.Profile_Image);
      setProfileImage(imageUrl);
      
      const currentUser = JSON.parse(localStorage.getItem("nomade_current_user") || "{}");
      const updatedUser = {
        ...currentUser,
        profileImage: result.Profile_Image,
      };
      setCurrentUser(updatedUser);
      
      setSuccess("Profile photo updated successfully!");
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("Error uploading image:", err);
      setError(err.message || "Failed to upload image");
      setTimeout(() => setError(""), 3000);
    } finally {
      setUploading(false);
    }
  };

  const handleSaveProfile = async (updated) => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const guideId = user.id || user.Guide_ID;
      if (!guideId) throw new Error("Guide ID not found");

      const updateData = {
        FName: updated.name.split(" ")[0] || "",
        LName: updated.name.split(" ").slice(1).join(" ") || "",
        Email: updated.email || "",
        About: updated.profile.about || "",
        FaceBook: updated.facebook || "",
        Linkedin: updated.linkedin || "",
        Instagram: updated.instagram || "",
        phoneNumbers: updated.phoneNumbers || [],
        languages: updated.profile.languages || [],
        specializations: updated.profile.specializations || [],
      };

      await updateGuide(guideId, updateData);

      setName(updated.name);
      setProfile(updated.profile);

      const currentUser = JSON.parse(localStorage.getItem("nomade_current_user") || "{}");
      const updatedUser = {
        ...currentUser,
        name: updated.name,
        email: updated.email,
        profile: { ...currentUser.profile, ...updated.profile },
      };
      setCurrentUser(updatedUser);

      setSuccess("Profile updated successfully!");
      setEditOpen(false);

      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      console.error("Error saving profile:", err);
      setError(err.message || "Failed to save profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--background)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p>Loading your profile...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--background)" }}>
      <Navbar role="guide" />

      <main style={{ margin: "0 auto", maxWidth: 1280, padding: "32px 24px" }}>

        {/* Greeting */}
        <section style={{ marginBottom: 32, display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 16 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.08em", color: "oklch(0.52 0.12 175)", margin: 0 }}>
              Guide Workspace
            </p>
            <h1 style={{ marginTop: 4, fontSize: 32, fontWeight: 600, letterSpacing: "-0.5px", color: "var(--foreground)", margin: "4px 0 6px" }}>
              Welcome back, {name.split(" ")[0] || "Guide"}
            </h1>
            <p style={{ fontSize: 14, color: "var(--muted-foreground)", margin: 0 }}>
              You have <strong style={{ color: "var(--foreground)" }}>{pendingCount} pending requests</strong> and{" "}
              <strong style={{ color: "var(--foreground)" }}>4 tours</strong> scheduled this week.
            </p>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-outline btn-sm"><CalendarIcon size={14} /> Block dates</button>
            <button className="btn btn-warm btn-sm" onClick={() => navigate("/dashboard/guide/tours")}><Settings size={14} /> Tour settings</button>
          </div>
        </section>

        {error && (
          <div style={{ background: "var(--destructive)", color: "white", padding: 12, borderRadius: 10, marginBottom: 16 }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ background: "var(--success)", color: "white", padding: 12, borderRadius: 10, marginBottom: 16 }}>
            {success}
          </div>
        )}

        {/* Stats */}
        <section style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 24 }}>
          {stats.map((s) => <StatCard key={s.label} {...s} />)}
        </section>

        {/* Main grid */}
        <section style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 24 }}>

          {/* Left column */}
          <div>
            {/* Pending requests */}
            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border-faint)", padding: "16px 24px" }}>
                <div>
                  <h2 style={{ fontSize: 17, fontWeight: 600, letterSpacing: "-0.2px", margin: 0 }}>Pending requests</h2>
                  <p style={{ fontSize: 12, color: "var(--muted-foreground)", margin: "2px 0 0" }}>Respond within 24h to keep your response score high.</p>
                </div>
                <span className="pill pill-primary">{pendingCount} new</span>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }} className="divide-y">
                {requests.map((r) => (
                  <li key={r.id} style={{ padding: "20px 24px" }}>
                    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: 16 }}>
                      <div style={{ display: "flex", alignItems: "flex-start", gap: 12, flex: 1, minWidth: 0 }}>
                        <div className="avatar avatar-secondary" style={{ width: 44, height: 44, fontSize: 14, outline: "2px solid var(--card)" }}>
                          {getInitials(r.tourist.name)}
                        </div>
                        <div style={{ minWidth: 0, flex: 1 }}>
                          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 6 }}>
                            <span style={{ fontWeight: 500, fontSize: 14 }}>{r.tourist.name}</span>
                            <span style={{ fontSize: 12, color: "var(--muted-foreground)" }}>· {r.tourist.country}</span>
                            <span style={{ fontSize: 12, color: "var(--muted-foreground)" }}>· {r.receivedAgo}</span>
                          </div>
                          <p style={{ marginTop: 2, fontSize: 14, fontWeight: 500, margin: "2px 0 4px" }}>{r.tour}</p>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px 16px", fontSize: 12, color: "var(--muted-foreground)" }}>
                            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><CalendarIcon size={13} /> {r.date}</span>
                            <span style={{ display: "flex", alignItems: "center", gap: 4 }}><Users size={13} /> {r.travelers} travelers</span>
                            <span style={{ display: "flex", alignItems: "center", gap: 4, color: "var(--primary)", fontWeight: 500 }}><DollarSign size={13} />{r.total}</span>
                          </div>
                          <p style={{ marginTop: 8, borderRadius: 10, background: "var(--muted)", padding: "8px 12px", fontSize: 13, color: "var(--foreground)", opacity: 0.8, margin: "8px 0 0" }}>
                            &ldquo;{r.message}&rdquo;
                          </p>
                        </div>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                        {r.status === "pending" ? (
                          <>
                            <button className="btn btn-danger btn-sm" onClick={() => respond(r.id, "declined")}>
                              <X size={14} /> Decline
                            </button>
                            <button className="btn btn-warm btn-sm" onClick={() => respond(r.id, "accepted")}>
                              <Check size={14} /> Accept
                            </button>
                          </>
                        ) : (
                          <span className={`pill ${r.status === "accepted" ? "pill-accepted" : "pill-declined"}`}>
                            {r.status === "accepted" ? "Accepted" : "Declined"}
                          </span>
                        )}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Earnings */}
            <div className="card" style={{ marginTop: 24, padding: 24 }}>
              <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 16 }}>
                <div>
                  <h2 style={{ fontSize: 17, fontWeight: 600, letterSpacing: "-0.2px", margin: 0 }}>Earnings</h2>
                  <p style={{ fontSize: 12, color: "var(--muted-foreground)", margin: "2px 0 0" }}>Last 8 weeks · Net of platform fees</p>
                </div>
                <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                  <span style={{ fontSize: 30, fontWeight: 600, letterSpacing: "-0.5px" }}>$5,630</span>
                  <span style={{ display: "flex", alignItems: "center", gap: 2, fontSize: 12, fontWeight: 500, color: "var(--green-up)" }}>
                    <ArrowUpRight size={14} /> 22%
                  </span>
                </div>
              </div>

              <div style={{ marginTop: 24, height: 160, display: "flex", alignItems: "flex-end", gap: 12 }}>
                {EARNINGS_WEEKS.map((w, i) => {
                  const h = (w.value / max) * 100;
                  const isLast = i === EARNINGS_WEEKS.length - 1;
                  return (
                    <div key={w.label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                      <div style={{
                        width: "100%", borderRadius: "6px 6px 0 0",
                        height: `${h * 1.4}px`,
                        background: isLast ? "var(--gradient-warm)" : "oklch(0.52 0.12 175 / 0.25)",
                        transition: "all 0.2s",
                      }} />
                      <span style={{ fontSize: 10, fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.07em", color: "var(--muted-foreground)" }}>
                        {w.label}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div style={{ marginTop: 24, display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16, borderTop: "1px solid var(--border-faint)", paddingTop: 16 }}>
                {([["Pending payout", "$1,240"], ["Completed (30d)", "23"], ["Avg per tour", "$210"]]).map(([l, v]) => (
                  <div key={l}>
                    <div style={{ fontSize: 12, color: "var(--muted-foreground)" }}>{l}</div>
                    <div style={{ marginTop: 2, fontSize: 15, fontWeight: 600 }}>{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <aside style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Upcoming tours */}
            <div className="card" style={{ padding: 0, overflow: "hidden" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid var(--border-faint)", padding: "16px 20px" }}>
                <div>
                  <h2 style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.2px", margin: 0 }}>Upcoming tours</h2>
                  <p style={{ fontSize: 12, color: "var(--muted-foreground)", margin: "2px 0 0" }}>This week</p>
                </div>
                <button className="btn btn-ghost btn-sm" style={{ color: "oklch(0.52 0.12 175)", display: "flex", alignItems: "center", gap: 4 }}>
                  Calendar <ChevronRight size={14} />
                </button>
              </div>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }} className="divide-y">
                {UPCOMING.map((u) => (
                  <li key={u.title} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 20px" }}>
                    <div className="icon-box-secondary" style={{ width: 48, height: 48, borderRadius: 12, flexDirection: "column", gap: 0 }}>
                      <span style={{ fontSize: 10, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{u.day}</span>
                      <span style={{ fontSize: 15, fontWeight: 600, lineHeight: 1 }}>{u.date}</span>
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <p style={{ fontSize: 13, fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", margin: 0 }}>{u.title}</p>
                      <div style={{ marginTop: 2, display: "flex", gap: 12, fontSize: 12, color: "var(--muted-foreground)" }}>
                        <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Clock size={11} />{u.time}</span>
                        <span style={{ display: "flex", alignItems: "center", gap: 3 }}><MapPin size={11} />{u.city}</span>
                        <span style={{ display: "flex", alignItems: "center", gap: 3 }}><Users size={11} />{u.guests}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <MiniCalendar />

            {/* My Profile */}
            <div className="card" style={{ padding: 20 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <h3 style={{ fontSize: 15, fontWeight: 600, letterSpacing: "-0.2px", margin: 0 }}>My profile</h3>
                <button
                  type="button"
                  onClick={() => setEditOpen(true)}
                  className="btn btn-outline btn-sm"
                  style={{ display: "flex", alignItems: "center", gap: 4 }}
                >
                  <Pencil size={13} /> Edit profile
                </button>
              </div>

              {/* Profile Photo Section */}
              <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ position: "relative" }}>
                  <Avatar 
                    src={profileImage || user?.profileImage} 
                    name={name}
                    size="2xl"
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleImageUpload}
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    style={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      background: "var(--primary)",
                      color: "white",
                      border: "2px solid var(--card)",
                      borderRadius: "50%",
                      width: 28,
                      height: 28,
                      cursor: "pointer",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 12,
                    }}
                  >
                    {uploading ? "..." : "📷"}
                  </button>
                </div>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 600, margin: 0 }}>{name}</p>
                  <p style={{ fontSize: 11, color: "var(--muted-foreground)", margin: "2px 0 0" }}>
                    {uploading ? "Uploading..." : "Click camera to change photo"}
                  </p>
                </div>
              </div>

              <p style={{ marginTop: 12, fontSize: 12, color: "var(--muted-foreground)", lineHeight: 1.5, margin: "12px 0 0" }}>
                {profile.about || "No bio yet — click Edit profile to add one."}
              </p>

              <ProfileTagRow label="Cities" values={profile.cities} />
              <ProfileTagRow label="Languages" values={profile.languages} />
              <ProfileTagRow label="Specializations" values={profile.specializations} />
            </div>
          </aside>
        </section>
      </main>

      {editOpen && (
        <EditProfileModal
          initialName={name}
          initialProfile={profile}
          initialEmail={user?.email || ""}
          initialPhoneNumbers={user?.phoneNumbers || []}
          initialFacebook={user?.FaceBook || ""}
          initialLinkedin={user?.Linkedin || ""}
          initialInstagram={user?.Instagram || ""}
          onCancel={() => setEditOpen(false)}
          onSave={handleSaveProfile}
          loading={loading}
        />
      )}
    </div>
  );
}

function ProfileTagRow({ label, values }) {
  if (!values || values.length === 0) return null;
  return (
    <div style={{ marginTop: 12 }}>
      <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--muted-foreground)", margin: 0 }}>
        {label}
      </p>
      <div style={{ marginTop: 6, display: "flex", flexWrap: "wrap", gap: 6 }}>
        {values.map((v) => (
          <span key={v} className="pill pill-primary">{v}</span>
        ))}
      </div>
    </div>
  );
}

function EditProfileModal({ 
  initialName, 
  initialProfile, 
  initialEmail,
  initialPhoneNumbers,
  initialFacebook,
  initialLinkedin,
  initialInstagram,
  onCancel, 
  onSave, 
  loading 
}) {
  const [name, setName] = useState(initialName);
  const [about, setAbout] = useState(initialProfile.about || "");
  const [cities, setCities] = useState((initialProfile.cities || []).join(", "));
  const [languages, setLanguages] = useState((initialProfile.languages || []).join(", "));
  const [specializations, setSpecializations] = useState((initialProfile.specializations || []).join(", "));
  
  // ✅ NEW FIELDS
  const [email, setEmail] = useState(initialEmail || "");
  const [phoneNumbers, setPhoneNumbers] = useState((initialPhoneNumbers || []).join(", "));
  const [facebook, setFacebook] = useState(initialFacebook || "");
  const [linkedin, setLinkedin] = useState(initialLinkedin || "");
  const [instagram, setInstagram] = useState(initialInstagram || "");

  const toList = (value) => value.split(",").map((v) => v.trim()).filter(Boolean);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      email: email.trim(),
      profile: {
        about: about.trim(),
        cities: toList(cities),
        languages: toList(languages),
        specializations: toList(specializations),
      },
      phoneNumbers: toList(phoneNumbers),
      facebook: facebook.trim(),
      linkedin: linkedin.trim(),
      instagram: instagram.trim(),
    });
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 60, background: "rgba(15, 23, 42, 0.45)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
      }}
      onClick={onCancel}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="card"
        style={{ width: "100%", maxWidth: 480, maxHeight: "90vh", overflowY: "auto", padding: 24 }}
      >
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <h2 style={{ fontSize: 18, fontWeight: 600, margin: 0 }}>Edit profile</h2>
          <button type="button" onClick={onCancel} className="btn-icon" aria-label="Close" disabled={loading}>
            <X size={18} />
          </button>
        </div>

        <ModalField label="Name">
          <input 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            style={inputStyle} 
            disabled={loading}
          />
        </ModalField>

        <ModalField label="Email">
          <input 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            style={inputStyle} 
            disabled={loading}
            type="email"
            placeholder="your@email.com"
          />
        </ModalField>

        <ModalField label="Phone Numbers" hint="Comma-separated, e.g. +20123456789, +20987654321">
          <input 
            value={phoneNumbers} 
            onChange={(e) => setPhoneNumbers(e.target.value)} 
            style={inputStyle} 
            disabled={loading}
            placeholder="+20123456789, +20987654321"
          />
        </ModalField>

        <ModalField label="Facebook URL">
          <input 
            value={facebook} 
            onChange={(e) => setFacebook(e.target.value)} 
            style={inputStyle} 
            disabled={loading}
            placeholder="https://facebook.com/yourprofile"
          />
        </ModalField>

        <ModalField label="LinkedIn URL">
          <input 
            value={linkedin} 
            onChange={(e) => setLinkedin(e.target.value)} 
            style={inputStyle} 
            disabled={loading}
            placeholder="https://linkedin.com/in/yourprofile"
          />
        </ModalField>

        <ModalField label="Instagram URL">
          <input 
            value={instagram} 
            onChange={(e) => setInstagram(e.target.value)} 
            style={inputStyle} 
            disabled={loading}
            placeholder="https://instagram.com/yourprofile"
          />
        </ModalField>

        <ModalField label="About">
          <textarea 
            value={about} 
            onChange={(e) => setAbout(e.target.value)} 
            rows={4} 
            style={{ ...inputStyle, resize: "vertical", fontFamily: "inherit" }} 
            disabled={loading}
          />
        </ModalField>

        <ModalField label="Cities" hint="Comma-separated, e.g. Cairo, Luxor, Aswan">
          <input 
            value={cities} 
            onChange={(e) => setCities(e.target.value)} 
            style={inputStyle} 
            disabled={loading}
          />
        </ModalField>

        <ModalField label="Languages" hint="Comma-separated, e.g. English, Arabic, French">
          <input 
            value={languages} 
            onChange={(e) => setLanguages(e.target.value)} 
            style={inputStyle} 
            disabled={loading}
          />
        </ModalField>

        <ModalField label="Specializations" hint="Comma-separated, e.g. Ancient Egypt, Diving">
          <input 
            value={specializations} 
            onChange={(e) => setSpecializations(e.target.value)} 
            style={inputStyle} 
            disabled={loading}
          />
        </ModalField>

        <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button type="button" onClick={onCancel} className="btn btn-outline btn-sm" disabled={loading}>
            Cancel
          </button>
          <button type="submit" className="btn btn-warm btn-sm" disabled={loading}>
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : "Save changes"}
          </button>
        </div>
      </form>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  marginTop: 6,
  borderRadius: 10,
  border: "1px solid var(--border)",
  background: "var(--card)",
  padding: "8px 12px",
  fontSize: 13,
  color: "var(--foreground)",
  outline: "none",
  boxSizing: "border-box",
};

function ModalField({ label, hint, children }) {
  return (
    <div style={{ marginTop: 16 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: "var(--foreground)" }}>{label}</label>
      {children}
      {hint && <p style={{ marginTop: 4, fontSize: 11, color: "var(--muted-foreground)" }}>{hint}</p>}
    </div>
  );
}