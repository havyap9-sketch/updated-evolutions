import React, { useState } from 'react';
import { TIME_RANGER_QUIZ } from '../data/erasData';
import { QuizQuestion } from '../types';
import { soundManager } from '../utils/audio';
import confetti from 'canvas-confetti';
import {
  HelpCircle,
  Sparkles,
  Award,
  CheckCircle2,
  XCircle,
  Lightbulb,
  ArrowRight,
  Flame,
} from 'lucide-react';

interface TimeRangerQuizProps {
  onScorePoints: (points: number) => void;
  reducedMotion: boolean;
}

export const TimeRangerQuiz: React.FC<TimeRangerQuizProps> = ({
  onScorePoints,
  reducedMotion,
}) => {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [showHint, setShowHint] = useState<boolean>(false);
  const [streak, setStreak] = useState<number>(0);
  const [totalScore, setTotalScore] = useState<number>(0);

  const question: QuizQuestion = TIME_RANGER_QUIZ[currentIdx];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = idx === question.correctIndex;
    if (isCorrect) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      const points = 100 + newStreak * 25;
      setTotalScore((prev) => prev + points);
      onScorePoints(points);
      soundManager.playSuccessFanfare();

      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
      });
    } else {
      setStreak(0);
      soundManager.playPipBeep('thinking');
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setIsAnswered(false);
    setShowHint(false);
    setCurrentIdx((prev) => (prev + 1) % TIME_RANGER_QUIZ.length);
    soundManager.playPipBeep('curious');
  };

  return (
    <div className="w-full max-w-3xl mx-auto px-4 py-8 select-none space-y-6">
      {/* Header and Streak HUD */}
      <div className="flex items-center justify-between bg-stone-900 border border-stone-800 p-4 rounded-2xl shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-black text-white font-['Outfit']">
              Time Ranger Mystery Quiz
            </h2>
            <div className="text-xs text-stone-400">
              Question {currentIdx + 1} of {TIME_RANGER_QUIZ.length}
            </div>
          </div>
        </div>

        {/* Score & Streak */}
        <div className="flex items-center gap-4">
          {streak > 1 && (
            <div className="flex items-center gap-1 text-orange-400 text-xs font-bold animate-pulse">
              <Flame className="w-4 h-4 fill-orange-400" />
              <span>{streak}x Streak!</span>
            </div>
          )}
          <div className="text-right">
            <div className="text-xs text-stone-400 font-semibold">Quiz Score</div>
            <div className="text-lg font-black text-amber-400 font-mono">
              {totalScore} PTS
            </div>
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div className="bg-stone-900/90 border border-stone-800 p-6 rounded-3xl shadow-2xl space-y-6">
        {/* Category Pill Tag */}
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest">
            {question.category.replace('-', ' ')}
          </span>
          <button
            onClick={() => setShowHint(!showHint)}
            className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-amber-300 transition-colors cursor-pointer"
          >
            <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
            <span>{showHint ? 'Hide Hint' : 'Need a Clue?'}</span>
          </button>
        </div>

        {/* Question Text */}
        <h3 className="text-lg sm:text-xl font-bold text-white leading-relaxed">
          {question.question}
        </h3>

        {/* Clue Box */}
        {showHint && (
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200 animate-fade-in flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>Pip says: &ldquo;{question.funHint}&rdquo;</span>
          </div>
        )}

        {/* Multiple Choice Options */}
        <div className="space-y-3">
          {question.options.map((opt, idx) => {
            const isPicked = selectedOption === idx;
            const isCorrect = idx === question.correctIndex;

            let btnStyle =
              'bg-stone-850 hover:bg-stone-800 border-stone-800 text-stone-200';

            if (isAnswered) {
              if (isCorrect) {
                btnStyle =
                  'bg-emerald-950/60 border-emerald-500 text-white shadow-[0_0_15px_rgba(16,185,129,0.3)]';
              } else if (isPicked) {
                btnStyle = 'bg-rose-950/60 border-rose-500 text-rose-200';
              } else {
                btnStyle = 'bg-stone-900 border-stone-850 text-stone-500 opacity-60';
              }
            }

            return (
              <button
                key={idx}
                disabled={isAnswered}
                onClick={() => handleSelectOption(idx)}
                className={`w-full text-left p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${btnStyle}`}
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-stone-900/80 border border-stone-700/80 flex items-center justify-center text-xs font-bold font-mono">
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="text-sm font-semibold">{opt}</span>
                </div>

                {isAnswered && (
                  <div>
                    {isCorrect ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    ) : isPicked ? (
                      <XCircle className="w-5 h-5 text-rose-400" />
                    ) : null}
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* Answer Explanation & Next Question Button */}
        {isAnswered && (
          <div className="p-4 rounded-2xl bg-stone-800/80 border border-stone-700 space-y-4 animate-fade-in">
            <div className="flex items-start gap-2.5">
              <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm text-stone-200 leading-relaxed">
                <strong className="text-white block mb-0.5">
                  Scientific Explanation:
                </strong>
                {question.explanation}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={handleNextQuestion}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs sm:text-sm flex items-center gap-2 cursor-pointer shadow-lg hover:scale-105 transition-all"
              >
                <span>Next Mystery</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
