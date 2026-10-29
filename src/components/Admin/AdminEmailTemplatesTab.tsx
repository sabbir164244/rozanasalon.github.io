import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { 
  EmailTemplate, 
  SUPPORTED_BOOKING_VARIABLES, 
  getEmailTemplates, 
  saveEmailTemplate, 
  resetEmailTemplatesToDefault, 
  compileBookingEmail,
  previewBookingEmail,
  validateTemplate,
  EmailTemplateVariable
} from '../../lib/emailTemplateService';
import { Appointment } from '../../types';
import { 
  Mail, 
  Sparkles, 
  Copy, 
  Check, 
  RefreshCw, 
  Code, 
  Eye, 
  Save, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle, 
  Calendar, 
  Clock, 
  User, 
  Scissors, 
  Send,
  Sliders,
  Layers,
  FileText
} from 'lucide-react';

interface AdminEmailTemplatesTabProps {
  onAddAuditLog?: (entry: any) => void;
}

export const AdminEmailTemplatesTab: React.FC<AdminEmailTemplatesTabProps> = ({ onAddAuditLog }) => {
  const { language, isRTL } = useLanguage();

  const [templates, setTemplates] = useState<EmailTemplate[]>(() => getEmailTemplates());
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>('booking_confirmation');
  const [previewLang, setPreviewLang] = useState<'ar' | 'en'>(language === 'ar' ? 'ar' : 'en');
  const [viewMode, setViewMode] = useState<'preview' | 'edit'>('preview');
  const [previewFormat, setPreviewFormat] = useState<'html' | 'text'>('html');

  // Interactive sample data for live variable preview
  const [sampleCustomerName, setSampleCustomerName] = useState<string>('سارة العتيبي (Sarah Al-Otaibi)');
  const [sampleService, setSampleService] = useState<string>('علاج الكافيار والبروتين الملكي (Royal Caviar Treatment)');
  const [sampleTime, setSampleTime] = useState<string>('04:30 PM');
  const [sampleDate, setSampleDate] = useState<string>('2026-11-05');
  const [sampleSpecialist, setSampleSpecialist] = useState<string>('نورة القحطاني (Noura Al-Qahtani)');
  const [sampleRef, setSampleRef] = useState<string>('ROZ-7824');

  // Currently editing template draft
  const activeTemplate = templates.find((t) => t.id === selectedTemplateId) || templates[0];
  const [draft, setDraft] = useState<EmailTemplate>({ ...activeTemplate });

  // Notifications / feedback
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);
  const [testSent, setTestSent] = useState<boolean>(false);

  // Sync draft when template selection changes
  useEffect(() => {
    if (activeTemplate) {
      setDraft({ ...activeTemplate });
    }
  }, [selectedTemplateId]);

  const handleCopyVariable = (key: string) => {
    const text = `{{${key}}}`;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  const handleInsertVariable = (key: string, field: 'subject' | 'text' | 'html') => {
    const placeholder = `{{${key}}}`;
    const isArabic = previewLang === 'ar';

    setDraft((prev) => {
      if (field === 'subject') {
        const current = isArabic ? prev.subjectAr : prev.subjectEn;
        return {
          ...prev,
          [isArabic ? 'subjectAr' : 'subjectEn']: current + ` ${placeholder}`
        };
      } else if (field === 'text') {
        const current = isArabic ? prev.bodyTextAr : prev.bodyTextEn;
        return {
          ...prev,
          [isArabic ? 'bodyTextAr' : 'bodyTextEn']: current + `\n${placeholder}`
        };
      } else {
        const current = isArabic ? prev.bodyHtmlAr : prev.bodyHtmlEn;
        return {
          ...prev,
          [isArabic ? 'bodyHtmlAr' : 'bodyHtmlEn']: current + ` ${placeholder}`
        };
      }
    });
  };

  const handleSaveDraft = () => {
    saveEmailTemplate(draft);
    setTemplates(getEmailTemplates());
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);

    if (onAddAuditLog) {
      onAddAuditLog({
        category: 'content',
        actionType: 'email_template_update',
        titleEn: `Updated Email Template: ${draft.nameEn}`,
        titleAr: `تحديث قالب البريد الإلكتروني: ${draft.nameAr}`,
        detailsEn: `Modified dynamic variables and content for template (${draft.id})`,
        detailsAr: `تم تعديل المتغيرات الديناميكية والمحتوى للقالب (${draft.id})`,
        actor: 'Admin',
        severity: 'info'
      });
    }
  };

  const handleResetDefaults = () => {
    if (window.confirm(language === 'ar' ? 'هل أنت متأكد من استعادة كافة القوالب الافتراضية للصالون؟' : 'Reset all email templates back to system luxury defaults?')) {
      const defaults = resetEmailTemplatesToDefault();
      setTemplates(defaults);
      const resetDraft = defaults.find((t) => t.id === selectedTemplateId) || defaults[0];
      setDraft({ ...resetDraft });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    }
  };

  // Compile active draft using sample data
  const sampleAppointment: Appointment = {
    id: 'apt-sample-live',
    referenceId: sampleRef,
    customerName: sampleCustomerName,
    customerPhone: '+966 50 123 4567',
    serviceId: 'srv-live',
    serviceNameEn: sampleService,
    serviceNameAr: sampleService,
    staffName: sampleSpecialist,
    date: sampleDate,
    time: sampleTime,
    status: 'confirmed',
    totalSAR: 350,
    createdAt: new Date().toISOString()
  };

  const compiled = compileBookingEmail(draft.id, sampleAppointment, previewLang, {
    customerEmail: 'vip.client@rozanasalon.sa'
  });

  const validation = validateTemplate(draft);

  return (
    <div className="space-y-6 text-start">
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-[#1A160F] via-[#14110B] to-[#0E0C09] border border-[#D4AF37]/35 shadow-2xl relative overflow-hidden">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="p-2 rounded-xl bg-[#2A200F] border border-[#D4AF37]/50 text-[#E5C378]">
                <Mail className="w-5 h-5 text-[#E5C378]" />
              </span>
              <span className="text-[11px] font-mono uppercase tracking-widest text-[#E5C378] px-2.5 py-0.5 rounded-full bg-[#E5C378]/10 border border-[#D4AF37]/30">
                Template Engine
              </span>
            </div>
            <h2 className="font-playfair text-2xl sm:text-3xl font-bold text-[#F8F5EE]">
              {language === 'ar' ? 'إدارة قوالب البريد الإلكتروني التلقائية' : 'Dynamic Booking Email Templates'}
            </h2>
            <p className="font-tajawal text-xs sm:text-sm text-[#A89F91] max-w-2xl mt-1 leading-relaxed">
              {language === 'ar'
                ? 'تحكم كامل بنصوص ورسائل البريد الفاخرة للعميلات مع دعم المتغيرات الفورية لاسم العميلة، الخدمة، ووقت الموعد، والرمز المرجعي.'
                : 'Manage automated luxury HTML & text templates with dynamic variables for customer name, service treatment, appointment time, and salon branch.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleResetDefaults}
              className="px-3.5 py-2 rounded-xl bg-[#1C1811] hover:bg-[#252016] border border-white/10 text-xs text-[#A89F91] hover:text-[#F8F5EE] flex items-center gap-1.5 transition-all cursor-pointer"
              title="Reset to defaults"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{language === 'ar' ? 'استعادة الافتراضي' : 'Reset Defaults'}</span>
            </button>
            <button
              onClick={handleSaveDraft}
              className="luxe-gold-btn px-5 py-2.5 rounded-xl text-xs font-bold font-tajawal flex items-center gap-1.5 shadow-lg cursor-pointer"
            >
              {saveSuccess ? <CheckCircle2 className="w-4 h-4 text-emerald-950" /> : <Save className="w-4 h-4" />}
              <span>{saveSuccess ? (language === 'ar' ? 'تم الحفظ بنجاح!' : 'Saved!') : (language === 'ar' ? 'حفظ التعديلات' : 'Save Template')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Variables Quick Palette Bar */}
      <div className="p-4 rounded-2xl bg-[#14120D] border border-[#D4AF37]/25 shadow-lg">
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#E5C378]" />
            <h4 className="text-xs font-playfair font-bold text-[#F8F5EE]">
              {language === 'ar' ? 'المتغيرات الديناميكية المدعومة (انقري للنسخ أو الإدراج):' : 'Supported Dynamic Booking Variables (Click to copy):'}
            </h4>
          </div>
          <span className="text-[10px] font-mono text-[#8C8477]">
            {SUPPORTED_BOOKING_VARIABLES.length} {language === 'ar' ? 'متغير متاح' : 'variables'}
          </span>
        </div>

        <div className="flex flex-wrap gap-2">
          {SUPPORTED_BOOKING_VARIABLES.map((v) => {
            const isCopied = copiedKey === v.key;
            const isHighlight = v.key === 'customer_name' || v.key === 'service' || v.key === 'appointment_time';

            return (
              <button
                key={v.key}
                type="button"
                onClick={() => handleCopyVariable(v.key)}
                className={`group px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-1.5 transition-all cursor-pointer border ${
                  isHighlight
                    ? 'bg-[#2A200F] border-[#D4AF37]/60 text-[#E5C378] hover:bg-[#382B14]'
                    : 'bg-[#18150F] border-white/10 text-[#D2C8BA] hover:border-[#D4AF37]/40'
                }`}
                title={`${v.labelEn} / ${v.labelAr} (e.g. ${v.example})`}
              >
                {isCopied ? (
                  <Check className="w-3 h-3 text-emerald-400" />
                ) : (
                  <Copy className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                )}
                <span className="font-bold">{`{{${v.key}}}`}</span>
                {isHighlight && (
                  <span className="text-[9px] px-1 py-0.2 rounded bg-[#E5C378]/20 text-[#E5C378]">
                    ★
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Grid: Template List & Work Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Template Selection Cards */}
        <div className="lg:col-span-4 space-y-3">
          <span className="text-xs font-tajawal font-bold text-[#8C8477] uppercase tracking-wider block px-1">
            {language === 'ar' ? 'قوالب الحجوزات المتاحة' : 'Booking Template Catalog'}
          </span>

          <div className="space-y-2">
            {templates.map((tmpl) => {
              const isSelected = tmpl.id === selectedTemplateId;
              return (
                <div
                  key={tmpl.id}
                  onClick={() => setSelectedTemplateId(tmpl.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer text-start ${
                    isSelected
                      ? 'bg-[#1F190F] border-[#E5C378] shadow-lg ring-1 ring-[#E5C378]/30'
                      : 'bg-[#13110C] border-white/5 hover:border-white/15'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-playfair font-bold text-[#F8F5EE]">
                      {language === 'ar' ? tmpl.nameAr : tmpl.nameEn}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#18150F] border border-white/10 text-[#A89F91]">
                      {tmpl.category}
                    </span>
                  </div>
                  <p className="text-[11px] font-tajawal text-[#8C8477] line-clamp-2 leading-relaxed">
                    {language === 'ar' ? tmpl.descriptionAr : tmpl.descriptionEn}
                  </p>
                  <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-[#E5C378]">
                    <span>#{tmpl.id}</span>
                    <span className="text-[#8C8477]">
                      {tmpl.supportedVariables.length} vars
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Validation Check Card */}
          <div className="p-4 rounded-2xl bg-[#14120D] border border-white/10 text-xs font-tajawal space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#D2C8BA] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                {language === 'ar' ? 'فحص صحة المتغيرات الأساسية' : 'Key Variables Verification'}
              </span>
              <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full ${
                validation.isValid ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/40' : 'bg-amber-950/70 text-amber-300 border border-amber-500/40'
              }`}>
                {validation.isValid ? 'Valid' : 'Attention'}
              </span>
            </div>
            <div className="space-y-1 text-[11px] text-[#8C8477]">
              <div className="flex items-center justify-between">
                <span>customer_name</span>
                <Check className="w-3 h-3 text-emerald-400" />
              </div>
              <div className="flex items-center justify-between">
                <span>service</span>
                <Check className="w-3 h-3 text-emerald-400" />
              </div>
              <div className="flex items-center justify-between">
                <span>appointment_time</span>
                <Check className="w-3 h-3 text-emerald-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Editor & Live Preview Canvas */}
        <div className="lg:col-span-8 space-y-4">
          {/* Top Control Bar */}
          <div className="p-3 rounded-2xl bg-[#14120D] border border-white/10 flex flex-wrap items-center justify-between gap-3">
            {/* View Mode Toggle: Preview vs Edit */}
            <div className="flex items-center p-1 rounded-xl bg-[#0E0C09] border border-white/5">
              <button
                type="button"
                onClick={() => setViewMode('preview')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-tajawal font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'preview'
                    ? 'bg-[#E5C378] text-[#0E0C09] shadow'
                    : 'text-[#8C8477] hover:text-[#F8F5EE]'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'معاينة حية فورية' : 'Live Preview'}</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('edit')}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-tajawal font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  viewMode === 'edit'
                    ? 'bg-[#E5C378] text-[#0E0C09] shadow'
                    : 'text-[#8C8477] hover:text-[#F8F5EE]'
                }`}
              >
                <Code className="w-3.5 h-3.5" />
                <span>{language === 'ar' ? 'محرر القالب والكود' : 'Template Editor'}</span>
              </button>
            </div>

            {/* Language Switch */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[#8C8477] font-tajawal">
                {language === 'ar' ? 'لغة القالب المعروض:' : 'Language:'}
              </span>
              <div className="flex p-1 rounded-xl bg-[#0E0C09] border border-white/5">
                <button
                  type="button"
                  onClick={() => setPreviewLang('ar')}
                  className={`px-2.5 py-1 text-xs rounded-lg font-bold font-tajawal transition-all cursor-pointer ${
                    previewLang === 'ar' ? 'bg-[#2A200F] text-[#E5C378] border border-[#D4AF37]/50' : 'text-[#8C8477]'
                  }`}
                >
                  العربية (RTL)
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewLang('en')}
                  className={`px-2.5 py-1 text-xs rounded-lg font-bold font-tajawal transition-all cursor-pointer ${
                    previewLang === 'en' ? 'bg-[#2A200F] text-[#E5C378] border border-[#D4AF37]/50' : 'text-[#8C8477]'
                  }`}
                >
                  English
                </button>
              </div>
            </div>

            {/* Format toggle (HTML vs Plain text) */}
            {viewMode === 'preview' && (
              <div className="flex p-1 rounded-xl bg-[#0E0C09] border border-white/5">
                <button
                  type="button"
                  onClick={() => setPreviewFormat('html')}
                  className={`px-2.5 py-1 text-xs rounded-lg font-mono transition-all cursor-pointer ${
                    previewFormat === 'html' ? 'bg-[#2A200F] text-[#E5C378] border border-[#D4AF37]/40' : 'text-[#8C8477]'
                  }`}
                >
                  HTML Luxury View
                </button>
                <button
                  type="button"
                  onClick={() => setPreviewFormat('text')}
                  className={`px-2.5 py-1 text-xs rounded-lg font-mono transition-all cursor-pointer ${
                    previewFormat === 'text' ? 'bg-[#2A200F] text-[#E5C378] border border-[#D4AF37]/40' : 'text-[#8C8477]'
                  }`}
                >
                  Plain Text
                </button>
              </div>
            )}
          </div>

          {/* Interactive Live Preview View */}
          {viewMode === 'preview' && (
            <div className="space-y-4">
              {/* Sample Variable Inputs */}
              <div className="p-4 rounded-2xl bg-[#14120D] border border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-tajawal text-[#E5C378] flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5" />
                    {language === 'ar' ? 'تعديل قيم المتغيرات للمعاينة الحية' : 'Live Variable Sample Inputs'}
                  </span>
                  <span className="text-[10px] text-[#8C8477] font-mono">
                    Instant Real-Time Compile
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div>
                    <label className="text-[10px] font-tajawal text-[#8C8477] block mb-1">
                      {`{{customer_name}}`}
                    </label>
                    <input
                      type="text"
                      value={sampleCustomerName}
                      onChange={(e) => setSampleCustomerName(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#0E0C09] border border-white/10 text-xs text-[#F8F5EE] focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-tajawal text-[#8C8477] block mb-1">
                      {`{{service}}`}
                    </label>
                    <input
                      type="text"
                      value={sampleService}
                      onChange={(e) => setSampleService(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#0E0C09] border border-white/10 text-xs text-[#F8F5EE] focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-tajawal text-[#8C8477] block mb-1">
                      {`{{appointment_time}}`}
                    </label>
                    <input
                      type="text"
                      value={sampleTime}
                      onChange={(e) => setSampleTime(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-lg bg-[#0E0C09] border border-white/10 text-xs text-[#F8F5EE] focus:border-[#D4AF37] focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Rendered Preview Screen */}
              <div className="rounded-3xl bg-[#0E0C09] border border-[#D4AF37]/35 overflow-hidden shadow-2xl">
                {/* Email Client Header Chrome */}
                <div className="p-4 bg-[#17140E] border-b border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono text-[#8C8477]">
                    <span className="flex items-center gap-1.5">
                      <span className="text-[#E5C378]">From:</span> concierge@rozanasalon.sa (Rozana Luxury Salon)
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-400 border border-emerald-500/30">
                      Simulated Dispatch
                    </span>
                  </div>
                  <div className="text-xs font-mono text-[#8C8477]">
                    <span className="text-[#E5C378]">To:</span> vip.client@rozanasalon.sa ({sampleCustomerName})
                  </div>
                  <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-mono text-[#8C8477] block">Subject:</span>
                      <h3 className="font-playfair text-sm sm:text-base font-bold text-[#E5C378]">
                        {compiled.subject}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(previewFormat === 'html' ? compiled.htmlBody : compiled.textBody);
                        setTestSent(true);
                        setTimeout(() => setTestSent(false), 2000);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#241E13] hover:bg-[#2F2718] border border-[#D4AF37]/40 text-xs font-tajawal text-[#E5C378] flex items-center gap-1.5 cursor-pointer"
                    >
                      {testSent ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{testSent ? (language === 'ar' ? 'تم نسخ المحتوى!' : 'Copied!') : (language === 'ar' ? 'نسخ البريد المولد' : 'Copy Compiled')}</span>
                    </button>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-4 sm:p-6 max-h-[600px] overflow-y-auto">
                  {previewFormat === 'html' ? (
                    <div className="rounded-2xl border border-white/10 overflow-hidden bg-[#0A0907] p-2">
                      <iframe
                        title="Email Preview"
                        srcDoc={compiled.htmlBody}
                        className="w-full min-h-[500px] rounded-xl border-0 bg-transparent"
                      />
                    </div>
                  ) : (
                    <div className="p-5 rounded-2xl bg-[#14120D] border border-white/5 font-tajawal text-xs sm:text-sm text-[#F8F5EE] whitespace-pre-line leading-relaxed">
                      {compiled.textBody}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Template Code & Text Editor */}
          {viewMode === 'edit' && (
            <div className="space-y-4">
              {/* Subject Editor */}
              <div className="p-4 rounded-2xl bg-[#14120D] border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold font-tajawal text-[#E5C378]">
                    {previewLang === 'ar' ? 'عنوان الرسالة (Subject - بالعربية):' : 'Email Subject (English):'}
                  </label>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleInsertVariable('customer_name', 'subject')}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1C1811] text-[#E5C378] border border-white/10 hover:border-[#D4AF37]/50"
                    >
                      + customer_name
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInsertVariable('service', 'subject')}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1C1811] text-[#E5C378] border border-white/10 hover:border-[#D4AF37]/50"
                    >
                      + service
                    </button>
                    <button
                      type="button"
                      onClick={() => handleInsertVariable('appointment_time', 'subject')}
                      className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1C1811] text-[#E5C378] border border-white/10 hover:border-[#D4AF37]/50"
                    >
                      + appointment_time
                    </button>
                  </div>
                </div>
                <input
                  type="text"
                  value={previewLang === 'ar' ? draft.subjectAr : draft.subjectEn}
                  onChange={(e) => {
                    const val = e.target.value;
                    setDraft((prev) => ({
                      ...prev,
                      [previewLang === 'ar' ? 'subjectAr' : 'subjectEn']: val
                    }));
                  }}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0E0C09] border border-white/15 text-sm font-playfair text-[#F8F5EE] focus:border-[#D4AF37] focus:outline-none"
                />
              </div>

              {/* Text Body Editor */}
              <div className="p-4 rounded-2xl bg-[#14120D] border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold font-tajawal text-[#E5C378]">
                    {previewLang === 'ar' ? 'نص الرسالة النصي (Plain Text):' : 'Plain Text Email Body:'}
                  </label>
                  <span className="text-[10px] font-mono text-[#8C8477]">
                    {"Line breaks & {{variables}} preserved"}
                  </span>
                </div>
                <textarea
                  rows={9}
                  value={previewLang === 'ar' ? draft.bodyTextAr : draft.bodyTextEn}
                  onChange={(e) => {
                    const val = e.target.value;
                    setDraft((prev) => ({
                      ...prev,
                      [previewLang === 'ar' ? 'bodyTextAr' : 'bodyTextEn']: val
                    }));
                  }}
                  className="w-full p-4 rounded-xl bg-[#0E0C09] border border-white/15 text-xs font-tajawal text-[#DDD] focus:border-[#D4AF37] focus:outline-none leading-relaxed"
                />
              </div>

              {/* HTML Body Editor */}
              <div className="p-4 rounded-2xl bg-[#14120D] border border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold font-tajawal text-[#E5C378]">
                    {previewLang === 'ar' ? 'قالب HTML الفاخر (Responsive Luxury HTML):' : 'Luxury Responsive HTML Code:'}
                  </label>
                  <span className="text-[10px] font-mono text-[#8C8477]">
                    Styled for Gmail, Apple Mail, Outlook
                  </span>
                </div>
                <textarea
                  rows={10}
                  value={previewLang === 'ar' ? draft.bodyHtmlAr : draft.bodyHtmlEn}
                  onChange={(e) => {
                    const val = e.target.value;
                    setDraft((prev) => ({
                      ...prev,
                      [previewLang === 'ar' ? 'bodyHtmlAr' : 'bodyHtmlEn']: val
                    }));
                  }}
                  className="w-full p-4 rounded-xl bg-[#0A0907] border border-white/15 text-xs font-mono text-[#A89F91] focus:border-[#D4AF37] focus:outline-none leading-relaxed"
                />
              </div>

              {/* Action Save Row */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDraft({ ...activeTemplate })}
                  className="px-4 py-2 rounded-xl text-xs font-tajawal text-[#8C8477] hover:text-white cursor-pointer"
                >
                  {language === 'ar' ? 'إلغاء التغييرات' : 'Discard Changes'}
                </button>
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="luxe-gold-btn px-6 py-2.5 rounded-xl text-xs font-bold font-tajawal flex items-center gap-2 cursor-pointer shadow-lg"
                >
                  <Save className="w-4 h-4" />
                  <span>{language === 'ar' ? 'حفظ التعديلات في النظام' : 'Save Template Changes'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
