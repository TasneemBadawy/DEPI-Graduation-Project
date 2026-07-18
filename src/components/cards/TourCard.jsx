import { useState } from "react";
import { Link } from "react-router-dom";
import { Star, MapPin, Calendar } from "lucide-react";
import { isTourAvailable } from "../../lib/bookingStore";
import { getCurrentUser } from "../../lib/auth";
import BookingModal from "../../components/BookingModal";

export default function TourCard({ slug, title, city, image, duration, price, rating, reviews, className = "", guideName, guideId }) {
  const [showBooking, setShowBooking] = useState(false);
  const [available, setAvailable] = useState(null);
  const [checking, setChecking] = useState(false);
  const currentUser = getCurrentUser();

  const handleCheckAvailability = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setChecking(true);
    // Check availability (mock - you can implement real check)
    const isAvail = isTourAvailable(slug);
    setAvailable(isAvail);
    setChecking(false);
    
    if (isAvail && currentUser) {
      setShowBooking(true);
    }
  };

  return (
    <>
      <Link
        to={`/tours/${slug}`}
        className={`group/card block w-[280px] shrink-0 snap-start overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all duration-300 hover:-translate-y-1 hover:shadow-elegant sm:w-[300px] ${className}`}
      >
        <div className="relative aspect-[4/3] overflow-hidden">
          <img
            src={image}
            alt={title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover/card:scale-105"
          />
          <div className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-1 text-[11px] font-semibold text-foreground shadow-sm">
            <MapPin className="h-3 w-3 text-primary" /> {city}
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-sm font-semibold leading-snug text-foreground line-clamp-2">{title}</h3>
          <div className="mt-2 flex items-center justify-between">
            <span className="inline-flex items-center gap-1 text-xs font-semibold text-foreground">
              <Star className="h-3.5 w-3.5 fill-primary text-primary" /> {rating}
              <span className="font-normal text-muted-foreground">({reviews})</span>
            </span>
            <span className="text-xs text-muted-foreground">{duration}</span>
          </div>
          <div className="mt-2 border-t border-border pt-2 text-sm">
            <span className="text-muted-foreground">from </span>
            <span className="font-bold text-foreground">${price}</span>
            <span className="text-muted-foreground"> /person</span>
          </div>
          <button
            onClick={handleCheckAvailability}
            className="mt-3 w-full btn btn-warm btn-sm"
            disabled={checking}
          >
            {checking ? "Checking..." : "Check Availability"}
          </button>
        </div>
      </Link>

      {/* Booking Modal */}
      {showBooking && (
        <BookingModal
          tour={{ slug, title, city, image, duration, price, rating, reviews }}
          guideName={guideName || "Guide"}
          onClose={() => {
            setShowBooking(false);
            setAvailable(null);
          }}
          onConfirm={(bookingData) => {
            // Create booking
            const { createBooking } = require("../../lib/bookingStore");
            const user = getCurrentUser();
            createBooking({
              touristId: user.id || user.User_ID,
              touristName: user.name,
              touristCountry: user.country || "Unknown",
              guideId: guideId || 1,
              guideName: guideName || "Guide",
              guideRating: 4.5,
              tourId: slug,
              tourTitle: title,
              tourPrice: price,
              city: city,
              duration: duration,
              ...bookingData,
            });
            setShowBooking(false);
            setAvailable(null);
            // Show success message
            alert("Booking confirmed! Check your dashboard.");
          }}
        />
      )}
    </>
  );
}