import React from 'react';
import { Crown, Lock } from 'lucide-react';

const themePreviews = {
  light: 'bg-blue-200',
  dark: 'bg-gray-800',
  sunset: 'bg-gradient-to-tr from-rose-400 to-orange-300',
  forest: 'bg-green-400',
  sunrise: 'bg-orange-400',
  night: 'bg-stone-800',
  sakura_premium: 'bg-gradient-to-tr from-pink-300 to-purple-400',
  ocean_premium: 'bg-gradient-to-tr from-cyan-400 to-blue-600',
  aurora_premium: 'bg-gradient-to-tr from-gray-800 to-emerald-600',
  lotus_premium: 'bg-gradient-to-tr from-purple-700 to-fuchsia-500'
};

export default function ThemeSelector({ themes = [], unlockedThemes = [], activeTheme, isPremium, onSelectTheme }) {
  
  const getIsUnlocked = (theme) => {
      if (theme.isPremium) {
          return isPremium;
      }
      // Default themes are always unlocked
      if (!theme.unlockDay) {
          return true;
      }
      return unlockedThemes.includes(theme.id);
  };

  return (
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {themes.map(theme => {
        const isUnlocked = getIsUnlocked(theme);
        const isActive = activeTheme === theme.id;
        
        return (
          <div 
            key={theme.id}
            onClick={() => onSelectTheme(theme)}
            className={`relative p-2 rounded-2xl border-2 transition-all duration-300 ${
              isActive ? 'border-accent shadow-lg' : 'border-transparent'
            } ${isUnlocked ? 'cursor-pointer hover:border-gray-300' : 'cursor-pointer'}`}
          >
            <div className={`w-full h-16 rounded-xl mb-2 ${themePreviews[theme.id] || 'bg-gray-200'}`} />
            <div className="flex flex-col items-center justify-center text-center">
              <span className="text-xs font-medium text-secondary">{theme.name}</span>
            </div>
            
            {!isUnlocked && (
              <div className="absolute inset-0 bg-card/70 dark:bg-black/60 backdrop-blur-sm rounded-2xl flex flex-col items-center justify-center p-1 text-center">
                {theme.isPremium ? (
                  <>
                    <Crown className="w-5 h-5 text-yellow-500 mb-1" />
                    <p className="text-xs font-bold text-secondary">Premium</p>
                  </>
                ) : (
                  <>
                    <Lock className="w-4 h-4 text-secondary mb-1" />
                    <p className="text-xs font-bold text-secondary">{theme.unlockDay}-Day Streak</p>
                  </>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}