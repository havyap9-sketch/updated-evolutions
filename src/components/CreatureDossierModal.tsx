import React from 'react';
import { Creature } from '../types';
import { CreatureGraphics } from './CreatureGraphics';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  X,
  Volume2,
  Sparkles,
  Zap,
  Ruler,
  Weight,
  BookOpen,
  CheckCircle,
} from 'lucide-react';

interface CreatureDossierModalProps {
  creature: Creature | null;
  onClose: () => void;
  isLogged: boolean;
  onLogCreature: (creatureId: string) => void;
}

export const CreatureDossierModal: React.FC<CreatureDossierModalProps> = ({
  creature,
  onClose,
  isLogged,
  onLogCreature,
}) => {
  if (!creature) return null;

  const handlePlaySound = () => {
    soundManager.playCreatureCall(creature.soundType);
  };

  const handleLogDiscovery = () => {
    if (!isLogged) {
      soundManager.playSuccessFanfare();
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.6 },
      });
      onLogCreature(creature.id);
    }
  };

  // Compare to real-world objects for kids
  const sizeComparisonLabel =
    creature.lengthMeters > 20
      ? 'Longer than 2 city buses parked together!'
      : creature.lengthMeters > 10
      ? 'As long as a full-sized yellow school bus!'
      : creature.lengthMeters > 4
      ? 'Larger than a family minivan!'
      : creature.lengthMeters > 1.5
      ? 'About the length of an adult bicycle!'
      : 'Small and swift—smaller than a guitar!';

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="dossier-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-stone-900 border border-stone-700/80 rounded-3xl shadow-2xl text-stone-100 flex flex-col"
      >
        {/* Top Decorative Banner */}
        <div
          className="relative h-44 sm:h-52 w-full flex items-center justify-center overflow-hidden rounded-t-3xl p-4"
          style={{
            background: `radial-gradient(circle at center, ${creature.colorScheme.primary}33 0%, #1c1917 100%)`,
          }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Close dossier"
            className="absolute top-4 right-4 z-20 p-2 rounded-full bg-stone-950/70 hover:bg-stone-800 text-stone-300 hover:text-white transition-colors cursor-pointer border border-stone-700"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Large Creature Art Presentation */}
          <div className="w-48 sm:w-64 h-36 sm:h-44 flex items-center justify-center">
            <CreatureGraphics type={creature.svgType} isHovered={true} />
          </div>

          {/* Sound Call Button Badge */}
          <button
            onClick={handlePlaySound}
            className="absolute bottom-4 left-4 flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-900/90 hover:bg-stone-800 border border-amber-400/40 text-amber-300 text-xs font-bold shadow-lg transition-all cursor-pointer hover:scale-105"
          >
            <Volume2 className="w-4 h-4 text-amber-400" />
            <span>Hear Creature Call</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-5">
          {/* Header & Pronunciation */}
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2
                id="dossier-title"
                className="text-2xl sm:text-3xl font-black text-white font-['Outfit']"
              >
                {creature.name}
              </h2>
              <div className="text-xs font-semibold text-stone-400">
                {creature.diet} · {creature.group}
              </div>
            </div>

            {/* Scientific name & Pronunciation */}
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 text-xs text-stone-400">
              <span className="italic">{creature.scientificName}</span>
              <span aria-hidden="true">·</span>
              <span className="text-amber-400 font-medium">
                Say it: &ldquo;{creature.pronunciation}&rdquo;
              </span>
              <span aria-hidden="true">·</span>
              <span>{creature.periodYearsAgo}</span>
            </div>
          </div>

          {/* Superpower Highlight Box */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-3">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                Prehistoric Superpower
              </div>
              <div className="text-sm font-semibold text-white mt-0.5">
                {creature.superpower}
              </div>
            </div>
          </div>

          {/* Overview Description */}
          <p className="text-sm text-stone-300 leading-relaxed">
            {creature.description}
          </p>

          {/* Size Comparison & Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-xl bg-stone-800/60 border border-stone-700/60">
              <div className="flex items-center gap-1.5 text-xs text-stone-400 mb-1">
                <Ruler className="w-3.5 h-3.5 text-cyan-400" />
                <span>Length</span>
              </div>
              <div className="text-base font-extrabold text-white">
                {creature.lengthMeters} meters
              </div>
            </div>

            <div className="p-3 rounded-xl bg-stone-800/60 border border-stone-700/60">
              <div className="flex items-center gap-1.5 text-xs text-stone-400 mb-1">
                <Weight className="w-3.5 h-3.5 text-emerald-400" />
                <span>Weight</span>
              </div>
              <div className="text-base font-extrabold text-white">
                {creature.weightKg >= 1000
                  ? `${(creature.weightKg / 1000).toFixed(1)} tons`
                  : `${creature.weightKg} kg`}
              </div>
            </div>

            <div className="col-span-2 sm:col-span-1 p-3 rounded-xl bg-stone-800/60 border border-stone-700/60">
              <div className="flex items-center gap-1.5 text-xs text-stone-400 mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Diet Menu</span>
              </div>
              <div className="text-xs font-medium text-stone-200 line-clamp-2">
                {creature.dietDescription}
              </div>
            </div>
          </div>

          {/* Size-O-Meter Kid Comparison visual bar */}
          <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 text-xs">
            <div className="text-stone-400 font-semibold mb-1 flex items-center justify-between">
              <span>Size Scale Comparison:</span>
              <span className="text-amber-400 font-mono">{creature.lengthMeters}m</span>
            </div>
            <div className="w-full h-3 rounded-full bg-stone-800 overflow-hidden relative">
              <div
                className="h-full rounded-full bg-gradient-to-r from-amber-400 to-rose-500"
                style={{ width: `${Math.min(100, Math.max(8, (creature.lengthMeters / 26) * 100))}%` }}
              />
            </div>
            <div className="text-[11px] text-stone-400 mt-1 italic">
              {sizeComparisonLabel}
            </div>
          </div>

          {/* Fun Fact vs Scientific Fact */}
          <div className="space-y-2.5">
            <div className="p-3.5 rounded-2xl bg-stone-800/80 border border-stone-700">
              <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Did You Know?</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
                {creature.funFact}
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-stone-800/80 border border-stone-700">
              <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" />
                <span>Paleontologist Discovery Fact</span>
              </div>
              <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
                {creature.scientificFact}
              </p>
            </div>
          </div>

          {/* Action Button: Log Into Explorer Journal */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              onClick={handleLogDiscovery}
              disabled={isLogged}
              className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer ${
                isLogged
                  ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/40 cursor-default'
                  : 'bg-amber-500 hover:bg-amber-400 text-stone-950 shadow-lg hover:scale-102'
              }`}
            >
              {isLogged ? (
                <>
                  <CheckCircle className="w-4 h-4 text-emerald-400" />
                  <span>Logged in Explorer Field Journal</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-stone-950" />
                  <span>Collect & Log Into Journal (+50 XP)</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
