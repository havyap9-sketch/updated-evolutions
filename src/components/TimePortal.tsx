import React, { useState } from 'react';
import { ERAS_DATA } from '../data/erasData';
import { EraId } from '../types';
import { soundManager } from '../utils/audio';
import { Sparkles, Compass, ShieldAlert, ArrowRight, Play } from 'lucide-react';

interface TimePortalProps {
  onWarpToEra: (eraId: EraId) => void;
  selectedEraId: EraId;
  reducedMotion: boolean;
}

export const TimePortal: React.FC<TimePortalProps> = ({
  onWarpToEra,
  selectedEraId,
  reducedMotion,
}) => {
  const [activeEraId, setActiveEraId] = useState<EraId>(selectedEraId);
  const [isWarping, setIsWarping] = useState<boolean>(false);

  const activeEra = ERAS_DATA.find((e) => e.id === activeEraId) || ERAS_DATA[2];

  const handleSelectEra = (id: EraId) => {
    setActiveEraId(id);
    soundManager.playPipBeep('curious');
  };

  const handleEngageWarp = () => {
    if (isWarping) return;
    setIsWarping(true);
    soundManager.playTimeWarp();
    soundManager.playDiscoveryChime();

    setTimeout(() => {
      onWarpToEra(activeEraId);
      setIsWarping(false);
    }, 900);
  };

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-between px-4 py-8 overflow-hidden select-none">
      {/* Background Cosmic Temporal Field */}
      <div className="absolute inset-0 -z-10 bg-radial from-stone-900 via-stone-950 to-black pointer-events-none" />

      {/* Atmospheric Star / Energy Particle Dust */}
      <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-amber-500/10 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/3 right-1/4 w-[30rem] h-[30rem] rounded-full bg-cyan-500/10 blur-3xl" />
      </div>

      {/* Warp Flash Overlay */}
      {isWarping && (
        <div className="fixed inset-0 z-50 bg-white/90 backdrop-blur-md animate-ping flex items-center justify-center pointer-events-none">
          <div className="text-stone-900 font-extrabold text-3xl tracking-widest uppercase">
            JUMPING THROUGH TIME...
          </div>
        </div>
      )}

      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto mt-2 mb-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold tracking-wider uppercase mb-3">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Prehistoric Chrono Engine Ready
        </div>
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white font-['Outfit'] drop-shadow-md">
          ENTER <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400">TIMEWILD</span>
        </h1>
        <p className="mt-2 text-stone-300 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
          Spin the chrono-dial to travel back hundreds of millions of years. Walk among roaring dinosaurs, swim ancient seas, and excavate lost fossils!
        </p>
      </div>

      {/* Centerpiece: The Glowing Vortex Portal */}
      <div className="relative my-4 flex items-center justify-center">
        {/* Vortex outer energetic rings */}
        <div
          className={`relative w-72 h-72 sm:w-96 sm:h-96 rounded-full flex items-center justify-center p-3 transition-transform duration-700 ${
            reducedMotion ? '' : 'animate-[spin_24s_linear_infinite]'
          }`}
          style={{
            background: `conic-gradient(from 0deg, #f59e0b, #0ea5e9, #10b981, #ef4444, #8b5cf6, #f59e0b)`,
            boxShadow: `0 0 60px ${activeEra.themeColor}55`,
          }}
        >
          {/* Middle counter-rotating ring */}
          <div
            className={`w-full h-full rounded-full border-4 border-dashed border-white/40 flex items-center justify-center p-4 ${
              reducedMotion ? '' : 'animate-[spin_16s_linear_infinite_reverse]'
            }`}
          >
            {/* Core Dark Singularity */}
            <div className="w-full h-full rounded-full bg-stone-950 flex flex-col items-center justify-center relative overflow-hidden shadow-inner border border-stone-800">
              {/* Pulsing Core Hue */}
              <div
                className="absolute inset-0 opacity-40 blur-xl transition-colors duration-700"
                style={{ backgroundColor: activeEra.themeColor }}
              />

              {/* Center Portal Content */}
              <div className="relative z-10 text-center px-4">
                <span className="text-4xl sm:text-5xl block animate-bounce mb-1">
                  {activeEra.creatures[0]?.avatarEmoji || '🌀'}
                </span>
                <span className="text-xs uppercase tracking-widest text-amber-300 font-bold block">
                  {activeEra.timeRange}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white font-['Outfit'] truncate max-w-[200px]">
                  {activeEra.name}
                </h3>
                <span className="text-[11px] text-stone-400 block mt-0.5">
                  {activeEra.dominantLife.split(',')[0]}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Temporal Ring Ticks and Coordinates */}
        <div className="absolute -top-3 px-3 py-1 rounded-md bg-stone-900/90 border border-stone-700 text-stone-300 text-[11px] font-mono tracking-wider flex items-center gap-1.5 shadow-lg">
          <Compass className="w-3.5 h-3.5 text-amber-400" />
          <span>CHRONO-COORDINATE: -{activeEra.timeRange}</span>
        </div>
      </div>

      {/* Interactive Era Selector Dial Bar */}
      <div className="w-full max-w-5xl mx-auto my-4">
        <div className="text-xs font-semibold text-stone-400 text-center mb-2 uppercase tracking-wider">
          Select Prehistoric Destination:
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 px-2">
          {ERAS_DATA.map((era) => {
            const isSelected = era.id === activeEraId;
            return (
              <button
                key={era.id}
                onClick={() => handleSelectEra(era.id)}
                className={`flex flex-col text-left p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                  isSelected
                    ? 'bg-stone-800 border-amber-400 shadow-lg scale-102 ring-2 ring-amber-400/30'
                    : 'bg-stone-900/70 border-stone-800 hover:border-stone-700 hover:bg-stone-850 text-stone-400'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xl">{era.creatures[0]?.avatarEmoji}</span>
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: era.themeColor }}
                  />
                </div>
                <div
                  className={`text-xs font-bold leading-tight font-['Outfit'] ${
                    isSelected ? 'text-white' : 'text-stone-300'
                  }`}
                >
                  {era.name}
                </div>
                <div className="text-[10px] text-stone-400 mt-1 truncate">
                  {era.timeRange}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Era Snapshot & Engage Button */}
      <div className="w-full max-w-3xl mx-auto bg-stone-900/90 backdrop-blur border border-stone-800 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
        <div className="flex-1 text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-2 text-xs text-amber-400 font-semibold mb-1">
            <span>{activeEra.periodName}</span>
            <span>·</span>
            <span>{activeEra.temperature}</span>
          </div>
          <p className="text-stone-300 text-xs sm:text-sm line-clamp-2">
            {activeEra.worldDescription}
          </p>
          <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2 text-[11px] text-stone-400">
            <span>Oxygen: <strong className="text-stone-200">{activeEra.oxygenLevel}</strong></span>
            <span>·</span>
            <span>Dominant: <strong className="text-stone-200">{activeEra.dominantLife}</strong></span>
          </div>
        </div>

        {/* Big Tactile Warp Button */}
        <button
          onClick={handleEngageWarp}
          disabled={isWarping}
          className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-black text-sm sm:text-base tracking-wider text-stone-950 uppercase cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl flex items-center justify-center gap-2 shrink-0"
          style={{
            background: 'linear-gradient(135deg, #fbbf24, #f59e0b, #ea580c)',
            boxShadow: '0 0 25px rgba(245, 158, 11, 0.45)',
          }}
        >
          <Play className="w-5 h-5 fill-stone-950" />
          <span>Engage Time Warp</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
