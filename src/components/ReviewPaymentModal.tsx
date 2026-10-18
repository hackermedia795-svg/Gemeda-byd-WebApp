import React, { useState } from 'react';
import { 
  X, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  User, 
  Phone, 
  MapPin, 
  CreditCard, 
  Calendar, 
  ExternalLink,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { Language, PaymentSubmission } from '../types';
import { translations } from '../translations';

interface ReviewPaymentModalProps {
  language: Language;
  submission: PaymentSubmission;
  onClose: () => void;
  onApprove: (id: string, notes: string) => void;
  onReject: (id: string, reason: string, notes: string) => void;
  onUpdateNotes: (id: string, notes: string) => void;
}

export const ReviewPaymentModal: React.FC<ReviewPaymentModalProps> = ({
  language,
  submission,
  onClose,
  onApprove,
  onReject,
  onUpdateNotes,
}) => {
  const t = translations[language];

  const [notes, setNotes] = useState(submission.adminNotes || '');
  const [rejectionReason, setRejectionReason] = useState(submission.rejectionReason || '');
  const [showRejectForm, setShowRejectForm] = useState(false);
  const [zoomReceipt, setZoomReceipt] = useState(false);

  const handleApprove = () => {
    onApprove(submission.id, notes);
  };

  const handleRejectConfirm = () => {
    if (!rejectionReason.trim()) {
      alert('Please specify a rejection reason for customer transparency.');
      return;
    }
    onReject(submission.id, rejectionReason, notes);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-8">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-950 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">
                {t.reviewModalTitle} — #{submission.id}
              </h3>
              <p className="text-xs text-slate-400">
                Created on {submission.createdAt}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Status banner */}
          <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 font-semibold">Current Record Status:</span>
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                submission.status === 'Approved'
                  ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                  : submission.status === 'Rejected'
                  ? 'bg-rose-950 text-rose-400 border border-rose-800'
                  : 'bg-amber-950 text-amber-300 border border-amber-800'
              }`}>
                {submission.status}
              </span>
            </div>

            <div className="text-xs text-slate-400">
              Ticket Issued: <strong className="text-white">{submission.ticketIssued ? 'YES' : 'NO'}</strong>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Customer & Ticket Info */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {t.customerInfo}
              </h4>

              <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 space-y-3 text-xs">
                <div className="flex items-start gap-2">
                  <User className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block text-[11px]">{t.fullNameLabel}</span>
                    <span className="font-bold text-white text-sm">{submission.fullName}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <Phone className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block text-[11px]">{t.phoneLabel}</span>
                    <span className="font-mono font-bold text-amber-400 text-sm">{submission.phone}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-slate-400 mt-0.5" />
                  <div>
                    <span className="text-slate-400 block text-[11px]">{t.cityLabel}</span>
                    <span className="font-medium text-slate-200">{submission.city}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
                  <span className="text-slate-400">Enrolled Tickets:</span>
                  <span className="font-bold text-white text-sm">{submission.ticketQuantity} Tickets</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Ticket Serial:</span>
                  <span className="font-mono font-bold text-amber-400">{submission.ticketNumber}</span>
                </div>
              </div>

              {/* Payment Details */}
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider pt-2">
                {t.paymentDetails}
              </h4>

              <div className="bg-slate-950 rounded-2xl p-4 border border-slate-800 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">{t.thAmountMethod}:</span>
                  <span className="font-bold text-white">{submission.amount} ETB</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Payment Gateway:</span>
                  <span className="font-medium text-amber-300">{submission.method}</span>
                </div>

                <div className="flex justify-between items-center pt-1 border-t border-slate-800">
                  <span className="text-slate-400">{t.thTransRef}:</span>
                  <span className="font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-900">
                    {submission.transactionRef}
                  </span>
                </div>
              </div>
            </div>

            {/* Receipt Proof Screenshot */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                {t.receiptProof}
              </h4>

              <div className="bg-slate-950 rounded-2xl p-3 border border-slate-800">
                {submission.receiptUrl ? (
                  <div className="relative group">
                    <img
                      src={submission.receiptUrl}
                      alt="Payment Receipt"
                      className="w-full h-56 object-cover rounded-xl cursor-pointer hover:opacity-95 transition"
                      onClick={() => setZoomReceipt(!zoomReceipt)}
                    />
                    <div className="mt-2 flex items-center justify-between text-[11px] text-slate-400 px-1">
                      <span>Click image to zoom</span>
                      <button
                        onClick={() => window.open(submission.receiptUrl, '_blank')}
                        className="text-amber-400 hover:underline flex items-center gap-1"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Full Size</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="h-52 flex flex-col items-center justify-center text-slate-500 text-xs text-center p-4">
                    <AlertCircle className="w-8 h-8 mb-2" />
                    <span>No receipt image uploaded</span>
                  </div>
                )}
              </div>

              {/* Admin Notes Box */}
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">
                  {t.adminNotesLabel}
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Verified with CBE statement at 14:30. Bank transaction verified."
                  rows={2}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

          </div>

          {/* Rejection Form Dropdown */}
          {showRejectForm && (
            <div className="bg-rose-950/40 border border-rose-800/80 rounded-2xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-rose-400 text-xs font-bold">
                <AlertCircle className="w-4 h-4" />
                <span>Specify Reason for Rejection</span>
              </div>
              <input
                type="text"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g. Transaction code not found in CBE statement, or invalid amount."
                className="w-full bg-slate-950 border border-rose-900 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-rose-500"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleRejectConfirm}
                  className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
                >
                  Confirm Rejection
                </button>
                <button
                  type="button"
                  onClick={() => setShowRejectForm(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer / Actions */}
        <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => onUpdateNotes(submission.id, notes)}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl border border-slate-800 transition"
          >
            {t.saveNotesBtn}
          </button>

          <div className="flex items-center gap-2">
            {!showRejectForm && (
              <button
                type="button"
                onClick={() => setShowRejectForm(true)}
                className="flex items-center gap-1.5 px-4 py-2 bg-rose-950 hover:bg-rose-900 text-rose-300 border border-rose-800 text-xs font-bold rounded-xl transition"
              >
                <XCircle className="w-4 h-4" />
                <span>{t.rejectBtn}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleApprove}
              className="flex items-center gap-1.5 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-400 hover:to-emerald-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/20 transition"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{t.approveAndIssueBtn}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
