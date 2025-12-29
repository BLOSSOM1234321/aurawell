import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Sparkles, X } from 'lucide-react';

export default function DestinyDrawModal({ question, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
        className="w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white shadow-2xl border-0 rounded-3xl">
          <CardHeader className="relative items-center text-center pb-4">
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-white/70 hover:text-white hover:bg-white/10 rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
            
             <div className="mx-auto w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mb-3 shadow-lg">
                <Sparkles className="w-7 h-7 text-white" />
            </div>
            <CardTitle className="text-2xl text-center font-bold tracking-tight">
              Destiny Draw
            </CardTitle>
            <p className="text-purple-100 text-sm">A special question for deep reflection</p>
          </CardHeader>
          <CardContent className="space-y-6 text-center p-6">
            <p className="text-white/95 text-lg leading-relaxed italic font-medium">
              "{question}"
            </p>
            <Button
              onClick={onClose}
              className="bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-2xl font-semibold border border-white/30 transition-all duration-200"
            >
              Continue Reflecting
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}