import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Users, Send, LogOut, Loader2, AlertTriangle, Shield, MoreVertical
} from 'lucide-react';
import { toast } from 'sonner';
import { SupportRoom, SupportRoomMessage, SupportRoomMember } from '@/api/entities';
import { leaveRoom } from '@/api/supportRooms';
import BackHeader from '@/components/navigation/BackHeader';
import { format } from 'date-fns';

export default function SupportRoomChat() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [messageText, setMessageText] = useState('');
  const [user, setUser] = useState(null);
  const messagesEndRef = useRef(null);
  const pollIntervalRef = useRef(null);

  useEffect(() => {
    loadData();

    // Poll for new messages every 3 seconds
    pollIntervalRef.current = setInterval(() => {
      loadMessages();
    }, 3000);

    return () => {
      if (pollIntervalRef.current) {
        clearInterval(pollIntervalRef.current);
      }
    };
  }, [roomId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const loadData = async () => {
    try {
      setLoading(true);

      // Load user
      const userData = localStorage.getItem('aurawell_current_user');
      if (userData) {
        setUser(JSON.parse(userData));
      }

      // Load room with support group info
      const roomData = await SupportRoom.findById(roomId, {
        include: {
          supportGroup: true
        }
      });
      setRoom(roomData);

      // Load messages
      await loadMessages();

      // Load members
      await loadMembers();
    } catch (error) {
      console.error('Failed to load room:', error);
      toast.error('Failed to load support room');
    } finally {
      setLoading(false);
    }
  };

  const loadMessages = async () => {
    try {
      const messagesData = await SupportRoomMessage.findMany({
        where: {
          roomId: roomId,
          deletedAt: null // Don't show deleted messages to regular users
        },
        include: {
          user: true
        },
        orderBy: {
          createdAt: 'asc'
        }
      });
      setMessages(messagesData);
    } catch (error) {
      console.error('Failed to load messages:', error);
    }
  };

  const loadMembers = async () => {
    try {
      const membersData = await SupportRoomMember.findMany({
        where: {
          roomId: roomId,
          leftAt: null
        },
        include: {
          user: true
        }
      });
      setMembers(membersData);
    } catch (error) {
      console.error('Failed to load members:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!messageText.trim() || !user) return;

    if (messageText.trim().length > 1000) {
      toast.error('Message is too long (max 1000 characters)');
      return;
    }

    setSending(true);

    try {
      await SupportRoomMessage.create({
        roomId: roomId,
        userId: user.id,
        text: messageText.trim()
      });

      setMessageText('');
      await loadMessages(); // Reload to show new message
    } catch (error) {
      console.error('Failed to send message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const handleLeaveRoom = async () => {
    if (!confirm('Are you sure you want to leave this support room?')) {
      return;
    }

    try {
      const result = await leaveRoom(roomId, user.id);

      if (result.success) {
        toast.success('Left support room');
        navigate('/community');
      } else {
        toast.error(result.error || 'Failed to leave room');
      }
    } catch (error) {
      console.error('Failed to leave room:', error);
      toast.error('An error occurred');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <Card className="max-w-md mx-auto mt-20">
          <CardContent className="p-8 text-center">
            <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Room Not Found</h2>
            <Button onClick={() => navigate('/community')} className="mt-4">
              Back to Community
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const stageColors = {
    beginner: 'from-green-500 to-emerald-600',
    intermediate: 'from-blue-500 to-indigo-600',
    advanced: 'from-purple-500 to-pink-600'
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <div className={`bg-gradient-to-r ${stageColors[room.stage] || 'from-purple-600 to-indigo-600'} text-white p-4 shadow-lg`}>
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <Users className="w-5 h-5" />
                <h1 className="text-xl font-bold">
                  {room.supportGroup?.name} • {room.stage.charAt(0).toUpperCase() + room.stage.slice(1)}
                </h1>
              </div>
              <p className="text-sm text-white/90">
                Room #{room.roomNumber} • {room.memberCount}/{room.maxMembers} members
              </p>
            </div>

            <Button
              onClick={handleLeaveRoom}
              variant="ghost"
              className="text-white hover:bg-white/20"
            >
              <LogOut className="w-5 h-5 mr-2" />
              Leave
            </Button>
          </div>
        </div>
      </div>

      {/* Guidelines Banner */}
      <div className="bg-blue-50 border-b border-blue-200 py-2 px-4">
        <div className="max-w-4xl mx-auto flex items-center gap-2 text-sm text-blue-800">
          <Shield className="w-4 h-4 flex-shrink-0" />
          <p>This is a safe, private space. Please be respectful and supportive of all members.</p>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto bg-white">
        <div className="max-w-4xl mx-auto p-4 space-y-4">
          {messages.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-3 text-gray-400" />
              <p className="text-lg font-medium mb-1">Welcome to your support room!</p>
              <p className="text-sm">Be the first to share and start the conversation.</p>
            </div>
          ) : (
            messages.map((message) => {
              const isOwnMessage = message.userId === user?.id;

              return (
                <div
                  key={message.id}
                  className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[70%] ${isOwnMessage ? 'items-end' : 'items-start'} flex flex-col`}>
                    {!isOwnMessage && (
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-indigo-500 flex items-center justify-center text-white text-sm font-semibold">
                          {message.user?.name?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {message.user?.name || 'Anonymous'}
                        </span>
                      </div>
                    )}

                    <div
                      className={`rounded-2xl px-4 py-2 ${
                        isOwnMessage
                          ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      <p className="whitespace-pre-wrap break-words">{message.text}</p>
                      <p className={`text-xs mt-1 ${isOwnMessage ? 'text-purple-200' : 'text-gray-500'}`}>
                        {format(new Date(message.createdAt), 'h:mm a')}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Message Input */}
      <div className="bg-white border-t border-gray-200 p-4 shadow-lg">
        <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto flex gap-2">
          <Input
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            placeholder="Type your message... (Be kind and supportive)"
            disabled={sending}
            maxLength={1000}
            className="flex-1"
          />
          <Button
            type="submit"
            disabled={!messageText.trim() || sending}
            className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
          >
            {sending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </form>
        <p className="text-xs text-gray-500 mt-2 text-center">
          {messageText.length}/1000 characters
        </p>
      </div>
    </div>
  );
}