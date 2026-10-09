import React, { useState } from 'react';
import { FossilDigSiteData, FossilPart, EraId } from '../types';
import { FOSSIL_DIG_SITES } from '../data/erasData';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  Pickaxe,
  Brush,
  Search,
  PackageCheck,
  Sparkles,
  Award,
  RefreshCw,
  MapPin,
  Check,
} from 'lucide-react';

interface FossilDigSiteProps {
  currentEraId: EraId;
  completedSites: string[];
  onCompleteSite: (siteId: string) => void;
  reducedMotion: boolean;
}

type ToolType = 'shovel' | 'brush' | 'glass' | 'plaster';

export const FossilDigSite: React.FC<FossilDigSiteProps> = ({
  currentEraId,
  completedSites,
  onCompleteSite,
  reducedMotion,
}) => {
  // Find current dig site based on era or fallback
  const initialSite =
    FOSSIL_DIG_SITES.find((s) => s.eraId === currentEraId) || FOSSIL_DIG_SITES[0];

  const [activeSiteId, setActiveSiteId] = useState<string>(initialSite.id);
  const [selectedTool, setSelectedTool] = useState<ToolType>('shovel');

  // Local site states map: siteId -> array of parts with current progress
  const [sitesProgress, setSitesProgress] = useState<Record<string, FossilPart[]>>(() => {
    const init: Record<string, FossilPart[]> = {};
    FOSSIL_DIG_SITES.forEach((site) => {
      init[site.id] = site.parts.map((p) => ({ ...p }));
    });
    return init;
  });

  const [inspectedTile, setInspectedTile] = useState<{ row: number; col: number; clue: string } | null>(null);

  const activeSite = FOSSIL_DIG_SITES.find((s) => s.id === activeSiteId) || FOSSIL_DIG_SITES[0];
  const parts = sitesProgress[activeSite.id] || [];

  const isSiteCompleted =
    completedSites.includes(activeSite.id) ||
    (parts.length > 0 && parts.every((p) => p.cleaned));

  const handleTileClick = (row: number, col: number) => {
    const targetPart = parts.find((p) => p.gridRow === row && p.gridCol === col);

    if (selectedTool === 'glass') {
      soundManager.playFossilDig('glass');
      if (targetPart) {
        setInspectedTile({
          row,
          col,
          clue: `Bone resonance detected: ${targetPart.name}! Switch to Trowel to excavate.`,
        });
      } else {
        setInspectedTile({
          row,
          col,
          clue: 'Sterile sediment layer. Try digging closer to the center!',
        });
      }
      return;
    }

    if (!targetPart) {
      soundManager.playFossilDig('shovel');
      return;
    }

    if (selectedTool === 'shovel') {
      soundManager.playFossilDig('shovel');
      if (targetPart.currentHits < targetPart.sedimentHardness - 1) {
        // Chip away dirt
        setSitesProgress((prev) => ({
          ...prev,
          [activeSite.id]: prev[activeSite.id].map((p) =>
            p.id === targetPart.id ? { ...p, currentHits: p.currentHits + 1 } : p
          ),
        }));
      } else if (!targetPart.discovered) {
        // Discovered! Needs brush now
        soundManager.playDiscoveryChime();
        setSitesProgress((prev) => ({
          ...prev,
          [activeSite.id]: prev[activeSite.id].map((p) =>
            p.id === targetPart.id ? { ...p, currentHits: p.sedimentHardness, discovered: true } : p
          ),
        }));
      }
    } else if (selectedTool === 'brush') {
      soundManager.playFossilDig('brush');
      if (targetPart.discovered && !targetPart.cleaned) {
        // Cleaned and fully extracted!
        soundManager.playDiscoveryChime();
        const updatedParts = parts.map((p) =>
          p.id === targetPart.id ? { ...p, cleaned: true } : p
        );

        setSitesProgress((prev) => ({
          ...prev,
          [activeSite.id]: updatedParts,
        }));

        // Check if all parts are now cleaned
        if (updatedParts.every((p) => p.cleaned)) {
          soundManager.playSuccessFanfare();
          confetti({
            particleCount: 70,
            spread: 80,
            origin: { y: 0.6 },
          });
          onCompleteSite(activeSite.id);
        }
      }
    }
  };

  const handleResetSite = () => {
    soundManager.playPipBeep('thinking');
    setSitesProgress((prev) => ({
      ...prev,
      [activeSite.id]: activeSite.parts.map((p) => ({
        ...p,
        discovered: false,
        cleaned: false,
        currentHits: 0,
      })),
    }));
    setInspectedTile(null);
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6 select-none space-y-6">
      {/* Site Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-stone-900 border border-stone-800 p-4 sm:p-5 rounded-2xl shadow-xl">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1">
            <MapPin className="w-3.5 h-3.5" />
            <span>{activeSite.locationName}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-['Outfit']">
            {activeSite.name}
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-xl">
            {activeSite.description}
          </p>
        </div>

        {/* Site Switcher Dropdown / Buttons */}
        <div className="flex flex-wrap gap-1.5 self-stretch md:self-auto">
          {FOSSIL_DIG_SITES.map((site) => {
            const isDone = completedSites.includes(site.id);
            const isCurrent = site.id === activeSite.id;
            return (
              <button
                key={site.id}
                onClick={() => {
                  setActiveSiteId(site.id);
                  soundManager.playPipBeep('curious');
                  setInspectedTile(null);
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                  isCurrent
                    ? 'bg-amber-500 text-stone-950 shadow-md'
                    : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                }`}
              >
                <span>{site.targetCreatureName.split(' ')[0]}</span>
                {isDone && <Check className="w-3.5 h-3.5 text-emerald-400" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Digging Workbench */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Excavation Grid */}
        <div className="lg:col-span-2 bg-stone-900/90 border border-stone-800 p-5 rounded-3xl shadow-2xl flex flex-col justify-between">
          {/* Toolbelt Selector */}
          <div className="flex items-center justify-between pb-4 border-b border-stone-800 gap-2 flex-wrap">
            <div className="text-xs font-bold text-stone-400 uppercase tracking-wider">
              Paleontology Tool:
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  setSelectedTool('shovel');
                  soundManager.playFossilDig('shovel');
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  selectedTool === 'shovel'
                    ? 'bg-amber-500 text-stone-950 shadow-md scale-105'
                    : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                }`}
              >
                <Pickaxe className="w-4 h-4" />
                <span>Trowel</span>
              </button>

              <button
                onClick={() => {
                  setSelectedTool('brush');
                  soundManager.playFossilDig('brush');
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  selectedTool === 'brush'
                    ? 'bg-amber-500 text-stone-950 shadow-md scale-105'
                    : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                }`}
              >
                <Brush className="w-4 h-4" />
                <span>Brush</span>
              </button>

              <button
                onClick={() => {
                  setSelectedTool('glass');
                  soundManager.playFossilDig('glass');
                }}
                className={`px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  selectedTool === 'glass'
                    ? 'bg-amber-500 text-stone-950 shadow-md scale-105'
                    : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                }`}
              >
                <Search className="w-4 h-4" />
                <span>Scanner</span>
              </button>
            </div>
          </div>

          {/* Excavation Sediment Grid */}
          <div className="my-5 p-3 rounded-2xl bg-amber-950/20 border-2 border-stone-800">
            <div className="grid grid-cols-5 gap-2.5">
              {Array.from({ length: 4 }).map((_, rowIndex) =>
                Array.from({ length: 5 }).map((_, colIndex) => {
                  const part = parts.find(
                    (p) => p.gridRow === rowIndex + 1 && p.gridCol === colIndex + 1
                  );

                  const isCleaned = part?.cleaned;
                  const isDiscovered = part?.discovered;
                  const hits = part ? part.currentHits : 0;
                  const maxHits = part ? part.sedimentHardness : 3;

                  return (
                    <button
                      key={`${rowIndex}-${colIndex}`}
                      onClick={() => handleTileClick(rowIndex + 1, colIndex + 1)}
                      className={`aspect-square rounded-xl border transition-all cursor-pointer relative flex flex-col items-center justify-center p-1 overflow-hidden group shadow-md ${
                        isCleaned
                          ? 'bg-emerald-950/40 border-emerald-500/60 shadow-[0_0_15px_rgba(16,185,129,0.25)]'
                          : isDiscovered
                          ? 'bg-amber-950/60 border-amber-400'
                          : hits > 0
                          ? 'bg-stone-800 border-stone-700'
                          : 'bg-stone-850 hover:bg-stone-800 border-stone-800'
                      }`}
                    >
                      {/* Bone or Dirt Graphics */}
                      {isCleaned ? (
                        <div className="text-center animate-fade-in">
                          <span className="text-2xl">🦴</span>
                          <span className="block text-[9px] font-bold text-emerald-300 truncate max-w-[60px]">
                            {part?.name.split(' ')[0]}
                          </span>
                        </div>
                      ) : isDiscovered ? (
                        <div className="text-center animate-pulse">
                          <span className="text-2xl opacity-80">🪨</span>
                          <span className="block text-[9px] font-bold text-amber-300">
                            Use Brush!
                          </span>
                        </div>
                      ) : hits > 0 ? (
                        <div className="text-center">
                          <span className="text-stone-500 font-mono text-xs">
                            {hits} / {maxHits}
                          </span>
                        </div>
                      ) : (
                        <div className="text-stone-600 group-hover:text-stone-400 transition-colors">
                          <span className="text-xs font-mono">··</span>
                        </div>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Scanner Clue Box */}
          {inspectedTile && (
            <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 text-xs text-cyan-200 flex items-center justify-between">
              <span>{inspectedTile.clue}</span>
              <button
                onClick={() => setInspectedTile(null)}
                className="text-[10px] text-cyan-400 underline cursor-pointer"
              >
                Clear
              </button>
            </div>
          )}

          {/* Reset site option */}
          <div className="flex items-center justify-between pt-3 border-t border-stone-800 text-xs text-stone-400">
            <span>
              Tip: Use <strong>Trowel</strong> to break hard rock, then{' '}
              <strong>Brush</strong> to safely clean bone!
            </span>
            <button
              onClick={handleResetSite}
              className="flex items-center gap-1 hover:text-stone-200 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset Grid</span>
            </button>
          </div>
        </div>

        {/* Right 1 Col: Fossil Assembly Museum & Fun Paleo Fact */}
        <div className="space-y-4 flex flex-col justify-between">
          <div className="bg-stone-900 border border-stone-800 p-5 rounded-3xl shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                Skeleton Assembly
              </div>
              <div className="text-xs font-bold text-stone-300">
                {parts.filter((p) => p.cleaned).length} / {parts.length}
              </div>
            </div>

            {/* Skeleton Bone Assembly Checklist */}
            <div className="space-y-2">
              {parts.map((p) => (
                <div
                  key={p.id}
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs transition-colors ${
                    p.cleaned
                      ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200'
                      : p.discovered
                      ? 'bg-amber-950/30 border-amber-500/40 text-amber-200'
                      : 'bg-stone-850/50 border-stone-800 text-stone-400'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span>{p.cleaned ? '🦴' : p.discovered ? '⛏️' : '🔒'}</span>
                    <span className="font-semibold">{p.name}</span>
                  </div>
                  {p.cleaned ? (
                    <span className="text-[10px] font-bold text-emerald-400 uppercase">
                      Mounted
                    </span>
                  ) : p.discovered ? (
                    <span className="text-[10px] font-bold text-amber-400 uppercase">
                      Exposed
                    </span>
                  ) : (
                    <span className="text-[10px] text-stone-500 uppercase">
                      Buried
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Completion Banner */}
            {isSiteCompleted && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/20 to-emerald-500/20 border border-amber-400/50 text-center space-y-2 animate-fade-in">
                <Award className="w-8 h-8 text-amber-400 mx-auto" />
                <div className="text-sm font-black text-white font-['Outfit']">
                  {activeSite.targetCreatureName} Fully Restored!
                </div>
                <div className="text-xs text-stone-300">
                  Specimen permanently accessioned into the Chrono Paleontology Hall!
                </div>
              </div>
            )}
          </div>

          {/* Paleontology Fact Box */}
          <div className="bg-stone-900 border border-stone-800 p-4 rounded-2xl text-xs space-y-1.5 shadow-lg">
            <div className="flex items-center gap-1.5 font-bold text-amber-400 uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Real Paleontology Dig Insight</span>
            </div>
            <p className="text-stone-300 leading-relaxed">
              {activeSite.funPaleoFact}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
