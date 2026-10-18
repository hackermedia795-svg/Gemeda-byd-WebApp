import React from 'react';
import { ShieldCheck, Phone, MapPin, Mail, Award, Sparkles } from 'lucide-react';
import { Language } from '../types';
import { translations } from '../translations';
import { CONTACT_INFO, BANK_ACCOUNTS } from '../data/seedData';

interface FooterProps {
  language: Language;
  onSelectTab: (tab: 'home' | 'submit' | 'status' | 'admin') => void;
}

export const Footer: React.FC<FooterProps> = ({ language, onSelectTab }) => {
  const t = translations[language];

  return (
    <footer className="mt-20 border-t border-slate-800 bg-slate-950 text-slate-400 text-xs no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-black flex items-center justify-center text-sm shadow">
                BYD
              </div>
              <span className="font-extrabold text-white text-base tracking-tight">
                {t.brandTitle}
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              {language === 'om'
                ? 'Sirna bitannaa tikkeetii konkolaataa haaraa BYD Song Plus EV fi mirkaneessa kaffaltii Telebirr fi Baankiiwwanii.'
                : language === 'am'
                ? 'ይፋዊ የቢዋይዲ መኪና ዕጣ ቲኬት እና የቴሌብር እንዲሁም የባንክ ክፍያ ማረጋገጫ ፖርታል'
                : 'Official BYD Electric Vehicle raffle lottery & verified payment processing portal.'}
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-[11px] font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>National Lottery Authority Verified</span>
            </div>
          </div>

          {/* Quick links */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              {language === 'om' ? 'Geessituuwwan' : language === 'am' ? 'ፈጣን ማስፈንጠሪያዎች' : 'Quick Navigation'}
            </h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => onSelectTab('home')}
                  className="hover:text-amber-400 transition"
                >
                  {t.homeNav}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('submit')}
                  className="hover:text-amber-400 transition"
                >
                  {t.submitNav}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('status')}
                  className="hover:text-amber-400 transition"
                >
                  {t.statusNav}
                </button>
              </li>
              <li>
                <button
                  onClick={() => onSelectTab('admin')}
                  className="hover:text-amber-400 transition"
                >
                  {t.adminNav}
                </button>
              </li>
            </ul>
          </div>

          {/* Supported Gateways with exact details */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Supported Gateways
            </h4>
            <ul className="space-y-1.5 text-[11px] font-mono">
              <li className="flex items-center gap-2 text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 flex-shrink-0"></span>
                <span>Telebirr: <strong className="text-amber-400">0912305111</strong></span>
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 flex-shrink-0"></span>
                <span>CBE: <strong className="text-white">1000173000395</strong></span>
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-400 flex-shrink-0"></span>
                <span>Awash Bank: <strong className="text-white">01320867792800</strong></span>
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0"></span>
                <span>Bank of Abyssinia: <strong className="text-white">119125294</strong></span>
              </li>
            </ul>
          </div>

          {/* Contact Support with exact details */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
              Contact Support
            </h4>
            <ul className="space-y-2 text-[11px]">
              <li className="flex items-center gap-2 text-slate-300">
                <Phone className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span className="font-mono font-semibold text-white">{CONTACT_INFO.phones.join(' / ')}</span>
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <Mail className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                <span className="text-slate-300">{CONTACT_INFO.email}</span>
              </li>
              <li className="flex items-start gap-2 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0 mt-0.5" />
                <span className="text-slate-300 font-medium">{CONTACT_INFO.address}</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="mt-8 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-2">
          <p>© {new Date().getFullYear()} Gemeda BYD Motors Promotion. All rights reserved.</p>
          <p>Gemeda BYD SHAGGAR, AMBO Road, BURAYU, Ethiopia</p>
        </div>
      </div>
    </footer>
  );
};
