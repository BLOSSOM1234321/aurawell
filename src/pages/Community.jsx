import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import {
  Globe,
  Users,
  MessageSquare,
  Sparkles,
  Plus,
  Stethoscope,
  Radio
} from "lucide-react";
import { motion } from "framer-motion";

const communityFeatures = [
  {
    id: "discover",
    title: "Discover",
    description: "Explore trending discussions and inspiring content",
    icon: Sparkles,
    route: "Discover"
  },
  {
    id: "live-sessions",
    title: "Live Support Sessions",
    description: "Join or watch recorded sessions with therapists",
    icon: Radio,
    route: "LiveSessions"
  },
  {
    id: "groups",
    title: "Support Groups",
    description: "Connect with others on similar journeys",
    icon: Users,
    route: "Groups"
  },
  {
    id: "therapist-directory",
    title: "Find a Therapist",
    description: "Connect with licensed mental health professionals",
    icon: Stethoscope,
    route: "TherapistDirectory"
  },
  {
    id: "create-group",
    title: "Create a Group",
    description: "Start your own community",
    icon: Plus,
    route: "CreateGroup"
  },
  {
    id: "unspoken",
    title: "Unspoken Connections",
    description: "Anonymous deep conversation game",
    icon: MessageSquare,
    route: "UnspokenConnections"
  }
];

export default function Community() {
  return (
    <div className="min-h-screen py-6 px-4">
      <div className="max-w-2xl mx-auto space-y-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="text-center space-y-2"
        >
          <Globe className="w-10 h-10 mx-auto" style={{ color: '#5C4B99' }} />
          <h1 className="text-2xl font-light text-primary">Community</h1>
          <p className="text-secondary">Connect, share, and grow together</p>
        </motion.div>

        {/* Community Features */}
        <div className="space-y-4">
          {communityFeatures.map((feature, index) => (
            <motion.div
              key={feature.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + index * 0.1, duration: 0.4 }}
            >
              <Link to={createPageUrl(feature.route)}>
                <Card className="bg-card border-light shadow-sm cursor-pointer hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div className="p-3 rounded-full" style={{ backgroundColor: '#5C4B99' }}>
                        <feature.icon className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-primary mb-1">{feature.title}</h3>
                        <p className="text-sm text-secondary">{feature.description}</p>
                      </div>
                      <div style={{ color: '#5C4B99' }}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}