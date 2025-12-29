import React from "react";
import { Badge } from "@/components/ui/badge";

const emotions = [
  "😊 Happy", "😢 Sad", "😰 Anxious", "😡 Angry", 
  "😴 Tired", "⚡ Energetic", "😌 Calm", "😤 Frustrated",
  "🥰 Loved", "😔 Lonely", "😬 Stressed", "🤗 Grateful",
  "😕 Confused", "🎉 Excited", "😑 Bored", "😨 Overwhelmed"
];

export default function EmotionSelector({ selected, onChange }) {
  const toggleEmotion = (emotion) => {
    const cleanEmotion = emotion.split(' ').slice(1).join(' ');
    if (selected.includes(cleanEmotion)) {
      onChange(selected.filter(e => e !== cleanEmotion));
    } else {
      onChange([...selected, cleanEmotion]);
    }
  };

  const isSelected = (emotion) => {
    const cleanEmotion = emotion.split(' ').slice(1).join(' ');
    return selected.includes(cleanEmotion);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium">
        What emotions are you experiencing? (Select all that apply)
      </label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {emotions.map((emotion) => (
          <Badge
            key={emotion}
            variant={isSelected(emotion) ? "default" : "outline"}
            className={`cursor-pointer p-3 text-center rounded-2xl transition-all duration-200 ${
              isSelected(emotion) 
                ? "bg-blue-500 text-white shadow-md" 
                : "hover:bg-blue-50 hover:border-blue-300"
            }`}
            onClick={() => toggleEmotion(emotion)}
          >
            {emotion}
          </Badge>
        ))}
      </div>
      {selected.length > 0 && (
        <p className="text-sm text-gray-600">
          Selected: {selected.join(", ")}
        </p>
      )}
    </div>
  );
}