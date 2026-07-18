// import { useNavigate } from "react-router-dom";

// const ICONS = {
//   Google: (
//     <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0">
//       <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.4-1.7 4-5.5 4-3.3 0-6-2.7-6-6.1s2.7-6.1 6-6.1c1.9 0 3.1.8 3.8 1.5l2.6-2.5C16.7 3.3 14.5 2.4 12 2.4 6.7 2.4 2.4 6.7 2.4 12s4.3 9.6 9.6 9.6c5.5 0 9.2-3.9 9.2-9.4 0-.6-.1-1.1-.2-1.6L12 10.2z" />
//     </svg>
//   ),
//   Apple: (
//     <svg viewBox="0 0 24 24" className="h-4 w-4 shrink-0 fill-foreground">
//       <path d="M16.365 1.43c0 1.14-.462 2.098-1.203 2.87-.813.847-2.13 1.508-3.256 1.42-.13-1.1.44-2.24 1.15-2.98.79-.85 2.14-1.47 3.31-1.31zm2.87 6.03c-1.79-1.06-3.63-.66-4.68-.03-.86.5-1.86.5-2.68-.02-1.13-.66-3.06-1.05-4.85.05C4.6 8.55 2.9 11.9 3.99 15.5c.55 1.82 1.35 3.6 2.44 5.1.9 1.26 1.98 2.67 3.4 2.6 1.38-.06 1.9-.9 3.57-.9 1.66 0 2.13.9 3.58.87 1.48-.03 2.4-1.29 3.3-2.55.86-1.2 1.24-2.1 1.9-3.5-4.19-1.6-4.85-6.87-1.94-9.7z" />
//     </svg>
//   ),
//   Facebook: (
//     <svg viewBox="0 0 24 24" className="h-4 w-4 fill-[#1877F2] shrink-0">
//       <path d="M22 12a10 10 0 10-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.5h-1.3c-1.2 0-1.6.8-1.6 1.6V12h2.8l-.5 2.9h-2.4v7A10 10 0 0022 12z" />
//     </svg>
//   ),
// };

// export function SocialButton({ provider, redirectTo = "/login" }) {
//   const navigate = useNavigate();

//   return (
//     <button
//       type="button"
//       onClick={() => navigate(redirectTo)}
//       aria-label={`Continue with ${provider}`}
//       className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-border bg-card text-sm font-medium text-foreground hover:bg-muted cursor-pointer w-full transition-colors duration-150"
//     >
//       {ICONS[provider] || null}
//       <span className="hidden sm:inline">{provider}</span>
//     </button>
//   );
// }

// export function SocialRow({ redirectTo = "/login" }) {
//   return (
//     <>
//       <div className="my-6 flex items-center gap-3">
//         <div className="h-px flex-1 bg-border" />
//         <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Or continue with</span>
//         <div className="h-px flex-1 bg-border" />
//       </div>
//       <div className="grid grid-cols-3 gap-3">
//         <SocialButton provider="Google" redirectTo={redirectTo} />
//         <SocialButton provider="Apple" redirectTo={redirectTo} />
//         <SocialButton provider="Facebook" redirectTo={redirectTo} />
//       </div>
//     </>
//   );
// }
