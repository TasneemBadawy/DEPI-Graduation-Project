import { CheckCircle2, Hourglass, Trophy } from "lucide-react";

const META = {
  Confirmed:      { Icon: CheckCircle2, cls: "pill-confirmed", label: "Confirmed" },
  "Pending Guide":{ Icon: Hourglass,    cls: "pill-pending",   label: "Pending Guide" },
  Completed:      { Icon: Trophy,       cls: "pill-completed", label: "Completed" },
  accepted:       { Icon: CheckCircle2, cls: "pill-accepted",  label: "Accepted" },
  declined:       {          cls: "pill-declined",  label: "Declined" },
};

export default function StatusPill({ status }) {
  const meta = META[status] ?? META["Confirmed"];
  const { Icon, cls, label } = meta;
  return (
    <span className={`pill ${cls}`}>
      {Icon && <Icon size={11} />}
      {label}
    </span>
  );
}
