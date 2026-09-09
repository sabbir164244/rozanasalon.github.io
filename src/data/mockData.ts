import { Service, StaffMember, Appointment, SalonReview, SalonSettings } from '../types';

export const INITIAL_SERVICES: Service[] = [
  {
    id: 'srv-facial-signature',
    nameEn: 'Signature Royal Facial Treatment',
    nameAr: 'العلاج الملكي الفاخر لتنظيف ونضارة الوجه',
    category: 'facial',
    priceSAR: 380,
    durationMin: 75,
    descriptionEn: 'Our premier luxury facial: Deep hydra-dermabrasion cleansing, 24K gold serum infusion, lymphatic facial massage, and botanical cooling mask. The salon’s most requested treatment.',
    descriptionAr: 'العلاج الملكي الأكثر طلباً وتقييماً: تنظيف هيدرا عميق للبشرة، سيروم الذهب عيار 24 قيراط، تدليك تصريفي للوجه، وقناع مهدئ بالأعشاب الطبيعية.',
    isSignature: true,
    rating: 4.9,
    reviewsCount: 164,
    badgeEn: '⭐ Top Rated & Most Popular',
    badgeAr: '⭐ الأكثر طلباً وتقييماً 4.9',
    imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80',
    benefitsEn: [
      '24K Liquid Gold active peptide infusion',
      'Hydra-dermabrasion deep pore purification',
      'Medical-grade lymphatic drainage massage',
      'Instant plumping & glass-skin radiant finish'
    ],
    benefitsAr: [
      'سيروم خلاصة الذهب النقي عيار 24 قيراط',
      'تنظيف هيدرا عميق وتنقية المسام بنعومة',
      'تدليك تصريفي لنحت الفك وإزالة الانتفاخ',
      'نضارة فورية وتأثير بشرة الزجاج المشرقة'
    ]
  },
  {
    id: 'srv-facial-gold',
    nameEn: 'Onyx Glow Collagen Facial',
    nameAr: 'جلسة نضارة كولاجين الأونيكس',
    category: 'facial',
    priceSAR: 290,
    durationMin: 60,
    descriptionEn: 'Targeted skin revitalizer using ultrasound micro-peel, pure marine collagen ampoules, and LED light skin rejuvenating therapy.',
    descriptionAr: 'جلسة لتجديد خلايا البشرة بالتقشير بالموجات الدقيقة، أمبولات كولاجين بحري نقي، وعلاج الضوء لتحفيز النضارة الطبيعية.',
    rating: 4.7,
    reviewsCount: 88,
    imageUrl: 'https://images.unsplash.com/photo-1512290900672-1f5be572e0fa?w=800&auto=format&fit=crop&q=80',
    benefitsEn: [
      'Pure concentrated marine collagen ampoules',
      'Gentle ultrasound cell ultrasonic peeling',
      'Red LED phototherapy for firming elasticity'
    ],
    benefitsAr: [
      'أمبولات كولاجين بحري مركزة لشد البشرة',
      'تقشير لطيف بدون تقشر بالموجات فوق الصوتية',
      'جلسة ضوء LED لتحفيز الإيلاستين الطبيعي'
    ]
  },
  {
    id: 'srv-keratin-brazilian',
    nameEn: 'Brazilian Nano-Keratin Therapy',
    nameAr: 'علاج نانو كيراتين البرازيلي للشعر',
    category: 'keratin',
    priceSAR: 650,
    durationMin: 150,
    descriptionEn: 'Formaldehyde-free organic nano-keratin infusion that restores damaged cuticles, eliminating frizz while delivering mirror-like silkiness for up to 6 months.',
    descriptionAr: 'جلسة نانو كيراتين عضوي خالٍ من الفورمالين لعلاج تقصف وتلف خصلات الشعر ومنحه لمعاناً حريرياً يدوم حتى 6 أشهر.',
    isSignature: false,
    rating: 4.8,
    reviewsCount: 112,
    badgeEn: 'Zero Frizz Guarantee',
    badgeAr: 'ضمان نعومة تدوم',
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
    benefitsEn: [
      '100% Formaldehyde-free organic formula',
      'Deep cuticle thermal reconstruction',
      'Weather-proof silk shine up to 6 months',
      'Safe for color-treated and bleached hair'
    ],
    benefitsAr: [
      'تركيبة عضوية 100% خالية تماماً من الفورمالين',
      'إعادة بناء ألياف الشعر المسامية والتالفة',
      'لمعان حريري وانسيابية تدوم حتى 6 أشهر',
      'آمن بالكامل على الشعر المصبوغ والمسحوب'
    ]
  },
  {
    id: 'srv-keratin-protein',
    nameEn: 'Royal Caviar & Protein Hair Treatment',
    nameAr: 'بروتين الكافيار والحرير المغذي للشعر',
    category: 'keratin',
    priceSAR: 520,
    durationMin: 120,
    descriptionEn: 'Enriched with caviar extract and amino proteins, deep conditioning therapy to revive dry, bleached, or heat-fatigued hair.',
    descriptionAr: 'تركيبة غنية بمستخلصات الكافيار والأحماض الأمينية لاستعادة حيوية الشعر الجاف والمتضرر من الصبغة أو الحرارة.',
    rating: 4.6,
    reviewsCount: 74,
    imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop&q=80',
    benefitsEn: [
      'Rich caviar phospholipid complex',
      'Recharges dry, brittle hair strands',
      'Restores natural bounce and elasticity'
    ],
    benefitsAr: [
      'خلاصة الكافيار الغنية بأوميغا 3 والدهون الفسفورية',
      'تغذية عميقة للأطراف المتقصفة والجافة',
      'استعادة مرونة الشعر الطبيعية وسهولة التصفيف'
    ]
  },
  {
    id: 'srv-haircut-luxury',
    nameEn: 'Haute Couture Haircut & Blowdry',
    nameAr: 'قصة شعر فاخرة وسيشوار ملكي',
    category: 'haircut',
    priceSAR: 160,
    durationMin: 45,
    descriptionEn: 'Precision silhouette cutting designed for your face structure, accompanied by botanical scalp shampoo and our signature volume blow-dry.',
    descriptionAr: 'قصة شعر متقنة ومناسبة لملامح الوجه، مع غسيل بالشامبو العطري الفاخر وسيشوار روزانة الكثيف.',
    rating: 4.5,
    reviewsCount: 95,
    imageUrl: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&auto=format&fit=crop&q=80',
    benefitsEn: [
      'Bespoke face-framing diagnostic cut',
      'Aromatherapy scalp massage shampoo',
      'Volumizing bouncy blow-dry finish'
    ],
    benefitsAr: [
      'استشارة لتحديد القصة الأنسب لتقاسيم الوجه',
      'غسيل استرخائي مع تدليك عطري لفروة الرأس',
      'سيشوار ملكي كثيف يمنح خصلاتك حيوية'
    ]
  },
  {
    id: 'srv-haircut-styling',
    nameEn: 'Glamour Waves & Evening Styling',
    nameAr: 'تسريحة ويفي للمناسبات وسهرات المساء',
    category: 'haircut',
    priceSAR: 220,
    durationMin: 60,
    descriptionEn: 'Sensational soft Hollywood waves or structured luxury updo for private events, weddings, and celebrations.',
    descriptionAr: 'تسريحة هوليوود ويفي انسيابية أو رفع فخم للمناسبات الخاصة والحفلات في الرياض.',
    rating: 4.7,
    reviewsCount: 68,
    imageUrl: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800&auto=format&fit=crop&q=80',
    benefitsEn: [
      'Long-lasting thermal setting hold',
      'Red carpet Hollywood gloss shine',
      'Custom accessory pinning and veil support'
    ],
    benefitsAr: [
      'ثبات حراري يدوم طوال ساعات السهرة والحفل',
      'لمعان هوليوود المتألق وإطلالة نجمات السجادة الحمراء',
      'تثبيت محكم للإكسسوارات الفاخرة والطرحة'
    ]
  },
  {
    id: 'srv-nails-mani-pedi',
    nameEn: 'Golden Elixir Manicure & Pedicure',
    nameAr: 'بديكير ومنيكير إكسير الذهب الفاخر',
    category: 'nails',
    priceSAR: 195,
    durationMin: 60,
    descriptionEn: 'Warm mineral soak, golden shimmer salt exfoliation, organic cuticle detailing, soothing massage, and premium polish.',
    descriptionAr: 'نقع بالأملاح المعدنية الدافئة، تقشير مقشر الذهب، عناية بالجلد المحيط بالأظافر، ومساج مهدئ مع طلاء أظافر فاخر.',
    rating: 4.6,
    reviewsCount: 140,
    badgeEn: 'Best Seller',
    badgeAr: 'الأكثر مبيعاً',
    imageUrl: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=800&auto=format&fit=crop&q=80',
    benefitsEn: [
      'Autoclave 100% sterilized medical tools',
      'Dead Sea golden mineral peeling scrub',
      'Hot paraffin treatment & relaxing massage',
      'Chip-resistant luxury high-gloss polish'
    ],
    benefitsAr: [
      'أدوات طبية معقمة 100% بأجهزة الأوتوكلاف تفتح أمامك',
      'تقشير بأملاح البحر الميت الذهبية المنعمة',
      'جلسة ترطيب عميق ومساج مهدئ للأطراف',
      'طلاء أظافر فاخر ثابت ومقاوم للتقشر'
    ]
  },
  {
    id: 'srv-nails-gel',
    nameEn: 'Russian Gel Nail Extensions & Art',
    nameAr: 'تركيب أظافر جل روسي وتصميم فني',
    category: 'nails',
    priceSAR: 260,
    durationMin: 75,
    descriptionEn: 'Long-lasting Russian hardware manicure with builder gel extensions and custom golden French tips or minimal chrome nail art.',
    descriptionAr: 'منيكير بالأجهزة الروسية مع تمديد جل قوي وثابت، ورسمات ذهبية أو كروم ناعمة راقية.',
    rating: 4.7,
    reviewsCount: 52,
    imageUrl: 'https://images.unsplash.com/photo-1604654894610-df63bc536371?w=800&auto=format&fit=crop&q=80',
    benefitsEn: [
      'Dry hardware Russian clean cuticles',
      'Ultra-durable apex builder gel extension',
      'High-fashion chrome, ombre, or gold foil art'
    ],
    benefitsAr: [
      'تنظيف دقيق بالمبرد الروسي الجاف لأناقة لا تضاهى',
      'بناء جل قوي وخفيف الملمس يحمي أظافرك الطبيعية',
      'تصاميم فنية راقية بالكروم أو أوراق الذهب'
    ]
  },
  {
    id: 'srv-spa-moroccan',
    nameEn: 'Royal Moroccan Bath & Eucalyptus Scrub',
    nameAr: 'حمام مغربي ملكي بصابون الغار وزيت الأرجان',
    category: 'spa',
    priceSAR: 320,
    durationMin: 60,
    descriptionEn: 'Traditional private steam suite, authentic black olive soap wrap, Kessa mitt exfoliation, and pure organic Argan oil finish.',
    descriptionAr: 'جلسة بخار خاصة، صابون مغربي أسود بزيت الزيتون، تقشير بالليفة المغربية الأصلية، وتدليك ناعم بزيت الأركان النقي.',
    rating: 4.8,
    reviewsCount: 89,
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80',
    benefitsEn: [
      'Private VIP steam sanctuary with heated marble',
      'Authentic Moroccan black soap with Eucalyptus',
      'Full body Kessa exfoliation removes dead skin',
      'Warm pure organic Argan oil body hydration'
    ],
    benefitsAr: [
      'جناح بخار خاص ومغلق برخام دافئ وأجواء استرخائية',
      'صابون أسود بلدي أصلي مع خلاصة الأوكالبتوس المنعشة',
      'تقشير كامل للجسم بالليفة المغربية الأصلية لإزالة الخلايا الميتة',
      'ترطيب ملكي بزيت الأركان العضوي النقي 100%'
    ]
  }
];

