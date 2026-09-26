import { TicketCategory, TicketPriority, SmartMaintenanceAIResult } from '../types';

export type { SmartMaintenanceAIResult };

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

const HIGH_PRIORITY_TERMS = ['urgent', 'emergency', 'immediately', 'danger', 'burning', 'spark', 'shock', 'flood', 'continuous', 'severe'];

/**
 * Synchronous local classifier that adheres strictly to the Smart Maintenance AI schema.
 * Operates as instant fallback or direct classifier when offline.
 */
export function classifyTicketLocally(text: string, room?: string): SmartMaintenanceAIResult {
  const normalized = text.toLowerCase().trim();

  if (!normalized) {
    return {
      category: 'Other',
      priority: 'Low',
      urgency: 'Low',
      summary: 'General maintenance inquiry.',
      suggestedAction: 'Please provide more details on the issue.',
      reasoning: 'No description provided.',
      confidence: 50,
      source: 'local_fallback'
    };
  }

  const scores: Record<TicketCategory, { score: number; matches: string[] }> = {
    Electrical: { score: 0, matches: [] },
    Plumbing: { score: 0, matches: [] },
    Carpentry: { score: 0, matches: [] },
    Other: { score: 0, matches: [] }
  };

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

  let bestCategory: TicketCategory = 'Other';
  let maxScore = 0;

  for (const cat of (Object.keys(scores) as TicketCategory[])) {
    if (scores[cat].score > maxScore) {
      maxScore = scores[cat].score;
      bestCategory = cat;
    }
  }

  const totalScore = Object.values(scores).reduce((acc, curr) => acc + curr.score, 0);
  let confidence = 75;
  if (totalScore > 0) {
    confidence = Math.min(96, Math.max(70, Math.round((maxScore / (totalScore * 0.75 || 1)) * 100)));
  }

  // Priority and Urgency determination
  let priority: TicketPriority = 'Medium';
  let urgency: 'Low' | 'Medium' | 'High' = 'Medium';

  const isSevereElectrical = normalized.includes('spark') || normalized.includes('shock') || normalized.includes('burning') || normalized.includes('smoke') || normalized.includes('fire');
  const isSeverePlumbing = normalized.includes('flood') || normalized.includes('burst') || normalized.includes('continuous');
  const isSecurityConcern = normalized.includes('cannot lock') || normalized.includes('lock jammed');

  if (isSevereElectrical || isSeverePlumbing || isSecurityConcern) {
    priority = isSevereElectrical ? 'Urgent' : 'High';
    urgency = 'High';
  } else if (HIGH_PRIORITY_TERMS.some(t => normalized.includes(t)) || maxScore >= 6) {
    priority = 'High';
    urgency = 'High';
  } else if (maxScore <= 2) {
    priority = 'Low';
    urgency = 'Low';
  }

  // Formulate concise summary and safe operational recommendation
  let summary = '';
  let suggestedAction = '';
  let reasoning = '';

  const roomText = room ? `in Room ${room}` : 'in hostel quarters';

  if (bestCategory === 'Electrical') {
    if (isSevereElectrical) {
      summary = `Urgent electrical hazard (sparking/short-circuit) ${roomText}.`;
      suggestedAction = 'Do not touch switches or fixtures. Keep distance and await emergency electrician dispatch.';
      reasoning = 'Severe hazard keywords (sparking/burning/shock) detect active electrical danger requiring immediate intervention.';
      confidence = 94;
    } else {
      summary = `Electrical appliance or fixture malfunction reported ${roomText}.`;
      suggestedAction = 'Inspect circuit supply, switch contacts, and fan/lighting motor connections.';
      reasoning = `Keywords indicate an electrical fixture issue (${scores.Electrical.matches.slice(0, 3).join(', ')}).`;
      confidence = Math.max(confidence, 88);
    }
  } else if (bestCategory === 'Plumbing') {
    if (isSeverePlumbing) {
      summary = `Active water leakage or plumbing breakdown detected ${roomText}.`;
      suggestedAction = 'Isolate main supply line if accessible; plumbing maintenance team dispatched immediately.';
      reasoning = `Keywords indicate continuous or severe water leakage (${scores.Plumbing.matches.slice(0, 3).join(', ')}).`;
      confidence = Math.max(confidence, 91);
    } else {
      summary = `Plumbing and water fixture maintenance required ${roomText}.`;
      suggestedAction = 'Check faucet valve, pipe joints, and washbasin trap for seal replacement.';
      reasoning = `Keywords indicate plumbing fixture maintenance (${scores.Plumbing.matches.slice(0, 3).join(', ')}).`;
      confidence = Math.max(confidence, 86);
    }
  } else if (bestCategory === 'Carpentry') {
    summary = `Structural woodwork or furniture repair required ${roomText}.`;
    suggestedAction = 'Inspect hinges, wooden frame integrity, and hardware fittings for repair or replacement.';
    reasoning = `Keywords indicate damaged door, frame, or furniture elements (${scores.Carpentry.matches.slice(0, 3).join(', ')}).`;
    confidence = Math.max(confidence, 89);
  } else {
    summary = `General residential maintenance request logged ${roomText}.`;
    suggestedAction = 'Hostel supervisor will inspect and assign the relevant utility contractor.';
    reasoning = 'Description does not match primary trade keywords; categorized for general maintenance triage.';
    confidence = 75;
  }

  return {
    category: bestCategory,
    priority,
    urgency,
    summary,
    suggestedAction,
    reasoning,
    confidence,
    source: 'local_fallback'
  };
}

