import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, BookOpen } from "lucide-react";
import { format } from "date-fns";

export default function JournalEntries({ entries, onEdit, searchQuery }) {
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  const highlightSearchTerm = (text, searchQuery) => {
    if (!searchQuery.trim()) return text;
    
    const regex = new RegExp(`(${searchQuery})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, index) => 
      regex.test(part) ? (
        <mark key={index} className="bg-yellow-200 px-1 rounded">
          {part}
        </mark>
      ) : part
    );
  };

  return (
    <div className="space-y-4">
      {entries.length > 0 ? (
        entries.map((entry) => (
          <Card key={entry.id} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">
                      {entry.title ? highlightSearchTerm(entry.title, searchQuery) : 'Untitled Entry'}
                    </h3>
                    {entry.mood_rating && (
                      <Badge variant="outline" className="text-xs">
                        Mood: {entry.mood_rating}/10
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 mb-3">
                    {format(new Date(entry.created_date), "EEEE, MMMM d, yyyy 'at' h:mm a")}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  onClick={() => onEdit(entry)}
                  className="p-2 hover:bg-amber-50"
                >
                  <Edit className="w-4 h-4 text-amber-600" />
                </Button>
              </div>

              {entry.prompt && (
                <div className="mb-4 p-3 bg-amber-50 rounded-xl border border-amber-200">
                  <p className="text-sm text-amber-700 italic">
                    Prompt: {highlightSearchTerm(entry.prompt, searchQuery)}
                  </p>
                </div>
              )}

              <div className="mb-4">
                <p className="text-gray-700 leading-relaxed">
                  {highlightSearchTerm(truncateText(entry.content, 300), searchQuery)}
                </p>
              </div>

              {entry.tags && entry.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {entry.tags.map((tag, index) => (
                    <Badge 
                      key={index} 
                      variant="secondary" 
                      className="px-3 py-1 rounded-2xl bg-amber-100 text-amber-800"
                    >
                      {highlightSearchTerm(tag, searchQuery)}
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        ))
      ) : (
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
          <CardContent className="p-12 text-center">
            <BookOpen className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {searchQuery ? 'No entries found' : 'No journal entries yet'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchQuery 
                ? `No entries match "${searchQuery}". Try a different search term.`
                : 'Start your journaling journey by writing your first entry.'
              }
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}