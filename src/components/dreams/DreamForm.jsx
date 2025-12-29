import React, { useState } from 'react';
import { Dream } from '@/api/entities';
import { InvokeLLM } from '@/api/integrations';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { X, Sparkles, Wand2, Loader2, Lightbulb } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

const feelingOptions = ["Happy", "Scared", "Confused", "Excited", "Anxious", "Sad", "Peaceful", "Powerful", "Strange"];

export default function DreamForm({ onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    dream_description: '',
    feelings: [],
    main_symbols: [],
    dream_date: new Date().toISOString().split('T')[0],
    ai_interpretation: '',
    reflective_prompts: []
  });
  const [newSymbol, setNewSymbol] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
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

  const handleAnalyzeDream = async () => {
    if (!formData.dream_description) {
      toast.error("Please describe your dream before analyzing.");
      return;
    }
    setIsAnalyzing(true);
    toast.info("Your dream is being analyzed by our AI...");

    const prompt = `
      Analyze the following dream. Based on common psychological and symbolic interpretations (like Jungian or Freudian principles, but keep it accessible), provide a potential interpretation of the themes and some reflective prompts.

      **Important Disclaimer:** Start the interpretation with "This is a symbolic interpretation and not a clinical diagnosis. Dreams are deeply personal, and their meaning can be unique to the dreamer."

      **Dream Description:**
      ${formData.dream_description}

      **Feelings Reported:**
      ${formData.feelings.join(', ') || 'None reported'}

      **Main Symbols Reported:**
      ${formData.main_symbols.join(', ') || 'None reported'}

      Please provide the analysis in the following JSON format:
    `;

    const response_json_schema = {
      type: "object",
      properties: {
        interpretation: { type: "string", description: "A gentle, non-clinical interpretation of potential themes, starting with the required disclaimer." },
        reflective_prompts: { type: "array", items: { type: "string" }, description: "3-4 open-ended questions to help the user reflect on the dream." }
      },
      required: ["interpretation", "reflective_prompts"]
    };

    try {
      const result = await InvokeLLM({ prompt, response_json_schema });
      setFormData(prev => ({
        ...prev,
        ai_interpretation: result.interpretation,
        reflective_prompts: result.reflective_prompts
      }));
      toast.success("Dream analysis complete!");
    } catch (error) {
      console.error("AI Analysis Error:", error);
      toast.error("Sorry, the AI analysis failed. Please try again.");
    } finally {
      setIsAnalyzing(false);
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

          <div className="text-center">
            <Button
              onClick={handleAnalyzeDream}
              disabled={isAnalyzing}
              className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-semibold rounded-2xl px-6 py-3 shadow-lg"
            >
              {isAnalyzing ? (
                <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Analyzing...</>
              ) : (
                <><Wand2 className="w-5 h-5 mr-2" />Analyze Dream with AI</>
              )}
            </Button>
          </div>

          {formData.ai_interpretation && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4 p-4 bg-purple-50 rounded-2xl border border-purple-200"
            >
              <div>
                <h3 className="font-bold text-lg text-purple-800 mb-2 flex items-center gap-2"><Sparkles className="w-5 h-5"/>AI Interpretation</h3>
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{formData.ai_interpretation}</p>
              </div>
              <div>
                <h3 className="font-bold text-lg text-purple-800 mb-2 flex items-center gap-2"><Lightbulb className="w-5 h-5"/>Reflective Prompts</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  {formData.reflective_prompts.map((prompt, i) => <li key={i}>{prompt}</li>)}
                </ul>
              </div>
            </motion.div>
          )}
        </main>

        <footer className="p-6 border-t flex justify-end bg-gray-50 rounded-b-3xl">
          <Button onClick={handleSave} disabled={isSaving || isAnalyzing} className="px-8 py-3 text-lg rounded-2xl">
            {isSaving ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" />Saving...</> : 'Save to Journal'}
          </Button>
        </footer>
      </motion.div>
    </motion.div>
  );
}