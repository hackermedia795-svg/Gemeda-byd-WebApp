import React, { useState, useEffect } from 'react';
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  Ticket, 
  Printer, 
  Share2, 
  ShieldCheck, 
  Sparkles, 
  Car,
  QrCode,
  AlertTriangle,
  ArrowRight,
  Mail
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language, PaymentSubmission } from '../types';
import { translations } from '../translations';
import { EmailNotificationModal } from './EmailNotificationModal';

interface StatusCheckViewProps {
  language: Language;
  submissions: PaymentSubmission[];
  initialSearchQuery?: string;
  onGoToSubmit: () => void;
}

export const StatusCheckView: React.FC<StatusCheckViewProps> = ({
  language,
  submissions,
  initialSearchQuery = '',
  onGoToSubmit,
}) => {
  const t = translations[language];
  const [searchQuery, setSearchQuery] = useState(initialSearchQuery);
  const [activeResult, setActiveResult] = useState<PaymentSubmission | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);

  useEffect(() => {
    if (initialSearchQuery) {
      setSearchQuery(initialSearchQuery);
      handleSearch(initialSearchQuery);
    } else if (submissions.length > 0 && !hasSearched) {
      const first = submissions[0];
      setActiveResult(first);
    }
  }, [initialSearchQuery, submissions]);

  const handleSearch = (queryToUse?: string) => {
    const q = (queryToUse !== undefined ? queryToUse : searchQuery).trim().toLowerCase();
    setHasSearched(true);

    if (!q) {
      setActiveResult(null);
      return;
    }

    const cleanQ = q.replace('#', '').replace('gbyd-', '').replace('byd-', '');

    const found = submissions.find((sub) => {
      const matchId = sub.id.toLowerCase() === cleanQ || sub.id.toLowerCase() === q;
      const matchPhone = sub.phone.includes(q) || sub.phone.replace(/[^0-9]/g, '').includes(cleanQ);
      const matchTicket = sub.ticketNumber.toLowerCase().includes(q);
      const matchRef = sub.transactionRef.toLowerCase() === q;
      const matchName = sub.fullName.toLowerCase().includes(q);

      return matchId || matchPhone || matchTicket || matchRef || matchName;
    });

    setActiveResult(found || null);

    if (found && found.status === 'Approved') {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 }
      });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    if (navigator.share && activeResult) {
      navigator.share({
        title: `Gemeda BYD Ticket #${activeResult.ticketNumber}`,
        text: `Check out my Gemeda BYD Raffle Ticket #${activeResult.ticketNumber}!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copied to clipboard!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-4 space-y-8">
      {/* Header & Search Bar */}
      <div className="text-center max-w-2xl mx-auto space-y-3 no-print">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold border border-amber-500/20">
          <Search className="w-3.5 h-3.5" />
          <span>Status Verification Portal</span>
        </div>
        
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          {t.statusSearchTitle}
        </h1>
        
        <p className="text-slate-400 text-xs sm:text-sm">
          {t.statusSearchDesc}
        </p>

        {/* Search Input Box */}
        <div className="pt-2">
          <div className="relative max-w-xl mx-auto flex items-center">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearch();
              }}
              placeholder={t.searchPlaceholder}
              className="w-full bg-slate-900 border border-slate-700 rounded-2xl pl-11 pr-28 py-3.5 text-white text-sm focus:outline-none focus:border-amber-400 shadow-xl transition"
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
            <button
              onClick={() => handleSearch()}
              className="absolute right-2 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition"
            >
              {t.searchBtn}
            </button>
          </div>

          {/* Quick Demo Pill Suggestions */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs text-slate-400">
            <span>Try sample submissions:</span>
            {submissions.slice(0, 3).map((sub) => (
              <button
                key={sub.id}
                onClick={() => {
                  setSearchQuery(sub.id);
                  handleSearch(sub.id);
                }}
                className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-mono text-[11px] transition"
              >
                #{sub.id} ({sub.status})
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Search Result Display */}
      {activeResult ? (
        <div className="space-y-6">
          
          {/* Status Alert Banner */}
          <div className="no-print">
            {activeResult.status === 'Approved' && (
              <div className="bg-emerald-950/70 border border-emerald-500/50 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-base">
                      {t.ticketStatusApproved}
                    </h3>
                    <p className="text-xs text-emerald-300">
                      Payment verified by admin. Your ticket is eligible for the live draw!
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowEmailModal(true)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-semibold transition"
                    title="View Mock Email Notification"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>{t.viewEmailPreviewBtn}</span>
                  </button>

                  <button
                    onClick={handlePrint}
                    className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold border border-slate-700 transition"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Print</span>
                  </button>
                  <button
                    onClick={handleShare}
                    className="p-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold border border-slate-700 transition"
                    title="Share"
                  >
                    <Share2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {activeResult.status === 'Pending' && (
              <div className="bg-amber-950/60 border border-amber-500/40 rounded-2xl p-4 sm:p-5 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-6 h-6 animate-spin" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">
                    {t.ticketStatusPending}
                  </h3>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Submission #{activeResult.id} is queued for verification. Our review team verifies CBE and Telebirr transactions continuously.
                  </p>
                  <p className="text-xs text-amber-300/80 mt-2 font-mono">
                    Ref: {activeResult.transactionRef} • Amount: {activeResult.amount} ETB ({activeResult.method})
                  </p>
                </div>
              </div>
            )}

            {activeResult.status === 'Rejected' && (
              <div className="bg-rose-950/60 border border-rose-500/40 rounded-2xl p-4 sm:p-5 flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center flex-shrink-0">
                  <XCircle className="w-6 h-6" />
                </div>
                <div className="space-y-2 flex-1">
                  <h3 className="font-bold text-white text-base">
                    {t.ticketStatusRejected}
                  </h3>
                  <p className="text-xs text-rose-300 leading-relaxed">
                    <strong>Reason:</strong> {activeResult.rejectionReason || 'Transaction code does not match bank deposit records.'}
                  </p>
                  <div className="flex items-center gap-2 pt-1">
                    <button
                      onClick={() => setShowEmailModal(true)}
                      className="inline-flex items-center gap-1.5 text-xs text-rose-300 hover:text-white bg-rose-950 hover:bg-rose-900 px-3 py-1.5 rounded-lg border border-rose-800 transition"
                    >
                      <Mail className="w-3.5 h-3.5" />
                      <span>{t.viewEmailPreviewBtn}</span>
                    </button>
                    <button
                      onClick={onGoToSubmit}
                      className="inline-flex items-center gap-1.5 text-xs text-white font-bold bg-rose-900/80 hover:bg-rose-800 px-3 py-1.5 rounded-lg border border-rose-700 transition"
                    >
                      <span>Submit New Valid Receipt</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* OFFICIAL DIGITAL TICKET CARD */}
          <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border-2 border-amber-500/60 p-6 sm:p-8 shadow-2xl overflow-hidden print:border-black print:bg-white print:text-black">
            
            {/* Background luxury watermark */}
            <div className="absolute -top-12 -right-12 w-64 h-64 bg-amber-500/5 rounded-full blur-2xl pointer-events-none"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-800/10 font-black text-8xl select-none pointer-events-none tracking-widest uppercase">
              BYD
            </div>

            {/* Ticket Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-slate-950 font-black flex items-center justify-center text-xl shadow-lg">
                  BYD
                </div>
                <div>
                  <h2 className="text-lg font-black text-white tracking-wide">
                    GEMEDA BYD MOTORS
                  </h2>
                  <p className="text-xs text-amber-400 font-semibold tracking-wider uppercase">
                    Official Electric Car Raffle Ticket
                  </p>
                </div>
              </div>

              <div className="text-left sm:text-right">
                <span className="text-[11px] font-mono text-slate-400 uppercase block">Submission Reference</span>
                <span className="text-lg font-mono font-black text-amber-400">#{activeResult.id}</span>
              </div>
            </div>

            {/* Ticket Body Details */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 py-6 items-center">
              
              {/* Left Customer Info */}
              <div className="md:col-span-8 space-y-4">
                
                {/* Ticket Serial */}
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4">
                  <div className="text-[10px] uppercase font-bold text-slate-400">
                    {t.ticketNumberLabel}
                  </div>
                  <div className="text-2xl sm:text-3xl font-black font-mono text-amber-400 tracking-wider mt-1">
                    {activeResult.ticketNumber}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      activeResult.ticketIssued 
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-amber-950 text-amber-300 border border-amber-800'
                    }`}>
                      {activeResult.ticketIssued ? t.ticketIssuedText : t.ticketNotIssuedText}
                    </span>
                    {activeResult.selectedNumber && (
                      <span className="text-xs text-amber-400 font-mono font-bold bg-amber-950/80 px-2 py-0.5 rounded border border-amber-800">
                        Lucky Chosen: #{activeResult.selectedNumber}
                      </span>
                    )}
                    <span className="text-xs text-slate-400">
                      • {activeResult.ticketQuantity} Ticket{activeResult.ticketQuantity > 1 ? 's' : ''} Enrolled
                    </span>
                  </div>
                </div>

                {/* Participant Details */}
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-slate-400 block">{t.fullNameLabel}</span>
                    <span className="font-bold text-white text-sm mt-0.5 block">{activeResult.fullName}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">{t.phoneLabel}</span>
                    <span className="font-mono font-bold text-white text-sm mt-0.5 block">
                      {activeResult.phone}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">{t.paymentMethodLabel}</span>
                    <span className="font-medium text-slate-200 mt-0.5 block">{activeResult.method}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block">{t.thTransRef}</span>
                    <span className="font-mono font-semibold text-amber-300 mt-0.5 block">{activeResult.transactionRef}</span>
                  </div>
                </div>

              </div>

              {/* Right QR Code & Draw Badge */}
              <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-slate-950/90 rounded-2xl border border-slate-800 text-center space-y-3">
                <div className="w-28 h-28 bg-white p-2 rounded-xl flex items-center justify-center shadow">
                  <div className="w-full h-full border-2 border-slate-900 grid grid-cols-5 gap-0.5 p-1">
                    {Array.from({ length: 25 }).map((_, i) => (
                      <div
                        key={i}
                        className={`rounded-[1px] ${
                          (i % 2 === 0 || i % 5 === 0 || i === 12 || i === 18) ? 'bg-black' : 'bg-transparent'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="text-[11px] font-mono text-slate-400">
                  SECURE TICKET ID
                  <span className="block text-white font-bold text-xs mt-0.5">
                    {activeResult.ticketNumber !== 'Pending Verification' 
                      ? activeResult.ticketNumber 
                      : `TKT-${activeResult.id}`}
                  </span>
                </div>

                <div className="text-[10px] text-amber-400 bg-amber-950/80 px-2.5 py-1 rounded-full border border-amber-800/80 font-bold">
                  Live Draw: Dec 24, 2026
                </div>
              </div>

            </div>

            {/* Ticket Footer */}
            <div className="pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>{t.officialDisclaimer}</span>
              </div>
              <div className="font-mono text-[11px]">
                Registered: {activeResult.createdAt}
              </div>
            </div>

          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 no-print">
            {activeResult.status !== 'Pending' && (
              <button
                onClick={() => setShowEmailModal(true)}
                className="w-full sm:w-auto px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-amber-300 font-bold text-xs flex items-center justify-center gap-2 border border-slate-700 transition"
              >
                <Mail className="w-4 h-4 text-amber-400" />
                <span>{t.viewEmailPreviewBtn}</span>
              </button>
            )}

            <button
              onClick={handlePrint}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 transition shadow-lg"
            >
              <Printer className="w-4 h-4" />
              <span>{t.downloadTicketBtn}</span>
            </button>
            <button
              onClick={onGoToSubmit}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs border border-slate-700 transition"
            >
              Buy Another Ticket
            </button>
          </div>

          {/* Email Modal */}
          {showEmailModal && (
            <EmailNotificationModal
              language={language}
              submission={activeResult}
              type={activeResult.status === 'Approved' ? 'Approved' : 'Rejected'}
              onClose={() => setShowEmailModal(false)}
            />
          )}

        </div>
      ) : hasSearched ? (
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 sm:p-12 text-center max-w-lg mx-auto space-y-4">
          <div className="w-14 h-14 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center mx-auto">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h3 className="text-xl font-bold text-white">{t.notFoundTitle}</h3>
          <p className="text-slate-400 text-xs sm:text-sm leading-relaxed">
            {t.notFoundMsg}
          </p>
          <div className="pt-2">
            <button
              onClick={onGoToSubmit}
              className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition inline-flex items-center gap-2"
            >
              <span>{t.buyTicketBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
};
