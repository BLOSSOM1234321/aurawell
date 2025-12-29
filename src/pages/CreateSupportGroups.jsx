import React, { useState } from 'react';
import { CommunityGroup } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, CheckCircle2, XCircle } from 'lucide-react';

const supportGroups = [
  {
    title: "Schizophrenia Support",
    slug: "schizophrenia-support",
    description: "A safe space for connection, understanding, and support for those living with schizophrenia and their loved ones.",
    icon: "Brain",
    color: "from-gray-400 to-gray-500",
    textColor: "text-gray-800",
    isArchived: false
  },
  {
    title: "Bipolar & Mood Disorder Support",
    slug: "bipolar-mood-disorder-support",
    description: "Understanding and managing bipolar disorder and other mood disorders together.",
    icon: "Activity",
    color: "from-purple-400 to-purple-600",
    textColor: "text-purple-800",
    isArchived: false
  },
  {
    title: "Borderline Personality Disorder (BPD) Support",
    slug: "bpd-support",
    description: "A supportive community for those with BPD, focusing on DBT skills and emotional wellness.",
    icon: "Heart",
    color: "from-pink-400 to-pink-600",
    textColor: "text-pink-800",
    isArchived: false
  },
  {
    title: "Men's Mental Wellness",
    slug: "mens-mental-wellness",
    description: "A safe space for men to discuss mental health, break down stigma, and support each other.",
    icon: "Shield",
    color: "from-slate-400 to-slate-600",
    textColor: "text-slate-800",
    isArchived: false
  },
  {
    title: "Women's Mental Wellness",
    slug: "womens-mental-wellness",
    description: "Empowering women through shared experiences, support, and mental health advocacy.",
    icon: "Sparkles",
    color: "from-pink-400 to-pink-500",
    textColor: "text-pink-800",
    isArchived: false
  },
  {
    title: "Anxiety Support",
    slug: "anxiety-support",
    description: "Share experiences and coping strategies for anxiety in a supportive environment.",
    icon: "Zap",
    color: "from-blue-400 to-cyan-500",
    textColor: "text-blue-800",
    isArchived: false
  },
  {
    title: "Chronic Illness & Mental Health",
    slug: "chronic-illness-mental-health",
    description: "Support for those managing chronic illness alongside mental health challenges.",
    icon: "HeartPulse",
    color: "from-teal-400 to-teal-600",
    textColor: "text-teal-800",
    isArchived: false
  },
  {
    title: "ADHD & Neurodivergence Support",
    slug: "adhd-neurodivergence-support",
    description: "Support and strategies for ADHD and neurodivergent individuals navigating daily life.",
    icon: "Brain",
    color: "from-orange-400 to-orange-600",
    textColor: "text-orange-800",
    isArchived: false
  },
  {
    title: "Depression Support",
    slug: "depression-support",
    description: "A compassionate community for those navigating depression and seeking hope.",
    icon: "Users",
    color: "from-indigo-400 to-indigo-600",
    textColor: "text-indigo-800",
    isArchived: false
  },
  {
    title: "Trauma Recovery & PTSD",
    slug: "trauma-recovery-ptsd",
    description: "Healing together through shared experiences and trauma-informed support.",
    icon: "Mountain",
    color: "from-red-400 to-red-600",
    textColor: "text-red-800",
    isArchived: false
  }
];

export default function CreateSupportGroups() {
  const [isCreating, setIsCreating] = useState(false);
  const [results, setResults] = useState([]);
  const [existingGroups, setExistingGroups] = useState([]);

  const checkExistingGroups = async () => {
    try {
      const groups = await CommunityGroup.filter({ isArchived: false });
      setExistingGroups(groups || []);
      return groups || [];
    } catch (error) {
      console.error('Error fetching existing groups:', error);
      return [];
    }
  };

  const createAllGroups = async () => {
    setIsCreating(true);
    setResults([]);

    const existing = await checkExistingGroups();
    const existingSlugs = existing.map(g => g.slug);

    const newResults = [];

    for (const group of supportGroups) {
      try {
        if (existingSlugs.includes(group.slug)) {
          newResults.push({
            title: group.title,
            status: 'skipped',
            message: 'Already exists'
          });
        } else {
          await CommunityGroup.create(group);
          newResults.push({
            title: group.title,
            status: 'success',
            message: 'Created successfully'
          });
        }
      } catch (error) {
        newResults.push({
          title: group.title,
          status: 'error',
          message: error.message || 'Failed to create'
        });
      }
      setResults([...newResults]);
    }

    setIsCreating(false);
    await checkExistingGroups();
  };

  React.useEffect(() => {
    checkExistingGroups();
  }, []);

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Create Support Groups</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  This will create {supportGroups.length} support groups in the database
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Current groups in database: {existingGroups.length}
                </p>
              </div>
              <Button
                onClick={createAllGroups}
                disabled={isCreating}
                className="bg-gradient-to-r from-green-500 to-emerald-600 text-white"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create All Groups'
                )}
              </Button>
            </div>

            {results.length > 0 && (
              <div className="space-y-2 mt-6">
                <h3 className="font-semibold text-lg">Results:</h3>
                {results.map((result, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 rounded-lg bg-secondary"
                  >
                    <span className="font-medium">{result.title}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {result.message}
                      </span>
                      {result.status === 'success' && (
                        <CheckCircle2 className="w-5 h-5 text-green-500" />
                      )}
                      {result.status === 'error' && (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                      {result.status === 'skipped' && (
                        <span className="text-yellow-500">⚠</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {existingGroups.length > 0 && (
              <div className="mt-6">
                <h3 className="font-semibold text-lg mb-3">Existing Groups:</h3>
                <div className="space-y-2">
                  {existingGroups.map((group) => (
                    <div
                      key={group.id}
                      className="p-3 rounded-lg bg-secondary"
                    >
                      <div className="font-medium">{group.title}</div>
                      <div className="text-sm text-muted-foreground">
                        {group.description}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
