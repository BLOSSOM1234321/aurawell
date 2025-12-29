import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Play, Clock, Star, Bed, Brain as BrainIcon, Heart, Zap } from "lucide-react";

const meditations = [
  { id: 1, title: "Morning Mindfulness", description: "Start your day with clarity and presence.", duration: 10, goal: "Focus", level: "Beginner" },
  { id: 2, title: "Anxiety Relief", description: "Ease feelings of anxiety and tension.", duration: 10, goal: "Emotional Balance", level: "Beginner" },
  { id: 3, title: "Deep Sleep", description: "Prepare for restful sleep.", duration: 10, goal: "Sleep Aid", level: "Beginner" },
  { id: 4, title: "Focus Boost", description: "Sharpen your attention and clarity.", duration: 10, goal: "Focus", level: "Intermediate" },
  { id: 5, title: "Letting Go of Stress", description: "Release tension and mental clutter.", duration: 10, goal: "Stress Relief", level: "Beginner" },
  { id: 6, title: "Mindful Breathing", description: "Focus fully on your breath to bring calm and presence.", duration: 10, goal: "Emotional Balance", level: "Beginner" },
  { id: 7, title: "Walking Meditation", description: "Turn a simple walk into a mindful experience.", duration: 10, goal: "Stress Relief", level: "Intermediate" },
  { id: 8, title: "Body Scan for Sleep", description: "Prepare for deep relaxation and sleep.", duration: 10, goal: "Sleep Aid", level: "Advanced" },
  { id: 9, title: "Quick Reset", description: "Reset your mind and body during a busy day.", duration: 10, goal: "Focus", level: "Beginner" }
];

const goals = [
  { id: "all", name: "All Goals", icon: Star },
  { id: "Stress Relief", name: "Stress Relief", icon: Heart },
  { id: "Sleep Aid", name: "Sleep Aid", icon: Bed },
  { id: "Focus", name: "Focus", icon: Zap },
  { id: "Emotional Balance", name: "Emotional Balance", icon: BrainIcon },
];

const durations = [
  { id: "all", name: "Any Duration" },
  { id: "10", name: "10 minutes" },
];

const levels = [
  { id: "all", name: "All Levels" },
  { id: "Beginner", name: "Beginner" },
  { id: "Intermediate", name: "Intermediate" },
  { id: "Advanced", name: "Advanced" },
];

const getDurationCategory = (duration) => {
  if (duration === 10) return "10";
  return "all";
};

export default function MeditationLibrary({ onSelect }) {
  const [activeGoal, setActiveGoal] = useState("all");
  const [activeDuration, setActiveDuration] = useState("all");
  const [activeLevel, setActiveLevel] = useState("all");

  const filteredMeditations = meditations.filter(m => 
    (activeGoal === "all" || m.goal === activeGoal) &&
    (activeDuration === "all" || getDurationCategory(m.duration) === activeDuration) &&
    (activeLevel === "all" || m.level === activeLevel)
  );

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl">
            <BrainIcon className="w-5 h-5 text-white" />
          </div>
          Meditation Library
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4 p-4 bg-gray-50 rounded-2xl">
          <Label className="font-semibold text-gray-700">Filter by Goal</Label>
          <Tabs defaultValue="all" onValueChange={setActiveGoal}>
            <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full h-auto flex-wrap">
              {goals.map((goal) => (
                <TabsTrigger key={goal.id} value={goal.id} className="text-xs flex-grow flex items-center gap-1.5">
                  <goal.icon className="w-4 h-4" />
                  {goal.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <div className="grid md:grid-cols-2 gap-4 pt-2">
            <div>
              <Label className="font-semibold text-gray-700 mb-2 block">Duration</Label>
              <Select defaultValue="all" onValueChange={setActiveDuration}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Duration" />
                </SelectTrigger>
                <SelectContent>
                  {durations.map(d => <SelectItem key={d.id} value={d.id}>{d.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="font-semibold text-gray-700 mb-2 block">Experience</Label>
              <Select defaultValue="all" onValueChange={setActiveLevel}>
                <SelectTrigger className="rounded-xl">
                  <SelectValue placeholder="Experience" />
                </SelectTrigger>
                <SelectContent>
                  {levels.map(l => <SelectItem key={l.id} value={l.id}>{l.name}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          {filteredMeditations.length > 0 ? filteredMeditations.map((meditation) => (
            <Card key={meditation.id} className="border border-gray-200 hover:shadow-md transition-all duration-200">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{meditation.title}</h3>
                      <Badge variant="secondary" className="text-xs">{meditation.goal}</Badge>
                    </div>
                    
                    <p className="text-gray-600">{meditation.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {meditation.duration} min
                      </div>
                      <Badge variant="outline" className="text-xs">{meditation.level}</Badge>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={() => onSelect(meditation)}
                    className="ml-4 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-2xl px-6"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Start
                  </Button>
                </div>
              </CardContent>
            </Card>
          )) : (
            <div className="text-center py-8 text-gray-500">
              <p className="font-semibold">No meditations match your filters.</p>
              <p className="text-sm">Try adjusting your selection.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}