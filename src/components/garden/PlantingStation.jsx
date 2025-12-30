import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sprout, Palette, TreePine, X } from 'lucide-react';
import { MindGardenPlant } from '@/api/entities';

// Shared visual configuration for plants
const leafColors = {
  green: { primary: '#4ade80', secondary: '#22c55e' },
  purple: { primary: '#c084fc', secondary: '#a855f7' },
  blue: { primary: '#93c5fd', secondary: '#60a5fa' },
  pink: { primary: '#f9a8d4', secondary: '#f472b6' },
  autumn: { primary: '#facc15', secondary: '#f59e0b' },
};

const treeShapes = {
  oak: (color) => `<circle cx="50" cy="30" r="25" fill="${color.primary}" /><circle cx="35" cy="40" r="20" fill="${color.secondary}" /><circle cx="65" cy="40" r="20" fill="${color.secondary}" />`,
  cherry_blossom: (color) => `<circle cx="50" cy="35" r="20" fill="${color.primary}" /><circle cx="35" cy="30" r="15" fill="${color.secondary}" /><circle cx="65" cy="30" r="15" fill="${color.primary}" /><circle cx="50" cy="25" r="10" fill="${color.secondary}" />`,
  willow: (color) => `<path d="M50 10 C 20 40, 30 70, 50 70 C 70 70, 80 40, 50 10 Z" fill="${color.secondary}" /><path d="M50 15 C 30 45, 40 75, 50 75 C 60 75, 70 45, 50 15 Z" fill="${color.primary}" opacity="0.7" />`,
  pine: (color) => `<path d="M50 10 L70 40 L60 40 L75 70 L25 70 L40 40 L30 40 Z" fill="${color.primary}" /><path d="M50 20 L65 50 L55 50 L70 80 L30 80 L45 50 L35 50 Z" fill="${color.secondary}" opacity="0.6" />`,
};

const treeOptions = [
  { id: 'oak', name: 'Oak' },
  { id: 'cherry_blossom', name: 'Cherry' },
  { id: 'willow', name: 'Willow' },
  { id: 'pine', name: 'Pine' },
];

const colorOptions = [
  { id: 'green', name: 'Verdant Green', className: 'bg-green-400' },
  { id: 'purple', name: 'Mystic Purple', className: 'bg-purple-400' },
  { id: 'blue', name: 'Serene Blue', className: 'bg-blue-400' },
  { id: 'pink', name: 'Blossom Pink', className: 'bg-pink-400' },
  { id: 'autumn', name: 'Autumn Gold', className: 'bg-yellow-400' },
];

export default function PlantingStation({ onPlant, onCancel }) {
  const [selectedTree, setSelectedTree] = useState('oak');
  const [selectedColor, setSelectedColor] = useState('green');
  const [isLoading, setIsLoading] = useState(false);

  const handlePlantSeed = async () => {
    setIsLoading(true);
    try {
      const newPlant = {
        tree_type: selectedTree,
        leaf_color: selectedColor,
        growth_stage: 0,
        activities_logged: 0,
        is_active: true,
        position_x: Math.random() * 80 + 10,
        position_y: Math.random() * 50 + 10,
      };
      await MindGardenPlant.create(newPlant);
      onPlant();
    } catch (error) {
      console.error("Failed to plant seed:", error);
    }
    setIsLoading(false);
  };

  return (
    <motion.div
      className="absolute inset-0 bg-purple-900/30 backdrop-blur-sm z-30 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="w-full max-w-md max-h-[75vh] overflow-hidden"
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 20 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <Card className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-3xl border-0">
          <CardHeader className="relative pb-4">
            <button
              onClick={onCancel}
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
            >
              <X className="w-4 h-4 text-gray-600" />
            </button>
            <CardTitle className="text-center text-xl font-bold text-purple-800 pr-8">
              Plant a New Seed
            </CardTitle>
            <p className="text-center text-purple-700/80 text-sm">
              Choose a tree to nurture with your wellness activities.
            </p>
          </CardHeader>
          
          <CardContent className="space-y-5 max-h-[50vh] overflow-y-auto">
            <div>
              <h3 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                <TreePine className="w-4 h-4"/>
                Choose Tree Type
              </h3>
              <div className="grid grid-cols-2 gap-3">
                {treeOptions.map(tree => {
                  const isSelected = selectedTree === tree.id;
                  return (
                    <button
                      key={tree.id}
                      onClick={() => setSelectedTree(tree.id)}
                      className={`p-3 rounded-2xl border-2 transition-all duration-200 ${
                        isSelected 
                          ? 'border-purple-500 bg-purple-100 scale-105 shadow-lg' 
                          : 'border-transparent bg-gray-100 hover:bg-gray-200'
                      }`}
                    >
                      <svg viewBox="0 0 100 100" className="w-16 h-16 mx-auto mb-2 drop-shadow-sm">
                         <path d="M50 95 L50 35" stroke="#854d0e" strokeWidth="12" strokeLinecap="round" />
                         <g dangerouslySetInnerHTML={{ __html: treeShapes[tree.id](leafColors[selectedColor]) }} />
                      </svg>
                      <div className="text-sm font-medium text-gray-800">{tree.name}</div>
                    </button>
                  );
                })}
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
                <Palette className="w-4 h-4"/>
                Select Leaf Color
              </h3>
              <div className="flex flex-wrap justify-center gap-3">
                {colorOptions.map(color => (
                  <button
                    key={color.id}
                    onClick={() => setSelectedColor(color.id)}
                    className={`w-10 h-10 rounded-full transition-all duration-200 ring-offset-2 ring-offset-white ${
                      color.className
                    } ${
                      selectedColor === color.id 
                        ? 'ring-4 ring-purple-500 scale-110' 
                        : 'hover:scale-110'
                    }`}
                    title={color.name}
                  />
                ))}
              </div>
            </div>
          </CardContent>
          
          <div className="p-4 border-t border-gray-100">
            <Button
              onClick={handlePlantSeed}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold py-3 rounded-2xl shadow-lg hover:shadow-xl transition-all"
            >
              <Sprout className="w-5 h-5 mr-2" />
              {isLoading ? 'Planting...' : 'Plant Your Seed'}
            </Button>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  );
}