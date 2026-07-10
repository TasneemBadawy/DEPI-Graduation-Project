import { useMemo, useState } from "react";
import { useParams, useLocation, Navigate, Link } from "react-router-dom";
import {
  Star, MapPin, Languages, BadgeCheck, ShieldCheck, ChevronLeft, ChevronRight, Pencil, Trash2, X,
} from "lucide-react";
import Button from "../../components/ui/Button";
import TourCard from "../../components/cards/TourCard";
import Footer from "../../components/Footer";
import { getGuideBySlug } from "../../data/guides";
import { getToursByGuide } from "../../lib/tourStore";
import { getCurrentUser } from "../../lib/auth";
import { getReviewsForGuide, saveReview, deleteReview } from "../../lib/reviewStore";

const TABS = ["About", "Tours", "Reviews", "Availability"];

export default function GuideProfile() {
  const { slug } = useParams();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("About");

  // A guide who just registered doesn't exist in the mock dataset yet — their
  // freshly-submitted form data is passed via router state instead, keyed by
  // the reserved "preview" slug. Everyone else is looked up normally.
  const isPreview = slug === "preview";
  const guide = isPreview ? location.state?.guide : getGuideBySlug(slug);

  if (!guide) return <Navigate to="/guides" replace />;

  const tours = isPreview ? [] : getToursByGuide(guide.slug);

  return (
    <div className="min-h-screen bg-background">
      {isPreview && (
        <div className="bg-secondary-soft px-5 py-2.5 text-center text-sm font-medium text-secondary">
          This is a preview of your public profile — it's pending verification and isn't live yet.
        </div>
      )}
      <div className="h-64 w-full overflow-hidden sm:h-80">

        <img src={guide.cover} alt={`${guide.city} skyline`} className="h-full w-full object-cover" />
      </div>

      <div className="mx-auto -mt-16 max-w-7xl px-5 sm:px-8">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <img
                src={guide.photo}
                alt={guide.name}
                className="h-20 w-20 shrink-0 rounded-full border-4 border-card object-cover shadow-card sm:h-24 sm:w-24"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="text-xl font-bold text-white sm:text-2xl">{guide.name}</h1>
                  {guide.verified && <BadgeCheck className="h-5 w-5 fill-secondary text-white" />}
                </div>
                <p className="text-sm text-muted-foreground">{guide.tagline}</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1 font-semibold text-foreground">
                    <Star className="h-3.5 w-3.5 fill-primary text-primary" /> {guide.rating} ({guide.reviews} reviews)
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> {guide.city}{guide.country ? `, ${guide.country}` : ""}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Languages className="h-3.5 w-3.5" /> {guide.languages.length} languages
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3 border-t border-border pt-6 sm:grid-cols-4">
            <Stat label="Tours completed" value={guide.toursCompleted?.toLocaleString?.() ?? guide.toursCompleted} />
            <Stat label="Response time" value={guide.responseTime} />
            <Stat label="Years guiding" value={`${guide.yearsGuiding} yrs`} />
            <Stat label="Languages" value={guide.languages.length} />
          </div>
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1fr_320px]">
          <div>
            <div className="flex flex-wrap gap-1 rounded-xl border border-border bg-card p-1">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`rounded-lg px-4 py-2 text-sm font-semibold transition-all ${
                    activeTab === tab ? "bg-primary text-white shadow-sm" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab}
                  {tab === "Tours" && ` (${tours.length})`}
                  {tab === "Reviews" && ` (${guide.reviews})`}
                </button>
              ))}
            </div>

            <div className="mt-6">
              {activeTab === "About" && <AboutTab guide={guide} />}
              {activeTab === "Tours" && <ToursTab tours={tours} />}
              {activeTab === "Reviews" && <ReviewsTab guide={guide} />}
              {activeTab === "Availability" && <AvailabilityTab />}
            </div>
          </div>

          <aside className="h-fit space-y-4 lg:sticky lg:top-20">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
              {/* <div className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                <Star className="h-4 w-4 fill-primary text-primary" /> {guide.rating}
                <span className="font-normal text-muted-foreground">· {guide.reviews} reviews</span>
              </div> */}
              <Button variant="hero" size="xl" className="mt-4 w-full">Request booking</Button>
              {/* <Button variant="outline" size="lg" className="mt-2 w-full">Contact guide</Button> */}
              <p className="mt-3 text-xs text-muted-foreground">
                You won't be charged yet.
              </p>
              <ul className="mt-4 space-y-2 border-t border-border pt-4 text-xs text-muted-foreground">
                <li className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-secondary" /> Free cancellation up to 48h</li>
                <li className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-secondary" /> Verified by Nomade</li>
                <li className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-secondary" /> Licensed guide</li>
              </ul>
            </div>
            {/* <div className="rounded-2xl border border-border bg-card p-5">
              <p className="text-sm font-semibold text-foreground">Report this profile</p>
              <p className="mt-1 text-xs text-muted-foreground">Something feel off? Let our trust team know.</p>
            </div> */}
          </aside>
        </div>
      </div>

      <div className="mt-16">
        <Footer />
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl bg-muted/60 px-3 py-2.5 text-center">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className="mt-1 text-sm font-bold text-foreground">{value}</div>
    </div>
  );
}

function AboutTab({ guide }) {
  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-6">
        <h3 className="text-base font-semibold text-foreground">About {guide.name.split(" ")[0]}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {guide.about || `${guide.name} has been guiding travelers through ${guide.city} for ${guide.yearsGuiding} years, specializing in ${guide.specialty.toLowerCase()}.`}
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="text-base font-semibold text-foreground">Specializations</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {(guide.specializations || [guide.specialty]).map((s) => (
              <span key={s} className="rounded-full bg-secondary-soft px-3 py-1 text-xs font-medium text-secondary">{s}</span>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="text-base font-semibold text-foreground">Languages</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {guide.languages.map((l) => (
              <span key={l} className="rounded-full bg-muted px-3 py-1 text-xs font-medium text-foreground">{l}</span>
            ))}
          </div>
        </div>
      </div>

      {guide.trust && (
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="flex items-center gap-2 text-base font-semibold text-foreground">
            <ShieldCheck className="h-4 w-4 text-secondary" /> Trust & verification
          </h3>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {guide.trust.map((t) => (
              <li key={t} className="flex items-start gap-2 text-sm text-muted-foreground">
                <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-secondary" /> {t}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function ToursTab({ tours }) {
  if (tours.length === 0) {
    return <p className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">This guide hasn't published any tours yet.</p>;
  }
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
      {tours.map((t) => (
        <TourCard key={t.slug} {...t} className="w-full" />
      ))}
    </div>
  );
}

function ReviewsTab({ guide }) {
  const breakdown = guide.ratingBreakdown || { 5: 80, 4: 15, 3: 3, 2: 1, 1: 1 };
  const categories = guide.ratingCategories || { Knowledge: guide.rating, Communication: guide.rating, Punctuality: guide.rating, Value: guide.rating };
  const seedReviews = guide.reviewsList || [];

  const currentUser = getCurrentUser();
  const [localReviews, setLocalReviews] = useState(() => getReviewsForGuide(guide.slug));
  const [modalOpen, setModalOpen] = useState(false);

  const myReview = currentUser ? localReviews.find((r) => r.reviewerEmail === currentUser.email) : null;
  const otherLocalReviews = localReviews.filter((r) => r.reviewerEmail !== currentUser?.email);

  const refresh = () => setLocalReviews(getReviewsForGuide(guide.slug));

  const handleSave = ({ rating, text }) => {
    saveReview(guide.slug, currentUser.email, { name: currentUser.name, rating, text });
    refresh();
    setModalOpen(false);
  };

  const handleDelete = () => {
    if (!window.confirm("Delete your review? This can't be undone.")) return;
    deleteReview(guide.slug, currentUser.email);
    refresh();
  };

  const noReviewsAtAll = seedReviews.length === 0 && otherLocalReviews.length === 0 && !myReview;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="grid gap-6 sm:grid-cols-[auto_1fr]">
          <div className="text-center sm:text-left">
            <div className="text-4xl font-bold text-foreground">{guide.rating}</div>
            <div className="mt-1 flex items-center justify-center gap-0.5 sm:justify-start">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-primary text-primary" />
              ))}
            </div>
            <div className="mt-1 text-xs text-muted-foreground">{guide.reviews} verified reviews</div>
          </div>
          <div className="space-y-1.5">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="w-3">{star}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                  <div className="h-full bg-primary" style={{ width: `${breakdown[star] || 0}%` }} />
                </div>
                <span className="w-8 text-right">{breakdown[star] || 0}%</span>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 border-t border-border pt-6 sm:grid-cols-4">
          {Object.entries(categories).map(([label, value]) => (
            <Stat key={label} label={label} value={value.toFixed ? value.toFixed(2) : value} />
          ))}
        </div>
      </div>

      {/* Write / edit / delete your own review */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            {myReview ? "Your review" : "Share your experience"}
          </h3>
          <p className="text-xs text-muted-foreground">
            {!currentUser
              ? "Log in to rate and review this guide."
              : myReview
              ? "You can edit or remove it anytime."
              : "Rate this guide and leave a few words for other travelers."}
          </p>
        </div>
        {!currentUser ? (
          <Link to="/login" className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white hover:brightness-110">
            Log in
          </Link>
        ) : myReview ? (
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted"
            >
              <Pencil className="h-3.5 w-3.5" /> Edit
            </button>
            <button
              type="button"
              onClick={handleDelete}
              className="inline-flex items-center gap-1.5 rounded-lg border border-destructive/30 bg-card px-3.5 py-2 text-xs font-semibold text-destructive hover:bg-destructive/5"
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white hover:brightness-110"
          >
            Write a review
          </button>
        )}
      </div>

      <div className="space-y-4">
        {noReviewsAtAll ? (
          <p className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">No written reviews yet.</p>
        ) : (
          <>
            {myReview && <ReviewCard review={myReview} mine />}
            {otherLocalReviews.map((r) => (
              <ReviewCard key={r.reviewerEmail} review={r} />
            ))}
            {seedReviews.map((r) => (
              <ReviewCard key={r.name} review={r} />
            ))}
          </>
        )}
      </div>

      {modalOpen && (
        <ReviewModal
          initial={myReview}
          guideName={guide.name}
          onCancel={() => setModalOpen(false)}
          onSave={handleSave}
        />
      )}
    </div>
  );
}

function ReviewCard({ review, mine = false }) {
  return (
    <div className={`rounded-2xl border p-5 ${mine ? "border-primary/30 bg-primary-soft/40" : "border-border bg-card"}`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            {review.name}
            {mine && <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-white">You</span>}
          </div>
          <div className="text-xs text-muted-foreground">
            {[review.country, review.date].filter(Boolean).join(" · ")}
          </div>
        </div>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: review.rating }).map((_, i) => (
            <Star key={i} className="h-3.5 w-3.5 fill-primary text-primary" />
          ))}
        </div>
      </div>
      {review.tour && <p className="mt-1 text-xs font-medium text-secondary">{review.tour}</p>}
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{review.text}</p>
    </div>
  );
}

function ReviewModal({ initial, guideName, onCancel, onSave }) {
  const [rating, setRating] = useState(initial?.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [text, setText] = useState(initial?.text || "");
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rating) {
      setError("Pick a star rating before saving.");
      return;
    }
    onSave({ rating, text: text.trim() });
  };

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/45 p-5"
      onClick={onCancel}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-elegant"
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-foreground">{initial ? "Edit your review" : "Write a review"}</h2>
            <p className="mt-1 text-xs text-muted-foreground">Share how your experience with {guideName.split(" ")[0]} went.</p>
          </div>
          <button type="button" onClick={onCancel} aria-label="Close" className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted">
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        <div className="mt-5">
          <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">Your rating</label>
          <div className="flex gap-1" onMouseLeave={() => setHoverRating(0)}>
            {[1, 2, 3, 4, 5].map((n) => (
              <button
                key={n}
                type="button"
                onMouseEnter={() => setHoverRating(n)}
                onClick={() => setRating(n)}
                aria-label={`${n} star${n > 1 ? "s" : ""}`}
                className="p-0.5"
              >
                <Star
                  className={`h-7 w-7 transition-colors ${
                    (hoverRating || rating) >= n ? "fill-primary text-primary" : "fill-transparent text-muted-foreground"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <label htmlFor="review-text" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Your review (optional)
          </label>
          <textarea
            id="review-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={4}
            placeholder="What stood out about this guide?"
            className="w-full rounded-lg border border-border bg-background p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary"
          />
        </div>

        {error && <p className="mt-3 text-xs font-medium text-destructive">{error}</p>}

        <div className="mt-6 flex justify-end gap-2">
          <button type="button" onClick={onCancel} className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted">
            Cancel
          </button>
          <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:brightness-110">
            {initial ? "Save changes" : "Post review"}
          </button>
        </div>
      </form>
    </div>
  );
}

