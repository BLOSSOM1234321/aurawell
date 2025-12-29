import React from 'react';
import { motion } from 'framer-motion';

const themeConfigs = {
  cosmic: {
    colors: 'from-indigo-900 via-purple-900 to-pink-900',
    particles: '✨',
    particleCount: 50,
    floatingElements: ['⭐', '✨', '🌟', '💫']
  },
  nature: {
    colors: 'from-green-800 via-emerald-700 to-teal-800',
    particles: '🍃',
    particleCount: 30,
    floatingElements: ['🍃', '🌿', '🦋', '🌸']
  },
  minimalist: {
    colors: 'from-gray-600 via-slate-700 to-gray-800',
    particles: '○',
    particleCount: 20,
    floatingElements: ['○', '◯', '●', '◉']
  }
};

export default function SacredSpaceBackground({ theme, isActive, progress }) {
  const config = themeConfigs[theme] || themeConfigs.cosmic;

  return (
    <div className={`absolute inset-0 bg-gradient-to-br ${config.colors} overflow-hidden`}>
      {/* Breathing Glow Effect */}
      {isActive && (
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute inset-0 bg-white/10 rounded-full blur-3xl"
          style={{
            transform: 'scale(2)',
            transformOrigin: 'center'
          }}
        />
      )}

      {/* Floating Particles */}
      {Array.from({ length: config.particleCount }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-white/30 text-2xl"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [-20, -40, -20],
            x: [-10, 10, -10],
            rotate: [0, 360],
            opacity: [0.3, 0.8, 0.3]
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut"
          }}
        >
          {config.floatingElements[Math.floor(Math.random() * config.floatingElements.length)]}
        </motion.div>
      ))}

      {/* Progress Glow */}
      {isActive && progress > 0 && (
        <motion.div
          className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-white/50 to-white/80"
          style={{ width: `${progress}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5 }}
        />
      )}

      {/* Completion Effect */}
      {progress >= 100 && (
        <motion.div
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 3, opacity: 0 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute inset-0 bg-white/20 rounded-full"
        />
      )}
    </div>
  );
}