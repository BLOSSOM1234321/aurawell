import React from 'react';
import { motion } from 'framer-motion';
import { Bird } from 'lucide-react';

const doveVariants = {
  glowing_white: {
    gradient: 'from-white to-gray-100',
    shadow: 'drop-shadow-lg drop-shadow-white/50',
    glow: 'shadow-white/50'
  },
  radiant_golden: {
    gradient: 'from-yellow-200 to-amber-300',
    shadow: 'drop-shadow-lg drop-shadow-yellow/70',
    glow: 'shadow-yellow-400/60'
  },
  mystical_purple: {
    gradient: 'from-purple-300 to-indigo-400',
    shadow: 'drop-shadow-lg drop-shadow-purple/70',
    glow: 'shadow-purple-400/60'
  }
};

export default function GlowingDove({ variant = 'glowing_white', size = 'large', onClick, className = '' }) {
  const variantStyle = doveVariants[variant];
  const sizeClass = size === 'large' ? 'w-16 h-16' : size === 'medium' ? 'w-12 h-12' : 'w-8 h-8';

  return (
    <motion.div
      className={`relative cursor-pointer ${className}`}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Ambient Glow */}
      <motion.div
        className={`absolute inset-0 rounded-full blur-xl opacity-70 ${variantStyle.glow} shadow-2xl`}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      
      {/* Dove Icon */}
      <motion.div
        className={`relative z-10 ${sizeClass} bg-gradient-to-br ${variantStyle.gradient} rounded-full flex items-center justify-center ${variantStyle.shadow}`}
        animate={{
          y: [0, -2, 0],
          rotate: [0, 2, -2, 0]
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        <Bird className={`${size === 'large' ? 'w-8 h-8' : size === 'medium' ? 'w-6 h-6' : 'w-4 h-4'} text-gray-700`} />
        
        {/* Wing Flap Animation */}
        <motion.div
          className="absolute inset-0"
          animate={{
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </motion.div>
      
      {/* Mystical Trail for Purple Variant */}
      {variant === 'mystical_purple' && (
        <motion.div
          className="absolute inset-0 -z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.3, 0] }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-purple-400 rounded-full"
              style={{
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)'
              }}
              animate={{
                x: [0, -20 - i * 10, -40 - i * 20],
                y: [0, -10 + i * 5, 10 - i * 5],
                opacity: [0, 0.6, 0],
                scale: [0.5, 1, 0.3]
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeOut"
              }}
            />
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}