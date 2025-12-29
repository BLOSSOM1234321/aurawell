import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle,
  Trash2,
  Activity,
  Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SafetyModal from '../components/safety/SafetyModal';
import MediumRiskBanner from '../components/safety/MediumRiskBanner';
import LowRiskExerciseSuggestion from '../components/safety/LowRiskExerciseSuggestion';
import GroundingExerciseModal from '../components/live/GroundingExerciseModal';
import {
  analyzeTextForRisk,
  BehavioralSignalTracker,
  getCrisisResources
} from '../utils/crisisDetection';

export default function CrisisDetectionDemo() {
  const [inputText, setInputText] = useState('');
  const [currentRisk, setCurrentRisk] = useState(null);
  const [detectionHistory, setDetectionHistory] = useState([]);
  const [showSafetyModal, setShowSafetyModal] = useState(false);
  const [showMediumBanner, setShowMediumBanner] = useState(false);
  const [showLowRiskExercises, setShowLowRiskExercises] = useState(false);
  const [showGrounding, setShowGrounding] = useState(false);
  const [tracker] = useState(new BehavioralSignalTracker('demo-user'));
  const [behavioralRisk, setBehavioralRisk] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState('US');

  // Example phrases for quick testing
  const examplePhrases = {
    HIGH: [
      "I want to die",
      "I'm going to hurt myself tonight",
      "I have a plan to end it all",
      "I don't want to be here anymore"
    ],
    MEDIUM: [
      "I feel hopeless",
      "I can't do this anymore",
      "What's the point of anything",
      "Nobody cares about me"
    ],
    LOW: [
      "I'm feeling really anxious",
      "I'm overwhelmed",
      "Having a hard time today",
      "Feeling sad"
    ]
  };

  const analyzeText = () => {
    if (!inputText.trim()) return;

    const result = analyzeTextForRisk(inputText);
    setCurrentRisk(result);

    // Add to tracker
    tracker.addMessage(inputText, result.level);

    // Update behavioral risk
    const behavior = tracker.getBehavioralRisk();
    setBehavioralRisk(behavior);

    // Add to history
    setDetectionHistory(prev => [
      {
        text: inputText,
        result,
        timestamp: new Date().toISOString()
      },
      ...prev.slice(0, 19) // Keep last 20
    ]);

    // Trigger appropriate UI response
    if (result.level === 'HIGH') {
      setShowSafetyModal(true);
    } else if (result.level === 'MEDIUM') {
      setShowMediumBanner(true);
    } else if (result.level === 'LOW') {
      setShowLowRiskExercises(true);
    }

    // Clear input
    setInputText('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      analyzeText();
    }
  };

  const clearHistory = () => {
    setDetectionHistory([]);
    tracker.clear();
    setBehavioralRisk(null);
    setCurrentRisk(null);
  };

  const useExamplePhrase = (phrase) => {
    setInputText(phrase);
  };

  const getRiskColor = (level) => {
    switch (level) {
      case 'HIGH': return 'text-red-700 bg-red-100 border-red-300';
      case 'MEDIUM': return 'text-orange-700 bg-orange-100 border-orange-300';
      case 'LOW': return 'text-yellow-700 bg-yellow-100 border-yellow-300';
      default: return 'text-gray-700 bg-gray-100 border-gray-300';
    }
  };

  const getRiskIcon = (level) => {
    switch (level) {
      case 'HIGH': return <AlertTriangle className="w-5 h-5" />;
      case 'MEDIUM': return <AlertCircle className="w-5 h-5" />;
      case 'LOW': return <Info className="w-5 h-5" />;
      default: return <CheckCircle className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <Card className="bg-white shadow-lg border-0">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Crisis Detection System Demo
                </h1>
                <p className="text-gray-600">
                  Test the crisis detection logic with various text inputs
                </p>
              </div>
              <div className="flex items-center gap-2">
                <label className="text-sm text-gray-600">Region:</label>
                <select
                  value={selectedRegion}
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="US">United States</option>
                  <option value="UK">United Kingdom</option>
                  <option value="CA">Canada</option>
                  <option value="AU">Australia</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Low Risk Exercise Suggestions */}
        {showLowRiskExercises && (
          <LowRiskExerciseSuggestion
            onDismiss={() => setShowLowRiskExercises(false)}
          />
        )}

        {/* Medium Risk Banner */}
        {showMediumBanner && (
          <MediumRiskBanner
            onDismiss={() => setShowMediumBanner(false)}
            onGrounding={() => {
              setShowMediumBanner(false);
              setShowGrounding(true);
            }}
            onViewResources={() => {
              setShowMediumBanner(false);
              setShowSafetyModal(true);
            }}
          />
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Left Column: Input & Testing */}
          <div className="space-y-6">

            {/* Text Input */}
            <Card className="bg-white shadow-lg border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  Test Input
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message to analyze for crisis signals..."
                  className="w-full h-32 p-4 border border-gray-300 rounded-xl resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <Button
                  onClick={analyzeText}
                  disabled={!inputText.trim()}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Analyze Text
                </Button>
              </CardContent>
            </Card>

            {/* Example Phrases */}
            <Card className="bg-white shadow-lg border-0">
              <CardHeader>
                <CardTitle className="text-sm">Quick Test Examples</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {Object.entries(examplePhrases).map(([level, phrases]) => (
                  <div key={level}>
                    <Badge className={`mb-2 ${getRiskColor(level)}`}>
                      {level} RISK
                    </Badge>
                    <div className="space-y-2">
                      {phrases.map((phrase, idx) => (
                        <button
                          key={idx}
                          onClick={() => useExamplePhrase(phrase)}
                          className="w-full text-left p-3 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors border border-gray-200"
                        >
                          "{phrase}"
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

          </div>

          {/* Right Column: Results & Behavioral Tracking */}
          <div className="space-y-6">

            {/* Current Detection Result */}
            {currentRisk && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className={`shadow-lg border-2 ${getRiskColor(currentRisk.level)}`}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {getRiskIcon(currentRisk.level)}
                      Detection Result: {currentRisk.level}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-700">Confidence:</span>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className="bg-purple-600 h-2 rounded-full transition-all"
                          style={{ width: `${currentRisk.confidence * 100}%` }}
                        />
                      </div>
                      <span className="text-xs text-gray-600">
                        {(currentRisk.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                    {currentRisk.matches && currentRisk.matches.length > 0 && (
                      <div>
                        <span className="text-sm font-medium text-gray-700">Matched Phrases:</span>
                        <div className="flex flex-wrap gap-1 mt-2">
                          {currentRisk.matches.map((match, idx) => (
                            <Badge key={idx} variant="secondary" className="text-xs">
                              {match}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Behavioral Risk Tracking */}
            {behavioralRisk && behavioralRisk.hasSignals && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="bg-orange-50 border-2 border-orange-300 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-orange-900">
                      <Activity className="w-5 h-5" />
                      Behavioral Signals Detected
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-orange-900">
                        Recommendation:
                      </span>
                      <Badge className="bg-orange-600 text-white">
                        {behavioralRisk.recommendation}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      {behavioralRisk.signals.rapidPosting && (
                        <div className="flex items-center gap-2 text-sm text-orange-800">
                          <CheckCircle className="w-4 h-4" />
                          Rapid message posting detected
                        </div>
                      )}
                      {behavioralRisk.signals.emotionalEscalation && (
                        <div className="flex items-center gap-2 text-sm text-orange-800">
                          <CheckCircle className="w-4 h-4" />
                          Emotional escalation pattern
                        </div>
                      )}
                      {behavioralRisk.signals.repeatedCrisisLanguage && (
                        <div className="flex items-center gap-2 text-sm text-orange-800">
                          <CheckCircle className="w-4 h-4" />
                          Repeated crisis language
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Detection History */}
            <Card className="bg-white shadow-lg border-0">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Detection History</CardTitle>
                  {detectionHistory.length > 0 && (
                    <Button
                      onClick={clearHistory}
                      variant="outline"
                      size="sm"
                      className="text-red-600 border-red-300 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Clear
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                {detectionHistory.length === 0 ? (
                  <p className="text-sm text-gray-500 text-center py-8">
                    No detections yet. Try analyzing some text above.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {detectionHistory.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <Badge className={`text-xs ${getRiskColor(item.result.level)}`}>
                            {item.result.level}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {new Date(item.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 italic">
                          "{item.text}"
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

          </div>
        </div>

      </div>

      {/* Safety Modal (HIGH risk) - MANDATORY */}
      {showSafetyModal && (
        <SafetyModal
          onClose={() => setShowSafetyModal(false)}
          userRegion={selectedRegion}
          context="demo"
          mandatory={true}
        />
      )}

      {/* Grounding Exercise Modal */}
      {showGrounding && (
        <GroundingExerciseModal
          onClose={() => setShowGrounding(false)}
          onComplete={() => setShowGrounding(false)}
        />
      )}
    </div>
  );
}