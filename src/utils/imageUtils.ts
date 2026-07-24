import { ImageItem, ImageCrop } from '../store/slices/imagesSlice';

export function hasEffectiveCrop(crop?: ImageCrop): boolean {
  if (!crop) return false;
  return crop.x > 0 || crop.y > 0 || crop.width < 100 || crop.height < 100;
}

/** Map a Mongo/API image document to the Redux ImageItem shape */
export const mapApiImageToItem = (img: Record<string, unknown>): ImageItem => ({
  id: String(img._id ?? img.id ?? ''),
  url: String(img.url ?? ''),
  alt: String(img.alt || ''),
  page: img.page as ImageItem['page'],
  section: img.section as ImageItem['section'],
  crop: img.crop as ImageItem['crop'],
  order: typeof img.order === 'number' ? img.order : undefined,
  isActive: img.isActive as boolean | undefined,
  createdAt: img.createdAt as string | undefined,
  updatedAt: img.updatedAt as string | undefined,
  videoUrl: (img.videoUrl as string) || '',
  videoPublicId: img.videoPublicId as string | undefined,
  workAreaId: (img.workAreaId as string) || '',
  serviceKey: (img.serviceKey as ImageItem['serviceKey']) || undefined,
});

export const getImagesByPageAndSection = (
  images: ImageItem[],
  page: 'home' | 'landscaping' | 'fencing' | 'infrastructure' | 'about' | 'contact',
  section: 'hero' | 'services' | 'gallery' | 'projects' | 'header' | 'content' | 'work-area'
): ImageItem[] => {
  return images.filter((img) => img.page === page && img.section === section);
};

export const getWorkAreaImages = (
  images: ImageItem[],
  page: 'landscaping' | 'fencing' | 'infrastructure',
  workAreaId: string
): ImageItem[] => {
  return images
    .filter(
      (img) =>
        img.page === page && img.section === 'work-area' && img.workAreaId === workAreaId
    )
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
};

export const getHomeServiceImages = (
  images: ImageItem[],
  serviceKey: 'landscaping' | 'fencing' | 'infrastructure'
): ImageItem[] => {
  return images
    .filter(
      (img) =>
        img.page === 'home' && img.section === 'services' && img.serviceKey === serviceKey
    )
    .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
};

export const getImageStyle = (image: ImageItem): React.CSSProperties => {
  if (!image.crop) return {};

  const { x, y, width, height } = image.crop;
  // Use clipPath with inset for proper cropping
  return {
    clipPath: `inset(${y}% ${100 - x - width}% ${100 - y - height}% ${x}%)`,
    objectPosition: `${x + width / 2}% ${y + height / 2}%`,
  };
};

export function getImageWrapperStyle(
  image: ImageItem,
  fit: 'contain' | 'cover' = 'contain'
): React.CSSProperties {
  if (!hasEffectiveCrop(image.crop)) return {};

  const { x, y, width, height } = image.crop!;
  const scaleX = 100 / width;
  const scaleY = 100 / height;
  const scale = fit === 'contain' ? Math.min(scaleX, scaleY) : Math.max(scaleX, scaleY);

  // backgroundPosition in CSS % works as:
  //   0% = align left/top edge of image to left/top of container
  //   100% = align right/bottom edge of image to right/bottom of container
  // Formula: posX% = cropX / (100 - cropWidth) * 100
  const posX = width >= 100 ? 0 : (x / (100 - width)) * 100;
  const posY = height >= 100 ? 0 : (y / (100 - height)) * 100;

  return {
    backgroundImage: `url(${image.url})`,
    backgroundSize: `${scale * 100}%`,
    backgroundPosition: `${posX}% ${posY}%`,
    backgroundRepeat: 'no-repeat',
    width: '100%',
    height: '100%',
  };
}

export const getImageByIndex = (
  images: ImageItem[],
  page: 'home' | 'landscaping' | 'fencing' | 'infrastructure',
  section: 'hero' | 'services' | 'gallery' | 'projects',
  index: number
): string | null => {
  const filtered = getImagesByPageAndSection(images, page, section);
  return filtered[index]?.url || null;
};

export const getDefaultImage = (type: 'landscaping' | 'fencing' | 'infrastructure' | 'service'): string => {
  const defaultImages = {
    landscaping: 'https://images.pexels.com/photos/1105019/pexels-photo-1105019.jpeg?auto=compress&cs=tinysrgb&w=1600',
    fencing: 'https://images.pexels.com/photos/207666/pexels-photo-207666.jpeg?auto=compress&cs=tinysrgb&w=1600',
    infrastructure: 'https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=1600',
    service: 'https://images.pexels.com/photos/1105019/pexels-photo-1105019.jpeg?auto=compress&cs=tinysrgb&w=1200',
  };
  return defaultImages[type];
};
