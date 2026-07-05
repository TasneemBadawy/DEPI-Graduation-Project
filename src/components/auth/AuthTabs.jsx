import { useNavigate } from "react-router-dom";
import { cn } from "../../lib/utils";

export default function AuthTabs({ active }) {
  const navigate = useNavigate();
  return (
    <div className="mb-6 flex rounded-xl bg-muted p-1">
      <button
        type="button"
        onClick={() => navigate("/login")}
        className={cn(
          "flex-1 rounded-lg py-2 text-sm font-semibold transition-all",
          active === "signin" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
        )}
      >
        Sign in
      </button>
      <button
        type="button"
        onClick={() => navigate("/register")}
        className={cn(
          "flex-1 rounded-lg py-2 text-sm font-semibold transition-all",
          active === "signup" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"
        )}
      >
        Create account
      </button>
    </div>
  );
}
