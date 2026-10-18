import React, { useState, useEffect } from 'react';
import { 
  Clock, 
  Calendar, 
  Sparkles, 
  ShieldCheck, 
  Trophy, 
  Bell, 
  Check, 
  Flame, 
  Zap,
  CalendarPlus
} from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';

export interface DrawCountdownTimerProps {
  language: Language;
  drawDateIso?: string;
  drawDateText?: string;
  variant?: 'hero' | 'compact' | 'admin-preview';
  className?: string;
}

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  totalSeconds: number;
  isPast: boolean;
}

/**
 * Safely parses any date string, ISO timestamp, or date text into a valid Date object.
 */
export function parseTargetDrawDate(dateIso?: string, dateText?: string): Date {
  if (dateIso) {
    const d = new Date(dateIso);
    if (!isNaN(d.getTime())) return d;
  }
  
  if (dateText) {
    // Try standard Date parsing on clean string
    const cleaned = dateText
      .replace(/Guyyaa.*?:/i, '')
      .replace(/Grand Draw Date:/i, '')
      .replace(/የዕጣ.*?:/i, '')
      .replace(/\(.*?\)/g, '')
      .trim();
    const d = new Date(cleaned);
    if (!isNaN(d.getTime())) return d;

    // Check for YYYY-MM-DD pattern inside text
    const match = dateText.match(/(\d{4})-(\d{2})-(\d{2})(?:[T\s](\d{2}):(\d{2}))?/);
    if (match) {
      const year = parseInt(match[1]);
      const month = parseInt(match[2]) - 1;
      const day = parseInt(match[3]);
      const hour = match[4] ? parseInt(match[4]) : 18;
      const min = match[5] ? parseInt(match[5]) : 0;
      return new Date(year, month, day, hour, min);
    }
  }

  // Fallback default: December 24, 2026 at 18:00
  return new Date('2026-12-24T18:00:00');
}

export function calculateTimeRemaining(targetDate: Date): TimeRemaining {
  const now = Date.now();
  const diffMs = targetDate.getTime() - now;

  if (diffMs <= 0) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      totalSeconds: 0,
      isPast: true,
    };
  }

  const totalSeconds = Math.floor(diffMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    days,
    hours,
    minutes,
    seconds,
    totalSeconds,
    isPast: false,
  };
}

