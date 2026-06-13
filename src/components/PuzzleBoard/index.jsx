import React from 'react';
import classNames from 'classnames';

export default function PuzzleBoard({ 
  state, 
  goalState = [1, 2, 3, 4, 5, 6, 7, 8, 0], 
  onTileClick = null, 
  disabled = false,
  size = 'large' // 'large' or 'small'
}) {
  // Check if a tile is adjacent to the blank space (0)
  const isMovable = (tileIdx) => {
    if (disabled || !onTileClick) return false;
    const blankIdx = state.indexOf(0);
    const r1 = Math.floor(tileIdx / 3);
    const c1 = tileIdx % 3;
    const r2 = Math.floor(blankIdx / 3);
    const c2 = blankIdx % 3;
    return Math.abs(r1 - r2) + Math.abs(c1 - c2) === 1;
  };

  const handleTileClick = (val, idx) => {
    if (isMovable(idx) && onTileClick) {
      onTileClick(val);
    }
  };

  // Dimensions based on size
  const boardClass = classNames(
    "relative grid grid-cols-3 bg-brand-dark/40 border border-white/10 rounded-2xl p-2.5 shadow-2xl backdrop-blur-sm select-none aspect-square",
    size === 'large' ? 'w-[280px] h-[280px] sm:w-[360px] sm:h-[360px]' : 'w-[140px] h-[140px] sm:w-[180px] sm:h-[180px]'
  );

  return (
    <div className={boardClass}>
      {/* Background cells (for blank slots or alignment guides) */}
      {Array(9).fill(0).map((_, idx) => {
        const r = Math.floor(idx / 3);
        const c = idx % 3;
        const left = `${c * 33.333}%`;
        const top = `${r * 33.333}%`;

        return (
          <div
            key={`bg-${idx}`}
            className="absolute p-1 sm:p-1.5 w-[33.333%] h-[33.333%]"
            style={{ left, top }}
          >
            <div className="w-full h-full rounded-xl border border-white/5 bg-white/[0.01]" />
          </div>
        );
      })}

      {/* Actual tiles positioned absolutely for smooth sliding transitions */}
      {state.map((val, idx) => {
        if (val === 0) return null; // Render nothing for blank space

        const currentR = Math.floor(idx / 3);
        const currentC = idx % 3;
        const isCorrect = val === goalState[idx];
        const movable = isMovable(idx);

        const left = `${currentC * 33.333}%`;
        const top = `${currentR * 33.333}%`;

        return (
          <div
            key={val}
            className="absolute p-1 sm:p-1.5 w-[33.333%] h-[33.333%] z-10 transition-all duration-300 ease-out"
            style={{ left, top }}
          >
            <button
              onClick={() => handleTileClick(val, idx)}
              disabled={disabled || !movable}
              className={classNames(
                "w-full h-full rounded-xl flex flex-col items-center justify-center font-bold shadow-lg transition-all duration-200",
                isCorrect 
                  ? "bg-gradient-to-br from-emerald-600/90 to-teal-700/90 text-white shadow-emerald-950/20 border border-emerald-500/20"
                  : "bg-gradient-to-br from-indigo-600/90 to-purple-600/90 text-slate-100 shadow-purple-950/20 border border-purple-500/15",
                movable && !disabled
                  ? "cursor-pointer hover:scale-102 hover:brightness-110 active:scale-98 hover:shadow-purple-500/20"
                  : "cursor-default"
              )}
            >
              <span className={classNames(
                size === 'large' ? 'text-2xl sm:text-4xl' : 'text-sm sm:text-lg'
              )}>
                {val}
              </span>
              
              {/* Optional tiny indicator of target placement */}
              {isCorrect && size === 'large' && (
                <span className="absolute bottom-1.5 w-1.5 h-1.5 bg-emerald-300 rounded-full animate-pulse" />
              )}
            </button>
          </div>
        );
      })}
    </div>
  );
}
