import React, { useState } from 'react';
import { EraId } from '../types';
import { ERAS_DATA } from '../data/erasData';
import { soundManager } from '../utils/audio';
import {
  Volume2,
  VolumeX,
  Sparkles,
  Compass,
  Pickaxe,
  BookOpen,
  HelpCircle,
  Palette,
  Eye,
  Sliders,
  ChevronDown,
} from 'lucide-react';

export type AppView = 'portal' | 'habitat' | 'dig' | 'quiz' | 'art' | 'encyclopedia' | 'journal';

interface NavbarProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
  selectedEraId: EraId;
  onSelectEra: (eraId: EraId) => void;
  soundMuted: boolean;
  onToggleSound: () => void;
  volume: number;
  onChangeVolume: (val: number) => void;
  reducedMotion: boolean;
  onToggleReducedMotion: () => void;
  explorerLevel: number;
  explorerXp: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onChangeView,
  selectedEraId,
  onSelectEra,
  soundMuted,
  onToggleSound,
  volume,
  onChangeVolume,
  reducedMotion,
  onToggleReducedMotion,
  explorerLevel,
  explorerXp,
}) => {
  const [showEraMenu, setShowEraMenu] = useState<boolean>(false);
  const [showAudioControls, setShowAudioControls] = useState<boolean>(false);

  const activeEra = ERAS_DATA.find((e) => e.id === selectedEraId) || ERAS_DATA[2];

  const handleNavClick = (view: AppView) => {
    soundManager.playPipBeep('happy');
    onChangeView(view);
  };

  const handleEraSelect = (id: EraId) => {
    soundManager.playTimeWarp();
    onSelectEra(id);
    setShowEraMenu(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-stone-950/90 backdrop-blur-md border-b border-stone-800 text-stone-100 select-none px-3 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Brand / Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => handleNavClick('portal')}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 p-0.5 shadow-[0_0_15px_rgba(245,158,11,0.4)] group-hover:scale-105 transition-transform flex items-center justify-center">
              <span className="text-xl">🦖</span>
            </div>
            <div>
              <span className="text-lg font-black tracking-wider text-white font-['Outfit'] block leading-none">
                TIME<span className="text-amber-400">WILD</span>
              </span>
              <span className="text-[10px] text-stone-400 font-semibold tracking-wider uppercase block">
                Prehistoric Odyssey
              </span>
            </div>
          </button>

          {/* Quick Era Dropdown (Desktop & Tablet) */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setShowEraMenu(!showEraMenu)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 border border-stone-800 hover:border-amber-400/50 text-xs font-semibold text-stone-200 transition-colors cursor-pointer"
            >
              <span
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: activeEra.themeColor }}
              />
              <span className="truncate max-w-[120px]">{activeEra.name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400" />
            </button>

            {showEraMenu && (
              <div className="absolute top-full left-0 mt-2 w-64 bg-stone-900 border border-stone-800 rounded-2xl p-2 shadow-2xl z-50 animate-fade-in space-y-1">
                <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider px-2 py-1">
                  Travel to Era:
                </div>
                {ERAS_DATA.map((era) => (
                  <button
                    key={era.id}
                    onClick={() => handleEraSelect(era.id)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between cursor-pointer transition-colors ${
                      era.id === selectedEraId
                        ? 'bg-amber-500 text-stone-950 font-bold'
                        : 'text-stone-300 hover:bg-stone-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span>{era.creatures[0]?.avatarEmoji}</span>
                      <span>{era.name}</span>
                    </div>
                    <span className="text-[10px] opacity-75">{era.timeRange.split(' ')[0]}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Center Navigation Tabs */}
        <nav className="flex items-center gap-1 overflow-x-auto max-w-[55%] sm:max-w-none py-1">
          <button
            onClick={() => handleNavClick('portal')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              currentView === 'portal'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'text-stone-300 hover:bg-stone-900'
            }`}
          >
            <span>🌀</span>
            <span className="hidden sm:inline">Portal</span>
          </button>

          <button
            onClick={() => handleNavClick('habitat')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              currentView === 'habitat'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'text-stone-300 hover:bg-stone-900'
            }`}
          >
            <span>🌿</span>
            <span className="hidden sm:inline">Living World</span>
          </button>

          <button
            onClick={() => handleNavClick('dig')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              currentView === 'dig'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'text-stone-300 hover:bg-stone-900'
            }`}
          >
            <span>⛏️</span>
            <span className="hidden sm:inline">Fossil Dig</span>
          </button>

          <button
            onClick={() => handleNavClick('quiz')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              currentView === 'quiz'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'text-stone-300 hover:bg-stone-900'
            }`}
          >
            <span>❓</span>
            <span className="hidden sm:inline">Quiz</span>
          </button>

          <button
            onClick={() => handleNavClick('art')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              currentView === 'art'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'text-stone-300 hover:bg-stone-900'
            }`}
          >
            <span>🎨</span>
            <span className="hidden sm:inline">Cave Art</span>
          </button>

          <button
            onClick={() => handleNavClick('encyclopedia')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              currentView === 'encyclopedia'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'text-stone-300 hover:bg-stone-900'
            }`}
          >
            <span>📖</span>
            <span className="hidden sm:inline">Codex</span>
          </button>

          <button
            onClick={() => handleNavClick('journal')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
              currentView === 'journal'
                ? 'bg-amber-500 text-stone-950 shadow-md'
                : 'text-stone-300 hover:bg-stone-900'
            }`}
          >
            <span>🧭</span>
            <span className="hidden sm:inline">Journal</span>
          </button>
        </nav>

        {/* Right Action Icons: Audio, Reduced Motion, Kid Profile */}
        <div className="flex items-center gap-2">
          {/* Audio volume & mute toggle */}
          <div className="relative">
            <button
              onClick={() => {
                onToggleSound();
                soundManager.playPipBeep('happy');
              }}
              title={soundMuted ? 'Sound Muted' : 'Sound Enabled'}
              className={`p-2 rounded-xl border transition-colors cursor-pointer ${
                soundMuted
                  ? 'bg-stone-900 border-stone-800 text-stone-500'
                  : 'bg-stone-900 border-stone-800 text-amber-400 hover:border-amber-400/50'
              }`}
            >
              {soundMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>

          {/* Reduced Motion Toggle Button */}
          <button
            onClick={() => {
              onToggleReducedMotion();
              soundManager.playPipBeep('curious');
            }}
            title={reducedMotion ? 'Reduced Motion: ON' : 'Reduced Motion: OFF'}
            className={`p-2 rounded-xl border transition-colors cursor-pointer hidden sm:block ${
              reducedMotion
                ? 'bg-amber-500/20 border-amber-400 text-amber-300'
                : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
            }`}
          >
            <Sliders className="w-4 h-4" />
          </button>

          {/* Explorer XP Badge */}
          <button
            onClick={() => handleNavClick('journal')}
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 hover:bg-amber-500/20 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-xs font-extrabold font-mono">
              Lvl {explorerLevel} · {explorerXp} XP
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
