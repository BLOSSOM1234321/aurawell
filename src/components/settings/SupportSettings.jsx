
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { HelpCircle, Mail, MessageSquare, ExternalLink, Heart, Sparkles, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { User } from '@/api/entities';
import { toast } from 'sonner';
import { addDays, isBefore } from 'date-fns';

const faqs = [
  {
    question: "How do I track my mood?",
    answer: "Go to the Mood Tracker page and rate your mood from 1-10, then add emotions and activities."
  },
  {
    question: "Can I make my posts anonymous?",
    answer: "Yes! Enable anonymous mode in Privacy settings to post without showing your name."
  },
  {
    question: "What's included in Premium?",
    answer: "Premium includes AI journal prompts, advanced analytics, premium themes, and much more."
  },
  {
    question: "How do I delete my account?",
    answer: "Please contact our support team to request account deletion."
  }
];

const isUserInTrial = (user) => {
    if (!user || !user.premium_trial_started_at) return false;
    const trialEndDate = addDays(new Date(user.premium_trial_started_at), 7);
    return isBefore(new Date(), trialEndDate);
};

export default function SupportSettings() {
  const [user, setUser] = useState(null);
  const [featureRequest, setFeatureRequest] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await User.me();
        setUser(currentUser);
      } catch (error) {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  const handleFeatureSubmit = (e) => {
    e.preventDefault();
    if (featureRequest.length < 20) {
      toast.error("Please describe your idea in a bit more detail (at least 20 characters).");
      return;
    }
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      toast.success("Thank you for your suggestion!", {
        description: "Our team will review your VIP request. We appreciate your feedback!",
      });
      setFeatureRequest('');
      setIsSubmitting(false);
    }, 1000);
  };
  
  const isPremiumOrTrial = user && (user.is_premium || isUserInTrial(user));

  return (
    <div className="space-y-6">
      {isPremiumOrTrial && (
        <Card className="bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-100 border-purple-200 shadow-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-3 text-purple-700">
              <Sparkles className="w-5 h-5" />
              Premium Feedback & Requests
            </CardTitle>
            <p className="text-gray-600 text-sm pt-1">As a premium member, your suggestions get top priority. What would you like to see next?</p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleFeatureSubmit} className="space-y-4">
              <div>
                <Label htmlFor="feature-request" className="font-semibold text-gray-700">New Feature or Meditation Idea</Label>
                <Textarea
                  id="feature-request"
                  value={featureRequest}
                  onChange={(e) => setFeatureRequest(e.target.value)}
                  placeholder="Describe your idea... (e.g., 'A meditation for social anxiety' or 'A way to visualize my mood trends over a month')"
                  className="mt-2 h-28 rounded-2xl bg-white/80"
                  maxLength={1000}
                />
              </div>
              <Button type="submit" className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-2xl" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Send My VIP Request'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5" />
            Frequently Asked Questions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="p-4 bg-gray-50 rounded-2xl">
              <h3 className="font-semibold text-gray-800 mb-2">{faq.question}</h3>
              <p className="text-gray-600">{faq.answer}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            Contact & Support
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button variant="outline" className="w-full justify-between rounded-2xl">
            <span className="flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Support
            </span>
            <ExternalLink className="w-4 h-4" />
          </Button>

          <Button variant="outline" className="w-full justify-between rounded-2xl">
            <span className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Submit Feedback
            </span>
            <ExternalLink className="w-4 h-4" />
          </Button>

          <Link to={createPageUrl("Resources")}>
            <Button variant="outline" className="w-full justify-between rounded-2xl">
              <span className="flex items-center gap-2">
                <Heart className="w-4 h-4" />
                Mental Health Resources
              </span>
              <ExternalLink className="w-4 h-4" />
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
