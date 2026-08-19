import { TAM_ARABIC_STYLED } from '../constants/brandTamArabic';
import '../styles/tam-ar-text.css';

interface TamArabicTextProps {
  className?: string;
}

/** "تــــــــام" — Tajawal + brand gold + kashida */
export default function TamArabicText({ className = '' }: TamArabicTextProps) {
  return (
    <span className={`tam-ar-text brand-tam-hero-gold ${className}`.trim()} aria-hidden="true">
      {TAM_ARABIC_STYLED}
    </span>
  );
}
