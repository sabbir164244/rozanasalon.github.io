import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useToast } from '../../context/ToastContext';
import { Appointment, AppointmentStatus, StaffMember, Service } from '../../types';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Search, 
  Plus, 
  Filter, 
  Printer, 
  Download, 
  Edit3, 
  Trash2, 
  Check, 
  Sparkles, 
  DollarSign, 
  FileText,
  MessageCircle,
  Copy,
  ExternalLink,
  Send,
  Share2
} from 'lucide-react';

interface AdminBookingsTabProps {
  appointments: Appointment[];
  staff: StaffMember[];
  services: Service[];
  onUpdateStatus: (appointmentId: string, newStatus: AppointmentStatus) => void;
  onUpdateAppointment: (updated: Appointment) => void;
  onDeleteAppointment: (appointmentId: string) => void;
  onAddAppointment: (newAppt: Appointment) => void;
  onAddAuditLog?: (entry: any) => void;
}

export type QuickMessageType = 'confirmation' | 'reminder' | 'thankyou' | 'custom';

export const cleanWhatsAppPhone = (phone: string): string => {
  let digits = phone.replace(/[^0-9]/g, '');
  if (digits.startsWith('05')) {
    digits = '966' + digits.slice(1);
  } else if (digits.startsWith('5') && digits.length === 9) {
    digits = '966' + digits;
  }
  return digits;
};

export const buildWhatsAppMessage = (
  appt: Appointment,
  type: QuickMessageType,
  lang: 'ar' | 'en'
): string => {
  const serviceName = lang === 'ar' ? appt.serviceNameAr : appt.serviceNameEn;
  const staffName = lang === 'ar' ? appt.staffNameAr : appt.staffNameEn;
  const ref = appt.referenceId || appt.id;

  if (type === 'confirmation') {
    if (lang === 'ar') {
      return `مرحباً بكِ أستاذة ${appt.customerName} في صالون روزانة للشعر والتجميل 👑\n\n` +
        `يسعدنا تأكيد حجز موعدكِ الملكي:\n` +
        `• رقم الحجز: #${ref}\n` +
        `• الخدمة: ${serviceName}\n` +
        `• التاريخ: ${appt.date}\n` +
        `• الوقت: ${appt.time}\n` +
        `• الأخصائية: ${staffName}\n` +
        `• المبلغ الإجمالي: ${appt.totalSAR} ر.س\n` +
        `• الموقع: صالون روزانة - فرع الشميسي، الرياض\n\n` +
        `نتطلع لخدمتكِ بأعلى معايير العناية والضيافة الملكية ✨\n` +
        `لأي استفسار أو رغبة بالتعديل، يمكنكِ الرد مباشرة على هذه المحادثة.`;
    } else {
      return `Hello ${appt.customerName}, welcome to Rozana Haute Coiffure 👑\n\n` +
        `We are delighted to confirm your royal reservation:\n` +
        `• Booking Ref: #${ref}\n` +
        `• Service: ${serviceName}\n` +
        `• Date: ${appt.date}\n` +
        `• Time: ${appt.time}\n` +
        `• Specialist: ${staffName}\n` +
        `• Total Amount: ${appt.totalSAR} SAR\n` +
        `• Location: Rozana Salon - Al Shumaisi, Riyadh\n\n` +
        `We look forward to offering you an exceptional salon experience ✨\n` +
        `For questions or adjustments, please feel free to reply directly to this message.`;
    }
  }

  if (type === 'reminder') {
    if (lang === 'ar') {
      return `أهلاً بكِ أستاذة ${appt.customerName} ✨\n\n` +
        `تذكير لطيف بموعدكِ القادم لدى صالون روزانة بالشميسي:\n` +
        `• الخدمة: ${serviceName}\n` +
        `• الموعد: ${appt.date} في تمام الساعة ${appt.time}\n` +
        `• الأخصائية المعتمدة: ${staffName}\n\n` +
        `نرجو التكرم بالحضور قبل الموعد بـ 10 دقائق للاسترخاء والاستمتاع بضيافتنا الخاصة والقهوة الملكية ☕\n` +
        `صالون روزانة يرحب بكِ دائماً 👑`;
    } else {
      return `Hello ${appt.customerName} ✨\n\n` +
        `Gentle reminder of your upcoming appointment at Rozana Haute Coiffure:\n` +
        `• Treatment: ${serviceName}\n` +
        `• Scheduled: ${appt.date} at ${appt.time}\n` +
        `• Specialist: ${staffName}\n\n` +
        `Kindly arrive 10 minutes prior to unwind with our signature salon hospitality ☕\n` +
        `Looking forward to pampering you 👑`;
    }
  }

  if (type === 'thankyou') {
    if (lang === 'ar') {
      return `أهلاً بكِ أستاذة ${appt.customerName} 👑\n\n` +
        `سعدنا جداً بزيارتكِ الكريمة اليوم لصالون روزانة بالشميسي لخدمة (${serviceName}).\n` +
        `نتمنى أن تكون تجربتكِ قد حازت على رضاكِ التام وبالمستوى الذي تستحقينه.\n` +
        `يسعدنا دائماً استقبال ملاحظاتكِ وتقييمكِ لمواصلة تقديم الأفضل دوماً ✨`;
    } else {
      return `Dear ${appt.customerName} 👑\n\n` +
        `Thank you for visiting Rozana Haute Coiffure today for your (${serviceName}) session.\n` +
        `We hope you thoroughly enjoyed your royal treatment.\n` +
        `We truly value your feedback and look forward to welcoming you again soon ✨`;
    }
  }

  // Custom
  return lang === 'ar'
    ? `أهلاً بكِ أستاذة ${appt.customerName}، صالون روزانة للشعر والتجميل بالشميسي يحييكِ 👑`
    : `Hello ${appt.customerName}, greetings from Rozana Haute Coiffure Al Shumaisi 👑`;
};

