import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight,
  CheckCircle2, AlertCircle, Languages, Sparkles, Upload, ShieldCheck,
  Link2, Globe,
} from "lucide-react";
import { InstagramIcon, FacebookIcon, LinkedinIcon } from "../../components/icons/BrandIcons";
import AuthLayout from "../../components/auth/AuthLayout";
import RoleSelector from "../../components/auth/RoleSelector";
import AuthTabs from "../../components/auth/AuthTabs";
import { SocialRow } from "../../components/AuthComponents";
import { cn } from "../../lib/utils";
import heroPyramids from "../../assets/hero-pyramids.jpg";

/** Builds a small "initials" avatar data-URI so a brand-new guide has a
 *  profile photo without us putting someone else's stock face on their
 *  account before they've uploaded a real one. */
function initialsAvatar(first, last) {
  const initials = `${(first?.[0] || "").toUpperCase()}${(last?.[0] || "").toUpperCase()}` || "N";
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
    <rect width="200" height="200" fill="#e15b28"/>
    <text x="50%" y="53%" font-family="Inter, sans-serif" font-size="80" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">${initials}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export default function Register() {
  const [role, setRole] = useState("tourist");

  return (
    <AuthLayout>
      <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Create your account</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">Choose your role to get started — it only takes a minute.</p>

      <div className="mt-6">
        <RoleSelector value={role} onChange={setRole} />
        <AuthTabs active="signup" />
      </div>

      {role === "tourist" && <TouristRegisterForm />}
      {role === "guide" && <GuideRegisterForm />}
      {role === "admin" && <AdminRegisterForm />}
    </AuthLayout>
  );
}

/* ───────────────────────────── SHARED FIELD PRIMITIVES ───────────────────────────── */

