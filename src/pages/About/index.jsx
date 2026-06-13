import React from 'react';
import { BookOpen, HelpCircle, Table, ArrowRight, BrainCircuit, Activity } from 'lucide-react';

export default function About() {
  const algorithms = [
    {
      name: 'Breadth-First Search (BFS)',
      type: 'Uninformed (Blind) Search',
      time: 'O(b^d)',
      space: 'O(b^d)',
      optimal: 'Yes (for step cost = 1)',
      complete: 'Yes',
      description: 'Explores nodes level-by-level starting from the root state. It uses a FIFO queue.',
      pros: 'Guaranteed to find the shortest path (optimal number of moves).',
      cons: 'Extremely high memory consumption because it stores all generated states in the queue.'
    },
    {
      name: 'Depth-First Search (DFS)',
      type: 'Uninformed (Blind) Search',
      time: 'O(b^m)',
      space: 'O(b * m)',
      optimal: 'No',
      complete: 'No (unless finite space / depth-limited)',
      description: 'Explores as deep as possible along each branch before backtracking. It uses a LIFO stack.',
      pros: 'Very low memory space requirements compared to BFS.',
      cons: 'Highly sub-optimal; can wander off into massive, deep solutions or get stuck in cycles if not capped.'
    },
    {
      name: 'Uniform Cost Search (UCS)',
      type: 'Uninformed (Blind) Search',
      time: 'O(b^(1 + C*/e))',
      space: 'O(b^(1 + C*/e))',
      optimal: 'Yes (always)',
      complete: 'Yes',
      description: 'Expands the node with the lowest cumulative path cost g(n). Equivalent to BFS when all step costs are equal to 1.',
      pros: 'Guaranteed to find the optimal path in any state space with positive step costs.',
      cons: 'Can be very slow; explores in all directions indiscriminately (no goal direction).'
    },
    {
      name: 'Greedy Best-First Search',
      type: 'Informed (Heuristic) Search',
      time: 'O(b^m) (worst), O(b*d) (average)',
      space: 'O(b^m) (worst), O(b*d) (average)',
      optimal: 'No',
      complete: 'No (can get stuck in loops without loop check)',
      description: 'Prioritizes node expansion based solely on the heuristic estimate h(n) of the remaining cost to the goal.',
      pros: 'Often very fast at finding a path to the goal by moving directly toward it.',
      cons: 'Not guaranteed to find the shortest path (highly sub-optimal sometimes).'
    },
    {
      name: 'A* Search',
      type: 'Informed (Heuristic) Search',
      time: 'O(b^d) (worst), O(b*d) (average)',
      space: 'O(b^d)',
      optimal: 'Yes (if heuristic is admissible & consistent)',
      complete: 'Yes',
      description: 'Balances path cost and goal distance by prioritizing nodes with lowest f(n) = g(n) + h(n).',
      pros: 'Both optimal and complete. The gold standard of pathfinding search.',
      cons: 'Stores all generated nodes in memory; can run out of memory for very deep searches.'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 relative">
      {/* Glow */}
      <div className="absolute top-20 right-10 w-[200px] h-[200px] bg-purple-600/10 rounded-full blur-[80px] pointer-events-none"></div>

      {/* Header */}
      <div className="border-b border-white/5 pb-6 mb-8">
        <h1 className="text-3xl font-extrabold text-white tracking-wide flex items-center gap-2">
          <BookOpen className="w-8 h-8 text-purple-400" />
          AI search fundamentals
        </h1>
        <p className="text-slate-400 text-sm mt-1">
          Deep-dive into the mechanics of uninformed/informed search strategies and heuristics on the classic 8-puzzle.
        </p>
      </div>

      <div className="space-y-10">
        
        {/* Section: What is 8 Puzzle */}
        <div className="bg-white/5 border border-white/10 p-6 rounded-2xl shadow-xl backdrop-blur-md">
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2 mb-3.5">
            <HelpCircle className="w-5 h-5 text-purple-400" />
            What is the 8-Puzzle?
          </h2>
          <p className="text-slate-300 text-sm leading-relaxed">
            The 8-puzzle is a classic sliding puzzle that consists of a frame of numbered square tiles in random order with one tile missing. The objective is to rearrange the tiles from a starting configuration to a designated goal configuration (usually: 1, 2, 3, 4, 5, 6, 7, 8, Blank) by sliding tiles into the empty slot.
          </p>
          <div className="mt-4 p-4 bg-brand-dark/45 border border-white/5 rounded-xl text-xs text-slate-400 leading-relaxed">
            <strong className="text-slate-200">Solvability Rule:</strong> An 8-puzzle configuration is solvable if and only if the number of <strong className="text-slate-300">inversions</strong> is even. An inversion is when a higher-numbered tile precedes a lower-numbered tile in the flattened array representation. Odd inversions indicate an unreachable state space half.
          </div>
        </div>

        {/* Section: Heuristics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl shadow-xl backdrop-blur-md">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 mb-3">
              <BrainCircuit className="w-4.5 h-4.5 text-blue-400" />
              Misplaced Tiles Heuristic (h1)
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              A simple heuristic that counts the number of tiles that are not in their target goal positions. It does not measure how far they are, only that they are out of place.
            </p>
            <div className="text-xs text-slate-300 space-y-1.5 border-t border-white/5 pt-3">
              <div className="flex items-center justify-between">
                <span>Admissibility:</span>
                <span className="text-emerald-400 font-semibold">Yes (never overestimates)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Informedness:</span>
                <span className="text-slate-400 font-semibold">Low (weak search guidance)</span>
              </div>
            </div>
          </div>

          <div className="bg-white/5 border border-white/10 p-6 rounded-2xl shadow-xl backdrop-blur-md">
            <h3 className="text-base font-bold text-slate-100 flex items-center gap-2 mb-3">
              <Activity className="w-4.5 h-4.5 text-purple-400" />
              Manhattan Distance Heuristic (h2)
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              Calculates the sum of vertical and horizontal distances of each tile from its target position. This reflects the minimum moves required for each tile in isolation.
            </p>
            <div className="text-xs text-slate-300 space-y-1.5 border-t border-white/5 pt-3">
              <div className="flex items-center justify-between">
                <span>Admissibility:</span>
                <span className="text-emerald-400 font-semibold">Yes (never overestimates)</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Informedness:</span>
                <span className="text-slate-400 font-semibold">High (excellent guidance)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Section: Algorithms Matrix Table */}
        <div className="bg-white/5 border border-white/10 rounded-2xl shadow-xl backdrop-blur-md overflow-hidden">
          <div className="p-4 bg-white/5 border-b border-white/5 flex items-center gap-2">
            <Table className="w-5 h-5 text-purple-400" />
            <h2 className="text-base font-bold text-slate-200 font-sans">Algorithms Complexity Matrix</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="p-4">Algorithm</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Time Complexity</th>
                  <th className="p-4">Space Complexity</th>
                  <th className="p-4">Optimal</th>
                  <th className="p-4">Complete</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-white/5 text-slate-300">
                {algorithms.map((algo) => (
                  <tr key={algo.name} className="hover:bg-white/[0.01]">
                    <td className="p-4 font-bold text-slate-100">{algo.name}</td>
                    <td className="p-4 text-slate-400">{algo.type}</td>
                    <td className="p-4 font-mono text-blue-300">{algo.time}</td>
                    <td className="p-4 font-mono text-purple-300">{algo.space}</td>
                    <td className="p-4 font-semibold">{algo.optimal}</td>
                    <td className="p-4 font-semibold">{algo.complete}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section: Pros/Cons Cards */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-slate-100 px-1">Detailed Analysis</h2>
          <div className="grid grid-cols-1 gap-4">
            {algorithms.map((algo) => (
              <div key={algo.name} className="bg-white/5 border border-white/10 p-5 rounded-2xl shadow-lg backdrop-blur-md">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-white/5 pb-2.5 mb-3 gap-1">
                  <h3 className="text-sm font-bold text-purple-400">{algo.name}</h3>
                  <span className="text-[10px] uppercase font-bold text-slate-500">{algo.type}</span>
                </div>
                <p className="text-xs text-slate-300 mb-3.5 leading-relaxed">{algo.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="bg-emerald-500/5 border border-emerald-500/10 p-3 rounded-xl">
                    <span className="font-bold text-emerald-400 block mb-1">Advantages:</span>
                    <span className="text-slate-400">{algo.pros}</span>
                  </div>
                  <div className="bg-rose-500/5 border border-rose-500/10 p-3 rounded-xl">
                    <span className="font-bold text-rose-400 block mb-1">Disadvantages:</span>
                    <span className="text-slate-400">{algo.cons}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
