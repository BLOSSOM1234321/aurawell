import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Lock, CheckCircle } from 'lucide-react';

const LEVEL_INFO = {
  1: { name: "Icebreakers", color: "bg-green-100 text-green-800", description: "Light & Fun" },
  2: { name: "Values & Emotions", color: "bg-yellow-100 text-yellow-800", description: "Meaningful" },
  3: { name: "Deep & Vulnerable", color: "bg-purple-100 text-purple-800", description: "Transformative" }
};

export default function LevelProgress({ currentLevel, unlockedLevels, progress }) {
  return (
    <div className="flex items-center justify-center gap-4 mb-6">
      {[1, 2, 3].map((level) => {
        const isUnlocked = unlockedLevels.includes(level);
        const isCurrent = currentLevel === level;
        const levelInfo = LEVEL_INFO[level];
        
        return (
          <motion.div
            key={level}
            className={`flex items-center gap-2 px-4 py-2 rounded-2xl border transition-all ${
              isCurrent 
                ? 'border-purple-300 bg-purple-50 shadow-md' 
                : isUnlocked 
                ? 'border-gray-200 bg-white' 
                : 'border-gray-100 bg-gray-50 opacity-60'
            }`}
            whileHover={{ scale: isUnlocked ? 1.05 : 1 }}
            whileTap={{ scale: isUnlocked ? 0.95 : 1 }}
          >
            <div className={`p-1.5 rounded-full ${isUnlocked ? 'bg-green-500' : 'bg-gray-300'}`}>
              {isUnlocked ? (
                <CheckCircle className="w-4 h-4 text-white" />
              ) : (
                <Lock className="w-4 h-4 text-white" />
              )}
            </div>
            
            <div className="text-left">
              <div className={`font-semibold text-sm ${isCurrent ? 'text-purple-700' : 'text-gray-700'}`}>
                Level {level}
              </div>
              <div className="text-xs text-gray-500">
                {levelInfo.description}
              </div>
            </div>
            
            {isCurrent && (
              <Badge className={levelInfo.color}>
                {Math.round(progress)}%
              </Badge>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}