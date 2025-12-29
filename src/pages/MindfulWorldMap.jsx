
import React, { useState, useEffect, useCallback } from 'react';
import { WorldMapPin } from '@/api/entities';
import { User } from '@/api/entities';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, MapPin, Plus, Send, Globe, Sparkles, X, Bird } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import BackHeader from '../components/navigation/BackHeader';
import { createPageUrl } from "@/utils";

// Fix leaflet default markers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
});

// Custom pin icons based on color
const createCustomIcon = (color, hasHeart = false) => {
  const colors = {
    purple: '#8b5cf6',
    pink: '#ec4899',
    blue: '#3b82f6',
    green: '#10b981',
    gold: '#f59e0b'
  };

  return L.divIcon({
    html: `
      <div style="
        width: 32px; 
        height: 32px; 
        background: ${colors[color] || colors.purple}; 
        border: 3px solid white; 
        border-radius: 50%; 
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
      ">
        <div style="color: white; font-size: 16px;">📍</div>
        ${hasHeart ? '<div style="position: absolute; top: -8px; right: -8px; background: red; border-radius: 50%; width: 16px; height: 16px; display: flex; align-items: center; justify-content: center; font-size: 10px;">❤️</div>' : ''}
      </div>
    `,
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  });
};

// Component to handle map clicks
function AddPinOnClick({ onAddPin, isAddingPin }) {
  useMapEvents({
    click(e) {
      if (isAddingPin) {
        onAddPin(e.latlng.lat, e.latlng.lng);
      }
    },
  });
  return null;
}

