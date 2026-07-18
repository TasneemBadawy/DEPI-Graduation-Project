"use client";
import { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Search, Users, ShieldCheck, UserX, UserCheck, Compass as CompassIcon,
  Sparkles, MessageSquare, Star, MapPin, Trash2,
} from "lucide-react";
import { getGuideBySlug } from "../../data/guides";
import { getGuidesWithStatus, setGuideVerified } from "../../lib/adminStore";
import { TOURISTS, getInitials } from "../../data/tourists";
import { getAllTours } from "../../lib/tourStore";
import { EXPERIENCES } from "../../data/experiences";
import { SEED_REVIEWS } from "../../data/reviews";
import { getAllReviews, deleteReview as deleteReviewApi } from "../../lib/reviewStore";

const TABS = [
  { id: "guides", label: "Guides", Icon: Users },
  { id: "tourists", label: "Tourists", Icon: UserCheck },
  { id: "tours", label: "Tours", Icon: CompassIcon },
  { id: "activities", label: "Activities", Icon: Sparkles },
  { id: "reviews", label: "Reviews", Icon: MessageSquare },
];

function guideEmail(guide) {
  const handle = guide.slug.split("-")[0];
  return `${handle}@nomade.co`;
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("guides");
  const [query, setQuery] = useState("");
  const [guides, setGuides] = useState(() => getGuidesWithStatus());
  const [reviews, setReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState(null); // { reviewId, reviewText, reviewerName }

  const tours = useMemo(() => getAllTours(), []);

  // Load reviews from the API
  useEffect(() => {
    const loadReviews = async () => {
      setLoadingReviews(true);
      try {
        const apiReviews = await getAllReviews();
        const formatted = apiReviews.map((r) => {
          const guide = getGuideBySlug(r.guideSlug);
          return {
            id: r.Review_ID || r.id,
            reviewerName: r.username || r.name || "Anonymous",
            guideName: guide?.name || r.guideName || "Unknown Guide",
            tour: r.tour || "—",
            city: guide?.city || r.city || "—",
            rating: r.Rate || r.rating || 5,
            text: r.Content || r.text || "",
            date: r.createdAt || r.date || new Date().toISOString().split('T')[0],
            guideSlug: r.guideSlug,
            userId: r.User_ID,
          };
        });
        setReviews(formatted);
      } catch (error) {
        console.error("Error loading reviews:", error);
        setReviews([]);
      } finally {
        setLoadingReviews(false);
      }
    };
    loadReviews();
  }, []);

  const avgRating = reviews.length
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(2)
    : "—";

  const verifiedCount = guides.filter((g) => g.verified).length;
  const unverifiedCount = guides.length - verifiedCount;

  const handleToggleVerify = (slug, nextVerified) => {
    setGuideVerified(slug, nextVerified);
    setGuides(getGuidesWithStatus());
  };

  const handleDeleteReview = async (reviewId) => {
    try {
      await deleteReviewApi(reviewId);
      // Remove the review from the local state
      setReviews(prev => prev.filter(r => r.id !== reviewId));
      setDeleteDialog(null);
    } catch (error) {
      console.error("Error deleting review:", error);
      alert(error.message || "Failed to delete review. Please try again.");
    }
  };

  const q = query.trim().toLowerCase();
  const matches = (parts) => !q || parts.filter(Boolean).join(" ").toLowerCase().includes(q);

  const filteredGuides = useMemo(() => guides.filter((g) => matches([g.name, g.city])), [guides, q]);
  const filteredTourists = useMemo(() => TOURISTS.filter((t) => matches([t.name, t.country])), [q]);
  const filteredTours = useMemo(() => tours.filter((t) => matches([t.title, t.city])), [tours, q]);
  const filteredActivities = useMemo(() => EXPERIENCES.filter((a) => matches([a.title, a.city])), [q]);
  const filteredReviews = useMemo(() => reviews.filter((r) => matches([r.reviewerName, r.guideName, r.text])), [reviews, q]);

  return (
    <div className="min-h-screen bg-primary-soft">
      <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
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
              placeholder="Search guides, tourists, tours…"
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
            />
          </div>
        </div>

        {/* Stat cards */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <StatCard label="Total guides" value={guides.length} Icon={Users} tone="neutral" />
          <StatCard label="Verified guides" value={verifiedCount} Icon={ShieldCheck} tone="success" />
          <StatCard label="Unverified guides" value={unverifiedCount} Icon={UserX} tone="warning" />
          <StatCard label="Total tourists" value={TOURISTS.length} Icon={UserCheck} tone="neutral" />
          <StatCard label="Total tours" value={tours.length} Icon={CompassIcon} tone="neutral" />
          <StatCard label="Total activities" value={EXPERIENCES.length} Icon={Sparkles} tone="neutral" />
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
          {activeTab === "guides" && <GuidesTable guides={filteredGuides} onToggleVerify={handleToggleVerify} />}
          {activeTab === "tourists" && <TouristsTable tourists={filteredTourists} />}
          {activeTab === "tours" && <ToursTable tours={filteredTours} />}
          {activeTab === "activities" && <ActivitiesTable activities={filteredActivities} />}
          {activeTab === "reviews" && (
            <ReviewsTable 
              reviews={filteredReviews} 
              avgRating={avgRating} 
              loading={loadingReviews}
              onDeleteReview={(reviewId, reviewText, reviewerName) => 
                setDeleteDialog({ reviewId, reviewText, reviewerName })
              }
            />
          )}
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {deleteDialog && (
        <DeleteConfirmationDialog
          reviewText={deleteDialog.reviewText}
          reviewerName={deleteDialog.reviewerName}
          onConfirm={() => handleDeleteReview(deleteDialog.reviewId)}
          onCancel={() => setDeleteDialog(null)}
        />
      )}
    </div>
  );
}

/* ───────────────────────────── STAT CARD ───────────────────────────── */

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

/* ───────────────────────────── SHARED TABLE BITS ───────────────────────────── */

function SectionHeader({ title, subtitle, badge }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-5">
      <div>
        <h2 className="text-base font-semibold text-foreground">{title}</h2>
        <p className="mt-0.5 text-xs text-muted-foreground">{subtitle}</p>
      </div>
      {badge}
    </div>
  );
}

function EmptyRow({ colSpan, children }) {
  return (
    <tr>
      <td colSpan={colSpan} className="px-6 py-10 text-center text-sm text-muted-foreground">
        {children}
      </td>
    </tr>
  );
}

function Th({ children, className = "" }) {
  return (
    <th className={`px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-muted-foreground ${className}`}>
      {children}
    </th>
  );
}

function Td({ children, className = "" }) {
  return <td className={`px-6 py-4 text-sm text-foreground ${className}`}>{children}</td>;
}

function StatusBadge({ tone, children }) {
  const tones = {
    success: "bg-success/15 text-success",
    warning: "bg-warning/15 text-warning",
    neutral: "bg-muted text-muted-foreground",
  };
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${tones[tone] || tones.neutral}`}>
      {children}
    </span>
  );
}

function Stars({ rating }) {
  const full = Math.round(typeof rating === "number" ? rating : 0);
  return (
    <span className="inline-flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star key={i} className={`h-3.5 w-3.5 ${i < full ? "fill-primary text-primary" : "fill-transparent text-border"}`} />
      ))}
    </span>
  );
}

/* ───────────────────────────── GUIDES ───────────────────────────── */

function GuidesTable({ guides, onToggleVerify }) {
  const verifiedCount = guides.filter((g) => g.verified).length;
  return (
    <div>
      <SectionHeader
        title="Tour guides"
        subtitle={`${verifiedCount} verified · ${guides.length - verifiedCount} pending verification`}
      />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse">
          <thead>
            <tr className="border-b border-border">
              <Th>Guide</Th>
              <Th>City</Th>
              <Th>Joined</Th>
              <Th>Tours</Th>
              <Th>Rating</Th>
              <Th>Status</Th>
              <Th className="text-right">Action</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {guides.length === 0 ? (
              <EmptyRow colSpan={7}>No guides match your search.</EmptyRow>
            ) : (
              guides.map((g) => (
                <tr key={g.slug}>
                  <Td>
                    <Link to={`/guides/${g.slug}`} className="flex items-center gap-3 hover:opacity-80">
                      <img src={g.photo} alt={g.name} className="h-9 w-9 rounded-full object-cover" />
                      <div>
                        <div className="font-semibold text-foreground">{g.name}</div>
                        <div className="text-xs text-muted-foreground">{guideEmail(g)}</div>
                      </div>
                    </Link>
                  </Td>
                  <Td>
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" /> {g.city}
                    </span>
                  </Td>
                  <Td className="text-secondary">{g.joinedDate || "—"}</Td>
                  <Td>{getToursCountForGuide(g.slug)}</Td>
                  <Td>
                    <span className="inline-flex items-center gap-1 font-semibold">
                      <Star className="h-3.5 w-3.5 fill-primary text-primary" /> {g.rating}
                    </span>
                  </Td>
                  <Td>
                    <StatusBadge tone={g.verified ? "success" : "warning"}>
                      <ShieldCheck className="h-3 w-3" /> {g.verified ? "Verified" : "Not verified"}
                    </StatusBadge>
                  </Td>
                  <Td className="text-right">
                    <button
                      type="button"
                      onClick={() => onToggleVerify(g.slug, !g.verified)}
                      className={`inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                        g.verified
                          ? "border-destructive/30 text-destructive hover:bg-destructive/5"
                          : "border-success/30 text-success hover:bg-success/10"
                      }`}
                    >
                      <UserCheck className="h-3.5 w-3.5" /> {g.verified ? "Unverify" : "Verify"}
                    </button>
                  </Td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function getToursCountForGuide(slug) {
  return getAllTours().filter((t) => t.guideSlug === slug).length;
}

/* ───────────────────────────── TOURISTS ───────────────────────────── */

function TouristsTable({ tourists }) {
  return (
    <div>
      <SectionHeader title="Tourists" subtitle={`${tourists.length} registered travelers`} />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse">
          <thead>
            <tr className="border-b border-border">
              <Th>Traveler</Th>
              <Th>Country</Th>
              <Th>Joined</Th>
              <Th>Trips</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {tourists.length === 0 ? (
              <EmptyRow colSpan={5}>No tourists match your search.</EmptyRow>
            ) : (
              tourists.map((t) => (
                <tr key={t.id}>
                  <Td>
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary-soft text-xs font-semibold text-secondary">
                        {getInitials(t.name)}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{t.name}</div>
                        <div className="text-xs text-muted-foreground">{t.email}</div>
                      </div>
                    </div>
                  </Td>
                  <Td className="text-muted-foreground">{t.country}</Td>
                  <Td className="text-secondary">{t.joinedDate}</Td>
                  <Td>{t.trips}</Td>
                  <Td>
                    <StatusBadge tone={t.status === "Active" ? "success" : "neutral"}>{t.status}</StatusBadge>
                  </Td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ───────────────────────────── TOURS ───────────────────────────── */

function ToursTable({ tours }) {
  return (
    <div>
      <SectionHeader title="Tours" subtitle={`${tours.length} tours live across the platform`} />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse">
          <thead>
            <tr className="border-b border-border">
              <Th>Tour</Th>
              <Th>Guide</Th>
              <Th>City</Th>
              <Th>Price</Th>
              <Th>Reviews</Th>
              <Th>Rating</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {tours.length === 0 ? (
              <EmptyRow colSpan={7}>No tours match your search.</EmptyRow>
            ) : (
              tours.map((t) => {
                const guide = getGuideBySlug(t.guideSlug);
                return (
                  <tr key={t.slug}>
                    <Td>
                      <Link to={`/tours/${t.slug}`} className="font-semibold text-foreground hover:text-primary">
                        {t.title}
                      </Link>
                    </Td>
                    <Td className="text-muted-foreground">{guide ? guide.name : "—"}</Td>
                    <Td>
                      <span className="inline-flex items-center gap-1 text-muted-foreground">
                        <MapPin className="h-3.5 w-3.5" /> {t.city}
                      </span>
                    </Td>
                    <Td className="font-semibold text-primary">${t.price}</Td>
                    <Td className="text-muted-foreground">{t.reviews ?? 0}</Td>
                    <Td>
                      <span className="inline-flex items-center gap-1 font-semibold">
                        <Star className="h-3.5 w-3.5 fill-primary text-primary" /> {t.rating}
                      </span>
                    </Td>
                    <Td>
                      <StatusBadge tone="success">Live</StatusBadge>
                    </Td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ───────────────────────────── ACTIVITIES ───────────────────────────── */

function ActivitiesTable({ activities }) {
  return (
    <div>
      <SectionHeader title="Activities" subtitle={`${activities.length} experiences bookable across cities`} />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[600px] border-collapse">
          <thead>
            <tr className="border-b border-border">
              <Th>Activity</Th>
              <Th>Category</Th>
              <Th>City</Th>
              <Th>Price</Th>
              <Th>Status</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {activities.length === 0 ? (
              <EmptyRow colSpan={5}>No activities match your search.</EmptyRow>
            ) : (
              activities.map((a) => (
                <tr key={a.slug}>
                  <Td>
                    <Link to={`/experiences/${a.slug}`} className="font-semibold text-foreground hover:text-primary">
                      {a.title}
                    </Link>
                  </Td>
                  <Td>
                    <span className="rounded-full bg-secondary-soft px-2.5 py-1 text-xs font-medium text-secondary">{a.tag}</span>
                  </Td>
                  <Td>
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      <MapPin className="h-3.5 w-3.5" /> {a.city}
                    </span>
                  </Td>
                  <Td className="font-semibold text-primary">${a.price}</Td>
                  <Td>
                    <StatusBadge tone="success">Live</StatusBadge>
                  </Td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ───────────────────────────── REVIEWS ───────────────────────────── */

function ReviewsTable({ reviews, avgRating, loading, onDeleteReview }) {
  if (loading) {
    return (
      <div>
        <SectionHeader title="Reviews" subtitle="Loading reviews..." />
        <div className="px-6 py-10 text-center text-sm text-muted-foreground">
          <div className="inline-block h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
          <p className="mt-2">Loading reviews...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <SectionHeader
        title="Reviews"
        subtitle={`${reviews.length} reviews · avg rating ${avgRating}`}
        badge={
          <span className="inline-flex items-center gap-1 rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-primary">
            <Star className="h-3.5 w-3.5 fill-primary text-primary" /> {avgRating} average
          </span>
        }
      />
      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse">
          <thead>
            <tr className="border-b border-border">
              <Th>Tourist</Th>
              <Th>Guide</Th>
              <Th>Tour</Th>
              <Th>City</Th>
              <Th>Rating</Th>
              <Th>Comment</Th>
              <Th>Date</Th>
              <Th className="text-right">Actions</Th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {reviews.length === 0 ? (
              <EmptyRow colSpan={8}>No reviews match your search.</EmptyRow>
            ) : (
              reviews.map((r) => (
                <tr key={r.id}>
                  <Td className="font-semibold">{r.reviewerName}</Td>
                  <Td className="text-muted-foreground">{r.guideName}</Td>
                  <Td className="max-w-[160px] truncate text-muted-foreground">{r.tour || "—"}</Td>
                  <Td className="text-muted-foreground">{r.city || "—"}</Td>
                  <Td><Stars rating={r.rating} /></Td>
                  <Td className="max-w-[280px]">
                    <span className="italic text-muted-foreground">"{r.text}"</span>
                  </Td>
                  <Td className="whitespace-nowrap text-muted-foreground">{r.date}</Td>
                  <Td className="text-right">
                    <button
                      type="button"
                      onClick={() => onDeleteReview(r.id, r.text, r.reviewerName)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/30 px-3 py-1.5 text-xs font-semibold text-destructive transition-colors hover:bg-destructive/5"
                      aria-label={`Delete review by ${r.reviewerName}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                  </Td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ───────────────────────────── DELETE CONFIRMATION DIALOG ───────────────────────────── */

function DeleteConfirmationDialog({ reviewText, reviewerName, onConfirm, onCancel }) {
  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-destructive">
            <Trash2 className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-foreground">Delete Review</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Are you sure you want to delete this review by <strong>{reviewerName}</strong>?
            </p>
            {reviewText && (
              <div className="mt-3 rounded-lg bg-muted p-3">
                <p className="text-sm italic text-muted-foreground">"{reviewText}"</p>
              </div>
            )}
            <p className="mt-3 text-xs text-destructive">This action cannot be undone.</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-destructive px-4 py-2 text-sm font-semibold text-white hover:bg-destructive/90 transition-colors"
          >
            Confirm Delete
          </button>
        </div>
      </div>
    </div>
  );
}