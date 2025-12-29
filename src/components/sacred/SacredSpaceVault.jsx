import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { SacredSpaceEntry } from '@/api/entities';
import { SacredSpaceSession } from '@/api/entities';
import { Heart, BookOpen, Timer, Sparkles, Mountain, Waves } from 'lucide-react';
import { format } from 'date-fns';

const themeIcons = {
  cosmic: Sparkles,
  nature: Mountain,
  minimalist: Waves
};

export default function SacredSpaceVault({ user }) {
  const [entries, setEntries] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEntry, setSelectedEntry] = useState(null);

  useEffect(() => {
    loadVaultData();
  }, []);

  const loadVaultData = async () => {
    try {
      const [entriesData, sessionsData] = await Promise.all([
        SacredSpaceEntry.list('-created_date', 50),
        SacredSpaceSession.list('-created_date', 50)
      ]);
      setEntries(entriesData);
      setSessions(sessionsData);
    } catch (error) {
      console.error("Error loading vault data:", error);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="text-center py-16">
        <div className="animate-spin w-8 h-8 border-2 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">Loading your Sacred Vault...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-purple-50 to-indigo-50 border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <Heart className="w-12 h-12 text-purple-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-purple-700">{entries.length}</div>
            <div className="text-sm text-purple-600">Sacred Entries</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <Timer className="w-12 h-12 text-blue-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-blue-700">{sessions.length}</div>
            <div className="text-sm text-blue-600">Sacred Sessions</div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-emerald-50 to-teal-50 border-0 shadow-lg">
          <CardContent className="p-6 text-center">
            <Sparkles className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
            <div className="text-3xl font-bold text-emerald-700">
              {sessions.reduce((total, session) => total + session.duration_minutes, 0)}
            </div>
            <div className="text-sm text-emerald-600">Minutes in Sacred Space</div>
          </CardContent>
        </Card>
      </div>

      {/* Sacred Entries */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Sacred Journal Entries
          </CardTitle>
        </CardHeader>
        <CardContent>
          {entries.length > 0 ? (
            <div className="grid gap-4">
              {entries.map((entry, index) => {
                const ThemeIcon = themeIcons[entry.session_theme] || Sparkles;
                return (
                  <motion.div
                    key={entry.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl cursor-pointer hover:shadow-md transition-all"
                    onClick={() => setSelectedEntry(entry)}
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-xl">
                          <ThemeIcon className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">
                            {entry.title || 'Sacred Entry'}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {format(new Date(entry.created_date), 'MMM d, h:mm a')}
                          </p>
                        </div>
                      </div>
                      <Badge className="bg-purple-100 text-purple-700 capitalize">
                        {entry.session_theme}
                      </Badge>
                    </div>
                    
                    <p className="text-gray-700 line-clamp-2 mb-3">
                      {entry.content}
                    </p>

                    {(entry.pre_session_mood || entry.post_session_mood) && (
                      <div className="flex gap-4 text-sm">
                        {entry.pre_session_mood && (
                          <div className="text-gray-600">
                            Before: <span className="font-medium">{entry.pre_session_mood}</span>
                          </div>
                        )}
                        {entry.post_session_mood && (
                          <div className="text-gray-600">
                            After: <span className="font-medium">{entry.post_session_mood}</span>
                          </div>
                        )}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500">
              <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg mb-2">Your Sacred Vault is empty</p>
              <p className="text-sm">Start writing in Sacred Space to create your first sacred entry</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Entry Modal */}
      {selectedEntry && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedEntry(null)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {selectedEntry.title || 'Sacred Entry'}
                  </h2>
                  <p className="text-gray-500">
                    {format(new Date(selectedEntry.created_date), 'EEEE, MMMM d, yyyy • h:mm a')}
                  </p>
                </div>
                <Badge className="bg-purple-100 text-purple-700 capitalize">
                  {selectedEntry.session_theme}
                </Badge>
              </div>

              <div className="prose prose-lg max-w-none mb-6">
                <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">
                  {selectedEntry.content}
                </p>
              </div>

              {(selectedEntry.pre_session_mood || selectedEntry.post_session_mood) && (
                <div className="border-t border-gray-200 pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {selectedEntry.pre_session_mood && (
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">Before Session</h4>
                        <p className="text-gray-600">{selectedEntry.pre_session_mood}</p>
                      </div>
                    )}
                    {selectedEntry.post_session_mood && (
                      <div>
                        <h4 className="font-medium text-gray-700 mb-2">After Session</h4>
                        <p className="text-gray-600">{selectedEntry.post_session_mood}</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}