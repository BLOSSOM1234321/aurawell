import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import {
  Shield,
  MessageSquare,
  MessageCircle,
  Calendar,
  Bell,
  Filter,
  AlertTriangle,
  Download,
  FileText,
  AlertCircle,
  Clock,
  Users,
  Lock
} from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

export default function TherapistSettings({ user, onUserUpdate }) {
  const [settings, setSettings] = useState({
    // Privacy Controls
    profileVisibility: user?.therapist_settings?.profileVisibility || 'verified-users',
    showContactInfo: user?.therapist_settings?.showContactInfo || false,
    allowClientReviews: user?.therapist_settings?.allowClientReviews || true,

    // Messaging & Communication
    whoCanMessage: user?.therapist_settings?.whoCanMessage || 'verified-clients',
    whoCanComment: user?.therapist_settings?.whoCanComment || 'no-one',
    autoReplyEnabled: user?.therapist_settings?.autoReplyEnabled || false,
    autoReplyMessage: user?.therapist_settings?.autoReplyMessage || "Thank you for your message. I'll respond within 24-48 hours.",

    // Availability
    availableDays: user?.therapist_settings?.availableDays || ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    workingHours: user?.therapist_settings?.workingHours || { start: '09:00', end: '17:00' },
    acceptingNewClients: user?.therapist_settings?.acceptingNewClients || true,
    maxClientsPerWeek: user?.therapist_settings?.maxClientsPerWeek || '10',

    // Notifications
    emailNotifications: user?.therapist_settings?.emailNotifications || true,
    newClientRequests: user?.therapist_settings?.newClientRequests || true,
    sessionReminders: user?.therapist_settings?.sessionReminders || true,
    urgentMessagesOnly: user?.therapist_settings?.urgentMessagesOnly || false,

    // Content Moderation
    profanityFilter: user?.therapist_settings?.profanityFilter || true,
    spamDetection: user?.therapist_settings?.spamDetection || true,
    requireMessageApproval: user?.therapist_settings?.requireMessageApproval || false,

    // Trigger Topics Opt-Out
    optOutTopics: user?.therapist_settings?.optOutTopics || [],

    // Professional Liability Disclaimer
    customDisclaimer: user?.therapist_settings?.customDisclaimer ||
      `The information provided through this platform is for educational and informational purposes only. It is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.

In case of emergency, please call 911 or go to your nearest emergency room.`,

    // Emergency Escalation
    emergencyContactEnabled: user?.therapist_settings?.emergencyContactEnabled || false,
    emergencyContactEmail: user?.therapist_settings?.emergencyContactEmail || '',
    emergencyContactPhone: user?.therapist_settings?.emergencyContactPhone || '',
    crisisProtocol: user?.therapist_settings?.crisisProtocol ||
      `If a client expresses suicidal ideation or intent to harm themselves or others:
1. Contact emergency services (911)
2. Notify my supervisor/clinic director
3. Document all communications
4. Follow up within 24 hours`
  });

  const [isSaving, setIsSaving] = useState(false);

  const triggerTopicOptions = [
    'Self-harm',
    'Suicide',
    'Sexual assault',
    'Domestic violence',
    'Child abuse',
    'Substance abuse',
    'Eating disorders',
    'PTSD/Trauma',
    'Grief/Loss',
    'Relationship violence'
  ];

  const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleToggleTopic = (topic) => {
    setSettings(prev => ({
      ...prev,
      optOutTopics: prev.optOutTopics.includes(topic)
        ? prev.optOutTopics.filter(t => t !== topic)
        : [...prev.optOutTopics, topic]
    }));
  };

  const handleToggleDay = (day) => {
    setSettings(prev => ({
      ...prev,
      availableDays: prev.availableDays.includes(day)
        ? prev.availableDays.filter(d => d !== day)
        : [...prev.availableDays, day]
    }));
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      // Update user in localStorage
      const currentUserData = localStorage.getItem('aurawell_current_user');
      if (currentUserData) {
        const currentUser = JSON.parse(currentUserData);
        const updatedUser = {
          ...currentUser,
          therapist_settings: settings
        };

        // Update current user
        localStorage.setItem('aurawell_current_user', JSON.stringify(updatedUser));

        // Update in users list
        const users = JSON.parse(localStorage.getItem('aurawell_users') || '[]');
        const userIndex = users.findIndex(u => u.id === currentUser.id);
        if (userIndex !== -1) {
          users[userIndex] = updatedUser;
          localStorage.setItem('aurawell_users', JSON.stringify(users));
        }

        toast.success('Settings saved successfully!');
        if (onUserUpdate) onUserUpdate();
      }
    } catch (error) {
      console.error('Error saving settings:', error);
      toast.error('Failed to save settings');
    }
    setIsSaving(false);
  };

  const handleExportData = (type) => {
    toast.info(`Exporting ${type}...`, {
      description: 'Your data export will be ready shortly and sent to your email.'
    });

    // In a real app, this would trigger a server-side export
    // For now, just show a success message
    setTimeout(() => {
      toast.success(`${type} export initiated`, {
        description: 'You will receive an email with the download link.'
      });
    }, 2000);
  };

  return (
    <div className="space-y-6">

      {/* Privacy Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <Card className="border-light">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Shield className="w-5 h-5 text-purple-600" />
              Privacy Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Profile Visibility</Label>
              <select
                value={settings.profileVisibility}
                onChange={(e) => setSettings({...settings, profileVisibility: e.target.value})}
                className="w-full p-2 border border-gray-200 rounded-lg bg-white"
              >
                <option value="public">Public (Anyone can view)</option>
                <option value="verified-users">Verified Users Only</option>
                <option value="clients-only">My Clients Only</option>
                <option value="private">Private (Hidden from directory)</option>
              </select>
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="space-y-1">
                <Label>Show Contact Information</Label>
                <p className="text-xs text-gray-500">Display email and phone on profile</p>
              </div>
              <Switch
                checked={settings.showContactInfo}
                onCheckedChange={(checked) => setSettings({...settings, showContactInfo: checked})}
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="space-y-1">
                <Label>Allow Client Reviews</Label>
                <p className="text-xs text-gray-500">Let clients leave reviews on your profile</p>
              </div>
              <Switch
                checked={settings.allowClientReviews}
                onCheckedChange={(checked) => setSettings({...settings, allowClientReviews: checked})}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Messaging & Communication */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="border-light">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageSquare className="w-5 h-5 text-blue-600" />
              Messaging & Communication
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Who Can Message You</Label>
              <select
                value={settings.whoCanMessage}
                onChange={(e) => setSettings({...settings, whoCanMessage: e.target.value})}
                className="w-full p-2 border border-gray-200 rounded-lg bg-white"
              >
                <option value="anyone">Anyone</option>
                <option value="verified-clients">Verified Clients Only</option>
                <option value="my-clients">My Current Clients Only</option>
                <option value="no-one">No One (Disabled)</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label>Who Can Comment on Your Posts</Label>
              <select
                value={settings.whoCanComment}
                onChange={(e) => setSettings({...settings, whoCanComment: e.target.value})}
                className="w-full p-2 border border-gray-200 rounded-lg bg-white"
              >
                <option value="anyone">Anyone</option>
                <option value="verified-users">Verified Users Only</option>
                <option value="my-clients">My Clients Only</option>
                <option value="no-one">No One (Disabled)</option>
              </select>
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="space-y-1">
                <Label>Auto-Reply for Messages</Label>
                <p className="text-xs text-gray-500">Send automatic response to new messages</p>
              </div>
              <Switch
                checked={settings.autoReplyEnabled}
                onCheckedChange={(checked) => setSettings({...settings, autoReplyEnabled: checked})}
              />
            </div>

            {settings.autoReplyEnabled && (
              <div className="space-y-2 pl-4 border-l-2 border-blue-200">
                <Label>Auto-Reply Message</Label>
                <Textarea
                  value={settings.autoReplyMessage}
                  onChange={(e) => setSettings({...settings, autoReplyMessage: e.target.value})}
                  placeholder="Enter your automatic reply message..."
                  className="min-h-[80px]"
                />
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Availability Scheduling */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="border-light">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Calendar className="w-5 h-5 text-green-600" />
              Availability Scheduling
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Available Days</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {daysOfWeek.map(day => (
                  <button
                    key={day}
                    onClick={() => handleToggleDay(day)}
                    className={`p-2 rounded-lg border-2 text-sm font-medium transition-all ${
                      settings.availableDays.includes(day)
                        ? 'border-green-500 bg-green-50 text-green-700'
                        : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                    }`}
                  >
                    {day.substring(0, 3)}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Working Hours - Start</Label>
                <Input
                  type="time"
                  value={settings.workingHours.start}
                  onChange={(e) => setSettings({
                    ...settings,
                    workingHours: {...settings.workingHours, start: e.target.value}
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label>Working Hours - End</Label>
                <Input
                  type="time"
                  value={settings.workingHours.end}
                  onChange={(e) => setSettings({
                    ...settings,
                    workingHours: {...settings.workingHours, end: e.target.value}
                  })}
                />
              </div>
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="space-y-1">
                <Label>Accepting New Clients</Label>
                <p className="text-xs text-gray-500">Show as available in therapist directory</p>
              </div>
              <Switch
                checked={settings.acceptingNewClients}
                onCheckedChange={(checked) => setSettings({...settings, acceptingNewClients: checked})}
              />
            </div>

            <div className="space-y-2">
              <Label>Max Clients Per Week</Label>
              <Input
                type="number"
                value={settings.maxClientsPerWeek}
                onChange={(e) => setSettings({...settings, maxClientsPerWeek: e.target.value})}
                min="1"
                max="100"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Notification Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="border-light">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Bell className="w-5 h-5 text-yellow-600" />
              Notification Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div className="space-y-1">
                <Label>Email Notifications</Label>
                <p className="text-xs text-gray-500">Receive updates via email</p>
              </div>
              <Switch
                checked={settings.emailNotifications}
                onCheckedChange={(checked) => setSettings({...settings, emailNotifications: checked})}
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="space-y-1">
                <Label>New Client Requests</Label>
                <p className="text-xs text-gray-500">Notify when someone requests an appointment</p>
              </div>
              <Switch
                checked={settings.newClientRequests}
                onCheckedChange={(checked) => setSettings({...settings, newClientRequests: checked})}
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="space-y-1">
                <Label>Session Reminders</Label>
                <p className="text-xs text-gray-500">Get reminders before scheduled sessions</p>
              </div>
              <Switch
                checked={settings.sessionReminders}
                onCheckedChange={(checked) => setSettings({...settings, sessionReminders: checked})}
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="space-y-1">
                <Label>Urgent Messages Only</Label>
                <p className="text-xs text-gray-500">Only notify for urgent/crisis messages</p>
              </div>
              <Switch
                checked={settings.urgentMessagesOnly}
                onCheckedChange={(checked) => setSettings({...settings, urgentMessagesOnly: checked})}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Content Moderation Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        <Card className="border-light">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Filter className="w-5 h-5 text-indigo-600" />
              Content Moderation Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div className="space-y-1">
                <Label>Profanity Filter</Label>
                <p className="text-xs text-gray-500">Automatically filter inappropriate language</p>
              </div>
              <Switch
                checked={settings.profanityFilter}
                onCheckedChange={(checked) => setSettings({...settings, profanityFilter: checked})}
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="space-y-1">
                <Label>Spam Detection</Label>
                <p className="text-xs text-gray-500">Block potential spam messages</p>
              </div>
              <Switch
                checked={settings.spamDetection}
                onCheckedChange={(checked) => setSettings({...settings, spamDetection: checked})}
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div className="space-y-1">
                <Label>Require Message Approval</Label>
                <p className="text-xs text-gray-500">Review messages before they appear publicly</p>
              </div>
              <Switch
                checked={settings.requireMessageApproval}
                onCheckedChange={(checked) => setSettings({...settings, requireMessageApproval: checked})}
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Trigger Topic Opt-Out */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <Card className="border-light">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              Trigger Topic Opt-Out
            </CardTitle>
            <p className="text-sm text-gray-500 mt-2">
              Select topics you prefer not to work with. This helps match you with appropriate clients.
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-3">
              {triggerTopicOptions.map(topic => (
                <button
                  key={topic}
                  onClick={() => handleToggleTopic(topic)}
                  className={`p-3 rounded-lg border-2 text-sm font-medium text-left transition-all ${
                    settings.optOutTopics.includes(topic)
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span>{topic}</span>
                    {settings.optOutTopics.includes(topic) && (
                      <Lock className="w-4 h-4" />
                    )}
                  </div>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Data Export */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
      >
        <Card className="border-light">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Download className="w-5 h-5 text-teal-600" />
              Data Export
            </CardTitle>
            <p className="text-sm text-gray-500 mt-2">
              Export your professional data for backup or record-keeping purposes.
            </p>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              onClick={() => handleExportData('Client Notes')}
              variant="outline"
              className="w-full justify-start"
            >
              <FileText className="w-4 h-4 mr-2" />
              Export Client Notes
            </Button>
            <Button
              onClick={() => handleExportData('Session History')}
              variant="outline"
              className="w-full justify-start"
            >
              <Clock className="w-4 h-4 mr-2" />
              Export Session History
            </Button>
            <Button
              onClick={() => handleExportData('All Data')}
              variant="outline"
              className="w-full justify-start"
            >
              <Download className="w-4 h-4 mr-2" />
              Export All Professional Data
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Professional Liability Disclaimer */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
      >
        <Card className="border-light">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <FileText className="w-5 h-5 text-gray-600" />
              Professional Liability Disclaimer
            </CardTitle>
            <p className="text-sm text-gray-500 mt-2">
              This disclaimer appears on your profile and in client communications.
            </p>
          </CardHeader>
          <CardContent>
            <Textarea
              value={settings.customDisclaimer}
              onChange={(e) => setSettings({...settings, customDisclaimer: e.target.value})}
              className="min-h-[200px] font-mono text-xs"
              placeholder="Enter your professional disclaimer..."
            />
          </CardContent>
        </Card>
      </motion.div>

      {/* Emergency Escalation Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.9 }}
      >
        <Card className="border-light border-red-200 bg-red-50/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg text-red-700">
              <AlertCircle className="w-5 h-5" />
              Emergency Escalation Preferences
            </CardTitle>
            <p className="text-sm text-red-600 mt-2">
              Configure how crisis situations are handled and who to contact.
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div className="space-y-1">
                <Label>Enable Emergency Contact System</Label>
                <p className="text-xs text-gray-600">Activate backup contact for crisis situations</p>
              </div>
              <Switch
                checked={settings.emergencyContactEnabled}
                onCheckedChange={(checked) => setSettings({...settings, emergencyContactEnabled: checked})}
              />
            </div>

            {settings.emergencyContactEnabled && (
              <div className="space-y-4 pl-4 border-l-2 border-red-200">
                <div className="space-y-2">
                  <Label>Emergency Contact Email</Label>
                  <Input
                    type="email"
                    value={settings.emergencyContactEmail}
                    onChange={(e) => setSettings({...settings, emergencyContactEmail: e.target.value})}
                    placeholder="supervisor@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Emergency Contact Phone</Label>
                  <Input
                    type="tel"
                    value={settings.emergencyContactPhone}
                    onChange={(e) => setSettings({...settings, emergencyContactPhone: e.target.value})}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Crisis Protocol</Label>
                  <Textarea
                    value={settings.crisisProtocol}
                    onChange={(e) => setSettings({...settings, crisisProtocol: e.target.value})}
                    className="min-h-[150px] font-mono text-xs"
                    placeholder="Document your step-by-step crisis response protocol..."
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.0 }}
        className="sticky bottom-4 z-10"
      >
        <Card className="border-light shadow-lg">
          <CardContent className="p-4">
            <Button
              onClick={handleSaveSettings}
              disabled={isSaving}
              className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-semibold py-3"
            >
              {isSaving ? 'Saving...' : 'Save Therapist Settings'}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}