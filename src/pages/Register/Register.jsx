import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  User, Mail, Phone, Lock, Eye, EyeOff, ArrowRight,
  CheckCircle2, AlertCircle, Languages, Sparkles, Upload,
  Link2, Globe, Loader2,
} from "lucide-react";
import { InstagramIcon, FacebookIcon, LinkedinIcon } from "../../components/icons/BrandIcons";
import AuthLayout from "../../components/auth/AuthLayout";
import RoleSelector from "../../components/auth/RoleSelector";
import AuthTabs from "../../components/auth/AuthTabs";
import { SocialRow } from "../../components/AuthComponents";
import { cn } from "../../lib/utils";
import { useAuth } from "../../context/AuthContext";

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

function PasswordInput({ id, label, placeholder, value, onChange, show, onToggle, onBlur, error, valid }) {
  return (
    <div className="text-left w-full">
      {label && <label htmlFor={id} className="mb-2 block text-sm font-medium text-foreground">{label}</label>}
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
            error && "border-destructive focus:ring-destructive/25",
            valid && "border-success/60 focus:ring-success/25"
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
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [touched, setTouched] = useState({
    firstName: false, lastName: false, email: false, password: false, confirmPassword: false,
  });

  const { register } = useAuth();
  const navigate = useNavigate();

  const firstNameError = touched.firstName && firstName.trim().length < 2 ? "Please enter your first name" : "";
  const lastNameError = touched.lastName && lastName.trim().length < 2 ? "Please enter your last name" : "";
  const emailError = touched.email && (!email || !/^\S+@\S+\.\S+$/.test(email)) ? "Enter a valid email address" : "";
  const passwordError = touched.password && password.length < 6 ? "Password must be at least 6 characters" : "";
  const confirmPasswordError = touched.confirmPassword && confirmPassword !== password ? "Passwords don't match" : "";
  const strength = getPasswordStrength(password);

  const formIsValid =
    !firstNameError && !lastNameError && !emailError && !passwordError && !confirmPasswordError &&
    firstName.trim() && lastName.trim() && email && password && confirmPassword === password && agreed;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setTouched({ firstName: true, lastName: true, email: true, password: true, confirmPassword: true });
    if (!formIsValid) return;

    setSubmitting(true);
    try {
      const user = await register(
        "tourist",
        { FName: firstName.trim(), LName: lastName.trim(), Email: email, Password: password },
        { email, password }
      );
      navigate(user.role === "guide" ? "/dashboard/guide" : "/dashboard/tourist", { replace: true });
    } catch (err) {
      setFormError(err.message || "Couldn't create your account. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      {formError && (
        <p className="flex items-center gap-1.5 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm font-medium text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" /> {formError}
        </p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field
          id="firstName"
          label="First name"
          icon={User}
          placeholder="Layla"
          value={firstName}
          onChange={setFirstName}
          onBlur={() => setTouched((t) => ({ ...t, firstName: true }))}
          error={firstNameError}
          valid={touched.firstName && !firstNameError && firstName.length > 0}
        />
        <Field
          id="lastName"
          label="Last name"
          icon={User}
          placeholder="Hassan"
          value={lastName}
          onChange={setLastName}
          onBlur={() => setTouched((t) => ({ ...t, lastName: true }))}
          error={lastNameError}
          valid={touched.lastName && !lastNameError && lastName.length > 0}
        />
      </div>

      <Field
        id="email"
        label="Email"
        icon={Mail}
        type="email"
        placeholder="you@example.com"
        value={email}
        onChange={setEmail}
        onBlur={() => setTouched((t) => ({ ...t, email: true }))}
        error={emailError}
        valid={touched.email && !emailError && email.length > 0}
      />

      <div>
        <PasswordInput
          id="t-pwd"
          label="Password"
          placeholder="At least 6 characters"
          value={password}
          onChange={setPassword}
          show={show}
          onToggle={() => setShow((s) => !s)}
          onBlur={() => setTouched((t) => ({ ...t, password: true }))}
          error={passwordError}
        />
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

      <PasswordInput
        id="t-pwd-confirm"
        label="Confirm password"
        placeholder="Re-enter your password"
        value={confirmPassword}
        onChange={setConfirmPassword}
        show={showConfirm}
        onToggle={() => setShowConfirm((s) => !s)}
        onBlur={() => setTouched((t) => ({ ...t, confirmPassword: true }))}
        error={confirmPasswordError}
        valid={touched.confirmPassword && !confirmPasswordError && confirmPassword.length > 0}
      />

      <label className="flex items-start gap-2 text-sm text-muted-foreground">
        <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary/25" />
        I agree to the <a href="#" className="font-medium text-primary hover:underline">Terms</a> and <a href="#" className="font-medium text-primary hover:underline">Privacy Policy</a>
      </label>

      <button
        type="submit"
        disabled={submitting}
        className="w-full flex h-12 items-center justify-center gap-2 rounded-lg bg-primary text-base font-semibold text-white hover:brightness-110 duration-150 cursor-pointer shadow-sm disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Creating your account…
          </>
        ) : (
          <>
            Create my account <ArrowRight className="h-4 w-4" />
          </>
        )}
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
  const [show, setShow] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmTouched, setConfirmTouched] = useState(false);
  const [data, setData] = useState({
    firstName: "", lastName: "", email: "", phone: "", country: "", city: "",
    bio: "", languages: [], specializations: [], files: [], password: "",
    instagram: "", facebook: "", linkedin: "", website: "",
  });
  
  // ✅ Profile image states (moved outside handleSubmit)
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState("");
  
  const set = (k, v) => setData((d) => ({ ...d, [k]: v }));

  const { register } = useAuth();
  const navigate = useNavigate();

  const confirmPasswordError = confirmTouched && confirmPassword !== data.password ? "Passwords don't match" : "";

  // ✅ Handle image change (moved outside handleSubmit)
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate
    if (!file.type.startsWith('image/')) {
      setFormError("Please select an image file");
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      setFormError("Image must be less than 5MB");
      return;
    }
    
    setProfileImageFile(file);
    const reader = new FileReader();
    reader.onload = () => setProfileImagePreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setConfirmTouched(true);

    if (!data.firstName.trim() || !data.lastName.trim() || !data.email.trim()) {
      setFormError("First name, last name, and email are required.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(data.email)) {
      setFormError("Enter a valid email address.");
      return;
    }
    if (!data.password || data.password.length < 6) {
      setFormError("Password must be at least 6 characters.");
      return;
    }
    if (confirmPassword !== data.password) {
      setFormError("Passwords don't match.");
      return;
    }

    // The backend's guide-register route expects multipart/form-data
    const formData = new FormData();
    formData.append("FName", data.firstName.trim());
    formData.append("LName", data.lastName.trim());
    formData.append("Email", data.email.trim());
    formData.append("Password", data.password);
    if (data.country) formData.append("Country", data.country);
    if (data.bio) formData.append("About", data.bio);
    if (data.facebook) formData.append("FaceBook", data.facebook);
    if (data.linkedin) formData.append("Linkedin", data.linkedin);
    if (data.instagram) formData.append("Instagram", data.instagram);
    if (data.phone) formData.append("phoneNumbers", data.phone);
    
    // ✅ Append profile image if selected
    if (profileImageFile) {
      formData.append("Profile_Image", profileImageFile);
    }
    
    data.specializations.forEach((s) => formData.append("specializations", s));
    data.languages.forEach((l) => formData.append("languages", l));
    data.files.forEach((f) => formData.append("certificates", f.name));

    setSubmitting(true);
    try {
      const user = await register("guide", formData, { email: data.email, password: data.password });
      navigate(user.role === "guide" ? "/dashboard/guide" : "/dashboard/tourist", { replace: true });
    } catch (err) {
      setFormError(err.message || "Couldn't create your guide account. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2" noValidate>
      {formError && (
        <p className="flex items-center gap-1.5 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm font-medium text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" /> {formError}
        </p>
      )}
      
      <Section title="Personal information" subtitle="Tell travelers who you are.">
        <div className="grid gap-4 sm:grid-cols-2">
          <Field id="firstName" label="First name" icon={User} placeholder="Karim" value={data.firstName} onChange={(v) => set("firstName", v)} />
          <Field id="lastName" label="Last name" icon={User} placeholder="El-Sayed" value={data.lastName} onChange={(v) => set("lastName", v)} />
        </div>
      </Section>

      {/* ✅ Profile Image Upload */}
      <div className="text-left w-full mb-4">
        <label className="mb-2 block text-sm font-medium text-foreground">Profile Photo</label>
        <div className="flex items-center gap-4">
          <div className="h-20 w-20 rounded-full overflow-hidden border-2 border-border bg-muted flex items-center justify-center">
            {profileImagePreview ? (
              <img src={profileImagePreview} alt="Profile preview" className="h-full w-full object-cover" />
            ) : (
              <div className="h-full w-full bg-muted flex items-center justify-center text-muted-foreground">
                <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            )}
          </div>
          <div>
            <label className="cursor-pointer rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium text-foreground hover:bg-muted inline-block">
              Choose Photo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
            {profileImagePreview && (
              <button
                type="button"
                onClick={() => {
                  setProfileImageFile(null);
                  setProfileImagePreview("");
                }}
                className="ml-2 text-sm text-destructive hover:underline"
              >
                Remove
              </button>
            )}
            <p className="mt-1 text-xs text-muted-foreground">JPG, PNG, GIF (max 5MB)</p>
          </div>
        </div>
      </div>

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
          <Field id="website" label="Website" icon={Link2} placeholder="https://…" value={data.website} onChange={(v) => set("website", v)} />
        </div>
      </Section>

      <Section title="Certifications" subtitle="Licenses, first-aid, or tour-guide certificates.">
        <FileDrop files={data.files} onFiles={(f) => set("files", [...data.files, ...f])} onRemove={(i) => set("files", data.files.filter((_, idx) => idx !== i))} />
      </Section>

      <Section title="Account password" subtitle="Used to sign in to your guide dashboard.">
        <PasswordInput id="g-pwd" placeholder="At least 6 characters" value={data.password} onChange={(v) => set("password", v)} show={show} onToggle={() => setShow((s) => !s)} />
        <div className="mt-4">
          <PasswordInput
            id="g-pwd-confirm"
            placeholder="Re-enter your password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            show={showConfirm}
            onToggle={() => setShowConfirm((s) => !s)}
            onBlur={() => setConfirmTouched(true)}
            error={confirmPasswordError}
          />
        </div>
      </Section>

      <label className="flex items-start gap-2 text-sm text-muted-foreground">
        <input type="checkbox" required className="mt-0.5 h-4 w-4 rounded border-border text-primary focus:ring-primary/25" />
        I confirm my information is accurate and agree to Nomade's <a href="#" className="font-medium text-primary hover:underline">Guide Terms</a>.
      </label>

      <button
        type="submit"
        disabled={submitting}
        className="w-full flex h-12 items-center justify-center gap-2 rounded-lg bg-primary font-semibold text-white hover:brightness-110 cursor-pointer shadow-sm disabled:cursor-not-allowed disabled:opacity-70"
      >
        {submitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Creating your account…
          </>
        ) : (
          <>
            Sign up as a guide <ArrowRight className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}