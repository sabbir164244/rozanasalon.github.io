import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { VIP_PACKAGES, VipPackage } from '../data/mockData';
import { Sparkles, Check, Clock, ArrowRight, Heart } from 'lucide-react';

interface BridalPackagesProps {
  onSelectPackageToBook: (pkg: VipPackage) => void;
}

export const BridalPackages: React.FC<BridalPackagesProps> = ({
  onSelectPackageToBook,
}) => {
  const { language, isRTL } = useLanguage();

  return (
    <section id="packages" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#0E0C09] overflow-hidden border-t border-[#D4AF37]/15">
      {/* Ambient background glow */}
      <div className="absolute top-1/3 left-10 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1C1810] border border-[#D4AF37]/30 text-[#E5C378] text-xs font-tajawal font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#E5C378]" />
            <span>{language === 'ar' ? 'باقات حصرية لكبار الشخصيات والعرائس' : 'Exclusive VIP & Bridal Sanctum'}</span>
          </div>
          <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold text-[#F8F5EE] mb-4">
            {language === 'ar' ? 'باقات الدلال الملكي المتكاملة' : 'Signature VIP Packages'}
          </h2>
          <p className="font-tajawal text-sm sm:text-base text-[#A89F91]">
            {language === 'ar'
              ? 'برامج علاجية مجمعة بعناية تمنحك تجربة العناية الشاملة بأفضل الأسعار وأرقى معايير الضيافة والخصوصية.'
              : 'Holistic luxury multi-treatment bundles designed for brides, milestone galas, and transcendent self-care in Riyadh.'}
          </p>
        </div>

        {/* 3-Column Luxury Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {VIP_PACKAGES.map((pkg) => {
            const savingsSAR = pkg.originalPriceSAR - pkg.priceSAR;
            return (
              <div
                key={pkg.id}
                className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all duration-300 ${
                  pkg.popular
                    ? 'luxe-card border-[#E5C378]/50 shadow-[0_0_40px_rgba(229,195,120,0.18)]'
                    : 'bg-[#14120D] border border-white/10 hover:border-[#D4AF37]/30'
                }`}
              >
                {/* Popular ribbon */}
                {pkg.popular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#C59D4A] via-[#F5DCA0] to-[#B88E3B] text-[#0E0C09] text-[11px] font-tajawal font-black uppercase tracking-wider shadow-lg">
                    {language === 'ar' ? '⭐ الباقة الأكثر طلباً للعرائس' : '⭐ Most Popular Bridal Package'}
                  </div>
                )}

                <div>
                  {/* Image banner */}
                  <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-6 border border-white/10">
                    <img
                      src={pkg.imageUrl}
                      alt={pkg.titleEn}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[#E5C378] font-tajawal text-xs font-bold border border-[#D4AF37]/30">
                      {language === 'ar' ? pkg.badgeAr : pkg.badgeEn}
                    </div>
                  </div>

                  {/* Title & Tagline */}
                  <div className="text-start mb-5">
                    <h3 className="font-playfair text-xl sm:text-2xl font-bold text-[#F8F5EE] mb-2">
                      {language === 'ar' ? pkg.titleAr : pkg.titleEn}
                    </h3>
                    <p className="font-tajawal text-xs text-[#A89F91]">
                      {language === 'ar' ? pkg.taglineAr : pkg.taglineEn}
                    </p>
                  </div>

                  {/* Pricing Box */}
                  <div className="p-4 rounded-2xl bg-[#0B0907] border border-white/5 mb-6 text-start flex items-baseline justify-between">
                    <div>
                      <span className="font-playfair text-2xl sm:text-3xl font-bold text-[#E5C378]">
                        {pkg.priceSAR} SAR
                      </span>
                      <span className="text-xs text-[#777] line-through ml-2 mr-2">
                        {pkg.originalPriceSAR} SAR
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/30 text-emerald-400 font-mono text-[11px] font-bold">
                        {language === 'ar' ? `وفري ${savingsSAR} ر.س` : `Save ${savingsSAR} SAR`}
                      </span>
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="flex items-center gap-2 text-xs font-tajawal text-[#8C8477] mb-5 text-start">
                    <Clock className="w-4 h-4 text-[#E5C378]" />
                    <span>
                      {language === 'ar'
                        ? `المدة التقريبية: ${Math.floor(pkg.durationMin / 60)} ساعات ${pkg.durationMin % 60 ? (pkg.durationMin % 60) + ' دقيقة' : ''}`
                        : `Estimated Duration: ${Math.floor(pkg.durationMin / 60)}h ${pkg.durationMin % 60 ? (pkg.durationMin % 60) + 'm' : ''}`}
                    </span>
                  </div>

                  {/* Included Services Checklist */}
                  <div className="space-y-2.5 mb-8 text-start">
                    {(language === 'ar' ? pkg.servicesIncludedAr : pkg.servicesIncludedEn).map(
                      (serviceName, sIdx) => (
                        <div key={sIdx} className="flex items-start gap-2.5 text-xs font-tajawal text-[#D2C8BA]">
                          <div className="w-4 h-4 rounded-full bg-[#201A10] border border-[#D4AF37]/30 flex items-center justify-center text-[#E5C378] shrink-0 mt-0.5">
                            <Check className="w-2.5 h-2.5 stroke-[3]" />
                          </div>
                          <span>{serviceName}</span>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {/* Booking Trigger */}
                <button
                  id={`book-vip-pkg-${pkg.id}`}
                  onClick={() => onSelectPackageToBook(pkg)}
                  className={`w-full py-3.5 rounded-full text-xs sm:text-sm font-tajawal font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                    pkg.popular
                      ? 'luxe-gold-btn shadow-lg'
                      : 'bg-[#1F1A12] border border-[#D4AF37]/40 text-[#E5C378] hover:bg-[#2A2318]'
                  }`}
                >
                  <span>{language === 'ar' ? 'حجز هذه الباقة الملكية' : 'Reserve This VIP Package'}</span>
                  <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
