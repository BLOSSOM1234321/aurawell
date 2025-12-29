import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Heart, 
  Smile, 
  Sun,
  Droplet,
  Leaf,
  Music,
  Coffee,
  Book
} from "lucide-react";

const selfCareActivities = [
  {
    name: "Deep Breathing",
    description: "4-7-8 breathing technique",
    duration: "2 min",
    icon: Leaf,
    color: "text-green-600",
    bgColor: "bg-green-50"
  },
  {
    name: "Gratitude Practice",
    description: "List 3 things you're grateful for",
    duration: "3 min",
    icon: Heart,
    color: "text-pink-600",
    bgColor: "bg-pink-50"
  },
  {
    name: "Mood Check-in",
    description: "Rate and reflect on your current mood",
    duration: "2 min",
    icon: Smile,
    color: "text-yellow-600",
    bgColor: "bg-yellow-50"
  },
  {
    name: "Mindful Observation",
    description: "Notice 5 things you can see around you",
    duration: "3 min",
    icon: Sun,
    color: "text-orange-600",
    bgColor: "bg-orange-50"
  },
  {
    name: "Progressive Relaxation",
    description: "Tense and release each muscle group",
    duration: "10 min",
    icon: Droplet,
    color: "text-blue-600",
    bgColor: "bg-blue-50"
  },
  {
    name: "Calming Music",
    description: "Listen to soothing sounds",
    duration: "5-15 min",
    icon: Music,
    color: "text-purple-600",
    bgColor: "bg-purple-50"
  }
];

export default function SelfCareTools() {
  const handleActivityClick = (activity) => {
    // Could implement specific self-care activities here
    alert(`Starting ${activity.name}. Take ${activity.duration} for yourself.`);
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-pink-400 to-rose-500 rounded-xl">
            <Heart className="w-5 h-5 text-white" />
          </div>
          Quick Self-Care
        </CardTitle>
        <p className="text-gray-600 text-sm">
          Take a few minutes for yourself with these simple activities
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {selfCareActivities.map((activity, index) => (
          <div
            key={index}
            className={`p-3 ${activity.bgColor} rounded-2xl border ${activity.color.replace('text-', 'border-').replace('600', '200')} cursor-pointer hover:shadow-md transition-all duration-200`}
            onClick={() => handleActivityClick(activity)}
          >
            <div className="flex items-center gap-3 mb-2">
              <activity.icon className={`w-4 h-4 ${activity.color}`} />
              <h3 className={`font-semibold ${activity.color}`}>
                {activity.name}
              </h3>
              <span className="ml-auto text-xs text-gray-500">
                {activity.duration}
              </span>
            </div>
            <p className="text-sm text-gray-600">
              {activity.description}
            </p>
          </div>
        ))}

        <div className="pt-4 border-t border-gray-200">
          <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-200">
            <div className="flex items-center gap-3 mb-2">
              <Coffee className="w-4 h-4 text-indigo-600" />
              <h3 className="font-semibold text-indigo-800">
                Self-Care Reminder
              </h3>
            </div>
            <p className="text-sm text-indigo-700">
              Remember: Self-care isn't selfish. Taking care of your mental health is essential for your overall well-being.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}