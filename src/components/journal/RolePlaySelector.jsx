import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, Users, Heart, Baby, Star, Clock, Sparkles, PlusCircle } from 'lucide-react';

const rolePlayScenarios = [
  {
    id: 'future-self',
    name: 'Future Self',
    icon: Clock,
    color: 'from-blue-400 to-cyan-500',
    textColor: 'text-blue-700',
    description: 'Your future self writing wisdom back to you',
    starter: "Dear Present Me,\n\nHere's what I want you to know about what lies ahead...",
  },
  {
    id: 'inner-child',
    name: 'Inner Child',
    icon: Baby,
    color: 'from-pink-400 to-rose-500',
    textColor: 'text-pink-700',
    description: 'Your younger self sharing feelings and needs',
    starter: "Hi, it's little me!\n\nI need you to understand something important...",
  },
  {
    id: 'loved-one',
    name: 'Letter to Loved One',
    icon: Heart,
    color: 'from-red-400 to-pink-500',
    textColor: 'text-red-700',
    description: 'Writing to someone special in your life',
    starter: "Dear [Name],\n\nThere's something I've been wanting to tell you...",
  },
  {
    id: 'mentor-guide',
    name: 'Wise Mentor',
    icon: Star,
    color: 'from-purple-400 to-indigo-500',
    textColor: 'text-purple-700',
    description: 'A wise guide offering advice and perspective',
    starter: "My dear student,\n\nLet me share some wisdom that might light your path...",
  },
  {
    id: 'present-to-future',
    name: 'Message to Future You',
    icon: Sparkles,
    color: 'from-emerald-400 to-teal-500',
    textColor: 'text-emerald-700',
    description: 'Current you writing hopes and dreams for the future',
    starter: "Dear Future Me,\n\nI hope when you read this, you'll remember...",
  },
  {
    id: 'free-role',
    name: 'Create Your Own Role',
    icon: PlusCircle,
    color: 'from-gray-400 to-slate-500',
    textColor: 'text-gray-700',
    description: 'Design your own unique role-play scenario',
    starter: '',
  },
];

export default function RolePlaySelector({ onRoleSelect, onClose }) {
  const [customRole, setCustomRole] = useState({ name: '', starter: '' });
  const [showCustomForm, setShowCustomForm] = useState(false);

  const handleRoleSelect = (role) => {
    if (role.id === 'free-role') {
      setShowCustomForm(true);
      return;
    }
    onRoleSelect(role);
  };

  const handleCustomRoleSubmit = () => {
    if (customRole.name.trim()) {
      const customRoleData = {
        id: 'custom',
        name: customRole.name,
        icon: Users,
        color: 'from-amber-400 to-orange-500',
        textColor: 'text-amber-700',
        description: 'Your custom role-play scenario',
        starter: customRole.starter || `Hello, this is ${customRole.name} writing...\n\n`,
      };
      onRoleSelect(customRoleData);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="absolute inset-0 bg-black/40 backdrop-blur-sm z-50 rounded-2xl flex items-start justify-center pt-8 pb-8 px-4 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, y: -10, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -10, scale: 0.98 }}
        transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-full overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 bg-white/90 backdrop-blur-md rounded-t-3xl border-b border-gray-100 px-6 py-4 z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-xl shadow-inner">
              <Users className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Role-Play Scenarios</h2>
              <p className="text-gray-600 text-sm">Choose a perspective to explore in your journal</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="p-6">
          <AnimatePresence mode="wait">
            {showCustomForm ? (
              <motion.div
                key="custom-form"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="max-w-2xl mx-auto"
              >
                <Card className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-3 text-amber-800">
                      <PlusCircle className="w-6 h-6" />
                      Create Your Custom Role
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Role Name
                      </label>
                      <Input
                        value={customRole.name}
                        onChange={(e) => setCustomRole(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="e.g., Confident Me, Best Friend, Therapist, etc."
                        className="rounded-xl text-base py-3"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Starter Sentence (Optional)
                      </label>
                      <textarea
                        value={customRole.starter}
                        onChange={(e) => setCustomRole(prev => ({ ...prev, starter: e.target.value }))}
                        placeholder="How would this role begin writing? Leave empty to start with a default prompt."
                        className="w-full p-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none text-base"
                        rows={4}
                      />
                    </div>

                    <div className="flex gap-4 pt-4">
                      <Button
                        onClick={() => setShowCustomForm(false)}
                        variant="outline"
                        className="flex-1 rounded-xl py-3"
                      >
                        Back to Roles
                      </Button>
                      <Button
                        onClick={handleCustomRoleSubmit}
                        disabled={!customRole.name.trim()}
                        className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white rounded-xl py-3"
                      >
                        Start Writing
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              <motion.div
                key="role-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {rolePlayScenarios.map((role, index) => (
                  <motion.div
                    key={role.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, ease: 'easeOut' }}
                    whileHover={{ y: -4, scale: 1.02 }}
                    className="h-full"
                  >
                    <Card 
                      className="cursor-pointer h-full bg-white hover:shadow-2xl transition-all duration-300 border-0 shadow-lg group"
                      onClick={() => handleRoleSelect(role)}
                    >
                      <CardContent className="p-6 text-center space-y-5 h-full flex flex-col">
                        <div className={`w-20 h-20 mx-auto rounded-2xl bg-gradient-to-r ${role.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <role.icon className="w-10 h-10 text-white" />
                        </div>
                        
                        <div className="flex-1 flex flex-col justify-center">
                          <h3 className={`text-xl font-bold ${role.textColor} mb-3`}>
                            {role.name}
                          </h3>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {role.description}
                          </p>
                        </div>

                        {role.starter && (
                          <div className="bg-gray-50 p-4 rounded-xl text-left">
                            <p className="text-xs text-gray-500 mb-2 font-medium">Preview:</p>
                            <p className="text-sm text-gray-700 italic line-clamp-2">
                              "{role.starter.split('\n')[1] || role.starter}"
                            </p>
                          </div>
                        )}

                        <Button className={`w-full rounded-xl bg-gradient-to-r ${role.color} hover:shadow-lg text-white font-semibold py-3 group-hover:scale-105 transition-transform duration-200`}>
                          Choose This Role
                        </Button>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}