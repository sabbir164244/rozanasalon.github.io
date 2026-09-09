import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { SalonReview, SalonSettings } from '../types';
import { 
  Star, 
  MapPin, 
  Phone, 
  MessageCircle, 
  Clock, 
  ExternalLink, 
  ShieldCheck, 
  Sparkles,
  Award
} from 'lucide-react';

interface SocialProofAndLocationProps {
  reviews: SalonReview[];
  settings: SalonSettings;
}

export const SocialProofAndLocation: React.FC<SocialProofAndLocationProps> = ({
  reviews,
  settings,
}) => {
  const { language, isRTL, t } = useLanguage();

  const metrics = [
    { label: t('social.cleanliness'), score: '4.9', width: '98%' },
    { label: t('social.staffSkill'), score: '4.8', width: '96%' },
    { label: t('social.ambiance'), score: '4.7', width: '94%' },
    { label: t('social.punctuality'), score: '4.8', width: '96%' },
  ];

  return (
    <section id="reviews" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#0C0B08] overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 right-0 w-96 h-96 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto">
        {/* ========================================================= */}
        {/* SECTION 1: SOCIAL PROOF & RATING SHOWCASE */}
        {/* ========================================================= */}
        <div className="mb-24">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#18150F] border border-[#D4AF37]/30 text-[#E5C378] text-xs font-tajawal font-medium mb-3 shadow-sm">
              <Award className="w-3.5 h-3.5" />
              <span>{t('social.badge')}</span>
            </div>
            <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold text-[#F8F5EE] mb-4">
              {t('social.ratingHeader')}
            </h2>
            <p className="font-tajawal text-sm sm:text-base text-[#A89F91]">
              {t('social.basedOn')}
            </p>
          </div>

          {/* Rating Breakdown Bento Box */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-14">
            {/* Primary Rating Showcase Card */}
            <div className="lg:col-span-4 rounded-3xl bg-[#13110C] border border-[#D4AF37]/40 p-8 flex flex-col items-center justify-center text-center shadow-xl">
              <span className="text-xs uppercase tracking-widest text-[#8C8477] font-cinzel mb-3">
                Google Maps Riyadh
              </span>
              
              <div className="flex items-center gap-3 mb-2">
                <span className="font-playfair text-6xl sm:text-7xl font-black text-[#E5C378]">
                  4.9
                </span>
                <div className="flex flex-col items-start">
                  <div className="flex text-[#E5C378] gap-0.5">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-[#E5C378]" />
                    ))}
                  </div>
                  <span className="text-xs font-mono text-[#D2C8BA] mt-1">340+ Verified Reviews</span>
                </div>
              </div>

              <p className="font-tajawal text-xs text-[#A89F91] mt-3 max-w-xs leading-relaxed">
                {language === 'ar'
                  ? 'وجهة موثوقة في حي الشميسي، تجمع بين الخبرة والتنظيم والأجواء الملكية المريحة.'
                  : 'A premier sanctuary in Al Shumaisi, acclaimed for medical-grade hygiene, precision craftsmanship, and VIP comfort.'}
              </p>

              <div className="mt-6 pt-6 border-t border-white/10 w-full flex items-center justify-center gap-2 text-xs font-tajawal text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>{language === 'ar' ? 'صالون نسائي مصرح ومعتمد رسمياً بالرياض' : 'Officially Licensed & Certified Salon'}</span>
              </div>
            </div>

            {/* Metrics Breakdown Bars */}
            <div className="lg:col-span-8 rounded-3xl bg-[#13110C] border border-white/10 p-8 flex flex-col justify-center text-start">
              <h3 className="font-playfair text-xl font-bold text-[#F8F5EE] mb-6">
                {language === 'ar' ? 'معايير الجودة والتميز حسب تقييم العميلات' : 'Guest Experience Benchmarks'}
              </h3>

              <div className="space-y-5">
                {metrics.map((metric, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-xs sm:text-sm font-tajawal mb-2">
                      <span className="text-[#D2C8BA] font-medium">{metric.label}</span>
                      <span className="font-mono text-[#E5C378] font-bold">{metric.score} / 5.0</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-[#201C14] overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#C59D4A] to-[#E5C378] rounded-full transition-all duration-500"
                        style={{ width: metric.width }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Testimonial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-start">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="rounded-2xl bg-[#13110C] border border-white/10 p-6 flex flex-col justify-between hover:border-[#D4AF37]/40 transition-colors shadow-sm"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex text-[#E5C378] gap-0.5">
                      {Array.from({ length: Math.floor(rev.rating) }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#E5C378]" />
                      ))}
                    </div>
                    <span className="text-[11px] font-mono text-[#777]">{rev.date}</span>
                  </div>

                  <p className="font-tajawal text-xs sm:text-sm text-[#D2C8BA] leading-relaxed italic mb-6">
                    "{language === 'ar' ? rev.commentAr : rev.commentEn}"
                  </p>
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <div>
                    <span className="font-tajawal font-bold text-xs sm:text-sm text-[#F8F5EE] block">
                      {language === 'ar' ? rev.authorNameAr : rev.authorNameEn}
                    </span>
                    <span className="text-[11px] font-tajawal text-[#E5C378]">
                      {language === 'ar' ? rev.serviceUsedAr : rev.serviceUsedEn}
                    </span>
                  </div>
                  {rev.verified && (
                    <span className="text-[10px] font-tajawal text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                      {language === 'ar' ? 'عميلة موثقة' : 'Verified'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================= */}
        {/* SECTION 2: LOCATION & GOOGLE MAPS EMBED */}
        {/* ========================================================= */}
        <div id="location" className="scroll-mt-24">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#18150F] border border-[#D4AF37]/30 text-[#E5C378] text-xs font-tajawal font-medium mb-3">
              <MapPin className="w-3.5 h-3.5" />
              <span>{t('location.badge')}</span>
            </div>
            <h2 className="font-playfair text-3xl sm:text-4xl font-bold text-[#F8F5EE] mb-3">
              {t('location.title')}
            </h2>
            <p className="font-tajawal text-sm text-[#A89F91]">
              {language === 'ar' ? settings.addressAr : settings.addressEn}
            </p>
          </div>

          {/* Location & Map Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch text-start">
            {/* Left Info Panel (5 cols) */}
            <div className="lg:col-span-5 rounded-3xl bg-[#13110C] border border-[#D4AF37]/30 p-6 sm:p-8 flex flex-col justify-between shadow-xl">
              <div>
                <h3 className="font-playfair text-2xl font-bold text-[#F8F5EE] mb-2">
                  {language === 'ar' ? settings.nameAr : settings.nameEn}
                </h3>
                <span className="text-xs font-tajawal text-[#E5C378] font-bold block mb-6">
                  {language === 'ar' ? settings.branchAr : settings.branchEn}
                </span>

                <div className="space-y-4 text-xs sm:text-sm font-tajawal">
                  <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#18150F] border border-white/5">
                    <Clock className="w-5 h-5 text-[#E5C378] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[#8C8477] block text-[11px] font-bold uppercase tracking-wider">
                        {t('location.hoursHeader')}
                      </span>
                      <span className="text-[#F8F5EE] font-mono font-bold block mt-0.5">
                        {settings.openHour} – {settings.closeHour}
                      </span>
                      <span className="text-[#E5C378] text-[11px]">
                        {language === 'ar' ? 'طوال أيام الأسبوع' : 'Open Daily (Monday – Sunday)'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-3.5 p-4 rounded-2xl bg-[#18150F] border border-white/5">
                    <MapPin className="w-5 h-5 text-[#E5C378] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-[#8C8477] block text-[11px] font-bold uppercase tracking-wider">
                        {language === 'ar' ? 'العنوان الدقيق' : 'Detailed Address'}
                      </span>
                      <span className="text-[#D2C8BA] leading-relaxed block mt-0.5">
                        {language === 'ar' ? settings.addressAr : settings.addressEn}
                      </span>
                      <span className="text-emerald-400 text-[11px] block mt-1 font-medium">
                        {language === 'ar' ? '✓ مواقف سيارات خاصة لعميلات الصالون' : '✓ Private valet guest parking available'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Actions */}
              <div className="space-y-3 mt-8 pt-6 border-t border-white/10">
                <a
                  href={`tel:${settings.phone}`}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#18150F] border border-white/10 hover:border-[#D4AF37] text-[#F8F5EE] font-tajawal font-bold text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <Phone className="w-4 h-4 text-[#E5C378]" />
                  <span>{t('location.callUs')} ({settings.phone})</span>
                </a>

                <a
                  href={`https://wa.me/966508821245?text=${encodeURIComponent(
                    language === 'ar' 
                      ? 'مرحباً، أود الاستفسار عن خدمات وحجوزات صالون روزانة فرع الشميسي.'
                      : 'Hello Rozana Salon Al Shumaisi, I would like to inquire about booking a treatment.'
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl bg-emerald-800/80 hover:bg-emerald-700 border border-emerald-500/40 text-white font-tajawal font-bold text-sm flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{t('location.whatsappUs')}</span>
                </a>

                <a
                  href="https://maps.google.com/?q=Al+Shumaisi+Riyadh+Saudi+Arabia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 rounded-xl luxe-gold-btn font-tajawal font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow transition-all cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>{t('location.getDirections')}</span>
                </a>
              </div>
            </div>

            {/* Right Interactive Google Maps Container (7 cols) */}
            <div className="lg:col-span-7 rounded-3xl overflow-hidden border border-[#D4AF37]/30 shadow-2xl bg-[#13110C] relative min-h-[420px] flex flex-col">
              {/* Map Top Bar */}
              <div className="bg-[#18150F] px-4 py-3 border-b border-white/10 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-[#E5C378] font-tajawal font-bold">
                  <MapPin className="w-4 h-4" />
                  <span>Al Shumaisi Branch, Riyadh (فرع الشميسي)</span>
                </div>
                <span className="text-[11px] font-mono text-[#8C8477] bg-[#221D14] px-2 py-0.5 rounded">
                  24.6306° N, 46.7028° E
                </span>
              </div>

              {/* Google Maps Responsive Iframe */}
              <div className="relative flex-1 w-full min-h-[360px]">
                <iframe
                  title="Rozana Salon Al Shumaisi Google Map"
                  src="https://maps.google.com/maps?q=Al%20Shumaisi,%20Riyadh,%20Saudi%20Arabia&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  className="w-full h-full border-0 absolute inset-0 filter invert-[90%] hue-rotate-180 contrast-[105%]"
                  loading="lazy"
                  allowFullScreen
                />

                {/* Floating Map Pin Badge */}
                <div className="absolute top-4 start-4 p-3.5 rounded-2xl bg-[#0E0C09]/90 backdrop-blur-md border border-[#D4AF37]/50 shadow-xl pointer-events-none text-start max-w-xs">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#E5C378] animate-ping" />
                    <span className="font-playfair font-bold text-xs text-[#F8F5EE]">
                      Rozana Salon (صالون روزانة)
                    </span>
                  </div>
                  <p className="font-tajawal text-[11px] text-[#A89F91]">
                    {language === 'ar' ? 'شارع الشميسي العام، الرياض' : 'Al Shumaisi Main Street, Riyadh'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
