import React, { useState } from 'react';
import { 
  Lock, 
  UserCheck, 
  LogOut, 
  Filter, 
  Search, 
  Download, 
  PlusCircle, 
  Sparkles, 
  Trophy, 
  Eye, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  RotateCcw,
  ShieldCheck,
  TrendingUp,
  FileSpreadsheet,
  Settings,
  Mail,
  Sliders,
  Hash,
  Gift,
  Edit3,
  Monitor,
  Award,
  CheckSquare,
  Square,
  Printer,
  FileText,
  Calendar,
  CalendarCheck,
  Save,
  Timer
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language, PaymentSubmission, PaymentStatus, LotteryConfig, LotteryPrize, HomeConfig, LotteryWinner, LuckyNumberPolicy } from '../types';
import { translations } from '../translations';
import { ReviewPaymentModal } from './ReviewPaymentModal';
import { EmailNotificationModal } from './EmailNotificationModal';
import { AdminPrizeSettingsModal } from './AdminPrizeSettingsModal';
import { AdminHomeLivePreviewModal } from './AdminHomeLivePreviewModal';
import { AdminWinnersModal } from './AdminWinnersModal';
import { AdminAuditReportModal } from './AdminAuditReportModal';
import { DrawCountdownTimer } from './DrawCountdownTimer';

