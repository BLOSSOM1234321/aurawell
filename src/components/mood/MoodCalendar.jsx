import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from "date-fns";
import { CalendarDays } from "lucide-react";

export default function MoodCalendar({ entries }) {
  const currentMonth = new Date();
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const monthDays = eachDayOfInterval({ start: monthStart, end: monthEnd });

  const getMoodForDate = (date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return entries.find(entry => entry.date === dateStr);
  };

  const getMoodColor = (score) => {
    if (!score) return "bg-gray-100";
    if (score >= 8) return "bg-green-400";
    if (score >= 6) return "bg-yellow-400";
    if (score >= 4) return "bg-orange-400";
    return "bg-red-400";
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl">
            <CalendarDays className="w-5 h-5 text-white" />
          </div>
          {format(currentMonth, "MMMM yyyy")}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2 mb-4">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {monthDays.map((day) => {
            const mood = getMoodForDate(day);
            const isToday = isSameDay(day, new Date());
            
            return (
              <div
                key={day.toString()}
                className={`
                  aspect-square p-2 text-sm rounded-xl flex items-center justify-center
                  ${getMoodColor(mood?.mood_score)}
                  ${isToday ? "ring-2 ring-blue-500 ring-offset-2" : ""}
                  ${mood ? "text-white font-semibold" : "text-gray-600"}
                  transition-all duration-200 hover:scale-105
                `}
                title={mood ? `${format(day, "MMM d")}: ${mood.mood_score}/10` : format(day, "MMM d")}
              >
                {format(day, "d")}
              </div>
            );
          })}
        </div>
        <div className="flex justify-center gap-4 mt-4 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-red-400 rounded"></div>
            <span>Low</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-yellow-400 rounded"></div>
            <span>Medium</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-3 h-3 bg-green-400 rounded"></div>
            <span>High</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}