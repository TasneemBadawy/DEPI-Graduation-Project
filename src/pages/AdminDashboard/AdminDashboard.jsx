"use client";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search, Users, ShieldCheck, UserX, UserCheck, Compass as CompassIcon,
  Sparkles, MessageSquare, Star, MapPin, Trash2, Plus, Pencil, X,
} from "lucide-react";

// Sample data
const SAMPLE_GUIDES = [
  { id: 1, name: "Ahmed Mohamed", city: "Cairo", verified: true, rating: 4.9, reviews: 120, tours: 5 },
  { id: 2, name: "Sara Ali", city: "Luxor", verified: false, rating: 4.7, reviews: 85, tours: 3 },
  { id: 3, name: "Karim Hassan", city: "Aswan", verified: true, rating: 4.8, reviews: 200, tours: 8 },
];

const SAMPLE_TOURISTS = [
  { id: 1, name: "John Doe", email: "john@email.com", country: "USA", joined: "Jan 2025", trips: 3, status: "Active" },
  { id: 2, name: "Jane Smith", email: "jane@email.com", country: "UK", joined: "Feb 2025", trips: 1, status: "New" },
];

const SAMPLE_TOURS = [
  { id: 1, title: "Pyramids Tour", city: "Cairo", price: 150, guide: "Ahmed Mohamed", rating: 4.9 },
  { id: 2, title: "Nile Cruise", city: "Luxor", price: 200, guide: "Sara Ali", rating: 4.7 },
];

// ✅ Sample Activities Data
const SAMPLE_ACTIVITIES = [
  { id: 1, title: "Sunrise Hot Air Balloon", category: "Adventure", city: "Luxor", price: 180, status: "Live" },
  { id: 2, title: "Red Sea Snorkeling", category: "Water", city: "Hurghada", price: 75, status: "Live" },
  { id: 3, title: "Camel Ride in Desert", category: "Cultural", city: "Merzouga", price: 45, status: "Live" },
  { id: 4, title: "Street Food Tour", category: "Food", city: "Bangkok", price: 35, status: "Live" },
];

