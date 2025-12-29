import React from "react";
import { Badge } from "@/components/ui/badge";

const activities = [
  "🏃 Exercise", "📚 Reading", "🎵 Music", "🧘 Meditation",
  "👥 Social", "💼 Work", "🎮 Gaming", "🍳 Cooking",
  "🚶 Walking", "🛒 Shopping", "📺 TV/Movies", "🎨 Creative",
  "🌿 Nature", "💻 Technology", "✈️ Travel", "🛌 Rest"
];

export default function ActivitySelector({ selected, onChange }) {
  const toggleActivity = (activity) => {
    const cleanActivity = activity.split(' ').slice(1).join(' ');
    if (selected.includes(cleanActivity)) {
      onChange(selected.filter(a => a !== cleanActivity));
    } else {
      onChange([...selected, cleanActivity]);
    }
  };

  const isSelected = (activity) => {
    const cleanActivity = activity.split(' ').slice(1).join(' ');
    return selected.includes(cleanActivity);
  };

  return (
    <div className="space-y-4">
      <label className="block text-sm font-medium">
        What activities did you do today? (Optional)
      </label>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {activities.map((activity) => (
          <Badge
            key={activity}
            variant={isSelected(activity) ? "default" : "outline"}
            className={`cursor-pointer p-3 text-center rounded-2xl transition-all duration-200 ${
              isSelected(activity) 
                ? "bg-purple-500 text-white shadow-md" 
                : "hover:bg-purple-50 hover:border-purple-300"
            }`}
            onClick={() => toggleActivity(activity)}
          >
            {activity}
          </Badge>
        ))}
      </div>
    </div>
  );
}