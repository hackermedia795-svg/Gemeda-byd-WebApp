import React from 'react';
import { 
  X, 
  Mail, 
  CheckCircle2, 
  XCircle, 
  Send, 
  ShieldCheck, 
  Sparkles, 
  Ticket, 
  Printer, 
  Car,
  Clock,
  Phone,
  MapPin
} from 'lucide-react';
import { Language, PaymentSubmission } from '../types';
import { translations } from '../translations';
import { CONTACT_INFO } from '../data/seedData';

interface EmailNotificationModalProps {
  language: Language;
  submission: PaymentSubmission;
  type: 'Approved' | 'Rejected';
  onClose: () => void;
}

export const EmailNotificationModal: React.FC<EmailNotificationModalProps> = ({
  language,
  submission,
  type,
  onClose,
}) => {
  const t = translations[language];

  const recipientEmail = submission.email || `${submission.phone.replace(/[^0-9]/g, '')}@notify.et`;
  const isApproved = type === 'Approved';

  const subject = isApproved
    ? language === 'om'
      ? `🎉 BAGA GAMMADDAN! Tikkeetiin Konkolaataa BYD Mirkanaa'eera (Ticket: ${submission.ticketNumber})`
      : language === 'am'
      ? `🎉 እንኳን ደስ አላችሁ! የቢዋይዲ መኪና ዕጣ ቲኬትዎ ጸድቋል (ቲኬት፡ ${submission.ticketNumber})`
      : `🎉 CONGRATULATIONS! Your Gemeda BYD Raffle Ticket is Approved (Ticket: ${submission.ticketNumber})`
    : language === 'om'
      ? `⚠️ Beeksisa Kaffaltii: Galmeen #${submission.id} Hin Fudhatamne - Gemeda BYD`
      : language === 'am'
      ? `⚠️ የክፍያ ማስታወቂያ፡ ማመልከቻ #${submission.id} ውድቅ ሆኗል - Gemeda BYD`
      : `⚠️ Payment Notice: Submission #${submission.id} Not Approved - Gemeda BYD`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Simulation Window Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-sm">
                  {t.emailModalTitle}
                </span>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                  Dispatched
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Automated notification trigger: status changed to <strong className={isApproved ? 'text-emerald-400' : 'text-rose-400'}>{type}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white bg-slate-900 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mock Email Metadata Header */}
        <div className="bg-slate-900/90 border-b border-slate-800 px-6 py-3.5 space-y-1.5 text-xs font-mono">
          <div className="flex items-baseline">
            <span className="text-slate-500 w-20 flex-shrink-0">{t.fromLabel}:</span>
            <span className="text-amber-400 font-semibold truncate">
              Gemeda BYD Official &lt;support@gemedabyd.com&gt;
            </span>
          </div>

          <div className="flex items-baseline">
            <span className="text-slate-500 w-20 flex-shrink-0">{t.toLabel}:</span>
            <span className="text-white font-medium truncate">
              {submission.fullName} &lt;{recipientEmail}&gt;
            </span>
          </div>

          <div className="flex items-baseline">
            <span className="text-slate-500 w-20 flex-shrink-0">{t.subjectLabel}:</span>
            <span className="text-slate-200 font-semibold">
              {subject}
            </span>
          </div>

          <div className="flex items-baseline">
            <span className="text-slate-500 w-20 flex-shrink-0">{t.dateLabel}:</span>
            <span className="text-slate-400">
              {new Date().toLocaleString()} (Automatic Dispatch)
            </span>
          </div>
        </div>

        {/* Email Body Preview (Rendered as formatted email template) */}
        <div className="p-6 bg-slate-950 max-h-[60vh] overflow-y-auto">
          <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-lg">
            
            {/* Branded Banner */}
            <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 p-5 text-slate-950 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-slate-950 text-amber-400 font-black flex items-center justify-center text-lg shadow">
                  BYD
                </div>
                <div>
                  <h3 className="font-black text-base tracking-tight leading-none">
                    GEMEDA BYD MOTORS
                  </h3>
                  <p className="text-[11px] font-bold text-slate-900 mt-1 uppercase tracking-wider">
                    Official Electric Car Raffle Notification
                  </p>
                </div>
              </div>
              <Sparkles className="w-6 h-6 text-slate-950 opacity-80" />
            </div>

            {/* Email Content Container */}
            <div className="p-6 space-y-5 text-xs text-slate-300">
              
              <div>
                <p className="text-sm font-bold text-white">
                  {language === 'om' 
                    ? `Kabajamoo ${submission.fullName},` 
                    : language === 'am' 
                    ? `የተከበሩ ${submission.fullName}፣` 
                    : `Dear ${submission.fullName},`}
                </p>
              </div>

              {isApproved ? (
                /* APPROVED BODY */
                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 flex items-center gap-2.5">
                    <CheckCircle2 className="w-5 h-5 flex-shrink-0 text-emerald-400" />
                    <div>
                      <p className="font-bold text-xs">
                        {language === 'om' 
                          ? 'Kaffaltiin keessan mirkanaa\'eera! Tikkeetiin seera-qabeessa isiniif baafameera.'
                          : language === 'am'
                          ? 'ክፍያዎ በተሳካ ሁኔታ ተረጋግጧል! ይፋዊ የዕጣ ቲኬትዎ ወጥቷል።'
                          : 'Your payment deposit has been verified and your official raffle ticket is active!'}
                      </p>
                    </div>
                  </div>

                  {/* Golden Ticket Certificate Box */}
                  <div className="p-4 rounded-xl bg-slate-950 border-2 border-amber-500/70 space-y-3">
                    <div className="flex justify-between items-center pb-2 border-b border-slate-800">
                      <span className="text-[10px] text-amber-400 uppercase font-black">
                        OFFICIAL TICKET CODE
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">
                        Ref: #{submission.id}
                      </span>
                    </div>

                    <div className="text-center py-2">
                      <div className="text-2xl font-black font-mono text-amber-400 tracking-wider">
                        {submission.ticketNumber}
                      </div>
                      {submission.selectedNumber && (
                        <div className="text-xs text-emerald-400 font-bold mt-1">
                          Lucky Chosen Number: #{submission.selectedNumber}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] pt-2 border-t border-slate-800">
                      <div>
                        <span className="text-slate-500 block">Enrolled Tickets:</span>
                        <span className="font-bold text-white">{submission.ticketQuantity} Ticket(s)</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Amount Paid:</span>
                        <span className="font-bold text-emerald-400">{submission.amount} ETB ({submission.method})</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Grand Prize:</span>
                        <span className="font-bold text-white">BYD Song Plus EV</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block">Draw Date:</span>
                        <span className="font-bold text-amber-400">Dec 24, 2026</span>
                      </div>
                    </div>
                  </div>

                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    {language === 'om'
                      ? 'Lakkoofsa tikkeetii kana of-eeggannoon qabadhaa. Guyyaa carraan baafamu kallattiin televijiiniin kan darbu ta\'a. Carraa gaarii isiniif haa ta\'u!'
                      : language === 'am'
                      ? 'ይህንን የቲኬት ቁጥር በጥንቃቄ ይያዙ። በዕጣ ማውጫው ቀን በቀጥታ ስርጭት የሚተላለፍ ይሆናል። መልካም ዕድል!'
                      : 'Please preserve this ticket number. The grand lottery draw will be broadcast live. Best of luck on winning the BYD EV!'}
                  </p>
                </div>
              ) : (
                /* REJECTED BODY */
                <div className="space-y-4">
                  <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-300 flex items-start gap-2.5">
                    <XCircle className="w-5 h-5 flex-shrink-0 text-rose-400 mt-0.5" />
                    <div>
                      <p className="font-bold text-xs">
                        {language === 'om'
                          ? 'Dhiifama, kaffaltiin keessan qorannoon hin mirkanoofne.'
                          : language === 'am'
                          ? 'ይቅርታ፣ ያቀረቡት የክፍያ መረጃ በግምገማ አልጸደቀም።'
                          : 'Notice: Your payment submission could not be verified at this time.'}
                      </p>
                      <p className="text-[11px] text-rose-200 mt-1">
                        <strong>Reason:</strong> {submission.rejectionReason || 'Transaction code did not match bank statement.'}
                      </p>
                    </div>
                  </div>

                  <p className="text-slate-400 leading-relaxed text-[11px]">
                    {language === 'om'
                      ? 'Maaloo ragaa sirrii Telebirr ykn Baankii keessanii irra deebi\'uun ergaa ykn sarara gargaarsaa keenyaan nu qunnamaa.'
                      : language === 'am'
                      ? 'እባክዎን ትክክለኛውን የክፍያ ማረጋገጫ በድጋሚ ይላኩ ወይም በደንበኞች አገልግሎት ስልክ ይደውሉ።'
                      : 'Please double-check your deposit transaction reference and submit a valid receipt or contact our support team.'}
                  </p>
                </div>
              )}

              {/* Official Support Footer in Email */}
              <div className="pt-4 border-t border-slate-800 space-y-1.5 text-[11px] text-slate-500">
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-amber-400" />
                  <span>{CONTACT_INFO.phones.join(' / ')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span>{CONTACT_INFO.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>{CONTACT_INFO.address}</span>
                </div>
              </div>

            </div>

          </div>
        </div>

        {/* Modal Actions */}
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>Simulated Notification Delivered</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-semibold border border-slate-700 transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Email</span>
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition"
            >
              {t.closeEmailBtn}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
