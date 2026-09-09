import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { SALON_SUITES, SalonSuite } from '../data/mockData';
import { Sparkles, Shield, Check, Eye, Coffee } from 'lucide-react';

interface SuitesShowcaseProps {
  onBookSuite: () => void;
}

export const SuitesShowcase: React.FC<SuitesShowcaseProps> = ({ onBookSuite }) => {
  const { language, isRTL } = useLanguage();
  const [selectedSuite, setSelectedSuite] = useState<SalonSuite>(SALON_SUITES[0]);

  return (
    <section id="suites" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#0B0A08] overflow-hidden border-t border-[#D4AF37]/15">
      {/* Subtle architectural ambient light */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1A1710] border border-[#D4AF37]/30 text-[#E5C378] text-xs font-tajawal font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#E5C378]" />
            <span>{language === 'ar' ? 'أجنحة خاصة معزولة كلياً' : 'Private VIP Suites • Al Shumaisi'}</span>
          </div>
          <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold text-[#F8F5EE] mb-4">
            {language === 'ar' ? 'استكشفي أجنحة صالون روزانة الفاخرة' : 'Tour Our Private Treatment Suites'}
          </h2>
          <p className="font-tajawal text-sm sm:text-base text-[#A89F91]">
            {language === 'ar'
              ? 'صممت أجنحتنا في فرع الشميسي بأعلى معايير الخصوصية والعزل الصوتي، مع تجهيزات طبية مخصصة وضيافة ملكية تليق بكِ.'
              : 'Every suite at our Al Shumaisi sanctuary is architecturally crafted for acoustical privacy, hospital-grade sterilization, and royal pampering.'}
          </p>
        </div>

        {/* Interactive Suite Selector Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
          {SALON_SUITES.map((suite) => {
            const isSelected = selectedSuite.id === suite.id;
            return (
              <button
                key={suite.id}
                onClick={() => setSelectedSuite(suite)}
                className={`p-4 rounded-2xl border text-start transition-all duration-300 cursor-pointer ${
                  isSelected
                    ? 'bg-[#1E1911] border-[#E5C378] shadow-[0_0_20px_rgba(229,195,120,0.25)]'
                    : 'bg-[#12100C] border-white/5 hover:border-[#D4AF37]/30'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono text-[#E5C378]">
                    0{SALON_SUITES.indexOf(suite) + 1}
                  </span>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-[#E5C378] animate-pulse" />
                  )}
                </div>
                <h4 className="font-playfair font-bold text-sm sm:text-base text-[#F8F5EE] mb-1">
                  {language === 'ar' ? suite.nameAr : suite.nameEn}
                </h4>
                <p className="font-tajawal text-[11px] text-[#8C8477] truncate">
                  {language === 'ar' ? suite.titleAr : suite.titleEn}
                </p>
              </button>
            );
          })}
        </div>

        {/* Selected Suite Detailed Presentation Card */}
        <div className="luxe-card rounded-3xl p-6 sm:p-10 border border-[#D4AF37]/30 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Image (7 cols) */}
            <div className="lg:col-span-7 relative aspect-[16/10] rounded-2xl overflow-hidden shadow-2xl border border-white/10 group">
              <img
                src={selectedSuite.imageUrl}
                alt={selectedSuite.nameEn}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <div className="px-3.5 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-[#E5C378]/40 text-[#E5C378] text-xs font-tajawal flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{language === 'ar' ? 'خصوصية 100% وغرفة معقمة' : '100% Secluded & Autoclave Sterile'}</span>
                </div>
                <div className="px-3 py-1 rounded-full bg-[#0E0C09]/80 backdrop-blur-md text-xs font-tajawal text-[#DDD]">
                  Al Shumaisi VIP Suite
                </div>
              </div>
            </div>

            {/* Description & Features (5 cols) */}
            <div className="lg:col-span-5 flex flex-col items-start text-start space-y-5">
              <div>
                <span className="text-xs font-mono text-[#E5C378] tracking-widest uppercase">
                  {language === 'ar' ? selectedSuite.titleAr : selectedSuite.titleEn}
                </span>
                <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-[#F8F5EE] mt-1">
                  {language === 'ar' ? selectedSuite.nameAr : selectedSuite.nameEn}
                </h3>
              </div>

              <p className="font-tajawal text-sm text-[#A89F91] leading-relaxed">
                {language === 'ar' ? selectedSuite.descriptionAr : selectedSuite.descriptionEn}
              </p>

              {/* Amenities checklist */}
              <div className="space-y-2.5 w-full pt-1">
                {(language === 'ar' ? selectedSuite.featuresAr : selectedSuite.featuresEn).map(
                  (feature, fIdx) => (
                    <div key={fIdx} className="flex items-center gap-2.5 text-xs font-tajawal text-[#DDD]">
                      <div className="w-4 h-4 rounded-full bg-[#241F14] border border-[#E5C378]/40 flex items-center justify-center text-[#E5C378] shrink-0">
                        <Check className="w-2.5 h-2.5 stroke-[3]" />
                      </div>
                      <span>{feature}</span>
                    </div>
                  )
                )}
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center gap-4 w-full">
                <button
                  onClick={onBookSuite}
                  className="w-full sm:w-auto luxe-gold-btn px-8 py-3 rounded-full text-xs sm:text-sm font-tajawal font-bold cursor-pointer"
                >
                  {language === 'ar' ? 'حجز جلسة في هذا الجناح' : 'Reserve Suite Experience'}
                </button>
                <div className="flex items-center gap-2 text-xs font-tajawal text-[#8C8477]">
                  <Coffee className="w-4 h-4 text-[#E5C378]" />
                  <span>{language === 'ar' ? 'يشمل ضيافة القهوة السعودية' : 'Complimentary Saudi Qahwa'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
