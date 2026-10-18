import React, { useState } from 'react';
import { 
  X, 
  Monitor, 
  Tablet, 
  Smartphone, 
  Save, 
  CheckCircle2, 
  Sparkles, 
  RotateCcw,
  Eye,
  Sliders,
  Image as ImageIcon,
  Flame,
  Zap,
  Clock,
  ArrowRight,
  Upload,
  Languages,
  Calendar
} from 'lucide-react';
import { Language, HomeConfig, LotteryPrize } from '../types';
import { DEFAULT_HOME_CONFIG, DEFAULT_PRIZES } from '../data/seedData';
import { HeroCarShowcase } from './HeroCarShowcase';
import { autoTranslateToAll, SupportedLang } from '../utils/translator';
import { DrawCountdownTimer } from './DrawCountdownTimer';

const PRESET_CAR_MODELS = [
  {
    name: 'BYD Song Plus EV',
    range: '520 KM',
    acc: '7.9s 0-100',
    val: '4,500,000 ETB',
    img: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=1200&auto=format&fit=crop&q=80',
    label: 'Song Plus SUV'
  },
  {
    name: 'BYD Seal EV Sedan',
    range: '650 KM',
    acc: '3.8s 0-100',
    val: '5,800,000 ETB',
    img: 'https://images.unsplash.com/photo-1617814076367-b759c7d7e738?w=1200&auto=format&fit=crop&q=80',
    label: 'BYD Seal Sedan'
  },
  {
    name: 'BYD Seagull EV Compact',
    range: '405 KM',
    acc: '9.5s 0-100',
    val: '2,900,000 ETB',
    img: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&auto=format&fit=crop&q=80',
    label: 'BYD Seagull'
  },
  {
    name: 'BYD Atto 3 Crossover',
    range: '480 KM',
    acc: '7.3s 0-100',
    val: '4,100,000 ETB',
    img: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&auto=format&fit=crop&q=80',
    label: 'BYD Atto 3'
  },
  {
    name: 'BYD Han Flagship EV',
    range: '715 KM',
    acc: '3.9s 0-100',
    val: '6,200,000 ETB',
    img: 'https://images.unsplash.com/photo-1563720223185-11003d516935?w=1200&auto=format&fit=crop&q=80',
    label: 'BYD Han'
  }
];

interface AdminHomeLivePreviewModalProps {
  language: Language;
  homeConfig: HomeConfig;
  prizes: LotteryPrize[];
  onSaveHomeConfig: (newConfig: HomeConfig) => void;
  onClose: () => void;
}

