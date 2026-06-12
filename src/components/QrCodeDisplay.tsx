import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import QRCode from 'qrcode';
import { useAppSelector } from '../store/hooks';
import { getQrDestinationLabel } from '../utils/contactLinks';

export default function QrCodeDisplay() {
  const { t } = useTranslation('contact');
  const settings = useAppSelector((state) => state.siteSettings.data);
  const [generatedQr, setGeneratedQr] = useState('');

  useEffect(() => {
    if (settings.qrCodeDataUrl || !settings.qrTargetUrl) {
      setGeneratedQr('');
      return;
    }

    let cancelled = false;
    QRCode.toDataURL(settings.qrTargetUrl, { width: 280, margin: 2 })
      .then((dataUrl) => {
        if (!cancelled) setGeneratedQr(dataUrl);
      })
      .catch(() => {
        if (!cancelled) setGeneratedQr('');
      });

    return () => {
      cancelled = true;
    };
  }, [settings.qrCodeDataUrl, settings.qrTargetUrl]);

  const qrSrc = settings.qrCodeDataUrl || generatedQr;
  if (!qrSrc) {
    return null;
  }

  const destinationLabel = getQrDestinationLabel(settings.qrDestination, t);

  return (
    <div className="mt-16 md:mt-24">
      <div className="text-center mb-12 animate-fade-in-up">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
          {t('qr.title')}
        </h2>
        <p className="text-gray-600 mb-2 text-lg">{t('qr.subtitle')}</p>
        <div className="w-32 h-1 bg-gradient-to-r from-transparent via-cta to-transparent mx-auto rounded-full"></div>
      </div>

      <div className="flex justify-center animate-fade-in-up">
        <div className="bg-white rounded-none shadow-xl p-8 md:p-10 border border-gray-100 text-center max-w-sm w-full hover:shadow-2xl transition-all duration-500">
          <img
            src={qrSrc}
            alt={t('qr.imageAlt', { destination: destinationLabel })}
            className="w-full max-w-[280px] mx-auto h-auto object-contain"
            loading="lazy"
          />
          <p className="mt-6 text-gray-700 font-medium">{t('qr.scanHint')}</p>
          <p className="mt-2 text-sm text-gray-500">{destinationLabel}</p>
          {settings.qrTargetUrl && (
            <a
              href={settings.qrTargetUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-4 text-cta hover:text-cta-hover font-semibold text-sm break-all"
            >
              {t('qr.openLink')}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
