// components/Logo.jsx
//
// No logo file was provided when this project was generated, so this is a
// placeholder wordmark + "19" stamp built entirely in SVG/CSS.
//
// TO SWAP IN YOUR REAL LOGO:
// 1. Save your logo image to /public/logo.png (or .svg)
// 2. Replace the contents of this component with:
//      <img src="/logo.png" alt="19Store" className={className} />
// 3. Also replace /public/favicon.svg with your real favicon, and swap the
//    <StampMark /> usage in components/LoadingScreen.jsx.

export function StampMark({ className = "w-10 h-10", tone = "light" }) {
  const ring = tone === "light" ? "#B08A4E" : "#111013";
  const fill = tone === "light" ? "#111013" : "#F7F5F1";
  const text = tone === "light" ? "#F7F5F1" : "#111013";
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <circle cx="32" cy="32" r="31" fill={fill} />
      <circle cx="32" cy="32" r="26" fill="none" stroke={ring} strokeWidth="1.4" />
      <circle cx="32" cy="32" r="21" fill="none" stroke={ring} strokeWidth="0.6" strokeDasharray="1.5 3" />
      <text
        x="32"
        y="41"
        textAnchor="middle"
        fontFamily="var(--font-display)"
        fontSize="24"
        fill={text}
        fontWeight="700"
      >
        19
      </text>
    </svg>
  );
}

export default function Logo({ className = "", tone = "light" }) {
  const textColor = tone === "light" ? "text-paper" : "text-ink";
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <StampMark className="w-8 h-8 shrink-0" tone={tone} />
      <span className={`font-display leading-none ${textColor}`}>
        <span className="block text-lg tracking-wide">19Store</span>
      </span>
    </span>
  );
}