function AvailabilityTab() {
  const [monthOffset, setMonthOffset] = useState(0);
  const { label, weeks } = useMemo(() => buildMonth(monthOffset), [monthOffset]);

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-foreground">Availability calendar</h3>
          <p className="text-xs text-muted-foreground">Select up to two months to see when this guide is free.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMonthOffset((m) => Math.max(0, m - 1))}
            className="rounded-full border border-border p-1.5 text-muted-foreground hover:bg-muted disabled:opacity-40"
            disabled={monthOffset === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-sm font-semibold text-foreground">{label}</span>
          <button
            type="button"
            onClick={() => setMonthOffset((m) => Math.min(1, m + 1))}
            className="rounded-full border border-border p-1.5 text-muted-foreground hover:bg-muted disabled:opacity-40"
            disabled={monthOffset === 1}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-5 grid grid-cols-7 gap-1.5 text-center text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
        {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
          <div key={d}>{d}</div>
        ))}
      </div>
      <div className="mt-2 grid grid-cols-7 gap-1.5">
        {weeks.flat().map((day, i) =>
          day ? (
            <div
              key={i}
              className={`flex aspect-square items-center justify-center rounded-lg border text-sm ${dayClasses(day.status)}`}
            >
              {day.date}
            </div>
          ) : (
            <div key={i} />
          )
        )}
      </div>

      <div className="mt-5 flex flex-wrap gap-4 text-xs text-muted-foreground">
        <Legend swatch="border-border bg-card" label="Available" />
        <Legend swatch="border-primary bg-primary-soft" label="Selected" />
        <Legend swatch="border-border bg-muted" label="Booked" />
        <Legend swatch="border-secondary bg-secondary-soft" label="Limited (1–2 slots)" />
      </div>
    </div>
  );
}

