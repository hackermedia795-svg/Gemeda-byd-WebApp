/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { HeroCarShowcase } from './components/HeroCarShowcase';
import { SubmitPaymentView } from './components/SubmitPaymentView';
import { StatusCheckView } from './components/StatusCheckView';
import { AdminDashboard } from './components/AdminDashboard';
import { Footer } from './components/Footer';
import { Language, PaymentSubmission, LotteryConfig, HomeConfig } from './types';
import { INITIAL_SUBMISSIONS, DEFAULT_LOTTERY_CONFIG, DEFAULT_HOME_CONFIG } from './data/seedData';

const STORAGE_KEY_SUBMISSIONS = 'gemeda_byd_submissions_v2';
const STORAGE_KEY_LANG = 'gemeda_byd_lang_v2';
const STORAGE_KEY_ADMIN_LOGGED = 'gemeda_byd_admin_auth_v2';
const STORAGE_KEY_LOTTERY_CONFIG = 'gemeda_byd_lottery_cfg_v2';
const STORAGE_KEY_HOME_CONFIG = 'gemeda_byd_home_cfg_v2';

export default function App() {
  // Language State - defaults to Afaan Oromoo as requested in prompt
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem(STORAGE_KEY_LANG);
    if (saved === 'en' || saved === 'am' || saved === 'om') return saved;
    return 'om';
  });

  // Active navigation tab
  const [currentTab, setCurrentTab] = useState<'home' | 'submit' | 'status' | 'admin'>('home');

  // Lottery Capacity Range Configuration (Admin can update: 1-1000, 1-1500, 1-2000, 1-5000, etc.)
  const [lotteryConfig, setLotteryConfig] = useState<LotteryConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_LOTTERY_CONFIG);
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_LOTTERY_CONFIG,
          ...parsed,
          prizes: parsed.prizes && parsed.prizes.length > 0 ? parsed.prizes : DEFAULT_LOTTERY_CONFIG.prizes
        };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_LOTTERY_CONFIG;
  });

  // Home Page Live Customization Configuration
  const [homeConfig, setHomeConfig] = useState<HomeConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_HOME_CONFIG);
      if (saved) {
        return {
          ...DEFAULT_HOME_CONFIG,
          ...JSON.parse(saved)
        };
      }
    } catch {
      // Fallback
    }
    return DEFAULT_HOME_CONFIG;
  });

  // Submissions State (with localStorage persistence)
  const [submissions, setSubmissions] = useState<PaymentSubmission[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_SUBMISSIONS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // Fallback
    }
    return INITIAL_SUBMISSIONS;
  });

  // Admin Auth State
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem(STORAGE_KEY_ADMIN_LOGGED) === 'true';
  });

  // Transient parameters between tabs
  const [preselectedQuantity, setPreselectedQuantity] = useState<number>(1);
  const [searchQueryForStatus, setSearchQueryForStatus] = useState<string>('');

  // Toast feedback banner
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Sync Submissions with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_SUBMISSIONS, JSON.stringify(submissions));
    } catch {
      // Ignore
    }
  }, [submissions]);

  // Sync Lottery Config with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LOTTERY_CONFIG, JSON.stringify(lotteryConfig));
    } catch {
      // Ignore
    }
  }, [lotteryConfig]);

  // Sync Home Config with localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_HOME_CONFIG, JSON.stringify(homeConfig));
    } catch {
      // Ignore
    }
  }, [homeConfig]);

  // Sync Language
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_LANG, language);
  }, [language]);

  // Sync Admin Auth
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_ADMIN_LOGGED, String(isAdminLoggedIn));
  }, [isAdminLoggedIn]);

  // Pending count for Admin badge
  const pendingCount = submissions.filter(s => s.status === 'Pending').length;

  // Handlers
  const handleAddNewSubmission = (newSub: PaymentSubmission) => {
    setSubmissions(prev => [newSub, ...prev]);
    showToast(
      language === 'om'
        ? `Galmeen #${newSub.id} milkaa'inaan ergameera!`
        : language === 'am'
        ? `ማመልከቻ #${newSub.id} በተሳካ ሁኔታ ተልኳል!`
        : `Submission #${newSub.id} sent successfully!`
    );
  };

  const handleApproveSubmission = (id: string, notes: string) => {
    setSubmissions(prev => prev.map(sub => {
      if (sub.id === id) {
        // Use chosen lucky number if provided
        const officialTicket = sub.selectedNumber
          ? `BYD-2026-${String(sub.selectedNumber).padStart(6, '0')}`
          : sub.ticketNumber.startsWith('BYD-2026-')
          ? sub.ticketNumber
          : `BYD-2026-${sub.id.padStart(6, '0')}`;

        return {
          ...sub,
          status: 'Approved',
          ticketIssued: true,
          ticketNumber: officialTicket,
          reviewedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
          reviewedBy: 'Admin (Gemeda)',
          adminNotes: notes || sub.adminNotes || 'Payment verified. Ticket officially issued.'
        };
      }
      return sub;
    }));

    showToast(`Submission #${id} Approved & Email Notification Dispatched!`);
  };

  const handleRejectSubmission = (id: string, reason: string, notes: string) => {
    setSubmissions(prev => prev.map(sub => {
      if (sub.id === id) {
        return {
          ...sub,
          status: 'Rejected',
          ticketIssued: false,
          rejectionReason: reason,
          reviewedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
          reviewedBy: 'Admin (Gemeda)',
          adminNotes: notes || sub.adminNotes
        };
      }
      return sub;
    }));

    showToast(`Submission #${id} Marked as Rejected & Email Dispatched.`);
  };

  const handleUpdateNotes = (id: string, notes: string) => {
    setSubmissions(prev => prev.map(sub => {
      if (sub.id === id) {
        return { ...sub, adminNotes: notes };
      }
      return sub;
    }));
    showToast(`Notes updated for #${id}`);
  };

  const handleAddManualSubmission = (newSub: PaymentSubmission) => {
    setSubmissions(prev => [newSub, ...prev]);
    showToast(`Walk-in Ticket #${newSub.ticketNumber} Issued!`);
  };

  const handleSelectBuyFromHero = (qty: number = 1) => {
    setPreselectedQuantity(qty);
    setCurrentTab('submit');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoToStatusWithQuery = (id: string) => {
    setSearchQueryForStatus(id);
    setCurrentTab('status');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-amber-500 selection:text-slate-950">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-24 right-4 z-50 bg-amber-500 text-slate-950 font-bold px-4 py-2.5 rounded-xl shadow-xl border border-amber-400 text-xs flex items-center gap-2 animate-bounce">
          <span>✨</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Header */}
      <Header
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        language={language}
        setLanguage={setLanguage}
        pendingCount={pendingCount}
        isAdminLoggedIn={isAdminLoggedIn}
      />

      {/* Main Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {currentTab === 'home' && (
          <HeroCarShowcase
            language={language}
            prizes={lotteryConfig.prizes}
            homeConfig={homeConfig}
            winners={lotteryConfig.winners}
            drawDate={lotteryConfig.drawDateIso || lotteryConfig.drawDate}
            onSelectBuy={handleSelectBuyFromHero}
            onCheckStatus={() => {
              setCurrentTab('status');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentTab === 'submit' && (
          <SubmitPaymentView
            language={language}
            maxTickets={lotteryConfig.maxTickets}
            submissions={submissions}
            luckyNumberPolicy={lotteryConfig.luckyNumberPolicy}
            preselectedQuantity={preselectedQuantity}
            onSubmitSuccess={handleAddNewSubmission}
            onGoToStatus={handleGoToStatusWithQuery}
          />
        )}

        {currentTab === 'status' && (
          <StatusCheckView
            language={language}
            submissions={submissions}
            initialSearchQuery={searchQueryForStatus}
            onGoToSubmit={() => {
              setCurrentTab('submit');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentTab === 'admin' && (
          <AdminDashboard
            language={language}
            submissions={submissions}
            lotteryConfig={lotteryConfig}
            onUpdateLotteryConfig={setLotteryConfig}
            homeConfig={homeConfig}
            onUpdateHomeConfig={setHomeConfig}
            isAdminLoggedIn={isAdminLoggedIn}
            setIsAdminLoggedIn={setIsAdminLoggedIn}
            onApproveSubmission={handleApproveSubmission}
            onRejectSubmission={handleRejectSubmission}
            onUpdateNotes={handleUpdateNotes}
            onAddManualSubmission={handleAddManualSubmission}
          />
        )}
      </main>

      {/* Footer */}
      <Footer
        language={language}
        onSelectTab={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
