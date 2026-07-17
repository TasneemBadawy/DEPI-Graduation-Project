import { useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Search, SlidersHorizontal, MapPin, Languages, Star, Users,
  ArrowRight, ShieldCheck, Sparkles, Globe2, Heart, Quote,
} from "lucide-react";

import Button from "../../components/ui/Button";
import Section from "../../components/Section";
import Rail from "../../components/Rail";
import Footer from "../../components/Footer";
import GuideCard from "../../components/cards/GuideCard";
import TourCard from "../../components/cards/TourCard";
import ThingCard from "../../components/cards/ThingCard";

import { getAllTours } from "../../lib/tourStore";
import { getAllExperiences } from "../../lib/experienceStore";
import { fetchGuidesWithStatus } from "../../lib/adminStore";
import { TESTIMONIALS } from "../../data/testimonials";

import heroPyramids from "../../assets/hero-pyramids.jpg";

export default function Home() {
  const location = useLocation();
  const [tours, setTours] = useState([]);
  const [guides, setGuides] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch all data from API
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch tours from API
        const toursData = await getAllTours();
        setTours(Array.isArray(toursData) ? toursData : []);
        
        // Fetch guides from API
        const guidesData = await fetchGuidesWithStatus();
        setGuides(Array.isArray(guidesData) ? guidesData : []);
        
        // Fetch experiences from API
        const experiencesData = await getAllExperiences();
        setExperiences(Array.isArray(experiencesData) ? experiencesData : []);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message || "Failed to load data");
        setTours([]);
        setGuides([]);
        setExperiences([]);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Smooth scroll for hash links
  useEffect(() => {
    if (!location.hash) return;
    const id = location.hash.slice(1);
    const timer = setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }, 60);
    return () => clearTimeout(timer);
  }, [location.hash]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center flex-col gap-4 p-4">
        <p className="text-destructive">Error loading data: {error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="btn btn-warm"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Hero />
      <TrustStrip />

      <Section
        id="top-guides"
        eyebrow="Verified hosts"
        title="Top guides this month"
        subtitle="Hand-picked locals with the highest ratings and traveler reviews."
        actionLabel="View all guides"
        actionTo="/guides"
      >
        <Rail>
          {guides.length > 0 ? (
            guides.slice(0, 6).map((g) => (
              <GuideCard 
                key={g.Guide_ID || g.slug} 
                slug={g.Guide_ID || g.slug}
                name={g.name || `${g.FName || ''} ${g.LName || ''}`.trim() || "Guide"}
                photo={g.photo || g.Profile_Image}
                city={g.city || g.Country || "Unknown"}
                languages={g.languages || []}
                rating={g.rating || 4.5}
                reviews={g.reviews || 0}
                specialty={g.specialty || g.specializations?.[0] || "Tour Guide"}
                verified={g.verified || false}
              />
            ))
          ) : (
            <p className="text-muted-foreground">No guides available</p>
          )}
        </Rail>
        <div className="mx-auto mt-10 flex max-w-7xl justify-center px-5 sm:px-8">
          <Link to="/guides" className="inline-flex">
            <Button variant="hero" size="xl">
              Browse all guides <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </Section>

      <Section
        id="popular-tours"
        eyebrow="Curated journeys"
        title="Popular city tours"
        subtitle="Multi-day experiences crafted by Nomade locals."
        actionLabel="Explore all tours"
        actionTo="/tours"
        soft
      >
        <Rail>
          {tours.length > 0 ? (
            tours.slice(0, 6).map((t) => (
              <TourCard key={t.slug} {...t} />
            ))
          ) : (
            <p className="text-muted-foreground">No tours available</p>
          )}
        </Rail>
      </Section>

      <Section
        id="things-to-do"
        eyebrow="Bucket list"
        title="Things to do around the world"
        subtitle="From sunrise balloons over Luxor to Red Sea diving — and beyond."
        actionLabel="Browse experiences"
        actionTo="/experiences"
      >
        <Rail>
          {experiences.length > 0 ? (
            experiences.slice(0, 6).map((exp) => (
              <ThingCard 
                key={exp.Activity_ID || exp.slug} 
                slug={exp.Activity_ID || exp.slug}
                title={exp.Activity_name || exp.title}
                image={exp.Image || exp.image || "/default-experience.jpg"}
                tag={exp.Category || exp.tag || "Experience"}
                price={exp.Price || exp.price || 0}
                city={exp.City || exp.city || "Unknown"}
              />
            ))
          ) : (
            <p className="text-muted-foreground">No experiences available</p>
          )}
        </Rail>
      </Section>

      <Testimonials />
      <AboutSection />
      <Footer />
    </div>
  );
}

