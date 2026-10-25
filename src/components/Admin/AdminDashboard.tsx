import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Appointment, 
  Service, 
  StaffMember, 
  SalonSettings, 
  AppointmentStatus,
  AdminSecurityConfig,
  AdminCredentials,
  VipPackage,
  SalonSuite,
  TransformationItem,
  SalonReview,
  GiftCard,
  AuditLogEntry
} from '../../types';
import { AdminBookingsTab } from './AdminBookingsTab';
import { AdminServicesTab } from './AdminServicesTab';
import { AdminContentTab } from './AdminContentTab';
import { AdminStaffTab } from './AdminStaffTab';
import { AdminAnalyticsTab } from './AdminAnalyticsTab';
import { AdminSecurityTab } from './AdminSecurityTab';
import { AdminBackupTab } from './AdminBackupTab';
import { AdminGiftCardsTab } from './AdminGiftCardsTab';
import { AdminAuditLogTab } from './AdminAuditLogTab';
import { AdminUsersTab } from './AdminUsersTab';
import { NotificationBell } from '../Toast/NotificationBell';

import { 
  CalendarClock, 
  Scissors, 
  Globe, 
  Users, 
  BarChart3, 
  ShieldCheck, 
  Database, 
  LogOut, 
  ExternalLink,
  Sparkles,
  Crown,
  Gift,
  ScrollText
} from 'lucide-react';

