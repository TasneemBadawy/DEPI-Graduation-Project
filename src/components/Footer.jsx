import { Compass } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-card">
      <div className="mx-auto grid max-w-7xl gap-8 px-5 py-12 sm:grid-cols-4 sm:px-8">
        <div>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-white">
              <Compass className="h-4.5 w-4.5" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-foreground">Nomade</span>
          </div>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Authentic travel experiences around the world, hosted by trusted locals.
          </p>
        </div>
        <FooterCol title="Explore" links={[["Guides", "/guides"], ["Tours", "/tours"], ["Things to do", "/experiences"]]} />
        <FooterCol title="Company" links={[["About", "/#about"], ["Careers", "#"], ["Press", "#"], ["Contact", "#"]]} />
        <FooterCol title="Support" links={[["Help center", "#"], ["Trust & safety", "#"], ["Cancellation", "#"], ["Terms", "#"]]} />
      </div>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-5 py-5 text-xs text-muted-foreground sm:flex-row sm:px-8">
          <span>© {new Date().getFullYear()} Nomade Travel Co. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <span>Made with care for travelers worldwide</span>
            <Link to="/dashboard/admin" className="text-muted-foreground/60 hover:text-foreground">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, links }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-foreground">{title}</h4>
      <ul className="mt-3 space-y-2">
        {links.map(([label, href]) => (
          <li key={label}>
            <a className="text-sm text-muted-foreground hover:text-foreground" href={href}>
              {label}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
