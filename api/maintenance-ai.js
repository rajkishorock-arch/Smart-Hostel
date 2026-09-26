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
    return res.status(400).json({ error: 'Maintenance description is required (min 3 characters).' });
  }

  if (text.length > 500) {
    return res.status(400).json({ error: 'Maintenance description exceeds maximum allowed length of 500 characters.' });
  }

  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const prompt = `You are a professional maintenance triage assistant for a university hostel system.
Classify the resident's issue description into exactly ONE category:
Electrical, Plumbing, Carpentry, Cleaning, Infrastructure, Other.

Determine priority: Critical, High, Medium, Low.
Safety Instruction: For dangerous hazards (sparks, exposed wire, smoke, gas smell, electrical burning, flooding, collapse), provide an immediate safety instruction alert, set safetyFlag to true, provide safe immediate guidance, and set priority to Critical.

Return concise structured JSON only.

Required JSON fields:
- category: exactly one of "Electrical", "Plumbing", "Carpentry", "Cleaning", "Infrastructure", "Other"
- priority: exactly one of "Critical", "High", "Medium", "Low"
- urgency: exactly one of "High", "Medium", "Low"
- summary: concise factual summary
- recommendedDepartment: e.g. "Electrical Maintenance Division", "Plumbing & Water Services Team", etc.
- safetyFlag: boolean
- safeGuidance: safe immediate advisory for resident (never provide dangerous DIY repair steps)
- suggestedAction: operational action for staff/technician
- reasoning: why this category and priority were selected
- confidence: integer percentage 60 to 98
- safetyAlert: (optional string if hazard detected)

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
          const validCategories = ['Electrical', 'Plumbing', 'Carpentry', 'Cleaning', 'Infrastructure', 'Other'];
          const validPriorities = ['Critical', 'High', 'Medium', 'Low', 'Urgent'];

          const category = validCategories.includes(parsed.category) ? parsed.category : 'Other';
          let priority = validPriorities.includes(parsed.priority) ? parsed.priority : 'Medium';
          if (priority === 'Urgent') priority = 'Critical';

          const departmentMap = {
            Electrical: 'Electrical Maintenance Division',
            Plumbing: 'Plumbing & Water Services Team',
            Carpentry: 'Carpentry & Joinery Workshop',
            Cleaning: 'Housekeeping & Sanitation Unit',
            Infrastructure: 'Civil Maintenance & Structural Works',
            Other: 'Campus Facility Administration'
          };

          return res.status(200).json({
            category,
            priority,
            urgency: parsed.urgency || 'Medium',
            summary: parsed.summary || `${category} issue reported in Room ${room || 'unit'}.`,
            recommendedDepartment: parsed.recommendedDepartment || departmentMap[category],
            safetyFlag: parsed.safetyFlag ?? (priority === 'Critical' || !!parsed.safetyAlert),
            safeGuidance: parsed.safeGuidance || (priority === 'Critical' ? 'Avoid touching hazard and report to hostel office immediately.' : 'Do not attempt repairs yourself.'),
            suggestedAction: parsed.suggestedAction || 'Warden dispatch required for physical assessment.',
            reasoning: parsed.reasoning || `Detected markers aligning with ${category.toLowerCase()} maintenance.`,
            confidence: Math.min(98, Math.max(50, Number(parsed.confidence) || 90)),
            safetyAlert: parsed.safetyAlert,
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

  const isSparking = normalized.includes('spark') || normalized.includes('shock') || normalized.includes('burning') || normalized.includes('fire') || normalized.includes('smoke') || normalized.includes('exposed wire');
  const isFlood = normalized.includes('flood') || normalized.includes('burst') || normalized.includes('overflow');
  const isGas = normalized.includes('gas smell') || normalized.includes('gas leak');
  const isDoorLock = normalized.includes('cannot lock') || normalized.includes('lock jammed');

  let safetyAlert = undefined;
  let safeGuidance = 'Do not attempt hazardous repairs yourself. An authorized technician will inspect the premises.';

  if (isGas) {
    safetyAlert = '⚠️ GAS HAZARD DETECTED: Move away from the source immediately and follow hostel emergency procedure.';
    safeGuidance = 'Move away from the source immediately, avoid using switches or open flames, and follow hostel emergency procedure.';
  } else if (isSparking) {
    safetyAlert = '⚠️ ELECTRICAL SPARK HAZARD: Avoid touching exposed electrical components and contact hostel maintenance.';
    safeGuidance = 'Avoid touching exposed electrical components, turn off room breaker if safe, and contact hostel maintenance.';
  } else if (isFlood) {
    safetyAlert = '⚠️ FLOODING ALERT: Avoid electrical contact and report immediately.';
    safeGuidance = 'Avoid electrical contact with standing water, keep gadgets elevated, and report immediately.';
  }

  // Keyword Matching
  const electricalTerms = ['fan', 'light', 'bulb', 'switch', 'socket', 'wire', 'wiring', 'spark', 'current', 'shock', 'ac', 'cooler', 'geyser', 'heater', 'power', 'blackout', 'fuse', 'mcb'];
  const plumbingTerms = ['tap', 'faucet', 'leak', 'leaking', 'water', 'pipe', 'drain', 'toilet', 'flush', 'sink', 'basin', 'shower', 'choke', 'clogged'];
  const carpentryTerms = ['door', 'lock', 'window', 'table', 'chair', 'desk', 'bed', 'cupboard', 'almirah', 'drawer', 'hinge', 'latch', 'handle'];
  const cleaningTerms = ['trash', 'garbage', 'dirty', 'mop', 'sweep', 'dust', 'stain', 'cockroach', 'pest', 'insects', 'bedbug', 'rat', 'foul smell'];
  const infraTerms = ['wall', 'ceiling', 'plaster', 'paint', 'cracking', 'crack', 'seepage', 'tile', 'roof', 'lift', 'elevator', 'staircase'];

  let category = 'Other';
  let matched = [];

  if (electricalTerms.some(t => { if (normalized.includes(t)) { matched.push(t); return true; } return false; })) {
    category = 'Electrical';
  } else if (plumbingTerms.some(t => { if (normalized.includes(t)) { matched.push(t); return true; } return false; })) {
    category = 'Plumbing';
  } else if (carpentryTerms.some(t => { if (normalized.includes(t)) { matched.push(t); return true; } return false; })) {
    category = 'Carpentry';
  } else if (cleaningTerms.some(t => { if (normalized.includes(t)) { matched.push(t); return true; } return false; })) {
    category = 'Cleaning';
  } else if (infraTerms.some(t => { if (normalized.includes(t)) { matched.push(t); return true; } return false; })) {
    category = 'Infrastructure';
  }

  let priority = 'Medium';
  let urgency = 'Medium';

  if (isSparking || isFlood || isGas) {
    priority = 'Critical';
    urgency = 'High';
  } else if (isDoorLock || normalized.includes('urgent') || normalized.includes('emergency')) {
    priority = 'High';
    urgency = 'High';
  } else if (category === 'Cleaning') {
    priority = 'Low';
    urgency = 'Low';
  }

  const departmentMap = {
    Electrical: 'Electrical Maintenance Division',
    Plumbing: 'Plumbing & Water Services Team',
    Carpentry: 'Carpentry & Joinery Workshop',
    Cleaning: 'Housekeeping & Sanitation Unit',
    Infrastructure: 'Civil Maintenance & Structural Works',
    Other: 'Campus Facility Administration'
  };

  return {
    category,
    priority,
    urgency,
    summary: `${category} maintenance inquiry for Room ${room || 'General Quarters'} (${block || 'Hostel Block'}).`,
    recommendedDepartment: departmentMap[category] || 'Campus Facility Administration',
    safetyFlag: priority === 'Critical' || !!safetyAlert,
    safeGuidance,
    suggestedAction: priority === 'Critical' ? 'Immediate technician dispatch required.' : 'Schedule physical evaluation.',
    reasoning: matched.length > 0 ? `Detected keywords [${matched.slice(0, 3).join(', ')}]` : 'Classified based on campus facilities routing matrix.',
    confidence: matched.length > 0 ? 88 : 65,
    safetyAlert
  };
}