export const INITIAL_STAFF: StaffMember[] = [
  {
    id: 'st-layla',
    nameEn: 'Layla Al-Khatib',
    nameAr: 'ليلى الخطيب',
    roleEn: 'Master Facial & Aesthetic Specialist',
    roleAr: 'أخصائية أولى في العناية بالبشرة والوجه',
    rating: 4.9,
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    isAvailableToday: true,
    specialties: ['Signature Facial Treatments', 'Collagen Peels', 'Microdermabrasion']
  },
  {
    id: 'st-fatima',
    nameEn: 'Fatima Al-Mutairi',
    nameAr: 'فاطمة المطيري',
    roleEn: 'Senior Hair Stylist & Keratin Expert',
    roleAr: 'خبيرة تصفيف الشعر وعلاجات الكيراتين',
    rating: 4.8,
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    isAvailableToday: true,
    specialties: ['Brazilian Nano-Keratin', 'Couture Haircuts', 'Glamour Waves']
  },
  {
    id: 'st-sarah',
    nameEn: 'Sarah Al-Ghamdi',
    nameAr: 'سارة الغامدي',
    roleEn: 'Lead Nail Artist & Hand Spa Specialist',
    roleAr: 'فنانة أظافر وأخصائية سبا الأيدي والأقدام',
    rating: 4.7,
    avatar: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?w=150&auto=format&fit=crop&q=80',
    isAvailableToday: true,
    specialties: ['Russian Gel', 'Golden Elixir Spa', 'Chrome & Art Designs']
  },
  {
    id: 'st-nour',
    nameEn: 'Nour Benali',
    nameAr: 'نور بن علي',
    roleEn: 'Traditional Moroccan Bath Master',
    roleAr: 'خبيرة الحمام المغربي والسبا الفاخر',
    rating: 4.9,
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    isAvailableToday: true,
    specialties: ['Moroccan Baths', 'Body Scrubs', 'Herbal Wraps']
  }
];

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-001',
    referenceId: 'ROZ-9102',
    customerName: 'Nouf Al-Dosari (نوف الدوسري)',
    customerPhone: '+966 50 123 4567',
    serviceId: 'srv-facial-signature',
    serviceNameEn: 'Signature Royal Facial Treatment',
    serviceNameAr: 'العلاج الملكي الفاخر لتنظيف ونضارة الوجه',
    serviceCategory: 'facial',
    staffId: 'st-layla',
    staffName: 'Layla Al-Khatib',
    date: '2026-09-09',
    time: '01:00 PM',
    status: 'new',
    notes: 'Sensitive skin. Requesting 24K gold booster.',
    totalSAR: 380,
    createdAt: '2026-09-09 10:15 AM'
  },
  {
    id: 'apt-002',
    referenceId: 'ROZ-8843',
    customerName: 'Maha Al-Shehri (مها الشهري)',
    customerPhone: '+966 55 987 6543',
    serviceId: 'srv-keratin-brazilian',
    serviceNameEn: 'Brazilian Nano-Keratin Therapy',
    serviceNameAr: 'علاج نانو كيراتين البرازيلي للشعر',
    serviceCategory: 'keratin',
    staffId: 'st-fatima',
    staffName: 'Fatima Al-Mutairi',
    date: '2026-09-09',
    time: '03:30 PM',
    status: 'new',
    notes: 'Long shoulder-length hair. First time client.',
    totalSAR: 650,
    createdAt: '2026-09-09 11:20 AM'
  },
  {
    id: 'apt-003',
    referenceId: 'ROZ-7512',
    customerName: 'Reem Al-Otaibi (ريم العتيبي)',
    customerPhone: '+966 54 332 1199',
    serviceId: 'srv-nails-mani-pedi',
    serviceNameEn: 'Golden Elixir Manicure & Pedicure',
    serviceNameAr: 'بديكير ومنيكير إكسير الذهب الفاخر',
    serviceCategory: 'nails',
    staffId: 'st-sarah',
    staffName: 'Sarah Al-Ghamdi',
    date: '2026-09-09',
    time: '02:00 PM',
    status: 'confirmed',
    notes: 'Confirmed via WhatsApp. Prefers nude polish shade #12.',
    totalSAR: 195,
    createdAt: '2026-09-08 04:40 PM'
  },
  {
    id: 'apt-004',
    referenceId: 'ROZ-6321',
    customerName: 'Hessa Al-Qahtani (حصة القحطاني)',
    customerPhone: '+966 56 441 8890',
    serviceId: 'srv-facial-signature',
    serviceNameEn: 'Signature Royal Facial Treatment',
    serviceNameAr: 'العلاج الملكي الفاخر لتنظيف ونضارة الوجه',
    serviceCategory: 'facial',
    staffId: 'st-layla',
    staffName: 'Layla Al-Khatib',
    date: '2026-09-09',
    time: '04:00 PM',
    status: 'confirmed',
    notes: 'Bride preparation appointment. VIP room requested.',
    totalSAR: 380,
    createdAt: '2026-09-08 07:15 PM'
  },
  {
    id: 'apt-005',
    referenceId: 'ROZ-5119',
    customerName: 'Abeer Al-Harbi (عبير الحربي)',
    customerPhone: '+966 50 882 1245',
    serviceId: 'srv-haircut-luxury',
    serviceNameEn: 'Haute Couture Haircut & Blowdry',
    serviceNameAr: 'قصة شعر فاخرة وسيشوار ملكي',
    serviceCategory: 'haircut',
    staffId: 'st-fatima',
    staffName: 'Fatima Al-Mutairi',
    date: '2026-09-09',
    time: '12:30 PM',
    status: 'completed',
    notes: 'Completed successfully. Customer left a 5-star Google review.',
    totalSAR: 160,
    createdAt: '2026-09-08 02:10 PM'
  },
  {
    id: 'apt-006',
    referenceId: 'ROZ-4290',
    customerName: 'Danah Al-Zahrani (دانة الزهراني)',
    customerPhone: '+966 53 771 9904',
    serviceId: 'srv-spa-moroccan',
    serviceNameEn: 'Royal Moroccan Bath & Eucalyptus Scrub',
    serviceNameAr: 'حمام مغربي ملكي بصابون الغار وزيت الأرجان',
    serviceCategory: 'spa',
    staffId: 'st-nour',
    staffName: 'Nour Benali',
    date: '2026-09-09',
    time: '12:00 PM',
    status: 'completed',
    notes: 'Paid via Apple Pay at checkout counter.',
    totalSAR: 320,
    createdAt: '2026-09-07 09:30 PM'
  }
];

