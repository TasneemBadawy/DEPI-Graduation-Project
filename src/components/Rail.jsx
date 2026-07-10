import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function Rail({ children }) {
  const ref = useRef(null);
  const scroll = (dir) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * (el.clientWidth * 0.85), behavior: "smooth" });
  };

  return (
    <div className="group/rail relative">
      <div
        ref={ref}
        className="no-scrollbar mx-auto flex max-w-[100rem] snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-5 pb-2 sm:gap-5 sm:px-8"
      >
        {children}
      </div>
      <RailBtn dir="left" onClick={() => scroll(-1)} />
      <RailBtn dir="right" onClick={() => scroll(1)} />
    </div>
  );
}

function RailBtn({ dir, onClick }) {
  const Icon = dir === "left" ? ChevronLeft : ChevronRight;
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Scroll ${dir}`}
      className={`absolute top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-border bg-card text-foreground shadow-card transition-all hover:scale-105 md:flex ${
        dir === "left" ? "left-1" : "right-1"
      }`}
    >
      <Icon className="h-5 w-5" />
    </button>
  );
}
