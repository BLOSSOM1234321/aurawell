import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  Heart,
  Shield,
  Users,
  CheckCircle2,
  XCircle,
  Waves,
  Wind,
  Film,
  EyeOff
} from "lucide-react";

export default function PreJoinModal({ session, onJoin, onCancel, onGrounding }) {
  const [hasReadRules, setHasReadRules] = useState(false);

  const sessionGoals = [
    "A supportive space for sharing and listening",
    "Guided by a licensed therapist",
    "Focused on mutual support and growth",
    "Not a replacement for emergency care"
  ];

  const interactionRules = [
    {
      icon: Heart,
      title: "Respect & Compassion",
      description: "Treat everyone with kindness and empathy"
    },
    {
      icon: Shield,
      title: "No Crisis Dumping",
      description: "Share mindfully. For crisis support, use 988 or crisis resources"
    },
    {
      icon: Users,
      title: "Active Listening",
      description: "Give space for others to share their experiences"
    }
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-6 rounded-t-2xl">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-white/20 rounded-full">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Live Support Session</h2>
                <p className="text-purple-100 text-sm">{session?.title || "Community Support"}</p>
              </div>
            </div>
            <p className="text-white/90 text-sm mt-2">
              This is a live, supportive session. Please take a moment to review before joining.
            </p>
          </div>

          <div className="p-6 space-y-6">
            {/* Recording Status Disclosure - PROMINENT */}
            {session?.isEphemeral ? (
              <div className="bg-gradient-to-r from-purple-600 to-purple-700 border-4 border-purple-400 rounded-xl p-5 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/20 rounded-full flex-shrink-0">
                    <EyeOff className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">This session will NOT be recorded</h3>
                    <p className="text-purple-100 text-sm leading-relaxed">
                      This is a confidential, ephemeral session. Nothing shared here will be saved or recorded.
                      What's said in this session stays in this session, creating a safe space for open sharing.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-gradient-to-r from-blue-600 to-indigo-700 border-4 border-blue-400 rounded-xl p-5 shadow-lg">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-white/20 rounded-full flex-shrink-0">
                    <Film className="w-7 h-7 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-white mb-2">This session WILL be recorded</h3>
                    <p className="text-blue-100 text-sm leading-relaxed">
                      This session will be recorded and may be available as a replay for others to watch later.
                      By joining, you consent to being part of this recorded session. Recordings help others who couldn't attend live.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Session Goals */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                What This Session Is
              </h3>
              <ul className="space-y-2">
                {sessionGoals.map((goal, index) => (
                  <li key={index} className="flex items-start gap-2 text-gray-700">
                    <span className="text-green-600 mt-1">•</span>
                    <span>{goal}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* What This Isn't */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-red-900 mb-2 flex items-center gap-2">
                <XCircle className="w-5 h-5" />
                What This Session Is NOT
              </h3>
              <ul className="space-y-1 text-sm text-red-800">
                <li>• Not for immediate crisis intervention (call 988)</li>
                <li>• Not a substitute for professional therapy</li>
                <li>• Not a place for graphic or triggering content without warning</li>
              </ul>
            </div>

            {/* Interaction Rules */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Ground Rules</h3>
              <div className="space-y-3">
                {interactionRules.map((rule, index) => {
                  const Icon = rule.icon;
                  return (
                    <div key={index} className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-200">
                      <div className="p-2 bg-purple-600 rounded-full flex-shrink-0">
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      <div>
                        <h4 className="font-medium text-purple-900">{rule.title}</h4>
                        <p className="text-sm text-purple-700">{rule.description}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Safety Monitoring Transparency */}
            <div className="bg-blue-50 border border-blue-300 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-600 rounded-full flex-shrink-0">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-blue-900 mb-1">Your Safety Matters</h3>
                  <p className="text-sm text-blue-800">
                    If certain messages suggest immediate danger, we'll pause and help you find support.
                    This chat is monitored to ensure everyone's wellbeing. We're here to help, not to judge.
                  </p>
                </div>
              </div>
            </div>

            {/* Trigger/Content Warnings */}
            {session?.triggerWarnings && session.triggerWarnings.length > 0 && (
              <div className="bg-orange-50 border border-orange-300 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                  <h3 className="font-semibold text-orange-900">Content Advisory</h3>
                </div>
                <p className="text-sm text-orange-800 mb-2">
                  This session may discuss sensitive topics including:
                </p>
                <div className="flex flex-wrap gap-2">
                  {session.triggerWarnings.map((warning, index) => (
                    <span
                      key={index}
                      className="bg-orange-200 text-orange-900 text-xs px-3 py-1 rounded-full"
                    >
                      {warning.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Consent Checkbox */}
            <div className="border-t pt-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasReadRules}
                  onChange={(e) => setHasReadRules(e.target.checked)}
                  className="w-5 h-5 mt-0.5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                />
                <span className="text-sm text-gray-700">
                  I have read and understand the session guidelines and agree to participate respectfully.
                </span>
              </label>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              {/* Join Live Button */}
              <Button
                onClick={onJoin}
                disabled={!hasReadRules}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-6 rounded-xl text-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                Join Live Session
              </Button>

              {/* Grounding Button */}
              <Button
                onClick={onGrounding}
                variant="outline"
                className="w-full border-2 border-purple-300 text-purple-700 hover:bg-purple-50 py-4 rounded-xl font-medium flex items-center justify-center gap-2"
              >
                <Wind className="w-5 h-5" />
                Not ready? Try a grounding exercise first
              </Button>

              {/* Cancel Button */}
              <Button
                onClick={onCancel}
                variant="ghost"
                className="w-full text-gray-600 hover:bg-gray-100 py-3 rounded-xl"
              >
                Maybe later
              </Button>
            </div>

            {/* Crisis Resources Footer */}
            <div className="border-t pt-4 mt-4">
              <p className="text-xs text-gray-500 text-center mb-2">
                If you're in crisis right now:
              </p>
              <div className="flex gap-2 justify-center text-xs">
                <a
                  href="tel:988"
                  className="bg-red-100 text-red-700 px-3 py-1.5 rounded-lg hover:bg-red-200 transition-colors"
                >
                  Call 988
                </a>
                <a
                  href="sms:741741&body=HELLO"
                  className="bg-blue-100 text-blue-700 px-3 py-1.5 rounded-lg hover:bg-blue-200 transition-colors"
                >
                  Text 741741
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}