import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Globe, Heart, Users, Sparkles, X, ChevronsDown, ChevronsUp } from 'lucide-react';
import InteractiveGlobe from './InteractiveGlobe';

export default function MindfulWorldMap() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [totalPins, setTotalPins] = useState(0);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => {
          console.log("Location access denied, using default location");
          setUserLocation({ lat: 40.7128, lng: -74.0060 }); // New York
        }
      );
    }
  }, []);

  return (
    <motion.div
      className="relative rounded-3xl overflow-hidden shadow-xl border border-purple-200/50 bg-purple-50"
      animate={{ height: isExpanded ? '70vh' : 'auto' }}
      initial={false}
      transition={{ duration: 0.7, ease: [0.32, 0.72, 0, 1] }}
    >
      <AnimatePresence initial={false} mode="wait">
        {!isExpanded ? (
          <motion.div
            key="compact"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={() => setIsExpanded(true)}
            className="cursor-pointer"
          >
            <Card className="bg-transparent border-0">
              <CardHeader className="relative pb-4">
                <CardTitle className="flex items-center justify-between relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-xl shadow-lg">
                      <Globe className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">Mindful World Map</h3>
                      <p className="text-sm text-gray-600 font-normal">Share encouragement globally</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-purple-100 text-purple-700">
                      <Sparkles className="w-3 h-3 mr-1" />
                      {totalPins} messages
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-400 via-purple-500 to-indigo-600 rounded-full shadow-lg flex items-center justify-center">
                      <InteractiveGlobe 
                        isCompact={true} 
                        userLocation={userLocation}
                        onPinCountUpdate={setTotalPins}
                      />
                    </div>
                    <div className="text-sm text-gray-600">
                      <p className="flex items-center gap-1 mb-1">
                        <Heart className="w-4 h-4 text-red-400" />
                        Tap to explore messages of hope from around the world
                      </p>
                      <p className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-blue-400" />
                        Add your own anonymous encouragement
                      </p>
                    </div>
                  </div>
                  <div className="text-purple-600 font-semibold flex items-center gap-1">
                    Expand <ChevronsDown className="w-4 h-4"/>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="expanded"
            className="w-full h-full bg-gradient-to-b from-indigo-800 via-purple-800 to-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <motion.button
              onClick={() => setIsExpanded(false)}
              className="absolute top-4 right-4 z-50 p-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full text-white transition-all flex items-center gap-1 text-sm"
            >
              <ChevronsUp className="w-4 h-4" /> Close
            </motion.button>

            <motion.div 
              className="absolute top-0 left-0 right-0 z-40 p-4 bg-gradient-to-b from-black/50 to-transparent pointer-events-none"
            >
              <h2 className="text-2xl font-bold text-white mb-1 flex items-center gap-3">
                <Globe className="w-6 h-6 text-purple-300" />
                Mindful World Map
              </h2>
              <p className="text-purple-200 text-sm">
                Discover encouraging messages from mindful souls around the globe.
              </p>
            </motion.div>

            <div className="w-full h-full pt-16">
              <InteractiveGlobe 
                isCompact={false}
                userLocation={userLocation}
                onPinCountUpdate={setTotalPins}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}