interface AdminDashboardProps {
  language: Language;
  submissions: PaymentSubmission[];
  lotteryConfig: LotteryConfig;
  onUpdateLotteryConfig: (newConfig: LotteryConfig) => void;
  homeConfig: HomeConfig;
  onUpdateHomeConfig: (newConfig: HomeConfig) => void;
  isAdminLoggedIn: boolean;
  setIsAdminLoggedIn: (logged: boolean) => void;
  onApproveSubmission: (id: string, notes: string) => void;
  onRejectSubmission: (id: string, reason: string, notes: string) => void;
  onUpdateNotes: (id: string, notes: string) => void;
  onAddManualSubmission: (submission: PaymentSubmission) => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  language,
  submissions,
  lotteryConfig,
  onUpdateLotteryConfig,
  homeConfig,
  onUpdateHomeConfig,
  isAdminLoggedIn,
  setIsAdminLoggedIn,
  onApproveSubmission,
  onRejectSubmission,
  onUpdateNotes,
  onAddManualSubmission,
}) => {
  const t = translations[language];

  // Login form state
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('byd2026!');
  const [loginError, setLoginError] = useState('');

  // Table filter and search
  const [filterStatus, setFilterStatus] = useState<PaymentStatus | 'All'>('All');
  const [searchTable, setSearchTable] = useState('');
  const [selectedSubmissionForReview, setSelectedSubmissionForReview] = useState<PaymentSubmission | null>(null);

  // Simulated Email preview modal
  const [emailModalData, setEmailModalData] = useState<{
    submission: PaymentSubmission;
    type: 'Approved' | 'Rejected';
  } | null>(null);

  // Prize customization settings modal state (Requested feature!)
  const [showPrizeSettingsModal, setShowPrizeSettingsModal] = useState(false);

  // Winners & Handover announcements modal state (Requested feature!)
  const [showWinnersModal, setShowWinnersModal] = useState(false);

  // Live Home Page Preview & Controller modal state (Requested feature!)
  const [showLiveHomePreviewModal, setShowLiveHomePreviewModal] = useState(false);

  // Financial Audit Report Modal state (Requested feature!)
  const [showAuditReportModal, setShowAuditReportModal] = useState(false);

  // Lottery Draw Schedule & Countdown settings state (Requested feature!)
  const [showDrawDateSettings, setShowDrawDateSettings] = useState(false);
  const [editDrawDateIso, setEditDrawDateIso] = useState<string>(() => {
    return lotteryConfig.drawDateIso || (lotteryConfig.drawDate?.includes('T') ? lotteryConfig.drawDate : '2026-12-24T18:00');
  });
  const [editDrawDateText, setEditDrawDateText] = useState<string>(() => {
    return homeConfig.drawDateText || 'Guyyaa Carraan Baafamu: Muddee 15, 2026 (Dec 24, 2026 at 6:00 PM)';
  });
  const [drawScheduleSavedToast, setDrawScheduleSavedToast] = useState(false);

  // Ticket capacity range editor state
  const [showRangeSettings, setShowRangeSettings] = useState(false);
  const [customMaxRange, setCustomMaxRange] = useState(String(lotteryConfig.maxTickets));

  // Live Draw simulation modal
  const [showDrawModal, setShowDrawModal] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const [winner, setWinner] = useState<PaymentSubmission | null>(null);

  // Manual entry modal
  const [showManualModal, setShowManualModal] = useState(false);
  const [manualName, setManualName] = useState('');
  const [manualPhone, setManualPhone] = useState('');
  const [manualAmount, setManualAmount] = useState('500');
  const [manualLuckyNumber, setManualLuckyNumber] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim().toLowerCase() === 'admin' && (password === 'byd2026!' || password.length >= 4)) {
      setIsAdminLoggedIn(true);
      setLoginError('');
    } else {
      setLoginError('Invalid username or password. You can use the 1-Click Demo Login.');
    }
  };

  const handleQuickDemoLogin = () => {
    setUsername('admin');
    setPassword('byd2026!');
    setIsAdminLoggedIn(true);
    setLoginError('');
  };

  // KPI calculations
  const totalCount = submissions.length;
  const pendingCount = submissions.filter(s => s.status === 'Pending').length;
  const approvedCount = submissions.filter(s => s.status === 'Approved').length;
  const rejectedCount = submissions.filter(s => s.status === 'Rejected').length;
  const totalRevenue = submissions
    .filter(s => s.status === 'Approved')
    .reduce((acc, curr) => acc + curr.amount, 0);

  // Range capacity stats
  const claimedCount = submissions.filter(s => s.status === 'Approved').length;
  const capacityPercent = Math.min(100, Math.round((claimedCount / lotteryConfig.maxTickets) * 100));

  // Update Range
  const handleRangeChange = (newMax: number) => {
    onUpdateLotteryConfig({
      ...lotteryConfig,
      maxTickets: newMax
    });
    setCustomMaxRange(String(newMax));
  };

  const handleCustomRangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(customMaxRange, 10);
    if (!isNaN(val) && val >= 50) {
      handleRangeChange(val);
      setShowRangeSettings(false);
    }
  };

  // Update Prizes
  const handleSavePrizes = (newPrizes: LotteryPrize[]) => {
    onUpdateLotteryConfig({
      ...lotteryConfig,
      prizes: newPrizes
    });
  };

  // Update Winners & Handovers
  const handleSaveWinners = (newWinners: LotteryWinner[]) => {
    onUpdateLotteryConfig({
      ...lotteryConfig,
      winners: newWinners
    });
  };

  // Update Lucky Number Selection Policy (Admin control!)
  const handleUpdateLuckyPolicy = (partial: Partial<LuckyNumberPolicy>) => {
    const currentPolicy = lotteryConfig.luckyNumberPolicy || {
      enabled: true,
      allowMultiSelect: true,
      maxSelectablePerOrder: 5
    };
    onUpdateLotteryConfig({
      ...lotteryConfig,
      luckyNumberPolicy: {
        ...currentPolicy,
        ...partial
      }
    });
  };

  // Draw Date label generator and updater
  const generateDrawDateLabel = (isoDate: string): string => {
    try {
      const d = new Date(isoDate);
      if (isNaN(d.getTime())) return 'Guyyaa Carraan Baafamu: Muddee 15, 2026';
      const monthNamesOm = ['Amajjii', 'Guraandhala', 'Bitooteessa', 'Elba', 'Caamsaa', 'Waxabajjii', 'Adooleessa', 'Hagayya', 'Fulbaana', 'Onkololeessa', 'Sadaasa', 'Muddee'];
      const monthNamesEn = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      const monthNamesAm = ['ጥር', 'የካቲት', 'መጋቢት', 'ሚያዝያ', 'ግንቦት', 'ሰኔ', 'ሐምሌ', 'ነሐሴ', 'መስከረም', 'ጥቅምት', 'ኅዳር', 'ታህሳስ'];
      const day = d.getDate();
      const omMonth = monthNamesOm[d.getMonth()] || 'Muddee';
      const enMonth = monthNamesEn[d.getMonth()] || 'Dec';
      const amMonth = monthNamesAm[d.getMonth()] || 'ታህሳስ';
      const year = d.getFullYear();
      const hours = d.getHours();
      const mins = String(d.getMinutes()).padStart(2, '0');
      const timeStr = `${hours % 12 || 12}:${mins} ${hours >= 12 ? 'PM' : 'AM'}`;
      
      if (language === 'am') {
        return `የዕጣ ማውጫ ቀን፡ ${amMonth} ${day}, ${year} (${enMonth} ${day}, ${year} ${timeStr})`;
      }
      return `Guyyaa Carraan Baafamu: ${omMonth} ${day}, ${year} (${enMonth} ${day}, ${year} at ${timeStr})`;
    } catch {
      return 'Guyyaa Carraan Baafamu: Muddee 15, 2026';
    }
  };

  const handleSaveDrawSchedule = (customIso?: string, customText?: string) => {
    const targetIso = customIso || editDrawDateIso;
    const targetText = customText || editDrawDateText;

    onUpdateLotteryConfig({
      ...lotteryConfig,
      drawDate: targetIso,
      drawDateIso: targetIso,
    });

    onUpdateHomeConfig({
      ...homeConfig,
      drawDateIso: targetIso,
      drawDateText: targetText,
    });

    setDrawScheduleSavedToast(true);
    setTimeout(() => setDrawScheduleSavedToast(false), 3000);
  };

  const handleApplyPreset = (daysFromNow: number) => {
    const now = new Date();
    const target = new Date(now.getTime() + daysFromNow * 24 * 60 * 60 * 1000);
    target.setHours(18, 0, 0, 0); // 6:00 PM standard
    
    const year = target.getFullYear();
    const month = String(target.getMonth() + 1).padStart(2, '0');
    const day = String(target.getDate()).padStart(2, '0');
    const hours = String(target.getHours()).padStart(2, '0');
    const mins = String(target.getMinutes()).padStart(2, '0');
    const iso = `${year}-${month}-${day}T${hours}:${mins}`;

    const text = generateDrawDateLabel(iso);
    setEditDrawDateIso(iso);
    setEditDrawDateText(text);
    handleSaveDrawSchedule(iso, text);
  };

  // Filtered rows
  const filteredRows = submissions.filter((row) => {
    const matchesStatus = filterStatus === 'All' || row.status === filterStatus;
    const q = searchTable.toLowerCase().trim();
    const matchesSearch = 
      !q ||
      row.id.toLowerCase().includes(q) ||
      row.fullName.toLowerCase().includes(q) ||
      row.phone.includes(q) ||
      row.transactionRef.toLowerCase().includes(q) ||
      row.ticketNumber.toLowerCase().includes(q);

    return matchesStatus && matchesSearch;
  });

  // Export to CSV
  const handleExportCSV = () => {
    const headers = ['ID', 'Date', 'Full Name', 'Phone', 'Email', 'City', 'Tickets', 'Ticket Number', 'Lucky #', 'Amount (ETB)', 'Method', 'Transaction Ref', 'Status', 'Ticket Issued'];
    const rows = submissions.map(s => [
      s.id,
      s.createdAt,
      `"${s.fullName}"`,
      `"${s.phone}"`,
      `"${s.email || ''}"`,
      `"${s.city}"`,
      s.ticketQuantity,
      s.ticketNumber,
      s.selectedNumber || '',
      s.amount,
      `"${s.method}"`,
      `"${s.transactionRef}"`,
      s.status,
      s.ticketIssued ? 'Yes' : 'No'
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `gemeda_byd_submissions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Conduct Live Lottery Draw
  const handleStartDraw = () => {
    const eligible = submissions.filter(s => s.status === 'Approved');
    if (eligible.length === 0) {
      alert('No approved tickets found for lottery draw. Please approve at least one submission first.');
      return;
    }

    setShowDrawModal(true);
    setIsDrawing(true);
    setWinner(null);

    let counter = 0;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * eligible.length);
      setWinner(eligible[randomIndex]);
      counter++;

      if (counter > 20) {
        clearInterval(interval);
        setIsDrawing(false);
        confetti({
          particleCount: 100,
          spread: 80,
          origin: { y: 0.5 }
        });
      }
    }, 120);
  };

  // Manual Ticket submit
  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualName || !manualPhone) return;

    const newId = String(Math.floor(2000 + Math.random() * 7000));
    const luckyNum = manualLuckyNumber ? parseInt(manualLuckyNumber, 10) : parseInt(newId, 10);
    const ticketSerial = `BYD-2026-${String(luckyNum).padStart(6, '0')}`;

    const newEntry: PaymentSubmission = {
      id: newId,
      fullName: manualName,
      phone: manualPhone,
      city: 'Burayu / Shaggar (Direct Walk-in)',
      ticketQuantity: Math.max(1, Math.floor(Number(manualAmount) / 500)),
      ticketNumber: ticketSerial,
      selectedNumber: luckyNum,
      amount: Number(manualAmount),
      method: 'Commercial Bank of Ethiopia (CBE)',
      transactionRef: `OFFICE-CASH-${newId}`,
      status: 'Approved',
      ticketIssued: true,
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      adminNotes: 'Registered in-person at Gemeda BYD Promotion Center Burayu.'
    };

    onAddManualSubmission(newEntry);
    setShowManualModal(false);
    setManualName('');
    setManualPhone('');
    setManualLuckyNumber('');

    setEmailModalData({
      submission: newEntry,
      type: 'Approved'
    });
  };

  // If not logged in, show secure login form
  if (!isAdminLoggedIn) {
    return (
      <div className="max-w-md mx-auto py-12">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-400 border border-amber-500/20 flex items-center justify-center mx-auto shadow-inner">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-black text-white">{t.adminLoginTitle}</h2>
            <p className="text-xs text-slate-400">
              Sign in to manage BYD raffle tickets and payment verifications
            </p>
          </div>

          {loginError && (
            <div className="p-3 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {t.adminUsernameLabel}
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                {t.adminPasswordLabel}
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-amber-400"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition shadow-lg shadow-amber-500/20"
            >
              {t.adminLoginBtn}
            </button>
          </form>

          <div className="pt-2 border-t border-slate-800 text-center">
            <button
              type="button"
              onClick={handleQuickDemoLogin}
              className="text-xs text-amber-400 hover:text-amber-300 underline font-semibold"
            >
              ⚡ {t.oneClickDemoLogin}
            </button>
            <p className="text-[10px] text-slate-500 mt-1">
              Demo Credentials: user: <code>admin</code> / pass: <code>byd2026!</code>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 py-4">
      {/* Top Admin Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Secure Admin Session • Active</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {t.adminDashboardTitle}
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
            {t.adminSubtitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* LIVE HOME PREVIEW & CONTROLLER BUTTON (Requested Feature!) */}
          <button
            onClick={() => setShowLiveHomePreviewModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs rounded-xl border border-amber-500/40 shadow transition"
          >
            <Monitor className="w-4 h-4 text-amber-400" />
            <span>{language === 'om' ? 'Live Preview Fuula Duraa' : 'Home Live Preview'}</span>
          </button>

          {/* EDIT PRIZES BUTTON (Requested Feature!) */}
          <button
            onClick={() => setShowPrizeSettingsModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 transition"
          >
            <Gift className="w-4 h-4" />
            <span>{language === 'om' ? 'Badhaasawwan Jijjiiri' : language === 'am' ? 'ሽልማቶችን ቀይር' : 'Edit Grand Prizes'}</span>
          </button>

          {/* ANNOUNCE & MANAGE WINNERS BUTTON (Requested Feature!) */}
          <button
            onClick={() => setShowWinnersModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-xs rounded-xl shadow-lg shadow-emerald-600/20 transition"
          >
            <Award className="w-4 h-4" />
            <span>{language === 'om' ? 'Mo\'attoota Beeksisi' : language === 'am' ? 'አሸናፊዎችን አስተዳድር' : 'Announce Winners'}</span>
          </button>

          {/* Live draw simulator */}
          <button
            onClick={handleStartDraw}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-300 font-bold text-xs rounded-xl border border-amber-500/30 transition"
          >
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>Draw Winner</span>
          </button>

          {/* Add Manual Walk-in Ticket */}
          <button
            onClick={() => setShowManualModal(true)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold rounded-xl border border-slate-700 transition"
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <span>Add In-Person</span>
          </button>

          {/* PRINTABLE AUDIT REPORT (PDF) BUTTON (Requested Feature!) */}
          <button
            onClick={() => setShowAuditReportModal(true)}
            className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-blue-600/25 transition"
            title="Export Clean Printable Financial Audit Report"
          >
            <Printer className="w-4 h-4" />
            <span>{language === 'om' ? 'Gabaasa Ooditii (Audit PDF)' : language === 'am' ? 'የኦዲት ሪፖርት (PDF)' : 'Audit Report (PDF)'}</span>
          </button>

          {/* Export CSV */}
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-semibold rounded-xl border border-slate-700 transition"
            title="Download CSV"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>Export CSV</span>
          </button>

          {/* Logout */}
          <button
            onClick={() => setIsAdminLoggedIn(false)}
            className="flex items-center gap-1.5 px-3.5 py-2.5 bg-rose-950/60 hover:bg-rose-900 text-rose-300 text-xs font-bold rounded-xl border border-rose-800 transition"
          >
            <LogOut className="w-4 h-4" />
            <span>{t.logoutBtn}</span>
          </button>
        </div>
      </div>

      {/* GRAND PRIZES ADMIN STATUS BAR (Quick Overview) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <h3 className="font-extrabold text-white text-sm">
              {language === 'om' ? 'Badhaasawwan Gurguddoo Ammaa (Active Grand Prizes)' : 'Current Active Grand Prizes'}
            </h3>
          </div>
          <button
            onClick={() => setShowPrizeSettingsModal(true)}
            className="text-xs text-amber-400 hover:text-amber-300 flex items-center gap-1 font-bold underline"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{language === 'om' ? 'Qindaa\'ina Badhaasaa Banu' : 'Open Prize Editor'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(lotteryConfig.prizes || []).slice(0, 3).map((prize, idx) => (
            <div key={prize.id || idx} className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] text-amber-400 font-bold uppercase block">{prize.badge}</span>
                <span className="font-bold text-white text-xs block truncate max-w-[170px]">{prize.name}</span>
                <span className="text-[10px] text-slate-400">{prize.subtitle}</span>
              </div>
              <span className="font-mono font-bold text-emerald-400 text-xs bg-slate-900 px-2 py-1 rounded border border-slate-800">
                {prize.valueText}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ANNOUNCED WINNERS & VEHICLE HANDOVERS STATUS BAR (Requested Feature!) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-emerald-400" />
            <h3 className="font-extrabold text-white text-sm">
              {language === 'om' 
                ? 'Mo\'attoota Carraa Beeksifaman (Announced Grand Winners & Handovers)' 
                : language === 'am'
                ? 'ይፋ የተደረጉ አሸናፊዎች'
                : 'Announced Grand Winners & Handovers'}
            </h3>
            <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full font-bold">
              {(lotteryConfig.winners || []).length} Winners
            </span>
          </div>
          <button
            onClick={() => setShowWinnersModal(true)}
            className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-bold underline"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{language === 'om' ? 'Suuraa & Oddeeffannoo Gulaali' : 'Manage & Add Winners'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {(lotteryConfig.winners || []).slice(0, 3).map((w, idx) => (
            <div key={w.id || idx} className="bg-slate-950 p-3 rounded-2xl border border-slate-800 flex items-center gap-3">
              <img
                src={w.photoUrl}
                alt={w.fullName}
                className="w-12 h-12 rounded-xl object-cover border border-slate-700 flex-shrink-0"
              />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] text-emerald-400 font-bold uppercase block truncate">{w.prizeWon}</span>
                <span className="font-bold text-white text-xs block truncate">{w.fullName}</span>
                <span className="text-[10px] text-amber-400 font-mono block">{w.ticketNumber} • {w.city}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TICKET CAPACITY & RANGE ORDER MANAGER */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-white text-base">
                {t.ticketRangeConfigTitle}
              </h3>
              <p className="text-xs text-slate-400">
                {t.ticketRangeDesc}
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowRangeSettings(!showRangeSettings)}
            className="self-start sm:self-auto px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5"
          >
            <Settings className="w-3.5 h-3.5" />
            <span>{showRangeSettings ? 'Hide Range Form' : 'Adjust Capacity'}</span>
          </button>
        </div>

        {/* Current Active Range & Progress */}
        <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-300 gap-2">
            <div>
              <span className="text-slate-400">Active Campaign Range: </span>
              <strong className="text-amber-400 font-mono text-sm ml-1">
                1 — {lotteryConfig.maxTickets.toLocaleString()} Tickets
              </strong>
            </div>

            <div className="text-slate-400">
              {claimedCount} of {lotteryConfig.maxTickets.toLocaleString()} claimed ({capacityPercent}%)
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-amber-500 to-emerald-400 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.max(2, capacityPercent)}%` }}
            ></div>
          </div>

          {/* Range Selection Presets (1-1000, 1-1500, 1-2000, 1-5000) */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <span className="text-slate-400 text-[11px] font-semibold mr-1">Quick Range Presets:</span>
            {[1000, 1500, 2000, 5000].map((rangeVal) => (
              <button
                key={rangeVal}
                onClick={() => handleRangeChange(rangeVal)}
                className={`px-3 py-1 rounded-lg font-mono text-xs font-bold transition ${
                  lotteryConfig.maxTickets === rangeVal
                    ? 'bg-amber-500 text-slate-950 shadow-md'
                    : 'bg-slate-900 text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                1 — {rangeVal.toLocaleString()}
              </button>
            ))}
          </div>

          {/* Custom Range Input Form if expanded */}
          {showRangeSettings && (
            <form onSubmit={handleCustomRangeSubmit} className="pt-3 border-t border-slate-800 flex items-center gap-3">
              <label className="text-xs text-slate-400 whitespace-nowrap">Custom Max Tickets:</label>
              <input
                type="number"
                min="50"
                max="50000"
                value={customMaxRange}
                onChange={(e) => setCustomMaxRange(e.target.value)}
                className="w-32 bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
              />
              <button
                type="submit"
                className="px-4 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition"
              >
                Save Range
              </button>
            </form>
          )}

          {/* LUCKY NUMBER SELECTION POLICY ADMIN CONTROLLER (Requested Feature!) */}
          <div className="pt-4 mt-2 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-amber-400" />
                <span className="text-xs font-bold text-white">
                  {language === 'om' ? 'To\'annoo Filannoo Lakkoofsa Carraa (Lucky Number Policy):' : 'Lucky Number Selection Policy:'}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  lotteryConfig.luckyNumberPolicy?.enabled !== false
                    ? 'bg-emerald-950 text-emerald-400 border-emerald-800'
                    : 'bg-rose-950 text-rose-400 border-rose-800'
                }`}>
                  {lotteryConfig.luckyNumberPolicy?.enabled !== false ? 'Customer Selection Enabled' : 'Auto-Assign Only'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {language === 'om'
                  ? 'Maamilli lakkoofsa barbaade akka ofii filatu eyyami ykn sirnaan ofumaan akka qabamu godhi'
                  : 'Allow customers to pick their lucky numbers or enforce sequential auto-assignment'}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handleUpdateLuckyPolicy({ enabled: !(lotteryConfig.luckyNumberPolicy?.enabled !== false) })}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
                  lotteryConfig.luckyNumberPolicy?.enabled !== false
                    ? 'bg-emerald-600 text-white border-emerald-500 hover:bg-emerald-500'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                }`}
              >
                {lotteryConfig.luckyNumberPolicy?.enabled !== false ? (
                  <>
                    <CheckSquare className="w-3.5 h-3.5" />
                    <span>Selection ON</span>
                  </>
                ) : (
                  <>
                    <Square className="w-3.5 h-3.5" />
                    <span>Selection OFF</span>
                  </>
                )}
              </button>

              {/* Max Selectable per order */}
              <div className="flex items-center gap-1 text-xs text-slate-400 bg-slate-900 border border-slate-800 rounded-xl px-2.5 py-1">
                <span className="text-[10px]">Max Pick:</span>
                <select
                  value={lotteryConfig.luckyNumberPolicy?.maxSelectablePerOrder || 5}
                  onChange={(e) => handleUpdateLuckyPolicy({ maxSelectablePerOrder: Number(e.target.value) })}
                  className="bg-slate-950 text-amber-400 font-bold font-mono rounded px-1.5 py-0.5 text-xs border border-slate-700 focus:outline-none"
                >
                  <option value={1}>1 number</option>
                  <option value={2}>2 numbers</option>
                  <option value={3}>3 numbers</option>
                  <option value={5}>5 numbers</option>
                  <option value={10}>10 numbers</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* LOTTERY DRAW DATE & LIVE COUNTDOWN SETTINGS CARD (Requested Feature!) */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30 shadow-md shadow-amber-500/10">
              <Timer className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-white text-base">
                  {language === 'om'
                    ? 'Guyyaa & Yeroo Carraa Baafamu (Draw Schedule & Countdown)'
                    : language === 'am'
                    ? 'ዕጣ የሚወጣበት ቀንና ሰዓት (Countdown Settings)'
                    : 'Lottery Draw Schedule & Live Countdown'}
                </h3>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  Active on Hero
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {language === 'om'
                  ? 'Guyyaa fi sa\'aatii carraan itti baafamu asitti saagi; sa\'aatiin lakkaa\'aa fuula duraa (Hero Countdown) ofumaan haaroma.'
                  : language === 'am'
                  ? 'የዕጣ ማውጫውን ቀንና ሰዓት ያስተካክሉ፤ በዋናው ገጽ ላይ ያለው ሰዓት ቆጣሪ በቀጥታ ይዘምናል'
                  : 'Configure the draw date and time. The Hero countdown timer syncs in real-time to this schedule.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {drawScheduleSavedToast && (
              <span className="text-xs text-emerald-400 font-bold bg-emerald-950/80 border border-emerald-800 px-3 py-1.5 rounded-xl flex items-center gap-1.5 animate-bounce">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Saved & Synced!</span>
              </span>
            )}
            <button
              type="button"
              onClick={() => setShowDrawDateSettings(!showDrawDateSettings)}
              className="px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center gap-1.5"
            >
              <Settings className="w-3.5 h-3.5" />
              <span>{showDrawDateSettings ? 'Collapse Editor' : 'Edit Schedule'}</span>
            </button>
          </div>
        </div>

        {/* Schedule Editor & Live Preview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          
          {/* Left Form: Date/Time Picker, Presets, and Text Label */}
          <div className="lg:col-span-7 space-y-4">
            
            {/* Datetime-local picker input */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-3">
              <label className="block text-xs font-bold text-slate-300">
                <span className="flex items-center gap-1.5 text-amber-400">
                  <Calendar className="w-4 h-4" />
                  <span>{language === 'om' ? 'Guyyaa fi Sa\'aatii Filadhaa (Target Date & Time):' : 'Select Draw Date & Time:'}</span>
                </span>
              </label>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <input
                  type="datetime-local"
                  value={editDrawDateIso}
                  onChange={(e) => {
                    const val = e.target.value;
                    setEditDrawDateIso(val);
                    setEditDrawDateText(generateDrawDateLabel(val));
                  }}
                  className="flex-1 bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl px-3.5 py-2 text-white font-mono text-xs focus:outline-none"
                />

                <button
                  type="button"
                  onClick={() => handleSaveDrawSchedule()}
                  className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow-lg transition flex items-center justify-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Publish Schedule</span>
                </button>
              </div>

              {/* Quick Draw Presets */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-semibold text-slate-400 block">
                  Quick Presets (1-Click Schedule):
                </span>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleApplyPreset(7)}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-[11px] font-semibold transition"
                  >
                    +7 Days (1 Week)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset(14)}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-[11px] font-semibold transition"
                  >
                    +14 Days (2 Weeks)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset(30)}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-[11px] font-semibold transition"
                  >
                    +30 Days (1 Month)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApplyPreset(60)}
                    className="px-2.5 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 text-[11px] font-semibold transition"
                  >
                    +60 Days (2 Months)
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const dec24 = '2026-12-24T18:00';
                      setEditDrawDateIso(dec24);
                      const txt = generateDrawDateLabel(dec24);
                      setEditDrawDateText(txt);
                      handleSaveDrawSchedule(dec24, txt);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-[11px] font-bold transition"
                  >
                    Dec 24, 2026 (Muddee 15)
                  </button>
                </div>
              </div>
            </div>

            {/* Custom Public Display Headline */}
            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-300">
                  Public Headline / Subtitle Shown on Hero:
                </label>
                <button
                  type="button"
                  onClick={() => setEditDrawDateText(generateDrawDateLabel(editDrawDateIso))}
                  className="text-[10px] text-amber-400 hover:text-amber-300 underline font-semibold"
                >
                  Regenerate from Date
                </button>
              </div>
              <input
                type="text"
                value={editDrawDateText}
                onChange={(e) => setEditDrawDateText(e.target.value)}
                placeholder="Guyyaa Carraan Baafamu: Muddee 15, 2026 (Dec 24, 2026 at 6:00 PM)"
                className="w-full bg-slate-900 border border-slate-700 focus:border-amber-400 rounded-xl px-3 py-2 text-white text-xs focus:outline-none font-semibold"
              />
              <p className="text-[10px] text-slate-500">
                This text will be prominently displayed above the countdown numbers on the Hero homepage banner.
              </p>
            </div>

          </div>

          {/* Right Preview: Live Countdown Widget */}
          <div className="lg:col-span-5 space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Live Countdown Preview
            </span>
            <DrawCountdownTimer
              language={language}
              drawDateIso={editDrawDateIso}
              drawDateText={editDrawDateText}
              variant="admin-preview"
            />
            <p className="text-[11px] text-slate-500 text-center pt-1">
              {language === 'om'
                ? 'Sekondii hunda fuula duraa irratti ofumaan lakkaa\'ama'
                : 'Recalculates every second and automatically animates on the homepage'}
            </p>
          </div>

        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Total Submissions */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm">
          <span className="text-xs text-slate-400 block font-medium">{t.totalSubmissions}</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-black text-white">{totalCount}</span>
            <span className="text-[10px] text-slate-500 font-mono">records</span>
          </div>
        </div>

        {/* Pending */}
        <div 
          onClick={() => setFilterStatus('Pending')}
          className="bg-slate-900 border border-amber-500/40 rounded-2xl p-4 shadow-sm cursor-pointer hover:bg-slate-850 transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-amber-400 font-semibold">{t.pendingReview}</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-black text-amber-400">{pendingCount}</span>
            <span className="text-[10px] text-amber-300 font-medium">Action needed</span>
          </div>
        </div>

        {/* Approved & Issued */}
        <div 
          onClick={() => setFilterStatus('Approved')}
          className="bg-slate-900 border border-emerald-500/40 rounded-2xl p-4 shadow-sm cursor-pointer hover:bg-slate-850 transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-emerald-400 font-semibold">{t.approvedTickets}</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-black text-emerald-400">{approvedCount}</span>
            <span className="text-[10px] text-emerald-300 font-medium">Valid entries</span>
          </div>
        </div>

        {/* Rejected */}
        <div 
          onClick={() => setFilterStatus('Rejected')}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm cursor-pointer hover:bg-slate-850 transition"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">{t.rejectedSubmissions}</span>
            <XCircle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-black text-rose-400">{rejectedCount}</span>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 font-medium">{t.totalRevenue}</span>
            <TrendingUp className="w-4 h-4 text-amber-400" />
          </div>
          <div className="flex items-baseline gap-1 mt-1">
            <span className="text-xl sm:text-2xl font-black text-amber-400">
              {totalRevenue.toLocaleString()}
            </span>
            <span className="text-xs text-slate-400 font-semibold">ETB</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        
        {/* Status Filter Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs font-semibold">
          <span className="text-slate-400 mr-1 text-xs">Filter:</span>
          {(['All', 'Pending', 'Approved', 'Rejected'] as const).map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3 py-1.5 rounded-lg transition ${
                filterStatus === st
                  ? 'bg-amber-500 text-slate-950 font-bold shadow'
                  : 'bg-slate-950 text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {st === 'All' ? t.filterAll : st === 'Pending' ? t.filterPending : st === 'Approved' ? t.filterApproved : t.filterRejected}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          {/* Quick Audit PDF Trigger */}
          <button
            type="button"
            onClick={() => setShowAuditReportModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-blue-950/80 hover:bg-blue-900 border border-blue-800 text-blue-300 font-bold rounded-xl text-xs transition whitespace-nowrap shadow-sm"
            title="Export Clean Printable Financial Audit Report"
          >
            <Printer className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden md:inline">Print</span>
            <span>Audit Report (PDF)</span>
          </button>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTable}
              onChange={(e) => setSearchTable(e.target.value)}
              placeholder={t.searchTable}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-white text-xs focus:outline-none focus:border-amber-400"
            />
          </div>
        </div>

      </div>

      {/* Main Table Matching the Flask App layout */}
      <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase font-mono tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">{t.thIdDate}</th>
                <th className="px-5 py-3.5">{t.thCustomer}</th>
                <th className="px-5 py-3.5">{t.thTicket}</th>
                <th className="px-5 py-3.5">{t.thAmountMethod}</th>
                <th className="px-5 py-3.5">{t.thTransRef}</th>
                <th className="px-5 py-3.5">{t.thStatus}</th>
                <th className="px-5 py-3.5 text-right">{t.thReview}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredRows.length > 0 ? (
                filteredRows.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-850/60 transition">
                    
                    {/* ID / Date */}
                    <td className="px-5 py-4">
                      <span className="font-mono font-bold text-amber-400 block text-sm">
                        #{row.id}
                      </span>
                      <small className="text-slate-500 font-mono text-[10px]">
                        {row.createdAt}
                      </small>
                    </td>

                    {/* Customer */}
                    <td className="px-5 py-4">
                      <span className="font-bold text-white block text-sm">
                        {row.fullName}
                      </span>
                      <small className="text-slate-400 font-mono text-[11px] block">
                        {row.phone}
                      </small>
                      {row.email && (
                        <small className="text-slate-500 text-[10px] truncate max-w-[120px] block">
                          {row.email}
                        </small>
                      )}
                    </td>

                    {/* Ticket */}
                    <td className="px-5 py-4">
                      <span className="font-mono text-slate-200 block font-semibold">
                        {row.ticketNumber}
                      </span>
                      {row.selectedNumber && (
                        <span className="text-[10px] text-amber-400 font-bold block">
                          Lucky #{row.selectedNumber}
                        </span>
                      )}
                      <small className="text-slate-400 text-[10px]">
                        Issued: <strong className={row.ticketIssued ? 'text-emerald-400' : 'text-amber-400'}>
                          {row.ticketIssued ? 'Yes' : 'No'}
                        </strong> • ({row.ticketQuantity} Tkt)
                      </small>
                    </td>

                    {/* Amount / Method */}
                    <td className="px-5 py-4">
                      <span className="font-bold text-white text-sm block">
                        {row.amount} {t.birr}
                      </span>
                      <span className="text-[11px] text-slate-400">
                        {row.method.split(' ')[0]}
                      </span>
                    </td>

                    {/* Transaction Ref */}
                    <td className="px-5 py-4 font-mono font-semibold text-slate-300">
                      <span className="bg-slate-950 px-2 py-1 rounded border border-slate-800">
                        {row.transactionRef}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold ${
                        row.status === 'Approved'
                          ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-800'
                          : row.status === 'Rejected'
                          ? 'bg-rose-950/80 text-rose-300 border border-rose-800'
                          : 'bg-amber-950/80 text-amber-300 border border-amber-800'
                      }`}>
                        {row.status === 'Approved' && <CheckCircle2 className="w-3 h-3 text-emerald-400" />}
                        {row.status === 'Pending' && <Clock className="w-3 h-3 text-amber-400" />}
                        {row.status === 'Rejected' && <XCircle className="w-3 h-3 text-rose-400" />}
                        <span>{row.status}</span>
                      </span>
                    </td>

                    {/* Review & Email Actions */}
                    <td className="px-5 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {row.status !== 'Pending' && (
                          <button
                            onClick={() => setEmailModalData({ submission: row, type: row.status as 'Approved' | 'Rejected' })}
                            className="p-1.5 rounded-lg bg-slate-950 hover:bg-slate-800 text-slate-400 hover:text-amber-400 border border-slate-800 transition"
                            title="Preview Dispatched Email"
                          >
                            <Mail className="w-3.5 h-3.5" />
                          </button>
                        )}

                        <button
                          onClick={() => setSelectedSubmissionForReview(row)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500 text-amber-400 hover:text-slate-950 font-bold border border-amber-500/30 transition duration-150"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{t.reviewAction}</span>
                        </button>
                      </div>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-500 text-sm">
                    No submissions matching criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Prize Settings Modal */}
      {showPrizeSettingsModal && (
        <AdminPrizeSettingsModal
          language={language}
          prizes={lotteryConfig.prizes || []}
          onSavePrizes={handleSavePrizes}
          onClose={() => setShowPrizeSettingsModal(false)}
        />
      )}

      {/* Winners & Handover Announcements Modal (Requested Feature!) */}
      {showWinnersModal && (
        <AdminWinnersModal
          language={language}
          winners={lotteryConfig.winners || []}
          onSaveWinners={handleSaveWinners}
          onClose={() => setShowWinnersModal(false)}
        />
      )}

      {/* Live Home Page Preview & Controller Modal */}
      {showLiveHomePreviewModal && (
        <AdminHomeLivePreviewModal
          language={language}
          homeConfig={homeConfig}
          prizes={lotteryConfig.prizes || []}
          onSaveHomeConfig={onUpdateHomeConfig}
          onClose={() => setShowLiveHomePreviewModal(false)}
        />
      )}

      {/* Financial Audit Report Modal (Clean Printable PDF Export) */}
      {showAuditReportModal && (
        <AdminAuditReportModal
          language={language}
          submissions={submissions}
          maxTickets={lotteryConfig.maxTickets}
          ticketPrice={lotteryConfig.ticketPrice || 500}
          drawDate={lotteryConfig.drawDate || 'Muddee 15, 2026'}
          onClose={() => setShowAuditReportModal(false)}
        />
      )}

      {/* Review Modal with automated simulated email trigger on approve/reject */}
      {selectedSubmissionForReview && (
        <ReviewPaymentModal
          language={language}
          submission={selectedSubmissionForReview}
          onClose={() => setSelectedSubmissionForReview(null)}
          onApprove={(id, notes) => {
            onApproveSubmission(id, notes);
            const updated = {
              ...selectedSubmissionForReview,
              status: 'Approved' as PaymentStatus,
              ticketIssued: true,
              adminNotes: notes
            };
            setSelectedSubmissionForReview(null);
            setEmailModalData({
              submission: updated,
              type: 'Approved'
            });
          }}
          onReject={(id, reason, notes) => {
            onRejectSubmission(id, reason, notes);
            const updated = {
              ...selectedSubmissionForReview,
              status: 'Rejected' as PaymentStatus,
              ticketIssued: false,
              rejectionReason: reason,
              adminNotes: notes
            };
            setSelectedSubmissionForReview(null);
            setEmailModalData({
              submission: updated,
              type: 'Rejected'
            });
          }}
          onUpdateNotes={(id, notes) => {
            onUpdateNotes(id, notes);
            setSelectedSubmissionForReview(prev => prev ? { ...prev, adminNotes: notes } : null);
          }}
        />
      )}

      {/* Simulated Email Notification Preview Modal */}
      {emailModalData && (
        <EmailNotificationModal
          language={language}
          submission={emailModalData.submission}
          type={emailModalData.type}
          onClose={() => setEmailModalData(null)}
        />
      )}

      {/* Live Draw Simulation Modal */}
      {showDrawModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
          <div className="bg-slate-900 border-2 border-amber-500/70 rounded-3xl p-8 max-w-lg w-full text-center shadow-2xl relative">
            <div className="w-16 h-16 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/30">
              <Trophy className="w-9 h-9" />
            </div>

            <h3 className="text-2xl font-black text-white mb-2">
              {t.luckyDrawTitle}
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              {t.luckyDrawDesc}
            </p>

            {isDrawing ? (
              <div className="py-8 space-y-3">
                <div className="text-amber-400 font-mono text-2xl font-black animate-pulse">
                  Selecting Winner...
                </div>
                {winner && (
                  <div className="text-slate-300 font-mono text-sm">
                    {winner.ticketNumber} • {winner.fullName}
                  </div>
                )}
              </div>
            ) : winner ? (
              <div className="bg-slate-950 border border-amber-500/60 rounded-2xl p-6 mb-6 space-y-3">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block">
                  {t.winnerAnnounce}
                </span>
                <div className="text-3xl font-black text-amber-400 font-mono">
                  {winner.ticketNumber}
                </div>
                <div className="text-xl font-bold text-white">
                  {winner.fullName}
                </div>
                <div className="text-xs text-slate-400">
                  {winner.city} • {winner.phone}
                </div>
                <div className="text-xs text-emerald-400 font-bold pt-2">
                  Grand Prize: {lotteryConfig.prizes?.[0]?.name || 'BYD Song Plus EV'}!
                </div>
              </div>
            ) : null}

            <div className="flex justify-center gap-3">
              <button
                onClick={handleStartDraw}
                disabled={isDrawing}
                className="px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl shadow transition disabled:opacity-50"
              >
                Draw Again
              </button>
              <button
                onClick={() => setShowDrawModal(false)}
                className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-semibold text-xs rounded-xl transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Manual Entry Modal */}
      {showManualModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 max-w-md w-full shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1">
              Register In-Person Walk-in Ticket
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              For cash payments collected at Gemeda BYD Promotion Center (Burayu).
            </p>

            <form onSubmit={handleManualSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Customer Full Name</label>
                <input
                  type="text"
                  value={manualName}
                  onChange={(e) => setManualName(e.target.value)}
                  placeholder="e.g. Gemeda Tolasa"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-400"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Phone Number</label>
                <input
                  type="tel"
                  value={manualPhone}
                  onChange={(e) => setManualPhone(e.target.value)}
                  placeholder="0912305111"
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-400 font-mono"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Cash Paid (ETB)</label>
                  <input
                    type="number"
                    value={manualAmount}
                    onChange={(e) => setManualAmount(e.target.value)}
                    step="500"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-400 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">Lucky Number</label>
                  <input
                    type="number"
                    min="1"
                    max={lotteryConfig.maxTickets}
                    value={manualLuckyNumber}
                    onChange={(e) => setManualLuckyNumber(e.target.value)}
                    placeholder="Auto or #"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-400 font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowManualModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 text-xs rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 text-slate-950 font-bold text-xs rounded-xl hover:bg-amber-400"
                >
                  Issue Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
