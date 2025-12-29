import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Database, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function InitializeSupportGroups() {
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [groupCount, setGroupCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    checkExistingData();
  }, []);

  const checkExistingData = () => {
    const existingGroups = JSON.parse(localStorage.getItem('aurawell_SupportGroup') || '[]');
    setGroupCount(existingGroups.length);
  };

  const seedSupportGroups = () => {
    setStatus('loading');

    const supportGroups = [
      {
        id: 'SupportGroup_1',
        title: 'Anxiety Support',
        slug: 'anxiety-support',
        description: 'Share experiences and coping strategies for anxiety in a supportive environment.',
        icon: 'Brain',
        color: 'from-blue-400 to-cyan-500',
        textColor: 'text-blue-800',
        topic: 'anxiety',
        guidelines: `• Be respectful and kind to all members
• No medical advice - share experiences only
• Keep discussions on topic
• Respect privacy - what's shared here stays here
• Support, don't diagnose`,
        moderatorIds: [],
        isArchived: false,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'SupportGroup_2',
        title: 'Depression Support',
        slug: 'depression-support',
        description: 'A compassionate community for those navigating depression and seeking hope.',
        icon: 'Users',
        color: 'from-indigo-400 to-indigo-600',
        textColor: 'text-indigo-800',
        topic: 'depression',
        guidelines: `• This is a judgment-free zone
• Be patient with yourself and others
• No toxic positivity - all feelings are valid
• Trigger warnings for sensitive content
• Reach out if you're in crisis`,
        moderatorIds: [],
        isArchived: false,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'SupportGroup_3',
        title: 'Trauma Recovery & PTSD',
        slug: 'trauma-recovery-ptsd',
        description: 'Healing together through shared experiences and trauma-informed support.',
        icon: 'Heart',
        color: 'from-red-400 to-red-600',
        textColor: 'text-red-800',
        topic: 'ptsd',
        guidelines: `• Use content warnings for trauma discussions
• Respect boundaries and triggers
• Focus on recovery and healing
• No graphic details unless requested
• Support without pushing for disclosure`,
        moderatorIds: [],
        isArchived: false,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'SupportGroup_4',
        title: 'Bipolar & Mood Disorder Support',
        slug: 'bipolar-mood-disorder-support',
        description: 'Understanding and managing bipolar disorder and other mood disorders together.',
        icon: 'Brain',
        color: 'from-purple-400 to-purple-600',
        textColor: 'text-purple-800',
        topic: 'bipolar',
        guidelines: `• Share what works for you
• Be open to different coping strategies
• No judgment of stress levels
• Practical advice welcome
• Remember self-care is not selfish`,
        moderatorIds: [],
        isArchived: false,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'SupportGroup_5',
        title: 'Borderline Personality Disorder (BPD) Support',
        slug: 'bpd-support',
        description: 'A supportive community for those with BPD, focusing on DBT skills and emotional wellness.',
        icon: 'Heart',
        color: 'from-pink-400 to-pink-600',
        textColor: 'text-pink-800',
        topic: 'bpd',
        guidelines: `• All mental health topics welcome
• Be inclusive and accepting
• Share resources and wins
• Support others where you can
• Take breaks when needed`,
        moderatorIds: [],
        isArchived: false,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      {
        id: 'SupportGroup_6',
        title: 'ADHD & Neurodivergence Support',
        slug: 'adhd-neurodivergence-support',
        description: 'Support and strategies for ADHD and neurodivergent individuals navigating daily life.',
        icon: 'Brain',
        color: 'from-orange-400 to-orange-600',
        textColor: 'text-orange-800',
        topic: 'adhd',
        guidelines: `• Be respectful and understanding
• Share strategies and resources
• Support different experiences
• No judgment of symptoms
• Celebrate neurodiversity`,
        moderatorIds: [],
        isArchived: false,
        isActive: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ];

    try {
      localStorage.setItem('aurawell_SupportGroup', JSON.stringify(supportGroups));
      setStatus('success');
      setGroupCount(supportGroups.length);
      toast.success(`Successfully initialized ${supportGroups.length} Support Groups!`);
    } catch (error) {
      setStatus('error');
      toast.error('Failed to initialize Support Groups');
      console.error(error);
    }
  };

  const clearSupportGroups = () => {
    if (window.confirm('Are you sure you want to clear all Support Groups? This will also clear all related rooms and messages.')) {
      localStorage.removeItem('aurawell_SupportGroup');
      localStorage.removeItem('aurawell_SupportRoom');
      localStorage.removeItem('aurawell_SupportRoomMember');
      localStorage.removeItem('aurawell_SupportRoomMessage');
      localStorage.removeItem('aurawell_ModerationAction');
      setGroupCount(0);
      setStatus('idle');
      toast.success('All Support Groups data cleared');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="border-blue-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <CardTitle className="flex items-center gap-2">
              <Database className="w-6 h-6" />
              Initialize Support Groups
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Current Status */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Current Status</h3>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Support Groups in localStorage:</span>
                  <span className="text-sm font-medium">{groupCount}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={seedSupportGroups}
                disabled={status === 'loading'}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                {status === 'loading' ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Initializing...
                  </>
                ) : (
                  <>
                    <Database className="w-4 h-4 mr-2" />
                    {groupCount > 0 ? 'Re-initialize' : 'Initialize'} Support Groups
                  </>
                )}
              </Button>

              {groupCount > 0 && (
                <Button
                  onClick={clearSupportGroups}
                  disabled={status === 'loading'}
                  variant="outline"
                  className="w-full border-red-300 text-red-600 hover:bg-red-50"
                >
                  Clear All Support Groups Data
                </Button>
              )}

              {status === 'success' && (
                <Button
                  onClick={() => navigate(createPageUrl('Groups'))}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  View Support Groups
                </Button>
              )}
            </div>

            {/* Status Messages */}
            {status === 'success' && (
              <div className="bg-green-50 border-l-4 border-green-600 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="font-semibold text-green-900">Success!</p>
                    <p className="text-sm text-green-800">
                      {groupCount} Support Groups have been initialized in localStorage.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {status === 'error' && (
              <div className="bg-red-50 border-l-4 border-red-600 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="font-semibold text-red-900">Error</p>
                    <p className="text-sm text-red-800">
                      Failed to initialize Support Groups. Check the console for details.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Instructions */}
            <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2">What this does:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Creates 6 default Support Groups in localStorage</li>
                <li>• Includes: Anxiety, Depression, PTSD, Bipolar, BPD, and ADHD support groups</li>
                <li>• Each group has guidelines and is ready to use</li>
                <li>• Users can join stage-based rooms (beginner/intermediate/advanced)</li>
                <li>• This only needs to be done once</li>
              </ul>
            </div>

            {/* Next Steps */}
            {status === 'success' && (
              <div className="bg-purple-50 border-l-4 border-purple-600 rounded-lg p-4">
                <h4 className="font-semibold text-purple-900 mb-2">Next Steps:</h4>
                <ol className="text-sm text-purple-800 space-y-1">
                  <li>1. Navigate to Community → Support Groups</li>
                  <li>2. Click on any Support Group to view it</li>
                  <li>3. Select a stage level (beginner/intermediate/advanced)</li>
                  <li>4. Join a chat room and start connecting!</li>
                  <li>5. Visit /AdminTools to upgrade to moderator for moderation features</li>
                </ol>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}