export const INITIAL_REVIEWS: SalonReview[] = [
  {
    id: 'rev-1',
    authorNameEn: 'Ahad Al-Subaie',
    authorNameAr: 'عهد السبيعي',
    rating: 5,
    date: '3 days ago',
    commentEn: 'The Signature Facial with Layla is pure magic! My skin literally felt like glass afterwards. The golden salon interior in Al Shumaisi gives such an exclusive luxury royal ambiance.',
    commentAr: 'جلسة تنظيف الوجه الملكي مع ليلى خيااال! بشرتي صارت نضرة وتلمع مثل الزجاج. الديكور واللون الأسود والذهبي في فرع الشميسي يعطيك شعور فندقي ملكي وفخم جداً.',
    serviceUsedEn: 'Signature Royal Facial Treatment',
    serviceUsedAr: 'العلاج الملكي الفاخر لتنظيف ونضارة الوجه',
    verified: true
  },
  {
    id: 'rev-2',
    authorNameEn: 'Monira Al-Khaldi',
    authorNameAr: 'منيرة الخالدي',
    rating: 4.5,
    date: '1 week ago',
    commentEn: 'Done the nano-keratin and pedicure here. Fatima took great care of my hair and was very honest about the steps. Very punctual with their 12 PM - 11 PM opening hours.',
    commentAr: 'سويت النانو كيراتين والبديكير هنا، فاطمة أبدعت في شعري وأسلوبها راقي وواضح. ومواعيدهم دقيقة والتزامهم بالوقت من الساعة 12 ظهراً ممتاز.',
    serviceUsedEn: 'Brazilian Nano-Keratin Therapy',
    serviceUsedAr: 'علاج نانو كيراتين البرازيلي للشعر',
    verified: true
  },
  {
    id: 'rev-3',
    authorNameEn: 'Shahad Al-Mansoor',
    authorNameAr: 'شهد المنصور',
    rating: 4,
    date: '2 weeks ago',
    commentEn: 'Great location in Al Shumaisi with easy valet parking. The manicure is meticulous and they use sterilized tools in front of you. 4.2 rating is well deserved!',
    commentAr: 'الموقع في حي الشميسي ممتاز وسهل الوصول، شغل البديكير نظيف جداً والأدوات معقمة وتفتح أمام الزبونة. يستاهلون التقييم العالي وأكثر.',
    serviceUsedEn: 'Golden Elixir Manicure & Pedicure',
    serviceUsedAr: 'بديكير ومنيكير إكسير الذهب الفاخر',
    verified: true
  }
];

