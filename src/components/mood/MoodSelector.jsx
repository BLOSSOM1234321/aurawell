import React from "react";
import { Slider } from "@/components/ui/slider";
import { Smile, Frown, Meh } from "lucide-react";

export default function MoodSelector({ value, onChange, sleepHours, onSleepChange }) {
  const getMoodEmoji = (score) => {
    if (score >= 9) return "😄";
    if (score >= 8) return "😊";
    if (score >= 7) return "🙂";
    if (score >= 6) return "😐";
    if (score >= 5) return "😕";
    if (score >= 4) return "😞";
    if (score >= 3) return "😢";
    if (score >= 2) return "😭";
    return "😰";
  };

  const getMoodColor = (score) => {
    if (score >= 8) return "text-green-500";
    if (score >= 6) return "text-yellow-500";
    if (score >= 4) return "text-orange-500";
    return "text-red-500";
  };

  return (
    <div className="space-y-8">
      {/* Mood Score */}
      <div className="space-y-4">
        <label className="block text-lg font-semibold">
          How are you feeling today?
        </label>
        <div className="text-center space-y-4">
          <div className="text-6xl">
            {getMoodEmoji(value)}
          </div>
          <div className={`text-2xl font-bold ${getMoodColor(value)}`}>
            {value}/10
          </div>
        </div>
        <div className="px-4">
          <Slider
            value={[value]}
            onValueChange={(values) => onChange(values[0])}
            max={10}
            min={1}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-gray-500 mt-2">
            <span>Very Low</span>
            <span>Neutral</span>
            <span>Very High</span>
          </div>
        </div>
      </div>

      {/* Sleep Hours */}
      <div className="space-y-4">
        <label className="block text-sm font-medium">
          Hours of Sleep: {sleepHours}h
        </label>
        <Slider
          value={[sleepHours]}
          onValueChange={(values) => onSleepChange(values[0])}
          max={12}
          min={3}
          step={0.5}
          className="w-full"
        />
        <div className="flex justify-between text-sm text-gray-500">
          <span>3h</span>
          <span>12h</span>
        </div>
      </div>
    </div>
  );
}