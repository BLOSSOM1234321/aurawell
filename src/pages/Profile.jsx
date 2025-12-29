
import React, { useState, useEffect } from "react";
import { User } from "@/api/entities";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Settings, 
  Shield, 
  Users as Team, 
  FileText,
  Bird,
  Crown,
  X,
  Heart,
  Code,
  Palette,
  Lightbulb
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import GentleGuardianToggle from "../components/dashboard/GentleGuardianToggle";

const profileFeatures = [
  {
    id: "settings",
    title: "Settings",
    description: "Customize your experience",
    icon: Settings,
    color: "from-gray-400 to-gray-500",
    route: "Settings",
    premium: false
  },
  {
    id: "team",
    title: "Meet the Team",
    description: "Learn about who built this app",
    icon: Team,
    color: "from-blue-400 to-indigo-500",
    route: null,
    premium: false
  },
  {
    id: "privacy",
    title: "Privacy & Terms",
    description: "Legal information and policies",
    icon: FileText,
    color: "from-green-400 to-emerald-500",
    route: null,
    premium: false
  }
];

const teamMembers = [
  {
    name: "Blossom Alabor",
    role: "CEO/FOUNDER",
    icon: Crown,
    color: "from-purple-400 to-indigo-500",
    description: "Visionary founder dedicated to transforming mental wellness through technology",
    quote: "We're not just building an app, we're nurturing souls."
  }
];

