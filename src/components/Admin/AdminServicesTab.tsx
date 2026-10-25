import React, { useState, useRef } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import { Service, ServiceCategory } from '../../types';
import { 
  Sparkles, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  Check, 
  X, 
  Clock, 
  Star, 
  Image as ImageIcon, 
  Save, 
  AlertCircle,
  Upload,
  RotateCcw,
  Eye,
  Link as LinkIcon,
  Crown,
  CheckCircle2,
  SlidersHorizontal,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

interface AdminServicesTabProps {
  services: Service[];
  onAddService: (newService: Service) => void;
  onUpdateService: (updatedService: Service) => void;
  onDeleteService: (serviceId: string) => void;
  onResetToDefaults?: () => void;
}

// Curated high-fashion luxury salon presets with reliable CDN URLs
interface LuxuryImagePreset {
  id: string;
  category: ServiceCategory;
  titleEn: string;
  titleAr: string;
  url: string;
}

const LUXURY_IMAGE_PRESETS: LuxuryImagePreset[] = [
  // Facial & Glow
  {
    id: 'p-facial-1',
    category: 'facial',
    titleEn: '24K Liquid Gold Treatment',
    titleAr: 'علاج هيدرا الذهب 24K',
    url: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'p-facial-2',
    category: 'facial',
    titleEn: 'Collagen Glass Skin Glow',
    titleAr: 'جلسة نضارة كولاجين وبشرة زجاجية',
    url: 'https://images.unsplash.com/photo-1512290900672-1f5be572e0fa?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'p-facial-3',
    category: 'facial',
    titleEn: 'Clinical Botanical Facial',
    titleAr: 'تنظيف سريري بالأعشاب الطبيعية',
    url: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop&q=80'
  },
  // Keratin & Protein
  {
    id: 'p-keratin-1',
    category: 'keratin',
    titleEn: 'Brazilian Nano-Keratin Silk',
    titleAr: 'نانو كيراتين برازيلي حريري',
    url: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'p-keratin-2',
    category: 'keratin',
    titleEn: 'Royal Caviar & Protein Mask',
    titleAr: 'بروتين الكافيار لترميم الشعر',
    url: 'https://images.unsplash.com/photo-1607779097040-26e80aa78e66?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'p-keratin-3',
    category: 'keratin',
    titleEn: 'Gloss Hair Botox & Shine',
    titleAr: 'بوتوكس ولمعان الشعر المكثف',
    url: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800&auto=format&fit=crop&q=80'
  },
  // Haircut & Royal Styling
  {
    id: 'p-haircut-1',
    category: 'haircut',
    titleEn: 'Royal Waves & Blowout',
    titleAr: 'تسريحة ويفي ملكية واستشوار',
    url: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'p-haircut-2',
    category: 'haircut',
    titleEn: 'Haute French Layered Cut',
    titleAr: 'قصة فرنسية مدرجة متقنة',
    url: 'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'p-haircut-3',
    category: 'haircut',
    titleEn: 'Silk Press & Smoothing',
    titleAr: 'تصفيف حريري ناعم فائق الدقة',
    url: 'https://images.unsplash.com/photo-1580618672591-eb180b1a973f?w=800&auto=format&fit=crop&q=80'
  },
  // Luxury Nails
  {
    id: 'p-nails-1',
    category: 'nails',
    titleEn: 'Haute Couture Gel Extension',
    titleAr: 'تركيب جل ومانيكير كوتور فرنسي',
    url: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'p-nails-2',
    category: 'nails',
    titleEn: 'Gold Shimmer Nail Art',
    titleAr: 'فن أظافر بريق الذهب الخالص',
    url: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'p-nails-3',
    category: 'nails',
    titleEn: 'Diamond Spa Pedicure & Scrub',
    titleAr: 'بديكير سبا ماسي بالأملاح',
    url: 'https://images.unsplash.com/photo-1519014816548-bf5fe059798b?w=800&auto=format&fit=crop&q=80'
  },
  // Moroccan Hammam & Spa
  {
    id: 'p-spa-1',
    category: 'spa',
    titleEn: 'Royal Moroccan Hammam Herbs',
    titleAr: 'حمام مغربي ملكي بالأعشاب الطبيعية',
    url: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'p-spa-2',
    category: 'spa',
    titleEn: 'Aroma Essential Oils Massage',
    titleAr: 'تدليك استرخائي بالزيوت العطرية',
    url: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'p-spa-3',
    category: 'spa',
    titleEn: 'Dead Sea Salt Body Polish',
    titleAr: 'صنفرة وتنعيم بأملاح البحر الميت',
    url: 'https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=800&auto=format&fit=crop&q=80'
  }
];

export const AdminServicesTab: React.FC<AdminServicesTabProps> = ({
  services,
  onAddService,
  onUpdateService,
  onDeleteService,
  onResetToDefaults,
}) => {
  const { language, isRTL } = useLanguage();
  const { addToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategory>('all');
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [resetConfirmOpen, setResetConfirmOpen] = useState(false);

  // Quick inline price editing state
  const [quickPriceId, setQuickPriceId] = useState<string | null>(null);
  const [quickPriceValue, setQuickPriceValue] = useState<number>(0);

  // Form State for Add / Edit
  const [formNameEn, setFormNameEn] = useState('');
  const [formNameAr, setFormNameAr] = useState('');
  const [formCategory, setFormCategory] = useState<ServiceCategory>('facial');
  const [formPrice, setFormPrice] = useState<number>(290);
  const [formDuration, setFormDuration] = useState<number>(60);
  const [formDescEn, setFormDescEn] = useState('');
  const [formDescAr, setFormDescAr] = useState('');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formIsSignature, setFormIsSignature] = useState(false);
  const [formBadgeEn, setFormBadgeEn] = useState('');
  const [formBadgeAr, setFormBadgeAr] = useState('');

  // Image Customizer Modes: 'url' | 'presets' | 'upload'
  const [imageTab, setImageTab] = useState<'url' | 'presets' | 'upload'>('presets');
  const [presetCategory, setPresetCategory] = useState<ServiceCategory>('all');
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Open Edit Modal
  const handleOpenEdit = (srv: Service) => {
    setEditingService(srv);
    setFormNameEn(srv.nameEn);
    setFormNameAr(srv.nameAr);
    setFormCategory(srv.category);
    setFormPrice(srv.priceSAR);
    setFormDuration(srv.durationMin);
    setFormDescEn(srv.descriptionEn);
    setFormDescAr(srv.descriptionAr);
    setFormImageUrl(srv.imageUrl || '');
    setFormIsSignature(!!srv.isSignature);
    setFormBadgeEn(srv.badgeEn || '');
    setFormBadgeAr(srv.badgeAr || '');
    setImageError(false);
    setImageTab('presets');
    setPresetCategory(srv.category);
  };

  // Open Add Modal
  const handleOpenAdd = () => {
    setEditingService(null);
    setFormNameEn('');
    setFormNameAr('');
    setFormCategory('facial');
    setFormPrice(290);
    setFormDuration(60);
    setFormDescEn('');
    setFormDescAr('');
    setFormImageUrl('https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80');
    setFormIsSignature(false);
    setFormBadgeEn('');
    setFormBadgeAr('');
    setImageError(false);
    setImageTab('presets');
    setPresetCategory('facial');
    setIsAddOpen(true);
  };

  // Handle local file upload (Data URL)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast({
        type: 'alert',
        titleAr: 'تنسيق غير مدعوم',
        titleEn: 'Invalid Image Format',
        messageAr: 'يرجى اختيار ملف صورة صالح (JPEG, PNG, WEBP).',
        messageEn: 'Please choose a valid image file (JPEG, PNG, WEBP).'
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setFormImageUrl(reader.result);
        setImageError(false);
        addToast({
          type: 'success',
          titleAr: 'تم تحميل الصورة من الجهاز',
          titleEn: 'Photo Uploaded Successfully',
          messageAr: 'تم تعيين الصورة وتطبيقها للمعاينة الفورية.',
          messageEn: 'Local photo loaded and set for live preview.'
        });
      }
    };
    reader.readAsDataURL(file);
  };

  // Save Add or Edit
  const handleSubmitService = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formNameEn.trim() && !formNameAr.trim()) {
      addToast({
        type: 'alert',
        titleAr: 'بيانات ناقصة',
        titleEn: 'Missing Name',
        messageAr: 'يرجى إدخال اسم الخدمة بالعربية أو الإنجليزية.',
        messageEn: 'Please provide the service title.'
      });
      return;
    }

    const finalImage = formImageUrl.trim() || 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop&q=80';

    if (editingService) {
      const updated: Service = {
        ...editingService,
        nameEn: formNameEn.trim() || editingService.nameEn,
        nameAr: formNameAr.trim() || editingService.nameAr,
        category: formCategory,
        priceSAR: Math.max(1, Number(formPrice)),
        durationMin: Math.max(5, Number(formDuration)),
        descriptionEn: formDescEn.trim(),
        descriptionAr: formDescAr.trim(),
        imageUrl: finalImage,
        isSignature: formIsSignature,
        badgeEn: formBadgeEn.trim() || undefined,
        badgeAr: formBadgeAr.trim() || undefined,
      };

      onUpdateService(updated);
      setEditingService(null);

      addToast({
        type: 'success',
        titleAr: '✨ تم تحديث الخدمة بنجاح!',
        titleEn: '✨ Service Updated Successfully!',
        messageAr: `تم تحديث سعر وبيانات (${updated.nameAr}) إلى ${updated.priceSAR} ر.س وانعكست على الموقع فوراً.`,
        messageEn: `(${updated.nameEn}) updated to ${updated.priceSAR} SAR and updated across the live portal.`
      });
    } else {
      const newSrv: Service = {
        id: `srv-custom-${Date.now()}`,
        nameEn: formNameEn.trim() || 'Custom Luxury Treatment',
        nameAr: formNameAr.trim() || 'علاج صالون فاخر مخصص',
        category: formCategory,
        priceSAR: Math.max(1, Number(formPrice)),
        durationMin: Math.max(5, Number(formDuration)),
        descriptionEn: formDescEn.trim() || 'Exclusive personalized clinical treatment curated by Rozana specialists.',
        descriptionAr: formDescAr.trim() || 'جلسة علاجية فاخرة ومخصصة بعناية فائقة بأيدي خبيرات صالون روزانة.',
        imageUrl: finalImage,
        isSignature: formIsSignature,
        rating: 5.0,
        reviewsCount: 1,
        badgeEn: formBadgeEn.trim() || (formIsSignature ? 'Royal Signature' : undefined),
        badgeAr: formBadgeAr.trim() || (formIsSignature ? 'جلسة ملكية فاخرة' : undefined),
        benefitsEn: ['Custom clinical luxury formulation', 'Expert stylist execution'],
        benefitsAr: ['تركيبة ملكية فاخرة ومختبرة', 'تنفيذ بأيدي خبيرات تجميل معتمدات']
      };

      onAddService(newSrv);
      setIsAddOpen(false);

      addToast({
        type: 'success',
        titleAr: '🎉 تمت إضافة الخدمة الجديدة بنجاح!',
        titleEn: '🎉 New Service Published!',
        messageAr: `تم نشر خدمة (${newSrv.nameAr}) بسعر ${newSrv.priceSAR} ر.س في قائمة الموقع.`,
        messageEn: `(${newSrv.nameEn}) published at ${newSrv.priceSAR} SAR to public catalog.`
      });
    }
  };

  // Quick Price Save
  const handleSaveQuickPrice = (srv: Service) => {
    if (quickPriceValue <= 0 || quickPriceValue === srv.priceSAR) {
      setQuickPriceId(null);
      return;
    }
    const updated: Service = {
      ...srv,
      priceSAR: Number(quickPriceValue)
    };
    onUpdateService(updated);
    setQuickPriceId(null);
    addToast({
      type: 'success',
      titleAr: 'تم تعديل السعر',
      titleEn: 'Price Updated',
      messageAr: `سعر خدمة (${srv.nameAr}) الآن: ${quickPriceValue} ر.س`,
      messageEn: `Price for (${srv.nameEn}) is now ${quickPriceValue} SAR`
    });
  };

  // Filtered Services
  const filteredServices = services.filter((srv) => {
    const matchesCategory = selectedCategory === 'all' || srv.category === selectedCategory;
    const q = searchQuery.toLowerCase().trim();
    if (!q) return matchesCategory;
    const matchesSearch = 
      srv.nameEn.toLowerCase().includes(q) || 
      srv.nameAr.includes(q) || 
      srv.descriptionEn.toLowerCase().includes(q) ||
      srv.descriptionAr.includes(q) ||
      srv.priceSAR.toString().includes(q);
    return matchesCategory && matchesSearch;
  });

  // Presets filtered for modal
  const filteredPresets = presetCategory === 'all' 
    ? LUXURY_IMAGE_PRESETS 
    : LUXURY_IMAGE_PRESETS.filter(p => p.category === presetCategory);

  const signatureCount = services.filter(s => s.isSignature).length;

  return (
    <div className="space-y-8 text-start animate-in fade-in duration-300">
      {/* Top Banner & Control Overview */}
      <div className="rounded-3xl bg-gradient-to-r from-[#18140D] via-[#1C1810] to-[#14120D] border border-[#D4AF37]/30 p-6 sm:p-7 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-xs font-mono text-[#E5C378] font-bold">
                {language === 'ar' ? 'نظام تخصيص الخدمات والأسعار' : 'Live Services Customizer'}
              </span>
              <span className="text-xs text-[#8C8477] font-mono">
                {services.length} {language === 'ar' ? 'خدمة مفعلة' : 'Active Services'}
              </span>
            </div>
            <h2 className="font-playfair text-xl sm:text-2xl font-bold text-[#F8F5EE]">
              {language === 'ar' ? 'تخصيص أسماء وصور وأسعار خدمات الصالون' : 'Customize Salon Services, Pricing & Photos'}
            </h2>
            <p className="text-xs font-tajawal text-[#A89F91] max-w-2xl leading-relaxed">
              {language === 'ar' 
                ? 'يمكنكِ تعديل اسم أي خدمة، سعرها بالريال، وتغيير صورتها عبر رابط مباشر أو رفعها من جهازك أو الاختيار من مكتبة الصور الملكية، وتنعكس جميع التغييرات فوراً على الموقع وصفحة الحجز.'
                : 'Freely customize any service name, price in SAR, and image via direct URL, file upload, or curated luxury photo presets. Updates reflect instantaneously across the customer booking engine.'}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            {onResetToDefaults && (
              <button
                id="reset-services-default-btn"
                onClick={() => setResetConfirmOpen(true)}
                className="px-4 py-2.5 rounded-full bg-[#18140E] hover:bg-[#221B13] border border-white/10 text-xs font-tajawal font-bold text-[#A89F91] hover:text-[#E5C378] flex items-center gap-2 transition-all cursor-pointer shadow-sm"
                title="Restore Default Catalog"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'استعادة الافتراضي' : 'Reset Defaults'}</span>
              </button>
            )}

            <button
              id="admin-add-service-btn"
              onClick={handleOpenAdd}
              className="px-5 py-2.5 rounded-full luxe-gold-btn text-xs font-tajawal font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'ar' ? 'إضافة خدمة جديدة' : 'Add New Service'}</span>
            </button>
          </div>
        </div>

        {/* Quick Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10 text-xs font-tajawal">
          <div className="p-3 rounded-2xl bg-[#110F0A] border border-white/5">
            <span className="text-[#8C8477] text-[11px] block">{language === 'ar' ? 'إجمالي الخدمات' : 'Total Catalog'}</span>
            <span className="text-base font-bold font-playfair text-[#F8F5EE]">{services.length} {language === 'ar' ? 'خدمة' : 'Items'}</span>
          </div>
          <div className="p-3 rounded-2xl bg-[#110F0A] border border-white/5">
            <span className="text-[#8C8477] text-[11px] block">{language === 'ar' ? 'الخدمات الملكية' : 'Signature Services'}</span>
            <span className="text-base font-bold font-playfair text-[#E5C378]">{signatureCount} {language === 'ar' ? 'ملكية' : 'Signature'}</span>
          </div>
          <div className="p-3 rounded-2xl bg-[#110F0A] border border-white/5">
            <span className="text-[#8C8477] text-[11px] block">{language === 'ar' ? 'أقل سعر' : 'Starting Price'}</span>
            <span className="text-base font-bold font-mono text-[#E5C378]">
              {services.length > 0 ? Math.min(...services.map(s => s.priceSAR)) : 0} SAR
            </span>
          </div>
          <div className="p-3 rounded-2xl bg-[#110F0A] border border-white/5">
            <span className="text-[#8C8477] text-[11px] block">{language === 'ar' ? 'أعلى سعر' : 'Top Tier Price'}</span>
            <span className="text-base font-bold font-mono text-[#E5C378]">
              {services.length > 0 ? Math.max(...services.map(s => s.priceSAR)) : 0} SAR
            </span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={language === 'ar' ? 'ابحثي بالاسم (عربي / English) أو السعر...' : 'Search by name, price, or description...'}
            className="w-full px-4 py-2.5 rounded-2xl bg-[#13110C] border border-white/10 text-xs text-[#F8F5EE] focus:border-[#E5C378] outline-none ps-9 font-tajawal shadow-sm"
          />
          <Search className="w-4 h-4 text-[#8C8477] absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute end-3 top-1/2 -translate-y-1/2 text-xs text-[#777] hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {(['all', 'facial', 'keratin', 'haircut', 'nails', 'spa'] as ServiceCategory[]).map((cat) => {
            const count = cat === 'all' ? services.length : services.filter(s => s.category === cat).length;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-tajawal font-bold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1.5 ${
                  selectedCategory === cat
                    ? 'bg-[#E5C378] text-[#0E0C09] shadow-md'
                    : 'bg-[#18150F] text-[#A89F91] border border-white/5 hover:border-white/20'
                }`}
              >
                <span>{cat.toUpperCase()}</span>
                <span className="text-[10px] opacity-75 font-mono">({count})</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-[#13110C] border border-white/10 space-y-3">
          <AlertCircle className="w-10 h-10 text-[#8C8477] mx-auto opacity-60" />
          <h3 className="font-playfair text-lg text-[#F8F5EE]">
            {language === 'ar' ? 'لا توجد خدمات مطابقة للبحث' : 'No matching services found'}
          </h3>
          <p className="text-xs text-[#8C8477] max-w-md mx-auto">
            {language === 'ar' ? 'جربي البحث بكلمات أخرى أو غيري القسم المحدد.' : 'Try adjusting your search terms or category filter.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((srv) => {
            const isQuickEditing = quickPriceId === srv.id;

            return (
              <div
                key={srv.id}
                id={`admin-service-card-${srv.id}`}
                className="group rounded-3xl bg-[#13110C] border border-white/10 overflow-hidden flex flex-col justify-between hover:border-[#D4AF37]/50 transition-all shadow-lg hover:shadow-2xl hover:shadow-[#D4AF37]/5"
              >
                <div>
                  {/* Image Banner with Badges */}
                  <div className="relative aspect-[16/9] w-full bg-[#18150F] overflow-hidden">
                    {srv.imageUrl ? (
                      <img
                        src={srv.imageUrl}
                        alt={srv.nameEn}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          // Fallback to placeholder if broken image
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop&q=80';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-[#777] gap-1">
                        <ImageIcon className="w-8 h-8 opacity-40" />
                        <span className="text-[10px] text-[#8C8477]">{language === 'ar' ? 'لا توجد صورة' : 'No photo'}</span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-[#0E0C09] via-transparent to-black/40" />

                    {/* Category & Signature badges */}
                    <div className="absolute top-3 start-3 flex items-center gap-2">
                      <span className="px-2.5 py-1 rounded-full bg-[#0E0C09]/85 backdrop-blur-md text-[10px] font-mono text-[#E5C378] border border-[#D4AF37]/30 uppercase font-bold">
                        {srv.category}
                      </span>
                      {srv.isSignature && (
                        <span className="px-2.5 py-1 rounded-full bg-gradient-to-r from-[#D4AF37] to-[#F3E5AB] text-[10px] font-tajawal font-black text-[#0E0C09] flex items-center gap-1 shadow-sm">
                          <Crown className="w-3 h-3" />
                          <span>{language === 'ar' ? 'ملكي' : 'Signature'}</span>
                        </span>
                      )}
                    </div>

                    {/* Price Badge on Top Right */}
                    <div className="absolute top-3 end-3">
                      <div className="px-3 py-1 rounded-xl bg-[#0E0C09]/90 backdrop-blur-md border border-[#D4AF37]/40 text-xs font-mono font-bold text-[#E5C378] shadow-md">
                        {srv.priceSAR} SAR
                      </div>
                    </div>

                    {/* Duration on bottom */}
                    <div className="absolute bottom-3 start-3 flex items-center gap-1 text-[11px] font-mono text-[#F8F5EE]/90 bg-black/60 px-2.5 py-0.5 rounded-lg backdrop-blur-sm">
                      <Clock className="w-3 h-3 text-[#E5C378]" />
                      <span>{srv.durationMin} min</span>
                    </div>
                  </div>

                  {/* Body details */}
                  <div className="p-5 space-y-2.5">
                    <div>
                      <h4 className="font-playfair text-base font-bold text-[#F8F5EE] line-clamp-1 group-hover:text-[#E5C378] transition-colors">
                        {srv.nameEn}
                      </h4>
                      <p className="font-tajawal text-xs text-[#E5C378] font-bold line-clamp-1 mt-0.5">
                        {srv.nameAr}
                      </p>
                    </div>

                    <p className="font-tajawal text-xs text-[#A89F91] line-clamp-2 leading-relaxed">
                      {language === 'ar' ? srv.descriptionAr : srv.descriptionEn}
                    </p>

                    {/* Quick Inline Price Editor if triggered */}
                    {isQuickEditing ? (
                      <div className="p-3 rounded-2xl bg-[#1C1811] border border-[#E5C378]/40 space-y-2 mt-3 animate-in fade-in">
                        <label className="text-[11px] font-tajawal font-bold text-[#E5C378] block">
                          {language === 'ar' ? 'تعديل السعر السريع (SAR)' : 'Quick Price Change (SAR)'}:
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="1"
                            max="10000"
                            value={quickPriceValue}
                            onChange={(e) => setQuickPriceValue(Number(e.target.value))}
                            className="w-24 px-2.5 py-1.5 rounded-xl bg-[#13100A] border border-white/20 text-xs font-mono font-bold text-[#F8F5EE] focus:border-[#E5C378] outline-none"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveQuickPrice(srv)}
                            className="px-3 py-1.5 rounded-xl bg-[#E5C378] text-[#0E0C09] font-tajawal font-bold text-xs cursor-pointer hover:bg-[#F3E5AB]"
                          >
                            {language === 'ar' ? 'حفظ' : 'Save'}
                          </button>
                          <button
                            onClick={() => setQuickPriceId(null)}
                            className="px-2.5 py-1.5 rounded-xl bg-white/10 text-xs font-tajawal text-[#CCC] cursor-pointer hover:bg-white/20"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between pt-2 border-t border-white/5 text-xs font-mono text-[#8C8477]">
                        <span className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5 fill-[#E5C378] text-[#E5C378]" />
                          <span>{srv.rating} ({srv.reviewsCount})</span>
                        </span>
                        <button
                          onClick={() => {
                            setQuickPriceId(srv.id);
                            setQuickPriceValue(srv.priceSAR);
                          }}
                          className="text-[11px] font-tajawal text-[#A89F91] hover:text-[#E5C378] underline cursor-pointer"
                        >
                          {language === 'ar' ? 'تعديل السعر فقط' : 'Quick edit price'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="p-4 bg-[#18150F] border-t border-white/5 flex items-center justify-between gap-2">
                  <button
                    id={`edit-btn-${srv.id}`}
                    onClick={() => handleOpenEdit(srv)}
                    className="flex-1 py-2.5 rounded-xl bg-[#221D14] hover:bg-[#2E2517] border border-[#D4AF37]/20 hover:border-[#D4AF37] text-xs font-tajawal font-bold text-[#E5C378] flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>{language === 'ar' ? 'تعديل الاسم، السعر والصورة' : 'Edit Name, Price & Photo'}</span>
                  </button>

                  <button
                    onClick={() => setDeleteConfirmId(srv.id)}
                    className="w-10 h-10 rounded-xl bg-red-950/30 hover:bg-red-900/50 border border-red-500/20 hover:border-red-500/40 text-red-300 flex items-center justify-center transition-colors cursor-pointer shrink-0"
                    title={language === 'ar' ? 'حذف الخدمة' : 'Delete Service'}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="max-w-sm w-full rounded-3xl bg-[#14110C] border border-red-500/40 p-6 text-center space-y-4 shadow-2xl">
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto" />
            <h3 className="font-playfair text-lg font-bold text-[#F8F5EE]">
              {language === 'ar' ? 'تأكيد حذف الخدمة' : 'Confirm Service Deletion'}
            </h3>
            <p className="font-tajawal text-xs text-[#A89F91]">
              {language === 'ar' 
                ? 'هل أنتِ متأكدة من حذف هذه الخدمة نهائياً من قائمة الصالون والموقع؟' 
                : 'Are you sure you want to permanently remove this service from the salon catalog?'}
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 py-2.5 rounded-full bg-[#1A1711] border border-white/10 text-xs font-tajawal text-[#D2C8BA] cursor-pointer hover:bg-[#221E17]"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={() => {
                  onDeleteService(deleteConfirmId);
                  setDeleteConfirmId(null);
                  addToast({
                    type: 'info',
                    titleAr: 'تم حذف الخدمة',
                    titleEn: 'Service Deleted',
                    messageAr: 'تم إزالة الخدمة من القائمة بنجاح.',
                    messageEn: 'Service successfully removed from active catalog.'
                  });
                }}
                className="flex-1 py-2.5 rounded-full bg-red-800 hover:bg-red-700 text-xs font-tajawal font-bold text-white cursor-pointer shadow-lg"
              >
                {language === 'ar' ? 'نعم، احذف' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset to Defaults Confirmation Modal */}
      {resetConfirmOpen && onResetToDefaults && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="max-w-md w-full rounded-3xl bg-[#14110C] border border-[#D4AF37]/40 p-6 text-center space-y-4 shadow-2xl">
            <RotateCcw className="w-10 h-10 text-[#E5C378] mx-auto" />
            <h3 className="font-playfair text-lg font-bold text-[#F8F5EE]">
              {language === 'ar' ? 'استعادة الخدمات الافتراضية' : 'Restore Default Services Catalog'}
            </h3>
            <p className="font-tajawal text-xs text-[#A89F91] leading-relaxed">
              {language === 'ar' 
                ? 'سيتم استرجاع قائمة خدمات الصالون الأصلية بجميع أسمائها وأسعارها وصورها الافتراضية. يمكنك دائماً إعادة تخصيصها بعد ذلك.' 
                : 'This will reset all services, names, prices, and photos back to the original default catalog. You can customize them again at any time.'}
            </p>
            <div className="flex gap-3 pt-3">
              <button
                onClick={() => setResetConfirmOpen(false)}
                className="flex-1 py-2.5 rounded-full bg-[#1A1711] border border-white/10 text-xs font-tajawal text-[#D2C8BA] cursor-pointer hover:bg-[#221E17]"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={() => {
                  onResetToDefaults();
                  setResetConfirmOpen(false);
                  addToast({
                    type: 'success',
                    titleAr: 'تمت استعادة الخدمات الافتراضية',
                    titleEn: 'Default Services Restored',
                    messageAr: 'تم تحديث قائمة الخدمات بالبيانات الافتراضية الأصلية.',
                    messageEn: 'Default service catalog and original prices restored.'
                  });
                }}
                className="flex-1 py-2.5 rounded-full luxe-gold-btn text-xs font-tajawal font-bold cursor-pointer shadow-lg"
              >
                {language === 'ar' ? 'تأكيد الاستعادة' : 'Confirm Reset'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Comprehensive Add / Edit Service Modal */}
      {(isAddOpen || editingService) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/90 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-4xl rounded-3xl bg-[#13100C] border border-[#D4AF37]/50 p-6 sm:p-8 shadow-2xl my-6 max-h-[90vh] overflow-y-auto scrollbar-none">
            {/* Close Button */}
            <button
              onClick={() => {
                setIsAddOpen(false);
                setEditingService(null);
              }}
              className="absolute top-5 end-5 w-9 h-9 rounded-full bg-[#1F1A11] border border-white/10 text-[#A89F91] hover:text-white flex items-center justify-center text-sm cursor-pointer transition-colors"
            >
              ✕
            </button>

            {/* Modal Header */}
            <div className="mb-6 border-b border-white/10 pb-5">
              <div className="flex items-center gap-2 mb-1.5">
                <Crown className="w-5 h-5 text-[#E5C378]" />
                <span className="text-xs font-mono uppercase tracking-wider text-[#E5C378] font-bold">
                  {editingService 
                    ? (language === 'ar' ? 'تعديل الخدمة المحددة' : 'Edit Selected Treatment') 
                    : (language === 'ar' ? 'إضافة خدمة ملكية جديدة' : 'Create New Salon Treatment')}
                </span>
              </div>
              <h3 className="font-playfair text-2xl font-bold text-[#F8F5EE]">
                {editingService 
                  ? (language === 'ar' ? `تعديل بيانات: ${editingService.nameAr}` : `Edit: ${editingService.nameEn}`) 
                  : (language === 'ar' ? 'إضافة خدمة فاخرة جديدة' : 'Add New Salon Treatment')}
              </h3>
              <p className="font-tajawal text-xs text-[#A89F91] mt-1">
                {language === 'ar'
                  ? 'حددي الاسم بالعربية والإنجليزية، السعر بالريال السعودي، والصورة (عبر رابط مباشر، رفع من جهازك، أو من معرض الصور الفاخرة).'
                  : 'Customize names (Arabic/English), price in SAR, and image (via URL, device upload, or curated luxury presets).'}
              </p>
            </div>

            <form onSubmit={handleSubmitService} className="space-y-6">
              {/* SECTION 1: Service Names (EN & AR) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-tajawal font-bold text-[#D2C8BA]">
                    {language === 'ar' ? 'اسم الخدمة بالإنجليزية (Name in English)' : 'Service Name (EN)'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formNameEn}
                    onChange={(e) => setFormNameEn(e.target.value)}
                    placeholder="e.g. 24K Liquid Gold Facial Treatment"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#18150F] border border-white/10 text-xs text-[#F8F5EE] focus:border-[#E5C378] outline-none font-sans"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-tajawal font-bold text-[#D2C8BA]">
                    {language === 'ar' ? 'اسم الخدمة بالعربية (Name in Arabic)' : 'Service Name (AR)'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formNameAr}
                    onChange={(e) => setFormNameAr(e.target.value)}
                    placeholder="مثال: جلسة نضارة الذهب عيار 24 قيراط"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#18150F] border border-white/10 text-xs text-[#F8F5EE] focus:border-[#E5C378] outline-none font-tajawal"
                    dir="rtl"
                  />
                </div>
              </div>

              {/* SECTION 2: Pricing, Category & Duration */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-tajawal font-bold text-[#D2C8BA]">
                    {language === 'ar' ? 'القسم / الفئة' : 'Category'} *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => {
                      const newCat = e.target.value as ServiceCategory;
                      setFormCategory(newCat);
                      setPresetCategory(newCat);
                    }}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#18150F] border border-white/10 text-xs text-[#F8F5EE] focus:border-[#E5C378] outline-none cursor-pointer"
                  >
                    <option value="facial">Facial (العناية بالبشرة والوجه)</option>
                    <option value="keratin">Keratin (كيراتين وبروتين الشعر)</option>
                    <option value="haircut">Haircut (قص وتسريحات الشعر)</option>
                    <option value="nails">Nails (العناية بالأظافر والجل)</option>
                    <option value="spa">Spa (سبا وحمام مغربي ملكي)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-tajawal font-bold text-[#D2C8BA]">
                      {language === 'ar' ? 'السعر (ريال سعودي SAR)' : 'Price (SAR)'} *
                    </label>
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setFormPrice(prev => Math.max(10, prev - 10))}
                        className="px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[10px] text-[#E5C378] font-mono cursor-pointer"
                        title="-10 SAR"
                      >
                        -10
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormPrice(prev => prev + 10)}
                        className="px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[10px] text-[#E5C378] font-mono cursor-pointer"
                        title="+10 SAR"
                      >
                        +10
                      </button>
                      <button
                        type="button"
                        onClick={() => setFormPrice(prev => prev + 50)}
                        className="px-1.5 py-0.5 rounded bg-white/10 hover:bg-white/20 text-[10px] text-[#E5C378] font-mono cursor-pointer"
                        title="+50 SAR"
                      >
                        +50
                      </button>
                    </div>
                  </div>
                  <input
                    type="number"
                    min="1"
                    max="15000"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#18150F] border border-white/10 text-xs text-[#E5C378] font-bold font-mono focus:border-[#E5C378] outline-none text-base"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-tajawal font-bold text-[#D2C8BA]">
                    {language === 'ar' ? 'مدة الجلسة (بالدقائق)' : 'Duration (Minutes)'} *
                  </label>
                  <input
                    type="number"
                    min="5"
                    max="480"
                    step="5"
                    required
                    value={formDuration}
                    onChange={(e) => setFormDuration(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#18150F] border border-white/10 text-xs text-[#F8F5EE] focus:border-[#E5C378] outline-none font-mono"
                  />
                </div>
              </div>

              {/* SECTION 3: IMAGE CUSTOMIZATION (The Core Feature) */}
              <div className="p-5 rounded-2xl bg-[#18140D] border border-[#D4AF37]/30 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-tajawal font-bold text-[#E5C378] flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-[#E5C378]" />
                      <span>{language === 'ar' ? 'تخصيص وتعيين صورة الخدمة' : 'Service Image Customizer'}</span>
                    </h4>
                    <p className="text-[11px] text-[#A89F91] mt-0.5">
                      {language === 'ar' 
                        ? 'اختاري بين إدخال رابط صورة، أو رفعها مباشرة من جهازك، أو اختيار صورة من مكتبة الصالون الفاخرة.' 
                        : 'Choose between pasting a direct image URL, uploading from your device, or selecting from curated salon presets.'}
                    </p>
                  </div>

                  {/* Mode Selector Tabs */}
                  <div className="flex items-center gap-1 p-1 rounded-xl bg-[#100E0A] border border-white/10 shrink-0">
                    <button
                      type="button"
                      onClick={() => setImageTab('presets')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-tajawal font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        imageTab === 'presets'
                          ? 'bg-[#E5C378] text-[#0E0C09]'
                          : 'text-[#A89F91] hover:text-white'
                      }`}
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{language === 'ar' ? 'معرض الصور' : 'Presets'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setImageTab('url')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-tajawal font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        imageTab === 'url'
                          ? 'bg-[#E5C378] text-[#0E0C09]'
                          : 'text-[#A89F91] hover:text-white'
                      }`}
                    >
                      <LinkIcon className="w-3.5 h-3.5" />
                      <span>{language === 'ar' ? 'رابط URL' : 'Direct URL'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setImageTab('upload')}
                      className={`px-3 py-1.5 rounded-lg text-xs font-tajawal font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                        imageTab === 'upload'
                          ? 'bg-[#E5C378] text-[#0E0C09]'
                          : 'text-[#A89F91] hover:text-white'
                      }`}
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{language === 'ar' ? 'رفع صورة' : 'Upload File'}</span>
                    </button>
                  </div>
                </div>

                {/* Sub-Panel 1: Presets Gallery */}
                {imageTab === 'presets' && (
                  <div className="space-y-3 pt-2">
                    {/* Category filter inside presets */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                      {(['all', 'facial', 'keratin', 'haircut', 'nails', 'spa'] as ServiceCategory[]).map((cat) => (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setPresetCategory(cat)}
                          className={`px-2.5 py-1 rounded-lg font-tajawal font-bold transition-colors cursor-pointer text-[11px] ${
                            presetCategory === cat
                              ? 'bg-[#E5C378] text-[#0E0C09]'
                              : 'bg-[#221C14] text-[#A89F91] hover:text-white'
                          }`}
                        >
                          {cat.toUpperCase()}
                        </button>
                      ))}
                    </div>

                    {/* Presets Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 max-h-48 overflow-y-auto p-1 scrollbar-none">
                      {filteredPresets.map((preset) => {
                        const isSelected = formImageUrl === preset.url;
                        return (
                          <button
                            key={preset.id}
                            type="button"
                            onClick={() => {
                              setFormImageUrl(preset.url);
                              setImageError(false);
                            }}
                            className={`group relative rounded-xl overflow-hidden aspect-[4/3] border-2 transition-all cursor-pointer text-start ${
                              isSelected
                                ? 'border-[#E5C378] ring-2 ring-[#E5C378]/50 scale-[1.02]'
                                : 'border-white/10 hover:border-white/30 opacity-80 hover:opacity-100'
                            }`}
                          >
                            <img
                              src={preset.url}
                              alt={preset.titleEn}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1.5">
                              <span className="text-[10px] font-tajawal text-white truncate font-bold">
                                {language === 'ar' ? preset.titleAr : preset.titleEn}
                              </span>
                            </div>
                            {isSelected && (
                              <div className="absolute top-1.5 end-1.5 w-5 h-5 rounded-full bg-[#E5C378] text-[#0E0C09] flex items-center justify-center">
                                <Check className="w-3 h-3 stroke-[3]" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Sub-Panel 2: Direct URL Input */}
                {imageTab === 'url' && (
                  <div className="space-y-2 pt-2">
                    <div className="flex gap-2">
                      <input
                        type="url"
                        value={formImageUrl}
                        onChange={(e) => {
                          setFormImageUrl(e.target.value);
                          setImageError(false);
                        }}
                        placeholder="https://images.unsplash.com/... or any direct image link"
                        className="flex-1 px-4 py-2.5 rounded-xl bg-[#12100B] border border-white/10 text-xs text-[#F8F5EE] focus:border-[#E5C378] outline-none font-mono"
                      />
                      {formImageUrl && (
                        <button
                          type="button"
                          onClick={() => setFormImageUrl('')}
                          className="px-3 py-2 rounded-xl bg-white/10 text-xs text-[#A89F91] hover:text-white cursor-pointer"
                        >
                          {language === 'ar' ? 'مسح' : 'Clear'}
                        </button>
                      )}
                    </div>
                    <p className="text-[11px] text-[#8C8477]">
                      {language === 'ar' 
                        ? 'يمكنكِ لصق أي رابط صورة خارجي من Unsplash أو Pinterest أو Cloudinary أو موقعك.' 
                        : 'Paste any HTTPS direct image URL from Unsplash, Pinterest, Cloudinary, etc.'}
                    </p>
                  </div>
                )}

                {/* Sub-Panel 3: Upload from Device */}
                {imageTab === 'upload' && (
                  <div className="space-y-3 pt-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      accept="image/*"
                      className="hidden"
                    />
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-[#D4AF37]/40 hover:border-[#E5C378] rounded-2xl p-6 text-center cursor-pointer transition-colors bg-[#14110C] hover:bg-[#1A1610]"
                    >
                      <Upload className="w-8 h-8 text-[#E5C378] mx-auto mb-2 opacity-80" />
                      <p className="text-xs font-tajawal font-bold text-[#F8F5EE]">
                        {language === 'ar' ? 'اضغطي هنا لاختيار صورة من هاتفك أو جهازك' : 'Click here to choose a photo from your phone or device'}
                      </p>
                      <p className="text-[11px] text-[#8C8477] mt-1">
                        PNG, JPG, WEBP ({language === 'ar' ? 'يتم حفظها مباشرة داخل الموقع' : 'Stored directly inside the application'})
                      </p>
                    </div>
                  </div>
                )}

                {/* Live Card Preview of the newly set image & service details */}
                <div className="pt-3 border-t border-white/10 flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-28 h-20 rounded-xl overflow-hidden border border-[#D4AF37]/50 bg-black shrink-0 relative">
                    {formImageUrl && !imageError ? (
                      <img
                        src={formImageUrl}
                        alt="Service Preview"
                        className="w-full h-full object-cover"
                        onError={() => setImageError(true)}
                      />
                    ) : (
                      <div className="w-full h-full flex flex-col items-center justify-center text-[#777] text-[10px] p-1 text-center">
                        <ImageIcon className="w-5 h-5 opacity-40 mb-0.5" />
                        <span>{imageError ? 'رابط غير صالح' : 'معاينة الصورة'}</span>
                      </div>
                    )}
                    <span className="absolute bottom-1 end-1 px-1.5 py-0.2 rounded bg-black/80 text-[9px] font-mono text-[#E5C378]">
                      {formPrice} SAR
                    </span>
                  </div>

                  <div className="text-xs space-y-0.5 flex-1">
                    <span className="text-[10px] text-[#8C8477] uppercase font-mono block">
                      {language === 'ar' ? 'المعاينة المباشرة على الموقع:' : 'Live Customer Portal Preview:'}
                    </span>
                    <h5 className="font-playfair font-bold text-[#F8F5EE] text-sm line-clamp-1">
                      {formNameEn || 'Sample Service Title'}
                    </h5>
                    <p className="font-tajawal text-xs text-[#E5C378] line-clamp-1">
                      {formNameAr || 'عنوان الخدمة بالعربية'}
                    </p>
                  </div>
                </div>
              </div>

              {/* SECTION 4: Descriptions (EN & AR) */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-tajawal font-bold text-[#D2C8BA]">
                    {language === 'ar' ? 'الوصف بالإنجليزية' : 'Description (EN)'}
                  </label>
                  <textarea
                    rows={3}
                    value={formDescEn}
                    onChange={(e) => setFormDescEn(e.target.value)}
                    placeholder="Provide a luxurious clinical treatment description for English speaking clients..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#18150F] border border-white/10 text-xs text-[#F8F5EE] focus:border-[#E5C378] outline-none font-sans leading-relaxed"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-tajawal font-bold text-[#D2C8BA]">
                    {language === 'ar' ? 'الوصف بالعربية' : 'Description (AR)'}
                  </label>
                  <textarea
                    rows={3}
                    value={formDescAr}
                    onChange={(e) => setFormDescAr(e.target.value)}
                    placeholder="تفاصيل الجلسة، خطوات العناية والفوائد للبشرة أو الشعر..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#18150F] border border-white/10 text-xs text-[#F8F5EE] focus:border-[#E5C378] outline-none font-tajawal leading-relaxed"
                    dir="rtl"
                  />
                </div>
              </div>

              {/* SECTION 5: Signature Treatment Toggle & Optional Badges */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-2xl bg-[#18150F] border border-white/10">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="signature-checkbox-modal"
                    checked={formIsSignature}
                    onChange={(e) => setFormIsSignature(e.target.checked)}
                    className="w-5 h-5 rounded text-[#E5C378] accent-[#D4AF37] cursor-pointer"
                  />
                  <div>
                    <label htmlFor="signature-checkbox-modal" className="text-xs font-tajawal font-bold text-[#F8F5EE] cursor-pointer block">
                      {language === 'ar' ? 'تمييز كخدمة ملكية مميزة (Signature Treatment)' : 'Mark as Signature Luxury Treatment'}
                    </label>
                    <span className="text-[11px] text-[#8C8477]">
                      {language === 'ar' ? 'ستظهر بشارة التميز الذهبية في أعلى القائمة وبداية الموقع.' : 'Appears with gold crown badge and high spotlight priority.'}
                    </span>
                  </div>
                </div>

                <div className="w-full sm:w-60">
                  <input
                    type="text"
                    value={language === 'ar' ? formBadgeAr : formBadgeEn}
                    onChange={(e) => {
                      if (language === 'ar') setFormBadgeAr(e.target.value);
                      else setFormBadgeEn(e.target.value);
                    }}
                    placeholder={language === 'ar' ? 'شارة مخصصة (مثال: الأكثر طلباً)' : 'Custom badge (e.g. Most Popular)'}
                    className="w-full px-3 py-1.5 rounded-xl bg-[#12100B] border border-white/10 text-xs text-[#E5C378] focus:border-[#E5C378] outline-none font-tajawal"
                  />
                </div>
              </div>

              {/* Modal Actions Footer */}
              <div className="flex items-center gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => {
                    setIsAddOpen(false);
                    setEditingService(null);
                  }}
                  className="flex-1 py-3 rounded-full bg-[#1A1711] hover:bg-[#242018] border border-white/10 text-xs font-tajawal text-[#D2C8BA] cursor-pointer transition-colors"
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>

                <button
                  id="save-service-submit-btn"
                  type="submit"
                  className="flex-2 py-3 rounded-full luxe-gold-btn text-xs font-tajawal font-bold flex items-center justify-center gap-2 cursor-pointer shadow-xl hover:shadow-2xl"
                >
                  <Save className="w-4 h-4" />
                  <span>
                    {editingService 
                      ? (language === 'ar' ? 'حفظ التعديلات ونشرها فوراً' : 'Save & Publish Changes') 
                      : (language === 'ar' ? 'إضافة ونشر الخدمة الجديدة' : 'Publish New Treatment')}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
