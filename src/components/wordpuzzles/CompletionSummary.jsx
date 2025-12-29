import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Award, Clock, Hash, Repeat } from 'lucide-react';
import { formatTime } from '../utils/time';

export default function CompletionSummary({ stats, onPlayAgain }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-2xl rounded-3xl">
        <CardHeader className="text-center items-center">
          <motion.div
            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.2, 1] }}
            transition={{ duration: 1, ease: 'easeInOut' }}
            className="p-4 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full text-white inline-block mb-4"
          >
            <Award className="w-10 h-10" />
          </motion.div>
          <CardTitle className="text-3xl font-bold text-gray-800">Puzzle Complete!</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-8">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div className="bg-gray-100 p-4 rounded-2xl">
              <Clock className="w-6 h-6 mx-auto mb-2 text-gray-600" />
              <p className="text-sm font-semibold text-gray-500">Time Taken</p>
              <p className="text-2xl font-bold text-gray-800">{formatTime(stats.time)}</p>
            </div>
            <div className="bg-gray-100 p-4 rounded-2xl">
              <Hash className="w-6 h-6 mx-auto mb-2 text-gray-600" />
              <p className="text-sm font-semibold text-gray-500">Words Found</p>
              <p className="text-2xl font-bold text-gray-800">{stats.wordsFound}</p>
            </div>
          </div>
          <Button onClick={onPlayAgain} className="w-full text-lg py-6 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
            <Repeat className="w-5 h-5 mr-2"/>
            Play Again
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}