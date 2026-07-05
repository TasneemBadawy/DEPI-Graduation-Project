import { Link, useNavigate } from "react-router-dom";
import { useState, useMemo } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";
import AuthLayout from "../../components/auth/AuthLayout";
import RoleSelector from "../../components/auth/RoleSelector";
import AuthTabs from "../../components/auth/AuthTabs";
import { SocialRow } from "../../components/AuthComponents";
import { cn } from "../../lib/utils";

export default function Login() {
  const [role, setRole] = useState("tourist");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });
  const navigate = useNavigate();

  const emailError = useMemo(() => {
    if (!touched.email) return "";
    if (!email) return "Email is required";
    if (!/^\S+@\S+\.\S+$/.test(email)) return "Enter a valid email address";
    return "";
  }, [email, touched.email]);

  const passwordError = useMemo(() => {
    return touched.password && !password ? "Password is required" : "";
  }, [password, touched.password]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    if (!email || !password || emailError || passwordError) return;
    navigate("/");
  };

  return (
    <AuthLayout>
      <h1 className="text-3xl font-extrabold tracking-tight text-foreground">Welcome back</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">Sign in to continue your journey with Nomade.</p>

      <div className="mt-6">
        <RoleSelector value={role} onChange={setRole} />
        <AuthTabs active="signin" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="text-left w-full">
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-foreground">Email</label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, email: true }))}
              className={cn(
                "h-11 w-full rounded-lg border border-border bg-card pl-10 pr-4 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/25 focus:border-primary",
                emailError && "border-destructive focus:ring-destructive/25"
              )}
            />
          </div>
          {emailError && <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-destructive"><AlertCircle className="h-3 w-3" /> {emailError}</p>}
        </div>

        <div className="text-left w-full">
          <div className="mb-2 flex items-center justify-between">
            <label htmlFor="password" className="block text-sm font-medium text-foreground">Password</label>
            <a href="#" className="text-xs font-semibold text-primary hover:underline">Forgot password?</a>
          </div>
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
          {passwordError && <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-destructive"><AlertCircle className="h-3 w-3" /> {passwordError}</p>}
        </div>

        <label className="flex items-center gap-2 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={keepSignedIn}
            onChange={(e) => setKeepSignedIn(e.target.checked)}
            className="h-4 w-4 rounded border-border text-primary focus:ring-primary/25"
          />
          Keep me signed in for 30 days
        </label>

        <button type="submit" className="w-full flex h-12 items-center justify-center gap-2 rounded-lg bg-primary text-base font-semibold text-white hover:brightness-110 duration-150 cursor-pointer">
          Sign in <ArrowRight className="h-5 w-5" />
        </button>
      </form>

      <SocialRow redirectTo="/login" />

      <p className="mt-6 text-center text-sm text-muted-foreground">
        New to Nomade?{" "}
        <Link to="/register" className="font-semibold text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </AuthLayout>
  );
}
