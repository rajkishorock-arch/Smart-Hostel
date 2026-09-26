// Vercel Serverless Function: /api/maintenance-ai
// NOTE: Server-side ONLY. API keys are never exposed to client-side code.

export default async function handler(req, res) {
  // CORS & method check
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { description, room, block } = req.body || {};
  const text = (description || '').trim();

  if (!text || text.length < 3) {
    return res.status(400).json({ error: 'Maintenance description is required' });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const prompt = `You are a maintenance triage assistant for a college hostel.
Classify the resident's maintenance description into exactly one category: Electrical, Plumbing, Carpentry, Other.
Determine priority and urgency based only on the described issue.
Return concise structured JSON only, with no markdown code fences or conversational text.

Safety Rule: Do not provide repair instructions to residents. For potentially dangerous electrical, fire, gas or water situations, recommend contacting hostel maintenance/warden. Do not invent facts.

Required JSON fields:
- category: exactly one of "Electrical", "Plumbing", "Carpentry", "Other"
- priority: exactly one of "Low", "Medium", "High", "Urgent"
- urgency: exactly one of "Low", "Medium", "High"
- summary: one-sentence factual summary of the issue
- suggestedAction: safe operational action for maintenance staff/resident
- reasoning: short explanation of why this category and priority were selected
- confidence: integer confidence percentage between 50 and 98

Context: Room ${room || 'General Quarters'}, ${block || 'Hostel Block'}.
Issue Description: "${text}"`;

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: {
              temperature: 0.1,
              responseMimeType: 'application/json'
            }
          })
        }
      );

      if (response.ok) {
        const data = await response.json();
        const rawContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (rawContent) {
          const parsed = JSON.parse(rawContent);
          const validCategories = ['Electrical', 'Plumbing', 'Carpentry', 'Other'];
          const validPriorities = ['Low', 'Medium', 'High', 'Urgent'];
          const validUrgencies = ['Low', 'Medium', 'High'];

          const category = validCategories.includes(parsed.category) ? parsed.category : 'Other';
          const priority = validPriorities.includes(parsed.priority) ? parsed.priority : 'Medium';
          const urgency = validUrgencies.includes(parsed.urgency) ? parsed.urgency : 'Medium';

          return res.status(200).json({
            category,
            priority,
            urgency,
            summary: parsed.summary || `${category} issue reported in Room ${room || 'unit'}.`,
            suggestedAction: parsed.suggestedAction || 'Warden dispatch required for physical assessment.',
            reasoning: parsed.reasoning || `Detected markers aligning with ${category.toLowerCase()} maintenance.`,
            confidence: Math.min(98, Math.max(50, Number(parsed.confidence) || 90)),
            source: 'gemini'
          });
        }
      }
    } catch (err) {
      console.warn('Gemini API call failed, using graceful server fallback:', err.message);
    }
  }

  // Graceful rule-based intelligent fallback
  const fallback = computeFallbackClassification(text, room, block);
  return res.status(200).json({
    ...fallback,
    source: 'local_fallback',
    note: 'AI unavailable — using Smart Classification fallback.'
  });
}

function computeFallbackClassification(text, room, block) {
  const normalized = text.toLowerCase();

  const isSparking = normalized.includes('spark') || normalized.includes('shock') || normalized.includes('burning') || normalized.includes('fire') || normalized.includes('smoke');
  const isFlood = normalized.includes('flood') || normalized.includes('burst') || normalized.includes('overflow');
  const isDoorLock = normalized.includes('cannot lock') || normalized.includes('lock jammed');

  let category = 'Other';
  let priority = 'Medium';
  let urgency = 'Medium';
  let summary = 'General maintenance inspection logged.';
  let suggestedAction = 'Hostel supervisor assigned for initial evaluation.';
  let reasoning = 'General maintenance query assigned standard triage.';
  let confidence = 85;

  if (
    normalized.includes('fan') ||
    normalized.includes('light') ||
    normalized.includes('switch') ||
    normalized.includes('socket') ||
    normalized.includes('wire') ||
    normalized.includes('flicker') ||
    normalized.includes('power') ||
    normalized.includes('tube') ||
    normalized.includes('ac') ||
    normalized.includes('geyser') ||
    isSparking
  ) {
    category = 'Electrical';
    if (isSparking) {
      priority = 'Urgent';
      urgency = 'High';
      summary = 'Urgent electrical hazard (sparking/short-circuit) reported.';
      suggestedAction = 'Keep room switchboard isolated. Dispatched electrician immediately for emergency inspection.';
      reasoning = 'Severe electrical hazard terms (sparking/burning/shock) trigger Urgent priority.';
      confidence = 96;
    } else {
      priority = normalized.includes('stop') || normalized.includes('noise') ? 'High' : 'Medium';
      urgency = priority === 'High' ? 'High' : 'Medium';
      summary = 'Electrical appliance or fixture malfunction detected.';
      suggestedAction = 'Inspect electrical supply, switch connection, and motor/ballast units.';
      reasoning = 'Keywords indicate an electrical appliance or wiring malfunction.';
      confidence = 92;
    }
  } else if (
    normalized.includes('tap') ||
    normalized.includes('leak') ||
    normalized.includes('pipe') ||
    normalized.includes('flush') ||
    normalized.includes('water') ||
    normalized.includes('drain') ||
    normalized.includes('sink') ||
    normalized.includes('toilet') ||
    normalized.includes('washbasin') ||
    isFlood
  ) {
    category = 'Plumbing';
    if (isFlood) {
      priority = 'Urgent';
      urgency = 'High';
      summary = 'Severe plumbing emergency with water flooding or pipe rupture.';
      suggestedAction = 'Isolate main corridor water valve immediately and deploy plumbing emergency team.';
      reasoning = 'Water flooding and pipe rupture trigger urgent emergency intervention.';
      confidence = 95;
    } else {
      const isContinuous = normalized.includes('continuous') || normalized.includes('severe');
      priority = isContinuous ? 'High' : 'Medium';
      urgency = isContinuous ? 'High' : 'Medium';
      summary = 'Bathroom or washbasin plumbing leakage detected.';
      suggestedAction = 'Check faucet washers, pipe seals, and drainage traps.';
      reasoning = 'Keywords describing leaking tap and water drainage indicate a plumbing issue.';
      confidence = 91;
    }
  } else if (
    normalized.includes('door') ||
    normalized.includes('hinge') ||
    normalized.includes('window') ||
    normalized.includes('bed') ||
    normalized.includes('table') ||
    normalized.includes('chair') ||
    normalized.includes('lock') ||
    normalized.includes('cupboard') ||
    normalized.includes('almirah') ||
    normalized.includes('frame')
  ) {
    category = 'Carpentry';
    if (isDoorLock) {
      priority = 'Urgent';
      urgency = 'High';
      summary = 'Room door lock compromise requiring urgent security attention.';
      suggestedAction = 'Dispatch carpenter to repair or replace latch and lock cylinder immediately.';
      reasoning = 'Door locking issues compromise room security and require urgent priority.';
      confidence = 93;
    } else {
      priority = 'Medium';
      urgency = 'Medium';
      summary = 'Damaged woodwork, door fixture, or residential furniture.';
      suggestedAction = 'Realign hinges, replace damaged wooden frames, and tighten hardware.';
      reasoning = 'Keywords describing door hinges, frames, or furniture indicate carpentry maintenance.';
      confidence = 90;
    }
  }

  return {
    category,
    priority,
    urgency,
    summary,
    suggestedAction,
    reasoning,
    confidence
  };
}