export const SALON_SETTINGS: SalonSettings = {
  nameEn: 'Rozana Salon',
  nameAr: 'صالون روزانة',
  branchEn: 'Al Shumaisi Branch, Riyadh',
  branchAr: 'فرع الشميسي، الرياض',
  addressEn: 'Al Shumaisi Street, Al Shumaisi District, Riyadh 12771, Saudi Arabia',
  addressAr: 'شارع الشميسي، حي الشميسي، الرياض 12771، المملكة العربية السعودية',
  openHour: '12:00 PM',
  closeHour: '11:00 PM',
  phone: '+966 11 412 8890',
  whatsapp: '+966 50 882 1245',
  rating: 4.2,
  totalReviews: 348
};

// Strict Operating Hours: 12:00 PM to 11:00 PM
export const OPERATING_HOURS_SLOTS = [
  '12:00 PM',
  '12:30 PM',
  '01:00 PM',
  '01:30 PM',
  '02:00 PM',
  '02:30 PM',
  '03:00 PM',
  '03:30 PM',
  '04:00 PM',
  '04:30 PM',
  '05:00 PM',
  '05:30 PM',
  '06:00 PM',
  '06:30 PM',
  '07:00 PM',
  '07:30 PM',
  '08:00 PM',
  '08:30 PM',
  '09:00 PM',
  '09:30 PM',
  '10:00 PM',
  '10:30 PM'
];

