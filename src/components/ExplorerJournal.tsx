import React from 'react';
import { UserProgress } from '../types';
import { ACHIEVEMENTS_DATA, ERAS_DATA, FOSSIL_DIG_SITES } from '../data/erasData';
import { soundManager } from '../utils/audio';
import {
  Award,
  BookOpen,
  Sparkles,
  Trophy,
  Palette,
  RotateCcw,
  CheckCircle,
  Clock,
  Compass,
} from 'lucide-react';

interface ExplorerJournalProps {
  progress: UserProgress;
  onResetProgress: () => void;
}

export const ExplorerJournal: React.FC<ExplorerJournalProps> = ({
  progress,
  onResetProgress,
}) => {
  const allCreatures = ERAS_DATA.flatMap((e) => e.creatures);
  const totalCreatures = allCreatures.length;
  const discoveredCount = progress.discoveredCreatures.length;

  // Calculate Rank and level
  const ranks = [
    { level: 1, title: 'Novice Time Scout', minXp: 0 },
    { level: 2, title: 'Apprentice Fossil Tracker', minXp: 150 },
    { level: 3, title: 'Jurassic Wilderness Ranger', minXp: 350 },
    { level: 4, title: 'Senior Paleontologist', minXp: 650 },
    { level: 5, title: 'Grand Master of Prehistoric Time', minXp: 1000 },
  ];

  const currentRank =
    [...ranks].reverse().find((r) => progress.explorerXp >= r.minXp) || ranks[0];
  const nextRank = ranks.find((r) => r.level === currentRank.level + 1);

  const xpTowardsNext = nextRank ? nextRank.minXp - progress.explorerXp : 0;
  const progressPercent = nextRank
    ? Math.min(
        100,
        Math.round(
          ((progress.explorerXp - currentRank.minXp) /
            (nextRank.minXp - currentRank.minXp)) *
            100
        )
      )
    : 100;

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-8 select-none space-y-8">
      {/* Explorer Profile Header */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 border border-stone-800 p-6 rounded-3xl shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="w-20 h-20 rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-4xl shadow-[0_0_25px_rgba(245,158,11,0.3)]">
            🧭
          </div>
          <div>
            <div className="flex items-center justify-center md:justify-start gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest">
              <Compass className="w-3.5 h-3.5" />
              <span>Level {currentRank.level} Explorer</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white font-['Outfit'] mt-0.5">
              {currentRank.title}
            </h2>
            <div className="text-xs text-stone-400 mt-1">
              Field Experience: <strong className="text-amber-300">{progress.explorerXp} XP</strong>
              {nextRank && ` · ${xpTowardsNext} XP to Level ${nextRank.level}`}
            </div>
          </div>
        </div>

        {/* Level XP Progress Bar */}
        <div className="w-full md:w-64 space-y-1.5">
          <div className="flex justify-between text-xs text-stone-400 font-semibold">
            <span>Rank Mastery</span>
            <span className="text-amber-400">{progressPercent}%</span>
          </div>
          <div className="w-full h-3.5 bg-stone-950 rounded-full overflow-hidden border border-stone-800 p-0.5">
            <div
              className="h-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 transition-all duration-500 shadow-sm"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Stats Summary Quick Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-stone-900 border border-stone-800 p-4 rounded-2xl">
          <div className="text-xs text-stone-400 font-semibold mb-1">Creatures Logged</div>
          <div className="text-2xl font-black text-white font-mono">
            {discoveredCount} / {totalCreatures}
          </div>
          <div className="text-[11px] text-emerald-400 mt-1">
            {Math.round((discoveredCount / totalCreatures) * 100)}% Complete
          </div>
        </div>

        <div className="bg-stone-900 border border-stone-800 p-4 rounded-2xl">
          <div className="text-xs text-stone-400 font-semibold mb-1">Fossils Restored</div>
          <div className="text-2xl font-black text-white font-mono">
            {progress.discoveredFossils.length} / 6
          </div>
          <div className="text-[11px] text-amber-400 mt-1">
            Museum Specimens
          </div>
        </div>

        <div className="bg-stone-900 border border-stone-800 p-4 rounded-2xl">
          <div className="text-xs text-stone-400 font-semibold mb-1">Quiz High Score</div>
          <div className="text-2xl font-black text-white font-mono">
            {progress.quizHighScore} PTS
          </div>
          <div className="text-[11px] text-cyan-400 mt-1">
            {progress.quizStreak}x Best Streak
          </div>
        </div>

        <div className="bg-stone-900 border border-stone-800 p-4 rounded-2xl">
          <div className="text-xs text-stone-400 font-semibold mb-1">Cave Paintings</div>
          <div className="text-2xl font-black text-white font-mono">
            {progress.caveDrawings.length}
          </div>
          <div className="text-[11px] text-rose-400 mt-1">
            Rock Art Gallery
          </div>
        </div>
      </div>

      {/* Section 1: Museum of Assembled Fossils */}
      <div className="bg-stone-900/90 border border-stone-800 p-6 rounded-3xl space-y-4 shadow-xl">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-400" />
          <h3 className="text-xl font-bold text-white font-['Outfit']">
            Chrono Paleontology Museum Hall
          </h3>
        </div>
        <p className="text-xs text-stone-400">
          Complete fossils excavated from ancient riverbeds and frozen tundra cliffs around the world.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {FOSSIL_DIG_SITES.map((site) => {
            const isAssembled = progress.discoveredFossils.includes(site.id);
            return (
              <div
                key={site.id}
                className={`p-4 rounded-2xl border flex items-center gap-3 transition-colors ${
                  isAssembled
                    ? 'bg-emerald-950/20 border-emerald-500/40'
                    : 'bg-stone-850/40 border-stone-800 opacity-60'
                }`}
              >
                <div className="text-3xl">
                  {isAssembled ? '🦴' : '🔒'}
                </div>
                <div>
                  <div className="text-xs font-bold text-white font-['Outfit']">
                    {site.targetCreatureName}
                  </div>
                  <div className="text-[10px] text-stone-400">
                    {isAssembled ? 'Complete Skeleton Mounted' : 'Dig Site Locked'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Section 2: Cave Art Gallery */}
      {progress.caveDrawings.length > 0 && (
        <div className="bg-stone-900/90 border border-stone-800 p-6 rounded-3xl space-y-4 shadow-xl">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-rose-400" />
            <h3 className="text-xl font-bold text-white font-['Outfit']">
              Your Prehistoric Cave Art Gallery
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {progress.caveDrawings.map((drawing) => (
              <div
                key={drawing.id}
                className="bg-stone-950 border border-stone-800 rounded-2xl overflow-hidden p-2 group"
              >
                <img
                  src={drawing.dataUrl}
                  alt={drawing.title}
                  className="w-full aspect-[16/10] object-cover rounded-xl"
                />
                <div className="flex items-center justify-between mt-2 px-1 text-[11px] text-stone-400">
                  <span className="truncate">{drawing.title}</span>
                  <a
                    href={drawing.dataUrl}
                    download="timewild-cave-art.png"
                    className="text-amber-400 hover:underline font-semibold"
                  >
                    Save
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 3: Explorer Achievement Badges */}
      <div className="bg-stone-900/90 border border-stone-800 p-6 rounded-3xl space-y-4 shadow-xl">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <h3 className="text-xl font-bold text-white font-['Outfit']">
            Explorer Badges & Achievements
          </h3>
        </div>
        <p className="text-xs text-stone-400">
          Complete special challenges during your time journeys to unlock all 12 prehistoric badges!
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {ACHIEVEMENTS_DATA.map((ach) => {
            const isUnlocked = progress.achievements[ach.id] || false;

            return (
              <div
                key={ach.id}
                className={`p-4 rounded-2xl border flex items-start gap-3.5 transition-all ${
                  isUnlocked
                    ? 'bg-amber-500/10 border-amber-500/30 shadow-md'
                    : 'bg-stone-850/40 border-stone-800/80 opacity-55'
                }`}
              >
                <div className="text-3xl p-2 rounded-xl bg-stone-900 border border-stone-800 shrink-0">
                  {ach.icon}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-1">
                    <h4 className="text-xs font-bold text-white font-['Outfit']">
                      {ach.title}
                    </h4>
                    {isUnlocked && (
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    )}
                  </div>
                  <p className="text-[11px] text-stone-300 mt-1 leading-relaxed">
                    {ach.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Danger Zone: Reset Progress */}
      <div className="pt-4 flex items-center justify-between text-xs text-stone-500">
        <span>Progress is safely stored on your device.</span>
        <button
          onClick={() => {
            if (window.confirm('Reset all explorer progress and start fresh from Level 1?')) {
              onResetProgress();
            }
          }}
          className="flex items-center gap-1.5 text-stone-400 hover:text-rose-400 transition-colors cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Field Journal</span>
        </button>
      </div>
    </div>
  );
};
