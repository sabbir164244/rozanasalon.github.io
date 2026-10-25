import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { ToastNotification, ToastType, Appointment } from '../types';

interface ToastContextType {
  toasts: ToastNotification[];
  history: ToastNotification[];
  unreadCount: number;
  soundEnabled: boolean;
  setSoundEnabled: (enabled: boolean) => void;
  toggleSound: () => void;
  addToast: (toast: Omit<ToastNotification, 'id' | 'timestamp'>) => string;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
  notifyNewBooking: (appointment: Appointment, onClickView?: () => void) => void;
  notifyGiftCardRedeemed: (params: {
    cardCode: string;
    amountSAR: number;
    remainingSAR: number;
    recipientName?: string;
    appointmentRef?: string;
    onClickView?: () => void;
  }) => void;
  markAllAsRead: () => void;
  clearHistory: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

// Web Audio API chime generator for pleasant luxury salon feedback
const playChime = (type: 'booking' | 'giftcard' | 'success') => {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const now = ctx.currentTime;
    const gainNode = ctx.createGain();
    gainNode.connect(ctx.destination);
    gainNode.gain.setValueAtTime(0.08, now);

    if (type === 'booking') {
      // Elegant luxury ascending double chime: E6 (1318Hz) -> G#6 (1661Hz)
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      osc1.type = 'sine';
      osc2.type = 'sine';

      osc1.frequency.setValueAtTime(1318.5, now);
      osc1.frequency.exponentialRampToValueAtTime(1318.5, now + 0.15);

      osc2.frequency.setValueAtTime(1661.2, now + 0.12);
      osc2.frequency.exponentialRampToValueAtTime(1661.2, now + 0.45);

      gainNode.gain.setValueAtTime(0.09, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.55);

      osc1.connect(gainNode);
      osc2.connect(gainNode);

      osc1.start(now);
      osc1.stop(now + 0.16);

      osc2.start(now + 0.12);
      osc2.stop(now + 0.55);
    } else if (type === 'giftcard') {
      // Soft crystalline sparkle triple chime: B5 (987Hz) -> D#6 (1244Hz) -> F#6 (1480Hz)
      const freqs = [987.77, 1244.51, 1479.98];
      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + idx * 0.08);

        noteGain.gain.setValueAtTime(0.07, now + idx * 0.08);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.35);

        osc.connect(noteGain);
        noteGain.connect(ctx.destination);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.36);
      });
    } else {
      // Subtle gentle blip
      const osc = ctx.createOscillator();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1046.5, now);
      gainNode.gain.setValueAtTime(0.06, now);
      gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      osc.connect(gainNode);
      osc.start(now);
      osc.stop(now + 0.26);
    }
  } catch {
    // AudioContext may be blocked before first user gesture, fail silently
  }
};

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<ToastNotification[]>([]);
  const [history, setHistory] = useState<ToastNotification[]>(() => {
    try {
      const saved = localStorage.getItem('rozana_toast_history');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('rozana_toast_sound');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('rozana_toast_sound', JSON.stringify(soundEnabled));
    } catch {
      // ignore
    }
  }, [soundEnabled]);

  useEffect(() => {
    try {
      // Keep last 30 items
      localStorage.setItem('rozana_toast_history', JSON.stringify(history.slice(0, 30)));
    } catch {
      // ignore
    }
  }, [history]);

  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => !prev);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  const addToast = useCallback((toastData: Omit<ToastNotification, 'id' | 'timestamp'>): string => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    const newToast: ToastNotification = {
      ...toastData,
      id,
      timestamp: new Date().toISOString(),
      duration: toastData.duration || 6500,
      read: false
    };

    if (soundEnabled) {
      playChime(newToast.type === 'giftcard' ? 'giftcard' : (newToast.type === 'booking' ? 'booking' : 'success'));
    }

    setToasts(prev => [newToast, ...prev.slice(0, 3)]); // Keep maximum 4 concurrent floating toasts
    setHistory(prev => [newToast, ...prev.slice(0, 49)]);

    return id;
  }, [soundEnabled]);

  const notifyNewBooking = useCallback((appointment: Appointment, onClickView?: () => void) => {
    addToast({
      type: 'booking',
      titleAr: '✨ حجز جديد مستلم للتو!',
      titleEn: '✨ New Booking Received!',
      messageAr: `العميلة: ${appointment.customerName} • ${appointment.serviceNameAr} • ${appointment.date} الساعة ${appointment.time}`,
      messageEn: `Client: ${appointment.customerName} • ${appointment.serviceNameEn} • ${appointment.date} @ ${appointment.time}`,
      data: {
        appointmentId: appointment.id,
        referenceId: appointment.referenceId,
        customerName: appointment.customerName,
        serviceName: appointment.serviceNameAr,
        date: appointment.date,
        time: appointment.time,
        totalSAR: appointment.totalSAR
      },
      action: onClickView ? {
        labelAr: 'عرض الحجز',
        labelEn: 'View Booking',
        onClick: onClickView
      } : undefined,
      duration: 7500
    });
  }, [addToast]);

  const notifyGiftCardRedeemed = useCallback(({
    cardCode,
    amountSAR,
    remainingSAR,
    recipientName,
    appointmentRef,
    onClickView
  }: {
    cardCode: string;
    amountSAR: number;
    remainingSAR: number;
    recipientName?: string;
    appointmentRef?: string;
    onClickView?: () => void;
  }) => {
    addToast({
      type: 'giftcard',
      titleAr: '🎁 تم صرف بطاقة إهداء بنجاح',
      titleEn: '🎁 Gift Card Redeemed Successfully',
      messageAr: `تم خصم ${amountSAR} ر.س من البطاقة (${cardCode}) ${recipientName ? `للمستفيدة: ${recipientName}` : ''}. الرصيد المتبقي: ${remainingSAR} ر.س`,
      messageEn: `Deducted ${amountSAR} SAR from (${cardCode}) ${recipientName ? `for: ${recipientName}` : ''}. Remaining Balance: ${remainingSAR} SAR`,
      data: {
        cardCode,
        redeemedAmountSAR: amountSAR,
        remainingBalanceSAR: remainingSAR,
        recipientName,
        referenceId: appointmentRef
      },
      action: onClickView ? {
        labelAr: 'سجل البطاقة',
        labelEn: 'Card Ledger',
        onClick: onClickView
      } : undefined,
      duration: 7000
    });
  }, [addToast]);

  const markAllAsRead = useCallback(() => {
    setHistory(prev => prev.map(item => ({ ...item, read: true })));
  }, []);

  const clearHistory = useCallback(() => {
    setHistory([]);
  }, []);

  const unreadCount = history.filter(h => !h.read).length;

  return (
    <ToastContext.Provider
      value={{
        toasts,
        history,
        unreadCount,
        soundEnabled,
        setSoundEnabled,
        toggleSound,
        addToast,
        removeToast,
        clearAllToasts,
        notifyNewBooking,
        notifyGiftCardRedeemed,
        markAllAsRead,
        clearHistory,
      }}
    >
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
