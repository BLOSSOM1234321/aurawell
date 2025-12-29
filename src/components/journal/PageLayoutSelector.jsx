import React from "react";
import { motion } from "framer-motion";
import { X, FileText, Grid, Minus, AlignLeft } from "lucide-react";

const layouts = [
  {
    id: "blank",
    name: "Blank Canvas",
    icon: FileText,
    description: "Free writing space - let your creativity flow",
    preview: "Clean and simple, perfect for free-form writing and sketching."
  },
  {
    id: "lined",
    name: "Lined Paper",
    icon: AlignLeft,
    description: "Horizontal lines for neat, organized writing",
    preview: "Classic notebook style with evenly spaced lines."
  },
  {
    id: "grid",
    name: "Grid Pattern",
    icon: Grid,
    description: "Grid pattern for structured layouts and diagrams",
    preview: "Perfect for lists, drawings, or organized thoughts."
  }
];

export default function PageLayoutSelector({ currentLayout, onSelectLayout, onClose }) {
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
        className="bg-white rounded-3xl p-6 max-w-lg w-full mx-4 shadow-2xl"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-xl">
              <Grid className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold">Page Layout</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
          {layouts.map((layout) => (
            <motion.button
              key={layout.id}
              onClick={() => onSelectLayout(layout.id)}
              className={`w-full flex items-start gap-4 p-4 rounded-2xl border-2 transition-all duration-200 text-left ${
                currentLayout === layout.id
                  ? 'border-purple-500 bg-purple-50'
                  : 'border-gray-200 hover:border-purple-300 hover:bg-purple-25'
              }`}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className={`p-3 rounded-xl flex-shrink-0 ${
                currentLayout === layout.id ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-600'
              }`}>
                <layout.icon className="w-6 h-6" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 mb-1">{layout.name}</h3>
                <p className="text-sm text-gray-600 mb-2">{layout.description}</p>
                <p className="text-xs text-gray-500">{layout.preview}</p>
              </div>
              {currentLayout === layout.id && (
                <div className="flex-shrink-0 self-center">
                  <div className="w-6 h-6 bg-purple-500 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                </div>
              )}
            </motion.button>
          ))}
        </div>

        <div className="mt-6 p-4 bg-blue-50 rounded-2xl">
          <p className="text-sm text-blue-600 text-center">
            ✨ Choose a layout that helps you express yourself best. You can change it anytime!
          </p>
        </div>
      </motion.div>
    </motion.div>
  );
}