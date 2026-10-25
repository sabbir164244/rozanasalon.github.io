import React, { useState, useMemo } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { AuditLogEntry, AuditLogCategory } from '../../types';
import { 
  ScrollText, 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  Sparkles, 
  Calendar, 
  Clock, 
  UserCheck, 
  ArrowRight, 
  ShieldAlert, 
  Scissors, 
  Users, 
  CalendarClock, 
  Gift, 
  ShieldCheck, 
  Sliders, 
  AlertTriangle, 
  CheckCircle2, 
  Info,
  RefreshCw,
  FileSpreadsheet,
  FileCode
} from 'lucide-react';

interface AdminAuditLogTabProps {
  logs: AuditLogEntry[];
  onClearLogs?: () => void;
  onAddLog?: (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => void;
}

export const AdminAuditLogTab: React.FC<AdminAuditLogTabProps> = ({
  logs,
  onClearLogs,
  onAddLog
}) => {
  const { language, isRTL } = useLanguage();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<AuditLogCategory | 'all'>('all');
  const [selectedSeverity, setSelectedSeverity] = useState<'all' | 'info' | 'warning' | 'success' | 'alert'>('all');
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  // Statistics calculation
  const stats = useMemo(() => {
    const total = logs.length;
    const priceAndServiceChanges = logs.filter(l => l.category === 'services').length;
    const staffChanges = logs.filter(l => l.category === 'staff').length;
    const bookingChanges = logs.filter(l => l.category === 'bookings').length;
    const securityChanges = logs.filter(l => l.category === 'security').length;
    return { total, priceAndServiceChanges, staffChanges, bookingChanges, securityChanges };
  }, [logs]);

  // Filtered logs
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      // Category filter
      if (selectedCategory !== 'all' && log.category !== selectedCategory) {
        return false;
      }
      // Severity filter
      if (selectedSeverity !== 'all' && log.severity !== selectedSeverity) {
        return false;
      }
      // Search term
      if (searchTerm.trim() !== '') {
        const query = searchTerm.toLowerCase();
        const matchTitle = (language === 'ar' ? log.titleAr : log.titleEn).toLowerCase().includes(query);
        const matchDetails = (language === 'ar' ? log.detailsAr : log.detailsEn).toLowerCase().includes(query);
        const matchActor = log.actor.toLowerCase().includes(query);
        const matchTarget = (log.targetName || '').toLowerCase().includes(query);
        const matchAction = log.actionType.toLowerCase().includes(query);
        if (!matchTitle && !matchDetails && !matchActor && !matchTarget && !matchAction) {
          return false;
        }
      }
      return true;
    });
  }, [logs, selectedCategory, selectedSeverity, searchTerm, language]);

  // Export to CSV
  const handleExportCSV = () => {
    if (logs.length === 0) return;
    const headers = ['ID', 'Timestamp', 'Category', 'ActionType', 'Actor', 'Target', 'PreviousValue', 'NewValue', 'Title_EN', 'Title_AR', 'Details_EN', 'Details_AR'];
    const rows = logs.map(l => [
      `"${l.id}"`,
      `"${l.timestamp}"`,
      `"${l.category}"`,
      `"${l.actionType}"`,
      `"${l.actor}"`,
      `"${l.targetName || l.targetId || ''}"`,
      `"${l.previousValue || ''}"`,
      `"${l.newValue || ''}"`,
      `"${(l.titleEn || '').replace(/"/g, '""')}"`,
      `"${(l.titleAr || '').replace(/"/g, '""')}"`,
      `"${(l.detailsEn || '').replace(/"/g, '""')}"`,
      `"${(l.detailsAr || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rozana_salon_audit_log_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export to JSON
  const handleExportJSON = () => {
    if (logs.length === 0) return;
    const blob = new Blob([JSON.stringify(logs, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `rozana_salon_audit_log_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Quick simulate an administrative action for demonstration
  const handleSimulateAction = () => {
    if (!onAddLog) return;
    const sampleActions = [
      {
        category: 'services' as AuditLogCategory,
        actionType: 'price_change',
        titleAr: 'تحديث تسعيرة: مساج وباقة الشعر الملكي',
        titleEn: 'Service Price Changed: Royal Hair & Scalp Ritual',
        detailsAr: 'تم تعديل السعر من 450 ر.س إلى 480 ر.س بعد إضافة سيروم الكيراتين المركز المستورد.',
        detailsEn: 'Price adjusted from 450 SAR to 480 SAR following formula upgrade with imported keratin.',
        actor: 'Director (Admin)',
        targetId: 'srv-hair-01',
        targetName: 'Royal Hair & Scalp Ritual',
        previousValue: '450 SAR',
        newValue: '480 SAR',
        severity: 'warning' as const
      },
      {
        category: 'bookings' as AuditLogCategory,
        actionType: 'booking_status',
        titleAr: 'تغيير حالة حجز إلى: مكتمل',
        titleEn: 'Booking Status Updated: Completed',
        detailsAr: 'اكتملت جلسة السيدة منيرة القحطاني لحجز الذهب عيار 24 (#ROZ-5512) وتم تأكيد الدفع.',
        detailsEn: 'Appointment #ROZ-5512 (Muneera Al-Qahtani) marked as completed and settled.',
        actor: 'Front Desk Reception',
        targetId: 'apt-5512',
        targetName: 'Reservation #ROZ-5512',
        previousValue: 'confirmed',
        newValue: 'completed',
        severity: 'success' as const
      },
      {
        category: 'staff' as AuditLogCategory,
        actionType: 'staff_update',
        titleAr: 'تعديل جدول الخبيرة سيلفيا موريتي',
        titleEn: 'Staff Schedule Updated: Silvia Moretti',
        detailsAr: 'تم تفعيل استقبال الحجوزات المسائية لجلسات مساج اليدين والأظافر الروسية.',
        detailsEn: 'Activated evening shifts for master nail technician Silvia Moretti.',
        actor: 'Rozana Manager',
        targetId: 'st-2',
        targetName: 'Silvia Moretti',
        previousValue: 'Morning shift only',
        newValue: 'All day shift',
        severity: 'info' as const
      }
    ];

    const randomAction = sampleActions[Math.floor(Math.random() * sampleActions.length)];
    onAddLog(randomAction);
  };

  // Helper to render Category Icon & Styling
  const getCategoryBadge = (category: AuditLogCategory) => {
    switch (category) {
      case 'services':
        return {
          icon: <Scissors className="w-3.5 h-3.5" />,
          labelAr: 'الخدمات والأسعار',
          labelEn: 'Services & Pricing',
          style: 'bg-[#D4AF37]/15 text-[#E5C378] border-[#D4AF37]/40'
        };
      case 'staff':
        return {
          icon: <Users className="w-3.5 h-3.5" />,
          labelAr: 'فريق العمل',
          labelEn: 'Staff & Team',
          style: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
        };
      case 'bookings':
        return {
          icon: <CalendarClock className="w-3.5 h-3.5" />,
          labelAr: 'الحجوزات والطلبات',
          labelEn: 'Bookings & Orders',
          style: 'bg-sky-500/15 text-sky-400 border-sky-500/30'
        };
      case 'security':
        return {
          icon: <ShieldCheck className="w-3.5 h-3.5" />,
          labelAr: 'الأمان والوصول',
          labelEn: 'Security & Auth',
          style: 'bg-amber-500/15 text-amber-300 border-amber-500/30'
        };
      case 'giftcards':
        return {
          icon: <Gift className="w-3.5 h-3.5" />,
          labelAr: 'بطاقات الإهداء',
          labelEn: 'Gift Cards',
          style: 'bg-rose-500/15 text-rose-300 border-rose-500/30'
        };
      case 'content':
        return {
          icon: <Sliders className="w-3.5 h-3.5" />,
          labelAr: 'تخصيص المحتوى',
          labelEn: 'Site Content',
          style: 'bg-purple-500/15 text-purple-300 border-purple-500/30'
        };
      case 'backup':
        return {
          icon: <RefreshCw className="w-3.5 h-3.5" />,
          labelAr: 'النسخ الاحتياطي',
          labelEn: 'Backup & Restore',
          style: 'bg-blue-500/15 text-blue-300 border-blue-500/30'
        };
      default:
        return {
          icon: <ScrollText className="w-3.5 h-3.5" />,
          labelAr: 'النظام العام',
          labelEn: 'System',
          style: 'bg-gray-500/15 text-gray-300 border-gray-500/30'
        };
    }
  };

  // Helper for Severity icon
  const getSeverityBadge = (severity?: string) => {
    switch (severity) {
      case 'warning':
        return (
          <span className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/30">
            <AlertTriangle className="w-3 h-3 text-amber-400" />
            <span>{language === 'ar' ? 'تعديل سعر / حسّاس' : 'Warning / Price'}</span>
          </span>
        );
      case 'success':
        return (
          <span className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            <span>{language === 'ar' ? 'مؤكد / نجاح' : 'Success'}</span>
          </span>
        );
      case 'alert':
        return (
          <span className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30">
            <ShieldAlert className="w-3 h-3 text-rose-400" />
            <span>{language === 'ar' ? 'أمان فائق' : 'Security Alert'}</span>
          </span>
        );
      default:
        return (
          <span className="flex items-center gap-1 text-[11px] font-mono px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-300 border border-blue-500/30">
            <Info className="w-3 h-3 text-blue-400" />
            <span>{language === 'ar' ? 'معلومة / تحديث' : 'Info Update'}</span>
          </span>
        );
    }
  };

  // Format Date and Time
  const formatTimestamp = (isoString: string) => {
    try {
      const date = new Date(isoString);
      const formattedDate = date.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      const formattedTime = date.toLocaleTimeString(language === 'ar' ? 'ar-SA' : 'en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      return { formattedDate, formattedTime };
    } catch {
      return { formattedDate: isoString, formattedTime: '' };
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-[#14110B] via-[#1A160F] to-[#14110B] border border-[#D4AF37]/30 p-5 sm:p-6 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2.5 mb-1.5">
            <div className="w-8 h-8 rounded-lg bg-[#D4AF37]/15 border border-[#D4AF37]/40 flex items-center justify-center text-[#E5C378]">
              <ScrollText className="w-4 h-4" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold font-playfair text-[#F8F5EE]">
              {language === 'ar' ? 'سجل العمليات الإدارية والرقابة (Audit Log)' : 'Administrative Audit & Security Log'}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#A89F91] max-w-2xl">
            {language === 'ar'
              ? 'سجل غير قابل للتعديل يوثق جميع التغييرات الإدارية الحساسة: تعديلات أسعار الخدمات، تحديثات فريق الخبيرات، وتعديلات حالات الحجوزات مع التوقيت الدقيق واسم المنفذ.'
              : 'Tamper-evident activity log capturing all critical changes: service pricing modifications, staff updates, reservation status transitions, and security events with exact timestamps.'}
          </p>
        </div>

        {/* Top Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {onAddLog && (
            <button
              onClick={handleSimulateAction}
              className="px-3.5 py-2 rounded-xl bg-[#221C12] hover:bg-[#2C2417] border border-[#D4AF37]/40 text-[#E5C378] text-xs font-bold flex items-center gap-2 transition-all cursor-pointer shadow-sm active:scale-95"
              title={language === 'ar' ? 'إضافة حركة تجريبية للسجل' : 'Simulate an admin action'}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'محاكاة عملية (تجربة)' : 'Simulate Action'}</span>
            </button>
          )}

          <button
            onClick={handleExportCSV}
            disabled={logs.length === 0}
            className="px-3.5 py-2 rounded-xl bg-[#17140E] hover:bg-[#201C14] border border-white/10 hover:border-[#D4AF37]/40 text-[#D2C8BA] text-xs font-medium flex items-center gap-2 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>{language === 'ar' ? 'تصدير CSV' : 'Export CSV'}</span>
          </button>

          <button
            onClick={handleExportJSON}
            disabled={logs.length === 0}
            className="px-3.5 py-2 rounded-xl bg-[#17140E] hover:bg-[#201C14] border border-white/10 hover:border-[#D4AF37]/40 text-[#D2C8BA] text-xs font-medium flex items-center gap-2 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <FileCode className="w-3.5 h-3.5 text-blue-400" />
            <span>JSON</span>
          </button>

          {onClearLogs && (
            <button
              onClick={() => setShowClearConfirm(true)}
              disabled={logs.length === 0}
              className="px-3 py-2 rounded-xl bg-rose-950/20 hover:bg-rose-900/40 border border-rose-500/30 text-rose-300 text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
              title={language === 'ar' ? 'مسح السجل' : 'Clear Logs'}
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'تصفير السجل' : 'Clear'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Confirmation Modal for Clearing Logs */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#17140E] border border-rose-500/40 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-400">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-[#F8F5EE]">
                {language === 'ar' ? 'تأكيد تصفير السجل الرقابي؟' : 'Confirm Clearing Audit Log?'}
              </h3>
            </div>
            <p className="text-xs text-[#A89F91]">
              {language === 'ar'
                ? 'سيتم حذف جميع السجلات الإدارية الحالية من ذاكرة النظام. تأكد من تصدير نسخة CSV أولاً للتوثيق والامتثال.'
                : 'All current administrative entries will be cleared. Please export a CSV backup first for compliance records.'}
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="px-4 py-2 rounded-xl bg-[#201C14] hover:bg-[#2A251C] text-xs font-medium text-[#C8BFB0] transition-colors"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={() => {
                  onClearLogs?.();
                  setShowClearConfirm(false);
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white transition-colors"
              >
                {language === 'ar' ? 'تأكيد الحذف والمسح' : 'Clear Everything'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4 Metric Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Actions */}
        <div className="bg-[#14120D] border border-white/5 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] text-[#8C8477] font-medium block">
              {language === 'ar' ? 'إجمالي العمليات المسجلة' : 'Total Recorded Actions'}
            </span>
            <span className="text-2xl font-bold font-mono text-[#F8F5EE] mt-0.5 block">
              {stats.total}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#201C14] border border-white/10 flex items-center justify-center text-[#E5C378]">
            <ScrollText className="w-5 h-5" />
          </div>
        </div>

        {/* Services & Prices changes */}
        <div className="bg-[#14120D] border border-white/5 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] text-[#8C8477] font-medium block">
              {language === 'ar' ? 'تعديلات الأسعار والخدمات' : 'Service & Price Edits'}
            </span>
            <span className="text-2xl font-bold font-mono text-[#E5C378] mt-0.5 block">
              {stats.priceAndServiceChanges}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 flex items-center justify-center text-[#E5C378]">
            <Scissors className="w-5 h-5" />
          </div>
        </div>

        {/* Booking Modifications */}
        <div className="bg-[#14120D] border border-white/5 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] text-[#8C8477] font-medium block">
              {language === 'ar' ? 'تعديلات حالات الحجوزات' : 'Booking Status Changes'}
            </span>
            <span className="text-2xl font-bold font-mono text-sky-400 mt-0.5 block">
              {stats.bookingChanges}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400">
            <CalendarClock className="w-5 h-5" />
          </div>
        </div>

        {/* Staff Team Changes */}
        <div className="bg-[#14120D] border border-white/5 p-4 rounded-xl flex items-center justify-between">
          <div>
            <span className="text-[11px] text-[#8C8477] font-medium block">
              {language === 'ar' ? 'تحديثات جدول وتوفر الفريق' : 'Staff Schedule & Roster'}
            </span>
            <span className="text-2xl font-bold font-mono text-emerald-400 mt-0.5 block">
              {stats.staffChanges}
            </span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Users className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#14120D] border border-white/10 p-4 rounded-2xl space-y-3">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Live Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#777] absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={
                language === 'ar'
                  ? 'بحث في السجل بالاسم، الخدمة، المنفذ، أو تفاصيل العملية...'
                  : 'Search by actor, service, customer, booking ref, or action...'
              }
              className="w-full ps-10 pe-4 py-2.5 rounded-xl bg-[#1A1711] border border-white/10 text-xs text-[#F8F5EE] focus:border-[#E5C378] focus:ring-1 focus:ring-[#E5C378] outline-none"
            />
          </div>

          {/* Severity selector */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-[#8C8477] flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'الدرجة:' : 'Level:'}</span>
            </span>
            <select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value as any)}
              className="px-3 py-2 rounded-xl bg-[#1A1711] border border-white/10 text-xs text-[#E0D8CC] focus:border-[#E5C378] outline-none cursor-pointer"
            >
              <option value="all">{language === 'ar' ? 'جميع المستويات' : 'All Levels'}</option>
              <option value="warning">{language === 'ar' ? 'تعديل أسعار / تحذير' : 'Price / Warning'}</option>
              <option value="success">{language === 'ar' ? 'نجاح / إتمام' : 'Success'}</option>
              <option value="alert">{language === 'ar' ? 'أمان فائق' : 'Security Alert'}</option>
              <option value="info">{language === 'ar' ? 'تحديثات عامة' : 'Info'}</option>
            </select>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs scrollbar-none">
          {[
            { id: 'all', labelAr: 'الكل', labelEn: 'All Logs', count: logs.length },
            { id: 'services', labelAr: 'الخدمات والأسعار', labelEn: 'Services & Prices', count: stats.priceAndServiceChanges },
            { id: 'bookings', labelAr: 'الحجوزات', labelEn: 'Bookings', count: stats.bookingChanges },
            { id: 'staff', labelAr: 'فريق العمل', labelEn: 'Staff', count: stats.staffChanges },
            { id: 'security', labelAr: 'الأمان', labelEn: 'Security', count: stats.securityChanges },
            { id: 'giftcards', labelAr: 'بطاقات الإهداء', labelEn: 'Gift Cards', count: logs.filter(l => l.category === 'giftcards').length }
          ].map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id as any)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-[#E5C378] text-[#0E0C09] font-bold shadow-md'
                  : 'bg-[#1D1912] text-[#A89F91] hover:text-[#F8F5EE] border border-white/5 hover:border-white/15'
              }`}
            >
              <span>{language === 'ar' ? cat.labelAr : cat.labelEn}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                selectedCategory === cat.id ? 'bg-[#0E0C09] text-[#E5C378]' : 'bg-white/10 text-[#C8BFB0]'
              }`}>
                {cat.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Audit Log Entries List */}
      <div className="space-y-3">
        {filteredLogs.length === 0 ? (
          <div className="bg-[#14120D] border border-white/10 rounded-2xl p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mx-auto text-[#777]">
              <ScrollText className="w-6 h-6" />
            </div>
            <p className="text-[#C8BFB0] font-medium text-sm">
              {language === 'ar' ? 'لا توجد حركات مطابقة لمعايير البحث' : 'No audit entries match the current filter'}
            </p>
            <p className="text-xs text-[#777]">
              {language === 'ar' ? 'جرّب إعادة ضبط عوامل التصفية أو البحث عن كلمة أخرى' : 'Try clearing your filters or searching with different keywords'}
            </p>
          </div>
        ) : (
          filteredLogs.map(log => {
            const catBadge = getCategoryBadge(log.category);
            const { formattedDate, formattedTime } = formatTimestamp(log.timestamp);

            return (
              <div
                key={log.id}
                className="bg-[#14120D] hover:bg-[#181510] border border-white/10 hover:border-[#D4AF37]/30 transition-all rounded-2xl p-4 sm:p-5 shadow-sm space-y-3"
              >
                {/* Entry Header: Category, Severity, and Timestamp */}
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Category Pill */}
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${catBadge.style}`}>
                      {catBadge.icon}
                      <span>{language === 'ar' ? catBadge.labelAr : catBadge.labelEn}</span>
                    </span>

                    {/* Severity Badge */}
                    {getSeverityBadge(log.severity)}

                    {/* Target tag if available */}
                    {log.targetName && (
                      <span className="text-[11px] font-mono px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-[#D2C8BA]">
                        {log.targetName}
                      </span>
                    )}
                  </div>

                  {/* Timestamp & Performed by */}
                  <div className="flex items-center gap-3 text-xs text-[#8C8477]">
                    <span className="flex items-center gap-1.5 font-mono">
                      <Clock className="w-3.5 h-3.5 text-[#E5C378]" />
                      <span>{formattedTime}</span>
                      <span className="opacity-40">•</span>
                      <span>{formattedDate}</span>
                    </span>

                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#1C1913] border border-white/10 text-[#C8BFB0] font-medium">
                      <UserCheck className="w-3 h-3 text-[#E5C378]" />
                      <span>{log.actor}</span>
                    </span>
                  </div>
                </div>

                {/* Entry Body: Title & Details */}
                <div>
                  <h4 className="text-sm sm:text-base font-bold text-[#F8F5EE] leading-snug">
                    {language === 'ar' ? log.titleAr : log.titleEn}
                  </h4>
                  <p className="text-xs sm:text-sm text-[#A89F91] mt-1 leading-relaxed">
                    {language === 'ar' ? log.detailsAr : log.detailsEn}
                  </p>
                </div>

                {/* Value Difference Box (e.g. Price: 260 SAR -> 290 SAR or Status: new -> confirmed) */}
                {(log.previousValue || log.newValue) && (
                  <div className="p-2.5 sm:p-3 rounded-xl bg-[#1A1610] border border-[#D4AF37]/20 flex items-center gap-3 flex-wrap text-xs font-mono">
                    <span className="text-[#8C8477] font-tajawal text-[11px]">
                      {language === 'ar' ? 'التغيير المسجل:' : 'Value Difference:'}
                    </span>
                    {log.previousValue && (
                      <span className="px-2 py-1 rounded bg-rose-950/40 border border-rose-500/30 text-rose-300 line-through">
                        {log.previousValue}
                      </span>
                    )}
                    <ArrowRight className={`w-3.5 h-3.5 text-[#E5C378] shrink-0 ${isRTL ? 'rotate-180' : ''}`} />
                    {log.newValue && (
                      <span className="px-2 py-1 rounded bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 font-bold">
                        {log.newValue}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Footer info tip */}
      <div className="p-4 rounded-xl bg-[#12100B] border border-white/5 text-center text-xs text-[#7A7366] flex items-center justify-center gap-2">
        <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
        <span>
          {language === 'ar'
            ? 'سجل العمليات محمي ومحفوظ محلياً في ذاكرة النظام الإداري لصالح فرع الشميسي'
            : 'All administrative audit records are secured and maintained for Rozana Salon Al-Shumaisi branch'}
        </span>
      </div>
    </div>
  );
};
