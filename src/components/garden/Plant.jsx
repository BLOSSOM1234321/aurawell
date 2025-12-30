import React from 'react';
import { motion } from 'framer-motion';

const leafColors = {
  // Regular
  green: { primary: '#4ade80', secondary: '#22c55e' },
  purple: { primary: '#c084fc', secondary: '#a855f7' },
  blue: { primary: '#93c5fd', secondary: '#60a5fa' },
  pink: { primary: '#f9a8d4', secondary: '#f472b6' },
  autumn: { primary: '#facc15', secondary: '#f59e0b' },
  // Sacred Grove
  celestial_blue: { primary: '#7dd3fc', secondary: '#38bdf8' },
  starlight: { primary: '#fde047', secondary: '#facc15' },
  sunfire_orange: { primary: '#fb923c', secondary: '#f97316' },
  moonpetal_pink: { primary: '#f9a8d4', secondary: '#f472b6' },
};

const treeShapes = {
  // Regular
  oak: (color) => `<circle cx="50" cy="30" r="25" fill="${color.primary}" /><circle cx="35" cy="40" r="20" fill="${color.secondary}" /><circle cx="65" cy="40" r="20" fill="${color.secondary}" />`,
  cherry_blossom: (color) => `<circle cx="50" cy="35" r="20" fill="${color.primary}" /><circle cx="35" cy="30" r="15" fill="${color.secondary}" /><circle cx="65" cy="30" r="15" fill="${color.primary}" /><circle cx="50" cy="25" r="10" fill="${color.secondary}" />`,
  willow: (color) => `<path d="M50 10 C 20 40, 30 70, 50 70 C 70 70, 80 40, 50 10 Z" fill="${color.secondary}" /><path d="M50 15 C 30 45, 40 75, 50 75 C 60 75, 70 45, 50 15 Z" fill="${color.primary}" opacity="0.7" />`,
  pine: (color) => `<path d="M50 10 L70 40 L60 40 L75 70 L25 70 L40 40 L30 40 Z" fill="${color.primary}" /><path d="M50 20 L65 50 L55 50 L70 80 L30 80 L45 50 L35 50 Z" fill="${color.secondary}" opacity="0.6" />`,
  // Sacred Grove
  glowing_willow: (color) => `${treeShapes.willow(color)}<filter id="glow"><feGaussianBlur stdDeviation="3.5" result="coloredBlur"/><feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge></filter><g filter="url(#glow)"/>`,
  crystal_lotus: (color) => `<path d="M50 80 L40 60 L45 60 L50 70 L55 60 L60 60 Z" fill="${color.primary}" opacity="0.8" /><path d="M50 75 L30 50 L40 55 L50 65 L60 55 L70 50 Z" fill="${color.secondary}" opacity="0.8" /><path d="M50 70 L20 40 L30 45 L50 55 L70 45 L80 40 Z" fill="${color.primary}" opacity="0.8" />`,
  starfall_tree: (color) => `${treeShapes.oak(color)}<circle cx="40" cy="20" r="2" fill="white" class="animate-pulse" /><circle cx="60" cy="30" r="2" fill="white" class="animate-pulse" style="animation-delay: 0.5s;" /><circle cx="50" cy="45" r="2" fill="white" class="animate-pulse" style="animation-delay: 1s;" />`,
  golden_bonsai: (color) => `<path d="M50 95 C 40 75, 60 65, 50 55 C 40 45, 70 40, 60 30" stroke="#854d0e" stroke-width="8" fill="none" stroke-linecap="round" /><g transform="translate(60, 30)">${treeShapes.cherry_blossom(color)}</g>`,
};

export default function Plant({ tree_type, leaf_color, growth_stage, position_x, position_y, is_sacred }) {
  const selectedColor = leafColors[leaf_color] || leafColors.green;

  const stageConfig = [
    // Stage 0: Seed
    { scale: 0.1, content: `<circle cx="50" cy="95" r="5" fill="${is_sacred ? '#eab308' : '#854d0e'}" />${is_sacred ? '<circle cx="50" cy="95" r="7" fill="yellow" opacity="0.5" class="animate-pulse" />' : ''}` },
    // Stage 1: Sprout
    { scale: 0.3, content: `<path d="M50 95 L50 80" stroke="${is_sacred ? '#eab308' : '#a16207'}" stroke-width="8" stroke-linecap="round" /><circle cx="50" cy="75" r="10" fill="${selectedColor.primary}" />` },
    // Stage 2: Small Tree
    { scale: 0.6, content: `<path d="M50 95 L50 55" stroke="${is_sacred ? '#ca8a04' : '#854d0e'}" stroke-width="10" stroke-linecap="round" />${(treeShapes[tree_type] || treeShapes.oak)(selectedColor)}` },
    // Stage 3: Mature Tree
    { scale: 1, content: `<path d="M50 95 L50 35" stroke="${is_sacred ? '#ca8a04' : '#854d0e'}" stroke-width="12" stroke-linecap="round" />${(treeShapes[tree_type] || treeShapes.oak)(selectedColor)}` },
  ];

  const currentStage = stageConfig[growth_stage] || stageConfig[0];

  return (
    <motion.div
      className="absolute"
      style={{
        left: `${position_x}%`,
        bottom: `${position_y}%`,
        width: 150,
        height: 150,
        transform: 'translateX(-50%)',
        zIndex: Math.round(position_y),
      }}
      initial={{ opacity: 0, y: 20, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <motion.svg
        viewBox="0 0 100 100"
        className={`w-full h-full drop-shadow-lg ${is_sacred ? 'saturate-150' : ''}`}
        initial={false}
        animate={{ scale: currentStage.scale }}
        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      >
        <g dangerouslySetInnerHTML={{ __html: currentStage.content }} />
      </motion.svg>
    </motion.div>
  );
}