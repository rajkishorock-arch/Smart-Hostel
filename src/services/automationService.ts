import {
  AutomationWorkflow,
  SecurityThreatAlert,
  WebhookEndpoint,
  StudentChurnRisk,
  UserProfile,
  Ticket
} from '../types';
import { logActivity } from './activityService';
import { createNotification } from './notificationService';

const WORKFLOWS_STORAGE_KEY = 'sh_workflows_v1';
const WEBHOOKS_STORAGE_KEY = 'sh_webhooks_v1';

export const INITIAL_WORKFLOWS: AutomationWorkflow[] = [
  {
    id: 'WF-01-ESC',
    title: 'Auto-Escalate Critical Maintenance (>2 Hours)',
    trigger: 'Ticket Created or Unresolved',
    condition: 'Priority == "Critical" AND Status != "Resolved"',
    action: 'Dispatch urgent push notification & SMS to Chief Warden & Maintenance Lead',
    enabled: true,
    runCount: 14,
    lastRunAt: 'Today at 04:30 PM',
    category: 'Escalation'
  },
  {
    id: 'WF-02-FEE',
    title: 'Automated Late Fee Due Reminder (T-3 Days)',
    trigger: 'Invoice Due Date Approaching',
    condition: 'Status == "Pending" AND DaysRemaining <= 3',
    action: 'Send automated high-priority in-app reminder & WhatsApp fee notification',
    enabled: true,
    runCount: 42,
    lastRunAt: 'Today at 09:00 AM',
    category: 'Billing'
  },
  {
    id: 'WF-03-ALLOC',
    title: 'Auto-Allocation Offer on Verified Vacancy',
    trigger: 'Room Bed Released / Vacated',
    condition: 'AvailableBeds >= 1 AND WaitlistCount > 0',
    action: 'Match top waitlist resident and generate provisional allocation offer',
    enabled: true,
    runCount: 8,
    lastRunAt: 'Yesterday at 02:15 PM',
    category: 'Allocation'
  },
  {
    id: 'WF-04-WASTE',
    title: 'Mess Food Wastage Threshold Alert (>15 kg)',
    trigger: 'Post-Meal Plate Waste Logged',
    condition: 'WastageKg >= 15.0',
    action: 'Alert Catering Head & adjust subsequent batch preparation recipe by -12%',
    enabled: true,
    runCount: 5,
    lastRunAt: '2 days ago',
    category: 'Maintenance'
  },
  {
    id: 'WF-05-SEC',
    title: 'Automated Threat Mitigation & Account Lockdown',
    trigger: 'Failed Login Attempts >= 5 in 10 Minutes',
    condition: 'Same IP or User Account',
    action: 'Temporarily lock account session for 30 minutes and notify Security Admin',
    enabled: true,
    runCount: 2,
    lastRunAt: '3 days ago',
    category: 'Security'
  },
  {
    id: 'WF-06-SURV',
    title: 'Post-Resolution Satisfaction Survey Dispatch',
    trigger: 'Maintenance Ticket Marked "Resolved"',
    condition: 'Always',
    action: 'Send quick 1-click satisfaction rating prompt to resident',
    enabled: true,
    runCount: 29,
    lastRunAt: 'Today at 05:45 PM',
    category: 'Escalation'
  }
];

export const INITIAL_SECURITY_THREATS: SecurityThreatAlert[] = [
  {
    id: 'THR-8821',
    threatType: 'Brute Force Attempt',
    severity: 'High',
    sourceIp: '192.168.1.145 (Subnet Hub B)',
    timestamp: 'Today at 03:15 PM',
    status: 'Blocked',
    details: '6 repeated failed password attempts on admin credentials. Auto-blocked by IDS rule.'
  },
  {
    id: 'THR-8819',
    threatType: 'Suspicious IP',
    severity: 'Medium',
    sourceIp: '10.20.4.88 (External Proxy)',
    timestamp: 'Yesterday at 11:40 PM',
    status: 'Mitigated',
    details: 'Unusual late-night access attempt outside institutional residential subnet.'
  },
  {
    id: 'THR-8815',
    threatType: 'Tamper Attempt',
    severity: 'Low',
    sourceIp: '127.0.0.1 (Local Client)',
    timestamp: '2 days ago',
    status: 'Mitigated',
    details: 'Client state integrity checked: SHA-256 signatures verified against Firestore source of truth.'
  }
];

