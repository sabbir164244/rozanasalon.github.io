import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Download, 
  Upload, 
  RotateCcw, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  FileJson,
  Sparkles,
  Database
} from 'lucide-react';

interface AdminBackupTabProps {
  onExportAllData: () => void;
  onImportAllData: (jsonData: string) => boolean;
  onResetToDefaults: () => void;
}

export const AdminBackupTab: React.FC<AdminBackupTabProps> = ({
  onExportAllData,
  onImportAllData,
  onResetToDefaults,
}) => {
  const { language } = useLanguage();

  const [importText, setImportText] = useState('');
  const [importStatus, setImportStatus] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleImportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setImportStatus(null);
    if (!importText.trim()) {
      setImportStatus({
        type: 'error',
        text: language === 'ar' ? 'الرجاء لصق نص كود JSON للنسخة الاحتياطية' : 'Please paste valid JSON backup data'
      });
      return;
    }

    const success = onImportAllData(importText.trim());
    if (success) {
      setImportStatus({
        type: 'success',
        text: language === 'ar' ? 'تم استيراد واستعادة كامل بيانات الموقع بنجاح!' : 'Website data restored successfully!'
      });
      setImportText('');
    } else {
      setImportStatus({
        type: 'error',
        text: language === 'ar' ? 'صيغة JSON غير صالحة، يرجى التأكد من الملف' : 'Invalid JSON format or corrupted file structure'
      });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setImportText(content);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8 text-start animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#17140E] via-[#1F1910] to-[#17140E] border border-[#D4AF37]/40 p-6 sm:p-8 flex items-center gap-4 shadow-xl">
        <div className="w-14 h-14 rounded-2xl bg-[#0E0C09] border border-[#D4AF37]/50 flex items-center justify-center text-[#E5C378] shadow-md shrink-0">
          <Database className="w-7 h-7 text-[#E5C378]" />
        </div>
        <div>
          <h2 className="font-playfair text-2xl font-bold text-[#F8F5EE]">
            {language === 'ar' ? 'إدارة النسخ الاحتياطي وحفظ بيانات الموقع' : 'Database Backup & System Recovery'}
          </h2>
          <p className="font-tajawal text-xs sm:text-sm text-[#A89F91] mt-1">
            {language === 'ar'
              ? 'تصدير كامل بيانات الصالون من خدمات، أسعار، حجوزات، صور وإعدادات في ملف واحد، أو استعادتها بضغطة زر.'
              : 'Export complete salon database including services, prices, bookings, images, and credentials as JSON.'}
          </p>
        </div>
      </div>

      {/* Feedback Banner */}
      {importStatus && (
        <div className={`p-4 rounded-2xl border flex items-center gap-3 animate-in fade-in ${
          importStatus.type === 'success'
            ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-200'
            : 'bg-red-950/70 border-red-500/40 text-red-200'
        }`}>
          {importStatus.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          )}
          <span className="font-tajawal text-sm">{importStatus.text}</span>
        </div>
      )}

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Card 1: Export */}
        <div className="rounded-3xl bg-[#13110C] border border-white/10 p-6 sm:p-8 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <Download className="w-6 h-6 text-[#E5C378]" />
              <h3 className="font-playfair text-xl font-bold text-[#F8F5EE]">
                {language === 'ar' ? 'تصدير نسخة احتياطية كاملة' : 'Export Full Website State'}
              </h3>
            </div>
            <p className="font-tajawal text-xs text-[#A89F91] leading-relaxed mb-6">
              {language === 'ar'
                ? 'يقوم هذا الخيار بتنزيل ملف JSON يحتوي على كافة الخدمات، الأسعار، الحجوزات، الصور، الموظفات، التقييمات وإعدادات الأمان الحالية.'
                : 'Download an encrypted JSON file holding all treatments, prices, bookings, images, team schedules, and security credentials.'}
            </p>
          </div>

          <button
            onClick={onExportAllData}
            className="w-full py-4 rounded-full luxe-gold-btn text-xs font-tajawal font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg"
          >
            <Download className="w-4 h-4" />
            <span>{language === 'ar' ? 'تنزيل ملف النسخة الاحتياطية (JSON)' : 'Download Backup File (.json)'}</span>
          </button>
        </div>

        {/* Card 2: Import */}
        <div className="rounded-3xl bg-[#13110C] border border-white/10 p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <Upload className="w-6 h-6 text-[#E5C378]" />
            <h3 className="font-playfair text-xl font-bold text-[#F8F5EE]">
              {language === 'ar' ? 'استيراد واستعادة البيانات' : 'Restore from JSON Backup'}
            </h3>
          </div>

          <form onSubmit={handleImportSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] mb-2">
                {language === 'ar' ? 'رفع ملف النسخة الاحتياطية' : 'Upload Backup File'}
              </label>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="w-full text-xs text-[#A89F91] file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-tajawal file:font-bold file:bg-[#1F1910] file:text-[#E5C378] hover:file:bg-[#2A2215] cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] mb-1">
                {language === 'ar' ? 'أو الصقي محتوى JSON مباشرةً:' : 'Or Paste JSON Content Direct:'}
              </label>
              <textarea
                rows={4}
                value={importText}
                onChange={(e) => setImportText(e.target.value)}
                placeholder='{"rozana_services": [...], ...}'
                className="w-full px-4 py-2.5 rounded-xl bg-[#18150F] border border-white/10 text-xs text-[#F8F5EE] focus:border-[#E5C378] outline-none font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-full bg-[#241D12] hover:bg-[#2F2516] border border-[#D4AF37]/30 text-xs font-tajawal font-bold text-[#E5C378] flex items-center justify-center gap-2 cursor-pointer shadow-md transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>{language === 'ar' ? 'استعادة البيانات وتطبيقها' : 'Apply Restored Data'}</span>
            </button>
          </form>
        </div>
      </div>

      {/* Danger Zone: Factory Reset */}
      <div className="p-6 rounded-3xl bg-red-950/20 border border-red-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h4 className="font-playfair text-base font-bold text-red-300">
            {language === 'ar' ? 'إعادة ضبط المصنع واسترجاع البيانات الأصلية' : 'Reset to Initial Factory Defaults'}
          </h4>
          <p className="font-tajawal text-xs text-[#A89F91] mt-1">
            {language === 'ar'
              ? 'سيقوم هذا بإعادة جميع الخدمات والأسعار والمواعيد وبيانات الدخول للوضع الافتراضي الأولي.'
              : 'Reverts all services, prices, images, bookings, and admin credentials back to factory state.'}
          </p>
        </div>

        <button
          onClick={() => setShowResetConfirm(true)}
          className="px-6 py-2.5 rounded-full bg-red-950/60 hover:bg-red-900 border border-red-500/40 text-xs font-tajawal font-bold text-red-200 flex items-center gap-2 cursor-pointer transition-colors shrink-0"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>{language === 'ar' ? 'إعادة الضبط الأولي' : 'Factory Reset'}</span>
        </button>
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="max-w-sm w-full rounded-3xl bg-[#14110C] border border-red-500/40 p-6 text-center space-y-4">
            <AlertTriangle className="w-10 h-10 text-red-400 mx-auto" />
            <h3 className="font-playfair text-lg font-bold text-[#F8F5EE]">
              {language === 'ar' ? 'تأكيد استعادة الوضع الافتراضي' : 'Confirm Factory Reset'}
            </h3>
            <p className="font-tajawal text-xs text-[#A89F91]">
              {language === 'ar'
                ? 'هل أنتِ متأكدة؟ سيتم حذف أي تعديلات خاصة قمتِ بإضافتها وإعادة ضبط الصالون للبيانات الأولية.'
                : 'Are you sure? Any custom changes made will be reset back to the default salon templates.'}
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-2.5 rounded-full bg-[#1A1711] border border-white/10 text-xs font-tajawal text-[#D2C8BA] cursor-pointer"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={() => {
                  onResetToDefaults();
                  setShowResetConfirm(false);
                }}
                className="flex-1 py-2.5 rounded-full bg-red-800 hover:bg-red-700 text-xs font-tajawal font-bold text-white cursor-pointer shadow-lg"
              >
                {language === 'ar' ? 'نعم، أعد الضبط' : 'Reset All'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
