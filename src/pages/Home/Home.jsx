import { useRef, useState } from "react";
import {
  Search, SlidersHorizontal, MapPin, Languages, Star, BadgeCheck,
  ChevronLeft, ChevronRight, ShieldCheck, Sparkles, Users, ArrowRight,
  Compass, Globe2, Heart, Quote
} from "lucide-react";

// همشناهم مؤقتاً عشان الصفحة تفتح ونشوف المشكلة فين
// import { cn } from "../../lib/utils";
// import { Button } from "../../components/ui/button";
// import { SiteHeader } from "../../components/site-header";

// بديل مؤقت للدوال والـ Components عشان الكود ميضربش تحت
const cn = (...classes) => classes.filter(Boolean).join(' ');
function Button({ children, className, ...props }) {
  return <button className={cn("px-4 py-2 bg-blue-500 text-white rounded", className)} {...props}>{children}</button>;
}
function SiteHeader() { return <div className="p-4 bg-white shadow text-center font-bold">Nomade Header</div>; }
// استدعاء الصور
import heroPyramids from "../../assets/hero-pyramids.jpg";
import tourLuxor from "../../assets/tour-luxor.jpg";
import tourCairo from "../../assets/tour-cairo.jpg";
import tourRedSea from "../../assets/tour-redsea.jpg";
import tourAswan from "../../assets/tour-aswan.jpg";
import tourWhiteDesert from "../../assets/tour-whitedesert.jpg";
import tourNile from "../../assets/tour-nile.jpg";
import thingBalloon from "../../assets/thing-balloon.jpg";
import thingDiving from "../../assets/thing-diving.jpg";
import thingCamel from "../../assets/thing-camel.jpg";
import thingFood from "../../assets/thing-food.jpg";
import thingBazaar from "../../assets/thing-bazaar.jpg";
import guide1 from "../../assets/guide-1.jpg";
import guide2 from "../../assets/guide-2.jpg";
import guide3 from "../../assets/guide-3.jpg";
import guide4 from "../../assets/guide-4.jpg";
import guide5 from "../../assets/guide-5.jpg";
import guide6 from "../../assets/guide-6.jpg";

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader transparent />
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
          {GUIDES.map((g) => (
            <GuideCard key={g.name} {...g} />
          ))}
        </Rail>
        <div className="mx-auto mt-10 flex max-w-7xl justify-center px-5 sm:px-8">
          <Button variant="hero" size="xl" className="rounded-full" asChild>
            <a href="/guides">
              Browse all guides <ArrowRight className="h-4 w-4" />
            </a>
          </Button>
        </div>
      </Section>

      <Section
        id="popular-tours"
        eyebrow="Curated journeys"
        title="Popular city tours"
        subtitle="Multi-day experiences crafted by Nomade locals."
        actionLabel="Explore all tours"
        actionTo="/tours"
      >
        <Rail>
          {TOURS.map((t) => (
            <TourCard key={t.title} {...t} />
          ))}
        </Rail>
      </Section>

      <Section
        id="things-to-do"
        eyebrow="Bucket list"
        title="Things to do around the world"
        subtitle="From sunrise balloons over Luxor to Red Sea diving — and beyond."
        actionLabel="Browse experiences"
        actionTo="/experiences"
        soft
      >
        <Rail>
          {THINGS.map((t) => (
            <ThingCard key={t.title} {...t} />
          ))}
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
        width={1920}
        height={1080}
        className="absolute inset-0 -z-10 h-full w-full object-cover"
      />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-foreground/55 via-foreground/15 to-background" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(80%_60%_at_50%_30%,transparent,oklch(0.22_0.03_40/0.45))]" />

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
  const [city, setCity] = useState("");
  const [language, setLanguage] = useState("");

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className="mt-10 w-full rounded-2xl border border-white/40 bg-card/95 p-2.5 shadow-[var(--shadow-elegant)] backdrop-blur-xl sm:rounded-full"
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <SearchField
          icon={MapPin}
          label="City"
          placeholder="Tokyo, Paris, Cusco…"
          value={city}
          onChange={setCity}
        />
        <div className="hidden h-10 w-px bg-border sm:block" />
        <SearchField
          icon={Languages}
          label="Guide language"
          placeholder="English, Spanish, French…"
          value={language}
          onChange={setLanguage}
        />
        <div className="flex items-center gap-2 sm:pl-2">
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="h-12 gap-2 rounded-full border-border bg-card text-foreground hover:bg-muted"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
          </Button>
          <Button type="submit" variant="hero" size="lg" className="h-12 flex-1 gap-2 rounded-full px-7">
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
        <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </div>
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

