import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Send, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import SafetyModal from '../safety/SafetyModal';
import MediumRiskBanner from '../safety/MediumRiskBanner';
import LowRiskExerciseSuggestion from '../safety/LowRiskExerciseSuggestion';
import GroundingExerciseModal from './GroundingExerciseModal';
import {
  analyzeTextForRisk,
  BehavioralSignalTracker,
  logCrisisEvent
} from '../../utils/crisisDetection';

/**
 * LiveSessionChat - Chat interface with integrated crisis detection
 *
 * Features:
 * - Real-time message analysis
 * - Behavioral pattern tracking
 * - Automatic safety interventions
 * - Moderator notifications
 */
export default function LiveSessionChat({ sessionId, userId, userName, onPauseSession }) {
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState('');
  const [tracker] = useState(new BehavioralSignalTracker(userId));

  // Safety interventions
  const [showSafetyModal, setShowSafetyModal] = useState(false);
  const [showMediumBanner, setShowMediumBanner] = useState(false);
  const [showLowRiskExercises, setShowLowRiskExercises] = useState(false);
  const [showGrounding, setShowGrounding] = useState(false);

  const messagesEndRef = useRef(null);
  const chatInputRef = useRef(null);

  // Auto-scroll to latest message
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load messages for this session
  useEffect(() => {
    const storedMessages = JSON.parse(
      localStorage.getItem(`live_chat_${sessionId}`) || '[]'
    );
    setMessages(storedMessages);
  }, [sessionId]);

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    // Analyze message for crisis signals
    const riskAnalysis = analyzeTextForRisk(inputText);

    // Add to behavioral tracker
    tracker.addMessage(inputText, riskAnalysis.level);

    // Check behavioral signals
    const behavioralRisk = tracker.getBehavioralRisk();

    // Create message object
    const newMessage = {
      id: `msg_${Date.now()}`,
      userId,
      userName,
      text: inputText,
      timestamp: new Date().toISOString(),
      riskLevel: riskAnalysis.level
    };

    // Add message to chat
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    localStorage.setItem(`live_chat_${sessionId}`, JSON.stringify(updatedMessages));

    // Clear input
    setInputText('');

    // Handle risk-based interventions
    if (riskAnalysis.level === 'HIGH') {
      // HIGH RISK - Immediate intervention
      handleHighRiskDetection(newMessage, riskAnalysis, behavioralRisk);
    } else if (riskAnalysis.level === 'MEDIUM') {
      // MEDIUM RISK - Supportive banner
      handleMediumRiskDetection(newMessage, riskAnalysis, behavioralRisk);
    } else if (riskAnalysis.level === 'LOW') {
      // LOW RISK - Gentle suggestions
      handleLowRiskDetection(newMessage, riskAnalysis);
    }

    // Check if behavioral signals warrant escalation
    if (behavioralRisk.recommendation === 'ESCALATE') {
      handleBehavioralEscalation(behavioralRisk);
    }
  };

  const handleHighRiskDetection = (message, riskAnalysis, behavioralRisk) => {
    // Log the crisis event
    logCrisisEvent({
      type: 'HIGH_RISK_MESSAGE',
      userId,
      sessionId,
      message: message.text,
      riskLevel: 'HIGH',
      matches: riskAnalysis.matches,
      behavioralSignals: behavioralRisk.signals,
      timestamp: new Date().toISOString()
    });

    // Show MANDATORY safety modal
    setShowSafetyModal(true);

    // Pause the session for this user (minimize it)
    if (onPauseSession) {
      onPauseSession('high_risk');
    }

    // Notify moderators (in production, this would be a backend call)
    notifyModerators({
      level: 'HIGH',
      userId,
      userName: message.userName,
      sessionId,
      timestamp: message.timestamp
    });
  };

  const handleMediumRiskDetection = (message, riskAnalysis, behavioralRisk) => {
    // Log the event
    logCrisisEvent({
      type: 'MEDIUM_RISK_MESSAGE',
      userId,
      sessionId,
      message: message.text,
      riskLevel: 'MEDIUM',
      matches: riskAnalysis.matches,
      behavioralSignals: behavioralRisk.signals,
      timestamp: new Date().toISOString()
    });

    // Show support banner
    setShowMediumBanner(true);

    // Quietly notify moderators
    notifyModerators({
      level: 'MEDIUM',
      userId,
      userName: message.userName,
      sessionId,
      timestamp: message.timestamp
    });
  };

  const handleLowRiskDetection = (message, riskAnalysis) => {
    // Show gentle exercise suggestions
    setShowLowRiskExercises(true);

    // No moderator notification needed for LOW risk
  };

  const handleBehavioralEscalation = (behavioralRisk) => {
    // Log behavioral escalation
    logCrisisEvent({
      type: 'BEHAVIORAL_ESCALATION',
      userId,
      sessionId,
      signals: behavioralRisk.signals,
      signalCount: behavioralRisk.signalCount,
      recommendation: behavioralRisk.recommendation,
      timestamp: new Date().toISOString()
    });

    // Notify moderators about the pattern
    notifyModerators({
      level: 'BEHAVIORAL_ESCALATION',
      userId,
      userName,
      sessionId,
      signals: behavioralRisk.signals,
      timestamp: new Date().toISOString()
    });

    // If not already showing medium banner, show it
    if (!showMediumBanner && !showSafetyModal) {
      setShowMediumBanner(true);
    }
  };

  const notifyModerators = (event) => {
    // Store moderator notification
    const notifications = JSON.parse(
      localStorage.getItem('moderator_notifications') || '[]'
    );
    notifications.push(event);
    localStorage.setItem('moderator_notifications', JSON.stringify(notifications));

    // In production, this would send to backend/moderator dashboard
    console.log('[MODERATOR ALERT]', event);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Safety Interventions */}
      <AnimatePresence>
        {showLowRiskExercises && (
          <div className="mb-4">
            <LowRiskExerciseSuggestion onDismiss={() => setShowLowRiskExercises(false)} />
          </div>
        )}

        {showMediumBanner && (
          <div className="mb-4">
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
          </div>
        )}
      </AnimatePresence>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto bg-gray-50 rounded-lg p-4 mb-4 min-h-[400px] max-h-[600px]">
        <div className="space-y-3">
          {messages.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">
                No messages yet. Be the first to share!
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${message.userId === userId ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`
                    max-w-[70%] rounded-lg p-3
                    ${message.userId === userId
                      ? 'bg-purple-600 text-white'
                      : 'bg-white text-gray-900 border border-gray-200'
                    }
                  `}
                >
                  {message.userId !== userId && (
                    <p className="text-xs font-semibold mb-1 opacity-70">
                      {message.userName}
                    </p>
                  )}
                  <p className="text-sm">{message.text}</p>
                  <p className={`text-xs mt-1 ${message.userId === userId ? 'text-purple-200' : 'text-gray-500'}`}>
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>
              </motion.div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Chat Input */}
      <div className="flex items-end gap-2">
        <textarea
          ref={chatInputRef}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Share your thoughts... (messages are monitored for safety)"
          className="flex-1 p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          rows={2}
        />
        <Button
          onClick={handleSendMessage}
          disabled={!inputText.trim()}
          className="bg-purple-600 hover:bg-purple-700 text-white rounded-lg px-6 h-[76px]"
        >
          <Send className="w-5 h-5" />
        </Button>
      </div>

      {/* Safety Note */}
      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-800 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-blue-600" />
          <span>
            <strong>Your safety matters.</strong> If messages suggest immediate danger, we'll pause and help you find support.
            This chat is monitored for everyone's wellbeing.
          </span>
        </p>
      </div>

      {/* Safety Modal (HIGH risk) */}
      {showSafetyModal && (
        <SafetyModal
          onClose={() => setShowSafetyModal(false)}
          userRegion="US"
          context="live"
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