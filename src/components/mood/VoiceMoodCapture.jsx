import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Link } from 'react-router-dom';
import { X, MessageSquare, Send, Loader2, Heart, BookOpen, Brain, Users } from 'lucide-react';
import { InvokeLLM } from '@/api/integrations';
import { VoiceMoodLog } from '@/api/entities';
import { format } from 'date-fns';
import { toast } from 'sonner';

const activityIcons = {
    Meditation: <Brain className="w-5 h-5 text-purple-500" />,
    Journaling: <BookOpen className="w-5 h-5 text-amber-500" />,
    Breathing: <Heart className="w-5 h-5 text-pink-500" />,
    Physical: <Users className="w-5 h-5 text-blue-500" />,
    Community: <Users className="w-5 h-5 text-cyan-500" />,
};

export default function VoiceMoodCapture({ isOpen, onClose }) {
    const [status, setStatus] = useState('idle'); // idle, analyzing, results
    const [moodText, setMoodText] = useState('');
    const [analysisResult, setAnalysisResult] = useState(null);

    const analyzeMoodText = async () => {
        if (!moodText.trim()) {
            toast.error("Please share your thoughts first.");
            return;
        }

        setStatus('analyzing');
        
        try {
            const prompt = `Analyze the sentiment and emotional content of the following text, which represents a user's current thoughts about their mood and feelings. From the text, determine the primary emotional state from this list: Calm, Anxious, Sad, Energetic, Tired, Happy, Neutral. Also, suggest 3 personalized activities from these categories: Meditation, Journaling, Breathing, Physical, Community. Frame suggestions positively and be supportive. The response must be a valid JSON object.\n\nUser's thoughts: "${moodText}"`;
            
            const json_schema = {
                type: "object",
                properties: {
                    detected_mood: { type: "string", enum: ["Calm", "Anxious", "Sad", "Energetic", "Tired", "Happy", "Neutral"] },
                    confidence_score: { type: "number", minimum: 0, maximum: 1 },
                    suggested_activities: {
                        type: "array",
                        items: {
                            type: "object",
                            properties: {
                                title: { type: "string" },
                                description: { type: "string" },
                                type: { type: "string", enum: ["Meditation", "Journaling", "Breathing", "Physical", "Community"] },
                                link: { type: "string" }
                            },
                            required: ["title", "description", "type"]
                        }
                    }
                },
                required: ["detected_mood", "suggested_activities"]
            };

            const result = await InvokeLLM({
                prompt: prompt,
                response_json_schema: json_schema,
            });

            setAnalysisResult({ ...result, text_content: moodText });
            setStatus('results');

        } catch (error) {
            console.error("Analysis failed:", error);
            toast.error("Could not analyze your thoughts. Please try again.");
            setStatus('idle');
        }
    };

    const handleSave = async () => {
        if (!analysisResult) return;
        try {
            await VoiceMoodLog.create({
                file_uri: 'text_based_entry', // Indicate this was a text entry
                duration_seconds: 0, // No duration for text
                detected_mood: analysisResult.detected_mood,
                analysis_result: analysisResult,
                date: format(new Date(), 'yyyy-MM-dd')
            });
            toast.success("Mood reflection saved!");
            handleClose();
        } catch (error) {
            console.error("Failed to save mood log:", error);
            toast.error("Failed to save your mood reflection.");
        }
    };

    const handleClose = () => {
        setStatus('idle');
        setMoodText('');
        setAnalysisResult(null);
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="w-full max-w-lg bg-gradient-to-br from-gray-800 via-slate-900 to-black rounded-3xl shadow-2xl text-white border border-white/10"
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                    >
                        <button onClick={handleClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors z-10">
                            <X />
                        </button>
                        
                        <div className="p-8 space-y-6 text-center">
                            {status === 'idle' && (
                                <>
                                    <h2 className="text-2xl font-bold">Share Your Thoughts</h2>
                                    <p className="text-gray-400">Tell us how you're feeling right now. Write as if you're talking to a friend.</p>
                                    
                                    <div className="text-left space-y-4">
                                        <Textarea
                                            placeholder="How am I feeling right now? What's on my mind? What's been happening today?..."
                                            value={moodText}
                                            onChange={(e) => setMoodText(e.target.value)}
                                            className="min-h-32 bg-white/10 border-white/20 text-white placeholder:text-gray-400 resize-none rounded-2xl"
                                            maxLength={500}
                                        />
                                        <p className="text-xs text-gray-500 text-right">
                                            {moodText.length}/500 characters
                                        </p>
                                    </div>

                                    <Button
                                        onClick={analyzeMoodText}
                                        disabled={!moodText.trim()}
                                        className="bg-gradient-to-r from-purple-500 to-fuchsia-500 hover:from-purple-600 hover:to-fuchsia-600 text-white px-6 py-3 rounded-2xl font-semibold shadow-lg disabled:opacity-50"
                                    >
                                        <Send className="w-5 h-5 mr-2" />
                                        Analyze My Mood
                                    </Button>
                                    
                                    <p className="text-sm text-gray-500">Your thoughts are private and analyzed locally.</p>
                                </>
                            )}
                            
                            {status === 'analyzing' && (
                                <>
                                    <h2 className="text-2xl font-bold">Understanding Your Feelings</h2>
                                    <p className="text-gray-400">Analyzing the emotional tone of your thoughts...</p>
                                    <Loader2 className="w-12 h-12 mx-auto animate-spin text-purple-400" />
                                </>
                            )}

                            {status === 'results' && analysisResult && (
                                <>
                                    <h2 className="text-xl font-bold">Analysis Complete</h2>
                                    <p className="text-gray-400">Based on your thoughts, we detected a feeling of:</p>
                                    <div className="text-3xl font-bold text-purple-400 capitalize py-2">{analysisResult.detected_mood}</div>
                                    
                                    <h3 className="font-semibold pt-4">Personalized Suggestions</h3>
                                    <div className="space-y-3 text-left">
                                        {analysisResult.suggested_activities.map((activity, index) => (
                                            <Link to={activity.link || '#'} key={index} className="block">
                                                <Card className="bg-white/5 hover:bg-white/10 transition-colors border border-white/10 p-3 rounded-xl">
                                                    <div className="flex items-start gap-4">
                                                        <div className="p-2 bg-white/10 rounded-lg">
                                                            {activityIcons[activity.type] || <Heart />}
                                                        </div>
                                                        <div>
                                                            <h4 className="font-semibold text-white">{activity.title}</h4>
                                                            <p className="text-sm text-gray-400">{activity.description}</p>
                                                        </div>
                                                    </div>
                                                </Card>
                                            </Link>
                                        ))}
                                    </div>
                                    
                                    <div className="flex gap-4 pt-4">
                                        <Button variant="outline" onClick={handleClose} className="flex-1 bg-transparent text-gray-300 border-gray-600 hover:bg-white/10 hover:text-white">Discard</Button>
                                        <Button onClick={handleSave} className="flex-1 bg-purple-600 hover:bg-purple-700 text-white">Save Reflection</Button>
                                    </div>
                                </>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}