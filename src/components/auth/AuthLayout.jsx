import { Sparkles } from "lucide-react";
import heroImage from "../../assets/nomade-hero-BPGktu7d.jpg";

export default function AuthLayout({ children }) {
  return (
    <div className="grid min-h-[calc(100vh-4rem)] lg:grid-cols-2">
      {/* Left: full-bleed mood image, hidden on small screens */}
      <div className="relative hidden overflow-hidden lg:block">
        <img src={heroImage} alt="Scenic travel destination" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <div className="relative flex h-full flex-col justify-end p-12">
          <span className="inline-flex w-fit items-center gap-2 rounded-full bg-white/12 px-3 py-1 text-xs font-medium text-white backdrop-blur-md ring-1 ring-white/25">
            <Sparkles className="h-3.5 w-3.5" /> Trusted by 12,000+ travelers
          </span>
          <h2 className="mt-5 text-4xl font-semibold leading-tight text-white">
            Wander further.
            <br /> Guided by locals.
          </h2>
          <p className="mt-3 max-w-sm text-sm text-white/80">
            Join a community of curious travelers and expert guides creating
            journeys that go beyond the guidebook.
          </p>
          <p className="mt-8 text-xs text-white/60">© {new Date().getFullYear()} Nomade Travel Co.</p>
        </div>
      </div>

      {/* Right: auth content */}
      <div className="flex items-center justify-center bg-background px-4 py-10 sm:px-8">
        <div className="w-full max-w-md">{children}</div>
      </div>
    </div>
  );
}
