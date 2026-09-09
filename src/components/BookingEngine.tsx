import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Service, StaffMember, Appointment } from '../types';
import { OPERATING_HOURS_SLOTS } from '../data/mockData';
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
  Scissors
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface BookingEngineProps {
  services: Service[];
  staff: StaffMember[];
  initialSelectedService: Service | null;
  onBookingComplete: (newAppointment: Appointment) => void;
}

export const BookingEngine: React.FC<BookingEngineProps> = ({
  services,
  staff,
  initialSelectedService,
  onBookingComplete,
}) => {
  const { language, isRTL, t } = useLanguage();

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
  const [notes, setNotes] = useState<string>('');
  
  // Validation / feedback
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [confirmedBooking, setConfirmedBooking] = useState<Appointment | null>(null);

  // Sync when initialSelectedService changes from parent
  useEffect(() => {
    if (initialSelectedService) {
      setSelectedService(initialSelectedService);
    }
  }, [initialSelectedService]);

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

  // Step 4 Final Confirmation Action
  const handleConfirmBooking = () => {
    if (!selectedService) return;

    const assignedStaff = staff.find(s => s.id === selectedStaffId);
    const randomRefNum = Math.floor(1000 + Math.random() * 9000);
    const refCode = `ROZ-${randomRefNum}`;

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
      notes: notes.trim() || undefined,
      totalSAR: selectedService.priceSAR,
      createdAt: new Date().toLocaleString()
    };

    onBookingComplete(newAppointment);
    setConfirmedBooking(newAppointment);
    triggerConfetti();
  };

  const handleResetForm = () => {
    setConfirmedBooking(null);
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
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedTime(slot)}
                          className={`py-2 px-1 text-center rounded-xl text-xs font-mono font-medium transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#E5C378] text-[#0E0C09] font-bold shadow-[0_0_12px_rgba(229,195,120,0.4)]'
                              : 'bg-[#14120D] text-[#A89F91] border border-white/5 hover:border-[#D4AF37]/30'
                          }`}
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
                      {language === 'ar' ? 'السعر الإجمالي' : 'Total Due'}
                    </span>
                    <span className="font-playfair text-3xl font-extrabold text-[#E5C378]">
                      {selectedService.priceSAR}
                    </span>
                    <span className="text-xs font-tajawal text-[#D2C8BA] ms-1">
                      {t('services.sar')}
                    </span>
                  </div>
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
    </section>
  );
};
