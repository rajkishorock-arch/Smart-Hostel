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
}

export type TicketCategory = 'Electrical' | 'Plumbing' | 'Carpentry' | 'Other';
export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Urgent';
export type TicketStatus = 'Open' | 'In Progress' | 'Resolved';

export interface Ticket {
  id: string;
  residentId: string;
  residentName: string;
  room: string;
  block: string;
  category: TicketCategory;
  description: string;
  priority: TicketPriority;
  status: TicketStatus;
  aiClassified?: boolean;
  aiConfidence?: number;
  aiSuggestedCategory?: TicketCategory;
  aiSuggestedPriority?: TicketPriority;
  wardenNotes?: string;
  resolvedAt?: string;
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
}
