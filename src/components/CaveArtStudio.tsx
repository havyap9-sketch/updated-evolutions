import React, { useRef, useState, useEffect } from 'react';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  Paintbrush,
  SprayCan,
  Hand,
  Trash2,
  Download,
  Sparkles,
  Save,
  Check,
} from 'lucide-react';

interface CaveArtStudioProps {
  onSaveDrawing: (dataUrl: string) => void;
}

const PIGMENTS = [
  { id: 'red-ochre', name: 'Red Iron Ochre', color: '#b91c1c' },
  { id: 'yellow-ochre', name: 'Yellow Clay', color: '#d97706' },
  { id: 'charcoal', name: 'Charcoal Black', color: '#1c1917' },
  { id: 'chalk', name: 'Calcite Chalk', color: '#f5f5f4' },
];

export const CaveArtStudio: React.FC<CaveArtStudioProps> = ({ onSaveDrawing }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedPigment, setSelectedPigment] = useState<string>('#b91c1c');
  const [brushSize, setBrushSize] = useState<number>(10);
  const [isDrawing, setIsDrawing] = useState<boolean>(false);
  const [tool, setTool] = useState<'brush' | 'spray' | 'hand' | 'mammoth' | 'horse'>('brush');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Initialize cave canvas with rock texture background
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Fill with cave wall sandstone texture
    ctx.fillStyle = '#44403c';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add rocky stippling texture
    for (let i = 0; i < 2000; i++) {
      const rx = Math.random() * canvas.width;
      const ry = Math.random() * canvas.height;
      const rSize = Math.random() * 2 + 1;
      ctx.fillStyle = Math.random() > 0.5 ? '#292524' : '#57534e';
      ctx.beginPath();
      ctx.arc(rx, ry, rSize, 0, Math.PI * 2);
      ctx.fill();
    }
  }, []);

  const getCanvasCoords = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  };

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCanvasCoords(e);

    if (tool === 'hand') {
      // Stamp hand stencil
      stampHandStencil(ctx, x, y, selectedPigment);
      soundManager.playFossilDig('brush');
      return;
    }

    if (tool === 'mammoth') {
      stampMammothSilhouette(ctx, x, y, selectedPigment);
      soundManager.playCreatureCall('trumpet');
      return;
    }

    if (tool === 'horse') {
      stampHorseSilhouette(ctx, x, y, selectedPigment);
      soundManager.playFossilDig('glass');
      return;
    }

    setIsDrawing(true);
    ctx.beginPath();
    ctx.moveTo(x, y);

    if (tool === 'spray') {
      sprayPaint(ctx, x, y, selectedPigment, brushSize * 2.5);
    }
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = getCanvasCoords(e);

    if (tool === 'brush') {
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.strokeStyle = selectedPigment;
      ctx.lineTo(x, y);
      ctx.stroke();
    } else if (tool === 'spray') {
      sprayPaint(ctx, x, y, selectedPigment, brushSize * 2.5);
    }
  };

  const stopDraw = () => {
    setIsDrawing(false);
  };

  const sprayPaint = (ctx: CanvasRenderingContext2D, x: number, y: number, color: string, radius: number) => {
    ctx.fillStyle = color;
    const density = 25;
    for (let i = 0; i < density; i++) {
      const offsetX = (Math.random() - 0.5) * radius * 2;
      const offsetY = (Math.random() - 0.5) * radius * 2;
      if (offsetX * offsetX + offsetY * offsetY <= radius * radius) {
        ctx.fillRect(x + offsetX, y + offsetY, Math.random() * 2 + 1, Math.random() * 2 + 1);
      }
    }
  };

  const stampHandStencil = (ctx: CanvasRenderingContext2D, x: number, y: number, color: string) => {
    ctx.save();
    ctx.translate(x, y);
    // Draw negative hand stencil spray
    ctx.fillStyle = color;
    for (let i = 0; i < 350; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 30 + Math.random() * 45;
      ctx.fillRect(Math.cos(angle) * dist, Math.sin(angle) * dist, 2, 2);
    }
    // Palm and fingers
    ctx.fillStyle = '#44403c';
    ctx.beginPath();
    ctx.ellipse(0, 5, 20, 24, 0, 0, Math.PI * 2);
    // Thumb & 4 fingers
    [-18, -9, 0, 9, 18].forEach((fx, idx) => {
      ctx.rect(fx - 4, -40 + Math.abs(idx - 2) * 4, 7, 30);
    });
    ctx.fill();
    ctx.restore();
  };

  const stampMammothSilhouette = (ctx: CanvasRenderingContext2D, x: number, y: number, color: string) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = color;
    ctx.beginPath();
    // Simplified cave art mammoth silhouette
    ctx.arc(0, -10, 22, 0, Math.PI * 2);
    ctx.rect(-18, 5, 36, 20);
    // Legs
    ctx.rect(-16, 25, 7, 24);
    ctx.rect(-4, 25, 7, 24);
    ctx.rect(8, 25, 7, 24);
    // Curved tusks
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#fef3c7';
    ctx.beginPath();
    ctx.arc(-22, 0, 16, Math.PI * 0.4, Math.PI * 1.2);
    ctx.stroke();
    ctx.fill();
    ctx.restore();
  };

  const stampHorseSilhouette = (ctx: CanvasRenderingContext2D, x: number, y: number, color: string) => {
    ctx.save();
    ctx.translate(x, y);
    ctx.fillStyle = color;
    ctx.beginPath();
    // Simplified cave art horse
    ctx.ellipse(0, 0, 28, 14, 0, 0, Math.PI * 2);
    ctx.ellipse(-26, -14, 12, 6, -0.6, 0, Math.PI * 2);
    // Legs
    ctx.rect(-18, 10, 4, 24);
    ctx.rect(-8, 10, 4, 24);
    ctx.rect(10, 10, 4, 24);
    ctx.rect(18, 10, 4, 24);
    ctx.fill();
    ctx.restore();
  };

  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#44403c';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    soundManager.playFossilDig('shovel');
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    onSaveDrawing(dataUrl);
    setIsSaved(true);
    soundManager.playSuccessFanfare();
    confetti({
      particleCount: 40,
      spread: 50,
      origin: { y: 0.6 },
    });
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-6 select-none space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-stone-900 border border-stone-800 p-4 sm:p-5 rounded-2xl shadow-xl">
        <div>
          <div className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-0.5">
            Upper Paleolithic Workshop
          </div>
          <h2 className="text-2xl font-black text-white font-['Outfit']">
            Cave Art Studio
          </h2>
          <p className="text-xs text-stone-300 mt-0.5">
            Paint on authentic limestone cave wall using natural mineral ochres and animal stencils!
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleClear}
            className="px-3 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-semibold flex items-center gap-1.5 cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Clear Wall</span>
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-lg hover:scale-105 transition-all"
          >
            {isSaved ? (
              <>
                <Check className="w-4 h-4" />
                <span>Saved to Journal!</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save to Journal</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Toolbox: Pigments & Stencils */}
      <div className="bg-stone-900/90 border border-stone-800 p-4 rounded-2xl shadow-lg flex flex-wrap items-center justify-between gap-4">
        {/* Pigment colors */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider">
            Ochre Pigment:
          </span>
          <div className="flex items-center gap-2">
            {PIGMENTS.map((p) => (
              <button
                key={p.id}
                onClick={() => {
                  setSelectedPigment(p.color);
                  soundManager.playFossilDig('glass');
                }}
                className={`w-7 h-7 rounded-full border-2 transition-transform cursor-pointer ${
                  selectedPigment === p.color
                    ? 'border-white scale-125 shadow-md'
                    : 'border-transparent hover:scale-110'
                }`}
                style={{ backgroundColor: p.color }}
                title={p.name}
              />
            ))}
          </div>
        </div>

        {/* Tools & Stencils */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setTool('brush')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
              tool === 'brush'
                ? 'bg-amber-500 text-stone-950'
                : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            <Paintbrush className="w-3.5 h-3.5" />
            <span>Finger/Crayon</span>
          </button>

          <button
            onClick={() => setTool('spray')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
              tool === 'spray'
                ? 'bg-amber-500 text-stone-950'
                : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            <SprayCan className="w-3.5 h-3.5" />
            <span>Blowpipe Spray</span>
          </button>

          <button
            onClick={() => setTool('hand')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-colors ${
              tool === 'hand'
                ? 'bg-amber-500 text-stone-950'
                : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            <Hand className="w-3.5 h-3.5" />
            <span>Hand Stencil</span>
          </button>

          <button
            onClick={() => setTool('mammoth')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
              tool === 'mammoth'
                ? 'bg-amber-500 text-stone-950'
                : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            🦣 Mammoth
          </button>

          <button
            onClick={() => setTool('horse')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
              tool === 'horse'
                ? 'bg-amber-500 text-stone-950'
                : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
            }`}
          >
            🐎 Cave Horse
          </button>
        </div>
      </div>

      {/* Main Cave Wall Canvas */}
      <div className="relative w-full aspect-[16/10] bg-stone-950 border-4 border-stone-800 rounded-3xl overflow-hidden shadow-2xl flex items-center justify-center">
        <canvas
          ref={canvasRef}
          width={800}
          height={500}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={stopDraw}
          className="w-full h-full cursor-crosshair touch-none"
        />
      </div>

      {/* Fact Footer */}
      <div className="text-center text-xs text-stone-400">
        Ancient humans mixed iron ochre clay with saliva and blew it through bird bones around their hands to sign their artwork!
      </div>
    </div>
  );
};
