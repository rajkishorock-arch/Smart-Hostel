import { TicketCategory, TicketPriority, SmartMaintenanceAIResult } from '../types';

export type { SmartMaintenanceAIResult };

export interface AIClassificationResult {
  category: TicketCategory;
  priority: TicketPriority;
  confidence: number;
  reasoning: string;
  matchedKeywords: string[];
  safetyAlert?: string;
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
    urgencyTriggers: ['burning smell', 'smoke', 'spark', 'sparking', 'shock', 'short circuit', 'fire', 'exposed wire']
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
  Cleaning: {
    primary: [
      'trash', 'dustbin', 'garbage', 'dirty', 'mop', 'sweep', 'dust', 'stain',
      'spill', 'washroom dirty', 'corridor dirty', 'litter', 'foul smell', 'sanitation',
      'clean', 'cleaning', 'pest', 'cockroach', 'insects', 'bedbug', 'rat', 'rodent'
    ],
    secondary: ['messy', 'smelly', 'unhygienic', 'bad odor', 'infestation'],
    urgencyTriggers: ['biohazard', 'overflowing garbage', 'severe dirt', 'severe infestation']
  },
  Infrastructure: {
    primary: [
      'wall', 'ceiling', 'plaster', 'paint', 'cracking', 'crack', 'seepage',
      'dampness', 'window pane', 'glass pane', 'tile', 'flooring', 'roof',
      'staircase', 'railing', 'balcony', 'lift', 'elevator', 'water tank', 'corridor'
    ],
    secondary: ['peeling', 'chipped', 'loose tile', 'damp', 'crevice'],
    urgencyTriggers: ['ceiling collapse', 'falling plaster', 'broken railing', 'structural crack', 'lift stuck']
  },
  Other: {
    primary: [
      'mirror', 'curtain', 'mattress', 'pillow', 'blanket', 'white wash',
      'mosquito net', 'notice board', 'bell'
    ],
    secondary: ['stain', 'general', 'facility'],
    urgencyTriggers: ['hazardous', 'snake']
  }
};

const SAFETY_CRITICAL_TRIGGERS = [
  'spark', 'sparking', 'exposed wire', 'smoke', 'gas smell', 'gas leak',
  'burning smell', 'electrical burning', 'fire', 'shock', 'electric shock',
  'short circuit', 'flooding', 'burst pipe', 'pipe burst', 'ceiling collapse', 'lift stuck'
];

