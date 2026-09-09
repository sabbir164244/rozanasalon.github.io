import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Shield, Lock, Mail, Sparkles, ArrowRight, ArrowLeft, KeyRound } from 'lucide-react';

interface AdminLoginProps {
  onSuccessLogin: () => void;
  onCancel: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onSuccessLogin, onCancel }) => {
  const { language, isRTL, t } = useLanguage();
  const [email, setEmail] = useState('admin@rozanasalon.sa');
  const [password, setPassword] = useState('rozana2026');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError(language === 'ar' ? 'الرجاء إدخال البريد وكلمة المرور' : 'Please enter email and password');
      return;
    }
    onSuccessLogin();
  };

  const handleDemoLogin = () => {
    setEmail('manager@rozanasalon.sa');
    setPassword('rozana-shumaisi-vip');
    onSuccessLogin();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-3xl bg-[#12100C] border border-[#D4AF37]/40 p-6 sm:p-8 shadow-2xl text-start">
        {/* Glow ambient */}
        <div className="absolute top-0 right-1/2 translate-x-1/2 w-48 h-48 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none" />

        {/* Top close */}
        <button
          onClick={onCancel}
          className="absolute top-5 end-5 w-8 h-8 rounded-full bg-[#1F1A11] text-[#A89F91] hover:text-white flex items-center justify-center text-sm transition-colors cursor-pointer"
        >
          ✕
        </button>

        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#1E1911] to-[#2E2415] border border-[#D4AF37]/50 flex items-center justify-center shadow-[0_0_20px_rgba(229,195,120,0.2)] mb-3">
            <Shield className="w-7 h-7 text-[#E5C378]" />
          </div>
          <h2 className="font-playfair text-2xl font-bold text-[#F8F5EE]">
            {t('admin.loginTitle')}
          </h2>
          <p className="font-tajawal text-xs text-[#A89F91] mt-1 max-w-xs">
            {t('admin.loginSub')}
          </p>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-red-950/60 border border-red-500/30 text-red-300 text-xs font-tajawal">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] uppercase tracking-wider mb-1.5">
              {t('admin.email')}
            </label>
            <div className="relative">
              <input
                id="admin-email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#17140E] border border-white/10 text-[#F8F5EE] focus:border-[#E5C378] focus:ring-1 focus:ring-[#E5C378] outline-none font-mono text-sm"
              />
              <Mail className="w-4 h-4 text-[#777] absolute end-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <div>
            <label className="block text-xs font-tajawal font-bold text-[#D2C8BA] uppercase tracking-wider mb-1.5">
              {t('admin.password')}
            </label>
            <div className="relative">
              <input
                id="admin-password-input"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#17140E] border border-white/10 text-[#F8F5EE] focus:border-[#E5C378] focus:ring-1 focus:ring-[#E5C378] outline-none font-mono text-sm"
              />
              <Lock className="w-4 h-4 text-[#777] absolute end-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          <button
            id="admin-submit-login-btn"
            type="submit"
            className="w-full py-3.5 rounded-full luxe-gold-btn text-xs font-tajawal font-bold flex items-center justify-center gap-2 cursor-pointer shadow-lg mt-2"
          >
            <span>{t('admin.loginBtn')}</span>
            {isRTL ? <ArrowLeft className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {/* Demo Fast Login */}
        <div className="mt-6 pt-4 border-t border-white/10 text-center">
          <button
            onClick={handleDemoLogin}
            className="text-xs font-tajawal text-[#E5C378] hover:underline flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>{language === 'ar' ? 'دخول سريع للتجربة (تجريبي بنقرة واحدة)' : '1-Click Fast Demo Login'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