/* ───────────────────────────── HERO ───────────────────────────── */

function Hero() {
  return (
    <section className="relative isolate overflow-hidden">
      <img
        src={heroPyramids}
        alt="Scenic global landscape glowing at golden-hour sunset"
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/60 via-black/20 to-background" />

      <div className="mx-auto flex min-h-[92vh] max-w-7xl flex-col justify-end px-5 pb-14 pt-32 sm:px-8 sm:pb-20 sm:pt-40">
        <div className="max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full bg-white/12 px-3 py-1 text-xs font-medium text-white backdrop-blur-md ring-1 ring-white/25">
            <Sparkles className="h-3.5 w-3.5" /> 12,000+ travelers · 4.9 average rating
          </span>
          <h1 className="mt-5 text-4xl font-semibold leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl">
            Discover the World,
            <br />
            <span className="italic font-light text-white/90">guided by locals !!</span>
          </h1>
          <p className="mt-5 max-w-xl text-base text-white/85 sm:text-lg">
            Find verified guides, curated city tours, and unforgettable
            experiences — in every corner of the world.
          </p>
        </div>

        <SearchCard />
      </div>
    </section>
  );
}

function SearchCard() {
  const navigate = useNavigate();
  const [city, setCity] = useState("");
  const [language, setLanguage] = useState("");
  const [minRating, setMinRating] = useState("");
  const [filtersOpen, setFiltersOpen] = useState(false);
  const filterRef = useRef(null);

  useEffect(() => {
    if (!filtersOpen) return;
    const onClickOutside = (e) => {
      if (filterRef.current && !filterRef.current.contains(e.target)) setFiltersOpen(false);
    };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, [filtersOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (city.trim()) params.set("q", city.trim());
    if (language.trim()) params.set("lang", language.trim());
    if (minRating) params.set("minRating", minRating);
    navigate(params.toString() ? `/guides?${params}` : "/guides");
  };

  return (
    <form
      onSubmit={handleSearch}
      className="relative mt-10 w-full rounded-2xl border border-white/40 bg-card/95 p-2.5 shadow-elegant backdrop-blur-xl sm:rounded-full"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <SearchField icon={MapPin} label="City" placeholder="Tokyo, Paris, Cusco…" value={city} onChange={setCity} />
        <div className="hidden h-10 w-px bg-border sm:block" />
        <SearchField icon={Languages} label="Guide language" placeholder="English, Spanish, French…" value={language} onChange={setLanguage} />
        <div ref={filterRef} className="relative flex items-center gap-2 sm:pl-2">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="gap-2"
            onClick={() => setFiltersOpen((o) => !o)}
            aria-expanded={filtersOpen}
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
            {minRating && <span className="ml-0.5 rounded-full bg-primary px-1.5 py-0.5 text-[10px] font-bold text-white">1</span>}
          </Button>

          {filtersOpen && (
            <div className="absolute right-0 top-[calc(100%+0.5rem)] z-20 w-64 rounded-xl border border-border bg-card p-4 text-left shadow-elegant">
              <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                Minimum guide rating
              </label>
              <select
                value={minRating}
                onChange={(e) => setMinRating(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/25"
              >
                <option value="">Any rating</option>
                <option value="4.5">4.5 and up</option>
                <option value="4.8">4.8 and up</option>
                <option value="4.9">4.9 and up</option>
              </select>
              <div className="mt-3 flex gap-2">
                <Button type="button" variant="ghost" size="sm" className="flex-1" onClick={() => setMinRating("")}>
                  Clear
                </Button>
                <Button type="button" variant="hero" size="sm" className="flex-1" onClick={() => setFiltersOpen(false)}>
                  Apply
                </Button>
              </div>
            </div>
          )}

          <Button type="submit" variant="hero" size="lg" className="flex-1 px-7">
            <Search className="h-4 w-4" /> Search
          </Button>
        </div>
      </div>
    </form>
  );
}

function SearchField({ icon: Icon, label, placeholder, value, onChange }) {
  return (
    <label className="group flex flex-1 items-center gap-3 rounded-full px-4 py-2.5 transition-colors hover:bg-muted/60 sm:py-1.5">
      <Icon className="h-5 w-5 shrink-0 text-primary" />
      <div className="flex-1">
        <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</div>
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm font-medium text-foreground outline-none placeholder:font-normal placeholder:text-muted-foreground/70"
        />
      </div>
    </label>
  );
}

/* ───────────────────────────── TRUST STRIP ───────────────────────────── */

function TrustStrip() {
  const items = [
    { Icon: ShieldCheck, label: "Verified guides", sub: "ID & license checked" },
    { Icon: Star, label: "4.9 avg rating", sub: "From 8,200+ reviews" },
    { Icon: Users, label: "12,000+ travelers", sub: "Joined this year" },
    { Icon: Sparkles, label: "Curated tours", sub: "Locally designed" },
  ];
  return (
    <section className="border-y border-border bg-card">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-y-6 px-5 py-6 sm:grid-cols-4 sm:gap-x-8 sm:px-8">
        {items.map(({ Icon, label, sub }) => (
          <div key={label} className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary-soft text-secondary">
              <Icon className="h-4.5 w-4.5" />
            </div>
            <div>
              <div className="text-sm font-semibold text-foreground">{label}</div>
              <div className="text-xs text-muted-foreground">{sub}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ───────────────────────────── TESTIMONIALS ───────────────────────────── */

function Testimonials() {
  return (
    <section id="testimonials" className="scroll-mt-24 bg-muted/40 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-8 max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Loved by travelers</span>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">What our travelers say</h2>
          <p className="mt-2 text-base text-muted-foreground">Real stories from people who explored the world with Nomade locals.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <article key={t.name} className="relative rounded-2xl border border-border bg-card p-6 shadow-card">
              <Quote className="h-7 w-7 text-primary/30" />
              <p className="mt-3 text-sm leading-relaxed text-foreground">"{t.quote}"</p>
              <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                <img src={t.photo} alt={t.name} className="h-10 w-10 rounded-full object-cover" />
                <div>
                  <div className="text-sm font-semibold text-foreground">{t.name}</div>
                  <div className="text-xs text-muted-foreground">{t.trip}</div>
                </div>
                <div className="ml-auto flex items-center gap-0.5 text-sm font-semibold text-foreground">
                  <Star className="h-3.5 w-3.5 fill-primary text-primary" /> {t.rating}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────────────────── ABOUT ───────────────────────────── */

function AboutSection() {
  const values = [
    { Icon: Globe2, title: "Global, local at heart", text: "Curated experiences in 60+ countries, designed and led by people who call them home." },
    { Icon: ShieldCheck, title: "Verified & trusted", text: "Every guide is ID-verified, licensed where required, and reviewed by real travelers." },
    { Icon: Heart, title: "Fair & meaningful", text: "Guides earn a fair share, and travelers get authentic stories you won't find in a guidebook." },
  ];
  return (
    <section id="about" className="scroll-mt-24 px-5 pb-20 pt-16 sm:px-8 sm:pt-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-10 md:grid-cols-[1fr_1.2fr] md:items-center">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">About Nomade</span>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              Travel the world, the way locals live it.
            </h2>
            <p className="mt-4 text-base text-muted-foreground">
              Nomade connects curious travelers with trusted local guides in
              cities and wild places across every continent. We believe the best
              way to discover a destination is through the people who love it
              most — so we built a platform where verified hosts share their
              culture, food, and hidden corners with the world.
            </p>
            <p className="mt-3 text-base text-muted-foreground">
              From sunrise treks in the Andes to slow afternoons in Kyoto,
              every Nomade experience is hand-crafted, ethically priced, and
              built around real human connection.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button variant="hero" size="xl">Learn more about us</Button>
              <Link to="/register">
                <Button variant="outline" size="xl">Become a guide</Button>
              </Link>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-1">
            {values.map(({ Icon, title, text }) => (
              <div key={title} className="flex gap-4 rounded-2xl border border-border bg-card p-5 shadow-card">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-secondary-soft text-secondary">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-base font-semibold text-foreground">{title}</div>
                  <p className="mt-1 text-sm text-muted-foreground">{text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}