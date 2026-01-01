import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertCircle, Users, TrendingUp, Award, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { SupportGroup } from '@/api/entities';
import { joinStageRoom } from '@/api/supportRooms';
import BackHeader from '@/components/navigation/BackHeader';
import api from '@/api/client';
import { format } from 'date-fns';

const STAGE_INFO = {
  beginner: {
    icon: Users,
    title: 'Beginner',
    description: 'Just starting your journey. Connect with others taking their first steps.',
    color: 'from-green-500 to-emerald-600',
    textColor: 'text-green-600',
    bgColor: 'bg-green-50',
    borderColor: 'border-green-300'
  },
  intermediate: {
    icon: TrendingUp,
    title: 'Intermediate',
    description: 'Building momentum. Share experiences and learn from peers on similar paths.',
    color: 'from-blue-500 to-indigo-600',
    textColor: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-300'
  },
  advanced: {
    icon: Award,
    title: 'Advanced',
    description: 'Experienced members supporting each other through deeper challenges.',
    color: 'from-purple-500 to-pink-600',
    textColor: 'text-purple-600',
    bgColor: 'bg-purple-50',
    borderColor: 'border-purple-300'
  }
};

export default function SupportGroupStageSelection() {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [supportGroup, setSupportGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(null); // Track which stage is being joined
  const [user, setUser] = useState(null);
  const [lockStatus, setLockStatus] = useState(null);

  useEffect(() => {
    loadData();
  }, [groupId]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load user
      const userData = localStorage.getItem('aurawell_current_user');
      if (userData) {
        setUser(JSON.parse(userData));
      }

      // Load support group
      const group = await SupportGroup.findById(groupId);
      setSupportGroup(group);

      // Check stage lock status
      const lockResponse = await api.getStageLockStatus(groupId);
      if (lockResponse.success && lockResponse.isLocked) {
        setLockStatus(lockResponse.data);
      }
    } catch (error) {
      console.error('Failed to load support group:', error);
      toast.error('Failed to load support group');
    } finally {
      setLoading(false);
    }
  };

  const handleStageSelect = async (stage) => {
    if (!user) {
      toast.error('Please log in to join a support group');
      navigate('/login');
      return;
    }

    setJoining(stage);

    try {
      // Call the race-condition-safe join function
      const result = await joinStageRoom(groupId, stage, user.id);

      if (result.success) {
        if (result.alreadyMember) {
          toast.info('Welcome back! Rejoining your room...');
        } else {
          toast.success('Successfully joined support room!');
        }

        // Navigate to the room
        navigate(`/support-room/${result.room.id}`);
      } else {
        // Handle specific error cases
        if (result.error.includes('banned')) {
          toast.error(result.error, { duration: 8000 });
        } else if (result.error.includes('suspended')) {
          toast.error(result.error, { duration: 8000 });
        } else {
          toast.error(result.error);
        }
      }
    } catch (error) {
      console.error('Failed to join room:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setJoining(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  if (!supportGroup) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 p-4">
        <Card className="max-w-md mx-auto mt-20">
          <CardContent className="p-8 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">Support Group Not Found</h2>
            <Button onClick={() => navigate('/community')} className="mt-4">
              Back to Community
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        <BackHeader
          title={supportGroup.name}
          subtitle="Select your experience level"
          backTo="/community"
          backLabel="Community"
        />

        <div className="mt-8 space-y-6">
          {/* Info Card */}
          <Card className="bg-white/80 backdrop-blur-sm border border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-purple-600 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">How Support Rooms Work</h3>
                  <p className="text-sm text-gray-600">
                    You'll be automatically placed in a private room with others at your experience level.
                    This creates an intimate, safe space for meaningful connections and support.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Lock Warning Card */}
          {lockStatus && lockStatus.is_locked && (
            <Card className="bg-amber-50 border border-amber-200">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold text-amber-900 mb-1">Stage Lock Active</h3>
                    <p className="text-sm text-amber-800">
                      You're currently locked to the <strong>{lockStatus.stage}</strong> stage.
                      You can switch stages in {Math.ceil(lockStatus.days_remaining)} days
                      (until {format(new Date(lockStatus.locked_until), 'MMM d, yyyy')}).
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stage Selection Cards */}
          {['beginner', 'intermediate', 'advanced'].map((stage) => {
            const stageInfo = STAGE_INFO[stage];
            if (!stageInfo) return null;

            const Icon = stageInfo.icon;
            const isJoining = joining === stage;
            const isLocked = lockStatus?.is_locked && lockStatus?.stage !== stage;

            return (
              <Card
                key={stage}
                className={`border-2 ${stageInfo.borderColor} hover:shadow-lg transition-all cursor-pointer ${
                  isJoining ? 'opacity-70' : ''
                }`}
              >
                <CardHeader className={`bg-gradient-to-r ${stageInfo.color} text-white`}>
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <Icon className="w-6 h-6" />
                    </div>
                    <CardTitle className="text-2xl">{stageInfo.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-gray-700 mb-6">{stageInfo.description}</p>

                  <Button
                    onClick={() => handleStageSelect(stage)}
                    disabled={isJoining || isLocked}
                    className={`w-full ${stageInfo.textColor} bg-white hover:${stageInfo.bgColor} border-2 ${stageInfo.borderColor} text-lg font-semibold py-6 ${isLocked ? 'opacity-50 cursor-not-allowed' : ''}`}
                    variant="outline"
                  >
                    {isJoining ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Finding Your Room...
                      </>
                    ) : isLocked ? (
                      <>
                        <AlertCircle className="w-5 h-5 mr-2" />
                        Locked until {format(new Date(lockStatus.locked_until), 'MMM d')}
                      </>
                    ) : (
                      <>
                        <Users className="w-5 h-5 mr-2" />
                        Join {stageInfo.title} Room
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer Info */}
        <Card className="mt-8 bg-gradient-to-r from-purple-100 to-indigo-100 border-0">
          <CardContent className="p-6">
            <h3 className="font-semibold text-gray-900 mb-2">Community Guidelines</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Be respectful and supportive of all members</li>
              <li>• Share your experiences, but respect others' privacy</li>
              <li>• This is a safe space - no judgment or criticism</li>
              <li>• If you're in crisis, please call 988 for immediate support</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}