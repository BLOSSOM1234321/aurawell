import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SacredSpaceEntry } from '@/api/entities';
import { Save, Sparkles } from 'lucide-react';
import { toast } from 'sonner';
import SacredSpaceBackground from './SacredSpaceBackground';

export default function SacredSpaceJournal({ theme, user }) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [preMood, setPreMood] = useState('');
  const [isWriting, setIsWriting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!content.trim()) return;

    setIsSaving(true);
    try {
      await SacredSpaceEntry.create({
        title: title || 'Sacred Space Entry',
        content,
        session_theme: theme,
        pre_session_mood: preMood,
        date: new Date().toISOString().split('T')[0]
      });

      // Garden activity removed (Mind Garden deleted)

      toast.success("Sacred entry saved", {
        description: "Your thoughts are now safely stored in your Sacred Vault ✨"
      });

      // Clear form
      setTitle('');
      setContent('');
      setPreMood('');
      setIsWriting(false);

    } catch (error) {
      console.error("Error saving entry:", error);
      toast.error("Failed to save entry");
    }
    setIsSaving(false);
  };

  return (
    <div className="relative min-h-[700px] rounded-3xl overflow-hidden">
      <SacredSpaceBackground theme={theme} isActive={true} progress={0} />
      
      <div className="relative z-10 p-8 h-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto space-y-6"
        >
          {/* Header */}
          <div className="text-center text-white space-y-2">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-8 h-8" />
              <h2 className="text-3xl font-light">Sacred Journal</h2>
            </div>
            <p className="text-white/80">
              Write in the stillness of your sacred space
            </p>
          </div>

          {/* Pre-session Mood */}
          {!isWriting && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center space-y-4"
            >
              <div className="text-white/90">
                <p className="text-lg mb-4">How are you feeling right now?</p>
                <Input
                  value={preMood}
                  onChange={(e) => setPreMood(e.target.value)}
                  placeholder="Anxious, peaceful, curious, grateful..."
                  className="bg-white/10 border-white/20 text-white placeholder-white/50 text-center backdrop-blur-sm rounded-2xl"
                />
              </div>
              <Button
                onClick={() => setIsWriting(true)}
                className="bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-2xl px-8 py-3 backdrop-blur-sm"
              >
                Begin Writing
              </Button>
            </motion.div>
          )}

          {/* Writing Interface */}
          {isWriting && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your entry a title (optional)"
                className="bg-white/10 border-white/20 text-white placeholder-white/50 backdrop-blur-sm rounded-2xl h-12 text-lg"
              />
              
              <div className="bg-white/10 border border-white/20 rounded-2xl p-6 backdrop-blur-sm min-h-[300px]">
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Let your thoughts flow freely..."
                  className="w-full h-full bg-transparent text-white placeholder-white/50 resize-none border-none outline-none text-lg leading-relaxed"
                  style={{ minHeight: '250px' }}
                  autoFocus
                />
              </div>

              <div className="flex gap-4 justify-center">
                <Button
                  onClick={() => setIsWriting(false)}
                  variant="ghost"
                  className="text-white hover:bg-white/20 rounded-2xl px-6"
                >
                  Back
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={!content.trim() || isSaving}
                  className="bg-white/20 hover:bg-white/30 text-white border border-white/30 rounded-2xl px-6 backdrop-blur-sm"
                >
                  <Save className="w-4 h-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save to Sacred Vault'}
                </Button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}