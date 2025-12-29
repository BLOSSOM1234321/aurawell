import React from 'react';
import { motion } from 'framer-motion';

const avatarStates = {
  happy: {
    eyes: "M 30 40 Q 35 35 40 40 M 60 40 Q 65 35 70 40",
    mouth: "M 40 55 Q 50 70 60 55",
    gradient: ["#a7f3d0", "#6ee7b7", "#34d399"],
    shadow: "drop-shadow(0 0 10px #34d399)"
  },
  neutral: {
    eyes: "M 30 40 H 40 M 60 40 H 70",
    mouth: "M 40 60 H 60",
    gradient: ["#bae6fd", "#7dd3fc", "#38bdf8"],
    shadow: "drop-shadow(0 0 8px #38bdf8)"
  },
  sad: {
    eyes: "M 30 40 Q 35 45 40 40 M 60 40 Q 65 45 70 40",
    mouth: "M 40 65 Q 50 50 60 65",
    gradient: ["#e0e7ff", "#c7d2fe", "#a5b4fc"],
    shadow: "drop-shadow(0 0 8px #a5b4fc)"
  },
  sleeping: {
    eyes: "M 30 40 Q 35 45 40 40 M 60 40 Q 65 45 70 40",
    mouth: "M 45 60 Q 50 65 55 60",
    gradient: ["#f3e8ff", "#e9d5ff", "#d8b4fe"],
    shadow: "drop-shadow(0 0 8px #d8b4fe)"
  }
};

const spring = {
  type: "spring",
  stiffness: 300,
  damping: 20
};

export default function EmotionAvatar({ moodScore, streak }) {
  let state = 'sleeping';
  if (moodScore) {
    if (moodScore >= 8) state = 'happy';
    else if (moodScore >= 6) state = 'neutral';
    else state = 'sad';
  }

  const { eyes, mouth, gradient, shadow } = avatarStates[state];
  const hasGlow = streak >= 7;

  return (
    <div className="relative w-32 h-32" title={state === 'sleeping' ? 'Log your mood to wake me up!' : `Feeling ${state} today!`}>
      {hasGlow && (
        <motion.div
          className="absolute inset-0 bg-yellow-300 rounded-full"
          animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          style={{ filter: 'blur(20px)' }}
        />
      )}
      <motion.svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        initial={false}
        animate={{ y: [-2, 2, -2] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      >
        <defs>
          <radialGradient id="avatarGradient" cx="40%" cy="40%" r="60%">
            <motion.stop offset="0%" stopColor={gradient[0]} animate={{ stopColor: gradient[0] }} transition={spring} />
            <motion.stop offset="70%" stopColor={gradient[1]} animate={{ stopColor: gradient[1] }} transition={spring} />
            <motion.stop offset="100%" stopColor={gradient[2]} animate={{ stopColor: gradient[2] }} transition={spring} />
          </radialGradient>
        </defs>

        {/* Main Body - Perfect Circle */}
        <motion.circle
          cx="50"
          cy="50"
          r="40"
          fill="url(#avatarGradient)"
          animate={{ filter: shadow }}
          transition={spring}
        />

        {/* Eyes */}
        <motion.path
          d={eyes}
          stroke="rgba(0,0,0,0.7)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          animate={{ d: eyes }}
          transition={spring}
        />

        {/* Mouth */}
        <motion.path
          d={mouth}
          stroke="rgba(0,0,0,0.7)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          animate={{ d: mouth }}
          transition={spring}
        />
        
        {/* Sleeping Z's */}
        {state === 'sleeping' && (
           <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
           >
            <text x="75" y="25" fontSize="8" fill="rgba(0,0,0,0.5)" fontFamily="Arial">Z</text>
            <text x="80" y="20" fontSize="6" fill="rgba(0,0,0,0.4)" fontFamily="Arial">Z</text>
            <text x="85" y="16" fontSize="4" fill="rgba(0,0,0,0.3)" fontFamily="Arial">Z</text>
           </motion.g>
        )}

        {/* Special Streak Crown */}
        {hasGlow && (
          <motion.g
            initial={{ y: -5, opacity: 0 }}
            animate={{ y: [-5, -7, -5], opacity: 1 }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <path d="M 40 15 L 45 5 L 50 10 L 55 5 L 60 15 Z" fill="#fbbf24" stroke="#f59e0b" strokeWidth="1" />
          </motion.g>
        )}
      </motion.svg>
    </div>
  );
}