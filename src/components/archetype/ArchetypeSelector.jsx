import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { archetypes } from './archetypeData';

export default function ArchetypeSelector({ onSelect, isLoading }) {
  return (
    <div className="text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold text-gray-800">Choose Your Archetype</h2>
        <p className="text-gray-600 mt-2">Begin your 30-day journey of self-discovery. A new path awaits.</p>
      </motion.div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Object.entries(archetypes).map(([key, archetype], index) => (
          <motion.div
            key={key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 + index * 0.1 }}
          >
            <Card className="bg-white/80 backdrop-blur-sm shadow-xl hover:shadow-2xl transition-shadow rounded-2xl h-full flex flex-col">
              <CardHeader className="items-center text-center">
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${archetype.color} flex items-center justify-center mb-3 shadow-lg`}>
                  <archetype.symbol className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-xl text-gray-800">{archetype.name}</CardTitle>
              </CardHeader>
              <CardContent className="text-center flex-grow flex flex-col">
                <p className="text-gray-600 text-sm flex-grow mb-6">{archetype.description}</p>
                <Button
                  onClick={() => onSelect(key)}
                  disabled={isLoading}
                  className={`w-full bg-gradient-to-r ${archetype.color} text-white font-semibold rounded-lg`}
                >
                  Begin as {archetype.name}
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}