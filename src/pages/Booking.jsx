// src/pages/Booking.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Calendar, Users, DollarSign, Clock, MapPin } from "lucide-react";
import { getGuideById } from "../lib/guideStore";
import { getToursByGuide } from "../lib/tourStore";
import { getCurrentUser } from "../lib/auth";
import { createBooking } from "../lib/bookingStore";
import BookingModal from "../components/BookingModal";
import Footer from "../components/Footer";
import Navbar from "../components/ui/Navbar";
import TourCard from "../components/cards/TourCard";
import Avatar from "../components/ui/Avatar";

export default function Booking() {
  const { guideId } = useParams();
  const navigate = useNavigate();
  const [guide, setGuide] = useState(null);
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTour, setSelectedTour] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const currentUser = getCurrentUser();

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const guideData = await getGuideById(guideId);
        if (!guideData) {
          setError("Guide not found");
          setLoading(false);
          return;
        }
        setGuide(guideData);

        const toursData = await getToursByGuide(guideId);
        setTours(toursData);
      } catch (err) {
        console.error("Error loading data:", err);
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [guideId]);

  const handleBookTour = (tour) => {
    if (!currentUser) {
      // Redirect to login if not authenticated
      navigate("/login", { state: { from: `/booking/${guideId}` } });
      return;
    }
    setSelectedTour(tour);
    setModalOpen(true);
  };

  const handleConfirmBooking = (bookingData) => {
    const newBooking = createBooking({
      touristId: currentUser.id || currentUser.User_ID,
      touristName: currentUser.name,
      touristCountry: currentUser.country || "Unknown",
      guideId: guideId,
      guideName: `${guide.FName} ${guide.LName}`.trim() || "Guide",
      guideRating: guide.rating || 4.5,
      tourId: selectedTour.id,
      tourTitle: selectedTour.title,
      tourPrice: selectedTour.price,
      city: selectedTour.city,
      duration: selectedTour.duration,
      ...bookingData,
    });
    
    setModalOpen(false);
    // Show success and navigate to dashboard
    navigate("/dashboard/tourist", { 
      state: { bookingSuccess: true, booking: newBooking }
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-muted-foreground">Loading guide's tours...</p>
        </div>
      </div>
    );
  }

  if (error || !guide) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center flex-col gap-4 p-4">
        <p className="text-destructive">{error || "Guide not found"}</p>
        <Link to="/guides" className="btn btn-warm">Back to guides</Link>
      </div>
    );
  }

  const guideName = `${guide.FName || ''} ${guide.LName || ''}`.trim() || "Guide";

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="rounded-full border border-border bg-card p-2 text-muted-foreground hover:bg-muted transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Book with {guideName}</h1>
            <p className="text-sm text-muted-foreground">Select a tour below to start your booking</p>
          </div>
        </div>

        {/* Guide Info */}
        <div className="mb-8 rounded-2xl border border-border bg-card p-6 shadow-card">
          <div className="flex flex-wrap items-center gap-6">
            <Avatar 
              src={guide.Profile_Image} 
              name={guideName} 
              size="xl"
            />
            <div>
              <h2 className="text-xl font-semibold text-foreground">{guideName}</h2>
              <p className="text-sm text-muted-foreground">
                {guide.specializations?.[0] || guide.specialty || "Tour Guide"} · {guide.Country || "Unknown"}
              </p>
              <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <span>{guide.languages?.length || 0} languages</span>
                <span>•</span>
                <span>{guide.toursCompleted || 0} tours completed</span>
                {guide.verified && (
                  <span className="text-secondary">✓ Verified guide</span>
                )}
              </div>
            </div>
          </div>
          {guide.About && (
            <p className="mt-4 text-sm text-muted-foreground border-t border-border pt-4">
              {guide.About.length > 200 ? guide.About.slice(0, 200) + "..." : guide.About}
            </p>
          )}
        </div>

        {/* Tours Grid */}
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-4">
            Available Tours ({tours.length})
          </h3>
          
          {tours.length === 0 ? (
            <div className="rounded-2xl border border-border bg-card p-12 text-center">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">This guide has no available tours yet.</p>
              <p className="text-sm text-muted-foreground mt-2">Check back later for new experiences.</p>
              <Link to="/guides" className="btn btn-warm mt-4 inline-block">
                Browse other guides
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {tours.map((tour) => (
                <div key={tour.slug} className="relative">
                  <TourCard {...tour} className="w-full cursor-pointer" />
                  <button
                    onClick={() => handleBookTour(tour)}
                    className="absolute bottom-4 right-4 btn btn-warm btn-sm z-10"
                  >
                    Book now
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* Booking Modal */}
      {modalOpen && selectedTour && (
        <BookingModal
          tour={selectedTour}
          guideName={guideName}
          onClose={() => setModalOpen(false)}
          onConfirm={handleConfirmBooking}
        />
      )}
    </div>
  );
}