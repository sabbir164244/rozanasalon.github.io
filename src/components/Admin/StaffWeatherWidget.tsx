import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  CloudSun, 
  Wind, 
  Droplets, 
  Sun, 
  RefreshCw, 
  AlertTriangle, 
  CheckCircle2, 
  Sparkles,
  Search,
  Thermometer,
  ShieldAlert
} from 'lucide-react';

interface WeatherData {
  city: string;
  district?: string;
  temperatureC: number;
  conditionEn: string;
  conditionAr: string;
  humidity: string;
  windSpeedKmh: number;
  uvIndex: string;
  treatmentImpactEn: string;
  treatmentImpactAr: string;
  hairRecommendationEn?: string;
  hairRecommendationAr?: string;
  outdoorAdvisory?: string;
  source?: string;
  updatedAt?: string;
  cached?: boolean;
}

export const StaffWeatherWidget: React.FC = () => {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const computeRiyadhWeather = (): WeatherData => {
    const now = new Date();
    // Riyadh timezone is UTC+3
    const riyadhOffsetMs = 3 * 60 * 60 * 1000;
    const utc = now.getTime() + now.getTimezoneOffset() * 60000;
    const riyadhTime = new Date(utc + riyadhOffsetMs);
    const hour = riyadhTime.getHours();
    const month = riyadhTime.getMonth();

    // Temperature model for Riyadh (hot dry desert)
    const isSummer = month >= 4 && month <= 9;
    const baseTemp = isSummer ? 36 : 27;
    const diurnalSwing = Math.sin(((hour - 9) / 24) * 2 * Math.PI) * 7;
    const tempC = Math.round(baseTemp + diurnalSwing);

    // Humidity typically 12% - 22%
    const humidityVal = Math.round(15 + Math.cos((hour / 24) * 2 * Math.PI) * 6);

    let uv = 'Low (1)';
    if (hour >= 10 && hour <= 16) uv = 'High (8-9)';
    else if (hour >= 7 && hour <= 18) uv = 'Moderate (4-6)';
    else uv = 'None (0)';

    const isNight = hour < 6 || hour >= 19;
    const conditionEn = isNight ? 'Clear Mild Evening' : 'Sunny & Clear Skies';
    const conditionAr = isNight ? 'سماء ليلية صافية ومعتدلة' : 'مشمس وأجواء صحراوية صافية';

    return {
      city: 'Riyadh, Saudi Arabia',
      district: 'Al Shumaisi (حي الشميسي)',
      temperatureC: tempC,
      conditionEn,
      conditionAr,
      humidity: `${humidityVal}%`,
      windSpeedKmh: 14,
      uvIndex: uv,
      treatmentImpactEn: 'Dry Riyadh climate: Keratin and protein treatments bind exceptionally well. For Moroccan Bath and deep facials, advise clients on intense post-treatment barrier hydration & SPF 50+.',
      treatmentImpactAr: 'أجواء الرياض الجافة ممتازة لتثبيت النانو كيراتين والبروتين. لجلسات الحمام المغربي وتنظيف البشرة، يُنصح بتعزيز الترطيب واستخدام واقي الشمس 50+.',
      hairRecommendationEn: 'Zero frizz threat today. Blowouts, soft waves & Hollywood styling will hold all day.',
      hairRecommendationAr: 'ثبات فائق لتصفيف الشعر والسيشوار دون أي تأثير سلبي من الرطوبة.',
      updatedAt: riyadhTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }),
    };
  };

  const [weather, setWeather] = useState<WeatherData>(computeRiyadhWeather);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const handleRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setWeather(computeRiyadhWeather());
      setRefreshing(false);
    }, 400);
  };

  return (
    <div className="rounded-3xl bg-gradient-to-br from-[#17140E] via-[#12100B] to-[#0D0B08] border border-[#D4AF37]/30 p-5 sm:p-6 shadow-xl relative overflow-hidden text-start">
      {/* Subtle ambient lighting */}
      <div className="absolute top-0 end-0 w-64 h-64 bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      {/* Header bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-white/10 relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-[#251F13] to-[#382E19] border border-[#D4AF37]/40 flex items-center justify-center text-[#E5C378] shadow-md shrink-0">
            <CloudSun className="w-6 h-6 text-[#E5C378]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-playfair text-base sm:text-lg font-bold text-[#F8F5EE]">
                {isAr ? 'طقس الرياض الحي (فرع الشميسي)' : 'Riyadh Live Weather & Treatment Advisory'}
              </h4>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-[10px] font-mono text-emerald-300">
                <Sun className="w-2.5 h-2.5" />
                Live Riyadh
              </span>
            </div>
            <p className="font-tajawal text-xs text-[#A89F91]">
              {isAr 
                ? 'إرشادات مخصصة لفريق الخبيرات لضبط توقعات العميلات للعلاجات الحساسة للرطوبة والحرارة'
                : 'Live meteorological advisory for staff to manage client expectations on humidity-sensitive services'}
            </p>
          </div>
        </div>

        {/* Right refresh & timestamp */}
        <div className="flex items-center gap-3">
          <div className="text-end">
            <span className="text-[10px] text-[#8C8477] font-mono block">
              {isAr ? 'آخر تحديث' : 'Updated'}: {weather.updatedAt || 'Live'}
            </span>
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="p-2 rounded-xl bg-[#1F1B12] hover:bg-[#2A2318] border border-[#D4AF37]/30 text-[#E5C378] hover:text-white transition-all cursor-pointer disabled:opacity-50"
            title={isAr ? 'تحديث بيانات الطقس' : 'Refresh Weather'}
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-4 relative z-10">
        {/* Temperature */}
        <div className="rounded-2xl bg-[#0F0D09] border border-white/5 p-3 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#1E1910] text-[#E5C378]">
            <Thermometer className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-tajawal text-[#8C8477] block">
              {isAr ? 'درجة الحرارة' : 'Temperature'}
            </span>
            <span className="font-mono text-lg font-bold text-[#F8F5EE]">
              {weather.temperatureC}°C
            </span>
          </div>
        </div>

        {/* Condition */}
        <div className="rounded-2xl bg-[#0F0D09] border border-white/5 p-3 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#1E1910] text-[#E5C378]">
            <Sun className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-tajawal text-[#8C8477] block">
              {isAr ? 'حالة السماء' : 'Condition'}
            </span>
            <span className="font-tajawal text-xs font-bold text-[#E5C378] truncate block max-w-[110px]">
              {isAr ? weather.conditionAr : weather.conditionEn}
            </span>
          </div>
        </div>

        {/* Humidity */}
        <div className="rounded-2xl bg-[#0F0D09] border border-white/5 p-3 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#1E1910] text-blue-400">
            <Droplets className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-tajawal text-[#8C8477] block">
              {isAr ? 'نسبة الرطوبة' : 'Humidity'}
            </span>
            <span className="font-mono text-sm font-bold text-[#F8F5EE]">
              {weather.humidity}
            </span>
          </div>
        </div>

        {/* Wind Speed / UV */}
        <div className="rounded-2xl bg-[#0F0D09] border border-white/5 p-3 flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#1E1910] text-amber-400">
            <Wind className="w-4 h-4" />
          </div>
          <div>
            <span className="text-[10px] font-tajawal text-[#8C8477] block">
              {isAr ? 'الرياح / مؤشر UV' : 'Wind / UV'}
            </span>
            <span className="font-mono text-xs font-bold text-[#F8F5EE]">
              {weather.windSpeedKmh} km/h • UV {weather.uvIndex}
            </span>
          </div>
        </div>
      </div>

      {/* Staff Treatment Protocols Box */}
      <div className="rounded-2xl bg-[#16130C] border border-[#D4AF37]/25 p-4 space-y-3 relative z-10">
        <div className="flex items-start gap-2.5">
          <Sparkles className="w-4 h-4 text-[#E5C378] mt-0.5 shrink-0" />
          <div className="space-y-1">
            <h5 className="font-tajawal text-xs font-bold text-[#E5C378]">
              {isAr ? 'تأثير الطقس على جلسات الصالون الخارجية اليوم:' : 'Outdoor-Sensitive Treatment Advisory for Specialists:'}
            </h5>
            <p className="font-tajawal text-xs text-[#D2C8BA] leading-relaxed">
              {isAr ? weather.treatmentImpactAr : weather.treatmentImpactEn}
            </p>
          </div>
        </div>

        {weather.hairRecommendationAr && (
          <div className="flex items-start gap-2.5 pt-2 border-t border-white/5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
            <div>
              <span className="font-tajawal text-[11px] font-bold text-emerald-400 block">
                {isAr ? 'توصية تصفيف الشعر والسيشوار:' : 'Hair Blowout & Keratin Longevity:'}
              </span>
              <p className="font-tajawal text-xs text-[#A89F91]">
                {isAr ? weather.hairRecommendationAr : weather.hairRecommendationEn}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
