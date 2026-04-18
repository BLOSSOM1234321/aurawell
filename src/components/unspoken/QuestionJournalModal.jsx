import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { BookOpen, ArrowRight, X, Save } from 'lucide-react';
import { JournalEntry } from '@/api/entities';
import { toast } from 'sonner';

export default function QuestionJournalModal({ question, level, mode, onNext, onClose }) {
  const [journalText, setJournalText] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!journalText.trim()) {
      toast.error('Write something before saving.');
      return;
    }
    setIsSaving(true);
    try {
      await JournalEntry.create({
        title: `Unspoken Connections — Level ${level}`,
        content: journalText.trim(),
        prompt: question,
        date: new Date().toISOString().split('T')[0],
        created_date: new Date().toISOString(),
        tags: ['Unspoken Connections', typeof mode === 'object' ? mode.title : mode, `Level ${level}`],
        mood_rating: null,
        is_favorite: false,
      });
      toast.success('Journal entry saved!');
      onNext();
    } catch (err) {
      console.error(err);
      toast.error('Could not save entry. Try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleNext = () => {
    onNext();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 60, scale: 0.95 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="w-full max-w-lg bg-white rounded-3xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-pink-500 to-purple-600 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2 text-white">
              <BookOpen className="w-5 h-5" />
              <span className="font-semibold text-lg">Journal This Moment</span>
            </div>
            <button onClick={onClose} className="text-white/70 hover:text-white transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-5">
            {/* Question card */}
            <Card className="bg-gradient-to-br from-pink-50 to-purple-50 border-purple-100 rounded-2xl shadow-sm">
              <CardContent className="p-5">
                <p className="text-base font-medium text-gray-500 mb-1 uppercase tracking-wide text-xs">
                  Level {level} Question
                </p>
                <p className="text-xl font-semibold text-gray-800 leading-snug">
                  {question}
                </p>
              </CardContent>
            </Card>

            {/* Journal textarea */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">Your thoughts...</label>
              <Textarea
                value={journalText}
                onChange={(e) => setJournalText(e.target.value)}
                placeholder="Write freely. This is your space..."
                className="min-h-[140px] rounded-2xl border-gray-200 focus:border-purple-400 resize-none text-gray-800 placeholder:text-gray-400"
                autoFocus
              />
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={handleSave}
                disabled={isSaving || !journalText.trim()}
                className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-2xl font-semibold shadow-md"
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? 'Saving...' : 'Save Entry'}
              </Button>
              <Button
                onClick={handleNext}
                variant="outline"
                className="flex-1 rounded-2xl border-purple-200 text-purple-700 hover:bg-purple-50 font-semibold"
              >
                Next Card
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}