import React, { useState } from 'react';
import { Dream } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const feelingOptions = ["Happy", "Scared", "Confused", "Excited", "Anxious", "Sad", "Peaceful", "Powerful", "Strange"];

export default function DreamForm({ onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    dream_description: '',
    feelings: [],
    main_symbols: [],
    dream_date: new Date().toISOString().split('T')[0]
  });
  const [newSymbol, setNewSymbol] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleFeelingToggle = (feeling) => {
    setFormData(prev => ({
      ...prev,
      feelings: prev.feelings.includes(feeling)
        ? prev.feelings.filter(f => f !== feeling)
        : [...prev.feelings, feeling]
    }));
  };

  const handleAddSymbol = () => {
    if (newSymbol && !formData.main_symbols.includes(newSymbol)) {
      setFormData(prev => ({ ...prev, main_symbols: [...prev.main_symbols, newSymbol] }));
      setNewSymbol('');
    }
  };

  const handleSave = async () => {
    if (!formData.dream_description) {
      toast.error("Please describe your dream before saving.");
      return;
    }
    setIsSaving(true);
    try {
      await Dream.create(formData);
      toast.success("Dream saved to your journal!");
      onClose(true);
    } catch (error) {
      console.error("Save Error:", error);
      toast.error("Failed to save dream.");
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={() => onClose(false)}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-6 border-b flex justify-between items-center bg-gray-50 rounded-t-3xl">
          <h2 className="text-2xl font-bold text-gray-800">Log a New Dream</h2>
          <Button variant="ghost" size="icon" onClick={() => onClose(false)} className="rounded-full">
            <X className="w-5 h-5" />
          </Button>
        </header>

        <main className="p-6 space-y-6 overflow-y-auto">
          <Input
            type="date"
            value={formData.dream_date}
            onChange={e => setFormData({ ...formData, dream_date: e.target.value })}
            className="w-full md:w-1/3"
          />
          <Input
            placeholder="Dream Title (e.g., Flying Over a Green City)"
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
          />
          <Textarea
            placeholder="Describe your dream in as much detail as you can remember..."
            value={formData.dream_description}
            onChange={e => setFormData({ ...formData, dream_description: e.target.value })}
            rows={6}
          />
          
          <div>
            <label className="font-medium text-gray-700 mb-2 block">How did you feel?</label>
            <div className="flex flex-wrap gap-2">
              {feelingOptions.map(feeling => (
                <Badge
                  key={feeling}
                  onClick={() => handleFeelingToggle(feeling)}
                  className={`cursor-pointer transition-all px-3 py-1 rounded-full text-sm ${formData.feelings.includes(feeling) ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-700'}`}
                >
                  {feeling}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <label className="font-medium text-gray-700 mb-2 block">Main Symbols</label>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., water, key, mirror"
                value={newSymbol}
                onChange={e => setNewSymbol(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleAddSymbol()}
              />
              <Button onClick={handleAddSymbol}>Add</Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.main_symbols.map(symbol => (
                <Badge key={symbol} variant="secondary" className="px-3 py-1 text-sm">{symbol}</Badge>
              ))}
            </div>
          </div>
        </main>

        <footer className="p-6 border-t flex justify-end bg-gray-50 rounded-b-3xl">
          <Button onClick={handleSave} disabled={isSaving} className="px-8 py-3 text-lg rounded-2xl">
            {isSaving ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Saving...</> : 'Save to Journal'}
          </Button>
        </footer>
      </motion.div>
    </motion.div>
  );
}