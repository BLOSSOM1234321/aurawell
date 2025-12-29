import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Activity, BookOpen, Brain, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export default function QuickStats({ stats, isLoading }) {
  const statItems = [
    {
      title: "Weekly Average Mood",
      value: stats.averageMood > 0 ? `${stats.averageMood}/10` : "-",
      icon: TrendingUp,
      color: "from-emerald-500 to-green-600",
      bgColor: "from-emerald-50 to-green-50"
    },
    {
      title: "Mood Entries",
      value: stats.moodEntries,
      subtitle: "This week",
      icon: Activity,
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-50"
    },
    {
      title: "Journal Entries",
      value: stats.journalEntries,
      subtitle: "This week",
      icon: BookOpen,
      color: "from-amber-500 to-orange-600",
      bgColor: "from-amber-50 to-orange-50"
    },
    {
      title: "Meditations",
      value: stats.meditations,
      subtitle: "This week",
      icon: Brain,
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-50"
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statItems.map((item, index) => (
        <Card key={index} className={`bg-gradient-to-br ${item.bgColor} border-0 shadow-lg hover:shadow-xl transition-all duration-300`}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-600">
                  {item.title}
                </p>
                {isLoading ? (
                  <Skeleton className="h-8 w-16" />
                ) : (
                  <p className="text-2xl font-bold text-gray-900">
                    {item.value}
                  </p>
                )}
                {item.subtitle && (
                  <p className="text-xs text-gray-500">{item.subtitle}</p>
                )}
              </div>
              <div className={`p-3 rounded-2xl bg-gradient-to-r ${item.color} shadow-lg`}>
                <item.icon className="w-6 h-6 text-white" />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}