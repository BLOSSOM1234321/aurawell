import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { X, PlusCircle, Globe, Lock, Loader2 } from 'lucide-react';
import { CustomCard } from '@/api/entities';
import { User } from '@/api/entities';
import { toast } from 'sonner';

export default function CustomCardCreator({ onClose, onCardCreated }) {
  const [content, setContent] = useState('');
  const [isShared, setIsShared] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (content.trim().length < 10) {
      toast.error('Question must be at least 10 characters long.');
      return;
    }
    
    setIsLoading(true);
    try {
      const user = await User.me();
      await CustomCard.create({
        content,
        is_shared: isShared,
        author_name: user.preferred_name || user.full_name,
        is_approved: false, // All cards start as unapproved
      });

      toast.success('Your custom card has been created!');
      if(isShared) {
        toast.info('Your shared card will be visible to the community after a quick review.');
      }
      
      onCardCreated();
      onClose();
    } catch (error) {
      console.error('Failed to create custom card:', error);
      toast.error('Could not create your card. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

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
        className="w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="bg-white shadow-2xl border-0 rounded-3xl">
          <CardHeader className="relative items-center text-center">
            <Button
              onClick={onClose}
              variant="ghost"
              size="icon"
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
            <div className="mx-auto w-14 h-14 rounded-full bg-gradient-to-r from-teal-400 to-cyan-500 flex items-center justify-center mb-2 shadow-lg">
                <PlusCircle className="w-8 h-8 text-white" />
            </div>
            <CardTitle className="text-2xl text-center text-gray-800">
              Create Your Own Question
            </CardTitle>
            <p className="text-sm text-gray-500">Add a personal touch to your connection game.</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="question-content" className="font-semibold text-gray-700">Your Question</Label>
                <Textarea
                  id="question-content"
                  placeholder="e.g., What's a small act of kindness you could do tomorrow?"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="mt-2 min-h-[100px] text-base rounded-2xl"
                  required
                />
              </div>

              <div>
                <Label className="font-semibold text-gray-700">Sharing Options</Label>
                <div 
                    className="mt-2 flex items-center justify-between p-4 border rounded-2xl cursor-pointer"
                    onClick={() => setIsShared(!isShared)}
                >
                    <div className="flex items-center gap-3">
                        {isShared ? <Globe className="w-6 h-6 text-cyan-500"/> : <Lock className="w-6 h-6 text-gray-400"/>}
                        <div>
                            <h4 className="font-medium">{isShared ? "Share with Community" : "Keep this Card Private"}</h4>
                            <p className="text-xs text-gray-500">
                                {isShared ? "Your card will be reviewed and may appear in other players' games." : "Only you will see this card in your games."}
                            </p>
                        </div>
                    </div>
                    <Switch
                        checked={isShared}
                        onCheckedChange={setIsShared}
                        aria-label="Sharing toggle"
                    />
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700 text-white px-8 py-3 rounded-2xl font-semibold"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin"/> : "Save Question"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}