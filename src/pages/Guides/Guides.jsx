import { useMemo, useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, X } from "lucide-react";
import GuideCard from "../../components/cards/GuideCard";
import Footer from "../../components/Footer";
import { fetchGuidesWithStatus } from "../../lib/adminStore";

export default function Guides() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [allGuides, setAllGuides] = useState([]);
  const [loading, setLoading] = useState(true);

  const lang = searchParams.get("lang") || "";
  const minRating = searchParams.get("minRating") || "";

  // Fetch guides from API
  useEffect(() => {
    const loadGuides = async () => {
      setLoading(true);
      try {
        const guides = await fetchGuidesWithStatus();
        setAllGuides(guides);
      } catch (error) {
        console.error("Error loading guides:", error);
        setAllGuides([]);
      } finally {
        setLoading(false);
      }
    };
    loadGuides();
  }, []);

  const clearFilter = (key) => {
    const next = new URLSearchParams(searchParams);
    next.delete(key);
    setSearchParams(next);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const langQ = lang.trim().toLowerCase();
    const minR = parseFloat(minRating) || 0;

    return allGuides.filter((g) => {
      const matchesQuery =
        !q ||
        [g.name, g.city, g.specialty, ...(g.languages || [])].join(" ").toLowerCase().includes(q);
      const matchesLang = !langQ || (g.languages || []).some((l) => l.toLowerCase().includes(langQ));
      const rating = typeof g.rating === "number" ? g.rating : 0;
      const matchesRating = !minR || rating >= minR;
      return matchesQuery && matchesLang && matchesRating;
    });
  }, [query, lang, minRating, allGuides]);

  const hasActiveFilters = Boolean(lang || minRating);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Loading guides...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Verified hosts</span>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">All guides</h1>
          <p className="mt-2 max-w-xl text-base text-muted-foreground">
            Browse every local expert on Nomade — filtered by city, language, or specialty.
          </p>
          <div className="mt-6 flex max-w-md items-center gap-3 rounded-full border border-border bg-background px-4 py-2.5">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, city, or specialty…"
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
            />
          </div>

          {hasActiveFilters && (
            <div className="mt-3 flex flex-wrap gap-2">
              {lang && (
                <FilterChip label={`Language: ${lang}`} onClear={() => clearFilter("lang")} />
              )}
              {minRating && (
                <FilterChip label={`Rating ${minRating}+`} onClear={() => clearFilter("minRating")} />
              )}
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        {filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">No guides match your search.</p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((g) => (
              <GuideCard 
                key={g.Guide_ID || g.slug} 
                slug={g.Guide_ID || g.slug}
                name={g.name || "Guide"}
                photo={g.photo || g.Profile_Image}
                city={g.city || g.Country || "Unknown"}
                languages={g.languages || []}
                rating={g.rating || 4.5}
                reviews={g.reviews || 0}
                specialty={g.specialty || g.specializations?.[0] || "Tour Guide"}
                verified={g.verified || false}
                className="w-full"
              />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}

function FilterChip({ label, onClear }) {
  return (
    <button
      type="button"
      onClick={onClear}
      className="inline-flex items-center gap-1.5 rounded-full bg-primary-soft px-3 py-1 text-xs font-medium text-primary hover:brightness-95"
    >
      {label} <X className="h-3 w-3" />
    </button>
  );
}