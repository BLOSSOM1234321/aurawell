import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, User } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { mockTherapistMessages } from "../../data/mockTherapists";

export default function MessagingCenter({ therapist, clients, onUpdate }) {
  const [selectedClient, setSelectedClient] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (selectedClient) {
      loadMessages();
      const interval = setInterval(loadMessages, 5000); // Poll for new messages
      return () => clearInterval(interval);
    }
  }, [selectedClient]);

  const loadMessages = async () => {
    if (!selectedClient) return;

    // Load from localStorage or use mock data
    const storedMessages = localStorage.getItem('therapist_messages');
    const allMessages = storedMessages ? JSON.parse(storedMessages) : mockTherapistMessages;

    const messagesData = allMessages.filter(
      msg => msg.therapist_email === therapist.email && msg.client_email === selectedClient.client_email
    );

    setMessages(messagesData.sort((a, b) => new Date(a.sent_at || a.created_date) - new Date(b.sent_at || b.created_date)));

    // Mark messages as read
    const unreadMessages = messagesData.filter(m => !m.is_read && m.sender_email !== therapist.email);
    if (unreadMessages.length > 0) {
      const updatedMessages = allMessages.map(msg => {
        if (unreadMessages.find(um => um.id === msg.id)) {
          return { ...msg, is_read: true, read_date: new Date().toISOString() };
        }
        return msg;
      });
      localStorage.setItem('therapist_messages', JSON.stringify(updatedMessages));
    }

    if (onUpdate) onUpdate();
    scrollToBottom();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedClient) return;

    try {
      // Create new message object
      const newMsg = {
        id: `message-${Date.now()}`,
        therapist_email: therapist.email,
        client_email: selectedClient.client_email,
        sender_email: therapist.email,
        sender_name: therapist.name || therapist.preferred_name || therapist.full_name,
        message: newMessage.trim(),
        message_content: newMessage.trim(),
        is_read: false,
        sent_at: new Date().toISOString(),
        created_date: new Date().toISOString()
      };

      // Save to localStorage
      const storedMessages = localStorage.getItem('therapist_messages');
      const allMessages = storedMessages ? JSON.parse(storedMessages) : mockTherapistMessages;
      allMessages.push(newMsg);
      localStorage.setItem('therapist_messages', JSON.stringify(allMessages));

      setNewMessage("");
      loadMessages();
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Failed to send message");
    }
  };

  return (
    <div className="grid md:grid-cols-3 gap-4 h-[600px]">
      {/* Client List */}
      <div className="md:col-span-1">
        <Card className="h-full">
          <CardContent className="p-4">
            <h3 className="font-semibold text-gray-800 mb-4">Clients</h3>
            <div className="space-y-2">
              {clients.map(client => (
                <button
                  key={client.id}
                  onClick={() => setSelectedClient(client)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedClient?.id === client.id
                      ? 'bg-purple-100 border-2 border-purple-300'
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                      {client.client_name?.[0] || 'C'}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 truncate">{client.client_name}</p>
                      <p className="text-xs text-gray-500 truncate">{client.client_email}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Messages Area */}
      <div className="md:col-span-2">
        <Card className="h-full flex flex-col">
          {selectedClient ? (
            <>
              <div className="p-4 border-b">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold">
                    {selectedClient.client_name?.[0] || 'C'}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">{selectedClient.client_name}</p>
                    <p className="text-xs text-gray-500">Active client</p>
                  </div>
                </div>
              </div>

              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map(message => (
                    <div
                      key={message.id}
                      className={`flex ${message.sender_email === therapist.email ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[70%] ${
                        message.sender_email === therapist.email
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-800'
                      } rounded-2xl p-3`}>
                        <p className="text-sm">{message.message_content}</p>
                        <p className={`text-xs mt-1 ${
                          message.sender_email === therapist.email ? 'text-purple-200' : 'text-gray-500'
                        }`}>
                          {format(new Date(message.created_date), 'h:mm a')}
                        </p>
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </ScrollArea>

              <form onSubmit={handleSendMessage} className="p-4 border-t">
                <div className="flex gap-2">
                  <Input
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1"
                  />
                  <Button type="submit" style={{ backgroundColor: '#5C4B99' }} className="text-white">
                    <Send className="w-4 h-4" />
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              <div className="text-center">
                <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>Select a client to start messaging</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}