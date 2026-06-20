import '../styles/round-dot-tam.css';

interface RoundDotTamProps {
  className?: string;
  /** Larger hero wordmark tuning */
  size?: 'default' | 'hero';
}

/**
 * Renders "تام" with circular dots on the letter ت.
 */
export default function RoundDotTam({ className = '', size = 'default' }: RoundDotTamProps) {
  const sizeClass = size === 'hero' ? 'round-dot-tam--hero' : '';

  return (
    <span className={`round-dot-tam ${sizeClass} ${className}`.trim()} aria-hidden="true">
      <span className="round-dot-tam__ta">
        <span className="round-dot-tam__ta-glyph">
          <span className="round-dot-tam__ta-glyph-inner">ت</span>
        </span>
        <span className="round-dot-tam__ta-dots">
          <i />
          <i />
        </span>
      </span>
      ام
    </span>
  );
}
