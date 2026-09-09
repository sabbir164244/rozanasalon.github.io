import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Service, ServiceCategory } from '../types';
import { Sparkles, Clock, Star, ArrowRight, Check, Award, Flame, Heart, X, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ServicesSectionProps {
  services: Service[];
  onSelectServiceToBook: (service: Service) => void;
  onOpenAdvisor?: () => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
  services,
  onSelectServiceToBook,
  onOpenAdvisor,
}) => {
  const { language, isRTL, t } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<ServiceCategory>('all');
  const [selectedModalService, setSelectedModalService] = useState<Service | null>(null);

  const categories: { id: ServiceCategory; label: string }[] = [
    { id: 'all', label: t('services.filterAll') },
    { id: 'facial', label: t('services.filterFacial') },
    { id: 'keratin', label: t('services.filterKeratin') },
    { id: 'haircut', label: t('services.filterHaircut') },
    { id: 'nails', label: t('services.filterNails') },
    { id: 'spa', label: t('services.filterSpa') },
  ];

  const filteredServices = activeCategory === 'all'
    ? services
    : services.filter(s => s.category === activeCategory);

  // Top-rated Signature Facial
  const signatureFacial = services.find(s => s.id === 'srv-facial-signature') || services[0];

  return (
    <section id="services" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#090807] overflow-hidden">
      {/* Background aesthetics */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/30 to-transparent" />
      <div className="absolute top-1/3 -right-20 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 -left-20 w-96 h-96 bg-[#AA771C]/4 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#18150E] border border-[#D4AF37]/30 text-[#E5C378] text-xs font-tajawal font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>{t('services.badge')}</span>
          </div>
          <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold text-[#F8F5EE] mb-4">
            {t('services.title')}
          </h2>
          <p className="font-tajawal text-sm sm:text-base text-[#A89F91]">
            {t('services.subtitle')}
          </p>
        </div>

        {/* ========================================================================= */}
        {/* 🌟 PROMINENT SPOTLIGHT: Signature Royal 24K Facial Treatment */}
        {/* ========================================================================= */}
        <div className="mb-20">
          <div className="relative rounded-3xl p-[1px] bg-gradient-to-r from-[#B88E3B] via-[#F5DCA0] to-[#997425] shadow-[0_0_35px_rgba(212,175,55,0.18)]">
            <div className="relative rounded-[23px] bg-[#12100C] p-6 sm:p-10 overflow-hidden">
              {/* Subtle watermark */}
              <div className="absolute -right-8 -bottom-8 opacity-5 pointer-events-none select-none">
                <Sparkles className="w-96 h-96 text-[#E5C378]" />
              </div>

              <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                {/* Left Column: Image with high-luxe framing */}
                <div className="lg:col-span-5 relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl border border-[#D4AF37]/30">
                  <img
                    src={signatureFacial.imageUrl || "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80"}
                    alt={signatureFacial.nameEn}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-[#0E0C09]/80 backdrop-blur-md border border-[#E5C378]/50 text-[#E5C378] text-xs font-tajawal font-bold flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 fill-[#E5C378]" />
                    <span>4.9 / 5.0 (164+ reviews)</span>
                  </div>
                </div>

                {/* Right Column: Treatment Details */}
                <div className="lg:col-span-7 flex flex-col items-start text-start">
                  <div className="flex flex-wrap items-center gap-2 mb-3">
                    <span className="px-3.5 py-1 rounded-full bg-[#E5C378] text-[#0E0C09] font-tajawal font-extrabold text-xs tracking-wide flex items-center gap-1 shadow-md">
                      <Flame className="w-3.5 h-3.5 fill-current" />
                      {language === 'ar' ? signatureFacial.badgeAr : signatureFacial.badgeEn}
                    </span>
                    <span className="px-3 py-1 rounded-full bg-[#1C1810] border border-[#D4AF37]/30 text-[#E5C378] text-xs font-mono font-bold flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {signatureFacial.durationMin} {t('services.min')}
                    </span>
                  </div>

                  <h3 className="font-playfair text-2xl sm:text-3xl md:text-4xl font-bold text-[#F8F5EE] mb-3">
                    {language === 'ar' ? signatureFacial.nameAr : signatureFacial.nameEn}
                  </h3>

                  <p className="font-tajawal text-sm sm:text-base text-[#B8AF9F] leading-relaxed mb-6">
                    {language === 'ar' ? signatureFacial.descriptionAr : signatureFacial.descriptionEn}
                  </p>

                  {/* Highlights */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mb-8 w-full">
                    {(language === 'ar' ? signatureFacial.benefitsAr : signatureFacial.benefitsEn)?.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs sm:text-sm text-[#DDD] font-tajawal">
                        <div className="w-4 h-4 rounded-full bg-[#241F14] border border-[#E5C378]/40 flex items-center justify-center text-[#E5C378] shrink-0">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>

                  {/* Price & Action Row */}
                  <div className="flex flex-wrap items-center justify-between gap-4 w-full pt-4 border-t border-white/10">
                    <div>
                      <span className="text-[11px] font-tajawal uppercase text-[#8C8477] block">
                        {language === 'ar' ? 'سعر الجلسة الشامل' : 'Complete Treatment Price'}
                      </span>
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-playfair text-3xl sm:text-4xl font-extrabold text-[#E5C378]">
                          {signatureFacial.priceSAR}
                        </span>
                        <span className="font-tajawal font-bold text-sm text-[#D2C8BA]">
                          {t('services.sar')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => setSelectedModalService(signatureFacial)}
                        className="px-5 py-3 rounded-full bg-[#1A1711] border border-[#D4AF37]/30 hover:border-[#D4AF37] text-[#D2C8BA] font-tajawal text-xs sm:text-sm transition-colors cursor-pointer"
                      >
                        {language === 'ar' ? 'بروتوكول الجلسة' : 'View Protocol'}
                      </button>

                      <button
                        id="book-signature-facial-btn"
                        onClick={() => onSelectServiceToBook(signatureFacial)}
                        className="luxe-gold-btn px-7 py-3 rounded-full font-tajawal font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-lg"
                      >
                        <Sparkles className="w-4 h-4" />
                        <span>{t('services.bookThis')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Navigation Pills */}
        <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-4 mb-12 no-scrollbar">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                id={`service-cat-${cat.id}`}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-tajawal font-medium whitespace-nowrap transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-[#E5C378] text-[#0E0C09] font-bold shadow-[0_0_20px_rgba(229,195,120,0.35)]'
                    : 'bg-[#15130E] text-[#A89F91] border border-[#D4AF37]/20 hover:border-[#D4AF37]/50 hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            );
          })}

          {onOpenAdvisor && (
            <button
              onClick={onOpenAdvisor}
              className="px-4 py-2.5 rounded-full text-xs sm:text-sm font-tajawal font-bold whitespace-nowrap transition-all duration-200 cursor-pointer bg-[#1D170D] border border-[#E5C378]/60 text-[#E5C378] hover:bg-[#2A2114] flex items-center gap-1.5 shadow-sm"
              title="Virtual Beauty Advisor Diagnostic"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#E5C378]" />
              <span>{language === 'ar' ? 'مستشارة الجمال الذكية' : 'Virtual Beauty Advisor'}</span>
            </button>
          )}
        </div>

        {/* Services Grid with Real Editorial Photography */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredServices.map((service) => {
            const isSignature = service.isSignature;
            return (
              <motion.div
                key={service.id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`group rounded-3xl overflow-hidden border flex flex-col justify-between transition-all duration-300 ${
                  isSignature
                    ? 'luxe-card border-[#E5C378]/40 shadow-[0_0_30px_rgba(229,195,120,0.15)]'
                    : 'bg-[#12100C] border-white/10 hover:border-[#D4AF37]/40 hover:shadow-2xl'
                }`}
              >
                {/* Photo & Badge header */}
                <div>
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={service.imageUrl || "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&auto=format&fit=crop&q=80"}
                      alt={service.nameEn}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#12100C] via-transparent to-black/40" />

                    <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                      <span className="text-[11px] font-tajawal uppercase px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-[#E5C378] border border-[#D4AF37]/30">
                        {service.category === 'facial' && (language === 'ar' ? 'عناية بالبشرة' : 'Facial Care')}
                        {service.category === 'keratin' && (language === 'ar' ? 'كيراتين وبروتين' : 'Keratin Treatment')}
                        {service.category === 'haircut' && (language === 'ar' ? 'قص وتصفيف' : 'Hair Atelier')}
                        {service.category === 'nails' && (language === 'ar' ? 'سبا وأظافر' : 'Hand & Feet Spa')}
                        {service.category === 'spa' && (language === 'ar' ? 'حمام مغربي' : 'Moroccan Hammam')}
                      </span>

                      <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-md text-xs font-mono font-bold text-[#E5C378] border border-[#D4AF37]/20">
                        <Star className="w-3 h-3 fill-[#E5C378]" />
                        <span>{service.rating}</span>
                      </div>
                    </div>

                    <div className="absolute bottom-3 left-4 right-4 flex items-center gap-2 text-xs font-tajawal text-[#DDD]">
                      <Clock className="w-3.5 h-3.5 text-[#E5C378]" />
                      <span>{service.durationMin} {t('services.min')}</span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-6 text-start">
                    <h3 className="font-playfair text-xl font-bold text-[#F8F5EE] mb-2 group-hover:text-[#E5C378] transition-colors">
                      {language === 'ar' ? service.nameAr : service.nameEn}
                    </h3>

                    <p className="font-tajawal text-xs text-[#A89F91] line-clamp-2 leading-relaxed mb-4">
                      {language === 'ar' ? service.descriptionAr : service.descriptionEn}
                    </p>

                    {/* Benefit highlights */}
                    <div className="space-y-1.5 mb-6">
                      {(language === 'ar' ? service.benefitsAr : service.benefitsEn)?.slice(0, 2).map((b, bIdx) => (
                        <div key={bIdx} className="flex items-center gap-2 text-[11px] font-tajawal text-[#CCC]">
                          <Check className="w-3 h-3 text-[#E5C378] shrink-0" />
                          <span className="truncate">{b}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Footer & CTA */}
                <div className="px-6 pb-6 pt-3 border-t border-white/5 flex items-center justify-between">
                  <div className="text-start">
                    <span className="text-[10px] font-tajawal text-[#8C8477] uppercase block">
                      {language === 'ar' ? 'السعر' : 'Price'}
                    </span>
                    <div className="flex items-baseline gap-1">
                      <span className="font-playfair text-2xl font-bold text-[#E5C378]">
                        {service.priceSAR}
                      </span>
                      <span className="font-tajawal font-bold text-xs text-[#999]">
                        {t('services.sar')}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedModalService(service)}
                      title={language === 'ar' ? 'التفاصيل' : 'Details'}
                      className="p-2.5 rounded-full bg-[#1A1711] text-[#A89F91] hover:text-white border border-white/10 transition-colors cursor-pointer text-xs font-tajawal"
                    >
                      {language === 'ar' ? 'التفاصيل' : 'Details'}
                    </button>

                    <button
                      id={`book-service-${service.id}`}
                      onClick={() => onSelectServiceToBook(service)}
                      className="luxe-gold-btn px-5 py-2.5 rounded-full text-xs font-tajawal font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <span>{language === 'ar' ? 'احجزي' : 'Book'}</span>
                      <ArrowRight className={`w-3.5 h-3.5 ${isRTL ? 'rotate-180' : ''}`} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Protocol Details Modal */}
      <AnimatePresence>
        {selectedModalService && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative w-full max-w-2xl bg-[#12100C] border border-[#D4AF37]/40 rounded-3xl p-6 sm:p-8 text-start shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#E5C378]" />
                  <span className="font-tajawal text-xs text-[#E5C378] font-bold uppercase tracking-wider">
                    {language === 'ar' ? 'بروتوكول العلاج المعتمد • صالون روزانة' : 'Official Clinical Protocol • Rozana Salon'}
                  </span>
                </div>
                <button
                  onClick={() => setSelectedModalService(null)}
                  className="p-2 rounded-full hover:bg-white/10 text-[#8C8477] hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h3 className="font-playfair text-2xl font-bold text-[#F8F5EE] mb-1">
                    {language === 'ar' ? selectedModalService.nameAr : selectedModalService.nameEn}
                  </h3>
                  <div className="flex items-center gap-3 text-xs font-tajawal text-[#8C8477]">
                    <span className="flex items-center gap-1 text-[#E5C378]">
                      <Clock className="w-3.5 h-3.5" />
                      {selectedModalService.durationMin} {t('services.min')}
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1 text-emerald-400">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {language === 'ar' ? 'تعقيم أوتوكلاف طبي' : 'Hospital Autoclave Sterile'}
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="font-playfair text-3xl font-bold text-[#E5C378]">
                    {selectedModalService.priceSAR} SAR
                  </span>
                </div>
              </div>

              <p className="font-tajawal text-sm text-[#A89F91] leading-relaxed mb-6">
                {language === 'ar' ? selectedModalService.descriptionAr : selectedModalService.descriptionEn}
              </p>

              {/* Protocol steps */}
              <div className="space-y-3 mb-8">
                <h4 className="font-tajawal font-bold text-xs text-[#E5C378] uppercase tracking-wider">
                  {language === 'ar' ? 'المزايا والخطوات العلاجية بالجلسة:' : 'Clinical Steps & Inclusions:'}
                </h4>
                {(language === 'ar' ? selectedModalService.benefitsAr : selectedModalService.benefitsEn)?.map((benefit, idx) => (
                  <div key={idx} className="p-3 rounded-xl bg-[#18150F] border border-white/5 flex items-start gap-3 text-xs font-tajawal text-[#DDD]">
                    <span className="w-5 h-5 rounded-full bg-[#262013] border border-[#D4AF37]/30 flex items-center justify-center text-[#E5C378] shrink-0 font-mono text-[10px]">
                      0{idx + 1}
                    </span>
                    <span className="leading-relaxed">{benefit}</span>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  onClick={() => setSelectedModalService(null)}
                  className="px-5 py-2.5 rounded-full text-xs font-tajawal text-[#8C8477] hover:text-white cursor-pointer"
                >
                  {language === 'ar' ? 'إغلاق' : 'Close'}
                </button>

                <button
                  onClick={() => {
                    const s = selectedModalService;
                    setSelectedModalService(null);
                    onSelectServiceToBook(s);
                  }}
                  className="luxe-gold-btn px-7 py-3 rounded-full text-xs sm:text-sm font-tajawal font-bold flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <span>{t('services.bookThis')}</span>
                  <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
