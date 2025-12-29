import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

export default function ArchetypePromptModal({ title, content, icon: Icon, color, onClose, onComplete }) {
  const IconComponent = Icon || (() => null);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <Card className="border-0">
          <CardHeader className="relative items-center text-center">
            <div className={`mx-auto w-14 h-14 rounded-full bg-gradient-to-br ${color} flex items-center justify-center mb-2 shadow-lg`}>
              <IconComponent className="w-7 h-7 text-white" />
            </div>
            <CardTitle className="text-2xl text-center text-gray-800">{title}</CardTitle>
            <Button variant="ghost" size="icon" className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 rounded-full" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </CardHeader>
          <CardContent className="space-y-6 text-center">
            <p className="text-gray-700 text-lg leading-relaxed">{content}</p>
            <Button
              onClick={onComplete}
              className={`w-full bg-gradient-to-r ${color} text-white font-semibold rounded-lg`}
            >
              Mark as Complete
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}