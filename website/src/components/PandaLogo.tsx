export function PandaLogo({ size = 40 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Ears */}
      <circle cx="22" cy="22" r="18" fill="currentColor" opacity="0.9" />
      <circle cx="78" cy="22" r="18" fill="currentColor" opacity="0.9" />
      <circle cx="22" cy="22" r="10" fill="var(--muted)" />
      <circle cx="78" cy="22" r="10" fill="var(--muted)" />

      {/* Head */}
      <ellipse cx="50" cy="55" rx="40" ry="38" fill="currentColor" opacity="0.05" stroke="currentColor" strokeWidth="2" />
      <ellipse cx="50" cy="55" rx="40" ry="38" fill="var(--card)" />
      <ellipse cx="50" cy="55" rx="40" ry="38" stroke="currentColor" strokeWidth="1.5" opacity="0.3" />

      {/* Eye patches (dark) */}
      <ellipse cx="33" cy="48" rx="14" ry="11" fill="currentColor" opacity="0.85" transform="rotate(-10 33 48)" />
      <ellipse cx="67" cy="48" rx="14" ry="11" fill="currentColor" opacity="0.85" transform="rotate(10 67 48)" />

      {/* Infinity loops as eyes */}
      <path
        d="M26 48c0-3 2.5-5.5 5.5-5.5 2 0 3.5 1 4.5 2.5 1-1.5 2.5-2.5 4.5-2.5 3 0 5.5 2.5 5.5 5.5s-2.5 5.5-5.5 5.5c-2 0-3.5-1-4.5-2.5-1 1.5-2.5 2.5-4.5 2.5-3 0-5.5-2.5-5.5-5.5z"
        fill="none"
        stroke="#60a5fa"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M60 48c0-3 2.5-5.5 5.5-5.5 2 0 3.5 1 4.5 2.5 1-1.5 2.5-2.5 4.5-2.5 3 0 5.5 2.5 5.5 5.5s-2.5 5.5-5.5 5.5c-2 0-3.5-1-4.5-2.5-1 1.5-2.5 2.5-4.5 2.5-3 0-5.5-2.5-5.5-5.5z"
        fill="none"
        stroke="#34d399"
        strokeWidth="2"
        strokeLinecap="round"
      />

      {/* Nose */}
      <ellipse cx="50" cy="62" rx="5" ry="3.5" fill="currentColor" opacity="0.7" />

      {/* Mouth */}
      <path d="M45 67 Q50 72 55 67" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.4" strokeLinecap="round" />
    </svg>
  );
}
