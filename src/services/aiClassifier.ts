import { TicketCategory, TicketPriority } from '../types';

export interface AIClassificationResult {
  category: TicketCategory;
  priority: TicketPriority;
  confidence: number;
  reasoning: string;
  matchedKeywords: string[];
}

const CATEGORY_RULES: Record<
  TicketCategory,
  {
    primary: string[];
    secondary: string[];
    urgencyTriggers: string[];
  }
> = {
  Electrical: {
    primary: [
      'fan', 'light', 'bulb', 'tubelight', 'tube', 'switch', 'socket', 'plug',
      'wire', 'wiring', 'spark', 'sparking', 'short circuit', 'mcb', 'fuse',
      'geyser', 'heater', 'cooler', 'ac', 'air conditioner', 'power', 'blackout',
      'current', 'shock', 'voltage', 'burning smell', 'smoke', 'flicker', 'flickering'
    ],
    secondary: ['smell', 'trip', 'tripped', 'dead', 'blown', 'buzzing', 'heat'],
    urgencyTriggers: ['burning smell', 'smoke', 'spark', 'sparking', 'shock', 'short circuit', 'fire']
  },
  Plumbing: {
    primary: [
      'tap', 'faucet', 'leak', 'leakage', 'leaking', 'pipe', 'flush', 'toilet',
      'commode', 'washbasin', 'basin', 'sink', 'drain', 'drainage', 'clogged',
      'choked', 'choke', 'water', 'shower', 'overflow', 'overflowing', 'damp',
      'dripping', 'valve', 'sewer', 'sewerage', 'pipeline', 'tank'
    ],
    secondary: ['wet', 'stagnant', 'flooding', 'drop', 'dripping', 'smell', 'blocked', 'blockage'],
    urgencyTriggers: ['flooding', 'overflowing', 'burst pipe', 'pipe burst', 'severe leak', 'water all over']
  },
  Carpentry: {
    primary: [
      'door', 'lock', 'key', 'handle', 'hinge', 'bolt', 'latch', 'window',
      'frame', 'table', 'chair', 'desk', 'bed', 'cot', 'cupboard', 'wardrobe',
      'shelf', 'drawer', 'wood', 'almirah', 'shutter', 'plywood', 'drawer stuck'
    ],
    secondary: ['broken', 'loose', 'jammed', 'stuck', 'fell off', 'creaking', 'hinge broken', 'cracked'],
    urgencyTriggers: ['lock jammed', 'cannot lock', 'door off hinges', 'glass broken', 'shattered']
  },
  Other: {
    primary: [
      'paint', 'painting', 'pest', 'cockroach', 'insects', 'bedbug', 'rat',
      'cleaning', 'dustbin', 'garbage', 'trash', 'mirror', 'curtain', 'mattress'
    ],
    secondary: ['dirty', 'stain', 'white wash', 'dampness', 'infestation'],
    urgencyTriggers: ['infestation', 'hazardous', 'snake']
  }
};

const HIGH_PRIORITY_TERMS = ['urgent', 'emergency', 'immediately', 'danger', 'burning', 'spark', 'shock', 'flood'];

export function classifyTicketText(text: string): AIClassificationResult {
  const normalized = text.toLowerCase().trim();

  if (!normalized) {
    return {
      category: 'Other',
      priority: 'Low',
      confidence: 0,
      reasoning: 'No description provided.',
      matchedKeywords: []
    };
  }

  const scores: Record<TicketCategory, { score: number; matches: string[] }> = {
    Electrical: { score: 0, matches: [] },
    Plumbing: { score: 0, matches: [] },
    Carpentry: { score: 0, matches: [] },
    Other: { score: 0, matches: [] }
  };

  // Evaluate scores for each category
  (Object.keys(CATEGORY_RULES) as TicketCategory[]).forEach(cat => {
    const rules = CATEGORY_RULES[cat];

    rules.primary.forEach(term => {
      if (normalized.includes(term)) {
        scores[cat].score += 3;
        scores[cat].matches.push(term);
      }
    });

    rules.secondary.forEach(term => {
      if (normalized.includes(term) && !scores[cat].matches.includes(term)) {
        scores[cat].score += 1.5;
        scores[cat].matches.push(term);
      }
    });

    rules.urgencyTriggers.forEach(term => {
      if (normalized.includes(term)) {
        scores[cat].score += 4;
        if (!scores[cat].matches.includes(term)) {
          scores[cat].matches.push(term);
        }
      }
    });
  });

  // Find category with highest score
  let bestCategory: TicketCategory = 'Other';
  let maxScore = 0;

  (Object.keys(scores) as TicketCategory[]).forEach(cat => {
    if (scores[cat].score > maxScore) {
      maxScore = scores[cat].score;
      bestCategory = cat;
    }
  });

  // Calculate confidence percentage
  const totalScore = Object.values(scores).reduce((acc, curr) => acc + curr.score, 0);
  let confidence = 50;
  if (totalScore > 0) {
    confidence = Math.min(98, Math.round((maxScore / (totalScore * 0.75 || 1)) * 100));
    if (confidence < 45) confidence = 45;
  }

  // Determine priority
  let priority: TicketPriority = 'Medium';
  const categoryRules = CATEGORY_RULES[bestCategory];
  const hasUrgencyTrigger = categoryRules.urgencyTriggers.some(term => normalized.includes(term));
  const hasHighPriorityWord = HIGH_PRIORITY_TERMS.some(term => normalized.includes(term));

  const isElectrical = (bestCategory as TicketCategory) === 'Electrical';
  if (hasUrgencyTrigger || (normalized.includes('burning') && isElectrical)) {
    priority = 'Urgent';
  } else if (hasHighPriorityWord || maxScore >= 6) {
    priority = 'High';
  } else if (maxScore <= 3 && !hasUrgencyTrigger) {
    priority = 'Low';
  }

  // Generate explanation
  const matchedList = scores[bestCategory].matches.slice(0, 3);
  let reasoning = '';
  if (matchedList.length > 0) {
    reasoning = `Identified ${bestCategory.toLowerCase()} markers: "${matchedList.join('", "')}". Urgency evaluated as ${priority}.`;
  } else {
    reasoning = `General maintenance query assigned default category "${bestCategory}".`;
  }

  return {
    category: bestCategory,
    priority,
    confidence,
    reasoning,
    matchedKeywords: scores[bestCategory].matches
  };
}
