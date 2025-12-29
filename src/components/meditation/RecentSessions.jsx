import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Brain, Clock, Star } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function RecentSessions({ sessions }) {
  const getCategoryColor = (category) => {
    const colors = {
      mindfulness: "bg-green-500",
      anxiety: "bg-blue-500",
      sleep: "bg-purple-500",
      focus: "bg-orange-500",
      stress: "bg-red-500",
      breathing: "bg-cyan-500"
    };
    return colors[category] || "bg-gray-500";
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-xl">
            <Brain className="w-5 h-5 text-white" />
          </div>
          Recent Sessions
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {sessions.length > 0 ? (
          sessions.map((session) => (
            <div key={session.id} className="p-3 bg-gray-50 rounded-2xl space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">{session.meditation_title}</h4>
                <Badge 
                  className={`${getCategoryColor(session.category)} text-white text-xs px-2 py-1`}
                >
                  {session.category}
                </Badge>
              </div>
              
              <div className="flex items-center gap-4 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {session.duration_minutes}m
                </div>
                {session.completion_rating && (
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 text-yellow-500" />
                    {session.completion_rating}/5
                  </div>
                )}
              </div>
              
              <p className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(session.created_date), { addSuffix: true })}
              </p>
              
              {session.notes && (
                <p className="text-sm text-gray-600 italic">
                  "{session.notes}"
                </p>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Brain className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No meditation sessions yet</p>
            <p className="text-sm">Start your first session!</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}