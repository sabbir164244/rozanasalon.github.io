import React, { useState, useRef, useEffect } from 'react';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';
import { ToastNotification } from '../../types';
import { 
  Bell, 
  CalendarCheck, 
  Gift, 
  CheckCheck, 
  Trash2, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  ChevronRight,
  Clock,
  ExternalLink,
  X
} from 'lucide-react';

interface NotificationBellProps {
  onNavigateTab?: (tab: 'bookings' | 'giftcards') => void;
}

export const NotificationBell: React.FC<NotificationBellProps> = ({ onNavigateTab }) => {
  const { 
    history, 
    unreadCount, 
    markAllAsRead, 
    clearHistory, 
    soundEnabled, 
    toggleSound,
    notifyNewBooking,
    notifyGiftCardRedeemed
  } = useToast();
  const { language, isRTL } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'booking' | 'giftcard'>('all');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleOpen = () => {
    setIsOpen(!isOpen);
    if (!isOpen && unreadCount > 0) {
      markAllAsRead();
    }
  };

  const filteredHistory = history.filter(item => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

  // Simulator for quick verification & live admin demo
  const handleSimulateBooking = () => {
    const mockRef = `ROZ-${Math.floor(1000 + Math.random() * 9000)}`;
    const mockNames = ['نورة العتيبي', 'سارة الشمري', 'ريم الهاجري', 'لطيفة السبيعي', 'Maha Al-Saud'];
    const mockServicesAr = ['باقة العروس الملكية', 'مكياج سهرة هوت كوتور', 'علاج الكولاجين الملكي', 'تسريحة ويفي ملكي'];
    const mockServicesEn = ['Royal Bridal Package', 'Haute Couture Evening Makeup', 'Royal Collagen Therapy', 'Royal Waves Styling'];
    const randIdx = Math.floor(Math.random() * mockNames.length);

    notifyNewBooking({
      id: `sim-${Date.now()}`,
      referenceId: mockRef,
      customerName: mockNames[randIdx],
      customerPhone: '+966 50 123 4567',
      serviceId: 'srv-1',
      serviceNameAr: mockServicesAr[randIdx % mockServicesAr.length],
      serviceNameEn: mockServicesEn[randIdx % mockServicesEn.length],
      staffId: 'stf-1',
      staffNameAr: 'أنتونيلا كوفيلو',
      staffNameEn: 'Antonella Covello',
      date: new Date().toISOString().split('T')[0],
      time: '04:30 PM',
      status: 'new',
      totalSAR: 650,
      createdAt: new Date().toLocaleString()
    }, () => {
      if (onNavigateTab) onNavigateTab('bookings');
    });
  };

  const handleSimulateRedemption = () => {
    const sampleCodes = ['ROZ-GOLD-500', 'ROZ-EMERALD-1000', 'ROZ-VIP-2500', 'ROZ-ROSE-250'];
    const sampleCode = sampleCodes[Math.floor(Math.random() * sampleCodes.length)];
    const deductAmt = Math.floor(150 + Math.random() * 350);
    const remaining = Math.floor(200 + Math.random() * 1500);

    notifyGiftCardRedeemed({
      cardCode: sampleCode,
      amountSAR: deductAmt,
      remainingSAR: remaining,
      recipientName: language === 'ar' ? 'سارة المنصور' : 'Sarah Al-Mansoor',
      appointmentRef: `ROZ-${Math.floor(1000 + Math.random() * 9000)}`,
      onClickView: () => {
        if (onNavigateTab) onNavigateTab('giftcards');
      }
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Trigger Button */}
      <button
        onClick={handleOpen}
        className="relative p-2 rounded-full bg-[#18150F] hover:bg-[#241F14] border border-[#D4AF37]/30 hover:border-[#E5C378] text-[#D2C8BA] hover:text-[#F8F5EE] transition-all cursor-pointer shadow-sm"
        title={language === 'ar' ? 'الإشعارات وسجل العمليات' : 'Activity & Notifications'}
      >
        <Bell className="w-4 h-4 text-[#E5C378]" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-r from-red-600 to-amber-600 text-white text-[10px] font-bold font-mono flex items-center justify-center animate-bounce shadow-md">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Popover Dropdown */}
      {isOpen && (
        <div
          className={`absolute z-50 top-12 ${
            isRTL ? 'left-0 sm:left-auto sm:right-auto' : 'right-0 sm:right-auto sm:left-auto'
          } w-[330px] sm:w-[390px] rounded-2xl bg-[#0E0C09]/98 border border-[#D4AF37]/40 shadow-2xl backdrop-blur-2xl overflow-hidden font-tajawal`}
          style={{ [isRTL ? 'right' : 'right']: 0 }}
        >
          {/* Header */}
          <div className="p-3.5 border-b border-white/10 bg-[#14120D] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-[#241F14] border border-[#D4AF37]/40 flex items-center justify-center text-[#E5C378]">
                <Bell className="w-3.5 h-3.5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-[#F8F5EE] font-playfair">
                  {language === 'ar' ? 'مركز الإشعارات الحية' : 'Live Notifications Center'}
                </h3>
                <span className="text-[10px] text-[#A89F91]">
                  {history.length} {language === 'ar' ? 'عملية مسجلة' : 'activity logs'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-1.5">
              {/* Sound Toggle */}
              <button
                onClick={toggleSound}
                className={`p-1.5 rounded-lg border text-xs transition-colors cursor-pointer ${
                  soundEnabled 
                    ? 'bg-[#1D180F] border-[#D4AF37]/40 text-[#E5C378]' 
                    : 'bg-white/5 border-white/10 text-[#8C8477]'
                }`}
                title={soundEnabled ? 'Chime ON' : 'Chime OFF'}
              >
                {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
              </button>

              {/* Clear */}
              {history.length > 0 && (
                <button
                  onClick={clearHistory}
                  className="p-1.5 rounded-lg hover:bg-white/5 text-[#8C8477] hover:text-red-400 transition-colors cursor-pointer"
                  title={language === 'ar' ? 'مسح السجل' : 'Clear all'}
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}

              {/* Close */}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg hover:bg-white/5 text-[#8C8477] hover:text-[#F8F5EE] transition-colors cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Quick Simulation Bar (Convenient testing for bookings & gift card redemptions) */}
          <div className="px-3.5 py-2 bg-[#17140E] border-b border-white/5 flex items-center justify-between text-[11px]">
            <span className="text-[#8C8477] flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#E5C378]" />
              {language === 'ar' ? 'اختبار مباشر:' : 'Simulate alert:'}
            </span>
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleSimulateBooking}
                className="px-2 py-0.8 rounded-md bg-[#241F14] hover:bg-[#342C1B] border border-[#D4AF37]/40 text-[#E5C378] text-[10px] font-bold transition-all cursor-pointer"
              >
                + {language === 'ar' ? 'حجز جديد' : 'New Booking'}
              </button>
              <button
                onClick={handleSimulateRedemption}
                className="px-2 py-0.8 rounded-md bg-[#22132B] hover:bg-[#331B40] border border-amber-400/40 text-amber-300 text-[10px] font-bold transition-all cursor-pointer"
              >
                + {language === 'ar' ? 'صرف إهداء' : 'Redeem Gift'}
              </button>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="px-3.5 py-2 border-b border-white/5 flex items-center gap-1.5 text-[11px]">
            <button
              onClick={() => setFilterType('all')}
              className={`px-2.5 py-1 rounded-full cursor-pointer transition-colors ${
                filterType === 'all'
                  ? 'bg-[#E5C378] text-[#0E0C09] font-bold'
                  : 'text-[#A89F91] hover:bg-white/5'
              }`}
            >
              {language === 'ar' ? 'الكل' : 'All'}
            </button>
            <button
              onClick={() => setFilterType('booking')}
              className={`px-2.5 py-1 rounded-full cursor-pointer transition-colors flex items-center gap-1 ${
                filterType === 'booking'
                  ? 'bg-[#E5C378] text-[#0E0C09] font-bold'
                  : 'text-[#A89F91] hover:bg-white/5'
              }`}
            >
              <CalendarCheck className="w-3 h-3" />
              <span>{language === 'ar' ? 'الحجوزات' : 'Bookings'}</span>
            </button>
            <button
              onClick={() => setFilterType('giftcard')}
              className={`px-2.5 py-1 rounded-full cursor-pointer transition-colors flex items-center gap-1 ${
                filterType === 'giftcard'
                  ? 'bg-amber-400 text-[#0E0C09] font-bold'
                  : 'text-[#A89F91] hover:bg-white/5'
              }`}
            >
              <Gift className="w-3 h-3" />
              <span>{language === 'ar' ? 'بطاقات الإهداء' : 'Gift Cards'}</span>
            </button>
          </div>

          {/* Notifications Log List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-white/5 scrollbar-thin">
            {filteredHistory.length === 0 ? (
              <div className="py-8 px-4 text-center">
                <Bell className="w-7 h-7 text-[#8C8477]/40 mx-auto mb-2" />
                <p className="text-xs text-[#8C8477]">
                  {language === 'ar' ? 'لا توجد إشعارات جديدة حالياً' : 'No notifications in history yet'}
                </p>
                <p className="text-[10px] text-[#A89F91]/70 mt-1">
                  {language === 'ar' ? 'ستظهر تنبيهات الحجوزات وصرف بطاقات الإهداء فور وقوعها.' : 'Alerts for bookings and gift cards will appear here in real time.'}
                </p>
              </div>
            ) : (
              filteredHistory.map((item) => {
                const isBooking = item.type === 'booking';
                const isGiftCard = item.type === 'giftcard';

                return (
                  <div
                    key={item.id}
                    className="p-3 hover:bg-white/[0.03] transition-colors flex items-start gap-2.5 group"
                  >
                    <div
                      className={`w-7 h-7 rounded-lg shrink-0 flex items-center justify-center text-xs mt-0.5 ${
                        isBooking
                          ? 'bg-[#241F14] border border-[#D4AF37]/30 text-[#E5C378]'
                          : isGiftCard
                          ? 'bg-[#2A1733] border border-amber-400/30 text-amber-300'
                          : 'bg-emerald-950 border border-emerald-500/30 text-emerald-400'
                      }`}
                    >
                      {isBooking ? <CalendarCheck className="w-3.5 h-3.5" /> : <Gift className="w-3.5 h-3.5" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <span className="text-xs font-bold text-[#F8F5EE] truncate font-playfair">
                          {language === 'ar' ? item.titleAr : item.titleEn}
                        </span>
                        <span className="text-[10px] text-[#8C8477] font-mono shrink-0">
                          {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <p className="text-[11px] text-[#D2C8BA] leading-relaxed line-clamp-2">
                        {language === 'ar' ? item.messageAr : item.messageEn}
                      </p>

                      {/* Quick Meta Footer */}
                      <div className="mt-1.5 flex items-center justify-between text-[10px] text-[#8C8477]">
                        {item.data?.referenceId && (
                          <span className="font-mono text-[#E5C378]">
                            #{item.data.referenceId}
                          </span>
                        )}
                        {item.data?.cardCode && (
                          <span className="font-mono text-amber-300">
                            {item.data.cardCode}
                          </span>
                        )}

                        {item.action && (
                          <button
                            onClick={() => {
                              item.action?.onClick();
                              setIsOpen(false);
                            }}
                            className="text-[#E5C378] hover:underline font-bold flex items-center gap-0.5 cursor-pointer ml-auto"
                          >
                            <span>{language === 'ar' ? item.action.labelAr : item.action.labelEn}</span>
                            <ChevronRight className="w-2.5 h-2.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer */}
          <div className="p-2.5 border-t border-white/10 bg-[#14120D] flex items-center justify-between text-[11px] text-[#A89F91]">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
              {language === 'ar' ? 'نظام المراقبة نشط' : 'Live Monitor Active'}
            </span>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[#E5C378] hover:underline cursor-pointer flex items-center gap-1"
              >
                <CheckCheck className="w-3 h-3" />
                <span>{language === 'ar' ? 'تحديد الكل كمقروء' : 'Mark all read'}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
