import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface ServiceType {
  name: string;
  nameAr: string;
  desc: string;
  descEn?: string;
  order?: number;
}

export interface PageContentData {
  page: 'landscaping' | 'fencing' | 'infrastructure';
  introTitle: string;
  introTitleEn?: string;
  introDescription: string;
  introDescriptionEn?: string;
  serviceTypes: ServiceType[];
  ctaTitle: string;
  ctaTitleEn?: string;
  ctaDescription: string;
  ctaDescriptionEn?: string;
  ctaButtonText: string;
  ctaButtonTextEn?: string;
}

type PageKey = 'landscaping' | 'fencing' | 'infrastructure';

interface PageContentState {
  byPage: Record<PageKey, PageContentData | null>;
}

const initialState: PageContentState = {
  byPage: {
    landscaping: null,
    fencing: null,
    infrastructure: null,
  },
};

const pageContentSlice = createSlice({
  name: 'pageContent',
  initialState,
  reducers: {
    setPageContent: (state, action: PayloadAction<PageContentData>) => {
      const key = action.payload.page as PageKey;
      if (key in state.byPage) {
        state.byPage[key] = action.payload;
      }
    },
    setAllPageContents: (state, action: PayloadAction<Record<PageKey, PageContentData>>) => {
      state.byPage = { ...state.byPage, ...action.payload };
    },
  },
});

export const { setPageContent, setAllPageContents } = pageContentSlice.actions;
export default pageContentSlice.reducer;
