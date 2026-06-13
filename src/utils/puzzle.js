// Core puzzle state utility functions for validation, randomness, and legal moves

// Counts the number of inversions in a state (ignoring the empty blank space 0)
export function getInversions(state) {
  let inversions = 0;
  for (let i = 0; i < state.length - 1; i++) {
    for (let j = i + 1; j < state.length; j++) {
      if (state[i] !== 0 && state[j] !== 0 && state[i] > state[j]) {
        inversions++;
      }
    }
  }
  return inversions;
}

// An 8-puzzle is solvable if and only if the number of inversions is even
export function isSolvable(state) {
  return getInversions(state) % 2 === 0;
}

// Retrieves all states reachable in 1 move from the current state
export function getNeighbors(state) {
  const neighbors = [];
  const blankIdx = state.indexOf(0);
  const r = Math.floor(blankIdx / 3);
  const c = blankIdx % 3;

  const dirs = [
    [-1, 0, 'up'],
    [1, 0, 'down'],
    [0, -1, 'left'],
    [0, 1, 'right']
  ];

  for (const [dr, dc, dir] of dirs) {
    const newR = r + dr;
    const newC = c + dc;
    if (newR >= 0 && newR < 3 && newC >= 0 && newC < 3) {
      const newIdx = newR * 3 + newC;
      const newState = [...state];
      
      // Swap blank (0) with the tile at the target position
      newState[blankIdx] = state[newIdx];
      newState[newIdx] = 0;
      
      neighbors.push({
        state: newState,
        move: state[newIdx], // The tile number that shifted into the blank space
        direction: dir
      });
    }
  }
  return neighbors;
}

// Generates a random valid solvable board by shuffling the goal state 80 times
export function generateRandomPuzzle() {
  const goal = [1, 2, 3, 4, 5, 6, 7, 8, 0];
  let current = [...goal];
  
  // Make 80 random moves to guarantee solvability and mix it well
  for (let i = 0; i < 80; i++) {
    const neighbors = getNeighbors(current);
    const randomNeighbor = neighbors[Math.floor(Math.random() * neighbors.length)];
    current = randomNeighbor.state;
  }
  
  // Ensure we do not return the goal state itself
  if (current.every((val, idx) => val === goal[idx])) {
    return generateRandomPuzzle();
  }
  return current;
}

// Validates a manual/custom puzzle entry state
export function validateCustomPuzzle(state) {
  // Must be an array of length 9
  if (!Array.isArray(state) || state.length !== 9) {
    return { valid: false, error: 'Must contain exactly 9 numbers.' };
  }

  // Must contain numbers 0-8 exactly once
  const counts = Array(9).fill(0);
  for (const num of state) {
    if (num < 0 || num > 8 || isNaN(num)) {
      return { valid: false, error: 'Numbers must be between 0 and 8.' };
    }
    counts[num]++;
  }

  if (counts.some(count => count !== 1)) {
    return { valid: false, error: 'Numbers from 0 to 8 must not be duplicated.' };
  }

  // Check solvability
  if (!isSolvable(state)) {
    return { valid: false, error: 'This puzzle configuration is unsolvable (odd inversions).' };
  }

  return { valid: true };
}