/* ───────────────────────────── SECTION + RAIL ───────────────────────────── */

function Section({ id, eyebrow, title, subtitle, actionLabel, actionTo, children, soft = false }) {
  return (
    <section id={id} className={cn("scroll-mt-24 py-16 sm:py-20", soft && "bg-muted/40")}>
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-8 flex items-end justify-between gap-6">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
              {eyebrow}
            </span>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-2 text-base text-muted-foreground">{subtitle}</p>
            )}
          </div>
          {actionLabel && actionTo && (
            <a
              href={actionTo}
              className="hidden shrink-0 items-center gap-1.5 text-sm font-semibold text-primary hover:gap-2.5 transition-all sm:inline-flex"
            >
              {actionLabel} <ArrowRight className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
      {children}
    </section>
  );
}

function Rail({ children }) {
  const ref = useRef(null);
  const scroll = (dir) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.85), behavior: "smooth" });
  };

  return (
    <div className="group/rail relative">
      <div
        ref={ref}
        className="no-scrollbar mx-auto flex max-w-[100rem] snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-5 pb-2 sm:gap-5 sm:px-8"
      >
        {children}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 hidden w-12 bg-gradient-to-r from-background to-transparent md:block" />
      <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-12 bg-gradient-to-l from-background to-transparent md:block" />
      <RailBtn dir="left" onClick={() => scroll(-1)} />
      <RailBtn dir="right" onClick={() => scroll(1)} />
    </div>
  );
}

function RailBtn({ dir, onClick }) {
  const Icon = dir === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      onClick={onClick}
      aria-label={`Scroll ${dir}`}
      className={cn(
        "absolute top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-[var(--shadow-card)] transition-all hover:scale-105 hover:bg-card md:flex",
        dir === "left" ? "left-3" : "right-3",
      )}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}

/* ───────────────────────────── CARDS ───────────────────────────── */

