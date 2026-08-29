import { Link } from "react-router";
import { brand } from "../theme";

export function Title({ collapsed }: { collapsed: boolean }) {
  return (
    <Link
      to="/"
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        color: brand.primary,
        fontWeight: 600,
        letterSpacing: 2,
        padding: "4px 0",
      }}
    >
      <svg viewBox="0 0 128 128" width={28} height={28} aria-hidden>
        <path
          d="M64 28 C60 21 52 19 52 12.5 C52 7.5 58 6.5 64 12.5 C70 6.5 76 7.5 76 12.5 C76 19 68 21 64 28 Z"
          fill={brand.gold}
        />
        <path d="M64 45 L35 59.5 Q64 66.5 93 59.5 L64 45" fill="none" stroke={brand.gold} strokeWidth={3.4} strokeLinejoin="round" strokeLinecap="round" />
        <path d="M34 104 L34 68 Q49 90 64 100 Q79 90 94 68 L94 104" fill="none" stroke={brand.primary} strokeWidth={12} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      {!collapsed && <span>MARVEL&apos;S</span>}
    </Link>
  );
}
