const VARIANTS = {
  secondary: { bg: "oklch(0.52 0.12 175 / 0.15)", color: "oklch(0.52 0.12 175)" },
  primary:   { bg: "oklch(0.62 0.18 42 / 0.1)",   color: "var(--primary)" },
};

export default function Avatar({ initials, size = 36, variant = "secondary" }) {
  const { bg, color } = VARIANTS[variant];
  const style = {
    width: size, height: size, borderRadius: "50%",
    background: bg, color,
    display: "flex", alignItems: "center", justifyContent: "center",
    fontWeight: 600, fontSize: size * 0.35, flexShrink: 0,
  };
  return <div style={style}>{initials}</div>;
}
