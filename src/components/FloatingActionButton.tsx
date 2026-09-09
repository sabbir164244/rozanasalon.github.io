import React from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Calendar, Sparkles } from 'lucide-react';

interface FloatingActionButtonProps {
  onBookClick: () => void;
  visible: boolean;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({
  onBookClick,
  visible,
}) => {
  const { language } = useLanguage();

  if (!visible) return null;

  return (
    <div className="fixed bottom-6 end-6 z-40 animate-in fade-in slide-in-from-bottom-6 duration-300">
      <button
        id="global-floating-action-book-btn"
        onClick={onBookClick}
        className="group relative flex items-center gap-3 px-5 py-3.5 rounded-full luxe-gold-btn text-[#0E0C09] font-tajawal font-bold text-sm sm:text-base shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
        title="Book Appointment Now - Rozana Salon"
      >
        <div className="w-7 h-7 rounded-full bg-[#0E0C09] flex items-center justify-center text-[#E5C378] shrink-0 shadow">
          <Calendar className="w-3.5 h-3.5" />
        </div>

        <span className="whitespace-nowrap font-bold tracking-wide">
          {language === 'ar' ? 'احجزي جلستكِ الملكية' : 'Book VIP Treatment'}
        </span>

        <Sparkles className="w-4 h-4 text-[#0E0C09] group-hover:rotate-45 transition-transform" />
      </button>
    </div>
  );
};
