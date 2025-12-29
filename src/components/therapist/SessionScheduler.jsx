import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, Plus, X } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { mockTherapySessions } from "../../data/mockTherapists";

export default function SessionScheduler({ therapist, clients, onUpdate }) {
  const [sessions, setSessions] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    client_email: "",
    scheduled_date: "",
    duration_minutes: 60,
    session_type: "follow_up",
    meeting_link: ""
  });

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    // Load from localStorage or use mock data
    const storedSessions = localStorage.getItem('therapy_sessions');
    const allSessions = storedSessions ? JSON.parse(storedSessions) : mockTherapySessions;

    const sessionsData = allSessions.filter(
      session => session.therapist_email === therapist.email
    );
    setSessions(sessionsData.sort((a, b) => new Date(a.scheduled_date) - new Date(b.scheduled_date)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const selectedClient = clients.find(c => c.client_email === formData.client_email);

      // Create new session object
      const newSession = {
        id: `session-${Date.now()}`,
        therapist_email: therapist.email,
        client_email: formData.client_email,
        client_name: selectedClient?.client_name,
        scheduled_date: new Date(formData.scheduled_date).toISOString(),
        duration_minutes: parseInt(formData.duration_minutes),
        session_type: formData.session_type,
        meeting_link: formData.meeting_link,
        status: 'scheduled',
        notes: ""
      };

      // Save to localStorage
      const storedSessions = localStorage.getItem('therapy_sessions');
      const allSessions = storedSessions ? JSON.parse(storedSessions) : mockTherapySessions;
      allSessions.push(newSession);
      localStorage.setItem('therapy_sessions', JSON.stringify(allSessions));

      toast.success("Session scheduled successfully!");
      setShowForm(false);
      setFormData({
        client_email: "",
        scheduled_date: "",
        duration_minutes: 60,
        session_type: "follow_up",
        meeting_link: ""
      });
      loadSessions();
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error scheduling session:", error);
      toast.error("Failed to schedule session");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">Session Schedule</h3>
        <Button onClick={() => setShowForm(!showForm)} style={{ backgroundColor: '#5C4B99' }} className="text-white">
          <Plus className="w-4 h-4 mr-2" />
          Schedule Session
        </Button>
      </div>

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card>
              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label>Select Client *</Label>
                    <Select value={formData.client_email} onValueChange={(value) => setFormData({...formData, client_email: value})}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Choose a client" />
                      </SelectTrigger>
                      <SelectContent>
                        {clients.map(client => (
                          <SelectItem key={client.id} value={client.client_email}>
                            {client.client_name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label>Date & Time *</Label>
                      <Input
                        type="datetime-local"
                        value={formData.scheduled_date}
                        onChange={(e) => setFormData({...formData, scheduled_date: e.target.value})}
                        required
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label>Duration (minutes)</Label>
                      <Input
                        type="number"
                        value={formData.duration_minutes}
                        onChange={(e) => setFormData({...formData, duration_minutes: e.target.value})}
                        required
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Session Type</Label>
                    <Select value={formData.session_type} onValueChange={(value) => setFormData({...formData, session_type: value})}>
                      <SelectTrigger className="mt-2">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="initial">Initial Consultation</SelectItem>
                        <SelectItem value="follow_up">Follow-up Session</SelectItem>
                        <SelectItem value="check_in">Check-in</SelectItem>
                        <SelectItem value="emergency">Emergency Session</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Meeting Link (Optional)</Label>
                    <Input
                      type="url"
                      placeholder="https://meet.google.com/..."
                      value={formData.meeting_link}
                      onChange={(e) => setFormData({...formData, meeting_link: e.target.value})}
                      className="mt-2"
                    />
                  </div>

                  <div className="flex gap-3">
                    <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="flex-1">
                      Cancel
                    </Button>
                    <Button type="submit" style={{ backgroundColor: '#5C4B99' }} className="flex-1 text-white">
                      Schedule Session
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-3">
        {sessions.filter(s => new Date(s.scheduled_date) >= new Date() && s.status === 'scheduled').map(session => (
          <Card key={session.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <p className="font-semibold text-gray-800">{session.client_name}</p>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(session.scheduled_date), 'MMM d, yyyy')}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {format(new Date(session.scheduled_date), 'h:mm a')} ({session.duration_minutes} min)
                    </span>
                  </div>
                  <span className="text-xs text-gray-500 capitalize">{session.session_type.replace('_', ' ')}</span>
                </div>
                {session.meeting_link && (
                  <Button size="sm" variant="outline" onClick={() => window.open(session.meeting_link, '_blank')}>
                    Join
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}