import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Circle, CircleMember } from '@/api/entities';
import { User } from '@/api/entities';
import { X, Sparkles, Heart, Sprout, Shield, Smile, Brain, Gem } from 'lucide-react';
import { toast } from 'sonner';

const themes = [
  { id: 'healing', name: 'Healing', icon: Heart, color: 'from-rose-400 to-pink-500', description: 'Focus on emotional healing and recovery' },
  { id: 'growth', name: 'Growth', icon: Sprout, color: 'from-green-400 to-emerald-500', description: 'Personal development and positive change' },
  { id: 'resilience', name: 'Resilience', icon: Shield, color: 'from-blue-400 to-indigo-500', description: 'Building strength through challenges' },
  { id: 'gratitude', name: 'Gratitude', icon: Smile, color: 'from-yellow-400 to-orange-500', description: 'Cultivating appreciation and joy' },
  { id: 'mindfulness', name: 'Mindfulness', icon: Brain, color: 'from-purple-400 to-indigo-500', description: 'Present moment awareness and peace' },
  { id: 'self_compassion', name: 'Self-Compassion', icon: Gem, color: 'from-teal-400 to-cyan-500', description: 'Kindness and understanding towards yourself' }
];

const anonymousNames = [
  "Luminous Dove 🌿", "Gentle Swan 🌸", "Serene Owl 🍃", "Peaceful Fox 🌺",
  "Quiet Deer 🌙", "Calm Butterfly 🌻", "Soft Eagle 🌼", "Kind Wolf 🌹",
  "Pure Rabbit 🌾", "Sacred Crane 🍂", "Wise Turtle 🌛", "Noble Bear 🌷"
];

export default function CreateCircleForm({ onClose, onSuccess }) {
  const [formData, setFormData] = useState({
    name: '',
    theme: '',
    description: '',
    isAnonymous: true
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.theme) return;

    setIsLoading(true);
    try {
      const user = await User.me();
      
      // Create the circle
      const circle = await Circle.create({
        name: formData.name.trim(),
        theme: formData.theme,
        description: formData.description.trim(),
        creator_email: user.email,
        member_count: 1,
        bond_level: 0
      });

      // Add creator as first member
      const displayName = formData.isAnonymous 
        ? anonymousNames[Math.floor(Math.random() * anonymousNames.length)]
        : user.preferred_name || user.full_name;

      await CircleMember.create({
        circle_id: circle.id,
        user_email: user.email,
        display_name: displayName,
        is_anonymous: formData.isAnonymous,
        role: 'creator',
        engagement_score: 0
      });

      toast.success("Circle created successfully!", {
        description: "Your Circle of Light is ready for members to join."
      });
      onSuccess();
    } catch (error) {
      console.error("Failed to create circle:", error);
      toast.error("Failed to create circle");
    }
    setIsLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-2xl rounded-3xl">
        <CardHeader className="border-b border-gray-100 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-500" />
              Create a Circle of Light
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Circle Name</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter a meaningful name for your circle"
                className="rounded-2xl border-gray-200 focus:ring-purple-500"
                maxLength={50}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Choose Your Theme</label>
              <div className="grid grid-cols-2 gap-3">
                {themes.map(theme => (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => setFormData({ ...formData, theme: theme.id })}
                    className={`p-4 rounded-2xl border-2 transition-all ${
                      formData.theme === theme.id
                        ? 'border-purple-300 bg-purple-50 scale-105'
                        : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                    }`}
                  >
                    <div className={`w-8 h-8 mx-auto mb-2 rounded-full bg-gradient-to-r ${theme.color} flex items-center justify-center`}>
                      <theme.icon className="w-4 h-4 text-white" />
                    </div>
                    <div className="text-sm font-semibold text-gray-800">{theme.name}</div>
                    <div className="text-xs text-gray-500 mt-1">{theme.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description (Optional)</label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe what your circle is about and what members can expect"
                className="rounded-2xl border-gray-200 focus:ring-purple-500"
                maxLength={200}
                rows={3}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-2xl">
              <div>
                <div className="font-semibold text-gray-800">Anonymous Identity</div>
                <div className="text-sm text-gray-600">You'll appear as a nature name (e.g., "Luminous Dove 🌿")</div>
              </div>
              <input
                type="checkbox"
                checked={formData.isAnonymous}
                onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500"
              />
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 rounded-2xl"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!formData.name.trim() || !formData.theme || isLoading}
                className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-2xl"
              >
                {isLoading ? 'Creating...' : 'Create Circle'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}