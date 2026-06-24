"use client";

export default function Button({
  children,
  variant = "default",
  size = "md",
  className = "",
  ...props
}) {
  const base = "btn";
  const variants = {
    default: "btn-warm",
    outline: "btn-outline",
    ghost: "btn-ghost",
    soft: "btn-outline",
    destructive: "btn-danger",
  };
  const sizes = {
    sm: "btn-sm",
    md: "",
    icon: "btn-icon",
  };

  return (
    <button
      className={`${base} ${variants[variant] || ""} ${sizes[size] || ""} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
