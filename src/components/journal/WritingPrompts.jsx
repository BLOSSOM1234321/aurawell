import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, RefreshCw } from "lucide-react";

const prompts = [
  "What are three things you're grateful for today?",
  "Describe a moment when you felt truly at peace.",
  "What would you tell your younger self?",
  "Write about a person who has positively influenced your life.",
  "What does success mean to you right now?",
  "Describe your ideal day from start to finish.",
  "What fears are holding you back, and how can you overcome them?",
  "Write about a challenge that made you stronger.",
  "What brings you the most joy in life?",
  "If you could change one thing about the world, what would it be?",
  "What habits do you want to develop this year?",
  "Describe a place where you feel completely yourself.",
  "What lessons have your relationships taught you?",
  "Write about a time when you surprised yourself.",
  "What values guide your daily decisions?",
  "How do you want to be remembered?",
  "What creative project excites you most?",
  "Describe your relationship with change.",
  "What does self-care look like for you?",
  "Write about a dream you've never shared with anyone."
];

export default function WritingPrompts({ onPromptSelect }) {
  const [currentPrompts, setCurrentPrompts] = React.useState([]);

  React.useEffect(() => {
    refreshPrompts();
  }, []);

  const refreshPrompts = () => {
    const shuffled = [...prompts].sort(() => 0.5 - Math.random());
    setCurrentPrompts(shuffled.slice(0, 4));
  };

  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            Writing Prompts
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={refreshPrompts}
            className="hover:bg-yellow-50"
          >
            <RefreshCw className="w-4 h-4 text-yellow-600" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {currentPrompts.map((prompt, index) => (
          <div
            key={index}
            className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border border-yellow-200 hover:shadow-md transition-all duration-200 cursor-pointer"
            onClick={() => onPromptSelect(prompt)}
          >
            <p className="text-gray-700 mb-3 leading-relaxed">{prompt}</p>
            <Button
              variant="outline"
              size="sm"
              className="w-full rounded-2xl border-yellow-300 text-yellow-700 hover:bg-yellow-100"
            >
              Write about this
            </Button>
          </div>
        ))}
        
        <div className="pt-4 text-center">
          <p className="text-sm text-gray-500 mb-3">
            Need more inspiration?
          </p>
          <Button
            variant="outline"
            onClick={refreshPrompts}
            className="w-full rounded-2xl border-orange-300 text-orange-600 hover:bg-orange-50"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Get New Prompts
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}