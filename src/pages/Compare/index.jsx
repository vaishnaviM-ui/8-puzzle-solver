import React, { useState, useEffect } from 'react';
import { Play, RotateCcw, Shuffle, BarChart2, Award, Zap } from 'lucide-react';
import PuzzleBoard from '../../components/PuzzleBoard';
import AnimationControls from '../../components/AnimationControls';
import Loader from '../../components/Loader';
import { generateRandomPuzzle } from '../../utils/puzzle';

// Import solvers
import { solveBFS } from '../../algorithms/bfs';
import { solveDFS } from '../../algorithms/dfs';
import { solveUCS } from '../../algorithms/ucs';
import { solveGreedy } from '../../algorithms/greedy';
import { solveAStar } from '../../algorithms/astar';

const GOAL_STATE = [1, 2, 3, 4, 5, 6, 7, 8, 0];

export default function Compare() {
  // Shared Start State
  const [boardState, setBoardState] = useState([1, 2, 3, 4, 5, 6, 7, 0, 8]); // standard state (1 move away)
  const [initialState, setInitialState] = useState([1, 2, 3, 4, 5, 6, 7, 0, 8]);

  // Selected Algorithms
  const [leftAlgo, setLeftAlgo] = useState('bfs');
  const [rightAlgo, setRightAlgo] = useState('astar_manhattan');

  // Solver States
  const [isLoading, setIsLoading] = useState(false);
  const [hasRun, setHasRun] = useState(false);

  // Results & Path Data
  const [leftResult, setLeftResult] = useState(null);
  const [rightResult, setRightResult] = useState(null);

  // Playback States
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(400);

  const maxSteps = hasRun && leftResult?.success && rightResult?.success
    ? Math.max(leftResult.path.length - 1, rightResult.path.length - 1)
    : 0;

  // Sync double playback ticker
  useEffect(() => {
    let intervalId;
    if (isPlaying && maxSteps > 0 && currentIndex < maxSteps) {
      intervalId = setInterval(() => {
        setCurrentIndex((prev) => prev + 1);
      }, playbackSpeed);
    } else if (currentIndex === maxSteps) {
      setIsPlaying(false);
    }
    return () => clearInterval(intervalId);
  }, [isPlaying, currentIndex, maxSteps, playbackSpeed]);

  const handleShuffle = () => {
    const freshState = generateRandomPuzzle();
    setBoardState(freshState);
    setInitialState(freshState);
    resetCompare();
  };

  const handleReset = () => {
    setBoardState(initialState);
    resetCompare();
  };

  const resetCompare = () => {
    setLeftResult(null);
    setRightResult(null);
    setHasRun(false);
    setCurrentIndex(0);
    setIsPlaying(false);
  };

  // Run solver on both sides
  const runComparison = () => {
    setIsLoading(true);
    resetCompare();

    setTimeout(() => {
      const runSolver = (algo, start) => {
        switch (algo) {
          case 'bfs':
            return { ...solveBFS(start), algoName: 'BFS' };
          case 'dfs':
            return { ...solveDFS(start), algoName: 'DFS' };
          case 'ucs':
            return { ...solveUCS(start), algoName: 'UCS' };
          case 'greedy':
            return { ...solveGreedy(start, 'manhattan'), algoName: 'Greedy' };
          case 'astar_manhattan':
            return { ...solveAStar(start, 'manhattan'), algoName: 'A* (Manhattan)' };
          case 'astar_misplaced':
            return { ...solveAStar(start, 'misplaced'), algoName: 'A* (Misplaced)' };
          default:
            return { ...solveBFS(start), algoName: 'BFS' };
        }
      };

      const left = runSolver(leftAlgo, boardState);
      const right = runSolver(rightAlgo, boardState);

      setLeftResult(left);
      setRightResult(right);
      setHasRun(true);
      setIsLoading(false);

      if (left.success && right.success) {
        setIsPlaying(true);
      }
    }, 100);
  };

  // Get current board configurations for display based on playback scrubber
  const getLeftBoardState = () => {
    if (!leftResult?.success) return boardState;
    const idx = Math.min(currentIndex, leftResult.path.length - 1);
    return leftResult.path[idx];
  };

  const getRightBoardState = () => {
    if (!rightResult?.success) return boardState;
    const idx = Math.min(currentIndex, rightResult.path.length - 1);
    return rightResult.path[idx];
  };

  const getWinnerInfo = () => {
    if (!leftResult || !rightResult) return null;
    if (!leftResult.success) return { side: 'Right', name: rightResult.algoName, reason: 'Left algorithm failed or timed out.' };
    if (!rightResult.success) return { side: 'Left', name: leftResult.algoName, reason: 'Right algorithm failed or timed out.' };

    const leftMoves = leftResult.moves.length;
    const rightMoves = rightResult.moves.length;

    if (leftMoves < rightMoves) {
      return {
        side: 'Left',
        name: leftResult.algoName,
        reason: `Found a shorter path (${leftMoves} moves vs ${rightMoves} moves).`
      };
    }
    if (rightMoves < leftMoves) {
      return {
        side: 'Right',
        name: rightResult.algoName,
        reason: `Found a shorter path (${rightMoves} moves vs ${leftMoves} moves).`
      };
    }

    // Tie break on expanded nodes
    if (leftResult.exploredCount < rightResult.exploredCount) {
      return {
        side: 'Left',
        name: leftResult.algoName,
        reason: `Both found optimal paths (${leftMoves} moves), but Left expanded ${((rightResult.exploredCount - leftResult.exploredCount) / rightResult.exploredCount * 100).toFixed(0)}% fewer nodes.`
      };
    }
    if (rightResult.exploredCount < leftResult.exploredCount) {
      return {
        side: 'Right',
        name: rightResult.algoName,
        reason: `Both found optimal paths (${rightMoves} moves), but Right expanded ${((leftResult.exploredCount - rightResult.exploredCount) / leftResult.exploredCount * 100).toFixed(0)}% fewer nodes.`
      };
    }

    return {
      side: 'Tie',
      reason: `Both algorithms performed identically (moves and expansions).`
    };
  };

  const winner = getWinnerInfo();

  const algos = [
    { id: 'bfs', name: 'BFS' },
    { id: 'dfs', name: 'DFS' },
    { id: 'ucs', name: 'UCS' },
    { id: 'greedy', name: 'Greedy' },
    { id: 'astar_manhattan', name: 'A* (Manhattan)' },
    { id: 'astar_misplaced', name: 'A* (Misplaced)' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative">
      {isLoading && <Loader message="Running both algorithms side-by-side..." />}

      {/* Header */}
      <div className="border-b border-white/5 pb-6 mb-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-wide flex items-center gap-2">
            <BarChart2 className="w-8 h-8 text-purple-400" />
            Algorithm Comparison Mode
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Solve the same board configuration simultaneously to evaluate efficiency, completeness, and path cost.
          </p>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleShuffle}
            disabled={isPlaying || isLoading}
            className="flex items-center space-x-1 px-4 py-2 rounded-xl text-sm font-semibold glass-button disabled:opacity-50"
          >
            <Shuffle className="w-4 h-4 text-purple-400" />
            <span>Shuffle Start State</span>
          </button>
          <button
            onClick={handleReset}
            disabled={isPlaying || isLoading}
            className="flex items-center space-x-1 px-4 py-2 rounded-xl text-sm font-semibold glass-button disabled:opacity-50"
          >
            <RotateCcw className="w-4 h-4 text-blue-400" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Selectors and Execute Button */}
      <div className="bg-white/5 border border-white/10 p-5 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-6 mb-8 shadow-xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
          {/* Left Selection */}
          <div className="flex flex-col space-y-1.5 w-full sm:w-56">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Left Algorithm</label>
            <select
              value={leftAlgo}
              onChange={(e) => { setLeftAlgo(e.target.value); resetCompare(); }}
              className="bg-brand-dark/80 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:border-purple-500/50 outline-none"
            >
              {algos.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>

          <span className="text-slate-600 font-bold text-xs uppercase shrink-0">VS</span>

          {/* Right Selection */}
          <div className="flex flex-col space-y-1.5 w-full sm:w-56">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Right Algorithm</label>
            <select
              value={rightAlgo}
              onChange={(e) => { setRightAlgo(e.target.value); resetCompare(); }}
              className="bg-brand-dark/80 border border-white/10 rounded-xl px-3.5 py-2 text-sm text-slate-200 focus:border-purple-500/50 outline-none"
            >
              {algos.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
        </div>

        <button
          onClick={runComparison}
          className="w-full sm:w-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:brightness-110 text-white font-bold py-3.5 px-8 rounded-xl text-sm shadow-lg shadow-purple-500/20 active:scale-98 transition shrink-0"
        >
          Compare AI Solvers
        </button>
      </div>

      {/* Comparative Winner Panel */}
      {hasRun && winner && (
        <div className="mb-8 p-5 rounded-2xl bg-gradient-to-r from-purple-950/20 via-indigo-950/20 to-blue-950/20 border border-purple-500/20 shadow-xl flex flex-col sm:flex-row items-center gap-4 animate-fade-in justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="p-3 bg-purple-500/10 border border-purple-500/20 text-purple-400 rounded-xl">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                {winner.side === 'Tie' ? 'It is a Tie!' : `${winner.name} Wins!`}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5 leading-relaxed">{winner.reason}</p>
            </div>
          </div>
          {winner.side !== 'Tie' && (
            <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-purple-500/15 text-purple-300 border border-purple-500/20 self-start sm:self-center">
              Optimized Solver
            </span>
          )}
        </div>
      )}

      {/* Interactive Playback Scrubber for Dual Boards */}
      {hasRun && leftResult?.success && rightResult?.success && (
        <div className="mb-8">
          <AnimationControls
            currentStep={currentIndex}
            totalSteps={maxSteps}
            isPlaying={isPlaying}
            onPlayToggle={() => setIsPlaying(!isPlaying)}
            onStepNext={() => currentIndex < maxSteps && setCurrentIndex(currentIndex + 1)}
            onStepPrev={() => currentIndex > 0 && setCurrentIndex(currentIndex - 1)}
            onRestart={() => setCurrentIndex(0)}
            speed={playbackSpeed}
            onSpeedChange={setPlaybackSpeed}
            onScrub={setCurrentIndex}
          />
        </div>
      )}

      {/* The Two Boards Side-by-Side */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Left Board Card */}
        <div className="flex flex-col items-center bg-white/5 border border-white/10 p-6 rounded-3xl shadow-xl backdrop-blur-md">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
            Left: {leftResult ? leftResult.algoName : algos.find(a => a.id === leftAlgo).name}
          </h3>
          <PuzzleBoard
            state={getLeftBoardState()}
            goalState={GOAL_STATE}
            disabled={true}
            size="large"
          />
          {leftResult && (
            <div className="mt-4 text-xs font-semibold px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20">
              Step {Math.min(currentIndex, leftResult.success ? leftResult.path.length - 1 : 0)} / {leftResult.success ? leftResult.path.length - 1 : 0}
            </div>
          )}
        </div>

        {/* Right Board Card */}
        <div className="flex flex-col items-center bg-white/5 border border-white/10 p-6 rounded-3xl shadow-xl backdrop-blur-md">
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">
            Right: {rightResult ? rightResult.algoName : algos.find(a => a.id === rightAlgo).name}
          </h3>
          <PuzzleBoard
            state={getRightBoardState()}
            goalState={GOAL_STATE}
            disabled={true}
            size="large"
          />
          {rightResult && (
            <div className="mt-4 text-xs font-semibold px-2 py-0.5 rounded bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Step {Math.min(currentIndex, rightResult.success ? rightResult.path.length - 1 : 0)} / {rightResult.success ? rightResult.path.length - 1 : 0}
            </div>
          )}
        </div>
      </div>

      {/* Comparison Metrics Table */}
      {hasRun && (
        <div className="bg-white/5 border border-white/10 rounded-2xl shadow-xl backdrop-blur-md overflow-hidden">
          <div className="p-4 bg-white/5 border-b border-white/5">
            <h3 className="text-base font-bold text-slate-200">Execution Metrics Matrix</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-white/5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  <th className="p-4">Metric</th>
                  <th className="p-4">Left Side ({leftResult?.algoName})</th>
                  <th className="p-4">Right Side ({rightResult?.algoName})</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-white/5 text-slate-300">
                {/* Search Success */}
                <tr>
                  <td className="p-4 font-semibold text-slate-400">Search Outcome</td>
                  <td className={`p-4 font-bold ${leftResult?.success ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {leftResult?.success ? 'Success' : 'Failed / Limit Reached'}
                  </td>
                  <td className={`p-4 font-bold ${rightResult?.success ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {rightResult?.success ? 'Success' : 'Failed / Limit Reached'}
                  </td>
                </tr>

                {/* Path Cost (Moves) */}
                <tr>
                  <td className="p-4 font-semibold text-slate-400">Solution Length (Moves)</td>
                  <td className="p-4 font-bold">{leftResult?.success ? leftResult.moves.length : 'N/A'}</td>
                  <td className="p-4 font-bold">{rightResult?.success ? rightResult.moves.length : 'N/A'}</td>
                </tr>

                {/* Nodes Expanded */}
                <tr>
                  <td className="p-4 font-semibold text-slate-400">Nodes Expanded</td>
                  <td className="p-4">{leftResult?.exploredCount.toLocaleString()}</td>
                  <td className="p-4">{rightResult?.exploredCount.toLocaleString()}</td>
                </tr>

                {/* Nodes Generated */}
                <tr>
                  <td className="p-4 font-semibold text-slate-400">Nodes Generated</td>
                  <td className="p-4">{leftResult?.generatedCount.toLocaleString()}</td>
                  <td className="p-4">{rightResult?.generatedCount.toLocaleString()}</td>
                </tr>

                {/* Search Time */}
                <tr>
                  <td className="p-4 font-semibold text-slate-400">Search Time</td>
                  <td className="p-4">{leftResult?.searchTime.toFixed(2)} ms</td>
                  <td className="p-4">{rightResult?.searchTime.toFixed(2)} ms</td>
                </tr>

                {/* Peak Frontier Size */}
                <tr>
                  <td className="p-4 font-semibold text-slate-400">Max Frontier Queue Size</td>
                  <td className="p-4">{leftResult?.maxFrontierSize.toLocaleString()}</td>
                  <td className="p-4">{rightResult?.maxFrontierSize.toLocaleString()}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
