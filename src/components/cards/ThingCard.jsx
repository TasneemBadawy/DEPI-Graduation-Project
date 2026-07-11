import { useState } from "react";
import { Link } from "react-router-dom";
import { Bookmark } from "lucide-react";
import { isActivitySaved, toggleSavedActivity } from "../../lib/savedActivities";

export default function ThingCard({ slug, title, image, tag, price, city, className = "" }) {
  const [saved, setSaved] = useState(() => isActivitySaved(slug));

  const handleToggleSave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const nowSaved = toggleSavedActivity({ slug, title, city, price });
    setSaved(nowSaved);
  };

  return (
    <Link
      to={`/experiences/${slug}`}
      className={`group/card relative block h-[220px] w-[240px] shrink-0 snap-start overflow-hidden rounded-2xl transition-all duration-300 hover:-translate-y-1 sm:w-[260px] ${className}`}
    >
      <img
        src={image}
        alt={title}
        loading="lazy"
        className="h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
      <span className="absolute left-3 top-3 rounded-full bg-white/15 px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm ring-1 ring-white/25">
        {tag}
      </span>
      <button
        type="button"
        onClick={handleToggleSave}
        aria-pressed={saved}
        aria-label={saved ? "Remove from saved activities" : "Save this activity"}
        className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm ring-1 ring-white/25 transition-colors hover:bg-white/25"
      >
        <Bookmark className={saved ? "h-4 w-4 fill-primary text-primary" : "h-4 w-4 text-white"} />
      </button>
      <h3 className="absolute bottom-3 left-3 right-3 text-base font-semibold leading-tight text-white">
        {title}
      </h3>
    </Link>
  );
}
