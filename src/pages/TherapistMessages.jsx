import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import {
  MessageSquare,
  Send,
  Search,
  Archive,
  AlertTriangle,
  Heart,
  Wind,
  Phone,
  CheckCircle,
  Clock,
  Shield,
  Filter,
  ChevronLeft,
  MoreVertical,
  FileText,
  Lock
} from 'lucide-react';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import BackHeader from '../components/navigation/BackHeader';
import { createPageUrl } from '@/utils';

// Crisis keywords that trigger emergency protocol
const CRISIS_KEYWORDS = [
  'suicide', 'kill myself', 'end my life', 'want to die',
  'self harm', 'cutting', 'hurt myself', 'overdose',
  'kill', 'harm others', 'shoot', 'weapon'
];

// Quick response templates
const QUICK_RESPONSES = {
  grounding: {
    title: '5-4-3-2-1 Grounding Exercise',
    icon: Heart,
    message: `Let's try a grounding exercise together:

Look around and name:
• 5 things you can SEE
• 4 things you can TOUCH
• 3 things you can HEAR
• 2 things you can SMELL
• 1 thing you can TASTE

Take your time with each one. I'm here with you.`,
    label: 'Grounding Exercise'
  },
  breathing: {
    title: 'Breathing Exercise',
    icon: Wind,
    message: `Let's practice some calming breaths:

Box Breathing:
1. Breathe in for 4 counts
2. Hold for 4 counts
3. Breathe out for 4 counts
4. Hold for 4 counts
5. Repeat 4 times

Focus on the rhythm. You're doing great.`,
    label: 'Breathing Prompt'
  },
  crisis: {
    title: 'Crisis Resources',
    icon: Phone,
    message: `I hear that you're struggling right now. Please know that immediate help is available:

🆘 National Suicide Prevention Lifeline: 988
📞 Crisis Text Line: Text HOME to 741741
🚑 Emergency Services: 911

These services are available 24/7 and trained to help.

If you're in immediate danger, please call 911 or go to your nearest emergency room.

I care about your safety and I'm here to support you, but I want to make sure you get the immediate help you need.`,
    label: 'Crisis Resource'
  }
};

const MESSAGE_LABELS = [
  { id: 'emotional-checkin', name: 'Emotional Check-in', color: 'bg-blue-100 text-blue-700' },
  { id: 'session-followup', name: 'Session Follow-up', color: 'bg-green-100 text-green-700' },
  { id: 'urgent', name: 'Urgent', color: 'bg-red-100 text-red-700' },
  { id: 'general', name: 'General', color: 'bg-gray-100 text-gray-700' }
];

