import React, { useState, useEffect } from 'react';
import { soundManager } from '../utils/audio';
import { Sparkles, MessageCircle, X, ChevronUp, ChevronDown } from 'lucide-react';

interface CompanionPipProps {
  currentEraName: string;
  lastDiscoveredCreatureName?: string;
  reducedMotion: boolean;
}

const PREHISTORIC_JOKES = [
  "Why can’t you hear a Pterodactyl go to the bathroom? Because the P is silent! Haha! 🦅",
  "What do you call a dinosaur that sleeps all day? A dino-snore! 😴",
  "What is a T-Rex's least favorite exercise? Push-ups! Their arms are too tiny! 😂",
  "How do you invite a Woolly Mammoth to tea? Very politely! 🦣",
  "Why did the Trilobite cross the Cambrian seabed? To get to the other coral! 🦀",
];

export const CompanionPip: React.FC<CompanionPipProps> = ({
  currentEraName,
  lastDiscoveredCreatureName,
  reducedMotion,
}) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [speechText, setSpeechText] = useState<string>(
    `Hi Explorer! I'm Chrono Pip! Welcome to the ${currentEraName}! Click creatures to inspect them, or scan for footprints!`
  );
  const [pipMood, setPipMood] = useState<'happy' | 'curious' | 'celebrate'>('happy');

  // React to era changes
  useEffect(() => {
    setSpeechText(
      `Temporal jump complete! We arrived in the ${currentEraName}! Look around for living beasts and fossil clues!`
    );
    setPipMood('curious');
    soundManager.playPipBeep('curious');
  }, [currentEraName]);

  // React to creature discovery
  useEffect(() => {
    if (lastDiscoveredCreatureName) {
      setSpeechText(
        `Spectacular find! You cataloged ${lastDiscoveredCreatureName}! Check your Field Journal to review its size and superpowers!`
      );
      setPipMood('celebrate');
      soundManager.playPipBeep('celebrate');
    }
  }, [lastDiscoveredCreatureName]);

  const handlePipClick = () => {
    // Tell a fun joke or science tip!
    const randomJoke = PREHISTORIC_JOKES[Math.floor(Math.random() * PREHISTORIC_JOKES.length)];
    setSpeechText(randomJoke);
    setPipMood('happy');
    soundManager.playPipBeep('happy');
  };

  return (
    <div className="fixed bottom-4 right-4 z-40 flex flex-col items-end select-none pointer-events-none">
      {/* Speech Bubble */}
      {isExpanded && (
        <div className="mb-2 max-w-xs sm:max-w-sm p-3.5 rounded-2xl bg-stone-900/95 border border-amber-400/50 shadow-2xl backdrop-blur-md text-xs text-stone-100 pointer-events-auto animate-fade-in relative">
          <div className="flex items-center justify-between pb-1 mb-1 border-b border-stone-800 text-[10px] font-bold text-amber-400 uppercase tracking-wider">
            <span className="flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400" />
              <span>Chrono Pip Guide</span>
            </span>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-stone-400 hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          <p className="leading-relaxed">{speechText}</p>
          <div className="mt-2 text-[10px] text-amber-400/80 italic text-right">
            Tap Pip for a prehistoric joke!
          </div>

          {/* Speech bubble pointer arrow */}
          <div className="absolute -bottom-2 right-6 w-3 h-3 bg-stone-900 border-r border-b border-amber-400/50 transform rotate-45" />
        </div>
      )}

      {/* Floating Animated Pip Robot Avatar */}
      <div
        onClick={handlePipClick}
        className={`pointer-events-auto cursor-pointer group flex items-center justify-center ${
          reducedMotion ? '' : 'animate-[bounce_3s_ease-in-out_infinite]'
        }`}
        title="Tap Chrono Pip for tips!"
      >
        <div className="relative p-2 rounded-2xl bg-stone-900 border-2 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.4)] group-hover:scale-110 transition-all flex items-center gap-2">
          {/* Animated SVG Robot Companion */}
          <svg viewBox="0 0 80 80" className="w-10 h-10">
            <defs>
              <linearGradient id="pipBody" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#f59e0b" />
                <stop offset="100%" stopColor="#ea580c" />
              </linearGradient>
            </defs>
            {/* Holographic Drone Wings */}
            <ellipse cx="25" cy="22" rx="14" ry="5" fill="#38bdf8" opacity="0.6" transform="rotate(-20 25 22)" />
            <ellipse cx="55" cy="22" rx="14" ry="5" fill="#38bdf8" opacity="0.6" transform="rotate(20 55 22)" />
            {/* Robot Head Dome */}
            <circle cx="40" cy="42" r="22" fill="url(#pipBody)" stroke="#fde68a" strokeWidth="2" />
            {/* Glass Visor */}
            <ellipse cx="40" cy="40" rx="16" ry="10" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
            {/* Digital Expressive Eyes */}
            {pipMood === 'celebrate' ? (
              <>
                <path d="M 30 42 Q 34 36 38 42" stroke="#38bdf8" strokeWidth="2.5" fill="none" strokeLinecap="round" />
                <path d="M 42 42 Q 46 36 50 42" stroke="#38bdf8" strokeWidth="2.5" fill="none" strokeLinecap="round" />
              </>
            ) : pipMood === 'curious' ? (
              <>
                <circle cx="34" cy="40" r="3" fill="#38bdf8" />
                <circle cx="46" cy="40" r="4.5" fill="#38bdf8" />
              </>
            ) : (
              <>
                <circle cx="34" cy="40" r="3.5" fill="#38bdf8" className="animate-pulse" />
                <circle cx="46" cy="40" r="3.5" fill="#38bdf8" className="animate-pulse" />
              </>
            )}
            {/* Smiling mouth indicator */}
            <path d="M 36 54 Q 40 58 44 54" stroke="#fef3c7" strokeWidth="2" fill="none" strokeLinecap="round" />
            {/* Antenna with glowing orb */}
            <line x1="40" y1="20" x2="40" y2="12" stroke="#fde68a" strokeWidth="2" />
            <circle cx="40" cy="10" r="3" fill="#fbbf24" className="animate-ping" />
          </svg>

          {/* Expand/Collapse Toggle Icon */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="p-1 rounded-lg text-stone-400 hover:text-white"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
