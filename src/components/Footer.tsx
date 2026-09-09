import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Sparkles, MapPin, Phone, Clock, Instagram, MessageCircle, ShieldCheck } from 'lucide-react';

interface FooterProps {
  onNavigate: (sectionId: string) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenAdmin }) => {
  const { language, isRTL, t } = useLanguage();

  return (
    <footer className="bg-[#080706] border-t border-[#D4AF37]/20 pt-16 pb-12 px-4 sm:px-6 lg:px-8 text-start relative overflow-hidden">
      {/* Ambient background glow */}
      <div className="absolute bottom-0 right-1/2 translate-x-1/2 w-[500px] h-32 bg-[#D4AF37]/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-white/10">
          {/* Brand Info (5 cols) */}
          <div className="lg:col-span-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-[#18150E] border border-[#D4AF37]/50 flex items-center justify-center shadow-[0_0_12px_rgba(229,195,120,0.2)]">
                <Sparkles className="w-4 h-4 text-[#E5C378]" />
              </div>
              <div>
                <span className="font-playfair text-xl font-bold text-white block">
                  ROZANA SALON
                </span>
                <span className="font-tajawal text-base font-black gold-gradient-text">
                  صالون روزانة
                </span>
              </div>
            </div>

            <p className="font-tajawal text-xs sm:text-sm text-[#A89F91] leading-relaxed max-w-sm mb-6">
              {language === 'ar'
                ? 'ملاذ الجمال الراقي والعناية الملكية بالبشرة والشعر في حي الشميسي، الرياض. معالجات نانو كيراتين معتمدة وتدليك هيدرا للوجه بالذهب عيار ٢٤ قيراط في أجنحة معقمة كلياً.'
                : 'Premier luxury hair care, royal 24K gold facial aesthetics, and restorative Moroccan spa sanctuary located in Al Shumaisi, Riyadh.'}
            </p>

            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#15120D] border border-white/10 hover:border-[#D4AF37] text-[#E5C378] flex items-center justify-center transition-colors"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://wa.me/966508821245"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-[#15120D] border border-white/10 hover:border-[#D4AF37] text-[#E5C378] flex items-center justify-center transition-colors"
                title="WhatsApp Concierge"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links (3 cols) */}
          <div className="lg:col-span-3">
            <h4 className="font-playfair text-xs font-bold uppercase tracking-wider text-[#E5C378] mb-4">
              {language === 'ar' ? 'أقسام الموقع' : 'Navigation'}
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm font-tajawal text-[#B8AF9F]">
              <li>
                <button onClick={() => onNavigate('hero')} className="hover:text-white transition-colors cursor-pointer">
                  {t('nav.home')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('services')} className="hover:text-white transition-colors cursor-pointer">
                  {t('nav.services')}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('packages')} className="hover:text-white transition-colors cursor-pointer">
                  {language === 'ar' ? 'باقات كبار الشخصيات والعرائس' : 'VIP Bridal Packages'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('suites')} className="hover:text-white transition-colors cursor-pointer">
                  {language === 'ar' ? 'الأجنحة الخاصة بالصالون' : 'Treatment Suites'}
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('booking')} className="hover:text-white transition-colors cursor-pointer">
                  {t('nav.booking')}
                </button>
              </li>
            </ul>
          </div>

          {/* Branch Contact Details (4 cols) */}
          <div className="lg:col-span-4">
            <h4 className="font-playfair text-xs font-bold uppercase tracking-wider text-[#E5C378] mb-4">
              {language === 'ar' ? 'بيانات الفرع والحجز' : 'Sanctuary Address'}
            </h4>
            <div className="space-y-3 text-xs sm:text-sm font-tajawal text-[#B8AF9F]">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#E5C378] shrink-0 mt-0.5" />
                <span>{t('hero.branch')}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-[#E5C378] shrink-0" />
                <span>
                  {language === 'ar'
                    ? 'يومياً: ١٢:٠٠ ظهراً حتى ١١:٠٠ مساءً'
                    : '12:00 PM – 11:00 PM Daily'}
                </span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#E5C378] shrink-0" />
                <a href="tel:+966508821245" className="font-mono hover:text-[#E5C378] transition-colors">
                  +966 50 882 1245
                </a>
              </div>
              <div className="flex items-center gap-2.5 pt-2 text-[11px] text-emerald-400">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{language === 'ar' ? 'مرخص رسمياً من وزارة التجارة والبلدية' : 'Municipality & MOH Compliant'}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright & Admin Portal Trigger */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-tajawal text-[#777]">
          <p>
            © {new Date().getFullYear()} {language === 'ar' ? 'صالون روزانة (فرع الشميسي). جميع الحقوق محفوظة.' : 'Rozana Salon (Al Shumaisi Branch). All Rights Reserved.'}
          </p>

          <button
            onClick={onOpenAdmin}
            className="text-[11px] text-[#8C8477] hover:text-[#E5C378] transition-colors flex items-center gap-1 cursor-pointer"
          >
            <span>{language === 'ar' ? 'بوابة إدارة الصالون (كود PIN)' : 'Staff & Admin Portal (PIN)'}</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
