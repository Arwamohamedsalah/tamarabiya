import React, { useState } from 'react';
import { Home, FileText, Phone } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../store/hooks';
import { useLocaleDirection } from '../hooks/useLocaleDirection';
import { getTelUrl, getWhatsAppUrl } from '../utils/contactLinks';
import { API_ORIGIN } from '../config/api';
import WhatsAppIcon from './icons/WhatsAppIcon';

const floatingButtonClass =
  'group relative flex items-center justify-end backdrop-blur-xl text-white shadow-[0_20px_50px_rgba(0,0,0,0.4)] transition-all duration-500 hover:-translate-y-1 active:scale-95 overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-white/80';

const FloatingHomeButton: React.FC = () => {
  const location = useLocation();
  const [isDownloading, setIsDownloading] = useState(false);
  const { t } = useTranslation('common');
  const { isRtl } = useLocaleDirection();
  const settings = useAppSelector((state) => state.siteSettings.data);

  const hiddenRoutes = ['/login', '/dashboard'];
  if (hiddenRoutes.includes(location.pathname)) return null;

  const whatsappUrl = getWhatsAppUrl(settings.whatsappNumber);
  const telUrl = getTelUrl(settings.phoneNumber);

  const handleDownload = async (e: React.MouseEvent) => {
    e.preventDefault();
    if (isDownloading) return;
    setIsDownloading(true);
    try {
      const link = document.createElement('a');
      link.href = `${API_ORIGIN || ''}/api/download-profile`;
      link.setAttribute('download', 'Company_Profile.pdf');
      link.setAttribute('target', '_blank');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch {
      // ignore
    } finally {
      setTimeout(() => setIsDownloading(false), 3000);
    }
  };

  const isHome = location.pathname === '/';
  const positionClass = isRtl ? 'right-8' : 'left-8';
  const labelExpandClass = `max-w-0 overflow-hidden opacity-0 group-hover:max-w-[200px] group-hover:opacity-100 transition-all duration-500 whitespace-nowrap font-black text-sm text-white ${isRtl ? 'text-right' : 'text-left'}`;

  return (
    <div className={`fixed bottom-8 ${positionClass} z-[100] flex flex-col gap-3 items-end`}>
      {whatsappUrl && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={t('floating.whatsapp')}
          className={`${floatingButtonClass} bg-[#25D366]/95 border border-[#20bd5a]/50 hover:bg-[#20bd5a]`}
          style={{ borderRadius: 0 }}
        >
          <div className="flex items-center gap-0 group-hover:gap-3 transition-all duration-500 px-4 py-4">
            <span className={labelExpandClass}>{t('floating.whatsapp')}</span>
            <WhatsAppIcon className="h-6 w-6 flex-shrink-0" />
          </div>
        </a>
      )}

      {telUrl && (
        <a
          href={telUrl}
          aria-label={t('floating.call')}
          className={`${floatingButtonClass} bg-metal-dark/90 border border-white/10 hover:bg-cta hover:border-cta-light`}
          style={{ borderRadius: 0 }}
        >
          <div className="flex items-center gap-0 group-hover:gap-3 transition-all duration-500 px-4 py-4">
            <span className={labelExpandClass}>{t('floating.call')}</span>
            <Phone className="h-6 w-6 flex-shrink-0" />
          </div>
        </a>
      )}

      <button
        onClick={handleDownload}
        disabled={isDownloading}
        aria-label={t('floating.downloadProfile')}
        className={`${floatingButtonClass} bg-yellow-400/95 border border-yellow-300/50 hover:bg-yellow-500 disabled:opacity-75`}
        style={{ borderRadius: 0 }}
      >
        <div className="flex items-center gap-0 group-hover:gap-3 transition-all duration-500 px-4 py-4">
          <span className={labelExpandClass}>
            {isDownloading ? t('floating.downloading') : (
              <span className="flex flex-col leading-tight">
                <span className="text-[10px] font-bold opacity-80">{t('floating.downloadProfileEn')}</span>
                <span>{t('floating.downloadProfile')}</span>
              </span>
            )}
          </span>
          <span className="relative flex-shrink-0">
            <FileText className={`h-6 w-6 text-white transition-all duration-500 ${isDownloading ? 'opacity-0' : 'opacity-100'}`} />
            {isDownloading && (
              <span className="absolute inset-0 flex items-center justify-center">
                <FileText className="h-5 w-5 text-white animate-bounce" />
              </span>
            )}
          </span>
        </div>
      </button>

      {!isHome && (
        <Link
          to="/"
          className={`${floatingButtonClass} bg-metal-dark/90 border border-white/10 hover:bg-cta hover:border-cta-light`}
          aria-label={t('floating.home')}
          style={{ borderRadius: 0 }}
        >
          <div className="flex items-center gap-0 group-hover:gap-3 transition-all duration-500 px-4 py-4">
            <span className="max-w-0 overflow-hidden opacity-0 group-hover:max-w-[100px] group-hover:opacity-100 transition-all duration-500 whitespace-nowrap font-black text-sm">
              {t('floating.home')}
            </span>
            <Home className="h-6 w-6 flex-shrink-0 transition-transform duration-500 group-hover:rotate-12" />
          </div>
        </Link>
      )}
    </div>
  );
};

export default FloatingHomeButton;
