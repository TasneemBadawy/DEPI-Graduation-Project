"use client";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, MapPin, Pencil, Trash2, X, ImagePlus } from "lucide-react";
import { getCurrentUser } from "../../lib/auth";
import { getMyTours, addTour, updateTour, deleteTour } from "../../lib/tourStore";

export default function TourManagement() {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [tours, setTours] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTour, setEditingTour] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTours = async () => {
      setLoading(true);
      try {
        const myTours = await getMyTours();
        setTours(myTours);
      } catch (error) {
        console.error("Error fetching tours:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchTours();
  }, []);

  const refresh = async () => {
    try {
      const myTours = await getMyTours();
      setTours(myTours);
    } catch (error) {
      console.error("Error refreshing tours:", error);
    }
  };

  const openAddModal = () => {
    setEditingTour(null);
    setModalOpen(true);
  };
  const openEditModal = (tour) => {
    setEditingTour(tour);
    setModalOpen(true);
  };

  const handleSave = async (data) => {
    try {
      if (editingTour) {
        await updateTour(editingTour.slug, data);
      } else {
        await addTour(data);
      }
      await refresh();
      setModalOpen(false);
    } catch (error) {
      console.error("Error saving tour:", error);
      alert(error.message || "Failed to save tour. Please try again.");
    }
  };

  const handleDelete = async (tour) => {
    if (!window.confirm(`Delete "${tour.title}"? This can't be undone.`)) return;
    try {
      await deleteTour(tour.slug);
      await refresh();
    } catch (error) {
      console.error("Error deleting tour:", error);
      alert(error.message || "Failed to delete tour. Please try again.");
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--color-primary-soft)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <p>Loading your tours...</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: "var(--color-primary-soft)" }}>
      <div style={{ margin: "0 auto", maxWidth: 960, padding: "32px 24px" }}>
        <button
          onClick={() => navigate("/dashboard/guide")}
          style={{
            display: "flex", alignItems: "center", gap: 6, background: "none", border: "none",
            cursor: "pointer", color: "var(--muted-foreground)", fontSize: 13, padding: 0, marginBottom: 20,
          }}
        >
          <ArrowLeft size={15} /> Back to dashboard
        </button>

        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 700, letterSpacing: "-0.5px", margin: 0, color: "var(--foreground)" }}>
              Tour management
            </h1>
            <p style={{ marginTop: 6, fontSize: 14, color: "var(--muted-foreground)" }}>
              Create and manage the tours you offer to travelers.
            </p>
          </div>
          <button className="btn btn-warm" onClick={openAddModal} style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <Plus size={16} /> Add new tour
          </button>
        </div>

        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "20px 24px", borderBottom: "1px solid var(--border-faint)" }}>
            <h2 style={{ fontSize: 17, fontWeight: 600, margin: 0 }}>Your tours ({tours.length})</h2>
            <p style={{ marginTop: 4, fontSize: 13, color: "var(--muted-foreground)", margin: "4px 0 0" }}>
              These appear on your dashboard and on the Nomade home page.
            </p>
          </div>

          {tours.length === 0 ? (
            <div style={{ padding: "64px 24px", textAlign: "center" }}>
              <div className="icon-box-secondary" style={{ width: 48, height: 48, borderRadius: "50%", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <MapPin size={20} />
              </div>
              <h3 style={{ marginTop: 16, fontSize: 16, fontWeight: 600, margin: "16px 0 0" }}>No tours yet</h3>
              <p style={{ marginTop: 4, fontSize: 13, color: "var(--muted-foreground)", margin: "4px 0 0" }}>
                Add your first tour so travelers can discover and book it.
              </p>
              <button
                className="btn btn-outline"
                onClick={openAddModal}
                style={{ marginTop: 16, display: "inline-flex", alignItems: "center", gap: 6 }}
              >
                <Plus size={15} /> Add your first tour
              </button>
            </div>
          ) : (
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }} className="divide-y">
              {tours.map((t) => (
                <li key={t.slug} style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 16, padding: "16px 24px" }}>
                  <div style={{ width: 72, height: 56, borderRadius: 10, overflow: "hidden", flexShrink: 0, background: "var(--muted)" }}>
                    {t.image && <img src={t.image} alt={t.title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                  </div>
                  <div style={{ flex: 1, minWidth: 160 }}>
                    <p style={{ margin: 0, fontSize: 14, fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {t.title}
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "2px 12px", fontSize: 12, color: "var(--muted-foreground)", marginTop: 2 }}>
                      <span>{t.city}</span>
                      <span>${t.price}/person</span>
                      <span>{t.duration}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                    <button className="btn btn-outline btn-sm" onClick={() => openEditModal(t)} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <Pencil size={13} /> Edit
                    </button>
                    <button className="btn btn-danger btn-sm" onClick={() => handleDelete(t)} style={{ display: "flex", alignItems: "center", gap: 4 }}>
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {modalOpen && (
        <TourModal initial={editingTour} onCancel={() => setModalOpen(false)} onSave={handleSave} />
      )}
    </div>
  );
}

function TourModal({ initial, onCancel, onSave }) {
  const isEdit = Boolean(initial);
  const [title, setTitle] = useState(initial?.title || "");
  const [city, setCity] = useState(initial?.city || "");
  const [country, setCountry] = useState(initial?.country || "");
  const [price, setPrice] = useState(initial?.price ?? "");
  const [days, setDays] = useState(initial?.days ?? 1);
  const [nights, setNights] = useState(initial?.nights ?? 0);
  const [description, setDescription] = useState(initial?.description || "");
  const [image, setImage] = useState(initial?.image || "");
  const [imageFiles, setImageFiles] = useState([]);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      setImageFiles(files);
      const reader = new FileReader();
      reader.onload = () => setImage(reader.result);
      reader.readAsDataURL(files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!title.trim() || !city.trim() || !price) {
      setError("Tour name, location, and price are required.");
      return;
    }

    setSubmitting(true);
    try {
      await onSave({
        title: title.trim(),
        city: city.trim(),
        country: country.trim(),
        price: Number(price),
        days: Number(days) || 1,
        nights: Number(nights) || 0,
        description: description.trim(),
        image,
        imageFiles,
      });
    } catch (err) {
      setError(err.message || "Failed to save tour. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 60, background: "rgba(15, 23, 42, 0.45)",
        display: "flex", alignItems: "center", justifyContent: "center", padding: 20,
      }}
      onClick={onCancel}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="card"
        style={{ width: "100%", maxWidth: 480, maxHeight: "90vh", overflowY: "auto", padding: 24 }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12 }}>
          <div>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: 0 }}>{isEdit ? "Edit tour" : "Add a new tour"}</h2>
            <p style={{ marginTop: 4, fontSize: 13, color: "var(--muted-foreground)", margin: "4px 0 0" }}>
              Fill in the details travelers will see when browsing your tours.
            </p>
          </div>
          <button type="button" onClick={onCancel} className="btn-icon" aria-label="Close">
            <X size={18} />
          </button>
        </div>

        {error && <p style={{ marginTop: 12, fontSize: 12, color: "var(--destructive)" }}>{error}</p>}

        <ModalField label="Tour name">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Old Cairo walking tour"
            className="form-input"
          />
        </ModalField>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
          <div>
            <label style={labelStyle}>City</label>
            <input value={city} onChange={(e) => setCity(e.target.value)} placeholder="Cairo" className="form-input" />
          </div>
          <div>
            <label style={labelStyle}>Country</label>
            <input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="Egypt" className="form-input" />
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginTop: 16 }}>
          <div>
            <label style={labelStyle}>Price per person (USD)</label>
            <input
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="60"
              className="form-input"
            />
          </div>
          <div>
            <label style={labelStyle}>Days</label>
            <input
              type="number"
              min="1"
              value={days}
              onChange={(e) => setDays(e.target.value)}
              placeholder="1"
              className="form-input"
            />
          </div>
        </div>

        <ModalField label="Nights">
          <input
            type="number"
            min="0"
            value={nights}
            onChange={(e) => setNights(e.target.value)}
            placeholder="0"
            className="form-input"
          />
        </ModalField>

        <ModalField label="Tour image">
          <label className="form-input" style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer" }}>
            <ImagePlus size={16} style={{ color: "var(--muted-foreground)", flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: image ? "var(--foreground)" : "var(--muted-foreground)" }}>
              {image ? "Photo selected — click to change" : "Click to upload a photo"}
            </span>
            <input type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
          </label>
          {image && (
            <img src={image} alt="Tour preview" style={{ marginTop: 10, width: "100%", height: 120, objectFit: "cover", borderRadius: 10 }} />
          )}
        </ModalField>

        <ModalField label="Description">
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="What travelers will experience on this tour…"
            className="form-input"
            style={{ resize: "vertical", fontFamily: "inherit" }}
          />
        </ModalField>

        <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button type="button" onClick={onCancel} className="btn btn-outline btn-sm" disabled={submitting}>Cancel</button>
          <button type="submit" className="btn btn-warm btn-sm" disabled={submitting}>
            {submitting ? "Saving..." : isEdit ? "Save changes" : "Add tour"}
          </button>
        </div>
      </form>
    </div>
  );
}

function ModalField({ label, hint, children }) {
  return (
    <div style={{ marginTop: 16 }}>
      <label style={labelStyle}>{label}</label>
      <div style={{ marginTop: 6 }}>{children}</div>
      {hint && <p style={{ marginTop: 4, fontSize: 11, color: "var(--muted-foreground)" }}>{hint}</p>}
    </div>
  );
}

const labelStyle = { fontSize: 12, fontWeight: 600, color: "var(--foreground)", display: "block" };