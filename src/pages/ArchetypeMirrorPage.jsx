
import React, { useState, useEffect, useCallback } from 'react';
import { User } from '@/api/entities';
import { createPageUrl } from '@/utils';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2, Gem, ArrowLeft } from 'lucide-react';
import { differenceInDays } from 'date-fns';
import { toast } from 'sonner';
import { archetypes } from '../components/archetype/archetypeData';
import ArchetypeSelector from '../components/archetype/ArchetypeSelector';
import ArchetypeDisplay from '../components/archetype/ArchetypeDisplay';
import ArchetypeHistory from '../components/archetype/ArchetypeHistory';

export default function ArchetypeMirrorPage() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCycleOver, setIsCycleOver] = useState(false);

  const loadUserData = useCallback(async () => {
    setIsLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);
      if (currentUser.archetype_start_date) {
        const daysPassed = differenceInDays(new Date(), new Date(currentUser.archetype_start_date));
        if (daysPassed >= 30) {
          setIsCycleOver(true);
        }
      }
    } catch (error) {
      console.error("Failed to load user data:", error);
      setUser(null);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  const handleSelectArchetype = async (archetypeKey) => {
    setIsLoading(true);
    try {
      const updatedUser = await User.updateMyUserData({
        current_archetype: archetypeKey,
        archetype_start_date: new Date().toISOString()
      });
      setUser(updatedUser);
      setIsCycleOver(false);
      toast.success(`Your journey as ${archetypes[archetypeKey].name} has begun!`);
    } catch (error) {
      console.error("Failed to set archetype:", error);
      toast.error("Could not start your new journey. Please try again.");
    }
    setIsLoading(false);
  };
  
  const handleEndCycle = async () => {
    setIsLoading(true);
    try {
      const newHistoryEntry = {
        archetype: user.current_archetype,
        start_date: user.archetype_start_date,
        end_date: new Date().toISOString(),
        completed_challenges: 5 // Dummy data, would be tracked properly
      };
      
      const newBadge = `archetype_${user.current_archetype}`;

      const updatedUser = await User.updateMyUserData({
        current_archetype: null,
        archetype_start_date: null,
        archetype_history: [...(user.archetype_history || []), newHistoryEntry],
        unlocked_archetype_badges: [...(user.unlocked_archetype_badges || []), newBadge]
      });

      setUser(updatedUser);
      setIsCycleOver(false);
      toast.success(`You've completed your journey as ${archetypes[user.current_archetype].name}!`, {
        description: "A new badge has been added to your collection."
      });
    } catch (error) {
      console.error("Failed to end cycle:", error);
      toast.error("Could not complete the cycle. Please try again.");
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-indigo-100">
        <Loader2 className="w-12 h-12 text-purple-600 animate-spin" />
      </div>
    );
  }

  if (!user || !user.is_premium) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-50 to-indigo-100 p-8">
        <Card className="max-w-md text-center bg-white/80 shadow-2xl">
          <CardContent className="p-8">
            <Gem className="w-12 h-12 mx-auto text-purple-600 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800">Unlock the Archetype Mirror</h2>
            <p className="text-gray-600 mt-2 mb-6">This is a premium feature. Subscribe to discover your inner archetypes and embark on a personalized journey of self-discovery.</p>
            <Link to={createPageUrl('GoPremium')}>
              <Button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold">
                Go Premium
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center">
          <Link to={createPageUrl('Sanctuary')}>
            <Button variant="outline" className="bg-white/50 backdrop-blur-sm rounded-full">
              <ArrowLeft className="w-4 h-4" />
            </Button>
          </Link>
        </div>

        {!user.current_archetype || isCycleOver ? (
          <ArchetypeSelector onSelect={handleSelectArchetype} isLoading={isLoading} />
        ) : (
          <ArchetypeDisplay user={user} archetypeData={archetypes[user.current_archetype]} onCycleEnd={handleEndCycle} />
        )}
        
        <div className="mt-12">
          <ArchetypeHistory history={user.archetype_history} />
        </div>
      </div>
    </div>
  );
}
