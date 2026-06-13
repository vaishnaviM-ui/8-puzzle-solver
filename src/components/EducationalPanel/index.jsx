import React from 'react';
import { HelpCircle, ChevronRight, CornerDownRight } from 'lucide-react';
import { manhattanDistance, misplacedTiles } from '../../algorithms/heuristics';
import { getNeighbors } from '../../utils/puzzle';

export default function EducationalPanel({ state, path, currentIndex, algorithm }) {
  if (!state) return null;

  const parentState = currentIndex > 0 ? path[currentIndex - 1] : null;
  const isGoal = state.every((val, idx) => val === (idx === 8 ? 0 : idx + 1));

  // Compute metrics
  const gCost = currentIndex; // path depth
  const hManhattan = manhattanDistance(state);
  const hMisplaced = misplacedTiles(state);

  let hCost = 0;
  let fCost = 0;
  let formulaLabel = '';
  let evaluationFormula = '';

  const algoId = algorithm.toLowerCase();

  if (algoId.startsWith('astar')) {
    hCost = algoId.includes('manhattan') ? hManhattan : hMisplaced;
    fCost = gCost + hCost;
    formulaLabel = 'f(n) = g(n) + h(n)';
    evaluationFormula = `${fCost} = ${gCost} + ${hCost}`;
  } else if (algoId === 'greedy') {
    hCost = hManhattan; // Defaults to manhattan for display
    fCost = hCost;
    formulaLabel = 'f(n) = h(n)';
    evaluationFormula = `${fCost} = ${hCost}`;
  } else if (algoId === 'ucs') {
    fCost = gCost;
    formulaLabel = 'f(n) = g(n)';
    evaluationFormula = `${fCost} = ${gCost}`;
  } else {
    // BFS or DFS
    formulaLabel = 'Depth Level';
    evaluationFormula = `${gCost}`;
  }

  // AI Decision Rationale
  let selectionReason = '';
  if (isGoal) {
    selectionReason = 'Goal state reached! The search has finished successfully.';
  } else if (algoId === 'bfs') {
    selectionReason = 'BFS chose this node because it is the shallowest unexplored node in the frontier queue (FIFO - First In, First Out). This ensures shortest path searching.';
  } else if (algoId === 'dfs') {
    selectionReason = `DFS chose this node because it is the deepest node in the frontier stack (LIFO - Last In, First Out). DFS explores down a single branch up to a depth limit before backtracking.`;
  } else if (algoId === 'ucs') {
    selectionReason = `UCS chose this node because it has the lowest accumulated path cost g(n) = ${gCost} in the frontier. This guarantees finding the lowest-cost path.`;
  } else if (algoId === 'greedy') {
    selectionReason = `Greedy Best-First Search chose this node because it has the lowest estimated heuristic distance to goal h(n) = ${hCost}. It values immediate progress over history.`;
  } else if (algoId.startsWith('astar')) {
    selectionReason = `A* chose this node because it minimizes total estimated cost f(n) = g(n) + h(n) = ${fCost}. It is mathematically proven to find the optimal solution path using an admissible heuristic.`;
  }

  // Compute children generated
  const children = getNeighbors(state);

  const MiniBoard = ({ boardState }) => {
    return (
      <div className="grid grid-cols-3 gap-0.5 bg-brand-dark/80 p-1.5 rounded-xl border border-white/5 w-18 h-18 shrink-0">
        {boardState.map((v, i) => (
          <div
            key={i}
            className={`flex items-center justify-center text-xs font-bold rounded-md aspect-square ${
              v === 0
                ? 'border border-dashed border-slate-700 bg-transparent'
                : v === (i === 8 ? 0 : i + 1)
                ? 'bg-emerald-600 text-white'
                : 'bg-purple-600 text-white'
            }`}
          >
            {v === 0 ? '' : v}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="w-full flex flex-col space-y-4 bg-white/5 border border-white/10 p-5 rounded-2xl shadow-xl backdrop-blur-md">
      {/* Title */}
      <div className="flex items-center space-x-2 border-b border-white/5 pb-3">
        <HelpCircle className="w-5 h-5 text-purple-400" />
        <h3 className="text-base font-semibold text-slate-100">AI Educational Breakdowns</h3>
      </div>

      {/* Boards State Comparison */}
      <div className="flex justify-between items-center bg-brand-dark/30 p-3 rounded-xl gap-4">
        <div className="flex flex-col items-center space-y-1">
          <span className="text-[10px] font-bold text-slate-500 uppercase">Parent State</span>
          {parentState ? <MiniBoard boardState={parentState} /> : <div className="w-18 h-18 rounded-xl border border-dashed border-white/5 bg-white/[0.01] flex items-center justify-center text-[10px] text-slate-600">Start</div>}
        </div>
        <ChevronRight className="w-6 h-6 text-slate-600 shrink-0" />
        <div className="flex flex-col items-center space-y-1">
          <span className="text-[10px] font-bold text-purple-400 uppercase">Current State</span>
          <MiniBoard boardState={state} />
        </div>
      </div>

      {/* Formulas and Math */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-brand-dark/40 border border-white/5 p-3 rounded-xl">
          <div className="text-[10px] font-semibold text-slate-400 uppercase">Path Cost g(n)</div>
          <div className="text-lg font-bold text-slate-100 mt-0.5">{gCost} <span className="text-xs text-slate-500 font-normal">moves</span></div>
        </div>
        <div className="bg-brand-dark/40 border border-white/5 p-3 rounded-xl">
          <div className="text-[10px] font-semibold text-slate-400 uppercase">Heuristic h(n)</div>
          <div className="text-xs text-slate-400 flex flex-col mt-0.5">
            <span>Manhattan: {hManhattan}</span>
            <span>Misplaced: {hMisplaced}</span>
          </div>
        </div>
        <div className="col-span-2 bg-gradient-to-r from-purple-900/10 to-indigo-900/10 border border-purple-500/10 p-3.5 rounded-xl">
          <div className="text-[10px] font-semibold text-purple-300 uppercase tracking-wide">{formulaLabel}</div>
          <div className="text-xl font-black text-purple-200 mt-1 tracking-wider">{evaluationFormula}</div>
        </div>
      </div>

      {/* Selection Reason */}
      <div className="bg-brand-dark/45 border border-white/5 p-3.5 rounded-xl">
        <div className="text-[10px] font-semibold text-slate-400 uppercase">Decision Rationale</div>
        <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{selectionReason}</p>
      </div>

      {/* Next Possible Actions (Children generated) */}
      <div>
        <div className="text-[10px] font-semibold text-slate-400 uppercase mb-2">Generated Branching Factor ({children.length} children)</div>
        <div className="flex flex-col space-y-1.5 max-h-32 overflow-y-auto pr-1">
          {children.map((child, i) => {
            const isCorrectMove = child.state.every((val, idx) => val === (idx === 8 ? 0 : idx + 1));
            return (
              <div 
                key={i} 
                className={`flex items-center text-xs p-2 rounded-lg border ${
                  isCorrectMove 
                    ? 'bg-emerald-500/5 border-emerald-500/15 text-emerald-300' 
                    : 'bg-white/5 border-white/5 text-slate-400'
                }`}
              >
                <CornerDownRight className="w-3.5 h-3.5 mr-2 shrink-0 text-slate-500" />
                <span>Shift tile <strong className="text-slate-200">{child.move}</strong> {child.direction}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
