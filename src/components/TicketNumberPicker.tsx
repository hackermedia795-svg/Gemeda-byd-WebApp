import React, { useState, useEffect, useMemo } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  XCircle, 
  Dice5, 
  Search, 
  Hash, 
  LayoutGrid, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  Check,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Language, PaymentSubmission } from '../types';
import { translations } from '../translations';

interface TicketNumberPickerProps {
  language: Language;
  maxTickets: number; // e.g., 1000, 1500, 2000, 5000
  submissions: PaymentSubmission[];
  ticketQuantity?: number;
  maxAllowedSelection?: number; // admin controlled limit
  selectedNumbers: number[];
  onSelectNumbers: (nums: number[]) => void;
}

export const TicketNumberPicker: React.FC<TicketNumberPickerProps> = ({
  language,
  maxTickets,
  submissions,
  ticketQuantity = 1,
  maxAllowedSelection = 1,
  selectedNumbers,
  onSelectNumbers,
}) => {
  const t = translations[language];

  // Selection mode: 'auto' | 'grid' | 'direct'
  const [pickerMode, setPickerMode] = useState<'auto' | 'grid' | 'direct'>('grid');
  const [directInputVal, setDirectInputVal] = useState<string>('');
  
  // Grid pagination: Page of 100 numbers
  const PAGE_SIZE = 100;
  const [currentPage, setCurrentPage] = useState<number>(0);

  // Grid filter: 'all' | 'available' | 'taken'
  const [gridFilter, setGridFilter] = useState<'all' | 'available' | 'taken'>('all');
  const [searchGridQuery, setSearchGridQuery] = useState('');

  // Extract all taken numbers from existing submissions
  const takenNumbers = useMemo(() => {
    const set = new Set<number>();
    submissions.forEach((sub) => {
      if (sub.selectedNumbers && sub.selectedNumbers.length > 0) {
        sub.selectedNumbers.forEach(n => set.add(n));
      } else if (sub.selectedNumber) {
        set.add(sub.selectedNumber);
      }
      const match = sub.ticketNumber.match(/BYD-2026-(\d+)/);
      if (match && match[1]) {
        const parsed = parseInt(match[1], 10);
        if (!isNaN(parsed) && parsed > 0) set.add(parsed);
      }
    });
    return set;
  }, [submissions]);

  // Total pages
  const totalPages = Math.ceil(maxTickets / PAGE_SIZE);

  // Allowed selection limit for this order
  const effectiveMaxAllowed = Math.max(1, Math.min(ticketQuantity, maxAllowedSelection));

  // Numbers in current page
  const pageNumbers = useMemo(() => {
    const list: number[] = [];
    const start = currentPage * PAGE_SIZE + 1;
    const end = Math.min(start + PAGE_SIZE - 1, maxTickets);

    for (let i = start; i <= end; i++) {
      const isTaken = takenNumbers.has(i);
      if (gridFilter === 'available' && isTaken) continue;
      if (gridFilter === 'taken' && !isTaken) continue;
      if (searchGridQuery) {
        if (!String(i).includes(searchGridQuery.replace('#', '').trim())) continue;
      }
      list.push(i);
    }
    return list;
  }, [currentPage, maxTickets, takenNumbers, gridFilter, searchGridQuery]);

  // When clicking a number tile
  const handleToggleNumber = (num: number) => {
    if (takenNumbers.has(num)) return; // cannot select taken

    if (selectedNumbers.includes(num)) {
      // Unselect
      onSelectNumbers(selectedNumbers.filter(n => n !== num));
    } else {
      if (selectedNumbers.length < effectiveMaxAllowed) {
        const updated = [...selectedNumbers, num];
        onSelectNumbers(updated);
        confetti({
          particleCount: 20,
          spread: 40,
          origin: { y: 0.7 }
        });
      } else {
        // If max reached, replace the first or show note
        if (effectiveMaxAllowed === 1) {
          onSelectNumbers([num]);
        } else {
          // Replace oldest
          const updated = [...selectedNumbers.slice(1), num];
          onSelectNumbers(updated);
        }
      }
    }
  };

  // Generate random available numbers up to allowed
  const handleRandomize = () => {
    const chosen: number[] = [];
    let attempts = 0;
    while (chosen.length < effectiveMaxAllowed && attempts < 300) {
      const rnd = Math.floor(1 + Math.random() * maxTickets);
      if (!takenNumbers.has(rnd) && !chosen.includes(rnd)) {
        chosen.push(rnd);
      }
      attempts++;
    }
    if (chosen.length > 0) {
      onSelectNumbers(chosen);
      setCurrentPage(Math.floor((chosen[0] - 1) / PAGE_SIZE));
    }
  };

  // Add direct input number
  const handleAddDirect = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(directInputVal.replace('#', '').trim(), 10);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= maxTickets) {
      if (!takenNumbers.has(parsed)) {
        handleToggleNumber(parsed);
        setDirectInputVal('');
      }
    }
  };

  const parsedDirect = parseInt(directInputVal, 10);
  const isDirectValid = !isNaN(parsedDirect) && parsedDirect >= 1 && parsedDirect <= maxTickets;
  const isDirectTaken = isDirectValid && takenNumbers.has(parsedDirect);

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-3xl p-5 sm:p-6 space-y-5 shadow-inner">
      
      {/* Title & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <label className="text-sm font-bold text-white flex items-center gap-2">
            <Hash className="w-4 h-4 text-amber-400" />
            <span>
              {language === 'om' ? 'Filannoo Lakkoofsa Carraa (Choose Lucky Numbers)' : 'Choose Lucky Numbers'}
            </span>
          </label>
          <p className="text-xs text-slate-400 mt-0.5">
            {language === 'om' 
              ? `Tikkeetii ${ticketQuantity} kaffaltuuf lakkoofsa ${effectiveMaxAllowed} filachuu dandeessu:`
              : `You can select up to ${effectiveMaxAllowed} lucky numbers for your ${ticketQuantity} ticket(s):`}
          </p>
        </div>

        {/* View Mode Buttons */}
        <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
          <button
            type="button"
            onClick={() => setPickerMode('grid')}
            className={`px-3 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 ${
              pickerMode === 'grid'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>{language === 'om' ? 'Tarree Lakkoofsaa' : 'Visual Grid'}</span>
          </button>

          <button
            type="button"
            onClick={() => setPickerMode('direct')}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              pickerMode === 'direct'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {language === 'om' ? 'Galchaa' : 'Direct'}
          </button>

          <button
            type="button"
            onClick={() => {
              setPickerMode('auto');
              onSelectNumbers([]);
            }}
            className={`px-3 py-1.5 rounded-lg font-bold transition ${
              pickerMode === 'auto'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Auto
          </button>
        </div>
      </div>

      {/* SELECTED NUMBERS COUNTER & HIGHLIGHT PILLS */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-semibold">
              {language === 'om' ? 'Lakkoofsa Filatame:' : 'Selected Numbers:'}
            </span>
            <span className="text-xs font-mono font-bold text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-800">
              {selectedNumbers.length} / {effectiveMaxAllowed}
            </span>
          </div>

          {selectedNumbers.length > 0 ? (
            <div className="flex flex-wrap items-center gap-1.5 pt-1">
              {selectedNumbers.map((num) => (
                <span
                  key={num}
                  onClick={() => handleToggleNumber(num)}
                  className="cursor-pointer inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-black font-mono text-xs shadow hover:bg-amber-400 transition"
                  title="Click to remove"
                >
                  <span>#{num}</span>
                  <span className="text-[10px] opacity-80">✕</span>
                </span>
              ))}
            </div>
          ) : (
            <span className="text-xs text-slate-500">
              {pickerMode === 'auto' ? 'Auto-assigning available numbers.' : 'Click any green number tile below to choose.'}
            </span>
          )}
        </div>

        {selectedNumbers.length > 0 && (
          <button
            type="button"
            onClick={() => onSelectNumbers([])}
            className="text-xs text-rose-400 hover:underline"
          >
            Clear All
          </button>
        )}
      </div>

      {/* MODE 1: VISUAL NUMBER GRID CATALOG */}
      {pickerMode === 'grid' && (
        <div className="space-y-4">
          
          {/* Controls: Range Block Selector, Filters & Search Jump */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 bg-slate-900/90 p-3 rounded-2xl border border-slate-800">
            
            {/* Block / Page navigation */}
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                disabled={currentPage === 0}
                onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white transition"
                title="Previous 100 Numbers"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <select
                value={currentPage}
                onChange={(e) => setCurrentPage(Number(e.target.value))}
                className="bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-amber-400 font-mono font-bold focus:outline-none"
              >
                {Array.from({ length: totalPages }).map((_, i) => {
                  const s = i * PAGE_SIZE + 1;
                  const e = Math.min(s + PAGE_SIZE - 1, maxTickets);
                  return (
                    <option key={i} value={i}>
                      Range: {s} — {e}
                    </option>
                  );
                })}
              </select>

              <button
                type="button"
                disabled={currentPage >= totalPages - 1}
                onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 disabled:opacity-40 text-white transition"
                title="Next 100 Numbers"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Filter buttons */}
            <div className="flex items-center gap-1 text-xs">
              <button
                type="button"
                onClick={() => setGridFilter('all')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                  gridFilter === 'all'
                    ? 'bg-slate-800 text-white border border-slate-700'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setGridFilter('available')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                  gridFilter === 'available'
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                    : 'text-emerald-400/80 hover:text-emerald-300'
                }`}
              >
                🟢 Bilisa
              </button>
              <button
                type="button"
                onClick={() => setGridFilter('taken')}
                className={`px-2.5 py-1 rounded-lg font-semibold transition ${
                  gridFilter === 'taken'
                    ? 'bg-rose-950 text-rose-300 border border-rose-800'
                    : 'text-rose-400/80 hover:text-rose-300'
                }`}
              >
                🔴 Qabameera
              </button>
            </div>

            {/* Search number in catalog */}
            <div className="relative flex items-center">
              <input
                type="text"
                value={searchGridQuery}
                onChange={(e) => setSearchGridQuery(e.target.value)}
                placeholder="Find # (e.g. 77)"
                className="w-32 sm:w-36 bg-slate-950 border border-slate-700 rounded-lg pl-7 pr-2 py-1 text-white text-xs font-mono focus:outline-none focus:border-amber-400"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2 pointer-events-none" />
            </div>
          </div>

          {/* GRID OF NUMBERS */}
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 max-h-72 overflow-y-auto">
            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-2">
              {pageNumbers.map((num) => {
                const isTaken = takenNumbers.has(num);
                const isSelected = selectedNumbers.includes(num);

                return (
                  <button
                    key={num}
                    type="button"
                    disabled={isTaken}
                    onClick={() => handleToggleNumber(num)}
                    className={`relative p-2 rounded-xl text-center font-mono text-xs font-bold transition duration-150 transform hover:-translate-y-0.5 flex flex-col items-center justify-center ${
                      isSelected
                        ? 'bg-gradient-to-b from-amber-500 to-yellow-400 text-slate-950 border-2 border-white shadow-lg shadow-amber-500/40 font-black scale-105'
                        : isTaken
                        ? 'bg-rose-950/30 border border-rose-900/60 text-rose-400/60 cursor-not-allowed opacity-60 line-through'
                        : 'bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 hover:border-amber-500/60 shadow-sm'
                    }`}
                    title={isTaken ? `Ticket #${num} is already taken` : `Click to choose Lucky Ticket #${num}`}
                  >
                    <span className="text-sm font-extrabold">#{num}</span>
                    <span className={`text-[9px] mt-0.5 tracking-tighter ${
                      isSelected ? 'text-slate-950 font-bold' : isTaken ? 'text-rose-500' : 'text-emerald-400'
                    }`}>
                      {isSelected ? 'SELECTED' : isTaken ? 'TAKEN' : 'FREE'}
                    </span>

                    {isSelected && (
                      <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-slate-950 text-amber-400 flex items-center justify-center border border-amber-400">
                        <Check className="w-2.5 h-2.5" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {pageNumbers.length === 0 && (
              <div className="py-8 text-center text-slate-500 text-xs">
                No ticket numbers match current filter or search.
              </div>
            )}
          </div>

          {/* Quick Info & Randomizer */}
          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2 pt-1">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                <span>Bilisa (Available)</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                <span>Qabameera (Taken)</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                <span>Filatameera ({selectedNumbers.length})</span>
              </span>
            </div>

            <button
              type="button"
              onClick={handleRandomize}
              className="text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 text-xs"
            >
              <Dice5 className="w-3.5 h-3.5" />
              <span>{language === 'om' ? 'Lakkoofsa Bilisa Carraan Filadhu' : 'Pick Random Free Numbers'}</span>
            </button>
          </div>

        </div>
      )}

      {/* MODE 2: DIRECT INPUT */}
      {pickerMode === 'direct' && (
        <form onSubmit={handleAddDirect} className="space-y-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-mono text-sm">
                #
              </span>
              <input
                type="number"
                min="1"
                max={maxTickets}
                value={directInputVal}
                onChange={(e) => setDirectInputVal(e.target.value)}
                placeholder={`Enter number between 1 and ${maxTickets}`}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-8 pr-4 py-2.5 text-white font-mono font-bold text-sm focus:outline-none focus:border-amber-400"
              />
            </div>

            <button
              type="submit"
              className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition"
            >
              Add Number
            </button>
          </div>

          {directInputVal && (
            <div>
              {!isDirectValid ? (
                <div className="p-3 rounded-xl bg-amber-950/40 border border-amber-800 text-amber-300 text-xs">
                  Please enter a number between 1 and {maxTickets.toLocaleString()}.
                </div>
              ) : isDirectTaken ? (
                <div className="p-3 rounded-xl bg-rose-950/70 border border-rose-600 text-rose-300 text-xs flex items-center gap-2">
                  <XCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  <span>LAKKOOFSI KUN QABAMEERRA! (ALREADY TAKEN)</span>
                </div>
              ) : (
                <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-500 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>LAKKOOFSI KUN BILISA DHA! (AVAILABLE - Click 'Add Number')</span>
                </div>
              )}
            </div>
          )}
        </form>
      )}

    </div>
  );
};