const HIGH_PRIORITY_TERMS = [
  'urgent', 'emergency', 'immediately', 'danger', 'burning', 'spark',
  'shock', 'flood', 'continuous', 'severe', 'critical'
];

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

  // 1. Safety Critical Check
  let safetyAlert: string | undefined = undefined;
  let safeGuidance: string = 'Do not attempt hazardous repairs yourself. An authorized technician will inspect the premises.';
  const isSafetyCritical = SAFETY_CRITICAL_TRIGGERS.some(trigger => normalized.includes(trigger));

  if (isSafetyCritical) {
    if (normalized.includes('gas smell') || normalized.includes('gas leak')) {
      safetyAlert = '⚠️ GAS HAZARD DETECTED: Move away from the source immediately and follow hostel emergency evacuation procedure.';
      safeGuidance = 'Move away from the source immediately, avoid using switches or open flames, and follow hostel emergency procedure.';
    } else if (normalized.includes('spark') || normalized.includes('exposed wire')) {
      safetyAlert = '⚠️ ELECTRICAL SPARK HAZARD: Avoid touching exposed electrical components and contact hostel maintenance.';
      safeGuidance = 'Avoid touching exposed electrical components, keep clear of the fixture, switch off room breaker if accessible, and contact hostel maintenance.';
    } else if (normalized.includes('smoke') || normalized.includes('burning smell') || normalized.includes('electrical burning') || normalized.includes('fire')) {
      safetyAlert = '⚠️ SMOKE / BURNING DETECTED: Move away from the hazard and contact hostel emergency/maintenance support.';
      safeGuidance = 'Move away from the hazard immediately, alert nearby residents, and contact hostel emergency/maintenance support.';
    } else if (normalized.includes('flood') || normalized.includes('burst pipe')) {
      safetyAlert = '⚠️ FLOODING ALERT: Avoid electrical contact and report immediately.';
      safeGuidance = 'Avoid electrical contact with standing water, keep electrical equipment off the floor, shut off nearest isolation valve if safe, and report immediately.';
    } else {
      safetyAlert = '⚠️ CRITICAL SAFETY NOTICE: Maintain safe distance. Do NOT attempt repairs yourself. Warden Desk notified for emergency dispatch.';
      safeGuidance = 'Maintain safe distance and follow instructions from hostel administration staff.';
    }
  }

  const scores: Record<TicketCategory, { score: number; matches: string[] }> = {
    Electrical: { score: 0, matches: [] },
    Plumbing: { score: 0, matches: [] },
    Carpentry: { score: 0, matches: [] },
    Cleaning: { score: 0, matches: [] },
    Infrastructure: { score: 0, matches: [] },
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

  const matchedKeywords = Array.from(new Set(scores[bestCategory].matches));

  // Determine Priority
  let priority: TicketPriority = 'Low';
  let urgency: 'Low' | 'Medium' | 'High' = 'Low';

  if (isSafetyCritical) {
    priority = 'Critical';
    urgency = 'High';
  } else {
    const matchedUrgentTriggers = CATEGORY_RULES[bestCategory].urgencyTriggers.filter(t =>
      normalized.includes(t)
    );
    const hasHighPriorityWord = HIGH_PRIORITY_TERMS.some(t => normalized.includes(t));

    if (matchedUrgentTriggers.length > 0) {
      priority = 'Critical';
      urgency = 'High';
    } else if (hasHighPriorityWord || maxScore >= 6) {
      priority = 'High';
      urgency = 'High';
    } else if (maxScore >= 3) {
      priority = 'Medium';
      urgency = 'Medium';
    } else {
      priority = 'Low';
      urgency = 'Low';
    }
  }

  // Base confidence calculation
  let confidence = Math.min(96, Math.max(55, Math.round(55 + maxScore * 7)));
  if (matchedKeywords.length === 0) confidence = 50;

  // Department mapping
  const departmentMap: Record<TicketCategory, string> = {
    Electrical: 'Electrical Maintenance Division',
    Plumbing: 'Plumbing & Water Services Team',
    Carpentry: 'Carpentry & Joinery Workshop',
    Cleaning: 'Housekeeping & Sanitation Unit',
    Infrastructure: 'Civil Maintenance & Structural Works',
    Other: 'Campus Facility Administration'
  };

  const recommendedDepartment = departmentMap[bestCategory] || 'Campus Facility Administration';

  // Operational Action Suggestions
  let suggestedAction = 'Physical assessment by hostel maintenance team.';
  if (isSafetyCritical) {
    suggestedAction = 'Emergency dispatch: duty technician dispatched within 30 minutes.';
  } else if (bestCategory === 'Electrical') {
    suggestedAction = 'Licensed campus electrician scheduled for room inspection.';
  } else if (bestCategory === 'Plumbing') {
    suggestedAction = 'Sanitary plumber assigned for fixture repair/clearing.';
  } else if (bestCategory === 'Carpentry') {
    suggestedAction = 'Campus carpenter assigned for hardware realignment/replacement.';
  } else if (bestCategory === 'Cleaning') {
    suggestedAction = 'Housekeeping staff dispatched for sanitation and cleanup.';
  } else if (bestCategory === 'Infrastructure') {
    suggestedAction = 'Estate civil maintenance team notified for physical inspection.';
  }

  const reasoning = matchedKeywords.length > 0
    ? `Identified key markers: [${matchedKeywords.slice(0, 3).join(', ')}] indicative of ${bestCategory.toLowerCase()} maintenance.`
    : `General issue description. Defaulting to ${bestCategory} based on standard facilities matrix.`;

  const summary = `${bestCategory} issue in Room ${room || 'unit'}: ${normalized.slice(0, 60)}${normalized.length > 60 ? '...' : ''}`;

  return {
    category: bestCategory,
    priority,
    urgency,
    summary,
    suggestedAction,
    reasoning,
    confidence,
    safetyAlert,
    safetyFlag: isSafetyCritical || priority === 'Critical',
    safeGuidance,
    recommendedDepartment,
    source: 'local_fallback'
  };
}

/**
 * Main AI Assistant Entry Point:
 * Calls the secure server-side endpoint (/api/maintenance-ai).
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
      const validCategories: TicketCategory[] = [
        'Electrical',
        'Plumbing',
        'Carpentry',
        'Cleaning',
        'Infrastructure',
        'Other'
      ];
      const validPriorities: TicketPriority[] = ['Critical', 'High', 'Medium', 'Low', 'Urgent'];

      if (
        data &&
        validCategories.includes(data.category) &&
        validPriorities.includes(data.priority)
      ) {
        // Normalize Urgent -> Critical if returned
        const priority: TicketPriority = data.priority === 'Urgent' ? 'Critical' : data.priority;
        return {
          category: data.category,
          priority,
          urgency: data.urgency || 'Medium',
          summary: data.summary || `${data.category} issue reported.`,
          suggestedAction: data.suggestedAction || 'Warden dispatch required for physical assessment.',
          reasoning: data.reasoning || `Detected markers aligning with ${data.category.toLowerCase()} maintenance.`,
          confidence: Math.min(98, Math.max(50, Number(data.confidence) || 90)),
          safetyAlert: data.safetyAlert,
          safetyFlag: data.safetyFlag ?? (priority === 'Critical' || !!data.safetyAlert),
          safeGuidance: data.safeGuidance || (priority === 'Critical' ? 'Avoid touching hazard and contact hostel administration immediately.' : 'Do not attempt repairs yourself.'),
          recommendedDepartment: data.recommendedDepartment,
          source: data.source === 'gemini' ? 'gemini' : 'local_fallback'
        };
      }
    }
  } catch (err) {
    console.info('API triage unavailable, executing local Smart Maintenance classification:', err);
  }

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
    matchedKeywords: [],
    safetyAlert: res.safetyAlert
  };
}
