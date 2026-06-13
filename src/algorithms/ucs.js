// Uniform Cost Search (UCS) implementation for 8-puzzle.
// UCS expands the node with the lowest path cost g(n). 
// Since all transitions cost 1, UCS acts like BFS but uses a Priority Queue.
import { getNeighbors } from '../utils/puzzle';
import { PriorityQueue } from '../utils/priorityQueue';

export function solveUCS(startState, goalState = [1, 2, 3, 4, 5, 6, 7, 8, 0]) {
  const startTime = performance.now();
  const serializedGoal = goalState.join(',');
  
  const pq = new PriorityQueue();
  pq.push({ state: startState, path: [startState], moves: [], cost: 0 }, 0);
  const visited = new Set();

  let exploredCount = 0;
  let generatedCount = 1;
  let maxFrontierSize = 1;
  const maxNodeLimit = 8000;

  while (!pq.isEmpty()) {
    if (exploredCount >= maxNodeLimit) {
      return {
        success: false,
        errorMessage: `UCS limit reached (${maxNodeLimit} nodes expanded). Try A* search for better efficiency!`,
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
        const nextCost = current.cost + 1;
        pq.push({
          state: neighbor.state,
          path: [...current.path, neighbor.state],
          moves: [...current.moves, neighbor.move],
          cost: nextCost
        }, nextCost);
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
