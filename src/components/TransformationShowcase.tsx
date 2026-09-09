import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { TRANSFORMATIONS, TransformationItem } from '../data/mockData';
import { Sparkles, ArrowRight, ShieldCheck, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TransformationShowcaseProps {
  onSelectServiceToBook: (serviceId: string) => void;
}

export const TransformationShowcase: React.FC<TransformationShowcaseProps> = ({
  onSelectServiceToBook,
}) => {
  const { language, isRTL } = useLanguage();
  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const [sliderPosition, setSliderPosition] = useState(50); // percentage 0 to 100
  const [isDragging, setIsDragging] = useState(false);

  const currentItem = TRANSFORMATIONS[activeItemIndex] || TRANSFORMATIONS[0];

  const handleSliderMove = (clientX: number, rect: DOMRect) => {
    let position = ((clientX - rect.left) / rect.width) * 100;
    if (position < 5) position = 5;
    if (position > 95) position = 95;
    setSliderPosition(position);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    handleSliderMove(e.clientX, rect);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    if (e.touches[0]) {
      handleSliderMove(e.touches[0].clientX, rect);
    }
  };

  return (
    <section className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#090807] overflow-hidden border-t border-[#D4AF37]/15">
      {/* Ambient lighting */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#18150E] border border-[#D4AF37]/30 text-[#E5C378] text-xs font-tajawal font-medium mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#E5C378]" />
            <span>{language === 'ar' ? 'نتائج واقعية ومثبتة سريرياً' : 'Verified Clinical Transformations'}</span>
          </div>
          <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold text-[#F8F5EE] mb-4">
            {language === 'ar' ? 'شاهدوا الفارق الحقيقي قبل وبعد' : 'Before & After Transformations'}
          </h2>
          <p className="font-tajawal text-sm sm:text-base text-[#A89F91]">
            {language === 'ar'
              ? 'اسحبي المؤشر التفاعلي لمشاهدة الانسيابية الحريرية للشعر ونضارة الذهب عيار 24 الفورية على عميلاتنا في فرع الشميسي.'
              : 'Slide the interactive bar to witness the real-world silk finish and 24K gold luminescence on our Al Shumaisi guests.'}
          </p>

          {/* Transformation Switcher Tabs */}
          <div className="flex items-center justify-center gap-3 mt-8">
            {TRANSFORMATIONS.map((item, idx) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveItemIndex(idx);
                  setSliderPosition(50);
                }}
                className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                  activeItemIndex === idx
                    ? 'bg-[#E5C378] text-[#0E0C09] font-bold shadow-[0_0_20px_rgba(229,195,120,0.35)]'
                    : 'bg-[#15130E] text-[#B8AF9F] border border-[#D4AF37]/20 hover:border-[#D4AF37]/50'
                }`}
              >
                {language === 'ar' ? item.titleAr : item.titleEn}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Comparison Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Visual Slider (7 cols) */}
          <div className="lg:col-span-7">
            <div
              className="relative w-full aspect-[4/3] sm:aspect-[16/10] rounded-2xl overflow-hidden cursor-ew-resize select-none border border-[#D4AF37]/25 shadow-2xl bg-[#111]"
              onMouseDown={() => setIsDragging(true)}
              onMouseUp={() => setIsDragging(false)}
              onMouseLeave={() => setIsDragging(false)}
              onMouseMove={handleMouseMove}
              onTouchMove={handleTouchMove}
              onTouchStart={() => setIsDragging(true)}
              onTouchEnd={() => setIsDragging(false)}
            >
              {/* After Image (Background) */}
              <img
                src={currentItem.afterImage}
                alt="After Transformation"
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* After Badge */}
              <div className="absolute top-4 right-4 z-10 px-3.5 py-1.5 rounded-full bg-[#0E0C09]/80 backdrop-blur-md border border-[#E5C378]/50 text-[#E5C378] font-tajawal text-xs font-bold shadow-lg">
                {language === 'ar' ? '✨ بعد الجلسة' : '✨ After Treatment'}
              </div>

              {/* Before Image (Clipped Overlay) */}
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${sliderPosition}%` }}
              >
                <img
                  src={currentItem.beforeImage}
                  alt="Before Transformation"
                  className="absolute inset-0 w-full h-full object-cover max-w-none"
                  style={{ width: '100%', height: '100%' }}
                />
                {/* Before Badge */}
                <div className="absolute top-4 left-4 z-10 px-3.5 py-1.5 rounded-full bg-[#0E0C09]/80 backdrop-blur-md border border-white/20 text-[#D8D2C4] font-tajawal text-xs font-medium shadow-lg">
                  {language === 'ar' ? 'قبل الجلسة' : 'Before Treatment'}
                </div>
              </div>

              {/* Interactive Divider Line & Handle */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-[#E5C378] shadow-[0_0_15px_rgba(229,195,120,0.8)] pointer-events-none"
                style={{ left: `${sliderPosition}%` }}
              >
                <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-[#0E0C09] border-2 border-[#E5C378] flex items-center justify-center text-[#E5C378] shadow-xl text-xs font-mono font-bold">
                  ↔
                </div>
              </div>

              {/* Subtitle helper */}
              <div className="absolute bottom-3 inset-x-0 flex justify-center pointer-events-none">
                <span className="px-3 py-1 rounded-full bg-black/70 backdrop-blur-md text-[#B8AF9F] text-[11px] font-tajawal">
                  {language === 'ar' ? 'اسحبي المؤشر يميناً ويساراً للمقارنة' : 'Drag slider left / right to compare'}
                </span>
              </div>
            </div>
          </div>

          {/* Details & Action Dossier (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-start text-start space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#1C180F] border border-[#D4AF37]/30 text-[#E5C378] text-xs font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>{language === 'ar' ? currentItem.categoryAr : currentItem.categoryEn}</span>
            </div>

            <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-[#F8F5EE]">
              {language === 'ar' ? currentItem.titleAr : currentItem.titleEn}
            </h3>

            <p className="font-tajawal text-sm sm:text-base text-[#A89F91] leading-relaxed">
              {language === 'ar' ? currentItem.descriptionAr : currentItem.descriptionEn}
            </p>

            {/* Before vs After Callouts */}
            <div className="w-full space-y-3 pt-2">
              <div className="p-3.5 rounded-xl bg-[#14120D] border border-white/5 flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-rose-400 mt-2 shrink-0" />
                <div className="text-xs font-tajawal text-[#B5ABA0]">
                  <strong className="text-white block font-medium">
                    {language === 'ar' ? 'الحالة قبل الجلسة:' : 'Prior Condition:'}
                  </strong>
                  {language === 'ar' ? currentItem.beforeLabelAr : currentItem.beforeLabelEn}
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#1A160D] border border-[#D4AF37]/30 flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-[#E5C378] mt-2 shrink-0 animate-pulse" />
                <div className="text-xs font-tajawal text-[#E5C378]">
                  <strong className="text-[#FFF5DC] block font-bold">
                    {language === 'ar' ? 'النتيجة الموثقة بعد الجلسة:' : 'Verified Outcome:'}
                  </strong>
                  {language === 'ar' ? currentItem.afterLabelAr : currentItem.afterLabelEn}
                </div>
              </div>
            </div>

            {/* Specialist Attribution */}
            <div className="flex items-center gap-3 pt-2">
              <div className="w-10 h-10 rounded-full bg-[#241F14] border border-[#D4AF37]/40 flex items-center justify-center text-[#E5C378] font-bold text-xs">
                ★
              </div>
              <div>
                <p className="text-xs font-tajawal text-[#8C8477]">
                  {language === 'ar' ? 'الخبيرة المنفذة للعلاج:' : 'Master Specialist:'}
                </p>
                <p className="text-sm font-tajawal font-bold text-[#F8F5EE]">
                  {language === 'ar' ? currentItem.specialistAr : currentItem.specialistEn}
                </p>
              </div>
            </div>

            {/* Direct Booking Trigger */}
            <button
              id={`book-transformation-${currentItem.id}`}
              onClick={() => onSelectServiceToBook(currentItem.serviceId)}
              className="w-full sm:w-auto luxe-gold-btn px-8 py-3.5 rounded-full text-xs sm:text-sm font-tajawal font-bold flex items-center justify-center gap-2 group cursor-pointer"
            >
              <span>{language === 'ar' ? 'احجزي هذه النتيجة الفورية الآن' : 'Book This Exact Result'}</span>
              <ArrowRight className={`w-4 h-4 transition-transform group-hover:translate-x-1 ${isRTL ? 'rotate-180 group-hover:-translate-x-1' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
