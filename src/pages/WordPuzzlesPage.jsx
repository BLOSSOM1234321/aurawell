
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Loader2, Puzzle, ArrowLeft } from 'lucide-react';
import { generatePuzzle } from '../components/wordpuzzles/puzzleGenerator';
import PuzzleLobby from '../components/wordpuzzles/PuzzleLobby';
import ActivePuzzle from '../components/wordpuzzles/ActivePuzzle';
import CompletionSummary from '../components/wordpuzzles/CompletionSummary';
import { toast } from 'sonner';

export default function WordPuzzlesPage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activePuzzle, setActivePuzzle] = useState(null);
  const [completionStats, setCompletionStats] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      try {
        const currentUserData = localStorage.getItem('aurawell_current_user');
        if (currentUserData) {
          const currentUser = JSON.parse(currentUserData);
          setUser(currentUser);
        }
        const savedPuzzle = localStorage.getItem('activeWordPuzzle');
        if (savedPuzzle) {
          setActivePuzzle(JSON.parse(savedPuzzle));
        }
      } catch (error) {
        // Not logged in
      }
      setIsLoading(false);
    };
    loadInitialData();
  }, []);
  
  const handleStartGame = async (settings) => {
    setIsGenerating(true);
    try {
      // Use setTimeout to ensure the loading state updates before the blocking generation task
      setTimeout(async () => {
        const puzzle = generatePuzzle(settings.theme, settings.difficulty);
        setActivePuzzle(puzzle);
        localStorage.setItem('activeWordPuzzle', JSON.stringify(puzzle));
        setIsGenerating(false);
      }, 50);
    } catch(e) {
      toast.error("Failed to generate puzzle. Please try again.");
      setIsGenerating(false);
    }
  };

  const handleSaveProgress = (puzzleState) => {
    localStorage.setItem('activeWordPuzzle', JSON.stringify(puzzleState));
  };

  const handlePuzzleComplete = async (timeTaken) => {
    setCompletionStats({ time: timeTaken, wordsFound: activePuzzle.words.length });
    localStorage.removeItem('activeWordPuzzle');
    setActivePuzzle(null);
    try {
        const puzzlesCompleted = (user.word_puzzles_completed || 0) + 1;
        const updatedUser = { ...user, word_puzzles_completed: puzzlesCompleted };

        localStorage.setItem('aurawell_current_user', JSON.stringify(updatedUser));

        // Update users list
        const users = JSON.parse(localStorage.getItem('aurawell_users') || '[]');
        const userIndex = users.findIndex(u => u.id === user.id);
        if (userIndex !== -1) {
          users[userIndex] = updatedUser;
          localStorage.setItem('aurawell_users', JSON.stringify(users));
        }

        setUser(updatedUser);
    } catch(e) {
        console.error("Failed to update user stats after puzzle completion", e);
    }
  };

  const handleExit = () => {
    localStorage.removeItem('activeWordPuzzle');
    setActivePuzzle(null);
  };
  
  const handlePlayAgain = () => {
    setCompletionStats(null);
  }

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen"><Loader2 className="w-12 h-12 animate-spin text-purple-600" /></div>;
  }

  if (!user?.is_premium) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-slate-50 to-indigo-100 relative">
        <Link to={createPageUrl('Sanctuary')} className="absolute top-8 left-8 z-20">
          <Button variant="outline" className="bg-white/50 backdrop-blur-sm rounded-full">
            <ArrowLeft className="w-4 h-4" />
          </Button>
        </Link>
        <div className="text-center p-10 flex flex-col items-center bg-white/70 rounded-3xl shadow-2xl max-w-md">
            <Puzzle className="w-16 h-16 text-purple-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800">Word Puzzles are a Premium Feature</h2>
            <p className="text-gray-600 mt-2 mb-6">Sharpen your mind and unwind with dynamically generated word puzzles. Upgrade to access.</p>
            <Link to={createPageUrl('GoPremium')}>
              <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3">
                Go Premium
              </Button>
            </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-blue-100 p-4 md:p-8 flex items-center justify-center relative">
      <Link to={createPageUrl('Sanctuary')} className="absolute top-8 left-8 z-20">
        <Button variant="outline" className="bg-white/50 backdrop-blur-sm rounded-full">
          <ArrowLeft className="w-4 h-4" />
        </Button>
      </Link>
      <AnimatePresence mode="wait">
        {activePuzzle ? (
          <motion.div key="active-puzzle" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
            <ActivePuzzle
              puzzleData={activePuzzle}
              onComplete={handlePuzzleComplete}
              onExit={handleExit}
              onSaveProgress={handleSaveProgress}
            />
          </motion.div>
        ) : completionStats ? (
          <motion.div key="completion" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
             <CompletionSummary stats={completionStats} onPlayAgain={handlePlayAgain} />
          </motion.div>
        ) : (
          <motion.div key="lobby" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}>
            <PuzzleLobby onStartGame={handleStartGame} isLoading={isGenerating}/>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
