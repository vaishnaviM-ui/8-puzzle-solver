// A* Search implementation for 8-puzzle.
// A* expands nodes based on f(n) = g(n) + h(n), combining path cost and heuristic estimate.
import { getNeighbors } from '../utils/puzzle';
import { PriorityQueue } from '../utils/priorityQueue';
import { manhattanDistance, misplacedTiles } from './heuristics';

export function solveAStar(startState, heuristicType = 'manhattan', goalState = [1, 2, 3, 4, 5, 6, 7, 8, 0]) {
  const startTime = performance.now();
  const serializedGoal = goalState.join(',');
  const hFunc = heuristicType === 'manhattan' ? manhattanDistance : misplacedTiles;
  
  const pq = new PriorityQueue();
  const initialH = hFunc(startState, goalState);
  pq.push({ 
    state: startState, 
    path: [startState], 
    moves: [], 
    gCost: 0, 
    hCost: initialH 
  }, initialH);
  
  const visited = new Set();

  let exploredCount = 0;
  let generatedCount = 1;
  let maxFrontierSize = 1;
  const maxNodeLimit = 8000;

  while (!pq.isEmpty()) {
    if (exploredCount >= maxNodeLimit) {
      return {
        success: false,
        errorMessage: `A* search limit reached (${maxNodeLimit} nodes expanded). Try a simpler puzzle.`,
        exploredCount,
        generatedCount,
        maxFrontierSize,
        searchTime: performance.now() - startTime,
        path: [],
        moves: []
      };
    }

    const current = pq.pop();
    const serializedCurrent = current.state.join(',');

    if (visited.has(serializedCurrent)) {
      continue;
    }
    visited.add(serializedCurrent);
    exploredCount++;

    if (serializedCurrent === serializedGoal) {
      return {
        success: true,
        path: current.path,
        moves: current.moves,
        exploredCount,
        generatedCount,
        maxFrontierSize,
        searchTime: performance.now() - startTime
      };
    }

    const neighbors = getNeighbors(current.state);
    for (const neighbor of neighbors) {
      const serializedNeighbor = neighbor.state.join(',');
      if (!visited.has(serializedNeighbor)) {
        const nextG = current.gCost + 1;
        const nextH = hFunc(neighbor.state, goalState);
        const nextF = nextG + nextH;
        pq.push({
          state: neighbor.state,
          path: [...current.path, neighbor.state],
          moves: [...current.moves, neighbor.move],
          gCost: nextG,
          hCost: nextH
        }, nextF);
        generatedCount++;
      }
    }

    maxFrontierSize = Math.max(maxFrontierSize, pq.size());
  }

  return {
    success: false,
    errorMessage: 'No solution found.',
    exploredCount,
    generatedCount,
    maxFrontierSize,
    searchTime: performance.now() - startTime,
    path: [],
    moves: []
  };
}
