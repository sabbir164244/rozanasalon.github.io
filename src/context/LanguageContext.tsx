import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  isRTL: boolean;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    'nav.home': 'Home',
    'nav.services': 'Services',
    'nav.booking': 'Book Appointment',
    'nav.reviews': 'Reviews & Rating',
    'nav.location': 'Location',
    'nav.admin': 'Admin Dashboard',
    'nav.quickBook': 'Book Now',
    'nav.branch': 'Al Shumaisi Branch',

    // Hero
    'hero.brandEn': 'Rozana Salon',
    'hero.brandAr': 'صالون روزانة',
    'hero.branch': 'Al Shumaisi Branch • Riyadh',
    'hero.tagline': 'Luxury Hair Care & Spa in Al Shumaisi',
    'hero.subtext': 'Step into Riyadh’s signature sanctuary of beauty. Featuring royal 24K gold facials, master nano-keratin restorations, and bespoke pampering within an opulent midnight-onyx ambiance.',
    'hero.ctaBook': 'Book Appointment Now',
    'hero.ctaServices': 'Explore Services',
    'hero.statRating': '4.2 ★ Rating on Google',
    'hero.statHours': 'Open 12:00 PM – 11:00 PM Daily',
    'hero.statClients': 'Over 8,000+ Happy Guests',

    // Services
    'services.badge': 'Curated Salon Menu',
    'services.title': 'Indulgent Services & Treatments',
    'services.subtitle': 'Meticulously designed hair, skin, and spa rituals performed by certified beauty specialists.',
    'services.filterAll': 'All Services',
    'services.filterFacial': 'Facials & Skin',
    'services.filterKeratin': 'Keratin & Protein',
    'services.filterHaircut': 'Haircut & Styling',
    'services.filterNails': 'Manicure & Pedicure',
    'services.filterSpa': 'Moroccan Bath & Spa',
    'services.topRatedBadge': 'TOP-RATED EXCLUSIVE',
    'services.bookThis': 'Book This Service',
    'services.min': 'mins',
    'services.sar': 'SAR',
    'services.featuredTitle': 'Featured Master Treatment',

    // Booking Engine
    'booking.title': 'Smart Appointment Booking',
    'booking.subtitle': 'Reserve your luxury chair in less than 60 seconds. Instant confirmation.',
    'booking.step1': '1. Choose Service',
    'booking.step2': '2. Date & Time',
    'booking.step3': '3. Guest Details',
    'booking.step4': '4. Confirmation',
    'booking.selectServicePrompt': 'Choose your treatment from our luxury catalog',
    'booking.selectDate': 'Appointment Date',
    'booking.selectTime': 'Select Time Slot',
    'booking.hoursNotice': 'Salon Operating Hours: Strictly 12:00 PM – 11:00 PM',
    'booking.customerName': 'Full Name',
    'booking.namePlaceholder': 'e.g., Nouf Al-Subaie',
    'booking.phone': 'Saudi Mobile Number',
    'booking.phonePlaceholder': '05X XXX XXXX',
    'booking.specialist': 'Preferred Specialist (Optional)',
    'booking.anySpecialist': 'Any Available Master Specialist',
    'booking.notes': 'Special Requests / Skin Type',
    'booking.notesPlaceholder': 'Let us know if you have specific preferences, bridal prep, or sensitive skin...',
    'booking.next': 'Continue to Next Step',
    'booking.back': 'Back',
    'booking.confirmBtn': 'Confirm Booking Now',
    'booking.reviewTitle': 'Review Your Reservation',
    'booking.successTitle': 'Appointment Confirmed!',
    'booking.successSubtitle': 'Your luxury treatment has been reserved at Rozana Salon (Al Shumaisi Branch).',
    'booking.refCode': 'Reference Code',
    'booking.whatsAppShare': 'Receive Details on WhatsApp',
    'booking.bookAnother': 'Book Another Appointment',
    'booking.errorSelectService': 'Please select a service to proceed.',
    'booking.errorSelectTime': 'Please choose an available appointment date and time slot.',
    'booking.errorDetails': 'Please provide your full name and valid Saudi phone number.',

    // Social Proof
    'social.badge': 'Google Verified Proof',
    'social.ratingHeader': '4.2 ★ Exceptional Satisfaction',
    'social.basedOn': 'Based on 340+ verified Google Reviews in Riyadh',
    'social.cleanliness': 'Hygiene & Sterilization',
    'social.staffSkill': 'Specialist Mastery',
    'social.ambiance': 'Luxury Ambiance',
    'social.punctuality': 'Time Punctuality',

    // Location
    'location.badge': 'Visit Al Shumaisi Sanctuary',
    'location.title': 'Find Rozana Salon in Riyadh',
    'location.address': 'Al Shumaisi Street, Al Shumaisi District, Riyadh, Saudi Arabia',
    'location.hoursHeader': 'Operating Schedule',
    'location.hoursValue': '12:00 PM – 11:00 PM (Monday – Sunday)',
    'location.callUs': 'Call Salon Front Desk',
    'location.whatsappUs': 'WhatsApp Concierge',
    'location.getDirections': 'Get Directions on Google Maps',

    // Admin Dashboard
    'admin.portal': 'Admin Portal',
    'admin.loginTitle': 'Rozana Salon Admin Gateway',
    'admin.loginSub': 'Enter your credentials to manage appointments, staff, and branch operations.',
    'admin.email': 'Manager Email',
    'admin.password': 'Security Passcode',
    'admin.loginBtn': 'Access Dashboard',
    'admin.demoLogin': 'Quick Demo Access (Manager)',
    'admin.logout': 'Sign Out',
    'admin.tabKanban': 'Bookings Kanban',
    'admin.tabSettings': 'Salon & Staff Settings',
    'admin.tabSchema': 'Database Schema (SQL/JSON)',
    'admin.kpiEarnings': "Today's Estimated Earnings",
    'admin.kpiPending': 'Pending New Requests',
    'admin.kpiCustomers': 'Total Customers Today',
    'admin.kpiCompleted': 'Completed Treatments',
    'admin.colNew': 'New Requests',
    'admin.colConfirmed': 'Confirmed Bookings',
    'admin.colCompleted': 'Completed',
    'admin.moveToConfirmed': 'Mark Confirmed',
    'admin.moveToCompleted': 'Mark Completed',
    'admin.detailsModalTitle': 'Appointment Dossier',
    'admin.customer': 'Customer',
    'admin.phone': 'Phone',
    'admin.status': 'Status',
    'admin.assignedStaff': 'Assigned Specialist',
    'admin.total': 'Total Due',
    'admin.created': 'Logged At',
    'admin.notes': 'Customer Notes',
    'admin.close': 'Close',
    'admin.staffTitle': 'Manage Salon Staff',
    'admin.available': 'Available Today',
    'admin.busy': 'Off Duty',
    'admin.servicesTitle': 'Manage Services & Pricing',
    'admin.addNewService': 'Add New Service',
    'admin.saveChanges': 'Save Changes',
    'admin.hoursTitle': 'Operating Hours Configuration',
    'admin.saveSuccess': 'Salon settings updated successfully!'
  },
  ar: {
    // Navigation
    'nav.home': 'الرئيسية',
    'nav.services': 'الخدمات',
    'nav.booking': 'حجز موعد',
    'nav.reviews': 'التقييمات والآراء',
    'nav.location': 'الموقع',
    'nav.admin': 'لوحة الإدارة',
    'nav.quickBook': 'احجزي الآن',
    'nav.branch': 'فرع الشميسي',

    // Hero
    'hero.brandEn': 'Rozana Salon',
    'hero.brandAr': 'صالون روزانة',
    'hero.branch': 'فرع الشميسي • الرياض',
    'hero.tagline': 'العناية الفاخرة بالشعر والسبا في الشميسي',
    'hero.subtext': 'مرحباً بكم في ملاذ الجمال والأناقة في قلب الرياض. استمتعي بجلسات تنظيف الوجه بالذهب عيار 24، معالجات النانو كيراتين البرازيلية الفاخرة، وحمام مغربي ملكي وسط أجواء راقية بإضاءة النيون الذهبية والأسود الأونيكس الفاخر.',
    'hero.ctaBook': 'احجزي موعدكِ الآن',
    'hero.ctaServices': 'استعراض قائمة الخدمات',
    'hero.statRating': 'تقييم 4.2 ★ على خرائط جوجل',
    'hero.statHours': 'نستقبلكم يومياً 12:00 ظهراً – 11:00 مساءً',
    'hero.statClients': 'أكثر من 8,000+ عميلة سعيدة',

    // Services
    'services.badge': 'قائمة خدمات روزانة الملكية',
    'services.title': 'جلسات وخدمات الجمال الفاخرة',
    'services.subtitle': 'باقة مختارة بعناية من أفضل علاجات الشعر، البشرة، والأظافر على أيدي خبيرات تجميل معتمدات.',
    'services.filterAll': 'جميع الخدمات',
    'services.filterFacial': 'العناية بالبشرة والوجه',
    'services.filterKeratin': 'الكيراتين والبروتين',
    'services.filterHaircut': 'قص الشعر والتسريحات',
    'services.filterNails': 'البديكير والمنيكير',
    'services.filterSpa': 'الحمام المغربي والسبا',
    'services.topRatedBadge': 'الخدمة الملكية الأكثر طلباً',
    'services.bookThis': 'حجز هذه الخدمة',
    'services.min': 'دقيقة',
    'services.sar': 'ر.س',
    'services.featuredTitle': 'الخدمة المميزة الأولى في صالون روزانة',

    // Booking Engine
    'booking.title': 'نظام الحجز الذكي المباشر',
    'booking.subtitle': 'احجزي موعدكِ بكل سهولة في أقل من دقيقة مع تأكيد فوري وحفظ المقعد.',
    'booking.step1': '١. اختيار الخدمة',
    'booking.step2': '٢. التاريخ والوقت',
    'booking.step3': '٣. بيانات العميلة',
    'booking.step4': '٤. التأكيد النهائي',
    'booking.selectServicePrompt': 'اختاري جلستكِ المفضلة من قائمة خدمات روزانة',
    'booking.selectDate': 'تاريخ الموعد',
    'booking.selectTime': 'الوقت المناسب',
    'booking.hoursNotice': 'مواعيد العمل في فرع الشميسي: حصرياً من 12:00 ظهراً حتى 11:00 مساءً',
    'booking.customerName': 'الاسم الكريم',
    'booking.namePlaceholder': 'مثال: نورة العتيبي',
    'booking.phone': 'رقم الجوال (سعودي)',
    'booking.phonePlaceholder': '05X XXX XXXX',
    'booking.specialist': 'الأخصائية المفضلة (اختياري)',
    'booking.anySpecialist': 'أي أخصائية متاحة',
    'booking.notes': 'ملاحظات خاصة أو نوع البشرة',
    'booking.notesPlaceholder': 'أخبرينا إذا كانت لديكِ حساسية، أو تجهيز عروس، أو طلب خاص...',
    'booking.next': 'المتابعة للخطوة التالية',
    'booking.back': 'رجوع',
    'booking.confirmBtn': 'تأكيد الحجز فوراً',
    'booking.reviewTitle': 'مراجعة تفاصيل الحجز',
    'booking.successTitle': 'تم تأكيد موعدكِ بنجاح!',
    'booking.successSubtitle': 'تم حجز مقعدكِ الفاخر في صالون روزانة (فرع الشميسي). نتطلع لاستقبالكِ بكل ترحاب.',
    'booking.refCode': 'رقم الحجز المرجعي',
    'booking.whatsAppShare': 'إرسال التفاصيل عبر الواتساب',
    'booking.bookAnother': 'حجز موعد آخر',
    'booking.errorSelectService': 'الرجاء اختيار الخدمة أولاً للمتابعة.',
    'booking.errorSelectTime': 'الرجاء تحديد تاريخ ووقت الموعد.',
    'booking.errorDetails': 'الرجاء إدخال الاسم ورقم الجوال السعودي بشكل صحيح.',

    // Social Proof
    'social.badge': 'تقييمات عميلاتنا الحقيقية',
    'social.ratingHeader': 'تقييم 4.2 ★ ثقة وتميز مستمر',
    'social.basedOn': 'بناءً على أكثر من 340 تقييماً حقيقياً على خرائط Google في الرياض',
    'social.cleanliness': 'التعقيم والنظافة الفائقة',
    'social.staffSkill': 'احترافية وخبرة الأخصائيات',
    'social.ambiance': 'الأجواء الملكية المريحة',
    'social.punctuality': 'الالتزام الدقيق بالمواعيد',

    // Location
    'location.badge': 'تفضلي بزيارتنا في الشميسي',
    'location.title': 'موقع صالون روزانة في الرياض',
    'location.address': 'شارع الشميسي، حي الشميسي، الرياض، المملكة العربية السعودية',
    'location.hoursHeader': 'ساعات العمل اليومية',
    'location.hoursValue': '12:00 ظهراً – 11:00 مساءً (طوال أيام الأسبوع)',
    'location.callUs': 'اتصال بالاستقبال',
    'location.whatsappUs': 'محادثة واتساب سريعة',
    'location.getDirections': 'الاتجاهات عبر خرائط جوجل',

    // Admin Dashboard
    'admin.portal': 'بوابة الإدارة',
    'admin.loginTitle': 'تسجيل دخول إدارة صالون روزانة',
    'admin.loginSub': 'سجلي الدخول لمتابعة الحجوزات، الموظفات، ومبيعات الفرع اليومية.',
    'admin.email': 'البريد الإلكتروني للإدارة',
    'admin.password': 'رمز المرور الأمني',
    'admin.loginBtn': 'الدخول للوحة التحكم',
    'admin.demoLogin': 'دخول تجريبي سريع (المديرة)',
    'admin.logout': 'تسجيل الخروج',
    'admin.tabKanban': 'لوحة الحجوزات (كانبان)',
    'admin.tabSettings': 'إعدادات الصالون والموظفات',
    'admin.tabSchema': 'مخطط قاعدة البيانات (SQL/JSON)',
    'admin.kpiEarnings': 'إجمالي الإيرادات المتوقعة اليوم',
    'admin.kpiPending': 'طلبات جديدة بالانتظار',
    'admin.kpiCustomers': 'إجمالي عميلات اليوم',
    'admin.kpiCompleted': 'الجلسات المكتملة',
    'admin.colNew': 'طلبات جديدة',
    'admin.colConfirmed': 'حجوزات مؤكدة',
    'admin.colCompleted': 'حجوزات مكتملة',
    'admin.moveToConfirmed': 'نقل إلى مؤكد',
    'admin.moveToCompleted': 'نقل إلى مكتمل',
    'admin.detailsModalTitle': 'تفاصيل ملف الحجز',
    'admin.customer': 'العميلة',
    'admin.phone': 'الجوال',
    'admin.status': 'الحالة',
    'admin.assignedStaff': 'الأخصائية المشرفة',
    'admin.total': 'المبلغ المستحق',
    'admin.created': 'وقت تسجيل الطلب',
    'admin.notes': 'ملاحظات العميلة',
    'admin.close': 'إغلاق',
    'admin.staffTitle': 'إدارة طاقم العمل والأخصائيات',
    'admin.available': 'متاحة اليوم',
    'admin.busy': 'في إجازة',
    'admin.servicesTitle': 'إدارة الخدمات والأسعار',
    'admin.addNewService': 'إضافة خدمة جديدة',
    'admin.saveChanges': 'حفظ التعديلات',
    'admin.hoursTitle': 'تعديل ساعات العمل المعتمدة',
    'admin.saveSuccess': 'تم تحديث بيانات الصالون بنجاح!'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('ar'); // Default to Arabic as requested for authentic Saudi salon experience

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('rozana_lang', lang);
    document.documentElement.setAttribute('lang', lang);
    document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  };

  useEffect(() => {
    const saved = localStorage.getItem('rozana_lang') as Language | null;
    if (saved === 'en' || saved === 'ar') {
      setLanguage(saved);
    } else {
      setLanguage('ar');
    }
  }, []);

  const isRTL = language === 'ar';

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, isRTL, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
