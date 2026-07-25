import { useCallback, useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLocaleDirection } from '../hooks/useLocaleDirection';
import CroppedImage from './CroppedImage';
import type { ImageItem } from '../store/slices/imagesSlice';

interface GalleryLightboxProps {
  images: ImageItem[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
  getAlt: (image: ImageItem, index: number) => string;
}

export default function GalleryLightbox({
  images,
  initialIndex,
  isOpen,
  onClose,
  getAlt,
}: GalleryLightboxProps) {
  const { t } = useTranslation('common');
  const { isRtl } = useLocaleDirection();
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      const prevKey = isRtl ? 'ArrowRight' : 'ArrowLeft';
      const nextKey = isRtl ? 'ArrowLeft' : 'ArrowRight';

      if (event.key === prevKey) {
        goPrev();
      } else if (event.key === nextKey) {
        goNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isRtl, goPrev, goNext, onClose]);

  if (!isOpen || images.length === 0) return null;

  const currentImage = images[currentIndex];
  const closePosition = isRtl ? 'top-4 right-4' : 'top-4 left-4';
  const PrevIcon = isRtl ? ChevronRight : ChevronLeft;
  const NextIcon = isRtl ? ChevronLeft : ChevronRight;

  return (
    <div
      className="fixed inset-0 z-[100] flex flex-col animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-label={t('galleryLightbox.title')}
    >
      <div className="absolute inset-0 bg-metal-dark/95 backdrop-blur-sm" onClick={onClose} />

      <button
        type="button"
        onClick={onClose}
        className={`absolute ${closePosition} z-20 text-white hover:text-cta transition-colors flex items-center gap-2`}
        aria-label={t('galleryLightbox.close')}
      >
        <span className="text-sm font-black uppercase tracking-widest hidden md:block">
          {t('galleryLightbox.close')}
        </span>
        <X className="h-8 w-8" />
      </button>

      <div className="relative z-10 flex-1 flex items-center justify-center px-4 md:px-16 py-20 min-h-0">
        {images.length > 1 && (
          <button
            type="button"
            onClick={goPrev}
            className={`absolute z-20 p-3 rounded-none bg-black/40 text-white hover:bg-black/60 transition-colors ${
              isRtl ? 'right-2 md:right-8' : 'left-2 md:left-8'
            }`}
            aria-label={t('galleryLightbox.previous')}
          >
            <PrevIcon className="h-8 w-8" />
          </button>
        )}

        <div className="relative w-full max-w-6xl h-full max-h-[70vh] flex items-center justify-center">
          <CroppedImage
            image={currentImage}
            alt={getAlt(currentImage, currentIndex)}
            className="w-full h-full max-h-[70vh]"
            uncroppedClassName="max-w-full max-h-[70vh] w-auto h-auto object-contain mx-auto"
            fit="contain"
          />
        </div>

        {images.length > 1 && (
          <button
            type="button"
            onClick={goNext}
            className={`absolute z-20 p-3 rounded-none bg-black/40 text-white hover:bg-black/60 transition-colors ${
              isRtl ? 'left-2 md:left-8' : 'right-2 md:right-8'
            }`}
            aria-label={t('galleryLightbox.next')}
          >
            <NextIcon className="h-8 w-8" />
          </button>
        )}
      </div>

      <div className="relative z-10 px-4 pb-6 pt-2 space-y-3">
        <p className="text-center text-white/80 text-sm">
          {t('galleryLightbox.counter', { current: currentIndex + 1, total: images.length })}
        </p>

        {images.length > 1 && (
          <div className="overflow-x-auto pb-2">
            <div className="flex gap-3 min-w-min px-2 mx-auto justify-center">
              {images.map((image, index) => (
                <button
                  key={image.id || index}
                  type="button"
                  onClick={() => setCurrentIndex(index)}
                  className={`relative flex-shrink-0 w-20 h-16 md:w-24 md:h-20 overflow-hidden border-2 transition-all ${
                    index === currentIndex
                      ? 'border-cta ring-2 ring-cta/40 scale-105'
                      : 'border-white/20 opacity-70 hover:opacity-100'
                  }`}
                  aria-label={getAlt(image, index)}
                  aria-current={index === currentIndex ? 'true' : undefined}
                >
                  <CroppedImage
                    image={image}
                    alt=""
                    className="w-full h-full"
                    uncroppedClassName="w-full h-full object-cover"
                    fit="cover"
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
