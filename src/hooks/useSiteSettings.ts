import { useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import {
  setSiteSettings,
  setSiteSettingsError,
  setSiteSettingsLoading,
} from '../store/slices/siteSettingsSlice';
import type { SiteSettings } from '../types/siteSettings';

import { API_BASE_URL } from '../../config/api';

export function useSiteSettings() {
  const dispatch = useAppDispatch();
  const { data, loading, error } = useAppSelector((state) => state.siteSettings);

  const fetchSiteSettings = useCallback(async () => {
    dispatch(setSiteSettingsLoading(true));
    try {
      const res = await fetch(`${API_BASE_URL}/site-settings`);
      if (!res.ok) {
        throw new Error('Failed to load site settings');
      }
      const settings = (await res.json()) as SiteSettings;
      dispatch(setSiteSettings(settings));
      return settings;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load site settings';
      dispatch(setSiteSettingsError(message));
      return null;
    }
  }, [dispatch]);

  return { settings: data, loading, error, fetchSiteSettings };
}
