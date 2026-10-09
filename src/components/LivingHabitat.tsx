import React, { useState, useEffect, useRef } from 'react';
import { Era, Creature, EraId } from '../types';
import { CreatureGraphics } from './CreatureGraphics';
import { soundManager } from '../utils/audio';
import {
  Sun,
  Moon,
  Sunset,
  CloudRain,
  CloudFog,
  Flame,
  Snowflake,
  Footprints,
  Sparkles,
  Volume2,
  HelpCircle,
  Eye,
  Info,
} from 'lucide-react';

interface LivingHabitatProps {
  era: Era;
  onSelectCreature: (creature: Creature) => void;
  onFootprintDiscovered: (eraId: EraId) => void;
  isFootprintUnlocked: boolean;
  reducedMotion: boolean;
  discoveredCreatures: string[];
}

type TimeOfDay = 'day' | 'sunset' | 'night';
type Weather = 'clear' | 'rain' | 'fog' | 'extreme'; // extreme = ash or snow depending on era

export const LivingHabitat: React.FC<LivingHabitatProps> = ({
  era,
  onSelectCreature,
  onFootprintDiscovered,
  isFootprintUnlocked,
  reducedMotion,
  discoveredCreatures,
}) => {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('day');
  const [weather, setWeather] = useState<Weather>('clear');
  const [hoveredCreatureId, setHoveredCreatureId] = useState<string | null>(null);
  const [radarActive, setRadarActive] = useState<boolean>(false);
  const [geyserActive, setGeyserActive] = useState<boolean>(false);
  const [eggTapped, setEggTapped] = useState<boolean>(false);
  const [plantGlows, setPlantGlows] = useState<boolean>(false);

  // Parallax mouse tracker
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Update ambient audio when era changes
  useEffect(() => {
    soundManager.playAmbient(era.ambientSound);
  }, [era]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (reducedMotion || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePos({ x, y });
  };

  const handleCreatureClick = (creature: Creature) => {
    soundManager.playCreatureCall(creature.soundType);
    onSelectCreature(creature);
  };

  const handleFootprintClick = () => {
    soundManager.playDiscoveryChime();
    onFootprintDiscovered(era.id);
  };

  const handleTriggerGeyser = () => {
    if (geyserActive) return;
    setGeyserActive(true);
    soundManager.playFossilDig('glass');
    setTimeout(() => setGeyserActive(false), 2500);
  };

  const handleTapEggs = () => {
    setEggTapped(true);
    soundManager.playPipBeep('happy');
    setTimeout(() => setEggTapped(false), 2000);
  };

  const handleTapPlant = () => {
    setPlantGlows(true);
    soundManager.playDiscoveryChime();
    setTimeout(() => setPlantGlows(false), 1800);
  };

  // Weather title depending on era
  const extremeWeatherLabel =
    era.id === 'ice-age-tundra'
      ? 'Blizzard'
      : era.id === 'cretaceous-caldera'
      ? 'Volcanic Ash'
      : era.id === 'cambrian-ocean'
      ? 'Tidal Surge'
      : 'Spore Cloud';

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative w-full h-[calc(100vh-4.25rem)] min-h-[580px] overflow-hidden select-none bg-stone-950 flex flex-col justify-between"
    >
      {/* Dynamic Sky Gradient Layer based on Day/Night */}
      <div
        className={`absolute inset-0 -z-30 transition-colors duration-1000 bg-gradient-to-b ${
          timeOfDay === 'day'
            ? era.skyGradient.day
            : timeOfDay === 'sunset'
            ? era.skyGradient.sunset
            : era.skyGradient.night
        }`}
      />

      {/* Sun / Moon Celestial Body */}
      <div
        className="absolute transition-all duration-1000 pointer-events-none -z-20"
        style={{
          top: timeOfDay === 'day' ? '12%' : timeOfDay === 'sunset' ? '28%' : '14%',
          right: timeOfDay === 'day' ? '18%' : timeOfDay === 'sunset' ? '12%' : '24%',
          transform: `translate(${mousePos.x * -10}px, ${mousePos.y * -10}px)`,
        }}
      >
        {timeOfDay === 'night' ? (
          <div className="w-20 h-20 rounded-full bg-amber-100 shadow-[0_0_50px_rgba(254,243,199,0.5)] flex items-center justify-center opacity-85">
            {era.id === 'ice-age-tundra' && (
              <div className="absolute -top-12 -left-20 w-80 h-24 bg-gradient-to-r from-emerald-400/30 via-teal-300/40 to-indigo-500/20 blur-xl animate-pulse pointer-events-none" />
            )}
          </div>
        ) : timeOfDay === 'sunset' ? (
          <div className="w-28 h-28 rounded-full bg-gradient-to-t from-orange-500 to-rose-400 shadow-[0_0_80px_rgba(249,115,22,0.8)] opacity-90" />
        ) : (
          <div className="w-24 h-24 rounded-full bg-amber-200 shadow-[0_0_90px_rgba(253,230,138,0.7)] opacity-95" />
        )}
      </div>

      {/* Parallax Layer 1: Distant Mountains / Seafloor Rifts */}
      <div
        className="absolute inset-0 pointer-events-none -z-20 transition-transform duration-300 ease-out"
        style={{
          transform: `translate(${mousePos.x * -15}px, ${mousePos.y * -10}px)`,
        }}
      >
        <svg
          viewBox="0 0 1200 600"
          preserveAspectRatio="none"
          className="w-full h-full opacity-65"
        >
          {era.id === 'cambrian-ocean' ? (
            // Deep sea hydrothermal vents & ancient ridges
            <>
              <path d="M 0 350 Q 250 280 500 320 T 1000 290 L 1200 350 L 1200 600 L 0 600 Z" fill="#0c4a6e" />
              <path d="M 0 420 Q 300 380 600 410 T 1200 390 L 1200 600 L 0 600 Z" fill="#082f49" />
            </>
          ) : era.id === 'cretaceous-caldera' ? (
            // Smoldering Volcanoes
            <>
              <polygon points="150,600 320,240 480,600" fill="#292524" />
              <polygon points="320,240 310,220 330,220" fill="#ea580c" />
              {/* Eruption smoke cloud */}
              <circle cx="320" cy="180" r="45" fill="#44403c" opacity="0.6" className="animate-pulse" />
              <polygon points="700,600 880,280 1050,600" fill="#1c1917" />
            </>
          ) : era.id === 'ice-age-tundra' ? (
            // Glacial Ice Jagged Peaks
            <>
              <polygon points="50,600 250,220 450,600" fill="#e0f2fe" opacity="0.8" />
              <polygon points="400,600 650,180 900,600" fill="#bae6fd" opacity="0.7" />
              <polygon points="800,600 1020,260 1200,600" fill="#e0f2fe" opacity="0.9" />
            </>
          ) : (
            // Lush Jurassic or Paleolithic Highlands
            <>
              <path d="M 0 380 Q 280 220 600 300 T 1200 260 L 1200 600 L 0 600 Z" fill="#14532d" opacity="0.5" />
              <path d="M 0 440 Q 350 360 700 420 T 1200 390 L 1200 600 L 0 600 Z" fill="#064e3b" opacity="0.7" />
            </>
          )}
        </svg>
      </div>

      {/* Mid-ground Animated Features: Waterfalls / Volcanic Lava / Kelp Forests */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        {era.id === 'jurassic-jungle' && (
          // Cascading Jungle Waterfall
          <div className="absolute left-[44%] top-[38%] w-12 h-44 overflow-hidden opacity-75">
            <div className="w-full h-full bg-gradient-to-b from-sky-200/40 via-cyan-100/70 to-white/90 animate-pulse rounded-t-sm" />
            <div className="absolute bottom-0 w-24 -left-6 h-8 bg-white/40 blur-md animate-ping" />
          </div>
        )}

        {era.id === 'cretaceous-caldera' && (
          // Glowing Lava River Vein
          <svg viewBox="0 0 1000 300" className="absolute bottom-16 w-full h-32 opacity-80">
            <path
              d="M 220 300 Q 350 180 500 240 T 800 280"
              stroke="#ea580c"
              strokeWidth="12"
              fill="none"
              filter="drop-shadow(0 0 12px #f97316)"
            />
            <path
              d="M 220 300 Q 350 180 500 240 T 800 280"
              stroke="#fbbf24"
              strokeWidth="4"
              fill="none"
            />
          </svg>
        )}

        {era.id === 'cambrian-ocean' && (
          // Undulating Coral & Bubble Streams
          <div className="absolute inset-0">
            <div className="absolute bottom-10 left-16 w-2 h-2 rounded-full bg-white/60 animate-bounce" />
            <div className="absolute bottom-20 left-48 w-3 h-3 rounded-full bg-white/50 animate-pulse" />
            <div className="absolute bottom-14 right-36 w-2.5 h-2.5 rounded-full bg-white/70 animate-bounce" />
          </div>
        )}
      </div>

      {/* Weather Particle Simulation Overlay */}
      {weather === 'rain' && (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="w-full h-full bg-[radial-gradient(#bae6fd_1px,transparent_1px)] [background-size:16px_32px] opacity-35 animate-[pulse_1s_infinite]" />
        </div>
      )}
      {weather === 'fog' && (
        <div className="absolute inset-0 pointer-events-none z-0 bg-stone-200/20 backdrop-blur-[2px] transition-all duration-700" />
      )}
      {weather === 'extreme' && (
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          {era.id === 'ice-age-tundra' ? (
            // Blizzard Snow
            <div className="w-full h-full bg-[radial-gradient(#ffffff_2px,transparent_2px)] [background-size:24px_24px] opacity-60 animate-[bounce_2s_infinite]" />
          ) : era.id === 'cretaceous-caldera' ? (
            // Floating Ash & Embers
            <div className="w-full h-full bg-[radial-gradient(#f97316_2px,transparent_2px)] [background-size:28px_28px] opacity-70 animate-pulse" />
          ) : (
            // Humid Spores / Deep Bubbles
            <div className="w-full h-full bg-[radial-gradient(#34d399_2px,transparent_2px)] [background-size:30px_30px] opacity-50 animate-pulse" />
          )}
        </div>
      )}

      {/* Bioluminescent Night Glow on plants */}
      {timeOfDay === 'night' && (
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute bottom-24 left-1/4 w-32 h-32 rounded-full bg-cyan-400/15 blur-2xl animate-pulse" />
          <div className="absolute bottom-20 right-1/3 w-36 h-36 rounded-full bg-emerald-400/15 blur-2xl animate-pulse" />
        </div>
      )}

      {/* Top Habitat HUD: Era Name, Atmosphere & Weather/Time Controls */}
      <div className="relative z-20 px-4 pt-3 flex flex-wrap items-center justify-between gap-3">
        {/* Era Info Tag */}
        <div className="flex items-center gap-2.5 bg-stone-900/85 backdrop-blur-md border border-stone-800 px-3.5 py-1.5 rounded-xl shadow-lg">
          <span className="text-xl">{era.creatures[0]?.avatarEmoji}</span>
          <div>
            <div className="text-xs font-black uppercase text-white font-['Outfit'] tracking-wide">
              {era.name}
            </div>
            <div className="text-[10px] text-stone-400 font-mono">
              {era.timeRange} · {era.temperature}
            </div>
          </div>
        </div>

        {/* Environmental Simulator Controls (Time of Day & Weather) */}
        <div className="flex items-center gap-2 bg-stone-900/85 backdrop-blur-md border border-stone-800 p-1.5 rounded-xl shadow-lg">
          {/* Day / Sunset / Night Toggle */}
          <div className="flex items-center gap-1 bg-stone-950/70 p-0.5 rounded-lg border border-stone-800/80">
            <button
              onClick={() => {
                setTimeOfDay('day');
                soundManager.playPipBeep('happy');
              }}
              title="Bright Daylight"
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                timeOfDay === 'day'
                  ? 'bg-amber-500 text-stone-950 shadow-sm'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setTimeOfDay('sunset');
                soundManager.playPipBeep('happy');
              }}
              title="Golden Sunset"
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                timeOfDay === 'sunset'
                  ? 'bg-orange-500 text-stone-950 shadow-sm'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Sunset className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setTimeOfDay('night');
                soundManager.playPipBeep('celebrate');
              }}
              title="Bioluminescent Night"
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                timeOfDay === 'night'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="w-[1px] h-4 bg-stone-700" />

          {/* Dynamic Weather Toggles */}
          <div className="flex items-center gap-1 bg-stone-950/70 p-0.5 rounded-lg border border-stone-800/80">
            <button
              onClick={() => {
                setWeather('clear');
                soundManager.playPipBeep('happy');
              }}
              title="Clear Skies"
              className={`px-2 py-1 text-[11px] font-semibold rounded-md transition-colors cursor-pointer ${
                weather === 'clear'
                  ? 'bg-stone-800 text-white border border-stone-700'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              Clear
            </button>
            <button
              onClick={() => {
                setWeather('rain');
                soundManager.playPipBeep('curious');
              }}
              title="Rainstorm"
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                weather === 'rain'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <CloudRain className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setWeather('fog');
                soundManager.playPipBeep('curious');
              }}
              title="Atmospheric Mist"
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                weather === 'fog'
                  ? 'bg-stone-600 text-white shadow-sm'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              <CloudFog className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                setWeather('extreme');
                soundManager.playPipBeep('celebrate');
              }}
              title={extremeWeatherLabel}
              className={`p-1.5 rounded-md transition-colors cursor-pointer ${
                weather === 'extreme'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              {era.id === 'ice-age-tundra' ? (
                <Snowflake className="w-3.5 h-3.5" />
              ) : (
                <Flame className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          <div className="w-[1px] h-4 bg-stone-700" />

          {/* Footprint Tracker Radar Toggle */}
          <button
            onClick={() => {
              setRadarActive(!radarActive);
              soundManager.playFossilDig('glass');
            }}
            title="Scan for Footprints"
            className={`flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg border transition-all cursor-pointer ${
              radarActive
                ? 'bg-amber-400 text-stone-950 border-amber-300 shadow-md ring-2 ring-amber-400/40'
                : 'bg-stone-950/80 text-amber-400 border-amber-500/30 hover:border-amber-400'
            }`}
          >
            <Footprints className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Track</span>
          </button>
        </div>
      </div>

      {/* Main Living Landscape Play Area */}
      <div className="relative flex-1 w-full h-full overflow-hidden">
        {/* Interactive Environmental Secret Hotspot 1: Dino Nest / Shells / Permafrost Relic */}
        <div
          onClick={handleTapEggs}
          className="absolute z-10 cursor-pointer group"
          style={{ bottom: '15%', left: '8%' }}
          title="Prehistoric Nest! Tap to inspect"
        >
          <div className="relative p-2.5 rounded-xl bg-stone-900/60 backdrop-blur-xs border border-stone-800 hover:border-amber-400/70 transition-all hover:scale-110">
            <span className="text-2xl block animate-pulse">
              {era.id === 'ice-age-tundra'
                ? '❄️'
                : era.id === 'paleolithic-cave'
                ? '🔥'
                : era.id === 'cambrian-ocean'
                ? '🐚'
                : '🪺'}
            </span>
            {eggTapped && (
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-amber-400 text-stone-950 text-[10px] font-bold px-2 py-0.5 rounded-md whitespace-nowrap shadow-lg animate-bounce">
                {era.id === 'paleolithic-cave'
                  ? 'Flickering Hearth!'
                  : era.id === 'cambrian-ocean'
                  ? 'Ancient Nautilus Shell!'
                  : 'Baby Dino Chirp!'}
              </div>
            )}
          </div>
        </div>

        {/* Interactive Hotspot 2: Geyser / Vent / Cave Painting Wall */}
        <div
          onClick={handleTriggerGeyser}
          className="absolute z-10 cursor-pointer group"
          style={{ bottom: '18%', right: '12%' }}
          title="Prehistoric Thermal Vent! Tap to trigger"
        >
          <div className="relative p-2.5 rounded-xl bg-stone-900/60 backdrop-blur-xs border border-stone-800 hover:border-cyan-400/70 transition-all hover:scale-110">
            <span className="text-2xl block">
              {era.id === 'cretaceous-caldera'
                ? '🌋'
                : era.id === 'cambrian-ocean'
                ? '🫧'
                : era.id === 'ice-age-tundra'
                ? '🧊'
                : '💨'}
            </span>
            {geyserActive && (
              <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-8 h-20 bg-gradient-to-t from-white/80 to-transparent blur-xs animate-ping pointer-events-none rounded-full" />
            )}
          </div>
        </div>

        {/* Interactive Hotspot 3: Bioluminescent Fern / Coral */}
        <div
          onClick={handleTapPlant}
          className="absolute z-10 cursor-pointer"
          style={{ bottom: '26%', left: '46%' }}
          title="Ancient Bioluminescent Flora"
        >
          <div
            className={`p-2 rounded-full border transition-all ${
              plantGlows
                ? 'bg-emerald-400/30 border-emerald-300 scale-125 shadow-[0_0_20px_#34d399]'
                : 'bg-stone-900/40 border-stone-800 hover:border-emerald-500/50'
            }`}
          >
            <span className="text-xl">
              {era.id === 'cambrian-ocean'
                ? '🪸'
                : era.id === 'carboniferous-swamp'
                ? '🌿'
                : era.id === 'ice-age-tundra'
                ? '🌱'
                : '🪴'}
            </span>
          </div>
        </div>

        {/* Secret Glowing Footprint Trail (Discovered or Radar Active) */}
        {(radarActive || isFootprintUnlocked) && (
          <button
            onClick={handleFootprintClick}
            className="absolute z-20 p-2 rounded-2xl bg-amber-500/20 border-2 border-dashed border-amber-400 hover:bg-amber-500/30 transition-all cursor-pointer hover:scale-115 group animate-pulse"
            style={{
              left: `${era.secretFootprint.coords.x}%`,
              top: `${era.secretFootprint.coords.y}%`,
            }}
            title={era.secretFootprint.clue}
          >
            <div className="flex items-center gap-1.5 text-amber-300">
              <Footprints className="w-6 h-6 animate-bounce" />
              <div className="hidden group-hover:block absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-48 bg-stone-900 border border-amber-400 p-2 rounded-lg text-left shadow-xl">
                <div className="text-[11px] font-bold text-amber-300">
                  {era.secretFootprint.name}
                </div>
                <div className="text-[10px] text-stone-300 mt-0.5">
                  {era.secretFootprint.clue}
                </div>
                <div className="text-[9px] text-amber-400 mt-1 uppercase font-semibold">
                  Click to inspect track!
                </div>
              </div>
            </div>
          </button>
        )}

        {/* Animated Living Creatures roaming/swimming/flying! */}
        {era.creatures.map((creature) => {
          const isHovered = hoveredCreatureId === creature.id;
          const isDiscovered = discoveredCreatures.includes(creature.id);

          // Flight / Swim / Roam animation styles
          let animClass = '';
          if (!reducedMotion) {
            if (creature.isFlying) {
              animClass = 'animate-[bounce_4s_ease-in-out_infinite]';
            } else if (creature.isSwimming) {
              animClass = 'animate-[pulse_3s_ease-in-out_infinite]';
            }
          }

          return (
            <div
              key={creature.id}
              onClick={() => handleCreatureClick(creature)}
              onMouseEnter={() => {
                setHoveredCreatureId(creature.id);
                soundManager.playCreatureCall(creature.soundType);
              }}
              onMouseLeave={() => setHoveredCreatureId(null)}
              className={`absolute cursor-pointer transition-all duration-300 select-none group z-10 ${animClass}`}
              style={{
                left: `${creature.initialPos.x}%`,
                top: `${creature.initialPos.y}%`,
                width: `${Math.round(130 * creature.sizeScale)}px`,
                height: `${Math.round(90 * creature.sizeScale)}px`,
                transform: `scale(${isHovered ? 1.15 : 1})`,
                filter: isHovered ? `drop-shadow(0 0 15px ${creature.colorScheme.glow})` : undefined,
              }}
              title={`Click to inspect ${creature.name}!`}
            >
              {/* Creature Vector Illustration */}
              <div className="w-full h-full relative">
                <CreatureGraphics type={creature.svgType} isHovered={isHovered} />

                {/* Discovery Checkmark Ring if already logged */}
                {isDiscovered && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-emerald-500 border border-white text-white flex items-center justify-center text-[10px] font-bold shadow-md">
                    ✓
                  </div>
                )}
              </div>

              {/* Kid-friendly Creature Name & Sound Call Button on hover */}
              <div
                className={`absolute -bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-stone-900/90 border border-stone-700 backdrop-blur-sm shadow-xl transition-all duration-200 pointer-events-auto whitespace-nowrap ${
                  isHovered ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
                }`}
              >
                <span className="text-xs font-bold text-white font-['Outfit']">
                  {creature.name}
                </span>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    soundManager.playCreatureCall(creature.soundType);
                  }}
                  className="p-1 rounded bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-stone-950 transition-colors"
                  title="Play Call"
                >
                  <Volume2 className="w-3 h-3" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Foreground Organic Ground/Coral Trim */}
      <div className="relative w-full z-10 pointer-events-none">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="w-full h-16 sm:h-24 fill-stone-950"
        >
          {era.id === 'cambrian-ocean' ? (
            <path d="M 0 50 Q 200 20 400 45 T 800 30 T 1200 40 L 1200 120 L 0 120 Z" />
          ) : era.id === 'ice-age-tundra' ? (
            <path d="M 0 35 Q 300 10 600 30 T 1200 15 L 1200 120 L 0 120 Z" />
          ) : (
            <path d="M 0 40 Q 250 15 500 35 T 1000 25 T 1200 30 L 1200 120 L 0 120 Z" />
          )}
        </svg>

        {/* Bottom Explorer Action Strip */}
        <div className="absolute inset-x-0 bottom-2 px-4 flex items-center justify-between pointer-events-auto text-xs text-stone-300">
          <div className="flex items-center gap-2 bg-stone-900/80 backdrop-blur px-3 py-1.5 rounded-xl border border-stone-800">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span className="hidden sm:inline">
              Tap any creature to unlock its Field Dossier!
            </span>
            <span className="sm:hidden">Tap creatures to inspect!</span>
          </div>

          <div className="flex items-center gap-2">
            <div className="text-[11px] text-stone-400 font-medium">
              Discovered in this era:{' '}
              <strong className="text-amber-400">
                {era.creatures.filter((c) => discoveredCreatures.includes(c.id)).length} /{' '}
                {era.creatures.length}
              </strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
