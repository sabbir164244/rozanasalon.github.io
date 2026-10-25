import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { GiftCard, GiftCardTheme } from '../../types';
import { 
  Gift, 
  Sparkles, 
  Send, 
  CreditCard, 
  Check, 
  Copy, 
  Printer, 
  MessageCircle, 
  ShieldCheck, 
  Calendar, 
  User, 
  Mail, 
  Phone, 
  Heart,
  Search,
  ArrowRight,
  ExternalLink,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface DigitalGiftCardSectionProps {
  giftCards: GiftCard[];
  onPurchaseGiftCard: (newCard: GiftCard) => void;
  onBookWithGiftCard?: (code: string) => void;
}

const PRESET_AMOUNTS = [
  { value: 250, labelEn: 'Glow & Refresh', labelAr: 'نضارة وانتعاش', tagEn: 'Starter', tagAr: 'انتعاش' },
  { value: 500, labelEn: 'Haute Signature', labelAr: 'التوقيع الفاخر', tagEn: 'Most Popular', tagAr: 'الأكثر طلباً', popular: true },
  { value: 1000, labelEn: 'Imperial Day Spa', labelAr: 'يوم سبا إمبراطوري', tagEn: 'VIP Luxury', tagAr: 'دلال ملكي' },
  { value: 2500, labelEn: 'Royal Bridal Sanctum', labelAr: 'باقة العروس الملكية', tagEn: 'Grand Gift', tagAr: 'هدية العمر' },
];

const CARD_THEMES: { id: GiftCardTheme; nameEn: string; nameAr: string; bgClass: string; accentColor: string; borderClass: string }[] = [
  {
    id: 'gold-onyx',
    nameEn: 'Midnight Onyx & 24K Gold',
    nameAr: 'أونيكس الذهب عيار 24',
    bgClass: 'bg-gradient-to-br from-[#1C1811] via-[#0E0C09] to-[#2B2313]',
    accentColor: '#E5C378',
    borderClass: 'border-[#D4AF37]/50 shadow-[0_0_30px_rgba(212,175,55,0.25)]',
  },
  {
    id: 'royal-rose',
    nameEn: 'Imperial Velvet Rose',
    nameAr: 'المخمل الوردي الملكي',
    bgClass: 'bg-gradient-to-br from-[#2A1017] via-[#15070B] to-[#3D1421]',
    accentColor: '#F5B0C2',
    borderClass: 'border-[#F5B0C2]/40 shadow-[0_0_30px_rgba(245,176,194,0.2)]',
  },
  {
    id: 'emerald-palace',
    nameEn: 'Emerald Palace Sanctuary',
    nameAr: 'الزمرد الإمبراطوري',
    bgClass: 'bg-gradient-to-br from-[#0B2117] via-[#05110C] to-[#123626]',
    accentColor: '#52C79A',
    borderClass: 'border-[#52C79A]/40 shadow-[0_0_30px_rgba(82,199,154,0.2)]',
  },
  {
    id: 'pearl-minimal',
    nameEn: 'Haute Pearl Platinum',
    nameAr: 'اللؤلؤ البلاتيني النقي',
    bgClass: 'bg-gradient-to-br from-[#232529] via-[#141518] to-[#2E3137]',
    accentColor: '#E2E8F0',
    borderClass: 'border-[#CBD5E1]/40 shadow-[0_0_30px_rgba(226,232,240,0.15)]',
  },
];

const MESSAGE_PRESETS = [
  { ar: 'ألف مبروك الترقية والنجاح الدائم! استمتعي بيوم دلال ملكي ❤️', en: 'Congratulations on your achievements! Enjoy a royal pampering day ❤️' },
  { ar: 'عيد ميلاد سعيد يا أغلى الناس، لكِ مني كل الحب والتقدير ✨', en: 'Happy Birthday! Wishing you radiance and relaxation ✨' },
  { ar: 'مبارك ليلة العمر يا أجمل عروس، بداية سعيدة مليئة بالجمال 💍', en: 'To the most beautiful bride, wishing you a lifetime of joy and elegance 💍' },
  { ar: 'هدية شكر وامتنان من أعماق القلب، تستحقين الاسترخاء والراحة 🌸', en: 'With heartfelt gratitude, you truly deserve to unwind and rejuvenate 🌸' }
];

export const DigitalGiftCardSection: React.FC<DigitalGiftCardSectionProps> = ({
  giftCards,
  onPurchaseGiftCard,
  onBookWithGiftCard,
}) => {
  const { language, isRTL } = useLanguage();

  // Active View Tab: 'purchase' | 'balance'
  const [activeTab, setActiveTab] = useState<'purchase' | 'balance'>('purchase');

  // Purchase Form States
  const [selectedAmount, setSelectedAmount] = useState<number>(500);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [selectedTheme, setSelectedTheme] = useState<GiftCardTheme>('gold-onyx');
  
  const [recipientName, setRecipientName] = useState<string>('');
  const [recipientEmail, setRecipientEmail] = useState<string>('');
  const [recipientPhone, setRecipientPhone] = useState<string>('');
  
  const [senderName, setSenderName] = useState<string>('');
  const [senderEmail, setSenderEmail] = useState<string>('');
  const [senderPhone, setSenderPhone] = useState<string>('');
  
  const [personalMessage, setPersonalMessage] = useState<string>('ألف مبروك! استمتعي بيوم دلال ملكي في صالون روزانة الفاخر بالشميسي ❤️');
  const [paymentMethod, setPaymentMethod] = useState<'apple_pay' | 'mada' | 'credit_card'>('apple_pay');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Generated Card for Voucher modal
  const [purchasedCard, setPurchasedCard] = useState<GiftCard | null>(null);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  // Balance Check States
  const [searchCode, setSearchCode] = useState<string>('');
  const [foundCard, setFoundCard] = useState<GiftCard | null>(null);
  const [searchFeedback, setSearchFeedback] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Calculate actual amount in SAR
  const finalAmount = isCustom ? (parseFloat(customAmount) || 0) : selectedAmount;

  // Selected Theme Details
  const activeThemeObj = CARD_THEMES.find(t => t.id === selectedTheme) || CARD_THEMES[0];

  // Handle Form Submission
  const handlePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (finalAmount < 100) {
      setErrorMessage(language === 'ar' ? 'الحد الأدنى لقيمة بطاقة الإهداء هو ١٠٠ ريال سعودي' : 'Minimum gift card value is 100 SAR');
      return;
    }
    if (!recipientName.trim()) {
      setErrorMessage(language === 'ar' ? 'الرجاء إدخال اسم المستلم' : 'Please enter recipient name');
      return;
    }
    if (!senderName.trim()) {
      setErrorMessage(language === 'ar' ? 'الرجاء إدخال اسمك (المرسل)' : 'Please enter sender name');
      return;
    }

    setIsProcessing(true);

    // Simulate checkout process
    setTimeout(() => {
      // Generate unique serial code: ROZ-XXXX-XXXX
      const randomPart1 = Math.floor(1000 + Math.random() * 9000);
      const randomPart2 = Math.floor(1000 + Math.random() * 9000);
      const generatedCode = `ROZ-GIFT-${randomPart1}`;

      const issueDate = new Date();
      const expiryDate = new Date();
      expiryDate.setFullYear(issueDate.getFullYear() + 1);

      const newGiftCard: GiftCard = {
        id: `gift-${Date.now()}`,
        code: generatedCode,
        amountSAR: finalAmount,
        remainingBalanceSAR: finalAmount,
        senderName: senderName.trim(),
        senderEmail: senderEmail.trim() || 'guest@rozana.sa',
        senderPhone: senderPhone.trim(),
        recipientName: recipientName.trim(),
        recipientEmail: recipientEmail.trim() || 'recipient@domain.sa',
        recipientPhone: recipientPhone.trim(),
        personalMessage: personalMessage.trim(),
        designTheme: selectedTheme,
        deliveryType: 'instant',
        status: 'active',
        issuedAt: issueDate.toISOString(),
        expiresAt: expiryDate.toISOString(),
        paymentMethod: paymentMethod === 'apple_pay' ? 'Apple Pay' : paymentMethod === 'mada' ? 'Mada Debit' : 'Credit Card',
        paymentRef: `PAY-${Math.floor(100000 + Math.random() * 900000)}`,
        redemptionHistory: []
      };

      onPurchaseGiftCard(newGiftCard);
      setPurchasedCard(newGiftCard);
      setIsProcessing(false);

      // Trigger luxury celebration confetti
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#D4AF37', '#E5C378', '#FFFFFF', '#AA771C']
        });
      } catch (err) {
        // ignore
      }
    }, 1000);
  };

  // Handle Balance Verification
  const handleCheckBalance = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchFeedback(null);
    setFoundCard(null);

    const query = searchCode.trim().toUpperCase();
    if (!query) {
      setSearchFeedback({
        type: 'error',
        text: language === 'ar' ? 'يرجى كتابة رمز بطاقة الإهداء' : 'Please enter a gift card code'
      });
      return;
    }

    const match = giftCards.find(c => c.code.toUpperCase() === query);
    if (match) {
      setFoundCard(match);
      setSearchFeedback({
        type: 'success',
        text: language === 'ar' ? 'تم العثور على البطاقة بنجاح!' : 'Gift card found!'
      });
    } else {
      setSearchFeedback({
        type: 'error',
        text: language === 'ar' ? 'عذراً، لم يتم العثور على بطاقة مطابقة لهذا الرمز. يرجى التأكد من الرمز والمحاولة ثانية.' : 'No matching gift card found. Please verify the code.'
      });
    }
  };

  // Copy code helper
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2500);
  };

  // WhatsApp Share URL generator
  const getWhatsAppShareUrl = (card: GiftCard) => {
    const text = language === 'ar'
      ? `✨ إهداء فاخر من صالون روزانة (حي الشميسي، الرياض) ✨\n\nعزيزتي ${card.recipientName}،\nأهدتكِ ${card.senderName} بطاقة إهداء رقمية فاخرة بقيمة ${card.amountSAR} ريال سعودي!\n\n💌 رسالة الإهداء:\n"${card.personalMessage || 'كل عام وأنتِ الأجمل'}"\n\n🔑 رمز البطاقة للصرف:\n${card.code}\n\n📍 الموقع: صالون روزانة، حي الشميسي، الرياض\nساعات العمل: ١٢:٠٠ ظهراً - ١١:٠٠ مساءً يومياً\nلحجز موعدك تفضلي بزيارة الصالون أو الموقع الإلكتروني.`
      : `✨ A Luxury Gift from Rozana Salon (Al Shumaisi, Riyadh) ✨\n\nDear ${card.recipientName},\n${card.senderName} has gifted you a digital luxury gift voucher of ${card.amountSAR} SAR!\n\n💌 Personal Note:\n"${card.personalMessage || 'Enjoy a royal day at Rozana Salon'}"\n\n🔑 Your Gift Code:\n${card.code}\n\n📍 Location: Rozana Salon, Al Shumaisi, Riyadh\nHours: 12:00 PM – 11:00 PM Daily.`;

    const phoneSanitized = card.recipientPhone?.replace(/\D/g, '') || '';
    if (phoneSanitized) {
      return `https://wa.me/${phoneSanitized}?text=${encodeURIComponent(text)}`;
    }
    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  };

  return (
    <section id="giftcards" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#0A0907] overflow-hidden border-t border-[#D4AF37]/15">
      {/* Ambient Lighting */}
      <div className="absolute top-1/4 right-1/3 w-[500px] h-[500px] bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-[#AA771C]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1A160E] border border-[#D4AF37]/30 text-[#E5C378] text-xs font-tajawal font-medium mb-4">
            <Gift className="w-4 h-4 text-[#E5C378]" />
            <span>{language === 'ar' ? 'بطاقات الإهداء الرقمية الفاخرة' : 'Digital Luxury Gift Cards'}</span>
          </div>

          <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold text-[#F8F5EE] mb-4 tracking-tight">
            {language === 'ar' ? 'أهدي من تحبين تجربة دلال ملكية لا تُنسى' : 'Gift an Unforgettable Royal Experience'}
          </h2>

          <p className="font-tajawal text-sm sm:text-base text-[#A89F91] leading-relaxed">
            {language === 'ar'
              ? 'شاركي لحظات الفخامة والجمال مع أحبائك. بطاقة إهداء روزانة الرقمية تُرسل فوراً عبر الواتساب والبريد الإلكتروني، صالحة لجميع علاجات الشعر ونضارة الذهب وعلاجات السبا في فرع الشميسي بالرياض.'
              : 'Share timeless pampering with loved ones. Sent instantly via WhatsApp or email, redeemable across all 24K gold facials, keratin therapies, and spa treatments at our Al Shumaisi atelier.'}
          </p>

          {/* Module Nav Switcher (Purchase vs Check Balance) */}
          <div className="inline-flex items-center p-1 rounded-full bg-[#14120D] border border-[#D4AF37]/25 mt-8">
            <button
              onClick={() => setActiveTab('purchase')}
              className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-tajawal font-medium transition-all duration-300 cursor-pointer ${
                activeTab === 'purchase'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-[#0C0B08] font-bold shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                  : 'text-[#B8AF9F] hover:text-[#F8F5EE]'
              }`}
            >
              {language === 'ar' ? 'شراء وإرسال بطاقة إهداء' : 'Purchase & Send Gift Card'}
            </button>
            <button
              onClick={() => setActiveTab('balance')}
              className={`px-6 py-2.5 rounded-full text-xs sm:text-sm font-tajawal font-medium transition-all duration-300 cursor-pointer ${
                activeTab === 'balance'
                  ? 'bg-gradient-to-r from-[#D4AF37] to-[#AA771C] text-[#0C0B08] font-bold shadow-[0_0_15px_rgba(212,175,55,0.3)]'
                  : 'text-[#B8AF9F] hover:text-[#F8F5EE]'
              }`}
            >
              {language === 'ar' ? 'التحقق من رصيد بطاقتي' : 'Check Card Balance'}
            </button>
          </div>
        </div>

        {/* Tab 1: Purchase & Customizer */}
        {activeTab === 'purchase' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Column: Live 3D Interactive Luxury Card Preview (5 Cols) */}
            <div className="lg:col-span-5 flex flex-col items-center sticky top-24">
              <div className="w-full text-start mb-3">
                <span className="text-xs font-mono tracking-widest text-[#E5C378] uppercase">
                  {language === 'ar' ? 'معاينة بطاقة الإهداء الفورية' : 'Live Gift Card Preview'}
                </span>
              </div>

              {/* Physical Luxury Card Mockup */}
              <div
                className={`w-full aspect-[1.65/1] rounded-2xl p-6 sm:p-7 relative flex flex-col justify-between overflow-hidden border transition-all duration-500 select-none ${activeThemeObj.bgClass} ${activeThemeObj.borderClass}`}
              >
                {/* Metallic Watermark Pattern */}
                <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
                <div className="absolute -top-16 -right-16 w-48 h-48 rounded-full bg-white/5 blur-xl pointer-events-none" />

                {/* Card Header */}
                <div className="flex items-start justify-between relative z-10">
                  <div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#E5C378]" />
                      <span className="font-cinzel text-xs tracking-[0.25em] text-[#C59D4A] uppercase font-bold">
                        ROZANA SALON
                      </span>
                    </div>
                    <p className="font-tajawal text-[11px] text-[#A89F91] mt-0.5">
                      {language === 'ar' ? 'صالون روزانة • فرع الشميسي' : 'Al Shumaisi Branch • Riyadh'}
                    </p>
                  </div>
                  
                  {/* Luxury Metallic Seal */}
                  <div className="w-9 h-9 rounded-full bg-[#D4AF37]/15 border border-[#D4AF37]/50 flex items-center justify-center text-xs font-serif text-[#E5C378] font-bold shadow-inner">
                    VIP
                  </div>
                </div>

                {/* Card Center: Amount Display */}
                <div className="my-auto relative z-10 text-center sm:text-start">
                  <span className="text-[10px] font-tajawal tracking-wider text-[#A89F91] block uppercase">
                    {language === 'ar' ? 'قيمة الرصيد المهدى' : 'Gift Card Value'}
                  </span>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="font-playfair text-3xl sm:text-4xl font-black text-[#F8F5EE] tracking-tight">
                      {finalAmount.toLocaleString()}
                    </span>
                    <span className="font-tajawal text-xs sm:text-sm font-bold text-[#E5C378]">
                      {language === 'ar' ? 'ريال سعودي' : 'SAR'}
                    </span>
                  </div>
                </div>

                {/* Card Footer: Names & Note snippet */}
                <div className="relative z-10 pt-3 border-t border-white/10 flex items-end justify-between text-xs font-tajawal">
                  <div className="max-w-[70%]">
                    <p className="text-[10px] text-[#8C8477]">
                      {language === 'ar' ? 'إلى:' : 'To:'} <strong className="text-[#F8F5EE] font-medium">{recipientName || (language === 'ar' ? 'اسم المستلمة' : 'Recipient Name')}</strong>
                    </p>
                    <p className="text-[10px] text-[#8C8477] mt-0.5">
                      {language === 'ar' ? 'من:' : 'From:'} <strong className="text-[#E5C378] font-medium">{senderName || (language === 'ar' ? 'اسمك' : 'Your Name')}</strong>
                    </p>
                  </div>

                  <div className="text-end">
                    <span className="text-[9px] font-mono text-[#E5C378] px-2 py-0.5 rounded bg-black/40 border border-white/10">
                      ROZ-GIFT-••••
                    </span>
                    <p className="text-[8px] text-[#8C8477] mt-1 font-mono">
                      {language === 'ar' ? 'صلاحية سنة' : 'Valid 1 Year'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Theme Selector Pills */}
              <div className="w-full mt-5 bg-[#12100C] p-4 rounded-2xl border border-white/5">
                <span className="text-xs font-tajawal font-medium text-[#B8AF9F] block mb-3">
                  {language === 'ar' ? 'اختر نمط ولون البطاقة الفاخر:' : 'Select Card Design Theme:'}
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {CARD_THEMES.map((theme) => (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => setSelectedTheme(theme.id)}
                      className={`p-2.5 rounded-xl border text-start flex items-center gap-2.5 transition-all duration-200 cursor-pointer ${
                        selectedTheme === theme.id
                          ? 'bg-[#1E1911] border-[#E5C378] shadow-[0_0_12px_rgba(229,195,120,0.2)]'
                          : 'bg-[#0E0D0A] border-white/5 hover:border-[#D4AF37]/30'
                      }`}
                    >
                      <span
                        className="w-3.5 h-3.5 rounded-full shrink-0 border border-white/20"
                        style={{ backgroundColor: theme.accentColor }}
                      />
                      <span className="text-xs font-tajawal text-[#EDE7DC] truncate">
                        {language === 'ar' ? theme.nameAr : theme.nameEn}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Assurance Guarantee */}
              <div className="w-full mt-4 flex items-center gap-3 p-3.5 rounded-xl bg-[#14120D] border border-[#D4AF37]/15">
                <ShieldCheck className="w-5 h-5 text-[#E5C378] shrink-0" />
                <p className="text-xs font-tajawal text-[#A89F91]">
                  {language === 'ar'
                    ? 'ضمان روزانة: رصيد آمن ومسجل برقم تسلسلي موثق في نظام فرع الشميسي، لا تنتهي صلاحيته إلا بعد 12 شهراً كاملاً.'
                    : 'Rozana Guarantee: Serialized voucher registered in Al Shumaisi branch registry, valid for 12 full months.'}
                </p>
              </div>
            </div>

            {/* Right Column: Customizer & Purchase Form (7 Cols) */}
            <div className="lg:col-span-7 bg-[#12100C] border border-[#D4AF37]/25 rounded-3xl p-6 sm:p-8 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
              <form onSubmit={handlePurchase} className="space-y-6">
                
                {/* Step 1: Denomination */}
                <div>
                  <label className="block text-xs font-mono uppercase tracking-widest text-[#E5C378] mb-3">
                    1. {language === 'ar' ? 'تحديد قيمة البطاقة (بالريال السعودي)' : 'Select Gift Amount (SAR)'}
                  </label>
                  
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                    {PRESET_AMOUNTS.map((amt) => {
                      const isSelected = !isCustom && selectedAmount === amt.value;
                      return (
                        <button
                          key={amt.value}
                          type="button"
                          onClick={() => {
                            setSelectedAmount(amt.value);
                            setIsCustom(false);
                          }}
                          className={`p-3.5 rounded-xl border text-center transition-all duration-200 cursor-pointer relative ${
                            isSelected
                              ? 'bg-[#211B12] border-[#E5C378] shadow-[0_0_15px_rgba(229,195,120,0.25)]'
                              : 'bg-[#0E0C09] border-white/5 hover:border-[#D4AF37]/30'
                          }`}
                        >
                          {amt.popular && (
                            <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#E5C378] text-[#0C0B08] text-[9px] font-tajawal font-bold px-2 py-0.5 rounded-full shadow">
                              {language === 'ar' ? amt.tagAr : amt.tagEn}
                            </span>
                          )}
                          <div className="font-playfair font-bold text-lg text-[#F8F5EE]">
                            {amt.value} <span className="text-xs font-tajawal text-[#E5C378]">ر.س</span>
                          </div>
                          <p className="text-[11px] font-tajawal text-[#8C8477] mt-0.5">
                            {language === 'ar' ? amt.labelAr : amt.labelEn}
                          </p>
                        </button>
                      );
                    })}
                  </div>

                  {/* Custom Amount Option */}
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      type="button"
                      onClick={() => setIsCustom(true)}
                      className={`text-xs font-tajawal px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                        isCustom
                          ? 'bg-[#211B12] border-[#E5C378] text-[#E5C378]'
                          : 'bg-[#0E0C09] border-white/5 text-[#8C8477] hover:border-white/20'
                      }`}
                    >
                      {language === 'ar' ? 'تحديد مبلغ مخصص آخر' : 'Enter Custom Amount'}
                    </button>
                    {isCustom && (
                      <div className="flex-1 relative">
                        <input
                          type="number"
                          min="100"
                          max="10000"
                          step="50"
                          placeholder={language === 'ar' ? 'أدخل المبلغ (مثال: 750)' : 'Amount (e.g. 750)'}
                          value={customAmount}
                          onChange={(e) => setCustomAmount(e.target.value)}
                          className="w-full bg-[#0E0C09] border border-[#E5C378] rounded-lg px-3.5 py-1.5 text-xs text-[#F8F5EE] focus:outline-none"
                        />
                        <span className="absolute right-3 top-1.5 text-xs font-tajawal text-[#E5C378]">
                          {language === 'ar' ? 'ر.س' : 'SAR'}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Step 2: Recipient Details */}
                <div className="pt-4 border-t border-white/5">
                  <label className="block text-xs font-mono uppercase tracking-widest text-[#E5C378] mb-3">
                    2. {language === 'ar' ? 'بيانات المهداة لها (المستلمة)' : 'Recipient Information'}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-tajawal text-[#B8AF9F] mb-1.5">
                        {language === 'ar' ? 'اسم المستلمة الكامل *' : 'Recipient Full Name *'}
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-[#8C8477] absolute left-3.5 top-3" />
                        <input
                          type="text"
                          required
                          value={recipientName}
                          onChange={(e) => setRecipientName(e.target.value)}
                          placeholder={language === 'ar' ? 'مثال: مها العتيبي' : 'e.g. Maha Al-Otaibi'}
                          className="w-full bg-[#0E0C09] border border-white/10 focus:border-[#E5C378] rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-[#F8F5EE] focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-tajawal text-[#B8AF9F] mb-1.5">
                        {language === 'ar' ? 'رقم الواتساب للاستلام الفوري' : 'WhatsApp Number for Instant Gift'}
                      </label>
                      <div className="relative">
                        <Phone className="w-4 h-4 text-[#8C8477] absolute left-3.5 top-3" />
                        <input
                          type="tel"
                          value={recipientPhone}
                          onChange={(e) => setRecipientPhone(e.target.value)}
                          placeholder="+966 50 123 4567"
                          className="w-full bg-[#0E0C09] border border-white/10 focus:border-[#E5C378] rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-[#F8F5EE] focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 3: Sender Details */}
                <div className="pt-4 border-t border-white/5">
                  <label className="block text-xs font-mono uppercase tracking-widest text-[#E5C378] mb-3">
                    3. {language === 'ar' ? 'بياناتك (المرسل)' : 'Your Information (Sender)'}
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-tajawal text-[#B8AF9F] mb-1.5">
                        {language === 'ar' ? 'اسمك الكريم كما يظهر بالبطاقة *' : 'Your Name as it appears on Card *'}
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 text-[#8C8477] absolute left-3.5 top-3" />
                        <input
                          type="text"
                          required
                          value={senderName}
                          onChange={(e) => setSenderName(e.target.value)}
                          placeholder={language === 'ar' ? 'مثال: سارة الغامدي' : 'e.g. Sarah Al-Ghamdi'}
                          className="w-full bg-[#0E0C09] border border-white/10 focus:border-[#E5C378] rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-[#F8F5EE] focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-tajawal text-[#B8AF9F] mb-1.5">
                        {language === 'ar' ? 'بريدك الإلكتروني (لاستلام الفاتورة)' : 'Your Email (for receipt)'}
                      </label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-[#8C8477] absolute left-3.5 top-3" />
                        <input
                          type="email"
                          value={senderEmail}
                          onChange={(e) => setSenderEmail(e.target.value)}
                          placeholder="you@domain.sa"
                          className="w-full bg-[#0E0C09] border border-white/10 focus:border-[#E5C378] rounded-xl pl-10 pr-3.5 py-2.5 text-xs sm:text-sm text-[#F8F5EE] focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Step 4: Personal Message */}
                <div className="pt-4 border-t border-white/5">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-mono uppercase tracking-widest text-[#E5C378]">
                      4. {language === 'ar' ? 'رسالة الإهداء الخاصة' : 'Personal Gift Note'}
                    </label>
                    <span className="text-[11px] font-tajawal text-[#8C8477]">
                      {language === 'ar' ? 'اختاري عبارة جاهزة أو اكتبي نصكِ' : 'Choose a quick preset or type custom'}
                    </span>
                  </div>

                  {/* Preset Pills */}
                  <div className="flex flex-wrap gap-2 mb-3">
                    {MESSAGE_PRESETS.map((p, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setPersonalMessage(language === 'ar' ? p.ar : p.en)}
                        className="text-[11px] font-tajawal px-2.5 py-1 rounded-full bg-[#18150F] border border-white/5 hover:border-[#D4AF37]/30 text-[#B8AF9F] hover:text-[#F8F5EE] transition-colors cursor-pointer"
                      >
                        {language === 'ar' ? p.ar.substring(0, 24) + '...' : p.en.substring(0, 24) + '...'}
                      </button>
                    ))}
                  </div>

                  <textarea
                    rows={2}
                    value={personalMessage}
                    onChange={(e) => setPersonalMessage(e.target.value)}
                    placeholder={language === 'ar' ? 'اكتبي رسالتكِ المعبرة هنا...' : 'Write your personalized message here...'}
                    className="w-full bg-[#0E0C09] border border-white/10 focus:border-[#E5C378] rounded-xl p-3.5 text-xs sm:text-sm text-[#F8F5EE] focus:outline-none transition-colors resize-none"
                  />
                </div>

                {/* Step 5: Payment Method */}
                <div className="pt-4 border-t border-white/5">
                  <label className="block text-xs font-mono uppercase tracking-widest text-[#E5C378] mb-3">
                    5. {language === 'ar' ? 'طريقة الدفع الآمنة' : 'Secure Payment Method'}
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('apple_pay')}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                        paymentMethod === 'apple_pay'
                          ? 'bg-white text-black border-white font-bold shadow-[0_0_15px_rgba(255,255,255,0.2)]'
                          : 'bg-[#0E0C09] text-[#B8AF9F] border-white/10 hover:border-white/20'
                      }`}
                    >
                      <span className="text-xs font-semibold"> Pay</span>
                      <span className="text-[10px] opacity-75">{language === 'ar' ? 'دفع فوري سريع' : 'Instant 1-Click'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('mada')}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                        paymentMethod === 'mada'
                          ? 'bg-[#1C2C1D] text-[#86EFAC] border-[#4ADE80] font-bold shadow-[0_0_15px_rgba(74,222,128,0.2)]'
                          : 'bg-[#0E0C09] text-[#B8AF9F] border-white/10 hover:border-white/20'
                      }`}
                    >
                      <span className="text-xs font-semibold">مدى Mada</span>
                      <span className="text-[10px] opacity-75">{language === 'ar' ? 'بطاقة الخصم السعودية' : 'Saudi Debit'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setPaymentMethod('credit_card')}
                      className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1 transition-all cursor-pointer ${
                        paymentMethod === 'credit_card'
                          ? 'bg-[#1E1B15] text-[#E5C378] border-[#E5C378] font-bold shadow-[0_0_15px_rgba(229,195,120,0.2)]'
                          : 'bg-[#0E0C09] text-[#B8AF9F] border-white/10 hover:border-white/20'
                      }`}
                    >
                      <CreditCard className="w-4 h-4" />
                      <span className="text-[10px] opacity-75">Visa / Mastercard</span>
                    </button>
                  </div>
                </div>

                {/* Error Banner if any */}
                {errorMessage && (
                  <div className="p-3 rounded-xl bg-red-950/40 border border-red-500/40 text-red-300 text-xs font-tajawal">
                    {errorMessage}
                  </div>
                )}

                {/* Checkout Summary & Action Button */}
                <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div>
                    <span className="text-xs font-tajawal text-[#8C8477] block">
                      {language === 'ar' ? 'الإجمالي النهائي المطلوب دفعه (شامل ضريبة القيمة المضافة):' : 'Total Amount (VAT Included):'}
                    </span>
                    <div className="flex items-baseline gap-1.5">
                      <span className="font-playfair text-2xl sm:text-3xl font-bold text-[#F8F5EE]">
                        {finalAmount.toLocaleString()}
                      </span>
                      <span className="font-tajawal text-xs text-[#E5C378] font-bold">
                        {language === 'ar' ? 'ريال سعودي' : 'SAR'}
                      </span>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full sm:w-auto luxe-gold-btn px-8 py-3.5 rounded-full text-xs sm:text-sm font-tajawal font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <span>{language === 'ar' ? 'جاري معالجة الدفع وإصدار البطاقة...' : 'Processing Secure Payment...'}</span>
                    ) : (
                      <>
                        <Gift className="w-4 h-4" />
                        <span>{language === 'ar' ? 'تأكيد الشراء وإصدار بطاقة الإهداء الفورية' : 'Confirm Purchase & Generate Gift Card'}</span>
                      </>
                    )}
                  </button>
                </div>

              </form>
            </div>
          </div>
        )}

        {/* Tab 2: Check Gift Card Balance */}
        {activeTab === 'balance' && (
          <div className="max-w-2xl mx-auto bg-[#12100C] border border-[#D4AF37]/30 rounded-3xl p-6 sm:p-10 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
            <div className="text-center mb-8">
              <div className="w-12 h-12 rounded-full bg-[#1F1B12] border border-[#D4AF37]/40 flex items-center justify-center mx-auto mb-3 text-[#E5C378]">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="font-playfair text-xl sm:text-2xl font-bold text-[#F8F5EE] mb-2">
                {language === 'ar' ? 'التحقق من رصيد وصلاحية بطاقتك' : 'Verify Balance & Validity'}
              </h3>
              <p className="font-tajawal text-xs sm:text-sm text-[#A89F91]">
                {language === 'ar'
                  ? 'أدخلي رمز بطاقة الإهداء الخاص بك (المكون من ROZ-GIFT-XXXX أو ROZ-GOLD-500) للاطلاع على الرصيد المتبقي وسجل الاستخدام.'
                  : 'Enter your voucher code (e.g. ROZ-GOLD-500 or ROZ-ROYAL-1000) to view current remaining balance.'}
              </p>
            </div>

            <form onSubmit={handleCheckBalance} className="space-y-4">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchCode}
                  onChange={(e) => setSearchCode(e.target.value)}
                  placeholder={language === 'ar' ? 'مثال: ROZ-GOLD-500' : 'e.g. ROZ-GOLD-500'}
                  className="flex-1 bg-[#090807] border border-white/15 focus:border-[#E5C378] rounded-xl px-4 py-3 text-sm font-mono uppercase text-[#F8F5EE] focus:outline-none tracking-wider"
                />
                <button
                  type="submit"
                  className="luxe-gold-btn px-6 py-3 rounded-xl text-xs sm:text-sm font-tajawal font-bold shrink-0 cursor-pointer"
                >
                  {language === 'ar' ? 'فحص الرصيد' : 'Check'}
                </button>
              </div>

              {searchFeedback && (
                <div
                  className={`p-3.5 rounded-xl text-xs font-tajawal ${
                    searchFeedback.type === 'success'
                      ? 'bg-emerald-950/40 border border-emerald-500/40 text-emerald-300'
                      : 'bg-red-950/40 border border-red-500/40 text-red-300'
                  }`}
                >
                  {searchFeedback.text}
                </div>
              )}
            </form>

            {/* Found Card Result Display */}
            {foundCard && (
              <div className="mt-8 p-6 rounded-2xl bg-[#1A160F] border border-[#D4AF37]/35 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-[#E5C378] font-bold bg-black/40 px-3 py-1 rounded-full border border-white/10">
                    {foundCard.code}
                  </span>
                  <span
                    className={`text-xs font-tajawal font-bold px-3 py-1 rounded-full ${
                      foundCard.status === 'active'
                        ? 'bg-emerald-950 border border-emerald-500/50 text-emerald-300'
                        : foundCard.status === 'partially_redeemed'
                        ? 'bg-amber-950 border border-amber-500/50 text-amber-300'
                        : 'bg-zinc-800 text-zinc-400'
                    }`}
                  >
                    {foundCard.status === 'active'
                      ? (language === 'ar' ? 'نشطة وصالحة للصرف' : 'Active & Valid')
                      : foundCard.status === 'partially_redeemed'
                      ? (language === 'ar' ? 'مستخدمة جزئياً' : 'Partially Redeemed')
                      : (language === 'ar' ? 'مستنفدة كلياً' : 'Fully Redeemed')}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 py-3 border-y border-white/10 text-xs font-tajawal">
                  <div>
                    <span className="text-[#8C8477] block">{language === 'ar' ? 'القيمة الأصلية:' : 'Original Value:'}</span>
                    <strong className="text-[#EDE7DC] text-sm">{foundCard.amountSAR} SAR</strong>
                  </div>
                  <div>
                    <span className="text-[#E5C378] block font-bold">{language === 'ar' ? 'الرصيد المتاح المتبقي:' : 'Remaining Balance:'}</span>
                    <strong className="text-[#E5C378] text-base sm:text-lg font-playfair font-bold">
                      {foundCard.remainingBalanceSAR} SAR
                    </strong>
                  </div>
                  <div>
                    <span className="text-[#8C8477] block">{language === 'ar' ? 'المهداة لها:' : 'Recipient:'}</span>
                    <span className="text-[#EDE7DC]">{foundCard.recipientName}</span>
                  </div>
                  <div>
                    <span className="text-[#8C8477] block">{language === 'ar' ? 'صالحة حتى تاريخ:' : 'Valid Until:'}</span>
                    <span className="text-[#EDE7DC]">{new Date(foundCard.expiresAt).toLocaleDateString()}</span>
                  </div>
                </div>

                {foundCard.personalMessage && (
                  <div className="p-3 rounded-xl bg-black/30 border border-white/5 text-xs italic font-tajawal text-[#B8AF9F]">
                    "{foundCard.personalMessage}"
                  </div>
                )}

                {foundCard.remainingBalanceSAR > 0 && onBookWithGiftCard && (
                  <button
                    onClick={() => onBookWithGiftCard(foundCard.code)}
                    className="w-full luxe-gold-btn py-3 rounded-xl text-xs sm:text-sm font-tajawal font-bold flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    <span>{language === 'ar' ? 'احجزي موعدكِ الآن بهذا الرصيد' : 'Book Appointment with this Card'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Success Modal: Download/Share Purchased Gift Voucher */}
      {purchasedCard && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
          <div className="bg-[#12100C] border border-[#E5C378] max-w-lg w-full rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(212,175,55,0.3)] relative">
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-full bg-[#241F14] border border-[#E5C378] flex items-center justify-center mx-auto mb-3 text-[#E5C378]">
                <Sparkles className="w-7 h-7" />
              </div>
              <h3 className="font-playfair text-2xl font-bold text-[#F8F5EE] mb-1">
                {language === 'ar' ? 'تم إصدار بطاقة الإهداء بنجاح!' : 'Gift Card Issued Successfully!'}
              </h3>
              <p className="font-tajawal text-xs sm:text-sm text-[#A89F91]">
                {language === 'ar'
                  ? 'تم تسجيل البطاقة في سجل صالون روزانة فرع الشميسي وأصبحت جاهزة للإرسال والصرف فوراً.'
                  : 'The gift voucher is officially registered and ready for immediate redemption.'}
              </p>
            </div>

            {/* Generated Voucher Card Mockup */}
            <div className={`p-5 rounded-2xl border mb-6 relative overflow-hidden ${activeThemeObj.bgClass} ${activeThemeObj.borderClass}`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="font-cinzel text-xs text-[#E5C378] font-bold tracking-widest block">ROZANA SALON</span>
                  <span className="text-[10px] text-[#8C8477] font-tajawal">{language === 'ar' ? 'فرع الشميسي، الرياض' : 'Al Shumaisi Branch'}</span>
                </div>
                <span className="text-sm font-bold font-playfair text-[#F8F5EE]">
                  {purchasedCard.amountSAR} SAR
                </span>
              </div>

              {/* Code Box */}
              <div className="p-3 bg-black/50 border border-white/10 rounded-xl text-center mb-3">
                <span className="text-[10px] text-[#A89F91] block font-tajawal">{language === 'ar' ? 'كود بطاقة الإهداء' : 'Voucher Code'}</span>
                <div className="flex items-center justify-center gap-2 mt-1">
                  <span className="font-mono text-base sm:text-lg font-bold text-[#E5C378] tracking-widest">
                    {purchasedCard.code}
                  </span>
                  <button
                    onClick={() => handleCopyCode(purchasedCard.code)}
                    className="p-1 text-[#E5C378] hover:text-white transition-colors cursor-pointer"
                    title="Copy Code"
                  >
                    {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="text-xs font-tajawal text-[#EDE7DC] space-y-1">
                <p><span className="text-[#8C8477]">{language === 'ar' ? 'المهداة لها:' : 'To:'}</span> {purchasedCard.recipientName}</p>
                <p><span className="text-[#8C8477]">{language === 'ar' ? 'من:' : 'From:'}</span> {purchasedCard.senderName}</p>
                <p className="text-[11px] italic text-[#B8AF9F] pt-1">"{purchasedCard.personalMessage}"</p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-3">
              <a
                href={getWhatsAppShareUrl(purchasedCard)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-black font-tajawal font-bold py-3 px-4 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{language === 'ar' ? 'إرسال فوري عبر الواتساب للمستلمة' : 'Send via WhatsApp to Recipient'}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <button
                onClick={() => window.print()}
                className="w-full bg-[#1E1A12] border border-[#D4AF37]/40 hover:border-[#E5C378] text-[#E5C378] font-tajawal font-medium py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>{language === 'ar' ? 'طباعة قسيمة الإهداء الفاخرة' : 'Print Luxury Gift Voucher'}</span>
              </button>

              <button
                onClick={() => setPurchasedCard(null)}
                className="w-full py-2 text-xs font-tajawal text-[#8C8477] hover:text-[#EDE7DC] transition-colors cursor-pointer text-center"
              >
                {language === 'ar' ? 'إغلاق والعودة للموقع' : 'Close & Return to Salon'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
