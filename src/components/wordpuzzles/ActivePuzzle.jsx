import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Check, Pause, Play, X } from 'lucide-react';
import { formatTime } from '../utils/time';

export default function ActivePuzzle({ puzzleData, onComplete, onExit, onSaveProgress }) {
  const { grid, words, solutions } = puzzleData;
  const [foundWords, setFoundWords] = useState(puzzleData.foundWords || []);
  const [foundWordCells, setFoundWordCells] = useState(() => {
      const initialCells = new Set();
      if (puzzleData.foundWords) {
          puzzleData.foundWords.forEach(word => {
              const solution = solutions.find(s => s.word === word);
              if (solution) {
                  const cells = getSelectionCells(solution.start, solution.end, grid.length);
                  cells.forEach(cell => initialCells.add(cell));
              }
          });
      }
      return initialCells;
  });
  
  const [selectedCells, setSelectedCells] = useState([]);
  const [isSelecting, setIsSelecting] = useState(false);
  const [startCell, setStartCell] = useState(null);
  const [isPaused, setIsPaused] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(puzzleData.elapsedTime || 0);

  useEffect(() => {
    const timer = setInterval(() => {
      if (!isPaused) {
        setElapsedTime(prev => prev + 1);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [isPaused]);

  const getCellKey = (row, col) => `${row}-${col}`;

  const handleSelectionEnd = useCallback((endCell) => {
    if (!isSelecting || !startCell) return;
    
    const potentialSolutions = solutions.filter(s => {
      return (
        (s.start[0] === startCell[0] && s.start[1] === startCell[1] && s.end[0] === endCell[0] && s.end[1] === endCell[1]) ||
        (s.start[0] === endCell[0] && s.start[1] === endCell[1] && s.end[0] === startCell[0] && s.end[1] === startCell[1])
      );
    });

    if (potentialSolutions.length > 0) {
      const wordToFind = potentialSolutions[0].word;
      if (!foundWords.includes(wordToFind)) {
        const newFoundWords = [...foundWords, wordToFind];
        setFoundWords(newFoundWords);

        const wordCells = getSelectionCells(startCell, endCell, grid.length);
        setFoundWordCells(prev => new Set([...prev, ...wordCells]));

        if (newFoundWords.length === words.length) {
          onComplete(elapsedTime);
        }
      }
    }

    setIsSelecting(false);
    setStartCell(null);
    setSelectedCells([]);
  }, [isSelecting, startCell, solutions, foundWords, words.length, onComplete, elapsedTime, grid.length]);

  const handleCellMouseDown = (row, col) => {
    if (isPaused) return;
    setIsSelecting(true);
    setStartCell([row, col]);
    setSelectedCells([getCellKey(row, col)]);
  };

  const handleCellMouseEnter = (row, col) => {
    if (!isSelecting || !startCell || isPaused) return;
    const path = getSelectionCells(startCell, [row, col], grid.length);
    setSelectedCells(path);
  };

  const handleCellMouseUp = (row, col) => {
    if (isPaused) return;
    handleSelectionEnd([row, col]);
  };

  const handlePause = () => {
    setIsPaused(true);
    onSaveProgress({
        ...puzzleData,
        foundWords: foundWords,
        elapsedTime: elapsedTime
    });
  }

  const gridStyle = {
    gridTemplateColumns: `repeat(${grid.length}, minmax(0, 1fr))`,
    fontSize: grid.length > 18 ? '0.75rem' : '0.875rem'
  };
  
  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-6 rounded-3xl bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-100 shadow-2xl">
      <AnimatePresence>
        {isPaused && (
           <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             exit={{ opacity: 0 }}
             className="absolute inset-0 bg-black/50 backdrop-blur-sm z-20 flex flex-col items-center justify-center rounded-3xl gap-4"
           >
             <h2 className="text-4xl font-bold text-white">Paused</h2>
             <Button onClick={() => setIsPaused(false)} className="px-8 py-3 text-lg rounded-2xl">
                <Play className="w-6 h-6 mr-2"/>
                Resume
             </Button>
           </motion.div>
        )}
      </AnimatePresence>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="bg-white/50 border-white/30 shadow-lg">
            <CardContent className="p-2 md:p-4 aspect-square">
              <div className="grid gap-1" style={gridStyle}>
                {grid.map((row, rowIndex) =>
                  row.map((letter, colIndex) => {
                    const cellKey = getCellKey(rowIndex, colIndex);
                    const isSelected = selectedCells.includes(cellKey);
                    const isFoundCell = foundWordCells.has(cellKey);
                    
                    return (
                      <div
                        key={cellKey}
                        className={`aspect-square flex items-center justify-center font-bold rounded-md cursor-pointer select-none transition-all duration-150 ${
                          isFoundCell
                            ? 'bg-green-400/80 text-white'
                            : isSelected
                            ? 'bg-yellow-400/70 text-black'
                            : 'bg-white/30 hover:bg-white/60 text-gray-700'
                        }`}
                        onMouseDown={() => handleCellMouseDown(rowIndex, colIndex)}
                        onMouseEnter={() => handleCellMouseEnter(rowIndex, colIndex)}
                        onMouseUp={() => handleCellMouseUp(rowIndex, colIndex)}
                      >
                        {letter}
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-4">
            <Card className="bg-white/50 border-white/30 shadow-lg">
                <CardContent className="p-4 flex items-center justify-between">
                    <div className="text-gray-700">
                        <p className="font-semibold">Time</p>
                        <p className="text-2xl font-bold">{formatTime(elapsedTime)}</p>
                    </div>
                    <div className="text-gray-700 text-right">
                        <p className="font-semibold">Found</p>
                        <p className="text-2xl font-bold">{foundWords.length} / {words.length}</p>
                    </div>
                </CardContent>
            </Card>

            <Card className="flex-grow bg-white/50 border-white/30 shadow-lg">
                <CardContent className="p-4 h-full">
                    <h3 className="font-bold text-lg text-gray-800 mb-2">Words to Find</h3>
                    <ScrollArea className="h-64 md:h-full">
                        <div className="grid grid-cols-2 gap-x-4 gap-y-2 pr-4">
                        {words.map((word, index) => (
                            <div
                            key={index}
                            className={`flex items-center gap-2 transition-all ${
                                foundWords.includes(word)
                                ? 'text-green-600 line-through'
                                : 'text-gray-700'
                            }`}
                            >
                            {foundWords.includes(word) && <Check className="w-4 h-4"/>}
                            <span>{word}</span>
                            </div>
                        ))}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>

            <div className="grid grid-cols-2 gap-4">
                 <Button variant="outline" onClick={handlePause} className="rounded-xl">
                    <Pause className="w-4 h-4 mr-2"/> Pause
                </Button>
                <Button variant="destructive" onClick={onExit} className="rounded-xl">
                    <X className="w-4 h-4 mr-2"/> Exit
                </Button>
            </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to get cells in a path. Must be defined here or imported.
function getSelectionCells(start, end, gridSize) {
    const [startRow, startCol] = start;
    const [endRow, endCol] = end;
    const cells = [];
  
    if (startRow === endRow) { // Horizontal
      for (let c = Math.min(startCol, endCol); c <= Math.max(startCol, endCol); c++) {
        cells.push(`${startRow}-${c}`);
      }
    } else if (startCol === endCol) { // Vertical
      for (let r = Math.min(startRow, endRow); r <= Math.max(startRow, endRow); r++) {
        cells.push(`${r}-${startCol}`);
      }
    } else if (Math.abs(endRow - startRow) === Math.abs(endCol - startCol)) { // Diagonal
      const rowStep = endRow > startRow ? 1 : -1;
      const colStep = endCol > startCol ? 1 : -1;
      let r = startRow;
      let c = startCol;
      while (true) {
        cells.push(`${r}-${c}`);
        if (r === endRow && c === endCol) break;
        r += rowStep;
        c += colStep;
      }
    }
    return cells;
}