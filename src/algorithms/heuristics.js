// Heuristic calculation functions for informed AI search algorithms
export function manhattanDistance(state, goalState = [1, 2, 3, 4, 5, 6, 7, 8, 0]) {
  let distance = 0;
  for (let i = 0; i < state.length; i++) {
    const value = state[i];
    if (value !== 0) {
      const targetIdx = goalState.indexOf(value);
      const currentR = Math.floor(i / 3);
      const currentC = i % 3;
      const targetR = Math.floor(targetIdx / 3);
      const targetC = targetIdx % 3;
      distance += Math.abs(currentR - targetR) + Math.abs(currentC - targetC);
    }
  }
  return distance;
}

export function misplacedTiles(state, goalState = [1, 2, 3, 4, 5, 6, 7, 8, 0]) {
  let count = 0;
  for (let i = 0; i < state.length; i++) {
    const value = state[i];
    if (value !== 0) {
      if (value !== goalState[i]) {
        count++;
      }
    }
  }
  return count;
}
