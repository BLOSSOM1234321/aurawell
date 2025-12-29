import React, { useState } from "react";
import { motion } from "framer-motion";
import { X, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";

const backgrounds = {
  solid: [
    { name: "Pure White", value: "#ffffff" },
    { name: "Soft Cream", value: "#fefbff" },
    { name: "Lavender Mist", value: "#faf5ff" },
    { name: "Rose Blush", value: "#fdf2f8" },
    { name: "Sky Blue", value: "#eff6ff" },
    { name: "Mint Green", value: "#ecfdf5" },
    { name: "Peach Dream", value: "#fff7ed" },
    { name: "Sunset Pink", value: "#fef7ff" },
    { name: "Ocean Breeze", value: "#f0f9ff" },
    { name: "Soft Yellow", value: "#fffbeb" },
    { name: "Gentle Gray", value: "#f9fafb" },
    { name: "Cherry Blossom", value: "#fce7f3" }
  ],
  gradient: [
    { 
      name: "Sunset Dreams", 
      value: "linear-gradient(135deg, #fff1f2 0%, #fecaca 30%, #fda4af 70%, #f9a8d4 100%)" 
    },
    { 
      name: "Ocean Waves", 
      value: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 30%, #bae6fd 70%, #a5f3fc 100%)" 
    },
    { 
      name: "Forest Whisper", 
      value: "linear-gradient(135deg, #f0fdf4 0%, #dcfce7 30%, #bbf7d0 70%, #a7f3d0 100%)" 
    },
    { 
      name: "Lavender Fields", 
      value: "linear-gradient(135deg, #faf5ff 0%, #f3e8ff 30%, #e9d5ff 70%, #ddd6fe 100%)" 
    },
    {
      name: "Peachy Keen",
      value: "linear-gradient(135deg, #fff7ed 0%, #ffedd5 30%, #fed7aa 70%, #fdba74 100%)"
    },
    {
      name: "Cotton Candy",
      value: "linear-gradient(135deg, #fdf2f8 0%, #fce7f3 30%, #fbcfe8 70%, #f9a8d4 100%)"
    }
  ],
  pattern: [
    {
      name: "Polka Dots",
      value: "radial-gradient(circle, #e5e7eb 2px, transparent 2px)"
    },
    {
      name: "Tiny Hearts",
      value: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' viewBox='0 0 20 20'%3E%3Cpath d='M10 15c-4-3-8-6-8-9 0-2 1-3 3-3s3 1 3 3c0-2 1-3 3-3s3 1 3 3c0 3-4 6-8 9z' fill='%23f3e8ff' opacity='0.4'/%3E%3C/svg%3E")`
    },
    {
      name: "Stars",
      value: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='25' height='25' viewBox='0 0 25 25'%3E%3Cpath d='M12.5 2l2 6h6l-5 4 2 6-5-4-5 4 2-6-5-4h6z' fill='%23fde047' opacity='0.3'/%3E%3C/svg%3E")`
    },
    {
      name: "Flowers",
      value: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='30' height='30' viewBox='0 0 30 30'%3E%3Ccircle cx='15' cy='15' r='3' fill='%23f472b6' opacity='0.3'/%3E%3Ccircle cx='15' cy='8' r='2' fill='%23f472b6' opacity='0.2'/%3E%3Ccircle cx='22' cy='15' r='2' fill='%23f472b6' opacity='0.2'/%3E%3Ccircle cx='15' cy='22' r='2' fill='%23f472b6' opacity='0.2'/%3E%3Ccircle cx='8' cy='15' r='2' fill='%23f472b6' opacity='0.2'/%3E%3C/svg%3E")`
    },
    {
      name: "Soft Grid",
      value: "linear-gradient(rgba(139, 92, 246, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(139, 92, 246, 0.1) 1px, transparent 1px)"
    }
  ]
};

export default function BackgroundSelector({ currentBackground, onSelectBackground, onClose }) {
  const [activeTab, setActiveTab] = useState("solid");

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black/50 flex items-center justify-center z-50"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-white rounded-3xl p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-auto shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-xl">
              <Palette className="w-5 h-5 text-purple-600" />
            </div>
            <h2 className="text-xl font-bold">Choose Background</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          {Object.keys(backgrounds).map((type) => (
            <Button
              key={type}
              variant={activeTab === type ? "default" : "outline"}
              onClick={() => setActiveTab(type)}
              className={`capitalize rounded-2xl ${
                activeTab === type 
                  ? 'bg-purple-500 text-white' 
                  : 'hover:bg-purple-50'
              }`}
            >
              {type}
            </Button>
          ))}
        </div>

        {/* Background Options */}
        <div className="grid grid-cols-3 md:grid-cols-4 gap-4">
          {backgrounds[activeTab].map((bg, index) => (
            <button
              key={index}
              onClick={() => onSelectBackground({ type: activeTab, value: bg.value })}
              className={`relative w-full h-20 rounded-2xl border-2 hover:scale-105 transition-all duration-200 overflow-hidden ${
                currentBackground.value === bg.value 
                  ? 'border-purple-500 ring-2 ring-purple-200' 
                  : 'border-gray-200 hover:border-purple-300'
              }`}
              style={
                activeTab === "gradient" 
                  ? { background: bg.value }
                  : activeTab === "pattern"
                  ? { 
                      backgroundColor: "#fef7ff",
                      backgroundImage: bg.value,
                      backgroundSize: activeTab === "pattern" && bg.name === "Soft Grid" ? "20px 20px" : "25px 25px"
                    }
                  : { backgroundColor: bg.value }
              }
              title={bg.name}
            >
              {/* Name overlay */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                <p className="text-white text-xs font-medium truncate">{bg.name}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-6 p-4 bg-purple-50 rounded-2xl">
          <p className="text-sm text-purple-600 text-center">
            💡 Choose a background that matches your mood and makes your journal feel personal!
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}