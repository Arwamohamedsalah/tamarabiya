import { X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useLocaleDirection } from '../hooks/useLocaleDirection';

interface VideoModalProps {
    isOpen: boolean;
    onClose: () => void;
    videoUrl: string;
}

export default function VideoModal({ isOpen, onClose, videoUrl }: VideoModalProps) {
    const { t } = useTranslation('common');
    const { isRtl } = useLocaleDirection();

    if (!isOpen) return null;

    const getEmbedUrl = (url: string) => {
        if (url.includes('youtube.com') || url.includes('youtu.be')) {
            const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
            const match = url.match(regExp);
            const id = (match && match[2].length === 11) ? match[2] : null;
            return id ? `https://www.youtube.com/embed/${id}?autoplay=1` : url;
        }
        if (url.includes('vimeo.com')) {
            const id = url.split('/').pop();
            return `https://player.vimeo.com/video/${id}?autoplay=1`;
        }
        return url;
    };

    const isEmbed = videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be') || videoUrl.includes('vimeo.com');
    const embedUrl = isEmbed ? getEmbedUrl(videoUrl) : null;
    const closePosition = isRtl ? '-top-12 right-0' : '-top-12 left-0';

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-fade-in">
            <div
                className="absolute inset-0 bg-metal-dark/95 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative w-full max-w-5xl aspect-video bg-black shadow-2xl border border-white/10 overflow-hidden transform transition-all animate-scale-in">
                <button
                    onClick={onClose}
                    className={`absolute ${closePosition} text-white hover:text-cta transition-colors flex items-center gap-2 group`}
                    aria-label={t('videoModal.close')}
                >
                    <span className="text-sm font-black uppercase tracking-widest hidden md:block">{t('videoModal.close')}</span>
                    <X className="h-8 w-8" />
                </button>

                {isEmbed ? (
                    <iframe
                        src={embedUrl!}
                        className="w-full h-full"
                        allow="autoplay; fullscreen; picture-in-picture"
                        allowFullScreen
                        title={t('videoModal.title')}
                    />
                ) : (
                    <video
                        src={videoUrl}
                        controls
                        autoPlay
                        className="w-full h-full object-contain"
                    />
                )}
            </div>
        </div>
    );
}
