import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { ServiceNotificationRecord } from '../types';
import { 
  MessageSquare, 
  Mail, 
  CheckCircle2, 
  Smartphone, 
  Copy, 
  Check, 
  RefreshCw, 
  ExternalLink,
  ShieldCheck,
  Send,
  BellRing
} from 'lucide-react';

interface ServiceNotificationCardProps {
  smsRecord?: ServiceNotificationRecord | null;
  emailRecord?: ServiceNotificationRecord | null;
  onResend?: (channel: 'sms' | 'email') => Promise<void>;
}

export const ServiceNotificationCard: React.FC<ServiceNotificationCardProps> = ({
  smsRecord,
  emailRecord,
  onResend
}) => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'sms' | 'email'>('sms');
  const [copied, setCopied] = useState<boolean>(false);
  const [isResending, setIsResending] = useState<boolean>(false);

  const activeRecord = activeTab === 'sms' ? smsRecord : emailRecord;

  const handleCopy = () => {
    if (!activeRecord) return;
    const textToCopy = language === 'ar' ? activeRecord.contentAr : activeRecord.contentEn;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTriggerResend = async () => {
    if (!onResend || isResending) return;
    setIsResending(true);
    try {
      await onResend(activeTab);
    } finally {
      setIsResending(false);
    }
  };

  if (!smsRecord && !emailRecord) return null;

  return (
    <div className="w-full max-w-md mx-auto my-6 rounded-3xl bg-[#110F0A] border border-[#D4AF37]/35 p-5 sm:p-6 shadow-2xl text-start overflow-hidden">
      {/* Top Header Badge */}
      <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#2A200F] border border-[#D4AF37]/50 flex items-center justify-center text-[#E5C378]">
            <BellRing className="w-4 h-4 text-[#E5C378] animate-pulse" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-playfair font-bold text-[#F8F5EE]">
              {language === 'ar' ? 'إشعار الخدمة الفوري (مُرسل تلقائياً)' : 'Automated Service Notification'}
            </h4>
            <span className="text-[10px] font-tajawal text-[#8C8477]">
              {language === 'ar' ? 'تم توليد وتأكيد الإرسال للعميلة فوراً' : 'Dispatched via Mock Notification Utility'}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/40 text-[10px] font-mono text-emerald-300">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          <span>{language === 'ar' ? 'تم التوصيل' : 'Delivered'}</span>
        </div>
      </div>

      {/* Channel Switch Tabs */}
      <div className="grid grid-cols-2 p-1 rounded-xl bg-[#18150F] border border-white/5 my-3.5">
        <button
          type="button"
          onClick={() => setActiveTab('sms')}
          className={`py-2 px-3 text-xs font-tajawal font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'sms'
              ? 'bg-[#E5C378] text-[#0E0C09] shadow-md'
              : 'text-[#A89F91] hover:text-[#F8F5EE]'
          }`}
        >
          <Smartphone className="w-3.5 h-3.5" />
          <span>{language === 'ar' ? 'رسالة SMS نصية' : 'Simulated SMS'}</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('email')}
          className={`py-2 px-3 text-xs font-tajawal font-bold rounded-lg flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
            activeTab === 'email'
              ? 'bg-[#E5C378] text-[#0E0C09] shadow-md'
              : 'text-[#A89F91] hover:text-[#F8F5EE]'
          }`}
        >
          <Mail className="w-3.5 h-3.5" />
          <span>{language === 'ar' ? 'بريد إلكتروني فاخر' : 'Automated Email'}</span>
        </button>
      </div>

      {/* Notification Body Preview */}
      {activeRecord ? (
        <div className="space-y-3">
          {/* Metadata Bar */}
          <div className="p-2.5 rounded-xl bg-[#17140E] border border-white/5 flex items-center justify-between text-[11px] font-mono text-[#8C8477]">
            <span className="flex items-center gap-1">
              <span className="text-[#E5C378]">To:</span>{' '}
              {activeTab === 'sms'
                ? activeRecord.customerPhone
                : activeRecord.customerEmail || 'client@example.com'}
            </span>
            <span className="text-[10px] text-[#A89F91]">
              Gateway: {activeRecord.gatewayRef}
            </span>
          </div>

          {/* Realistic Device Screen Container */}
          {activeTab === 'sms' ? (
            /* SMS Bubble Preview */
            <div className="p-4 rounded-2xl bg-[#1A1812] border border-[#D4AF37]/20 relative shadow-inner">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/5 text-[10px] text-[#8C8477]">
                <span className="font-bold text-[#E5C378]">STC / Mobily SMS Gateway • {activeRecord.senderId}</span>
                <span>{new Date(activeRecord.sentAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
              <p className="text-xs font-tajawal text-[#F8F5EE] whitespace-pre-line leading-relaxed">
                {language === 'ar' ? activeRecord.contentAr : activeRecord.contentEn}
              </p>
            </div>
          ) : (
            /* Email Card Preview */
            <div className="p-4 rounded-2xl bg-[#1A1812] border border-[#D4AF37]/20 shadow-inner space-y-2.5">
              <div className="pb-2 border-b border-white/5">
                <span className="text-[10px] text-[#8C8477] block">Subject:</span>
                <span className="text-xs font-playfair font-bold text-[#E5C378] block">
                  {activeRecord.subject}
                </span>
              </div>
              <p className="text-xs font-tajawal text-[#DDD] whitespace-pre-line leading-relaxed max-h-48 overflow-y-auto pr-1">
                {language === 'ar' ? activeRecord.contentAr : activeRecord.contentEn}
              </p>
            </div>
          )}

          {/* Action Row */}
          <div className="flex items-center justify-between pt-1 text-xs">
            <button
              type="button"
              onClick={handleCopy}
              className="text-[#A89F91] hover:text-[#E5C378] font-tajawal text-[11px] flex items-center gap-1 transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? (language === 'ar' ? 'تم النسخ' : 'Copied!') : (language === 'ar' ? 'نسخ النص' : 'Copy Message')}</span>
            </button>

            {onResend && (
              <button
                type="button"
                onClick={handleTriggerResend}
                disabled={isResending}
                className="px-3 py-1.5 rounded-lg bg-[#1E1911] hover:bg-[#2A2316] text-[#E5C378] font-tajawal text-[11px] font-bold border border-[#D4AF37]/30 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <RefreshCw className={`w-3 h-3 ${isResending ? 'animate-spin' : ''}`} />
                <span>{language === 'ar' ? 'إعادة الإرسال التجريبي' : 'Simulate Resend'}</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        <p className="text-xs text-[#8C8477] text-center py-4 font-tajawal">
          {language === 'ar' ? 'لا يوجد سجل إشعار لهذه القناة' : 'No notification record for this channel'}
        </p>
      )}
    </div>
  );
};
