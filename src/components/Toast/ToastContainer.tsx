import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useToast } from '../../context/ToastContext';
import { useLanguage } from '../../context/LanguageContext';
import { ToastNotification } from '../../types';
import { 
  CalendarCheck, 
  Gift, 
  CheckCircle2, 
  Info, 
  AlertTriangle, 
  X, 
  Volume2, 
  VolumeX, 
  ArrowUpRight,
  Clock,
  Sparkles
} from 'lucide-react';

interface ToastItemProps {
  toast: ToastNotification;
  onDismiss: (id: string) => void;
}

const ToastItem: React.FC<ToastItemProps> = ({ toast, onDismiss }) => {
  const { language } = useLanguage();
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(100);
  const startTimeRef = useRef<number>(Date.now());
  const remainingTimeRef = useRef<number>(toast.duration || 6500);

  useEffect(() => {
    if (isPaused) return;

    const totalDuration = toast.duration || 6500;
    const interval = 50;

    const timer = setInterval(() => {
      remainingTimeRef.current -= interval;
      const pct = Math.max(0, (remainingTimeRef.current / totalDuration) * 100);
      setProgress(pct);

      if (remainingTimeRef.current <= 0) {
        clearInterval(timer);
        onDismiss(toast.id);
      }
    }, interval);

    return () => clearInterval(timer);
  }, [isPaused, toast.duration, toast.id, onDismiss]);

  const handleMouseEnter = () => setIsPaused(true);
  const handleMouseLeave = () => setIsPaused(false);

  // Icon & Theme Styling based on Toast Type
  const isBooking = toast.type === 'booking';
  const isGiftCard = toast.type === 'giftcard';

  const title = language === 'ar' ? toast.titleAr : toast.titleEn;
  const message = language === 'ar' ? toast.messageAr : toast.messageEn;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 40, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, y: 20, transition: { duration: 0.2 } }}
      transition={{ type: 'spring', stiffness: 380, damping: 28 }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full max-w-sm sm:max-w-md rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl border transition-all pointer-events-auto ${
        isBooking
          ? 'bg-gradient-to-br from-[#18140D]/95 via-[#120F0A]/95 to-[#0A0907]/95 border-[#E5C378]/50 shadow-[#D4AF37]/15 ring-1 ring-[#D4AF37]/20'
          : isGiftCard
          ? 'bg-gradient-to-br from-[#1E1425]/95 via-[#140D1A]/95 to-[#0A070E]/95 border-amber-400/40 shadow-purple-900/20 ring-1 ring-amber-400/25'
          : 'bg-[#14120D]/95 border-white/15'
      }`}
    >
      {/* Top Accent Gradient Bar */}
      <div
        className={`h-1 w-full ${
          isBooking
            ? 'bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#C59D4A]'
            : isGiftCard
            ? 'bg-gradient-to-r from-amber-400 via-rose-300 to-amber-500'
            : 'bg-emerald-500'
        }`}
      />

      <div className="p-4 sm:p-4.5">
        <div className="flex items-start gap-3">
          {/* Visual Indicator Icon */}
          <div
            className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center border shadow-md ${
              isBooking
                ? 'bg-gradient-to-tr from-[#2A2213] to-[#3B2E17] border-[#E5C378]/50 text-[#F3E5AB]'
                : isGiftCard
                ? 'bg-gradient-to-tr from-[#2C1838] to-[#3F2050] border-amber-400/50 text-amber-300'
                : 'bg-emerald-950/60 border-emerald-500/40 text-emerald-400'
            }`}
          >
            {isBooking ? (
              <CalendarCheck className="w-5 h-5 animate-pulse" />
            ) : isGiftCard ? (
              <Gift className="w-5 h-5 animate-bounce" />
            ) : (
              <CheckCircle2 className="w-5 h-5" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2 mb-1">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span
                  className={`text-[10px] font-mono uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                    isBooking
                      ? 'bg-[#E5C378]/15 text-[#E5C378] border-[#D4AF37]/30'
                      : isGiftCard
                      ? 'bg-amber-400/15 text-amber-300 border-amber-400/30'
                      : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30'
                  }`}
                >
                  {isBooking
                    ? (language === 'ar' ? 'حجز فوري' : 'Live Booking')
                    : isGiftCard
                    ? (language === 'ar' ? 'صرف رصيد' : 'Voucher Redeemed')
                    : (language === 'ar' ? 'إشعار' : 'Notice')}
                </span>

                {toast.data?.referenceId && (
                  <span className="text-[11px] font-mono text-[#E5C378] font-bold">
                    #{toast.data.referenceId}
                  </span>
                )}
                {toast.data?.cardCode && (
                  <span className="text-[11px] font-mono text-amber-300 font-bold">
                    {toast.data.cardCode}
                  </span>
                )}
              </div>

              {/* Close Button */}
              <button
                onClick={() => onDismiss(toast.id)}
                className="text-[#8C8477] hover:text-[#F8F5EE] p-1 rounded-lg hover:bg-white/5 transition-colors cursor-pointer"
                aria-label="Dismiss notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <h4 className="font-playfair text-sm sm:text-[15px] font-bold text-[#F8F5EE] leading-tight mb-1">
              {title}
            </h4>
            <p className="font-tajawal text-xs text-[#D2C8BA] leading-relaxed line-clamp-2">
              {message}
            </p>

            {/* Quick Data Snippets */}
            {isBooking && toast.data && (
              <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-tajawal text-[#A89F91]">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-[#E5C378]" />
                  <span>{toast.data.date} {toast.data.time}</span>
                </div>
                {toast.data.totalSAR !== undefined && (
                  <span className="font-mono text-xs font-bold text-[#E5C378]">
                    {toast.data.totalSAR} SAR
                  </span>
                )}
              </div>
            )}

            {isGiftCard && toast.data && (
              <div className="mt-2.5 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] font-tajawal text-[#A89F91]">
                <span className="text-emerald-400 font-bold">
                  -{toast.data.redeemedAmountSAR} SAR {language === 'ar' ? 'تم خصمها' : 'deducted'}
                </span>
                <span className="text-amber-300/90 font-mono">
                  {language === 'ar' ? 'المتبقي:' : 'Left:'} {toast.data.remainingBalanceSAR} SAR
                </span>
              </div>
            )}

            {/* Action button if provided */}
            {toast.action && (
              <div className="mt-3 flex justify-end">
                <button
                  onClick={() => {
                    toast.action?.onClick();
                    onDismiss(toast.id);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-[#231B10] hover:bg-[#342714] border border-[#D4AF37]/50 text-[#E5C378] hover:text-[#F3E5AB] text-xs font-tajawal font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm active:scale-95"
                >
                  <span>{language === 'ar' ? toast.action.labelAr : toast.action.labelEn}</span>
                  <ArrowUpRight className="w-3 h-3" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress countdown bar at bottom */}
      <div className="h-0.5 w-full bg-white/5">
        <div
          className={`h-full transition-all ease-linear ${
            isBooking ? 'bg-[#E5C378]' : isGiftCard ? 'bg-amber-400' : 'bg-emerald-400'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </motion.div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast, soundEnabled, toggleSound } = useToast();
  const { isRTL, language } = useLanguage();

  if (toasts.length === 0) return null;

  return (
    <div
      className={`fixed z-50 bottom-4 sm:bottom-6 ${
        isRTL ? 'left-4 sm:left-6' : 'right-4 sm:right-6'
      } max-w-md w-full pointer-events-none flex flex-col gap-3`}
    >
      {/* Sound Mute/Unmute Indicator Bar (subtle) */}
      <div className="flex justify-end pointer-events-auto">
        <button
          onClick={toggleSound}
          className="px-2.5 py-1 rounded-full bg-[#120F0A]/90 border border-white/10 text-[11px] font-tajawal text-[#A89F91] hover:text-[#F8F5EE] flex items-center gap-1.5 shadow-md backdrop-blur transition-colors cursor-pointer"
          title={soundEnabled ? 'Chime sound is enabled' : 'Chime sound is muted'}
        >
          {soundEnabled ? (
            <>
              <Volume2 className="w-3 h-3 text-[#E5C378]" />
              <span>{language === 'ar' ? 'صوت الإشعار مفعّل' : 'Sound ON'}</span>
            </>
          ) : (
            <>
              <VolumeX className="w-3 h-3 text-red-400" />
              <span>{language === 'ar' ? 'صوت الإشعار مكتوم' : 'Sound OFF'}</span>
            </>
          )}
        </button>
      </div>

      {/* Toast List */}
      <div className="flex flex-col gap-2.5 w-full">
        <AnimatePresence mode="popLayout">
          {toasts.map((toast) => (
            <ToastItem key={toast.id} toast={toast} onDismiss={removeToast} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
