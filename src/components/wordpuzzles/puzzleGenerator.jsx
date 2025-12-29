import { wordBank } from './wordBank';

const directions = [
  { row: 0, col: 1 },   // Horizontal
  { row: 1, col: 0 },   // Vertical
  { row: 1, col: 1 },   // Diagonal down-right
  { row: 1, col: -1 },  // Diagonal down-left
  { row: 0, col: -1 },  // Horizontal-reverse
  { row: -1, col: 0 },  // Vertical-reverse
  { row: -1, col: -1 }, // Diagonal up-left
  { row: -1, col: 1 },  // Diagonal up-right
];

const shuffleArray = (array) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
};

const getGridSize = (wordCount) => {
  if (wordCount <= 15) return 15;
  if (wordCount <= 20) return 18;
  return 22;
};

export const generatePuzzle = (theme, wordCount) => {
  const sourceWords = wordBank[theme];
  if (!sourceWords) {
    throw new Error(`Theme "${theme}" not found in word bank.`);
  }

  const wordsToPlace = shuffleArray([...sourceWords]).slice(0, wordCount).map(w => w.toUpperCase());
  const gridSize = getGridSize(wordCount);
  
  let grid = Array(gridSize).fill(null).map(() => Array(gridSize).fill(null));
  const solutions = [];

  const placeWord = (word) => {
    const shuffledDirections = shuffleArray([...directions]);
    for (const direction of shuffledDirections) {
      const startRow = Math.floor(Math.random() * gridSize);
      const startCol = Math.floor(Math.random() * gridSize);

      let canPlace = true;
      let currentRow = startRow;
      let currentCol = startCol;
      const cellsToPlace = [];

      for (let i = 0; i < word.length; i++) {
        if (currentRow < 0 || currentRow >= gridSize || currentCol < 0 || currentCol >= gridSize) {
          canPlace = false;
          break;
        }
        if (grid[currentRow][currentCol] !== null && grid[currentRow][currentCol] !== word[i]) {
          canPlace = false;
          break;
        }
        cellsToPlace.push({ row: currentRow, col: currentCol, char: word[i] });
        currentRow += direction.row;
        currentCol += direction.col;
      }
      
      if (canPlace) {
        cellsToPlace.forEach(cell => {
          grid[cell.row][cell.col] = cell.char;
        });
        solutions.push({
          word: word,
          start: [startRow, startCol],
          end: [cellsToPlace[cellsToPlace.length - 1].row, cellsToPlace[cellsToPlace.length - 1].col],
        });
        return true;
      }
    }
    return false;
  };
  
  // Sort words by length, longest first, to make placement easier
  wordsToPlace.sort((a, b) => b.length - a.length);
  const successfullyPlacedWords = [];

  for (const word of wordsToPlace) {
    let placed = false;
    for (let i = 0; i < 50; i++) { // 50 attempts to place a word
      if (placeWord(word)) {
        successfullyPlacedWords.push(word);
        placed = true;
        break;
      }
    }
    if (!placed) {
        console.warn(`Could not place word: ${word}`);
    }
  }

  // Fill the rest of the grid with random letters
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (grid[r][c] === null) {
        grid[r][c] = alphabet[Math.floor(Math.random() * alphabet.length)];
      }
    }
  }

  return {
    grid,
    words: successfullyPlacedWords.sort(), // Return the sorted list of words that were actually placed
    solutions,
  };
};