export type UserRole = 'resident' | 'warden';

export interface UserProfile {
  uid: string;
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
  source?: 'gemini' | 'local_fallback';
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