export const MOCK_DATABASE_SCHEMA = {
  postgresSQL: `-- ==========================================
-- ROZANA SALON (صالون روزانة) - DATABASE SCHEMA
-- Target Engine: PostgreSQL / Supabase
-- Branch: Al Shumaisi Branch, Riyadh
-- ==========================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE (Customers, Staff, & Administrators)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(150) NOT NULL,
    phone VARCHAR(30) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE,
    role VARCHAR(30) DEFAULT 'customer' CHECK (role IN ('customer', 'staff', 'admin', 'manager')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. SERVICES TABLE (Salon Treatments, Categories, Pricing)
CREATE TABLE services (
    id VARCHAR(50) PRIMARY KEY,
    name_en VARCHAR(150) NOT NULL,
    name_ar VARCHAR(150) NOT NULL,
    category VARCHAR(50) NOT NULL CHECK (category IN ('facial', 'keratin', 'haircut', 'nails', 'spa')),
    price_sar NUMERIC(10, 2) NOT NULL,
    duration_minutes INT NOT NULL DEFAULT 60,
    description_en TEXT,
    description_ar TEXT,
    is_signature BOOLEAN DEFAULT FALSE,
    rating NUMERIC(2, 1) DEFAULT 4.5,
    is_available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. APPOINTMENTS TABLE (Bookings & Kanban States)
CREATE TABLE appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reference_id VARCHAR(20) UNIQUE NOT NULL,
    customer_name VARCHAR(150) NOT NULL,
    customer_phone VARCHAR(30) NOT NULL,
    service_id VARCHAR(50) REFERENCES services(id) ON DELETE RESTRICT,
    staff_id VARCHAR(50),
    appointment_date DATE NOT NULL,
    appointment_time VARCHAR(20) NOT NULL, -- Restricted 12:00 PM - 11:00 PM
    status VARCHAR(30) DEFAULT 'new' CHECK (status IN ('new', 'confirmed', 'completed', 'cancelled')),
    notes TEXT,
    total_sar NUMERIC(10, 2) NOT NULL,
    branch_name VARCHAR(100) DEFAULT 'Al Shumaisi Branch, Riyadh',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create Indexes for High Performance Scheduling
CREATE INDEX idx_appointments_date_time ON appointments (appointment_date, appointment_time);
CREATE INDEX idx_appointments_status ON appointments (status);
CREATE INDEX idx_services_category ON services (category);
`,

  jsonSample: {
    "users": [
      {
        "id": "u-c711",
        "full_name": "Nouf Al-Dosari",
        "phone": "+966 50 123 4567",
        "role": "customer"
      },
      {
        "id": "u-adm-01",
        "full_name": "Rozana Manager (مشرف صالون روزانة)",
        "phone": "+966 11 412 8890",
        "role": "admin"
      }
    ],
    "services": [
      {
        "id": "srv-facial-signature",
        "name_en": "Signature Royal Facial Treatment",
        "name_ar": "العلاج الملكي الفاخر لتنظيف ونضارة الوجه",
        "category": "facial",
        "price_sar": 380.00,
        "duration_minutes": 75,
        "is_signature": true
      },
      {
        "id": "srv-keratin-brazilian",
        "name_en": "Brazilian Nano-Keratin Therapy",
        "name_ar": "علاج نانو كيراتين البرازيلي للشعر",
        "category": "keratin",
        "price_sar": 650.00,
        "duration_minutes": 150,
        "is_signature": false
      }
    ],
    "appointments": [
      {
        "reference_id": "ROZ-9102",
        "customer_name": "Nouf Al-Dosari",
        "customer_phone": "+966 50 123 4567",
        "service_id": "srv-facial-signature",
        "appointment_date": "2026-09-09",
        "appointment_time": "01:00 PM",
        "status": "new",
        "total_sar": 380.00,
        "branch": "Al Shumaisi Branch, Riyadh"
      }
    ]
  }
};

