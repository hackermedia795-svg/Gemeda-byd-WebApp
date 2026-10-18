import React, { useState } from 'react';
import { 
  Ticket, 
  Upload, 
  CheckCircle2, 
  Copy, 
  Check, 
  CreditCard, 
  AlertCircle, 
  ArrowRight,
  ShieldCheck,
  FileCheck,
  Mail,
  Hash,
  MapPin,
  Search,
  Building2
} from 'lucide-react';
import { Language, PaymentMethod, PaymentSubmission, LuckyNumberPolicy } from '../types';
import { translations } from '../translations';
import { BANK_ACCOUNTS, TICKET_PRICING, CONTACT_INFO, DEFAULT_LUCKY_POLICY } from '../data/seedData';
import { TicketNumberPicker } from './TicketNumberPicker';
import { ETHIOPIAN_REGIONS_AND_CITIES, ALL_ETHIOPIAN_CITIES } from '../data/ethiopianCities';

interface SubmitPaymentViewProps {
  language: Language;
  maxTickets: number;
  submissions: PaymentSubmission[];
  luckyNumberPolicy?: LuckyNumberPolicy;
  preselectedQuantity?: number;
  onSubmitSuccess: (submission: PaymentSubmission) => void;
  onGoToStatus: (submissionId: string) => void;
}

