import React, { useState } from 'react';
import { ERAS_DATA } from '../data/erasData';
import { Creature, DietType } from '../types';
import { CreatureGraphics } from './CreatureGraphics';
import { soundManager } from '../utils/audio';
import {
  Search,
  Filter,
  Volume2,
  Ruler,
  Weight,
  Sparkles,
  ArrowUpDown,
} from 'lucide-react';

interface EncyclopediaProps {
  onSelectCreature: (creature: Creature) => void;
  discoveredCreatures: string[];
}

export const Encyclopedia: React.FC<EncyclopediaProps> = ({
  onSelectCreature,
  discoveredCreatures,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedEra, setSelectedEra] = useState<string>('all');
  const [selectedDiet, setSelectedDiet] = useState<string>('all');

  // Flatten all creatures from all eras
  const allCreatures: Creature[] = ERAS_DATA.flatMap((e) => e.creatures);

  // Filtered creatures
  const filtered = allCreatures.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.scientificName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.group.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesEra = selectedEra === 'all' || c.eraId === selectedEra;
    const matchesDiet = selectedDiet === 'all' || c.diet === selectedDiet;

    return matchesSearch && matchesEra && matchesDiet;
  });

  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-6 select-none space-y-6">
      {/* Header */}
      <div className="bg-stone-900 border border-stone-800 p-5 rounded-3xl shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-1">
            Prehistoric Codex
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white font-['Outfit']">
            Creature Encyclopedia & Size-O-Meter
          </h2>
          <p className="text-xs sm:text-sm text-stone-300 mt-1">
            Browse all {allCreatures.length} documented prehistoric beasts, compare their colossal sizes, and study their anatomy!
          </p>
        </div>

        {/* Discovery Counter */}
        <div className="px-4 py-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3">
          <Sparkles className="w-5 h-5 text-amber-400" />
          <div>
            <div className="text-[10px] text-amber-300 font-bold uppercase">
              Field Discoveries
            </div>
            <div className="text-base font-black text-white font-mono">
              {discoveredCreatures.length} / {allCreatures.length} Discovered
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-stone-900/80 border border-stone-800 p-4 rounded-2xl shadow-lg flex flex-col sm:flex-row items-center gap-3">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search dinosaurs, fish, mammoth, insects..."
            className="w-full bg-stone-950 border border-stone-800 focus:border-amber-400 rounded-xl pl-10 pr-4 py-2 text-xs sm:text-sm text-white placeholder-stone-500 outline-none transition-colors"
          />
        </div>

        {/* Era Filter */}
        <select
          value={selectedEra}
          onChange={(e) => setSelectedEra(e.target.value)}
          className="w-full sm:w-auto bg-stone-950 border border-stone-800 focus:border-amber-400 rounded-xl px-3 py-2 text-xs text-stone-200 outline-none cursor-pointer"
        >
          <option value="all">All Eras (500M - 25K Years)</option>
          {ERAS_DATA.map((e) => (
            <option key={e.id} value={e.id}>
              {e.name}
            </option>
          ))}
        </select>

        {/* Diet Filter */}
        <select
          value={selectedDiet}
          onChange={(e) => setSelectedDiet(e.target.value)}
          className="w-full sm:w-auto bg-stone-950 border border-stone-800 focus:border-amber-400 rounded-xl px-3 py-2 text-xs text-stone-200 outline-none cursor-pointer"
        >
          <option value="all">All Diets</option>
          <option value="Herbivore">Herbivores (Plant Eaters)</option>
          <option value="Carnivore">Carnivores (Meat Eaters)</option>
          <option value="Omnivore">Omnivores (Everything Eaters)</option>
          <option value="Insectivore">Insectivores</option>
          <option value="Filter Feeder">Filter Feeders</option>
        </select>
      </div>

      {/* Creature Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map((creature) => {
          const isDiscovered = discoveredCreatures.includes(creature.id);
          const era = ERAS_DATA.find((e) => e.id === creature.eraId);

          return (
            <div
              key={creature.id}
              onClick={() => {
                soundManager.playCreatureCall(creature.soundType);
                onSelectCreature(creature);
              }}
              className="bg-stone-900 border border-stone-800 hover:border-amber-400/60 rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all hover:scale-102 cursor-pointer flex flex-col justify-between group"
            >
              <div>
                {/* Creature Graphic Preview */}
                <div
                  className="w-full h-32 rounded-xl mb-3 flex items-center justify-center p-2 relative overflow-hidden"
                  style={{
                    backgroundColor: `${creature.colorScheme.primary}15`,
                  }}
                >
                  <div className="w-28 h-24">
                    <CreatureGraphics type={creature.svgType} isHovered={false} />
                  </div>

                  {/* Sound Trigger Button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      soundManager.playCreatureCall(creature.soundType);
                    }}
                    className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-stone-900/80 border border-stone-700 text-amber-400 hover:bg-amber-500 hover:text-stone-950 transition-colors"
                    title="Play Roar"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>

                  {/* Discovered badge */}
                  {isDiscovered && (
                    <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      Discovered ✓
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="text-base font-bold text-white font-['Outfit'] truncate">
                    {creature.name}
                  </h3>
                  <span className="text-lg">{creature.avatarEmoji}</span>
                </div>

                <div className="text-[11px] text-stone-400 italic mb-2 truncate">
                  {creature.scientificName}
                </div>

                {/* Quick stats */}
                <div className="flex items-center gap-3 text-xs text-stone-300 mb-2">
                  <span className="flex items-center gap-1">
                    <Ruler className="w-3 h-3 text-cyan-400" />
                    <span>{creature.lengthMeters}m</span>
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Weight className="w-3 h-3 text-emerald-400" />
                    <span>
                      {creature.weightKg >= 1000
                        ? `${(creature.weightKg / 1000).toFixed(1)}t`
                        : `${creature.weightKg}kg`}
                    </span>
                  </span>
                  <span>·</span>
                  <span className="text-amber-300 font-medium">{creature.diet}</span>
                </div>

                <p className="text-[11px] text-stone-400 line-clamp-2 leading-relaxed">
                  {creature.description}
                </p>
              </div>

              {/* Card Footer: Era & Click Indicator */}
              <div className="pt-3 mt-3 border-t border-stone-800 flex items-center justify-between text-[10px] text-stone-400">
                <span className="truncate max-w-[150px]">{era?.name}</span>
                <span className="text-amber-400 font-semibold group-hover:underline">
                  Inspect Dossier →
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-stone-400">
          No prehistoric creatures found matching your search. Try resetting filters!
        </div>
      )}
    </div>
  );
};