export interface VipPackage {
  id: string;
  titleEn: string;
  titleAr: string;
  taglineEn: string;
  taglineAr: string;
  priceSAR: number;
  originalPriceSAR: number;
  durationMin: number;
  badgeEn: string;
  badgeAr: string;
  servicesIncludedEn: string[];
  servicesIncludedAr: string[];
  imageUrl: string;
  popular?: boolean;
}

export const VIP_PACKAGES: VipPackage[] = [
  {
    id: 'pkg-royal-bride',
    titleEn: 'The Royal Bride Sanctum',
    titleAr: 'الباقة الملكية الفاخرة للعروس',
    taglineEn: 'The ultimate 5-hour head-to-toe pre-wedding indulgence ritual',
    taglineAr: 'طقوس ملكية متكاملة لمدة ٥ ساعات من الدلال والعناية الشاملة للعروس',
    priceSAR: 1290,
    originalPriceSAR: 1545,
    durationMin: 300,
    badgeEn: 'VIP Bridal Exclusive',
    badgeAr: 'حصرية لكبار العرائس',
    popular: true,
    servicesIncludedEn: [
      'Royal Moroccan Bath & Eucalyptus Body Steam',
      'Signature 24K Gold Hydra-Infusion Facial',
      'Brazilian Nano-Keratin Silk Restoration',
      'Golden Elixir Luxury Manicure & Pedicure',
      'Private Suite, Saudi Qahwa & Artisan Delicacies'
    ],
    servicesIncludedAr: [
      'حمام مغربي ملكي مع بخار الأوكالبتوس العطري',
      'جلسة تنظيف هيدرا ونضارة الذهب عيار 24 قيراط',
      'علاج نانو كيراتين البرازيلي للشعر الحريري',
      'بديكير ومنيكير إكسير الذهب الفاخر',
      'جناح خاص مع ضيافة القهوة السعودية والتمور الفاخرة'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'pkg-red-carpet',
    titleEn: 'Weekend Red-Carpet Radiance',
    titleAr: 'إشراقة السجادة الحمراء للمناسبات',
    taglineEn: 'Instant transformative glow and glam waves for gala evenings and weddings',
    taglineAr: 'نضارة فورية متألقة وتسريحة ويفي ملكية لسهرات ومناسبات الرياض',
    priceSAR: 580,
    originalPriceSAR: 690,
    durationMin: 180,
    badgeEn: 'Best For Events',
    badgeAr: 'الأفضل للمناسبات',
    servicesIncludedEn: [
      'Onyx Glow Collagen Instant Plump Facial',
      'Hollywood Waves or Couture Event Updo',
      'Russian Gel Manicure with Gold Foil Art'
    ],
    servicesIncludedAr: [
      'جلسة نضارة كولاجين الأونيكس لنضارة فورية',
      'تسريحة هوليوود ويفي أو رفع فخم للسهرات',
      'منيكير جل روسي أنيق مع لمسات أوراق الذهب'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1519699047748-de8e457a634e?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'pkg-executive-glow',
    titleEn: 'Executive Rapid Refresh',
    titleAr: 'تجديد الحيوية السريع لكبار الشخصيات',
    taglineEn: 'High-efficiency 75-minute face & hair revitalization for busy schedules',
    taglineAr: 'تألق سريع وعناية مركزة بالبشرة والشعر في ٧٥ دقيقة فقط',
    priceSAR: 390,
    originalPriceSAR: 450,
    durationMin: 75,
    badgeEn: 'Express Luxury',
    badgeAr: 'دلال سريع',
    servicesIncludedEn: [
      'Haute Couture Precision Silhouette Cut & Blow-Dry',
      'Rapid Ultrasound Hydra-Glow Face Treatment',
      'Aromatherapy Scalp & Tension Relieving Massage'
    ],
    servicesIncludedAr: [
      'قصة شعر متقنة وسيشوار ملكي انسيابي',
      'جلسة تنظيف وتغذية سريعة بالموجات فوق الصوتية',
      'تدليك عطري مهدئ لفروة الرأس وإزالة الإجهاد'
    ],
    imageUrl: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?w=800&auto=format&fit=crop&q=80'
  }
];

export interface SalonSuite {
  id: string;
  nameEn: string;
  nameAr: string;
  titleEn: string;
  titleAr: string;
  descriptionEn: string;
  descriptionAr: string;
  featuresEn: string[];
  featuresAr: string[];
  imageUrl: string;
}

export const SALON_SUITES: SalonSuite[] = [
  {
    id: 'suite-facial',
    nameEn: 'Suite Royale 24K',
    nameAr: 'الجناح الملكي لعلاجات الوجه',
    titleEn: 'Private 24K Gold & Hydra Aesthetic Suite',
    titleAr: 'جناح نضارة الذهب وعلاجات البشرة الخاصة',
    descriptionEn: 'An acoustically secluded sanctuary featuring zero-gravity ergonomic medical lounger, multi-stage ultrasonic purification, and medical LED chromotherapy.',
    descriptionAr: 'ملاذ هادئ ومعزول صوتياً مجهز بأحدث أسرة المساج الطبية الذكية، تقنيات الهيدرا المتطورة، وعلاج الكروم للضوء المحفز لكولاجين البشرة.',
    featuresEn: ['Zero-Gravity Heated Bed', '24K Liquid Gold Lab', 'Medical-Grade LED Light Shield', 'Pure Oxygen Mist Infusion'],
    featuresAr: ['سرير طبي مدفأ بانعدام الجاذبية', 'مختبر سيرومات الذهب النقي', 'علاج الضوء الطبي للبشرة', 'رذاذ الأكسجين النقي للترطيب'],
    imageUrl: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'suite-hammam',
    nameEn: 'The Imperial Hammam',
    nameAr: 'الحمام المغربي الإمبراطوري',
    titleEn: 'Authentic Heated Arabesque Marble Steam Chamber',
    titleAr: 'غرفة البخار والرخام الملكي المدفأ',
    descriptionEn: 'Custom-carved heated marble slab suites with aromatic eucalyptus steam circulation, traditional copper basins, and pure Argan oil finishing suites.',
    descriptionAr: 'أجنحة رخامية دافئة مصممة على الطراز الأندلسي مع نظام بخار الأوكالبتوس العطري، أحواض نحاسية تقليدية، وزيوت الأركان العضوية المعتمدة.',
    featuresEn: ['Heated Carved Marble Slabs', 'Eucalyptus Steam Generator', 'Autoclaved Kessa Mitts', 'Private Changing & Rain Shower'],
    featuresAr: ['مسطحات رخامية دافئة معقمة', 'نظام بخار برائحة الأوكالبتوس', 'ليفة مغربية مخصصة لكل ضيفة', 'دش مطري وغرفة تبديل خاصة'],
    imageUrl: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'suite-hair',
    nameEn: 'The Haute Coiffure Atelier',
    nameAr: 'أتيليه تصفيف الشعر وعلاجات الكيراتين',
    titleEn: 'Precision Cutting & Silk Keratin Lounge',
    titleAr: 'صالة قص وتصفيف الشعر وعلاجات الحرير',
    descriptionEn: 'Equipped with custom Italian backwash shampoo stations with built-in air massage, Japanese hand-forged shears, and state-of-the-art Dyson acoustic styling tools.',
    descriptionAr: 'مجهزة بأحدث كراسي غسيل الشعر الإيطالية ذات المساج الهوائي، مقصات يابانية فائقة الحدة، وأجهزة دايسون الاحترافية للتصفيف الصامت.',
    featuresEn: ['Italian Air-Massage Wash Basins', 'Japanese Shears by Master Stylists', 'Dyson Supersonic Pro Styling', 'Organic Nano-Infusion Technology'],
    featuresAr: ['كراسي غسيل إيطالية بمساج هوائي', 'مقصات يابانية لتحديد أطراف الشعر', 'أجهزة دايسون الاحترافية', 'أجهزة النانو لدمج الكيراتين'],
    imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=800&auto=format&fit=crop&q=80'
  },
  {
    id: 'suite-nails',
    nameEn: 'The Golden Elixir Hand & Foot Sanctuary',
    nameAr: 'صالة إكسير الذهب للعناية بالأظافر والسبا',
    titleEn: 'Sterile Luxury Manicure & Pedicure Lounge',
    titleAr: 'صالة البديكير والمنيكير الملكية المعقمة',
    descriptionEn: 'Recline in custom plush velvet armchairs with integrated brass warm footbaths, hospital-grade autoclave tool sterilization, and high-fashion chrome art bar.',
    descriptionAr: 'استرخاء في كراسي مخملية وثيرية مع أحواض نحاسية دافئة، تعقيم طبي بأجهزة الأوتوكلاف يفتح أمام الزبونة، وبار تصاميم الكروم والذهب.',
    featuresEn: ['100% Autoclave Medical Pouch Sealed', 'Warm Brass Hydrotherapy Soak', 'Dead Sea Gold Salt Scrubs', 'Russian Hardware Art Station'],
    featuresAr: ['أكياس أدوات معقمة تفتح أمامك', 'نقع هيدروثيرابي نحاسي دافئ', 'مقشرات أملاح البحر الميت الذهبية', 'أجهزة المنيكير الروسي الجاف'],
    imageUrl: 'https://images.unsplash.com/photo-1632345031435-8727f6897d53?w=800&auto=format&fit=crop&q=80'
  }
];

export interface TransformationItem {
  id: string;
  titleEn: string;
  titleAr: string;
  categoryEn: string;
  categoryAr: string;
  serviceId: string;
  beforeLabelEn: string;
  beforeLabelAr: string;
  afterLabelEn: string;
  afterLabelAr: string;
  descriptionEn: string;
  descriptionAr: string;
  beforeImage: string;
  afterImage: string;
  specialistEn: string;
  specialistAr: string;
}

export const TRANSFORMATIONS: TransformationItem[] = [
  {
    id: 'tr-keratin',
    titleEn: 'Brazilian Nano-Keratin Silk Transformation',
    titleAr: 'تحول الحرير: علاج نانو كيراتين البرازيلي',
    categoryEn: 'Hair Restoration',
    categoryAr: 'ترميم وعلاج الشعر',
    serviceId: 'srv-keratin-brazilian',
    beforeLabelEn: 'Before: Severe Frizz, Heat Fatigue & Porosity',
    beforeLabelAr: 'قبل: تقصف وجفاف وبهتان الشعر من الصبغات',
    afterLabelEn: 'After: Liquid Mirror Silk & Zero Frizz',
    afterLabelAr: 'بعد: لمعان زجاجي حريري وانسيابية كاملة',
    descriptionEn: 'Client had chemically lightened, porous hair with excessive humidity frizz. 150 minutes of organic nano-keratin restored lipid matrix and sealed cuticles for 6 months.',
    descriptionAr: 'كان شعر العميلة يعاني من الجفاف ونفشة الرطوبة بسبب سحب اللون. بعد جلسة النانو كيراتين استعاد الشعر حيويته ولمعانه الحريري المنساب لمدة ٦ أشهر.',
    beforeImage: 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?w=800&auto=format&fit=crop&q=80',
    afterImage: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
    specialistEn: 'Fatima Al-Mutairi',
    specialistAr: 'فاطمة المطيري'
  },
  {
    id: 'tr-facial',
    titleEn: 'Signature 24K Royal Gold Hydra-Plump',
    titleAr: 'إشراقة الزجاج: جلسة تنظيف الذهب الملكي',
    categoryEn: 'Facial Aesthetics',
    categoryAr: 'نضارة وبشرة الوجه',
    serviceId: 'srv-facial-signature',
    beforeLabelEn: 'Before: Dull Tone, Congested T-Zone, Dehydration',
    beforeLabelAr: 'قبل: إجهاد وشحوب بالبشرة مع مسام محتقنة',
    afterLabelEn: 'After: 24K Glass-Skin Plump & Radiance',
    afterLabelAr: 'بعد: نضارة زجاجية فائقة وإشراقة الذهب',
    descriptionEn: 'Triple-stage hydra-cleansing followed by 24K pure gold serum infusion and lymphatic contouring. Immediate visible radiance without downtime.',
    descriptionAr: 'تنظيف هيدرا ثلاثي المراحل ثم حقن سيروم الذهب عيار 24 قيراط وتدليك تصريفي. نتائج فورية مبهرة بدون أي احمرار أو تقشر.',
    beforeImage: 'https://images.unsplash.com/photo-1512290900672-1f5be572e0fa?w=800&auto=format&fit=crop&q=80',
    afterImage: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&auto=format&fit=crop&q=80',
    specialistEn: 'Layla Al-Khatib',
    specialistAr: 'ليلى الخطيب'
  }
];
