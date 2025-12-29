import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Calendar, MessageSquare, FileText, Clock, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { format } from "date-fns";
import { toast } from "sonner";
import BackHeader from "../components/navigation/BackHeader";
import { createPageUrl } from "@/utils";
import ClientList from "../components/therapist/ClientList";
import SessionScheduler from "../components/therapist/SessionScheduler";
import MessagingCenter from "../components/therapist/MessagingCenter";
import ClientNotesManager from "../components/therapist/ClientNotesManager";
import { mockTherapistClients, mockTherapySessions, mockTherapistMessages } from "../data/mockTherapists";

export default function TherapistDashboard() {
  const [user, setUser] = useState(null);
  const [clients, setClients] = useState([]);
  const [upcomingSessions, setUpcomingSessions] = useState([]);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("clients");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Get user from localStorage
      const currentUserData = localStorage.getItem('aurawell_current_user');
      if (!currentUserData) {
        toast.error("Please log in to access the therapist dashboard.");
        setIsLoading(false);
        return;
      }

      const currentUser = JSON.parse(currentUserData);
      setUser(currentUser);

      if (currentUser.user_type !== 'therapist' || currentUser.verification_status !== 'verified') {
        toast.error("Access denied. Only verified therapists can access this page.");
        setIsLoading(false);
        return;
      }

      // Simulate async loading with mock data
      setTimeout(() => {
        // Load clients for this therapist
        const clientsData = mockTherapistClients.filter(
          client => client.therapist_email === currentUser.email
        );
        setClients(clientsData);

        // Load upcoming sessions for this therapist
        const sessionsData = mockTherapySessions.filter(
          session => session.therapist_email === currentUser.email && session.status === 'scheduled'
        );
        const upcoming = sessionsData
          .filter(s => new Date(s.scheduled_date) >= new Date())
          .sort((a, b) => new Date(a.scheduled_date) - new Date(b.scheduled_date))
          .slice(0, 5);
        setUpcomingSessions(upcoming);

        // Count unread messages from clients
        const messages = mockTherapistMessages.filter(
          msg => msg.therapist_email === currentUser.email && !msg.is_read
        );
        const unreadFromClients = messages.filter(m => m.sender_email !== currentUser.email);
        setUnreadMessages(unreadFromClients.length);

        setIsLoading(false);
      }, 300);
    } catch (error) {
      console.error("Error loading dashboard:", error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  if (user?.user_type !== 'therapist' || user?.verification_status !== 'verified') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-bold text-gray-800 mb-2">Access Restricted</h2>
            <p className="text-gray-600">This page is only accessible to verified therapists.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <BackHeader
          title="Therapist Dashboard"
          subtitle="Manage your clients and practice"
          backTo={createPageUrl("Profile")}
          backLabel="Profile"
        />

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Clients</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {clients.filter(c => c.status === 'active').length}
                    </p>
                  </div>
                  <div className="p-3 rounded-full" style={{ backgroundColor: '#5C4B9920' }}>
                    <Users className="w-6 h-6" style={{ color: '#5C4B99' }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Upcoming Sessions</p>
                    <p className="text-2xl font-bold text-gray-800">{upcomingSessions.length}</p>
                  </div>
                  <div className="p-3 rounded-full bg-blue-100">
                    <Calendar className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Unread Messages</p>
                    <p className="text-2xl font-bold text-gray-800">{unreadMessages}</p>
                  </div>
                  <div className="p-3 rounded-full bg-green-100">
                    <MessageSquare className="w-6 h-6 text-green-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Clients</p>
                    <p className="text-2xl font-bold text-gray-800">{clients.length}</p>
                  </div>
                  <div className="p-3 rounded-full bg-purple-100">
                    <FileText className="w-6 h-6 text-purple-600" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Main Content Tabs */}
        <Card>
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="clients">Clients</TabsTrigger>
                <TabsTrigger value="schedule">Schedule</TabsTrigger>
                <TabsTrigger value="messages">Messages {unreadMessages > 0 && `(${unreadMessages})`}</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>

              <TabsContent value="clients" className="mt-6">
                <ClientList clients={clients} onUpdate={loadDashboardData} />
              </TabsContent>

              <TabsContent value="schedule" className="mt-6">
                <SessionScheduler 
                  therapist={user} 
                  clients={clients.filter(c => c.status === 'active')}
                  onUpdate={loadDashboardData}
                />
              </TabsContent>

              <TabsContent value="messages" className="mt-6">
                <MessagingCenter 
                  therapist={user}
                  clients={clients.filter(c => c.status === 'active')}
                  onUpdate={loadDashboardData}
                />
              </TabsContent>

              <TabsContent value="notes" className="mt-6">
                <ClientNotesManager
                  therapist={user}
                  clients={clients.filter(c => c.status === 'active')}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}