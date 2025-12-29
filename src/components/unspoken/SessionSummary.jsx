
import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { JournalEntry } from '@/api/entities';
import { InvokeLLM } from '@/api/integrations';
import {
  X, BookOpen, Sparkles, Users, Heart, Brain,
  TrendingUp, MessageSquare, Loader2, CheckCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function SessionSummary({ responses, mode, onClose }) {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [saved, setSaved] = useState(false);

  const reflectedQuestions = responses.filter(r => !r.skipped);
  const skippedQuestions = responses.filter(r => r.skipped);

  const getAnalysis = useCallback(async () => {
    setIsAnalyzing(true);
    try {
      const questionsText = reflectedQuestions.map(r => `- ${r.question}`).join('\n');
      
      const prompt = `
        Analyze the following questions that a user reflected on during a mindful conversation session in ${mode} mode:

        ${questionsText}

        Based on these questions, provide insights about:
        1. Key themes and patterns in their interests
        2. Emotional areas they're exploring
        3. Growth opportunities they might be considering
        4. Recommended community groups (choose from: anxiety-support, depression-support, mens-mental-wellness, womens-mental-wellness, adhd-neurodivergence, trauma-recovery-ptsd, bpd-support, bipolar-mood-disorders, chronic-illness-mental-health, schizophrenia-support)
        5. Suggested activities (meditation, journaling, mood tracking, breathing exercises)

        Keep the tone supportive and encouraging. Focus on growth and self-discovery.
      `;

      const response_json_schema = {
        type: "object",
        properties: {
          key_themes: { 
            type: "array", 
            items: { type: "string" },
            description: "3-5 main themes identified in their reflection topics"
          },
          emotional_focus: { 
            type: "string",
            description: "Primary emotional area they're exploring (relationships, personal growth, self-acceptance, etc.)"
          },
          growth_opportunities: { 
            type: "array", 
            items: { type: "string" },
            description: "2-3 specific areas for personal development"
          },
          recommended_groups: { 
            type: "array", 
            items: { type: "string" },
            description: "1-2 community groups that might be helpful based on their interests"
          },
          suggested_activities: { 
            type: "array", 
            items: { 
              type: "object",
              properties: {
                activity: { type: "string" },
                reason: { type: "string" }
              }
            },
            description: "2-3 activities that align with their reflection themes"
          },
          encouragement_note: { 
            type: "string",
            description: "A personalized, encouraging message about their self-reflection journey"
          }
        },
        required: ["key_themes", "emotional_focus", "growth_opportunities", "recommended_groups", "suggested_activities", "encouragement_note"]
      };

      const result = await InvokeLLM({ prompt, response_json_schema });
      setAnalysis(result);
    } catch (error) {
      console.error("Analysis failed:", error);
      toast.error("Unable to analyze session. You can still save your questions to your journal.");
    }
    setIsAnalyzing(false);
  }, [reflectedQuestions, mode]); // Added reflectedQuestions and mode to dependencies

  const saveToJournal = async () => {
    setIsSaving(true);
    try {
      const today = format(new Date(), "yyyy-MM-dd");
      const modeCapitalized = mode.charAt(0).toUpperCase() + mode.slice(1);
      
      let journalContent = `# Unspoken Connections Session (${modeCapitalized} Mode)\n\n`;
      journalContent += `*Session completed on ${format(new Date(), 'MMMM d, yyyy')}*\n\n`;

      if (reflectedQuestions.length > 0) {
        journalContent += `## Questions I Reflected On:\n\n`;
        reflectedQuestions.forEach((response, index) => {
          journalContent += `**${index + 1}.** ${response.question}\n\n`;
          journalContent += `*[Space for your thoughts and reflections]*\n\n---\n\n`;
        });
      }

      if (skippedQuestions.length > 0) {
        journalContent += `## Questions I Skipped:\n\n`;
        skippedQuestions.forEach((response, index) => {
          journalContent += `- ${response.question}\n`;
        });
        journalContent += `\n*These might be worth revisiting when I'm ready.*\n\n`;
      }

      if (analysis) {
        journalContent += `## AI Insights:\n\n`;
        journalContent += `**Key Themes:** ${analysis.key_themes.join(', ')}\n\n`;
        journalContent += `**Emotional Focus:** ${analysis.emotional_focus}\n\n`;
        journalContent += `**Growth Opportunities:**\n`;
        analysis.growth_opportunities.forEach(opportunity => {
          journalContent += `- ${opportunity}\n`;
        });
        journalContent += `\n**Suggested Activities:**\n`;
        analysis.suggested_activities.forEach(activity => {
          journalContent += `- **${activity.activity}:** ${activity.reason}\n`;
        });
        journalContent += `\n**Personal Note:** ${analysis.encouragement_note}\n\n`;
      }

      journalContent += `---\n\n*This entry was created from your Unspoken Connections session. Feel free to add your own thoughts and reflections above.*`;

      await JournalEntry.create({
        title: `Unspoken Connections Reflection (${modeCapitalized} Mode)`,
        content: journalContent,
        prompt: `What insights did I gain from today's ${mode} reflection session?`,
        date: today,
        tags: ['unspoken-connections', 'reflection', mode, 'self-discovery'],
        mood_rating: 7, // Default to a positive mood for reflection
        is_favorite: false
      });

      // Garden activity removed (Mind Garden deleted)
      setSaved(true);
      toast.success("Session saved to your journal!");
    } catch (error) {
      console.error("Failed to save to journal:", error);
      toast.error("Unable to save to journal. Please try again.");
    }
    setIsSaving(false);
  };

  React.useEffect(() => {
    if (reflectedQuestions.length > 0) {
      getAnalysis();
    }
  }, [reflectedQuestions.length, getAnalysis]); // Added reflectedQuestions.length and getAnalysis to dependencies

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 p-4 md:p-8"
    >
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Session Complete
            </h1>
            <p className="text-gray-600 mt-2">
              You reflected on {reflectedQuestions.length} questions in {mode} mode
            </p>
          </div>
          <Button
            variant="ghost"
            onClick={onClose}
            className="rounded-full p-2"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Session Summary */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <MessageSquare className="w-5 h-5 text-purple-500" />
                Your Session Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-3 bg-purple-50 rounded-xl">
                  <div className="text-2xl font-bold text-purple-600">{reflectedQuestions.length}</div>
                  <div className="text-xs text-purple-500">Reflected On</div>
                </div>
                <div className="p-3 bg-pink-50 rounded-xl">
                  <div className="text-2xl font-bold text-pink-600">{skippedQuestions.length}</div>
                  <div className="text-xs text-pink-500">Skipped</div>
                </div>
                <div className="p-3 bg-indigo-50 rounded-xl">
                  <div className="text-2xl font-bold text-indigo-600 capitalize">{mode}</div>
                  <div className="text-xs text-indigo-500">Mode</div>
                </div>
              </div>

              {reflectedQuestions.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-3">Questions You Reflected On:</h3>
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {reflectedQuestions.slice(0, 5).map((response, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-xl text-sm">
                        <div className="flex items-start justify-between">
                          <span>{response.question}</span>
                          <Badge variant="outline" className="ml-2 text-xs">
                            Level {response.level}
                          </Badge>
                        </div>
                      </div>
                    ))}
                    {reflectedQuestions.length > 5 && (
                      <p className="text-sm text-gray-500 text-center">
                        ...and {reflectedQuestions.length - 5} more questions
                      </p>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* AI Analysis */}
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-indigo-500" />
                AI Insights
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isAnalyzing ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-indigo-500 mx-auto mb-3" />
                    <p className="text-gray-600">Analyzing your reflection patterns...</p>
                  </div>
                </div>
              ) : analysis ? (
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4" />
                      Key Themes
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {analysis.key_themes.map((theme, index) => (
                        <Badge key={index} className="bg-purple-100 text-purple-700">
                          {theme}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Heart className="w-4 h-4" />
                      Emotional Focus
                    </h3>
                    <p className="text-sm text-gray-700 bg-pink-50 p-3 rounded-xl">
                      {analysis.emotional_focus}
                    </p>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2 flex items-center gap-2">
                      <Brain className="w-4 h-4" />
                      Growth Opportunities
                    </h3>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {analysis.growth_opportunities.map((opportunity, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-indigo-500 mt-1">•</span>
                          {opportunity}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {analysis.recommended_groups.length > 0 && (
                    <div>
                      <h3 className="font-semibold mb-2 flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        Suggested Community Groups
                      </h3>
                      <div className="space-y-1">
                        {analysis.recommended_groups.map((group, index) => (
                          <Badge key={index} variant="outline" className="mr-2">
                            {group.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl border border-green-200">
                    <p className="text-sm text-green-800 italic">
                      {analysis.encouragement_note}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No analysis available for this session.
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <Button
            onClick={onClose}
            variant="outline"
            className="px-8 py-3 rounded-2xl"
          >
            Continue Exploring
          </Button>
          
          {!saved ? (
            <Button
              onClick={saveToJournal}
              disabled={isSaving}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-8 py-3 rounded-2xl font-semibold"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving to Journal...
                </>
              ) : (
                <>
                  <BookOpen className="w-4 h-4 mr-2" />
                  Save to Journal
                </>
              )}
            </Button>
          ) : (
            <Button
              disabled
              className="bg-green-500 text-white px-8 py-3 rounded-2xl font-semibold"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Saved to Journal
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
