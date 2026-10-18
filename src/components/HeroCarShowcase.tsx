import React, { useState, useEffect } from 'react';
import { 
  Trophy, 
  Sparkles, 
  Zap, 
  Clock, 
  CheckCircle2, 
  Copy, 
  Check, 
  ArrowRight, 
  ShieldCheck, 
  Flame,
  Award,
  Smartphone,
  ChevronRight,
  Car,
  Coins,
  User,
  Quote,
  MapPin,
  Calendar,
  X
} from 'lucide-react';
import { Language, LotteryPrize, HomeConfig, LotteryWinner } from '../types';
import { translations } from '../translations';
import { BANK_ACCOUNTS, TICKET_PRICING, DEFAULT_PRIZES, DEFAULT_HOME_CONFIG, DEFAULT_WINNERS } from '../data/seedData';
import { DrawCountdownTimer } from './DrawCountdownTimer';

interface HeroCarShowcaseProps {
  language: Language;
  prizes?: LotteryPrize[];
  homeConfig?: HomeConfig;
  winners?: LotteryWinner[];
  drawDate?: string;
  onSelectBuy: (quantity?: number) => void;
  onCheckStatus: () => void;
}

export const HeroCarShowcase: React.FC<HeroCarShowcaseProps> = ({
  language,
  prizes = DEFAULT_PRIZES,
  homeConfig = DEFAULT_HOME_CONFIG,
  winners = DEFAULT_WINNERS,
  drawDate,
  onSelectBuy,
  onCheckStatus,
}) => {
  const t = translations[language];
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const [selectedWinnerModal, setSelectedWinnerModal] = useState<LotteryWinner | null>(null);

  // Active prizes list
  const activePrizes = prizes && prizes.length > 0 ? prizes : DEFAULT_PRIZES;
  const activeWinners = winners && winners.length > 0 ? winners : DEFAULT_WINNERS;
  const grandPrize = activePrizes[0] || DEFAULT_PRIZES[0];
  const cfg = homeConfig || DEFAULT_HOME_CONFIG;

  const handleCopy = (accNumber: string) => {
    navigator.clipboard.writeText(accNumber);
    setCopiedAccount(accNumber);
    setTimeout(() => setCopiedAccount(null), 2500);
  };

  const renderPrizeIcon = (iconType: string, rank: number) => {
    switch (iconType) {
      case 'trophy':
        return <Trophy className="w-6 h-6 text-amber-400" />;
      case 'car':
        return <Car className="w-6 h-6 text-amber-400" />;
      case 'smartphone':
        return <Smartphone className="w-6 h-6 text-blue-400" />;
      case 'cash':
        return <Coins className="w-6 h-6 text-emerald-400" />;
      case 'award':
      default:
        return rank === 1 ? <Trophy className="w-6 h-6 text-amber-400" /> : <Award className="w-6 h-6 text-emerald-400" />;
    }
  };

  // Dynamic titles and description from Admin config if present
  const heroTitleText = cfg.heroTitle?.[language] || cfg.heroTitle?.om || t.heroTitle;
  const heroDescText = cfg.heroDesc?.[language] || cfg.heroDesc?.om || t.heroDesc;
  const heroBadgeText = cfg.heroBadge || t.heroBadge;
  const carName = cfg.featuredCarName || grandPrize.name;
  const carImage = cfg.featuredCarImage || grandPrize.imageUrl || "https://images.unsplash.com/photo-1590362891991-f776e747a588?w=900&auto=format&fit=crop&q=85";
  const carRange = cfg.featuredCarRange || "605 KM Range";
  const carAcceleration = cfg.featuredCarAcceleration || "5.9s (0-100)";
  const carValue = cfg.featuredCarValue || grandPrize.valueText;

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-6 sm:p-10 lg:p-12 shadow-2xl">
        {/* Glow ambient effects */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Text / Action Info */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider">
              <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>{heroBadgeText}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
              <span>100% Electric EV</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-[1.15]">
              {heroTitleText}
            </h1>

            <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
              {heroDescText}
            </p>

            {/* Visual Real-Time Draw Countdown Timer */}
            <DrawCountdownTimer
              language={language}
              drawDateIso={cfg.drawDateIso || drawDate}
              drawDateText={cfg.drawDateText || t.drawDateText}
              variant="hero"
            />

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={() => onSelectBuy(1)}
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold px-7 py-3.5 rounded-xl shadow-lg shadow-amber-500/25 transition duration-150 transform hover:-translate-y-0.5 active:translate-y-0 text-base"
              >
                <span>{t.buyTicketBtn}</span>
                <ArrowRight className="w-5 h-5" />
              </button>

              <button
                onClick={onCheckStatus}
                className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold px-6 py-3.5 rounded-xl border border-slate-700 transition"
              >
                <span>{t.checkStatusBtn}</span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </button>
            </div>

            <div className="flex items-center gap-6 text-xs text-slate-400 pt-1">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Telebirr Instant Verification</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>CBE & Ethiopian Banks</span>
              </div>
            </div>

          </div>

          {/* Right Showcase: BYD Car Image & Specs Card */}
          <div className="lg:col-span-5">
            <div className="relative group">
              <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-700/80 shadow-2xl p-4">
                
                {/* Car Badge */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 text-xs font-black tracking-widest uppercase">
                      {grandPrize.badge || 'GRAND PRIZE #1'}
                    </span>
                    <span className="text-white font-bold text-sm">{carName}</span>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-amber-400 font-bold">
                    <Zap className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{carRange}</span>
                  </div>
                </div>

                {/* Car photo presentation */}
                <div className="relative my-3 rounded-xl overflow-hidden bg-slate-900 aspect-video group">
                  <img
                    src={carImage}
                    alt={carName}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent"></div>
                  
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                    <div>
                      <p className="text-white font-extrabold text-sm sm:text-base">{carName}</p>
                      <p className="text-xs text-amber-400 font-medium">{cfg.featuredCarSubtitle || grandPrize.subtitle}</p>
                    </div>
                    <span className="bg-emerald-500 text-slate-950 text-xs font-black px-2.5 py-1 rounded-md shadow">
                      IN STOCK
                    </span>
                  </div>
                </div>

                {/* Key EV Features */}
                <div className="grid grid-cols-3 gap-2 text-center text-xs pt-2">
                  <div className="bg-slate-900/90 rounded-lg p-2 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Acceleration</span>
                    <span className="font-bold text-white text-sm">{carAcceleration}</span>
                  </div>
                  <div className="bg-slate-900/90 rounded-lg p-2 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Battery</span>
                    <span className="font-bold text-amber-400 text-sm">Blade Battery</span>
                  </div>
                  <div className="bg-slate-900/90 rounded-lg p-2 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Estimated Value</span>
                    <span className="font-bold text-emerald-400 text-sm">{carValue}</span>
                  </div>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* DYNAMIC PRIZE BREAKDOWN SECTION (Configurable by Admin!) */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            {language === 'om' ? 'Badhaasawwan Gurguddoo' : language === 'am' ? 'ዋና ዋና ሽልማቶች' : 'Grand Lottery Prizes'}
          </h2>
          <p className="text-slate-400 text-sm">
            {language === 'om' 
              ? 'Tikkeetii tokkootiin badhaasawwan armaan gadii carraa argachuu dandeessu'
              : language === 'am'
              ? 'በአንድ ቲኬት ብቻ ከታች የተዘረዘሩትን ታላላቅ ሽልማቶች የማሸነፍ ዕድል ያግኙ'
              : 'Every single verified raffle ticket gives you a legitimate shot at these life-changing prizes'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activePrizes.map((prize, index) => {
            const isFirst = index === 0;
            return (
              <div
                key={prize.id || index}
                className={`relative rounded-2xl p-6 flex flex-col justify-between shadow-xl transition ${
                  isFirst
                    ? 'bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-950 border-2 border-amber-500/70 shadow-amber-500/10'
                    : 'bg-slate-900/90 border border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className={`text-xs font-black px-2.5 py-1 rounded-md uppercase ${
                      isFirst 
                        ? 'bg-amber-500 text-slate-950' 
                        : 'bg-slate-800 text-slate-300'
                    }`}>
                      {prize.badge || `${index + 1}th Prize`}
                    </span>
                    {renderPrizeIcon(prize.iconType, index + 1)}
                  </div>

                  {prize.imageUrl && !isFirst && (
                    <div className="h-32 w-full rounded-xl overflow-hidden bg-slate-950">
                      <img
                        src={prize.imageUrl}
                        alt={prize.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div>
                    <h3 className="text-xl font-bold text-white">{prize.name}</h3>
                    <p className={`text-sm font-medium mt-0.5 ${isFirst ? 'text-amber-300' : 'text-emerald-400'}`}>
                      {prize.subtitle}
                    </p>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {prize.description?.[language] || prize.description?.en || ''}
                  </p>
                </div>

                <div className="pt-6 border-t border-slate-800 mt-4 flex items-center justify-between">
                  <span className="text-xs text-slate-400">Value</span>
                  <span className={`text-lg font-black ${isFirst ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {prize.valueText}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Ticket Pricing & Bundle Packages */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            {language === 'om' ? 'Paakeejii Tikkeetii Filadhaa' : language === 'am' ? 'የቲኬት ፓኬጆችን ይምረጡ' : 'Select Your Ticket Bundle'}
          </h2>
          <p className="text-slate-400 text-sm">
            {language === 'om'
              ? 'Tikkeetii baay\'ee bituun carraa injifannoo keessanii dachaan dabala!'
              : language === 'am'
              ? 'ብዙ ቲኬት በመግዛት የማሸነፍ ዕድልዎን በእጥፍ ያሳድጉ!'
              : 'Multiply your chances of taking home the BYD EV with discounted ticket bundles'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {TICKET_PRICING.map((pkg) => (
            <div
              key={pkg.qty}
              onClick={() => onSelectBuy(pkg.qty)}
              className={`relative cursor-pointer rounded-2xl p-5 border transition duration-200 flex flex-col justify-between ${
                pkg.popular
                  ? 'bg-gradient-to-b from-amber-950/60 to-slate-900 border-amber-500 shadow-lg shadow-amber-500/10 hover:border-amber-400'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              {pkg.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-950 text-[11px] font-black uppercase tracking-wider px-3 py-0.5 rounded-full shadow">
                  Most Popular
                </div>
              )}

              <div className="space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-black text-white">{pkg.qty}</span>
                  <span className="text-xs text-slate-400">
                    {pkg.qty === 1 ? 'Single Ticket' : 'Tickets Package'}
                  </span>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-extrabold text-amber-400">
                    {pkg.price.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-400 font-semibold">{t.birr}</span>
                </div>

                {pkg.discount ? (
                  <span className="inline-block text-xs font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2 py-0.5 rounded-md">
                    {pkg.discount}
                  </span>
                ) : (
                  <span className="text-xs text-slate-500">Standard rate: 500 ETB / ticket</span>
                )}
              </div>

              <div className="pt-5 mt-4 border-t border-slate-800">
                <button
                  type="button"
                  className={`w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition ${
                    pkg.popular
                      ? 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                      : 'bg-slate-800 hover:bg-slate-700 text-white'
                  }`}
                >
                  <span>{t.buyTicketBtn}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* OFFICIAL WINNERS ANNOUNCEMENT & HANDOVER SHOWCASE (Requested Feature!) */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider">
              <Trophy className="w-3.5 h-3.5" />
              <span>
                {language === 'om' ? 'Beeksisa Mo\'attoota Carraa' : language === 'am' ? 'የአሸናፊዎች ማስታወቂያ' : 'Official Winners Showcase'}
              </span>
              <span className="w-1 h-1 rounded-full bg-amber-400"></span>
              <span className="text-emerald-400">100% Transparent</span>
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {language === 'om' 
                ? 'Mo\'attoota Carraa Darban & Sagantaa Harka Dhaabbachuu' 
                : language === 'am' 
                ? 'ያለፉት ዕድለኞች እና የመኪና ርክክብ መድረክ' 
                : 'Past Grand Winners & Handover Gallery'}
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm max-w-2xl">
              {language === 'om'
                ? 'Suuraawwan fi ragaa maamiltoota carraa qulqulluun konkolaataa BYD fi qarshii injifatanii fuula duraatti beeksifame.'
                : language === 'am'
                ? 'የቢዋይዲ መኪና እና የገንዘብ ሽልማት ያሸነፉ ዕድለኞች ይፋዊ ፎቶዎች እና መረጃ።'
                : 'Verified photos and testimonials of lucky customers who legitimately won brand new BYD electric vehicles.'}
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-950/80 border border-emerald-800 text-emerald-400 text-xs font-semibold self-start sm:self-auto">
            <ShieldCheck className="w-4 h-4" />
            <span>Burayu Showroom Handovers</span>
          </div>
        </div>

        {/* Winners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {activeWinners.map((winner) => (
            <div
              key={winner.id}
              className="bg-slate-900 border border-slate-800 hover:border-amber-500/60 rounded-3xl p-5 flex flex-col justify-between shadow-xl transition duration-300 group hover:shadow-amber-500/5"
            >
              <div className="space-y-4">
                {/* Winner Photo with Handover Badge */}
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950">
                  <img
                    src={winner.photoUrl}
                    alt={winner.fullName}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent"></div>

                  {/* Verification Badge */}
                  <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-500 text-slate-950 text-[10px] font-black uppercase tracking-wider shadow">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Verified Winner</span>
                  </div>

                  {/* Handover Date */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-xs">
                    <span className="text-white font-mono font-bold bg-slate-900/80 backdrop-blur px-2 py-0.5 rounded border border-slate-700">
                      {winner.ticketNumber}
                    </span>
                    <span className="text-amber-300 text-[11px] font-semibold flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{winner.dateWon}</span>
                    </span>
                  </div>
                </div>

                {/* Name & Prize Won */}
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition">
                      {winner.fullName}
                    </h3>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                    <span>{winner.city}</span>
                  </div>

                  <div className="mt-2.5 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 font-bold text-xs flex items-center gap-2">
                    <Trophy className="w-4 h-4 text-amber-400 flex-shrink-0" />
                    <span className="truncate">{winner.prizeWon}</span>
                  </div>
                </div>

                {/* Testimonial Quote */}
                <div className="bg-slate-950/80 rounded-xl p-3 border border-slate-800/80 relative">
                  <Quote className="w-4 h-4 text-amber-500/40 absolute top-2 right-2" />
                  <p className="text-xs text-slate-300 italic leading-relaxed pr-4">
                    "{winner.testimonial?.[language] || winner.testimonial?.om || winner.testimonial?.en}"
                  </p>
                </div>
              </div>

              {/* View Certificate Button */}
              <div className="pt-4 mt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setSelectedWinnerModal(winner)}
                  className="w-full py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 hover:text-white font-bold text-xs transition flex items-center justify-center gap-1.5"
                >
                  <Award className="w-3.5 h-3.5 text-amber-400" />
                  <span>
                    {language === 'om' ? 'Ragaa Mo\'attummaa Ilaali' : language === 'am' ? 'የማሸነፍ ማረጋገጫ ይመልከቱ' : 'View Handover Certificate'}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WINNER HANDOVER CERTIFICATE MODAL */}
      {selectedWinnerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-xl bg-slate-900 border-2 border-amber-500/60 rounded-3xl p-6 sm:p-8 shadow-2xl text-center">
            
            <button
              onClick={() => setSelectedWinnerModal(null)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800 rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-slate-950 flex items-center justify-center mx-auto mb-4 shadow-xl shadow-amber-500/20">
              <Award className="w-9 h-9" />
            </div>

            <span className="text-[11px] font-black uppercase tracking-widest text-amber-400 block mb-1">
              Gemeda BYD Car Promo • Official Verification
            </span>
            <h3 className="text-2xl font-black text-white mb-2">
              Certificate of Handover & Prize Claim
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Officially issued by Gemeda BYD Promotion Center (Burayu, Oromia, Ethiopia)
            </p>

            <div className="rounded-2xl overflow-hidden aspect-video bg-slate-950 mb-6 border border-slate-800 relative">
              <img
                src={selectedWinnerModal.photoUrl}
                alt={selectedWinnerModal.fullName}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 right-3 bg-slate-950/90 backdrop-blur px-3 py-2 rounded-xl border border-slate-700 flex items-center justify-between text-xs">
                <span className="font-bold text-white">{selectedWinnerModal.fullName}</span>
                <span className="font-mono font-bold text-amber-400">{selectedWinnerModal.ticketNumber}</span>
              </div>
            </div>

            <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-left space-y-2.5 mb-6 text-xs text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Winner:</span>
                <span className="font-bold text-white">{selectedWinnerModal.fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Location:</span>
                <span className="text-white">{selectedWinnerModal.city}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Prize Awarded:</span>
                <span className="font-bold text-amber-400">{selectedWinnerModal.prizeWon}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Handover Date:</span>
                <span className="text-white">{selectedWinnerModal.dateWon}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Verification Status:</span>
                <span className="font-bold text-emerald-400">Verified & Vehicle Keys Handed Over ✓</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedWinnerModal(null)}
              className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm rounded-xl transition shadow"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}

      {/* Official Verified Bank & Telebirr Accounts */}
      <section className="bg-slate-900/60 border border-slate-800 rounded-3xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                {t.officialBankAccounts}
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 max-w-2xl">
              {t.bankDesc}
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 text-xs text-amber-400 bg-amber-950/50 border border-amber-800/80 px-3 py-1.5 rounded-xl">
            <Sparkles className="w-4 h-4" />
            <span>Instant Mobile & App Deposits</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {BANK_ACCOUNTS.map((bank) => (
            <div
              key={bank.name}
              className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between hover:border-slate-700 transition"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm truncate">{bank.name}</span>
                  <span className="text-[10px] text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-900">
                    {bank.badge.split(' ')[0]}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 block">
                    {t.accountHolder}
                  </span>
                  <span className="text-xs font-semibold text-slate-200">
                    {bank.accountName}
                  </span>
                </div>

                <div className="bg-slate-900 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-mono">
                    Account / Number
                  </span>
                  <div className="flex items-center justify-between mt-1">
                    <span className="font-mono font-bold text-sm text-amber-400 tracking-wider">
                      {bank.accountNumber}
                    </span>
                    <button
                      onClick={() => handleCopy(bank.accountNumber)}
                      className="p-1 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition"
                      title="Copy account number"
                    >
                      {copiedAccount === bank.accountNumber ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-900 text-[11px] text-slate-400">
                {bank.instructions[language]}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