function Legend({ swatch, label }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`h-3 w-3 rounded border ${swatch}`} /> {label}
    </span>
  );
}

function dayClasses(status) {
  switch (status) {
    case "booked":
      return "border-border bg-muted text-muted-foreground/60";
    case "limited":
      return "border-secondary bg-secondary-soft text-secondary font-semibold";
    case "selected":
      return "border-primary bg-primary-soft text-primary font-semibold";
    default:
      return "border-border bg-card text-foreground hover:border-primary cursor-pointer";
  }
}

/** Builds a deterministic demo month grid (Mon-first weeks) with mock availability. */
function buildMonth(offset) {
  const base = new Date();
  const first = new Date(base.getFullYear(), base.getMonth() + offset, 1);
  const label = first.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const daysInMonth = new Date(first.getFullYear(), first.getMonth() + 1, 0).getDate();
  const startWeekday = (first.getDay() + 6) % 7; // Mon = 0

  const cells = Array(startWeekday).fill(null);
  for (let d = 1; d <= daysInMonth; d++) {
    const seed = (d * 7) % 11;
    let status = "available";
    if (seed < 2) status = "booked";
    else if (seed < 4) status = "limited";
    else if (d === 4 || d === 15 || d === 26) status = "selected";
    cells.push({ date: d, status });
  }
  while (cells.length % 7 !== 0) cells.push(null);

  const weeks = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  return { label, weeks };
}
