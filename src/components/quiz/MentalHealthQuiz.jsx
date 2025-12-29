
import React, { useState } from 'react';
import { User } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Brain, Heart, Users, ArrowRight, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const mentalHealthGroups = {
  'adhd-neurodivergence': { name: 'ADHD & Neurodivergence Support', color: 'from-blue-500 to-cyan-500' },
  'anxiety-support': { name: 'Anxiety Support', color: 'from-yellow-500 to-orange-500' },
  'bpd-support': { name: 'Borderline Personality Disorder (BPD) Support', color: 'from-pink-500 to-rose-500' },
  'bipolar-mood-disorders': { name: 'Bipolar & Mood Disorder Support', color: 'from-purple-500 to-indigo-500' },
  'depression-support': { name: 'Depression Support', color: 'from-green-500 to-teal-500' },
  'trauma-recovery-ptsd': { name: 'Trauma Recovery & PTSD Support', color: 'from-red-500 to-pink-500' },
  'womens-mental-wellness': { name: 'Women\'s Mental Wellness', color: 'from-rose-500 to-pink-500' },
  'schizophrenia-support': { name: 'Schizophrenia Support', color: 'from-indigo-500 to-purple-500' },
  'chronic-illness-mental-health': { name: 'Chronic Illness & Mental Health', color: 'from-teal-500 to-green-500' }
};

