/**
 * Crisis Detection Utility
 *
 * This module detects potential crisis signals in user text input.
 * It is NOT for diagnosis - it's for early detection and safe redirection.
 *
 * Risk Levels:
 * - LOW: General distress, no immediate intervention needed
 * - MEDIUM: Notable distress, offer gentle support
 * - HIGH: Immediate safety concern, show crisis resources
 */

// High-risk phrases indicating immediate safety concern
const HIGH_RISK_PHRASES = [
  // Suicide ideation
  'i want to die',
  'want to die',
  'i want to end my life',
  'end my life',
  'kill myself',
  'suicide',
  'suicidal',

  // Immediate intent
  "i don't want to be here anymore",
  "don't want to be here",
  'i have a plan',
  'have a plan to',
  'tonight',
  'right now',
  'going to hurt myself',
  'hurt myself',
  'end it all',
  'no reason to live',

  // Self-harm with immediacy
  'cutting myself',
  'going to cut',
  'overdose',
  'jump off',
  'hang myself'
];

// Medium-risk phrases indicating distress needing support
const MEDIUM_RISK_PHRASES = [
  // Hopelessness
  'i feel hopeless',
  'feel hopeless',
  'feels hopeless',
  'no hope',
  'hopeless',

  // Inability to cope
  "i can't do this",
  "can't do this anymore",
  "can't take it",
  "can't go on",

  // Despair
  'i want everything to stop',
  'want it to stop',
  "what's the point",
  'whats the point',
  'no point in',
  'give up',
  'giving up',

  // Worthlessness
  'i am worthless',
  'feel worthless',
  'nobody cares',
  'better off without me',
  'burden to everyone',
  'everyone would be better',

  // Extreme pain
  'unbearable pain',
  "can't handle",
  'too much pain',
  'suffering too much'
];

// Low-risk phrases - general anxiety/distress
const LOW_RISK_PHRASES = [
  'i am anxious',
  'feeling anxious',
  'really stressed',
  'overwhelmed',
  'having a hard time',
  'struggling',
  'sad',
  'depressed',
  'worried',
  'scared'
];

/**
 * Normalize text for analysis
 * @param {string} text - Raw text input
 * @returns {string} Normalized text
 */
function normalizeText(text) {
  if (!text || typeof text !== 'string') return '';

  return text
    .toLowerCase()
    .trim()
    // Remove extra whitespace
    .replace(/\s+/g, ' ')
    // Remove common punctuation at the end
    .replace(/[.,!?;]+$/g, '');
}

/**
 * Check if text contains any phrases from a list
 * @param {string} normalizedText - Normalized text to check
 * @param {string[]} phraseList - List of phrases to match
 * @returns {boolean} True if any phrase is found
 */
