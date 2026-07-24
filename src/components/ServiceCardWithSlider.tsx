import { Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ImageItem } from '../store/slices/imagesSlice';
import CroppedImage from './CroppedImage';
import { useLocaleDirection } from '../hooks/useLocaleDirection';

interface ServiceCardWithSliderProps {
  id: string;
  title: string;
  titleEn: string;
  description: string;
  link: string;
  images: ImageItem[];
  defaultImage: string;
}

const SLIDE_INTERVAL = 3000;

function renderImg(img: ImageItem | undefined, defaultImage: string, title: string, extra?: string) {
  if (!img) {
    return (
      <img
        src={defaultImage}
        alt={title}
        className={`w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 ${extra ?? ''}`}
      />
    );
  }
  return (
    <CroppedImage
      image={img}
      alt={img.alt || title}
      className="w-full h-full"
      uncroppedClassName={`w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 ${extra ?? ''}`}
      imgClassName={`transition-transform duration-1000 group-hover:scale-110 ${extra ?? ''}`}
      fit="contain"
    />
  );
}

export default function ServiceCardWithSlider({
  title,
  titleEn,
  description,
  link,
  images,
  defaultImage,
}: ServiceCardWithSliderProps) {
  const { t } = useTranslation('home');
  const { isRtl } = useLocaleDirection();
  const [isHovered, setIsHovered] = useState(false);
  const [slideIndex, setSlideIndex] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const img1 = images.length > 0 ? images[0] : undefined;
  const img2 = images.length > 1 ? images[1] : undefined;

  const imagePairs: [ImageItem | undefined, ImageItem | undefined][] = [];
  if (images.length === 0) {
    imagePairs.push([undefined, undefined]);
  } else if (images.length === 1) {
    imagePairs.push([images[0], undefined]);
  } else {
    for (let i = 0; i < images.length; i += 2) {
      imagePairs.push([images[i], images[i + 1] ?? images[0]]);
    }
  }

  const currentPair = imagePairs[slideIndex] ?? imagePairs[0];

  useEffect(() => {
    if (isHovered && imagePairs.length > 1) {
      intervalRef.current = setInterval(() => {
        setSlideIndex((prev) => (prev + 1) % imagePairs.length);
      }, SLIDE_INTERVAL);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      setSlideIndex(0);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHovered, imagePairs.length]);

  void img1; void img2;

  const contentAlign = isRtl ? 'text-right justify-start' : 'text-left justify-end';
  const indicatorPosition = isRtl ? 'top-6 right-6' : 'top-6 left-6';
  const arrowHover = isRtl ? 'group-hover:translate-x-[-8px]' : 'group-hover:translate-x-[8px]';

  return (
    <Link
      to={link}
      className="group relative block w-full h-[600px] bg-metal-dark overflow-hidden rounded-none focus:outline-none shadow-[0_20px_50px_rgba(0,0,0,0.3)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.5)] transition-all duration-500 hover:-translate-y-4 border border-white/10"
      aria-label={`${title} - ${titleEn}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="absolute inset-0 z-0 flex flex-col">
        <div className="relative w-full h-1/2 overflow-hidden">
          {renderImg(currentPair[0], defaultImage, title)}
        </div>
        <div className="h-[3px] bg-yellow-400/60 flex-shrink-0 z-10" />
        <div className="relative w-full h-1/2 overflow-hidden">
          {renderImg(currentPair[1], defaultImage, title)}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20 group-hover:from-black group-hover:via-black/60 transition-all duration-500" />
      </div>

      {imagePairs.length > 1 && isHovered && (
        <div className={`absolute ${indicatorPosition} flex gap-1.5 z-20`}>
          {imagePairs.map((_, i) => (
            <span
              key={i}
              className={`h-1 transition-all duration-500 rounded-none ${i === slideIndex ? 'bg-yellow-400 w-6' : 'bg-white/30 w-1.5'}`}
            />
          ))}
        </div>
      )}

      <div className={`relative z-10 h-full p-8 flex flex-col justify-end ${contentAlign}`}>
        <div className={`w-12 h-1 bg-yellow-400 mb-6 transition-all duration-500 group-hover:w-20`}></div>

        <h3 className="text-2xl md:text-3xl font-bold text-white mb-2 group-hover:text-yellow-400 transition-colors">
          {title}
        </h3>
        <h4 className="text-xs font-bold text-yellow-400/80 mb-4 tracking-[0.3em] uppercase">
          {titleEn}
        </h4>

        <p className="text-white/70 text-sm md:text-base leading-relaxed mb-6 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
          {description}
        </p>

        <div className={`flex items-center gap-2 text-yellow-400 font-bold text-xs uppercase tracking-widest ${isRtl ? 'justify-start' : 'justify-end'}`}>
          <span>{t('services.explore')}</span>
          <ArrowRight className={`h-4 w-4 transition-transform ${arrowHover} ${isRtl ? '' : 'rotate-180'}`} />
        </div>
      </div>

      <div className={`absolute bottom-0 ${isRtl ? 'left-0' : 'right-0'} h-1 bg-yellow-400 w-0 group-hover:w-full transition-all duration-700`}></div>
    </Link>
  );
}