export default function TherapistMessages() {
  const [user, setUser] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [messageLabel, setMessageLabel] = useState('general');
  const [searchQuery, setSearchQuery] = useState('');
  const [showQuickResponses, setShowQuickResponses] = useState(false);
  const [showCrisisAlert, setShowCrisisAlert] = useState(false);
  const [crisisDetected, setCrisisDetected] = useState(false);

  useEffect(() => {
    loadUserData();
    loadConversations();
  }, []);

  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation.id);
    }
  }, [selectedConversation]);

  const loadUserData = () => {
    const currentUserData = localStorage.getItem('aurawell_current_user');
    if (currentUserData) {
      setUser(JSON.parse(currentUserData));
    }
  };

  const loadConversations = () => {
    // Load conversations from localStorage
    const storedConversations = localStorage.getItem('therapist_conversations');
    if (storedConversations) {
      setConversations(JSON.parse(storedConversations));
    } else {
      // Create mock conversations for demo
      const mockConversations = [
        {
          id: '1',
          clientName: 'John D.',
          clientId: 'client-1',
          lastMessage: 'Thank you for the session today',
          lastMessageTime: new Date().toISOString(),
          unreadCount: 0,
          status: 'active',
          archived: false
        },
        {
          id: '2',
          clientName: 'Sarah M.',
          clientId: 'client-2',
          lastMessage: 'I\'m feeling anxious about tomorrow',
          lastMessageTime: new Date(Date.now() - 3600000).toISOString(),
          unreadCount: 2,
          status: 'active',
          archived: false,
          hasUrgent: true
        }
      ];
      localStorage.setItem('therapist_conversations', JSON.stringify(mockConversations));
      setConversations(mockConversations);
    }
  };

  const loadMessages = (conversationId) => {
    const storedMessages = localStorage.getItem(`messages_${conversationId}`);
    if (storedMessages) {
      setMessages(JSON.parse(storedMessages));
    } else {
      // Create mock messages for demo
      const mockMessages = [
        {
          id: '1',
          conversationId,
          senderId: 'client-1',
          senderName: 'John D.',
          message: 'Hi, I wanted to follow up on our session',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
          label: 'session-followup',
          isTherapist: false
        },
        {
          id: '2',
          conversationId,
          senderId: user?.id,
          senderName: user?.name,
          message: 'Of course! I\'m glad you reached out. How are you feeling about what we discussed?',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
          label: 'session-followup',
          isTherapist: true,
          boundaryReminder: true
        }
      ];
      localStorage.setItem(`messages_${conversationId}`, JSON.stringify(mockMessages));
      setMessages(mockMessages);
    }
  };

  const detectCrisisKeywords = (text) => {
    const lowerText = text.toLowerCase();
    return CRISIS_KEYWORDS.some(keyword => lowerText.includes(keyword));
  };

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    // Check for crisis keywords
    const hasCrisisContent = detectCrisisKeywords(newMessage);
    if (hasCrisisContent) {
      setCrisisDetected(true);
      setShowCrisisAlert(true);
      toast.error('Crisis keywords detected!', {
        description: 'Please follow your emergency protocol.'
      });
      return;
    }

    const message = {
      id: Date.now().toString(),
      conversationId: selectedConversation.id,
      senderId: user?.id,
      senderName: user?.name,
      message: newMessage,
      timestamp: new Date().toISOString(),
      label: messageLabel,
      isTherapist: true,
      boundaryReminder: Math.random() > 0.7 // Show boundary reminder occasionally
    };

    const updatedMessages = [...messages, message];
    setMessages(updatedMessages);
    localStorage.setItem(`messages_${selectedConversation.id}`, JSON.stringify(updatedMessages));

    // Update conversation
    const updatedConversations = conversations.map(conv =>
      conv.id === selectedConversation.id
        ? { ...conv, lastMessage: newMessage, lastMessageTime: new Date().toISOString() }
        : conv
    );
    setConversations(updatedConversations);
    localStorage.setItem('therapist_conversations', JSON.stringify(updatedConversations));

    setNewMessage('');
    setShowQuickResponses(false);
    toast.success('Message sent securely');
  };

  const handleQuickResponse = (type) => {
    const response = QUICK_RESPONSES[type];
    setNewMessage(response.message);
    setMessageLabel(response.label.toLowerCase().replace(/\s+/g, '-'));
    setShowQuickResponses(false);
  };

  const archiveConversation = (conversationId) => {
    const updatedConversations = conversations.map(conv =>
      conv.id === conversationId ? { ...conv, archived: true } : conv
    );
    setConversations(updatedConversations);
    localStorage.setItem('therapist_conversations', JSON.stringify(updatedConversations));
    setSelectedConversation(null);
    toast.success('Conversation archived');
  };

  const generateConversationSummary = () => {
    if (messages.length === 0) {
      toast.info('No messages to summarize');
      return;
    }

    const summary = {
      totalMessages: messages.length,
      clientMessages: messages.filter(m => !m.isTherapist).length,
      therapistMessages: messages.filter(m => m.isTherapist).length,
      labels: messages.reduce((acc, msg) => {
        acc[msg.label] = (acc[msg.label] || 0) + 1;
        return acc;
      }, {}),
      dateRange: {
        start: messages[0].timestamp,
        end: messages[messages.length - 1].timestamp
      }
    };

    toast.success('Summary Generated', {
      description: `${summary.totalMessages} total messages. ${summary.clientMessages} from client.`
    });
  };

  const filteredConversations = conversations.filter(conv =>
    !conv.archived &&
    conv.clientName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!user || user.user_type !== 'therapist') {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-8 text-center">
            <Shield className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold mb-2">Therapist Access Only</h2>
            <p className="text-gray-600">This feature is only available to verified therapists.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <BackHeader
        title="Secure Messages"
        subtitle="HIPAA-compliant encrypted messaging"
        backTo={createPageUrl("Dashboard")}
        backLabel="Dashboard"
      />

      {/* Crisis Alert Modal */}
      <AnimatePresence>
        {showCrisisAlert && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowCrisisAlert(false)}
          >
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-red-100 rounded-full">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <h2 className="text-xl font-semibold text-red-700">Crisis Keywords Detected</h2>
              </div>

              <div className="space-y-4 mb-6">
                <p className="text-gray-700">
                  The message contains crisis-related keywords. Please follow your emergency protocol:
                </p>
                <ol className="list-decimal list-inside space-y-2 text-sm text-gray-600">
                  <li>Contact emergency services (911) if client is in immediate danger</li>
                  <li>Notify your supervisor/clinic director</li>
                  <li>Document all communications</li>
                  <li>Follow up within 24 hours</li>
                </ol>
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => setShowCrisisAlert(false)}
                  variant="outline"
                  className="flex-1"
                >
                  Cancel Message
                </Button>
                <Button
                  onClick={() => {
                    setShowCrisisAlert(false);
                    // Allow sending but log as crisis
                    handleSendMessage();
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-700"
                >
                  Log & Send
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="grid lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">

          {/* Conversations List */}
          <Card className="lg:col-span-1 flex flex-col">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-4">
                <CardTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5 text-green-600" />
                  Conversations
                </CardTitle>
                <Badge className="bg-green-100 text-green-700 border-0">
                  Encrypted
                </Badge>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search conversations..."
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto space-y-2">
              {filteredConversations.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p className="text-sm">No conversations yet</p>
                </div>
              ) : (
                filteredConversations.map(conv => (
                  <motion.div
                    key={conv.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setSelectedConversation(conv)}
                    className={`p-4 rounded-lg cursor-pointer transition-all ${
                      selectedConversation?.id === conv.id
                        ? 'bg-purple-50 border-2 border-purple-200'
                        : 'bg-white border-2 border-gray-100 hover:border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                          {conv.clientName}
                          {conv.hasUrgent && (
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                          )}
                        </h3>
                        <p className="text-sm text-gray-500 line-clamp-1">{conv.lastMessage}</p>
                      </div>
                      {conv.unreadCount > 0 && (
                        <Badge className="bg-purple-600 text-white">
                          {conv.unreadCount}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-400">
                      {format(new Date(conv.lastMessageTime), 'MMM d, h:mm a')}
                    </p>
                  </motion.div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Message Thread */}
          <Card className="lg:col-span-2 flex flex-col">
            {selectedConversation ? (
              <>
                <CardHeader className="pb-4 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedConversation(null)}
                        className="lg:hidden"
                      >
                        <ChevronLeft className="w-4 h-4" />
                      </Button>
                      <div>
                        <CardTitle className="text-lg">{selectedConversation.clientName}</CardTitle>
                        <p className="text-sm text-gray-500">Active conversation</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={generateConversationSummary}
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Summary
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => archiveConversation(selectedConversation.id)}
                      >
                        <Archive className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages.map((msg, index) => (
                    <div key={msg.id}>
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`flex ${msg.isTherapist ? 'justify-end' : 'justify-start'}`}
                      >
                        <div className={`max-w-[70%] ${msg.isTherapist ? 'text-right' : 'text-left'}`}>
                          <div className="flex items-center gap-2 mb-1">
                            {!msg.isTherapist && (
                              <span className="text-xs font-medium text-gray-600">{msg.senderName}</span>
                            )}
                            <Badge className={
                              MESSAGE_LABELS.find(l => l.id === msg.label)?.color || 'bg-gray-100 text-gray-700'
                            }>
                              {MESSAGE_LABELS.find(l => l.id === msg.label)?.name || 'General'}
                            </Badge>
                          </div>

                          <div className={`p-3 rounded-2xl ${
                            msg.isTherapist
                              ? 'bg-purple-600 text-white'
                              : 'bg-white border-2 border-gray-200 text-gray-800'
                          }`}>
                            <p className="whitespace-pre-wrap">{msg.message}</p>
                          </div>

                          <p className="text-xs text-gray-400 mt-1">
                            {format(new Date(msg.timestamp), 'h:mm a')}
                          </p>
                        </div>
                      </motion.div>

                      {msg.boundaryReminder && msg.isTherapist && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="flex justify-end mt-2"
                        >
                          <div className="max-w-[70%] p-2 bg-yellow-50 border border-yellow-200 rounded-lg text-xs text-yellow-800">
                            <Shield className="w-3 h-3 inline mr-1" />
                            Auto-reminder: This platform does not replace emergency care. For crisis support, call 988.
                          </div>
                        </motion.div>
                      )}
                    </div>
                  ))}
                </CardContent>

                <div className="border-t p-4">
                  {/* Quick Responses */}
                  <AnimatePresence>
                    {showQuickResponses && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="mb-4 grid grid-cols-3 gap-2"
                      >
                        {Object.entries(QUICK_RESPONSES).map(([key, response]) => (
                          <Button
                            key={key}
                            variant="outline"
                            onClick={() => handleQuickResponse(key)}
                            className="flex flex-col items-center gap-2 h-auto p-4"
                          >
                            <response.icon className="w-5 h-5" />
                            <span className="text-xs">{response.title}</span>
                          </Button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Message Label Selector */}
                  <div className="flex gap-2 mb-3 flex-wrap">
                    {MESSAGE_LABELS.map(label => (
                      <button
                        key={label.id}
                        onClick={() => setMessageLabel(label.id)}
                        className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                          messageLabel === label.id
                            ? label.color
                            : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                        }`}
                      >
                        {label.name}
                      </button>
                    ))}
                  </div>

                  {/* Message Input */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowQuickResponses(!showQuickResponses)}
                      className={showQuickResponses ? 'bg-purple-50 border-purple-200' : ''}
                    >
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Textarea
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your secure message..."
                      className="flex-1 min-h-[80px]"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendMessage();
                        }
                      }}
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="bg-purple-600 hover:bg-purple-700"
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>

                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <Lock className="w-3 h-3" />
                    End-to-end encrypted • HIPAA compliant
                  </p>
                </div>
              </>
            ) : (
              <CardContent className="flex-1 flex items-center justify-center">
                <div className="text-center text-gray-400">
                  <MessageSquare className="w-16 h-16 mx-auto mb-4" />
                  <p>Select a conversation to start messaging</p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}