const quizQuestions = [
  {
    id: 1,
    question: "How often do you feel your thoughts are racing or difficult to organize?",
    answers: [
      { text: "Rarely", scores: {} },
      { text: "Sometimes", scores: { 'anxiety-support': 1 } },
      { text: "Often", scores: { 'adhd-neurodivergence': 1, 'anxiety-support': 1 } },
      { text: "Almost all the time", scores: { 'adhd-neurodivergence': 2 } }
    ]
  },
  {
    id: 2,
    question: "How often do you feel nervous, on edge, or easily overwhelmed by stress?",
    answers: [
      { text: "Never", scores: {} },
      { text: "Occasionally", scores: { 'anxiety-support': 1 } },
      { text: "Frequently", scores: { 'anxiety-support': 2 } },
      { text: "Almost constantly", scores: { 'anxiety-support': 2, 'trauma-recovery-ptsd': 1 } }
    ]
  },
  {
    id: 3,
    question: "Do you experience intense mood swings that affect your daily life?",
    answers: [
      { text: "No", scores: {} },
      { text: "Occasionally", scores: { 'anxiety-support': 1 } },
      { text: "Often", scores: { 'bpd-support': 1, 'bipolar-mood-disorders': 1 } },
      { text: "Constantly", scores: { 'bpd-support': 2, 'bipolar-mood-disorders': 2 } }
    ]
  },
  {
    id: 4,
    question: "Do you struggle to maintain focus or complete tasks on time?",
    answers: [
      { text: "Rarely", scores: {} },
      { text: "Sometimes", scores: { 'anxiety-support': 1 } },
      { text: "Often", scores: { 'adhd-neurodivergence': 2 } },
      { text: "Almost all the time", scores: { 'adhd-neurodivergence': 2, 'anxiety-support': 1 } }
    ]
  },
  {
    id: 5,
    question: "When facing difficult decisions, do you feel torn between extreme choices or emotions?",
    answers: [
      { text: "Never", scores: {} },
      { text: "Occasionally", scores: { 'anxiety-support': 1 } },
      { text: "Often", scores: { 'bpd-support': 1 } },
      { text: "Constantly", scores: { 'bpd-support': 2, 'bipolar-mood-disorders': 1 } }
    ]
  },
  {
    id: 6,
    question: "When you feel down, how long do those feelings usually last?",
    answers: [
      { text: "A few hours", scores: {} },
      { text: "A couple of days", scores: { 'anxiety-support': 1 } },
      { text: "A week or more", scores: { 'depression-support': 2 } },
      { text: "Endless", scores: { 'depression-support': 2, 'trauma-recovery-ptsd': 1 } }
    ]
  },
  {
    id: 7,
    question: "How often do you feel disconnected from your surroundings or like reality isn't real?",
    answers: [
      { text: "Never", scores: {} },
      { text: "Occasionally", scores: { 'anxiety-support': 1 } },
      { text: "Frequently", scores: { 'schizophrenia-support': 2 } },
      { text: "Almost constantly", scores: { 'schizophrenia-support': 2, 'trauma-recovery-ptsd': 1 } }
    ]
  },
  {
    id: 8,
    question: "Do you find it difficult to trust your own feelings or decisions?",
    answers: [
      { text: "Rarely", scores: {} },
      { text: "Sometimes", scores: { 'anxiety-support': 1 } },
      { text: "Often", scores: { 'bpd-support': 1, 'depression-support': 1 } },
      { text: "Constantly", scores: { 'bpd-support': 2, 'trauma-recovery-ptsd': 1 } }
    ]
  },
  {
    id: 9,
    question: "How often do you experience physical symptoms without a clear medical cause?",
    answers: [
      { text: "Never", scores: {} },
      { text: "Occasionally", scores: { 'anxiety-support': 1 } },
      { text: "Often", scores: { 'chronic-illness-mental-health': 1 } },
      { text: "Constantly", scores: { 'chronic-illness-mental-health': 2, 'anxiety-support': 1 } }
    ]
  },
  {
    id: 10,
    question: "How often do you revisit painful past experiences or trauma in your thoughts?",
    answers: [
      { text: "Rarely", scores: {} },
      { text: "Sometimes", scores: { 'anxiety-support': 1 } },
      { text: "Often", scores: { 'trauma-recovery-ptsd': 2 } },
      { text: "Constantly", scores: { 'trauma-recovery-ptsd': 2, 'depression-support': 1 } }
    ]
  },
  {
    id: 11,
    question: "How often do you feel emotions so strongly they seem uncontrollable?",
    answers: [
      { text: "Never", scores: {} },
      { text: "Occasionally", scores: { 'anxiety-support': 1 } },
      { text: "Often", scores: { 'bpd-support': 1 } },
      { text: "Constantly", scores: { 'bpd-support': 2, 'bipolar-mood-disorders': 1 } }
    ]
  },
  {
    id: 12,
    question: "Do you struggle with negative self-image or self-worth issues?",
    answers: [
      { text: "Rarely", scores: {} },
      { text: "Sometimes", scores: { 'anxiety-support': 1 } },
      { text: "Often", scores: { 'depression-support': 2 } },
      { text: "Constantly", scores: { 'depression-support': 2, 'bpd-support': 1 } }
    ]
  },
  {
    id: 13,
    question: "How often do you feel isolated or misunderstood by others?",
    answers: [
      { text: "Rarely", scores: {} },
      { text: "Sometimes", scores: { 'anxiety-support': 1 } },
      { text: "Often", scores: { 'depression-support': 1 } },
      { text: "Constantly", scores: { 'depression-support': 2, 'schizophrenia-support': 1 } }
    ]
  },
  {
    id: 14,
    question: "Do you experience sudden bursts of energy or restlessness that affect your daily routine?",
    answers: [
      { text: "Never", scores: {} },
      { text: "Occasionally", scores: { 'adhd-neurodivergence': 1 } },
      { text: "Often", scores: { 'adhd-neurodivergence': 2 } },
      { text: "Almost constantly", scores: { 'adhd-neurodivergence': 2, 'bipolar-mood-disorders': 1 } }
    ]
  },
  {
    id: 15,
    question: "How often do you experience intrusive thoughts about harm or danger?",
    answers: [
      { text: "Never", scores: {} },
      { text: "Occasionally", scores: { 'anxiety-support': 1 } },
      { text: "Often", scores: { 'anxiety-support': 2, 'trauma-recovery-ptsd': 1 } },
      { text: "Constantly", scores: { 'anxiety-support': 2, 'trauma-recovery-ptsd': 2 } }
    ]
  },
  {
    id: 16,
    question: "How often do you feel exhausted by your own emotions or mental state?",
    answers: [
      { text: "Rarely", scores: {} },
      { text: "Sometimes", scores: { 'anxiety-support': 1 } },
      { text: "Often", scores: { 'depression-support': 2 } },
      { text: "Constantly", scores: { 'depression-support': 2, 'trauma-recovery-ptsd': 1 } }
    ]
  },
  {
    id: 17,
    question: "Do you struggle to maintain consistent relationships due to emotional ups and downs?",
    answers: [
      { text: "Never", scores: {} },
      { text: "Occasionally", scores: { 'anxiety-support': 1 } },
      { text: "Often", scores: { 'bpd-support': 1 } },
      { text: "Constantly", scores: { 'bpd-support': 2, 'bipolar-mood-disorders': 1 } }
    ]
  },
  {
    id: 18,
    question: "How often do you experience hallucinations, hearing or seeing things others don't?",
    answers: [
      { text: "Never", scores: {} },
      { text: "Occasionally", scores: { 'anxiety-support': 1 } },
      { text: "Often", scores: { 'schizophrenia-support': 2 } },
      { text: "Almost constantly", scores: { 'schizophrenia-support': 2, 'trauma-recovery-ptsd': 1 } }
    ]
  },
  {
    id: 19,
    question: "Do you feel that your health issues impact your mental well-being frequently?",
    answers: [
      { text: "Rarely", scores: {} },
      { text: "Sometimes", scores: { 'anxiety-support': 1 } },
      { text: "Often", scores: { 'chronic-illness-mental-health': 2 } },
      { text: "Constantly", scores: { 'chronic-illness-mental-health': 2, 'depression-support': 1 } }
    ]
  },
  {
    id: 20,
    question: "Do you feel your mental health needs are unique as a woman or linked to gender-specific stressors?",
    answers: [
      { text: "Never", scores: {} },
      { text: "Occasionally", scores: { 'anxiety-support': 1 } },
      { text: "Often", scores: { 'womens-mental-wellness': 2 } },
      { text: "Constantly", scores: { 'womens-mental-wellness': 2, 'depression-support': 1 } }
    ]
  }
];

