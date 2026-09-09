import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Sparkles, Calendar, ArrowRight, Star, Clock, MapPin, ShieldCheck, Compass } from 'lucide-react';
import { motion } from 'motion/react';

interface HeroProps {
  onBookNow: () => void;
  onExploreServices: () => void;
  onOpenAdvisor: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onBookNow,
  onExploreServices,
  onOpenAdvisor,
}) => {
  const { isRTL, t, language } = useLanguage();

  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden luxe-obsidian-bg px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      {/* Subtle architectural luxury ambient lights */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4AF37]/8 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-[#AA771C]/6 rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Haute Couture Hairline Framing */}
      <div className="absolute inset-x-8 top-8 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent pointer-events-none" />
      <div className="absolute inset-x-12 bottom-8 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/20 to-transparent pointer-events-none" />

      <div className="max-w-6xl mx-auto text-center relative z-10 flex flex-col items-center">
        {/* Branch & Operating Status Pill */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#18150F]/90 border border-[#D4AF37]/35 backdrop-blur-md shadow-sm mb-6 select-none"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs sm:text-sm font-tajawal font-medium text-[#E5C378] tracking-wide">
            {t('hero.branch')}
          </span>
          <span className="text-[#555] hidden sm:inline">•</span>
          <span className="text-xs sm:text-sm font-tajawal text-[#B8AF9F] hidden sm:inline">
            {language === 'ar' ? 'ساعات العمل اليوم: ١٢:٠٠ ظهراً – ١١:٠٠ مساءً' : 'Hours: 12:00 PM – 11:00 PM Daily'}
          </span>
        </motion.div>

        {/* Brand Main Heading - Editorial Haute-Couture Styling */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="relative mb-6 select-none max-w-4xl"
        >
          <div className="flex flex-col items-center">
            <span className="text-xs sm:text-sm tracking-[0.3em] text-[#C59D4A] uppercase font-cinzel font-semibold mb-3">
              Haute Beauty Atelier & Spa
            </span>

            <h1
              id="hero-title-en"
              className="font-playfair text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white mb-2"
            >
              ROZANA SALON
            </h1>

            <h2
              id="hero-title-ar"
              className="font-tajawal text-3xl sm:text-5xl md:text-6xl font-black gold-gradient-text tracking-normal pb-2"
            >
              صالون روزانة
            </h2>
          </div>
        </motion.div>

        {/* Editorial Subtitle & Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="font-cormorant text-xl sm:text-2xl md:text-3xl text-[#E8DEC8] font-normal tracking-wide max-w-3xl mb-4 italic"
        >
          {t('hero.tagline')}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="font-tajawal text-sm sm:text-base text-[#A89F91] max-w-2xl leading-relaxed mb-10"
        >
          {language === 'ar'
            ? 'ملاذ الجمال الراقي في حي الشميسي بالرياض. تجربة استثنائية متكاملة تجمع بين جلسات نضارة الذهب عيار 24، معالجات النانو كيراتين البرازيلية، والحمام المغربي الملكي في أجنحة خاصة تتسم بأقصى درجات الخصوصية والتعقيم الطبي.'
            : 'Riyadh’s premier beauty sanctuary in Al Shumaisi. An uncompromising journey of bespoke pampering featuring 24K pure gold facials, organic Brazilian nano-keratin restorations, and royal Moroccan hammam suites.'}
        </motion.p>

        {/* Action Buttons: Primary, Secondary, and Interactive Ritual Advisor */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-14"
        >
          {/* Primary Book CTA */}
          <button
            id="hero-btn-book"
            onClick={onBookNow}
            className="w-full sm:w-auto luxe-gold-btn px-8 py-4 rounded-full text-xs sm:text-sm font-tajawal font-bold flex items-center justify-center gap-2 group cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-[#0E0C09]" />
            <span>{t('hero.ctaBook')}</span>
            <ArrowRight className={`w-4 h-4 text-[#0E0C09] transition-transform group-hover:translate-x-1 ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
          </button>

          {/* Interactive Beauty Advisor Button */}
          <button
            id="hero-btn-advisor"
            onClick={onOpenAdvisor}
            className="w-full sm:w-auto px-6 py-4 rounded-full text-xs sm:text-sm font-tajawal font-semibold bg-[#1C1811] text-[#E5C378] border border-[#D4AF37]/40 hover:bg-[#282216] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <Compass className="w-4 h-4 text-[#E5C378]" />
            <span>{language === 'ar' ? 'مستشار الجمال الذكي (٣٠ ثانية)' : 'Find Your Ritual (Advisor)'}</span>
          </button>

          {/* Catalog Explore CTA */}
          <button
            id="hero-btn-services"
            onClick={onExploreServices}
            className="w-full sm:w-auto px-6 py-4 rounded-full text-xs sm:text-sm font-tajawal font-medium bg-transparent text-[#D2C8BA] border border-white/15 hover:border-white/40 hover:text-white transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{t('hero.ctaServices')}</span>
          </button>
        </motion.div>

        {/* High-Fashion Editorial Photo Mosaic Bar */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="w-full grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-14"
        >
          <div className="relative rounded-2xl overflow-hidden aspect-[4/3] border border-white/10 group">
            <img
              src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&auto=format&fit=crop&q=80"
              alt="24K Gold Hydra Facial"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-3 text-start">
              <span className="text-[11px] sm:text-xs font-tajawal font-bold text-[#E5C378]">
                {language === 'ar' ? 'علاج الذهب عيار 24' : '24K Gold Facial'}
              </span>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden aspect-[4/3] border border-white/10 group">
            <img
              src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80"
              alt="Brazilian Nano-Keratin Silk"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-3 text-start">
              <span className="text-[11px] sm:text-xs font-tajawal font-bold text-[#E5C378]">
                {language === 'ar' ? 'نانو كيراتين الحرير' : 'Nano-Keratin Silk'}
              </span>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden aspect-[4/3] border border-white/10 group">
            <img
              src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&auto=format&fit=crop&q=80"
              alt="Moroccan Hammam Suite"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-3 text-start">
              <span className="text-[11px] sm:text-xs font-tajawal font-bold text-[#E5C378]">
                {language === 'ar' ? 'الحمام المغربي الملكي' : 'Royal Hammam'}
              </span>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden aspect-[4/3] border border-white/10 group">
            <img
              src="https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=600&auto=format&fit=crop&q=80"
              alt="Golden Elixir Nails"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-3 text-start">
              <span className="text-[11px] sm:text-xs font-tajawal font-bold text-[#E5C378]">
                {language === 'ar' ? 'أظافر وبديكير الذهب' : 'Golden Elixir Nails'}
              </span>
            </div>
          </div>
        </motion.div>

        {/* Trust Badges & Clinical Proof Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="w-full grid grid-cols-1 sm:grid-cols-3 gap-3 p-4 rounded-2xl bg-[#110F0B] border border-[#D4AF37]/20"
        >
          <div className="flex items-center justify-center gap-3 py-1">
            <div className="w-8 h-8 rounded-full bg-[#201A10] border border-[#D4AF37]/40 flex items-center justify-center text-[#E5C378] font-bold text-xs">
              <Star className="w-4 h-4 fill-[#E5C378] text-[#E5C378]" />
            </div>
            <div className="text-start">
              <p className="text-xs font-tajawal font-bold text-[#F8F5EE]">
                {t('hero.statRating')}
              </p>
              <p className="text-[11px] font-tajawal text-[#8C8477]">
                {language === 'ar' ? 'أكثر من ٣٤٠ تقييم حقيقي وموثق' : '340+ Verified Reviews in Riyadh'}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 py-1 border-t sm:border-t-0 sm:border-x border-white/5">
            <div className="w-8 h-8 rounded-full bg-[#182012] border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-bold text-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="text-start">
              <p className="text-xs font-tajawal font-bold text-[#F8F5EE]">
                {language === 'ar' ? 'تعقيم طبي أوتوكلاف ١٠٠٪' : 'Hospital-Grade Autoclave Sterilization'}
              </p>
              <p className="text-[11px] font-tajawal text-[#8C8477]">
                {language === 'ar' ? 'أدوات معقمة تُفتح أمام الضيفة' : 'Pouch opened directly in front of you'}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3 py-1 border-t sm:border-t-0 border-white/5">
            <div className="w-8 h-8 rounded-full bg-[#201A10] border border-[#D4AF37]/40 flex items-center justify-center text-[#E5C378] font-bold text-xs">
              <Clock className="w-4 h-4 text-[#E5C378]" />
            </div>
            <div className="text-start">
              <p className="text-xs font-tajawal font-bold text-[#F8F5EE]">
                {language === 'ar' ? 'مواعيد دقيقة بدون انتظار' : 'Strict Zero-Wait Guarantee'}
              </p>
              <p className="text-[11px] font-tajawal text-[#8C8477]">
                {language === 'ar' ? 'حجز فوري وتأكيد مباشر' : 'Your chair is reserved instantly'}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
