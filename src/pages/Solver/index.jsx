import React, { useState, useEffect, useRef } from 'react';
import { Play, RotateCcw, HelpCircle, CheckCircle, Clock, BarChart } from 'lucide-react';
import PuzzleBoard from '../../components/PuzzleBoard';
import ControlPanel from '../../components/ControlPanel';
import AnimationControls from '../../components/AnimationControls';
import StatisticsPanel from '../../components/StatisticsPanel';
import EducationalPanel from '../../components/EducationalPanel';
import Loader from '../../components/Loader';
import { generateRandomPuzzle, getNeighbors } from '../../utils/puzzle';

// Import solvers
import { solveBFS } from '../../algorithms/bfs';
import { solveDFS } from '../../algorithms/dfs';
import { solveUCS } from '../../algorithms/ucs';
import { solveGreedy } from '../../algorithms/greedy';
import { solveAStar } from '../../algorithms/astar';

const GOAL_STATE = [1, 2, 3, 4, 5, 6, 7, 8, 0];

export default function Solver() {
  // Board State
  const [boardState, setBoardState] = useState([1, 2, 3, 4, 5, 6, 7, 0, 8]); // Standard starting state (1 move away)
  const [initialState, setInitialState] = useState([1, 2, 3, 4, 5, 6, 7, 0, 8]);

  // Solver Configuration
  const [activeAlgorithm, setActiveAlgorithm] = useState('astar_manhattan');
  const [isLoading, setIsLoading] = useState(false);

  // Playback States
  const [path, setPath] = useState(null); // Full list of states along solution
  const [moves, setMoves] = useState(null); // List of moves made
  const [currentIndex, setCurrentIndex] = useState(0); // Current index in playback
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(400); // speed in ms

  // Manual Play States
  const [manualMoves, setManualMoves] = useState(0);
  const [manualTime, setManualTime] = useState(0);
  const [isManualActive, setIsManualActive] = useState(false);
  const [showWinMessage, setShowWinMessage] = useState(false);

  // Search Results Metadata
  const [runStats, setRunStats] = useState(null);
  const timerRef = useRef(null);

  // Checks if the puzzle is already solved
  const isCurrentlyGoal = boardState.every((val, idx) => val === GOAL_STATE[idx]);

  // Handle manual timer
  useEffect(() => {
    if (isManualActive && !isCurrentlyGoal && !showWinMessage) {
      timerRef.current = setInterval(() => {
        setManualTime((prev) => prev + 1);
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isManualActive, isCurrentlyGoal, showWinMessage]);

  // Trigger win state on goal reach in manual play
  useEffect(() => {
    if (isCurrentlyGoal && isManualActive) {
      setShowWinMessage(true);
      setIsManualActive(false);
    }
  }, [boardState, isCurrentlyGoal, isManualActive]);

  // Auto playback ticker
  useEffect(() => {
    let intervalId;
    if (isPlaying && path && currentIndex < path.length - 1) {
      intervalId = setInterval(() => {
        const nextIdx = currentIndex + 1;
        setCurrentIndex(nextIdx);
        setBoardState(path[nextIdx]);
      }, playbackSpeed);
    } else if (currentIndex === (path?.length - 1 || 0)) {
      setIsPlaying(false);
    }

    return () => clearInterval(intervalId);
  }, [isPlaying, currentIndex, path, playbackSpeed]);

  // Shuffle Action
  const handleShuffle = () => {
    const freshState = generateRandomPuzzle();
    setBoardState(freshState);
    setInitialState(freshState);
    resetPlaybackAndManual();
  };

  // Reset Action (Return to initial start state)
  const handleReset = () => {
    setBoardState(initialState);
    resetPlaybackAndManual();
  };

  // Apply Custom State
  const handleCustomState = (customState) => {
    setBoardState(customState);
    setInitialState(customState);
    resetPlaybackAndManual();
  };

  const resetPlaybackAndManual = () => {
    setPath(null);
    setMoves(null);
    setCurrentIndex(0);
    setIsPlaying(false);
    setManualMoves(0);
    setManualTime(0);
    setIsManualActive(false);
    setShowWinMessage(false);
    setRunStats(null);
  };

  // Manual Cell Click Handler
  const handleTileClick = (val) => {
    if (isPlaying) return; // Prevent moves during playback

    const blankIdx = boardState.indexOf(0);
    const tileIdx = boardState.indexOf(val);

    const r1 = Math.floor(tileIdx / 3);
    const c1 = tileIdx % 3;
    const r2 = Math.floor(blankIdx / 3);
    const c2 = blankIdx % 3;

    // Check adjacency
    if (Math.abs(r1 - r2) + Math.abs(c1 - c2) === 1) {
      // Clear AI solution if manual move is made
      setPath(null);
      setRunStats(null);
      setCurrentIndex(0);

      // Start timer if first move
      if (manualMoves === 0) {
        setIsManualActive(true);
      }

      const newBoard = [...boardState];
      newBoard[blankIdx] = val;
      newBoard[tileIdx] = 0;

      setBoardState(newBoard);
      setManualMoves((prev) => prev + 1);
    }
  };

  // Run Solver Algorithm
  const handleSolve = () => {
    resetPlaybackAndManual();
    setIsLoading(true);

    // Run in timeout to let UI loader render first
    setTimeout(() => {
      let result;
      let algoName = '';
      let heuristicName = '';

      switch (activeAlgorithm) {
        case 'bfs':
          result = solveBFS(boardState);
          algoName = 'Breadth-First Search (BFS)';
          break;
        case 'dfs':
          result = solveDFS(boardState);
          algoName = 'Depth-First Search (DFS)';
          break;
        case 'ucs':
          result = solveUCS(boardState);
          algoName = 'Uniform Cost Search (UCS)';
          break;
        case 'greedy':
          result = solveGreedy(boardState, 'manhattan');
          algoName = 'Greedy Best-First Search';
          heuristicName = 'Manhattan Distance';
          break;
        case 'astar_manhattan':
          result = solveAStar(boardState, 'manhattan');
          algoName = 'A* Search';
          heuristicName = 'Manhattan Distance';
          break;
        case 'astar_misplaced':
          result = solveAStar(boardState, 'misplaced');
          algoName = 'A* Search';
          heuristicName = 'Misplaced Tiles';
          break;
        default:
          result = solveAStar(boardState, 'manhattan');
          algoName = 'A* Search';
          heuristicName = 'Manhattan Distance';
      }

      setIsLoading(false);

      if (result.success) {
        setPath(result.path);
        setMoves(result.moves);
        setCurrentIndex(0);
        setRunStats({
          ...result,
          algoName,
          heuristicName,
        });
        // Auto play the solution path
        setIsPlaying(true);
      } else {
        alert(result.errorMessage || 'Failed to solve.');
      }
    }, 100);
  };

  // Scrub timeline
  const handleScrub = (idx) => {
    if (!path) return;
    setIsPlaying(false);
    setCurrentIndex(idx);
    setBoardState(path[idx]);
  };

  // Playback Helpers
  const handleStepNext = () => {
    if (path && currentIndex < path.length - 1) {
      const nextIdx = currentIndex + 1;
      setCurrentIndex(nextIdx);
      setBoardState(path[nextIdx]);
    }
  };

  const handleStepPrev = () => {
    if (path && currentIndex > 0) {
      const prevIdx = currentIndex - 1;
      setCurrentIndex(prevIdx);
      setBoardState(path[prevIdx]);
    }
  };

  const handleRestart = () => {
    if (path) {
      setCurrentIndex(0);
      setBoardState(path[0]);
      setIsPlaying(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 relative">
      {isLoading && <Loader message={`Finding path with ${activeAlgorithm.replace('_', ' ').toUpperCase()}...`} />}

      {/* Background Animated Glows */}
      <div className="absolute top-10 left-10 w-[200px] h-[200px] bg-purple-600/10 rounded-full blur-[80px] pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-[250px] h-[250px] bg-blue-600/10 rounded-full blur-[90px] pointer-events-none"></div>

      {/* Header section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-white/5 pb-6 mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-wide">Interactive AI Solver</h1>
          <p className="text-slate-400 text-sm mt-1">Configure start state manually, move tiles, or trigger search pathfinders.</p>
        </div>

        {/* Manual play indicators */}
        <div className="flex items-center gap-3">
          <div className="flex items-center space-x-2 bg-white/5 border border-white/10 px-3.5 py-2 rounded-xl text-sm">
            <BarChart className="w-4 h-4 text-purple-400" />
            <span className="text-slate-400">Moves:</span>
            <span className="font-bold text-slate-100">{manualMoves}</span>
          </div>
          <div className="flex items-center space-x-2 bg-white/5 border border-white/10 px-3.5 py-2 rounded-xl text-sm">
            <Clock className="w-4 h-4 text-blue-400" />
            <span className="text-slate-400">Time:</span>
            <span className="font-bold text-slate-100">{manualTime}s</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left column: Puzzle Board and Controls */}
        <div className="lg:col-span-8 flex flex-col items-center space-y-6">
          
          {/* Win Message */}
          {showWinMessage && (
            <div className="w-full flex items-center justify-between bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl text-emerald-300 animate-pulse">
              <div className="flex items-center space-x-2.5">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                <span className="text-sm font-semibold">Congratulations! You solved the puzzle manually in {manualMoves} moves and {manualTime}s!</span>
              </div>
              <button 
                onClick={handleReset} 
                className="text-xs font-bold underline hover:text-emerald-200"
              >
                Reset
              </button>
            </div>
          )}

          {/* Boards side-by-side: Main Puzzle + Goal Preview */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 w-full py-4 bg-white/[0.02] border border-white/5 rounded-3xl p-6 shadow-inner">
            
            {/* Current Interactive Board */}
            <div className="flex flex-col items-center space-y-3">
              <span className="text-xs font-semibold text-purple-400 uppercase tracking-widest">Current Board</span>
              <PuzzleBoard
                state={boardState}
                goalState={GOAL_STATE}
                onTileClick={handleTileClick}
                disabled={isPlaying}
                size="large"
              />
              {!path && !isCurrentlyGoal && (
                <span className="text-[10px] text-slate-500 italic">Click adjacent tiles to slide manually</span>
              )}
            </div>

            {/* Goal State Mini Preview */}
            <div className="flex flex-col items-center space-y-3">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-widest">Target Goal</span>
              <PuzzleBoard
                state={GOAL_STATE}
                goalState={GOAL_STATE}
                disabled={true}
                size="small"
              />
            </div>
          </div>

          {/* Playback Controls (Only if solution has been generated) */}
          {path && (
            <AnimationControls
              currentStep={currentIndex}
              totalSteps={path.length - 1}
              isPlaying={isPlaying}
              onPlayToggle={() => setIsPlaying(!isPlaying)}
              onStepNext={handleStepNext}
              onStepPrev={handleStepPrev}
              onRestart={handleRestart}
              speed={playbackSpeed}
              onSpeedChange={setPlaybackSpeed}
              onScrub={handleScrub}
            />
          )}

          {/* Active Statistics cards once solved */}
          {runStats && <StatisticsPanel stats={runStats} />}
        </div>

        {/* Right column: Action Panel / Educational breakdown */}
        <div className="lg:col-span-4 flex flex-col space-y-6">
          <ControlPanel
            onShuffle={handleShuffle}
            onReset={handleReset}
            onSolve={handleSolve}
            onCustomState={handleCustomState}
            isSolving={isLoading}
            hasSolution={!!path}
            activeAlgorithm={activeAlgorithm}
            onAlgorithmChange={setActiveAlgorithm}
          />

          <EducationalPanel
            state={boardState}
            path={path || [boardState]}
            currentIndex={currentIndex}
            algorithm={runStats?.algoName ? activeAlgorithm : 'None'}
          />
        </div>
      </div>
    </div>
  );
}
