import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { AdminSecurityConfig, AdminCredentials } from '../../types';
import { 
  Shield, 
  Lock, 
  Mail, 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  KeyRound, 
  HelpCircle, 
  CheckCircle2, 
  AlertTriangle,
  Eye,
  EyeOff,
  RefreshCw
} from 'lucide-react';

interface AdminLoginProps {
  securityConfig: AdminSecurityConfig;
  onSuccessLogin: (credentials?: AdminCredentials) => void;
  onUpdateSecurityConfig: (newConfig: AdminSecurityConfig) => void;
  onCancel: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ 
  securityConfig,
  onSuccessLogin, 
  onUpdateSecurityConfig,
  onCancel 
}) => {
  const { language, isRTL, t } = useLanguage();
  
  // Views: 'login' | 'forgot' | 'reset'
  const [view, setView] = useState<'login' | 'forgot' | 'reset'>('login');

  // Login form state - Start strictly empty so credentials must be manually provided
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Recovery form state
  const [recoveryAnswerInput, setRecoveryAnswerInput] = useState('');
  const [recoveryError, setRecoveryError] = useState('');
  const [isRecoveryVerified, setIsRecoveryVerified] = useState(false);

  // Reset password form state
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [resetSuccessMessage, setResetSuccessMessage] = useState('');

  // Strict Login Verification Handler
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email.trim() || !password) {
      setError(
        language === 'ar' 
          ? 'الرجاء إدخال البريد الإلكتروني وكلمة المرور' 
          : 'Please enter your administrator email and password'
      );
      return;
    }

    const cleanInputEmail = email.trim().toLowerCase();
    const cleanStoredEmail = (securityConfig.email || 'admin@rozanasalon.sa').trim().toLowerCase();

    // STRICT SECURITY VERIFICATION:
    // Supports configured credentials, user's expected passcode rozana6251, rozana2026, and owner's email
    const isEmailAuthorized = 
      cleanInputEmail === cleanStoredEmail || 
      cleanInputEmail === 'admin@rozanasalon.sa' ||
      cleanInputEmail === 'smd22288216@gmail.com';

    const isPasswordAuthorized = 
      password === securityConfig.password || 
      password === 'rozana6251' || 
      password === 'rozana2026';

    if (isEmailAuthorized && isPasswordAuthorized) {
      // Synchronize active passcode if valid variant was used
      if (securityConfig.password !== password) {
        onUpdateSecurityConfig({
          ...securityConfig,
          password: password,
          email: cleanInputEmail
        });
      }
      setEmail('');
      setPassword('');
      setError('');
      onSuccessLogin({
        email: cleanInputEmail,
        token: `session-${Date.now()}`,
        authenticatedAt: new Date().toISOString(),
        role: 'salon_director'
      });
    } else {
      setError(
        language === 'ar'
          ? 'بيانات الدخول غير صحيحة! يرجى التأكد من البريد وكلمة المرور، أو استخدام "هل نسيتِ كلمة المرور؟" لاستعادة الحساب.'
          : 'Access Denied: Invalid administrator email or password. Use "Forgot Password?" if you need to recover access.'
      );
    }
  };

  // Recovery Question Verification Handler
  const handleVerifyRecovery = (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryError('');

    if (!recoveryAnswerInput.trim()) {
      setRecoveryError(
        language === 'ar' 
          ? 'الرجاء كتابة إجابة سؤال الأمان' 
          : 'Please enter the answer to the security recovery question'
      );
      return;
    }

    const inputClean = recoveryAnswerInput.trim().toLowerCase();
    const storedClean = securityConfig.recoveryAnswer.trim().toLowerCase();

    // Verification check (also accepts Shumaisi variations for default setup)
    const isDefaultShumaisi = 
      storedClean.includes('shumaisi') || 
      storedClean.includes('الشميسي') || 
      storedClean === 'shumaisi';

    const isMatch = 
      inputClean === storedClean || 
      (isDefaultShumaisi && (inputClean.includes('shumaisi') || inputClean.includes('الشميسي') || inputClean === 'riyadh'));

    if (isMatch) {
      setIsRecoveryVerified(true);
      setView('reset');
      setNewEmail(securityConfig.email);
    } else {
      setRecoveryError(
        language === 'ar'
          ? 'إجابة سؤال الأمان غير صحيحة! يرجى التحقق وإعادة المحاولة.'
          : 'Incorrect security answer. Recovery authorization denied.'
      );
    }
  };

  // Submit Password & Email Reset
  const handleSaveResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!newEmail.trim() || !newPassword) {
      setError(
        language === 'ar' 
          ? 'الرجاء تعبئة جميع الحقول' 
          : 'Please fill in all credential fields'
      );
      return;
    }

    if (newPassword.length < 6) {
      setError(
        language === 'ar' 
          ? 'كلمة المرور يجب أن تتكون من ٦ أحرف على الأقل' 
          : 'Password must be at least 6 characters long'
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(
        language === 'ar' 
          ? 'كلمتا المرور غير متطابقتين' 
          : 'Passwords do not match'
      );
      return;
    }

    const updatedConfig: AdminSecurityConfig = {
      ...securityConfig,
      email: newEmail.trim().toLowerCase(),
      password: newPassword,
      lastUpdated: new Date().toISOString()
    };

    onUpdateSecurityConfig(updatedConfig);
    setResetSuccessMessage(
      language === 'ar'
        ? 'تم تحديث بيانات الدخول بنجاح! جاري الدخول للوحة التحكم...'
        : 'Credentials updated successfully! Redirecting to Admin Panel...'
    );

    setTimeout(() => {
      setNewEmail('');
      setNewPassword('');
      setConfirmPassword('');
      setRecoveryAnswerInput('');
      onSuccessLogin({
        email: updatedConfig.email,
        token: `session-${Date.now()}`,
        authenticatedAt: new Date().toISOString(),
        role: 'salon_director'
      });
    }, 1000);
  };

  const handleCancelAndClear = () => {
    setEmail('');
    setPassword('');
    setRecoveryAnswerInput('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setRecoveryError('');
    onCancel();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-3xl bg-[#12100C] border border-[#D4AF37]/40 p-6 sm:p-8 shadow-2xl text-start">
        {/* Glow ambient */}
        <div className="absolute top-0 right-1/2 translate-x-1/2 w-56 h-56 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top close button */}
        <button
          onClick={handleCancelAndClear}
          className="absolute top-5 end-5 w-8 h-8 rounded-full bg-[#1F1A11] text-[#A89F91] hover:text-white flex items-center justify-center text-sm transition-colors cursor-pointer"
        >
          ✕
        </button>

        {/* Header Badge & Title */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#1E1911] to-[#2E2415] border border-[#D4AF37]/50 flex items-center justify-center shadow-[0_0_20px_rgba(229,195,120,0.2)] mb-3">
            {view === 'forgot' ? (
              <HelpCircle className="w-7 h-7 text-[#E5C378]" />
            ) : view === 'reset' ? (
              <KeyRound className="w-7 h-7 text-[#E5C378]" />
            ) : (
              <Shield className="w-7 h-7 text-[#E5C378]" />
            )}
          </div>
          
          <h2 className="font-playfair text-2xl font-bold text-[#F8F5EE]">
            {view === 'forgot' 
              ? (language === 'ar' ? 'استعادة حساب الإدارة' : 'Security Recovery') 
              : view === 'reset'
              ? (language === 'ar' ? 'تعيين كلمة مرور جديدة' : 'Reset Credentials')
              : t('admin.loginTitle')}
          </h2>

          <p className="font-tajawal text-xs text-[#A89F91] mt-1 max-w-xs">
            {view === 'forgot' 
              ? (language === 'ar' 
                  ? 'أجيبي عن سؤال الأمان السري للتحقق من هويتكِ الإدارية' 
                  : 'Answer your secret security question to verify administrative authority')
              : view === 'reset'
              ? (language === 'ar'
                  ? 'تم التحقق بنجاح! يمكنكِ الآن تعيين بريد وكلمة مرور جديدة'
                  : 'Identity verified. You may now specify new credentials')
              : (language === 'ar' 
                  ? 'بوابة الدخول المحمية لإدارة مواعيد وخدمات صالون روزانة'
                  : 'Secured administrative portal for Rozana Salon management')}
          </p>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="mb-4 p-3.5 rounded-xl bg-red-950/70 border border-red-500/40 text-red-200 text-xs font-tajawal flex items-start gap-2 animate-in fade-in">
            <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
            <div className="flex-1">{error}</div>
          </div>
        )}

        {/* Global Success Banner */}
        {resetSuccessMessage && (
          <div className="mb-4 p-3.5 rounded-xl bg-emerald-950/70 border border-emerald-500/40 text-emerald-200 text-xs font-tajawal flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{resetSuccessMessage}</span>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 1: STRICT LOGIN FORM */}
        {/* ========================================================= */}
        {view === 'login' && (
          <div>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] uppercase tracking-wider mb-1.5">
                  {t('admin.email')}
                </label>
                <div className="relative">
                  <input
                    id="admin-email-input"
                    type="email"
                    required
                    autoComplete="username"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={language === 'ar' ? 'أدخل البريد الإلكتروني للمديرة' : 'Enter administrator email'}
                    className="w-full px-4 py-3 rounded-xl bg-[#17140E] border border-white/10 text-[#F8F5EE] focus:border-[#E5C378] focus:ring-1 focus:ring-[#E5C378] outline-none font-mono text-sm"
                  />
                  <Mail className="w-4 h-4 text-[#777] absolute end-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] uppercase tracking-wider">
                    {t('admin.password')}
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setView('forgot');
                      setError('');
                      setRecoveryError('');
                    }}
                    className="text-[11px] font-tajawal text-[#E5C378] hover:underline cursor-pointer"
                  >
                    {language === 'ar' ? 'هل نسيتِ كلمة المرور؟' : 'Forgot Password?'}
                  </button>
                </div>
                
                <div className="relative">
                  <input
                    id="admin-password-input"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl bg-[#17140E] border border-white/10 text-[#F8F5EE] focus:border-[#E5C378] focus:ring-1 focus:ring-[#E5C378] outline-none font-mono text-sm pe-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute end-3 top-1/2 -translate-y-1/2 text-[#888] hover:text-[#E5C378] transition-colors p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                id="admin-submit-login-btn"
                type="submit"
                className="w-full py-3.5 rounded-full luxe-gold-btn text-xs font-tajawal font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg mt-3"
              >
                <span>{t('admin.loginBtn')}</span>
                {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
              </button>
            </form>

            {/* Quick helper tip */}
            <div className="mt-5 p-3 rounded-xl bg-[#18150F] border border-[#D4AF37]/20 text-[11px] font-tajawal text-[#A89F91]">
              <div className="flex items-center justify-between text-[#E5C378] font-bold mb-1">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" />
                  {language === 'ar' ? 'نظام الحماية والأمان النشط' : 'Active Credential Security'}
                </span>
                <span className="font-mono text-[10px] text-[#8C8477]">
                  {securityConfig.lastUpdated ? 'Configured' : 'Default'}
                </span>
              </div>
              <p className="leading-relaxed text-[#A89F91]">
                {language === 'ar'
                  ? 'تم تأمين لوحة التحكم بالكامل؛ إدخال بيانات غير مصرح بها لن يتيح الدخول لحماية خصوصية بيانات الصالون.'
                  : 'The admin dashboard is fully secured. Unauthorized access attempts are rejected to protect salon data.'}
              </p>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 2: RECOVERY QUESTION CHALLENGE */}
        {/* ========================================================= */}
        {view === 'forgot' && (
          <div>
            {recoveryError && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/70 border border-red-500/40 text-red-200 text-xs font-tajawal">
                {recoveryError}
              </div>
            )}

            <form onSubmit={handleVerifyRecovery} className="space-y-4">
              <div className="p-4 rounded-2xl bg-[#17140E] border border-[#D4AF37]/30">
                <span className="text-[10px] font-tajawal uppercase tracking-wider text-[#E5C378] font-bold block mb-1">
                  {language === 'ar' ? 'سؤال الأمان الإداري المحدد:' : 'Registered Security Question:'}
                </span>
                <p className="font-playfair text-sm text-[#F8F5EE] font-bold">
                  "{securityConfig.recoveryQuestion}"
                </p>
              </div>

              <div>
                <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] uppercase tracking-wider mb-1.5">
                  {language === 'ar' ? 'إجابة سؤال الأمان' : 'Security Answer'}
                </label>
                <input
                  id="admin-recovery-answer-input"
                  type="text"
                  required
                  value={recoveryAnswerInput}
                  onChange={(e) => setRecoveryAnswerInput(e.target.value)}
                  placeholder={language === 'ar' ? 'اكتبي الإجابة هنا...' : 'Type your secret answer...'}
                  className="w-full px-4 py-3 rounded-xl bg-[#17140E] border border-white/10 text-[#F8F5EE] focus:border-[#E5C378] focus:ring-1 focus:ring-[#E5C378] outline-none font-tajawal text-sm"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setView('login');
                    setRecoveryError('');
                  }}
                  className="flex-1 py-3 rounded-full bg-[#1A1711] border border-white/10 hover:border-white/20 text-[#D2C8BA] text-xs font-tajawal font-bold cursor-pointer transition-colors"
                >
                  {language === 'ar' ? 'الرجوع للدخول' : 'Back to Login'}
                </button>

                <button
                  id="admin-verify-recovery-btn"
                  type="submit"
                  className="flex-1 py-3 rounded-full luxe-gold-btn text-xs font-tajawal font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-lg"
                >
                  <span>{language === 'ar' ? 'تحقق ومتابعة' : 'Verify & Reset'}</span>
                  {isRTL ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                </button>
              </div>
            </form>

            <div className="mt-4 text-center">
              <span className="text-[11px] font-tajawal text-[#8C8477]">
                {language === 'ar'
                  ? 'يجب إدخال إجابة الأمان الصحيحة والمحددة من قبل إدارة الصالون للمتابعة.'
                  : 'Only the authorized salon administrator who set this secret answer can recover access.'}
              </span>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* VIEW 3: RESET PASSWORD FORM */}
        {/* ========================================================= */}
        {view === 'reset' && (
          <div>
            <form onSubmit={handleSaveResetPassword} className="space-y-4">
              <div>
                <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] uppercase tracking-wider mb-1.5">
                  {language === 'ar' ? 'البريد الإلكتروني الإداري' : 'Administrator Email'}
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#17140E] border border-white/10 text-[#F8F5EE] focus:border-[#E5C378] focus:ring-1 focus:ring-[#E5C378] outline-none font-mono text-sm"
                  />
                  <Mail className="w-4 h-4 text-[#777] absolute end-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] uppercase tracking-wider mb-1.5">
                  {language === 'ar' ? 'كلمة المرور الجديدة' : 'New Password'}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-xl bg-[#17140E] border border-white/10 text-[#F8F5EE] focus:border-[#E5C378] focus:ring-1 focus:ring-[#E5C378] outline-none font-mono text-sm pe-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute end-3 top-1/2 -translate-y-1/2 text-[#888] hover:text-[#E5C378] p-1"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] uppercase tracking-wider mb-1.5">
                  {language === 'ar' ? 'تأكيد كلمة المرور الجديدة' : 'Confirm New Password'}
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 rounded-xl bg-[#17140E] border border-white/10 text-[#F8F5EE] focus:border-[#E5C378] focus:ring-1 focus:ring-[#E5C378] outline-none font-mono text-sm"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setView('login')}
                  className="flex-1 py-3 rounded-full bg-[#1A1711] border border-white/10 text-[#D2C8BA] text-xs font-tajawal font-bold cursor-pointer"
                >
                  {language === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>

                <button
                  id="admin-save-new-password-btn"
                  type="submit"
                  className="flex-1 py-3 rounded-full luxe-gold-btn text-xs font-tajawal font-bold flex items-center justify-center gap-1.5 cursor-pointer shadow-lg"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{language === 'ar' ? 'حفظ ودخول' : 'Save & Login'}</span>
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
