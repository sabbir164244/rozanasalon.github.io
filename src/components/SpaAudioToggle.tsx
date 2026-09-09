import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Volume2, VolumeX, Sparkles } from 'lucide-react';

export const SpaAudioToggle: React.FC = () => {
  const { language } = useLanguage();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const timerRef = useRef<number | null>(null);

  const startSpaSound = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;

      const ctx = new AudioCtx();
      audioCtxRef.current = ctx;

      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.04, ctx.currentTime); // very quiet, gentle ambient level
      masterGain.connect(ctx.destination);
      masterGainRef.current = masterGain;

      // Ambient warm drone chord (Root D3 = 146.83 Hz, A3 = 220 Hz, F#3 = 185 Hz)
      const frequencies = [146.83, 185.0, 220.0, 293.66];
      frequencies.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const gain = ctx.createGain();

        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(320, ctx.currentTime);

        gain.gain.setValueAtTime(0.02, ctx.currentTime);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(masterGain);

        osc.start();
      });

      // Occasional gentle chime (bell harmonic)
      const playChime = () => {
        if (!audioCtxRef.current || audioCtxRef.current.state === 'closed') return;
        const chimeOsc = ctx.createOscillator();
        const chimeGain = ctx.createGain();
        chimeOsc.type = 'sine';
        chimeOsc.frequency.setValueAtTime(880 + Math.random() * 220, ctx.currentTime); // A5

        chimeGain.gain.setValueAtTime(0.0001, ctx.currentTime);
        chimeGain.gain.exponentialRampToValueAtTime(0.03, ctx.currentTime + 0.1);
        chimeGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 3.5);

        chimeOsc.connect(chimeGain);
        chimeGain.connect(masterGain);

        chimeOsc.start();
        chimeOsc.stop(ctx.currentTime + 3.6);

        timerRef.current = window.setTimeout(playChime, 6000 + Math.random() * 4000);
      };

      playChime();
      setIsPlaying(true);
    } catch (e) {
      console.warn('Audio Context initialization error:', e);
    }
  };

  const stopSpaSound = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
      audioCtxRef.current.close().catch(() => {});
    }
    audioCtxRef.current = null;
    setIsPlaying(false);
  };

  const toggleSound = () => {
    if (isPlaying) {
      stopSpaSound();
    } else {
      startSpaSound();
    }
  };

  useEffect(() => {
    return () => {
      stopSpaSound();
    };
  }, []);

  return (
    <button
      id="spa-ambient-audio-toggle"
      onClick={toggleSound}
      title={isPlaying ? 'Mute Spa Ambiance' : 'Play Spa Relaxation Ambiance'}
      className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1A1710]/90 backdrop-blur-md border border-[#D4AF37]/30 hover:border-[#D4AF37]/60 text-[#E5C378] text-xs font-tajawal transition-all cursor-pointer shadow-md select-none"
    >
      {isPlaying ? (
        <>
          <Volume2 className="w-3.5 h-3.5 text-[#E5C378] animate-pulse" />
          <span className="hidden sm:inline">
            {language === 'ar' ? 'أجواء السبا الموسيقية تعمل' : 'Spa Ambiance On'}
          </span>
          <span className="flex gap-0.5 items-end h-3">
            <span className="w-0.5 bg-[#E5C378] h-2 animate-bounce" />
            <span className="w-0.5 bg-[#E5C378] h-3 animate-bounce [animation-delay:0.2s]" />
            <span className="w-0.5 bg-[#E5C378] h-1.5 animate-bounce [animation-delay:0.4s]" />
          </span>
        </>
      ) : (
        <>
          <VolumeX className="w-3.5 h-3.5 text-[#8C8477]" />
          <span className="hidden sm:inline text-[#8C8477]">
            {language === 'ar' ? 'موسيقى السبا الهادئة' : 'Spa Ambiance'}
          </span>
        </>
      )}
    </button>
  );
};
