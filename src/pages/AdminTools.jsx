import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Shield, User, Info, AlertCircle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AdminTools() {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = () => {
    const userData = localStorage.getItem('aurawell_current_user');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  };

  const isBlossomAlabor = currentUser?.name === 'Blossom Alabor' || (currentUser?.email && currentUser.email.toLowerCase().includes('blossom'));

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="border-purple-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-6 h-6" />
              User Information
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-6">
            {/* Current User Info */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3">Current User</h3>
              {currentUser ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-600">Name:</span>
                    <span className="text-sm font-medium">{currentUser.name || currentUser.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Email:</span>
                    <span className="text-sm font-medium">{currentUser.email}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    ID: {currentUser.id}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No user logged in</p>
              )}
            </div>

            {/* Moderator Access Status */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Moderator Access</h3>

              {isBlossomAlabor ? (
                <div className="bg-green-50 border-l-4 border-green-600 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-semibold text-green-900">Moderator Access Granted!</p>
                      <p className="text-sm text-green-800 mt-1">
                        You (Blossom Alabor) have full moderator access to the Support Rooms system.
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <Button
                      onClick={() => navigate('/ModeratorDashboard')}
                      className="w-full bg-gradient-to-r from-purple-600 to-indigo-600"
                    >
                      <Shield className="w-4 h-4 mr-2" />
                      Go to Moderator Dashboard
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 border-l-4 border-yellow-600 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600" />
                    <div>
                      <p className="font-semibold text-yellow-900">No Moderator Access</p>
                      <p className="text-sm text-yellow-800 mt-1">
                        Only Blossom Alabor has moderator access to the Support Rooms system.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 border-l-4 border-blue-600 rounded-lg p-4">
              <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                <Info className="w-4 h-4" />
                About Moderator Access:
              </h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Only the Blossom Alabor account has moderator privileges</li>
                <li>• Moderators can access the Moderator Dashboard at /ModeratorDashboard</li>
                <li>• Moderators can kick, suspend, and ban users from Support Rooms</li>
                <li>• Moderators can archive rooms and view moderation history</li>
                <li>• This restriction ensures proper oversight and safety</li>
              </ul>
            </div>

            {/* Support Groups Access (Everyone) */}
            <div className="bg-purple-50 border-l-4 border-purple-600 rounded-lg p-4">
              <h4 className="font-semibold text-purple-900 mb-2">Support Groups Available to All Users:</h4>
              <ul className="text-sm text-purple-800 space-y-1">
                <li>• Anyone can join Support Groups and chat rooms</li>
                <li>• Choose from Anxiety, Depression, PTSD, Bipolar, BPD, ADHD support</li>
                <li>• Select your stage: Beginner, Intermediate, or Advanced</li>
                <li>• Navigate to Community → Support Groups to get started</li>
              </ul>
              <div className="mt-3">
                <Button
                  onClick={() => navigate('/Groups')}
                  variant="outline"
                  className="w-full border-purple-300 hover:bg-purple-100"
                >
                  Browse Support Groups
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}