function GuideCard({ name, photo, city, languages, rating, reviews, specialty, verified }) {
  return (
    <a
      href={`/guides/${name.toLowerCase().replace(/\s+/g, "-")}`}
      className="group/card block w-[260px] shrink-0 snap-start overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)] sm:w-[280px]"
    >
      <div className="relative aspect-[4/5] overflow-hidden">
        <img
          src={photo}
          alt={`${name}, ${specialty} guide`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/70 via-transparent to-transparent" />
        <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-[11px] font-semibold text-foreground shadow-sm">
          <Star className="h-3 w-3 fill-primary text-primary" /> {rating}
          <span className="text-muted-foreground">({reviews})</span>
        </div>
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <div className="flex items-center gap-1.5">
            <h3 className="text-lg font-semibold leading-tight">{name}</h3>
            {verified && <BadgeCheck className="h-4 w-4 fill-secondary text-white" />}
          </div>
          <div className="mt-0.5 flex items-center gap-1 text-xs text-white/85">
            <MapPin className="h-3 w-3" /> {city}
          </div>
        </div>
      </div>
      <div className="space-y-2 p-4">
        <div className="text-sm font-medium text-foreground">{specialty}</div>
        <div className="flex flex-wrap gap-1">
          {languages.map((l) => (
            <span
              key={l}
              className="inline-flex rounded-full bg-secondary-soft px-2 py-0.5 text-[11px] font-medium text-secondary"
            >
              {l}
            </span>
          ))}
        </div>
      </div>
    </a>
  );
}

function TourCard({ title, city, image, duration, price, rating, reviews }) {
  return (
    <article className="group/card w-[300px] shrink-0 snap-start overflow-hidden rounded-2xl border border-border bg-card shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)] sm:w-[340px]">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-105"
        />
        <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-foreground shadow-sm">
          <MapPin className="h-3 w-3 text-primary" /> {city}
        </span>
      </div>
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-semibold leading-snug text-foreground">{title}</h3>
          <div className="flex shrink-0 items-center gap-0.5 text-sm font-semibold text-foreground">
            <Star className="h-3.5 w-3.5 fill-primary text-primary" /> {rating}
          </div>
        </div>
        <div className="flex items-center justify-between border-t border-border pt-3 text-sm">
          <span className="text-muted-foreground">{duration}</span>
          <span className="font-semibold text-foreground">
            from <span className="text-primary">${price}</span>
            <span className="text-xs font-normal text-muted-foreground"> /person</span>
          </span>
        </div>
        <div className="text-xs text-muted-foreground">{reviews} traveler reviews</div>
      </div>
    </article>
  );
}

function ThingCard({ title, image, tag }) {
  return (
    <article className="group/card relative aspect-[3/4] w-[220px] shrink-0 snap-start overflow-hidden rounded-2xl shadow-[var(--shadow-card)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-elegant)] sm:w-[260px]">
      <img
        src={image}
        alt={title}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-foreground/85 via-foreground/20 to-transparent" />
      <div className="absolute inset-x-4 bottom-4 text-white">
        <span className="inline-flex rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium backdrop-blur-md ring-1 ring-white/25">
          {tag}
        </span>
        <h3 className="mt-2 text-xl font-semibold leading-tight">{title}</h3>
      </div>
    </article>
  );
}

/* ───────────────────────────── CTA + FOOTER ───────────────────────────── */

function Testimonials() {
  return (
    <section id="testimonials" className="scroll-mt-24 bg-muted/40 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="mb-10 max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
            Loved by travelers
          </span>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
            What our travelers say
          </h2>
          <p className="mt-2 text-base text-muted-foreground">
            Real stories from people who explored the world with Nomade locals.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <article
              key={t.name}
              className="relative rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-card)]"
            >
              <Quote className="h-7 w-7 text-primary/30" />
              <p className="mt-3 text-sm leading-relaxed text-foreground">
                "{t.quote}"
              </p>
              <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                <img
                  src={t.photo}
                  alt={t.name}
                  className="h-10 w-10 rounded-full object-cover"
                />
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
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">
              About Nomade
            </span>
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
              <Button variant="hero" size="xl" className="rounded-full" asChild>
                <a href="/about">Learn more about us</a>
              </Button>
              <Button variant="outline" size="xl" className="rounded-full" asChild>
                <a href="/auth">Become a guide</a>
              </Button>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-1">
            {values.map(({ Icon, title, text }) => (
              <div
                key={title}
                className="flex gap-4 rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-card)]"
              >
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

function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:grid-cols-4 sm:px-8">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--gradient-warm)] text-primary-foreground">
              <Compass className="h-4.5 w-4.5" />
            </div>
            <span className="text-lg font-semibold tracking-tight">Nomade</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Authentic travel experiences around the world, hosted by trusted locals.
          </p>
        </div>
        <FooterCol title="Explore" links={["Guides", "Tours", "Cities", "Things to do"]} />
        <FooterCol title="Company" links={["About", "Careers", "Press", "Contact"]} />
        <FooterCol title="Support" links={["Help center", "Trust & safety", "Cancellation", "Terms"]} />
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-5 py-5 text-xs text-muted-foreground sm:flex-row sm:px-8">
          <span>© {new Date().getFullYear()} Nomade Travel Co. All rights reserved.</span>
          <span>Made with care for travelers worldwide</span>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-foreground">{title}</h4>
      <ul className="mt-3 space-y-2">
        {links.map((l) => (
          <li key={l}>
            <a className="text-sm text-muted-foreground hover:text-foreground" href={`/${l.toLowerCase().replace(/\s+/g, "-")}`}>{l}</a>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ───────────────────────────── DATA ───────────────────────────── */

const GUIDES = [
  { name: "Sofia Romano", photo: guide1, city: "Rome", languages: ["English", "Italian"], rating: 4.98, reviews: 312, specialty: "Ancient Rome & Vatican", verified: true },
  { name: "Hiroshi Tanaka", photo: guide2, city: "Tokyo", languages: ["English", "Japanese"], rating: 4.95, reviews: 248, specialty: "Hidden Tokyo & food", verified: true },
  { name: "Mateo Vargas", photo: guide3, city: "Cusco", languages: ["English", "Spanish"], rating: 4.97, reviews: 410, specialty: "Inca trails & Machu Picchu", verified: true },
  { name: "Amélie Laurent", photo: guide4, city: "Paris", languages: ["English", "French", "Italian"], rating: 4.99, reviews: 187, specialty: "Art history & Montmartre", verified: true },
  { name: "Karim El-Sayed", photo: guide5, city: "Cairo", languages: ["English", "Arabic"], rating: 4.92, reviews: 156, specialty: "Pyramids & Egyptology", verified: true },
  { name: "Aroha Ngata", photo: guide6, city: "Queenstown", languages: ["English", "Māori"], rating: 4.96, reviews: 289, specialty: "Fjords & adventure", verified: true },
];

const TOURS = [
  { title: "Colosseum & Ancient Rome walk", city: "Rome", image: tourLuxor, duration: "Full day · 8h", price: 89, rating: 4.9, reviews: 1240 },
  { title: "Machu Picchu sunrise trek", city: "Cusco", image: heroPyramids, duration: "2 days · 1 night", price: 219, rating: 4.95, reviews: 612 },
  { title: "Tokyo street food & neon nights", city: "Tokyo", image: tourCairo, duration: "Half day · 4h", price: 49, rating: 4.88, reviews: 890 },
  { title: "Santorini coastline by boat", city: "Santorini", image: tourRedSea, duration: "Full day · 7h", price: 75, rating: 4.92, reviews: 532 },
  { title: "Marrakech medina & souks", city: "Marrakech", image: tourAswan, duration: "Full day · 6h", price: 65, rating: 4.97, reviews: 318 },
  { title: "Sahara overnight desert camp", city: "Merzouga", image: tourWhiteDesert, duration: "2 days · 1 night", price: 245, rating: 4.96, reviews: 207 },
  { title: "Seine sunset cruise in Paris", city: "Paris", image: tourNile, duration: "Evening · 2h", price: 29, rating: 4.85, reviews: 1421 },
];

const THINGS = [
  { title: "Sunrise hot-air balloon over Cappadocia", image: thingBalloon, tag: "Iconic" },
  { title: "Dive the Great Barrier Reef", image: thingDiving, tag: "Underwater" },
  { title: "Camel ride across the Sahara", image: thingCamel, tag: "Desert" },
  { title: "Street food crawl in Bangkok", image: thingFood, tag: "Food" },
  { title: "Night markets of Marrakech", image: thingBazaar, tag: "Markets" },
  { title: "Sail the Greek islands", image: tourNile, tag: "On water" },
];

const TESTIMONIALS = [
  { name: "Emma Larsson", trip: "Tokyo food tour", photo: guide2, rating: 5.0, quote: "Hiroshi took us to tiny izakayas we never would have found. Best night of our trip — felt like dining with a friend." },
  { name: "Daniel Park", trip: "Machu Picchu trek", photo: guide3, rating: 4.9, quote: "Mateo's knowledge of Inca history made the ruins come alive. The sunrise hike was once-in-a-lifetime." },
  { name: "Chiara Rossi", trip: "Paris art walk", photo: guide4, rating: 5.0, quote: "Amélie turned Montmartre into a living museum. Warm, brilliant, and effortlessly stylish." },
];