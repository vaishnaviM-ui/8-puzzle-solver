import React from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, RotateCcw, Zap } from 'lucide-react';
import classNames from 'classnames';

export default function AnimationControls({
  currentStep,
  totalSteps,
  isPlaying,
  onPlayToggle,
  onStepNext,
  onStepPrev,
  onRestart,
  speed,
  onSpeedChange,
  onScrub
}) {
  const isAtStart = currentStep === 0;
  const isAtEnd = currentStep === totalSteps;

  const speeds = [
    { label: 'Slow', value: 800 },
    { label: 'Medium', value: 400 },
    { label: 'Fast', value: 150 },
  ];

  return (
    <div className="w-full flex flex-col space-y-4 bg-white/5 border border-white/10 p-5 rounded-2xl shadow-xl backdrop-blur-md">
      {/* Step Info and Slider Scrubber */}
      <div className="flex flex-col space-y-2">
        <div className="flex justify-between items-center text-sm">
          <span className="font-semibold text-slate-300">Solution Playback</span>
          <span className="text-purple-400 font-bold bg-purple-500/10 px-2 py-0.5 rounded-md text-xs border border-purple-500/25">
            Step {currentStep} / {totalSteps}
          </span>
        </div>
        
        {/* Scrubber slider */}
        <input
          type="range"
          min="0"
          max={totalSteps}
          value={currentStep}
          onChange={(e) => onScrub(Number(e.target.value))}
          className="w-full h-1.5 bg-brand-dark rounded-lg appearance-none cursor-pointer accent-purple-500"
        />
      </div>

      {/* Button Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
        <div className="flex items-center space-x-2">
          {/* Restart Button */}
          <button
            onClick={onRestart}
            className="p-2.5 rounded-xl text-slate-400 hover:text-white glass-button"
            title="Restart to beginning"
          >
            <RotateCcw className="w-4.5 h-4.5" />
          </button>

          {/* Previous Step Button */}
          <button
            onClick={onStepPrev}
            disabled={isAtStart}
            className="p-2.5 rounded-xl text-slate-400 hover:text-white glass-button disabled:opacity-30 disabled:pointer-events-none"
            title="Previous Move"
          >
            <ChevronLeft className="w-4.5 h-4.5" />
          </button>

          {/* Play / Pause Button */}
          <button
            onClick={onPlayToggle}
            className={classNames(
              "p-3 rounded-xl shadow-lg transition duration-200 active:scale-95",
              isPlaying
                ? "bg-amber-600 hover:bg-amber-500 text-white shadow-amber-950/20"
                : "bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 text-white shadow-purple-950/20"
            )}
            title={isPlaying ? "Pause" : "Play Solution"}
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-white" />
            ) : (
              <Play className="w-5 h-5 fill-white ml-0.5" />
            )}
          </button>

          {/* Next Step Button */}
          <button
            onClick={onStepNext}
            disabled={isAtEnd}
            className="p-2.5 rounded-xl text-slate-400 hover:text-white glass-button disabled:opacity-30 disabled:pointer-events-none"
            title="Next Move"
          >
            <ChevronRight className="w-4.5 h-4.5" />
          </button>
        </div>

        {/* Speed Selector */}
        <div className="flex items-center space-x-1 bg-brand-dark/45 border border-white/5 p-1 rounded-xl">
          <Zap className="w-3.5 h-3.5 text-yellow-400 ml-1.5" />
          {speeds.map((s) => (
            <button
              key={s.label}
              onClick={() => onSpeedChange(s.value)}
              className={classNames(
                "px-2.5 py-1 text-xs font-semibold rounded-lg transition-all",
                speed === s.value
                  ? "bg-purple-600 text-white shadow-md"
                  : "text-slate-400 hover:text-slate-200 hover:bg-white/5"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
