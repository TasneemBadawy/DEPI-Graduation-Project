import { useState } from "react";
import { 
  User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight, 
  CheckCircle2, AlertCircle, Globe2, MapPin, Languages, 
  Sparkles, Upload, ShieldCheck 
} from "lucide-react";
import { cn } from "../../lib/utils";

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
            "h-11 w-full rounded-lg border border-border bg-card pl-10 pr-10 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary",
            error && "border-destructive focus:ring-destructive/30",
            valid && "border-success/60 focus:ring-success/30"
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
            "h-11 w-full rounded-lg border border-border bg-card pl-10 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-secondary/30 focus:border-secondary",
            error && "border-destructive focus:ring-destructive/30"
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
    <div className="space-y-3 text-left w-full my-4">
      <div>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function ChipGroup({ options, values, onToggle, icon: Icon, accent = "sea" }) {
  return (
    <div className="flex flex-wrap gap-2 w-full">
      {options.map((opt) => {
        const active = values.includes(opt);
        const activeCls = accent === "terracotta"
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
        <p className="text-sm text-foreground"><span className="text-secondary font-semibold">Click to upload</span> or drag & drop</p>
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

function TouristRegisterForm({ setScreen }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [touched, setTouched] = useState({ name: false, email: false, password: false });

  const nameError = touched.name && name.trim().length < 2 ? "Please enter your full name" : "";
  const emailError = touched.email && (!email || !/^\S+@\S+\.\S+$/.test(email)) ? "Enter a valid email address" : "";
  const passwordError = touched.password && password.length < 8 ? "Password must be at least 8 characters" : "";
  const strength = getPasswordStrength(password);

  return (
    <form onSubmit={(e) => { e.preventDefault(); setTouched({ name: true, email: true, password: true }); if(!nameError && !emailError && !passwordError && name) setScreen("login"); }} className="space-y-4">
      <Field id="name" label="Full name" icon={User} placeholder="Layla Hassan" value={name} onChange={setName} onBlur={() => setTouched((t) => ({ ...t, name: true }))} error={nameError} valid={touched.name && !nameError && name.length > 0} />
      <Field id="email" label="Email" icon={Mail} type="email" placeholder="you@example.com" value={email} onChange={setEmail} onBlur={() => setTouched((t) => ({ ...t, email: true }))} error={emailError} valid={touched.email && !emailError && email.length > 0} />
      <div>
        <label className="mb-2 block text-sm font-medium text-slate-700 text-left">Password</label>
        <PasswordInput id="t-pwd" placeholder="At least 8 characters" value={password} onChange={setPassword} show={show} onToggle={() => setShow((s) => !s)} onBlur={() => setTouched((t) => ({ ...t, password: true }))} error={passwordError} />
        {password && (
          <div className="mt-2 flex items-center gap-2">
            <div className="flex h-1.5 flex-1 gap-1">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className={cn("flex-1 rounded-full transition-colors", i < strength.score ? strength.score >= 3 ? "bg-success" : strength.score === 2 ? "bg-warning" : "bg-destructive" : "bg-muted")} />
              ))}
            </div>
            <span className="text-xs font-medium text-muted-foreground">{strength.label}</span>
          </div>
        )}
      </div>
      <button type="submit" className="w-full flex h-12 items-center justify-center gap-2 rounded-lg bg-secondary text-base font-semibold text-white hover:bg-secondary/90 duration-150 cursor-pointer shadow-sm">
        Create my account <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}

function GuideRegisterForm({ setScreen }) {
  const [show, setShow] = useState(false);
  const [touched, setTouched] = useState({});
  const [data, setData] = useState({
    firstName: "", lastName: "", email: "", phone: "", country: "", city: "",
    bio: "", languages: [], specializations: [], files: [], password: ""
  });

  const set = (k, v) => setData((d) => ({ ...d, [k]: v }));
  const blur = (k) => setTouched((t) => ({ ...t, [k]: true }));

  return (
    <form onSubmit={(e) => { e.preventDefault(); setScreen("login"); }} className="space-y-6">
      <Section title="Personal information" subtitle="Tell travelers who you are.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="firstName" label="First name" icon={User} placeholder="Karim" value={data.firstName} onChange={(v) => set("firstName", v)} onBlur={() => blur("firstName")} error={touched.firstName && data.firstName.length < 2 ? "Required" : ""} />
          <Field id="lastName" label="Last name" icon={User} placeholder="El-Sayed" value={data.lastName} onChange={(v) => set("lastName", v)} onBlur={() => blur("lastName")} error={touched.lastName && data.lastName.length < 2 ? "Required" : ""} />
        </div>
      </Section>
      <Section title="Contact">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="g-email" label="Email" icon={Mail} placeholder="you@example.com" value={data.email} onChange={(v) => set("email", v)} />
          <Field id="phone" label="Phone" icon={Phone} placeholder="+20 100..." value={data.phone} onChange={(v) => set("phone", v)} />
        </div>
      </Section>
      <Section title="Languages you speak">
        <ChipGroup icon={Languages} options={["English", "Arabic", "French", "German"]} values={data.languages} onToggle={(v) => set("languages", data.languages.includes(v) ? data.languages.filter(x => x !== v) : [...data.languages, v])} accent="sea" />
      </Section>
      <Section title="Specializations" subtitle="What kind of experiences do you guide?">
        <ChipGroup icon={Sparkles} options={["Diving", "Desert safari", "Cultural tours", "Hiking", "Food tours"]} values={data.specializations} onToggle={(v) => set("specializations", data.specializations.includes(v) ? data.specializations.filter(x => x !== v) : [...data.specializations, v])} accent="terracotta" />
      </Section>
      <Section title="Certifications">
        <FileDrop files={data.files} onFiles={(f) => set("files", [...data.files, ...f])} onRemove={(i) => set("files", data.files.filter((_, idx) => idx !== i))} />
      </Section>
      <Section title="Account password">
        <PasswordInput id="g-pwd" placeholder="At least 8 characters" value={data.password} onChange={(v) => set("password", v)} show={show} onToggle={() => setShow((s) => !s)} />
      </Section>
      <button type="submit" className="w-full flex h-12 items-center justify-center gap-2 rounded-lg bg-secondary font-semibold text-white hover:bg-secondary/90 cursor-pointer shadow-sm">
        Sign up <ArrowRight className="h-4 w-4" />
      </button>
    </form>
  );
}

function AdminRegisterForm() {
  return (
    <div className="rounded-xl border border-secondary/20 bg-secondary-soft/50 p-5 text-left flex items-start gap-3">
      <ShieldCheck className="h-6 w-6 text-secondary shrink-0" />
      <div>
        <h3 className="text-sm font-semibold text-foreground">Admin access by invitation</h3>
        <p className="text-sm text-muted-foreground mt-1">Admin accounts are provisioned by the team via invite link.</p>
      </div>
    </div>
  );
}

export default function Register({ setScreen }) {
  const [activeTab, setActiveTab] = useState("tourist");

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-slate-50 px-4 py-12">
      <div className={cn("w-full bg-white p-8 shadow-xl border border-border rounded-2xl transition-all", activeTab === "guide" ? "max-w-2xl" : "max-w-md")}>
        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold tracking-tight text-foreground">Create account</h2>
        </div>
        <div className="flex rounded-xl bg-muted p-1 mb-6">
          <button type="button" onClick={() => setActiveTab("tourist")} className={cn("flex-1 rounded-lg py-2 text-sm font-semibold cursor-pointer transition-all", activeTab === "tourist" ? "bg-secondary text-white shadow-sm" : "text-muted-foreground")}>Tourist</button>
          <button type="button" onClick={() => setActiveTab("guide")} className={cn("flex-1 rounded-lg py-2 text-sm font-semibold cursor-pointer transition-all", activeTab === "guide" ? "bg-secondary text-white shadow-sm" : "text-muted-foreground")}>Guide</button>
          <button type="button" onClick={() => setActiveTab("admin")} className={cn("flex-1 rounded-lg py-2 text-sm font-semibold cursor-pointer transition-all", activeTab === "admin" ? "bg-secondary text-white shadow-sm" : "text-muted-foreground")}>Admin</button>
        </div>
        {activeTab === "tourist" && <TouristRegisterForm setScreen={setScreen} />}
        {activeTab === "guide" && <GuideRegisterForm setScreen={setScreen} />}
        {activeTab === "admin" && <AdminRegisterForm />}
      </div>
    </div>
  );
}