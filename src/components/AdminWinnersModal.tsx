import React, { useState } from 'react';
import { 
  X, 
  Award, 
  Plus, 
  Trash2, 
  Save, 
  CheckCircle2, 
  Upload, 
  Image as ImageIcon,
  User,
  MapPin,
  Ticket,
  Calendar,
  Quote,
  Sparkles,
  ShieldCheck,
  Languages
} from 'lucide-react';
import { Language, LotteryWinner } from '../types';
import { DEFAULT_WINNERS } from '../data/seedData';
import { autoTranslateToAll, SupportedLang } from '../utils/translator';

interface AdminWinnersModalProps {
  language: Language;
  winners: LotteryWinner[];
  onSaveWinners: (newWinners: LotteryWinner[]) => void;
  onClose: () => void;
}

const PRESET_WINNER_AVATARS = [
  { label: 'Winner 1 (Car Delivery)', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80' },
  { label: 'Winner 2 (Celebration)', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&auto=format&fit=crop&q=80' },
  { label: 'Winner 3 (Handover)', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=600&auto=format&fit=crop&q=80' },
  { label: 'Winner 4 (Keys in Hand)', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=600&auto=format&fit=crop&q=80' }
];

export const AdminWinnersModal: React.FC<AdminWinnersModalProps> = ({
  language,
  winners,
  onSaveWinners,
  onClose,
}) => {
  const [editedWinners, setEditedWinners] = useState<LotteryWinner[]>(() => 
    JSON.parse(JSON.stringify(winners && winners.length > 0 ? winners : DEFAULT_WINNERS))
  );

  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleFieldChange = (index: number, field: keyof LotteryWinner, value: any) => {
    setEditedWinners(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleTestimonialChange = (index: number, langKey: 'om' | 'en' | 'am', value: string) => {
    setEditedWinners(prev => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        testimonial: {
          ...copy[index].testimonial,
          [langKey]: value
        }
      };
      return copy;
    });
  };

  const handleAutoTranslateTestimonial = (index: number, sourceLang: SupportedLang) => {
    const text = editedWinners[index]?.testimonial?.[sourceLang];
    if (!text || text.trim() === '') return;
    const translated = autoTranslateToAll(text, sourceLang);
    setEditedWinners(prev => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        testimonial: {
          om: sourceLang === 'om' ? text : translated.om,
          en: sourceLang === 'en' ? text : translated.en,
          am: sourceLang === 'am' ? text : translated.am
        }
      };
      return copy;
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleFieldChange(index, 'photoUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddWinner = () => {
    const newWinner: LotteryWinner = {
      id: `win-${Date.now()}`,
      fullName: 'Obbo / Aaddee Haaraa',
      city: 'Buraayyuu / Finfinnee',
      photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80',
      ticketNumber: `BYD-2026-${String(Math.floor(100 + Math.random() * 900)).padStart(6, '0')}`,
      prizeWon: 'BYD Song Plus EV',
      dateWon: 'Muddee 2026',
      testimonial: {
        om: 'Carraan kun 100% dhugaa dha, galatoomaa!',
        en: '100% genuine and transparent lottery draw! Thank you Gemeda BYD!',
        am: 'ይህ ዕጣ እውነተኛ ነው፣ በጣም አመሰግናለሁ!'
      },
      verifiedBadge: true
    };
    setEditedWinners(prev => [...prev, newWinner]);
    setActiveIdx(editedWinners.length);
  };

  const handleDeleteWinner = (index: number) => {
    if (editedWinners.length <= 1) {
      alert('Keep at least one winner for transparency showcase.');
      return;
    }
    const filtered = editedWinners.filter((_, i) => i !== index);
    setEditedWinners(filtered);
    setActiveIdx(Math.max(0, index - 1));
  };

  const handleSave = () => {
    onSaveWinners(editedWinners);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 700);
  };

  const currentWinner = editedWinners[activeIdx] || editedWinners[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-6">
        
        {/* Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-white text-base">
                  {language === 'om' 
                    ? 'Bulchiinsa Injifattoota Carraa (Winners Showcase & Photos)' 
                    : 'Manage Published Lottery Winners'}
                </h3>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full font-bold">
                  Hall of Fame
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {language === 'om'
                  ? 'Suuraa nama mo\'atee, maqaa, tikkeetii, fi badhaasa isaa appii irratti beeksisaa'
                  : 'Announce and publish lottery winners with real photo uploads, quotes, and ticket serials'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-900 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6 max-h-[74vh] overflow-y-auto">
          
          {/* Winners Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
            <div className="flex flex-wrap items-center gap-2">
              {editedWinners.map((win, idx) => (
                <button
                  key={win.id || idx}
                  type="button"
                  onClick={() => setActiveIdx(idx)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                    activeIdx === idx
                      ? 'bg-amber-500 text-slate-950 shadow'
                      : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>{win.fullName || `Winner ${idx + 1}`}</span>
                </button>
              ))}

              <button
                type="button"
                onClick={handleAddWinner}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 text-xs font-bold transition flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Winner</span>
              </button>
            </div>

            {editedWinners.length > 1 && (
              <button
                type="button"
                onClick={() => handleDeleteWinner(activeIdx)}
                className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Remove Winner</span>
              </button>
            )}
          </div>

          {currentWinner && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Form */}
              <div className="lg:col-span-7 space-y-4">
                
                {/* Full Name & City */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Winner's Full Name (Maqaa)
                    </label>
                    <input
                      type="text"
                      value={currentWinner.fullName}
                      onChange={(e) => handleFieldChange(activeIdx, 'fullName', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs font-bold focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      City / Region (Magaalaa)
                    </label>
                    <input
                      type="text"
                      value={currentWinner.city}
                      onChange={(e) => handleFieldChange(activeIdx, 'city', e.target.value)}
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Prize Won & Ticket # */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Prize Won (Badhaasa Mo'ate)
                    </label>
                    <input
                      type="text"
                      value={currentWinner.prizeWon}
                      onChange={(e) => handleFieldChange(activeIdx, 'prizeWon', e.target.value)}
                      placeholder="e.g. BYD Song Plus EV"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs font-bold focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Winning Ticket Serial (Lakk. Tikkeetii)
                    </label>
                    <input
                      type="text"
                      value={currentWinner.ticketNumber}
                      onChange={(e) => handleFieldChange(activeIdx, 'ticketNumber', e.target.value)}
                      placeholder="BYD-2025-000342"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-amber-400 font-mono font-bold text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Date Won */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Date Won (Guyyaa Carraan Baafame)
                  </label>
                  <input
                    type="text"
                    value={currentWinner.dateWon}
                    onChange={(e) => handleFieldChange(activeIdx, 'dateWon', e.target.value)}
                    placeholder="e.g. Muddee 2025 / December 2025"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* WINNER PHOTO UPLOAD (Requested Feature) */}
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                  <label className="block text-xs font-bold text-white flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-amber-400">
                      <Upload className="w-4 h-4" />
                      <span>Winner's Photo (Suuraa Nama Mo'atee)</span>
                    </span>
                    <span className="text-[10px] text-slate-400">File Upload or Link</span>
                  </label>

                  <div className="flex items-center gap-3">
                    <label className="cursor-pointer px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition flex items-center gap-2">
                      <Upload className="w-3.5 h-3.5" />
                      <span>Upload Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handlePhotoUpload(e, activeIdx)}
                        className="hidden"
                      />
                    </label>

                    <span className="text-xs text-slate-400">or URL:</span>
                  </div>

                  <input
                    type="text"
                    value={currentWinner.photoUrl}
                    onChange={(e) => handleFieldChange(activeIdx, 'photoUrl', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                  />

                  {/* Preset Avatars */}
                  <div className="pt-2 border-t border-slate-800">
                    <span className="text-[10px] text-slate-400 block mb-1">Quick Avatar Presets:</span>
                    <div className="flex gap-2">
                      {PRESET_WINNER_AVATARS.map((av) => (
                        <button
                          key={av.label}
                          type="button"
                          onClick={() => handleFieldChange(activeIdx, 'photoUrl', av.url)}
                          className={`w-9 h-9 rounded-xl overflow-hidden border-2 transition ${
                            currentWinner.photoUrl === av.url ? 'border-amber-400 scale-105' : 'border-slate-800 opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={av.url} alt={av.label} className="w-full h-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Testimonial Quote in 3 Languages with Auto-Translation */}
                <div className="space-y-3 pt-1 border-t border-slate-800">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-300">
                      Winner's Testimonial (Yaada & Jecha Injifataa)
                    </label>
                    <span className="text-[10px] text-amber-400 bg-amber-950/70 border border-amber-800/60 px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
                      <Sparkles className="w-3 h-3" /> Auto-Translate
                    </span>
                  </div>

                  {/* Afaan Oromoo */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] text-amber-400 font-semibold">
                        Afaan Oromoo (Native)
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAutoTranslateTestimonial(activeIdx, 'om')}
                        disabled={!currentWinner.testimonial?.om}
                        className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-1 transition disabled:opacity-30"
                        title="Translate to English and Amharic"
                      >
                        <Languages className="w-3 h-3" />
                        <span>Translate to English & Amharic</span>
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      value={currentWinner.testimonial?.om || ''}
                      onChange={(e) => handleTestimonialChange(activeIdx, 'om', e.target.value)}
                      placeholder="Carraan kun 100% dhugaa dha, galatoomaa..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* English */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] text-slate-400 font-semibold">
                        English
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAutoTranslateTestimonial(activeIdx, 'en')}
                        disabled={!currentWinner.testimonial?.en}
                        className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-1 transition disabled:opacity-30"
                        title="Translate to Oromoo and Amharic"
                      >
                        <Languages className="w-3 h-3" />
                        <span>Translate to Oromoo & Amharic</span>
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      value={currentWinner.testimonial?.en || ''}
                      onChange={(e) => handleTestimonialChange(activeIdx, 'en', e.target.value)}
                      placeholder="100% genuine and transparent lottery draw..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* Amharic */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] text-slate-400 font-semibold">
                        አማርኛ (Amharic)
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAutoTranslateTestimonial(activeIdx, 'am')}
                        disabled={!currentWinner.testimonial?.am}
                        className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-1 transition disabled:opacity-30"
                        title="Translate to Oromoo and English"
                      >
                        <Languages className="w-3 h-3" />
                        <span>Translate to Oromoo & English</span>
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      value={currentWinner.testimonial?.am || ''}
                      onChange={(e) => handleTestimonialChange(activeIdx, 'am', e.target.value)}
                      placeholder="ይህ ዕጣ እውነተኛ ነው፣ በጣም አመሰግናለሁ..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

              </div>

              {/* Right Live Card Preview */}
              <div className="lg:col-span-5 space-y-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Winner Card Live Preview
                </span>

                <div className="bg-gradient-to-b from-slate-900 to-slate-950 border-2 border-amber-500/60 rounded-3xl p-5 shadow-2xl relative overflow-hidden space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="relative w-16 h-16 rounded-2xl overflow-hidden border-2 border-amber-400 shadow flex-shrink-0 bg-slate-950">
                      <img
                        src={currentWinner.photoUrl}
                        alt={currentWinner.fullName}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute bottom-0 right-0 bg-emerald-500 text-slate-950 p-0.5 rounded-tl-lg">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-extrabold text-white text-sm">
                          {currentWinner.fullName}
                        </h4>
                        <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-1.5 py-0.5 rounded border border-emerald-800">
                          Verified
                        </span>
                      </div>
                      <p className="text-xs text-amber-400 font-semibold">{currentWinner.prizeWon}</p>
                      <p className="text-[10px] text-slate-400">{currentWinner.city} • {currentWinner.dateWon}</p>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-xs text-slate-300 italic">
                    "{currentWinner.testimonial?.[language] || currentWinner.testimonial?.om}"
                  </div>

                  <div className="pt-2 border-t border-slate-800 flex justify-between items-center text-xs font-mono">
                    <span className="text-slate-500">Ticket Serial:</span>
                    <span className="text-amber-400 font-bold">{currentWinner.ticketNumber}</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl text-[11px] text-slate-400">
                  🏆 When published, this winner card is displayed on the website's Verified Winners showcase for all visitors!
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Total Winners: <strong className="text-white">{editedWinners.length}</strong>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-semibold rounded-xl transition"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-lg transition flex items-center gap-1.5"
            >
              {saveSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Published!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Publish Winners to App</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
