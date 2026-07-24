import { ImageItem, ImageCrop } from '../store/slices/imagesSlice';
import { hasEffectiveCrop } from '../utils/imageUtils';

type CropFit = 'contain' | 'cover';

interface CroppedImageProps {
  image: Pick<ImageItem, 'url' | 'alt' | 'crop'>;
  alt?: string;
  className?: string;
  style?: React.CSSProperties;
  imgClassName?: string;
  uncroppedClassName?: string;
  uncroppedStyle?: React.CSSProperties;
  fit?: CropFit;
  loading?: 'lazy' | 'eager';
}

export default function CroppedImage({
  image,
  alt,
  className = '',
  style,
  imgClassName = '',
  uncroppedClassName = '',
  uncroppedStyle,
  fit = 'contain',
  loading,
}: CroppedImageProps) {
  const resolvedAlt = alt || image.alt || '';

  if (!hasEffectiveCrop(image.crop)) {
    return (
      <img
        src={image.url}
        alt={resolvedAlt}
        className={uncroppedClassName || imgClassName || className}
        style={{ ...style, ...uncroppedStyle }}
        loading={loading}
      />
    );
  }

  const { x, y, width, height } = image.crop as ImageCrop;
  const scaleX = 100 / width;
  const scaleY = 100 / height;
  const scale = fit === 'contain' ? Math.min(scaleX, scaleY) : Math.max(scaleX, scaleY);

  return (
    <div className={`relative overflow-hidden ${className}`} style={style}>
      <img
        src={image.url}
        alt={resolvedAlt}
        loading={loading}
        className={`w-full h-full object-contain ${imgClassName}`}
        style={{
          clipPath: `inset(${y}% ${100 - x - width}% ${100 - y - height}% ${x}%)`,
          transform: `scale(${scale})`,
          transformOrigin: `${x + width / 2}% ${y + height / 2}%`,
        }}
      />
    </div>
  );
}