export const AdminHomeLivePreviewModal: React.FC<AdminHomeLivePreviewModalProps> = ({
  language,
  homeConfig,
  prizes,
  onSaveHomeConfig,
  onClose,
}) => {
  // Local state for live editing
  const [editedConfig, setEditedConfig] = useState<HomeConfig>(() => 
    JSON.parse(JSON.stringify(homeConfig || DEFAULT_HOME_CONFIG))
  );

  // Viewport simulator mode: 'desktop' | 'tablet' | 'mobile'
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [translatingField, setTranslatingField] = useState<string | null>(null);

  const handleTextChange = (field: keyof HomeConfig, value: any) => {
    setEditedConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLocalizedChange = (field: 'heroTitle' | 'heroDesc', langKey: 'om' | 'en' | 'am', value: string) => {
    setEditedConfig(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [langKey]: value
      }
    }));
  };

  // Trilingual auto-translation trigger: Translates from whichever language has content into the other two
  const handleAutoTranslateField = (field: 'heroTitle' | 'heroDesc', sourceLang: SupportedLang) => {
    const sourceText = editedConfig[field]?.[sourceLang];
    if (!sourceText || sourceText.trim() === '') return;

    setTranslatingField(`${field}-${sourceLang}`);
    const translated = autoTranslateToAll(sourceText, sourceLang);
    
    setEditedConfig(prev => ({
      ...prev,
      [field]: {
        om: sourceLang === 'om' ? sourceText : translated.om,
        en: sourceLang === 'en' ? sourceText : translated.en,
        am: sourceLang === 'am' ? sourceText : translated.am
      }
    }));

    setTimeout(() => {
      setTranslatingField(null);
    }, 400);
  };

  // Car image upload handler (reads local file from user's device/phone/laptop)
  const handleCarPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          handleTextChange('featuredCarImage', reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApplyPresetCar = (preset: typeof PRESET_CAR_MODELS[0]) => {
    setEditedConfig(prev => ({
      ...prev,
      featuredCarName: preset.name,
      featuredCarImage: preset.img,
      featuredCarRange: preset.range,
      featuredCarAcceleration: preset.acc,
      featuredCarValue: preset.val
    }));
  };

  const handleResetDefaults = () => {
    if (confirm('Reset home page configuration to default?')) {
      setEditedConfig(JSON.parse(JSON.stringify(DEFAULT_HOME_CONFIG)));
    }
  };

  const handleSave = () => {
    onSaveHomeConfig(editedConfig);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/90 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-7xl bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl flex flex-col h-[94vh] overflow-hidden">
        
        {/* Top Control Bar */}
        <div className="bg-slate-950 px-6 py-3.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-white text-base">
                  {language === 'om' ? 'To\'annoo Fuula Jalqabaa (Home Page Live Controller)' : 'Home Page Live Preview & Customizer'}
                </h3>
                <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full font-bold">
                  Live Sync
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {language === 'om' 
                  ? 'Gara bitaatti gulaalaa, gara mirgaatti battalumatti akka maamilli argutti ilaalaa'
                  : 'Edit fields on the left; see real-time updates on the right as your customers see it'}
              </p>
            </div>
          </div>

          {/* Viewport switchers & Actions */}
          <div className="flex items-center gap-3">
            {/* Viewport simulator */}
            <div className="hidden sm:flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs">
              <button
                type="button"
                onClick={() => setViewport('desktop')}
                className={`p-1.5 rounded-lg transition ${
                  viewport === 'desktop' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                }`}
                title="Desktop View"
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewport('tablet')}
                className={`p-1.5 rounded-lg transition ${
                  viewport === 'tablet' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                }`}
                title="Tablet View"
              >
                <Tablet className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewport('mobile')}
                className={`p-1.5 rounded-lg transition ${
                  viewport === 'mobile' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'
                }`}
                title="Mobile View"
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>

            <button
              type="button"
              onClick={handleResetDefaults}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Reset Defaults</span>
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="px-5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs rounded-xl shadow transition flex items-center gap-1.5"
            >
              {saveSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Published!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Publish to Home</span>
                </>
              )}
            </button>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white bg-slate-900 rounded-xl transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Main Workspace: Split View */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          
          {/* Left Column: Admin Controls Form */}
          <div className="lg:col-span-5 bg-slate-950/70 border-r border-slate-800 p-6 space-y-5 overflow-y-auto max-h-[85vh]">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Home Elements Customizer
              </span>
              <span className="text-[11px] text-slate-500">Live preview active</span>
            </div>

            {/* Hero Badge */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Hero Announcement Badge
              </label>
              <input
                type="text"
                value={editedConfig.heroBadge}
                onChange={(e) => handleTextChange('heroBadge', e.target.value)}
                placeholder="e.g. Carraa Guddaa Waggaa 2026"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-400 font-bold"
              />
            </div>

            {/* Featured Car Name */}
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">
                Featured Grand Car Model Name
              </label>
              <input
                type="text"
                value={editedConfig.featuredCarName}
                onChange={(e) => handleTextChange('featuredCarName', e.target.value)}
                placeholder="BYD Song Plus EV"
                className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-white text-xs focus:outline-none focus:border-amber-400 font-bold"
              />
            </div>

            {/* Hero Titles in 3 Languages with Magic Translation */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 block uppercase">
                  Hero Headline (Title) in 3 Languages
                </span>
                <span className="text-[10px] text-amber-400 bg-amber-950/70 border border-amber-800/60 px-2 py-0.5 rounded-full flex items-center gap-1 font-bold">
                  <Sparkles className="w-3 h-3" /> Auto-Translate
                </span>
              </div>

              {/* Afaan Oromoo */}
              <div>
                <div className="flex items-center justify-between mb-0.5">
                  <label className="text-[11px] text-amber-400 font-semibold">
                    Afaan Oromoo (Native)
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAutoTranslateField('heroTitle', 'om')}
                    disabled={!editedConfig.heroTitle?.om}
                    className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-1 transition disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Translate this Afaan Oromoo title to English and Amharic"
                  >
                    <Languages className="w-3 h-3" />
                    <span>{translatingField === 'heroTitle-om' ? 'Translating...' : 'Translate to English & Amharic'}</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={editedConfig.heroTitle?.om || ''}
                  onChange={(e) => handleLocalizedChange('heroTitle', 'om', e.target.value)}
                  placeholder="Fkn: Konkolaataa Haaraa BYD Song Plus EV Injifadhaa!"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white text-xs focus:outline-none focus:border-amber-400 font-semibold"
                />
              </div>

              {/* English */}
              <div>
                <div className="flex items-center justify-between mb-0.5">
                  <label className="text-[11px] text-slate-400 font-semibold">
                    English
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAutoTranslateField('heroTitle', 'en')}
                    disabled={!editedConfig.heroTitle?.en}
                    className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-1 transition disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Translate this English title to Afaan Oromoo and Amharic"
                  >
                    <Languages className="w-3 h-3" />
                    <span>{translatingField === 'heroTitle-en' ? 'Translating...' : 'Translate to Oromoo & Amharic'}</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={editedConfig.heroTitle?.en || ''}
                  onChange={(e) => handleLocalizedChange('heroTitle', 'en', e.target.value)}
                  placeholder="e.g. Win a Brand New BYD Song Plus EV!"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Amharic */}
              <div>
                <div className="flex items-center justify-between mb-0.5">
                  <label className="text-[11px] text-slate-400 font-semibold">
                    አማርኛ (Amharic)
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAutoTranslateField('heroTitle', 'am')}
                    disabled={!editedConfig.heroTitle?.am}
                    className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-1 transition disabled:opacity-30 disabled:cursor-not-allowed"
                    title="Translate this Amharic title to Afaan Oromoo and English"
                  >
                    <Languages className="w-3 h-3" />
                    <span>{translatingField === 'heroTitle-am' ? 'Translating...' : 'Translate to Oromoo & English'}</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={editedConfig.heroTitle?.am || ''}
                  onChange={(e) => handleLocalizedChange('heroTitle', 'am', e.target.value)}
                  placeholder="ምሳሌ፡ አዲስ የቢዋይዲ ሶንግ ፕላስ ኢቪ መኪና ያሸንፉ!"
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white text-xs focus:outline-none focus:border-amber-400 font-semibold"
                />
              </div>
            </div>

            {/* Hero Description in 3 Languages with Magic Translation */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 block uppercase">
                  Hero Description Body (3 Languages)
                </span>
                <span className="text-[10px] text-slate-400">
                  Sync across languages
                </span>
              </div>

              {/* Afaan Oromoo Description */}
              <div>
                <div className="flex items-center justify-between mb-0.5">
                  <label className="text-[11px] text-amber-400 font-semibold">
                    Afaan Oromoo
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAutoTranslateField('heroDesc', 'om')}
                    disabled={!editedConfig.heroDesc?.om}
                    className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-1 transition disabled:opacity-30"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Auto-Translate</span>
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={editedConfig.heroDesc?.om || ''}
                  onChange={(e) => handleLocalizedChange('heroDesc', 'om', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* English Description */}
              <div>
                <div className="flex items-center justify-between mb-0.5">
                  <label className="text-[11px] text-slate-400 font-semibold">
                    English
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAutoTranslateField('heroDesc', 'en')}
                    disabled={!editedConfig.heroDesc?.en}
                    className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-1 transition disabled:opacity-30"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Auto-Translate</span>
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={editedConfig.heroDesc?.en || ''}
                  onChange={(e) => handleLocalizedChange('heroDesc', 'en', e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Amharic Description */}
              <div>
                <div className="flex items-center justify-between mb-0.5">
                  <label className="text-[11px] text-slate-400 font-semibold">
                    አማርኛ (Amharic)
                  </label>
                  <button
                    type="button"
                    onClick={() => handleAutoTranslateField('heroDesc', 'am')}
                    disabled={!editedConfig.heroDesc?.am}
                    className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-1 transition disabled:opacity-30"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Auto-Translate</span>
                  </button>
                </div>
                <textarea
                  rows={2}
                  value={editedConfig.heroDesc?.am || ''}
                  onChange={(e) => handleLocalizedChange('heroDesc', 'am', e.target.value)}
                  placeholder="በ500 ብር ብቻ ትኬት በመግዛት ዘመናዊ የቢዋይዲ መኪና የማሸነፍ ዕድል ያግኙ..."
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-white text-xs focus:outline-none focus:border-amber-400"
                />
              </div>
            </div>

            {/* Featured Car Photo & Specs (Car Image URL & UPLOAD IMAGE) */}
            <div className="space-y-3 pt-2 border-t border-slate-800">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-300 block uppercase">
                  Featured EV Image & Specs
                </span>
                <span className="text-[10px] text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full font-bold border border-emerald-800">
                  Upload & URL Ready
                </span>
              </div>

              {/* Photo Upload & URL Inputs */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-3 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-white flex items-center gap-1.5">
                    <ImageIcon className="w-3.5 h-3.5 text-amber-400" />
                    <span>Car Image (Suuraa Konkolaataa)</span>
                  </span>

                  {/* Local File Uploader Button */}
                  <label className="cursor-pointer px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] rounded-xl transition flex items-center gap-1.5 shadow">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Suuraa Ol-Fe'i (Upload Image)</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleCarPhotoUpload}
                      className="hidden"
                    />
                  </label>
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 mb-1">
                    Ykn Linkii Suuraa (Car Image URL):
                  </label>
                  <input
                    type="text"
                    value={editedConfig.featuredCarImage}
                    onChange={(e) => handleTextChange('featuredCarImage', e.target.value)}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>

                {/* 1-Click BYD Car Model Presets */}
                <div className="pt-2 border-t border-slate-800/80">
                  <span className="text-[10px] text-slate-400 block mb-1.5 font-semibold">
                    Model Presets (Filannoo Konkolaataa Qophaa'e):
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {PRESET_CAR_MODELS.map((preset) => (
                      <button
                        key={preset.name}
                        type="button"
                        onClick={() => handleApplyPresetCar(preset)}
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition flex items-center gap-1 ${
                          editedConfig.featuredCarName === preset.name
                            ? 'bg-amber-500 text-slate-950 border-amber-400 shadow'
                            : 'bg-slate-950 text-slate-300 border-slate-700 hover:border-amber-400/50'
                        }`}
                      >
                        <span>{preset.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Thumbnail Preview */}
                {editedConfig.featuredCarImage && (
                  <div className="relative rounded-xl overflow-hidden h-28 w-full bg-slate-950 border border-slate-800">
                    <img
                      src={editedConfig.featuredCarImage}
                      alt={editedConfig.featuredCarName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-1 right-1 bg-slate-950/80 px-2 py-0.5 rounded text-[10px] text-white font-mono">
                      {editedConfig.featuredCarName}
                    </div>
                  </div>
                )}
              </div>

              {/* Specs */}
              <div className="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <label className="block text-[10px] text-slate-400 mb-0.5">EV Range</label>
                  <input
                    type="text"
                    value={editedConfig.featuredCarRange}
                    onChange={(e) => handleTextChange('featuredCarRange', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-0.5">Acceleration</label>
                  <input
                    type="text"
                    value={editedConfig.featuredCarAcceleration}
                    onChange={(e) => handleTextChange('featuredCarAcceleration', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[10px] text-slate-400 mb-0.5">Est. Value</label>
                  <input
                    type="text"
                    value={editedConfig.featuredCarValue}
                    onChange={(e) => handleTextChange('featuredCarValue', e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-white text-xs font-bold"
                  />
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-800">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-amber-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Draw Date & Live Countdown Target</span>
                  </label>
                  <span className="text-[10px] text-slate-500 font-mono">Syncs to Hero</span>
                </div>

                <input
                  type="datetime-local"
                  value={editedConfig.drawDateIso || '2026-12-24T18:00'}
                  onChange={(e) => {
                    const iso = e.target.value;
                    setEditedConfig(prev => ({
                      ...prev,
                      drawDateIso: iso
                    }));
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white text-xs font-mono focus:outline-none focus:border-amber-400"
                />

                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {[
                    { label: '+7d', days: 7 },
                    { label: '+14d', days: 14 },
                    { label: '+30d', days: 30 },
                    { label: 'Dec 24', iso: '2026-12-24T18:00' }
                  ].map((p, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        let iso = p.iso;
                        if (p.days) {
                          const d = new Date(Date.now() + p.days * 86400000);
                          d.setHours(18, 0, 0, 0);
                          const year = d.getFullYear();
                          const month = String(d.getMonth() + 1).padStart(2, '0');
                          const day = String(d.getDate()).padStart(2, '0');
                          iso = `${year}-${month}-${day}T18:00`;
                        }
                        if (iso) {
                          setEditedConfig(prev => ({ ...prev, drawDateIso: iso }));
                        }
                      }}
                      className="px-2 py-0.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] text-slate-300 hover:text-white"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="block text-[10px] text-slate-400 mb-0.5">Public Headline Text</label>
                  <input
                    type="text"
                    value={editedConfig.drawDateText}
                    onChange={(e) => handleTextChange('drawDateText', e.target.value)}
                    placeholder="Guyyaa Carraan Baafamu: Muddee 15, 2026"
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-1.5 text-white text-xs focus:outline-none focus:border-amber-400"
                  />
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Interactive Live Preview Pane */}
          <div className="lg:col-span-7 bg-slate-950 p-4 sm:p-6 overflow-y-auto max-h-[85vh] flex flex-col items-center">
            
            <div className="w-full flex items-center justify-between pb-3 text-xs text-slate-400 border-b border-slate-800 mb-4">
              <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
                <Eye className="w-4 h-4" />
                <span>Live Rendering ({viewport.toUpperCase()} Mode)</span>
              </span>
              <span className="text-[11px] text-emerald-400 font-mono">
                Updates in Real-Time
              </span>
            </div>

            {/* Device Container Frame */}
            <div 
              className={`w-full transition-all duration-300 border border-slate-800 rounded-3xl overflow-hidden bg-slate-950 p-3 sm:p-6 shadow-2xl ${
                viewport === 'mobile'
                  ? 'max-w-[390px]'
                  : viewport === 'tablet'
                  ? 'max-w-[768px]'
                  : 'max-w-full'
              }`}
            >
              {/* Simulated Hero Section using editedConfig */}
              <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-950 border border-slate-800 p-5 sm:p-8 space-y-6">
                
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  <span>{editedConfig.heroBadge}</span>
                </div>

                <h2 className="text-2xl sm:text-4xl font-extrabold text-white leading-tight">
                  {editedConfig.heroTitle?.[language] || editedConfig.heroTitle?.om || 'Win a Brand New BYD Song Plus EV!'}
                </h2>

                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  {editedConfig.heroDesc?.[language] || editedConfig.heroDesc?.om}
                </p>

                {/* Car Showcase Card Live Preview */}
                <div className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 p-3">
                  <div className="flex justify-between items-center text-xs pb-2 border-b border-slate-800">
                    <span className="font-bold text-amber-400 uppercase">{editedConfig.featuredCarName}</span>
                    <span className="text-slate-400 font-mono text-[10px]">{editedConfig.featuredCarRange}</span>
                  </div>

                  <div className="h-44 sm:h-56 w-full rounded-xl overflow-hidden my-2 bg-slate-900">
                    <img
                      src={editedConfig.featuredCarImage}
                      alt={editedConfig.featuredCarName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center text-[10px] pt-1">
                    <div className="bg-slate-900 p-1.5 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block">Acceleration</span>
                      <span className="font-bold text-white">{editedConfig.featuredCarAcceleration}</span>
                    </div>
                    <div className="bg-slate-900 p-1.5 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block">Range</span>
                      <span className="font-bold text-amber-400">{editedConfig.featuredCarRange}</span>
                    </div>
                    <div className="bg-slate-900 p-1.5 rounded-lg border border-slate-800">
                      <span className="text-slate-400 block">Value</span>
                      <span className="font-bold text-emerald-400">{editedConfig.featuredCarValue}</span>
                    </div>
                  </div>
                </div>

                {/* Real-time animated countdown timer in live preview */}
                <div className="pt-2">
                  <DrawCountdownTimer
                    language={language}
                    drawDateIso={editedConfig.drawDateIso}
                    drawDateText={editedConfig.drawDateText}
                    variant="compact"
                  />
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
