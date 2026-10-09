import React, { useState, useEffect } from 'react';
import { EraId, Creature, UserProgress, CaveDrawing } from './types';
import { ERAS_DATA, ACHIEVEMENTS_DATA } from './data/erasData';
import { soundManager } from './utils/audio';
import { Navbar, AppView } from './components/Navbar';
import { TimePortal } from './components/TimePortal';
import { LivingHabitat } from './components/LivingHabitat';
import { CreatureDossierModal } from './components/CreatureDossierModal';
import { FossilDigSite } from './components/FossilDigSite';
import { TimeRangerQuiz } from './components/TimeRangerQuiz';
import { CaveArtStudio } from './components/CaveArtStudio';
import { Encyclopedia } from './components/Encyclopedia';
import { ExplorerJournal } from './components/ExplorerJournal';
import { CompanionPip } from './components/CompanionPip';
import confetti from 'canvas-confetti';

const STORAGE_KEY = 'timewild_explorer_progress_v1';

const DEFAULT_PROGRESS: UserProgress = {
  discoveredCreatures: ['brachiosaurus'], // starter discovery
  discoveredFossils: [],
  unlockedFootprints: [],
  quizHighScore: 0,
  quizStreak: 0,
  explorerXp: 50,
  explorerLevel: 1,
  explorerRank: 'Novice Time Scout',
  caveDrawings: [],
  achievements: {
    'ach-first-jump': true,
  },
  volume: 0.5,
  soundEnabled: true,
  reducedMotion: false,
  hasVisitedPortal: false,
};

