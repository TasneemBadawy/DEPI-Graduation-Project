import { useState } from "react";
import { X, Users, DollarSign, Calendar, MapPin, Clock, CreditCard } from "lucide-react";

const PAYMENT_METHODS = ["Credit Card", "PayPal", "Cash", "Bank Transfer"];

export default function BookingModal({ tour, guideName, onClose, onConfirm }) {
  const [travelers, setTravelers] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState("Credit Card");
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const totalPrice = tour.price * travelers;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (travelers < 1) {
      setError("Please select at least 1 traveler");
      return;
    }
    setIsSubmitting(true);
    setError("");

    onConfirm({
      travelers,
      totalPrice,
      paymentMethod,
      note: note.trim(),
      date: new Date().toISOString().split('T')[0],
      time: "09:00",
    });
  };

  const handleIncrement = () => setTravelers(prev => prev + 1);
  const handleDecrement = () => setTravelers(prev => Math.max(1, prev - 1));

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl border border-border bg-card shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border p-4">
          <div>
            <h2 className="text-lg font-bold text-foreground">Confirm Booking</h2>
            <p className="text-sm text-muted-foreground">
              with {guideName || "Guide"}
            </p>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-muted-foreground hover:bg-muted transition-colors"
            disabled={isSubmitting}
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Tour Details */}
          <div className="rounded-xl bg-muted/40 p-4">
            <h3 className="font-semibold text-foreground">{tour.title}</h3>
            <div className="mt-2 grid grid-cols-2 gap-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-2">
                <MapPin className="h-4 w-4" /> {tour.city}
              </span>
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4" /> {tour.duration || "Half day"}
              </span>
              <span className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" /> ${tour.price} / person
              </span>
              <span className="flex items-center gap-2">
                <Calendar className="h-4 w-4" /> Flexible dates
              </span>
            </div>
          </div>

          {/* Travelers */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Number of Travelers
            </label>
            <div className="flex items-center gap-4">
              <button
                type="button"
                onClick={handleDecrement}
                className="rounded-full border border-border p-2 text-foreground hover:bg-muted transition-colors"
                disabled={travelers <= 1}
              >
                <span className="text-lg font-bold">−</span>
              </button>
              <span className="text-2xl font-bold text-foreground w-12 text-center">
                {travelers}
              </span>
              <button
                type="button"
                onClick={handleIncrement}
                className="rounded-full border border-border p-2 text-foreground hover:bg-muted transition-colors"
              >
                <span className="text-lg font-bold">+</span>
              </button>
              <span className="text-sm text-muted-foreground">
                <Users className="inline h-4 w-4 mr-1" />
                max {tour.groupSize || "10"} travelers
              </span>
            </div>
          </div>

          {/* Total Price */}
          <div className="rounded-xl bg-primary-soft/40 p-4 border border-primary/20">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Total Price</span>
              <span className="text-2xl font-bold text-primary">
                ${totalPrice}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              ${tour.price} × {travelers} traveler{travelers > 1 ? 's' : ''}
            </p>
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Payment Method
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PAYMENT_METHODS.map((method) => (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className={`flex items-center gap-2 rounded-lg border p-3 text-sm transition-all ${
                    paymentMethod === method
                      ? "border-primary bg-primary-soft text-primary font-semibold"
                      : "border-border bg-card text-muted-foreground hover:bg-muted"
                  }`}
                >
                  <CreditCard className="h-4 w-4" />
                  {method}
                </button>
              ))}
            </div>
          </div>

          {/* Note */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-2">
              Special Requests <span className="text-xs font-normal text-muted-foreground">(optional)</span>
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Any special requests or questions for the guide..."
              className="w-full rounded-lg border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary resize-none"
              rows={3}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-outline w-full sm:w-auto"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-warm w-full sm:w-auto"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Confirming..." : "Confirm Booking"}
            </button>
          </div>

          <p className="text-center text-xs text-muted-foreground">
            You won't be charged yet. The guide will confirm your booking.
          </p>
        </form>
      </div>
    </div>
  );
}