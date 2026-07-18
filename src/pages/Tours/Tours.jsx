import { useMemo, useState, useEffect } from "react";
import { Search } from "lucide-react";
import TourCard from "../../components/cards/TourCard";
import Footer from "../../components/Footer";
import { getAllTours } from "../../lib/tourStore";

export default function Tours() {
  const [query, setQuery] = useState("");
  const [allTours, setAllTours] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTours = async () => {
      setLoading(true);
      try {
        const tours = await getAllTours();
        setAllTours(tours);
      } catch (error) {
        console.error("Error loading tours:", error);
        setAllTours([]);
      } finally {
        setLoading(false);
      }
    };
    loadTours();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return allTours;
    return allTours.filter((t) => [t.title, t.city].join(" ").toLowerCase().includes(q));
  }, [query, allTours]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-muted-foreground">Loading tours...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Curated journeys</span>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">All tours</h1>
          <p className="mt-2 max-w-xl text-base text-muted-foreground">
            Multi-day and half-day experiences crafted by Nomade locals around the world.
          </p>
          <div className="mt-6 flex max-w-md items-center gap-3 rounded-full border border-border bg-background px-4 py-2.5">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by tour name or city…"
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        {filtered.length === 0 ? (
          <p className="text-center text-muted-foreground py-16">No tours match "{query}".</p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((t) => (
              <TourCard key={t.slug} {...t} className="w-full" />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}