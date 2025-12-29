import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, GraduationCap, Heart, Brain, Shield, Sparkles } from 'lucide-react';

const therapistProfiles = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    credentials: "Licensed Clinical Psychologist, Ph.D.",
    license: "Licensed in California, New York",
    specialties: ["Anxiety Disorders", "Depression", "Cognitive Behavioral Therapy"],
    description: "Dr. Johnson will provide personalized anxiety management strategies and lead our premium Q&A sessions focused on evidence-based therapeutic techniques.",
    profileImage: null, // Placeholder
    color: "from-purple-500 to-indigo-600"
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    credentials: "Licensed Marriage & Family Therapist, LMFT",
    license: "Licensed in Texas, Florida",
    specialties: ["Trauma Recovery", "PTSD", "Mindfulness-Based Therapy"],
    description: "Dr. Chen will facilitate trauma-informed group discussions and provide specialized content for our PTSD support community.",
    profileImage: null, // Placeholder
    color: "from-emerald-500 to-teal-600"
  },
  {
    id: 3,
    name: "Dr. Emily Rodriguez",
    credentials: "Licensed Clinical Social Worker, LCSW",
    license: "Licensed in Illinois, Michigan",
    specialties: ["Mood Disorders", "Bipolar Support", "Crisis Intervention"],
    description: "Dr. Rodriguez will oversee our mood disorder support groups and provide crisis intervention resources for community members in need.",
    profileImage: null, // Placeholder
    color: "from-rose-500 to-pink-600"
  },
  {
    id: 4,
    name: "Dr. James Thompson",
    credentials: "Licensed Professional Counselor, LPC",
    license: "Licensed in Georgia, North Carolina",
    specialties: ["Addiction Recovery", "Men's Mental Health", "Group Therapy"],
    description: "Dr. Thompson will lead specialized men's mental health initiatives and provide addiction recovery support through our premium therapy sessions.",
    profileImage: null, // Placeholder
    color: "from-blue-500 to-cyan-600"
  }
];

export default function MeetTheTeam() {
  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-r from-purple-400 to-indigo-500 rounded-xl">
              <Users className="w-5 h-5 text-white" />
            </div>
            Meet Our Licensed Therapist Team
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Our team of licensed mental health professionals is here to support your wellness journey through expert guidance, community moderation, and premium services.
          </p>
        </CardHeader>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        {therapistProfiles.map((therapist) => (
          <Card key={therapist.id} className="bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden">
            <CardHeader className="text-center pb-4">
              <div className="flex justify-center mb-4">
                <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${therapist.color} shadow-lg flex items-center justify-center`}>
                  {therapist.profileImage ? (
                    <img 
                      src={therapist.profileImage} 
                      alt={therapist.name}
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="text-white text-2xl font-bold">
                      {therapist.name.split(' ').map(n => n[0]).join('')}
                    </div>
                  )}
                </div>
              </div>
              
              <CardTitle className="text-xl text-gray-900 mb-1">
                {therapist.name}
              </CardTitle>
              
              <div className="space-y-2">
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                  <GraduationCap className="w-3 h-3 mr-1" />
                  {therapist.credentials}
                </Badge>
                <p className="text-sm text-gray-600">
                  {therapist.license}
                </p>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Brain className="w-4 h-4 text-purple-600" />
                  Areas of Expertise
                </h4>
                <div className="flex flex-wrap gap-2">
                  {therapist.specialties.map((specialty, index) => (
                    <Badge key={index} className="bg-gradient-to-r from-purple-100 to-indigo-100 text-purple-800 border-0">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <Heart className="w-4 h-4 text-rose-600" />
                  Role in Mindful
                </h4>
                <p className="text-gray-700 text-sm leading-relaxed">
                  {therapist.description}
                </p>
              </div>
              
              <div className="pt-3 border-t border-gray-100">
                <div className="flex items-center justify-center gap-2 text-amber-600">
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-medium">Coming Soon</span>
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-0 shadow-xl">
        <CardContent className="p-6 text-center">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-gradient-to-r from-purple-500 to-indigo-600 rounded-2xl shadow-lg">
              <Shield className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Professional Standards</h3>
          <p className="text-gray-700 max-w-3xl mx-auto">
            All our therapists are licensed professionals who adhere to strict ethical guidelines and professional standards. 
            They provide support within our community platform while maintaining appropriate therapeutic boundaries and confidentiality.
          </p>
          <div className="mt-4 text-sm text-gray-600">
            <p className="italic">
              Note: Community interactions and Q&A sessions are not substitutes for individual therapy or crisis intervention services.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}