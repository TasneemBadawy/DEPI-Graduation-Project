import { useState } from "react";
import { useParams, Link, Navigate } from "react-router-dom";
import { Star, MapPin, Clock, Users, Heart } from "lucide-react";
import Button from "../../components/ui/Button";
import Footer from "../../components/Footer";
import { TOURS } from "../../data/tours";
import { getGuideBySlug } from "../../data/guides";
import { isTourSaved, toggleSavedTour } from "../../lib/savedTours";

export default function TourDetail() {
  const { slug } = useParams();
  const tour = TOURS.find((t) => t.slug === slug);
  const [saved, setSaved] = useState(tour ? isTourSaved(tour.slug) : false);

  if (!tour) return <Navigate to="/tours" replace />;

  const guide = getGuideBySlug(tour.guideSlug);

  const handleToggleSave = () => {
    const nowSaved = toggleSavedTour(tour);
    setSaved(nowSaved);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="h-64 w-full overflow-hidden sm:h-96">
        <img src={tour.image} alt={tour.title} className="h-full w-full object-cover" />
      </div>

      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_320px]">
          <div>
            <div className="flex items-start justify-between gap-4">
              <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-secondary">
                <MapPin className="h-3.5 w-3.5" /> {tour.city}
              </span>
              <button
                type="button"
                onClick={handleToggleSave}
                aria-pressed={saved}
                aria-label={saved ? "Remove from saved tours" : "Save this tour"}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground shadow-card transition-colors hover:bg-muted"
              >
                <Heart className={saved ? "h-4 w-4 fill-primary text-primary" : "h-4 w-4 text-muted-foreground"} />
                {saved ? "Saved" : "Save"}
              </button>
            </div>
            <h1 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">{tour.title}</h1>
            <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <span className="inline-flex items-center gap-1 font-semibold text-foreground">
                <Star className="h-4 w-4 fill-primary text-primary" /> {tour.rating} ({tour.reviews} reviews)
              </span>
              <span className="inline-flex items-center gap-1"><Clock className="h-4 w-4" /> {tour.duration}</span>
              <span className="inline-flex items-center gap-1"><Users className="h-4 w-4" /> {tour.groupSize}</span>
            </div>

            <div className="mt-6 rounded-2xl border border-border bg-card p-6">
              <h2 className="text-base font-semibold text-foreground">About this tour</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                Join a Nomade local for {tour.title.toLowerCase()} — a {tour.duration.toLowerCase()} experience
                designed around real stories, unhurried pacing, and the small details a guidebook would miss.
                Perfect for {tour.groupSize.toLowerCase()}.
              </p>
            </div>

            {guide && (
              <Link
                to={`/guides/${guide.slug}`}
                className="mt-6 flex items-center gap-3 rounded-2xl border border-border bg-card p-4 transition-colors hover:bg-muted/50"
              >
                <img src={guide.photo} alt={guide.name} className="h-12 w-12 rounded-full object-cover" />
                <div>
                  <div className="text-sm font-semibold text-foreground">Hosted by {guide.name}</div>
                  <div className="text-xs text-muted-foreground">{guide.tagline}</div>
                </div>
              </Link>
            )}
          </div>

          <aside className="h-fit rounded-2xl border border-border bg-card p-5 shadow-card lg:sticky lg:top-20">
            <div className="text-sm text-muted-foreground">from</div>
            <div className="text-2xl font-bold text-foreground">
              ${tour.price} <span className="text-sm font-normal text-muted-foreground">/ person</span>
            </div>
            <Button variant="hero" size="xl" className="mt-4 w-full">Check availability</Button>
            <p className="mt-3 text-center text-xs text-muted-foreground">You won't be charged yet.</p>
          </aside>
        </div>
      </div>

      <Footer />
    </div>
  );
}
