export type UserRole = 'resident' | 'warden';

export interface UserProfile {
  uid: string;
  id?: string;
  email: string;
  name: string;
  role: UserRole;
  phone: string;
  hostel: string;
  block: string;
  roomNumber: string;
  bedNumber: string;
  createdAt: string;
  status?: string;
  updatedAt?: string;
  parentPhone?: string;
  bloodGroup?: string;
  emergencyContact?: string;
}

export type TicketCategory =
  | 'Electrical'
  | 'Plumbing'
  | 'Carpentry'
  | 'Cleaning'
  | 'Infrastructure'
  | 'Other';

export type TicketPriority = 'Critical' | 'High' | 'Medium' | 'Low' | 'Urgent';

export type TicketStatus =
  | 'Open'
  | 'AI Classified'
  | 'Assigned'
  | 'In Progress'
  | 'Resolved';

export interface TicketTimelineEvent {
  status: TicketStatus;
  timestamp: string;
  note?: string;
  updatedBy?: string;
}

export interface SmartMaintenanceAIResult {
  category: TicketCategory;
  priority: TicketPriority;
  urgency: 'Low' | 'Medium' | 'High';
  summary: string;
  suggestedAction: string;
  reasoning: string;
  confidence: number;
  safetyAlert?: string;
  recommendedDepartment?: string;
  safetyFlag?: boolean;
  safeGuidance?: string;
  source?: 'gemini' | 'local_fallback';
}

export interface RepeatedIssueSummary {
  room: string;
  block?: string;
  category: TicketCategory;
  count: number;
  recentDates: string[];
  currentUnresolvedTicket?: Ticket;
}

export interface OperationalPriorityItem {
  id: string;
  type: 'critical_ticket' | 'high_ticket' | 'unallocated_resident' | 'repeated_issue' | 'operational_pending';
  priority: 'Critical' | 'High' | 'Normal' | 'Info';
  title: string;
  reason: string;
  link: string;
  timestamp: string;
}

export interface Ticket {
  id: string;
  residentId: string;
  residentName: string;
  title?: string;
  room: string;
  roomNumber?: string;
  block: string;
  category: TicketCategory;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  aiClassified?: boolean;
  aiConfidence?: number;
  aiSuggestedCategory?: TicketCategory;
  aiSuggestedPriority?: TicketPriority;
  aiUrgency?: 'Low' | 'Medium' | 'High';
  aiSummary?: string;
  aiSuggestedAction?: string;
  aiReasoning?: string;
  safetyAlert?: string;
  safetyFlag?: boolean;
  safeGuidance?: string;
  recommendedDepartment?: string;
  wardenNotes?: string;
  resolutionNote?: string;
  assignedTo?: string;
  resolvedAt?: string;
  timeline?: TicketTimelineEvent[];
  createdAt: string;
  updatedAt: string;
}

export interface MealItem {
  items: string;
  timing: string;
}

export interface DayMenu {
  day: string;
  breakfast: MealItem;
  lunch: MealItem;
  snacks: MealItem;
  dinner: MealItem;
  specialNote?: string;
}

export type WeeklyMessMenu = Record<string, DayMenu>;

export interface BedAllocation {
  bedNumber: string;
  residentId?: string;
  residentName?: string;
  studentId?: string;
  isOccupied?: boolean;
}

export interface RoomRecord {
  id: string;
  hostel: string;
  block: string;
  roomNumber: string;
  capacity: number;
  occupied: number;
  beds: BedAllocation[];
  floor: number;
  updatedAt?: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  description?: string;
  category: 'Mess' | 'Hostel' | 'Maintenance' | 'General' | 'Emergency';
  priority?: 'Critical' | 'High' | 'Medium' | 'Low';
  published: boolean;
  createdAt: string;
  updatedAt?: string;
  expiryAt?: string;
  author: string;
}

export interface MealScheduleItem {
  id: string;
  meal: 'Breakfast' | 'Lunch' | 'Snacks' | 'Dinner';
  name: string;
  startTime: string;
  endTime: string;
  status: 'Active' | 'Upcoming' | 'Completed';
  location: string;
}

export interface AppNotification {
  id: string;
  userId?: string;
  targetRole?: 'resident' | 'warden' | 'all';
  title: string;
  message: string;
  type: 'ticket' | 'allocation' | 'notice' | 'mess' | 'system' | 'critical' | 'emergency' | 'success' | 'maintenance';
  priority?: 'Critical' | 'High' | 'Normal' | 'Info';
  link?: string;
  read: boolean;
  createdAt: string;
}

