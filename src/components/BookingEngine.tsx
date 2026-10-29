import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Service, StaffMember, Appointment, GiftCard, WaitlistEntry, ServiceNotificationRecord } from '../types';
import { OPERATING_HOURS_SLOTS } from '../data/mockData';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { triggerBookingConfirmationNotifications, resendNotification } from '../lib/notificationService';
import { ServiceNotificationCard } from './ServiceNotificationCard';
import { 
  Check, 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Phone, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Share2, 
  AlertCircle,
  Scissors,
  Gift,
  Tag,
  Users,
  Bell,
  Mail
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface BookingEngineProps {
  services: Service[];
  staff: StaffMember[];
  appointments?: Appointment[];
  initialSelectedService: Service | null;
  giftCards?: GiftCard[];
  onBookingComplete: (newAppointment: Appointment) => void;
  onRedeemGiftCard?: (code: string, amount: number, appointmentRef: string) => void;
  onJoinWaitlist?: (entry: WaitlistEntry) => void;
}

export const BookingEngine: React.FC<BookingEngineProps> = ({
  services,
  staff,
  appointments = [],
  initialSelectedService,
  giftCards = [],
  onBookingComplete,
  onRedeemGiftCard,
  onJoinWaitlist,
}) => {
  const { language, isRTL, t } = useLanguage();
  const { currentUser, userProfile } = useAuth();

  // Multi-step: 1 -> 2 -> 3 -> 4
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State
  const [selectedService, setSelectedService] = useState<Service | null>(initialSelectedService || services[0]);
  const [selectedDate, setSelectedDate] = useState<string>(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [selectedTime, setSelectedTime] = useState<string>('02:00 PM');
  const [selectedStaffId, setSelectedStaffId] = useState<string>('');
  const [customerName, setCustomerName] = useState<string>('');
  const [customerPhone, setCustomerPhone] = useState<string>('');
  const [customerEmail, setCustomerEmail] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  // Waitlist State
  const [waitlistModalOpen, setWaitlistModalOpen] = useState<boolean>(false);
  const [waitlistPreferredWindow, setWaitlistPreferredWindow] = useState<string>('any');
  const [waitlistNotes, setWaitlistNotes] = useState<string>('');
  const [waitlistSubmitting, setWaitlistSubmitting] = useState<boolean>(false);
  const [waitlistSubmitted, setWaitlistSubmitted] = useState<WaitlistEntry | null>(null);

  // Auto-fill when client is logged in via Firebase
  useEffect(() => {
    if (currentUser && !customerName) {
      if (userProfile?.displayName) {
        setCustomerName(userProfile.displayName);
      } else if (currentUser.displayName) {
        setCustomerName(currentUser.displayName);
      }
    }
    if (userProfile?.phoneNumber && !customerPhone) {
      setCustomerPhone(userProfile.phoneNumber);
    }
    if (currentUser?.email && !customerEmail) {
      setCustomerEmail(currentUser.email);
    }
  }, [currentUser, userProfile]);

  // Determine booked slots for selectedDate
  const bookedSlotsForDate = appointments
    .filter(a => a.date === selectedDate && a.status !== 'cancelled')
    .map(a => a.time);

  // Check if date is fully booked (e.g. if all operating slots are taken or threshold reached)
  const isDateFullyBooked = OPERATING_HOURS_SLOTS.length > 0 && 
    OPERATING_HOURS_SLOTS.every(slot => bookedSlotsForDate.includes(slot));
  
  // Gift Card Voucher State in Booking
  const [giftCardCodeInput, setGiftCardCodeInput] = useState<string>('');
  const [appliedGiftCard, setAppliedGiftCard] = useState<GiftCard | null>(null);
  const [giftCardError, setGiftCardError] = useState<string>('');

  // Validation / feedback
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [confirmedBooking, setConfirmedBooking] = useState<Appointment | null>(null);
  const [notificationResult, setNotificationResult] = useState<{
    smsRecord?: ServiceNotificationRecord;
    emailRecord?: ServiceNotificationRecord;
  } | null>(null);

  // Sync when initialSelectedService or services change from parent/admin edits
  useEffect(() => {
    if (initialSelectedService) {
      setSelectedService(initialSelectedService);
    } else if (selectedService) {
      const current = services.find(s => s.id === selectedService.id);
      if (current) {
        setSelectedService(current);
      }
    } else if (services.length > 0) {
      setSelectedService(services[0]);
    }
  }, [initialSelectedService, services]);

  // Golden confetti celebration
  const triggerConfetti = () => {
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#E5C378', '#D4AF37', '#FFF8DC', '#C59D4A', '#F5DCA0']
    });
  };

  // Step 1 Validation
  const handleProceedFromStep1 = () => {
    if (!selectedService) {
      setErrorMessage(t('booking.errorSelectService'));
      return;
    }
    setErrorMessage('');
    setCurrentStep(2);
  };

  // Step 2 Validation (Date & Time strictly 12:00 PM - 11:00 PM)
  const handleProceedFromStep2 = () => {
    if (!selectedDate || !selectedTime) {
      setErrorMessage(t('booking.errorSelectTime'));
      return;
    }
    setErrorMessage('');
    setCurrentStep(3);
  };

  // Step 3 Validation (Customer Details)
  const handleProceedFromStep3 = () => {
    if (!customerName.trim() || customerPhone.trim().length < 9) {
      setErrorMessage(t('booking.errorDetails'));
      return;
    }
    setErrorMessage('');
    setCurrentStep(4);
  };

  // Gift Card Application
  const handleApplyGiftCard = (e: React.FormEvent) => {
    e.preventDefault();
    setGiftCardError('');
    const query = giftCardCodeInput.trim().toUpperCase();
    if (!query) {
      setGiftCardError(language === 'ar' ? 'الرجاء كتابة رمز بطاقة الإهداء' : 'Please enter gift card code');
      return;
    }

    const matched = giftCards.find(c => c.code.toUpperCase() === query);
    if (!matched) {
      setGiftCardError(language === 'ar' ? 'عذراً، رمز البطاقة غير موجود أو غير صحيح' : 'Invalid gift card code');
      return;
    }

    if (matched.status === 'cancelled' || matched.status === 'expired') {
      setGiftCardError(language === 'ar' ? 'هذه البطاقة ملغية أو منتهية الصلاحية' : 'This gift card is expired or inactive');
      return;
    }

    if (matched.remainingBalanceSAR <= 0) {
      setGiftCardError(language === 'ar' ? 'رصيد هذه البطاقة مستنفد كلياً (0 ر.س)' : 'This card has zero balance');
      return;
    }

    setAppliedGiftCard(matched);
    setGiftCardCodeInput('');
  };

  const handleRemoveGiftCard = () => {
    setAppliedGiftCard(null);
    setGiftCardError('');
  };

  // Step 4 Calculations
  const originalPrice = selectedService ? selectedService.priceSAR : 0;
  const giftCardDeduction = appliedGiftCard ? Math.min(appliedGiftCard.remainingBalanceSAR, originalPrice) : 0;
  const finalPayableSAR = Math.max(0, originalPrice - giftCardDeduction);

  // Step 4 Final Confirmation Action
  const handleConfirmBooking = () => {
    if (!selectedService) return;

    const assignedStaff = staff.find(s => s.id === selectedStaffId);
    const randomRefNum = Math.floor(1000 + Math.random() * 9000);
    const refCode = `ROZ-${randomRefNum}`;

    const noteSegments = [notes.trim()];
    if (appliedGiftCard && giftCardDeduction > 0) {
      noteSegments.push(`Paid with Gift Card ${appliedGiftCard.code} (-${giftCardDeduction} SAR)`);
      if (onRedeemGiftCard) {
        onRedeemGiftCard(appliedGiftCard.code, giftCardDeduction, refCode);
      }
    }

    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      referenceId: refCode,
      customerName: customerName.trim(),
      customerPhone: customerPhone.startsWith('+966') 
        ? customerPhone.trim() 
        : `+966 ${customerPhone.trim()}`,
      serviceId: selectedService.id,
      serviceNameEn: selectedService.nameEn,
      serviceNameAr: selectedService.nameAr,
      serviceCategory: selectedService.category,
      staffId: assignedStaff?.id,
      staffName: assignedStaff 
        ? (language === 'ar' ? assignedStaff.nameAr : assignedStaff.nameEn)
        : (language === 'ar' ? 'أي أخصائية معتمدة' : 'Any Certified Master Specialist'),
      date: selectedDate,
      time: selectedTime,
      status: 'new',
      notes: noteSegments.filter(Boolean).join(' | ') || undefined,
      totalSAR: finalPayableSAR,
      createdAt: new Date().toLocaleString()
    };

    onBookingComplete(newAppointment);
    setConfirmedBooking(newAppointment);
    triggerConfetti();

    // Automated Service Notification Trigger (Email & Simulated SMS via Mock Notification Utility)
    triggerBookingConfirmationNotifications(newAppointment, {
      fallbackEmail: customerEmail.trim() || undefined
    })
      .then((res) => {
        setNotificationResult(res);
      })
      .catch((err) => {
        console.warn('Failed to dispatch automated notifications:', err);
      });
  };

  const handleResendNotification = async (channel: 'sms' | 'email') => {
    const target = channel === 'sms' ? notificationResult?.smsRecord : notificationResult?.emailRecord;
    if (target) {
      const resent = await resendNotification(target.id);
      if (resent) {
        setNotificationResult((prev) => ({
          ...prev,
          [channel === 'sms' ? 'smsRecord' : 'emailRecord']: resent
        }));
      }
    }
  };

  // Waitlist Submission
  const handleJoinWaitlistSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName.trim() || customerPhone.trim().length < 9) {
      setErrorMessage(t('booking.errorDetails'));
      return;
    }

    setWaitlistSubmitting(true);
    setErrorMessage('');

    const randomRefNum = Math.floor(1000 + Math.random() * 9000);
    const refCode = `WAIT-${randomRefNum}`;

    const newWaitlistEntry: WaitlistEntry = {
      id: `wait-${Date.now()}`,
      referenceCode: refCode,
      date: selectedDate,
      preferredTimeWindow: waitlistPreferredWindow,
      serviceId: selectedService?.id || 'general',
      serviceNameEn: selectedService?.nameEn || 'General Treatment',
      serviceNameAr: selectedService?.nameAr || 'جلسة صالون عامة',
      customerName: customerName.trim(),
      customerPhone: customerPhone.startsWith('+966') ? customerPhone.trim() : `+966 ${customerPhone.trim()}`,
      customerEmail: customerEmail.trim() || undefined,
      notes: waitlistNotes.trim() || undefined,
      status: 'pending',
      createdAt: new Date().toISOString(),
      userId: currentUser?.uid || null,
    };

    try {
      await addDoc(collection(db, 'waitlist'), {
        ...newWaitlistEntry,
        createdTimestamp: new Date().toISOString(),
      });
    } catch (err) {
      console.warn('Firestore waitlist save notice:', err);
    }

    if (onJoinWaitlist) {
      onJoinWaitlist(newWaitlistEntry);
    }

    setWaitlistSubmitted(newWaitlistEntry);
    setWaitlistSubmitting(false);
    triggerConfetti();
  };

  const handleResetForm = () => {
    setConfirmedBooking(null);
    setNotificationResult(null);
    setCurrentStep(1);
    setCustomerName('');
    setCustomerPhone('');
    setNotes('');
  };

  const stepsList = [
    { num: 1, label: t('booking.step1') },
    { num: 2, label: t('booking.step2') },
    { num: 3, label: t('booking.step3') },
    { num: 4, label: t('booking.step4') },
  ];

  return (
    <section id="booking" className="relative py-24 px-4 sm:px-6 lg:px-8 bg-[#0D0B08] overflow-hidden border-t border-[#D4AF37]/15">
      {/* Subtle gold glow backdrop */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#D4AF37]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto relative z-10">
        {/* Title */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#18150E] border border-[#D4AF37]/30 text-[#E5C378] text-xs font-tajawal font-medium mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#E5C378]" />
            <span>{language === 'ar' ? 'حجز فوري ومؤكد • بدون انتظار' : 'Instant Reservation Engine • Al Shumaisi'}</span>
          </div>
          <h2 className="font-playfair text-3xl sm:text-4xl md:text-5xl font-bold text-[#F8F5EE] mb-3">
            {t('booking.title')}
          </h2>
          <p className="font-tajawal text-sm sm:text-base text-[#A89F91]">
            {t('booking.subtitle')}
          </p>
        </div>

        {/* Multi-Step Progress Tracker */}
        {!confirmedBooking && (
          <div className="mb-10 max-w-xl mx-auto">
            <div className="flex items-center justify-between relative">
              {/* Connecting line */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/10 -translate-y-1/2 z-0" />
              <div 
                className="absolute top-1/2 left-0 h-0.5 bg-[#E5C378] -translate-y-1/2 z-0 transition-all duration-300"
                style={{
                  width: `${((currentStep - 1) / (stepsList.length - 1)) * 100}%`
                }}
              />

              {stepsList.map((step) => {
                const isPassed = currentStep > step.num;
                const isCurrent = currentStep === step.num;

                return (
                  <div key={step.num} className="relative z-10 flex flex-col items-center">
                    <button
                      onClick={() => {
                        if (step.num < currentStep) setCurrentStep(step.num);
                      }}
                      disabled={step.num > currentStep}
                      className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-300 cursor-pointer ${
                        isPassed
                          ? 'bg-[#E5C378] text-[#0E0C09] shadow-[0_0_12px_rgba(229,195,120,0.4)]'
                          : isCurrent
                          ? 'bg-[#201A10] border-2 border-[#E5C378] text-[#E5C378] shadow-[0_0_15px_rgba(229,195,120,0.3)] scale-110'
                          : 'bg-[#15130E] border border-white/10 text-[#666]'
                      }`}
                    >
                      {isPassed ? <Check className="w-4 h-4 stroke-[3]" /> : step.num}
                    </button>
                    <span className={`text-[11px] font-tajawal mt-2 hidden sm:block whitespace-nowrap ${
                      isCurrent ? 'text-[#E5C378] font-bold' : isPassed ? 'text-[#DDD]' : 'text-[#666]'
                    }`}>
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Error notification */}
        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-red-950/60 border border-red-500/40 text-red-200 text-sm font-tajawal flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Main Card Container */}
        <div className="luxe-card rounded-3xl p-6 sm:p-10 border border-[#D4AF37]/30 shadow-2xl">
          {/* ========================================================= */}
          {/* STEP 1: SELECT SERVICE */}
          {/* ========================================================= */}
          {currentStep === 1 && !confirmedBooking && (
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <div>
                  <h3 className="font-playfair text-xl sm:text-2xl font-bold text-[#F8F5EE]">
                    {t('booking.step1')}
                  </h3>
                  <p className="font-tajawal text-xs sm:text-sm text-[#A89F91]">
                    {t('booking.selectServicePrompt')}
                  </p>
                </div>
                <span className="text-xs font-mono text-[#E5C378] px-3 py-1 rounded-full bg-[#1F1A10] border border-[#D4AF37]/30">
                  Step 1 / 4
                </span>
              </div>

              <div className="space-y-3 max-h-[440px] overflow-y-auto pr-1">
                {services.map((service) => {
                  const isSelected = selectedService?.id === service.id;
                  return (
                    <div
                      key={service.id}
                      onClick={() => setSelectedService(service)}
                      className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 flex items-center justify-between gap-4 ${
                        isSelected
                          ? 'bg-[#201A10] border-[#E5C378] shadow-[0_0_18px_rgba(229,195,120,0.2)]'
                          : 'bg-[#14120D] border-white/5 hover:border-[#D4AF37]/30 hover:bg-[#1A1711]'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected ? 'border-[#E5C378] bg-[#E5C378]' : 'border-white/20'
                        }`}>
                          {isSelected && <Check className="w-3.5 h-3.5 text-[#0E0C09] stroke-[3]" />}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-playfair font-bold text-[#F8F5EE] text-base">
                              {language === 'ar' ? service.nameAr : service.nameEn}
                            </h4>
                            {service.isSignature && (
                              <span className="px-2 py-0.5 text-[10px] font-tajawal font-bold bg-[#E5C378] text-[#0E0C09] rounded">
                                {language === 'ar' ? 'الملكية' : 'Signature'}
                              </span>
                            )}
                          </div>
                          <p className="font-tajawal text-xs text-[#8C8477] line-clamp-1">
                            {language === 'ar' ? service.descriptionAr : service.descriptionEn}
                          </p>
                          <span className="text-[11px] font-mono text-[#E5C378]">
                            {service.durationMin} {t('services.min')}
                          </span>
                        </div>
                      </div>

                      <div className="text-end shrink-0">
                        <span className="font-playfair text-xl font-bold text-[#E5C378] block">
                          {service.priceSAR}
                        </span>
                        <span className="text-xs font-tajawal text-[#8C8477]">
                          {t('services.sar')}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-8 pt-4 border-t border-white/10 flex justify-end">
                <button
                  id="booking-step1-next"
                  onClick={handleProceedFromStep1}
                  className="luxe-gold-btn px-8 py-3.5 rounded-full font-tajawal font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <span>{t('booking.next')}</span>
                  {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 2: DATE & TIME PICKER (Strictly 12:00 PM - 11:00 PM) */}
          {/* ========================================================= */}
          {currentStep === 2 && !confirmedBooking && (
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <div>
                  <h3 className="font-playfair text-xl sm:text-2xl font-bold text-[#F8F5EE]">
                    {t('booking.step2')}
                  </h3>
                  <p className="font-tajawal text-xs sm:text-sm text-[#E5C378]">
                    {t('booking.hoursNotice')}
                  </p>
                </div>
                <span className="text-xs font-mono text-[#E5C378] px-3 py-1 rounded-full bg-[#1F1A10] border border-[#D4AF37]/30">
                  Step 2 / 4
                </span>
              </div>

              {/* Fully booked banner or slot selection */}
              {isDateFullyBooked ? (
                <div className="mb-8 rounded-2xl bg-[#1A140A] border border-[#D4AF37]/40 p-6 text-center space-y-4">
                  <div className="w-12 h-12 rounded-full bg-[#2A200F] border border-[#D4AF37]/50 flex items-center justify-center text-[#E5C378] mx-auto">
                    <Bell className="w-6 h-6 animate-bounce" />
                  </div>
                  <div>
                    <span className="inline-block px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-[#E5C378] text-xs font-tajawal font-bold mb-2">
                      {t('booking.waitlistBadge')}
                    </span>
                    <h4 className="font-playfair text-xl font-bold text-[#F8F5EE] mb-1">
                      {t('booking.waitlistTitle')}
                    </h4>
                    <p className="font-tajawal text-xs sm:text-sm text-[#D2C8BA] max-w-lg mx-auto">
                      {t('booking.waitlistDesc')}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setWaitlistModalOpen(true)}
                    className="luxe-gold-btn px-8 py-3 rounded-full text-xs sm:text-sm font-tajawal font-bold inline-flex items-center gap-2 cursor-pointer shadow-xl"
                  >
                    <Users className="w-4 h-4" />
                    <span>{t('booking.joinWaitlistBtn')}</span>
                  </button>
                </div>
              ) : null}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                {/* Date Selection */}
                <div>
                  <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <CalendarIcon className="w-4 h-4 text-[#E5C378]" />
                    <span>{t('booking.selectDate')}</span>
                  </label>
                  <input
                    id="booking-date-input"
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={selectedDate}
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl bg-[#14120D] border border-white/15 text-[#F8F5EE] focus:border-[#E5C378] focus:ring-1 focus:ring-[#E5C378] outline-none font-mono"
                  />

                  {/* Quick Preset Days */}
                  <div className="flex items-center gap-2 mt-3">
                    {[
                      { labelEn: 'Today', labelAr: 'اليوم', offset: 0 },
                      { labelEn: 'Tomorrow', labelAr: 'غداً', offset: 1 },
                      { labelEn: 'In 2 Days', labelAr: 'بعد غد', offset: 2 },
                    ].map((preset, idx) => {
                      const d = new Date();
                      d.setDate(d.getDate() + preset.offset);
                      const dateStr = d.toISOString().split('T')[0];
                      const isSelected = selectedDate === dateStr;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => setSelectedDate(dateStr)}
                          className={`px-3 py-1.5 rounded-lg text-xs font-tajawal transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#E5C378] text-[#0E0C09] font-bold'
                              : 'bg-[#1A1711] text-[#A89F91] border border-white/5 hover:border-[#D4AF37]/30'
                          }`}
                        >
                          {language === 'ar' ? preset.labelAr : preset.labelEn}
                        </button>
                      );
                    })}
                  </div>

                  {/* Optional Waitlist entry button even if day has some slots, in case client wants another slot */}
                  <div className="mt-4 pt-3 border-t border-white/5">
                    <button
                      type="button"
                      onClick={() => setWaitlistModalOpen(true)}
                      className="text-xs text-[#E5C378] hover:text-[#F8F5EE] font-tajawal flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Bell className="w-3.5 h-3.5 text-[#E5C378]" />
                      <span>{language === 'ar' ? 'الوقت المرغوب غير متاح؟ انضمي لقائمة الانتظار' : 'Specific time unavailable? Join Date Waitlist'}</span>
                    </button>
                  </div>
                </div>

                {/* Operating Time Slots (12 PM - 11 PM) */}
                <div>
                  <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-[#E5C378]" />
                    <span>{t('booking.selectTime')} (12:00 PM – 11:00 PM)</span>
                  </label>

                  <div className="grid grid-cols-3 gap-2 max-h-[220px] overflow-y-auto pr-1">
                    {OPERATING_HOURS_SLOTS.map((slot) => {
                      const isSelected = selectedTime === slot;
                      const isBooked = bookedSlotsForDate.includes(slot);
                      return (
                        <button
                          key={slot}
                          type="button"
                          disabled={isBooked}
                          onClick={() => {
                            if (!isBooked) setSelectedTime(slot);
                          }}
                          className={`py-2 px-1 text-center rounded-xl text-xs font-mono font-medium transition-all ${
                            isBooked
                              ? 'bg-[#12100C]/50 text-[#5A5348] border border-white/5 cursor-not-allowed line-through'
                              : isSelected
                              ? 'bg-[#E5C378] text-[#0E0C09] font-bold shadow-[0_0_12px_rgba(229,195,120,0.4)] cursor-pointer'
                              : 'bg-[#14120D] text-[#A89F91] border border-white/5 hover:border-[#D4AF37]/30 cursor-pointer'
                          }`}
                          title={isBooked ? (language === 'ar' ? 'هذا الوقت محجوز مسبقاً' : 'Slot already booked') : undefined}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-tajawal text-[#8C8477] hover:text-white flex items-center gap-1.5 cursor-pointer"
                >
                  {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                  <span>{t('booking.back')}</span>
                </button>

                <button
                  id="booking-step2-next"
                  type="button"
                  onClick={handleProceedFromStep2}
                  className="luxe-gold-btn px-8 py-3.5 rounded-full font-tajawal font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <span>{t('booking.next')}</span>
                  {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 3: CUSTOMER DETAILS & SPECIALIST */}
          {/* ========================================================= */}
          {currentStep === 3 && !confirmedBooking && (
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <div>
                  <h3 className="font-playfair text-xl sm:text-2xl font-bold text-[#F8F5EE]">
                    {t('booking.step3')}
                  </h3>
                  <p className="font-tajawal text-xs sm:text-sm text-[#A89F91]">
                    {t('booking.detailsPrompt')}
                  </p>
                </div>
                <span className="text-xs font-mono text-[#E5C378] px-3 py-1 rounded-full bg-[#1F1A10] border border-[#D4AF37]/30">
                  Step 3 / 4
                </span>
              </div>

              <div className="space-y-4 max-w-xl mx-auto">
                {/* Name */}
                <div>
                  <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <User className="w-4 h-4 text-[#E5C378]" />
                    <span>{t('booking.customerName')} *</span>
                  </label>
                  <input
                    id="booking-name-input"
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder={language === 'ar' ? 'الاسم الكريم (مثال: نورة العتيبي)' : 'Your Name (e.g., Noura Al-Otaibi)'}
                    className="w-full px-4 py-3.5 rounded-xl bg-[#14120D] border border-white/15 text-[#F8F5EE] placeholder-[#666] focus:border-[#E5C378] focus:ring-1 focus:ring-[#E5C378] outline-none font-tajawal text-sm"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Phone className="w-4 h-4 text-[#E5C378]" />
                    <span>{t('booking.customerPhone')} *</span>
                  </label>
                  <div className="relative">
                    <input
                      id="booking-phone-input"
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="050 123 4567"
                      className="w-full px-4 py-3.5 rounded-xl bg-[#14120D] border border-white/15 text-[#F8F5EE] placeholder-[#666] focus:border-[#E5C378] focus:ring-1 focus:ring-[#E5C378] outline-none font-mono text-sm"
                    />
                  </div>
                  <span className="text-[11px] text-[#8C8477] font-tajawal mt-1 block">
                    {language === 'ar' ? 'سيتم إرسال تذكرة الموعد وتأكيده عبر الواتساب' : 'Your reservation pass will be shared via WhatsApp / SMS'}
                  </span>
                </div>

                {/* Specialist Selection */}
                <div>
                  <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                    <Scissors className="w-4 h-4 text-[#E5C378]" />
                    <span>{t('booking.specialist')}</span>
                  </label>
                  <select
                    id="booking-specialist-select"
                    value={selectedStaffId}
                    onChange={(e) => setSelectedStaffId(e.target.value)}
                    className="w-full px-4 py-3.5 rounded-xl bg-[#14120D] border border-white/15 text-[#F8F5EE] focus:border-[#E5C378] focus:ring-1 focus:ring-[#E5C378] outline-none font-tajawal text-sm"
                  >
                    <option value="">{t('booking.anySpecialist')}</option>
                    {staff.map((member) => (
                      <option key={member.id} value={member.id}>
                        {language === 'ar' ? member.nameAr : member.nameEn} ({language === 'ar' ? member.roleAr : member.roleEn})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Notes & Special Requests */}
                <div>
                  <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] uppercase tracking-wider mb-2">
                    {t('booking.notes')}
                  </label>
                  <textarea
                    id="booking-notes-input"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder={t('booking.notesPlaceholder')}
                    className="w-full px-4 py-3 rounded-xl bg-[#14120D] border border-white/15 text-[#F8F5EE] placeholder-[#666] focus:border-[#E5C378] focus:ring-1 focus:ring-[#E5C378] outline-none font-tajawal text-sm"
                  />
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-white/10 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-tajawal text-[#8C8477] hover:text-white flex items-center gap-1.5 cursor-pointer"
                >
                  {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                  <span>{t('booking.back')}</span>
                </button>

                <button
                  id="booking-step3-next"
                  type="button"
                  onClick={handleProceedFromStep3}
                  className="luxe-gold-btn px-8 py-3.5 rounded-full font-tajawal font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <span>{t('booking.next')}</span>
                  {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* STEP 4: REVIEW & CONFIRM */}
          {/* ========================================================= */}
          {currentStep === 4 && !confirmedBooking && selectedService && (
            <div>
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
                <div>
                  <h3 className="font-playfair text-xl sm:text-2xl font-bold text-[#F8F5EE]">
                    {t('booking.reviewTitle')}
                  </h3>
                  <p className="font-tajawal text-xs sm:text-sm text-[#A89F91]">
                    {language === 'ar' ? 'تأكدي من صحة التفاصيل قبل تثبيت الحجز' : 'Review all reservation details before final confirmation'}
                  </p>
                </div>
                <span className="text-xs font-mono text-[#E5C378] px-3 py-1 rounded-full bg-[#1F1A10] border border-[#D4AF37]/30">
                  Step 4 / 4
                </span>
              </div>

              {/* Luxury Summary Card */}
              <div className="rounded-2xl bg-[#14120D] border border-[#D4AF37]/30 p-6 sm:p-8 mb-8 text-start">
                <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
                  <div>
                    <span className="text-xs font-tajawal text-[#8C8477]">
                      {language === 'ar' ? 'الخدمة المختارة' : 'Selected Service'}
                    </span>
                    <h4 className="font-playfair text-2xl font-bold text-[#F8F5EE]">
                      {language === 'ar' ? selectedService.nameAr : selectedService.nameEn}
                    </h4>
                    <span className="text-xs font-mono text-[#E5C378]">
                      {selectedService.durationMin} {t('services.min')}
                    </span>
                  </div>

                  <div className="text-end">
                    <span className="text-xs font-tajawal text-[#8C8477] block">
                      {language === 'ar' ? 'المبلغ المطلوب دفعه' : 'Total Due'}
                    </span>
                    <div className="flex items-baseline justify-end gap-1.5">
                      {appliedGiftCard && giftCardDeduction > 0 && (
                        <span className="text-xs line-through text-[#8C8477] font-playfair">
                          {originalPrice} ر.س
                        </span>
                      )}
                      <span className="font-playfair text-3xl font-extrabold text-[#E5C378]">
                        {finalPayableSAR}
                      </span>
                      <span className="text-xs font-tajawal text-[#D2C8BA]">
                        {t('services.sar')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Gift Card Voucher Code Input Section */}
                <div className="my-4 p-4 rounded-xl bg-[#0E0C09] border border-[#D4AF37]/25">
                  <div className="flex items-center gap-2 mb-2">
                    <Gift className="w-4 h-4 text-[#E5C378]" />
                    <span className="text-xs font-tajawal font-bold text-[#F8F5EE]">
                      {language === 'ar' ? 'هل لديكِ بطاقة إهداء رقمية من روزانة؟' : 'Have a Rozana Gift Card Voucher?'}
                    </span>
                  </div>

                  {!appliedGiftCard ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={giftCardCodeInput}
                        onChange={(e) => setGiftCardCodeInput(e.target.value)}
                        placeholder={language === 'ar' ? 'أدخلي كود البطاقة (مثال: ROZ-GOLD-500)' : 'Enter voucher code (e.g. ROZ-GOLD-500)'}
                        className="flex-1 bg-[#14120D] border border-white/10 focus:border-[#E5C378] rounded-xl px-3.5 py-2 text-xs font-mono uppercase text-[#F8F5EE] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleApplyGiftCard}
                        className="px-4 py-2 rounded-xl bg-[#211B11] border border-[#D4AF37]/40 hover:border-[#E5C378] text-[#E5C378] text-xs font-tajawal font-bold transition-all cursor-pointer shrink-0"
                      >
                        {language === 'ar' ? 'تطبيق الخصم' : 'Apply'}
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-2.5 rounded-lg bg-[#1B271E] border border-emerald-500/40 text-xs font-tajawal">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <div>
                          <span className="font-mono font-bold text-emerald-300">{appliedGiftCard.code}</span>
                          <span className="text-[#A89F91] mx-1">•</span>
                          <span className="text-emerald-400 font-bold">-{giftCardDeduction} SAR {language === 'ar' ? 'خصم فوري' : 'deducted'}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveGiftCard}
                        className="text-xs text-red-400 hover:text-red-300 cursor-pointer font-medium"
                      >
                        {language === 'ar' ? 'إلغاء' : 'Remove'}
                      </button>
                    </div>
                  )}

                  {giftCardError && (
                    <p className="text-[11px] text-red-400 font-tajawal mt-2">
                      {giftCardError}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm font-tajawal">
                  <div className="p-3.5 rounded-xl bg-[#18150F] border border-white/5">
                    <span className="text-[#8C8477] block mb-1">{t('booking.selectDate')} & {t('booking.selectTime')}</span>
                    <span className="font-bold text-[#F8F5EE] font-mono text-base block">{selectedDate} @ {selectedTime}</span>
                    <span className="text-[11px] text-[#E5C378]">{t('hero.branch')}</span>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#18150F] border border-white/5">
                    <span className="text-[#8C8477] block mb-1">{t('booking.customerName')}</span>
                    <span className="font-bold text-[#F8F5EE] text-base block">{customerName}</span>
                    <span className="text-xs text-[#8C8477] font-mono">{customerPhone}</span>
                  </div>
                </div>

                {notes && (
                  <div className="mt-4 p-3 rounded-xl bg-[#18150F] border border-white/5 text-xs font-tajawal">
                    <span className="text-[#8C8477] block mb-1">{t('booking.notes')}:</span>
                    <p className="text-[#DDD] italic">{notes}</p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="px-5 py-2.5 rounded-full text-xs sm:text-sm font-tajawal text-[#8C8477] hover:text-white flex items-center gap-1.5 cursor-pointer"
                >
                  {isRTL ? <ArrowRight className="w-4 h-4" /> : <ArrowLeft className="w-4 h-4" />}
                  <span>{t('booking.back')}</span>
                </button>

                {/* Confirm Booking Button */}
                <button
                  id="confirm-booking-final-btn"
                  type="button"
                  onClick={handleConfirmBooking}
                  className="luxe-gold-btn px-10 py-4 rounded-full font-tajawal font-bold text-sm sm:text-base flex items-center gap-2 cursor-pointer shadow-xl"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{t('booking.confirmBtn')}</span>
                </button>
              </div>
            </div>
          )}

          {/* ========================================================= */}
          {/* BOOKING SUCCESS PASS / RECEIPT */}
          {/* ========================================================= */}
          {confirmedBooking && (
            <div className="text-center py-6 animate-in zoom-in-95 duration-300">
              <div className="w-16 h-16 rounded-full bg-[#E5C378]/20 border-2 border-[#E5C378] flex items-center justify-center mx-auto mb-4 shadow-[0_0_20px_rgba(229,195,120,0.4)]">
                <CheckCircle2 className="w-9 h-9 text-[#E5C378]" />
              </div>

              <h3 className="font-playfair text-2xl sm:text-3xl font-bold text-[#F8F5EE] mb-2">
                {t('booking.successTitle')}
              </h3>
              <p className="font-tajawal text-sm text-[#A89F91] max-w-md mx-auto mb-6">
                {t('booking.successSubtitle')}
              </p>

              {/* Gold Luxury Ticket Pass */}
              <div className="max-w-md mx-auto rounded-3xl bg-[#14120D] border border-[#D4AF37]/40 p-6 sm:p-8 shadow-2xl mb-8 text-start">
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                  <span className="text-xs font-tajawal text-[#8C8477]">
                    {t('booking.refCode')}
                  </span>
                  <span className="font-mono text-lg font-bold text-[#E5C378] tracking-wider">
                    {confirmedBooking.referenceId}
                  </span>
                </div>

                <div className="space-y-3 text-xs sm:text-sm font-tajawal">
                  <div className="flex justify-between">
                    <span className="text-[#8C8477]">{t('admin.customer')}:</span>
                    <span className="text-[#F8F5EE] font-bold">{confirmedBooking.customerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8C8477]">{language === 'ar' ? 'الخدمة' : 'Service'}:</span>
                    <span className="text-[#F8F5EE] font-bold">
                      {language === 'ar' ? confirmedBooking.serviceNameAr : confirmedBooking.serviceNameEn}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8C8477]">{language === 'ar' ? 'الموعد' : 'Date & Time'}:</span>
                    <span className="text-[#E5C378] font-mono font-bold">
                      {confirmedBooking.date} @ {confirmedBooking.time}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8C8477]">{t('location.address')}:</span>
                    <span className="text-[#D2C8BA] font-bold">{t('hero.branch')}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-white/10">
                    <span className="text-[#8C8477]">{t('admin.total')}:</span>
                    <span className="text-lg font-bold text-[#E5C378]">
                      {confirmedBooking.totalSAR} {t('services.sar')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Automated Service Notification Trigger Result (Mock Utility SMS & Email) */}
              <ServiceNotificationCard
                smsRecord={notificationResult?.smsRecord}
                emailRecord={notificationResult?.emailRecord}
                onResend={handleResendNotification}
              />

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <a
                  href={`https://wa.me/966508821245?text=${encodeURIComponent(
                    `مرحباً صالون روزانة فرع الشميسي، أود تأكيد موعدي رقم (${confirmedBooking.referenceId}) لخدمة ${confirmedBooking.serviceNameAr} بتاريخ ${confirmedBooking.date} الساعة ${confirmedBooking.time}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-emerald-700 hover:bg-emerald-600 text-white font-tajawal font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg transition-colors"
                >
                  <Share2 className="w-4 h-4" />
                  <span>{t('booking.whatsAppShare')}</span>
                </a>

                <button
                  onClick={handleResetForm}
                  className="w-full sm:w-auto px-6 py-3.5 rounded-full bg-[#1A1711] border border-white/15 hover:border-white/40 text-[#F8F5EE] font-tajawal text-xs sm:text-sm transition-colors cursor-pointer"
                >
                  {t('booking.bookAnother')}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ========================================================= */}
      {/* WAITLIST SIGNUP MODAL */}
      {/* ========================================================= */}
      {waitlistModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="w-full max-w-lg rounded-3xl bg-[#12100C] border border-[#D4AF37]/40 p-6 sm:p-8 shadow-2xl relative text-start">
            <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-[#2A200F] border border-[#D4AF37]/40 flex items-center justify-center text-[#E5C378]">
                  <Bell className="w-5 h-5 text-[#E5C378]" />
                </div>
                <div>
                  <h3 className="font-playfair text-lg sm:text-xl font-bold text-[#F8F5EE]">
                    {t('booking.waitlistTitle')}
                  </h3>
                  <span className="text-xs text-[#E5C378] font-mono">
                    {selectedDate} • {language === 'ar' ? selectedService?.nameAr : selectedService?.nameEn}
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setWaitlistModalOpen(false);
                  setWaitlistSubmitted(null);
                }}
                className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 text-[#8C8477] hover:text-white flex items-center justify-center text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            {waitlistSubmitted ? (
              <div className="text-center py-6 space-y-4 animate-in fade-in duration-300">
                <div className="w-14 h-14 rounded-full bg-emerald-950/70 border border-emerald-500/50 flex items-center justify-center text-emerald-400 mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="font-playfair text-xl font-bold text-[#F8F5EE]">
                  {t('booking.waitlistSuccessTitle')}
                </h4>
                <p className="font-tajawal text-xs sm:text-sm text-[#D2C8BA] leading-relaxed">
                  {t('booking.waitlistSuccessDesc')}
                </p>
                <div className="p-3.5 rounded-2xl bg-[#1A1711] border border-white/10 text-xs font-mono text-[#E5C378]">
                  Reference Code: <span className="font-bold text-white">{waitlistSubmitted.referenceCode}</span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setWaitlistModalOpen(false);
                    setWaitlistSubmitted(null);
                  }}
                  className="luxe-gold-btn px-6 py-2.5 rounded-full text-xs font-tajawal font-bold mt-2 cursor-pointer"
                >
                  {language === 'ar' ? 'إغلاق' : 'Close'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleJoinWaitlistSubmit} className="space-y-4">
                <p className="font-tajawal text-xs text-[#A89F91] leading-relaxed">
                  {t('booking.waitlistDesc')}
                </p>

                {/* Name */}
                <div>
                  <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-[#E5C378]" />
                    <span>{t('booking.customerName')} *</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder={t('booking.namePlaceholder')}
                    className="w-full px-4 py-3 rounded-xl bg-[#181510] border border-white/15 text-[#F8F5EE] placeholder-[#665F55] focus:border-[#E5C378] text-xs sm:text-sm outline-none font-tajawal"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-[#E5C378]" />
                    <span>{t('booking.phone')} *</span>
                  </label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder={t('booking.phonePlaceholder')}
                    className="w-full px-4 py-3 rounded-xl bg-[#181510] border border-white/15 text-[#F8F5EE] placeholder-[#665F55] focus:border-[#E5C378] text-xs sm:text-sm outline-none font-mono"
                  />
                </div>

                {/* Preferred Window */}
                <div>
                  <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] mb-1.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#E5C378]" />
                    <span>{t('booking.preferredWindow')}</span>
                  </label>
                  <select
                    value={waitlistPreferredWindow}
                    onChange={(e) => setWaitlistPreferredWindow(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#181510] border border-white/15 text-[#F8F5EE] focus:border-[#E5C378] text-xs sm:text-sm outline-none font-tajawal"
                  >
                    <option value="any">{t('booking.windowAny')}</option>
                    <option value="afternoon">{t('booking.windowAfternoon')}</option>
                    <option value="evening">{t('booking.windowEvening')}</option>
                  </select>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] mb-1.5">
                    {t('booking.notes')}
                  </label>
                  <input
                    type="text"
                    value={waitlistNotes}
                    onChange={(e) => setWaitlistNotes(e.target.value)}
                    placeholder={language === 'ar' ? 'أي تفضيل إضافي أو وقت محدد...' : 'Specific preferred time or requirement...'}
                    className="w-full px-4 py-3 rounded-xl bg-[#181510] border border-white/15 text-[#F8F5EE] placeholder-[#665F55] focus:border-[#E5C378] text-xs sm:text-sm outline-none font-tajawal"
                  />
                </div>

                {errorMessage && (
                  <p className="text-xs text-rose-400 font-tajawal flex items-center gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>{errorMessage}</span>
                  </p>
                )}

                <div className="pt-3 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setWaitlistModalOpen(false)}
                    className="px-5 py-2.5 rounded-full text-xs font-tajawal text-[#8C8477] hover:text-white cursor-pointer"
                  >
                    {t('booking.back')}
                  </button>
                  <button
                    type="submit"
                    disabled={waitlistSubmitting}
                    className="luxe-gold-btn px-6 py-2.5 rounded-full text-xs font-tajawal font-bold flex items-center gap-2 cursor-pointer shadow-lg disabled:opacity-50"
                  >
                    <Bell className="w-3.5 h-3.5" />
                    <span>{waitlistSubmitting ? (language === 'ar' ? 'جارٍ التسجيل...' : 'Submitting...') : t('booking.joinWaitlistBtn')}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
