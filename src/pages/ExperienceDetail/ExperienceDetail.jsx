import { useState, useEffect } from "react";
import { useParams, Navigate } from "react-router-dom";
import { MapPin, Bookmark } from "lucide-react";
import Button from "../../components/ui/Button";
import Footer from "../../components/Footer";
import { getExperienceById } from "../../lib/experienceStore";
import { isActivitySaved, toggleSavedActivity } from "../../lib/savedActivities";

export default function ExperienceDetail() {
  const { slug } = useParams();
  const [exp, setExp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const loadExperience = async () => {
      setLoading(true);
      try {
        const data = await getExperienceById(slug);
        setExp(data);
        if (data) {
          setSaved(isActivitySaved(data.slug || data.Activity_ID));
        }
      } catch (error) {
        console.error("Error loading experience:", error);
        setExp(null);
      } finally {
        setLoading(false);
      }
    };
    loadExperience();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p>Loading experience...</p>
      </div>
    );
  }

  if (!exp) return <Navigate to="/experiences" replace />;

  const handleToggleSave = () => {
    const nowSaved = toggleSavedActivity({
      slug: exp.slug || exp.Activity_ID,
      title: exp.title || exp.Activity_name,
      city: exp.city || exp.City,
      price: exp.price || exp.Price,
    });
    setSaved(nowSaved);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="h-64 w-full overflow-hidden sm:h-96">
        <img src={exp.image || exp.Image || "/default-experience.jpg"} alt={exp.title || exp.Activity_name} className="h-full w-full object-cover" />
      </div>

      <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-secondary">
              <MapPin className="h-3.5 w-3.5" /> {exp.city || exp.City}
            </span>
            <span className="ml-2 rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">{exp.tag || exp.Category}</span>
          </div>
          <button
            type="button"
            onClick={handleToggleSave}
            aria-pressed={saved}
            aria-label={saved ? "Remove from saved activities" : "Save this activity"}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground shadow-card transition-colors hover:bg-muted"
          >
            <Bookmark className={saved ? "h-4 w-4 fill-primary text-primary" : "h-4 w-4 text-muted-foreground"} />
            {saved ? "Saved" : "Save"}
          </button>
        </div>
        <h1 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">{exp.title || exp.Activity_name}</h1>

        <div className="mt-6 rounded-2xl border border-border bg-card p-6">
          <h2 className="text-base font-semibold text-foreground">About this experience</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {exp.Description || `A bucket-list moment in ${exp.city || exp.City}, hosted by vetted Nomade locals. Small groups, flexible timing, and everything arranged so you can just show up and enjoy it.`}
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
}