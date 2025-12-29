import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Wind, Heart, Sparkles, ArrowLeft, CheckCircle } from "lucide-react";

export default function GroundingExerciseModal({ onClose, onComplete }) {
  const [step, setStep] = useState(0);
  const [isBreathing, setIsBreathing] = useState(false);
  const [breathCount, setBreathCount] = useState(0);

  const exercises = [
    {
      title: "5-4-3-2-1 Grounding",
      type: "sensory",
      instructions: [
        "Name 5 things you can SEE around you",
        "Name 4 things you can TOUCH",
        "Name 3 things you can HEAR",
        "Name 2 things you can SMELL",
        "Name 1 thing you can TASTE"
      ]
    },
    {
      title: "Box Breathing",
      type: "breathing",
      instructions: [
        "Breathe in for 4 seconds",
        "Hold for 4 seconds",
        "Breathe out for 4 seconds",
        "Hold for 4 seconds",
        "Repeat 4 times"
      ]
    }
  ];

  const currentExercise = exercises[step];

  const handleBreathingCycle = () => {
    setIsBreathing(true);
    setBreathCount(prev => prev + 1);

    setTimeout(() => {
      setIsBreathing(false);
    }, 16000); // 4 seconds × 4 steps

    if (breathCount >= 3) {
      setTimeout(() => {
        onComplete();
      }, 16000);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/90 z-[60] flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 20 }}
          className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-full">
                <Wind className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Grounding Exercise</h2>
                <p className="text-sm text-gray-600">Take a moment to center yourself</p>
              </div>
            </div>
          </div>

          {/* Exercise Content */}
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-purple-900 mb-2">
                {currentExercise.title}
              </h3>
              <p className="text-sm text-gray-600">
                Follow along at your own pace
              </p>
            </div>

            {currentExercise.type === "sensory" && (
              <div className="space-y-3">
                {currentExercise.instructions.map((instruction, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg border border-blue-200"
                  >
                    <Sparkles className="w-5 h-5 text-blue-600 flex-shrink-0" />
                    <span className="text-gray-700">{instruction}</span>
                  </motion.div>
                ))}
              </div>
            )}

            {currentExercise.type === "breathing" && (
              <div className="space-y-6">
                {/* Breathing Animation */}
                <div className="flex flex-col items-center justify-center py-8">
                  <motion.div
                    animate={isBreathing ? {
                      scale: [1, 1.5, 1.5, 1, 1],
                      opacity: [0.6, 1, 1, 0.6, 0.6]
                    } : {}}
                    transition={{
                      duration: 16,
                      times: [0, 0.25, 0.5, 0.75, 1],
                      ease: "easeInOut"
                    }}
                    className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full"
                  />
                  <p className="mt-4 text-gray-600 text-center">
                    {isBreathing ? (
                      breathCount < 4 ? "Breathing..." : "Almost done..."
                    ) : (
                      "Click 'Start Breathing' when ready"
                    )}
                  </p>
                  {breathCount > 0 && (
                    <p className="text-sm text-purple-600 mt-2">
                      Breath {breathCount} of 4
                    </p>
                  )}
                </div>

                {/* Instructions */}
                <div className="bg-purple-50 rounded-lg p-4">
                  <ol className="space-y-2 text-sm text-gray-700">
                    {currentExercise.instructions.map((instruction, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <span className="font-semibold text-purple-600">{index + 1}.</span>
                        <span>{instruction}</span>
                      </li>
                    ))}
                  </ol>
                </div>

                {/* Start Breathing Button */}
                {!isBreathing && breathCount < 4 && (
                  <Button
                    onClick={handleBreathingCycle}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl"
                  >
                    {breathCount === 0 ? "Start Breathing" : "Continue"}
                  </Button>
                )}

                {breathCount >= 4 && !isBreathing && (
                  <div className="text-center">
                    <CheckCircle className="w-12 h-12 text-green-600 mx-auto mb-2" />
                    <p className="text-green-700 font-medium">Great work! You're ready.</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex gap-3 pt-4 border-t">
            {step > 0 && (
              <Button
                onClick={() => setStep(prev => prev - 1)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </Button>
            )}

            {step < exercises.length - 1 ? (
              <Button
                onClick={() => setStep(prev => prev + 1)}
                className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
              >
                Next Exercise
              </Button>
            ) : (
              <Button
                onClick={onComplete}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white"
              >
                I'm Ready to Join
              </Button>
            )}

            <Button
              onClick={onClose}
              variant="ghost"
              className="text-gray-600"
            >
              Close
            </Button>
          </div>

          {/* Encouragement */}
          <div className="text-center">
            <p className="text-xs text-gray-500">
              Take all the time you need. There's no rush. 💜
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}