import { configureStore } from '@reduxjs/toolkit';
import uiReducer from './slices/uiSlice';
import contactReducer from './slices/contactSlice';
import navigationReducer from './slices/navigationSlice';
import authReducer from './slices/authSlice';
import imagesReducer from './slices/imagesSlice';
import pageContentReducer from './slices/pageContentSlice';
import siteSettingsReducer from './slices/siteSettingsSlice';

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    contact: contactReducer,
    navigation: navigationReducer,
    auth: authReducer,
    images: imagesReducer,
    pageContent: pageContentReducer,
    siteSettings: siteSettingsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
