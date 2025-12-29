import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CheckCircle,
  Award,
  GraduationCap,
  Heart,
  Users,
  MessageCircle,
  Calendar,
  UserPlus,
  Star,
  Play,
  BookOpen,
  Globe,
  Clock,
  Shield,
  FileText,
  Video,
  Image as ImageIcon,
  ChevronLeft
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { createPageUrl } from '@/utils';
import BackHeader from '../components/navigation/BackHeader';

// Therapy styles
const THERAPY_STYLES = [
  { id: 'cbt', name: 'Cognitive Behavioral Therapy (CBT)', icon: BookOpen },
  { id: 'trauma-informed', name: 'Trauma-Informed', icon: Heart },
  { id: 'psychodynamic', name: 'Psychodynamic', icon: Users },
  { id: 'mindfulness', name: 'Mindfulness-Based', icon: Globe },
  { id: 'dbt', name: 'Dialectical Behavior Therapy (DBT)', icon: Shield },
  { id: 'faith-based', name: 'Faith-Based', icon: Star },
  { id: 'holistic', name: 'Holistic', icon: Heart },
  { id: 'solution-focused', name: 'Solution-Focused', icon: Award }
];

// Mock therapist data (in real app, this would come from API/database)
const getMockTherapistData = (therapistId) => ({
  id: therapistId,
  name: 'Dr. Sarah Thompson',
  credentials: 'PhD, Licensed Clinical Psychologist',
  licenseNumber: 'PSY12345',
  verificationStatus: 'verified',
  profileImage: null,
  coverImage: null,

  // Bio
  bio: `I'm a licensed clinical psychologist with over 10 years of experience helping individuals navigate anxiety, depression, trauma, and life transitions. My approach is warm, collaborative, and evidence-based, integrating cognitive behavioral therapy with mindfulness practices.

I believe therapy is a journey of self-discovery and healing, and I'm honored to walk alongside my clients as they work toward their goals.`,

  // Intro video
  introVideoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', // Placeholder

  // Professional info
  yearsExperience: 10,
  education: [
    'PhD in Clinical Psychology - Stanford University',
    'MA in Counseling Psychology - Columbia University',
    'BA in Psychology - UC Berkeley'
  ],

  // Specialties
  specialties: [
    'Anxiety Disorders',
    'Depression',
    'Trauma & PTSD',
    'Relationship Issues',
    'Life Transitions',
    'Stress Management'
  ],

  // Populations served
  populations: [
    'Adults (18-64)',
    'Young Adults (18-25)',
    'LGBTQ+',
    'Women\'s Issues'
  ],

  // Therapy styles
  therapyStyles: ['cbt', 'trauma-informed', 'mindfulness'],

  // Languages
  languages: ['English', 'Spanish'],

  // Availability
  availabilityStatus: 'open', // 'open', 'limited', 'closed'
  acceptingNewClients: true,

  // Session info
  sessionRate: '$150',
  sessionLength: '50 minutes',
  insuranceAccepted: true,

  // Reviews
  rating: 4.9,
  reviewCount: 127,
  reviews: [
    {
      id: '1',
      clientName: 'Anonymous',
      rating: 5,
      comment: 'Dr. Thompson has been instrumental in my healing journey. Her compassionate approach and practical tools have helped me manage my anxiety in ways I never thought possible.',
      date: '2024-01-15',
      verified: true
    },
    {
      id: '2',
      clientName: 'Anonymous',
      rating: 5,
      comment: 'I appreciate how Dr. Thompson creates a safe space for vulnerability while also challenging me to grow. Highly recommend!',
      date: '2024-01-10',
      verified: true
    },
    {
      id: '3',
      clientName: 'Anonymous',
      rating: 5,
      comment: 'Professional, empathetic, and truly cares about her clients. The mindfulness techniques she taught me have been life-changing.',
      date: '2024-01-05',
      verified: true
    }
  ],

  // Content library
  reels: [
    { id: '1', thumbnail: null, title: '5 Signs You Might Need Therapy', views: '12.3K' },
    { id: '2', thumbnail: null, title: 'Grounding Techniques for Anxiety', views: '8.7K' },
    { id: '3', thumbnail: null, title: 'Understanding Trauma Responses', views: '15.2K' }
  ],
  posts: [
    { id: '1', type: 'text', title: 'Daily Affirmations for Anxiety', likes: 245 },
    { id: '2', type: 'image', title: 'Coping Skills Toolkit', likes: 189 },
    { id: '3', type: 'text', title: 'The Window of Tolerance', likes: 312 }
  ],

  // Stats
  followers: 2847,
  totalSessions: 450,
  responseTime: '< 24 hours'
});