export default function MentalHealthQuiz({ onComplete }) {
  const [currentStep, setCurrentStep] = useState('intro'); // intro, questions, results
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [results, setResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleStartQuiz = () => {
    setCurrentStep('questions');
  };

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
  };

  const handleNextQuestion = () => {
    if (selectedAnswer === null) return;

    const newAnswers = {
      ...answers,
      [currentQuestion]: selectedAnswer
    };
    setAnswers(newAnswers);
    setSelectedAnswer(null);

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate results
      calculateResults(newAnswers);
    }
  };

  const calculateResults = (finalAnswers) => {
    const scores = {};
    
    // Initialize scores
    Object.keys(mentalHealthGroups).forEach(group => {
      scores[group] = 0;
    });

    // Calculate scores based on answers
    Object.entries(finalAnswers).forEach(([questionIndex, answerIndex]) => {
      const question = quizQuestions[parseInt(questionIndex)];
      const answer = question.answers[answerIndex];
      
      Object.entries(answer.scores).forEach(([group, points]) => {
        scores[group] += points;
      });
    });

    // Find primary and secondary recommendations
    const sortedGroups = Object.entries(scores)
      .filter(([group, score]) => score > 0)
      .sort(([, a], [, b]) => b - a);

    const primary = sortedGroups[0];
    const secondary = sortedGroups.slice(1).filter(([, score]) => primary && score >= primary[1] * 0.6);

    setResults({
      primary: primary ? { group: primary[0], score: primary[1] } : null,
      secondary: secondary.map(([group, score]) => ({ group, score })),
      allScores: scores
    });

    setCurrentStep('results');
  };

  const handleJoinRecommended = async () => {
    if (!results.primary) return;
    
    setIsLoading(true);
    try {
      await User.updateMyUserData({ 
        quiz_completed: true,
        recommended_groups: [results.primary.group],
        quiz_results: results
      });
      onComplete();
    } catch (error) {
      console.error('Error saving quiz results:', error);
    }
    setIsLoading(false);
  };

  const handleSelectOther = async () => {
    setIsLoading(true);
    try {
      await User.updateMyUserData({ 
        quiz_completed: true,
        quiz_results: results
      });
      onComplete();
    } catch (error) {
      console.error('Error saving quiz results:', error);
    }
    setIsLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="min-h-screen bg-gradient-to-br from-purple-500 via-indigo-600 to-purple-700 flex items-center justify-center p-4 md:p-8"
    >
      <div className="max-w-4xl w-full">
        {/* The back button functionality has been removed as per requirement. */}

        <AnimatePresence mode="wait">
          {currentStep === 'intro' && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="max-w-2xl w-full bg-white/95 backdrop-blur-sm shadow-2xl mx-auto">
                <CardHeader className="text-center space-y-6 pb-8">
                  <div className="mx-auto w-20 h-20 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center shadow-lg">
                    <Brain className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-3xl font-bold text-gray-800 mb-4">
                      Mindful Mental Health Quiz
                    </CardTitle>
                    <p className="text-lg text-gray-600 leading-relaxed">
                      Answer honestly to help us match you with the right support group(s). 
                      Your responses will help us understand your needs and connect you with others who share similar experiences.
                    </p>
                  </div>
                </CardHeader>
                <CardContent className="text-center space-y-6">
                  <div className="bg-purple-50 p-6 rounded-2xl">
                    <Heart className="w-8 h-8 text-purple-600 mx-auto mb-3" />
                    <p className="text-purple-800 font-medium">
                      This quiz takes about 5 minutes and helps create a personalized experience just for you.
                    </p>
                  </div>
                  <Button 
                    onClick={handleStartQuiz}
                    className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white text-lg py-6 rounded-2xl font-semibold shadow-lg"
                  >
                    Start Quiz
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {currentStep === 'questions' && (
            <motion.div
              key="questions" // Use a consistent key for the questions step
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <Card className="max-w-3xl w-full bg-white/95 backdrop-blur-sm shadow-2xl mx-auto">
                <CardHeader className="space-y-4">
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
                    <span>{Math.round(((currentQuestion + 1) / quizQuestions.length) * 100)}% Complete</span>
                  </div>
                  <Progress value={((currentQuestion + 1) / quizQuestions.length) * 100} className="h-2" />
                  <CardTitle className="text-2xl font-bold text-gray-800 leading-relaxed">
                    {quizQuestions[currentQuestion].question}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4">
                    {quizQuestions[currentQuestion].answers.map((answer, index) => (
                      <motion.button
                        key={index}
                        onClick={() => handleAnswerSelect(index)}
                        className={`p-6 text-left rounded-2xl border-2 transition-all duration-200 ${
                          selectedAnswer === index
                            ? 'border-purple-500 bg-purple-50 shadow-lg'
                            : 'border-gray-200 hover:border-purple-300 hover:bg-purple-25'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className="flex items-center gap-4">
                          <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            selectedAnswer === index
                              ? 'border-purple-500 bg-purple-500'
                              : 'border-gray-300'
                          }`}>
                            {selectedAnswer === index && (
                              <CheckCircle className="w-4 h-4 text-white" />
                            )}
                          </div>
                          <span className="text-lg font-medium text-gray-800">
                            {answer.text}
                          </span>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                  <div className="pt-6">
                    <Button
                      onClick={handleNextQuestion}
                      disabled={selectedAnswer === null}
                      className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white text-lg py-6 rounded-2xl font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {currentQuestion === quizQuestions.length - 1 ? 'See Results' : 'Next'}
                      <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {currentStep === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="max-w-4xl w-full bg-white/95 backdrop-blur-sm shadow-2xl mx-auto">
                <CardHeader className="text-center space-y-6">
                  <div className="mx-auto w-20 h-20 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center shadow-lg">
                    <Users className="w-10 h-10 text-white" />
                  </div>
                  <CardTitle className="text-3xl font-bold text-gray-800">
                    Your Recommended Group(s)
                  </CardTitle>
                  <p className="text-gray-600 text-lg">
                    Based on your responses, we've found the communities that best match your needs.
                  </p>
                </CardHeader>
                <CardContent className="space-y-8">
                  {results.primary && (
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">Primary Recommendation</h3>
                      <Card className={`bg-gradient-to-r ${mentalHealthGroups[results.primary.group].color} text-white shadow-xl`}>
                        <CardContent className="p-6">
                          <h4 className="text-2xl font-bold mb-2">
                            {mentalHealthGroups[results.primary.group].name}
                          </h4>
                          <p className="text-white/90 text-lg">
                            We recommend joining this group as your primary support community.
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {results.secondary.length > 0 && (
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800 mb-4">You May Also Consider</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {results.secondary.map(({ group }) => (
                          <Card key={group} className="border-2 hover:shadow-lg transition-shadow">
                            <CardContent className="p-4">
                              <h4 className="font-bold text-gray-800 mb-2">
                                {mentalHealthGroups[group].name}
                              </h4>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-4">
                    <Button
                      onClick={handleJoinRecommended}
                      disabled={isLoading || !results.primary}
                      className="flex-1 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white text-lg py-6 rounded-2xl font-semibold shadow-lg"
                    >
                      {isLoading ? 'Joining...' : 'Join Recommended Group'}
                    </Button>
                    <Button
                      onClick={handleSelectOther}
                      disabled={isLoading}
                      variant="outline"
                      className="flex-1 border-2 border-purple-500 text-purple-600 hover:bg-purple-50 text-lg py-6 rounded-2xl font-semibold"
                    >
                      Select Other Groups
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
