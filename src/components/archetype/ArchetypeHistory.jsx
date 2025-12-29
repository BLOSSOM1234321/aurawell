import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { archetypes } from './archetypeData';

export default function ArchetypeHistory({ history }) {
  if (!history || history.length === 0) {
    return (
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="text-lg">Your Journey So Far</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-4">Your archetype history will appear here as you complete cycles.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <CardTitle className="text-lg">Your Journey So Far</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {history.map((cycle, index) => {
          const archetypeData = archetypes[cycle.archetype];
          if (!archetypeData) return null;
          const Symbol = archetypeData.symbol;

          return (
            <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${archetypeData.color} flex-shrink-0 flex items-center justify-center`}>
                <Symbol className="w-5 h-5 text-white" />
              </div>
              <div className="flex-grow">
                <p className="font-semibold text-gray-800">{archetypeData.name}</p>
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  <span>{format(new Date(cycle.start_date), 'MMM yyyy')} - {format(new Date(cycle.end_date), 'MMM yyyy')}</span>
                </div>
              </div>
              <div className="flex items-center gap-1 text-xs text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full">
                <Award className="w-3 h-3" />
                <span>{cycle.completed_challenges || 0} tasks</span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}