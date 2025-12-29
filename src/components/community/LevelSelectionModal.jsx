import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Sprout, TreeDeciduous, Mountain, Lock, CheckCircle } from "lucide-react";

const levels = [
  {
    id: "beginner",
    title: "Beginner",
    subtitle: "Safe entry & emotional grounding",
    icon: Sprout,
    color: "from-green-400 to-emerald-500",
    description: [
      "Access beginner-only discussion threads",
      "Daily guided reflection prompts",
      "Mood and emotion check-ins",
      "Read-only access to higher-level content",
      "React and leave supportive responses",
      "Welcome messages from Advanced members"
    ],
    tone: "Gentle, safe space with no pressure to post"
  },
  {
    id: "intermediate",
    title: "Intermediate",
    subtitle: "Active growth & shared experience",
    icon: TreeDeciduous,
    color: "from-blue-400 to-cyan-500",
    description: [
      "Full posting and discussion access",
      "Deeper reflection and journaling prompts",
      "Peer-to-peer conversations",
      "Respond to Beginner posts",
      "Access to group challenges",
      "Progress tracking tied to emotional awareness"
    ],
    tone: "Active engagement and skill-building"
  },
  {
    id: "advanced",
    title: "Advanced Guide",
    subtitle: "Gentle leadership & support",
    icon: Mountain,
    color: "from-purple-400 to-pink-500",
    description: [
      "Welcome new members automatically",
      "Lead optional weekly discussion prompts",
      "Respond to 'I need support' flags",
      "Share lived experiences (not advice)",
      "Model healthy emotional language",
      "Receive private impact summaries"
    ],
    tone: "Soft leadership with clear boundaries"
  }
];

export default function LevelSelectionModal({ onSelectLevel }) {
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleLevelClick = (level) => {
    setSelectedLevel(level);
    setShowConfirmation(true);
  };

  const handleConfirm = () => {
    if (selectedLevel) {
      // Save level selection with 30-day lock
      const levelData = {
        level: selectedLevel.id,
        levelTitle: selectedLevel.title,
        lockedUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        joinedDate: new Date().toISOString(),
        engagement: {
          checkIns: 0,
          posts: 0,
          comments: 0,
          reactions: 0,
          reflections: 0
        }
      };
      localStorage.setItem('userLevel', JSON.stringify(levelData));
      onSelectLevel(selectedLevel.id);
    }
  };

  const handleBack = () => {
    setShowConfirmation(false);
    setSelectedLevel(null);
  };

  if (showConfirmation && selectedLevel) {
    const LevelIcon = selectedLevel.icon;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl max-w-md w-full p-8 shadow-2xl"
        >
          <div className="text-center space-y-6">
            <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-r ${selectedLevel.color} flex items-center justify-center`}>
              <LevelIcon className="w-10 h-10 text-white" />
            </div>

            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">{selectedLevel.title} Level</h2>
              <p className="text-gray-600">{selectedLevel.subtitle}</p>
            </div>

            <div className="bg-purple-50 border border-purple-100 rounded-xl p-5 text-left space-y-3">
              <div className="flex items-start gap-2">
                <Lock className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-800 mb-1">30-Day Commitment</p>
                  <p className="text-sm text-gray-600">
                    You'll be at this level for 30 days across all support groups.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <CheckCircle className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-800 mb-1">Grow at Your Pace</p>
                  <p className="text-sm text-gray-600">
                    Progression happens through meaningful engagement, not time limits.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleBack}
                variant="outline"
                className="flex-1"
              >
                Go Back
              </Button>
              <Button
                onClick={handleConfirm}
                className="flex-1 text-white"
                style={{ backgroundColor: '#5C4B99' }}
              >
                I'm Ready
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl max-w-4xl w-full my-8 shadow-2xl"
      >
        <div className="p-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-gradient-to-r from-purple-400 to-pink-400">
              <Sprout className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mb-3">Choose Your Starting Point</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Where you are today is perfect. Select the level that feels right for you. There's no rush, and there's no pressure. 🌸
            </p>
          </div>

          {/* Levels Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {levels.map((level, index) => {
              const LevelIcon = level.icon;
              return (
                <motion.div
                  key={level.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    className="cursor-pointer hover:shadow-xl transition-all border-2 border-transparent hover:border-purple-200 h-full"
                    onClick={() => handleLevelClick(level)}
                  >
                    <CardContent className="p-6">
                      <div className="text-center mb-4">
                        <div className={`w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r ${level.color} flex items-center justify-center`}>
                          <LevelIcon className="w-8 h-8 text-white" />
                        </div>
                        <h3 className="font-bold text-lg text-gray-800 mb-1">{level.title}</h3>
                        <p className="text-xs text-gray-500 mb-4">{level.subtitle}</p>
                      </div>

                      <ul className="space-y-2 text-left mb-4">
                        {level.description.slice(0, 3).map((item, i) => (
                          <li key={i} className="text-xs text-gray-600 flex items-start gap-2">
                            <span className="text-purple-500 mt-0.5">•</span>
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="bg-purple-50 rounded-lg p-3 mt-4">
                        <p className="text-xs text-gray-700 italic">"{level.tone}"</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>

          {/* Footer Note */}
          <div className="text-center bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4">
            <p className="text-sm text-gray-700 mb-2">
              💜 <strong>Remember:</strong> This choice helps create a stable, supportive space for everyone.
            </p>
            <p className="text-xs text-gray-600">
              You can always progress naturally through engagement. No timers, no pressure.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}