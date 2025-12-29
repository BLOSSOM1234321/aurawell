import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function StreakAnimation() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
        className="relative w-64 h-64"
      >
        {/* Glowing Circle */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.8, 1, 0.8],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: 'mirror',
          }}
          className="absolute inset-0 rounded-full bg-yellow-300/50"
        />

        {/* Ripples */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: 2.5, opacity: 0 }}
            transition={{
              duration: 3,
              ease: "easeOut",
              delay: i * 0.5,
              repeat: Infinity,
              repeatDelay: 1.5
            }}
            className="absolute inset-0 rounded-full border-2 border-yellow-400"
          />
        ))}

        {/* Central Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles className="w-24 h-24 text-white" fill="rgba(252, 211, 77, 0.8)" />
        </div>
      </motion.div>
    </motion.div>
  );
}