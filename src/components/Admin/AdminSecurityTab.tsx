import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { AdminSecurityConfig } from '../../types';
import { 
  Shield, 
  Lock, 
  Mail, 
  KeyRound, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle, 
  Save, 
  Eye, 
  EyeOff, 
  ShieldCheck, 
  Clock,
  Sparkles
} from 'lucide-react';

interface AdminSecurityTabProps {
  securityConfig: AdminSecurityConfig;
  onUpdateSecurityConfig: (newConfig: AdminSecurityConfig) => void;
}

export const AdminSecurityTab: React.FC<AdminSecurityTabProps> = ({
  securityConfig,
  onUpdateSecurityConfig,
}) => {
  const { language, isRTL } = useLanguage();

  const PRESET_QUESTIONS = [
    language === 'ar' ? 'ما هو موقع فرع الصالون التأسيسي؟' : 'What is the founding branch location of Rozana Salon?',
    language === 'ar' ? 'ما هي كلمة المرور السرية لمشرفة الصالون؟' : 'What is your secret salon manager PIN or passphrase?',
    language === 'ar' ? 'ما هي سنة تأسيس فرع روزانة في الشميسي؟' : 'What was the year Rozana Salon Al Shumaisi was established?',
    language === 'ar' ? 'ما هو اسم أول خبيرة تجميل في الصالون؟' : 'What is the name of your first master aesthetician?',
    language === 'ar' ? 'سؤال مخصص آخر...' : 'Custom Security Question...'
  ];

  // Form States
  const [email, setEmail] = useState(securityConfig.email);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [selectedQuestion, setSelectedQuestion] = useState(securityConfig.recoveryQuestion);
  const [customQuestion, setCustomQuestion] = useState('');
  const [recoveryAnswer, setRecoveryAnswer] = useState(securityConfig.recoveryAnswer);

  const [showPassword, setShowPassword] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const isCustomQuestion = !PRESET_QUESTIONS.slice(0, 4).includes(selectedQuestion);

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    setStatusMessage(null);

    // Validate email
    if (!email.trim() || !email.includes('@')) {
      setStatusMessage({
        type: 'error',
        text: language === 'ar' ? 'الرجاء إدخال بريد إلكتروني صحيح' : 'Please enter a valid email address'
      });
      return;
    }

    // Validate password if user wants to change it
    let finalPassword = securityConfig.password;
    if (newPassword.trim()) {
      if (newPassword.length < 6) {
        setStatusMessage({
          type: 'error',
          text: language === 'ar' ? 'كلمة المرور يجب أن تكون ٦ خانات على الأقل' : 'Password must be at least 6 characters'
        });
        return;
      }
      if (newPassword !== confirmPassword) {
        setStatusMessage({
          type: 'error',
          text: language === 'ar' ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match'
        });
        return;
      }
      finalPassword = newPassword;
    }

    // Validate recovery question & answer
    const finalQuestion = isCustomQuestion ? customQuestion.trim() : selectedQuestion;
    if (!finalQuestion) {
      setStatusMessage({
        type: 'error',
        text: language === 'ar' ? 'الرجاء تحديد أو كتابة سؤال الأمان' : 'Please specify a security question'
      });
      return;
    }

    if (!recoveryAnswer.trim()) {
      setStatusMessage({
        type: 'error',
        text: language === 'ar' ? 'الرجاء إدخال إجابة سؤال الأمان' : 'Please provide the answer to your security question'
      });
      return;
    }

    const updatedConfig: AdminSecurityConfig = {
      email: email.trim().toLowerCase(),
      password: finalPassword,
      recoveryQuestion: finalQuestion,
      recoveryAnswer: recoveryAnswer.trim(),
      lastUpdated: new Date().toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    };

    onUpdateSecurityConfig(updatedConfig);
    setNewPassword('');
    setConfirmPassword('');
    setStatusMessage({
      type: 'success',
      text: language === 'ar' 
        ? 'تم حفظ إعدادات الأمان وسؤال الاسترداد بنجاح! تم تأمين الحساب كلياً.' 
        : 'Security settings & recovery credentials updated successfully! Access is secured.'
    });
  };

  return (
    <div className="space-y-8 text-start animate-in fade-in duration-300">
      {/* Top Banner */}
      <div className="rounded-3xl bg-gradient-to-r from-[#17140E] via-[#1F1910] to-[#17140E] border border-[#D4AF37]/40 p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#0E0C09] border border-[#D4AF37]/50 flex items-center justify-center text-[#E5C378] shadow-md shrink-0">
            <ShieldCheck className="w-7 h-7 text-[#E5C378]" />
          </div>
          <div>
            <h2 className="font-playfair text-2xl font-bold text-[#F8F5EE]">
              {language === 'ar' ? 'نظام الحماية والتحكم في بيانات الدخول' : 'Admin Security & Access Controls'}
            </h2>
            <p className="font-tajawal text-xs sm:text-sm text-[#A89F91] mt-1">
              {language === 'ar'
                ? 'خصصي بريد الإدارة، كلمة المرور، وسؤال الأمان السري لاستعادة الحساب عند النسيان لمنع أي دخول غير مصرح به.'
                : 'Configure administrative email, password, and disaster recovery secret questions to prevent unauthorized access.'}
            </p>
          </div>
        </div>

        <div className="px-4 py-2.5 rounded-2xl bg-[#0E0C09]/80 border border-white/10 text-xs font-mono text-[#E5C378] flex items-center gap-2 shrink-0">
          <Clock className="w-4 h-4 text-[#C59D4A]" />
          <span>{language === 'ar' ? 'آخر تحديث:' : 'Last Updated:'} {securityConfig.lastUpdated || 'Active'}</span>
        </div>
      </div>

      {/* Status feedback */}
      {statusMessage && (
        <div className={`p-4 rounded-2xl border flex items-center gap-3 animate-in fade-in ${
          statusMessage.type === 'success'
            ? 'bg-emerald-950/70 border-emerald-500/40 text-emerald-200'
            : 'bg-red-950/70 border-red-500/40 text-red-200'
        }`}>
          {statusMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
          )}
          <span className="font-tajawal text-sm font-medium">{statusMessage.text}</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSaveSecurity} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Card 1: Credentials (Email & Password) */}
        <div className="rounded-3xl bg-[#13110C] border border-white/10 p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-white/10">
            <Lock className="w-5 h-5 text-[#E5C378]" />
            <div>
              <h3 className="font-playfair text-lg font-bold text-[#F8F5EE]">
                {language === 'ar' ? 'بيانات تسجيل الدخول' : 'Admin Login Credentials'}
              </h3>
              <span className="text-xs font-tajawal text-[#8C8477]">
                {language === 'ar' ? 'البريد وكلمة المرور المطلوبة للدخول' : 'Primary credentials required at sign-in'}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] uppercase tracking-wider mb-2">
              {language === 'ar' ? 'البريد الإلكتروني للإدارة' : 'Admin Email Address'}
            </label>
            <div className="relative">
              <input
                id="admin-security-email-input"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#18150F] border border-white/10 text-[#F8F5EE] focus:border-[#E5C378] focus:ring-1 focus:ring-[#E5C378] outline-none font-mono text-sm"
              />
              <Mail className="w-4 h-4 text-[#777] absolute end-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div className="pt-2 border-t border-white/5">
            <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] uppercase tracking-wider mb-2">
              {language === 'ar' ? 'كلمة المرور الجديدة (اتركيها فارغة إذا لم ترغبي بالتغيير)' : 'New Password (leave blank to keep current)'}
            </label>
            <div className="relative mb-4">
              <input
                id="admin-security-new-password-input"
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder={language === 'ar' ? 'اكتبي كلمة مرور جديدة...' : 'Enter new password...'}
                className="w-full px-4 py-3 rounded-xl bg-[#18150F] border border-white/10 text-[#F8F5EE] focus:border-[#E5C378] focus:ring-1 focus:ring-[#E5C378] outline-none font-mono text-sm pe-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-[#888] hover:text-[#E5C378] p-1"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>

            {newPassword && (
              <div>
                <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] uppercase tracking-wider mb-2">
                  {language === 'ar' ? 'تأكيد كلمة المرور الجديدة' : 'Confirm New Password'}
                </label>
                <input
                  id="admin-security-confirm-password-input"
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder={language === 'ar' ? 'أعيدي كتابة كلمة المرور...' : 'Re-type new password...'}
                  className="w-full px-4 py-3 rounded-xl bg-[#18150F] border border-white/10 text-[#F8F5EE] focus:border-[#E5C378] focus:ring-1 focus:ring-[#E5C378] outline-none font-mono text-sm"
                />
              </div>
            )}
          </div>
        </div>

        {/* Card 2: Security Recovery Question & Answer */}
        <div className="rounded-3xl bg-[#13110C] border border-white/10 p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-white/10">
            <HelpCircle className="w-5 h-5 text-[#E5C378]" />
            <div>
              <h3 className="font-playfair text-lg font-bold text-[#F8F5EE]">
                {language === 'ar' ? 'سؤال الأمان للاسترداد عند النسيان' : 'Disaster Recovery Security Question'}
              </h3>
              <span className="text-xs font-tajawal text-[#8C8477]">
                {language === 'ar' ? 'يستخدم لاستعادة الحساب وإعادة تعيين كلمة المرور فوراً' : 'Used on login screen if password is forgotten'}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] uppercase tracking-wider mb-2">
              {language === 'ar' ? 'اختيار سؤال الأمان' : 'Select Security Question'}
            </label>
            <select
              value={isCustomQuestion ? PRESET_QUESTIONS[4] : selectedQuestion}
              onChange={(e) => {
                const val = e.target.value;
                if (val === PRESET_QUESTIONS[4]) {
                  setSelectedQuestion(val);
                } else {
                  setSelectedQuestion(val);
                  setCustomQuestion('');
                }
              }}
              className="w-full px-4 py-3 rounded-xl bg-[#18150F] border border-white/10 text-[#F8F5EE] focus:border-[#E5C378] focus:ring-1 focus:ring-[#E5C378] outline-none font-tajawal text-sm"
            >
              {PRESET_QUESTIONS.map((q, idx) => (
                <option key={idx} value={q} className="bg-[#18150F] text-[#F8F5EE]">
                  {q}
                </option>
              ))}
            </select>
          </div>

          {isCustomQuestion && (
            <div>
              <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] uppercase tracking-wider mb-2">
                {language === 'ar' ? 'اكتبي سؤال الأمان المخصص' : 'Write Custom Question'}
              </label>
              <input
                type="text"
                required
                value={customQuestion || (selectedQuestion !== PRESET_QUESTIONS[4] ? selectedQuestion : '')}
                onChange={(e) => setCustomQuestion(e.target.value)}
                placeholder={language === 'ar' ? 'مثال: ما هو الرمز السري للإدارة؟' : 'e.g. What is our secret salon passcode?'}
                className="w-full px-4 py-3 rounded-xl bg-[#18150F] border border-white/10 text-[#F8F5EE] focus:border-[#E5C378] focus:ring-1 focus:ring-[#E5C378] outline-none font-tajawal text-sm"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] uppercase tracking-wider mb-2">
              {language === 'ar' ? 'إجابة سؤال الأمان السرية' : 'Secret Security Answer'}
            </label>
            <div className="relative">
              <input
                id="admin-security-answer-input"
                type={showAnswer ? 'text' : 'password'}
                required
                value={recoveryAnswer}
                onChange={(e) => setRecoveryAnswer(e.target.value)}
                placeholder={language === 'ar' ? 'اكتبي الإجابة السرية...' : 'Type secret answer...'}
                className="w-full px-4 py-3 rounded-xl bg-[#18150F] border border-white/10 text-[#F8F5EE] focus:border-[#E5C378] focus:ring-1 focus:ring-[#E5C378] outline-none font-tajawal text-sm pe-10"
              />
              <button
                type="button"
                onClick={() => setShowAnswer(!showAnswer)}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-[#888] hover:text-[#E5C378] p-1"
              >
                {showAnswer ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <span className="text-[11px] font-tajawal text-[#8C8477] mt-1.5 block">
              {language === 'ar'
                ? 'ملاحظة: التحقق غير حساس لحالة الأحرف (case-insensitive) لضمان سهولة الاسترداد عند الحاجة.'
                : 'Note: Recovery matching is case-insensitive and trims extra whitespace for convenience.'}
            </span>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="lg:col-span-2 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-3xl bg-[#18150F] border border-[#D4AF37]/30">
          <div className="flex items-center gap-3">
            <Sparkles className="w-5 h-5 text-[#E5C378] shrink-0" />
            <p className="font-tajawal text-xs text-[#A89F91]">
              {language === 'ar'
                ? 'يتم تطبيق بيانات الأمان فوراً وحفظها في التخزين الآمن، ولن يُسمح بأي وصول عشوائي بدونها.'
                : 'Credentials take effect immediately. Random unauthorized access attempts will be rejected.'}
            </p>
          </div>

          <button
            id="admin-save-security-btn"
            type="submit"
            className="w-full sm:w-auto px-8 py-3.5 rounded-full luxe-gold-btn text-xs font-tajawal font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg shrink-0"
          >
            <Save className="w-4 h-4" />
            <span>{language === 'ar' ? 'حفظ إعدادات الأمان' : 'Save Security Settings'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
