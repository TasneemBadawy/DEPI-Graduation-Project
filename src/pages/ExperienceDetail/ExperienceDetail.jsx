import { useParams, Navigate } from "react-router-dom";
import { MapPin } from "lucide-react";
import Button from "../../components/ui/Button";
import Footer from "../../components/Footer";
import { EXPERIENCES } from "../../data/experiences";

export default function ExperienceDetail() {
  const { slug } = useParams();
  const exp = EXPERIENCES.find((e) => e.slug === slug);

  if (!exp) return <Navigate to="/experiences" replace />;

  return (
    <div className="min-h-screen bg-background">
      <div className="h-64 w-full overflow-hidden sm:h-96">
        <img src={exp.image} alt={exp.title} className="h-full w-full object-cover" />
      </div>

      <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
        <span className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-secondary">
          <MapPin className="h-3.5 w-3.5" /> {exp.city}
        </span>
        <span className="ml-2 rounded-full bg-muted px-2.5 py-1 text-[11px] font-medium text-muted-foreground">{exp.tag}</span>
        <h1 className="mt-2 text-2xl font-bold text-foreground sm:text-3xl">{exp.title}</h1>

        <div className="mt-6 rounded-2xl border border-border bg-card p-6">
          <h2 className="text-base font-semibold text-foreground">About this experience</h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            A bucket-list moment in {exp.city}, hosted by vetted Nomade locals. Small groups, flexible timing,
            and everything arranged so you can just show up and enjoy it.
          </p>
        </div>

        {/* <div className="mt-6 flex items-center justify-between rounded-2xl border border-border bg-card p-5">
          <div>
            <div className="text-sm text-muted-foreground">from</div>
            <div className="text-xl font-bold text-foreground">${exp.price} <span className="text-sm font-normal text-muted-foreground">/ person</span></div>
          </div>
          <Button variant="hero" size="lg">Check availability</Button>
        </div> */}
      </div>

      <Footer />
    </div>
  );
}
