import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ImageCrop {
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  width: number; // percentage (0-100)
  height: number; // percentage (0-100)
}

export interface ImageItem {
  id: string;
  url: string;
  alt: string;
  page: 'home' | 'landscaping' | 'fencing' | 'infrastructure' | 'about' | 'contact';
  section: 'hero' | 'services' | 'gallery' | 'projects' | 'header' | 'content' | 'work-area';
  workAreaId?: string;
  serviceKey?: 'landscaping' | 'fencing' | 'infrastructure';
  index?: number;
  crop?: ImageCrop; // Optional crop settings
  order?: number; // Display order from backend
  isActive?: boolean; // Visibility flag from backend
  createdAt?: string; // Creation timestamp from backend
  updatedAt?: string; // Last update timestamp from backend
  videoUrl?: string; // Optional video showcase URL
  videoPublicId?: string; // Cloudinary ID for uploaded videos
}

interface ImagesState {
  images: ImageItem[];
}

// Backend becomes المصدر الرئيسي للبيانات، لذلك لا نستخدم localStorage بعد الآن
const initialState: ImagesState = {
  images: [],
};

const imagesSlice = createSlice({
  name: 'images',
  initialState,
  reducers: {
    addImage: (state, action: PayloadAction<Partial<ImageItem>>) => {
      const payload = action.payload;
      const newImage: ImageItem = {
        ...payload,
        id: (payload.id as string) || Date.now().toString() + Math.random().toString(36).substr(2, 9),
        url: payload.url || '',
        alt: payload.alt || '',
        page: payload.page!,
        section: payload.section!,
        crop: payload.crop,
        videoUrl: payload.videoUrl,
        videoPublicId: payload.videoPublicId,
      };
      state.images = [...state.images, newImage];
    },
    updateImage: (state, action: PayloadAction<ImageItem>) => {
      const index = state.images.findIndex((img) => img.id === action.payload.id);
      if (index !== -1) {
        const updatedImages = [...state.images];
        updatedImages[index] = action.payload;
        state.images = updatedImages;
      }
    },
    deleteImage: (state, action: PayloadAction<string>) => {
      const updatedImages = state.images.filter((img) => img.id !== action.payload);
      state.images = updatedImages;
    },
    setImages: (state, action: PayloadAction<ImageItem[]>) => {
      state.images = action.payload;
    },
    loadImagesFromStorage: (state) => {
      // لم تعد مستخدمة، لكن نحتفظ بها لتوافق الكود القديم (لا تفعل شيئاً الآن)
      return state;
    },
  },
});

export const { addImage, updateImage, deleteImage, setImages, loadImagesFromStorage } = imagesSlice.actions;
export default imagesSlice.reducer;
