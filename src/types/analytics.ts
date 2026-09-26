export interface OccupancyForecast {
  daysAhead: 30 | 60 | 90;
  currentOccupancyRate: number; // percentage (e.g. 88.5)
  projectedOccupancyRate: number; // percentage
  projectedCheckouts: number;
  projectedNewAdmissions: number;
  netVacantBeds: number;
  peakDemandPeriod: string;
  confidenceScore: number; // percentage (e.g. 91)
  recommendation: string;
  floorTrends: {
    floor: string;
    currentOccupied: number;
    forecastOccupied: number;
    capacity: number;
  }[];
}

export interface MaintenanceFailureForecast {
  assetId: string;
  assetName: string;
  category: 'Electrical' | 'Plumbing' | 'HVAC' | 'Structural' | 'Appliance';
  location: string;
  lifespanMonthsTotal: number;
  monthsInService: number;
  wearPercentage: number;
  failureRiskLevel: 'Low' | 'Moderate' | 'High' | 'Critical';
  predictedFailureWindow: string; // e.g., "15 - 30 days"
  recommendedAction: string;
  estimatedPreventiveCost: number; // in INR
  estimatedEmergencyCost: number; // in INR
  seasonalAlert?: string;
}

export interface MessDemandForecast {
  date: string;
  dayOfWeek: string;
  meal: 'Breakfast' | 'Lunch' | 'Dinner';
  projectedAttendance: number; // students count
  totalEnrolledResidents: number;
  attendanceRate: number; // %
  projectedFoodPrepKg: number;
  estimatedWastageKg: number;
  potentialCostSavingsINR: number;
  demandFactor: 'Normal' | 'Weekend Drop' | 'Exam Surge' | 'Holiday Dip';
  dietarySplit: {
    vegetarian: number;
    nonVegetarian: number;
    jainOrSpecial: number;
  };
}

export interface FinancialAnalyticsSummary {
  period: string;
  currency: string;
  totalRevenue: number;
  roomFeeRevenue: number;
  messFeeRevenue: number;
  ancillaryRevenue: number;
  totalExpenses: number;
  maintenanceExpenses: number;
  messCateringExpenses: number;
  utilityExpenses: number;
  staffExpenses: number;
  netOperatingSurplus: number;
  collectionRatePercent: number;
  outstandingDues: number;
  unpaidStudentsCount: number;
  costPerOccupiedBed: number;
}

export interface AssetItem {
  id: string;
  name: string;
  category: 'Water & Plumbing' | 'Electrical & Power' | 'Cooling & HVAC' | 'Safety & Elevator' | 'Kitchen & Dining';
  modelOrSpec: string;
  location: string;
  installedDate: string;
  expectedLifespanYears: number;
  conditionScore: number; // 0 - 100
  status: 'Operational' | 'Service Due' | 'Under Repair' | 'Critical';
  lastServiceDate: string;
  nextScheduledService: string;
  assignedTechnician: string;
  technicianContact: string;
  serviceCostHistoryINR: number;
  notes: string;
}

export interface StudentRoomMatchingProfile {
  studentId: string;
  studentName: string;
  branch: string;
  year: number;
  studyHabit: 'Night Owl' | 'Early Bird' | 'Flexible';
  sleepSchedule: 'Late Night' | 'Early Sleeper';
  cleanlinessScore: 'Very High' | 'Moderate' | 'Relaxed';
  roomTypePreference: 'AC' | 'Non-AC';
  floorPreference: 'Ground' | 'First' | 'Second' | 'Any';
  dietaryPreference: 'Vegetarian' | 'Non-Vegetarian';
  specialNeeds?: string;
}

export interface MatchingResult {
  roomId: string;
  roomNumber: string;
  block: string;
  floor: number;
  matchScore: number; // 0 - 100%
  compatibilityReasons: string[];
  conflictWarnings: string[];
  roomType: 'AC' | 'Non-AC';
  availableBeds: number;
}
