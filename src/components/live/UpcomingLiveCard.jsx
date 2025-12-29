import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  User,
  Clock,
  Calendar,
  CheckCircle,
  AlertTriangle,
  Radio
} from "lucide-react";
import { motion } from "framer-motion";

export default function UpcomingLiveCard({ session, compact = false }) {
  const formatTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  };

  const formatDate = (isoString) => {
    const date = new Date(isoString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  const getTimeUntil = (isoString) => {
    const now = new Date();
    const start = new Date(isoString);
    const diff = start - now;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    if (diff < 0) return null; // Don't show if already started
    if (hours > 24) return null; // Don't show if more than 24 hours away in compact mode
    if (hours > 0) return `in ${hours}h ${minutes}m`;
    return `in ${minutes}m`;
  };

  const timeUntil = getTimeUntil(session.start_time);

  // Don't render if session has already started or is too far away (in compact mode)
  if (!timeUntil && compact) return null;

  // Compact version for home feed
  if (compact) {
    return (
      <Link to={createPageUrl("LiveSessions")}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.2 }}
        >
          <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200 shadow-sm hover:shadow-md transition-all cursor-pointer">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-white rounded-lg shadow-sm">
                  <Radio className="w-4 h-4 text-purple-600" />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-medium text-purple-700">Upcoming Live</span>
                    <span className="text-xs text-purple-600">• {timeUntil}</span>
                  </div>

                  <h4 className="text-sm font-semibold text-gray-900 mb-1 truncate">
                    {session.title}
                  </h4>

                  <div className="flex items-center gap-3 text-xs text-gray-600">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      <span className="truncate">{session.therapist_name}</span>
                      {session.therapist_verified && (
                        <CheckCircle className="w-3 h-3 text-blue-500" />
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{session.duration} min</span>
                    </div>
                  </div>

                  {session.session_type && (
                    <Badge variant="secondary" className="mt-2 text-xs bg-purple-100 text-purple-700">
                      {session.session_type}
                    </Badge>
                  )}
                </div>
              </div>

              {session.triggerWarnings && session.triggerWarnings.length > 0 && (
                <div className="mt-2 flex items-center gap-1 text-xs text-orange-700 bg-orange-50 rounded px-2 py-1">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Content advisory</span>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </Link>
    );
  }

  // Full version for group pages
  return (
    <Card className="bg-white border-purple-200 shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="bg-purple-100 text-purple-700 text-xs">
                Upcoming Live Session
              </Badge>
              {session.session_type && (
                <Badge variant="outline" className="text-xs border-gray-300">
                  {session.session_type}
                </Badge>
              )}
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {session.title}
            </h3>

            {session.description && (
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {session.description}
              </p>
            )}

            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
              <div className="flex items-center gap-1.5">
                <User className="w-4 h-4" />
                <span>{session.therapist_name}</span>
                {session.therapist_verified && (
                  <CheckCircle className="w-4 h-4 text-blue-500" />
                )}
              </div>

              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>{formatDate(session.start_time)} at {formatTime(session.start_time)}</span>
              </div>

              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{session.duration} minutes</span>
              </div>
            </div>

            {session.triggerWarnings && session.triggerWarnings.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap mt-2">
                <AlertTriangle className="w-4 h-4 text-orange-600" />
                <span className="text-xs text-orange-700">Content note:</span>
                {session.triggerWarnings.slice(0, 3).map((warning, i) => (
                  <span
                    key={i}
                    className="text-xs bg-orange-50 text-orange-700 px-2 py-0.5 rounded"
                  >
                    {warning.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            )}
          </div>

          <Link to={createPageUrl("LiveSessions")}>
            <Button
              variant="outline"
              className="border-purple-300 text-purple-700 hover:bg-purple-50 rounded-xl px-5"
            >
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}