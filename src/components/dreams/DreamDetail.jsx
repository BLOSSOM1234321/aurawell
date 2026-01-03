import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { format, parseISO } from 'date-fns';

export default function DreamDetail({ dream, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-6 border-b flex justify-between items-start bg-gray-50 rounded-t-3xl">
          <div>
            <p className="text-sm font-semibold text-purple-600">
              {format(parseISO(dream.dream_date), 'MMMM d, yyyy')}
            </p>
            <h2 className="text-2xl font-bold text-gray-800">{dream.title || "Untitled Dream"}</h2>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full flex-shrink-0">
            <X className="w-5 h-5" />
          </Button>
        </header>

        <main className="p-6 space-y-6 overflow-y-auto">
          <div>
            <h3 className="font-bold text-lg text-gray-800 mb-2">Your Dream Description</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{dream.dream_description}</p>
          </div>

          {dream.feelings && dream.feelings.length > 0 && (
            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">Feelings</h3>
              <div className="flex flex-wrap gap-2">
                {dream.feelings.map(feeling => (
                  <Badge key={feeling} className="bg-purple-100 text-purple-700 px-3 py-1 text-sm">{feeling}</Badge>
                ))}
              </div>
            </div>
          )}

          {dream.main_symbols && dream.main_symbols.length > 0 && (
            <div>
              <h3 className="font-bold text-lg text-gray-800 mb-2">Main Symbols</h3>
              <div className="flex flex-wrap gap-2">
                {dream.main_symbols.map(symbol => (
                  <Badge key={symbol} variant="secondary" className="px-3 py-1 text-sm">{symbol}</Badge>
                ))}
              </div>
            </div>
          )}
        </main>
      </motion.div>
    </motion.div>
  );
}