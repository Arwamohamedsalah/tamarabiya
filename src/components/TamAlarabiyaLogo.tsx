import { useId } from 'react';
import { Link } from 'react-router-dom';
import '../styles/tam-alrabiya-logo.css';

export type TamAlarabiyaLogoSize = 'xs' | 'sm' | 'md' | 'lg' | 'hero';

export interface TamAlarabiyaLogoProps {
  size?: TamAlarabiyaLogoSize;
  /** Light = black ink; dark = white ink on dark backgrounds */
  theme?: 'light' | 'dark';
  withHeadings?: boolean;
  className?: string;
  linkToHome?: boolean;
}

const SIZE_CLASS: Record<TamAlarabiyaLogoSize, string> = {
  xs: 'tam-alrabiya-logo--xs',
  sm: 'tam-alrabiya-logo--sm',
  md: 'tam-alrabiya-logo--md',
  lg: 'tam-alrabiya-logo--lg',
  hero: 'tam-alrabiya-logo--hero',
};

const ARIA_LABEL = 'Tam Alarabiya — تام العربية';

interface LogoSvgProps {
  ink: string;
  gold: string;
  goldBright: string;
  gradientId: string;
}

/** Vector wordmark — no external font files required for TAM geometry */
function LogoSvg({ ink, gold, goldBright, gradientId }: LogoSvgProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 800 650"
      width="100%"
      height="auto"
      className="tam-alrabiya-logo__svg"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#dfaa2c" />
          <stop offset="30%" stopColor="#ca9520" />
          <stop offset="70%" stopColor="#f5ce62" />
          <stop offset="100%" stopColor="#b17e13" />
        </linearGradient>
      </defs>

      <g fill={`url(#${gradientId})`}>
        <path d="M40,70 H280 V135 H192 V310 H128 V135 H40 Z" />
        <path d="M300,310 L375,70 H445 L520,310 H452 L435,250 H385 L368,310 Z M400,132 L396,200 H424 L420,132 Z" />
        <path d="M540,310 V70 H610 L650,195 L690,70 H760 V310 H700 V160 L665,265 H635 L600,160 V310 Z" />
      </g>

      <g fontFamily="sans-serif">
        <text
          x="760"
          y="470"
          fontSize="115"
          fontWeight="900"
          fill={ink}
          letterSpacing="2"
          textAnchor="start"
          style={{ fontFamily: "'Arial Black', Impact, sans-serif" }}
        >
          تـام
        </text>
        <text
          x="490"
          y="470"
          fontSize="115"
          fontWeight="900"
          fill={gold}
          textAnchor="start"
          style={{ fontFamily: "'Arial Black', Impact, sans-serif" }}
        >
          العـربـيـة
        </text>
        <rect x="655" y="500" width="16" height="16" fill={ink} />
        <rect x="625" y="500" width="16" height="16" fill={ink} />
        <rect x="595" y="500" width="16" height="16" fill={ink} />
        <rect x="185" y="375" width="16" height="16" fill={gold} />
        <rect x="155" y="375" width="16" height="16" fill={gold} />
      </g>

      <g fontFamily="'Futura', 'Helvetica Neue', Arial, sans-serif">
        <text x="40" y="580" fontSize="62" fontWeight="bold" fill={goldBright}>
          Tam
        </text>
        <text x="185" y="580" fontSize="62" fontWeight="bold" fill={ink}>
          {' Alarabiya'}
        </text>
      </g>
    </svg>
  );
}

/**
 * Corporate vector wordmark: TAM · تام العربية · Tam Alarabiya
 */
export default function TamAlarabiyaLogo({
  size = 'hero',
  theme = 'light',
  withHeadings = false,
  className = '',
  linkToHome = false,
}: TamAlrabiyaLogoProps) {
  const gradientId = `tamGoldGradient-${useId().replace(/:/g, '')}`;
  const ink = theme === 'dark' ? '#ffffff' : '#0c0c0c';
  const gold = '#c38f1d';
  const goldBright = '#dfaa2c';

  const rootClass = [
    'tam-alrabiya-logo',
    SIZE_CLASS[size],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const svg = (
    <LogoSvg ink={ink} gold={gold} goldBright={goldBright} gradientId={gradientId} />
  );

  const inner = linkToHome ? (
    <Link to="/" className="tam-alrabiya-logo__link" aria-label={ARIA_LABEL}>
      {svg}
    </Link>
  ) : (
    svg
  );

  if (withHeadings) {
    return (
      <header className={rootClass} aria-label={ARIA_LABEL}>
        <h1 className="sr-only">{ARIA_LABEL}</h1>
        {inner}
      </header>
    );
  }

  return (
    <div className={rootClass} role="img" aria-label={ARIA_LABEL}>
      {inner}
    </div>
  );
}
