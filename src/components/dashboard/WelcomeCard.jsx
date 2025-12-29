import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";
import { Skeleton } from "@/components/ui/skeleton";
import EmotionAvatar from './EmotionAvatar';

export default function WelcomeCard({ greeting, todayMood, isLoading, user }) {
  return (
    <Card className="bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-600 border-0 shadow-2xl text-white overflow-hidden relative">
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20" />
      <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-24 -translate-x-24" />
      
      <CardContent className="relative p-6 md:p-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex-1 space-y-4">
            <div className="flex items-center gap-3">
              <greeting.icon className="w-8 h-8 text-yellow-300" />
              <h1 className="text-3xl font-bold">{greeting.text}, {user?.preferred_name || user?.full_name || 'friend'}!</h1>
            </div>
            
            <p className="text-blue-100 text-lg">
              Today is {format(new Date(), "EEEE, MMMM d")}
            </p>
            
            {isLoading ? (
              <Skeleton className="h-6 w-48 bg-white/20" />
            ) : todayMood ? (
              <div className="flex items-center gap-3">
                <Badge className="bg-white/20 text-white border-white/30 px-4 py-2">
                  Today's mood: {todayMood.mood_score}/10
                </Badge>
                {todayMood.emotions && todayMood.emotions.length > 0 && (
                  <span className="text-blue-100">
                    Feeling: {todayMood.emotions.join(", ")}
                  </span>
                )}
              </div>
            ) : (
              <p className="text-blue-100">
                You haven't tracked your mood today yet.
              </p>
            )}
          </div>

          <div className="flex-shrink-0">
            {isLoading ? (
              <Skeleton className="w-32 h-32 rounded-full bg-white/20" />
            ) : (
              <EmotionAvatar 
                moodScore={todayMood?.mood_score} 
                streak={user?.meditation_streak || 0}
              />
            )}
          </div>
        </div>
        
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
            {!todayMood && (
              <Link to={createPageUrl("MoodTracker")}>
                <Button className="bg-white/20 hover:bg-white/30 text-white border border-white/30 backdrop-blur-sm px-6 py-3 rounded-2xl font-semibold w-full sm:w-auto">
                  Track Mood Now
                </Button>
              </Link>
            )}
            <Link to={createPageUrl("Journal")}>
              <Button className="bg-white text-blue-600 hover:bg-blue-50 px-6 py-3 rounded-2xl font-semibold shadow-lg w-full sm:w-auto">
                Write in Journal
              </Button>
            </Link>
        </div>
      </CardContent>
    </Card>
  );
}