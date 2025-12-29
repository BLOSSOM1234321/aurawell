import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X, Zap } from 'lucide-react';

export default function DareModal({ dare, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="bg-white shadow-2xl border-0 rounded-3xl">
          <CardHeader className="relative items-center text-center">
            <div className="mx-auto w-14 h-14 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 flex items-center justify-center mb-2 shadow-lg">
                <Zap className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-center text-gray-800">
              A Mindful Dare
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <p className="text-gray-700 text-lg leading-relaxed">
              {dare}
            </p>
            <Button
              onClick={onClose}
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-3 rounded-2xl font-semibold"
            >
              I Understand
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}