export type EraId = 
  | 'cambrian-ocean'
  | 'carboniferous-swamp'
  | 'jurassic-jungle'
  | 'cretaceous-caldera'
  | 'ice-age-tundra'
  | 'paleolithic-cave';

export type DietType = 'Herbivore' | 'Carnivore' | 'Omnivore' | 'Filter Feeder' | 'Insectivore';
export type CreatureGroup = 'Dinosaur' | 'Marine Creature' | 'Giant Insect' | 'Ice Age Mammal' | 'Flying Reptile' | 'Early Hominid / Fauna';

export interface Creature {
  id: string;
  name: string;
  scientificName: string;
  pronunciation: string;
  eraId: EraId;
  group: CreatureGroup;
  diet: DietType;
  periodYearsAgo: string;
  lengthMeters: number;
  weightKg: number;
  heightMeters: number;
  soundType: 'roar' | 'rumble' | 'screech' | 'chitter' | 'buzz' | 'click' | 'trumpet' | 'purr';
  description: string;
  funFact: string;
  scientificFact: string;
  superpower: string;
  dietDescription: string;
  avatarEmoji: string;
  colorScheme: {
    primary: string;
    secondary: string;
    glow: string;
  };
  svgType: string;
  initialPos: { x: number; y: number }; // percentage 0-100
  sizeScale: number; // relative display scale
  isFlying?: boolean;
  isSwimming?: boolean;
  isRoaming?: boolean;
}

export interface Era {
  id: EraId;
  name: string;
  periodName: string;
  timeRange: string;
  subtitle: string;
  themeColor: string;
  accentColor: string;
  skyGradient: {
    day: string;
    sunset: string;
    night: string;
  };
  ambientSound: 'ocean' | 'swamp' | 'jungle' | 'volcano' | 'ice' | 'cave';
  temperature: string;
  atmosphere: string;
  oxygenLevel: string;
  dominantLife: string;
  worldDescription: string;
  creatures: Creature[];
  fossilSiteId: string;
  secretFootprint: {
    id: string;
    name: string;
    coords: { x: number; y: number };
    clue: string;
    revealsCreatureId: string;
  };
}

export interface FossilPart {
  id: string;
  name: string;
  discovered: boolean;
  gridRow: number;
  gridCol: number;
  cleaned: boolean;
  sedimentHardness: number; // hits needed
  currentHits: number;
}

export interface FossilDigSiteData {
  id: string;
  eraId: EraId;
  name: string;
  locationName: string;
  targetCreatureName: string;
  targetCreatureId: string;
  description: string;
  gridRows: number;
  gridCols: number;
  parts: FossilPart[];
  isComplete: boolean;
  funPaleoFact: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  eraId?: EraId;
  options: string[];
  correctIndex: number;
  explanation: string;
  funHint: string;
  category: 'footprints' | 'diet' | 'size' | 'fossil-detective' | 'superpowers';
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'exploration' | 'paleontology' | 'science' | 'creativity';
  unlocked: boolean;
  unlockedAt?: string;
  targetCount: number;
  currentCount: number;
}

export interface CaveDrawing {
  id: string;
  createdAt: string;
  dataUrl: string;
  title: string;
}

export interface UserProgress {
  discoveredCreatures: string[]; // creature ids
  discoveredFossils: string[]; // fossil site ids completed
  unlockedFootprints: string[];
  quizHighScore: number;
  quizStreak: number;
  explorerXp: number;
  explorerLevel: number;
  explorerRank: string;
  caveDrawings: CaveDrawing[];
  achievements: Record<string, boolean>;
  volume: number;
  soundEnabled: boolean;
  reducedMotion: boolean;
  hasVisitedPortal: boolean;
}
