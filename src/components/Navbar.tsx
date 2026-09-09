import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Sparkles, Menu, X, Globe, Shield, Calendar, Phone, MapPin } from 'lucide-react';
import { SpaAudioToggle } from './SpaAudioToggle';

interface NavbarProps {
  onNavigate: (sectionId: string) => void;
  activeSection: string;
  onOpenAdmin: () => void;
  isAdminView: boolean;
  onExitAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigate,
  activeSection,
  onOpenAdmin,
  isAdminView,
  onExitAdmin,
}) => {
  const { language, setLanguage, isRTL, t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'ar' : 'en');
  };

  const navItems = [
    { id: 'hero', label: t('nav.home') },
    { id: 'services', label: t('nav.services') },
    { id: 'packages', label: language === 'ar' ? 'باقات العرائس' : 'VIP Bundles' },
    { id: 'suites', label: language === 'ar' ? 'الأجنحة الخاصة' : 'VIP Suites' },
    { id: 'booking', label: t('nav.booking') },
    { id: 'reviews', label: t('nav.reviews') },
    { id: 'location', label: t('nav.location') },
  ];

  const handleNavClick = (id: string) => {
    if (isAdminView) {
      onExitAdmin();
    }
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#0E0C09]/95 border-b border-[#D4AF37]/20 transition-all duration-300">
      {/* Top micro bar for branch details & ambient sound */}
      <div className="bg-[#15120C] text-[#C59D4A] text-xs py-1.5 px-4 border-b border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2 mx-auto sm:mx-0">
          <MapPin className="w-3.5 h-3.5 text-[#E5C378]" />
          <span className="font-tajawal">{t('hero.branch')}</span>
          <span className="text-[#555] hidden sm:inline">•</span>
          <span className="hidden sm:inline font-tajawal text-[#A89F91]">
            {language === 'ar' ? 'ساعات العمل اليومية: ١٢:٠٠ ظهراً – ١١:٠٠ مساءً' : 'Hours: 12:00 PM – 11:00 PM Daily'}
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-4 text-xs font-tajawal text-[#E5C378]">
          <SpaAudioToggle />
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            {language === 'ar' ? 'مفتوح الآن لاستقبالكم' : 'Open Now in Al Shumaisi'}
          </span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Haute Couture Brand Signboard */}
          <div 
            id="brand-logo"
            onClick={() => handleNavClick('hero')}
            className="flex items-center gap-3 cursor-pointer group select-none"
          >
            <div className="relative w-10 h-10 rounded-full bg-gradient-to-tr from-[#1E1911] to-[#2E2415] border border-[#D4AF37]/50 flex items-center justify-center shadow-[0_0_15px_rgba(229,195,120,0.2)] group-hover:shadow-[0_0_25px_rgba(229,195,120,0.4)] transition-all duration-300">
              <Sparkles className="w-4 h-4 text-[#E5C378] group-hover:rotate-12 transition-transform duration-300" />
            </div>
            <div className="flex flex-col text-start">
              <div className="flex items-baseline gap-2">
                <span className="font-playfair text-xl font-bold tracking-wider text-white group-hover:text-[#E5C378] transition-colors">
                  ROZANA
                </span>
                <span className="font-tajawal text-lg font-black gold-gradient-text">
                  صالون روزانة
                </span>
              </div>
              <span className="text-[10px] tracking-widest text-[#8C8477] uppercase font-cinzel">
                Al Shumaisi • Haute Beauty & Spa
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          {!isAdminView && (
            <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
              {navItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    id={`nav-link-${item.id}`}
                    onClick={() => handleNavClick(item.id)}
                    className={`px-3.5 py-2 text-xs xl:text-sm font-medium rounded-full transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-[#1F1A11] text-[#E5C378] font-bold border border-[#D4AF37]/40 shadow-sm'
                        : 'text-[#A89F91] hover:text-[#F8F5EE] hover:bg-white/5'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </nav>
          )}

          {/* Right Action Icons & Direct Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Language Switcher */}
            <button
              id="nav-lang-toggle"
              onClick={toggleLanguage}
              className="px-3 py-1.5 rounded-full bg-[#18150F] border border-[#D4AF37]/30 hover:border-[#D4AF37] text-xs font-tajawal font-medium text-[#E5C378] flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
              title="Toggle English / العربية"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{language === 'en' ? 'العربية' : 'English'}</span>
            </button>

            {/* Admin Switcher */}
            {!isAdminView ? (
              <button
                id="nav-admin-btn"
                onClick={onOpenAdmin}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#18150F] border border-white/10 hover:border-[#D4AF37]/40 text-xs font-tajawal text-[#8C8477] hover:text-white transition-all cursor-pointer"
                title={t('nav.admin')}
              >
                <Shield className="w-3.5 h-3.5 text-[#E5C378]" />
                <span>{t('nav.admin')}</span>
              </button>
            ) : (
              <button
                id="nav-exit-admin-btn"
                onClick={onExitAdmin}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-rose-950/60 border border-rose-500/40 text-xs font-tajawal text-rose-200 hover:bg-rose-900/60 transition-all cursor-pointer"
              >
                <span>{t('nav.exitAdmin')}</span>
              </button>
            )}

            {/* Fast Call Button */}
            <a
              href="tel:+966508821245"
              id="nav-call-btn"
              className="hidden xl:flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#18150F] border border-[#D4AF37]/30 text-xs font-tajawal text-[#D2C8BA] hover:text-white hover:border-[#D4AF37] transition-all"
            >
              <Phone className="w-3.5 h-3.5 text-[#E5C378]" />
              <span className="font-mono">050 882 1245</span>
            </a>

            {/* Book Now Primary Button */}
            {!isAdminView && (
              <button
                id="nav-book-now-btn"
                onClick={() => handleNavClick('booking')}
                className="luxe-gold-btn hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full font-tajawal font-bold text-xs tracking-wide cursor-pointer shadow-md"
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>{t('nav.bookNow')}</span>
              </button>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              id="nav-mobile-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-xl bg-[#18150F] border border-white/10 text-[#DDD] hover:text-white transition-colors cursor-pointer"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0F0D0A] border-b border-[#D4AF37]/30 px-4 pt-3 pb-6 animate-in slide-in-from-top duration-200">
          <div className="flex flex-col space-y-2 mb-4">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-4 py-3 rounded-xl text-start font-tajawal text-sm transition-all ${
                    isActive
                      ? 'bg-[#221B11] text-[#E5C378] font-bold border border-[#D4AF37]/40'
                      : 'text-[#B8AF9F] hover:bg-white/5 hover:text-white'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-white/10 flex flex-col gap-3">
            <div className="flex items-center justify-between px-2">
              <SpaAudioToggle />
              <button
                onClick={() => {
                  if (isAdminView) onExitAdmin();
                  else onOpenAdmin();
                  setMobileMenuOpen(false);
                }}
                className="flex items-center gap-1.5 text-xs font-tajawal text-[#8C8477]"
              >
                <Shield className="w-3.5 h-3.5 text-[#E5C378]" />
                <span>{isAdminView ? t('nav.exitAdmin') : t('nav.admin')}</span>
              </button>
            </div>

            <button
              onClick={() => handleNavClick('booking')}
              className="w-full luxe-gold-btn py-3 rounded-full font-tajawal font-bold text-sm text-center flex items-center justify-center gap-2"
            >
              <Calendar className="w-4 h-4" />
              <span>{t('nav.bookNow')}</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
