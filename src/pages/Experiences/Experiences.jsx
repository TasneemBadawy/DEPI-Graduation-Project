import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import ThingCard from "../../components/cards/ThingCard";
import Footer from "../../components/Footer";
import { EXPERIENCES } from "../../data/experiences";

export default function Experiences() {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return EXPERIENCES;
    return EXPERIENCES.filter((e) => [e.title, e.city, e.tag].join(" ").toLowerCase().includes(q));
  }, [query]);

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
          <p className="text-center text-muted-foreground py-16">No experiences match "{query}".</p>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((e) => (
              <ThingCard key={e.slug} {...e} className="w-full" />
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
