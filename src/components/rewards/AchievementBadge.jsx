import React from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Lock } from 'lucide-react';

export default function AchievementBadge({ badge, isUnlocked }) {
  const { icon: Icon, title, description } = badge;

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className={`flex flex-col items-center justify-center text-center p-3 rounded-2xl aspect-square transition-all duration-300 ${isUnlocked ? 'bg-amber-100' : 'bg-gray-100'}`}>
            {isUnlocked ? (
                <Icon className={`w-8 h-8 mb-1 text-amber-500`} />
            ) : (
                <Lock className="w-8 h-8 mb-1 text-gray-400" />
            )}
            <span className={`text-xs font-semibold ${isUnlocked ? 'text-amber-700' : 'text-gray-500'}`}>{title}</span>
          </div>
        </TooltipTrigger>
        <TooltipContent className="bg-gray-800 text-white rounded-md">
          <p>{description}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}