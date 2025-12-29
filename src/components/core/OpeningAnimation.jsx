
import React from 'react';
import { motion } from 'framer-motion';

export default function OpeningAnimation() {
  return (
    <motion.div
      className="w-screen h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-500 via-indigo-600 to-purple-700 overflow-hidden relative"
      exit={{ opacity: 0, transition: { duration: 0.5, ease: 'easeInOut' } }}
    >
      {/* Flying Dove using your exact image */}
      <motion.div
        className="relative"
        initial={{ 
          y: '100vh', // Start at bottom of screen
          scale: 0.8,
          opacity: 0
        }}
        animate={{
          y: '0vh', // Fly to center
          scale: 1,
          opacity: 1,
        }}
        transition={{
          duration: 3,
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
      >
        {/* DRAMATIC Wing Flapping Animation */}
        <motion.div
          className="relative"
          animate={{
            // BIG wing flapping - up and down motion
            scaleY: [1, 0.6, 1.4, 0.7, 1.3, 0.8, 1.2, 0.9, 1.1, 1],
            // Strong rotation during flaps
            rotateZ: [0, -8, 8, -6, 6, -4, 4, -2, 2, 0],
            // Wing stretch effect - much more dramatic
            scaleX: [1, 1.15, 0.85, 1.1, 0.9, 1.08, 0.92, 1.05, 0.95, 1],
          }}
          transition={{
            duration: 2.5, // Wing flapping during ascent
            times: [0, 0.11, 0.22, 0.33, 0.44, 0.55, 0.66, 0.77, 0.88, 1],
            ease: "easeInOut",
            repeat: 0
          }}
        >
          {/* Additional Wing Movement Effects */}
          <motion.div
            animate={{
              // More pronounced 3D wing movement
              rotateY: [0, 12, -12, 8, -8, 5, -5, 3, -3, 0],
              rotateX: [0, -8, 8, -6, 6, -4, 4, -2, 2, 0],
              // Slight perspective shift
              perspective: [1000, 800, 1200, 900, 1100, 950, 1050, 1000]
            }}
            transition={{
              duration: 2.0,
              times: [0, 0.12, 0.25, 0.37, 0.5, 0.62, 0.75, 0.87, 1],
              ease: "easeInOut"
            }}
          >
            {/* Gentle Hover at End */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 2.5,
                repeat: Infinity,
                repeatType: 'mirror',
                ease: 'easeInOut',
                delay: 2.8
              }}
            >
              <img
                src="https://qtrypzzcjebvfcihiynt.supabase.co/storage/v1/object/public/base44-prod/public/2777530d2_image.png"
                alt="Flying Dove"
                className="w-32 h-32 md:w-40 md:h-40 lg:w-48 lg:h-48 object-contain"
                style={{
                  filter: 'drop-shadow(0 8px 25px rgba(139, 92, 246, 0.4))',
                  transformStyle: 'preserve-3d'
                }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </motion.div>

      {/* "Mindful" Text Reveal */}
      <motion.h1
        className="text-white text-4xl md:text-5xl lg:text-6xl font-bold tracking-wider mt-8 text-center px-4"
        style={{ 
          fontFamily: 'ui-rounded, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          textShadow: '0 4px 20px rgba(139, 92, 246, 0.8), 0 0 30px rgba(255, 255, 255, 0.4)'
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ 
          opacity: 1, 
          scale: 1,
        }}
        transition={{ 
          duration: 0.8, 
          delay: 2.8, // Text appears faster
          ease: [0.25, 0.46, 0.45, 0.94]
        }}
      >
        Mindful
      </motion.h1>

      {/* Subtle Sparkles */}
      <motion.div
        className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/60 rounded-full"
        animate={{ 
          scale: [1, 1.5, 1], 
          opacity: [0.6, 1, 0.6] 
        }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          delay: 1.5 
        }}
      />
      <motion.div
        className="absolute top-1/3 right-1/4 w-1.5 h-1.5 bg-white/50 rounded-full"
        animate={{ 
          scale: [1, 2, 1], 
          opacity: [0.5, 0.8, 0.5] 
        }}
        transition={{ 
          duration: 4, 
          repeat: Infinity, 
          delay: 2.5 
        }}
      />
      <motion.div
        className="absolute bottom-1/4 left-1/3 w-1 h-1 bg-white/40 rounded-full"
        animate={{ 
          scale: [1, 1.8, 1], 
          opacity: [0.4, 0.7, 0.4] 
        }}
        transition={{ 
          duration: 2.5, 
          repeat: Infinity, 
          delay: 0.5 
        }}
      />
    </motion.div>
  );
}