const TABS = [
  { id: "guides", label: "Guides", Icon: Users },
  { id: "tourists", label: "Tourists", Icon: UserCheck },
  { id: "tours", label: "Tours", Icon: CompassIcon },
  { id: "activities", label: "Activities", Icon: Sparkles }, // ✅ Added Activities tab
  { id: "reviews", label: "Reviews", Icon: MessageSquare },
];

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("guides");
  const [query, setQuery] = useState("");
  const [guides, setGuides] = useState(SAMPLE_GUIDES);
  const [tourists, setTourists] = useState(SAMPLE_TOURISTS);
  const [tours, setTours] = useState(SAMPLE_TOURS);
  const [activities, setActivities] = useState(SAMPLE_ACTIVITIES);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [editingActivity, setEditingActivity] = useState(null);

  // Set admin in localStorage
  useEffect(() => {
    const adminUser = {
      id: "admin-dev",
      name: "Admin User",
      email: "admin@nomade.com",
      role: "admin",
      isDev: true,
    };
    localStorage.setItem("nomade_current_user", JSON.stringify(adminUser));
    console.log("🔓 Admin dashboard loaded");
  }, []);

  // Filter function
  const filterData = (data, searchFields) => {
    const q = query.trim().toLowerCase();
    if (!q) return data;
    return data.filter(item => 
      searchFields.some(field => 
        String(item[field] || "").toLowerCase().includes(q)
      )
    );
  };

  const filteredGuides = filterData(guides, ["name", "city"]);
  const filteredTourists = filterData(tourists, ["name", "email", "country"]);
  const filteredTours = filterData(tours, ["title", "city", "guide"]);
  const filteredActivities = filterData(activities, ["title", "category", "city"]);

  const verifiedCount = guides.filter(g => g.verified).length;
  const unverifiedCount = guides.length - verifiedCount;

  const toggleVerify = (id) => {
    setGuides(guides.map(g => 
      g.id === id ? { ...g, verified: !g.verified } : g
    ));
  };

  // ✅ Activity CRUD Functions
  const handleAddActivity = (newActivity) => {
    const activity = {
      id: Date.now(),
      ...newActivity,
      status: "Live",
    };
    setActivities([...activities, activity]);
    setShowActivityModal(false);
  };

  const handleEditActivity = (id, updatedData) => {
    setActivities(activities.map(a => 
      a.id === id ? { ...a, ...updatedData } : a
    ));
    setShowActivityModal(false);
    setEditingActivity(null);
  };

  const handleDeleteActivity = (id) => {
    if (window.confirm("Are you sure you want to delete this activity?")) {
      setActivities(activities.filter(a => a.id !== id));
    }
  };

  const openEditModal = (activity) => {
    setEditingActivity(activity);
    setShowActivityModal(true);
  };

  return (
    <div className="min-h-screen bg-primary-soft">
      {/* Dev Banner */}
      <div className="bg-yellow-100 border-b border-yellow-300 px-4 py-2 text-center text-sm text-yellow-800">
        🔓 Admin Dashboard (Dev Mode)
        <button 
          onClick={() => {
            localStorage.clear();
            window.location.href = "/";
          }}
          className="ml-4 text-yellow-900 underline hover:text-yellow-700"
        >
          Clear session
        </button>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-secondary">
              <ShieldCheck className="h-3.5 w-3.5" /> Admin workspace
            </span>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Platform overview</h1>
            <p className="mt-1 text-sm text-muted-foreground">Monitor guides, tourists, tours, and activities across Nomade.</p>
          </div>
          <div className="flex w-full max-w-xs items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 shadow-card">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <StatCard label="Total guides" value={guides.length} Icon={Users} tone="neutral" />
          <StatCard label="Verified guides" value={verifiedCount} Icon={ShieldCheck} tone="success" />
          <StatCard label="Unverified guides" value={unverifiedCount} Icon={UserX} tone="warning" />
          <StatCard label="Total tourists" value={tourists.length} Icon={UserCheck} tone="neutral" />
          <StatCard label="Total tours" value={tours.length} Icon={CompassIcon} tone="neutral" />
          <StatCard label="Activities" value={activities.length} Icon={Sparkles} tone="neutral" />
        </div>

        {/* Tabs */}
        <div className="mt-8 flex flex-wrap gap-1 rounded-2xl border border-border bg-card/60 p-1.5">
          {TABS.map(({ id, label, Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActiveTab(id)}
              className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition-all ${
                activeTab === id ? "bg-card text-foreground shadow-card" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-4 w-4" /> {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="mt-6 overflow-hidden rounded-2xl border border-border bg-card shadow-card">
          {activeTab === "guides" && (
            <GuidesTable guides={filteredGuides} onToggleVerify={toggleVerify} />
          )}
          {activeTab === "tourists" && (
            <TouristsTable tourists={filteredTourists} />
          )}
          {activeTab === "tours" && (
            <ToursTable tours={filteredTours} />
          )}
          {activeTab === "activities" && (
            <ActivitiesTable 
              activities={filteredActivities}
              onAdd={() => {
                setEditingActivity(null);
                setShowActivityModal(true);
              }}
              onEdit={openEditModal}
              onDelete={handleDeleteActivity}
            />
          )}
          {activeTab === "reviews" && (
            <div className="p-8 text-center text-muted-foreground">
              <p>Reviews section - coming soon</p>
            </div>
          )}
        </div>
      </div>

      {/* ✅ Activity Modal */}
      {showActivityModal && (
        <ActivityModal
          activity={editingActivity}
          onClose={() => {
            setShowActivityModal(false);
            setEditingActivity(null);
          }}
          onSave={(data) => {
            if (editingActivity) {
              handleEditActivity(editingActivity.id, data);
            } else {
              handleAddActivity(data);
            }
          }}
        />
      )}
    </div>
  );
}

// ─── Helper Components ───

function StatCard({ label, value, Icon, tone }) {
  const toneClasses = {
    neutral: "bg-muted text-muted-foreground",
    success: "bg-success/15 text-success",
    warning: "bg-warning/15 text-warning",
  };
  return (
    <div className="rounded-2xl border border-border bg-card p-4 shadow-card">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
        <span className={`flex h-6 w-6 items-center justify-center rounded-full ${toneClasses[tone] || toneClasses.neutral}`}>
          <Icon className="h-3.5 w-3.5" />
        </span>
      </div>
      <div className="mt-2 text-2xl font-bold text-foreground">{value}</div>
    </div>
  );
}

function GuidesTable({ guides, onToggleVerify }) {
  return (
    <div>
      <div className="border-b border-border px-6 py-5">
        <h2 className="text-base font-semibold text-foreground">Tour Guides</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          {guides.filter(g => g.verified).length} verified · {guides.length - guides.filter(g => g.verified).length} pending
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Guide</th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">City</th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Rating</th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
              <th className="px-6 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {guides.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-sm text-muted-foreground">No guides found</td>
              </tr>
            ) : (
              guides.map((g) => (
                <tr key={g.id}>
                  <td className="px-6 py-4 text-sm text-foreground font-semibold">{g.name}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{g.city}</td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-primary text-primary" /> {g.rating}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                      g.verified ? "bg-success/15 text-success" : "bg-warning/15 text-warning"
                    }`}>
                      {g.verified ? "✅ Verified" : "⏳ Pending"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      onClick={() => onToggleVerify(g.id)}
                      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                        g.verified
                          ? "border-destructive/30 text-destructive hover:bg-destructive/5"
                          : "border-success/30 text-success hover:bg-success/10"
                      }`}
                    >
                      <UserCheck className="h-3.5 w-3.5" /> {g.verified ? "Unverify" : "Verify"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TouristsTable({ tourists }) {
  return (
    <div>
      <div className="border-b border-border px-6 py-5">
        <h2 className="text-base font-semibold text-foreground">Tourists</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">{tourists.length} registered travelers</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Name</th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Email</th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Country</th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Joined</th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Trips</th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {tourists.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-sm text-muted-foreground">No tourists found</td>
              </tr>
            ) : (
              tourists.map((t) => (
                <tr key={t.id}>
                  <td className="px-6 py-4 text-sm text-foreground font-semibold">{t.name}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{t.email}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{t.country}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{t.joined}</td>
                  <td className="px-6 py-4 text-sm text-foreground">{t.trips}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${
                      t.status === "Active" ? "bg-success/15 text-success" : "bg-warning/15 text-warning"
                    }`}>
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ToursTable({ tours }) {
  return (
    <div>
      <div className="border-b border-border px-6 py-5">
        <h2 className="text-base font-semibold text-foreground">Tours</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">{tours.length} tours live</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Title</th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">City</th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Guide</th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Price</th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Rating</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {tours.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-10 text-center text-sm text-muted-foreground">No tours found</td>
              </tr>
            ) : (
              tours.map((t) => (
                <tr key={t.id}>
                  <td className="px-6 py-4 text-sm text-foreground font-semibold">{t.title}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{t.city}</td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{t.guide}</td>
                  <td className="px-6 py-4 text-sm text-primary font-semibold">${t.price}</td>
                  <td className="px-6 py-4 text-sm text-foreground">
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 fill-primary text-primary" /> {t.rating}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ✅ Activities Table Component
function ActivitiesTable({ activities, onAdd, onEdit, onDelete }) {
  return (
    <div>
      <div className="flex flex-wrap items-center justify-between border-b border-border px-6 py-5">
        <div>
          <h2 className="text-base font-semibold text-foreground">Activities</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">{activities.length} activities available</p>
        </div>
        <button
          type="button"
          onClick={onAdd}
          className="btn btn-warm btn-sm flex items-center gap-1"
        >
          <Plus className="h-4 w-4" /> Add Activity
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Title</th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Category</th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">City</th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Price</th>
              <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
              <th className="px-6 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {activities.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-sm text-muted-foreground">No activities found</td>
              </tr>
            ) : (
              activities.map((a) => (
                <tr key={a.id}>
                  <td className="px-6 py-4 text-sm text-foreground font-semibold">{a.title}</td>
                  <td className="px-6 py-4 text-sm">
                    <span className="rounded-full bg-secondary-soft px-2.5 py-1 text-xs font-medium text-secondary">
                      {a.category}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-muted-foreground">{a.city}</td>
                  <td className="px-6 py-4 text-sm text-primary font-semibold">${a.price}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold bg-success/15 text-success">
                      ✅ {a.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => onEdit(a)}
                        className="inline-flex items-center gap-1 rounded-lg border border-border px-2.5 py-1 text-xs font-semibold text-foreground hover:bg-muted transition-colors"
                      >
                        <Pencil className="h-3 w-3" /> Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => onDelete(a.id)}
                        className="inline-flex items-center gap-1 rounded-lg border border-destructive/30 px-2.5 py-1 text-xs font-semibold text-destructive hover:bg-destructive/5 transition-colors"
                      >
                        <Trash2 className="h-3 w-3" /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ✅ Activity Modal Component
function ActivityModal({ activity, onClose, onSave }) {
  const [title, setTitle] = useState(activity?.title || "");
  const [category, setCategory] = useState(activity?.category || "Adventure");
  const [city, setCity] = useState(activity?.city || "");
  const [price, setPrice] = useState(activity?.price || "");
  const [error, setError] = useState("");

  const categories = ["Adventure", "Cultural", "Food", "Water", "Desert", "Nature", "Markets", "Iconic"];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !city.trim() || !price) {
      setError("Please fill in all fields");
      return;
    }
    onSave({ title: title.trim(), category, city: city.trim(), price: Number(price) });
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-foreground">
            {activity ? "Edit Activity" : "Add New Activity"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter activity title"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/25"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/25"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">City</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/25"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1">Price (USD)</label>
            <input
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Enter price"
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/25"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:brightness-110 transition-colors"
            >
              {activity ? "Save Changes" : "Add Activity"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}