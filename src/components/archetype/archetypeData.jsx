import { Heart, Compass, BookOpen, Moon } from 'lucide-react';

export const archetypes = {
  healer: {
    name: 'The Healer',
    symbol: Heart,
    color: 'from-purple-500 to-pink-500',
    auraColor: 'rgba(236, 72, 153, 0.3)',
    description: 'Embrace compassion, mend wounds, and care for yourself and others.',
    prompts: [
      "What does forgiveness mean to you today?",
      "Describe a time you showed compassion to someone, and how it felt.",
      "What is one small act of self-care you can practice right now?",
      "Who in your life needs healing, and how can you support them without draining yourself?",
      "Write a letter of kindness to a past version of yourself."
    ],
    challenges: [
      "Reach out to a friend you haven't spoken to in a while.",
      "Spend 10 minutes meditating on self-compassion.",
      "Identify a negative thought pattern and consciously reframe it.",
      "Do one random act of kindness for a stranger.",
      "Schedule and complete a relaxing activity just for you (e.g., a bath, a walk)."
    ],
    dailyExercises: {
      5: { type: 'exercise', title: 'Forgiveness Letter', content: 'Write a heartfelt forgiveness letter to yourself or someone else. Focus on releasing resentment and finding peace.' },
      12: { type: 'challenge', title: 'Reach Out With Kindness', content: 'Contact someone you\'ve lost touch with and send them a message of kindness or appreciation.' },
      20: { type: 'exercise', title: 'Mirror Affirmation Meditation', content: 'Look at yourself in the mirror for 5 minutes. Say 3 loving affirmations about who you are and who you\'re becoming.' },
      28: { type: 'challenge', title: 'Acts of Service', content: 'Volunteer for 1 hour or perform a random act of kindness for a stranger. Notice how it makes you feel.' }
    }
  },
  explorer: {
    name: 'The Explorer',
    symbol: Compass,
    color: 'from-blue-500 to-teal-500',
    auraColor: 'rgba(14, 165, 233, 0.3)',
    description: 'Seek new experiences, challenge your limits, and embrace the unknown.',
    prompts: [
      "What is one small risk you can take this week?",
      "Describe a place you've never been but long to visit. What draws you there?",
      "If you could learn any new skill, what would it be and why?",
      "What's a belief you hold that you've never questioned? It's time to question it.",
      "What does 'adventure' mean to you in your daily life?"
    ],
    challenges: [
      "Try a food you've never eaten before.",
      "Take a different route on your daily commute or walk.",
      "Start a conversation with a stranger.",
      "Read an article or book on a topic completely new to you.",
      "Do one thing that takes you out of your comfort zone."
    ],
    dailyExercises: {
      3: { type: 'challenge', title: 'New Path Discovery', content: 'Take a completely different route on your daily walk or commute. Notice what new things you discover.' },
      10: { type: 'exercise', title: 'Comfort Zone Mapping', content: 'Draw your "comfort zone circle" and identify 3 things that exist outside it. Pick one to explore this week.' },
      18: { type: 'challenge', title: 'Try Something New', content: 'Engage in an activity you\'ve never done before - could be as simple as trying a new cuisine or as bold as a new hobby.' },
      29: { type: 'challenge', title: 'Personal Adventure Day', content: 'Plan and execute a mini-adventure day. It could be exploring a new neighborhood, visiting a museum, or trying a new outdoor activity.' }
    }
  },
  sage: {
    name: 'The Sage',
    symbol: BookOpen,
    color: 'from-indigo-500 to-purple-600',
    auraColor: 'rgba(129, 140, 248, 0.3)',
    description: 'Pursue wisdom, find clarity in perspective, and share your knowledge.',
    prompts: [
      "What is the most valuable lesson you've learned this year?",
      "If you could give one piece of advice to your younger self, what would it be?",
      "What's a complex topic you want to understand better?",
      "How can you find wisdom in a recent challenge you faced?",
      "Who do you consider a wise person, and what qualities do they have?"
    ],
    challenges: [
      "Spend 15 minutes learning about a topic you're curious about.",
      "Share a piece of wisdom you've learned with a friend.",
      "Journal about a past mistake and the lesson it taught you.",
      "Listen to a podcast or watch a documentary on a subject you know little about.",
      "Practice offering advice to yourself as if you were a wise mentor."
    ],
    dailyExercises: {
      4: { type: 'exercise', title: 'Letter to Past Self', content: 'Write a thoughtful letter of advice to your past self. What wisdom would you share? What would you want them to know?' },
      11: { type: 'challenge', title: 'Wisdom Reading', content: 'Read 10 pages from a philosophy, psychology, or wisdom book. Reflect on one insight that resonates with you.' },
      19: { type: 'exercise', title: 'Quote Meditation', content: 'Choose a meaningful quote and spend 15 minutes meditating on it. Write your personal interpretation and how it applies to your life.' },
      27: { type: 'challenge', title: 'Share Your Wisdom', content: 'Host a discussion with a friend or share online one important life lesson you\'ve learned. Help others benefit from your insights.' }
    }
  },
  dreamer: {
    name: 'The Dreamer',
    symbol: Moon,
    color: 'from-fuchsia-500 to-purple-600',
    auraColor: 'rgba(217, 70, 239, 0.3)',
    description: 'Nurture your imagination, visualize your future, and bring creativity to life.',
    prompts: [
      "If there were no limits, what would your ideal day look like?",
      "Describe a dream or aspiration you've never told anyone.",
      "What is one creative idea you've had recently? How can you explore it?",
      "Visualize your life five years from now. What do you see?",
      "What does 'creativity' mean to you, and how do you express it?"
    ],
    challenges: [
      "Spend 10 minutes doodling or sketching without any goal.",
      "Create a small 'mood board' for a goal you have.",
      "Write a short story or poem, even just a few lines.",
      "Listen to a new genre of music and notice how it makes you feel.",
      "Daydream for 5 minutes without distraction."
    ],
    dailyExercises: {
      2: { type: 'exercise', title: 'Dream World Creation', content: 'Draw, write, or describe your ideal "dream world" with no limits. Let your imagination run completely free.' },
      9: { type: 'challenge', title: 'Creative Expression', content: 'Spend 30 minutes creating something - writing, art, music, or any creative medium that calls to you.' },
      16: { type: 'exercise', title: 'Future Vision Recording', content: 'Record a voice note describing your ideal future in vivid, sensory detail. What do you see, hear, and feel?' },
      30: { type: 'challenge', title: 'Share Your Creation', content: 'Share something creative you\'ve made publicly - a poem, artwork, song, or written piece. Embrace the vulnerability of creation.' }
    }
  }
};