export const DrawCountdownTimer: React.FC<DrawCountdownTimerProps> = ({
  language,
  drawDateIso,
  drawDateText,
  variant = 'hero',
  className = '',
}) => {
  const t = translations[language] || translations['om'];
  const [copied, setCopied] = useState(false);
  const [reminderSet, setReminderSet] = useState(false);

  const targetDate = parseTargetDrawDate(drawDateIso, drawDateText);
  const [timeLeft, setTimeLeft] = useState<TimeRemaining>(() => calculateTimeRemaining(targetDate));

  useEffect(() => {
    // Immediate calculation on targetDate change
    setTimeLeft(calculateTimeRemaining(targetDate));

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeRemaining(targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [drawDateIso, drawDateText]);

  const handleCopyDate = () => {
    const textToCopy = drawDateText || targetDate.toLocaleString();
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleSetReminder = () => {
    setReminderSet(true);
    setTimeout(() => setReminderSet(false), 3000);
  };

  // Formatted human date for display
  const formattedTargetDate = targetDate.toLocaleDateString(
    language === 'am' ? 'am-ET' : language === 'om' ? 'en-US' : 'en-US',
    {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
  );

  // Compact variant for sidebar or preview card
  if (variant === 'compact') {
    return (
      <div className={`bg-slate-900 border border-slate-800 rounded-2xl p-3 ${className}`}>
        <div className="flex items-center justify-between text-[11px] mb-2">
          <span className="text-amber-400 font-semibold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{timeLeft.isPast ? 'Draw Time Reached' : 'Draw Countdown'}</span>
          </span>
          <span className="text-emerald-400 font-mono text-[10px]">
            {timeLeft.isPast ? 'LIVE' : `${timeLeft.days}d left`}
          </span>
        </div>
        <div className="grid grid-cols-4 gap-1.5 text-center font-mono">
          <div className="bg-slate-950 p-1.5 rounded-lg border border-slate-800">
            <div className="text-sm font-black text-amber-400">{String(timeLeft.days).padStart(2, '0')}</div>
            <div className="text-[9px] text-slate-400">{t.daysLeft || 'Days'}</div>
          </div>
          <div className="bg-slate-950 p-1.5 rounded-lg border border-slate-800">
            <div className="text-sm font-black text-white">{String(timeLeft.hours).padStart(2, '0')}</div>
            <div className="text-[9px] text-slate-400">{t.hoursLeft || 'Hours'}</div>
          </div>
          <div className="bg-slate-950 p-1.5 rounded-lg border border-slate-800">
            <div className="text-sm font-black text-white">{String(timeLeft.minutes).padStart(2, '0')}</div>
            <div className="text-[9px] text-slate-400">{t.minsLeft || 'Mins'}</div>
          </div>
          <div className="bg-slate-950 p-1.5 rounded-lg border border-slate-800">
            <div className="text-sm font-black text-amber-400 animate-pulse">{String(timeLeft.seconds).padStart(2, '0')}</div>
            <div className="text-[9px] text-slate-400">{t.secsLeft || 'Secs'}</div>
          </div>
        </div>
      </div>
    );
  }

  // Admin Preview Variant
  if (variant === 'admin-preview') {
    return (
      <div className={`bg-slate-950/90 border border-amber-500/30 rounded-2xl p-4 shadow-lg ${className}`}>
        <div className="flex items-center justify-between text-xs mb-3 pb-2 border-b border-slate-800">
          <span className="text-amber-400 font-bold flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            <span>Admin Live Countdown Preview</span>
          </span>
          <span className="text-[11px] text-slate-400 font-mono bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
            Target: {formattedTargetDate}
          </span>
        </div>

        {timeLeft.isPast ? (
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center text-xs text-amber-400 font-bold">
            🎉 Draw Date has passed or is right now!
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2 text-center font-mono">
            <div className="bg-slate-900 border border-slate-800 rounded-xl py-2 px-1">
              <div className="text-2xl font-black text-amber-400">{String(timeLeft.days).padStart(2, '0')}</div>
              <div className="text-[10px] uppercase font-bold text-slate-400">{t.daysLeft || 'Days'}</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl py-2 px-1">
              <div className="text-2xl font-black text-white">{String(timeLeft.hours).padStart(2, '0')}</div>
              <div className="text-[10px] uppercase font-bold text-slate-400">{t.hoursLeft || 'Hours'}</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl py-2 px-1">
              <div className="text-2xl font-black text-white">{String(timeLeft.minutes).padStart(2, '0')}</div>
              <div className="text-[10px] uppercase font-bold text-slate-400">{t.minsLeft || 'Mins'}</div>
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-xl py-2 px-1">
              <div className="text-2xl font-black text-amber-400">{String(timeLeft.seconds).padStart(2, '0')}</div>
              <div className="text-[10px] uppercase font-bold text-slate-400">{t.secsLeft || 'Secs'}</div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // Hero High-Impact Variant (Primary)
  return (
    <div className={`relative overflow-hidden bg-slate-950/85 backdrop-blur-md border border-slate-800/90 hover:border-amber-500/40 rounded-3xl p-4 sm:p-5 shadow-2xl transition duration-300 max-w-xl group ${className}`}>
      {/* Ambient background glow */}
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none group-hover:bg-amber-500/15 transition duration-500"></div>
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-blue-600/10 rounded-full blur-2xl pointer-events-none"></div>

      {/* Top Header Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-2 text-xs mb-3.5 pb-2.5 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          {timeLeft.isPast ? (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[11px] border border-amber-500/40">
              <Trophy className="w-3.5 h-3.5 text-amber-400 animate-bounce" />
              <span>{language === 'om' ? 'CARRAAN BAAFAMEERA / DRAW IS LIVE' : language === 'am' ? 'የቀጥታ ዕጣ ማውጣት' : 'DRAW EVENT LIVE'}</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 text-emerald-400 font-bold text-[11px] border border-emerald-800/80 shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>{language === 'om' ? 'YEROO HAFTE (COUNTDOWN)' : language === 'am' ? 'የቀጥታ ሰዓት ቆጣሪ' : 'LIVE DRAW COUNTDOWN'}</span>
            </span>
          )}

          {/* Draw Date Label */}
          <span className="text-slate-300 font-medium text-[11px] hidden sm:inline-flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span className="truncate max-w-[220px]" title={drawDateText || formattedTargetDate}>
              {drawDateText || formattedTargetDate}
            </span>
          </span>
        </div>

        {/* Official Authority Badge */}
        <div className="flex items-center gap-1 text-[10px] text-slate-400 bg-slate-900/90 px-2 py-0.5 rounded-full border border-slate-800 font-semibold">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>Official Raffle</span>
        </div>
      </div>

      {/* Main Countdown Display or Draw Passed Message */}
      {timeLeft.isPast ? (
        <div className="relative z-10 py-4 px-3 bg-gradient-to-r from-amber-500/10 via-slate-900 to-amber-500/10 border border-amber-500/30 rounded-2xl text-center space-y-2">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 mx-auto shadow-lg shadow-amber-500/30">
            <Trophy className="w-7 h-7" />
          </div>
          <h4 className="text-lg sm:text-xl font-black text-amber-400 uppercase tracking-wide">
            {language === 'om' ? 'Guyyaan Carraan Baafamu Gaheera!' : language === 'am' ? 'የዕጣ ማውጫው ቀን ደርሷል!' : 'Lottery Draw Day Has Arrived!'}
          </h4>
          <p className="text-xs text-slate-300 max-w-md mx-auto">
            {language === 'om'
              ? 'Sirni carraa baasuu kallattiin geggeeffamaa jira. Mo\'attoonni battalumatti beeksifamu!'
              : language === 'am'
              ? 'የዕጣ ማውጣት ስነ-ስርዓቱ እየተካሄደ ነው። አሸናፊዎች በቅርቡ ይፋ ይደረጋሉ!'
              : 'The official raffle draw is taking place. Winners are being verified and announced!'}
          </p>
        </div>
      ) : (
        <div className="relative z-10 space-y-3">
          {/* 4 Cards Grid */}
          <div className="grid grid-cols-4 gap-2 sm:gap-3 text-center">
            
            {/* Days Card */}
            <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 hover:border-amber-500/50 rounded-2xl py-2.5 sm:py-3.5 px-1 shadow-inner transition group/card">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-amber-500/40 to-transparent"></div>
              <div className="text-2xl sm:text-4xl font-black font-mono tracking-tight text-amber-400 drop-shadow-[0_2px_8px_rgba(245,158,11,0.25)]">
                {String(timeLeft.days).padStart(2, '0')}
              </div>
              <div className="text-[10px] sm:text-[11px] uppercase font-bold text-slate-400 mt-1 tracking-wider">
                {t.daysLeft || 'Days'}
              </div>
            </div>

            {/* Hours Card */}
            <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 hover:border-slate-700 rounded-2xl py-2.5 sm:py-3.5 px-1 shadow-inner transition group/card">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
              <div className="text-2xl sm:text-4xl font-black font-mono tracking-tight text-white">
                {String(timeLeft.hours).padStart(2, '0')}
              </div>
              <div className="text-[10px] sm:text-[11px] uppercase font-bold text-slate-400 mt-1 tracking-wider">
                {t.hoursLeft || 'Hours'}
              </div>
            </div>

            {/* Minutes Card */}
            <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950 border border-slate-800 hover:border-slate-700 rounded-2xl py-2.5 sm:py-3.5 px-1 shadow-inner transition group/card">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
              <div className="text-2xl sm:text-4xl font-black font-mono tracking-tight text-white">
                {String(timeLeft.minutes).padStart(2, '0')}
              </div>
              <div className="text-[10px] sm:text-[11px] uppercase font-bold text-slate-400 mt-1 tracking-wider">
                {t.minsLeft || 'Mins'}
              </div>
            </div>

            {/* Seconds Card (Animated Pulse) */}
            <div className="relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950 border border-amber-500/30 rounded-2xl py-2.5 sm:py-3.5 px-1 shadow-inner transition group/card">
              <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400"></div>
              <div className="text-2xl sm:text-4xl font-black font-mono tracking-tight text-amber-400 animate-pulse">
                {String(timeLeft.seconds).padStart(2, '0')}
              </div>
              <div className="text-[10px] sm:text-[11px] uppercase font-bold text-amber-400/90 mt-1 tracking-wider flex items-center justify-center gap-0.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 inline-block animate-ping"></span>
                <span>{t.secsLeft || 'Secs'}</span>
              </div>
            </div>

          </div>

          {/* Bottom interactive action strip */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {language === 'om' ? 'Guyyaa Xumuraa:' : language === 'am' ? 'የመጨረሻ ቀን፡' : 'Draw Scheduled:'}{' '}
                <strong className="text-slate-200 font-semibold">{formattedTargetDate}</strong>
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleCopyDate}
                className="text-[10px] px-2 py-1 rounded-lg bg-slate-900 hover:bg-slate-850 text-slate-300 hover:text-white border border-slate-800 transition flex items-center gap-1"
                title="Copy Draw Date"
              >
                {copied ? (
                  <>
                    <Check className="w-3 h-3 text-emerald-400" />
                    <span className="text-emerald-400 font-bold">Waraabameera!</span>
                  </>
                ) : (
                  <>
                    <CalendarPlus className="w-3 h-3 text-amber-400" />
                    <span>{language === 'om' ? 'Guyyaa Qabadhaa' : language === 'am' ? 'ቀን ቅዳ' : 'Save Date'}</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleSetReminder}
                className="text-[10px] px-2 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 transition flex items-center gap-1 font-semibold"
                title="Reminder Notification"
              >
                <Bell className="w-3 h-3 text-amber-400" />
                <span>{reminderSet ? 'Yaadatameera! ✓' : language === 'om' ? 'Beeksisa Qabadhu' : language === 'am' ? 'ማስታወሻ' : 'Remind Me'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