function Field({ id, label, icon: Icon, type = "text", placeholder, value, onChange, onBlur, error, valid }) {
  return (
    <div className="text-left w-full mb-4">
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-foreground">{label}</label>
      <div className="relative">
        <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          id={id}
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          className={cn(
            "h-11 w-full rounded-lg border border-border bg-card pl-10 pr-10 text-sm text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary",
            error && "border-destructive focus:ring-destructive/25",
            valid && "border-success/60 focus:ring-success/25"
          )}
        />
        {valid && <CheckCircle2 className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-success" />}
        {error && <AlertCircle className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-destructive" />}
      </div>
      {error && <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-destructive"><AlertCircle className="h-3 w-3" /> {error}</p>}
    </div>
  );
}

function PasswordInput({ id, placeholder, value, onChange, show, onToggle, onBlur, error }) {
  return (
    <div className="text-left w-full">
      <div className="relative">
        <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          id={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={onBlur}
          placeholder={placeholder}
          className={cn(
            "h-11 w-full rounded-lg border border-border bg-card pl-10 pr-11 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary",
            error && "border-destructive focus:ring-destructive/25"
          )}
        />
        <button type="button" onClick={onToggle} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground hover:bg-muted">
          {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
      {error && <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-destructive"><AlertCircle className="h-3 w-3" /> {error}</p>}
    </div>
  );
}

function getPasswordStrength(pwd) {
  let score = 0;
  if (pwd.length >= 8) score++;
  if (/[A-Z]/.test(pwd) && /[a-z]/.test(pwd)) score++;
  if (/\d/.test(pwd)) score++;
  if (/[^A-Za-z0-9]/.test(pwd)) score++;
  const label = ["Too weak", "Weak", "Okay", "Strong", "Excellent"][score] || "Too weak";
  return { score, label };
}

function Section({ title, subtitle, children }) {
  return (
    <div className="space-y-3 text-left w-full my-5">
      <div>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function ChipGroup({ options, values, onToggle, icon: Icon, accent = "secondary" }) {
  return (
    <div className="flex flex-wrap gap-2 w-full">
      {options.map((opt) => {
        const active = values.includes(opt);
        const activeCls = accent === "primary"
          ? "border-primary bg-primary-soft text-primary"
          : "border-secondary bg-secondary-soft text-secondary";
        return (
          <button
            key={opt}
            type="button"
            onClick={() => onToggle(opt)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all cursor-pointer",
              active ? activeCls : "border-border bg-card text-muted-foreground"
            )}
          >
            {Icon && <Icon className="h-3 w-3" />}
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function FileDrop({ files, onFiles, onRemove }) {
  return (
    <div className="space-y-2 w-full text-left">
      <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-card p-6 text-center hover:bg-secondary-soft/40">
        <Upload className="h-5 w-5 text-secondary" />
        <p className="text-sm text-foreground"><span className="font-semibold text-secondary">Click to upload</span> or drag & drop</p>
        <p className="text-xs text-muted-foreground">PDF, JPG, PNG (max 10MB each)</p>
        <input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={(e) => onFiles(Array.from(e.target.files || []))} />
      </label>
      {files.length > 0 && (
        <ul className="space-y-1">
          {files.map((f, i) => (
            <li key={i} className="flex items-center justify-between rounded-lg border border-border bg-card px-3 py-1.5 text-sm">
              <span className="truncate text-foreground">{f.name}</span>
              <button type="button" onClick={() => onRemove(i)} className="text-xs text-destructive">Remove</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

/* ───────────────────────────── TOURIST FORM ───────────────────────────── */

function TouristRegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [touched, setTouched] = useState({ name: false, email: false, password: false });
  const navigate = useNavigate();

  const nameError = touched.name && name.trim().length < 2 ? "Please enter your full name" : "";
  const emailError = touched.email && (!email || !/^\S+@\S+\.\S+$/.test(email)) ? "Enter a valid email address" : "";
  const passwordError = touched.password && password.length < 8 ? "Password must be at least 8 characters" : "";
  const strength = getPasswordStrength(password);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setTouched({ name: true, email: true, password: true });
        if (!nameError && !emailError && !passwordError && name && agreed) navigate("/login");
      }}
      className="space-y-4"
    >
      <Field id="name" label="Full name" icon={User} placeholder="Layla Hassan" value={name} onChange={setName} onBlur={() => setTouched((t) => ({ ...t, name: true }))} error={nameError} valid={touched.name && !nameError && name.length > 0} />
      <Field id="email" label="Email" icon={Mail} type="email" placeholder="you@example.com" value={email} onChange={setEmail} onBlur={() => setTouched((t) => ({ ...t, email: true }))} error={emailError} valid={touched.email && !emailError && email.length > 0} />
      <div>
        <label className="mb-2 block text-sm font-medium text-foreground text-left">Password</label>
        <PasswordInput id="t-pwd" placeholder="At least 8 characters" value={password} onChange={setPassword} show={show} onToggle={() => setShow((s) => !s)} onBlur={() => setTouched((t) => ({ ...t, password: true }))} error={passwordError} />
        {password && (
          <div className="mt-2 flex items-center gap-2">
            <div className="flex h-1.5 flex-1 gap-1">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className={cn("flex-1 rounded-full transition-colors", i < strength.score ? (strength.score >= 3 ? "bg-success" : strength.score === 2 ? "bg-warning" : "bg-destructive") : "bg-muted")} />
              ))}
            </div>
            <span className="text-xs font-medium text-muted-foreground">{strength.label}</span>
          </div>
        )}
      </div>

      <label className="flex items-start gap-2 text-sm text-muted-foreground">
        <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary/25" />
        I agree to the <a href="#" className="font-medium text-primary hover:underline">Terms</a> and <a href="#" className="font-medium text-primary hover:underline">Privacy Policy</a>
      </label>

      <button type="submit" className="w-full flex h-12 items-center justify-center gap-2 rounded-lg bg-primary text-base font-semibold text-white hover:brightness-110 duration-150 cursor-pointer shadow-sm">
        Create my account <ArrowRight className="h-4 w-4" />
      </button>

      <SocialRow redirectTo="/register" />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <button type="button" onClick={() => navigate("/login")} className="font-semibold text-primary hover:underline">
          Sign in instead
        </button>
      </p>
    </form>
  );
}

/* ───────────────────────────── GUIDE FORM ───────────────────────────── */

function GuideRegisterForm() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [data, setData] = useState({
    firstName: "", lastName: "", email: "", phone: "", country: "", city: "",
    bio: "", languages: [], specializations: [], files: [], password: "",
    instagram: "", facebook: "", linkedin: "", website: "",
  });
  const set = (k, v) => setData((d) => ({ ...d, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!data.firstName.trim() || !data.lastName.trim() || !data.email.trim()) {
      setError("First name, last name, and email are required.");
      return;
    }

    const name = `${data.firstName.trim()} ${data.lastName.trim()}`;
    const slugBase = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

    const newGuide = {
      slug: slugBase || "new-guide",
      name,
      photo: initialsAvatar(data.firstName, data.lastName),
      cover: heroPyramids,
      city: data.city || "—",
      country: data.country || "",
      languages: data.languages.length ? data.languages : ["English"],
      rating: "New",
      reviews: 0,
      specialty: data.specializations[0] || "General tours",
      verified: false,
      tagline: data.specializations.length ? data.specializations.join(" · ") : "New Nomade guide",
      yearsGuiding: 0,
      toursCompleted: 0,
      responseTime: "New guide — no reviews yet",
      about: data.bio || `${name} just joined Nomade and hasn't written a bio yet.`,
      specializations: data.specializations,
      trust: ["Application submitted — pending Nomade verification"],
    };

    // No backend yet, so the new guide doesn't exist in the mock dataset.
    // We hand the freshly-built record to GuideProfile via router state
    // under a reserved "preview" slug instead of persisting it anywhere.
    navigate("/guides/preview", { state: { guide: newGuide } });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      {error && (
        <p className="flex items-center gap-1.5 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm font-medium text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" /> {error}
        </p>
      )}
      <Section title="Personal information" subtitle="Tell travelers who you are.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="firstName" label="First name" icon={User} placeholder="Karim" value={data.firstName} onChange={(v) => set("firstName", v)} />
          <Field id="lastName" label="Last name" icon={User} placeholder="El-Sayed" value={data.lastName} onChange={(v) => set("lastName", v)} />
        </div>
      </Section>

      <Section title="Contact" subtitle="How travelers and our team can reach you.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="g-email" label="Email" icon={Mail} type="email" placeholder="you@example.com" value={data.email} onChange={(v) => set("email", v)} />
          <Field id="phone" label="Phone" icon={Phone} placeholder="+20 100 000 0000" value={data.phone} onChange={(v) => set("phone", v)} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="country" label="Country" icon={Globe} placeholder="Egypt" value={data.country} onChange={(v) => set("country", v)} />
          <Field id="city" label="City / region" icon={User} placeholder="Hurghada" value={data.city} onChange={(v) => set("city", v)} />
        </div>
      </Section>

      <Section title="Languages you speak" subtitle="Pick all that apply — travelers filter by language.">
        <ChipGroup icon={Languages} options={["English", "Arabic", "French", "Spanish", "German", "Italian", "Russian"]} values={data.languages} onToggle={(v) => set("languages", data.languages.includes(v) ? data.languages.filter((x) => x !== v) : [...data.languages, v])} accent="secondary" />
      </Section>

      <Section title="Specializations" subtitle="What kind of experiences do you guide?">
        <ChipGroup icon={Sparkles} options={["Diving", "Desert safari", "Cultural tours", "Hiking", "Food tours", "Photography", "History"]} values={data.specializations} onToggle={(v) => set("specializations", data.specializations.includes(v) ? data.specializations.filter((x) => x !== v) : [...data.specializations, v])} accent="primary" />
      </Section>

      <Section title="About you" subtitle="In short: what makes your tours special?">
        <textarea
          value={data.bio}
          onChange={(e) => set("bio", e.target.value)}
          placeholder="Share your guide's story, what makes your tours special…"
          rows={4}
          className="w-full rounded-lg border border-border bg-card p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary"
        />
      </Section>

      <Section title="Social presence" subtitle="Optional — helps travelers trust your profile.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="instagram" label="Instagram" icon={InstagramIcon} placeholder="@nomadekarim" value={data.instagram} onChange={(v) => set("instagram", v)} />
          <Field id="facebook" label="Facebook" icon={FacebookIcon} placeholder="facebook.com/…" value={data.facebook} onChange={(v) => set("facebook", v)} />
          <Field id="linkedin" label="LinkedIn" icon={LinkedinIcon} placeholder="linkedin.com/in/…" value={data.linkedin} onChange={(v) => set("linkedin", v)} />
        </div>
      </Section>

      <Section title="Certifications" subtitle="Licenses, first-aid, or tour-guide certificates.">
        <FileDrop files={data.files} onFiles={(f) => set("files", [...data.files, ...f])} onRemove={(i) => set("files", data.files.filter((_, idx) => idx !== i))} />
      </Section>

      <Section title="Account password" subtitle="Used to sign in to your guide dashboard.">
        <PasswordInput id="g-pwd" placeholder="At least 8 characters" value={data.password} onChange={(v) => set("password", v)} show={show} onToggle={() => setShow((s) => !s)} />
      </Section>

      <label className="flex items-start gap-2 text-sm text-muted-foreground">
        <input type="checkbox" required className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary/25" />
        I confirm my information is accurate and agree to Nomade's <a href="#" className="font-medium text-primary hover:underline">Guide Terms</a>.
      </label>

      <button type="submit" className="w-full flex h-12 items-center justify-center gap-2 rounded-lg bg-primary font-semibold text-white hover:brightness-110 cursor-pointer shadow-sm">
        Sign up as a guide <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}

/* ───────────────────────────── ADMIN ───────────────────────────── */

function AdminRegisterForm() {
  return (
    <div>
      <div className="rounded-xl border border-secondary/20 bg-secondary-soft/50 p-5 text-left flex items-start gap-3">
        <ShieldCheck className="h-6 w-6 shrink-0 text-secondary" />
        <div>
          <h3 className="text-sm font-semibold text-foreground">Admin access by invitation</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Admin accounts are provisioned by the Nomade team. If you have an
            invitation link, open it from your inbox to complete setup.
          </p>
          <button
            type="button"
            className="mt-3 rounded-lg bg-secondary px-4 py-2 text-sm font-semibold text-white hover:brightness-110"
          >
            Request admin access
          </button>
        </div>
      </div>
      <SocialRow redirectTo="/register" />
    </div>
  );
}
