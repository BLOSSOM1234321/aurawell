/**
 * SEED DATA FOR SUPPORT GROUPS
 * Run this in the browser console to populate initial Support Groups in localStorage
 *
 * Usage:
 * 1. Open browser console (F12)
 * 2. Copy and paste this entire file
 * 3. Run: seedSupportGroups()
 */

export function seedSupportGroups() {
  const storageKey = 'aurawell_SupportGroup';

  const supportGroups = [
    {
      id: 'SupportGroup_1',
      title: 'Anxiety Support',
      slug: 'anxiety-support',
      description: 'Share experiences and coping strategies for anxiety in a supportive environment.',
      icon: 'Brain',
      color: 'from-blue-400 to-cyan-500',
      textColor: 'text-blue-800',
      topic: 'anxiety',
      guidelines: `
• Be respectful and kind to all members
• No medical advice - share experiences only
• Keep discussions on topic
• Respect privacy - what's shared here stays here
• Support, don't diagnose
      `.trim(),
      moderatorIds: [],
      isArchived: false,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'SupportGroup_2',
      title: 'Depression Support',
      slug: 'depression-support',
      description: 'A compassionate community for those navigating depression and seeking hope.',
      icon: 'Users',
      color: 'from-indigo-400 to-indigo-600',
      textColor: 'text-indigo-800',
      topic: 'depression',
      guidelines: `
• This is a judgment-free zone
• Be patient with yourself and others
• No toxic positivity - all feelings are valid
• Trigger warnings for sensitive content
• Reach out if you're in crisis
      `.trim(),
      moderatorIds: [],
      isArchived: false,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'SupportGroup_3',
      title: 'Trauma Recovery & PTSD',
      slug: 'trauma-recovery-ptsd',
      description: 'Healing together through shared experiences and trauma-informed support.',
      icon: 'Heart',
      color: 'from-red-400 to-red-600',
      textColor: 'text-red-800',
      topic: 'ptsd',
      guidelines: `
• Use content warnings for trauma discussions
• Respect boundaries and triggers
• Focus on recovery and healing
• No graphic details unless requested
• Support without pushing for disclosure
      `.trim(),
      moderatorIds: [],
      isArchived: false,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'SupportGroup_4',
      title: 'Bipolar & Mood Disorder Support',
      slug: 'bipolar-mood-disorder-support',
      description: 'Understanding and managing bipolar disorder and other mood disorders together.',
      icon: 'Brain',
      color: 'from-purple-400 to-purple-600',
      textColor: 'text-purple-800',
      topic: 'bipolar',
      guidelines: `
• Share what works for you
• Be open to different coping strategies
• No judgment of stress levels
• Practical advice welcome
• Remember self-care is not selfish
      `.trim(),
      moderatorIds: [],
      isArchived: false,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'SupportGroup_5',
      title: 'Borderline Personality Disorder (BPD) Support',
      slug: 'bpd-support',
      description: 'A supportive community for those with BPD, focusing on DBT skills and emotional wellness.',
      icon: 'Heart',
      color: 'from-pink-400 to-pink-600',
      textColor: 'text-pink-800',
      topic: 'bpd',
      guidelines: `
• All mental health topics welcome
• Be inclusive and accepting
• Share resources and wins
• Support others where you can
• Take breaks when needed
      `.trim(),
      moderatorIds: [],
      isArchived: false,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    },
    {
      id: 'SupportGroup_6',
      title: 'ADHD & Neurodivergence Support',
      slug: 'adhd-neurodivergence-support',
      description: 'Support and strategies for ADHD and neurodivergent individuals navigating daily life.',
      icon: 'Brain',
      color: 'from-orange-400 to-orange-600',
      textColor: 'text-orange-800',
      topic: 'adhd',
      guidelines: `
• Be respectful and understanding
• Share strategies and resources
• Support different experiences
• No judgment of symptoms
• Celebrate neurodiversity
      `.trim(),
      moderatorIds: [],
      isArchived: false,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
  ];

  // Store in localStorage
  localStorage.setItem(storageKey, JSON.stringify(supportGroups));

  console.log(`✅ Successfully seeded ${supportGroups.length} Support Groups!`);
  console.log('Groups created:', supportGroups.map(g => g.title).join(', '));

  return supportGroups;
}

// Auto-run if in browser context
if (typeof window !== 'undefined' && typeof localStorage !== 'undefined') {
  window.seedSupportGroups = seedSupportGroups;
  console.log('💡 Seed function available. Run: seedSupportGroups()');
}