export const AdminBookingsTab: React.FC<AdminBookingsTabProps> = ({
  appointments,
  staff,
  services,
  onUpdateStatus,
  onUpdateAppointment,
  onDeleteAppointment,
  onAddAppointment,
  onAddAuditLog,
}) => {
  const { language, isRTL } = useLanguage();
  const { notifyNewBooking, addToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | AppointmentStatus>('all');
  const [selectedInvoiceAppt, setSelectedInvoiceAppt] = useState<Appointment | null>(null);
  const [editingAppt, setEditingAppt] = useState<Appointment | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  // Quick WhatsApp Message Modal State
  const [quickMessageAppt, setQuickMessageAppt] = useState<Appointment | null>(null);
  const [messageType, setMessageType] = useState<QuickMessageType>('confirmation');
  const [messageLang, setMessageLang] = useState<'ar' | 'en'>(language === 'en' ? 'en' : 'ar');
  const [messageBody, setMessageBody] = useState<string>('');
  const [isCopied, setIsCopied] = useState<boolean>(false);

  // Manual Add Form State
  const [addName, setAddName] = useState('');
  const [addPhone, setAddPhone] = useState('+966 5');
  const [addDate, setAddDate] = useState(new Date().toISOString().split('T')[0]);
  const [addTime, setAddTime] = useState('02:00 PM');
  const [addServiceId, setAddServiceId] = useState(services[0]?.id || '');
  const [addStaffId, setAddStaffId] = useState(staff[0]?.id || '');
  const [addNotes, setAddNotes] = useState('');
  const [addTotalSAR, setAddTotalSAR] = useState(services[0]?.priceSAR || 290);

  // Filter appointments
  const filteredAppointments = appointments.filter((appt) => {
    const matchesStatus = statusFilter === 'all' || appt.status === statusFilter;
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      appt.customerName.toLowerCase().includes(q) ||
      appt.customerPhone.includes(q) ||
      appt.serviceNameEn.toLowerCase().includes(q) ||
      appt.serviceNameAr.includes(q) ||
      appt.id.toLowerCase().includes(q);
    return matchesStatus && matchesSearch;
  });

  // Handle Export CSV
  const handleExportCSV = () => {
    const headers = ['Booking ID', 'Customer Name', 'Phone', 'Service (EN)', 'Date', 'Time', 'Staff', 'Total (SAR)', 'Status'];
    const rows = appointments.map((a) => [
      a.id,
      `"${a.customerName}"`,
      a.customerPhone,
      `"${a.serviceNameEn}"`,
      a.date,
      a.time,
      `"${a.staffNameEn}"`,
      a.totalSAR,
      a.status
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `rozana_salon_bookings_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Submit Manual Add
  const handleManualAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const selSrv = services.find((s) => s.id === addServiceId) || services[0];
    const selStaff = staff.find((st) => st.id === addStaffId) || staff[0];

    const newAppt: Appointment = {
      id: `RZ-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: addName || 'Walk-In Guest',
      customerPhone: addPhone,
      serviceId: selSrv?.id || 'custom',
      serviceNameEn: selSrv?.nameEn || 'Luxury Service',
      serviceNameAr: selSrv?.nameAr || 'خدمة صالون راقية',
      staffId: selStaff?.id || 'staff-1',
      staffNameEn: selStaff?.nameEn || 'Master Stylist',
      staffNameAr: selStaff?.nameAr || 'خبيرة التجميل الملكية',
      date: addDate,
      time: addTime,
      status: 'confirmed',
      notes: addNotes || undefined,
      totalSAR: Number(addTotalSAR) || selSrv?.priceSAR || 290,
      createdAt: new Date().toISOString()
    };

    onAddAppointment(newAppt);
    notifyNewBooking(newAppt);
    setIsAddOpen(false);
    setAddName('');
    setAddNotes('');
  };

  // Quick simulation of real incoming customer booking
  const handleSimulateIncomingBooking = () => {
    const randomRef = `ROZ-${Math.floor(1000 + Math.random() * 9000)}`;
    const sampleNames = ['ريم العبدالله', 'نورة الدوسري', 'هند الفايز', 'خلود القحطاني', 'Princess Sultana'];
    const chosenService = services[Math.floor(Math.random() * services.length)] || {
      id: 'srv-1',
      nameAr: 'جلسة كولاجين وماسكات الذهب الملكي',
      nameEn: 'Royal 24K Gold & Collagen Facial',
      priceSAR: 550
    };
    const chosenStaff = staff[Math.floor(Math.random() * staff.length)] || {
      id: 'st-1',
      nameAr: 'أنتونيلا كوفيلو',
      nameEn: 'Antonella Covello'
    };
    const sampleName = sampleNames[Math.floor(Math.random() * sampleNames.length)];

    const simBooking: Appointment = {
      id: `apt-${Date.now()}`,
      referenceId: randomRef,
      customerName: sampleName,
      customerPhone: '+966 54 892 1104',
      serviceId: chosenService.id,
      serviceNameAr: chosenService.nameAr,
      serviceNameEn: chosenService.nameEn,
      staffId: chosenStaff.id,
      staffNameAr: chosenStaff.nameAr,
      staffNameEn: chosenStaff.nameEn,
      date: new Date().toISOString().split('T')[0],
      time: '05:00 PM',
      status: 'new',
      totalSAR: chosenService.priceSAR,
      createdAt: new Date().toLocaleString()
    };

    onAddAppointment(simBooking);
    notifyNewBooking(simBooking);
  };

  // Submit Edit Appointment
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAppt) return;
    onUpdateAppointment(editingAppt);
    setEditingAppt(null);
  };

  // Open Quick WhatsApp Message Dialog
  const handleOpenQuickMessage = (appt: Appointment, defaultType?: QuickMessageType) => {
    const initialType: QuickMessageType = defaultType
      ? defaultType
      : (appt.status === 'new' ? 'confirmation' : (appt.status === 'completed' ? 'thankyou' : 'reminder'));
    const initialLang: 'ar' | 'en' = language === 'en' ? 'en' : 'ar';
    setQuickMessageAppt(appt);
    setMessageType(initialType);
    setMessageLang(initialLang);
    setMessageBody(buildWhatsAppMessage(appt, initialType, initialLang));
    setIsCopied(false);
  };

  // Change preset template
  const handleChangeMessageType = (newType: QuickMessageType) => {
    setMessageType(newType);
    if (quickMessageAppt) {
      setMessageBody(buildWhatsAppMessage(quickMessageAppt, newType, messageLang));
    }
  };

  // Change template language
  const handleChangeMessageLang = (newLang: 'ar' | 'en') => {
    setMessageLang(newLang);
    if (quickMessageAppt) {
      setMessageBody(buildWhatsAppMessage(quickMessageAppt, messageType, newLang));
    }
  };

  // Copy message text
  const handleCopyMessage = () => {
    navigator.clipboard.writeText(messageBody);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2200);
    addToast({
      type: 'success',
      titleAr: 'تم نسخ نص الرسالة',
      titleEn: 'Message Copied',
      messageAr: 'تم نسخ نص الرسالة إلى الحافظة بنجاح',
      messageEn: 'Message copied to clipboard'
    });
  };

  return (
    <div className="space-y-8 text-start animate-in fade-in duration-300">
      {/* Top Controls Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'ar' ? 'بحث برقم الحجز، الاسم، الجوال...' : 'Search by ID, name, or phone...'}
              className="w-full px-4 py-2.5 rounded-2xl bg-[#13110C] border border-white/10 text-xs text-[#F8F5EE] focus:border-[#E5C378] outline-none ps-9 font-tajawal"
            />
            <Search className="w-4 h-4 text-[#8C8477] absolute start-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {(['all', 'new', 'confirmed', 'completed', 'cancelled'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1.5 rounded-xl text-xs font-tajawal font-bold capitalize transition-colors cursor-pointer whitespace-nowrap ${
                  statusFilter === st
                    ? 'bg-[#E5C378] text-[#0E0C09]'
                    : 'bg-[#18150F] text-[#A89F91] border border-white/5 hover:border-white/20'
                }`}
              >
                {st === 'all' 
                  ? (language === 'ar' ? 'الكل' : 'All')
                  : st === 'new'
                  ? (language === 'ar' ? 'جديد' : 'New')
                  : st === 'confirmed'
                  ? (language === 'ar' ? 'مؤكد' : 'Confirmed')
                  : st === 'completed'
                  ? (language === 'ar' ? 'مكتمل' : 'Completed')
                  : (language === 'ar' ? 'ملغي' : 'Cancelled')}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <button
            onClick={handleSimulateIncomingBooking}
            className="px-4 py-2.5 rounded-full bg-[#201A10] hover:bg-[#2F2515] border border-[#D4AF37]/50 text-xs font-tajawal font-bold text-[#E5C378] flex items-center gap-2 cursor-pointer transition-all shadow-md active:scale-95"
            title={language === 'ar' ? 'محاكاة استلام حجز جديد فوري واختبار الإشعار' : 'Simulate incoming booking and test toast'}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#E5C378] animate-spin" />
            <span>{language === 'ar' ? 'محاكاة حجز وارد (تجربة)' : 'Simulate Booking (Test)'}</span>
          </button>

          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 rounded-full bg-[#18150F] border border-white/10 hover:border-[#D4AF37]/40 text-xs font-tajawal text-[#D2C8BA] flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#E5C378]" />
            <span>{language === 'ar' ? 'تصدير كشف الحجوزات (CSV)' : 'Export CSV'}</span>
          </button>

          <button
            onClick={() => setIsAddOpen(true)}
            className="px-5 py-2.5 rounded-full luxe-gold-btn text-xs font-tajawal font-bold flex items-center gap-2 cursor-pointer shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'ar' ? 'تسجيل حجز يدوي' : 'New Manual Booking'}</span>
          </button>
        </div>
      </div>

      {/* Bookings Table View */}
      <div className="rounded-3xl bg-[#13110C] border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-start text-xs font-tajawal">
            <thead>
              <tr className="bg-[#18150F] border-b border-white/10 text-[#8C8477] uppercase text-[10px] tracking-wider">
                <th className="py-3.5 px-4 font-bold">{language === 'ar' ? 'رقم الحجز' : 'Booking ID'}</th>
                <th className="py-3.5 px-4 font-bold">{language === 'ar' ? 'العميلة' : 'Customer'}</th>
                <th className="py-3.5 px-4 font-bold">{language === 'ar' ? 'الخدمة المطلوبة' : 'Service'}</th>
                <th className="py-3.5 px-4 font-bold">{language === 'ar' ? 'الموعد' : 'Date & Time'}</th>
                <th className="py-3.5 px-4 font-bold">{language === 'ar' ? 'الأخصائية' : 'Stylist'}</th>
                <th className="py-3.5 px-4 font-bold">{language === 'ar' ? 'المبلغ' : 'Amount'}</th>
                <th className="py-3.5 px-4 font-bold">{language === 'ar' ? 'الحالة' : 'Status'}</th>
                <th className="py-3.5 px-4 font-bold text-center">{language === 'ar' ? 'الإجراءات' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredAppointments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-[#8C8477]">
                    {language === 'ar' ? 'لا توجد حجوزات مطابقة للبحث' : 'No bookings found matching filters'}
                  </td>
                </tr>
              ) : (
                filteredAppointments.map((appt) => (
                  <tr key={appt.id} className="hover:bg-[#18150F]/70 transition-colors">
                    {/* Booking ID */}
                    <td className="py-3.5 px-4 font-mono font-bold text-[#E5C378]">
                      {appt.id}
                    </td>

                    {/* Customer */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#F8F5EE]">{appt.customerName}</div>
                      <div className="text-[11px] font-mono text-[#8C8477]">{appt.customerPhone}</div>
                    </td>

                    {/* Service */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-[#F8F5EE] line-clamp-1">
                        {language === 'ar' ? appt.serviceNameAr : appt.serviceNameEn}
                      </div>
                      {appt.notes && (
                        <div className="text-[10px] text-[#A89F91] line-clamp-1 italic">
                          "{appt.notes}"
                        </div>
                      )}
                    </td>

                    {/* Date & Time */}
                    <td className="py-3.5 px-4">
                      <div className="font-mono text-[#F8F5EE]">{appt.date}</div>
                      <div className="text-[11px] font-mono text-[#E5C378]">{appt.time}</div>
                    </td>

                    {/* Staff */}
                    <td className="py-3.5 px-4 text-[#D2C8BA]">
                      {language === 'ar' ? appt.staffNameAr : appt.staffNameEn}
                    </td>

                    {/* Total */}
                    <td className="py-3.5 px-4 font-mono font-bold text-[#E5C378]">
                      {appt.totalSAR} SAR
                    </td>

                    {/* Status badge & selector */}
                    <td className="py-3.5 px-4">
                      <select
                        value={appt.status}
                        onChange={(e) => onUpdateStatus(appt.id, e.target.value as AppointmentStatus)}
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold outline-none cursor-pointer border ${
                          appt.status === 'confirmed'
                            ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/30'
                            : appt.status === 'completed'
                            ? 'bg-blue-950/80 text-blue-300 border-blue-500/30'
                            : appt.status === 'new'
                            ? 'bg-amber-950/80 text-amber-300 border-amber-500/30'
                            : 'bg-red-950/80 text-red-300 border-red-500/30'
                        }`}
                      >
                        <option value="new" className="bg-[#18150F] text-amber-300">
                          {language === 'ar' ? 'جديد (New)' : 'New'}
                        </option>
                        <option value="confirmed" className="bg-[#18150F] text-emerald-300">
                          {language === 'ar' ? 'مؤكد (Confirmed)' : 'Confirmed'}
                        </option>
                        <option value="completed" className="bg-[#18150F] text-blue-300">
                          {language === 'ar' ? 'مكتمل (Completed)' : 'Completed'}
                        </option>
                        <option value="cancelled" className="bg-[#18150F] text-red-300">
                          {language === 'ar' ? 'ملغي (Cancelled)' : 'Cancelled'}
                        </option>
                      </select>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center justify-center gap-1.5">
                        {/* Quick Message Button (WhatsApp Confirmation / Reminder) */}
                        <button
                          id={`quick-wa-btn-${appt.id}`}
                          onClick={() => handleOpenQuickMessage(appt)}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-950/70 hover:bg-emerald-900 text-emerald-400 hover:text-emerald-200 border border-emerald-500/30 hover:border-emerald-400/60 cursor-pointer transition-all flex items-center gap-1.5 shadow-sm group active:scale-95"
                          title={language === 'ar' ? 'إرسال رسالة سريعة / واتساب (تأكيد أو تذكير)' : 'Quick WhatsApp Message (Confirmation / Reminder)'}
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-emerald-400 group-hover:scale-110 transition-transform" />
                          <span className="text-[11px] font-bold">
                            {language === 'ar' ? 'مراسلة' : 'Quick Msg'}
                          </span>
                        </button>

                        {/* Invoice Receipt */}
                        <button
                          onClick={() => setSelectedInvoiceAppt(appt)}
                          className="p-1.5 rounded-lg bg-[#221D14] hover:bg-[#2A2318] text-[#E5C378] border border-white/5 cursor-pointer"
                          title="Print / View Invoice"
                        >
                          <FileText className="w-3.5 h-3.5" />
                        </button>

                        {/* Edit Booking */}
                        <button
                          onClick={() => setEditingAppt(appt)}
                          className="p-1.5 rounded-lg bg-[#221D14] hover:bg-[#2A2318] text-[#A89F91] hover:text-[#F8F5EE] border border-white/5 cursor-pointer"
                          title="Edit Booking"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Booking */}
                        <button
                          onClick={() => onDeleteAppointment(appt.id)}
                          className="p-1.5 rounded-lg bg-red-950/30 hover:bg-red-900/50 text-red-400 border border-red-500/20 cursor-pointer"
                          title="Delete Booking"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MODAL 1: VIP INVOICE RECEIPT MODAL */}
      {/* ========================================================= */}
      {selectedInvoiceAppt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-3xl bg-[#13110C] border border-[#D4AF37]/50 p-6 sm:p-8 shadow-2xl text-start">
            <button
              onClick={() => setSelectedInvoiceAppt(null)}
              className="absolute top-5 end-5 w-8 h-8 rounded-full bg-[#1F1A11] text-[#A89F91] hover:text-white flex items-center justify-center text-sm cursor-pointer"
            >
              ✕
            </button>

            {/* Receipt Content */}
            <div id="print-receipt-content" className="space-y-4">
              <div className="text-center pb-4 border-b border-white/10">
                <h3 className="font-playfair text-xl font-bold text-[#E5C378]">
                  ROZANA SALON & SPA
                </h3>
                <p className="font-tajawal text-xs text-[#A89F91]">
                  صالون روزانة • فرع الشميسي، الرياض
                </p>
                <div className="mt-2 inline-block px-3 py-1 rounded-full bg-[#1F1A11] border border-[#D4AF37]/30 text-[10px] font-mono text-[#E5C378]">
                  BOOKING RECEIPT #{selectedInvoiceAppt.id}
                </div>
              </div>

              <div className="space-y-2 text-xs font-tajawal">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-[#8C8477]">{language === 'ar' ? 'اسم العميلة:' : 'Customer:'}</span>
                  <span className="font-bold text-[#F8F5EE]">{selectedInvoiceAppt.customerName}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-[#8C8477]">{language === 'ar' ? 'رقم الهاتف:' : 'Phone:'}</span>
                  <span className="font-mono text-[#F8F5EE]">{selectedInvoiceAppt.customerPhone}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-[#8C8477]">{language === 'ar' ? 'الخدمة الملكية:' : 'Treatment:'}</span>
                  <span className="font-bold text-[#E5C378]">
                    {language === 'ar' ? selectedInvoiceAppt.serviceNameAr : selectedInvoiceAppt.serviceNameEn}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-[#8C8477]">{language === 'ar' ? 'تاريخ وساعة الموعد:' : 'Scheduled Slot:'}</span>
                  <span className="font-mono text-[#F8F5EE]">{selectedInvoiceAppt.date} @ {selectedInvoiceAppt.time}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-[#8C8477]">{language === 'ar' ? 'الأخصائية المعتمدة:' : 'Specialist:'}</span>
                  <span className="text-[#F8F5EE]">
                    {language === 'ar' ? selectedInvoiceAppt.staffNameAr : selectedInvoiceAppt.staffNameEn}
                  </span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-[#8C8477]">{language === 'ar' ? 'حالة الحجز:' : 'Status:'}</span>
                  <span className="uppercase font-mono font-bold text-emerald-400">{selectedInvoiceAppt.status}</span>
                </div>
                <div className="flex justify-between pt-2 text-sm font-bold">
                  <span className="text-[#F8F5EE]">{language === 'ar' ? 'المبلغ الإجمالي:' : 'Total Amount:'}</span>
                  <span className="font-mono text-[#E5C378]">{selectedInvoiceAppt.totalSAR} SAR</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#18150F] border border-white/5 text-[10px] text-center text-[#8C8477] font-tajawal">
                {language === 'ar' 
                  ? 'شكراً لاختياركِ صالون روزانة بالشميسي. نلتزم بأعلى معايير التعقيم والضيافة الملكية.'
                  : 'Thank you for choosing Rozana Salon Al Shumaisi. Hospital-grade sterilization guaranteed.'}
              </div>
            </div>

            <div className="flex gap-3 pt-4 border-t border-white/10 mt-4">
              <button
                onClick={() => setSelectedInvoiceAppt(null)}
                className="flex-1 py-2.5 rounded-full bg-[#1A1711] border border-white/10 text-xs font-tajawal text-[#D2C8BA] cursor-pointer"
              >
                {language === 'ar' ? 'إغلاق' : 'Close'}
              </button>
              <button
                onClick={() => handleOpenQuickMessage(selectedInvoiceAppt, 'confirmation')}
                className="px-4 py-2.5 rounded-full bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/30 text-emerald-300 text-xs font-tajawal font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-md"
                title="Send Invoice details via WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
                <span>{language === 'ar' ? 'إرسال عبر واتساب' : 'WhatsApp'}</span>
              </button>
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded-full luxe-gold-btn text-xs font-tajawal font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-lg"
              >
                <Printer className="w-4 h-4" />
                <span>{language === 'ar' ? 'طباعة الفاتورة' : 'Print Invoice'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 2: MANUAL ADD BOOKING */}
      {/* ========================================================= */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#13110C] border border-[#D4AF37]/50 p-6 sm:p-8 shadow-2xl text-start">
            <button
              onClick={() => setIsAddOpen(false)}
              className="absolute top-5 end-5 w-8 h-8 rounded-full bg-[#1F1A11] text-[#A89F91] hover:text-white flex items-center justify-center text-sm cursor-pointer"
            >
              ✕
            </button>

            <h3 className="font-playfair text-xl font-bold text-[#F8F5EE] mb-1">
              {language === 'ar' ? 'تسجيل حجز يدوي مباشر' : 'Create Direct Salon Booking'}
            </h3>
            <p className="font-tajawal text-xs text-[#A89F91] mb-6">
              {language === 'ar' ? 'للحجوزات الواردة عبر الهاتف أو الحضور المباشر' : 'For phone calls or walk-in VIP clients'}
            </p>

            <form onSubmit={handleManualAdd} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] mb-1">
                    {language === 'ar' ? 'اسم العميلة' : 'Customer Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={addName}
                    onChange={(e) => setAddName(e.target.value)}
                    placeholder="e.g. Noura Al-Otaibi"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#18150F] border border-white/10 text-xs text-[#F8F5EE] focus:border-[#E5C378] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] mb-1">
                    {language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                  </label>
                  <input
                    type="text"
                    required
                    value={addPhone}
                    onChange={(e) => setAddPhone(e.target.value)}
                    placeholder="+966 5..."
                    className="w-full px-4 py-2.5 rounded-xl bg-[#18150F] border border-white/10 text-xs text-[#F8F5EE] focus:border-[#E5C378] outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] mb-1">
                  {language === 'ar' ? 'الخدمة المطلوبة' : 'Service Treatment'}
                </label>
                <select
                  value={addServiceId}
                  onChange={(e) => {
                    const sid = e.target.value;
                    setAddServiceId(sid);
                    const s = services.find((srv) => srv.id === sid);
                    if (s) setAddTotalSAR(s.priceSAR);
                  }}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#18150F] border border-white/10 text-xs text-[#F8F5EE] focus:border-[#E5C378] outline-none"
                >
                  {services.map((s) => (
                    <option key={s.id} value={s.id} className="bg-[#18150F]">
                      {language === 'ar' ? s.nameAr : s.nameEn} ({s.priceSAR} SAR)
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] mb-1">
                    {language === 'ar' ? 'التاريخ' : 'Date'}
                  </label>
                  <input
                    type="date"
                    required
                    value={addDate}
                    onChange={(e) => setAddDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#18150F] border border-white/10 text-xs text-[#F8F5EE] focus:border-[#E5C378] outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] mb-1">
                    {language === 'ar' ? 'الوقت' : 'Time'}
                  </label>
                  <input
                    type="text"
                    required
                    value={addTime}
                    onChange={(e) => setAddTime(e.target.value)}
                    placeholder="02:00 PM"
                    className="w-full px-4 py-2.5 rounded-xl bg-[#18150F] border border-white/10 text-xs text-[#F8F5EE] focus:border-[#E5C378] outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] mb-1">
                    {language === 'ar' ? 'السعر الإجمالي (SAR)' : 'Total (SAR)'}
                  </label>
                  <input
                    type="number"
                    required
                    value={addTotalSAR}
                    onChange={(e) => setAddTotalSAR(Number(e.target.value))}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#18150F] border border-white/10 text-xs text-[#F8F5EE] focus:border-[#E5C378] outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] mb-1">
                  {language === 'ar' ? 'الأخصائية المخصصة' : 'Assigned Stylist'}
                </label>
                <select
                  value={addStaffId}
                  onChange={(e) => setAddStaffId(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#18150F] border border-white/10 text-xs text-[#F8F5EE] focus:border-[#E5C378] outline-none"
                >
                  {staff.map((st) => (
                    <option key={st.id} value={st.id} className="bg-[#18150F]">
                      {language === 'ar' ? st.nameAr : st.nameEn} ({language === 'ar' ? st.roleAr : st.roleEn})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] mb-1">
                  {language === 'ar' ? 'ملاحظات إضافية' : 'Notes / Requests'}
                </label>
                <input
                  type="text"
                  value={addNotes}
                  onChange={(e) => setAddNotes(e.target.value)}
                  placeholder={language === 'ar' ? 'ملاحظات خاصة...' : 'Any special customer notes...'}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#18150F] border border-white/10 text-xs text-[#F8F5EE] focus:border-[#E5C378] outline-none"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="flex-1 py-2.5 rounded-full bg-[#1A1711] border border-white/10 text-xs font-tajawal text-[#D2C8BA] cursor-pointer"
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-full luxe-gold-btn text-xs font-tajawal font-bold cursor-pointer shadow-lg"
                >
                  {language === 'ar' ? 'تأكيد وحفظ الحجز' : 'Create Booking'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* MODAL 3: EDIT BOOKING */}
      {/* ========================================================= */}
      {editingAppt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-3xl bg-[#13110C] border border-[#D4AF37]/50 p-6 sm:p-8 shadow-2xl text-start">
            <button
              onClick={() => setEditingAppt(null)}
              className="absolute top-5 end-5 w-8 h-8 rounded-full bg-[#1F1A11] text-[#A89F91] hover:text-white flex items-center justify-center text-sm cursor-pointer"
            >
              ✕
            </button>

            <h3 className="font-playfair text-xl font-bold text-[#F8F5EE] mb-1">
              {language === 'ar' ? 'تعديل تفاصيل الحجز' : 'Edit Booking Details'}
            </h3>
            <p className="font-mono text-xs text-[#E5C378] mb-4">#{editingAppt.id}</p>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] mb-1">
                  {language === 'ar' ? 'اسم العميلة' : 'Customer Name'}
                </label>
                <input
                  type="text"
                  required
                  value={editingAppt.customerName}
                  onChange={(e) => setEditingAppt({ ...editingAppt, customerName: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#18150F] border border-white/10 text-xs text-[#F8F5EE] focus:border-[#E5C378] outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] mb-1">
                  {language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}
                </label>
                <input
                  type="text"
                  required
                  value={editingAppt.customerPhone}
                  onChange={(e) => setEditingAppt({ ...editingAppt, customerPhone: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#18150F] border border-white/10 text-xs text-[#F8F5EE] focus:border-[#E5C378] outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] mb-1">
                    {language === 'ar' ? 'التاريخ' : 'Date'}
                  </label>
                  <input
                    type="date"
                    required
                    value={editingAppt.date}
                    onChange={(e) => setEditingAppt({ ...editingAppt, date: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#18150F] border border-white/10 text-xs text-[#F8F5EE] focus:border-[#E5C378] outline-none font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] mb-1">
                    {language === 'ar' ? 'الوقت' : 'Time'}
                  </label>
                  <input
                    type="text"
                    required
                    value={editingAppt.time}
                    onChange={(e) => setEditingAppt({ ...editingAppt, time: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#18150F] border border-white/10 text-xs text-[#F8F5EE] focus:border-[#E5C378] outline-none font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] mb-1">
                  {language === 'ar' ? 'المبلغ الإجمالي (SAR)' : 'Total (SAR)'}
                </label>
                <input
                  type="number"
                  required
                  value={editingAppt.totalSAR}
                  onChange={(e) => setEditingAppt({ ...editingAppt, totalSAR: Number(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#18150F] border border-white/10 text-xs text-[#F8F5EE] focus:border-[#E5C378] outline-none font-mono"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setEditingAppt(null)}
                  className="flex-1 py-2.5 rounded-full bg-[#1A1711] border border-white/10 text-xs font-tajawal text-[#D2C8BA] cursor-pointer"
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-full luxe-gold-btn text-xs font-tajawal font-bold cursor-pointer shadow-lg"
                >
                  {language === 'ar' ? 'حفظ التعديلات' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* ========================================================= */}
      {/* MODAL 3: QUICK WHATSAPP MESSAGE (CONFIRMATION & REMINDER) */}
      {/* ========================================================= */}
      {quickMessageAppt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-xl rounded-3xl bg-[#13110C] border border-emerald-500/40 p-6 sm:p-8 shadow-2xl text-start max-h-[92vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setQuickMessageAppt(null)}
              className="absolute top-5 end-5 w-8 h-8 rounded-full bg-[#1F1A11] text-[#A89F91] hover:text-white flex items-center justify-center text-sm cursor-pointer transition-colors"
            >
              ✕
            </button>

            {/* Header */}
            <div className="flex items-start gap-3.5 pb-4 border-b border-white/10">
              <div className="w-12 h-12 rounded-2xl bg-emerald-950/80 border border-emerald-500/40 flex items-center justify-center text-emerald-400 shrink-0 shadow-inner">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-playfair text-xl font-bold text-[#F8F5EE]">
                    {language === 'ar' ? 'مراسلة سريعة عبر واتساب' : 'Quick WhatsApp Message'}
                  </h3>
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/30">
                    WhatsApp Direct
                  </span>
                </div>
                <p className="font-tajawal text-xs text-[#A89F91] mt-0.5">
                  {language === 'ar' 
                    ? `إرسال تأكيد الحجز أو التذكير الفوري للعميلة: ${quickMessageAppt.customerName}`
                    : `Send instant confirmation or reminder to: ${quickMessageAppt.customerName}`}
                </p>
              </div>
            </div>

            {/* Client Snapshot Card */}
            <div className="mt-4 p-3.5 rounded-2xl bg-[#18150F] border border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-tajawal">
              <div>
                <span className="text-[10px] text-[#8C8477] block">{language === 'ar' ? 'العميلة' : 'Customer'}</span>
                <span className="font-bold text-[#F8F5EE] truncate block">{quickMessageAppt.customerName}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#8C8477] block">{language === 'ar' ? 'رقم الهاتف' : 'Phone'}</span>
                <span className="font-mono text-[#E5C378] font-bold block">{quickMessageAppt.customerPhone}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#8C8477] block">{language === 'ar' ? 'الموعد' : 'Date & Time'}</span>
                <span className="font-mono text-[#D2C8BA] block">{quickMessageAppt.date} @ {quickMessageAppt.time}</span>
              </div>
              <div>
                <span className="text-[10px] text-[#8C8477] block">{language === 'ar' ? 'الخدمة' : 'Service'}</span>
                <span className="font-bold text-[#F8F5EE] truncate block">
                  {language === 'ar' ? quickMessageAppt.serviceNameAr : quickMessageAppt.serviceNameEn}
                </span>
              </div>
            </div>

            {/* Template Selection Tabs */}
            <div className="mt-5 space-y-2">
              <label className="block text-xs font-tajawal font-bold text-[#D2C8BA]">
                {language === 'ar' ? 'اختر نموذج الرسالة السريعة:' : 'Select Message Template:'}
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => handleChangeMessageType('confirmation')}
                  className={`px-3 py-2 rounded-xl text-xs font-tajawal font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer border ${
                    messageType === 'confirmation'
                      ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500 shadow-md ring-1 ring-emerald-500/30'
                      : 'bg-[#18150F] text-[#A89F91] border-white/5 hover:border-white/20'
                  }`}
                >
                  <span>👑 {language === 'ar' ? 'تأكيد الحجز' : 'Confirmation'}</span>
                  <span className="text-[9px] opacity-70 font-normal">
                    {language === 'ar' ? 'تفاصيل الموعد' : 'Booking Details'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleChangeMessageType('reminder')}
                  className={`px-3 py-2 rounded-xl text-xs font-tajawal font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer border ${
                    messageType === 'reminder'
                      ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500 shadow-md ring-1 ring-emerald-500/30'
                      : 'bg-[#18150F] text-[#A89F91] border-white/5 hover:border-white/20'
                  }`}
                >
                  <span>⏰ {language === 'ar' ? 'تذكير بالموعد' : 'Reminder'}</span>
                  <span className="text-[9px] opacity-70 font-normal">
                    {language === 'ar' ? 'قبل الموعد' : 'Upcoming Session'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleChangeMessageType('thankyou')}
                  className={`px-3 py-2 rounded-xl text-xs font-tajawal font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer border ${
                    messageType === 'thankyou'
                      ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500 shadow-md ring-1 ring-emerald-500/30'
                      : 'bg-[#18150F] text-[#A89F91] border-white/5 hover:border-white/20'
                  }`}
                >
                  <span>✨ {language === 'ar' ? 'شكر وتقييم' : 'Thank You'}</span>
                  <span className="text-[9px] opacity-70 font-normal">
                    {language === 'ar' ? 'بعد الخدمة' : 'Post-Service'}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => handleChangeMessageType('custom')}
                  className={`px-3 py-2 rounded-xl text-xs font-tajawal font-bold flex flex-col items-center justify-center gap-1 transition-all cursor-pointer border ${
                    messageType === 'custom'
                      ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500 shadow-md ring-1 ring-emerald-500/30'
                      : 'bg-[#18150F] text-[#A89F91] border-white/5 hover:border-white/20'
                  }`}
                >
                  <span>💬 {language === 'ar' ? 'رسالة خاصة' : 'Custom'}</span>
                  <span className="text-[9px] opacity-70 font-normal">
                    {language === 'ar' ? 'كتابة حرة' : 'Free Text'}
                  </span>
                </button>
              </div>
            </div>

            {/* Language Toggle & Text Area */}
            <div className="mt-4 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-tajawal font-bold text-[#D2C8BA]">
                  {language === 'ar' ? 'محتوى الرسالة (قابل للتعديل قبل الإرسال):' : 'Message Content (Editable):'}
                </label>
                <div className="flex items-center gap-1 bg-[#18150F] p-1 rounded-xl border border-white/5 text-[11px]">
                  <button
                    type="button"
                    onClick={() => handleChangeMessageLang('ar')}
                    className={`px-2.5 py-0.5 rounded-lg font-tajawal font-bold transition-colors cursor-pointer ${
                      messageLang === 'ar' ? 'bg-[#E5C378] text-[#0E0C09]' : 'text-[#A89F91]'
                    }`}
                  >
                    العربية
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChangeMessageLang('en')}
                    className={`px-2.5 py-0.5 rounded-lg font-sans font-bold transition-colors cursor-pointer ${
                      messageLang === 'en' ? 'bg-[#E5C378] text-[#0E0C09]' : 'text-[#A89F91]'
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>

              <textarea
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
                rows={7}
                className="w-full px-4 py-3 rounded-2xl bg-[#18150F] border border-emerald-500/30 text-xs text-[#F8F5EE] focus:border-emerald-400 outline-none font-tajawal leading-relaxed resize-none transition-colors"
                placeholder={language === 'ar' ? 'اكتب نص الرسالة هنا...' : 'Type message here...'}
              />

              <div className="flex items-center justify-between text-[11px] text-[#8C8477] px-1 font-mono">
                <span>
                  {language === 'ar' ? 'عدد الأحرف:' : 'Characters:'} {messageBody.length}
                </span>
                <span className="text-emerald-400/90 font-mono">
                  wa.me/{cleanWhatsAppPhone(quickMessageAppt.customerPhone)}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-5 border-t border-white/10 mt-5">
              <button
                type="button"
                onClick={() => setQuickMessageAppt(null)}
                className="py-3 px-5 rounded-full bg-[#1A1711] border border-white/10 hover:border-white/20 text-xs font-tajawal text-[#D2C8BA] cursor-pointer transition-colors"
              >
                {language === 'ar' ? 'إغلاق' : 'Close'}
              </button>

              <button
                type="button"
                onClick={handleCopyMessage}
                className="py-3 px-5 rounded-full bg-[#1F1A11] border border-[#D4AF37]/30 hover:border-[#D4AF37] text-xs font-tajawal text-[#E5C378] flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-95"
              >
                {isCopied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>
                  {isCopied 
                    ? (language === 'ar' ? 'تم نسخ النص!' : 'Copied!') 
                    : (language === 'ar' ? 'نسخ النص' : 'Copy Message')}
                </span>
              </button>

              <a
                href={`https://wa.me/${cleanWhatsAppPhone(quickMessageAppt.customerPhone)}?text=${encodeURIComponent(messageBody)}`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  if (onAddAuditLog) {
                    const typeLabel = messageType === 'confirmation' ? 'Confirmation' : messageType === 'reminder' ? 'Reminder' : messageType === 'thankyou' ? 'Thank You' : 'Custom';
                    const typeLabelAr = messageType === 'confirmation' ? 'تأكيد حجز' : messageType === 'reminder' ? 'تذكير موعد' : messageType === 'thankyou' ? 'شكر وتقييم' : 'رسالة خاصة';
                    onAddAuditLog({
                      category: 'bookings',
                      actionType: 'booking_notification',
                      titleAr: `إرسال رسالة واتساب (${typeLabelAr}) #${quickMessageAppt.referenceId || quickMessageAppt.id}`,
                      titleEn: `WhatsApp ${typeLabel} Sent: #${quickMessageAppt.referenceId || quickMessageAppt.id}`,
                      detailsAr: `تم إعداد وإرسال رسالة ${typeLabelAr} للعميلة ${quickMessageAppt.customerName} (${quickMessageAppt.customerPhone}).`,
                      detailsEn: `Triggered WhatsApp ${typeLabel} to ${quickMessageAppt.customerName} (${quickMessageAppt.customerPhone}).`,
                      actor: 'Rozana Admin',
                      targetId: quickMessageAppt.id,
                      targetName: quickMessageAppt.customerName,
                      severity: 'info'
                    });
                  }
                  addToast({
                    type: 'booking',
                    titleAr: 'تم فتح رابط واتساب',
                    titleEn: 'WhatsApp Link Triggered',
                    messageAr: `تم تجهيز رسالة ${quickMessageAppt.customerName} في تطبيق واتساب`,
                    messageEn: `WhatsApp ready with pre-filled message for ${quickMessageAppt.customerName}`
                  });
                }}
                className="flex-1 py-3 px-6 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-tajawal text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-emerald-950/60 transition-all active:scale-95"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>{language === 'ar' ? 'إرسال عبر واتساب (WhatsApp)' : 'Send via WhatsApp'}</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-70" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
