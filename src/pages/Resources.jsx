
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Phone, 
  Globe, 
  BookOpen, 
  Video, 
  Users, 
  Headphones,
  MessageCircle,
  ExternalLink,
  Clock,
  Brain
} from "lucide-react";

import ResourceCard from "../components/resources/ResourceCard";
import CrisisSupport from "../components/resources/CrisisSupport";
import SelfCareTools from "../components/resources/SelfCareTools";
import BackHeader from '../components/navigation/BackHeader'; // Added import for BackHeader

const educationalArticles = [
  {
    title: "Mindfulness Meditation: A Research-Proven Way to Reduce Stress",
    description: "Discover the science behind mindfulness meditation and how it can effectively reduce stress in your daily life.",
    category: "Mindfulness & Stress Relief",
    url: "https://www.healthline.com/health/what-is-mindfulness"
  },
  {
    title: "Mindfulness Practices Reduce Stress and Improve Health",
    description: "Learn evidence-based mindfulness techniques that have been shown to improve both mental and physical health.",
    category: "Mindfulness & Stress Relief", 
    url: "https://www.mayoclinic.org/healthy-lifestyle/consumer-health/in-depth/mindfulness-exercises/art-20046356"
  },
  {
    title: "Why Mindfulness Practices Help Reduce Stress and Anxiety",
    description: "Understand the psychological mechanisms behind how mindfulness effectively reduces stress and anxiety symptoms.",
    category: "Mindfulness & Stress Relief",
    url: "https://www.psychologytoday.com/us/blog/urban-survival/201501/why-mindfulness-practices-help-reduce-stress-and-anxiety"
  },
  {
    title: "The 36p Supplement That 'Rivals Prescription Anti-Anxiety Drugs'",
    description: "Explore natural supplements that research suggests may help with anxiety management.",
    category: "Anxiety & Sleep Improvement",
    url: "https://www.express.co.uk/life-style/health/1234567/anxiety-natural-supplements-magnesium-research"
  },
  {
    title: "5 Brain Tricks to Fall Asleep Faster, Including a 'Neural Curfew' and a 'Digital Sunset'",
    description: "Science-backed techniques to improve your sleep quality and fall asleep more easily.",
    category: "Anxiety & Sleep Improvement",
    url: "https://www.sleepfoundation.org/how-sleep-works/how-to-fall-asleep-faster"
  },
  {
    title: "The Natural Sleep Helpers Wellness Experts Actually Use",
    description: "Discover natural sleep aids and techniques recommended by wellness professionals.",
    category: "Anxiety & Sleep Improvement",
    url: "https://www.healthline.com/health/healthy-sleep/natural-sleep-aids"
  }
];

export default function Resources() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Back Header */}
        <BackHeader 
          title="Mental Health Resources" 
          subtitle="Professional support and helpful tools"
          backTo="Profile"
          backLabel="Profile"
        />

        <CrisisSupport />

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-blue-400 to-blue-500 rounded-xl">
                    <Brain className="w-5 h-5 text-white" />
                  </div>
                  Educational Articles 🧠
                </CardTitle>
                <p className="text-gray-600 text-sm mt-2">
                  Learn more about mindfulness, stress relief, anxiety, and sleep improvement.
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="mb-6">
                  <h3 className="font-semibold text-lg text-gray-800 mb-4">Mindfulness & Stress Relief</h3>
                  <div className="space-y-4">
                    {educationalArticles.filter(article => article.category === "Mindfulness & Stress Relief").map((article, index) => (
                      <div key={index} className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl border border-blue-200 hover:shadow-md transition-all duration-200 cursor-pointer group">
                        <h4 className="font-bold text-gray-900 mb-2 group-hover:text-blue-700 transition-colors">
                          {article.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-3">
                          {article.description}
                        </p>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="bg-white/70 border-blue-300 text-blue-700 hover:bg-blue-100 rounded-2xl"
                          onClick={() => window.open(article.url, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Read More
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg text-gray-800 mb-4">Anxiety & Sleep Improvement</h3>
                  <div className="space-y-4">
                    {educationalArticles.filter(article => article.category === "Anxiety & Sleep Improvement").map((article, index) => (
                      <div key={index} className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl border border-purple-200 hover:shadow-md transition-all duration-200 cursor-pointer group">
                        <h4 className="font-bold text-gray-900 mb-2 group-hover:text-purple-700 transition-colors">
                          {article.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-3">
                          {article.description}
                        </p>
                        <Button 
                          variant="outline" 
                          size="sm"
                          className="bg-white/70 border-purple-300 text-purple-700 hover:bg-purple-100 rounded-2xl"
                          onClick={() => window.open(article.url, '_blank')}
                        >
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Read More
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-8">
            <SelfCareTools />

            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="p-2 bg-gradient-to-r from-cyan-400 to-cyan-500 rounded-xl">
                    <Globe className="w-5 h-5 text-white" />
                  </div>
                  Professional Help
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-cyan-50 rounded-2xl border border-cyan-200">
                  <h3 className="font-semibold text-cyan-800 mb-2">Find a Therapist</h3>
                  <p className="text-cyan-700 text-sm mb-3">
                    Connect with licensed mental health professionals in your area.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full border-cyan-300 text-cyan-700 hover:bg-cyan-100"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Search Therapists
                  </Button>
                </div>

                <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-200">
                  <h3 className="font-semibold text-indigo-800 mb-2">Online Therapy</h3>
                  <p className="text-indigo-700 text-sm mb-3">
                    Access therapy from home through secure video sessions.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full border-indigo-300 text-indigo-700 hover:bg-indigo-100"
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Learn More
                  </Button>
                </div>

                <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200">
                  <h3 className="font-semibold text-purple-800 mb-2">Support Groups</h3>
                  <p className="text-purple-700 text-sm mb-3">
                    Join local or online support groups for peer connections.
                  </p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="w-full border-purple-300 text-purple-700 hover:bg-purple-100"
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Find Groups
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