export default function App() {
  // Load saved progress or default
  const [progress, setProgress] = useState<UserProgress>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return { ...DEFAULT_PROGRESS, ...JSON.parse(saved) };
      }
    } catch {}
    return DEFAULT_PROGRESS;
  });

  const [currentView, setCurrentView] = useState<AppView>('portal');
  const [selectedEraId, setSelectedEraId] = useState<EraId>('jurassic-jungle');
  const [inspectingCreature, setInspectingCreature] = useState<Creature | null>(null);
  const [lastDiscoveredCreatureName, setLastDiscoveredCreatureName] = useState<string | undefined>();

  // Save progress changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {}
  }, [progress]);

  // Sync sound settings with soundManager
  useEffect(() => {
    soundManager.setMuted(!progress.soundEnabled);
    soundManager.setVolume(progress.volume);
  }, [progress.soundEnabled, progress.volume]);

  const activeEra = ERAS_DATA.find((e) => e.id === selectedEraId) || ERAS_DATA[2];

  // Helper to add XP and check level thresholds
  const addXp = (amount: number) => {
    setProgress((prev) => {
      const newXp = prev.explorerXp + amount;
      const newLevel = Math.max(1, Math.floor(newXp / 150) + 1);

      return {
        ...prev,
        explorerXp: newXp,
        explorerLevel: newLevel,
      };
    });
  };

  // Helper to unlock an achievement
  const unlockAchievement = (achId: string) => {
    setProgress((prev) => {
      if (prev.achievements[achId]) return prev;
      soundManager.playSuccessFanfare();
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
      });
      return {
        ...prev,
        achievements: {
          ...prev.achievements,
          [achId]: true,
        },
        explorerXp: prev.explorerXp + 100,
      };
    });
  };

  // Warp through Time Portal to an Era
  const handleWarpToEra = (eraId: EraId) => {
    setSelectedEraId(eraId);
    setCurrentView('habitat');
    unlockAchievement('ach-first-jump');
    addXp(30);
  };

  // Click on a creature in Habitat or Codex
  const handleSelectCreature = (creature: Creature) => {
    setInspectingCreature(creature);
  };

  // Log creature into journal
  const handleLogCreature = (creatureId: string) => {
    setProgress((prev) => {
      if (prev.discoveredCreatures.includes(creatureId)) return prev;
      const nextCreatures = [...prev.discoveredCreatures, creatureId];

      const foundCreature = ERAS_DATA.flatMap((e) => e.creatures).find((c) => c.id === creatureId);
      if (foundCreature) {
        setLastDiscoveredCreatureName(foundCreature.name);
      }

      if (nextCreatures.length >= 6) {
        unlockAchievement('ach-creature-spotter');
      }
      if (nextCreatures.length >= 20) {
        unlockAchievement('ach-creature-master');
      }

      return {
        ...prev,
        discoveredCreatures: nextCreatures,
        explorerXp: prev.explorerXp + 50,
      };
    });
  };

  // Discovered a secret footprint trail
  const handleFootprintDiscovered = (eraId: EraId) => {
    setProgress((prev) => {
      if (prev.unlockedFootprints.includes(eraId)) return prev;
      const nextTracks = [...prev.unlockedFootprints, eraId];

      if (nextTracks.length >= 3) {
        unlockAchievement('ach-secret-tracks');
      }

      return {
        ...prev,
        unlockedFootprints: nextTracks,
        explorerXp: prev.explorerXp + 80,
      };
    });

    const era = ERAS_DATA.find((e) => e.id === eraId);
    if (era) {
      const secretCreature = era.creatures.find((c) => c.id === era.secretFootprint.revealsCreatureId);
      if (secretCreature) {
        setInspectingCreature(secretCreature);
      }
    }
  };

  // Complete a full fossil excavation site
  const handleCompleteSite = (siteId: string) => {
    setProgress((prev) => {
      if (prev.discoveredFossils.includes(siteId)) return prev;
      const nextFossils = [...prev.discoveredFossils, siteId];

      unlockAchievement('ach-first-fossil');
      if (nextFossils.length >= 6) {
        unlockAchievement('ach-all-fossils');
      }

      return {
        ...prev,
        discoveredFossils: nextFossils,
        explorerXp: prev.explorerXp + 150,
      };
    });
  };

  // Score points in quiz
  const handleScoreQuizPoints = (points: number) => {
    setProgress((prev) => {
      const newScore = prev.quizHighScore + points;
      const newStreak = prev.quizStreak + 1;

      if (newStreak >= 5) {
        unlockAchievement('ach-quiz-champion');
      }

      return {
        ...prev,
        quizHighScore: newScore,
        quizStreak: Math.max(prev.quizStreak, newStreak),
        explorerXp: prev.explorerXp + 40,
      };
    });
  };

  // Save cave painting
  const handleSaveCaveDrawing = (dataUrl: string) => {
    const newDrawing: CaveDrawing = {
      id: `cave-${Date.now()}`,
      createdAt: new Date().toLocaleDateString(),
      dataUrl,
      title: `Cave Discovery #${progress.caveDrawings.length + 1}`,
    };

    setProgress((prev) => ({
      ...prev,
      caveDrawings: [newDrawing, ...prev.caveDrawings],
      explorerXp: prev.explorerXp + 60,
    }));

    unlockAchievement('ach-cave-artist');
  };

  // Toggle sound
  const handleToggleSound = () => {
    setProgress((prev) => ({
      ...prev,
      soundEnabled: !prev.soundEnabled,
    }));
  };

  // Toggle reduced motion
  const handleToggleReducedMotion = () => {
    setProgress((prev) => ({
      ...prev,
      reducedMotion: !prev.reducedMotion,
    }));
  };

  // Reset all progress
  const handleResetProgress = () => {
    localStorage.removeItem(STORAGE_KEY);
    setProgress(DEFAULT_PROGRESS);
    soundManager.playPipBeep('thinking');
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col font-sans">
      {/* Top Main Navigation Header */}
      <Navbar
        currentView={currentView}
        onChangeView={setCurrentView}
        selectedEraId={selectedEraId}
        onSelectEra={(id) => {
          setSelectedEraId(id);
          setCurrentView('habitat');
        }}
        soundMuted={!progress.soundEnabled}
        onToggleSound={handleToggleSound}
        volume={progress.volume}
        onChangeVolume={(vol) => setProgress((p) => ({ ...p, volume: vol }))}
        reducedMotion={progress.reducedMotion}
        onToggleReducedMotion={handleToggleReducedMotion}
        explorerLevel={progress.explorerLevel}
        explorerXp={progress.explorerXp}
      />

      {/* Main Experience View Router */}
      <main className="flex-1 flex flex-col">
        {currentView === 'portal' && (
          <TimePortal
            selectedEraId={selectedEraId}
            onWarpToEra={handleWarpToEra}
            reducedMotion={progress.reducedMotion}
          />
        )}

        {currentView === 'habitat' && (
          <LivingHabitat
            era={activeEra}
            onSelectCreature={handleSelectCreature}
            onFootprintDiscovered={handleFootprintDiscovered}
            isFootprintUnlocked={progress.unlockedFootprints.includes(activeEra.id)}
            reducedMotion={progress.reducedMotion}
            discoveredCreatures={progress.discoveredCreatures}
          />
        )}

        {currentView === 'dig' && (
          <FossilDigSite
            currentEraId={selectedEraId}
            completedSites={progress.discoveredFossils}
            onCompleteSite={handleCompleteSite}
            reducedMotion={progress.reducedMotion}
          />
        )}

        {currentView === 'quiz' && (
          <TimeRangerQuiz
            onScorePoints={handleScoreQuizPoints}
            reducedMotion={progress.reducedMotion}
          />
        )}

        {currentView === 'art' && (
          <CaveArtStudio onSaveDrawing={handleSaveCaveDrawing} />
        )}

        {currentView === 'encyclopedia' && (
          <Encyclopedia
            onSelectCreature={handleSelectCreature}
            discoveredCreatures={progress.discoveredCreatures}
          />
        )}

        {currentView === 'journal' && (
          <ExplorerJournal
            progress={progress}
            onResetProgress={handleResetProgress}
          />
        )}
      </main>

      {/* Floating Animated Companion: Chrono Pip */}
      <CompanionPip
        currentEraName={activeEra.name}
        lastDiscoveredCreatureName={lastDiscoveredCreatureName}
        reducedMotion={progress.reducedMotion}
      />

      {/* Field Dossier Modal for inspected creatures */}
      <CreatureDossierModal
        creature={inspectingCreature}
        onClose={() => setInspectingCreature(null)}
        isLogged={
          inspectingCreature
            ? progress.discoveredCreatures.includes(inspectingCreature.id)
            : false
        }
        onLogCreature={handleLogCreature}
      />
    </div>
  );
}
