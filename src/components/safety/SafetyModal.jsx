import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Heart,
  Phone,
  MessageCircle,
  Shield,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react';
import { getCrisisResources } from '@/utils/crisisDetection';
import { useNavigate } from 'react-router-dom';

/**
 * SafetyModal - MANDATORY full-screen intervention for high-risk situations
 *
 * Design principles:
 * - Calm, not alarming
 * - Immediate access to help
 * - No public shaming
 * - CANNOT be dismissed - user MUST choose an action
 * - Locks entire app until choice is made
 */
export default function SafetyModal({ onClose, userRegion = 'US', context = 'live', mandatory = true }) {
  const [showAllResources, setShowAllResources] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);
  const resources = getCrisisResources(userRegion);
  const navigate = useNavigate();

  const handleCallSupport = (hotline) => {
    // Log the action
    const action = {
      type: 'CRISIS_INTERVENTION',
      action: 'CALLED_HOTLINE',
      hotline: hotline.name,
      timestamp: new Date().toISOString()
    };

    localStorage.setItem('crisis_intervention_action', JSON.stringify(action));

    // Mark as resolved
    localStorage.removeItem('safety_lock_active');

    // Close the modal
    if (onClose) onClose();
  };

  const handleFindTherapist = () => {
    // Log the action
    const action = {
      type: 'CRISIS_INTERVENTION',
      action: 'FINDING_THERAPIST',
      timestamp: new Date().toISOString()
    };

    localStorage.setItem('crisis_intervention_action', JSON.stringify(action));

    // Mark as resolved
    localStorage.removeItem('safety_lock_active');

    // Navigate to therapist directory
    navigate('/TherapistDirectory');

    // Close the modal
    if (onClose) onClose();
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
        onClick={(e) => {
          // Prevent closing by clicking outside if mandatory
          if (mandatory) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="w-full max-w-3xl max-h-[95vh] overflow-y-auto"
        >
          <Card className="bg-white shadow-2xl border-0">
            <CardContent className="p-8">
              {/* Header - NO CLOSE BUTTON if mandatory */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-rose-100 rounded-full">
                    <Heart className="w-8 h-8 text-rose-600" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">
                      You're not alone
                    </h2>
                    <p className="text-gray-600 mt-1">
                      Help is available right now
                    </p>
                  </div>
                </div>
              </div>

              {/* Mandatory Action Notice */}
              {mandatory && (
                <div className="mb-6 p-4 bg-purple-50 border-l-4 border-purple-600 rounded-lg">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-purple-900">
                        Please choose one of the options below to continue
                      </p>
                      <p className="text-xs text-purple-700 mt-1">
                        We care about your safety and want to make sure you have the support you need
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Main Message */}
              <div className="bg-gradient-to-r from-rose-50 to-purple-50 rounded-2xl p-6 mb-8">
                <p className="text-gray-800 leading-relaxed text-lg">
                  We noticed you might be going through something difficult.
                  Your safety matters deeply to us, and there are people who want to help—right now,
                  24/7, free and confidential.
                </p>
              </div>

              {/* TWO MANDATORY ACTIONS */}
              <div className="space-y-6 mb-8">
                <h3 className="text-xl font-bold text-gray-900 text-center mb-6">
                  Please choose one option to continue:
                </h3>

                {/* Option 1: Call Support Now */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Phone className="w-5 h-5 text-red-600" />
                    Option 1: Talk to a crisis counselor now
                  </h4>

                  {resources.hotlines.slice(0, showAllResources ? undefined : 2).map((hotline, index) => (
                    <Card key={index} className="bg-gradient-to-r from-red-50 to-rose-50 border-2 border-red-300 hover:border-red-500 transition-all hover:shadow-lg">
                      <CardContent className="p-6">
                        <div className="space-y-4">
                          <div>
                            <h4 className="font-bold text-gray-900 mb-1 text-lg">
                              {hotline.name}
                            </h4>
                            <p className="text-sm text-gray-700 mb-3">
                              {hotline.description}
                            </p>
                            <div className="flex items-center gap-2 text-red-700 mb-2">
                              <Phone className="w-5 h-5" />
                              <span className="font-mono text-2xl font-bold">
                                {hotline.phone}
                              </span>
                            </div>
                            <p className="text-xs text-gray-600">
                              {hotline.availability}
                            </p>
                          </div>
                          <a
                            href={`tel:${hotline.phone.replace(/[^0-9]/g, '')}`}
                            onClick={() => handleCallSupport(hotline)}
                            className="block"
                          >
                            <Button className="w-full bg-red-600 hover:bg-red-700 text-white rounded-xl py-6 text-lg font-semibold">
                              <Phone className="w-5 h-5 mr-2" />
                              Call {hotline.name} Now
                            </Button>
                          </a>
                        </div>
                      </CardContent>
                    </Card>
                  ))}

                  {resources.hotlines.length > 2 && (
                    <button
                      onClick={() => setShowAllResources(!showAllResources)}
                      className="flex items-center gap-2 text-red-700 hover:text-red-800 font-medium text-sm mx-auto"
                    >
                      {showAllResources ? (
                        <>
                          <ChevronUp className="w-4 h-4" />
                          Show fewer hotlines
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-4 h-4" />
                          Show more hotlines
                        </>
                      )}
                    </button>
                  )}
                </div>

                {/* Divider */}
                <div className="relative my-8">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500 font-medium">OR</span>
                  </div>
                </div>

                {/* Option 2: Find a Therapist */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                    <MessageCircle className="w-5 h-5 text-purple-600" />
                    Option 2: Find a licensed therapist
                  </h4>

                  <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-300 hover:border-purple-500 transition-all hover:shadow-lg">
                    <CardContent className="p-6">
                      <div className="space-y-4">
                        <div>
                          <h4 className="font-bold text-gray-900 mb-2 text-lg">
                            Connect with a professional
                          </h4>
                          <p className="text-sm text-gray-700 mb-4">
                            Browse our directory of licensed therapists who specialize in crisis support,
                            depression, anxiety, and more. Many offer same-day or next-day appointments.
                          </p>
                          <div className="flex items-center gap-2 text-sm text-purple-700">
                            <Shield className="w-4 h-4" />
                            <span>All therapists are licensed and verified</span>
                          </div>
                        </div>
                        <Button
                          onClick={handleFindTherapist}
                          className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-xl py-6 text-lg font-semibold"
                        >
                          <MessageCircle className="w-5 h-5 mr-2" />
                          Browse Therapists
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Emergency Services Note */}
              <Card className="bg-red-50 border-red-200 mt-8">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-red-600 rounded-full flex-shrink-0">
                      <Phone className="w-4 h-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-red-900 mb-1 text-sm">
                        If you're in immediate danger
                      </h4>
                      <p className="text-xs text-red-800 mb-2">
                        Call emergency services or go to your nearest emergency room
                      </p>
                      <a href={`tel:${resources.emergencyNumber}`}>
                        <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white rounded-lg">
                          Call {resources.emergencyNumber}
                        </Button>
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Footer message */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 text-center">
                  This app is not a substitute for professional help, but we're here
                  to connect you with the support you need.
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}