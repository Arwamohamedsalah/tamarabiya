import { Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import CompanyName from './CompanyName';
import LanguageSwitcher from './LanguageSwitcher';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { toggleMobileMenu, closeMobileMenu } from '../store/slices/uiSlice';
import { useLocaleDirection } from '../hooks/useLocaleDirection';

export default function Header() {
  const dispatch = useAppDispatch();
  const mobileMenuOpen = useAppSelector((state) => state.ui.mobileMenuOpen);
  const { t } = useTranslation('common');
  const { isRtl } = useLocaleDirection();

  const navItems = [
    { to: '/', label: t('nav.home'), accent: 'bg-cta' },
    { to: '/about', label: t('nav.about'), accent: 'bg-cta' },
    { to: '/landscaping', label: t('nav.landscaping'), accent: 'bg-landscape' },
    { to: '/fencing', label: t('nav.fencing'), accent: 'bg-metal-silver' },
    { to: '/infrastructure', label: t('nav.infrastructure'), accent: 'bg-cta' },
  ];

  const mobileNavItems = [
    { to: '/', label: t('nav.home') },
    { to: '/about', label: t('nav.about') },
    { to: '/landscaping', label: t('nav.landscaping') },
    { to: '/fencing', label: t('nav.fencingMobile') },
    { to: '/infrastructure', label: t('nav.infrastructure') },
  ];

  const underlineOrigin = isRtl ? 'origin-right' : 'origin-left';
  const underlinePosition = isRtl ? 'right-0 left-0' : 'left-0 right-0';
  const logoAlign = isRtl ? 'text-right' : 'text-left';
  const mobileSlide = isRtl ? 'translate-x-[-20px]' : 'translate-x-[20px]';

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-metal/95 backdrop-blur-md border-b border-white/5 shadow-2xl" role="banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link
            to="/"
            className="flex items-center gap-3 hover:opacity-80 transition-opacity focus:outline-none group py-2"
            aria-label={t('aria.homePage')}
          >
            <div className="relative w-12 h-12 md:w-14 md:h-14 rounded-none overflow-hidden shadow-lg transition-all duration-300 group-hover:scale-110 bg-white p-1">
              <img
                src="/tam.png"
                alt={t('aria.logoAlt')}
                className="w-full h-full object-contain"
              />
            </div>
            <div className={logoAlign}>
              <h1 className="text-lg md:text-xl lg:text-2xl font-black leading-tight mb-0.5"><CompanyName variant="light" highlightClassName="text-yellow-400" /></h1>
              <p className="text-[11px] md:text-xs text-metal-silver uppercase tracking-[0.4em] opacity-80">{t('tagline')}</p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8" aria-label={t('aria.mainNav')}>
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className="text-metal-silver hover:text-white font-medium transition-colors duration-300 focus:outline-none relative group py-2"
              >
                {item.label}
                <span className={`absolute bottom-0 ${underlinePosition} h-0.5 ${item.accent} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${underlineOrigin}`}></span>
              </Link>
            ))}
            <LanguageSwitcher />
            <Link
              to="/contact"
              className="bg-yellow-400 text-white px-8 py-3 rounded-none font-black uppercase tracking-[0.2em] hover:bg-yellow-500 transition-all duration-300 hover:shadow-lg focus:outline-none"
            >
              {t('nav.contact')}
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center gap-2">
            <LanguageSwitcher />
            <button
              className="p-2 text-metal-silver hover:text-white focus:outline-none transition-all duration-300"
              onClick={() => dispatch(toggleMobileMenu())}
              aria-label={t('aria.menuToggle')}
              aria-expanded={mobileMenuOpen}
            >
              <div className="relative w-6 h-6">
                <Menu
                  className={`absolute inset-0 h-6 w-6 transition-all duration-300 ${mobileMenuOpen ? 'opacity-0 rotate-90' : 'opacity-100 rotate-0'
                    }`}
                />
                <X
                  className={`absolute inset-0 h-6 w-6 transition-all duration-300 ${mobileMenuOpen ? 'opacity-100 rotate-0' : 'opacity-0 -rotate-90'
                    }`}
                />
              </div>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <nav
          className={`lg:hidden overflow-hidden transition-all duration-500 ease-in-out ${mobileMenuOpen
            ? 'max-h-[500px] opacity-100 pb-6 border-t border-white/5 mt-0 pt-4'
            : 'max-h-0 opacity-0'
            }`}
          aria-label={t('aria.mobileNav')}
        >
          <div className="flex flex-col gap-2">
            {mobileNavItems.map((item, index) => (
              <Link
                key={item.to}
                to={item.to}
                className={`text-metal-silver hover:text-white font-medium py-3 px-4 rounded-none hover:bg-white/5 transition-all duration-300 focus:outline-none transform ${mobileMenuOpen
                  ? 'translate-x-0 opacity-100'
                  : mobileSlide + ' opacity-0'
                  }`}
                style={{
                  transitionDelay: mobileMenuOpen ? `${index * 0.05}s` : '0s',
                  transitionDuration: '300ms'
                }}
                onClick={() => dispatch(closeMobileMenu())}
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="/contact"
              className={`bg-yellow-400 text-white font-black py-4 px-4 rounded-none uppercase tracking-widest hover:bg-yellow-500 transition-all duration-300 mt-2 focus:outline-none text-center shadow-lg transform ${mobileMenuOpen
                ? 'translate-x-0 opacity-100'
                : mobileSlide + ' opacity-0'
                }`}
              style={{
                transitionDelay: mobileMenuOpen ? '0.3s' : '0s',
                transitionDuration: '300ms'
              }}
              onClick={() => dispatch(closeMobileMenu())}
            >
              {t('nav.contact')}
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
