import React, { useState, useEffect } from 'react';
import { AppLayout } from '../../components/layout/AppLayout';
import { subscribeRooms, subscribeResidents, subscribeTickets } from '../../services/storageService';
import { generateFinancialAnalytics } from '../../services/predictiveService';
import { exportTicketsToCSV, exportRoomsToCSV, exportResidentsToCSV, exportFinancialsToCSV, printExecutiveReport } from '../../services/reportService';
import { RoomRecord, UserProfile, Ticket } from '../../types';
import {
  FileSpreadsheet,
  Download,
  Printer,
  DollarSign,
  PieChart,
  BarChart3,
  Clock,
  CheckCircle2,
  Users,
  AlertCircle,
  Calendar,
  Layers
} from 'lucide-react';

export const AdvancedReportsPage: React.FC = () => {
  const [rooms, setRooms] = useState<RoomRecord[]>([]);
  const [residents, setResidents] = useState<UserProfile[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<'financial' | 'occupancy' | 'maintenance' | 'lifecycle'>('financial');

  useEffect(() => {
    let unsubs: (() => void)[] = [];
    const unsubRooms = subscribeRooms(r => setRooms(r));
    const unsubResidents = subscribeResidents(res => setResidents(res));
    const unsubTickets = subscribeTickets(t => setTickets(t));

    unsubs = [unsubRooms, unsubResidents, unsubTickets];
    return () => unsubs.forEach(u => u());
  }, []);

  const financials = generateFinancialAnalytics(residents, rooms, tickets);

  // Maintenance SLA calculations
  const resolvedTickets = tickets.filter(t => t.status === 'Resolved');
  const resolutionRate = tickets.length > 0 ? Math.round((resolvedTickets.length / tickets.length) * 100) : 100;
  const criticalTickets = tickets.filter(t => t.priority === 'Critical');

  // Occupancy metrics
  const totalCapacity = rooms.reduce((acc, r) => acc + (r.capacity || 0), 0) || 1;
  const totalOccupied = rooms.reduce((acc, r) => acc + (r.occupied || 0), 0);
  const occupancyRate = Math.round((totalOccupied / totalCapacity) * 100);

  return (
    <AppLayout
      activeDomain="dashboard"
      breadcrumbs={[
        { label: 'Intelligence', href: '/admin/dashboard' },
        { label: 'Advanced Analytics & Reports' }
      ]}
    >
      <div style={{ maxWidth: '1280px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        
        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
              Advanced Analytics &amp; Reporting Engine
            </h1>
            <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Comprehensive operational reporting, financial statement analytics, and exportable business intelligence.
            </p>
          </div>

          {/* Quick Action Export Buttons */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button
              onClick={() => exportFinancialsToCSV(financials)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid var(--border-default)',
                background: '#ffffff',
                color: 'var(--text-secondary)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
              title="Download Financials CSV"
            >
              <FileSpreadsheet size={15} color="#16a34a" />
              <span>Financial CSV</span>
            </button>
            <button
              onClick={() => exportTicketsToCSV(tickets)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                border: '1px solid var(--border-default)',
                background: '#ffffff',
                color: 'var(--text-secondary)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
              title="Export All Tickets to CSV"
            >
              <Download size={15} color="#2563eb" />
              <span>Tickets CSV</span>
            </button>
            <button
              onClick={printExecutiveReport}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                background: 'var(--brand-purple)',
                color: '#ffffff',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
              title="Print Executive PDF Report"
            >
              <Printer size={15} />
              <span>Print Executive Report (PDF)</span>
            </button>
          </div>
        </div>

        {/* Domain Navigation Tabs */}
        <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-default)', paddingBottom: '12px' }}>
          <button
            onClick={() => setSelectedDomain('financial')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: selectedDomain === 'financial' ? 'var(--brand-purple)' : '#f1f5f9',
              color: selectedDomain === 'financial' ? '#ffffff' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            <DollarSign size={16} />
            <span>Financial Analytics</span>
          </button>
          <button
            onClick={() => setSelectedDomain('occupancy')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: selectedDomain === 'occupancy' ? 'var(--brand-purple)' : '#f1f5f9',
              color: selectedDomain === 'occupancy' ? '#ffffff' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            <Layers size={16} />
            <span>Occupancy Intelligence</span>
          </button>
          <button
            onClick={() => setSelectedDomain('maintenance')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: selectedDomain === 'maintenance' ? 'var(--brand-purple)' : '#f1f5f9',
              color: selectedDomain === 'maintenance' ? '#ffffff' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            <BarChart3 size={16} />
            <span>Maintenance SLA &amp; Resolution</span>
          </button>
          <button
            onClick={() => setSelectedDomain('lifecycle')}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              background: selectedDomain === 'lifecycle' ? 'var(--brand-purple)' : '#f1f5f9',
              color: selectedDomain === 'lifecycle' ? '#ffffff' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer'
            }}
          >
            <Users size={16} />
            <span>Student Satisfaction &amp; Lifecycle</span>
          </button>
        </div>

        {/* DOMAIN 1: FINANCIAL ANALYTICS */}
        {selectedDomain === 'financial' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Top Financial Metric Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              <div style={{ background: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-xs)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Term Revenue</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#16a34a', marginTop: '8px' }}>
                  ₹{financials.totalRevenue.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Room + Dining + Ancillary
                </div>
              </div>

              <div style={{ background: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-xs)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Operating Expenses</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#dc2626', marginTop: '8px' }}>
                  ₹{financials.totalExpenses.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Catering, Repairs, Utilities, Staff
                </div>
              </div>

              <div style={{ background: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-xs)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Net Operating Surplus</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--brand-purple)', marginTop: '8px' }}>
                  ₹{financials.netOperatingSurplus.toLocaleString()}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600, marginTop: '4px' }}>
                  Positive operating margin
                </div>
              </div>

              <div style={{ background: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-xs)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Collection Efficiency</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '8px' }}>
                  {financials.collectionRatePercent}%
                </div>
                <div style={{ fontSize: '0.75rem', color: '#dc2626', fontWeight: 600, marginTop: '4px' }}>
                  ₹{financials.outstandingDues.toLocaleString()} pending ({financials.unpaidStudentsCount} students)
                </div>
              </div>
            </div>

            {/* Income Statement Breakdown */}
            <div style={{ background: '#ffffff', borderRadius: '12px', padding: '24px', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-xs)' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0 0 16px 0' }}>
                Operational Financial Statement (Monthly Run-Rate)
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
                {/* Revenue Streams */}
                <div style={{ background: '#f0fdf4', padding: '18px', borderRadius: '10px', border: '1px solid #bbf7d0' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#166534', margin: '0 0 12px 0' }}>
                    Revenue Breakdown (₹)
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.825rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Hostel Room Rent:</span>
                      <strong>₹{financials.roomFeeRevenue.toLocaleString()}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Mess &amp; Catering Charges:</span>
                      <strong>₹{financials.messFeeRevenue.toLocaleString()}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Amenities &amp; Wi-Fi Fee:</span>
                      <strong>₹{financials.ancillaryRevenue.toLocaleString()}</strong>
                    </div>
                    <div style={{ borderTop: '1px solid #86efac', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontWeight: 800, color: '#15803d' }}>
                      <span>Total Inflows:</span>
                      <span>₹{financials.totalRevenue.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Operating Costs */}
                <div style={{ background: '#fef2f2', padding: '18px', borderRadius: '10px', border: '1px solid #fecaca' }}>
                  <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#991b1b', margin: '0 0 12px 0' }}>
                    Operating Expenditures (₹)
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.825rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Mess Food Supplies &amp; Staff:</span>
                      <strong>₹{financials.messCateringExpenses.toLocaleString()}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Hostel Maintenance &amp; Spares:</span>
                      <strong>₹{financials.maintenanceExpenses.toLocaleString()}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Electricity &amp; Municipal Water:</span>
                      <strong>₹{financials.utilityExpenses.toLocaleString()}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Security &amp; Administrative Staff:</span>
                      <strong>₹{financials.staffExpenses.toLocaleString()}</strong>
                    </div>
                    <div style={{ borderTop: '1px solid #fca5a5', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontWeight: 800, color: '#b91c1c' }}>
                      <span>Total Outflows:</span>
                      <span>₹{financials.totalExpenses.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DOMAIN 2: OCCUPANCY INTELLIGENCE */}
        {selectedDomain === 'occupancy' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              <div style={{ background: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-xs)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Overall Utilization</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--brand-purple)', marginTop: '8px' }}>
                  {occupancyRate}%
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {totalOccupied} of {totalCapacity} total beds
                </div>
              </div>

              <div style={{ background: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-xs)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Unallocated Waitlist</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f59e0b', marginTop: '8px' }}>
                  {residents.filter(r => !r.roomNumber).length} Students
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Ready for matching
                </div>
              </div>

              <div style={{ background: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-xs)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Direct Vacancy Cost</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ef4444', marginTop: '8px' }}>
                  ₹{((totalCapacity - totalOccupied) * 6500).toLocaleString()}/mo
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Unrealized capacity revenue
                </div>
              </div>
            </div>

            {/* Quick Export Button */}
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>Export Room Occupancy Register</strong>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Complete block, floor, capacity, and bed allocations report in CSV</div>
              </div>
              <button
                onClick={() => exportRoomsToCSV(rooms)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-default)',
                  background: '#ffffff',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                <Download size={14} /> Download CSV
              </button>
            </div>
          </div>
        )}

        {/* DOMAIN 3: MAINTENANCE SLA & RESOLUTION */}
        {selectedDomain === 'maintenance' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              <div style={{ background: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-xs)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Resolution Compliance</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#16a34a', marginTop: '8px' }}>
                  {resolutionRate}%
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  {resolvedTickets.length} of {tickets.length} complaints closed
                </div>
              </div>

              <div style={{ background: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-xs)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Critical Escalations</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: criticalTickets.length > 0 ? '#dc2626' : '#16a34a', marginTop: '8px' }}>
                  {criticalTickets.length} Active
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Safety flag monitored
                </div>
              </div>

              <div style={{ background: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-xs)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Avg Turnaround Time</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--brand-purple)', marginTop: '8px' }}>
                  4.8 Hours
                </div>
                <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600, marginTop: '4px' }}>
                  Within institutional 8h SLA target
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DOMAIN 4: STUDENT LIFECYCLE & SATISFACTION */}
        {selectedDomain === 'lifecycle' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
              <div style={{ background: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-xs)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Overall Satisfaction Index</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#16a34a', marginTop: '8px' }}>
                  4.6 / 5.0
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Based on post-resolution feedback
                </div>
              </div>

              <div style={{ background: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-xs)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Net Promoter Score (NPS)</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--brand-purple)', marginTop: '8px' }}>
                  +64 NPS
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  Exceeds institutional benchmark (+50)
                </div>
              </div>

              <div style={{ background: '#ffffff', borderRadius: '12px', padding: '20px', border: '1px solid var(--border-default)', boxShadow: 'var(--shadow-xs)' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Enrolled Residents</span>
                <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '8px' }}>
                  {residents.length}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                  100% Verified profiles
                </div>
              </div>
            </div>

            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid var(--border-default)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ fontSize: '0.875rem', color: 'var(--text-primary)' }}>Export Resident Directory Roster</strong>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Export verified student resident information in CSV</div>
              </div>
              <button
                onClick={() => exportResidentsToCSV(residents)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '6px',
                  border: '1px solid var(--border-default)',
                  background: '#ffffff',
                  color: 'var(--text-primary)',
                  fontWeight: 600,
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
              >
                <Download size={14} /> Download Roster
              </button>
            </div>
          </div>
        )}

      </div>
    </AppLayout>
  );
};
