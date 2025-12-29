import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Globe, User } from 'lucide-react';

const cardVariants = {
  initial: { opacity: 0, y: 50, scale: 0.9, rotateX: -20 },
  animate: { opacity: 1, y: 0, scale: 1, rotateX: 0, transition: { duration: 0.5, ease: 'easeOut' } },
  exit: { opacity: 0, y: -50, scale: 0.9, rotateX: 20, transition: { duration: 0.3, ease: 'easeIn' } },
};

const SourceIcon = ({ source }) => {
    if (source === 'community') {
        return (
            <div className="absolute bottom-3 right-4 flex items-center gap-1 text-cyan-600 text-xs opacity-70">
                <Globe className="w-3 h-3" />
                <span>Community</span>
            </div>
        )
    }
    if (source === 'custom') {
        return (
            <div className="absolute bottom-3 right-4 flex items-center gap-1 text-purple-600 text-xs opacity-70">
                <User className="w-3 h-3" />
                <span>My Card</span>
            </div>
        )
    }
    return null;
}

export default function QuestionCard({ questionData, isAnimating }) {
  const { content, source } = questionData;
  return (
    <div className="h-64 [perspective:1000px]">
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          key={content}
          variants={cardVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="relative"
        >
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl min-h-[16rem] flex items-center justify-center p-8">
            <CardContent className="p-0">
              <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 leading-snug">
                {content}
              </h2>
            </CardContent>
          </Card>
          <SourceIcon source={source} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}