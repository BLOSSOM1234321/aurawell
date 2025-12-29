
import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { CircleMessage, CircleMember } from '@/api/entities';
import { User } from '@/api/entities';
import { 
  X, 
  Send, 
  Heart, 
  Users, 
  Sparkles,
  Mic,
  Timer,
  MessageCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

export default function CircleView({ circle, onClose, onRefresh }) {
  const [messages, setMessages] = useState([]);
  const [members, setMembers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentMember, setCurrentMember] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  const loadCircleData = useCallback(async () => {
    setIsLoading(true);
    try {
      const user = await User.me();
      setCurrentUser(user);

      const circleMembers = await CircleMember.filter({ circle_id: circle.id });
      setMembers(circleMembers);
      
      const userMember = circleMembers.find(m => m.user_email === user.email);
      setCurrentMember(userMember);

      const circleMessages = await CircleMessage.list('-created_date');
      const filteredMessages = circleMessages.filter(m => m.circle_id === circle.id);
      setMessages(filteredMessages.slice(0, 50)); // Latest 50 messages
    } catch (error) {
      console.error("Failed to load circle data:", error);
    }
    setIsLoading(false);
  }, [circle.id]); // Depend on circle.id so loadCircleData is stable unless circle.id changes

  useEffect(() => {
    loadCircleData();
  }, [loadCircleData]); // Depend on the memoized loadCircleData function

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !currentMember) return;

    try {
      await CircleMessage.create({
        circle_id: circle.id,
        user_email: currentUser.email,
        display_name: currentMember.display_name,
        content: newMessage.trim(),
        message_type: 'reflection',
        date: new Date().toISOString().split('T')[0]
      });

      setNewMessage('');
      await loadCircleData(); // Re-load data after sending message
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("Failed to send message");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex-shrink-0 p-6 border-b border-gray-100 bg-gradient-to-r from-purple-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-xl">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">{circle.name}</h2>
                <div className="flex items-center gap-3 mt-1">
                  <Badge className="bg-purple-100 text-purple-700 capitalize">
                    {circle.theme.replace('_', ' ')}
                  </Badge>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Users className="w-4 h-4" />
                    <span>{members.length}/10 members</span>
                  </div>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-500">Loading circle...</p>
            </div>
          ) : messages.length > 0 ? (
            messages.map((message, index) => (
              <div key={index} className="bg-gray-50 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="font-semibold text-gray-800">{message.display_name}</span>
                  <span className="text-xs text-gray-500">
                    {new Date(message.created_date).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-gray-700">{message.content}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Button variant="ghost" size="sm" className="text-gray-500 hover:text-red-500">
                    <Heart className="w-4 h-4 mr-1" />
                    {message.hearts_count || 0}
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12 text-gray-500">
              <MessageCircle className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p className="font-semibold">Start the conversation</p>
              <p className="text-sm">Be the first to share a reflection in this circle</p>
            </div>
          )}
        </div>

        {/* Message Input */}
        {currentMember && (
          <div className="flex-shrink-0 p-6 border-t border-gray-100 bg-gray-50">
            <form onSubmit={handleSendMessage} className="flex gap-3">
              <Textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={`Share a reflection as ${currentMember.display_name}...`}
                className="flex-1 rounded-2xl border-gray-200 focus:ring-purple-500 resize-none"
                rows={2}
                maxLength={500}
              />
              <Button
                type="submit"
                disabled={!newMessage.trim()}
                className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-2xl px-6"
              >
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