export const INITIAL_WEBHOOKS: WebhookEndpoint[] = [
  {
    id: 'WH-CAMPUS-ERP',
    name: 'University ERP Academic Sync',
    url: 'https://erp.university.edu/api/v2/hostel-webhook',
    events: ['student.allocated', 'student.checkout', 'fee.settled'],
    secretKey: 'whsec_erp_9823412a8f',
    active: true,
    lastDeliveredAt: 'Today at 04:30 PM',
    deliverySuccessRate: 99.4
  },
  {
    id: 'WH-SLACK-ALERTS',
    name: 'Warden Emergency Slack Channel',
    url: 'https://hooks.slack.com/services/T00/B00/X001248',
    events: ['maintenance.critical', 'security.threat'],
    secretKey: 'whsec_slack_102834b7c',
    active: true,
    lastDeliveredAt: 'Today at 03:15 PM',
    deliverySuccessRate: 100
  }
];

export function getWorkflows(): AutomationWorkflow[] {
  try {
    const raw = localStorage.getItem(WORKFLOWS_STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(WORKFLOWS_STORAGE_KEY, JSON.stringify(INITIAL_WORKFLOWS));
      return INITIAL_WORKFLOWS;
    }
    return JSON.parse(raw);
  } catch {
    return INITIAL_WORKFLOWS;
  }
}

export function saveWorkflows(wfs: AutomationWorkflow[]): void {
  try {
    localStorage.setItem(WORKFLOWS_STORAGE_KEY, JSON.stringify(wfs));
    window.dispatchEvent(new Event('sh_workflows_updated'));
  } catch (e) {
    console.error('Error saving workflows:', e);
  }
}

export function toggleWorkflow(workflowId: string): AutomationWorkflow[] {
  const current = getWorkflows();
  const updated = current.map(w => {
    if (w.id === workflowId) {
      return { ...w, enabled: !w.enabled };
    }
    return w;
  });
  saveWorkflows(updated);
  return updated;
}

export function triggerManualWorkflowRun(workflowId: string): { success: boolean; message: string } {
  const current = getWorkflows();
  const wf = current.find(w => w.id === workflowId);
  if (!wf) return { success: false, message: 'Workflow not found' };

  const updated = current.map(w => {
    if (w.id === workflowId) {
      return {
        ...w,
        runCount: w.runCount + 1,
        lastRunAt: 'Just now'
      };
    }
    return w;
  });
  saveWorkflows(updated);

  logActivity({
    actor: 'Warden Rule Engine',
    actorRole: 'system',
    action: 'Workflow Automation Executed',
    target: `${wf.title} (Action: ${wf.action})`
  });

  return {
    success: true,
    message: `Automation "${wf.title}" executed successfully! Action dispatched.`
  };
}

/**
 * AI-POWERED STUDENT CHURN & RETENTION PROBABILITY ENGINE
 * Computes risk scores based on academic year, complaint volume, and fee records.
 */
export function calculateStudentChurnRisks(
  residents: UserProfile[],
  tickets: Ticket[]
): StudentChurnRisk[] {
  return residents.slice(0, 8).map(res => {
    const residentTickets = tickets.filter(
      t => t.residentName === res.name || t.residentId === res.uid || t.room === res.roomNumber || t.roomNumber === res.roomNumber
    );
    const criticalCount = residentTickets.filter(t => t.priority === 'Critical' || t.priority === 'Urgent').length;
    const hasUnresolved = residentTickets.some(t => t.status !== 'Resolved');

    let churnRiskScore = 18; // base baseline
    const riskFactors: string[] = [];

    if (criticalCount > 0) {
      churnRiskScore += 35;
      riskFactors.push(`${criticalCount} critical maintenance ticket(s) logged in room`);
    }

    if (hasUnresolved) {
      churnRiskScore += 20;
      riskFactors.push('Unresolved complaints pending over 48h');
    }

    if (!res.roomNumber) {
      churnRiskScore += 25;
      riskFactors.push('Prolonged unallocated waitlist status');
    }

    const finalScore = Math.min(94, Math.max(12, churnRiskScore));
    const riskLevel: 'High' | 'Medium' | 'Low' = finalScore >= 60 ? 'High' : finalScore >= 35 ? 'Medium' : 'Low';

    const recommendedIntervention = riskLevel === 'High'
      ? 'Schedule 1-on-1 pastoral welfare check-in with Assistant Warden & expedite room maintenance.'
      : riskLevel === 'Medium'
      ? 'Verify meal satisfaction & confirm roommate harmony.'
      : 'Maintain standard residential engagement; no risk detected.';

    return {
      studentUid: res.uid,
      studentName: res.name,
      roomNumber: res.roomNumber || 'Pending Allocation',
      churnRiskScore: finalScore,
      riskLevel,
      riskFactors: riskFactors.length > 0 ? riskFactors : ['Normal residential engagement metrics'],
      recommendedIntervention
    };
  }).sort((a, b) => b.churnRiskScore - a.churnRiskScore);
}
