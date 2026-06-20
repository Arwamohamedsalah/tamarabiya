import '../styles/tam-ar-text.css';

interface TamArabicTextProps {
  className?: string;
}

/** "تام" — Tajawal + brand gold */
export default function TamArabicText({ className = '' }: TamArabicTextProps) {
  return (
    <span className={`tam-ar-text brand-tam-hero-gold ${className}`.trim()} aria-hidden="true">
      تام
    </span>
  );
}