export default function TherapistProfile() {
  const { therapistId } = useParams();
  const [therapist, setTherapist] = useState(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [activeTab, setActiveTab] = useState('about');

  useEffect(() => {
    // Load therapist data
    const therapistData = getMockTherapistData(therapistId || 'test-therapist-001');
    setTherapist(therapistData);

    // Load current user
    const userData = localStorage.getItem('aurawell_current_user');
    if (userData) {
      setCurrentUser(JSON.parse(userData));
    }
  }, [therapistId]);

  const handleMessageTherapist = () => {
    toast.success('Opening secure message thread...');
    // In real app, navigate to messages
  };

  const handleBookSession = () => {
    toast.info('Booking feature coming soon!');
    // In real app, open booking modal
  };

  const handleFollow = () => {
    setIsFollowing(!isFollowing);
    toast.success(isFollowing ? 'Unfollowed' : 'Following Dr. Thompson');
  };

  if (!therapist) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-4 border-purple-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Loading therapist profile...</p>
        </div>
      </div>
    );
  }

  const getAvailabilityBadge = () => {
    switch (therapist.availabilityStatus) {
      case 'open':
        return { text: 'Accepting New Clients', color: 'bg-green-100 text-green-700 border-green-200' };
      case 'limited':
        return { text: 'Limited Availability', color: 'bg-yellow-100 text-yellow-700 border-yellow-200' };
      case 'closed':
        return { text: 'Not Accepting New Clients', color: 'bg-red-100 text-red-700 border-red-200' };
      default:
        return { text: 'Unknown', color: 'bg-gray-100 text-gray-700 border-gray-200' };
    }
  };

  const availability = getAvailabilityBadge();

  return (
    <div className="min-h-screen bg-gray-50">
      <BackHeader
        title="Therapist Profile"
        subtitle="View professional credentials and background"
        backTo={createPageUrl("TherapistDirectory")}
        backLabel="Directory"
      />

      <div className="max-w-5xl mx-auto p-4 md:p-8 space-y-6">

        {/* Cover Image Placeholder */}
        <div className="w-full h-48 bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 rounded-2xl"></div>

        {/* Profile Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="-mt-24"
        >
          <Card className="border-light shadow-xl">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Profile Image */}
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 bg-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-semibold shadow-lg">
                    {therapist.name.split(' ').map(n => n[0]).join('')}
                  </div>
                </div>

                {/* Profile Info */}
                <div className="flex-1">
                  <div className="flex items-start justify-between flex-wrap gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
                          {therapist.name}
                        </h1>
                        {therapist.verificationStatus === 'verified' && (
                          <Badge className="bg-blue-100 text-blue-700 border-blue-200 flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-gray-600 mb-2">{therapist.credentials}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span className="flex items-center gap-1">
                          <Award className="w-4 h-4" />
                          {therapist.yearsExperience} years experience
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-4 h-4" />
                          {therapist.followers} followers
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          {therapist.rating} ({therapist.reviewCount} reviews)
                        </span>
                      </div>
                    </div>

                    <Badge className={`${availability.color} border px-3 py-1`}>
                      {availability.text}
                    </Badge>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex gap-3 mt-6">
                    <Button
                      onClick={handleMessageTherapist}
                      className="bg-purple-600 hover:bg-purple-700 text-white"
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Message
                    </Button>
                    <Button
                      onClick={handleBookSession}
                      variant="outline"
                      className="border-purple-200 text-purple-700 hover:bg-purple-50"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Book Session
                    </Button>
                    <Button
                      onClick={handleFollow}
                      variant={isFollowing ? 'outline' : 'default'}
                      className={isFollowing ? 'border-gray-300' : 'bg-purple-600 hover:bg-purple-700 text-white'}
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      {isFollowing ? 'Following' : 'Follow'}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Main Content Tabs */}
        <Card className="border-light shadow-sm">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-4 w-full mb-6">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="credentials">Credentials</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="content">Content</TabsTrigger>
              </TabsList>

              {/* About Tab */}
              <TabsContent value="about" className="space-y-6">
                {/* Intro Video */}
                {therapist.introVideoUrl && (
                  <div>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <Video className="w-5 h-5 text-purple-600" />
                      Introduction Video
                    </h3>
                    <div className="aspect-video bg-gray-900 rounded-lg overflow-hidden">
                      <iframe
                        width="100%"
                        height="100%"
                        src={therapist.introVideoUrl}
                        title="Therapist Introduction"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </div>
                  </div>
                )}

                {/* Bio */}
                <div>
                  <h3 className="text-lg font-semibold mb-3">About Me</h3>
                  <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                    {therapist.bio}
                  </p>
                </div>

                {/* Therapy Styles */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Heart className="w-5 h-5 text-purple-600" />
                    Therapy Approaches
                  </h3>
                  <div className="grid md:grid-cols-2 gap-3">
                    {therapist.therapyStyles.map(styleId => {
                      const style = THERAPY_STYLES.find(s => s.id === styleId);
                      return style ? (
                        <div key={styleId} className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
                          <div className="p-2 bg-purple-600 rounded-lg">
                            <style.icon className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-sm font-medium text-gray-800">{style.name}</span>
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>

                {/* Specialties */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Award className="w-5 h-5 text-purple-600" />
                    Specialties
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {therapist.specialties.map((specialty, index) => (
                      <Badge key={index} className="bg-purple-100 text-purple-700 border-purple-200">
                        {specialty}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Populations Served */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    Populations Served
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {therapist.populations.map((pop, index) => (
                      <Badge key={index} className="bg-indigo-100 text-indigo-700 border-indigo-200">
                        {pop}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Languages */}
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Globe className="w-5 h-5 text-purple-600" />
                    Languages Spoken
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {therapist.languages.map((lang, index) => (
                      <Badge key={index} className="bg-green-100 text-green-700 border-green-200">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Session Info */}
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Session Rate</p>
                    <p className="text-lg font-semibold text-gray-800">{therapist.sessionRate}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Session Length</p>
                    <p className="text-lg font-semibold text-gray-800">{therapist.sessionLength}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-1">Response Time</p>
                    <p className="text-lg font-semibold text-gray-800">{therapist.responseTime}</p>
                  </div>
                </div>
              </TabsContent>

              {/* Credentials Tab */}
              <TabsContent value="credentials" className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-purple-600" />
                    Verification Status
                  </h3>
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <CheckCircle className="w-8 h-8 text-green-600" />
                        <div>
                          <p className="font-semibold text-green-900">Verified Professional</p>
                          <p className="text-sm text-green-700">Credentials verified by AuraWell</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-purple-600" />
                    License Information
                  </h3>
                  <div className="space-y-2">
                    <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">License Type</span>
                      <span className="font-medium">Licensed Clinical Psychologist</span>
                    </div>
                    <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">License Number</span>
                      <span className="font-medium">{therapist.licenseNumber}</span>
                    </div>
                    <div className="flex justify-between p-3 bg-gray-50 rounded-lg">
                      <span className="text-gray-600">State</span>
                      <span className="font-medium">California</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-purple-600" />
                    Education
                  </h3>
                  <div className="space-y-3">
                    {therapist.education.map((edu, index) => (
                      <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                        <GraduationCap className="w-5 h-5 text-purple-600 mt-0.5" />
                        <span className="text-gray-800">{edu}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Award className="w-5 h-5 text-purple-600" />
                    Professional Stats
                  </h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <p className="text-sm text-purple-600 mb-1">Years of Experience</p>
                      <p className="text-2xl font-bold text-purple-900">{therapist.yearsExperience}</p>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                      <p className="text-sm text-purple-600 mb-1">Total Sessions</p>
                      <p className="text-2xl font-bold text-purple-900">{therapist.totalSessions}+</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews" className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800">
                      {therapist.rating} <span className="text-lg text-gray-500">out of 5</span>
                    </h3>
                    <p className="text-sm text-gray-600">{therapist.reviewCount} verified reviews</p>
                  </div>
                  <div className="flex gap-1">
                    {[1, 2, 3, 4, 5].map(star => (
                      <Star
                        key={star}
                        className={`w-6 h-6 ${
                          star <= Math.floor(therapist.rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  {therapist.reviews.map(review => (
                    <Card key={review.id} className="border-light">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                              <Users className="w-5 h-5 text-purple-600" />
                            </div>
                            <div>
                              <p className="font-medium text-gray-800">{review.clientName}</p>
                              <p className="text-xs text-gray-500">{new Date(review.date).toLocaleDateString()}</p>
                            </div>
                          </div>
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map(star => (
                              <Star
                                key={star}
                                className={`w-4 h-4 ${
                                  star <= review.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700 mb-2">{review.comment}</p>
                        {review.verified && (
                          <Badge className="bg-green-100 text-green-700 border-green-200 text-xs">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Verified Client
                          </Badge>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <div className="text-center py-4 text-sm text-gray-500">
                  <Shield className="w-4 h-4 inline mr-2" />
                  All reviews are moderated and verified
                </div>
              </TabsContent>

              {/* Content Library Tab */}
              <TabsContent value="content" className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Play className="w-5 h-5 text-purple-600" />
                    Reels ({therapist.reels.length})
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {therapist.reels.map(reel => (
                      <div key={reel.id} className="cursor-pointer group">
                        <div className="aspect-[9/16] bg-gradient-to-br from-purple-400 to-pink-400 rounded-lg overflow-hidden relative">
                          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                            <Play className="w-12 h-12 text-white" />
                          </div>
                          <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent">
                            <p className="text-white text-sm font-medium line-clamp-2">{reel.title}</p>
                            <p className="text-white/80 text-xs">{reel.views} views</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-purple-600" />
                    Posts ({therapist.posts.length})
                  </h3>
                  <div className="space-y-3">
                    {therapist.posts.map(post => (
                      <Card key={post.id} className="border-light cursor-pointer hover:shadow-md transition-shadow">
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                {post.type === 'image' ? (
                                  <ImageIcon className="w-6 h-6 text-purple-600" />
                                ) : (
                                  <FileText className="w-6 h-6 text-purple-600" />
                                )}
                              </div>
                              <div>
                                <p className="font-medium text-gray-800">{post.title}</p>
                                <p className="text-sm text-gray-500">{post.likes} likes</p>
                              </div>
                            </div>
                            <Heart className="w-5 h-5 text-gray-400" />
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Sticky Bottom Actions (Mobile) */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-10">
          <div className="flex gap-2">
            <Button
              onClick={handleMessageTherapist}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              Message
            </Button>
            <Button
              onClick={handleBookSession}
              className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
            >
              <Calendar className="w-4 h-4 mr-2" />
              Book
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}