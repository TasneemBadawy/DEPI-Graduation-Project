import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, AlertCircle, Loader2, Shield } from "lucide-react";
import AuthLayout from "../../components/auth/AuthLayout";
import { cn } from "../../lib/utils";
import { useAuth } from "../../context/AuthContext";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");
  const [touched, setTouched] = useState({ email: false, password: false });
  const [isDemo, setIsDemo] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const emailError = touched.email && (!email || !/^\S+@\S+\.\S+$/.test(email)) 
    ? "Enter a valid email address" 
    : "";
  const passwordError = touched.password && !password ? "Password is required" : "";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError("");
    setTouched({ email: true, password: true });
    if (!email || !password || emailError || passwordError) return;

    setSubmitting(true);
    try {
      const user = await login("admin", { email, password });
      console.log("Admin login successful:", user);
      navigate("/dashboard/admin", { replace: true });
    } catch (err) {
      console.error("Admin login error:", err);
      setFormError(err.message || "Invalid admin credentials. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // Demo login - auto-fill credentials
  const fillDemoCredentials = () => {
    setEmail("admin@nomade.com");
    setPassword("admin123");
    setIsDemo(true);
  };

  return (
    <AuthLayout>
      <div className="text-center mb-6">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary-soft text-primary mb-4">
          <Shield className="h-8 w-8" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Admin Access</h1>
        <p className="mt-1.5 text-sm text-muted-foreground">Secure login for platform administrators</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4" noValidate>
        {formError && (
          <p className="flex items-center gap-1.5 rounded-lg border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm font-medium text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" /> {formError}
          </p>
        )}

        <div className="text-left w-full">
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">Admin Email</label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id="email"
              type="email"
              placeholder="admin@nomade.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              className={cn(
                "h-11 w-full rounded-lg border border-border bg-card pl-10 pr-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary",
                emailError && "border-destructive focus:ring-destructive/25"
              )}
            />
          </div>
          {emailError && <p className="mt-1.5 text-xs font-medium text-destructive">{emailError}</p>}
        </div>

        <div className="text-left w-full">
          <label htmlFor="password" className="mb-2 block text-sm font-medium text-foreground">Password</label>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, password: true }))}
              className={cn(
                "h-11 w-full rounded-lg border border-border bg-card pl-10 pr-11 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary",
                passwordError && "border-destructive focus:ring-destructive/25"
              )}
            />
            <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground hover:bg-muted">
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {passwordError && <p className="mt-1.5 text-xs font-medium text-destructive">{passwordError}</p>}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full flex h-12 items-center justify-center gap-2 rounded-lg bg-primary text-base font-semibold text-white hover:brightness-110 duration-150 cursor-pointer shadow-sm disabled:cursor-not-allowed disabled:opacity-70"
        >
          {submitting ? (
            <>
              <Loader2 className="h-5 w-5 animate-spin" /> Verifying...
            </>
          ) : (
            <>
              <Shield className="h-5 w-5" /> Access Admin Panel
            </>
          )}
        </button>
      </form>

      <div className="mt-4 flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={fillDemoCredentials}
          className="text-sm text-primary hover:underline font-medium"
        >
          🔑 Use Demo Admin Credentials
        </button>

        <Link to="/login" className="text-sm text-muted-foreground hover:text-primary transition-colors">
          ← Back to user login
        </Link>

        <div className="p-3 rounded-lg bg-muted/50 text-xs text-muted-foreground text-center w-full">
          <p>Demo Admin: admin@nomade.com / admin123</p>
          {isDemo && (
            <p className="text-primary mt-1">✅ Credentials filled! Click the button above to login.</p>
          )}
        </div>
      </div>
    </AuthLayout>
  );
}