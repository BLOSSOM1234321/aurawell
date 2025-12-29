import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BrainCircuit, Feather, Leaf, Zap, Heart, Star, Puzzle } from 'lucide-react';
import { wordBank } from './wordBank';

const difficulties = [
  { label: 'Relaxed', words: 15, icon: Feather },
  { label: 'Focused', words: 20, icon: BrainCircuit },
  { label: 'Challenge', words: 30, icon: Zap },
];

const themes = [
  { key: 'mindfulness', label: 'Mindfulness', icon: Feather },
  { key: 'emotions', label: 'Emotions', icon: Heart },
  { key: 'nature', label: 'Nature', icon: Leaf },
  { key: 'growth', label: 'Growth', icon: Star },
  { key: 'resilience', label: 'Resilience', icon: Zap },
  { key: 'creativity', label: 'Creativity', icon: Puzzle },
];

export default function PuzzleLobby({ onStartGame, isLoading }) {
  const [selectedDifficulty, setSelectedDifficulty] = useState(15);
  const [selectedTheme, setSelectedTheme] = useState('mindfulness');

  const handleStart = () => {
    onStartGame({ difficulty: selectedDifficulty, theme: selectedTheme });
  };

  return (
    <Card className="w-full max-w-2xl mx-auto bg-white/60 backdrop-blur-sm border-0 shadow-2xl rounded-3xl">
      <CardHeader className="text-center">
        <CardTitle className="text-3xl font-bold text-gray-800">New Word Puzzle</CardTitle>
        <CardDescription className="text-gray-600">Choose your settings to begin a new challenge.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8 p-8">
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">Select Difficulty</h3>
          <div className="grid grid-cols-3 gap-4">
            {difficulties.map(d => (
              <Button
                key={d.words}
                onClick={() => setSelectedDifficulty(d.words)}
                variant={selectedDifficulty === d.words ? 'default' : 'outline'}
                className="flex flex-col h-20 rounded-2xl"
              >
                <d.icon className="w-6 h-6 mb-1" />
                <span>{d.label}</span>
                <span className="text-xs opacity-70">{d.words} words</span>
              </Button>
            ))}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">Select Theme</h3>
          <div className="grid grid-cols-3 gap-4">
            {themes.map(t => (
              <Button
                key={t.key}
                onClick={() => setSelectedTheme(t.key)}
                variant={selectedTheme === t.key ? 'default' : 'outline'}
                className="flex items-center justify-center h-16 rounded-2xl gap-2"
              >
                <t.icon className="w-5 h-5" />
                <span>{t.label}</span>
              </Button>
            ))}
          </div>
        </div>
        
        <Button onClick={handleStart} disabled={isLoading} className="w-full text-lg py-6 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
          {isLoading ? 'Generating Puzzle...' : 'Start Game'}
        </Button>
      </CardContent>
    </Card>
  );
}