export default function MindfulWorldMap() {
  const [pins, setPins] = useState([]);
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingPin, setIsAddingPin] = useState(false);
  const [newPinData, setNewPinData] = useState({
    lat: null,
    lng: null,
    message: '',
    color: 'purple'
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedPin, setSelectedPin] = useState(null);
  const [likedPins, setLikedPins] = useState(new Set());

  // Load map data
  const loadMapData = useCallback(async () => {
    setIsLoading(true);
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      const allPins = await WorldMapPin.list('-created_date');
      setPins(allPins.filter(pin => pin.is_approved));

      // Load user's liked pins from localStorage
      const savedLikes = localStorage.getItem(`mindful_map_likes_${currentUser.email}`);
      if (savedLikes) {
        setLikedPins(new Set(JSON.parse(savedLikes)));
      }
    } catch (error) {
      console.error('Failed to load map data:', error);
      toast.error('Failed to load map data');
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadMapData();
  }, [loadMapData]);

  // Handle adding a new pin
  const handleAddPin = (lat, lng) => {
    setNewPinData({ lat, lng, message: '', color: 'purple' });
    setShowAddModal(true);
    setIsAddingPin(false);
  };

  // Submit new pin
  const handleSubmitPin = async () => {
    if (!newPinData.message.trim()) {
      toast.error('Please enter a message');
      return;
    }

    if (newPinData.message.length > 280) {
      toast.error('Message must be 280 characters or less');
      return;
    }

    try {
      // Get location name using reverse geocoding (simplified)
      const locationName = `Lat: ${newPinData.lat.toFixed(4)}, Lng: ${newPinData.lng.toFixed(4)}`;

      await WorldMapPin.create({
        latitude: newPinData.lat,
        longitude: newPinData.lng,
        city: locationName,
        country: 'Unknown',
        message: newPinData.message.trim(),
        color: newPinData.color,
        hearts_count: 0
      });

      toast.success('Your encouraging message has been added to the map! 🌍');
      setShowAddModal(false);
      setNewPinData({ lat: null, lng: null, message: '', color: 'purple' });
      loadMapData();
    } catch (error) {
      console.error('Failed to add pin:', error);
      toast.error('Failed to add your message. Please try again.');
    }
  };

  // Handle liking a pin
  const handleLikePin = async (pin) => {
    if (likedPins.has(pin.id)) {
      toast.info('You already hearted this message');
      return;
    }

    try {
      const newHeartsCount = pin.hearts_count + 1;
      await WorldMapPin.update(pin.id, { hearts_count: newHeartsCount });

      // Update local state
      setPins(pins.map(p => 
        p.id === pin.id ? { ...p, hearts_count: newHeartsCount } : p
      ));

      const newLikedPins = new Set(likedPins);
      newLikedPins.add(pin.id);
      setLikedPins(newLikedPins);

      // Save to localStorage
      localStorage.setItem(`mindful_map_likes_${user.email}`, JSON.stringify([...newLikedPins]));
      
      toast.success('Heart sent! 💜');
    } catch (error) {
      console.error('Failed to like pin:', error);
      toast.error('Failed to send heart');
    }
  };

  const colorOptions = [
    { value: 'purple', label: 'Purple', bg: 'bg-purple-500' },
    { value: 'pink', label: 'Pink', bg: 'bg-pink-500' },
    { value: 'blue', label: 'Blue', bg: 'bg-blue-500' },
    { value: 'green', label: 'Green', bg: 'bg-green-500' },
    { value: 'gold', label: 'Gold', bg: 'bg-yellow-500' }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-main flex items-center justify-center">
        <div className="text-center">
          <Globe className="w-12 h-12 text-accent mx-auto mb-4 animate-spin" />
          <p className="text-secondary">Loading the world map...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Back Header */}
        <BackHeader 
          title="Mindful World Map" 
          subtitle="Share encouragement across the globe"
          backTo={createPageUrl("Community")}
          backLabel="Community"
        />

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <Card className="bg-gradient-to-r from-purple-100 to-indigo-100 border-0">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-700">{pins.length}</div>
              <div className="text-sm text-purple-600">Messages Worldwide</div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-pink-100 to-rose-100 border-0">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-pink-700">
                {pins.reduce((sum, pin) => sum + pin.hearts_count, 0)}
              </div>
              <div className="text-sm text-pink-600">Hearts Shared</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-100 to-emerald-100 border-0">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-700">{likedPins.size}</div>
              <div className="text-sm text-green-600">You've Hearted</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex justify-center gap-4"
        >
          <Button
            onClick={() => setIsAddingPin(!isAddingPin)}
            className={`${isAddingPin ? 'bg-green-600 hover:bg-green-700' : 'bg-accent hover:bg-accent/90'} text-white rounded-xl px-6 py-3 font-semibold shadow-lg`}
          >
            <Plus className="w-5 h-5 mr-2" />
            {isAddingPin ? 'Click on map to add pin' : 'Add Encouraging Message'}
          </Button>
        </motion.div>

        {/* Map Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="h-[600px] rounded-2xl overflow-hidden shadow-2xl border border-gray-200"
        >
          <MapContainer
            center={[20, 0]}
            zoom={2}
            style={{ height: '100%', width: '100%' }}
            className="z-10"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            
            <AddPinOnClick onAddPin={handleAddPin} isAddingPin={isAddingPin} />

            {pins.map((pin) => (
              <Marker
                key={pin.id}
                position={[pin.latitude, pin.longitude]}
                icon={createCustomIcon(pin.color, pin.hearts_count > 0)}
              >
                <Popup className="custom-popup">
                  <div className="p-2 max-w-xs">
                    <div className="text-sm font-medium text-gray-800 mb-2">
                      {pin.message}
                    </div>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{pin.city}</span>
                      <div className="flex items-center gap-2">
                        <span className="flex items-center gap-1">
                          <Heart className="w-3 h-3" />
                          {pin.hearts_count}
                        </span>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleLikePin(pin)}
                          disabled={likedPins.has(pin.id)}
                          className="p-1 h-6 w-6"
                        >
                          <Heart 
                            className={`w-3 h-3 ${likedPins.has(pin.id) ? 'text-red-500 fill-current' : 'text-gray-400'}`} 
                          />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </motion.div>

        {/* Instructions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <p className="text-sm text-secondary mb-2">
            Click on any pin to read encouraging messages from people around the world
          </p>
          <div className="flex justify-center">
            <Bird className="w-6 h-6 text-accent/50" />
          </div>
        </motion.div>
      </div>

      {/* Add Pin Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-800">Share Encouragement</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowAddModal(false)}>
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your encouraging message
                  </label>
                  <Textarea
                    value={newPinData.message}
                    onChange={(e) => setNewPinData({...newPinData, message: e.target.value})}
                    placeholder="Write something positive, inspiring, or encouraging for others to find..."
                    className="resize-none"
                    rows={3}
                    maxLength={280}
                  />
                  <div className="text-right text-xs text-gray-500 mt-1">
                    {newPinData.message.length}/280 characters
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pin color
                  </label>
                  <div className="flex gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color.value}
                        onClick={() => setNewPinData({...newPinData, color: color.value})}
                        className={`w-8 h-8 rounded-full ${color.bg} border-2 ${
                          newPinData.color === color.value ? 'border-gray-800' : 'border-gray-300'
                        } transition-all hover:scale-110`}
                        title={color.label}
                      />
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" onClick={() => setShowAddModal(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button onClick={handleSubmitPin} className="flex-1 bg-accent text-white">
                    <Send className="w-4 h-4 mr-2" />
                    Share Message
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
