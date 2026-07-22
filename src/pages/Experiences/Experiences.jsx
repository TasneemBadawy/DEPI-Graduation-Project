import { useMemo, useState, useEffect } from "react";
import { Search } from "lucide-react";
import ThingCard from "../../components/cards/ThingCard";
import Footer from "../../components/Footer";
import { getAllExperiences } from "../../lib/experienceStore";

export default function Experiences() {
  const [query, setQuery] = useState("");
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadExperiences = async () => {
      setLoading(true);
      try {
        const data = await getAllExperiences();
        console.log("Loaded experiences:", data);
        setExperiences(data);
      } catch (error) {
        console.error("Error loading experiences:", error);
        setExperiences([]);
      } finally {
        setLoading(false);
      }
    };
    loadExperiences();
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return experiences;
    return experiences.filter((e) => 
      [e.Activity_name, e.Category, e.City, e.title, e.tag, e.city]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q)
    );
  }, [query, experiences]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Loading experiences...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">Bucket list</span>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Things to do</h1>
          <p className="mt-2 max-w-xl text-base text-muted-foreground">
            One-off experiences and bucket-list moments around the world.
          </p>
          <div className="mt-6 flex max-w-md items-center gap-3 rounded-full border border-border bg-background px-4 py-2.5">
            <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search experiences…"
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/70"
            />
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No experiences match "{query}".</p>
            <p className="text-sm text-muted-foreground mt-2">Try a different search or check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((e) => (
              <ThingCard 
                key={e.slug || e.Activity_ID} 
                slug={e.slug || e.Activity_ID}
                title={e.title || e.Activity_name || "Experience"}
                image={e.image || e.Image || "/default-experience.jpg"}
                tag={e.tag || e.Category || "Experience"}
                price={e.price || e.Price || 0}
                city={e.city || e.City || "Unknown"}
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