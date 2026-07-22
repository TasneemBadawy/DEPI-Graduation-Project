import { Link } from "react-router-dom";
import { Star, BadgeCheck } from "lucide-react";
import { getProfileImageUrl, getInitialsAvatar } from "../../lib/uploadStore";
import { useState } from "react";

export default function GuideCard({ 
  slug, 
  name, 
  photo, 
  city, 
  languages, 
  rating, 
  reviews, 
  specialty, 
  verified, 
  className = "" 
}) {
  const [imgError, setImgError] = useState(false);
  
  let imageSrc = "/default-avatar.jpg";
  
  if (photo && !imgError) {
    if (photo.startsWith('http')) {
      imageSrc = photo;
    } else {
      const fullUrl = getProfileImageUrl(photo);
      imageSrc = fullUrl || "/default-avatar.jpg";
    }
  } else if (name) {
    imageSrc = getInitialsAvatar(name);
  }

  return (
    <Link
      to={`/guides/${slug}`}
      className={`group/card block w-[260px] shrink-0 snap-start overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-elegant sm:w-[280px] ${className}`}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        <img
          src={imageSrc}
          alt={`${name}, ${specialty} guide`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-105"
          onError={() => setImgError(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute right-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2 py-1 text-[11px] font-semibold text-foreground shadow-sm">
          <Star className="h-3 w-3 fill-primary text-primary" /> {rating}
          <span className="text-muted-foreground">({reviews})</span>
        </div>
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <div className="flex items-center gap-1.5">
            <h3 className="text-lg font-semibold leading-tight">{name}</h3>
            {verified && <BadgeCheck className="h-4 w-4 fill-secondary text-white" />}
          </div>
          <p className="text-xs text-white/80">{city}</p>
        </div>
      </div>
      <div className="p-3.5">
        <p className="text-sm font-medium text-foreground line-clamp-1">{specialty}</p>
        <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{languages?.join(" · ") || ""}</p>
        {/* ✅ Add Book button */}
        <Link
          to={`/booking/${slug}`}
          className="mt-3 block w-full text-center btn btn-warm btn-sm"
          onClick={(e) => e.stopPropagation()}
        >
          Book Now
        </Link>
      </div>
    </Link>
  );
}