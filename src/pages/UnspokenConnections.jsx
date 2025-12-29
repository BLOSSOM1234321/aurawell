
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Heart, Star, SkipForward, Shuffle, Sparkles, Dices, User, Users, BookOpen, PlusCircle, Crown, TrendingUp, Zap, ArrowLeft, Gamepad2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  soloQuestions, 
  duoQuestions, 
  groupQuestions, 
  soloDares,
  duoDares,
  groupDares,
  destinyQuestions,
  sessionPaths,
  premiumDecks,
  secretWildCards
} from '../components/unspoken/unspokenData';
import DareModal from '../components/unspoken/DareModal';
import DestinyDrawModal from '../components/unspoken/DestinyDrawModal';
import QuestionCard from '../components/unspoken/QuestionCard';
import LevelProgress from '../components/unspoken/LevelProgress';
import SessionSummary from '../components/unspoken/SessionSummary';
import { User as UserEntity } from '@/api/entities'; 
import { CustomCard } from '@/api/entities';
import CustomCardCreator from '../components/unspoken/CustomCardCreator';
import { createPageUrl } from '@/utils'; 
import { toast } from 'sonner'; 
import BackHeader from '../components/navigation/BackHeader';

const shuffleArray = (array) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex], array[currentIndex]];
  }
  return array;
};

const getQuestionSet = (mode, level, selectedPath = null, premiumDeck = null) => {
  if (premiumDeck && premiumDecks[premiumDeck]) {
    return premiumDecks[premiumDeck].questions[`level${level}`] || [];
  }
  
  if (mode === 'premium_path' && selectedPath && sessionPaths[selectedPath]) {
    return sessionPaths[selectedPath].questions[`level${level}`] || [];
  }

  if (typeof mode === 'object' && mode !== null) {
    return mode.questions?.[`level${level}`] || [];
  }

  const questionSets = {
    solo: soloQuestions,
    duo: duoQuestions,
    group: groupQuestions
  };
  return questionSets[mode]?.[`level${level}`] || [];
};

const getDareSet = (mode) => {
  switch (mode) {
    case 'duo': return duoDares;
    case 'group': return groupDares;
    case 'solo':
    default: return soloDares;
  }
};

const checkForSecretWildCard = () => {
  const now = new Date();
  const hour = now.getHours();
  const day = now.getDay();
  
  if (hour >= 22 || hour <= 5) {
    return secretWildCards.find(card => card.condition === 'late_night');
  }
  if (hour >= 5 && hour <= 7) {
    return secretWildCards.find(card => card.condition === 'sunrise');
  }
  if (day === 0 || day === 6) {
    return secretWildCards.find(card => card.condition === 'weekend');
  }
  
  if (Math.random() < 0.05) {
    const availableCards = secretWildCards.filter(card => 
      !['late_night', 'sunrise', 'weekend'].includes(card.condition)
    );
    return availableCards[Math.floor(Math.random() * availableCards.length)];
  }
  
  return null;
};

const STORAGE_KEY = 'unspoken_connections_progress';
const QUESTIONS_TO_UNLOCK_NEXT_LEVEL = 5;

