import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { X, Sparkles, Lightbulb, AlertTriangle } from 'lucide-react';
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

          {dream.ai_interpretation && (
            <div className="space-y-6 pt-6 border-t">
              <div className="p-4 bg-blue-50 rounded-2xl border border-blue-200">
                <h3 className="font-bold text-lg text-blue-800 mb-2 flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />AI Interpretation
                </h3>
                <p className="text-blue-900/80 leading-relaxed whitespace-pre-wrap">{dream.ai_interpretation}</p>
              </div>
              
              <div className="p-4 bg-green-50 rounded-2xl border border-green-200">
                <h3 className="font-bold text-lg text-green-800 mb-2 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5" />Reflective Prompts
                </h3>
                <ul className="list-disc list-inside space-y-1 text-green-900/80">
                  {dream.reflective_prompts.map((prompt, i) => <li key={i}>{prompt}</li>)}
                </ul>
              </div>
            </div>
          )}
        </main>
        
        <footer className="p-4 border-t bg-gray-50 rounded-b-3xl">
            <div className="p-3 bg-yellow-50 rounded-xl text-yellow-800 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0"/>
                <span>AI interpretations are based on common symbols and are for reflection only. They are not a substitute for professional psychological advice.</span>
            </div>
        </footer>
      </motion.div>
    </motion.div>
  );
}