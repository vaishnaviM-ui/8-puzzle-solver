// Depth-First Search (DFS) implementation for 8-puzzle.
// DFS explores as deep as possible before backtracking.
// Warning: DFS finds highly sub-optimal solutions and can explore very deep branches.
import { getNeighbors } from '../utils/puzzle';

export function solveDFS(startState, goalState = [1, 2, 3, 4, 5, 6, 7, 8, 0]) {
  const startTime = performance.now();
  const serializedGoal = goalState.join(',');
  
  // Stack stores: { state, path, moves }
  const stack = [{ state: startState, path: [startState], moves: [] }];
  const visited = new Set();

  let exploredCount = 0;
  let generatedCount = 1;
  let maxFrontierSize = 1;
  const maxNodeLimit = 5000;
  const maxDepthLimit = 150; // Cut off very deep search lines to avoid massive solutions

  while (stack.length > 0) {
    if (exploredCount >= maxNodeLimit) {
      return {
        success: false,
        errorMessage: `DFS limit reached (${maxNodeLimit} nodes expanded). DFS solutions are highly sub-optimal and deep!`,
        exploredCount,
        generatedCount,
        maxFrontierSize,
        searchTime: performance.now() - startTime,
        path: [],
        moves: []
      };
    }

    const current = stack.pop();
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

    if (current.path.length >= maxDepthLimit) {
      continue;
    }

    const neighbors = getNeighbors(current.state);
    // Push neighbors in reverse order to explore first child first
    for (let i = neighbors.length - 1; i >= 0; i--) {
      const neighbor = neighbors[i];
      const serializedNeighbor = neighbor.state.join(',');
      if (!visited.has(serializedNeighbor)) {
        stack.push({
          state: neighbor.state,
          path: [...current.path, neighbor.state],
          moves: [...current.moves, neighbor.move]
        });
        generatedCount++;
      }
    }

    maxFrontierSize = Math.max(maxFrontierSize, stack.length);
  }

  return {
    success: false,
    errorMessage: 'No solution found within limits.',
    exploredCount,
    generatedCount,
    maxFrontierSize,
    searchTime: performance.now() - startTime,
    path: [],
    moves: []
  };
}