interface AdminDashboardProps {
  appointments: Appointment[];
  services: Service[];
  staff: StaffMember[];
  settings: SalonSettings;
  securityConfig: AdminSecurityConfig;
  packages: VipPackage[];
  suites: SalonSuite[];
  transformations: TransformationItem[];
  reviews: SalonReview[];
  giftCards: GiftCard[];
  auditLogs: AuditLogEntry[];
  onClearAuditLogs?: () => void;
  onAddAuditLog?: (entry: Omit<AuditLogEntry, 'id' | 'timestamp'>) => void;
  onUpdateAppointmentStatus: (appointmentId: string, newStatus: AppointmentStatus) => void;
  onUpdateAppointment: (updated: Appointment) => void;
  onDeleteAppointment: (appointmentId: string) => void;
  onAddAppointment: (newAppt: Appointment) => void;
  onAddService: (newService: Service) => void;
  onUpdateService: (updatedService: Service) => void;
  onDeleteService: (serviceId: string) => void;
  onToggleStaffAvailability: (staffId: string) => void;
  onUpdateStaff: (updatedStaff: StaffMember) => void;
  onAddStaff: (newStaff: StaffMember) => void;
  onUpdateSettings: (newSettings: SalonSettings) => void;
  onUpdateSecurityConfig: (newConfig: AdminSecurityConfig) => void;
  onUpdatePackages: (newPackages: VipPackage[]) => void;
  onUpdateSuites: (newSuites: SalonSuite[]) => void;
  onUpdateTransformations: (newTransformations: TransformationItem[]) => void;
  onUpdateReviews: (newReviews: SalonReview[]) => void;
  onAddGiftCard: (newCard: GiftCard) => void;
  onUpdateGiftCard: (updatedCard: GiftCard) => void;
  onDeleteGiftCard?: (cardId: string) => void;
  onExportAllData: () => void;
  onImportAllData: (jsonData: string) => boolean;
  onResetToDefaults: () => void;
  onResetServicesToDefault?: () => void;
  adminCredentials?: AdminCredentials | null;
  onLogout: () => void;
  onExitAdmin: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  appointments,
  services,
  staff,
  settings,
  securityConfig,
  adminCredentials: initialAdminCredentials,
  packages,
  suites,
  transformations,
  reviews,
  giftCards,
  auditLogs = [],
  onClearAuditLogs,
  onAddAuditLog,
  onUpdateAppointmentStatus,
  onUpdateAppointment,
  onDeleteAppointment,
  onAddAppointment,
  onAddService,
  onUpdateService,
  onDeleteService,
  onToggleStaffAvailability,
  onUpdateStaff,
  onAddStaff,
  onUpdateSettings,
  onUpdateSecurityConfig,
  onUpdatePackages,
  onUpdateSuites,
  onUpdateTransformations,
  onUpdateReviews,
  onAddGiftCard,
  onUpdateGiftCard,
  onDeleteGiftCard,
  onExportAllData,
  onImportAllData,
  onResetToDefaults,
  onResetServicesToDefault,
  onLogout,
  onExitAdmin,
}) => {
  const { language, isRTL } = useLanguage();

  type AdminTab = 'bookings' | 'users' | 'services' | 'content' | 'giftcards' | 'staff' | 'analytics' | 'audit' | 'security' | 'backup';
  const [activeTab, setActiveTab] = useState<AdminTab>('bookings');

  // Admin credentials maintained in local state
  const [adminCredentials, setAdminCredentials] = useState<AdminCredentials | null>(() => {
    return initialAdminCredentials || (securityConfig ? {
      email: securityConfig.email,
      authenticatedAt: new Date().toISOString()
    } : null);
  });

  useEffect(() => {
    if (initialAdminCredentials !== undefined) {
      setAdminCredentials(initialAdminCredentials);
    }
  }, [initialAdminCredentials]);

  // Immediate credential clearance upon logout to prevent sensitive info from persisting in memory
  const handleLogout = () => {
    // 1. Immediately wipe admin credentials from local state
    setAdminCredentials(null);

    // 2. Clear any potential sensitive token/session references from storage
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem('rozana_admin_session');
        sessionStorage.removeItem('admin_credentials');
        sessionStorage.removeItem('admin_token');
      } catch (e) {
        // Safe ignore
      }
    }

    // 3. Trigger parent logout cleanup
    onLogout();
  };

  const handleExitAdmin = () => {
    // Immediately clear credentials on exiting admin portal
    setAdminCredentials(null);
    onExitAdmin();
  };

  // Count new pending appointments for badge
  const newAppointmentsCount = appointments.filter(a => a.status === 'new').length;
  const activeGiftCardsCount = giftCards.filter(c => c.status === 'active' || c.status === 'partially_redeemed').length;

  return (
    <div className="min-h-screen bg-[#0A0907] text-[#F8F5EE] flex flex-col font-tajawal">
      {/* Top Haute Header */}
      <header className="sticky top-0 z-40 bg-[#0E0C09]/95 backdrop-blur-md border-b border-[#D4AF37]/30 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-lg">
        {/* Brand & Branch */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#1E1911] to-[#2E2415] border border-[#D4AF37]/50 flex items-center justify-center text-[#E5C378] shadow-md">
            <Crown className="w-5 h-5 text-[#E5C378]" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-playfair text-lg sm:text-xl font-bold text-[#F8F5EE] tracking-wide">
                {language === 'ar' ? 'لوحة التحكم الملكية' : 'Rozana Executive Portal'}
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-[#E5C378]/15 border border-[#D4AF37]/40 text-[#E5C378] text-[10px] font-mono uppercase tracking-wider">
                {language === 'ar' ? 'الشميسي' : 'Al Shumaisi'}
              </span>
            </div>
            <p className="text-[11px] text-[#A89F91]">
              {language === 'ar' ? 'إدارة كاملة وشاملة لموقع وخدمات وحجوزات صالون روزانة' : 'Comprehensive management for services, bookings & salon content'}
            </p>
          </div>
        </div>

        {/* Header Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Active Admin Session Status in local state */}
          {adminCredentials?.email && (
            <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#18150F] border border-white/10 text-xs text-[#A89F91]">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-mono text-[11px] text-[#D2C8BA]">{adminCredentials.email}</span>
            </div>
          )}

          {/* Notification Bell & Activity Center */}
          <NotificationBell onNavigateTab={(tab) => setActiveTab(tab)} />

          {/* View Public Live Site */}
          <button
            onClick={handleExitAdmin}
            className="px-3.5 py-2 rounded-full bg-[#18150F] hover:bg-[#221D14] border border-white/10 text-xs text-[#D2C8BA] hover:text-[#F8F5EE] flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Preview Live Website"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#E5C378]" />
            <span className="hidden sm:inline">{language === 'ar' ? 'عرض الموقع المباشر' : 'Live Website'}</span>
          </button>

          {/* Secure Logout */}
          <button
            onClick={handleLogout}
            className="px-4 py-2 rounded-full bg-red-950/40 hover:bg-red-900/60 border border-red-500/30 text-xs font-bold text-red-300 flex items-center gap-1.5 transition-colors cursor-pointer shadow-sm"
            title="Log Out of Admin"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'تسجيل الخروج' : 'Logout'}</span>
          </button>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-8 space-y-6">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-white/10 scrollbar-none">
          {/* 1. Bookings Tab */}
          <button
            onClick={() => setActiveTab('bookings')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'bookings'
                ? 'bg-gradient-to-r from-[#C59D4A] to-[#E5C378] text-[#0E0C09] shadow-lg font-black'
                : 'bg-[#14120D] text-[#A89F91] border border-white/5 hover:border-white/20'
            }`}
          >
            <CalendarClock className="w-4 h-4" />
            <span>{language === 'ar' ? 'الحجوزات والطلبات' : 'Orders & Bookings'}</span>
            {newAppointmentsCount > 0 && (
              <span className={`px-2 py-0.2 rounded-full text-[10px] font-mono ${
                activeTab === 'bookings' ? 'bg-[#0E0C09] text-[#E5C378]' : 'bg-[#E5C378] text-[#0E0C09]'
              }`}>
                {newAppointmentsCount}
              </span>
            )}
          </button>

          {/* 1.5. Firebase Users Database Tab */}
          <button
            id="admin-users-tab-btn"
            onClick={() => setActiveTab('users')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'users'
                ? 'bg-gradient-to-r from-[#C59D4A] to-[#E5C378] text-[#0E0C09] shadow-lg font-black'
                : 'bg-[#14120D] text-[#A89F91] border border-white/5 hover:border-white/20'
            }`}
          >
            <Database className="w-4 h-4 text-[#E5C378]" />
            <span>{language === 'ar' ? 'قاعدة بيانات العملاء (Firebase)' : 'Users & DB'}</span>
          </button>

          {/* 2. Services & Prices Tab */}
          <button
            onClick={() => setActiveTab('services')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'services'
                ? 'bg-gradient-to-r from-[#C59D4A] to-[#E5C378] text-[#0E0C09] shadow-lg font-black'
                : 'bg-[#14120D] text-[#A89F91] border border-white/5 hover:border-white/20'
            }`}
          >
            <Scissors className="w-4 h-4" />
            <span>{language === 'ar' ? 'الخدمات والأسعار' : 'Services & Prices'}</span>
            <span className="text-[10px] opacity-75 font-mono">({services.length})</span>
          </button>

          {/* 3. Website Content Tab */}
          <button
            onClick={() => setActiveTab('content')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'content'
                ? 'bg-gradient-to-r from-[#C59D4A] to-[#E5C378] text-[#0E0C09] shadow-lg font-black'
                : 'bg-[#14120D] text-[#A89F91] border border-white/5 hover:border-white/20'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>{language === 'ar' ? 'تخصيص الموقع والمعلومات' : 'Website Customizer'}</span>
          </button>

          {/* 4. Digital Gift Cards Tab */}
          <button
            onClick={() => setActiveTab('giftcards')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'giftcards'
                ? 'bg-gradient-to-r from-[#C59D4A] to-[#E5C378] text-[#0E0C09] shadow-lg font-black'
                : 'bg-[#14120D] text-[#A89F91] border border-white/5 hover:border-white/20'
            }`}
          >
            <Gift className="w-4 h-4" />
            <span>{language === 'ar' ? 'بطاقات الإهداء الرقمية' : 'Digital Gift Cards'}</span>
            <span className="text-[10px] opacity-75 font-mono">({activeGiftCardsCount})</span>
          </button>

          {/* 5. Staff Tab */}
          <button
            onClick={() => setActiveTab('staff')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'staff'
                ? 'bg-gradient-to-r from-[#C59D4A] to-[#E5C378] text-[#0E0C09] shadow-lg font-black'
                : 'bg-[#14120D] text-[#A89F91] border border-white/5 hover:border-white/20'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>{language === 'ar' ? 'فريق الخبيرات' : 'Staff Team'}</span>
            <span className="text-[10px] opacity-75 font-mono">({staff.length})</span>
          </button>

          {/* 6. Analytics Tab */}
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'analytics'
                ? 'bg-gradient-to-r from-[#C59D4A] to-[#E5C378] text-[#0E0C09] shadow-lg font-black'
                : 'bg-[#14120D] text-[#A89F91] border border-white/5 hover:border-white/20'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>{language === 'ar' ? 'التقارير والإيرادات' : 'Analytics & Revenue'}</span>
          </button>

          {/* 7. Audit Log Tab (Records service price changes, staff updates, booking status, etc.) */}
          <button
            id="admin-audit-tab-btn"
            onClick={() => setActiveTab('audit')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'audit'
                ? 'bg-gradient-to-r from-[#C59D4A] to-[#E5C378] text-[#0E0C09] shadow-lg font-black'
                : 'bg-[#14120D] text-[#A89F91] border border-white/5 hover:border-white/20'
            }`}
          >
            <ScrollText className="w-4 h-4 text-[#E5C378]" />
            <span>{language === 'ar' ? 'سجل العمليات والرقابة' : 'Audit Log'}</span>
            <span className={`px-2 py-0.2 rounded-full text-[10px] font-mono ${
              activeTab === 'audit' ? 'bg-[#0E0C09] text-[#E5C378]' : 'bg-[#E5C378]/20 text-[#E5C378]'
            }`}>
              {auditLogs.length}
            </span>
          </button>

          {/* 8. Security Tab (Requested by user) */}
          <button
            id="admin-security-tab-btn"
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'security'
                ? 'bg-gradient-to-r from-[#C59D4A] to-[#E5C378] text-[#0E0C09] shadow-lg font-black'
                : 'bg-[#14120D] text-[#A89F91] border border-white/5 hover:border-white/20'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{language === 'ar' ? 'الأمان وكلمة المرور' : 'Security & Credentials'}</span>
          </button>

          {/* 9. Backup & Restore Tab */}
          <button
            onClick={() => setActiveTab('backup')}
            className={`px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              activeTab === 'backup'
                ? 'bg-gradient-to-r from-[#C59D4A] to-[#E5C378] text-[#0E0C09] shadow-lg font-black'
                : 'bg-[#14120D] text-[#A89F91] border border-white/5 hover:border-white/20'
            }`}
          >
            <Database className="w-4 h-4" />
            <span>{language === 'ar' ? 'النسخ الاحتياطي' : 'Backup & Recovery'}</span>
          </button>
        </div>

        {/* Tab View Container */}
        <div className="pt-2">
          {activeTab === 'bookings' && (
            <AdminBookingsTab
              appointments={appointments}
              staff={staff}
              services={services}
              onUpdateStatus={onUpdateAppointmentStatus}
              onUpdateAppointment={onUpdateAppointment}
              onDeleteAppointment={onDeleteAppointment}
              onAddAppointment={onAddAppointment}
              onAddAuditLog={onAddAuditLog}
            />
          )}

          {activeTab === 'users' && (
            <AdminUsersTab />
          )}

          {activeTab === 'services' && (
            <AdminServicesTab
              services={services}
              onAddService={onAddService}
              onUpdateService={onUpdateService}
              onDeleteService={onDeleteService}
              onResetToDefaults={onResetServicesToDefault}
            />
          )}

          {activeTab === 'content' && (
            <AdminContentTab
              settings={settings}
              packages={packages}
              suites={suites}
              transformations={transformations}
              reviews={reviews}
              onUpdateSettings={onUpdateSettings}
              onUpdatePackages={onUpdatePackages}
              onUpdateSuites={onUpdateSuites}
              onUpdateTransformations={onUpdateTransformations}
              onUpdateReviews={onUpdateReviews}
            />
          )}

          {activeTab === 'giftcards' && (
            <AdminGiftCardsTab
              giftCards={giftCards}
              onAddGiftCard={onAddGiftCard}
              onUpdateGiftCard={onUpdateGiftCard}
              onDeleteGiftCard={onDeleteGiftCard}
            />
          )}

          {activeTab === 'staff' && (
            <AdminStaffTab
              staff={staff}
              onToggleAvailability={onToggleStaffAvailability}
              onUpdateStaff={onUpdateStaff}
              onAddStaff={onAddStaff}
            />
          )}

          {activeTab === 'analytics' && (
            <AdminAnalyticsTab
              appointments={appointments}
              services={services}
            />
          )}

          {activeTab === 'audit' && (
            <AdminAuditLogTab
              logs={auditLogs}
              onClearLogs={onClearAuditLogs}
              onAddLog={onAddAuditLog}
            />
          )}

          {activeTab === 'security' && (
            <AdminSecurityTab
              securityConfig={securityConfig}
              onUpdateSecurityConfig={onUpdateSecurityConfig}
            />
          )}

          {activeTab === 'backup' && (
            <AdminBackupTab
              onExportAllData={onExportAllData}
              onImportAllData={onImportAllData}
              onResetToDefaults={onResetToDefaults}
            />
          )}
        </div>
      </main>
    </div>
  );
};