function containsPhrase(normalizedText, phraseList) {
  return phraseList.some(phrase => {
    // Check for exact phrase match or phrase at word boundaries
    const regex = new RegExp(`\\b${phrase.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
    return regex.test(normalizedText) || normalizedText.includes(phrase);
  });
}

/**
 * Analyze text and determine risk level
 * @param {string} text - Text to analyze
 * @returns {Object} Risk assessment { level: 'LOW'|'MEDIUM'|'HIGH', confidence: number, matches: string[] }
 */
export function analyzeTextForRisk(text) {
  const normalized = normalizeText(text);

  if (!normalized) {
    return { level: 'NONE', confidence: 0, matches: [] };
  }

  // Check HIGH risk first
  const highMatches = HIGH_RISK_PHRASES.filter(phrase =>
    normalized.includes(phrase) || new RegExp(`\\b${phrase}\\b`, 'i').test(normalized)
  );

  if (highMatches.length > 0) {
    return {
      level: 'HIGH',
      confidence: Math.min(0.5 + (highMatches.length * 0.2), 1.0),
      matches: highMatches,
      timestamp: new Date().toISOString()
    };
  }

  // Check MEDIUM risk
  const mediumMatches = MEDIUM_RISK_PHRASES.filter(phrase =>
    normalized.includes(phrase) || new RegExp(`\\b${phrase}\\b`, 'i').test(normalized)
  );

  if (mediumMatches.length > 0) {
    return {
      level: 'MEDIUM',
      confidence: Math.min(0.4 + (mediumMatches.length * 0.15), 0.9),
      matches: mediumMatches,
      timestamp: new Date().toISOString()
    };
  }

  // Check LOW risk
  const lowMatches = LOW_RISK_PHRASES.filter(phrase =>
    normalized.includes(phrase) || new RegExp(`\\b${phrase}\\b`, 'i').test(normalized)
  );

  if (lowMatches.length > 0) {
    return {
      level: 'LOW',
      confidence: 0.3 + (lowMatches.length * 0.1),
      matches: lowMatches,
      timestamp: new Date().toISOString()
    };
  }

  return { level: 'NONE', confidence: 0, matches: [], timestamp: new Date().toISOString() };
}

/**
 * Behavioral signal tracker
 */
export class BehavioralSignalTracker {
  constructor(userId) {
    this.userId = userId;
    this.messageHistory = [];
    this.emotionalTrend = [];
    this.maxHistoryLength = 50;
  }

  /**
   * Add a message to the tracking history
   * @param {string} text - Message text
   * @param {string} riskLevel - Detected risk level
   */
  addMessage(text, riskLevel) {
    const timestamp = Date.now();

    this.messageHistory.push({
      text,
      riskLevel,
      timestamp
    });

    // Keep only recent messages
    if (this.messageHistory.length > this.maxHistoryLength) {
      this.messageHistory.shift();
    }

    // Track emotional trend
    const riskScore = riskLevel === 'HIGH' ? 3 : riskLevel === 'MEDIUM' ? 2 : riskLevel === 'LOW' ? 1 : 0;
    this.emotionalTrend.push({ score: riskScore, timestamp });

    if (this.emotionalTrend.length > 20) {
      this.emotionalTrend.shift();
    }
  }

  /**
   * Detect rapid message posting (potential crisis escalation)
   * @returns {boolean} True if rapid posting detected
   */
  detectRapidPosting() {
    const now = Date.now();
    const recentMessages = this.messageHistory.filter(m => now - m.timestamp < 60000); // Last minute
    return recentMessages.length >= 5; // 5+ messages in 1 minute
  }

  /**
   * Detect emotional escalation
   * @returns {boolean} True if escalation detected
   */
  detectEmotionalEscalation() {
    if (this.emotionalTrend.length < 5) return false;

    const recent = this.emotionalTrend.slice(-5);
    const increasing = recent.every((item, i) =>
      i === 0 || item.score >= recent[i - 1].score
    );

    const hasHighRisk = recent.some(item => item.score >= 2);

    return increasing && hasHighRisk;
  }

  /**
   * Check for repeated crisis language
   * @returns {boolean} True if repeated crisis language detected
   */
  detectRepeatedCrisisLanguage() {
    const recentCrisisMessages = this.messageHistory
      .filter(m => m.riskLevel === 'HIGH' || m.riskLevel === 'MEDIUM')
      .filter(m => Date.now() - m.timestamp < 300000); // Last 5 minutes

    return recentCrisisMessages.length >= 3;
  }

  /**
   * Get overall behavioral risk assessment
   * @returns {Object} Behavioral risk assessment
   */
  getBehavioralRisk() {
    const rapidPosting = this.detectRapidPosting();
    const escalation = this.detectEmotionalEscalation();
    const repeated = this.detectRepeatedCrisisLanguage();

    const signalCount = [rapidPosting, escalation, repeated].filter(Boolean).length;

    return {
      hasSignals: signalCount > 0,
      signalCount,
      signals: {
        rapidPosting,
        emotionalEscalation: escalation,
        repeatedCrisisLanguage: repeated
      },
      recommendation: signalCount >= 2 ? 'ESCALATE' : signalCount === 1 ? 'MONITOR' : 'NORMAL'
    };
  }

  /**
   * Clear history (e.g., when user logs out or session ends)
   */
  clear() {
    this.messageHistory = [];
    this.emotionalTrend = [];
  }
}

/**
 * Get crisis resources based on user region
 * @param {string} region - User's region/country code (default: 'US')
 * @returns {Object} Crisis resources
 */
export function getCrisisResources(region = 'US') {
  const resources = {
    US: {
      name: 'United States',
      hotlines: [
        {
          name: '988 Suicide & Crisis Lifeline',
          phone: '988',
          description: '24/7 crisis support',
          availability: 'Call or text 988'
        },
        {
          name: 'Crisis Text Line',
          phone: '741741',
          description: 'Text HOME to 741741',
          availability: '24/7 text support'
        }
      ],
      emergencyNumber: '911'
    },
    UK: {
      name: 'United Kingdom',
      hotlines: [
        {
          name: 'Samaritans',
          phone: '116 123',
          description: '24/7 crisis support',
          availability: 'Free to call'
        }
      ],
      emergencyNumber: '999'
    },
    CA: {
      name: 'Canada',
      hotlines: [
        {
          name: 'Talk Suicide Canada',
          phone: '1-833-456-4566',
          description: '24/7 crisis support',
          availability: 'Call or text'
        }
      ],
      emergencyNumber: '911'
    },
    AU: {
      name: 'Australia',
      hotlines: [
        {
          name: 'Lifeline',
          phone: '13 11 14',
          description: '24/7 crisis support',
          availability: 'Call or text'
        }
      ],
      emergencyNumber: '000'
    }
  };

  return resources[region] || resources.US;
}

/**
 * Log crisis detection event (for moderation/analytics)
 * @param {Object} event - Crisis detection event
 */
export function logCrisisEvent(event) {
  const crisisLog = JSON.parse(localStorage.getItem('crisis_log') || '[]');

  crisisLog.push({
    ...event,
    timestamp: new Date().toISOString(),
    sessionId: sessionStorage.getItem('session_id') || 'unknown'
  });

  // Keep only recent 100 events
  if (crisisLog.length > 100) {
    crisisLog.shift();
  }

  localStorage.setItem('crisis_log', JSON.stringify(crisisLog));

  // In production, this would also send to a secure backend for moderator review
  console.warn('[CRISIS DETECTION]', event);
}