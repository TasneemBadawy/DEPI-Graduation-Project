import { Compass, MapPin, ShieldCheck } from "lucide-react";
import { cn } from "../../lib/utils";

const ROLES = [
  { id: "tourist", label: "Tourist", sub: "Discover & book journeys", Icon: Compass },
  { id: "guide", label: "Tour Guide", sub: "Host travelers worldwide", Icon: MapPin },
  { id: "admin", label: "Admin", sub: "Manage the Nomade platform", Icon: ShieldCheck },
];

export default function RoleSelector({ value, onChange }) {
  return (
    <div className="mb-6">
      <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">I am a</label>
      <div className="grid grid-cols-3 gap-2">
        {ROLES.map(({ id, label, sub, Icon }) => {
          const active = value === id;
          return (
            <button
              key={id}
              type="button"
              onClick={() => onChange(id)}
              className={cn(
                "relative rounded-xl border p-3 text-left transition-all",
                active ? "border-primary bg-primary-soft" : "border-border bg-card hover:bg-muted/50"
              )}
            >
              {active && <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />}
              <Icon className={cn("h-4 w-4", active ? "text-primary" : "text-muted-foreground")} />
              <div className={cn("mt-1.5 text-sm font-semibold", active ? "text-primary" : "text-foreground")}>{label}</div>
              <div className="text-[11px] leading-tight text-muted-foreground">{sub}</div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
