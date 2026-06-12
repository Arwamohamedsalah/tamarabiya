import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DEFAULT_SITE_SETTINGS } from '../../config/api';
import type { SiteSettings } from '../../types/siteSettings';

interface SiteSettingsState {
  data: SiteSettings;
  loading: boolean;
  error: string | null;
}

const initialState: SiteSettingsState = {
  data: DEFAULT_SITE_SETTINGS,
  loading: false,
  error: null,
};

const siteSettingsSlice = createSlice({
  name: 'siteSettings',
  initialState,
  reducers: {
    setSiteSettingsLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setSiteSettings: (state, action: PayloadAction<SiteSettings>) => {
      state.data = action.payload;
      state.loading = false;
      state.error = null;
    },
    setSiteSettingsError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.loading = false;
    },
  },
});

export const {
  setSiteSettingsLoading,
  setSiteSettings,
  setSiteSettingsError,
} = siteSettingsSlice.actions;

export default siteSettingsSlice.reducer;
