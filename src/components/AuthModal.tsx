import React, { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { 
  User, 
  Mail, 
  Lock, 
  Phone, 
  Sparkles, 
  X, 
  CheckCircle2, 
  AlertCircle, 
  LogOut, 
  Award, 
  Calendar,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'signin' | 'signup';
  onNavigateToBooking?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultMode = 'signin',
  onNavigateToBooking
}) => {
  const { language, isRTL } = useLanguage();
  const { 
    currentUser, 
    userProfile, 
    signInEmail, 
    signUpEmail, 
    signInGoogle, 
    logOut 
  } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setPhone('');
    setError('');
    setSuccessMsg('');
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError(language === 'ar' ? 'يرجى إدخال البريد الإلكتروني وكلمة المرور' : 'Please enter email and password');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await signInEmail(email.trim(), password);
      setSuccessMsg(language === 'ar' ? 'تم تسجيل الدخول بنجاح! أهلاً بك في روزانة' : 'Welcome back to Rozana Luxury Salon!');
      setTimeout(() => {
        handleClose();
      }, 1200);
    } catch (err: any) {
      console.error('Sign in error:', err);
      let msg = language === 'ar' ? 'فشل تسجيل الدخول. تأكدي من صحة البيانات.' : 'Login failed. Please check your credentials.';
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        msg = language === 'ar' ? 'البريد أو كلمة المرور غير صحيحة.' : 'Invalid email or password.';
      } else if (err.code === 'auth/too-many-requests') {
        msg = language === 'ar' ? 'محاولات كثيرة خاطئة، يرجى المحاولة لاحقاً.' : 'Too many failed attempts. Try again later.';
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || !name) {
      setError(language === 'ar' ? 'يرجى ملء جميع الحقول المطلوبة' : 'Please fill all required fields');
      return;
    }
    if (password.length < 6) {
      setError(language === 'ar' ? 'كلمة المرور يجب أن لا تقل عن 6 أحرف' : 'Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await signUpEmail(email.trim(), password, name.trim(), phone.trim());
      setSuccessMsg(language === 'ar' ? 'تم إنشاء الحساب بنجاح وإضافة 150 نقطة ولاء مجانية!' : 'Account created! 150 welcome VIP loyalty points added.');
      setTimeout(() => {
        handleClose();
      }, 1500);
    } catch (err: any) {
      console.error('Sign up error:', err);
      let msg = language === 'ar' ? 'فشل إنشاء الحساب، يرجى المحاولة مجدداً.' : 'Failed to create account. Please try again.';
      if (err.code === 'auth/email-already-in-use') {
        msg = language === 'ar' ? 'هذا البريد الإلكتروني مسجل مسبقاً. تفضلي بتسجيل الدخول.' : 'Email is already registered. Please sign in instead.';
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      await signInGoogle();
      setSuccessMsg(language === 'ar' ? 'تم تسجيل الدخول بواسطة جوجل بنجاح!' : 'Signed in with Google successfully!');
      setTimeout(() => {
        handleClose();
      }, 1200);
    } catch (err: any) {
      if (err?.code === 'auth/popup-closed-by-user' || err?.message?.includes('popup-closed-by-user') || err?.code === 'auth/cancelled-popup-request') {
        // User closed the popup window voluntarily, not an error
        return;
      }
      console.warn('Google Sign In error:', err);
      
      const errorCode = err?.code || '';
      if (errorCode === 'auth/unauthorized-domain') {
        const currentHost = window.location.hostname || 'your domain';
        setError(
          language === 'ar'
            ? `النطاق (${currentHost}) غير مضاف في قائمة النطاقات المصرح بها (Authorized Domains) في Firebase Console. يمكنكِ التسجيل بالبريد وكلمة المرور أدناه فوراً دون أي قيود!`
            : `Domain "${currentHost}" is not authorized in Firebase Console > Authentication > Settings > Authorized Domains. You can sign in or sign up with Email & Password below instantly!`
        );
      } else if (errorCode === 'auth/popup-blocked') {
        setError(
          language === 'ar'
            ? 'تم حظر نافذة جوجل المنبثقة من قبل حماية المتصفح (Brave Shields أو مانع النوافذ). يرجى السماح بالنوافذ أو تسجيل الدخول بالبريد أدناه.'
            : 'Google popup was blocked by browser shields (e.g. Brave Shields). Please allow popups or use Email login below.'
        );
      } else {
        setError(
          language === 'ar'
            ? `تعذر إتمام الدخول بواسطة جوجل (${errorCode || 'خطأ في المصادقة'}). يرجى استخدام البريد وكلمة المرور أدناه.`
            : `Google sign-in could not be completed (${errorCode || 'Auth error'}). Please use Email sign-in or sign-up below.`
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await logOut();
      handleClose();
    } catch (err) {
      console.error('Sign out error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        className="relative w-full max-w-md rounded-3xl bg-[#12100C] border border-[#D4AF37]/40 p-6 sm:p-8 shadow-2xl text-start overflow-hidden"
      >
        {/* Glow effect */}
        <div className="absolute top-0 end-0 w-48 h-48 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          id="auth-modal-close-btn"
          className="absolute top-5 end-5 w-8 h-8 rounded-full bg-[#1F1A11] text-[#A89F91] hover:text-white flex items-center justify-center text-sm transition-colors cursor-pointer z-10"
        >
          <X className="w-4 h-4" />
        </button>

        {/* LOGGED IN USER PROFILE CARD */}
        {currentUser ? (
          <div className="space-y-6 pt-2">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#D4AF37] to-[#8C7326] p-0.5 shadow-lg flex items-center justify-center">
                <div className="w-full h-full bg-[#1A1610] rounded-[14px] flex items-center justify-center text-[#E5C378]">
                  <User className="w-7 h-7" />
                </div>
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h3 className="text-lg font-bold text-[#F8F5EE] font-tajawal">
                    {userProfile?.displayName || currentUser.displayName || (language === 'ar' ? 'عميلة روزانة المميزة' : 'Rozana VIP Guest')}
                  </h3>
                  <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                </div>
                <p className="text-xs text-[#A89F91] font-mono">
                  {currentUser.email}
                </p>
              </div>
            </div>

            {/* VIP Loyalty Card */}
            <div className="rounded-2xl bg-gradient-to-r from-[#221B11] via-[#2D2416] to-[#1F1A11] border border-[#D4AF37]/30 p-4 shadow-inner">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-tajawal text-[#D2C8BA] flex items-center gap-1.5">
                  <Award className="w-4 h-4 text-[#E5C378]" />
                  {language === 'ar' ? 'رصيد نقاط الولاء الفاخرة' : 'VIP Loyalty Rewards'}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[#D4AF37]/20 text-[#E5C378] font-bold border border-[#D4AF37]/40">
                  {language === 'ar' ? 'عضوية بلاتينية' : 'Platinum Tier'}
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#E5C378] font-cinzel">
                  {userProfile?.loyaltyPoints || 150}
                </span>
                <span className="text-xs text-[#8C8477]">
                  {language === 'ar' ? 'نقطة جاهزة للخصم الفوري' : 'Points (Eligible for SAR discounts)'}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3">
              {onNavigateToBooking && (
                <button
                  onClick={() => {
                    handleClose();
                    onNavigateToBooking();
                  }}
                  id="auth-go-to-booking-btn"
                  className="w-full luxe-gold-btn py-3 rounded-xl font-tajawal font-bold text-sm flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <Calendar className="w-4 h-4" />
                  <span>{language === 'ar' ? 'حجز موعد جديد باسمي' : 'Book Appointment with My Profile'}</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              )}

              <button
                onClick={handleSignOut}
                disabled={loading}
                id="auth-logout-btn"
                className="w-full py-3 rounded-xl bg-red-950/30 hover:bg-red-900/50 border border-red-500/30 text-red-300 font-tajawal font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>{language === 'ar' ? 'تسجيل الخروج من الحساب' : 'Log Out of Account'}</span>
              </button>
            </div>
          </div>
        ) : (
          /* AUTHENTICATION TABS & FORMS (SIGN IN / SIGN UP) */
          <div>
            {/* Header */}
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#D4AF37]/10 border border-[#D4AF37]/30 text-[#E5C378] mb-3">
                <Sparkles className="w-6 h-6" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#F8F5EE] font-tajawal">
                {mode === 'signin' 
                  ? (language === 'ar' ? 'تسجيل الدخول إلى روزانة' : 'Sign In to Rozana Salon')
                  : (language === 'ar' ? 'إنشاء حساب عميلة جديدة' : 'Join Rozana Salon Privilege')}
              </h2>
              <p className="text-xs text-[#A89F91] mt-1 font-tajawal">
                {mode === 'signin'
                  ? (language === 'ar' ? 'تابعي حجوزاتك، واحصلي على نقاط الخصم الحصرية' : 'Manage bookings & enjoy instant VIP luxury loyalty perks')
                  : (language === 'ar' ? 'احصلي على 150 نقطة ترحيبية مجانية فور التسجيل' : 'Get 150 free welcome reward points instantly upon signup')}
              </p>
            </div>

            {/* Mode Switch Tabs */}
            <div className="grid grid-cols-2 p-1 rounded-xl bg-[#1A1610] border border-white/10 mb-5">
              <button
                type="button"
                onClick={() => { setMode('signin'); resetForm(); }}
                className={`py-2 text-xs font-tajawal font-bold rounded-lg transition-all cursor-pointer ${
                  mode === 'signin'
                    ? 'bg-[#D4AF37] text-black shadow-md'
                    : 'text-[#A89F91] hover:text-white'
                }`}
              >
                {language === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
              </button>
              <button
                type="button"
                onClick={() => { setMode('signup'); resetForm(); }}
                className={`py-2 text-xs font-tajawal font-bold rounded-lg transition-all cursor-pointer ${
                  mode === 'signup'
                    ? 'bg-[#D4AF37] text-black shadow-md'
                    : 'text-[#A89F91] hover:text-white'
                }`}
              >
                {language === 'ar' ? 'حساب جديد (نقاط ترحيبية)' : 'Sign Up (150 Pts)'}
              </button>
            </div>

            {/* Feedback Alerts */}
            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}
            {successMsg && (
              <div className="mb-4 p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <span>{successMsg}</span>
              </div>
            )}

            {/* FORM */}
            <form onSubmit={mode === 'signin' ? handleSignIn : handleSignUp} className="space-y-3.5">
              {mode === 'signup' && (
                <>
                  <div>
                    <label className="block text-xs font-tajawal text-[#D2C8BA] mb-1">
                      {language === 'ar' ? 'الاسم الكريم' : 'Full Name'} *
                    </label>
                    <div className="relative">
                      <User className="w-4 h-4 text-[#8C8477] absolute top-3.5 start-3.5" />
                      <input
                        id="auth-signup-name"
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder={language === 'ar' ? 'سارة محمد' : 'e.g. Sarah Miller'}
                        className="w-full bg-[#18150F] border border-white/10 focus:border-[#D4AF37] rounded-xl ps-10 pe-3 py-2.5 text-xs text-[#F8F5EE] placeholder-[#666] outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-tajawal text-[#D2C8BA] mb-1">
                      {language === 'ar' ? 'رقم الجوال (اختياري للتأكيد)' : 'Mobile Phone (Optional)'}
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-[#8C8477] absolute top-3.5 start-3.5" />
                      <input
                        id="auth-signup-phone"
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="050 xxx xxxx"
                        className="w-full bg-[#18150F] border border-white/10 focus:border-[#D4AF37] rounded-xl ps-10 pe-3 py-2.5 text-xs text-[#F8F5EE] placeholder-[#666] outline-none transition-colors"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-xs font-tajawal text-[#D2C8BA] mb-1">
                  {language === 'ar' ? 'البريد الإلكتروني' : 'Email Address'} *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8C8477] absolute top-3.5 start-3.5" />
                  <input
                    id="auth-email-input"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="client@example.com"
                    className="w-full bg-[#18150F] border border-white/10 focus:border-[#D4AF37] rounded-xl ps-10 pe-3 py-2.5 text-xs text-[#F8F5EE] placeholder-[#666] outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-tajawal text-[#D2C8BA] mb-1">
                  {language === 'ar' ? 'كلمة المرور' : 'Password'} *
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-[#8C8477] absolute top-3.5 start-3.5" />
                  <input
                    id="auth-password-input"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-[#18150F] border border-white/10 focus:border-[#D4AF37] rounded-xl ps-10 pe-3 py-2.5 text-xs text-[#F8F5EE] placeholder-[#666] outline-none transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                id="auth-submit-btn"
                className="w-full luxe-gold-btn py-3 rounded-xl font-tajawal font-bold text-xs tracking-wide flex items-center justify-center gap-2 cursor-pointer shadow-lg mt-4"
              >
                {loading ? (
                  <span className="inline-block w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>
                      {mode === 'signin' 
                        ? (language === 'ar' ? 'دخول فوري' : 'Sign In Now')
                        : (language === 'ar' ? 'تأكيد التسجيل ونيل النقاط' : 'Create Account & Claim 150 Pts')}
                    </span>
                  </>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-[10px] uppercase">
                <span className="bg-[#12100C] px-3 text-[#777] font-sans">
                  {language === 'ar' ? 'أو عبر' : 'Or with'}
                </span>
              </div>
            </div>

            {/* Google Quick Sign-In */}
            <button
              type="button"
              onClick={handleGoogleSignIn}
              disabled={loading}
              id="auth-google-btn"
              className="w-full py-2.5 rounded-xl bg-[#1A1610] hover:bg-[#251F16] border border-white/10 hover:border-[#D4AF37]/50 text-xs font-tajawal font-bold text-[#E5C378] flex items-center justify-center gap-2.5 transition-all cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
              </svg>
              <span>{language === 'ar' ? 'الدخول بحساب Google بنقرة واحدة' : 'Continue with Google'}</span>
            </button>

            <p className="mt-3 text-center text-[10px] text-[#8C8477] font-tajawal">
              {language === 'ar'
                ? '💡 يمكنكِ أيضاً إنشاء حساب بالبريد وكلمة المرور فوراً من تبويب (حساب جديد) أعلاه مع 150 نقطة ترحيبية.'
                : '💡 Tip: You can also create an account with any email & password via the "Sign Up (150 Pts)" tab above.'}
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};