export const SubmitPaymentView: React.FC<SubmitPaymentViewProps> = ({
  language,
  maxTickets,
  submissions,
  luckyNumberPolicy = DEFAULT_LUCKY_POLICY,
  preselectedQuantity = 1,
  onSubmitSuccess,
  onGoToStatus,
}) => {
  const t = translations[language];

  // Form State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Finfinnee (Addis Ababa)');
  const [ticketQuantity, setTicketQuantity] = useState(preselectedQuantity);
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [method, setMethod] = useState<PaymentMethod>('Telebirr');
  const [transactionRef, setTransactionRef] = useState('');
  const [receiptImage, setReceiptImage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successSubmission, setSuccessSubmission] = useState<PaymentSubmission | null>(null);
  const [copiedAccount, setCopiedAccount] = useState(false);

  // Calculate pricing based on bundles
  const calculateTotal = (qty: number): number => {
    const bundle = TICKET_PRICING.find(p => p.qty === qty);
    if (bundle) return bundle.price;
    return qty * 500;
  };

  const selectedBank = BANK_ACCOUNTS.find(b => b.name === method) || BANK_ACCOUNTS[0];

  const handleCopyBank = () => {
    navigator.clipboard.writeText(selectedBank.accountNumber);
    setCopiedAccount(true);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  const handleSimulateSampleReceipt = () => {
    if (method === 'Telebirr') {
      setReceiptImage('https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80');
      if (!transactionRef) setTransactionRef(`TX${Math.floor(100000000 + Math.random() * 900000000)}`);
    } else {
      setReceiptImage('https://images.unsplash.com/photo-1554224154-26032ffc0d07?w=600&auto=format&fit=crop&q=80');
      if (!transactionRef) setTransactionRef(`FT26${Math.floor(100000000 + Math.random() * 900000000)}`);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setReceiptImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!fullName.trim() || fullName.trim().split(' ').length < 2) {
      setErrorMessage(
        language === 'om'
          ? 'Maaloo maqaa guutuu (maqaa keessan fi abbaa keessanii) galchaa.'
          : language === 'am'
          ? 'እባክዎ ሙሉ ስምዎን (የራስዎን እና የአባትዎን) ያስገቡ።'
          : 'Please enter your full name (first and father name).'
      );
      return;
    }

    const cleanPhone = phone.trim().replace(/\s+/g, '');
    if (!cleanPhone || cleanPhone.length < 9) {
      setErrorMessage(
        language === 'om'
          ? 'Lakkoofsi bilbilaa sirrii miti. (09... ykn 07... fayyadamaa).'
          : language === 'am'
          ? 'ትክክለኛ ስልክ ቁጥር ያስገቡ (09... ወይም 07...)።'
          : 'Please enter a valid Ethiopian phone number (e.g. 0912305111).'
      );
      return;
    }

    if (!transactionRef.trim()) {
      setErrorMessage(
        language === 'om'
          ? 'Lakkoofsa mirkaneessa kaffaltii (Transaction Reference) galchaa.'
          : language === 'am'
          ? 'የትራንዛክሽን ማረጋገጫ ቁጥር (Transaction Ref) ያስገቡ።'
          : 'Please enter the transaction reference number from your bank or Telebirr slip.'
      );
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      const newId = String(Math.floor(1090 + Math.random() * 8900));
      
      const primarySelected = selectedNumbers.length > 0 ? selectedNumbers[0] : undefined;
      const ticketDisplay = selectedNumbers.length > 0
        ? (selectedNumbers.length === 1 
            ? `BYD-2026-${String(selectedNumbers[0]).padStart(6, '0')} (Reserved)`
            : `BYD-2026-[${selectedNumbers.join(', ')}] (Reserved)`)
        : 'Pending Verification';

      const newSubmission: PaymentSubmission = {
        id: newId,
        fullName: fullName.trim(),
        phone: cleanPhone,
        email: email.trim() || undefined,
        city,
        ticketQuantity,
        ticketNumber: ticketDisplay,
        selectedNumber: primarySelected,
        selectedNumbers: selectedNumbers.length > 0 ? selectedNumbers : undefined,
        amount: calculateTotal(ticketQuantity),
        method,
        transactionRef: transactionRef.trim().toUpperCase(),
        receiptUrl: receiptImage || 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
        status: 'Pending',
        ticketIssued: false,
        createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
        adminNotes: selectedNumbers.length > 0 
          ? `Requested Lucky Numbers: ${selectedNumbers.map(n => `#${n}`).join(', ')}. Waiting for reviewer confirmation.`
          : 'Submitted via customer portal. Waiting for reviewer confirmation.'
      };

      onSubmitSuccess(newSubmission);
      setIsSubmitting(false);
      setSuccessSubmission(newSubmission);
    }, 600);
  };

  // If successfully submitted, show confirmation card
  if (successSubmission) {
    return (
      <div className="max-w-2xl mx-auto py-8">
        <div className="bg-slate-900 border border-emerald-500/50 rounded-3xl p-8 sm:p-10 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-emerald-500 via-amber-400 to-emerald-500"></div>

          <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-2">
            {t.submissionSuccessTitle}
          </h2>

          <p className="text-slate-300 text-sm sm:text-base max-w-lg mx-auto mb-6">
            {t.submissionSuccessMsg}
          </p>

          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 mb-6 text-left max-w-md mx-auto space-y-3">
            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>{t.yourRefId}</span>
              <span className="text-amber-400 font-mono font-bold text-lg">
                #{successSubmission.id}
              </span>
            </div>

            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>{t.fullNameLabel}</span>
              <span className="text-white font-semibold">{successSubmission.fullName}</span>
            </div>

            {(successSubmission.selectedNumbers && successSubmission.selectedNumbers.length > 0) ? (
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span>Reserved Lucky Number{successSubmission.selectedNumbers.length > 1 ? 's' : ''}:</span>
                <span className="text-amber-400 font-mono font-bold">
                  {successSubmission.selectedNumbers.map(n => `#${n}`).join(', ')}
                </span>
              </div>
            ) : successSubmission.selectedNumber ? (
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span>Reserved Lucky Number:</span>
                <span className="text-amber-400 font-mono font-bold">
                  #{successSubmission.selectedNumber}
                </span>
              </div>
            ) : null}

            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>{t.ticketQuantityLabel}</span>
              <span className="text-white font-semibold">{successSubmission.ticketQuantity} Tickets</span>
            </div>

            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>{t.totalAmountLabel}</span>
              <span className="text-emerald-400 font-bold">{successSubmission.amount} {t.birr}</span>
            </div>

            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>{t.paymentMethodLabel}</span>
              <span className="text-white font-medium">{successSubmission.method}</span>
            </div>

            <div className="flex justify-between items-center text-xs text-slate-400">
              <span>{t.thStatus}</span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                Pending Verification
              </span>
            </div>
          </div>

          <p className="text-xs text-slate-400 mb-6">
            {t.keepRefSafe}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => onGoToStatus(successSubmission.id)}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm flex items-center justify-center gap-2 shadow-lg transition"
            >
              <span>{t.checkMyStatusNow}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => {
                setSuccessSubmission(null);
                setFullName('');
                setPhone('');
                setEmail('');
                setTransactionRef('');
                setReceiptImage('');
                setSelectedNumbers([]);
              }}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm transition"
            >
              Submit Another Ticket
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-4">
      {/* Header Info */}
      <div className="text-center max-w-2xl mx-auto mb-8 space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-semibold border border-amber-500/20">
          <Ticket className="w-3.5 h-3.5" />
          <span>Gemeda BYD Ticket Portal • Range 1 - {maxTickets.toLocaleString()}</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
          {t.submitTitle}
        </h1>
        <p className="text-slate-400 text-xs sm:text-sm">
          {t.submitSubtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Form */}
        <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {errorMessage && (
              <div className="p-3.5 rounded-xl bg-rose-950/60 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Full Name */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                {t.fullNameLabel} <span className="text-amber-400">*</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder={t.fullNamePlaceholder}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-400 transition"
                required
              />
            </div>

            {/* Phone & Email */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  {t.phoneLabel} <span className="text-amber-400">*</span>
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder={t.phonePlaceholder}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-400 transition font-mono"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1.5">
                  {t.emailLabel}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.emailPlaceholder}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-amber-400 transition"
                />
              </div>
            </div>

            {/* City */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                {t.cityLabel}
              </label>
              <select
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-3 text-white text-sm focus:outline-none focus:border-amber-400 transition"
              >
                <option value="Finfinnee (Addis Ababa)">Finfinnee (Addis Ababa)</option>
                <option value="Shaggar / Burayuu (Burayu)">Shaggar / Burayuu (Burayu)</option>
                <option value="Adaamaa (Adama)">Adaamaa (Adama)</option>
                <option value="Jimmaa (Jimma)">Jimmaa (Jimma)</option>
                <option value="Hawaasaa (Hawassa)">Hawaasaa (Hawassa)</option>
                <option value="Dirree Dhawaa (Dire Dawa)">Dirree Dhawaa (Dire Dawa)</option>
                <option value="Naqamte (Nekemte)">Naqamte (Nekemte)</option>
                <option value="Bishooftuu (Bishoftu)">Bishooftuu (Bishoftu)</option>
                <option value="Shaashamannee (Shashamane)">Shaashamannee (Shashamane)</option>
                <option value="Amboo (Ambo)">Amboo (Ambo)</option>
                <option value="Baahir Daar (Bahir Dar)">Baahir Daar (Bahir Dar)</option>
                <option value="Other / Biyya Alaa">Other / Biyya Alaa (Diaspora)</option>
              </select>
            </div>

            {/* Ticket Quantity selector */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                {t.ticketQuantityLabel}
              </label>
              <div className="grid grid-cols-4 gap-2">
                {TICKET_PRICING.map((pkg) => (
                  <button
                    key={pkg.qty}
                    type="button"
                    onClick={() => setTicketQuantity(pkg.qty)}
                    className={`py-2 px-1 rounded-xl text-center border transition ${
                      ticketQuantity === pkg.qty
                        ? 'bg-amber-500 text-slate-950 font-black border-amber-400'
                        : 'bg-slate-950 text-slate-300 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="text-base font-bold">{pkg.qty}</div>
                    <div className="text-[10px] opacity-80">{pkg.price} ETB</div>
                  </button>
                ))}
              </div>
            </div>

            {/* CUSTOM LUCKY NUMBER PICKER (Requested Feature!) */}
            {luckyNumberPolicy?.enabled !== false ? (
              <div>
                <TicketNumberPicker
                  language={language}
                  maxTickets={maxTickets}
                  submissions={submissions}
                  ticketQuantity={ticketQuantity}
                  maxAllowedSelection={luckyNumberPolicy?.maxSelectablePerOrder || ticketQuantity}
                  selectedNumbers={selectedNumbers}
                  onSelectNumbers={setSelectedNumbers}
                />
              </div>
            ) : (
              <div className="bg-slate-950/70 border border-slate-800 rounded-2xl p-4 flex items-center gap-3">
                <Hash className="w-5 h-5 text-amber-400 flex-shrink-0" />
                <p className="text-xs text-slate-400">
                  {language === 'om'
                    ? 'Lakkoofsi carraa sirnaan ofumaan kennama (System Auto-assigned ticket numbers upon payment verification).'
                    : 'Ticket numbers are automatically assigned sequentially by the system upon payment verification.'}
                </p>
              </div>
            )}

            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1.5">
                {t.paymentMethodLabel} <span className="text-amber-400">*</span>
              </label>
              <div className="grid grid-cols-2 gap-2">
                {BANK_ACCOUNTS.map((bank) => (
                  <button
                    key={bank.name}
                    type="button"
                    onClick={() => setMethod(bank.name)}
                    className={`p-3 rounded-xl border text-left flex items-center justify-between transition ${
                      method === bank.name
                        ? 'bg-slate-800 border-amber-400 text-white shadow-md'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="text-xs font-bold text-white">{bank.name.split(' (')[0]}</div>
                      <div className="text-[10px] text-slate-400">{bank.accountNumber}</div>
                    </div>
                    {method === bank.name && (
                      <CheckCircle2 className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Transaction Ref */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-300">
                  {t.transactionRefLabel} <span className="text-amber-400">*</span>
                </label>
                <span className="text-[11px] text-slate-500">
                  {method === 'Telebirr' ? 'e.g. TX12345678' : 'e.g. FT2610842'}
                </span>
              </div>
              <input
                type="text"
                value={transactionRef}
                onChange={(e) => setTransactionRef(e.target.value)}
                placeholder={t.transactionRefPlaceholder}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-white text-sm font-mono tracking-wider focus:outline-none focus:border-amber-400 transition"
                required
              />
            </div>

            {/* Receipt Upload / Simulator */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-300">
                  {t.uploadReceiptLabel}
                </label>
                <button
                  type="button"
                  onClick={handleSimulateSampleReceipt}
                  className="text-xs text-amber-400 hover:text-amber-300 underline font-medium"
                >
                  {t.uploadSimulationBtn}
                </button>
              </div>

              {receiptImage ? (
                <div className="relative rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 p-2">
                  <img
                    src={receiptImage}
                    alt="Uploaded receipt"
                    className="w-full h-36 object-cover rounded-xl"
                  />
                  <button
                    type="button"
                    onClick={() => setReceiptImage('')}
                    className="absolute top-4 right-4 bg-slate-900/90 text-slate-300 hover:text-white px-2.5 py-1 rounded-lg text-xs font-bold border border-slate-700"
                  >
                    Change Receipt
                  </button>
                </div>
              ) : (
                <label className="border-2 border-dashed border-slate-800 hover:border-slate-700 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer bg-slate-950 transition">
                  <Upload className="w-6 h-6 text-slate-500 mb-1" />
                  <span className="text-xs text-slate-400">{t.uploadReceiptHint}</span>
                  <span className="text-[10px] text-slate-500 mt-1">PNG, JPG or Screenshot</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition duration-150 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>{t.submittingBtn}</span>
              ) : (
                <>
                  <FileCheck className="w-4 h-4" />
                  <span>{t.submitFormBtn}</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right Info Box: Bank Details & Summary */}
        <div className="lg:col-span-5 space-y-5">
          {/* Target Bank Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-white text-base">
                Deposit Destination
              </h3>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 font-semibold">{selectedBank.name}</span>
                <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-900 font-semibold">
                  Official Account
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">
                  {t.accountHolder}
                </span>
                <span className="text-xs font-bold text-white">
                  {selectedBank.accountName}
                </span>
              </div>

              <div className="bg-slate-900 p-3 rounded-xl border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-400 block font-mono">
                    Account / Number
                  </span>
                  <span className="text-base font-mono font-bold text-amber-400">
                    {selectedBank.accountNumber}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyBank}
                  className="p-2 text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition"
                  title="Copy Account Number"
                >
                  {copiedAccount ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed pt-1">
                {selectedBank.instructions[language]}
              </p>
            </div>

            {/* Total Summary */}
            <div className="border-t border-slate-800 pt-4 space-y-2">
              {selectedNumbers.length > 0 && (
                <div className="flex justify-between items-center text-xs text-slate-400">
                  <span>Lucky Choice{selectedNumbers.length > 1 ? 's' : ''}:</span>
                  <span className="text-amber-400 font-mono font-bold">
                    {selectedNumbers.map(n => `#${n}`).join(', ')}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center text-xs text-slate-400">
                <span>Tickets:</span>
                <span className="text-white font-semibold">{ticketQuantity} ticket{ticketQuantity > 1 ? 's' : ''}</span>
              </div>
              <div className="flex justify-between items-center text-sm font-bold text-white">
                <span>{t.totalAmountLabel}:</span>
                <span className="text-amber-400 text-lg">
                  {calculateTotal(ticketQuantity).toLocaleString()} {t.birr}
                </span>
              </div>
            </div>
          </div>

          {/* Support and Location Box */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-bold">
              <ShieldCheck className="w-5 h-5 flex-shrink-0" />
              <span>Verified BYD Promotion Office</span>
            </div>
            <div className="text-xs text-slate-400 space-y-1.5 pt-1">
              <p>📍 {CONTACT_INFO.address}</p>
              <p>📞 Phone: {CONTACT_INFO.phones.join(' / ')}</p>
              <p>✉️ Email: {CONTACT_INFO.email}</p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