export default function UnspokenConnections() {
  const [sessionStarted, setSessionStarted] = useState(false);
  const [mode, setMode] = useState(null);
  const [selectedPath, setSelectedPath] = useState(null);
  const [selectedPremiumDeck, setSelectedPremiumDeck] = useState(null);
  const [stackedMode, setStackedMode] = useState(false);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [unlockedLevels, setUnlockedLevels] = useState([1]);
  const [shuffledIndices, setShuffledIndices] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState(new Set()); 
  const [showDare, setShowDare] = useState(false);
  const [currentDare, setCurrentDare] = useState('');
  const [showDestiny, setShowDestiny] = useState(false);
  const [destinyQuestion, setDestinyQuestion] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);
  const [sessionResponses, setSessionResponses] = useState([]);
  const [showSessionSummary, setShowSessionSummary] = useState(false);
  const [user, setUser] = useState(null); 
  const [isCreatorOpen, setIsCreatorOpen] = useState(false);
  const [allQuestions, setAllQuestions] = useState([]);
  const [showSecretCard, setShowSecretCard] = useState(false);
  const [secretCard, setSecretCard] = useState(null);
  const [customCards, setCustomCards] = useState([]);

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const currentUser = await UserEntity.me();
        setUser(currentUser);
        const userCards = await CustomCard.filter({ created_by: currentUser.email });
        setCustomCards(userCards);
      } catch (e) {
        console.log("Not logged in");
      }
    };
    loadInitialData();
  }, []);

  useEffect(() => {
    const savedProgress = localStorage.getItem(STORAGE_KEY);
    if (savedProgress) {
      try {
        const parsed = JSON.parse(savedProgress);
        setUnlockedLevels(parsed.unlockedLevels || [1]);
        setCurrentLevel(parsed.currentLevel || 1);
        setAnsweredQuestions(new Set(parsed.answeredQuestions || []));
        if (parsed.sessionStarted) {
          setSessionStarted(true);
          setMode(parsed.mode);
          setSelectedPath(parsed.selectedPath);
          setSelectedPremiumDeck(parsed.selectedPremiumDeck);
          setStackedMode(parsed.stackedMode);
          setShuffledIndices(parsed.shuffledIndices || []);
          setCurrentIndex(parsed.currentIndex || 0);
          setQuestionsAnswered(parsed.questionsAnswered || 0);
          setSessionResponses(parsed.sessionResponses || []);
        }
      } catch (error) {
        console.error('Failed to load progress:', error);
      }
    }
  }, []);

  useEffect(() => {
    if (sessionStarted) {
      const progress = {
        sessionStarted,
        mode,
        selectedPath,
        selectedPremiumDeck,
        stackedMode,
        currentLevel,
        unlockedLevels,
        shuffledIndices,
        currentIndex,
        questionsAnswered,
        answeredQuestions: Array.from(answeredQuestions),
        sessionResponses
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    }
  }, [
    sessionStarted,
    mode,
    selectedPath,
    selectedPremiumDeck,
    stackedMode,
    currentLevel,
    unlockedLevels,
    shuffledIndices,
    currentIndex,
    questionsAnswered,
    answeredQuestions,
    sessionResponses
  ]);

  const loadAllQuestions = async (currentMode, currentLevel, path = null, premiumDeck = null) => {
    let staticQs = getQuestionSet(currentMode, currentLevel, path, premiumDeck)
      .map(q => ({ content: q, source: 'base' }));
    let sessionCustomQs = [];

    const myCardObjects = customCards.map(c => ({ content: c.content, source: 'custom' }));
    sessionCustomQs.push(...myCardObjects);

    try {
        const communityCards = await CustomCard.filter({ is_shared: true, is_approved: true });
        const communityCardObjects = communityCards
            .filter(c => user ? c.created_by !== user.email : true)
            .map(c => ({ content: c.content, source: 'community' }));
        sessionCustomQs.push(...communityCardObjects);
    } catch (error) {
        console.error("Could not load community cards:", error);
        toast.error("Having trouble loading community cards.");
    }
    
    let combinedQuestions = [...staticQs, ...sessionCustomQs];
    
    if (stackedMode && user?.is_premium) {
      const availableLevels = unlockedLevels;
      combinedQuestions = combinedQuestions.filter((q, index) => {
        const questionLevel = Math.floor(index / 5) + 1;
        return availableLevels.includes(Math.min(questionLevel, 3));
      });
    }
    
    setAllQuestions(combinedQuestions);
    setShuffledIndices(shuffleArray([...Array(combinedQuestions.length).keys()]));
    setCurrentIndex(0);
  };

  const handleBeginSession = async (selectedMode, path = null, premiumDeck = null) => {
    setMode(selectedMode);
    setSelectedPath(path);
    setSelectedPremiumDeck(premiumDeck);
    setCurrentLevel(1);
    setQuestionsAnswered(0);
    
    await loadAllQuestions(selectedMode, 1, path, premiumDeck);
    
    setSessionResponses([]);
    setSessionStarted(true);
    
    if (user?.is_premium) {
      const wildCard = checkForSecretWildCard();
      if (wildCard && Math.random() < 0.3) {
        setSecretCard(wildCard);
        setTimeout(() => setShowSecretCard(true), 2000);
      }
    }
  };

  const handleShuffle = () => {
    setIsAnimating(true);
    setTimeout(() => {
      setShuffledIndices(shuffleArray([...Array(allQuestions.length).keys()]));
      setCurrentIndex(0);
      setIsAnimating(false);
    }, 300);
  };

  const checkLevelProgression = () => {
    const newQuestionsAnswered = questionsAnswered + 1;
    setQuestionsAnswered(newQuestionsAnswered);

    const questionsNeeded = stackedMode && user?.is_premium ? 3 : QUESTIONS_TO_UNLOCK_NEXT_LEVEL;

    if (newQuestionsAnswered >= questionsNeeded && currentLevel < 3) {
      const nextLevel = currentLevel + 1;
      if (!unlockedLevels.includes(nextLevel)) {
        setUnlockedLevels(prev => [...prev, nextLevel]);
        toast.success(`Level ${nextLevel} Unlocked!`, {
          description: stackedMode ? "Questions are getting deeper..." : "New depth of questions available",
          duration: 3000
        });
      }
    }
  };

  const handleNext = () => {
    setIsAnimating(true);
    checkLevelProgression();
    
    const currentQData = allQuestions[shuffledIndices[currentIndex]];
    const questionId = `${currentQData.content}-${selectedPath || mode}-${currentLevel}`;
    
    setAnsweredQuestions(prev => new Set(prev).add(questionId));
    
    setSessionResponses(prev => [...prev, {
      question: currentQData.content,
      level: currentLevel,
      mode: typeof mode === 'object' ? mode.title : mode, 
      path: selectedPath,
      premiumDeck: selectedPremiumDeck,
      timestamp: new Date().toISOString(),
      skipped: false
    }]);
    
    setTimeout(() => {
      if (currentIndex < allQuestions.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        handleShuffle();
      }
      setIsAnimating(false);
    }, 300);
  };

  const handleSkip = () => {
    const currentQData = allQuestions[shuffledIndices[currentIndex]];
    setSessionResponses(prev => [...prev, {
      question: currentQData.content,
      level: currentLevel,
      mode: typeof mode === 'object' ? mode.title : mode, 
      path: selectedPath,
      premiumDeck: selectedPremiumDeck,
      timestamp: new Date().toISOString(),
      skipped: true
    }]);

    const dares = getDareSet(mode);
    const randomDare = dares[Math.floor(Math.random() * dares.length)];
    setCurrentDare(randomDare);
    setShowDare(true);
    handleNext();
  };

  const handleLevelChange = async (level) => {
    if (unlockedLevels.includes(level)) {
      setCurrentLevel(level);
      setQuestionsAnswered(0);
      await loadAllQuestions(mode, level, selectedPath, selectedPremiumDeck);
    }
  };

  const handleDestinyDraw = () => {
    const randomDestiny = destinyQuestions[Math.floor(Math.random() * destinyQuestions.length)];
    setDestinyQuestion(randomDestiny);
    setShowDestiny(true);
  };

  const handleDestinyClose = () => {
    setShowDestiny(false);
  };

  const handleEndSession = () => {
    if (sessionResponses.length > 0) {
      setShowSessionSummary(true);
    } else {
      setSessionStarted(false);
      setMode(null);
      setSelectedPath(null);
      setSelectedPremiumDeck(null);
    }
  };

  const handleCloseSummary = () => {
    setShowSessionSummary(false);
    setSessionStarted(false);
    setMode(null);
    setSelectedPath(null);
    setSelectedPremiumDeck(null);
    setSessionResponses([]);
    setAllQuestions([]);
    localStorage.removeItem(STORAGE_KEY);
  };

  const currentQuestionData = useMemo(() => {
    if (shuffledIndices.length > 0 && allQuestions.length > 0) {
      return allQuestions[shuffledIndices[currentIndex]];
    }
    return { content: "Loading questions...", source: 'base' };
  }, [shuffledIndices, currentIndex, allQuestions]);

  const currentProgress = useMemo(() => {
    const questionsNeeded = stackedMode && user?.is_premium ? 3 : QUESTIONS_TO_UNLOCK_NEXT_LEVEL;
    return (questionsAnswered / questionsNeeded) * 100;
  }, [questionsAnswered, stackedMode, user]);

  if (showSessionSummary) {
    return (
      <SessionSummary
        responses={sessionResponses}
        mode={typeof mode === 'object' ? mode.title : mode} 
        onClose={handleCloseSummary}
      />
    );
  }

  if (!sessionStarted) {
    return (
      <div className="min-h-screen p-4 md:p-8">
        <AnimatePresence>
          {isCreatorOpen && user && (
            <CustomCardCreator
              onClose={() => setIsCreatorOpen(false)}
              onCardCreated={() => {}}
            />
          )}
        </AnimatePresence>

        <div className="max-w-4xl mx-auto space-y-8">
          <BackHeader 
            title="Unspoken Connections" 
            subtitle="Anonymous deep conversations through meaningful questions"
            backTo={createPageUrl("Community")}
            backLabel="Community"
          />

          {user && (
            <Button 
              onClick={() => setIsCreatorOpen(true)} 
              variant="outline" 
              className="bg-gradient-to-r from-teal-100 to-cyan-100 hover:from-teal-200 hover:to-cyan-200 text-teal-700 border-teal-300 px-6 py-2 rounded-2xl font-semibold shadow-md hover:shadow-lg transition-all duration-200"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Create Your Own Question
            </Button>
          )}

          {user?.is_premium && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Card className="bg-gradient-to-br from-yellow-50 to-orange-100 border-yellow-200 shadow-2xl rounded-3xl overflow-hidden mb-8">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3 text-yellow-800">
                    <Crown className="w-6 h-6" />
                    Premium Session Options
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-primary mb-3">Choose Your Path</h3>
                    <div className="grid md:grid-cols-3 gap-3">
                      {Object.entries(sessionPaths).map(([key, path]) => (
                        <Button
                          key={key}
                          onClick={() => handleBeginSession('premium_path', key)}
                          className={`h-auto flex flex-col gap-2 p-4 rounded-2xl bg-gradient-to-r ${path.color} text-white hover:scale-105 transition-all`}
                        >
                          <span className="text-lg">{path.title}</span>
                          <span className="text-xs opacity-90">{path.description}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Card className="bg-card border-light shadow-2xl rounded-3xl overflow-hidden">
              <CardHeader>
                <CardTitle className="text-2xl font-semibold text-primary">
                  Choose Your Mode
                </CardTitle>
              </CardHeader>
              <CardContent className="p-8 pt-0 grid sm:grid-cols-3 gap-4">
                <Button 
                  onClick={() => handleBeginSession('solo')}
                  variant="outline"
                  className="h-auto flex flex-col gap-2 p-6 rounded-2xl border-purple-200 hover:bg-purple-50/80 hover:shadow-lg transition-all"
                >
                  <User className="w-8 h-8 text-purple-500" />
                  <span className="font-bold text-lg">Solo</span>
                  <span className="text-xs text-secondary">For individual reflection</span>
                </Button>
                <Button 
                  onClick={() => handleBeginSession('duo')}
                  variant="outline"
                  className="h-auto flex flex-col gap-2 p-6 rounded-2xl border-pink-200 hover:bg-pink-50/80 hover:shadow-lg transition-all"
                >
                  <Users className="w-8 h-8 text-pink-500" />
                  <span className="font-bold text-lg">Duo</span>
                  <span className="text-xs text-secondary">For two players</span>
                </Button>
                <Button 
                  onClick={() => handleBeginSession('group')}
                  variant="outline"
                  className="h-auto flex flex-col gap-2 p-6 rounded-2xl border-indigo-200 hover:bg-indigo-50/80 hover:shadow-lg transition-all"
                >
                  <Users className="w-8 h-8 text-indigo-500" />
                  <span className="font-bold text-lg">Group</span>
                  <span className="text-xs text-secondary">For 3+ players</span>
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {user?.is_premium && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Card className="bg-card border-light shadow-xl rounded-3xl">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-500" />
                    Your Connection Journey
                  </CardTitle>
                </CardHeader>
                <CardContent className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-indigo-600">{answeredQuestions.size}</div>
                    <div className="text-sm text-secondary">Questions Reflected On</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{unlockedLevels.length}</div>
                    <div className="text-sm text-secondary">Levels Unlocked</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-pink-600">{sessionResponses.length || 0}</div>
                    <div className="text-sm text-secondary">Sessions Completed</div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>

        <AnimatePresence>
          {showSecretCard && secretCard && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.8, opacity: 0, rotateY: 90 }}
                animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                exit={{ scale: 0.8, opacity: 0, rotateY: -90 }}
                className="bg-gradient-to-br from-purple-600 via-indigo-600 to-blue-600 rounded-3xl p-8 text-white text-center max-w-md shadow-2xl"
              >
                <Sparkles className="w-12 h-12 mx-auto mb-4 text-yellow-300" />
                <h3 className="text-2xl font-bold mb-2">Secret Wild Card!</h3>
                <p className="text-purple-100 text-sm mb-4">{secretCard.description}</p>
                <p className="text-lg italic mb-6">"{secretCard.question}"</p>
                <Button
                  onClick={() => setShowSecretCard(false)}
                  className="bg-white/20 hover:bg-white/30 text-white border border-white/30"
                >
                  Continue Session
                </Button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  let modeName = typeof mode === 'object' ? mode.title : mode;
  if (selectedPath) {
    modeName = sessionPaths[selectedPath].title;
  } else if (selectedPremiumDeck) {
    modeName = premiumDecks[selectedPremiumDeck].title + ' Deck';
  }

  return (
    <>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 p-4 md:p-8 flex flex-col items-center justify-center relative">
        <div className="w-full max-w-2xl mx-auto space-y-8 text-center">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
              Unspoken Connections
            </h1>
            <div className="flex items-center justify-center gap-2">
              <p className="text-gray-600 text-lg max-w-xl mx-auto">
                You are in <span className="font-semibold capitalize">{modeName}</span> Mode
              </p>
              {(selectedPath || selectedPremiumDeck) && (
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                  Premium
                </Badge>
              )}
              {stackedMode && (
                <Badge className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white">
                  Stacked
                </Badge>
              )}
            </div>
          </div>

          <LevelProgress 
            currentLevel={currentLevel}
            unlockedLevels={unlockedLevels}
            progress={currentProgress}
          />

          <div className="flex justify-center gap-2">
            {[1, 2, 3].map((level) => (
              <Button
                key={level}
                onClick={() => handleLevelChange(level)}
                disabled={!unlockedLevels.includes(level)}
                variant={currentLevel === level ? "default" : "outline"}
                size="sm"
                className={`rounded-2xl ${
                  currentLevel === level 
                    ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white' 
                    : ''
                }`}
              >
                Level {level}
              </Button>
            ))}
          </div>

          <QuestionCard questionData={currentQuestionData} isAnimating={isAnimating} />
          
          <div className="flex justify-center items-center gap-4">
            <Button onClick={handleSkip} variant="outline" className="rounded-full h-14 w-14 p-0 shadow-sm border-gray-300">
                <SkipForward className="w-6 h-6 text-gray-600" />
                <span className="sr-only">Skip</span>
            </Button>
            
            <Button onClick={handleNext} className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white rounded-full font-semibold text-lg shadow-lg h-20 w-20 flex flex-col p-2">
                <span className="text-sm">Next</span>
                <Dices className="w-6 h-6" />
            </Button>
            
            <Button onClick={handleShuffle} variant="outline" className="rounded-full h-14 w-14 p-0 shadow-sm border-gray-300">
                <Shuffle className="w-6 h-6 text-gray-600" />
                <span className="sr-only">Shuffle</span>
            </Button>
          </div>
          
          <div className="text-sm text-gray-500 pt-4">
            Question {currentIndex + 1} of {allQuestions.length} • {sessionResponses.length} reflected upon
            {user?.is_premium && (
              <div className="mt-1">
                {answeredQuestions.size} total questions answered • Level {unlockedLevels.length} reached
              </div>
            )}
          </div>

          <div className="flex justify-center gap-4 pt-4">
            <Button 
              onClick={handleDestinyDraw}
              variant="outline"
              className="bg-gradient-to-r from-indigo-100 to-purple-100 hover:from-indigo-200 hover:to-purple-200 text-purple-700 border-purple-300 px-6 py-2 rounded-2xl font-semibold shadow-md hover:shadow-lg transition-all duration-200"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              Draw Your Destiny Question
            </Button>

            {sessionResponses.length > 0 && (
              <Button
                onClick={handleEndSession}
                variant="outline"
                className="bg-gradient-to-r from-green-100 to-emerald-100 hover:from-green-200 hover:to-emerald-200 text-green-700 border-green-300 px-6 py-2 rounded-2xl font-semibold shadow-md hover:shadow-lg transition-all duration-200"
              >
                <BookOpen className="w-4 h-4 mr-2" />
                End Session & Save
              </Button>
            )}
          </div>
        </div>

        <AnimatePresence>
          {showDare && (
            <DareModal dare={currentDare} onClose={() => setShowDare(false)} />
          )}
        </AnimatePresence>
        
        <AnimatePresence>
          {showDestiny && (
            <DestinyDrawModal question={destinyQuestion} onClose={handleDestinyClose} />
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
