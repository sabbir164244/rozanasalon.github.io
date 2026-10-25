import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  SalonSettings, 
  VipPackage, 
  SalonSuite, 
  TransformationItem, 
  SalonReview 
} from '../../types';
import { 
  Building, 
  Phone, 
  MapPin, 
  Clock, 
  Star, 
  Image as ImageIcon, 
  Sparkles, 
  Save, 
  CheckCircle2, 
  Plus, 
  Edit3, 
  Trash2, 
  Crown, 
  Layers, 
  MessageSquareQuote,
  Flame,
  Check
} from 'lucide-react';

interface AdminContentTabProps {
  settings: SalonSettings;
  packages: VipPackage[];
  suites: SalonSuite[];
  transformations: TransformationItem[];
  reviews: SalonReview[];
  onUpdateSettings: (newSettings: SalonSettings) => void;
  onUpdatePackages: (newPackages: VipPackage[]) => void;
  onUpdateSuites: (newSuites: SalonSuite[]) => void;
  onUpdateTransformations: (newTransformations: TransformationItem[]) => void;
  onUpdateReviews: (newReviews: SalonReview[]) => void;
}

export const AdminContentTab: React.FC<AdminContentTabProps> = ({
  settings,
  packages,
  suites,
  transformations,
  reviews,
  onUpdateSettings,
  onUpdatePackages,
  onUpdateSuites,
  onUpdateTransformations,
  onUpdateReviews,
}) => {
  const { language } = useLanguage();

  // Sub-section navigation
  const [activeSubTab, setActiveSubTab] = useState<'contact' | 'packages' | 'suites' | 'transformations' | 'reviews'>('contact');

  // Contact / Settings form state
  const [localSettings, setLocalSettings] = useState<SalonSettings>({ ...settings });
  const [settingsSavedToast, setSettingsSavedToast] = useState(false);

  // VIP Package edit state
  const [editingPkg, setEditingPkg] = useState<VipPackage | null>(null);

  // Suite edit state
  const [editingSuite, setEditingSuite] = useState<SalonSuite | null>(null);

  // Transformation edit state
  const [editingTrans, setEditingTrans] = useState<TransformationItem | null>(null);

  // Review add/edit state
  const [editingReview, setEditingReview] = useState<SalonReview | null>(null);
  const [isAddReviewOpen, setIsAddReviewOpen] = useState(false);
  const [newReviewAuthorEn, setNewReviewAuthorEn] = useState('');
  const [newReviewAuthorAr, setNewReviewAuthorAr] = useState('');
  const [newReviewCommentEn, setNewReviewCommentEn] = useState('');
  const [newReviewCommentAr, setNewReviewCommentAr] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewServiceEn, setNewReviewServiceEn] = useState('24K Liquid Gold Facial');
  const [newReviewServiceAr, setNewReviewServiceAr] = useState('جلسة نضارة الذهب الملكي');

  // Save Settings
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(localSettings);
    setSettingsSavedToast(true);
    setTimeout(() => setSettingsSavedToast(false), 3000);
  };

  // Save Package Edit
  const handleSavePackage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPkg) return;
    const updated = packages.map((p) => (p.id === editingPkg.id ? editingPkg : p));
    onUpdatePackages(updated);
    setEditingPkg(null);
  };

  // Save Suite Edit
  const handleSaveSuite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSuite) return;
    const updated = suites.map((s) => (s.id === editingSuite.id ? editingSuite : s));
    onUpdateSuites(updated);
    setEditingSuite(null);
  };

  // Save Transformation Edit
  const handleSaveTransformation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTrans) return;
    const updated = transformations.map((t) => (t.id === editingTrans.id ? editingTrans : t));
    onUpdateTransformations(updated);
    setEditingTrans(null);
  };

  // Delete Review
  const handleDeleteReview = (id: string) => {
    const updated = reviews.filter((r) => r.id !== id);
    onUpdateReviews(updated);
  };

  // Add Review
  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    const newRev: SalonReview = {
      id: `rev-${Date.now()}`,
      authorNameEn: newReviewAuthorEn || 'VIP Client',
      authorNameAr: newReviewAuthorAr || 'عميلة كبار الشخصيات',
      rating: newReviewRating,
      date: 'Just now',
      commentEn: newReviewCommentEn || 'Exquisite royal experience at Rozana Salon.',
      commentAr: newReviewCommentAr || 'تجربة ملكية استثنائية وأعلى درجات الرقي والاهتمام.',
      serviceUsedEn: newReviewServiceEn,
      serviceUsedAr: newReviewServiceAr,
      verified: true
    };
    onUpdateReviews([newRev, ...reviews]);
    setIsAddReviewOpen(false);
    setNewReviewAuthorEn('');
    setNewReviewAuthorAr('');
    setNewReviewCommentEn('');
    setNewReviewCommentAr('');
  };

  return (
    <div className="space-y-8 text-start animate-in fade-in duration-300">
      {/* Sub-tab Navigation */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl bg-[#13110C] border border-white/10">
        <button
          onClick={() => setActiveSubTab('contact')}
          className={`px-4 py-2 rounded-xl text-xs font-tajawal font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'contact'
              ? 'bg-[#E5C378] text-[#0E0C09] shadow-md'
              : 'text-[#A89F91] hover:text-white'
          }`}
        >
          <Building className="w-3.5 h-3.5" />
          <span>{language === 'ar' ? 'معلومات التواصل والصالون' : 'Contact & Salon Info'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('packages')}
          className={`px-4 py-2 rounded-xl text-xs font-tajawal font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'packages'
              ? 'bg-[#E5C378] text-[#0E0C09] shadow-md'
              : 'text-[#A89F91] hover:text-white'
          }`}
        >
          <Crown className="w-3.5 h-3.5" />
          <span>{language === 'ar' ? 'باقات العرائس والـ VIP' : 'VIP Bridal Packages'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('suites')}
          className={`px-4 py-2 rounded-xl text-xs font-tajawal font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'suites'
              ? 'bg-[#E5C378] text-[#0E0C09] shadow-md'
              : 'text-[#A89F91] hover:text-white'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{language === 'ar' ? 'الأجنحة المعزولة' : 'Private VIP Suites'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('transformations')}
          className={`px-4 py-2 rounded-xl text-xs font-tajawal font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'transformations'
              ? 'bg-[#E5C378] text-[#0E0C09] shadow-md'
              : 'text-[#A89F91] hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{language === 'ar' ? 'صور قبل وبعد' : 'Before & After Gallery'}</span>
        </button>

        <button
          onClick={() => setActiveSubTab('reviews')}
          className={`px-4 py-2 rounded-xl text-xs font-tajawal font-bold flex items-center gap-2 transition-all cursor-pointer ${
            activeSubTab === 'reviews'
              ? 'bg-[#E5C378] text-[#0E0C09] shadow-md'
              : 'text-[#A89F91] hover:text-white'
          }`}
        >
          <MessageSquareQuote className="w-3.5 h-3.5" />
          <span>{language === 'ar' ? 'التقييمات والآراء' : 'Reviews & Social Proof'}</span>
        </button>
      </div>

      {/* Toast */}
      {settingsSavedToast && (
        <div className="p-4 rounded-2xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-200 text-xs font-tajawal flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            {language === 'ar' ? 'تم حفظ التعديلات وتحديث الموقع فوراً!' : 'Changes saved and reflected across the live website!'}
          </span>
        </div>
      )}

      {/* ========================================================= */}
      {/* 1. CONTACT & SALON INFO CUSTOMIZER */}
      {/* ========================================================= */}
      {activeSubTab === 'contact' && (
        <form onSubmit={handleSaveSettings} className="space-y-6">
          <div className="rounded-3xl bg-[#13110C] border border-white/10 p-6 sm:p-8 space-y-6">
            <h3 className="font-playfair text-xl font-bold text-[#F8F5EE] border-b border-white/10 pb-4">
              {language === 'ar' ? 'تخصيص هوية ومعلومات صالون روزانة' : 'Salon Identity & Contact Customization'}
            </h3>

            {/* Names */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] mb-1.5">
                  {language === 'ar' ? 'اسم الصالون بالإنجليزية' : 'Salon Brand Name (EN)'}
                </label>
                <input
                  type="text"
                  required
                  value={localSettings.nameEn}
                  onChange={(e) => setLocalSettings({ ...localSettings, nameEn: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#18150F] border border-white/10 text-xs text-[#F8F5EE] focus:border-[#E5C378] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] mb-1.5">
                  {language === 'ar' ? 'اسم الصالون بالعربية' : 'Salon Brand Name (AR)'}
                </label>
                <input
                  type="text"
                  required
                  value={localSettings.nameAr}
                  onChange={(e) => setLocalSettings({ ...localSettings, nameAr: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#18150F] border border-white/10 text-xs text-[#F8F5EE] focus:border-[#E5C378] outline-none"
                />
              </div>
            </div>

            {/* Branch */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] mb-1.5">
                  {language === 'ar' ? 'اسم الفرع بالإنجليزية' : 'Branch Title (EN)'}
                </label>
                <input
                  type="text"
                  required
                  value={localSettings.branchEn}
                  onChange={(e) => setLocalSettings({ ...localSettings, branchEn: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#18150F] border border-white/10 text-xs text-[#F8F5EE] focus:border-[#E5C378] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] mb-1.5">
                  {language === 'ar' ? 'اسم الفرع بالعربية' : 'Branch Title (AR)'}
                </label>
                <input
                  type="text"
                  required
                  value={localSettings.branchAr}
                  onChange={(e) => setLocalSettings({ ...localSettings, branchAr: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#18150F] border border-white/10 text-xs text-[#F8F5EE] focus:border-[#E5C378] outline-none"
                />
              </div>
            </div>

            {/* Phone & WhatsApp */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] mb-1.5">
                  {language === 'ar' ? 'رقم الهاتف الرسمي' : 'Direct Phone Line'}
                </label>
                <input
                  type="text"
                  required
                  value={localSettings.phone}
                  onChange={(e) => setLocalSettings({ ...localSettings, phone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#18150F] border border-white/10 text-xs text-[#F8F5EE] focus:border-[#E5C378] outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] mb-1.5">
                  {language === 'ar' ? 'رقم الواتساب للاستفسارات' : 'WhatsApp Contact'}
                </label>
                <input
                  type="text"
                  required
                  value={localSettings.whatsapp}
                  onChange={(e) => setLocalSettings({ ...localSettings, whatsapp: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#18150F] border border-white/10 text-xs text-[#F8F5EE] focus:border-[#E5C378] outline-none font-mono"
                />
              </div>
            </div>

            {/* Operating Hours & Rating */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] mb-1.5">
                  {language === 'ar' ? 'ساعة الفتح' : 'Open Hour'}
                </label>
                <input
                  type="text"
                  required
                  value={localSettings.openHour}
                  onChange={(e) => setLocalSettings({ ...localSettings, openHour: e.target.value })}
                  placeholder="12:00 PM"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#18150F] border border-white/10 text-xs text-[#F8F5EE] focus:border-[#E5C378] outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] mb-1.5">
                  {language === 'ar' ? 'ساعة الإغلاق' : 'Close Hour'}
                </label>
                <input
                  type="text"
                  required
                  value={localSettings.closeHour}
                  onChange={(e) => setLocalSettings({ ...localSettings, closeHour: e.target.value })}
                  placeholder="11:00 PM"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#18150F] border border-white/10 text-xs text-[#F8F5EE] focus:border-[#E5C378] outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] mb-1.5">
                  {language === 'ar' ? 'تقييم جوجل (Rating)' : 'Google Rating'}
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="1"
                  max="5"
                  required
                  value={localSettings.rating}
                  onChange={(e) => setLocalSettings({ ...localSettings, rating: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#18150F] border border-white/10 text-xs text-[#F8F5EE] focus:border-[#E5C378] outline-none font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] mb-1.5">
                  {language === 'ar' ? 'إجمالي المراجعات' : 'Total Reviews'}
                </label>
                <input
                  type="number"
                  required
                  value={localSettings.totalReviews}
                  onChange={(e) => setLocalSettings({ ...localSettings, totalReviews: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#18150F] border border-white/10 text-xs text-[#F8F5EE] focus:border-[#E5C378] outline-none font-mono"
                />
              </div>
            </div>

            {/* Address */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] mb-1.5">
                  {language === 'ar' ? 'العنوان التفصيلي بالإنجليزية' : 'Detailed Address (EN)'}
                </label>
                <input
                  type="text"
                  required
                  value={localSettings.addressEn}
                  onChange={(e) => setLocalSettings({ ...localSettings, addressEn: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#18150F] border border-white/10 text-xs text-[#F8F5EE] focus:border-[#E5C378] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] mb-1.5">
                  {language === 'ar' ? 'العنوان التفصيلي بالعربية' : 'Detailed Address (AR)'}
                </label>
                <input
                  type="text"
                  required
                  value={localSettings.addressAr}
                  onChange={(e) => setLocalSettings({ ...localSettings, addressAr: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#18150F] border border-white/10 text-xs text-[#F8F5EE] focus:border-[#E5C378] outline-none"
                />
              </div>
            </div>

            {/* Hero Slogans */}
            <div className="pt-4 border-t border-white/5 space-y-4">
              <h4 className="font-playfair text-base font-bold text-[#E5C378]">
                {language === 'ar' ? 'عناوين وشعار الصفحة الرئيسية (Hero Headlines)' : 'Hero Section Headlines & Taglines'}
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] mb-1.5">
                    {language === 'ar' ? 'الشعار الرئيسي بالإنجليزية' : 'Hero Tagline (EN)'}
                  </label>
                  <input
                    type="text"
                    value={localSettings.heroTaglineEn || ''}
                    onChange={(e) => setLocalSettings({ ...localSettings, heroTaglineEn: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#18150F] border border-white/10 text-xs text-[#F8F5EE] focus:border-[#E5C378] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] mb-1.5">
                    {language === 'ar' ? 'الشعار الرئيسي بالعربية' : 'Hero Tagline (AR)'}
                  </label>
                  <input
                    type="text"
                    value={localSettings.heroTaglineAr || ''}
                    onChange={(e) => setLocalSettings({ ...localSettings, heroTaglineAr: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#18150F] border border-white/10 text-xs text-[#F8F5EE] focus:border-[#E5C378] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] mb-1.5">
                  {language === 'ar' ? 'صورة خلفية الواجهة الرئيسية (Hero Banner Image URL)' : 'Hero Banner Image URL'}
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={localSettings.heroBannerImg || ''}
                    onChange={(e) => setLocalSettings({ ...localSettings, heroBannerImg: e.target.value })}
                    className="flex-1 px-4 py-2.5 rounded-xl bg-[#18150F] border border-white/10 text-xs text-[#F8F5EE] focus:border-[#E5C378] outline-none font-mono"
                  />
                  {localSettings.heroBannerImg && (
                    <div className="w-10 h-10 rounded-xl overflow-hidden border border-[#D4AF37]/40 shrink-0">
                      <img src={localSettings.heroBannerImg} alt="Hero preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-white/10">
              <button
                id="save-salon-settings-btn"
                type="submit"
                className="px-8 py-3.5 rounded-full luxe-gold-btn text-xs font-tajawal font-bold flex items-center gap-2 cursor-pointer shadow-lg"
              >
                <Save className="w-4 h-4" />
                <span>{language === 'ar' ? 'حفظ معلومات الصالون والتواصل' : 'Save Salon Information'}</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {/* ========================================================= */}
      {/* 2. VIP PACKAGES CUSTOMIZER */}
      {/* ========================================================= */}
      {activeSubTab === 'packages' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-playfair text-xl font-bold text-[#F8F5EE]">
              {language === 'ar' ? 'إدارة باقات العرائس والـ VIP' : 'VIP & Bridal Packages Manager'}
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg) => (
              <div
                key={pkg.id}
                className="rounded-3xl bg-[#13110C] border border-white/10 p-5 flex flex-col justify-between hover:border-[#D4AF37]/40 transition-all shadow-lg"
              >
                <div>
                  <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-4 border border-white/10">
                    <img src={pkg.imageUrl} alt={pkg.titleEn} className="w-full h-full object-cover" />
                    <div className="absolute top-2 end-2 px-2.5 py-1 rounded-full bg-[#0E0C09]/90 border border-[#D4AF37]/30 text-[10px] font-mono text-[#E5C378]">
                      {pkg.priceSAR} SAR
                    </div>
                  </div>

                  <h4 className="font-playfair text-base font-bold text-[#F8F5EE]">
                    {pkg.titleEn}
                  </h4>
                  <p className="font-tajawal text-xs text-[#E5C378] mb-2">{pkg.titleAr}</p>
                  <p className="font-tajawal text-xs text-[#A89F91] line-clamp-2 mb-3">
                    {language === 'ar' ? pkg.taglineAr : pkg.taglineEn}
                  </p>

                  <div className="space-y-1 mb-4 text-[11px] font-tajawal text-[#D2C8BA]">
                    {(language === 'ar' ? pkg.servicesIncludedAr : pkg.servicesIncludedEn).slice(0, 3).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-1.5">
                        <Check className="w-3 h-3 text-[#E5C378] shrink-0" />
                        <span className="line-clamp-1">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => setEditingPkg(pkg)}
                  className="w-full py-2.5 rounded-xl bg-[#1F1A11] hover:bg-[#2A2318] border border-white/10 text-xs font-tajawal font-bold text-[#E5C378] flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'تعديل أسعار ومحتوى الباقة' : 'Edit Package & Price'}</span>
                </button>
              </div>
            ))}
          </div>

          {/* Edit Package Modal */}
          {editingPkg && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
              <div className="relative w-full max-w-xl rounded-3xl bg-[#13110C] border border-[#D4AF37]/40 p-6 sm:p-8 shadow-2xl text-start">
                <button
                  onClick={() => setEditingPkg(null)}
                  className="absolute top-5 end-5 w-8 h-8 rounded-full bg-[#1F1A11] text-[#A89F91] hover:text-white flex items-center justify-center text-sm cursor-pointer"
                >
                  ✕
                </button>

                <h3 className="font-playfair text-xl font-bold text-[#F8F5EE] mb-4">
                  {language === 'ar' ? 'تعديل الباقة الملكية' : 'Edit VIP Package'}
                </h3>

                <form onSubmit={handleSavePackage} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] mb-1">
                        {language === 'ar' ? 'اسم الباقة بالإنجليزية' : 'Title (EN)'}
                      </label>
                      <input
                        type="text"
                        required
                        value={editingPkg.titleEn}
                        onChange={(e) => setEditingPkg({ ...editingPkg, titleEn: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#18150F] border border-white/10 text-xs text-[#F8F5EE] focus:border-[#E5C378] outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] mb-1">
                        {language === 'ar' ? 'اسم الباقة بالعربية' : 'Title (AR)'}
                      </label>
                      <input
                        type="text"
                        required
                        value={editingPkg.titleAr}
                        onChange={(e) => setEditingPkg({ ...editingPkg, titleAr: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#18150F] border border-white/10 text-xs text-[#F8F5EE] focus:border-[#E5C378] outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] mb-1">
                        {language === 'ar' ? 'السعر المخفض (SAR)' : 'Price (SAR)'}
                      </label>
                      <input
                        type="number"
                        required
                        value={editingPkg.priceSAR}
                        onChange={(e) => setEditingPkg({ ...editingPkg, priceSAR: Number(e.target.value) })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#18150F] border border-white/10 text-xs text-[#F8F5EE] focus:border-[#E5C378] outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] mb-1">
                        {language === 'ar' ? 'السعر الأصلي (SAR)' : 'Original (SAR)'}
                      </label>
                      <input
                        type="number"
                        required
                        value={editingPkg.originalPriceSAR}
                        onChange={(e) => setEditingPkg({ ...editingPkg, originalPriceSAR: Number(e.target.value) })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#18150F] border border-white/10 text-xs text-[#F8F5EE] focus:border-[#E5C378] outline-none font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] mb-1">
                        {language === 'ar' ? 'المدة (دقائق)' : 'Duration (min)'}
                      </label>
                      <input
                        type="number"
                        required
                        value={editingPkg.durationMin}
                        onChange={(e) => setEditingPkg({ ...editingPkg, durationMin: Number(e.target.value) })}
                        className="w-full px-4 py-2.5 rounded-xl bg-[#18150F] border border-white/10 text-xs text-[#F8F5EE] focus:border-[#E5C378] outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] mb-1">
                      {language === 'ar' ? 'رابط صورة الباقة (Image URL)' : 'Package Image URL'}
                    </label>
                    <input
                      type="url"
                      required
                      value={editingPkg.imageUrl}
                      onChange={(e) => setEditingPkg({ ...editingPkg, imageUrl: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#18150F] border border-white/10 text-xs text-[#F8F5EE] focus:border-[#E5C378] outline-none font-mono"
                    />
                  </div>

                  <div className="flex gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setEditingPkg(null)}
                      className="flex-1 py-2.5 rounded-full bg-[#1A1711] border border-white/10 text-xs font-tajawal text-[#D2C8BA] cursor-pointer"
                    >
                      {language === 'ar' ? 'إلغاء' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-full luxe-gold-btn text-xs font-tajawal font-bold cursor-pointer shadow-lg"
                    >
                      {language === 'ar' ? 'حفظ الباقة' : 'Save Package'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. VIP SUITES CUSTOMIZER */}
      {/* ========================================================= */}
      {activeSubTab === 'suites' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {suites.map((st) => (
              <div
                key={st.id}
                className="rounded-3xl bg-[#13110C] border border-white/10 p-5 flex flex-col justify-between hover:border-[#D4AF37]/40 transition-all shadow-lg"
              >
                <div>
                  <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-4 border border-white/10">
                    <img src={st.imageUrl} alt={st.nameEn} className="w-full h-full object-cover" />
                  </div>
                  <h4 className="font-playfair text-lg font-bold text-[#F8F5EE]">
                    {st.nameEn}
                  </h4>
                  <p className="font-tajawal text-xs text-[#E5C378] mb-2">{st.nameAr}</p>
                  <p className="font-tajawal text-xs text-[#A89F91] leading-relaxed mb-4">
                    {language === 'ar' ? st.descriptionAr : st.descriptionEn}
                  </p>
                </div>

                <button
                  onClick={() => setEditingSuite(st)}
                  className="w-full py-2.5 rounded-xl bg-[#1F1A11] hover:bg-[#2A2318] border border-white/10 text-xs font-tajawal font-bold text-[#E5C378] flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'تعديل الجناح والصورة' : 'Edit Suite Details & Image'}</span>
                </button>
              </div>
            ))}
          </div>

          {/* Edit Suite Modal */}
          {editingSuite && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
              <div className="relative w-full max-w-lg rounded-3xl bg-[#13110C] border border-[#D4AF37]/40 p-6 sm:p-8 shadow-2xl text-start">
                <button
                  onClick={() => setEditingSuite(null)}
                  className="absolute top-5 end-5 w-8 h-8 rounded-full bg-[#1F1A11] text-[#A89F91] hover:text-white flex items-center justify-center text-sm cursor-pointer"
                >
                  ✕
                </button>

                <h3 className="font-playfair text-xl font-bold text-[#F8F5EE] mb-4">
                  {language === 'ar' ? 'تعديل الجناح الملكي' : 'Edit VIP Suite'}
                </h3>

                <form onSubmit={handleSaveSuite} className="space-y-4">
                  <div>
                    <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] mb-1">
                      {language === 'ar' ? 'رابط صورة الجناح' : 'Suite Image URL'}
                    </label>
                    <input
                      type="url"
                      required
                      value={editingSuite.imageUrl}
                      onChange={(e) => setEditingSuite({ ...editingSuite, imageUrl: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#18150F] border border-white/10 text-xs text-[#F8F5EE] focus:border-[#E5C378] outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] mb-1">
                      {language === 'ar' ? 'الوصف بالعربية' : 'Description (AR)'}
                    </label>
                    <textarea
                      rows={3}
                      value={editingSuite.descriptionAr}
                      onChange={(e) => setEditingSuite({ ...editingSuite, descriptionAr: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#18150F] border border-white/10 text-xs text-[#F8F5EE] focus:border-[#E5C378] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] mb-1">
                      {language === 'ar' ? 'الوصف بالإنجليزية' : 'Description (EN)'}
                    </label>
                    <textarea
                      rows={3}
                      value={editingSuite.descriptionEn}
                      onChange={(e) => setEditingSuite({ ...editingSuite, descriptionEn: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#18150F] border border-white/10 text-xs text-[#F8F5EE] focus:border-[#E5C378] outline-none"
                    />
                  </div>

                  <div className="flex gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setEditingSuite(null)}
                      className="flex-1 py-2.5 rounded-full bg-[#1A1711] border border-white/10 text-xs font-tajawal text-[#D2C8BA] cursor-pointer"
                    >
                      {language === 'ar' ? 'إلغاء' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-full luxe-gold-btn text-xs font-tajawal font-bold cursor-pointer shadow-lg"
                    >
                      {language === 'ar' ? 'حفظ الجناح' : 'Save Suite'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. BEFORE & AFTER TRANSFORMATIONS GALLERY */}
      {/* ========================================================= */}
      {activeSubTab === 'transformations' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {transformations.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl bg-[#13110C] border border-white/10 p-5 flex flex-col justify-between hover:border-[#D4AF37]/40 transition-all shadow-lg"
              >
                <div>
                  <div className="grid grid-cols-2 gap-2 mb-4">
                    <div className="relative aspect-square rounded-xl overflow-hidden border border-white/10">
                      <img src={item.beforeImage} alt="Before" className="w-full h-full object-cover" />
                      <span className="absolute bottom-1 start-1 px-2 py-0.5 rounded bg-black/80 text-[10px] text-[#A89F91]">
                        {language === 'ar' ? item.beforeLabelAr : item.beforeLabelEn}
                      </span>
                    </div>
                    <div className="relative aspect-square rounded-xl overflow-hidden border border-[#D4AF37]/30">
                      <img src={item.afterImage} alt="After" className="w-full h-full object-cover" />
                      <span className="absolute bottom-1 start-1 px-2 py-0.5 rounded bg-[#D4AF37] text-[10px] text-[#0E0C09] font-bold">
                        {language === 'ar' ? item.afterLabelAr : item.afterLabelEn}
                      </span>
                    </div>
                  </div>

                  <h4 className="font-playfair text-base font-bold text-[#F8F5EE]">
                    {item.titleEn}
                  </h4>
                  <p className="font-tajawal text-xs text-[#E5C378] mb-2">{item.titleAr}</p>
                  <p className="font-tajawal text-xs text-[#A89F91] line-clamp-2 mb-4">
                    {language === 'ar' ? item.descriptionAr : item.descriptionEn}
                  </p>
                </div>

                <button
                  onClick={() => setEditingTrans(item)}
                  className="w-full py-2.5 rounded-xl bg-[#1F1A11] hover:bg-[#2A2318] border border-white/10 text-xs font-tajawal font-bold text-[#E5C378] flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>{language === 'ar' ? 'تعديل الصور والعناوين' : 'Edit Before & After Images'}</span>
                </button>
              </div>
            ))}
          </div>

          {/* Edit Transformation Modal */}
          {editingTrans && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
              <div className="relative w-full max-w-lg rounded-3xl bg-[#13110C] border border-[#D4AF37]/40 p-6 sm:p-8 shadow-2xl text-start">
                <button
                  onClick={() => setEditingTrans(null)}
                  className="absolute top-5 end-5 w-8 h-8 rounded-full bg-[#1F1A11] text-[#A89F91] hover:text-white flex items-center justify-center text-sm cursor-pointer"
                >
                  ✕
                </button>

                <h3 className="font-playfair text-xl font-bold text-[#F8F5EE] mb-4">
                  {language === 'ar' ? 'تعديل نموذج التحول (قبل وبعد)' : 'Edit Before & After'}
                </h3>

                <form onSubmit={handleSaveTransformation} className="space-y-4">
                  <div>
                    <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] mb-1">
                      {language === 'ar' ? 'رابط صورة قبل (Before Image URL)' : 'Before Image URL'}
                    </label>
                    <input
                      type="url"
                      required
                      value={editingTrans.beforeImage}
                      onChange={(e) => setEditingTrans({ ...editingTrans, beforeImage: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#18150F] border border-white/10 text-xs text-[#F8F5EE] focus:border-[#E5C378] outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] mb-1">
                      {language === 'ar' ? 'رابط صورة بعد (After Image URL)' : 'After Image URL'}
                    </label>
                    <input
                      type="url"
                      required
                      value={editingTrans.afterImage}
                      onChange={(e) => setEditingTrans({ ...editingTrans, afterImage: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#18150F] border border-white/10 text-xs text-[#F8F5EE] focus:border-[#E5C378] outline-none font-mono"
                    />
                  </div>

                  <div className="flex gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setEditingTrans(null)}
                      className="flex-1 py-2.5 rounded-full bg-[#1A1711] border border-white/10 text-xs font-tajawal text-[#D2C8BA] cursor-pointer"
                    >
                      {language === 'ar' ? 'إلغاء' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-full luxe-gold-btn text-xs font-tajawal font-bold cursor-pointer shadow-lg"
                    >
                      {language === 'ar' ? 'حفظ' : 'Save'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* 5. REVIEWS & TESTIMONIALS MANAGER */}
      {/* ========================================================= */}
      {activeSubTab === 'reviews' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-playfair text-xl font-bold text-[#F8F5EE]">
              {language === 'ar' ? 'إدارة تقييمات وآراء العميلات' : 'Customer Reviews & Social Proof'}
            </h3>
            <button
              onClick={() => setIsAddReviewOpen(true)}
              className="px-4 py-2 rounded-full luxe-gold-btn text-xs font-tajawal font-bold flex items-center gap-1.5 cursor-pointer shadow-md"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'ar' ? 'إضافة تقييم جديد' : 'Add Testimonial'}</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reviews.map((rev) => (
              <div
                key={rev.id}
                className="rounded-2xl bg-[#13110C] border border-white/10 p-5 flex flex-col justify-between hover:border-[#D4AF37]/40 transition-all shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-bold text-[#F8F5EE] text-sm">
                      {language === 'ar' ? rev.authorNameAr : rev.authorNameEn}
                    </div>
                    <div className="flex items-center gap-1 text-[#E5C378]">
                      {Array.from({ length: rev.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-[#E5C378]" />
                      ))}
                    </div>
                  </div>

                  <p className="font-tajawal text-xs text-[#A89F91] leading-relaxed mb-3 italic">
                    "{language === 'ar' ? rev.commentAr : rev.commentEn}"
                  </p>

                  <div className="text-[11px] font-tajawal text-[#E5C378]">
                    {language === 'ar' ? rev.serviceUsedAr : rev.serviceUsedEn}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/5 mt-3">
                  <span className="text-[10px] font-mono text-[#777]">{rev.date}</span>
                  <button
                    onClick={() => handleDeleteReview(rev.id)}
                    className="p-1.5 rounded-lg bg-red-950/30 hover:bg-red-900/50 text-red-400 border border-red-500/20 cursor-pointer"
                    title="Delete Review"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Add Review Modal */}
          {isAddReviewOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
              <div className="relative w-full max-w-md rounded-3xl bg-[#13110C] border border-[#D4AF37]/40 p-6 sm:p-8 shadow-2xl text-start">
                <button
                  onClick={() => setIsAddReviewOpen(false)}
                  className="absolute top-5 end-5 w-8 h-8 rounded-full bg-[#1F1A11] text-[#A89F91] hover:text-white flex items-center justify-center text-sm cursor-pointer"
                >
                  ✕
                </button>

                <h3 className="font-playfair text-xl font-bold text-[#F8F5EE] mb-4">
                  {language === 'ar' ? 'إضافة رأي عميلة موثق' : 'Add Customer Review'}
                </h3>

                <form onSubmit={handleAddReview} className="space-y-4">
                  <div>
                    <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] mb-1">
                      {language === 'ar' ? 'اسم العميلة' : 'Author Name'}
                    </label>
                    <input
                      type="text"
                      required
                      value={newReviewAuthorEn}
                      onChange={(e) => {
                        setNewReviewAuthorEn(e.target.value);
                        setNewReviewAuthorAr(e.target.value);
                      }}
                      placeholder="e.g. Sara Al-Hassan"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#18150F] border border-white/10 text-xs text-[#F8F5EE] focus:border-[#E5C378] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] mb-1">
                      {language === 'ar' ? 'التقييم (١ إلى ٥ نجوم)' : 'Rating (1 - 5 Stars)'}
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="5"
                      required
                      value={newReviewRating}
                      onChange={(e) => setNewReviewRating(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#18150F] border border-white/10 text-xs text-[#F8F5EE] focus:border-[#E5C378] outline-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] mb-1">
                      {language === 'ar' ? 'نص التعليق بالعربية' : 'Comment (AR)'}
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={newReviewCommentAr}
                      onChange={(e) => setNewReviewCommentAr(e.target.value)}
                      placeholder="رأي العميلة وتجربتها..."
                      className="w-full px-4 py-2.5 rounded-xl bg-[#18150F] border border-white/10 text-xs text-[#F8F5EE] focus:border-[#E5C378] outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] mb-1">
                      {language === 'ar' ? 'نص التعليق بالإنجليزية' : 'Comment (EN)'}
                    </label>
                    <textarea
                      rows={3}
                      value={newReviewCommentEn}
                      onChange={(e) => setNewReviewCommentEn(e.target.value)}
                      placeholder="Client testimonial in English..."
                      className="w-full px-4 py-2.5 rounded-xl bg-[#18150F] border border-white/10 text-xs text-[#F8F5EE] focus:border-[#E5C378] outline-none"
                    />
                  </div>

                  <div className="flex gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setIsAddReviewOpen(false)}
                      className="flex-1 py-2.5 rounded-full bg-[#1A1711] border border-white/10 text-xs font-tajawal text-[#D2C8BA] cursor-pointer"
                    >
                      {language === 'ar' ? 'إلغاء' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-full luxe-gold-btn text-xs font-tajawal font-bold cursor-pointer shadow-lg"
                    >
                      {language === 'ar' ? 'نشر التقييم' : 'Publish Review'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
