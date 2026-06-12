import { Provider } from 'react-redux';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { store } from './store/store';
import { setImages } from './store/slices/imagesSlice';
import { DEFAULT_SITE_SETTINGS, API_BASE_URL } from './config/api';
import { setSiteSettings } from './store/slices/siteSettingsSlice';
import DocumentLanguageSync from './components/DocumentLanguageSync';
import { useLocaleDirection } from './hooks/useLocaleDirection';

import Header from './components/Header';
import Footer from './components/Footer';
import NotificationToast from './components/NotificationToast';
import FloatingHomeButton from './components/FloatingHomeButton';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Landscaping from './pages/Landscaping';
import Fencing from './pages/Fencing';
import Infrastructure from './pages/Infrastructure';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';

function Layout({ children }: { children: React.ReactNode }) {
  const { dir } = useLocaleDirection();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col" dir={dir}>
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
    </div>
  );
}

function NotFoundPage() {
  const { t } = useTranslation('common');

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{t('notFound.title')}</h1>
        <p className="text-gray-600 mb-8">{t('notFound.message')}</p>
        <Link to="/" className="text-cta hover:text-cta-hover font-medium">
          {t('notFound.backHome')}
        </Link>
      </div>
    </div>
  );
}

function App() {
  // تحميل الصور من الـ API عند فتح الموقع (لظهورها في كل الصفحات)
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/images`);
        if (!res.ok) return;
        const data = await res.json();
        const mapped = data.map((img: { _id: string; url: string; alt?: string; page: string; section: string; crop?: object }) => ({
          id: img._id,
          url: img.url,
          alt: img.alt || '',
          page: img.page,
          section: img.section,
          crop: img.crop,
        }));
        store.dispatch(setImages(mapped));
      } catch {
        // الباك إند غير شغال أو خطأ في الشبكة
      }
    };
    fetchImages();
  }, []);

  useEffect(() => {
    const fetchSiteSettings = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/site-settings`);
        if (!res.ok) {
          store.dispatch(setSiteSettings(DEFAULT_SITE_SETTINGS));
          return;
        }
        const data = await res.json();
        store.dispatch(setSiteSettings(data));
      } catch {
        store.dispatch(setSiteSettings(DEFAULT_SITE_SETTINGS));
      }
    };
    fetchSiteSettings();
  }, []);

  // Listen for storage changes and update Redux store
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'siteImages') {
        handleCustomStorage();
      }
    };

    // Listen for storage events (from other tabs/windows)
    window.addEventListener('storage', handleStorageChange);

    // إعادة تحميل الصور والإعدادات من الـ API عند حدوث تغيير (من الداشبورد أو تاب آخر)
    const handleCustomStorage = () => {
      setTimeout(async () => {
        try {
          const [imagesRes, settingsRes] = await Promise.all([
            fetch(`${API_BASE_URL}/images`),
            fetch(`${API_BASE_URL}/site-settings`),
          ]);
          if (imagesRes.ok) {
            const data = await imagesRes.json();
            const mapped = data.map((img: { _id: string; url: string; alt?: string; page: string; section: string; crop?: object }) => ({
              id: img._id,
              url: img.url,
              alt: img.alt || '',
              page: img.page,
              section: img.section,
              crop: img.crop,
            }));
            store.dispatch(setImages(mapped));
          }
          if (settingsRes.ok) {
            store.dispatch(setSiteSettings(await settingsRes.json()));
          }
        } catch { /* ignore */ }
      }, 0);
    };
    window.addEventListener('customStorage', handleCustomStorage);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('customStorage', handleCustomStorage);
    };
  }, []);

  return (
    <Provider store={store}>
      <DocumentLanguageSync />
      <NotificationToast />
      <BrowserRouter>
        <FloatingHomeButton />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />
          <Route
            path="/about"
            element={
              <Layout>
                <About />
              </Layout>
            }
          />
          <Route
            path="/contact"
            element={
              <Layout>
                <Contact />
              </Layout>
            }
          />
          <Route
            path="/landscaping"
            element={
              <Layout>
                <Landscaping />
              </Layout>
            }
          />
          <Route
            path="/fencing"
            element={
              <Layout>
                <Fencing />
              </Layout>
            }
          />
          <Route
            path="/infrastructure"
            element={
              <Layout>
                <Infrastructure />
              </Layout>
            }
          />
          <Route
            path="*"
            element={
              <Layout>
                <NotFoundPage />
              </Layout>
            }
          />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