/**
 * Main AI Assistant Entry Point:
 * Calls the secure server-side endpoint (/api/maintenance-ai).
 * Never exposes API keys to client JavaScript.
 * Automatically falls back to the intelligent local classifier on failure.
 */
export async function analyzeMaintenanceWithAI(
  description: string,
  room?: string,
  block?: string
): Promise<SmartMaintenanceAIResult> {
  const cleanDesc = description.trim();
  if (!cleanDesc) {
    return classifyTicketLocally(description, room);
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 6000);

    const response = await fetch('/api/maintenance-ai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        description: cleanDesc,
        room: room || '204',
        block: block || 'Block A'
      }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      const data = await response.json();
      const validCategories: TicketCategory[] = ['Electrical', 'Plumbing', 'Carpentry', 'Other'];
      const validPriorities: TicketPriority[] = ['Low', 'Medium', 'High', 'Urgent'];
      const validUrgencies: Array<'Low' | 'Medium' | 'High'> = ['Low', 'Medium', 'High'];

      if (
        data &&
        validCategories.includes(data.category) &&
        validPriorities.includes(data.priority)
      ) {
        return {
          category: data.category,
          priority: data.priority,
          urgency: validUrgencies.includes(data.urgency) ? data.urgency : 'Medium',
          summary: data.summary || `${data.category} issue reported.`,
          suggestedAction: data.suggestedAction || 'Warden dispatch required for physical assessment.',
          reasoning: data.reasoning || `Detected markers aligning with ${data.category.toLowerCase()} maintenance.`,
          confidence: Math.min(98, Math.max(50, Number(data.confidence) || 90)),
          source: data.source === 'gemini' ? 'gemini' : 'local_fallback'
        };
      }
    }
  } catch (err) {
    // Network failure, timeout, or server unavailable - graceful degradation
    console.info('API triage unavailable, executing local Smart Maintenance classification:', err);
  }

  // Graceful rule-based local classification fallback
  return classifyTicketLocally(cleanDesc, room);
}

/**
 * Backward-compatible helper for legacy components
 */
export function classifyTicketText(text: string): AIClassificationResult {
  const res = classifyTicketLocally(text);
  return {
    category: res.category,
    priority: res.priority,
    confidence: res.confidence,
    reasoning: res.reasoning,
    matchedKeywords: []
  };
}
