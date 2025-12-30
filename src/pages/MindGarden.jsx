
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MindGardenPlant } from '@/api/entities';
import { User } from '@/api/entities';
import { Skeleton } from '@/components/ui/skeleton';
import { Sprout, Plus, Crown, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import Plant from '../components/garden/Plant';
import PlantingStation from '../components/garden/PlantingStation';
import SacredSeedSelector from '../components/garden/SacredSeedSelector';
import BackHeader from '../components/navigation/BackHeader'; // Added BackHeader

export default function MindGarden() {
  const [plants, setPlants] = useState([]);
  const [sacredPlants, setSacredPlants] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPlantingStation, setShowPlantingStation] = useState(false);
  const [showSacredSeedSelector, setShowSacredSeedSelector] = useState(false);
  const [viewMode, setViewMode] = useState('garden');

  const isSacredGroveActive = viewMode === 'grove'; // Derived state

  const loadGardenData = useCallback(async () => {
    setIsLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      
      const allPlants = await MindGardenPlant.list('-created_date');
      setPlants(allPlants.filter(p => !p.is_sacred));
      setSacredPlants(allPlants.filter(p => p.is_sacred));

    } catch (error) {
      console.error("Failed to load mind garden:", error);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadGardenData();
  }, [loadGardenData]);

  const handlePlant = () => {
    setShowPlantingStation(false);
    setShowSacredSeedSelector(false);
    loadGardenData();
  };

  const hasActivePlant = plants.some(p => p.is_active);
  const hasActiveSacredPlant = sacredPlants.some(p => p.is_active);

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-1000 ${isSacredGroveActive ? 'bg-gradient-to-b from-indigo-900 via-gray-900 to-black' : 'bg-gradient-to-b from-sky-300 via-teal-200 to-green-300'}`}>
      
      {/* Back Header - positioned over the background */}
      <BackHeader to={createPageUrl("Growth")} />
      
      <div className="absolute inset-0">
        {isLoading ? (
          <Skeleton className="w-full h-full bg-white/10" />
        ) : (
          <AnimatePresence>
            {(viewMode === 'garden' ? plants : sacredPlants).map(plant => <Plant key={plant.id} {...plant} />)}
          </AnimatePresence>
        )}
      </div>

      <div className="relative z-10 p-4 md:p-8 text-white space-y-4">
        <div className="text-center">
          <motion.h1 
            className="text-4xl font-bold drop-shadow-lg"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {viewMode === 'garden' ? 'Your Mind Garden' : 'The Sacred Grove'}
          </motion.h1>
          <motion.p 
            className="text-lg mt-2 drop-shadow"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            {viewMode === 'garden' 
              ? 'A place where your mindfulness journey blossoms.'
              : 'A premium space for your rarest seeds to flourish.'}
          </motion.p>
        </div>

        {user?.is_premium && (
          <div className="flex justify-center">
            <Tabs value={viewMode} onValueChange={setViewMode} className="w-full max-w-sm">
              <TabsList className="grid w-full grid-cols-2 bg-white/20 backdrop-blur-sm border border-white/30">
                <TabsTrigger value="garden">Mind Garden</TabsTrigger>
                <TabsTrigger value="grove" className="flex items-center gap-2">
                  <Crown className="w-4 h-4 text-yellow-300" /> Sacred Grove
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        )}
      </div>

      {!isLoading && (
        <motion.div 
          className="absolute bottom-24 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {viewMode === 'garden' && !hasActivePlant && !showPlantingStation && (
            <Button
              onClick={() => setShowPlantingStation(true)}
              className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Plant a New Seed
            </Button>
          )}

          {viewMode === 'grove' && user?.is_premium && !hasActiveSacredPlant && !showSacredSeedSelector && (
             <Button
              onClick={() => setShowSacredSeedSelector(true)}
              className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
            >
              <Star className="w-5 h-5" />
              Plant a Sacred Seed
            </Button>
          )}

          {viewMode === 'grove' && !user?.is_premium && (
            <Link to={createPageUrl("GoPremium")}>
               <Button
                className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
              >
                <Crown className="w-5 h-5" />
                Unlock the Sacred Grove
              </Button>
            </Link>
          )}
          
          {(viewMode === 'garden' && hasActivePlant) && (
            <div className="bg-black/30 backdrop-blur-sm text-white px-6 py-3 rounded-2xl flex items-center gap-3">
              <Sprout className="w-5 h-5"/>
              <p>Your current seed is growing. Complete activities to nurture it!</p>
            </div>
          )}

          {(viewMode === 'grove' && hasActiveSacredPlant) && (
             <div className="bg-black/30 backdrop-blur-sm text-white px-6 py-3 rounded-2xl flex items-center gap-3">
              <Star className="w-5 h-5 text-yellow-300"/>
              <p>Your sacred seed is growing. Keep up your premium habits!</p>
            </div>
          )}
        </motion.div>
      )}

      <AnimatePresence>
        {showPlantingStation && (
          <PlantingStation 
            onPlant={handlePlant}
            onCancel={() => setShowPlantingStation(false)}
          />
        )}
        {showSacredSeedSelector && user?.is_premium && (
          <SacredSeedSelector
            sacredSeeds={user.sacred_seeds || []}
            onPlant={handlePlant}
            onCancel={() => setShowSacredSeedSelector(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
