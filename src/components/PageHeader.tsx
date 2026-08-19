import React, { useState, useEffect } from 'react';
import CompanyName from './CompanyName';
import CroppedImage from './CroppedImage';
import { useLocaleDirection } from '../hooks/useLocaleDirection';
import type { ImageItem } from '../store/slices/imagesSlice';

interface PageHeaderProps {
    title: string;
    titleEn: string;
    accentColor?: 'cta' | 'landscape' | 'metal' | 'infra';
    showCompanyName?: boolean;
    images?: Pick<ImageItem, 'id' | 'url' | 'alt' | 'crop'>[];
}

const PageHeader: React.FC<PageHeaderProps> = ({
    title,
    titleEn,
    accentColor = 'cta',
    showCompanyName = false,
    images = []
}) => {
    const [heroIndex, setHeroIndex] = useState(0);
    const { language } = useLocaleDirection();
    const titleFont = language === 'ar' ? 'font-arabic arabic-brand-text' : 'font-montserrat english-brand-text';

    useEffect(() => {
        if (images.length > 1) {
            const interval = setInterval(() => {
                setHeroIndex((prev) => (prev + 1) % images.length);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [images.length]);

    const accentGlow = {
        cta: 'bg-cta/20',
        landscape: 'bg-landscape/20',
        metal: 'bg-metal-silver/20',
        infra: 'bg-infra/20'
    };

    return (
        <section className={`relative h-[70vh] flex items-center justify-center overflow-hidden ${images.length > 0 ? 'bg-metal-dark' : 'mesh-bg grain'}`}>
            {/* Background Images Slider */}
            <div className="absolute inset-0 z-0">
                {images.length > 0 ? (
                    images.map((img, idx) => (
                        <div
                            key={img.id}
                            className={`absolute inset-0 transition-opacity duration-1000 ${idx === heroIndex ? 'opacity-100' : 'opacity-0'}`}
                        >
                            <CroppedImage
                                image={img}
                                alt={img.alt || title}
                                className="w-full h-full"
                                uncroppedClassName="w-full h-full object-cover"
                                fit="cover"
                            />
                        </div>
                    ))
                ) : (
                    <div className="absolute inset-0 bg-metal-dark/20" />
                )}
            </div>

            {/* Decorative overlays — only when no hero images */}
            {images.length === 0 && (
                <div className="absolute inset-0 z-0 pointer-events-none">
                    <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] ${accentGlow[accentColor]} rounded-full blur-[120px] animate-float`}></div>
                    <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-white/5 rounded-full blur-[120px] animate-float-reverse"></div>
                    <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
                </div>
            )}

            <div className="relative z-10 text-center animate-fade-in-up px-4 max-w-6xl w-full pt-20 md:pt-28">
                {titleEn ? (
                    <p className={`text-xs md:text-sm lg:text-base font-bold text-white mb-6 tracking-[0.6em] uppercase drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)] font-montserrat english-brand-text`}>
                        {titleEn}
                    </p>
                ) : null}
                <h1 className={`text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-8 drop-shadow-[0_2px_16px_rgba(0,0,0,0.9)] leading-[1.1] ${titleFont}`}>
                    {title}
                </h1>
                <div className="w-16 h-1 bg-gradient-to-r from-transparent via-current to-transparent mx-auto opacity-40 rounded-none mb-12" style={{ color: accentColor === 'metal' ? '#94a3b8' : accentColor === 'landscape' ? '#22c55e' : accentColor === 'infra' ? '#f97316' : '#bf813d' }}></div>

                {showCompanyName && (
                    <div className="mt-12 flex flex-col items-center drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
                        <CompanyName variant="hero" />
                    </div>
                )}
            </div>

        </section>
    );
};

export default PageHeader;
