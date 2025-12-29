import React, { useState, useEffect } from 'react';
import { Shield, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { gentleMessages } from './GentleGuardianToggle';

export default function GentleGuardianBanner({ onDismiss }) {
  const [currentMessage, setCurrentMessage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % gentleMessages.length);
    }, 8000); // Change message every 8 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="relative mb-6 p-4 bg-gradient-to-r from-purple-100 via-purple-50 to-indigo-100 rounded-2xl border border-purple-200 shadow-lg"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-purple-200/20 to-indigo-200/20 rounded-2xl animate-pulse" />
      
      <div className="relative flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-500 rounded-xl shadow-lg">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-purple-800 mb-1">Gentle Guardian Mode</h3>
            <AnimatePresence mode="wait">
              <motion.p
                key={currentMessage}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="text-purple-700 font-medium text-lg"
              >
                {gentleMessages[currentMessage]}
              </motion.p>
            </AnimatePresence>
          </div>
        </div>
        
        <button
          onClick={onDismiss}
          className="p-2 text-purple-600 hover:text-purple-800 hover:bg-purple-200 rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}