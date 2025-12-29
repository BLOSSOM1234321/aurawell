import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Clock, User, AlertTriangle, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

/**
 * RecordedSessionCard - Display card for recorded live sessions
 *
 * Features:
 * - Shows session metadata (title, host, duration, type)
 * - Displays trigger warnings
 * - "Watch Replay" button
 * - Recording date
 */
export default function RecordedSessionCard({ session, onWatch }) {
  const getSessionTypeColor = (type) => {
    const colors = {
      'guided-exercise': 'bg-blue-100 text-blue-700 border-blue-300',
      'breathwork': 'bg-teal-100 text-teal-700 border-teal-300',
      'educational': 'bg-purple-100 text-purple-700 border-purple-300',
      'psychoeducation': 'bg-indigo-100 text-indigo-700 border-indigo-300',
      'announcement': 'bg-amber-100 text-amber-700 border-amber-300'
    };
    return colors[type] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const formatRecordedDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Recorded today';
    if (diffDays === 1) return 'Recorded yesterday';
    if (diffDays < 7) return `Recorded ${diffDays} days ago`;
    return `Recorded on ${date.toLocaleDateString()}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="bg-white border-2 border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all">
        <CardContent className="p-5">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <Badge className={`${getSessionTypeColor(session.type)} border`}>
                  {session.type.replace('-', ' ').toUpperCase()}
                </Badge>
                <Badge variant="secondary" className="bg-gray-100 text-gray-700">
                  REPLAY
                </Badge>
              </div>
              <h3 className="font-semibold text-lg text-gray-900 mb-1">
                {session.title}
              </h3>
            </div>
          </div>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <User className="w-4 h-4" />
              <span>{session.hostName}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{session.duration} minutes</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Calendar className="w-4 h-4" />
              <span>{formatRecordedDate(session.recordedDate)}</span>
            </div>
          </div>

          {/* Trigger Warnings */}
          {session.triggerWarnings && session.triggerWarnings.length > 0 && (
            <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-orange-900 mb-1">
                    Content Warnings:
                  </p>
                  <div className="flex flex-wrap gap-1">
                    {session.triggerWarnings.map((warning, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="text-xs bg-orange-100 text-orange-800"
                      >
                        {warning}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Description */}
          {session.description && (
            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
              {session.description}
            </p>
          )}

          {/* Watch Button */}
          <Button
            onClick={() => onWatch(session)}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-lg flex items-center justify-center gap-2"
          >
            <Play className="w-5 h-5" />
            Watch Replay
          </Button>

          {/* Safety Note */}
          <p className="text-xs text-gray-500 mt-3 text-center">
            Comments are disabled on replays for your safety
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}