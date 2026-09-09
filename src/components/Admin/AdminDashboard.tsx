import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Appointment, Service, StaffMember, SalonSettings, AppointmentStatus } from '../../types';
import { MOCK_DATABASE_SCHEMA } from '../../data/mockData';
import { 
  TrendingUp, 
  Users, 
  CalendarClock, 
  CheckCircle2, 
  Clock, 
  Phone, 
  Sparkles, 
  Plus, 
  ArrowRight, 
  ArrowLeft,
  ChevronRight,
  Database,
  Sliders,
  LogOut,
  Eye,
  Check,
  X,
  Copy,
  ExternalLink,
  DollarSign,
  BarChart3
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';

interface AdminDashboardProps {
  appointments: Appointment[];
  services: Service[];
  staff: StaffMember[];
  settings: SalonSettings;
  onUpdateAppointmentStatus: (appointmentId: string, newStatus: AppointmentStatus) => void;
  onToggleStaffAvailability: (staffId: string) => void;
  onAddService: (newService: Service) => void;
  onUpdateSettings: (newSettings: SalonSettings) => void;
  onLogout: () => void;
  onExitAdmin: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  appointments,
  services,
  staff,
  settings,
  onUpdateAppointmentStatus,
  onToggleStaffAvailability,
  onAddService,
  onUpdateSettings,
  onLogout,
  onExitAdmin,
}) => {
  const { language, isRTL, t } = useLanguage();

  // Admin Tab: 'kanban' | 'analytics' | 'settings' | 'schema'
  const [activeTab, setActiveTab] = useState<'kanban' | 'analytics' | 'settings' | 'schema'>('kanban');

  // Modal for Viewing Single Booking
  const [selectedBooking, setSelectedBooking] = useState<Appointment | null>(null);

  // Add Service Form Modal
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [newServiceNameEn, setNewServiceNameEn] = useState('');
  const [newServiceNameAr, setNewServiceNameAr] = useState('');
  const [newServicePrice, setNewServicePrice] = useState<number>(250);
  const [newServiceDuration, setNewServiceDuration] = useState<number>(45);
  const [newServiceCategory, setNewServiceCategory] = useState<'facial' | 'keratin' | 'haircut' | 'nails' | 'spa'>('facial');
  const [newServiceDescEn, setNewServiceDescEn] = useState('');
  const [newServiceDescAr, setNewServiceDescAr] = useState('');

  // Settings Form State
  const [editOpenHour, setEditOpenHour] = useState(settings.openHour);
  const [editCloseHour, setEditCloseHour] = useState(settings.closeHour);
  const [editPhone, setEditPhone] = useState(settings.phone);
  const [showSettingsSavedAlert, setShowSettingsSavedAlert] = useState(false);

  // Schema copy feedback
  const [copiedSchema, setCopiedSchema] = useState(false);

  // KPI Calculations
  const newRequests = appointments.filter(a => a.status === 'new');
  const confirmedRequests = appointments.filter(a => a.status === 'confirmed');
  const completedRequests = appointments.filter(a => a.status === 'completed');

  const todayEarnings = appointments
    .filter(a => a.status === 'confirmed' || a.status === 'completed')
    .reduce((sum, a) => sum + (a.totalSAR || 0), 0);

  const totalCustomersToday = appointments.length;

  // Chart Data: Weekly Revenue Trends in SAR
  const weeklyRevenueData = [
    { day: language === 'ar' ? 'السبت' : 'Sat', revenue: 4200, bookings: 8 },
    { day: language === 'ar' ? 'الأحد' : 'Sun', revenue: 3850, bookings: 7 },
    { day: language === 'ar' ? 'الإثنين' : 'Mon', revenue: 5100, bookings: 10 },
    { day: language === 'ar' ? 'الثلاثاء' : 'Tue', revenue: 4600, bookings: 9 },
    { day: language === 'ar' ? 'الأربعاء' : 'Wed', revenue: 6400, bookings: 12 },
    { day: language === 'ar' ? 'الخميس' : 'Thu', revenue: 9800, bookings: 18 },
    { day: language === 'ar' ? 'الجمعة' : 'Fri', revenue: 11500, bookings: 22 },
  ];

  // Chart Data: Category Demand Distribution
  const categoryDemandData = [
    { category: language === 'ar' ? 'بشرة الذهب' : '24K Facial', demand: 38 },
    { category: language === 'ar' ? 'نانو كيراتين' : 'Keratin', demand: 32 },
    { category: language === 'ar' ? 'حمام مغربي' : 'Hammam', demand: 25 },
    { category: language === 'ar' ? 'أظافر جل' : 'Nails Spa', demand: 21 },
    { category: language === 'ar' ? 'قص وتصفيف' : 'Styling', demand: 18 },
  ];

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings({
      ...settings,
      openHour: editOpenHour,
      closeHour: editCloseHour,
      phone: editPhone
    });
    setShowSettingsSavedAlert(true);
    setTimeout(() => setShowSettingsSavedAlert(false), 3000);
  };

  const handleCreateService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceNameEn || !newServiceNameAr) return;

    const newSrv: Service = {
      id: `srv-${Date.now()}`,
      nameEn: newServiceNameEn.trim(),
      nameAr: newServiceNameAr.trim(),
      category: newServiceCategory,
      priceSAR: Number(newServicePrice),
      durationMin: Number(newServiceDuration),
      descriptionEn: newServiceDescEn.trim() || 'Exclusive Rozana Salon signature ritual.',
      descriptionAr: newServiceDescAr.trim() || 'جلسة عناية فاخرة في صالون روزانة فرع الشميسي.',
      rating: 4.9,
      reviewsCount: 1,
    };

    onAddService(newSrv);
    setIsAddServiceOpen(false);
    setNewServiceNameEn('');
    setNewServiceNameAr('');
    setNewServiceDescEn('');
    setNewServiceDescAr('');
  };

  const handleCopySQL = () => {
    navigator.clipboard.writeText(MOCK_DATABASE_SCHEMA.postgresSQL);
    setCopiedSchema(true);
    setTimeout(() => setCopiedSchema(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0A0907] text-[#EDE7DC] py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Admin Top Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-[#D4AF37]/20">
          <div>
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse"></span>
              <h1 className="font-playfair text-2xl sm:text-3xl font-bold text-[#F8F5EE]">
                {language === 'ar' ? 'لوحة تحكم صالون روزانة (فرع الشميسي)' : 'Rozana Salon Executive Console (Al Shumaisi)'}
              </h1>
            </div>
            <p className="font-tajawal text-xs sm:text-sm text-[#A89F91] mt-1">
              {language === 'ar' ? 'إدارة المواعيد المباشرة، التحليلات المالية، وطاقم العمل' : 'Live Booking Queue, Financial Analytics & Operating Management'}
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={onExitAdmin}
              className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-[#1A1711] border border-[#D4AF37]/30 hover:border-[#D4AF37] text-xs font-tajawal text-[#F8F5EE] transition-colors cursor-pointer"
            >
              {language === 'ar' ? 'عرض الواجهة للعميلات' : 'Guest View'}
            </button>
            <button
              onClick={onLogout}
              className="px-3.5 py-2 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 hover:bg-red-900/60 text-xs font-tajawal flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{t('admin.logout')}</span>
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* KPI METRICS CARDS */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Card 1: Today's Estimated Earnings */}
          <div className="p-5 rounded-2xl bg-[#14120D] border border-[#D4AF37]/30 shadow-md">
            <div className="flex items-center justify-between text-xs font-tajawal text-[#8C8477] mb-2">
              <span>{t('admin.kpiEarnings')}</span>
              <div className="w-8 h-8 rounded-lg bg-[#E5C378]/15 flex items-center justify-center text-[#E5C378]">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className="font-playfair text-3xl font-extrabold text-[#E5C378]">
                {todayEarnings.toLocaleString()}
              </span>
              <span className="font-tajawal text-sm text-[#D2C8BA] font-bold">
                {t('services.sar')}
              </span>
            </div>
            <span className="text-[11px] text-[#8C8477] font-tajawal mt-1 block">
              {language === 'ar' ? 'حسب الحجوزات المؤكدة والمكتملة' : 'From confirmed & completed sessions'}
            </span>
          </div>

          {/* Card 2: Pending Requests */}
          <div className="p-5 rounded-2xl bg-[#14120D] border border-amber-500/25">
            <div className="flex items-center justify-between text-xs font-tajawal text-[#8C8477] mb-2">
              <span>{t('admin.kpiPending')}</span>
              <div className="w-8 h-8 rounded-lg bg-amber-500/15 flex items-center justify-center text-amber-400">
                <CalendarClock className="w-4 h-4" />
              </div>
            </div>
            <span className="font-playfair text-3xl font-extrabold text-[#F8F5EE]">
              {newRequests.length}
            </span>
            <span className="text-[11px] text-amber-400/80 font-tajawal mt-1 block">
              {language === 'ar' ? 'تتطلب مراجعة وتأكيد من موظفة الاستقبال' : 'Awaiting front desk confirmation'}
            </span>
          </div>

          {/* Card 3: Total Customers */}
          <div className="p-5 rounded-2xl bg-[#14120D] border border-white/10">
            <div className="flex items-center justify-between text-xs font-tajawal text-[#8C8477] mb-2">
              <span>{t('admin.kpiCustomers')}</span>
              <div className="w-8 h-8 rounded-lg bg-[#E5C378]/15 flex items-center justify-center text-[#E5C378]">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <span className="font-playfair text-3xl font-extrabold text-[#F8F5EE]">
              {totalCustomersToday}
            </span>
            <span className="text-[11px] text-[#8C8477] font-tajawal mt-1 block">
              {language === 'ar' ? 'حجوزات مجدولة في صالون روزانة' : 'Total reservations in queue'}
            </span>
          </div>

          {/* Card 4: Completed */}
          <div className="p-5 rounded-2xl bg-[#14120D] border border-emerald-500/25">
            <div className="flex items-center justify-between text-xs font-tajawal text-[#8C8477] mb-2">
              <span>{t('admin.kpiCompleted')}</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/15 flex items-center justify-center text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <span className="font-playfair text-3xl font-extrabold text-emerald-400">
              {completedRequests.length}
            </span>
            <span className="text-[11px] text-emerald-400/80 font-tajawal mt-1 block">
              {language === 'ar' ? 'تمت بنجاح وحصلت على رضا العميلات' : 'Successfully completed treatments'}
            </span>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 border-b border-white/10 pb-4 mb-8 overflow-x-auto">
          <button
            id="admin-tab-kanban-btn"
            onClick={() => setActiveTab('kanban')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-tajawal font-bold transition-all cursor-pointer ${
              activeTab === 'kanban'
                ? 'bg-[#E5C378] text-[#0E0C09] shadow-[0_0_12px_rgba(229,195,120,0.3)]'
                : 'bg-[#15130E] text-[#A89F91] hover:text-white border border-white/5'
            }`}
          >
            {t('admin.tabKanban')} ({appointments.length})
          </button>

          <button
            id="admin-tab-analytics-btn"
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-tajawal font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-[#E5C378] text-[#0E0C09] shadow-[0_0_12px_rgba(229,195,120,0.3)]'
                : 'bg-[#15130E] text-[#A89F91] hover:text-white border border-white/5'
            }`}
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'التحليلات والإيرادات' : 'Analytics & Revenue'}</span>
          </button>

          <button
            id="admin-tab-settings-btn"
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-tajawal font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-[#E5C378] text-[#0E0C09] shadow-[0_0_12px_rgba(229,195,120,0.3)]'
                : 'bg-[#15130E] text-[#A89F91] hover:text-white border border-white/5'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{t('admin.tabSettings')}</span>
          </button>

          <button
            id="admin-tab-schema-btn"
            onClick={() => setActiveTab('schema')}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-tajawal font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'schema'
                ? 'bg-[#E5C378] text-[#0E0C09] shadow-[0_0_12px_rgba(229,195,120,0.3)]'
                : 'bg-[#15130E] text-[#A89F91] hover:text-white border border-white/5'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>{t('admin.tabSchema')}</span>
          </button>
        </div>

        {/* ========================================================= */}
        {/* TAB 1: BOOKING KANBAN BOARD */}
        {/* ========================================================= */}
        {activeTab === 'kanban' && (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Column 1: New Requests */}
              <div className="rounded-2xl bg-[#12100C] border border-amber-500/30 p-4 flex flex-col">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-amber-500/20">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                    <h3 className="font-tajawal font-bold text-sm sm:text-base text-[#F8F5EE]">
                      {t('admin.colNew')}
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-amber-950/60 text-amber-300 font-mono text-xs font-bold border border-amber-500/30">
                    {newRequests.length}
                  </span>
                </div>

                <div className="space-y-3 min-h-[300px]">
                  {newRequests.length === 0 ? (
                    <div className="text-center py-12 text-[#666] font-tajawal text-xs">
                      {language === 'ar' ? 'لا توجد طلبات جديدة حالياً' : 'No new requests at the moment'}
                    </div>
                  ) : (
                    newRequests.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-xl bg-[#1A1711] border border-white/5 p-4 hover:border-[#D4AF37]/50 transition-all shadow-sm flex flex-col justify-between cursor-pointer group"
                        onClick={() => setSelectedBooking(item)}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-mono text-xs font-bold text-[#E5C378]">
                              {item.referenceId}
                            </span>
                            <span className="text-[11px] font-mono text-[#8C8477] flex items-center gap-1">
                              <Clock className="w-3 h-3 text-[#E5C378]" />
                              {item.time}
                            </span>
                          </div>

                          <h4 className="font-tajawal font-bold text-[#F8F5EE] text-sm mb-1 group-hover:text-[#E5C378] transition-colors">
                            {item.customerName}
                          </h4>

                          <p className="font-playfair text-xs text-[#B8AF9F] mb-2 font-medium">
                            {language === 'ar' ? item.serviceNameAr : item.serviceNameEn}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-white/5 flex items-center justify-between mt-2">
                          <span className="font-playfair font-bold text-sm text-[#E5C378]">
                            {item.totalSAR} {t('services.sar')}
                          </span>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onUpdateAppointmentStatus(item.id, 'confirmed');
                            }}
                            className="px-3 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-tajawal font-bold transition-all shadow cursor-pointer"
                          >
                            {t('admin.moveToConfirmed')}
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Column 2: Confirmed Bookings */}
              <div className="rounded-2xl bg-[#12100C] border border-blue-500/30 p-4 flex flex-col">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-blue-500/20">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
                    <h3 className="font-tajawal font-bold text-sm sm:text-base text-[#F8F5EE]">
                      {t('admin.colConfirmed')}
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-blue-950/60 text-blue-300 font-mono text-xs font-bold border border-blue-500/30">
                    {confirmedRequests.length}
                  </span>
                </div>

                <div className="space-y-3 min-h-[300px]">
                  {confirmedRequests.length === 0 ? (
                    <div className="text-center py-12 text-[#666] font-tajawal text-xs">
                      {language === 'ar' ? 'لا توجد حجوزات مؤكدة حالياً' : 'No confirmed bookings'}
                    </div>
                  ) : (
                    confirmedRequests.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-xl bg-[#151821] border border-blue-500/20 p-4 hover:border-blue-400/50 transition-all shadow-sm flex flex-col justify-between cursor-pointer group"
                        onClick={() => setSelectedBooking(item)}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-mono text-xs font-bold text-blue-300">
                              {item.referenceId}
                            </span>
                            <span className="text-[11px] font-mono text-[#8C8477] flex items-center gap-1">
                              <Clock className="w-3 h-3 text-blue-400" />
                              {item.time}
                            </span>
                          </div>

                          <h4 className="font-tajawal font-bold text-[#F8F5EE] text-sm mb-1 group-hover:text-blue-300 transition-colors">
                            {item.customerName}
                          </h4>

                          <p className="font-playfair text-xs text-[#B8AF9F] mb-2 font-medium">
                            {language === 'ar' ? item.serviceNameAr : item.serviceNameEn}
                          </p>
                        </div>

                        <div className="pt-3 border-t border-blue-500/15 flex items-center justify-between mt-2">
                          <span className="font-playfair font-bold text-sm text-[#E5C378]">
                            {item.totalSAR} {t('services.sar')}
                          </span>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onUpdateAppointmentStatus(item.id, 'completed');
                            }}
                            className="px-3 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-tajawal font-bold transition-all shadow cursor-pointer"
                          >
                            {t('admin.moveToCompleted')}
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Column 3: Completed */}
              <div className="rounded-2xl bg-[#12100C] border border-emerald-500/30 p-4 flex flex-col">
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-emerald-500/20">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
                    <h3 className="font-tajawal font-bold text-sm sm:text-base text-[#F8F5EE]">
                      {t('admin.colCompleted')}
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-950/60 text-emerald-300 font-mono text-xs font-bold border border-emerald-500/30">
                    {completedRequests.length}
                  </span>
                </div>

                <div className="space-y-3 min-h-[300px]">
                  {completedRequests.length === 0 ? (
                    <div className="text-center py-12 text-[#666] font-tajawal text-xs">
                      {language === 'ar' ? 'لا توجد حجوزات مكتملة بعد' : 'No completed appointments'}
                    </div>
                  ) : (
                    completedRequests.map((item) => (
                      <div
                        key={item.id}
                        className="rounded-xl bg-[#111A15] border border-emerald-500/20 p-4 opacity-90 hover:opacity-100 transition-all cursor-pointer"
                        onClick={() => setSelectedBooking(item)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-mono text-xs font-bold text-emerald-300">
                            {item.referenceId}
                          </span>
                          <span className="text-[10px] font-tajawal text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded">
                            {language === 'ar' ? 'مكتمل بنجاح' : 'Done'}
                          </span>
                        </div>

                        <h4 className="font-tajawal font-bold text-[#F8F5EE] text-sm mb-1">
                          {item.customerName}
                        </h4>

                        <p className="font-playfair text-xs text-[#A8C7B4] mb-2">
                          {language === 'ar' ? item.serviceNameAr : item.serviceNameEn}
                        </p>

                        <div className="pt-2 border-t border-emerald-500/15 flex items-center justify-between text-xs">
                          <span className="font-mono text-[#8C8477]">{item.time}</span>
                          <span className="font-playfair font-bold text-[#E5C378]">
                            {item.totalSAR} {t('services.sar')}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 2: ANALYTICS & REVENUE VISUALIZER (Recharts) */}
        {/* ========================================================= */}
        {activeTab === 'analytics' && (
          <div className="space-y-8">
            {/* Top row: Weekly Revenue & Booking Volume */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Revenue Area Chart (7 cols) */}
              <div className="lg:col-span-7 p-6 rounded-3xl bg-[#12100C] border border-[#D4AF37]/30 text-start shadow-xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-playfair text-lg sm:text-xl font-bold text-[#F8F5EE]">
                      {language === 'ar' ? 'مسار الإيرادات الأسبوعية (ر.س)' : 'Weekly Revenue Trajectory (SAR)'}
                    </h3>
                    <p className="font-tajawal text-xs text-[#8C8477]">
                      {language === 'ar' ? 'نمو الإيرادات اليومية في فرع الشميسي' : 'Al Shumaisi branch daily gross revenue'}
                    </p>
                  </div>
                  <span className="font-playfair text-xl font-bold text-[#E5C378]">
                    45,450 SAR
                  </span>
                </div>

                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={weeklyRevenueData}>
                      <defs>
                        <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#E5C378" stopOpacity={0.6}/>
                          <stop offset="95%" stopColor="#E5C378" stopOpacity={0.0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                      <XAxis dataKey="day" stroke="#888" tick={{ fontSize: 12, fill: '#888' }} />
                      <YAxis stroke="#888" tick={{ fontSize: 12, fill: '#888' }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#18150F', border: '1px solid #D4AF37', borderRadius: '12px' }}
                        labelStyle={{ color: '#E5C378', fontWeight: 'bold' }}
                      />
                      <Area type="monotone" dataKey="revenue" stroke="#E5C378" strokeWidth={2} fillOpacity={1} fill="url(#goldGradient)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              {/* Treatment Category Demand (5 cols) */}
              <div className="lg:col-span-5 p-6 rounded-3xl bg-[#12100C] border border-[#D4AF37]/30 text-start shadow-xl">
                <div className="mb-6">
                  <h3 className="font-playfair text-lg sm:text-xl font-bold text-[#F8F5EE]">
                    {language === 'ar' ? 'الطلب حسب أقسام التجميل' : 'Treatment Department Share'}
                  </h3>
                  <p className="font-tajawal text-xs text-[#8C8477]">
                    {language === 'ar' ? 'نسبة الإقبال على الجلسات الملكية' : 'Distribution of guest bookings'}
                  </p>
                </div>

                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryDemandData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                      <XAxis type="number" stroke="#888" tick={{ fontSize: 11, fill: '#888' }} />
                      <YAxis dataKey="category" type="category" stroke="#888" width={90} tick={{ fontSize: 11, fill: '#DDD' }} />
                      <Tooltip
                        contentStyle={{ backgroundColor: '#18150F', border: '1px solid #D4AF37', borderRadius: '12px' }}
                      />
                      <Bar dataKey="demand" fill="#E5C378" radius={[0, 8, 8, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Quick Operational Insights */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-[#15120D] border border-white/5 text-start">
                <span className="text-xs text-[#8C8477] font-tajawal block mb-1">
                  {language === 'ar' ? 'متوسط قيمة الفاتورة' : 'Average Basket Value'}
                </span>
                <span className="font-playfair text-2xl font-bold text-[#E5C378]">585 SAR</span>
                <span className="text-[11px] text-emerald-400 font-tajawal block mt-1">
                  ↑ 14% {language === 'ar' ? 'مقارنة بالأسبوع الماضي' : 'vs last week'}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#15120D] border border-white/5 text-start">
                <span className="text-xs text-[#8C8477] font-tajawal block mb-1">
                  {language === 'ar' ? 'ساعات الذروة في الشميسي' : 'Peak Hours in Al Shumaisi'}
                </span>
                <span className="font-playfair text-2xl font-bold text-[#F8F5EE]">04:00 PM – 09:30 PM</span>
                <span className="text-[11px] text-[#A89F91] font-tajawal block mt-1">
                  {language === 'ar' ? 'إشغال الأجنحة بنسبة ٩٤٪' : '94% Suite occupancy'}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-[#15120D] border border-white/5 text-start">
                <span className="text-xs text-[#8C8477] font-tajawal block mb-1">
                  {language === 'ar' ? 'رضا العميلات الموثق' : 'Verified Guest Satisfaction'}
                </span>
                <span className="font-playfair text-2xl font-bold text-[#E5C378]">4.9 / 5.0 ★</span>
                <span className="text-[11px] text-[#A89F91] font-tajawal block mt-1">
                  {language === 'ar' ? 'أكثر من ٣٤٠ تقييم في قوقل' : '340+ Google reviews'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 3: SETTINGS & STAFF */}
        {/* ========================================================= */}
        {activeTab === 'settings' && (
          <div className="space-y-10">
            {showSettingsSavedAlert && (
              <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-sm font-tajawal flex items-center gap-2">
                <Check className="w-5 h-5" />
                <span>{t('admin.saveSuccess')}</span>
              </div>
            )}

            {/* Section 1: Staff Availability Management */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-playfair text-xl font-bold text-[#F8F5EE]">
                    {t('admin.staffTitle')}
                  </h3>
                  <p className="font-tajawal text-xs text-[#A89F91]">
                    {language === 'ar' ? 'تفعيل أو تعطيل توفر الخبيرات لاستقبال حجوزات اليوم' : 'Toggle therapist availability for today’s schedule'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {staff.map((member) => (
                  <div
                    key={member.id}
                    className={`rounded-2xl border p-5 flex flex-col justify-between transition-all ${
                      member.isAvailableToday
                        ? 'bg-[#14120D] border-[#D4AF37]/30 shadow-sm'
                        : 'bg-[#111] border-white/5 opacity-60'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className={`text-[10px] font-tajawal font-bold px-2.5 py-0.5 rounded-full ${
                          member.isAvailableToday
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/30'
                            : 'bg-zinc-900 text-zinc-400 border border-zinc-700'
                        }`}>
                          {member.isAvailableToday ? t('admin.available') : t('admin.busy')}
                        </span>
                        <span className="text-xs font-mono text-[#E5C378]">★ {member.rating}</span>
                      </div>

                      <h4 className="font-tajawal font-bold text-[#F8F5EE] text-base mb-1">
                        {language === 'ar' ? member.nameAr : member.nameEn}
                      </h4>
                      <p className="font-tajawal text-xs text-[#A89F91] mb-3">
                        {language === 'ar' ? member.roleAr : member.roleEn}
                      </p>

                      <div className="flex flex-wrap gap-1 mb-4">
                        {member.specialties.map((sp, idx) => (
                          <span key={idx} className="text-[10px] font-tajawal px-2 py-0.5 rounded bg-[#1C1912] text-[#B8AF9F]">
                            {sp}
                          </span>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => onToggleStaffAvailability(member.id)}
                      className={`w-full py-2 rounded-xl text-xs font-tajawal font-bold transition-colors cursor-pointer ${
                        member.isAvailableToday
                          ? 'bg-[#201A10] text-[#E5C378] hover:bg-[#2A2315] border border-[#D4AF37]/30'
                          : 'bg-[#222] text-[#AAA] hover:bg-[#333]'
                      }`}
                    >
                      {member.isAvailableToday 
                        ? (language === 'ar' ? 'تعيين: إجازة' : 'Mark Off Duty')
                        : (language === 'ar' ? 'تعيين: متاحة للعمل' : 'Mark Available')}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Section 2: Salon Timings & Contact */}
            <div className="rounded-2xl bg-[#14120D] border border-[#D4AF37]/30 p-6 sm:p-8">
              <h3 className="font-playfair text-xl font-bold text-[#F8F5EE] mb-2">
                {t('admin.hoursTitle')}
              </h3>
              <p className="font-tajawal text-xs text-[#A89F91] mb-6">
                {language === 'ar' 
                  ? 'ساعات العمل المعتمدة لفرع الشميسي (افتراضياً من ١٢:٠٠ ظهراً حتى ١١:٠٠ مساءً)'
                  : 'Operating timings for Al Shumaisi Branch (Default: strictly 12:00 PM to 11:00 PM)'}
              </p>

              <form onSubmit={handleSaveSettings} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-tajawal text-[#D2C8BA] mb-1.5">
                    {language === 'ar' ? 'وقت الافتتاح اليومي' : 'Opening Time'}
                  </label>
                  <input
                    type="text"
                    value={editOpenHour}
                    onChange={(e) => setEditOpenHour(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#18150F] border border-white/10 text-[#F8F5EE] font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-tajawal text-[#D2C8BA] mb-1.5">
                    {language === 'ar' ? 'وقت الإغلاق اليومي' : 'Closing Time'}
                  </label>
                  <input
                    type="text"
                    value={editCloseHour}
                    onChange={(e) => setEditCloseHour(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#18150F] border border-white/10 text-[#F8F5EE] font-mono text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-tajawal text-[#D2C8BA] mb-1.5">
                    {language === 'ar' ? 'هاتف الاستقبال بالفرع' : 'Salon Front Desk Phone'}
                  </label>
                  <input
                    type="text"
                    value={editPhone}
                    onChange={(e) => setEditPhone(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#18150F] border border-white/10 text-[#F8F5EE] font-mono text-sm"
                  />
                </div>

                <div className="sm:col-span-3 flex justify-end mt-2">
                  <button
                    type="submit"
                    className="luxe-gold-btn px-6 py-2.5 rounded-xl font-tajawal font-bold text-xs sm:text-sm cursor-pointer shadow"
                  >
                    {t('admin.saveChanges')}
                  </button>
                </div>
              </form>
            </div>

            {/* Section 3: Services & Pricing Management */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-playfair text-xl font-bold text-[#F8F5EE]">
                    {t('admin.servicesTitle')}
                  </h3>
                  <p className="font-tajawal text-xs text-[#A89F91]">
                    {language === 'ar' ? 'قائمة الجلسات والأسعار المعتمدة بالريال السعودي' : 'Active salon treatments catalog and pricing in SAR'}
                  </p>
                </div>

                <button
                  onClick={() => setIsAddServiceOpen(true)}
                  className="luxe-gold-btn px-4 py-2 rounded-xl font-tajawal font-bold text-xs sm:text-sm flex items-center gap-1.5 cursor-pointer shadow"
                >
                  <Plus className="w-4 h-4" />
                  <span>{t('admin.addNewService')}</span>
                </button>
              </div>

              <div className="rounded-2xl bg-[#14120D] border border-white/10 overflow-x-auto">
                <table className="w-full text-start text-xs font-tajawal">
                  <thead className="bg-[#1C1810] text-[#E5C378] border-b border-white/10 font-bold uppercase">
                    <tr>
                      <th className="py-3.5 px-4 text-start">{language === 'ar' ? 'الخدمة' : 'Service Name'}</th>
                      <th className="py-3.5 px-4 text-start">{language === 'ar' ? 'التصنيف' : 'Category'}</th>
                      <th className="py-3.5 px-4 text-start">{language === 'ar' ? 'المدة' : 'Duration'}</th>
                      <th className="py-3.5 px-4 text-start">{language === 'ar' ? 'السعر (ر.س)' : 'Price (SAR)'}</th>
                      <th className="py-3.5 px-4 text-start">{language === 'ar' ? 'التقييم' : 'Rating'}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 text-[#DDD]">
                    {services.map((s) => (
                      <tr key={s.id} className="hover:bg-[#1C1912] transition-colors">
                        <td className="py-3 px-4 font-medium text-[#F8F5EE]">
                          <div className="flex items-center gap-2">
                            <span>{language === 'ar' ? s.nameAr : s.nameEn}</span>
                            {s.isSignature && (
                              <span className="px-1.5 py-0.5 rounded bg-[#E5C378] text-[#0E0C09] text-[10px] font-bold">
                                VIP
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 uppercase text-[#B8AF9F] font-mono">{s.category}</td>
                        <td className="py-3 px-4 font-mono">{s.durationMin} {t('services.min')}</td>
                        <td className="py-3 px-4 font-bold text-[#E5C378] font-playfair text-sm">{s.priceSAR} SAR</td>
                        <td className="py-3 px-4 font-mono text-[#E5C378]">★ {s.rating}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* TAB 4: MOCK DATABASE SCHEMA (PostgreSQL & JSON) */}
        {/* ========================================================= */}
        {activeTab === 'schema' && (
          <div className="space-y-6 text-start">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-playfair text-xl font-bold text-[#F8F5EE]">
                  {language === 'ar' ? 'مخطط قاعدة بيانات صالون روزانة (PostgreSQL / Supabase)' : 'Rozana Salon Database Architecture'}
                </h3>
                <p className="font-tajawal text-xs text-[#A89F91]">
                  {language === 'ar'
                    ? 'هيكل الجداول الثلاثة المطلوبة: Users, Services, Appointments مع المفاتيح والمؤشرات'
                    : 'Relational & JSON schema definitions for Users, Services, and Appointments tables'}
                </p>
              </div>

              <button
                onClick={handleCopySQL}
                className="px-4 py-2 rounded-xl bg-[#1C1811] border border-[#D4AF37]/40 text-[#E5C378] text-xs font-tajawal flex items-center gap-2 hover:bg-[#282216] transition-colors cursor-pointer"
              >
                {copiedSchema ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedSchema ? (language === 'ar' ? 'تم النسخ!' : 'Copied!') : (language === 'ar' ? 'نسخ كود SQL' : 'Copy SQL DDL')}</span>
              </button>
            </div>

            {/* SQL Code Box */}
            <div className="rounded-2xl bg-[#0E0D0B] border border-white/10 p-4 sm:p-6 overflow-x-auto shadow-inner">
              <pre className="text-xs font-mono text-[#E5C378] leading-relaxed select-all">
                {MOCK_DATABASE_SCHEMA.postgresSQL}
              </pre>
            </div>

            {/* JSON Representation Box */}
            <div className="rounded-2xl bg-[#14120D] border border-white/10 p-6">
              <h4 className="font-tajawal font-bold text-sm text-[#E5C378] mb-2">
                {language === 'ar' ? 'عينة من وثائق JSON المعتمدة للمزامنة' : 'Sample JSON Documents for API Payload'}
              </h4>
              <div className="rounded-xl bg-[#0B0A08] p-4 overflow-x-auto border border-white/5">
                <pre className="text-xs font-mono text-emerald-400 leading-relaxed">
                  {JSON.stringify(MOCK_DATABASE_SCHEMA.jsonSample, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Booking Dossier Detail Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#12100C] border border-[#D4AF37]/50 p-6 sm:p-8 shadow-2xl text-start">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
              <div>
                <span className="text-xs font-tajawal text-[#8C8477]">
                  {t('admin.detailsModalTitle')}
                </span>
                <h3 className="font-mono text-xl font-bold text-[#E5C378]">
                  {selectedBooking.referenceId}
                </h3>
              </div>

              <button
                onClick={() => setSelectedBooking(null)}
                className="w-8 h-8 rounded-full bg-[#1C1810] text-[#A89F91] hover:text-white flex items-center justify-center text-sm cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3.5 text-xs sm:text-sm font-tajawal mb-6">
              <div className="flex justify-between p-2.5 rounded-xl bg-[#18150F]">
                <span className="text-[#8C8477]">{t('admin.customer')}:</span>
                <span className="font-bold text-[#F8F5EE]">{selectedBooking.customerName}</span>
              </div>

              <div className="flex justify-between p-2.5 rounded-xl bg-[#18150F]">
                <span className="text-[#8C8477]">{t('admin.phone')}:</span>
                <a href={`tel:${selectedBooking.customerPhone}`} className="font-mono text-[#E5C378] hover:underline">
                  {selectedBooking.customerPhone}
                </a>
              </div>

              <div className="flex justify-between p-2.5 rounded-xl bg-[#18150F]">
                <span className="text-[#8C8477]">{language === 'ar' ? 'الخدمة' : 'Service'}:</span>
                <span className="font-bold text-[#F8F5EE]">
                  {language === 'ar' ? selectedBooking.serviceNameAr : selectedBooking.serviceNameEn}
                </span>
              </div>

              <div className="flex justify-between p-2.5 rounded-xl bg-[#18150F]">
                <span className="text-[#8C8477]">{language === 'ar' ? 'الموعد' : 'Schedule'}:</span>
                <span className="font-mono text-[#E5C378] font-bold">
                  {selectedBooking.date} @ {selectedBooking.time}
                </span>
              </div>

              <div className="flex justify-between p-2.5 rounded-xl bg-[#18150F]">
                <span className="text-[#8C8477]">{t('admin.assignedStaff')}:</span>
                <span className="font-bold text-[#D2C8BA]">{selectedBooking.staffName || 'General Staff'}</span>
              </div>

              <div className="flex justify-between p-2.5 rounded-xl bg-[#18150F]">
                <span className="text-[#8C8477]">{t('admin.total')}:</span>
                <span className="font-playfair text-lg font-bold text-[#E5C378]">
                  {selectedBooking.totalSAR} {t('services.sar')}
                </span>
              </div>

              {selectedBooking.notes && (
                <div className="p-3 rounded-xl bg-[#18150F] border border-white/5">
                  <span className="text-[#8C8477] block mb-1">{t('admin.notes')}:</span>
                  <p className="text-[#DDD] italic">{selectedBooking.notes}</p>
                </div>
              )}
            </div>

            {/* Quick Status Adjuster */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  onUpdateAppointmentStatus(selectedBooking.id, 'confirmed');
                  setSelectedBooking({ ...selectedBooking, status: 'confirmed' });
                }}
                className="flex-1 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-tajawal text-xs font-bold transition-colors cursor-pointer"
              >
                {t('admin.moveToConfirmed')}
              </button>

              <button
                onClick={() => {
                  onUpdateAppointmentStatus(selectedBooking.id, 'completed');
                  setSelectedBooking({ ...selectedBooking, status: 'completed' });
                }}
                className="flex-1 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-tajawal text-xs font-bold transition-colors cursor-pointer"
              >
                {t('admin.moveToCompleted')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Service Modal */}
      {isAddServiceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-lg rounded-3xl bg-[#12100C] border border-[#D4AF37]/50 p-6 sm:p-8 shadow-2xl text-start">
            <div className="flex items-center justify-between mb-4 border-b border-white/10 pb-3">
              <h3 className="font-playfair text-xl font-bold text-[#F8F5EE]">
                {t('admin.addNewService')}
              </h3>
              <button
                onClick={() => setIsAddServiceOpen(false)}
                className="text-[#8C8477] hover:text-white cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateService} className="space-y-4 text-xs font-tajawal">
              <div>
                <label className="block text-[#D2C8BA] mb-1">اسم الخدمة باللغة العربية *</label>
                <input
                  type="text"
                  required
                  value={newServiceNameAr}
                  onChange={(e) => setNewServiceNameAr(e.target.value)}
                  placeholder="مثال: جلسة مساج بالأحجار الساخنة"
                  className="w-full px-3 py-2.5 rounded-xl bg-[#18150F] border border-white/10 text-[#F8F5EE] outline-none"
                />
              </div>

              <div>
                <label className="block text-[#D2C8BA] mb-1">Service Name in English *</label>
                <input
                  type="text"
                  required
                  value={newServiceNameEn}
                  onChange={(e) => setNewServiceNameEn(e.target.value)}
                  placeholder="e.g. Hot Stone Thermal Spa Massage"
                  className="w-full px-3 py-2.5 rounded-xl bg-[#18150F] border border-white/10 text-[#F8F5EE] outline-none font-mono"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#D2C8BA] mb-1">السعر (ر.س) *</label>
                  <input
                    type="number"
                    required
                    min={50}
                    value={newServicePrice}
                    onChange={(e) => setNewServicePrice(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#18150F] border border-white/10 text-[#F8F5EE] font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[#D2C8BA] mb-1">المدة (بالدقائق) *</label>
                  <input
                    type="number"
                    required
                    min={15}
                    value={newServiceDuration}
                    onChange={(e) => setNewServiceDuration(Number(e.target.value))}
                    className="w-full px-3 py-2.5 rounded-xl bg-[#18150F] border border-white/10 text-[#F8F5EE] font-mono outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#D2C8BA] mb-1">التصنيف</label>
                <select
                  value={newServiceCategory}
                  onChange={(e) => setNewServiceCategory(e.target.value as any)}
                  className="w-full px-3 py-2.5 rounded-xl bg-[#18150F] border border-white/10 text-[#F8F5EE] outline-none font-tajawal"
                >
                  <option value="facial">العناية بالبشرة (Facials)</option>
                  <option value="keratin">كيراتين وبروتين (Keratin)</option>
                  <option value="haircut">قص وتسريحات (Haircuts)</option>
                  <option value="nails">بديكير ومنيكير (Nails)</option>
                  <option value="spa">حمام مغربي وسبا (Spa)</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsAddServiceOpen(false)}
                  className="px-4 py-2 rounded-xl bg-[#1A1711] text-[#AAA] cursor-pointer"
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="luxe-gold-btn px-6 py-2 rounded-xl font-bold cursor-pointer"
                >
                  إضافة الخدمة فوراً
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
