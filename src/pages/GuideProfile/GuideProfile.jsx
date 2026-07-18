import { useMemo, useState, useEffect } from "react";
import { useParams, useLocation, Navigate, Link } from "react-router-dom";
import {
  Star, MapPin, Languages, BadgeCheck, ShieldCheck, ChevronLeft, ChevronRight, Pencil, Trash2, X,
} from "lucide-react";
import Button from "../../components/ui/Button";
import TourCard from "../../components/cards/TourCard";
import Footer from "../../components/Footer";
import Avatar from "../../components/ui/Avatar";
import { getGuideById } from "../../lib/guideStore";
import { getToursByGuide } from "../../lib/tourStore";
import { getReviewsForGuide, addReview, deleteReview } from "../../lib/reviewStore";
import { getCurrentUser } from "../../lib/auth";
import { getProfileImageUrl } from "../../lib/uploadStore";

const TABS = ["About", "Tours", "Reviews", "Availability"];

export default function GuideProfile() {
  const { slug } = useParams();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState("About");
  const [guide, setGuide] = useState(null);
  const [tours, setTours] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const currentUser = getCurrentUser();

  // Load guide data from API
  useEffect(() => {
    const loadGuideData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Get guide by ID
        const guideData = await getGuideById(slug);
        if (!guideData) {
          setError("Guide not found");
          setLoading(false);
          return;
        }
        setGuide(guideData);

        // Get guide's tours
        const toursData = await getToursByGuide(guideData.Guide_ID);
        setTours(toursData);

        // Get guide's reviews
        const reviewsData = await getReviewsForGuide(guideData.Guide_ID);
        setReviews(reviewsData || []);
      } catch (err) {
        console.error("Error loading guide:", err);
        setError(err.message || "Failed to load guide");
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };
    loadGuideData();
  }, [slug]);

  const refreshReviews = async () => {
    if (guide) {
      const reviewsData = await getReviewsForGuide(guide.Guide_ID);
      setReviews(reviewsData || []);
    }
  };

  const handleAddReview = async (reviewData) => {
    try {
      await addReview({
        User_ID: currentUser?.id || currentUser?.User_ID,
        Guide_ID: guide.Guide_ID,
        Title: reviewData.title || "Review",
        Rate: reviewData.rating,
        username: currentUser?.name || "Anonymous",
        Content: reviewData.text
      });
      await refreshReviews();
      setModalOpen(false);
    } catch (error) {
      console.error("Error adding review:", error);
      alert(error.message || "Failed to add review");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    if (!window.confirm("Delete your review? This can't be undone.")) return;
    try {
      await deleteReview(reviewId);
      await refreshReviews();
    } catch (error) {
      console.error("Error deleting review:", error);
      alert(error.message || "Failed to delete review");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Loading guide...</p>
        </div>
      </div>
    );
  }

  if (error || !guide) {
    return <Navigate to="/guides" replace />;
  }

  // Format guide data for display
  const guideDisplay = {
    ...guide,
    name: `${guide.FName || ''} ${guide.LName || ''}`.trim() || "Guide",
    tagline: guide.specializations?.[0] || "Tour Guide",
    city: guide.Country || "Unknown",
    languages: guide.languages || [],
    rating: guide.rating || 4.5,
    reviews: guide.reviews || reviews.length || 0,
    specialty: guide.specializations?.[0] || "Tour Guide",
    yearsGuiding: guide.yearsGuiding || 0,
    toursCompleted: guide.toursCompleted || 0,
    verified: guide.verified || false,
    about: guide.About || `${guide.FName || 'This'} guide has been guiding travelers through ${guide.Country || 'various destinations'} for ${guide.yearsGuiding || 0} years.`,
    specializations: guide.specializations || [],
    photo: guide.Profile_Image || "/default-avatar.jpg",
    cover: guide.cover || "/default-cover.jpg",
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="h-64 w-full overflow-hidden sm:h-80">
        <img src={guideDisplay.cover} alt={`${guideDisplay.city} skyline`} className="h-full w-full object-cover" />
      </div>

      <div className="mx-auto -mt-16 max-w-7xl px-5 sm:px-8">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <Avatar 
                src={guideDisplay.photo} 
                name={guideDisplay.name} 
                size="2xl"
                className="border-4 border-card shadow-card"
              />
              <div>
                <div className="flex items-center gap-1.5">
                  <h1 className="text-xl font-bold text-white sm:text-2xl">{guideDisplay.name}</h1>
                  {guideDisplay.verified && <BadgeCheck className="h-5 w-5 fill-secondary text-white" />}
                </div>
                <p className="text-sm text-muted-foreground">{guideDisplay.tagline}</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1 font-semibold text-foreground">
                    <Star className="h-3.5 w-3.5 fill-primary text-primary" /> {guideDisplay.rating} ({guideDisplay.reviews} reviews)
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="h-3.5 w-3.5" /> {guideDisplay.city}
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Languages className="h-3.5 w-3.5" /> {guideDisplay.languages.length} languages
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-3 gap-3 border-t border-border pt-6 sm:grid-cols-3">
            <Stat label="Tours completed" value={guideDisplay.toursCompleted} />
            <Stat label="Years guiding" value={`${guideDisplay.yearsGuiding} yrs`} />
            <Stat label="Languages" value={guideDisplay.languages.length} />
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
                  {tab === "Reviews" && ` (${reviews.length})`}
                </button>
              ))}
            </div>

            <div className="mt-6">
              {activeTab === "About" && <AboutTab guide={guideDisplay} />}
              {activeTab === "Tours" && <ToursTab tours={tours} />}
              {activeTab === "Reviews" && (
                <ReviewsTab 
                  guide={guideDisplay} 
                  reviews={reviews} 
                  onAddReview={handleAddReview}
                  onDeleteReview={handleDeleteReview}
                  modalOpen={modalOpen}
                  setModalOpen={setModalOpen}
                  currentUser={currentUser}
                />
              )}
              {activeTab === "Availability" && <AvailabilityTab />}
            </div>
          </div>

          <aside className="h-fit space-y-4 lg:sticky lg:top-20">
            <div className="rounded-2xl border border-border bg-card p-5 shadow-card">
              <Button variant="hero" size="xl" className="mt-4 w-full">Request booking</Button>
              <p className="mt-3 text-xs text-muted-foreground">You won't be charged yet.</p>
              <ul className="mt-4 space-y-2 border-t border-border pt-4 text-xs text-muted-foreground">
                <li className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-secondary" /> Free cancellation up to 48h</li>
                <li className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-secondary" /> Verified by Nomade</li>
                <li className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-secondary" /> Licensed guide</li>
              </ul>
            </div>
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
          {guide.about}
        </p>
        
        {/* ✅ Contact & Social Media */}
        <div className="mt-4 pt-4 border-t border-border">
          <h4 className="text-sm font-semibold text-foreground mb-2">Contact & Social</h4>
          {guide.Email && (
            <p className="text-sm text-muted-foreground">
              📧 <a href={`mailto:${guide.Email}`} className="text-primary hover:underline">{guide.Email}</a>
            </p>
          )}
          {guide.phoneNumbers && guide.phoneNumbers.length > 0 && (
            <p className="text-sm text-muted-foreground">
              📞 {guide.phoneNumbers.join(", ")}
            </p>
          )}
          <div className="flex flex-wrap gap-3 mt-2">
            {guide.FaceBook && (
              <a href={guide.FaceBook} target="_blank" rel="noopener noreferrer" 
                 className="text-sm text-primary hover:underline">
                Facebook
              </a>
            )}
            {guide.Linkedin && (
              <a href={guide.Linkedin} target="_blank" rel="noopener noreferrer" 
                 className="text-sm text-primary hover:underline">
                LinkedIn
              </a>
            )}
            {guide.Instagram && (
              <a href={guide.Instagram} target="_blank" rel="noopener noreferrer" 
                 className="text-sm text-primary hover:underline">
                Instagram
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="text-base font-semibold text-foreground">Specializations</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {(guide.specializations || []).map((s) => (
              <span key={s} className="rounded-full bg-secondary-soft px-3 py-1 text-xs font-medium text-secondary">{s}</span>
            ))}
          </div>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6">
          <h3 className="text-base font-semibold text-foreground">Languages</h3>
          <div className="mt-3 flex flex-wrap gap-2">
            {(guide.languages || []).map((l) => (
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

function ReviewsTab({ guide, reviews, onAddReview, onDeleteReview, modalOpen, setModalOpen, currentUser }) {
  const myReview = currentUser ? reviews.find(r => r.User_ID === currentUser.id || r.User_ID === currentUser.User_ID) : null;
  
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
              onClick={() => onDeleteReview(myReview.Review_ID)}
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
        {reviews.length === 0 ? (
          <p className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">No written reviews yet.</p>
        ) : (
          reviews.map((r) => (
            <ReviewCard 
              key={r.Review_ID || r.id} 
              review={r} 
              isMine={currentUser && (r.User_ID === currentUser.id || r.User_ID === currentUser.User_ID)}
            />
          ))
        )}
      </div>

      {modalOpen && (
        <ReviewModal
          initial={myReview}
          guideName={guide.name}
          onCancel={() => setModalOpen(false)}
          onSave={onAddReview}
        />
      )}
    </div>
  );
}

function ReviewCard({ review, isMine = false }) {
  return (
    <div className={`rounded-2xl border p-5 ${isMine ? "border-primary/30 bg-primary-soft/40" : "border-border bg-card"}`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold text-foreground">
            {review.username || review.name || "Anonymous"}
            {isMine && <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold text-white">You</span>}
          </div>
          <div className="text-xs text-muted-foreground">
            {review.date || new Date().toLocaleDateString()}
          </div>
        </div>
        <div className="flex items-center gap-0.5">
          {Array.from({ length: review.Rate || review.rating || 5 }).map((_, i) => (
            <Star key={i} className="h-3.5 w-3.5 fill-primary text-primary" />
          ))}
        </div>
      </div>
      {review.Title && <p className="mt-1 text-xs font-medium text-secondary">{review.Title}</p>}
      <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{review.Content || review.text}</p>
    </div>
  );
}

function ReviewModal({ initial, guideName, onCancel, onSave }) {
  const [rating, setRating] = useState(initial?.Rate || initial?.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [title, setTitle] = useState(initial?.Title || "");
  const [text, setText] = useState(initial?.Content || initial?.text || "");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rating) {
      setError("Pick a star rating before saving.");
      return;
    }
    setSubmitting(true);
    try {
      await onSave({ rating, title, text: text.trim() });
    } catch (err) {
      setError(err.message || "Failed to save review");
    } finally {
      setSubmitting(false);
    }
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
          <label htmlFor="review-title" className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Title (optional)
          </label>
          <input
            id="review-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Brief summary of your experience"
            className="w-full rounded-lg border border-border bg-background p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary"
          />
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
          <button type="button" onClick={onCancel} className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-semibold text-foreground hover:bg-muted" disabled={submitting}>
            Cancel
          </button>
          <button type="submit" className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white hover:brightness-110" disabled={submitting}>
            {submitting ? "Saving..." : initial ? "Save changes" : "Post review"}
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