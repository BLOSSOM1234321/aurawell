
import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { format, parseISO } from 'date-fns';
import { Moon } from 'lucide-react';

const DreamCard = ({ dream, onSelectDream }) => (
  <motion.div
    whileHover={{ y: -5, boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -2px rgba(0,0,0,0.05)" }}
    className="h-full"
  >
    <Card 
      onClick={() => onSelectDream(dream)}
      className="h-full bg-white/80 backdrop-blur-sm border-0 shadow-lg rounded-2xl cursor-pointer overflow-hidden"
    >
      <CardHeader className="p-4">
        <p className="text-xs font-semibold text-purple-600">
          {format(parseISO(dream.dream_date), 'MMMM d, yyyy')}
        </p>
        <CardTitle className="text-gray-800 line-clamp-1 text-sm">
          {dream.title || "Untitled Dream"}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-gray-600 text-xs line-clamp-3 mb-3">
          {dream.dream_description}
        </p>
        {dream.feelings && dream.feelings.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {dream.feelings.slice(0, 3).map(feeling => (
              <span key={feeling} className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full">{feeling}</span>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  </motion.div>
);

export default function DreamList({ dreams, isLoading, onSelectDream }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => <Skeleton key={i} className="h-48 rounded-2xl" />)}
      </div>
    );
  }

  if (dreams.length === 0) {
    return (
      <Card className="bg-transparent border-0 shadow-none rounded-2xl">
        <CardContent className="text-center py-12">
          <Moon className="w-12 h-12 text-blue-200 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-white mb-2 drop-shadow">
            Your Dream Journal is Empty
          </h3>
          <p className="text-blue-200 text-sm drop-shadow">
            Log your first dream to begin exploring your inner world.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {dreams.map(dream => (
        <DreamCard key={dream.id} dream={dream} onSelectDream={onSelectDream} />
      ))}
    </div>
  );
}
