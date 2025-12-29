import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Sparkles, Zap } from 'lucide-react';

const themeColors = {
  healing: 'from-rose-400 to-pink-500',
  growth: 'from-green-400 to-emerald-500', 
  resilience: 'from-blue-400 to-indigo-500',
  gratitude: 'from-yellow-400 to-orange-500',
  mindfulness: 'from-purple-400 to-indigo-500',
  self_compassion: 'from-teal-400 to-cyan-500'
};

export default function CircleCard({ circle, onClick }) {
  const bondLevelPercentage = Math.min(circle.bond_level || 0, 100);
  const glowIntensity = bondLevelPercentage > 0 ? Math.max(0.3, bondLevelPercentage / 100) : 0;

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="cursor-pointer"
      onClick={onClick}
    >
      <Card 
        className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-300 rounded-3xl overflow-hidden"
        style={{
          boxShadow: glowIntensity > 0 
            ? `0 0 ${20 * glowIntensity}px rgba(147, 51, 234, ${glowIntensity * 0.5})` 
            : undefined
        }}
      >
        <div className={`h-2 bg-gradient-to-r ${themeColors[circle.theme] || themeColors.mindfulness}`} />
        
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-1">{circle.name}</h3>
              <Badge className="bg-purple-100 text-purple-700 capitalize">
                {circle.theme.replace('_', ' ')}
              </Badge>
            </div>

            {circle.description && (
              <p className="text-sm text-gray-600 line-clamp-2">{circle.description}</p>
            )}

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <Users className="w-4 h-4" />
                <span>{circle.member_count || 1}/10 members</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Sparkles className="w-4 h-4 text-purple-500" />
                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-400 to-pink-500 transition-all duration-500"
                    style={{ width: `${bondLevelPercentage}%` }}
                  />
                </div>
              </div>
            </div>

            {circle.ritual_active && (
              <div className="flex items-center gap-2 p-2 bg-purple-50 rounded-xl">
                <Zap className="w-4 h-4 text-purple-500 animate-pulse" />
                <span className="text-sm font-medium text-purple-700">Ritual Active</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}