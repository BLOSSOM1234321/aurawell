import React from 'react';
import { motion } from 'framer-motion';

export default function NightSkyBackground({ className = "", fullScreen = false }) {
  return (
    <div className={`${fullScreen ? 'fixed inset-0 z-0' : 'absolute inset-0'} overflow-hidden ${className}`}>
      {/* Deep Navy to Purple Gradient Sky */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-purple-950 to-slate-900" />
      
      {/* Nebula Effect */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-3/4 right-1/4 w-64 h-64 bg-indigo-500/15 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
      </div>

      {/* Twinkling Stars */}
      {Array.from({ length: 50 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            boxShadow: '0 0 6px rgba(255, 255, 255, 0.8)'
          }}
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 3,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Larger Bright Stars */}
      {Array.from({ length: 15 }).map((_, i) => (
        <motion.div
          key={`bright-${i}`}
          className="absolute w-2 h-2 bg-white rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            boxShadow: '0 0 12px rgba(255, 255, 255, 0.9), 0 0 24px rgba(147, 197, 253, 0.4)'
          }}
          animate={{
            opacity: [0.6, 1, 0.6],
            scale: [1, 1.5, 1]
          }}
          transition={{
            duration: 4 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 4,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Shooting Stars */}
      <motion.div
        className="absolute w-1 h-1 bg-white rounded-full"
        style={{
          boxShadow: '0 0 8px rgba(255, 255, 255, 1), 0 0 16px rgba(147, 197, 253, 0.8)'
        }}
        animate={{
          x: [-100, window.innerWidth + 100],
          y: [Math.random() * 200 + 50, Math.random() * 300 + 150],
          opacity: [0, 1, 1, 0]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatDelay: 5,
          ease: "easeOut",
          times: [0, 0.1, 0.9, 1]
        }}
      />

      {/* Second Shooting Star with Different Timing */}
      <motion.div
        className="absolute w-1 h-1 bg-blue-100 rounded-full"
        style={{
          boxShadow: '0 0 6px rgba(191, 219, 254, 1), 0 0 12px rgba(147, 197, 253, 0.6)'
        }}
        animate={{
          x: [window.innerWidth + 50, -100],
          y: [Math.random() * 150 + 100, Math.random() * 250 + 200],
          opacity: [0, 1, 1, 0]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatDelay: 8,
          delay: 3,
          ease: "easeOut",
          times: [0, 0.15, 0.85, 1]
        }}
      />

      {/* Constellation Lines (subtle) */}
      <svg className="absolute inset-0 w-full h-full opacity-20">
        <defs>
          <pattern id="constellation" x="0" y="0" width="200" height="200" patternUnits="userSpaceOnUse">
            <circle cx="50" cy="50" r="1" fill="white" opacity="0.6" />
            <circle cx="150" cy="80" r="1" fill="white" opacity="0.6" />
            <circle cx="100" cy="150" r="1" fill="white" opacity="0.6" />
            <line x1="50" y1="50" x2="150" y2="80" stroke="white" strokeWidth="0.5" opacity="0.3" />
            <line x1="150" y1="80" x2="100" y2="150" stroke="white" strokeWidth="0.5" opacity="0.3" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#constellation)" />
      </svg>

      {/* Floating Cosmic Particles */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.div
          key={`particle-${i}`}
          className="absolute w-0.5 h-0.5 bg-blue-200 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [-20, 20, -20],
            x: [-10, 10, -10],
            opacity: [0.2, 0.8, 0.2]
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "easeInOut"
          }}
        />
      ))}

      {/* Soft Moon Glow in Corner */}
      <motion.div
        className="absolute top-8 right-8 w-16 h-16 bg-gradient-to-br from-yellow-200/30 to-orange-200/20 rounded-full"
        style={{
          boxShadow: '0 0 60px rgba(254, 215, 170, 0.2), 0 0 120px rgba(254, 215, 170, 0.1)'
        }}
        animate={{
          opacity: [0.6, 0.9, 0.6],
          scale: [1, 1.05, 1]
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
}