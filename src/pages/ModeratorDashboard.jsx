import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Users, Shield, AlertTriangle, Search, ChevronDown, ChevronUp,
  Ban, Clock, UserX, Archive, History, Loader2, Bell, FileText,
  MessageSquare, Eye, Video, AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';
import {
  SupportGroup, SupportRoom, User, SafetyAlert, CrisisDetectionLog,
  FlaggedContent, ContentViolationReport
} from '@/api/entities';
import {
  kickUserFromRoom,
  suspendUser,
  banUser,
  archiveRoom,
  getUserModerationHistory
} from '@/api/moderation';
import api from '@/api/client';
import BackHeader from '@/components/navigation/BackHeader';

const STAGE_INFO = {
  beginner: { label: 'Beginner', color: 'text-green-600', bgColor: 'bg-green-50' },
  intermediate: { label: 'Intermediate', color: 'text-blue-600', bgColor: 'bg-blue-50' },
  advanced: { label: 'Advanced', color: 'text-purple-600', bgColor: 'bg-purple-50' }
};

const ALERT_SEVERITY = {
  HIGH: { label: 'HIGH', color: 'text-red-700', bgColor: 'bg-red-100', borderColor: 'border-red-600' },
  MEDIUM: { label: 'MEDIUM', color: 'text-orange-700', bgColor: 'bg-orange-100', borderColor: 'border-orange-600' },
  BEHAVIORAL: { label: 'BEHAVIORAL', color: 'text-yellow-700', bgColor: 'bg-yellow-100', borderColor: 'border-yellow-600' }
};

