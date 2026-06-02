import { useState, useMemo } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from "lucide-react";
import { SocialButton } from "../../components/AuthComponents";
import { cn } from "../../lib/utils";

export default function Login({ setScreen }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [touched, setTouched] = useState({ email: false, password: false });

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
    alert("Logged in successfully!");
  };

  return (
    <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-slate-50 px-4 py-12">
      <div className="w-full max-w-md space-y-6 rounded-2xl bg-white p-8 shadow-xl border border-slate-100">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">Welcome back</h2>
          <p className="mt-2 text-sm text-slate-500">Sign in to your account to continue</p>
        </div>

        <div className="grid grid-cols-2 gap-3 w-full">
          <SocialButton provider="Google" setScreen={setScreen} />
          <SocialButton provider="Facebook" setScreen={setScreen} />
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-left w-full">
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-slate-700">Email address</label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, email: true }))}
                className={cn(
                  "h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500",
                  emailError && "border-red-500 focus:ring-red-500/30"
                )}
              />
            </div>
            {emailError && <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-500"><AlertCircle className="h-3 w-3" /> {emailError}</p>}
          </div>

          <div className="text-left w-full">
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-slate-700">Password</label>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => setTouched((t) => ({ ...t, password: true }))}
                className={cn(
                  "h-11 w-full rounded-lg border border-slate-200 bg-white pl-10 pr-11 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/30 focus:border-purple-500",
                  passwordError && "border-red-500 focus:ring-red-500/30"
                )}
              />
              <button type="button" onClick={() => setShowPassword((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-slate-400">
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {passwordError && <p className="mt-1.5 flex items-center gap-1 text-xs font-medium text-red-500"><AlertCircle className="h-3 w-3" /> {passwordError}</p>}
          </div>

          <button type="submit" className="w-full flex h-12 items-center justify-center gap-2 rounded-lg bg-purple-600 text-base font-semibold text-white hover:bg-purple-700 duration-150 cursor-pointer">
            Sign in <ArrowRight className="ml-2 h-5 w-5" />
          </button>
        </form>

        <p className="text-center text-sm text-slate-500">
          Don't have an account?{" "}
          <button onClick={() => setScreen("register")} className="font-semibold text-purple-600 hover:text-purple-500 underline underline-offset-4 cursor-pointer bg-transparent border-0 p-0">
            Create one now
          </button>
        </p>
      </div>
    </div>
  );
}