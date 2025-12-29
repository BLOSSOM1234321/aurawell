import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Circle, CircleMember, CircleMessage } from '@/api/entities';
import { User } from '@/api/entities';
import { 
  Sparkles, 
  Plus, 
  Users, 
  Heart, 
  Crown,
  MessageCircle,
  Timer,
  Zap
} from 'lucide-react';
import CreateCircleForm from './CreateCircleForm';
import CircleCard from './CircleCard';
import CircleView from './CircleView';

const anonymousNames = [
  "Luminous Dove 🌿", "Gentle Swan 🌸", "Serene Owl 🍃", "Peaceful Fox 🌺",
  "Quiet Deer 🌙", "Calm Butterfly 🌻", "Soft Eagle 🌼", "Kind Wolf 🌹",
  "Pure Rabbit 🌾", "Sacred Crane 🍂", "Wise Turtle 🌛", "Noble Bear 🌷"
];

const getRandomAnonymousName = () => {
  return anonymousNames[Math.floor(Math.random() * anonymousNames.length)];
};

export default function CircleOfLight({ userCircles, onRefresh, showCreateForm, onToggleCreateForm }) {
  const [selectedCircle, setSelectedCircle] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-600 text-white border-0 shadow-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-2xl font-bold flex items-center gap-2">
                  Circle of Light
                  <Badge className="bg-yellow-400/20 text-yellow-100 border-yellow-300/50">
                    <Crown className="w-3 h-3 mr-1" />
                    Premium
                  </Badge>
                </CardTitle>
                <p className="text-purple-100">Intimate spaces for deeper connection and growth</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-purple-100">Your Circles</div>
              <div className="text-2xl font-bold">{userCircles.length}/3</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Create Circle Form */}
      <AnimatePresence>
        {showCreateForm && (
          <CreateCircleForm 
            onClose={() => onToggleCreateForm()}
            onSuccess={() => {
              onToggleCreateForm();
              onRefresh();
            }}
          />
        )}
      </AnimatePresence>

      {/* Circle View */}
      <AnimatePresence>
        {selectedCircle && (
          <CircleView 
            circle={selectedCircle}
            onClose={() => setSelectedCircle(null)}
            onRefresh={onRefresh}
          />
        )}
      </AnimatePresence>

      {/* User's Circles */}
      {userCircles.length > 0 ? (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold text-gray-800">Your Circles</h3>
            {userCircles.length < 3 && (
              <Button
                onClick={onToggleCreateForm}
                className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-2xl px-4 py-2"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Circle
              </Button>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userCircles.map(circle => (
              <CircleCard
                key={circle.id}
                circle={circle}
                onClick={() => setSelectedCircle(circle)}
              />
            ))}
          </div>
        </div>
      ) : (
        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 shadow-lg">
          <CardContent className="text-center py-12">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-full flex items-center justify-center">
              <Sparkles className="w-10 h-10 text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Create Your First Circle</h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Start an intimate group for deeper sharing and connection. Choose a theme and invite up to 9 other premium members.
            </p>
            <Button
              onClick={onToggleCreateForm}
              className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-2xl px-6 py-3 font-semibold"
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Your Circle
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}