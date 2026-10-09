import React from 'react';

interface CreatureGraphicsProps {
  type: string;
  className?: string;
  isHovered?: boolean;
}

export const CreatureGraphics: React.FC<CreatureGraphicsProps> = ({ type, className = "w-full h-full", isHovered = false }) => {
  switch (type) {
    case 'anomalocaris':
      return (
        <svg viewBox="0 0 240 140" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="anomGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f97316" />
              <stop offset="50%" stopColor="#ea580c" />
              <stop offset="100%" stopColor="#c2410c" />
            </linearGradient>
            <linearGradient id="anomGlow" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fed7aa" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#f97316" stopOpacity="0.1" />
            </linearGradient>
          </defs>
          {/* Undulating Swimming Flaps */}
          {[-25, -15, -5, 5, 15, 25, 35, 45].map((xOffset, i) => (
            <ellipse
              key={i}
              cx={110 + xOffset * 1.6}
              cy={70 + Math.sin(i + (isHovered ? 2 : 0)) * 6}
              rx="18"
              ry="26"
              fill="url(#anomGlow)"
              stroke="#fb923c"
              strokeWidth="1.5"
              transform={`rotate(${i * 3} ${110 + xOffset * 1.6} 70)`}
            />
          ))}
          {/* Main Segmented Body */}
          <path
            d="M 60 70 Q 110 50 170 65 Q 185 70 170 75 Q 110 90 60 70 Z"
            fill="url(#anomGrad)"
            stroke="#fdba74"
            strokeWidth="2"
          />
          {/* Fan Tail */}
          <path d="M 170 68 L 215 45 L 210 70 L 225 90 L 170 72 Z" fill="#ea580c" stroke="#fdba74" strokeWidth="1.5" />
          {/* Head & Stalk Eyes */}
          <circle cx="65" cy="58" r="8" fill="#38bdf8" stroke="#0284c7" strokeWidth="2" />
          <circle cx="65" cy="82" r="8" fill="#38bdf8" stroke="#0284c7" strokeWidth="2" />
          <circle cx="66" cy="58" r="3" fill="#0f172a" />
          <circle cx="66" cy="82" r="3" fill="#0f172a" />
          {/* Spiny Grasping Arms */}
          <path
            d="M 55 64 C 40 50 25 55 18 68 C 22 75 32 70 42 66"
            fill="none"
            stroke="#fb923c"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M 55 76 C 40 90 25 85 18 72 C 22 65 32 70 42 74"
            fill="none"
            stroke="#fb923c"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Little arm spines */}
          <circle cx="24" cy="62" r="2" fill="#fed7aa" />
          <circle cx="22" cy="78" r="2" fill="#fed7aa" />
          <circle cx="32" cy="56" r="2" fill="#fed7aa" />
          <circle cx="32" cy="84" r="2" fill="#fed7aa" />
        </svg>
      );

    case 'dunkleosteus':
      return (
        <svg viewBox="0 0 260 140" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="dunkArmor" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#475569" />
              <stop offset="50%" stopColor="#334155" />
              <stop offset="100%" stopColor="#1e293b" />
            </linearGradient>
            <linearGradient id="dunkBody" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="100%" stopColor="#0f172a" />
            </linearGradient>
          </defs>
          {/* Shark-like Body */}
          <path d="M 100 50 Q 180 40 220 70 Q 180 100 100 90 Z" fill="url(#dunkBody)" />
          {/* Caudal Tail */}
          <path d="M 215 70 L 255 35 L 240 70 L 255 105 Z" fill="#1e293b" stroke="#64748b" strokeWidth="2" />
          {/* Dorsal Fin */}
          <path d="M 160 45 L 180 20 L 195 48 Z" fill="#334155" />
          {/* Armored Skull & Thorax */}
          <path
            d="M 30 70 Q 40 35 95 38 L 115 50 L 110 95 L 85 100 Q 45 95 30 70 Z"
            fill="url(#dunkArmor)"
            stroke="#94a3b8"
            strokeWidth="2.5"
          />
          {/* Bone Shearing Jaws */}
          <path d="M 32 68 L 65 70 L 60 84 L 40 82 Z" fill="#e2e8f0" stroke="#0f172a" strokeWidth="1.5" />
          <polygon points="42,70 48,78 54,70" fill="#f8fafc" />
          <polygon points="46,82 52,74 58,82" fill="#f8fafc" />
          {/* Glowing Eye */}
          <circle cx="55" cy="52" r="6" fill="#e0f2fe" stroke="#0284c7" strokeWidth="2" />
          <circle cx="56" cy="52" r="2.5" fill="#0f172a" />
          {/* Pectoral Fin */}
          <path d="M 100 85 L 125 118 L 138 90 Z" fill="#475569" stroke="#64748b" strokeWidth="1.5" />
        </svg>
      );

    case 'trilobite':
      return (
        <svg viewBox="0 0 160 160" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="triloGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#eab308" />
              <stop offset="50%" stopColor="#ca8a04" />
              <stop offset="100%" stopColor="#854d0e" />
            </linearGradient>
          </defs>
          {/* Cephalon Head Shield */}
          <path
            d="M 30 55 C 30 25 130 25 130 55 C 130 65 110 65 80 65 C 50 65 30 65 30 55 Z"
            fill="url(#triloGrad)"
            stroke="#fde047"
            strokeWidth="2"
          />
          {/* Calcite Crystal Eyes */}
          <ellipse cx="55" cy="45" rx="7" ry="5" fill="#fef08a" stroke="#713f12" strokeWidth="1.5" />
          <ellipse cx="105" cy="45" rx="7" ry="5" fill="#fef08a" stroke="#713f12" strokeWidth="1.5" />
          {/* Thorax Segments */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <g key={i}>
              <path
                d={`M ${40 + i * 2} ${70 + i * 11} L ${120 - i * 2} ${70 + i * 11} L ${115 - i * 3} ${78 + i * 11} L ${45 + i * 3} ${78 + i * 11} Z`}
                fill="#ca8a04"
                stroke="#fef08a"
                strokeWidth="1.2"
              />
              {/* Axial lobe center ridge */}
              <rect x="73" y={70 + i * 11} width="14" height="8" fill="#eab308" rx="1" />
            </g>
          ))}
          {/* Pygidium Tail Shield */}
          <path d="M 60 138 Q 80 152 100 138 Z" fill="#854d0e" stroke="#fde047" strokeWidth="1.5" />
          {/* Antennae */}
          <path d="M 60 30 Q 50 10 35 15" stroke="#fde047" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M 100 30 Q 110 10 125 15" stroke="#fde047" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      );

    case 'tiktaalik':
      return (
        <svg viewBox="0 0 220 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="tiktGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="50%" stopColor="#059669" />
              <stop offset="100%" stopColor="#047857" />
            </linearGradient>
          </defs>
          {/* Tapered Fish-Tetrapod Body */}
          <path d="M 35 60 Q 80 35 150 48 Q 200 60 215 65 Q 180 75 140 75 Q 75 80 35 60 Z" fill="url(#tiktGrad)" stroke="#34d399" strokeWidth="2" />
          {/* Fin Tail */}
          <path d="M 195 62 Q 220 50 218 68 Q 215 85 190 70 Z" fill="#047857" />
          {/* Flat Crocodilian Head */}
          <path d="M 15 60 Q 30 42 65 48 L 65 72 Q 30 78 15 60 Z" fill="#059669" stroke="#6ee7b7" strokeWidth="2" />
          {/* Eyes on Top of Skull */}
          <circle cx="45" cy="48" r="5" fill="#fef08a" stroke="#065f46" strokeWidth="1.5" />
          <circle cx="46" cy="48" r="2" fill="#022c22" />
          {/* Walking Wrist Fins */}
          <path d="M 70 70 Q 60 92 80 98 Q 90 92 85 72 Z" fill="#34d399" stroke="#065f46" strokeWidth="2" />
          <path d="M 130 70 Q 125 90 145 94 Q 150 88 142 70 Z" fill="#10b981" stroke="#065f46" strokeWidth="1.5" />
        </svg>
      );

    case 'meganeura':
      return (
        <svg viewBox="0 0 240 180" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="wingGlow" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.75" />
              <stop offset="50%" stopColor="#38bdf8" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#22c55e" stopOpacity="0.6" />
            </linearGradient>
          </defs>
          {/* Forewings & Hindwings */}
          <g className={isHovered ? "animate-pulse" : ""}>
            <ellipse cx="65" cy="50" rx="60" ry="16" fill="url(#wingGlow)" stroke="#67e8f9" strokeWidth="1.5" transform="rotate(-25 65 50)" />
            <ellipse cx="60" cy="85" rx="52" ry="14" fill="url(#wingGlow)" stroke="#38bdf8" strokeWidth="1.5" transform="rotate(-10 60 85)" />
            <ellipse cx="175" cy="50" rx="60" ry="16" fill="url(#wingGlow)" stroke="#67e8f9" strokeWidth="1.5" transform="rotate(25 175 50)" />
            <ellipse cx="180" cy="85" rx="52" ry="14" fill="url(#wingGlow)" stroke="#38bdf8" strokeWidth="1.5" transform="rotate(10 180 85)" />
          </g>
          {/* Wing veins */}
          <path d="M 10 30 L 110 70 M 230 30 L 130 70" stroke="#e0f2fe" strokeWidth="0.8" opacity="0.6" />
          {/* Long Segmented Abdomen */}
          <path d="M 120 85 L 120 170" stroke="#15803d" strokeWidth="6" strokeLinecap="round" />
          <path d="M 120 90 L 120 165" stroke="#86efac" strokeWidth="2" strokeDasharray="4 3" />
          {/* Thorax */}
          <ellipse cx="120" cy="75" rx="10" ry="16" fill="#166534" stroke="#4ade80" strokeWidth="2" />
          {/* Head & Huge Compound Eyes */}
          <circle cx="114" cy="58" r="9" fill="#22c55e" stroke="#14532d" strokeWidth="2" />
          <circle cx="126" cy="58" r="9" fill="#22c55e" stroke="#14532d" strokeWidth="2" />
          <circle cx="114" cy="56" r="3" fill="#052e16" />
          <circle cx="126" cy="56" r="3" fill="#052e16" />
        </svg>
      );

    case 'arthropleura':
      return (
        <svg viewBox="0 0 240 100" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="arthroGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ca8a04" />
              <stop offset="100%" stopColor="#713f12" />
            </linearGradient>
          </defs>
          {/* Multitude of Walking Legs */}
          {Array.from({ length: 16 }).map((_, i) => (
            <g key={i}>
              <line x1={35 + i * 11} y1="40" x2={30 + i * 11} y2="25" stroke="#a16207" strokeWidth="2" strokeLinecap="round" />
              <line x1={35 + i * 11} y1="60" x2={30 + i * 11} y2="75" stroke="#a16207" strokeWidth="2" strokeLinecap="round" />
            </g>
          ))}
          {/* Armored Tergite Segments */}
          {Array.from({ length: 14 }).map((_, i) => (
            <rect
              key={i}
              x={35 + i * 12}
              y="38"
              width="15"
              height="24"
              rx="4"
              fill="url(#arthroGrad)"
              stroke="#fef08a"
              strokeWidth="1.2"
            />
          ))}
          {/* Head and Antennae */}
          <ellipse cx="32" cy="50" rx="10" ry="12" fill="#854d0e" stroke="#fde047" strokeWidth="2" />
          <path d="M 25 45 Q 12 30 8 32" stroke="#fde047" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M 25 55 Q 12 70 8 68" stroke="#fde047" strokeWidth="2" fill="none" strokeLinecap="round" />
        </svg>
      );

    case 'hylonomus':
      return (
        <svg viewBox="0 0 160 80" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Slender primitive reptile */}
          <path d="M 20 40 Q 60 30 110 38 Q 140 40 155 45 Q 130 48 95 46 Q 50 48 20 40 Z" fill="#0d9488" stroke="#5eead4" strokeWidth="2" />
          <ellipse cx="22" cy="40" rx="9" ry="6" fill="#14b8a6" />
          <circle cx="20" cy="38" r="2" fill="#042f2e" />
          {/* Sprawling legs */}
          <path d="M 45 42 L 35 55 L 45 60" stroke="#14b8a6" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 90 42 L 80 55 L 90 60" stroke="#14b8a6" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 45 38 L 35 25 L 45 20" stroke="#0f766e" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 90 38 L 80 25 L 90 20" stroke="#0f766e" strokeWidth="3" fill="none" strokeLinecap="round" />
        </svg>
      );

    case 'brachiosaurus':
      return (
        <svg viewBox="0 0 240 220" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="brachGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#0284c7" />
              <stop offset="50%" stopColor="#0369a1" />
              <stop offset="100%" stopColor="#075985" />
            </linearGradient>
          </defs>
          {/* Massive Pillar Legs */}
          <rect x="80" y="140" width="18" height="65" rx="5" fill="#0369a1" stroke="#38bdf8" strokeWidth="2" />
          <rect x="110" y="135" width="17" height="70" rx="5" fill="#075985" stroke="#38bdf8" strokeWidth="2" />
          <rect x="155" y="145" width="16" height="60" rx="5" fill="#0369a1" stroke="#38bdf8" strokeWidth="2" />
          <rect x="180" y="140" width="16" height="65" rx="5" fill="#075985" stroke="#38bdf8" strokeWidth="2" />
          {/* Enormous Sauropod Torso */}
          <ellipse cx="140" cy="130" rx="60" ry="40" fill="url(#brachGrad)" stroke="#7dd3fc" strokeWidth="2" />
          {/* Long High Tapering Neck */}
          <path
            d="M 95 125 C 75 90 55 45 60 25 C 65 18 80 22 85 35 C 95 65 120 110 135 125 Z"
            fill="url(#brachGrad)"
            stroke="#7dd3fc"
            strokeWidth="2"
          />
          {/* High-Crested Head */}
          <path d="M 55 25 Q 40 20 48 12 Q 62 8 70 18 Q 72 26 55 25 Z" fill="#0284c7" stroke="#7dd3fc" strokeWidth="1.8" />
          <circle cx="56" cy="16" r="2.5" fill="#f8fafc" />
          <circle cx="56" cy="16" r="1.2" fill="#0f172a" />
          {/* Whip Tail */}
          <path d="M 195 125 Q 235 140 238 160 Q 225 155 190 138 Z" fill="#075985" stroke="#38bdf8" strokeWidth="1.5" />
          {/* Friendly Back Pattern */}
          <circle cx="120" cy="115" r="4" fill="#38bdf8" opacity="0.6" />
          <circle cx="145" cy="118" r="6" fill="#38bdf8" opacity="0.6" />
          <circle cx="170" cy="125" r="5" fill="#38bdf8" opacity="0.6" />
        </svg>
      );

    case 'stegosaurus':
      return (
        <svg viewBox="0 0 240 140" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="stegGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ea580c" />
              <stop offset="100%" stopColor="#9a3412" />
            </linearGradient>
            <linearGradient id="plateGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="100%" stopColor="#c2410c" />
            </linearGradient>
          </defs>
          {/* Alternating Dorsal Plates */}
          {[
            { x: 75, y: 35, s: 0.7 },
            { x: 95, y: 22, s: 0.9 },
            { x: 120, y: 15, s: 1.1 },
            { x: 145, y: 18, s: 1.0 },
            { x: 170, y: 28, s: 0.8 },
            { x: 190, y: 40, s: 0.6 },
          ].map((p, idx) => (
            <polygon
              key={idx}
              points={`${p.x},${p.y} ${p.x - 14 * p.s},${p.y + 35 * p.s} ${p.x + 14 * p.s},${p.y + 35 * p.s}`}
              fill="url(#plateGrad)"
              stroke="#fef08a"
              strokeWidth="1.8"
            />
          ))}
          {/* Legs */}
          <rect x="65" y="80" width="16" height="42" rx="4" fill="#9a3412" stroke="#fdba74" strokeWidth="1.5" />
          <rect x="90" y="80" width="14" height="42" rx="4" fill="#c2410c" stroke="#fdba74" strokeWidth="1.5" />
          <rect x="145" y="75" width="18" height="48" rx="4" fill="#9a3412" stroke="#fdba74" strokeWidth="1.5" />
          <rect x="168" y="75" width="16" height="48" rx="4" fill="#c2410c" stroke="#fdba74" strokeWidth="1.5" />
          {/* Arched Body */}
          <path
            d="M 45 78 Q 80 50 140 52 Q 185 58 200 78 Q 165 92 105 92 Q 60 90 45 78 Z"
            fill="url(#stegGrad)"
            stroke="#fdba74"
            strokeWidth="2"
          />
          {/* Tiny Low Beaked Head */}
          <path d="M 48 78 Q 28 82 20 85 Q 26 92 42 86 Z" fill="#ea580c" stroke="#fdba74" strokeWidth="1.8" />
          <circle cx="28" cy="83" r="1.5" fill="#0f172a" />
          {/* Tail with Thagomizer Spikes */}
          <path d="M 195 78 Q 220 82 235 84" stroke="#9a3412" strokeWidth="6" strokeLinecap="round" />
          <line x1="225" y1="82" x2="238" y2="70" stroke="#fef08a" strokeWidth="3" strokeLinecap="round" />
          <line x1="228" y1="83" x2="242" y2="76" stroke="#fef08a" strokeWidth="3" strokeLinecap="round" />
          <line x1="225" y1="84" x2="238" y2="95" stroke="#fef08a" strokeWidth="3" strokeLinecap="round" />
          <line x1="228" y1="83" x2="242" y2="90" stroke="#fef08a" strokeWidth="3" strokeLinecap="round" />
        </svg>
      );

    case 'archaeopteryx':
      return (
        <svg viewBox="0 0 180 140" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Feathered Wings */}
          <path d="M 60 65 Q 15 40 10 20 Q 40 45 70 55" fill="#8b5cf6" stroke="#c4b5fd" strokeWidth="2" />
          <path d="M 95 65 Q 145 35 160 15 Q 130 45 90 55" fill="#7c3aed" stroke="#c4b5fd" strokeWidth="2" />
          {/* Feathered Long Tail */}
          <path d="M 80 85 Q 90 125 95 135 Q 85 125 75 85" fill="#6d28d9" stroke="#ddd6fe" strokeWidth="2" />
          {/* Bird/Dino Torso & Head */}
          <ellipse cx="80" cy="65" rx="14" ry="20" fill="#8b5cf6" stroke="#c4b5fd" strokeWidth="2" />
          <path d="M 76 50 Q 80 32 90 30 Q 88 38 84 50 Z" fill="#8b5cf6" stroke="#c4b5fd" strokeWidth="1.8" />
          {/* Tiny toothed beak */}
          <polygon points="90,30 102,32 91,35" fill="#fbbf24" />
          <circle cx="85" cy="33" r="2" fill="#0f172a" />
          {/* Wing Claws */}
          <circle cx="35" cy="38" r="2.5" fill="#fbbf24" />
          <circle cx="135" cy="35" r="2.5" fill="#fbbf24" />
        </svg>
      );

    case 'allosaurus':
    case 'trex':
      const isRex = type === 'trex';
      return (
        <svg viewBox="0 0 240 160" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="carnivoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={isRex ? "#b91c1c" : "#dc2626"} />
              <stop offset="100%" stopColor={isRex ? "#7f1d1d" : "#991b1b"} />
            </linearGradient>
          </defs>
          {/* Counterbalance Heavy Tail */}
          <path d="M 120 70 Q 180 85 235 60 Q 185 100 120 85 Z" fill="url(#carnivoreGrad)" stroke={isRex ? "#f87171" : "#fca5a5"} strokeWidth="2" />
          {/* Massive Hind Running Legs */}
          <path d="M 110 80 Q 135 110 125 145 L 140 148 L 115 152 Q 105 120 95 85 Z" fill="#991b1b" stroke={isRex ? "#f87171" : "#fca5a5"} strokeWidth="2" />
          <path d="M 85 75 Q 105 105 95 142 L 110 145 L 85 150 Q 75 110 70 80 Z" fill="url(#carnivoreGrad)" stroke={isRex ? "#f87171" : "#fca5a5"} strokeWidth="2" />
          {/* Powerful Torso */}
          <ellipse cx="90" cy="70" rx="35" ry="24" fill="url(#carnivoreGrad)" stroke={isRex ? "#f87171" : "#fca5a5"} strokeWidth="2" />
          {/* Small 2-claw arms (T-Rex) or 3-claw arms (Allosaurus) */}
          <path d="M 70 78 L 58 90 L 52 86" stroke="#fca5a5" strokeWidth="3" fill="none" strokeLinecap="round" />
          {/* Colossal Head & Bone-Crusher Jaws */}
          <path
            d="M 68 62 L 50 40 L 15 42 L 12 60 L 40 65 L 18 78 L 38 80 L 65 72 Z"
            fill="url(#carnivoreGrad)"
            stroke={isRex ? "#f87171" : "#fca5a5"}
            strokeWidth="2.5"
          />
          {/* Serrated Teeth */}
          {[18, 24, 30, 36].map((tx) => (
            <polygon key={tx} points={`${tx},60 ${tx + 3},66 ${tx + 6},60`} fill="#f8fafc" />
          ))}
          {/* Fiery Eye with Ridge */}
          <circle cx="36" cy="48" r="4" fill="#fbbf24" stroke="#7f1d1d" strokeWidth="1.5" />
          <circle cx="36" cy="48" r="1.8" fill="#0f172a" />
        </svg>
      );

    case 'triceratops':
      return (
        <svg viewBox="0 0 240 140" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="triGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#92400e" />
            </linearGradient>
          </defs>
          {/* Heavy Quadruped Legs */}
          <rect x="70" y="80" width="18" height="45" rx="5" fill="#92400e" stroke="#fcd34d" strokeWidth="1.8" />
          <rect x="95" y="80" width="16" height="45" rx="5" fill="#b45309" stroke="#fcd34d" strokeWidth="1.8" />
          <rect x="145" y="78" width="18" height="48" rx="5" fill="#92400e" stroke="#fcd34d" strokeWidth="1.8" />
          <rect x="170" y="78" width="16" height="48" rx="5" fill="#b45309" stroke="#fcd34d" strokeWidth="1.8" />
          {/* Stocky Torso & Short Tail */}
          <ellipse cx="130" cy="78" rx="50" ry="30" fill="url(#triGrad)" stroke="#fcd34d" strokeWidth="2" />
          <path d="M 180 78 Q 210 90 220 102 Q 195 98 175 88 Z" fill="#92400e" stroke="#fcd34d" strokeWidth="1.5" />
          {/* Solid Shield Frill */}
          <path
            d="M 60 70 C 50 30 95 25 85 65 Z"
            fill="#b45309"
            stroke="#fde68a"
            strokeWidth="3"
          />
          {/* Frill scalloped edges */}
          <circle cx="62" cy="38" r="3" fill="#fcd34d" />
          <circle cx="72" cy="30" r="3" fill="#fcd34d" />
          <circle cx="84" cy="34" r="3" fill="#fcd34d" />
          {/* Head & Parrot Beak */}
          <path d="M 65 65 L 35 70 L 25 85 L 42 90 L 65 80 Z" fill="url(#triGrad)" stroke="#fcd34d" strokeWidth="2" />
          {/* Giant Brow Horns */}
          <path d="M 52 64 L 20 45 L 35 62 Z" fill="#fef3c7" stroke="#92400e" strokeWidth="1.5" />
          {/* Nose Horn */}
          <polygon points="32,72 20,65 30,78" fill="#fef3c7" stroke="#92400e" strokeWidth="1.2" />
          <circle cx="48" cy="72" r="2.5" fill="#0f172a" />
        </svg>
      );

    case 'pteranodon':
      return (
        <svg viewBox="0 0 240 120" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="pteraGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
          </defs>
          {/* Vast Membranous Wings */}
          <path
            d="M 120 60 Q 60 15 10 35 Q 50 70 105 68 Z"
            fill="url(#pteraGrad)"
            stroke="#fef08a"
            strokeWidth="2"
          />
          <path
            d="M 120 60 Q 180 15 230 35 Q 190 70 135 68 Z"
            fill="url(#pteraGrad)"
            stroke="#fef08a"
            strokeWidth="2"
          />
          {/* Small Body */}
          <ellipse cx="120" cy="65" rx="8" ry="16" fill="#b45309" stroke="#fef08a" strokeWidth="1.5" />
          {/* Aerodynamic Backward Skull Crest & Spear Beak */}
          <path
            d="M 120 54 L 138 32 L 125 50 L 100 48 L 80 50 L 115 56 Z"
            fill="#d97706"
            stroke="#fef08a"
            strokeWidth="1.8"
          />
          <circle cx="112" cy="52" r="2" fill="#0f172a" />
        </svg>
      );

    case 'ankylosaurus':
      return (
        <svg viewBox="0 0 240 110" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="ankyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#78716c" />
              <stop offset="100%" stopColor="#44403c" />
            </linearGradient>
          </defs>
          {/* Low Sturdy Legs */}
          <rect x="65" y="65" width="16" height="32" rx="4" fill="#44403c" stroke="#d6d3d1" strokeWidth="1.5" />
          <rect x="85" y="65" width="16" height="32" rx="4" fill="#57534e" stroke="#d6d3d1" strokeWidth="1.5" />
          <rect x="145" y="65" width="16" height="32" rx="4" fill="#44403c" stroke="#d6d3d1" strokeWidth="1.5" />
          <rect x="165" y="65" width="16" height="32" rx="4" fill="#57534e" stroke="#d6d3d1" strokeWidth="1.5" />
          {/* Armored Low Dome Body */}
          <path
            d="M 45 65 Q 115 35 185 65 Q 155 80 115 80 Q 75 80 45 65 Z"
            fill="url(#ankyGrad)"
            stroke="#d6d3d1"
            strokeWidth="2.5"
          />
          {/* Osteoderm Armor Spikes */}
          {[60, 80, 100, 120, 140, 160].map((ox) => (
            <polygon key={ox} points={`${ox},48 ${ox - 6},56 ${ox + 6},56`} fill="#e7e5e4" stroke="#44403c" strokeWidth="1" />
          ))}
          {/* Armored Head with Horns */}
          <path d="M 46 65 L 25 66 L 22 75 L 45 74 Z" fill="#57534e" stroke="#d6d3d1" strokeWidth="2" />
          <polygon points="40,60 30,52 38,64" fill="#e7e5e4" />
          <circle cx="32" cy="68" r="1.5" fill="#0c0a09" />
          {/* Tail with Heavy Bone Club */}
          <path d="M 180 68 L 220 72" stroke="#44403c" strokeWidth="5" strokeLinecap="round" />
          <ellipse cx="225" cy="72" rx="10" ry="8" fill="#e7e5e4" stroke="#44403c" strokeWidth="2" />
        </svg>
      );

    case 'mammoth':
      return (
        <svg viewBox="0 0 240 160" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="mammGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#92400e" />
              <stop offset="50%" stopColor="#78350f" />
              <stop offset="100%" stopColor="#451a03" />
            </linearGradient>
          </defs>
          {/* Shaggy Pillar Legs */}
          <rect x="75" y="90" width="18" height="58" rx="5" fill="#78350f" stroke="#fde68a" strokeWidth="1.5" />
          <rect x="100" y="90" width="18" height="58" rx="5" fill="#451a03" stroke="#fde68a" strokeWidth="1.5" />
          <rect x="145" y="95" width="18" height="54" rx="5" fill="#78350f" stroke="#fde68a" strokeWidth="1.5" />
          <rect x="170" y="95" width="18" height="54" rx="5" fill="#451a03" stroke="#fde68a" strokeWidth="1.5" />
          {/* High Domed Shaggy Body with Shoulder Hump */}
          <path
            d="M 50 65 Q 75 35 125 45 Q 180 58 190 95 Q 160 108 120 105 Q 65 105 50 65 Z"
            fill="url(#mammGrad)"
            stroke="#fde68a"
            strokeWidth="2.5"
          />
          {/* Shaggy fur fringe bottom */}
          <path d="M 65 105 L 75 115 L 85 105 L 95 115 L 105 105 L 115 115 L 125 105 L 135 115 L 145 105" stroke="#92400e" strokeWidth="3" fill="none" />
          {/* Trunk */}
          <path
            d="M 55 68 Q 30 85 32 110 Q 36 125 45 120"
            stroke="#78350f"
            strokeWidth="10"
            fill="none"
            strokeLinecap="round"
          />
          {/* Huge Spiraling Ivory Tusks */}
          <path
            d="M 48 85 C 20 95 10 120 22 135 C 32 142 42 130 38 122"
            stroke="#fef3c7"
            strokeWidth="5"
            fill="none"
            strokeLinecap="round"
          />
          <path
            d="M 42 80 C 15 90 5 115 16 130 C 26 137 36 125 32 118"
            stroke="#fffbeb"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
          {/* Kind Eye under woolly brow */}
          <circle cx="56" cy="62" r="3" fill="#fef08a" />
          <circle cx="56" cy="62" r="1.5" fill="#1e1b4b" />
        </svg>
      );

    case 'smilodon':
      return (
        <svg viewBox="0 0 240 140" className={className} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="smiloGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ea580c" />
              <stop offset="100%" stopColor="#c2410c" />
            </linearGradient>
          </defs>
          {/* Muscular Legs */}
          <rect x="65" y="75" width="16" height="48" rx="4" fill="#c2410c" stroke="#ffedd5" strokeWidth="1.5" />
          <rect x="85" y="75" width="16" height="48" rx="4" fill="#9a3412" stroke="#ffedd5" strokeWidth="1.5" />
          <rect x="150" y="75" width="16" height="48" rx="4" fill="#c2410c" stroke="#ffedd5" strokeWidth="1.5" />
          <rect x="170" y="75" width="16" height="48" rx="4" fill="#9a3412" stroke="#ffedd5" strokeWidth="1.5" />
          {/* Heavy Bear-like Cat Body with Sloping Back */}
          <path
            d="M 50 60 Q 90 45 155 55 Q 185 62 190 85 Q 155 92 100 92 Q 60 90 50 60 Z"
            fill="url(#smiloGrad)"
            stroke="#ffedd5"
            strokeWidth="2"
          />
          {/* Bobtail */}
          <path d="M 188 78 L 202 85" stroke="#ea580c" strokeWidth="5" strokeLinecap="round" />
          {/* Head & Jaws */}
          <circle cx="50" cy="58" r="18" fill="#ea580c" stroke="#ffedd5" strokeWidth="2" />
          {/* Ear */}
          <polygon points="52,42 60,35 62,45" fill="#ea580c" stroke="#ffedd5" strokeWidth="1.5" />
          {/* Iconic Long Curved Saber Teeth */}
          <path d="M 44 65 Q 40 82 45 92 Q 48 85 49 68 Z" fill="#ffffff" stroke="#c2410c" strokeWidth="1" />
          <path d="M 50 66 Q 47 80 51 90 Q 54 83 55 68 Z" fill="#ffffff" stroke="#c2410c" strokeWidth="1" />
          {/* Amber Alert Eye */}
          <circle cx="45" cy="54" r="2.5" fill="#fbbf24" />
          <circle cx="45" cy="54" r="1.2" fill="#0f172a" />
        </svg>
      );

    case 'megaloceros':
      return (
        <svg viewBox="0 0 240 180" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Majestic 3.6m Palmate Antlers */}
          <path
            d="M 90 60 Q 40 25 20 20 Q 35 45 50 40 Q 60 55 85 65"
            fill="#d97706"
            stroke="#fef3c7"
            strokeWidth="2"
          />
          <path
            d="M 115 60 Q 165 25 185 20 Q 170 45 155 40 Q 145 55 120 65"
            fill="#d97706"
            stroke="#fef3c7"
            strokeWidth="2"
          />
          {/* Antler tines */}
          <polygon points="20,20 12,10 25,18" fill="#fef3c7" />
          <polygon points="35,16 32,5 42,16" fill="#fef3c7" />
          <polygon points="185,20 193,10 180,18" fill="#fef3c7" />
          <polygon points="170,16 173,5 163,16" fill="#fef3c7" />
          {/* Slender Stag Legs */}
          <line x1="90" y1="120" x2="85" y2="170" stroke="#b45309" strokeWidth="3" />
          <line x1="105" y1="120" x2="100" y2="170" stroke="#78350f" strokeWidth="3" />
          <line x1="145" y1="120" x2="150" y2="170" stroke="#b45309" strokeWidth="3" />
          <line x1="160" y1="120" x2="165" y2="170" stroke="#78350f" strokeWidth="3" />
          {/* Torso with Dark Shoulder Hump */}
          <path
            d="M 85 95 Q 110 75 160 88 Q 175 105 165 125 Q 125 130 90 122 Z"
            fill="#b45309"
            stroke="#fef3c7"
            strokeWidth="2"
          />
          <path d="M 100 85 Q 112 70 125 85 Z" fill="#451a03" />
          {/* Head & Neck */}
          <path d="M 90 95 L 100 62 L 110 65 L 108 98 Z" fill="#b45309" stroke="#fef3c7" strokeWidth="1.5" />
          <circle cx="103" cy="62" r="2.5" fill="#0f172a" />
        </svg>
      );

    case 'woolly-rhino':
      return (
        <svg viewBox="0 0 240 140" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Heavy Shaggy Rhino */}
          <rect x="70" y="80" width="18" height="44" rx="4" fill="#713f12" stroke="#fef08a" strokeWidth="1.5" />
          <rect x="95" y="80" width="16" height="44" rx="4" fill="#581c87" stroke="#fef08a" strokeWidth="1.5" />
          <rect x="145" y="80" width="18" height="44" rx="4" fill="#713f12" stroke="#fef08a" strokeWidth="1.5" />
          <rect x="168" y="80" width="16" height="44" rx="4" fill="#581c87" stroke="#fef08a" strokeWidth="1.5" />
          <ellipse cx="125" cy="78" rx="55" ry="32" fill="#713f12" stroke="#fef08a" strokeWidth="2" />
          {/* Head and Massive Flattened Snowplow Horn */}
          <path d="M 65 72 L 40 75 L 30 90 L 65 88 Z" fill="#854d0e" stroke="#fef08a" strokeWidth="1.8" />
          <path d="M 38 74 Q 15 50 18 30 Q 32 45 42 70 Z" fill="#fef08a" stroke="#713f12" strokeWidth="1.5" />
          <polygon points="50,72 44,58 54,68" fill="#fef08a" stroke="#713f12" strokeWidth="1" />
          <circle cx="52" cy="76" r="2" fill="#0f172a" />
        </svg>
      );

    case 'early-humans':
      return (
        <svg viewBox="0 0 160 160" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Prehistoric Storyteller with Ochre and Torch */}
          <circle cx="80" cy="40" r="14" fill="#fed7aa" stroke="#ea580c" strokeWidth="2" />
          {/* Fur Hood & Shaggy Parka */}
          <path d="M 64 35 Q 80 15 96 35 Q 92 48 80 48 Q 68 48 64 35 Z" fill="#78350f" />
          {/* Painted Face Lines */}
          <line x1="72" y1="42" x2="76" y2="44" stroke="#dc2626" strokeWidth="2" />
          <line x1="84" y1="44" x2="88" y2="42" stroke="#dc2626" strokeWidth="2" />
          {/* Fur Tunic Body */}
          <path d="M 60 55 L 100 55 L 110 115 L 50 115 Z" fill="#92400e" stroke="#fed7aa" strokeWidth="2" />
          {/* Legs & Warm Fur Boots */}
          <rect x="62" y="115" width="14" height="32" fill="#78350f" rx="3" />
          <rect x="84" y="115" width="14" height="32" fill="#78350f" rx="3" />
          {/* Flickering Torch */}
          <line x1="105" y1="85" x2="125" y2="45" stroke="#713f12" strokeWidth="4" strokeLinecap="round" />
          <polygon points="125,45 132,32 120,38 127,24 116,34" fill="#f97316" className="animate-pulse" />
          <circle cx="124" cy="35" r="4" fill="#fbbf24" />
        </svg>
      );

    case 'paleo-wolf':
      return (
        <svg viewBox="0 0 180 120" className={className} xmlns="http://www.w3.org/2000/svg">
          {/* Wolf Legs */}
          <line x1="60" y1="75" x2="55" y2="108" stroke="#64748b" strokeWidth="4" strokeLinecap="round" />
          <line x1="78" y1="75" x2="74" y2="108" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
          <line x1="120" y1="75" x2="122" y2="108" stroke="#64748b" strokeWidth="4" strokeLinecap="round" />
          <line x1="135" y1="75" x2="138" y2="108" stroke="#475569" strokeWidth="4" strokeLinecap="round" />
          {/* Bushy Tail */}
          <path d="M 140 70 Q 165 75 170 95 Q 155 85 135 78 Z" fill="#64748b" stroke="#f1f5f9" strokeWidth="1.5" />
          {/* Sturdy Body */}
          <ellipse cx="98" cy="68" rx="36" ry="18" fill="#64748b" stroke="#f1f5f9" strokeWidth="2" />
          {/* Alert Wolf Head */}
          <path d="M 65 62 L 40 55 L 28 62 L 42 72 L 65 70 Z" fill="#94a3b8" stroke="#f1f5f9" strokeWidth="1.8" />
          {/* Pointed Ears */}
          <polygon points="55,54 52,38 62,48" fill="#475569" stroke="#f1f5f9" strokeWidth="1.2" />
          <polygon points="62,54 66,38 72,48" fill="#334155" stroke="#f1f5f9" strokeWidth="1.2" />
          {/* Amber Intelligent Eye */}
          <circle cx="46" cy="58" r="2" fill="#fbbf24" />
        </svg>
      );

    case 'cave-bear':
      return (
        <svg viewBox="0 0 240 140" className={className} xmlns="http://www.w3.org/2000/svg">
          <rect x="75" y="80" width="20" height="48" rx="5" fill="#78350f" stroke="#fde68a" strokeWidth="1.5" />
          <rect x="105" y="80" width="18" height="48" rx="5" fill="#451a03" stroke="#fde68a" strokeWidth="1.5" />
          <rect x="150" y="80" width="20" height="48" rx="5" fill="#78350f" stroke="#fde68a" strokeWidth="1.5" />
          <rect x="175" y="80" width="18" height="48" rx="5" fill="#451a03" stroke="#fde68a" strokeWidth="1.5" />
          {/* Huge 1-Ton Hump Body */}
          <path
            d="M 55 68 Q 95 38 165 52 Q 195 65 195 90 Q 155 98 100 98 Q 65 95 55 68 Z"
            fill="#78350f"
            stroke="#fde68a"
            strokeWidth="2.5"
          />
          {/* Head & Snout */}
          <path d="M 58 68 L 30 72 L 25 84 L 56 86 Z" fill="#92400e" stroke="#fde68a" strokeWidth="2" />
          <circle cx="52" cy="54" r="5" fill="#451a03" stroke="#fde68a" strokeWidth="1.5" />
          <circle cx="42" cy="72" r="2.5" fill="#0f172a" />
        </svg>
      );

    default:
      return (
        <svg viewBox="0 0 100 100" className={className} xmlns="http://www.w3.org/2000/svg">
          <circle cx="50" cy="50" r="40" fill="#f59e0b" opacity="0.8" />
          <text x="50" y="58" fontSize="28" textAnchor="middle" fill="#ffffff">🦖</text>
        </svg>
      );
  }
};
