import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, X } from "lucide-react";
import GuideCard from "../../components/cards/GuideCard";
import Footer from "../../components/Footer";
import { GUIDES } from "../../data/guides";

export default function Guides() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  const lang = searchParams.get("lang") || "";
  const minRating = searchParams.get("minRating") || "";

  const clearFilter = (key) => {
    const next = new URLSearchParams(searchParams);
    next.delete(key);
    setSearchParams(next);
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const langQ = lang.trim().toLowerCase();
    const minR = parseFloat(minRating) || 0;

    return GUIDES.filter((g) => {
      const matchesQuery =
        !q ||
        [g.name, g.city, g.country, g.specialty, ...(g.languages || [])].join(" ").toLowerCase().includes(q);
      const matchesLang = !langQ || (g.languages || []).some((l) => l.toLowerCase().includes(langQ));
      const rating = typeof g.rating === "number" ? g.rating : 0;
      const matchesRating = !minR || rating >= minR;
      return matchesQuery && matchesLang && matchesRating;
    });
  }, [query, lang, minRating]);

  const hasActiveFilters = Boolean(lang || minRating);

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
              <GuideCard key={g.slug} {...g} className="w-full" />
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