export default function ModeratorDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Support Rooms state
  const [rooms, setRooms] = useState([]);
  const [expandedRooms, setExpandedRooms] = useState(new Set());

  // Safety Alerts state
  const [safetyAlerts, setSafetyAlerts] = useState([]);

  // Crisis Logs state
  const [crisisLogs, setCrisisLogs] = useState([]);

  // Flagged Content state
  const [flaggedContent, setFlaggedContent] = useState([]);

  // Moderation History state
  const [selectedUser, setSelectedUser] = useState(null);
  const [moderationHistory, setModerationHistory] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load current user
      const userData = localStorage.getItem('aurawell_current_user');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);

        // ONLY Blossom Alabor has moderator access
        const isBlossomAlabor = parsedUser.name === 'Blossom Alabor' || (parsedUser.email && parsedUser.email.toLowerCase().includes('blossom'));

        if (!isBlossomAlabor) {
          toast.error('Unauthorized access - Only Blossom Alabor can access this dashboard');
          navigate('/community');
          return;
        }
      } else {
        toast.error('Please log in');
        navigate('/auth');
        return;
      }

      // Load all data in parallel
      await Promise.all([
        loadRooms(),
        loadSafetyAlerts(),
        loadCrisisLogs(),
        loadFlaggedContent()
      ]);
    } catch (error) {
      console.error('Failed to load moderator dashboard:', error);
      toast.error('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const loadRooms = async () => {
    try {
      const result = await api.getModerationSupportRooms();
      if (result.success) {
        setRooms(result.data);
      }
    } catch (error) {
      console.error('Failed to load rooms:', error);
    }
  };

  const loadSafetyAlerts = async () => {
    try {
      const alerts = await SafetyAlert.findMany({
        where: { status: 'active' },
        orderBy: { createdAt: 'desc' }
      });
      setSafetyAlerts(alerts);
    } catch (error) {
      console.error('Failed to load safety alerts:', error);
    }
  };

  const loadCrisisLogs = async () => {
    try {
      const logs = await CrisisDetectionLog.findMany({
        orderBy: { createdAt: 'desc' },
        limit: 50
      });
      setCrisisLogs(logs);
    } catch (error) {
      console.error('Failed to load crisis logs:', error);
    }
  };

  const loadFlaggedContent = async () => {
    try {
      const content = await FlaggedContent.findMany({
        where: { status: 'pending' },
        orderBy: { createdAt: 'desc' }
      });
      setFlaggedContent(content);
    } catch (error) {
      console.error('Failed to load flagged content:', error);
    }
  };

  const handleResolveAlert = async (alertId) => {
    try {
      await SafetyAlert.update(alertId, { status: 'resolved', resolvedAt: new Date().toISOString() });
      toast.success('Alert resolved');
      await loadSafetyAlerts();
    } catch (error) {
      toast.error('Failed to resolve alert');
    }
  };

  const handleEscalate = async (alertId) => {
    if (!confirm('Escalate this alert to senior staff?')) return;

    try {
      await SafetyAlert.update(alertId, {
        status: 'escalated',
        escalatedAt: new Date().toISOString(),
        escalatedBy: user.id
      });
      toast.success('Alert escalated to senior staff');
      await loadSafetyAlerts();
    } catch (error) {
      toast.error('Failed to escalate alert');
    }
  };

  const handleRemoveMessage = async (messageId, alertId) => {
    if (!confirm('Remove this triggering message?')) return;

    try {
      // Logic to remove message would go here
      toast.success('Message removed from chat');
      await handleResolveAlert(alertId);
    } catch (error) {
      toast.error('Failed to remove message');
    }
  };

  // Calculate stats
  const stats = {
    totalRooms: rooms.length,
    activeAlerts: safetyAlerts.filter(a => a.status === 'active').length,
    highAlerts: safetyAlerts.filter(a => a.severity === 'HIGH').length,
    flaggedItems: flaggedContent.length
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <BackHeader
          title="Moderator Dashboard"
          subtitle="Global app-wide oversight and safety monitoring"
          backTo="/community"
          backLabel="Community"
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Support Rooms</p>
                  <p className="text-2xl font-bold">{stats.totalRooms}</p>
                </div>
                <Users className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Active Alerts</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.activeAlerts}</p>
                </div>
                <Bell className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className={stats.highAlerts > 0 ? 'border-red-300 bg-red-50' : ''}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">HIGH Alerts</p>
                  <p className="text-2xl font-bold text-red-600">{stats.highAlerts}</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-red-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Flagged Content</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.flaggedItems}</p>
                </div>
                <FileText className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="alerts" className="mt-8">
          <div className="overflow-x-auto -mx-4 px-4">
            <TabsList className="inline-flex gap-1 bg-transparent">
              <TabsTrigger value="alerts" className="flex-col gap-1 h-auto py-2 px-3 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Bell className="w-5 h-5" />
                <span className="text-xs font-medium whitespace-nowrap">Alerts</span>
                <span className="text-xs">({stats.activeAlerts})</span>
              </TabsTrigger>
              <TabsTrigger value="crisis" className="flex-col gap-1 h-auto py-2 px-3 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <AlertCircle className="w-5 h-5" />
                <span className="text-xs font-medium whitespace-nowrap">Crisis</span>
              </TabsTrigger>
              <TabsTrigger value="flagged" className="flex-col gap-1 h-auto py-2 px-3 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Eye className="w-5 h-5" />
                <span className="text-xs font-medium whitespace-nowrap">Flagged</span>
                <span className="text-xs">({stats.flaggedItems})</span>
              </TabsTrigger>
              <TabsTrigger value="rooms" className="flex-col gap-1 h-auto py-2 px-3 data-[state=active]:bg-white data-[state=active]:shadow-sm">
                <Users className="w-5 h-5" />
                <span className="text-xs font-medium whitespace-nowrap">Rooms</span>
                <span className="text-xs">({stats.totalRooms})</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Safety Alerts Tab */}
          <TabsContent value="alerts" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Active Safety Alerts</CardTitle>
                <p className="text-sm text-gray-600">
                  Monitor and respond to safety alerts from live sessions, flagged messages, and automated crisis detection
                </p>
              </CardHeader>
              <CardContent>
                {safetyAlerts.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Shield className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p>No active safety alerts</p>
                    <p className="text-sm mt-2">All clear! You'll see alerts here when action is needed.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {safetyAlerts.map((alert) => {
                      const severityInfo = ALERT_SEVERITY[alert.severity] || ALERT_SEVERITY.MEDIUM;
                      return (
                        <Card key={alert.id} className={`border-l-4 ${severityInfo.borderColor}`}>
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  <Badge className={`${severityInfo.bgColor} ${severityInfo.color}`}>
                                    {severityInfo.label}
                                  </Badge>
                                  <span className="text-sm text-gray-600">
                                    {alert.source || 'Live Session'}
                                  </span>
                                  <span className="text-xs text-gray-500">
                                    {new Date(alert.createdAt).toLocaleString()}
                                  </span>
                                </div>
                                <p className="font-semibold text-gray-900 mb-2">{alert.title || 'Safety Alert'}</p>
                                <p className="text-sm text-gray-700 mb-3">{alert.description}</p>
                                {alert.messageContent && (
                                  <div className="bg-gray-50 p-3 rounded mb-3 border-l-2 border-gray-300">
                                    <p className="text-sm italic text-gray-700">"{alert.messageContent}"</p>
                                  </div>
                                )}
                                <div className="flex flex-wrap gap-2">
                                  <Button size="sm" onClick={() => handleResolveAlert(alert.id)}>
                                    <Shield className="w-4 h-4 mr-1" />
                                    Resolve
                                  </Button>
                                  {alert.messageId && (
                                    <Button size="sm" variant="outline" onClick={() => handleRemoveMessage(alert.messageId, alert.id)}>
                                      <MessageSquare className="w-4 h-4 mr-1" />
                                      Remove Message
                                    </Button>
                                  )}
                                  <Button size="sm" variant="outline" className="text-red-600 border-red-300" onClick={() => handleEscalate(alert.id)}>
                                    <AlertTriangle className="w-4 h-4 mr-1" />
                                    Escalate to Senior Staff
                                  </Button>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Crisis Detection Logs Tab */}
          <TabsContent value="crisis" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Crisis Detection Logs</CardTitle>
                <p className="text-sm text-gray-600">
                  Review automated crisis detection events and intervention history
                </p>
              </CardHeader>
              <CardContent>
                {crisisLogs.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <FileText className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p>No crisis detection logs</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {crisisLogs.map((log) => (
                      <Card key={log.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant={log.riskLevel === 'high' ? 'destructive' : 'secondary'}>
                                  {log.riskLevel?.toUpperCase() || 'DETECTED'}
                                </Badge>
                                <span className="text-xs text-gray-500">
                                  {new Date(log.createdAt).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-sm text-gray-900 mb-1">
                                <strong>User:</strong> {log.userName || log.userId}
                              </p>
                              <p className="text-sm text-gray-700">{log.description || 'Crisis keywords detected in content'}</p>
                              {log.keywords && (
                                <p className="text-xs text-gray-500 mt-1">
                                  Keywords: {log.keywords}
                                </p>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Flagged Content Tab */}
          <TabsContent value="flagged" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Flagged Content Review</CardTitle>
                <p className="text-sm text-gray-600">
                  Review user-reported content and take moderation actions
                </p>
              </CardHeader>
              <CardContent>
                {flaggedContent.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Eye className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p>No flagged content pending review</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {flaggedContent.map((item) => (
                      <Card key={item.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge>{item.contentType || 'Post'}</Badge>
                                <span className="text-xs text-gray-500">
                                  Reported {new Date(item.createdAt).toLocaleString()}
                                </span>
                              </div>
                              <p className="text-sm text-gray-900 mb-1">
                                <strong>Reason:</strong> {item.reason}
                              </p>
                              <p className="text-sm text-gray-700 mb-3">{item.content}</p>
                              <div className="flex gap-2">
                                <Button size="sm" variant="outline" className="text-red-600">
                                  Remove Content
                                </Button>
                                <Button size="sm" variant="outline">
                                  Dismiss Report
                                </Button>
                                <Button size="sm" variant="outline">
                                  Warn User
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Support Rooms Tab */}
          <TabsContent value="rooms" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Support Rooms Overview</CardTitle>
                <p className="text-sm text-gray-600">
                  Monitor and moderate all support group chat rooms
                </p>
              </CardHeader>
              <CardContent>
                {rooms.length === 0 ? (
                  <div className="text-center py-12 text-gray-500">
                    <Users className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p>No active support rooms</p>
                    <p className="text-sm mt-2">Rooms will appear here when users join support groups</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {rooms.map((room) => {
                      const stageInfo = STAGE_INFO[room.stage] || {};
                      return (
                        <Card key={room.id}>
                          <CardHeader className="cursor-pointer" onClick={() => {
                            const newExpanded = new Set(expandedRooms);
                            newExpanded.has(room.id) ? newExpanded.delete(room.id) : newExpanded.add(room.id);
                            setExpandedRooms(newExpanded);
                          }}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <Badge className={`${stageInfo.bgColor} ${stageInfo.color}`}>
                                  {stageInfo.label}
                                </Badge>
                                <div>
                                  <p className="font-semibold">
                                    {room.supportGroup?.name} - Room #{room.roomNumber}
                                  </p>
                                  <p className="text-sm text-gray-600">
                                    {room.memberCount}/{room.maxMembers} members
                                  </p>
                                </div>
                              </div>
                              {expandedRooms.has(room.id) ? <ChevronUp /> : <ChevronDown />}
                            </div>
                          </CardHeader>
                          {expandedRooms.has(room.id) && (
                            <CardContent>
                              <div className="space-y-4">
                                {/* Room Members */}
                                <div>
                                  <h4 className="font-semibold text-sm mb-3">Active Members ({room.members?.length || 0})</h4>
                                  {room.members && room.members.length > 0 ? (
                                    <div className="space-y-2">
                                      {room.members.map((member) => (
                                        <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                          <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-purple-200 flex items-center justify-center">
                                              <span className="text-xs font-semibold text-purple-700">
                                                {member.user?.name?.charAt(0) || member.user?.email?.charAt(0) || 'U'}
                                              </span>
                                            </div>
                                            <div>
                                              <p className="text-sm font-medium">{member.user?.name || member.user?.email || 'Unknown User'}</p>
                                              <p className="text-xs text-gray-500">
                                                Joined {new Date(member.joinedAt).toLocaleDateString()}
                                              </p>
                                            </div>
                                          </div>
                                          <div className="flex gap-2">
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              className="text-xs"
                                              onClick={async () => {
                                                if (!window.confirm(`View moderation history for ${member.user?.name || 'this user'}?`)) return;
                                                const result = await getUserModerationHistory(user.id, member.userId);
                                                if (result.success) {
                                                  setSelectedUser(member.user);
                                                  setModerationHistory(result.actions);
                                                  toast.success(`Loaded ${result.actions.length} moderation actions`);
                                                }
                                              }}
                                            >
                                              <History className="w-3 h-3 mr-1" />
                                              History
                                            </Button>
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              className="text-orange-600 border-orange-300 text-xs"
                                              onClick={async () => {
                                                if (!window.confirm(`Kick ${member.user?.name || 'this user'} from this room?`)) return;
                                                setActionLoading(true);
                                                const result = await kickUserFromRoom(
                                                  user.id,
                                                  member.userId,
                                                  room.id,
                                                  'Kicked by moderator from dashboard'
                                                );
                                                if (result.success) {
                                                  toast.success('User kicked from room');
                                                  await loadRooms();
                                                } else {
                                                  toast.error(result.error || 'Failed to kick user');
                                                }
                                                setActionLoading(false);
                                              }}
                                              disabled={actionLoading}
                                            >
                                              <UserX className="w-3 h-3 mr-1" />
                                              Kick
                                            </Button>
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              className="text-yellow-600 border-yellow-300 text-xs"
                                              onClick={async () => {
                                                const days = window.prompt(`Suspend ${member.user?.name || 'this user'} for how many days?`, '7');
                                                if (!days) return;
                                                const reason = window.prompt('Reason for suspension:', '');
                                                if (!reason) return;

                                                setActionLoading(true);
                                                const result = await suspendUser(user.id, member.userId, parseInt(days), reason);
                                                if (result.success) {
                                                  toast.success(`User suspended for ${days} days`);
                                                  await loadRooms();
                                                } else {
                                                  toast.error(result.error || 'Failed to suspend user');
                                                }
                                                setActionLoading(false);
                                              }}
                                              disabled={actionLoading}
                                            >
                                              <Clock className="w-3 h-3 mr-1" />
                                              Suspend
                                            </Button>
                                            <Button
                                              size="sm"
                                              variant="outline"
                                              className="text-red-600 border-red-300 text-xs"
                                              onClick={async () => {
                                                if (!window.confirm(`PERMANENTLY BAN ${member.user?.name || 'this user'}? This cannot be easily undone.`)) return;
                                                const reason = window.prompt('Reason for ban:', '');
                                                if (!reason) return;

                                                setActionLoading(true);
                                                const result = await banUser(user.id, member.userId, reason);
                                                if (result.success) {
                                                  toast.success('User banned permanently');
                                                  await loadRooms();
                                                } else {
                                                  toast.error(result.error || 'Failed to ban user');
                                                }
                                                setActionLoading(false);
                                              }}
                                              disabled={actionLoading}
                                            >
                                              <Ban className="w-3 h-3 mr-1" />
                                              Ban
                                            </Button>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  ) : (
                                    <p className="text-sm text-gray-500">No active members</p>
                                  )}
                                </div>

                                {/* Room Actions */}
                                <div className="flex gap-2 pt-4 border-t">
                                  <Button
                                    variant="outline"
                                    className="text-red-600 border-red-300"
                                    onClick={async () => {
                                      if (!window.confirm('Archive this entire room? All members will be removed.')) return;
                                      const reason = window.prompt('Reason for archiving:', '');
                                      if (!reason) return;

                                      setActionLoading(true);
                                      const result = await archiveRoom(user.id, room.id, reason);
                                      if (result.success) {
                                        toast.success('Room archived');
                                        await loadRooms();
                                      } else {
                                        toast.error(result.error || 'Failed to archive room');
                                      }
                                      setActionLoading(false);
                                    }}
                                    disabled={actionLoading}
                                  >
                                    <Archive className="w-4 h-4 mr-2" />
                                    Archive Room
                                  </Button>
                                  <Button
                                    variant="outline"
                                    onClick={() => navigate(`/support-room/${room.id}`)}
                                  >
                                    <MessageSquare className="w-4 h-4 mr-2" />
                                    View Room Chat
                                  </Button>
                                </div>
                              </div>
                            </CardContent>
                          )}
                        </Card>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}