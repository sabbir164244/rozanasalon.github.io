import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Sparkles, X, Check, ArrowRight, ShieldCheck, Clock, User, Heart } from 'lucide-react';
import { Service } from '../types';

interface BeautyAdvisorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectServiceAndBook: (serviceId: string) => void;
  services: Service[];
}

export const BeautyAdvisorModal: React.FC<BeautyAdvisorModalProps> = ({
  isOpen,
  onClose,
  onSelectServiceAndBook,
  services,
}) => {
  const { language, isRTL } = useLanguage();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedGoal, setSelectedGoal] = useState<string>('hair');
  const [selectedOccasion, setSelectedOccasion] = useState<string>('event');

  if (!isOpen) return null;

  const goals = [
    {
      id: 'hair',
      icon: '✨',
      titleEn: 'Silky Frizz-Free Hair & Keratin',
      titleAr: 'شعر حريري وانسيابي بدون نفشة (كيراتين)',
      descEn: 'Eliminate humidity frizz, repair bleached porosity, mirror shine',
      descAr: 'القضاء على نفشة الرطوبة، علاج التقصف والصبغة، لمعان زجاجي',
      recommendedServiceId: 'srv-keratin-brazilian',
    },
    {
      id: 'facial',
      icon: '🌟',
      titleEn: 'Red-Carpet 24K Glass Skin Glow',
      titleAr: 'نضارة وبشرة زجاجية فورية بالذهب عيار 24',
      descEn: 'Deep hydra pore cleansing, ultrasound firming, 24K gold serum',
      descAr: 'تنظيف مسام هيدرا عميق، شد بالموجات الدقيقة، سيروم الذهب النقي',
      recommendedServiceId: 'srv-facial-signature',
    },
    {
      id: 'spa',
      icon: '🛁',
      titleEn: 'Royal Moroccan Hammam Body Detox',
      titleAr: 'حمام مغربي ملكي استرخائي للجسم',
      descEn: 'Authentic private steam chamber, black olive soap, Kessa scrub',
      descAr: 'غرفة بخار خاصة، صابون الغار وزيت الزيتون، تقشير بالليفة الأصلية',
      recommendedServiceId: 'srv-spa-moroccan',
    },
    {
      id: 'nails',
      icon: '💅',
      titleEn: 'Haute Nail Extensions & Golden Pedicure',
      titleAr: 'أظافر جل روسي راقية وبديكير الذهب',
      descEn: 'Hospital-grade autoclaved instruments, apex gel, Dead Sea salts',
      descAr: 'أدوات معقمة طبياً بالأوتوكلاف، أظافر جل قوية، وأملاح البحر الميت',
      recommendedServiceId: 'srv-nails-gel',
    },
  ];

  const occasions = [
    {
      id: 'event',
      titleEn: 'Upcoming Wedding or Private Gala',
      titleAr: 'حفل زفاف أو مناسبة خاصة قادمة في الرياض',
      urgencyEn: 'Instant transformative glow needed with zero downtime',
      urgencyAr: 'مطلوب إشراقة فورية متألقة بدون أي احمرار',
    },
    {
      id: 'weekend',
      titleEn: 'Weekend VIP Self-Care Sanctuary',
      titleAr: 'يوم دلال وعناية شخصية استثنائية في الويكند',
      urgencyEn: 'Unrushed luxury relaxation and restorative beauty',
      urgencyAr: 'استرخاء ملكي وتجديد طاقة وحيوية',
    },
    {
      id: 'maintenance',
      titleEn: 'Monthly Routine Restoration',
      titleAr: 'صيانة شهرية منتظمة للشعر والبشرة',
      urgencyEn: 'Sustained cuticle nourishment and skin barrier strength',
      urgencyAr: 'حفاظ على تغذية خصلات الشعر وحماية حاجز البشرة',
    },
  ];

  // Resolve recommended service
  const currentGoalObj = goals.find((g) => g.id === selectedGoal) || goals[0];
  const matchedService =
    services.find((s) => s.id === currentGoalObj.recommendedServiceId) ||
    services[0];

  const handleComplete = () => {
    onSelectServiceAndBook(matchedService.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-[#110F0B] border border-[#D4AF37]/35 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden text-start">
        {/* Ambient gold glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-5 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#201B11] border border-[#D4AF37]/40 flex items-center justify-center text-[#E5C378]">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-playfair text-xl sm:text-2xl font-bold text-[#F8F5EE]">
                {language === 'ar' ? 'مستشار الجمال الذكي لصالون روزانة' : 'Rozana Bespoke Ritual Advisor'}
              </h3>
              <p className="font-tajawal text-xs text-[#A89F91]">
                {language === 'ar' ? 'تشخيص سريع لتحديد العلاج الأنسب لاحتياجاتك' : '30-second concierge beauty diagnostic'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-[#8C8477] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-8 px-2">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all ${
                  step === s
                    ? 'bg-[#E5C378] text-[#0E0C09] shadow-[0_0_12px_rgba(229,195,120,0.5)]'
                    : step > s
                    ? 'bg-[#2A2417] text-[#E5C378] border border-[#D4AF37]/40'
                    : 'bg-[#181611] text-[#666]'
                }`}
              >
                {step > s ? '✓' : s}
              </div>
              <span className="text-xs font-tajawal hidden sm:inline text-[#A89F91]">
                {s === 1
                  ? (language === 'ar' ? 'الهدف الجمالي' : 'Beauty Goal')
                  : s === 2
                  ? (language === 'ar' ? 'المناسبة' : 'Occasion')
                  : (language === 'ar' ? 'التوصية المخصصة' : 'Prescription')}
              </span>
              {s < 3 && <div className="w-8 sm:w-16 h-px bg-white/10 mx-1" />}
            </div>
          ))}
        </div>

        {/* Step 1: Beauty Goal */}
        {step === 1 && (
          <div className="space-y-4">
            <h4 className="font-tajawal font-bold text-base text-[#F8F5EE]">
              {language === 'ar' ? 'ما هو تركيزك الجمالي الأساسي اليوم؟' : 'What is your primary aesthetic focus?'}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {goals.map((g) => {
                const isSelected = selectedGoal === g.id;
                return (
                  <div
                    key={g.id}
                    onClick={() => setSelectedGoal(g.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer select-none ${
                      isSelected
                        ? 'bg-[#1D1911] border-[#E5C378] shadow-[0_0_15px_rgba(229,195,120,0.2)]'
                        : 'bg-[#14120D] border-white/5 hover:border-[#D4AF37]/30'
                    }`}
                  >
                    <div className="text-2xl mb-2">{g.icon}</div>
                    <div className="font-tajawal font-bold text-sm text-[#F8F5EE] mb-1">
                      {language === 'ar' ? g.titleAr : g.titleEn}
                    </div>
                    <div className="font-tajawal text-xs text-[#8C8477]">
                      {language === 'ar' ? g.descAr : g.descEn}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex justify-end pt-4">
              <button
                onClick={() => setStep(2)}
                className="luxe-gold-btn px-6 py-2.5 rounded-full text-xs font-tajawal font-bold flex items-center gap-2 cursor-pointer"
              >
                <span>{language === 'ar' ? 'متابعة التشخيص' : 'Next Question'}</span>
                <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Occasion */}
        {step === 2 && (
          <div className="space-y-4">
            <h4 className="font-tajawal font-bold text-base text-[#F8F5EE]">
              {language === 'ar' ? 'ما هي المناسبة أو الإطار الزمني؟' : 'What is the timing or celebration?'}
            </h4>
            <div className="space-y-3">
              {occasions.map((o) => {
                const isSelected = selectedOccasion === o.id;
                return (
                  <div
                    key={o.id}
                    onClick={() => setSelectedOccasion(o.id)}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer select-none flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#1D1911] border-[#E5C378] shadow-[0_0_15px_rgba(229,195,120,0.2)]'
                        : 'bg-[#14120D] border-white/5 hover:border-[#D4AF37]/30'
                    }`}
                  >
                    <div>
                      <div className="font-tajawal font-bold text-sm text-[#F8F5EE] mb-0.5">
                        {language === 'ar' ? o.titleAr : o.titleEn}
                      </div>
                      <div className="font-tajawal text-xs text-[#8C8477]">
                        {language === 'ar' ? o.urgencyAr : o.urgencyEn}
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                        isSelected ? 'border-[#E5C378] bg-[#E5C378] text-black' : 'border-white/20'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between pt-4">
              <button
                onClick={() => setStep(1)}
                className="px-5 py-2 rounded-full text-xs font-tajawal text-[#8C8477] hover:text-white cursor-pointer"
              >
                {language === 'ar' ? 'الرجوع' : 'Back'}
              </button>
              <button
                onClick={() => setStep(3)}
                className="luxe-gold-btn px-6 py-2.5 rounded-full text-xs font-tajawal font-bold flex items-center gap-2 cursor-pointer"
              >
                <span>{language === 'ar' ? 'عرض التوصية الملكية' : 'View Recommendation'}</span>
                <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Result Dossier */}
        {step === 3 && (
          <div className="space-y-6">
            <div className="p-5 rounded-2xl bg-gradient-to-br from-[#201A10] to-[#12100B] border border-[#E5C378]/40 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <span className="px-3 py-1 rounded-full bg-[#E5C378] text-[#0E0C09] text-xs font-tajawal font-extrabold flex items-center gap-1 shadow-[0_0_10px_rgba(229,195,120,0.4)]">
                  <Sparkles className="w-3.5 h-3.5" />
                  {language === 'ar' ? 'العلاج الموصى به لكِ بدقة' : 'Prescribed Luxury Ritual'}
                </span>
                <span className="font-playfair text-xl font-bold text-[#E5C378]">
                  {matchedService.priceSAR} SAR
                </span>
              </div>

              <h4 className="font-playfair text-xl sm:text-2xl font-bold text-[#FFF8DC] mb-2">
                {language === 'ar' ? matchedService.nameAr : matchedService.nameEn}
              </h4>
              <p className="font-tajawal text-xs sm:text-sm text-[#B8AF9F] mb-4">
                {language === 'ar' ? matchedService.descriptionAr : matchedService.descriptionEn}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-3 border-t border-white/10 text-xs font-tajawal text-[#8C8477]">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4 text-[#E5C378]" />
                  <span>{matchedService.durationMin} {language === 'ar' ? 'دقيقة' : 'mins'}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>{language === 'ar' ? 'تعقيم طبي كامل' : '100% Sterile'}</span>
                </div>
                <div className="flex items-center gap-1.5 col-span-2 sm:col-span-1">
                  <User className="w-4 h-4 text-[#E5C378]" />
                  <span>{language === 'ar' ? 'خبيرات معتمدات' : 'Certified Master'}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
              <button
                onClick={() => setStep(1)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-full text-xs font-tajawal text-[#8C8477] hover:text-white cursor-pointer"
              >
                {language === 'ar' ? 'إعادة التشخيص' : 'Start Over'}
              </button>
              <button
                onClick={handleComplete}
                className="w-full sm:w-auto luxe-gold-btn px-8 py-3 rounded-full text-xs sm:text-sm font-tajawal font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg"
              >
                <span>{language === 'ar' ? 'تأكيد وحجز هذا الموعد فوراً' : 'Book This Recommended Treatment'}</span>
                <ArrowRight className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
