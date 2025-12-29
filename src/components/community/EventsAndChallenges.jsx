import React, { useState, useEffect, useCallback } from 'react';
import { CommunityEvent, CommunityChallenge, ChallengeParticipation, EventRegistration } from '@/api/entities';
import { User } from '@/api/entities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Calendar, Users, Trophy, Clock, Star, CheckCircle2, Video, UserPlus } from 'lucide-react';
import { format, parseISO, addDays, isAfter, isBefore, isToday } from 'date-fns';
import { toast } from 'sonner';
import { AnimatePresence, motion } from 'framer-motion';

export default function EventsAndChallenges({ groupSlug }) {
  const [events, setEvents] = useState([]);
  const [challenges, setChallenges] = useState([]);
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('challenges');
  const [userParticipations, setUserParticipations] = useState([]);
  const [userRegistrations, setUserRegistrations] = useState([]);

  const loadData = useCallback(async () => {
    try {
      const currentUser = await User.me();
      setUser(currentUser);

      // Load events for this group
      const groupEvents = await CommunityEvent.filter({ group_slug: groupSlug }, '-scheduled_date');
      setEvents(groupEvents);

      // Load challenges for this group
      const groupChallenges = await CommunityChallenge.filter({ group_slug: groupSlug }, '-start_date');
      setChallenges(groupChallenges);

      if (currentUser?.email) {
        // Load user's participations
        const participations = await ChallengeParticipation.filter({ user_email: currentUser.email });
        setUserParticipations(participations);

        // Load user's event registrations
        const registrations = await EventRegistration.filter({ user_email: currentUser.email });
        setUserRegistrations(registrations);
      }
    } catch (error) {
      console.error('Error loading events and challenges:', error);
    }
  }, [groupSlug]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const joinChallenge = async (challenge) => {
    if (!user?.email) return;
    
    try {
      // Check if already participating
      const existingParticipation = userParticipations.find(p => p.challenge_id === challenge.id);
      if (existingParticipation) {
        toast.info("You're already participating in this challenge!");
        return;
      }

      await ChallengeParticipation.create({
        challenge_id: challenge.id,
        user_email: user.email,
        progress: [],
        current_day: 1
      });

      // Update challenge participant count
      await CommunityChallenge.update(challenge.id, {
        participant_count: challenge.participant_count + 1
      });

      toast.success("Successfully joined the challenge!");
      loadData();
    } catch (error) {
      console.error("Error joining challenge:", error);
      toast.error("Failed to join challenge.");
    }
  };

  const registerForEvent = async (event) => {
    if (!user?.email) return;

    try {
      // Check if already registered
      const existingRegistration = userRegistrations.find(r => r.event_id === event.id);
      if (existingRegistration) {
        toast.info("You're already registered for this event!");
        return;
      }

      if (event.max_participants && event.registration_count >= event.max_participants) {
        toast.error("This event is full!");
        return;
      }

      await EventRegistration.create({
        event_id: event.id,
        user_email: user.email,
        user_full_name: user.full_name || 'Anonymous User',
        registration_date: new Date().toISOString()
      });

      // Update event registration count
      await CommunityEvent.update(event.id, {
        registration_count: event.registration_count + 1
      });

      toast.success("Successfully registered for the event!");
      loadData();
    } catch (error) {
      console.error("Error registering for event:", error);
      toast.error("Failed to register for event.");
    }
  };

  const submitChallengeProgress = async (challengeId, dayNumber, response) => {
    if (!user?.email) return;

    try {
      const participation = userParticipations.find(p => p.challenge_id === challengeId);
      if (!participation) return;

      const updatedProgress = [...(participation.progress || [])];
      const dayIndex = updatedProgress.findIndex(p => p.day === dayNumber);
      
      const progressEntry = {
        day: dayNumber,
        completed: true,
        response: response,
        completed_date: new Date().toISOString()
      };

      if (dayIndex >= 0) {
        updatedProgress[dayIndex] = progressEntry;
      } else {
        updatedProgress.push(progressEntry);
      }

      await ChallengeParticipation.update(participation.id, {
        progress: updatedProgress,
        current_day: Math.max(dayNumber + 1, participation.current_day || 1)
      });

      toast.success("Progress saved!");
      loadData();
    } catch (error) {
      console.error("Error submitting progress:", error);
      toast.error("Failed to save progress.");
    }
  };

  const getChallengeStatus = (challenge) => {
    const now = new Date();
    const startDate = parseISO(challenge.start_date);
    const endDate = parseISO(challenge.end_date);
    
    if (isBefore(now, startDate)) return 'upcoming';
    if (isAfter(now, endDate)) return 'completed';
    return 'active';
  };

  const getEventStatus = (event) => {
    const now = new Date();
    const eventDate = parseISO(event.scheduled_date);
    
    if (event.status === 'live') return 'live';
    if (event.status === 'completed') return 'completed';
    if (isBefore(now, eventDate)) return 'upcoming';
    return 'completed';
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="challenges" className="flex items-center gap-2">
            <Trophy className="w-4 h-4" />
            Challenges
          </TabsTrigger>
          <TabsTrigger value="events" className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            Events
          </TabsTrigger>
        </TabsList>

        <TabsContent value="challenges" className="space-y-4">
          {challenges.length > 0 ? challenges.map(challenge => {
            const status = getChallengeStatus(challenge);
            const userParticipation = userParticipations.find(p => p.challenge_id === challenge.id);
            const isParticipating = !!userParticipation;

            return (
              <Card key={challenge.id} className="bg-white/90 border-0 shadow-lg rounded-2xl">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-3">
                        <Trophy className="w-5 h-5 text-yellow-600" />
                        {challenge.title}
                        <Badge className={
                          status === 'active' ? 'bg-green-100 text-green-800' :
                          status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }>
                          {status}
                        </Badge>
                      </CardTitle>
                      <p className="text-gray-600 mt-1">{challenge.description}</p>
                    </div>
                    {!isParticipating && status === 'active' && (
                      <Button onClick={() => joinChallenge(challenge)} className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Join
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      {format(parseISO(challenge.start_date), 'MMM d')} - {format(parseISO(challenge.end_date), 'MMM d')}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      {challenge.participant_count} participants
                    </div>
                  </div>

                  {isParticipating && status === 'active' && (
                    <ChallengeProgressForm 
                      challenge={challenge}
                      participation={userParticipation}
                      onSubmitProgress={submitChallengeProgress}
                    />
                  )}
                </CardContent>
              </Card>
            );
          }) : (
            <Card className="bg-white/90 border-0 shadow-lg rounded-2xl">
              <CardContent className="text-center py-12">
                <Trophy className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No challenges available for this group yet.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          {events.length > 0 ? events.map(event => {
            const status = getEventStatus(event);
            const isRegistered = userRegistrations.some(r => r.event_id === event.id);

            return (
              <Card key={event.id} className="bg-white/90 border-0 shadow-lg rounded-2xl">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-3">
                        <Video className="w-5 h-5 text-blue-600" />
                        {event.title}
                        <Badge className={
                          status === 'live' ? 'bg-red-100 text-red-800' :
                          status === 'upcoming' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }>
                          {status}
                        </Badge>
                        {event.is_premium_only && (
                          <Badge className="bg-yellow-100 text-yellow-800">Premium</Badge>
                        )}
                      </CardTitle>
                      <p className="text-gray-600 mt-1">{event.description}</p>
                    </div>
                    {!isRegistered && status === 'upcoming' && (
                      <Button onClick={() => registerForEvent(event)} className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-xl">
                        <UserPlus className="w-4 h-4 mr-2" />
                        Register
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        {format(parseISO(event.scheduled_date), 'MMMM d, yyyy • h:mm a')}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="w-4 h-4" />
                        {event.duration_minutes} minutes
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Users className="w-4 h-4" />
                        {event.registration_count} registered
                        {event.max_participants && ` / ${event.max_participants} max`}
                      </div>
                    </div>
                    {event.expert_name && (
                      <div className="space-y-1">
                        <p className="text-sm font-semibold text-gray-800">Expert Host</p>
                        <p className="text-sm text-gray-700">{event.expert_name}</p>
                        {event.expert_credentials && (
                          <p className="text-xs text-gray-600">{event.expert_credentials}</p>
                        )}
                      </div>
                    )}
                  </div>

                  {isRegistered && (
                    <div className="p-3 bg-green-50 border border-green-200 rounded-xl">
                      <div className="flex items-center gap-2 text-green-800">
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="font-semibold">You're registered!</span>
                      </div>
                      {status === 'live' && event.meeting_link && (
                        <Button 
                          onClick={() => window.open(event.meeting_link, '_blank')}
                          className="mt-2 bg-green-600 text-white rounded-xl"
                        >
                          Join Meeting
                        </Button>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          }) : (
            <Card className="bg-white/90 border-0 shadow-lg rounded-2xl">
              <CardContent className="text-center py-12">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No events scheduled for this group yet.</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}

// Challenge Progress Form Component
const ChallengeProgressForm = ({ challenge, participation, onSubmitProgress }) => {
  const [response, setResponse] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getCurrentDay = () => {
    const startDate = parseISO(challenge.start_date);
    const now = new Date();
    const daysSinceStart = Math.floor((now - startDate) / (1000 * 60 * 60 * 24)) + 1;
    return Math.max(1, Math.min(daysSinceStart, challenge.duration_days));
  };

  const currentDay = getCurrentDay();
  const todayPrompt = challenge.daily_prompt?.[currentDay - 1] || `Day ${currentDay} reflection`;
  const hasSubmittedToday = participation.progress?.some(p => p.day === currentDay && p.completed);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!response.trim()) return;

    setIsSubmitting(true);
    await onSubmitProgress(challenge.id, currentDay, response);
    setResponse('');
    setIsSubmitting(false);
  };

  const completedDays = participation.progress?.filter(p => p.completed).length || 0;
  const progressPercentage = (completedDays / challenge.duration_days) * 100;

  return (
    <div className="space-y-4 p-4 bg-purple-50 rounded-2xl border border-purple-200">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-purple-800">Your Progress</h3>
        <Badge className="bg-purple-100 text-purple-800">
          Day {currentDay} of {challenge.duration_days}
        </Badge>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Progress</span>
          <span>{Math.round(progressPercentage)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3">
          <div 
            className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {!hasSubmittedToday && currentDay <= challenge.duration_days && (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="font-medium text-gray-700 mb-2 block">Today's Prompt:</label>
            <p className="text-gray-600 italic mb-3">{todayPrompt}</p>
          </div>
          <Textarea
            value={response}
            onChange={(e) => setResponse(e.target.value)}
            placeholder="Share your response..."
            rows={3}
            required
          />
          <Button 
            type="submit" 
            disabled={isSubmitting || !response.trim()}
            className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl"
          >
            {isSubmitting ? 'Submitting...' : 'Submit Today\'s Response'}
          </Button>
        </form>
      )}

      {hasSubmittedToday && (
        <div className="p-3 bg-green-50 border border-green-200 rounded-xl">
          <div className="flex items-center gap-2 text-green-800">
            <CheckCircle2 className="w-4 h-4" />
            <span className="font-semibold">Completed for today!</span>
          </div>
        </div>
      )}
    </div>
  );
};