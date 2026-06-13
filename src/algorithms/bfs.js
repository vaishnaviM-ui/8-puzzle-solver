// Breadth-First Search (BFS) implementation for 8-puzzle.
// BFS explores level-by-level, guaranteed to find the shortest path.
import { getNeighbors } from '../utils/puzzle';

export function solveBFS(startState, goalState = [1, 2, 3, 4, 5, 6, 7, 8, 0]) {
  const startTime = performance.now();
  const serializedGoal = goalState.join(',');
  
  // Frontier stores: { state, path, moves }
  const queue = [{ state: startState, path: [startState], moves: [] }];
  const visited = new Set([startState.join(',')]);

  let exploredCount = 0;
  let generatedCount = 1;
  let maxFrontierSize = 1;
  const maxNodeLimit = 8000; // Limit node expansions to prevent page crash

  while (queue.length > 0) {
    if (exploredCount >= maxNodeLimit) {
      return {
        success: false,
        errorMessage: `Algorithm limit reached (${maxNodeLimit} nodes expanded). Try a simpler puzzle or A* search!`,
        exploredCount,
        generatedCount,
        maxFrontierSize,
        searchTime: performance.now() - startTime,
        path: [],
        moves: []
      };
    }

    const current = queue.shift();
    exploredCount++;

    const serializedCurrent = current.state.join(',');
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
        visited.add(serializedNeighbor);
        queue.push({
          state: neighbor.state,
          path: [...current.path, neighbor.state],
          moves: [...current.moves, neighbor.move]
        });
        generatedCount++;
      }
    }

    maxFrontierSize = Math.max(maxFrontierSize, queue.length);
  }

  return {
    success: false,
    errorMessage: 'No solution exists for this configuration.',
    exploredCount,
    generatedCount,
    maxFrontierSize,
    searchTime: performance.now() - startTime,
    path: [],
    moves: []
  };
}