export default function Profile() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFeature, setSelectedFeature] = useState(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setIsLoading(true);
    try {
      // Get user from localStorage
      const currentUserData = localStorage.getItem('aurawell_current_user');
      if (currentUserData) {
        const currentUser = JSON.parse(currentUserData);
        setUser(currentUser);
      }
    } catch (error) {
      console.error("Error loading user data:", error);
    }
    setIsLoading(false);
  };

  const handleToggleGentleGuardian = () => {
    loadUserData();
  };

  const handleFeatureClick = (feature) => {
    if (feature.route) {
      return;
    } else {
      setSelectedFeature(feature);
    }
  };

  const closeModal = () => setSelectedFeature(null);

  if (isLoading) {
    return (
      <div className="min-h-screen py-6 flex items-center justify-center">
        <Bird className="w-8 h-8 text-accent animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6">
      <div className="max-w-2xl mx-auto space-y-6">
        
        {/* Header with User Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-4"
        >
          <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto">
            <span className="text-2xl font-semibold text-accent">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </span>
          </div>
          <div>
            <h1 className="text-2xl font-light text-primary">
              {user?.name || 'Welcome'}
            </h1>
            <div className="flex items-center justify-center gap-2 mt-2">
              {user?.is_premium && (
                <div className="flex items-center gap-1 px-2 py-1 bg-amber-100 rounded-full">
                  <Crown className="w-3 h-3 text-amber-600" />
                  <span className="text-xs text-amber-700 font-medium">Premium</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Gentle Guardian Toggle Card */}
        {user?.is_premium && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="bg-card border-light shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 rounded-xl" style={{ backgroundColor: '#5C4B99' }}>
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  Gentle Guardian Mode
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-secondary">
                  Activate a simplified, calming view for overwhelming moments.
                </p>
                <GentleGuardianToggle user={user} onToggle={handleToggleGentleGuardian} />
                
                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-light">
                  <div className="text-center">
                    <p className="text-lg font-semibold text-primary">{user.gentle_guardian_streak || 0}</p>
                    <p className="text-xs text-secondary">Day Streak</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-primary">{(user.gentle_guardian_sessions || []).length}</p>
                    <p className="text-xs text-secondary">Sessions</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg font-semibold text-primary">{Math.round((user.total_gentle_guardian_minutes || 0) / 60)}</p>
                    <p className="text-xs text-secondary">Hours</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Profile Features */}
        <div className="space-y-3">
          {profileFeatures.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              {feature.route && (!feature.premium || user?.is_premium) ? (
                <Link to={createPageUrl(feature.route)}>
                  <Card className="bg-card border-light shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="p-3 rounded-full" style={{ backgroundColor: '#5C4B99' }}>
                          <feature.icon className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-medium text-primary">{feature.title}</h3>
                            {feature.premium && !user?.is_premium && (
                              <Crown className="w-4 h-4 text-amber-500" />
                            )}
                          </div>
                          <p className="text-sm text-secondary">{feature.description}</p>
                        </div>
                        <div className="text-accent">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ) : (
                <Card 
                  className={`bg-card border-light shadow-sm ${!feature.premium || user?.is_premium ? 'cursor-pointer hover:shadow-md' : 'opacity-60'} transition-shadow`}
                  onClick={() => (!feature.premium || user?.is_premium) && handleFeatureClick(feature)}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full" style={{ backgroundColor: '#5C4B99' }}>
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium text-primary">{feature.title}</h3>
                          {feature.premium && !user?.is_premium && (
                            <Crown className="w-4 h-4 text-amber-500" />
                          )}
                        </div>
                        <p className="text-sm text-secondary">{feature.description}</p>
                        {feature.premium && !user?.is_premium && (
                          <p className="text-xs text-amber-600 mt-1">Premium feature</p>
                        )}
                      </div>
                      <div className="text-accent">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          ))}
        </div>

        {/* Upgrade to Premium CTA */}
        {!user?.is_premium && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Link to={createPageUrl("GoPremium")}>
              <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-6 text-center">
                  <Crown className="w-8 h-8 text-amber-500 mx-auto mb-3" />
                  <h3 className="font-medium text-amber-800 mb-2">Unlock Premium Features</h3>
                  <p className="text-sm text-amber-600 mb-4">
                    Access Gentle Guardian Mode, and more premium tools
                  </p>
                  <Button className="bg-amber-500 text-white hover:bg-amber-600">
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            </Link>
          </motion.div>
        )}

        {/* Gentle encouragement */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="text-center py-6"
        >
          <Bird className="w-6 h-6 text-accent/50 mx-auto mb-2" />
          <p className="text-sm text-secondary">Your journey is uniquely yours</p>
        </motion.div>
      </div>

      {/* Meet the Team Modal */}
      <AnimatePresence>
        {selectedFeature && selectedFeature.id === 'team' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full" style={{ backgroundColor: '#5C4B99' }}>
                      <Team className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-xl font-medium text-primary">Meet Our Team</h2>
                  </div>
                  <Button variant="ghost" onClick={closeModal} className="p-2">
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <p className="text-secondary mb-6 text-center">
                  The passionate humans behind AuraWell, dedicated to your mental wellness journey
                </p>

                <div className="space-y-4">
                  {teamMembers.map((member, index) => (
                    <motion.div
                      key={member.name}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className="bg-secondary/20 border-light">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-full bg-gradient-to-r ${member.color} flex-shrink-0`}>
                              <member.icon className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-primary">{member.name}</h3>
                              <p className="text-sm text-accent font-medium mb-2">{member.role}</p>
                              <p className="text-sm text-secondary mb-3">{member.description}</p>
                              <p className="text-sm text-primary italic">"{member.quote}"</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                <div className="text-center mt-6 pt-4 border-t border-light">
                  <Bird className="w-8 h-8 text-accent/50 mx-auto mb-2" />
                  <p className="text-sm text-secondary">
                    Made with 💜 for your wellness journey
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Privacy & Terms Modal */}
      <AnimatePresence>
        {selectedFeature && selectedFeature.id === 'privacy' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full" style={{ backgroundColor: '#5C4B99' }}>
                      <FileText className="w-6 h-6 text-white" />
                    </div>
                    <h2 className="text-xl font-medium text-primary">Privacy & Terms</h2>
                  </div>
                  <Button variant="ghost" onClick={closeModal} className="p-2">
                    <X className="w-5 h-5" />
                  </Button>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-primary mb-3">Privacy Policy</h3>
                    <div className="text-sm text-secondary space-y-4">
                      <p>Effective Date: January 2025</p>
                      <p>AuraWell ("we," "our," or "us") values your privacy. This Privacy Policy explains how we collect, use, and protect your information when you use our app.</p>
                      
                      <div>
                        <p className="font-medium text-primary mb-2">1. Information We Collect</p>
                        <ul className="list-disc list-inside space-y-1">
                          <li><span className="font-semibold">Personal Information:</span> When you sign up, we may collect your name, email, and optional profile details.</li>
                          <li><span className="font-semibold">Usage Data:</span> We may collect information about how you interact with the app to improve functionality.</li>
                          <li><span className="font-semibold">Device Data:</span> Information such as device type, operating system, and app performance may be collected for troubleshooting and optimization.</li>
                        </ul>
                      </div>

                      <div>
                        <p className="font-medium text-primary mb-2">2. How We Use Your Information</p>
                        <ul className="list-disc list-inside space-y-1">
                          <li>To provide and improve app features.</li>
                          <li>To personalize your experience.</li>
                          <li>To send important updates about the app.</li>
                          <li>For safety, security, and legal compliance.</li>
                        </ul>
                      </div>

                      <div>
                        <p className="font-medium text-primary mb-2">3. Data Sharing</p>
                        <p>We do not sell your personal information. We only share information with trusted service providers who help us operate the app (such as cloud hosting).</p>
                      </div>

                      <div>
                        <p className="font-medium text-primary mb-2">4. Data Protection</p>
                        <p>We use industry-standard security measures to protect your data. However, no system is completely secure.</p>
                      </div>
                      
                      <div>
                        <p className="font-medium text-primary mb-2">5. Children's Privacy</p>
                        <p>This app is not designed for individuals under 18 years old. If we discover that someone under 18 has created an account, we will delete it immediately.</p>
                      </div>

                      <div>
                        <p className="font-medium text-primary mb-2">6. Your Rights</p>
                        <p>You may request access, correction, or deletion of your personal data by contacting us at support@aurawell.com.</p>
                      </div>

                      <div>
                        <p className="font-medium text-primary mb-2">7. Changes to Policy</p>
                        <p>We may update this Privacy Policy from time to time. We will notify you of material changes by updating the "Effective Date."</p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-primary mb-3">Terms of Service</h3>
                    <p className="text-sm text-secondary mb-3">Effective Date: January 2025</p>
                    <p className="text-sm text-secondary mb-4">
                      Welcome to AuraWell. By using our app, you agree to these Terms of Service:
                    </p>
                    
                    <div className="space-y-4 text-sm text-secondary">
                      <div>
                        <p className="font-medium text-primary mb-2">Eligibility:</p>
                        <p>You must be at least 18 years old to use the app.</p>
                      </div>
                      
                      <div>
                        <p className="font-medium text-primary mb-2">Use of the App:</p>
                        <p>You agree to use the app only for personal, non-commercial purposes, and in compliance with all applicable laws.</p>
                      </div>
                      
                      <div>
                        <p className="font-medium text-primary mb-2">Account Responsibility:</p>
                        <p>You are responsible for maintaining the confidentiality of your login information and for all activity under your account.</p>
                      </div>
                      
                      <div>
                        <p className="font-medium text-primary mb-2">🌐 Community Rules & Guidelines:</p>
                        <p className="mb-3">The community is designed to be a safe, supportive, and structured space.</p>
                        <div className="space-y-3 ml-4">
                          <div>
                            <p className="font-semibold text-primary">📊 Stage Rules</p>
                            <ul className="list-disc list-inside space-y-1 ml-4">
                              <li>Choose from Beginner, Intermediate, or Advanced stages.</li>
                              <li>You must remain in your stage for 30 days before switching.</li>
                              <li>Backwards switching is not allowed without moderator approval.</li>
                            </ul>
                          </div>
                          <div>
                            <p className="font-semibold text-primary">🗣️ Language & Behavior</p>
                            <ul className="list-disc list-inside space-y-1 ml-4">
                              <li>Respectful communication is required at all times.</li>
                              <li>Foul or offensive language leads to a warning (first offense) or removal (second offense).</li>
                              <li>Hate speech, harassment, or bullying may result in a permanent ban.</li>
                              <li>Users may report harmful behavior for moderator review.</li>
                            </ul>
                          </div>
                          <div>
                            <p className="font-semibold text-primary">🔒 Safety Reminder</p>
                            <ul className="list-disc list-inside space-y-1 ml-4">
                              <li>This community is supportive but not a replacement for professional therapy.</li>
                              <li>If in crisis, please contact licensed professionals or emergency services.</li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <p className="font-medium text-primary mb-2">Premium Subscription:</p>
                        <p>Certain features are available only through a paid subscription. Subscription fees are billed monthly or annually and are non-refundable except as required by law.</p>
                      </div>
                      
                      <div>
                        <p className="font-medium text-primary mb-2">Intellectual Property:</p>
                        <p>All content, features, and trademarks within the app belong to AuraWell and may not be copied or distributed without permission.</p>
                      </div>
                      
                      <div>
                        <p className="font-medium text-primary mb-2">Termination:</p>
                        <p>We reserve the right to suspend or terminate your account if you violate these Terms.</p>
                      </div>
                      
                      <div>
                        <p className="font-medium text-primary mb-2">Changes to Terms:</p>
                        <p>We may update these Terms periodically. Continued use of the app means you accept the new terms.</p>
                      </div>
                    </div>
                  </div>

                  <div className="text-center pt-4 border-t border-light">
                    <p className="text-xs text-secondary">
                      Last updated: January 2025
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
