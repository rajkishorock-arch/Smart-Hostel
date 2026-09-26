import { UserProfile, RoomRecord, Ticket } from '../types';
import { FinancialAnalyticsSummary } from '../types/analytics';

/**
 * Downloads arbitrary string content as a CSV file in the browser.
 */
export function downloadCSV(filename: string, csvContent: string): void {
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generates CSV string for Maintenance Tickets
 */
export function exportTicketsToCSV(tickets: Ticket[]): void {
  const headers = ['Ticket ID', 'Room', 'Category', 'Priority', 'Status', 'Description', 'Created At', 'Resolved At'];
  const rows = tickets.map(t => [
    `"${t.id}"`,
    `"${t.roomNumber || ''}"`,
    `"${t.category || ''}"`,
    `"${t.priority || ''}"`,
    `"${t.status || ''}"`,
    `"${(t.description || '').replace(/"/g, '""')}"`,
    `"${t.createdAt ? new Date(t.createdAt).toLocaleDateString() : ''}"`,
    `"${t.resolvedAt ? new Date(t.resolvedAt).toLocaleDateString() : ''}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const dateStr = new Date().toISOString().split('T')[0];
  downloadCSV(`hostel_maintenance_tickets_${dateStr}.csv`, csvContent);
}

/**
 * Generates CSV string for Room Inventory & Occupancy
 */
export function exportRoomsToCSV(rooms: RoomRecord[]): void {
  const headers = ['Room Number', 'Block', 'Floor', 'Capacity', 'Occupied Beds', 'Available Beds', 'Status'];
  const rows = rooms.map(r => [
    `"${r.roomNumber}"`,
    `"${r.block || ''}"`,
    `"${r.floor || ''}"`,
    `"${r.capacity}"`,
    `"${r.occupied || 0}"`,
    `"${Math.max(0, (r.capacity || 1) - (r.occupied || 0))}"`,
    `"${(r.occupied || 0) >= (r.capacity || 1) ? 'Full' : (r.occupied || 0) > 0 ? 'Partial' : 'Vacant'}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const dateStr = new Date().toISOString().split('T')[0];
  downloadCSV(`hostel_room_inventory_${dateStr}.csv`, csvContent);
}

/**
 * Generates CSV string for Resident Roster
 */
export function exportResidentsToCSV(residents: UserProfile[]): void {
  const headers = ['Resident ID', 'Name', 'Email', 'Room Number', 'Bed', 'Phone', 'Role', 'Status'];
  const rows = residents.map(res => [
    `"${res.uid || ''}"`,
    `"${res.name || ''}"`,
    `"${res.email || ''}"`,
    `"${res.roomNumber || 'Unallocated'}"`,
    `"${res.bedNumber || 'N/A'}"`,
    `"${res.phone || ''}"`,
    `"${res.role || 'resident'}"`,
    `"${res.roomNumber ? 'Allocated' : 'Pending'}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const dateStr = new Date().toISOString().split('T')[0];
  downloadCSV(`hostel_residents_roster_${dateStr}.csv`, csvContent);
}

/**
 * Generates CSV string for Financial Summary Ledger
 */
export function exportFinancialsToCSV(financials: FinancialAnalyticsSummary): void {
  const lines = [
    `"SMART HOSTEL ADMINISTRATION - FINANCIAL SUMMARY REPORT"`,
    `"Generated On", "${new Date().toLocaleString()}"`,
    `"Period", "${financials.period}"`,
    `"Currency", "${financials.currency}"`,
    ``,
    `"Revenue Category", "Amount (INR)"`,
    `"Hostel Room Fees", "${financials.roomFeeRevenue}"`,
    `"Mess & Dining Charges", "${financials.messFeeRevenue}"`,
    `"Ancillary & Amenities Fees", "${financials.ancillaryRevenue}"`,
    `"Total Revenue", "${financials.totalRevenue}"`,
    ``,
    `"Operating Expenses Category", "Amount (INR)"`,
    `"Mess Catering Operations", "${financials.messCateringExpenses}"`,
    `"Maintenance & Repairs", "${financials.maintenanceExpenses}"`,
    `"Utilities (Power & Water)", "${financials.utilityExpenses}"`,
    `"Hostel Staff & Security", "${financials.staffExpenses}"`,
    `"Total Operating Expenses", "${financials.totalExpenses}"`,
    ``,
    `"Operating Performance"`,
    `"Net Operating Surplus", "${financials.netOperatingSurplus}"`,
    `"Fee Collection Rate", "${financials.collectionRatePercent}%"`,
    `"Outstanding Dues", "${financials.outstandingDues}"`,
    `"Unpaid Students Count", "${financials.unpaidStudentsCount}"`,
    `"Cost Per Occupied Bed", "${financials.costPerOccupiedBed}"`
  ];

  const dateStr = new Date().toISOString().split('T')[0];
  downloadCSV(`hostel_financial_statement_${dateStr}.csv`, lines.join('\n'));
}

/**
 * Triggers window print for generation of high-quality PDF executive reports.
 */
export function printExecutiveReport(): void {
  window.print();
}