export interface ActivityLog {
  id: string;
  actor: string;
  actorName?: string;
  actorId?: string;
  actorRole?: 'warden' | 'resident' | 'system';
  action: string;
  target: string;
  details?: string;
  timestamp: string;
}

export interface SmartInsight {
  id: string;
  type: 'warning' | 'info' | 'critical' | 'success' | 'positive';
  title: string;
  description: string;
  metric?: string;
  actionLink?: string;
  actionLabel?: string;
  timestamp?: string;
}

export interface Invoice {
  id: string;
  studentUid: string;
  studentName: string;
  studentEmail: string;
  roomNumber?: string;
  term: string; // e.g., "Spring Semester 2026"
  roomFee: number;
  messFee: number;
  amenitiesFee: number;
  totalAmount: number;
  amountPaid: number;
  status: 'Paid' | 'Pending' | 'Overdue';
  dueDate: string;
  paidAt?: string;
  paymentMode?: 'UPI' | 'NetBanking' | 'Card' | 'Cash';
  transactionRef?: string;
  createdAt: string;
}

export interface IoTSensorReading {
  id: string;
  sensorType: 'Electricity Meter' | 'Water Level' | 'PIR Occupancy' | 'Dining RFID';
  location: string;
  currentValue: string | number;
  unit: string;
  status: 'Normal' | 'Warning' | 'Critical';
  lastUpdated: string;
  alertMessage?: string;
}

export interface VendorRecord {
  id: string;
  name: string;
  category: 'Groceries & Provisions' | 'Dairy & Fresh Produce' | 'Plumbing & Hardware' | 'Electrical Supplies' | 'RO & Kitchen Equipment';
  contactPerson: string;
  phone: string;
  email: string;
  rating: number; // 1 to 5
  activeContract: boolean;
  pendingOrdersCount: number;
  lastDeliveryDate: string;
  paymentTerms: string;
}

export interface AutomationWorkflow {
  id: string;
  title: string;
  trigger: string;
  condition: string;
  action: string;
  enabled: boolean;
  runCount: number;
  lastRunAt?: string;
  category: 'Escalation' | 'Billing' | 'Allocation' | 'Maintenance' | 'Security';
}

export interface SecurityThreatAlert {
  id: string;
  threatType: 'Brute Force Attempt' | 'Suspicious IP' | 'Tamper Attempt' | 'Privilege Escalation';
  severity: 'Critical' | 'High' | 'Medium' | 'Low';
  sourceIp: string;
  timestamp: string;
  status: 'Blocked' | 'Investigating' | 'Mitigated';
  details: string;
}

export interface WebhookEndpoint {
  id: string;
  name: string;
  url: string;
  events: string[];
  secretKey: string;
  active: boolean;
  lastDeliveredAt?: string;
  deliverySuccessRate: number; // percentage
}

export interface StudentChurnRisk {
  studentUid: string;
  studentName: string;
  roomNumber: string;
  churnRiskScore: number; // 0-100%
  riskLevel: 'High' | 'Medium' | 'Low';
  riskFactors: string[];
  recommendedIntervention: string;
}

export interface GatePassRequest {
  id: string;
  residentId: string;
  residentName: string;
  studentEmail?: string;
  roomNumber: string;
  bedNumber?: string;
  block?: string;
  leaveType?: 'Local Outing' | 'Home Visit' | 'Emergency' | 'Academic / Event' | string;
  type?: 'day_pass' | 'weekend_leave' | 'emergency_leave' | 'vacation' | string;
  destination?: string;
  departureDate: string;
  departureTime?: string;
  expectedReturnDate: string;
  expectedReturnTime?: string;
  reason: string;
  parentContact?: string;
  parentPhone?: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Checked Out' | 'Completed' | 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  approvedBy?: string;
  reviewRemarks?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface NightAttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  residentId: string;
  residentName: string;
  roomNumber: string;
  bedNumber?: string;
  block?: string;
  status: 'Present' | 'Absent' | 'On Leave' | 'present' | 'absent' | 'on_leave' | 'late' | 'Late';
  remarks?: string;
  markedBy?: string;
  timestamp?: string;
}

export interface RoomChangeRequest {
  id: string;
  residentId: string;
  residentName: string;
  studentEmail?: string;
  currentRoom: string;
  currentBlock?: string;
  currentBed?: string;
  requestedRoom?: string;
  preferredBlock?: string;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'pending' | 'approved' | 'rejected';
  reviewedBy?: string;
  reviewRemarks?: string;
  createdAt: string;
}


