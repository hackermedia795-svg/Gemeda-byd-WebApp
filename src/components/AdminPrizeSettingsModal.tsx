import React, { useState } from 'react';
import { 
  X, 
  Trophy, 
  Award, 
  Smartphone, 
  Car, 
  Coins, 
  Plus, 
  Trash2, 
  RotateCcw, 
  Save, 
  CheckCircle2, 
  Sparkles,
  Image as ImageIcon,
  Upload,
  Layers,
  Languages
} from 'lucide-react';
import { Language, LotteryPrize } from '../types';
import { translations } from '../translations';
import { DEFAULT_PRIZES } from '../data/seedData';
import { autoTranslateToAll, SupportedLang } from '../utils/translator';

interface AdminPrizeSettingsModalProps {
  language: Language;
  prizes: LotteryPrize[];
  onSavePrizes: (newPrizes: LotteryPrize[]) => void;
  onClose: () => void;
}

// Preset vehicle and prize photos for easy 1-click selection
const PRESET_PRIZE_IMAGES = [
  { label: 'BYD Song Plus (White SUV)', url: 'https://images.unsplash.com/photo-1590362891991-f776e747a588?w=900&auto=format&fit=crop&q=85' },
  { label: 'BYD Seagull (Cyan EV)', url: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=900&auto=format&fit=crop&q=85' },
  { label: 'BYD Han (Black Luxury Sedan)', url: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?w=900&auto=format&fit=crop&q=85' },
  { label: '500,000 ETB Cash Stack', url: 'https://images.unsplash.com/photo-1580519542036-c47de6196ba5?w=800&auto=format&fit=crop&q=80' },
  { label: 'iPhone 16 Pro Max Titanium', url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&auto=format&fit=crop&q=80' },
  { label: 'Smart 7kW Home Wallbox EV Charger', url: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=800&auto=format&fit=crop&q=80' }
];

export const AdminPrizeSettingsModal: React.FC<AdminPrizeSettingsModalProps> = ({
  language,
  prizes,
  onSavePrizes,
  onClose,
}) => {
  const t = translations[language];
  const [editedPrizes, setEditedPrizes] = useState<LotteryPrize[]>(() => 
    JSON.parse(JSON.stringify(prizes && prizes.length > 0 ? prizes : DEFAULT_PRIZES))
  );

  const [activeTab, setActiveTab] = useState<number>(0);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleFieldChange = (index: number, field: keyof LotteryPrize, value: any) => {
    setEditedPrizes(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleDescChange = (index: number, langKey: 'om' | 'en' | 'am', value: string) => {
    setEditedPrizes(prev => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        description: {
          ...copy[index].description,
          [langKey]: value
        }
      };
      return copy;
    });
  };

  const handleAutoTranslateDesc = (index: number, sourceLang: SupportedLang) => {
    const text = editedPrizes[index]?.description?.[sourceLang];
    if (!text || text.trim() === '') return;
    const translated = autoTranslateToAll(text, sourceLang);
    setEditedPrizes(prev => {
      const copy = [...prev];
      copy[index] = {
        ...copy[index],
        description: {
          om: sourceLang === 'om' ? text : translated.om,
          en: sourceLang === 'en' ? text : translated.en,
          am: sourceLang === 'am' ? text : translated.am
        }
      };
      return copy;
    });
  };

  // Image Upload handler via FileReader
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        handleFieldChange(index, 'imageUrl', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddPrize = () => {
    const nextRank = editedPrizes.length + 1;
    const newPrize: LotteryPrize = {
      id: `prize-${Date.now()}`,
      rank: nextRank,
      badge: `${nextRank}th Prize`,
      name: 'Electric Scooter or Cash Prize',
      subtitle: 'Extra Consolation Grand Reward',
      valueText: '100,000 ETB',
      description: {
        om: 'Badhaasa dabalataa maamiltoota qooda fudhataniif kennamu.',
        en: 'Additional runner-up consolation reward for verified ticket holders.',
        am: 'ተጨማሪ የማበረታቻ ሽልማት ለተሳታፊዎች።'
      },
      iconType: 'award'
    };
    setEditedPrizes(prev => [...prev, newPrize]);
    setActiveTab(editedPrizes.length);
  };

  const handleDeletePrize = (index: number) => {
    if (editedPrizes.length <= 1) {
      alert('You must have at least one grand prize in the lottery.');
      return;
    }
    const updated = editedPrizes.filter((_, i) => i !== index);
    setEditedPrizes(updated);
    setActiveTab(Math.max(0, index - 1));
  };

  const handleResetDefaults = () => {
    if (confirm('Reset all prizes to original default BYD configuration?')) {
      setEditedPrizes(JSON.parse(JSON.stringify(DEFAULT_PRIZES)));
      setActiveTab(0);
    }
  };

  const handleSave = () => {
    onSavePrizes(editedPrizes);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 700);
  };

  const currentPrize = editedPrizes[activeTab] || editedPrizes[0];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden my-6">
        
        {/* Modal Header */}
        <div className="bg-slate-950 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-white text-base">
                  {language === 'om' 
                    ? 'Qindaa\'ina Badhaasawwan Gurguddoo (Grand Prizes & Photos)' 
                    : language === 'am' 
                    ? 'የዋና ዋና ሽልማቶች እና ፎቶዎች ማስተካከያ' 
                    : 'Grand Prizes & Photo Uploader'}
                </h3>
                <span className="text-[10px] bg-amber-950 text-amber-400 border border-amber-800 px-2 py-0.5 rounded-full font-bold">
                  Photo Upload Enabled
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {language === 'om'
                  ? 'Suuraawwan badhaasaa ol-fe\'aa (Upload), jijjiiraa, fi odeeffannoo isaa qindeessaa'
                  : 'Upload prize photos, set vehicles, values, and specifications in real-time'}
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

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[74vh] overflow-y-auto">
          
          {/* Prize Rank Selector Tabs */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-4">
            <div className="flex flex-wrap items-center gap-2">
              {editedPrizes.map((pz, idx) => (
                <button
                  key={pz.id || idx}
                  type="button"
                  onClick={() => setActiveTab(idx)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
                    activeTab === idx
                      ? 'bg-amber-500 text-slate-950 shadow-md'
                      : 'bg-slate-950 text-slate-300 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  <Trophy className="w-3.5 h-3.5" />
                  <span>#{idx + 1}: {pz.name || `Prize ${idx + 1}`}</span>
                </button>
              ))}

              <button
                type="button"
                onClick={handleAddPrize}
                className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-emerald-400 border border-slate-700 text-xs font-bold transition flex items-center gap-1.5"
                title="Add New Prize Rank"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Prize</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleResetDefaults}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
          </div>

          {/* Current Selected Prize Editor Form */}
          {currentPrize && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Form Fields */}
              <div className="lg:col-span-7 space-y-4">
                
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                    Editing Prize #{activeTab + 1}
                  </span>
                  {editedPrizes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleDeletePrize(activeTab)}
                      className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Remove This Prize</span>
                    </button>
                  )}
                </div>

                {/* Badge & Value */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Prize Rank Badge
                    </label>
                    <input
                      type="text"
                      value={currentPrize.badge}
                      onChange={(e) => handleFieldChange(activeTab, 'badge', e.target.value)}
                      placeholder="e.g. 1st Prize / Carraa 1ffaa"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-300 mb-1">
                      Estimated Value (ETB / Birr)
                    </label>
                    <input
                      type="text"
                      value={currentPrize.valueText}
                      onChange={(e) => handleFieldChange(activeTab, 'valueText', e.target.value)}
                      placeholder="e.g. 4,500,000 ETB"
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono font-bold text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* Prize Name */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Prize Title / Vehicle Model
                  </label>
                  <input
                    type="text"
                    value={currentPrize.name}
                    onChange={(e) => handleFieldChange(activeTab, 'name', e.target.value)}
                    placeholder="e.g. BYD Song Plus EV, BYD Seagull, 500,000 ETB..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-sm font-bold focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* Subtitle */}
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">
                    Prize Subtitle / Specs Tagline
                  </label>
                  <input
                    type="text"
                    value={currentPrize.subtitle}
                    onChange={(e) => handleFieldChange(activeTab, 'subtitle', e.target.value)}
                    placeholder="e.g. Brand New 2026 Electric Luxury SUV (0 km)"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* PHOTO UPLOADER (Requested Feature: "SUURAAWWAAN BADHASAA AKKA JIJJIRUU YKN OPLOAD GODHUU") */}
                <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl space-y-3">
                  <label className="block text-xs font-bold text-white flex items-center justify-between">
                    <span className="flex items-center gap-1.5 text-amber-400">
                      <Upload className="w-4 h-4" />
                      <span>{language === 'om' ? 'Suuraa Badhaasaa Ol-fe\'aa (Upload Photo)' : 'Upload Prize Photo'}</span>
                    </span>
                    <span className="text-[10px] text-slate-400">PNG, JPG, WebP</span>
                  </label>

                  <div className="flex items-center gap-3">
                    <label className="cursor-pointer px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs rounded-xl transition flex items-center gap-2">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{language === 'om' ? 'Suuraa Filadhaa' : 'Choose Local File'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileUpload(e, activeTab)}
                        className="hidden"
                      />
                    </label>

                    <span className="text-xs text-slate-400">ykn Linkii (URL) asitti galchaa:</span>
                  </div>

                  <input
                    type="text"
                    value={currentPrize.imageUrl || ''}
                    onChange={(e) => handleFieldChange(activeTab, 'imageUrl', e.target.value)}
                    placeholder="https://... image URL"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs font-mono focus:outline-none focus:border-amber-400"
                  />

                  {/* Preset 1-Click Images */}
                  <div className="pt-2 border-t border-slate-800">
                    <span className="text-[10px] text-slate-400 block mb-1.5 font-semibold">
                      Suuraawwan Qophaa'an (1-Click Presets):
                    </span>
                    <div className="flex flex-wrap gap-1.5 text-[10px]">
                      {PRESET_PRIZE_IMAGES.map((preset) => (
                        <button
                          key={preset.label}
                          type="button"
                          onClick={() => handleFieldChange(activeTab, 'imageUrl', preset.url)}
                          className={`px-2 py-1 rounded-lg border transition ${
                            currentPrize.imageUrl === preset.url
                              ? 'bg-amber-500/20 text-amber-300 border-amber-500/50'
                              : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-white'
                          }`}
                        >
                          {preset.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Descriptions in 3 Languages with Auto-Translation */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-300 uppercase">
                      Description in 3 Languages
                    </h4>
                    <span className="text-[10px] text-amber-400 bg-amber-950/70 border border-amber-800/60 px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
                      <Sparkles className="w-3 h-3" /> Auto-Translate
                    </span>
                  </div>

                  {/* Afaan Oromoo */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] text-amber-400 font-semibold">
                        Afaan Oromoo (Native)
                      </label>
                      <button
                        type="button"
                        onClick={() => handleAutoTranslateDesc(activeTab, 'om')}
                        disabled={!currentPrize.description?.om}
                        className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-1 transition disabled:opacity-30"
                        title="Translate to English and Amharic"
                      >
                        <Languages className="w-3 h-3" />
                        <span>Translate to English & Amharic</span>
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      value={currentPrize.description?.om || ''}
                      onChange={(e) => handleDescChange(activeTab, 'om', e.target.value)}
                      placeholder="Ibsa badhaasaa Afaan Oromootiin..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* English */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] text-slate-400 font-semibold">
                        English
                      </label>
                      <button
                        type="button"
                        onClick={() => handleAutoTranslateDesc(activeTab, 'en')}
                        disabled={!currentPrize.description?.en}
                        className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-1 transition disabled:opacity-30"
                        title="Translate to Oromoo and Amharic"
                      >
                        <Languages className="w-3 h-3" />
                        <span>Translate to Oromoo & Amharic</span>
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      value={currentPrize.description?.en || ''}
                      onChange={(e) => handleDescChange(activeTab, 'en', e.target.value)}
                      placeholder="Prize description in English..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>

                  {/* Amharic */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="text-[11px] text-slate-400 font-semibold">
                        አማርኛ (Amharic)
                      </label>
                      <button
                        type="button"
                        onClick={() => handleAutoTranslateDesc(activeTab, 'am')}
                        disabled={!currentPrize.description?.am}
                        className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-1 transition disabled:opacity-30"
                        title="Translate to Oromoo and English"
                      >
                        <Languages className="w-3 h-3" />
                        <span>Translate to Oromoo & English</span>
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      value={currentPrize.description?.am || ''}
                      onChange={(e) => handleDescChange(activeTab, 'am', e.target.value)}
                      placeholder="የሽልማቱ ዝርዝር መረጃ በአማርኛ..."
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-white text-xs focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

              </div>

              {/* Right Column: Live Card Preview with Uploaded Image */}
              <div className="lg:col-span-5 space-y-3">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
                  Live Preview on User Home Page
                </span>

                <div className="relative rounded-2xl bg-gradient-to-b from-amber-950/40 via-slate-900 to-slate-950 border-2 border-amber-500/60 p-5 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="bg-amber-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded uppercase">
                      {currentPrize.badge || 'Prize'}
                    </span>
                    <Trophy className="w-5 h-5 text-amber-400" />
                  </div>

                  {currentPrize.imageUrl ? (
                    <div className="h-44 w-full rounded-xl overflow-hidden bg-slate-950 border border-slate-800">
                      <img
                        src={currentPrize.imageUrl}
                        alt={currentPrize.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="h-44 w-full rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-500 text-xs">
                      No Photo Uploaded Yet
                    </div>
                  )}

                  <div>
                    <h4 className="text-lg font-bold text-white leading-tight">
                      {currentPrize.name}
                    </h4>
                    <p className="text-xs text-amber-300 font-medium mt-0.5">
                      {currentPrize.subtitle}
                    </p>
                  </div>

                  <p className="text-[11px] text-slate-400 line-clamp-3">
                    {currentPrize.description?.[language] || currentPrize.description?.en}
                  </p>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs">
                    <span className="text-slate-400">Value</span>
                    <span className="font-black text-amber-400 text-base">
                      {currentPrize.valueText}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-[11px] text-slate-400">
                  💡 All photo uploads and changes made here immediately sync with the live website!
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-950 px-6 py-4 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs text-slate-400">
            Total Active Prizes: <strong className="text-white">{editedPrizes.length}</strong>
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
              className="px-6 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 transition flex items-center gap-1.5"
            >
              {saveSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save All Prize Changes</span>
                </>
              )}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
