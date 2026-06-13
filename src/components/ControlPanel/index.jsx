import React, { useState } from 'react';
import { Shuffle, RefreshCw, Play, Edit, Check, AlertCircle } from 'lucide-react';
import { validateCustomPuzzle } from '../../utils/puzzle';

export default function ControlPanel({ 
  onShuffle, 
  onReset, 
  onSolve, 
  onCustomState, 
  isSolving, 
  hasSolution,
  activeAlgorithm,
  onAlgorithmChange,
  activeHeuristic,
  onHeuristicChange
}) {
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customInputValue, setCustomInputValue] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    // Parse input: split by commas or spaces and convert to numbers
    const parsed = customInputValue
      .replace(/[,;]/g, ' ')
      .trim()
      .split(/\s+/)
      .map(Number);

    const validation = validateCustomPuzzle(parsed);
    if (!validation.valid) {
      setErrorMsg(validation.error);
    } else {
      setErrorMsg('');
      onCustomState(parsed);
      setShowCustomInput(false);
    }
  };

  const algos = [
    { id: 'bfs', name: 'Breadth-First Search (BFS)' },
    { id: 'dfs', name: 'Depth-First Search (DFS)' },
    { id: 'ucs', name: 'Uniform Cost Search (UCS)' },
    { id: 'greedy', name: 'Greedy Best-First Search' },
    { id: 'astar_manhattan', name: 'A* (Manhattan Distance)' },
    { id: 'astar_misplaced', name: 'A* (Misplaced Tiles)' },
  ];

  return (
    <div className="w-full flex flex-col space-y-5 bg-white/5 border border-white/10 p-5 rounded-2xl shadow-xl backdrop-blur-md">
      {/* Top Title */}
      <div className="flex items-center justify-between border-b border-white/5 pb-3">
        <h3 className="text-base font-semibold text-slate-100">Solver Controls</h3>
        <span className="text-xs px-2.5 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 font-medium">
          Frontend Solve
        </span>
      </div>

      {/* Select Algorithm Dropdown */}
      <div className="flex flex-col space-y-2">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Search Strategy</label>
        <select
          value={activeAlgorithm}
          onChange={(e) => onAlgorithmChange(e.target.value)}
          disabled={isSolving}
          className="w-full bg-brand-dark/65 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-slate-200 outline-none focus:border-purple-500/50 transition duration-150 disabled:opacity-50"
        >
          {algos.map((algo) => (
            <option key={algo.id} value={algo.id} className="bg-brand-dark">
              {algo.name}
            </option>
          ))}
        </select>
      </div>

      {/* Buttons Grid */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={onShuffle}
          disabled={isSolving}
          className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-sm font-semibold text-slate-200 glass-button disabled:opacity-50"
        >
          <Shuffle className="w-4 h-4 text-purple-400" />
          <span>Shuffle</span>
        </button>

        <button
          onClick={onReset}
          disabled={isSolving}
          className="flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-sm font-semibold text-slate-200 glass-button disabled:opacity-50"
        >
          <RefreshCw className="w-4 h-4 text-blue-400" />
          <span>Reset</span>
        </button>
      </div>

      {/* Custom State Toggle */}
      <div>
        <button
          onClick={() => {
            if (!isSolving) {
              setShowCustomInput(!showCustomInput);
              setErrorMsg('');
            }
          }}
          disabled={isSolving}
          className="w-full flex items-center justify-center space-x-2 py-3 px-4 rounded-xl text-sm font-semibold text-slate-200 glass-button disabled:opacity-50"
        >
          <Edit className="w-4 h-4 text-yellow-400" />
          <span>Custom Start State</span>
        </button>

        {showCustomInput && (
          <form onSubmit={handleCustomSubmit} className="mt-3.5 p-4 bg-brand-dark/40 border border-white/5 rounded-xl space-y-3 animate-slide-in">
            <p className="text-xs text-slate-400">
              Enter numbers 0 to 8 separated by spaces or commas. 0 is the blank tile.
            </p>
            <input
              type="text"
              placeholder="e.g. 1 3 5 4 2 6 7 0 8"
              value={customInputValue}
              onChange={(e) => setCustomInputValue(e.target.value)}
              className="w-full bg-brand-dark/80 border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-purple-500/50"
            />
            {errorMsg && (
              <div className="flex items-center space-x-1.5 text-xs text-rose-400 bg-rose-500/10 p-2 rounded-lg border border-rose-500/15">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}
            <button
              type="submit"
              className="w-full flex items-center justify-center space-x-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold py-2 rounded-lg text-xs shadow-md transition"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply State</span>
            </button>
          </form>
        )}
      </div>

      {/* Solve Button */}
      <button
        onClick={onSolve}
        disabled={isSolving}
        className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:brightness-110 text-white font-bold py-3.5 rounded-xl text-sm shadow-lg shadow-purple-500/20 active:scale-98 transition disabled:opacity-50"
      >
        <Play className="w-4 h-4 fill-white" />
        <span>Find AI Solution</span>
      </button>
    </div>
  );
}
