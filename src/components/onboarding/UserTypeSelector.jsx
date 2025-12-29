import React from "react";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User as UserIcon, Briefcase, Bird } from "lucide-react";

export default function UserTypeSelector({ onSelect }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 flex items-center justify-center p-4 z-50"
    >
      <div className="max-w-2xl w-full space-y-8">
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center space-y-3"
        >
          <Bird className="w-12 h-12 mx-auto" style={{ color: '#5C4B99' }} />
          <h1 className="text-3xl font-bold text-gray-800">Welcome to Mindful</h1>
          <p className="text-gray-600">Let's get started. How would you like to join our community?</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card 
              className="cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-300"
              onClick={() => onSelect('regular')}
            >
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                  <UserIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">I'm Here to Grow</h3>
                  <p className="text-gray-600 text-sm">
                    Join as a regular user to track your wellness journey, connect with community, and access mindfulness tools.
                  </p>
                </div>
                <Button className="w-full rounded-xl text-white" style={{ backgroundColor: '#5C4B99' }}>
                  Continue as User
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card 
              className="cursor-pointer hover:shadow-xl transition-all duration-300 border-2 hover:border-purple-300"
              onClick={() => onSelect('therapist')}
            >
              <CardContent className="p-8 text-center space-y-4">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-purple-400 to-pink-500 flex items-center justify-center">
                  <Briefcase className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">I'm a Therapist/Coach</h3>
                  <p className="text-gray-600 text-sm">
                    Share your expertise, post helpful content, and reach people who need your guidance.
                  </p>
                </div>
                <Button className="w-full rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white">
                  Continue as Therapist
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center text-sm text-gray-500"
        >
          You can always update your account type later in settings
        </motion.p>
      </div>
    </motion.div>
  );
}