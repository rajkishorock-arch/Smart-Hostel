import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AppLayout } from '../../components/layout/AppLayout';
import { Ticket, RoomRecord, UserProfile, ActivityLog, SmartInsight } from '../../types';
import {
  subscribeTickets,
  subscribeRooms,
  getStoredUsers,
  getStoredMealSchedule,
  getStoredAnnouncements,
  getAllResidents
} from '../../services/storageService';
import { subscribeActivityLogs } from '../../services/activityService';
import {
  Building2,
  UtensilsCrossed,
  Wrench,
  Users,
  Bed,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  Clock,
  ShieldCheck,
  DoorOpen,
  KeyRound,
  Layers,
  CalendarDays,
  Megaphone,
  Ticket as TicketIcon,
  CheckCircle2,
  FolderKanban,
  Lightbulb,
  History,
  Activity,
  BarChart3,
  PieChart,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

export const WardenOverviewPage: React.FC = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [rooms, setRooms] = useState<RoomRecord[]>([]);
  const [residents, setResidents] = useState<UserProfile[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);

  useEffect(() => {
    const unsubTickets = subscribeTickets(
      all => setTickets(all),
      { role: 'warden', uid: user?.uid || '' }
    );
    const unsubRooms = subscribeRooms(all => setRooms(all));
    const unsubLogs = subscribeActivityLogs(logs => setActivityLogs(logs), 8);
    setResidents(getAllResidents());

    return () => {
      unsubTickets();
      unsubRooms();
      unsubLogs();
    };
  }, [user]);

  // Derived real Firestore statistics
  const totalRooms = rooms.length;
  const totalBeds = rooms.reduce((acc, r) => acc + r.capacity, 0);
  const occupiedBeds = rooms.reduce((acc, r) => acc + r.occupied, 0);
  const availableBeds = Math.max(0, totalBeds - occupiedBeds);
  const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  const totalResidents = residents.filter(r => r.role === 'resident').length;
  const unallocatedResidents = residents.filter(r => r.role === 'resident' && (!r.roomNumber || r.roomNumber === '')).length;

  const openTickets = tickets.filter(t => t.status === 'Open' || t.status === 'AI Classified').length;
  const inProgressTickets = tickets.filter(t => t.status === 'In Progress' || t.status === 'Assigned').length;
  const criticalTickets = tickets.filter(t => t.priority === 'Critical' && t.status !== 'Resolved').length;
  const resolvedTickets = tickets.filter(t => t.status === 'Resolved').length;

  const schedule = getStoredMealSchedule();
  const nextMeal = schedule.find(s => s.status === 'Active') || schedule.find(s => s.status === 'Upcoming') || schedule[0];

  // Category distribution
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {
      Electrical: 0,
      Plumbing: 0,
      Carpentry: 0,
      Cleaning: 0,
      Infrastructure: 0,
      Other: 0
    };
    for (const t of tickets) {
      if (counts[t.category] !== undefined) {
        counts[t.category]++;
      } else {
        counts.Other++;
      }
    }
    return counts;
  }, [tickets]);

  // Status distribution
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      Open: 0,
      'AI Classified': 0,
      Assigned: 0,
      'In Progress': 0,
      Resolved: 0
    };
    for (const t of tickets) {
      if (counts[t.status] !== undefined) {
        counts[t.status]++;
      } else {
        counts.Open++;
      }
    }
    return counts;
  }, [tickets]);

  // Occupancy breakdown by Block
  const blockOccupancy = useMemo(() => {
    const map: Record<string, { capacity: number; occupied: number }> = {};
    for (const r of rooms) {
      const b = r.block || 'General';
      if (!map[b]) map[b] = { capacity: 0, occupied: 0 };
      map[b].capacity += r.capacity;
      map[b].occupied += r.occupied;
    }
    return Object.entries(map).map(([block, data]) => ({
      block,
      capacity: data.capacity,
      occupied: data.occupied,
      rate: data.capacity > 0 ? Math.round((data.occupied / data.capacity) * 100) : 0
    }));
  }, [rooms]);

  // Real Smart Insights generated strictly from live Firestore data
  const smartInsights = useMemo<SmartInsight[]>(() => {
    const list: SmartInsight[] = [];

    // 1. Critical Tickets Alert
    if (criticalTickets > 0) {
      list.push({
        id: 'crit-ins',
        type: 'critical',
        title: `${criticalTickets} Unresolved Critical Maintenance Ticket(s)`,
        description: 'Safety-critical incidents detected in current maintenance queue requiring immediate warden & technician attention.',
        metric: `${criticalTickets} Urgent`,
        timestamp: new Date().toISOString()
      });
    }

    // 2. High Category Concentration
    const totalActiveTickets = tickets.filter(t => t.status !== 'Resolved').length;
    if (totalActiveTickets > 0 && categoryCounts.Electrical / totalActiveTickets >= 0.4) {
      list.push({
        id: 'elec-ins',
        type: 'warning',
        title: 'Unusually High Proportion of Electrical Tickets',
        description: `${Math.round((categoryCounts.Electrical / totalActiveTickets) * 100)}% of pending tickets are Electrical. Consider scheduling a block-level power inspection.`,
        metric: `${categoryCounts.Electrical} Electrical`,
        timestamp: new Date().toISOString()
      });
    }

    // 3. Repeated Room Maintenance Issues
    const roomTicketCounts: Record<string, number> = {};
    for (const t of tickets) {
      const rm = t.roomNumber || t.room;
      if (rm) {
        roomTicketCounts[rm] = (roomTicketCounts[rm] || 0) + 1;
      }
    }
    const repeatRooms = Object.entries(roomTicketCounts).filter(([_, count]) => count >= 2);
    if (repeatRooms.length > 0) {
      const [topRoom, count] = repeatRooms.sort((a, b) => b[1] - a[1])[0];
      list.push({
        id: 'repeat-rm-ins',
        type: 'warning',
        title: `Repeated Maintenance in Room ${topRoom}`,
        description: `Room ${topRoom} has logged ${count} maintenance requests. Facility inspection recommended.`,
        metric: `${count} Tickets`,
        timestamp: new Date().toISOString()
      });
    }

    // 4. Unallocated Residents
    if (unallocatedResidents > 0) {
      list.push({
        id: 'unalloc-ins',
        type: 'info',
        title: `${unallocatedResidents} Resident(s) Awaiting Bed Allocation`,
        description: 'Enrolled students currently have no active room assignment. Use Smart Allocate to assign available beds.',
        metric: `${unallocatedResidents} Pending`,
        timestamp: new Date().toISOString()
      });
    }

    // 5. Occupancy Level Insight
    if (totalBeds > 0) {
      if (occupancyRate >= 90) {
        list.push({
          id: 'high-occ',
          type: 'warning',
          title: `High Occupancy: ${occupancyRate}% Beds Filled`,
          description: `Only ${availableBeds} bed(s) remain vacant across all hostel blocks.`,
          metric: `${availableBeds} Vacant`,
          timestamp: new Date().toISOString()
        });
      } else {
        list.push({
          id: 'normal-occ',
          type: 'positive',
          title: `Optimal Campus Capacity (${occupancyRate}% Occupied)`,
          description: `${occupiedBeds} beds occupied across ${totalRooms} rooms with ${availableBeds} beds available.`,
          metric: `${availableBeds} Available`,
          timestamp: new Date().toISOString()
        });
      }
    }

    return list;
  }, [criticalTickets, tickets, categoryCounts, unallocatedResidents, totalBeds, occupancyRate, availableBeds, occupiedBeds, totalRooms]);

  const recentTickets = tickets.slice(0, 5);

  return (
    <AppLayout activeDomain="dashboard" breadcrumbs={[{ label: 'Warden Command Center' }]}>
      {/* Top Welcome Banner */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid var(--neutral-border)',
          borderRadius: '16px',
          padding: '24px 28px',
          marginBottom: '28px',
          boxShadow: 'var(--shadow-xs)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                color: 'var(--brand-purple)',
                background: 'var(--brand-purple-subtle)',
                padding: '3px 8px',
                borderRadius: '6px',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <ShieldCheck size={14} /> Warden Central Administration
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--neutral-muted)' }}>
              {user?.hostel || 'Aravali Hostel'} • Real-Time Firestore Synchronization
            </span>
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
            Warden Command Center
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: 'var(--neutral-muted)' }}>
            Authoritative operational control, live hostel metrics, predictive insights, and audit records.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              background: '#ecfdf5',
              border: '1px solid #a7f3d0',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#065f46',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Activity size={14} /> Firestore Live Sync: Active
          </span>
        </div>
      </div>

      {/* ============================================================ */}
      {/* 8 REAL FIRESTORE KPI STATISTIC CARDS                         */}
      {/* ============================================================ */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '28px'
        }}
      >
        {/* 1. Total Residents */}
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <span style={cardLabelStyle}>Total Residents</span>
            <div style={{ ...iconBoxStyle, background: 'var(--brand-purple-subtle)', color: 'var(--brand-purple)' }}>
              <Users size={18} />
            </div>
          </div>
          <div style={statValueStyle}>{totalResidents}</div>
          <div style={subTextStyle}>Enrolled students ({unallocatedResidents} awaiting room)</div>
        </div>

        {/* 2. Total Rooms */}
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <span style={cardLabelStyle}>Total Rooms</span>
            <div style={{ ...iconBoxStyle, background: '#f1f5f9', color: '#475569' }}>
              <DoorOpen size={18} />
            </div>
          </div>
          <div style={statValueStyle}>{totalRooms}</div>
          <div style={subTextStyle}>{totalBeds} total bed capacity</div>
        </div>

        {/* 3. Occupied Beds */}
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <span style={cardLabelStyle}>Occupied Beds</span>
            <div style={{ ...iconBoxStyle, background: 'var(--brand-blue-subtle)', color: 'var(--brand-blue)' }}>
              <Bed size={18} />
            </div>
          </div>
          <div style={{ ...statValueStyle, color: 'var(--brand-blue)' }}>{occupiedBeds}</div>
          <div style={subTextStyle}>{occupancyRate}% campus occupancy</div>
        </div>

        {/* 4. Available Beds */}
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <span style={cardLabelStyle}>Available Beds</span>
            <div style={{ ...iconBoxStyle, background: '#ecfdf5', color: '#15803d' }}>
              <CheckCircle size={18} />
            </div>
          </div>
          <div style={{ ...statValueStyle, color: '#15803d' }}>{availableBeds}</div>
          <div style={subTextStyle}>Ready for instant allocation</div>
        </div>

        {/* 5. Open Tickets */}
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <span style={cardLabelStyle}>Open Tickets</span>
            <div style={{ ...iconBoxStyle, background: 'var(--brand-yellow-subtle)', color: '#b45309' }}>
              <Wrench size={18} />
            </div>
          </div>
          <div style={{ ...statValueStyle, color: openTickets > 0 ? '#b45309' : '#15803d' }}>{openTickets}</div>
          <div style={subTextStyle}>{inProgressTickets} currently in progress</div>
        </div>

        {/* 6. Critical Tickets */}
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <span style={cardLabelStyle}>Critical Tickets</span>
            <div style={{ ...iconBoxStyle, background: '#fef2f2', color: '#dc2626' }}>
              <ShieldAlert size={18} />
            </div>
          </div>
          <div style={{ ...statValueStyle, color: criticalTickets > 0 ? '#dc2626' : '#15803d' }}>
            {criticalTickets}
          </div>
          <div style={subTextStyle}>{criticalTickets > 0 ? 'Urgent attention required' : 'No critical emergencies'}</div>
        </div>

        {/* 7. Resolved Tickets */}
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <span style={cardLabelStyle}>Resolved Tickets</span>
            <div style={{ ...iconBoxStyle, background: '#f0fdf4', color: '#16a34a' }}>
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div style={{ ...statValueStyle, color: '#16a34a' }}>{resolvedTickets}</div>
          <div style={subTextStyle}>Successfully closed issues</div>
        </div>

        {/* 8. Today's Mess Status */}
        <div style={cardStyle}>
          <div style={cardHeaderStyle}>
            <span style={cardLabelStyle}>Today's Mess</span>
            <div style={{ ...iconBoxStyle, background: 'var(--brand-cyan-subtle)', color: '#0891b2' }}>
              <UtensilsCrossed size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--neutral-dark)', lineHeight: 1.2 }}>
            {nextMeal ? nextMeal.meal : 'Dinner'}
          </div>
          <div style={subTextStyle}>{nextMeal ? `${nextMeal.startTime} - ${nextMeal.endTime}` : 'Serving active'}</div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* REAL CHARTS & DATA VISUALIZATIONS SECTION                     */}
      {/* ============================================================ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        {/* Chart 1: Maintenance Category Distribution */}
        <div style={{ ...cardStyle, padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
                Maintenance Category Distribution
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--neutral-muted)' }}>
                Based on {tickets.length} total tickets in Firestore
              </span>
            </div>
            <BarChart3 size={18} color="var(--neutral-muted)" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Object.entries(categoryCounts).map(([cat, count]) => {
              const pct = tickets.length > 0 ? Math.round((count / tickets.length) * 100) : 0;
              const barColor =
                cat === 'Electrical'
                  ? '#f59e0b'
                  : cat === 'Plumbing'
                  ? '#3b82f6'
                  : cat === 'Carpentry'
                  ? '#8b5cf6'
                  : cat === 'Cleaning'
                  ? '#10b981'
                  : cat === 'Infrastructure'
                  ? '#ec4899'
                  : '#64748b';
              return (
                <div key={cat}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600, color: 'var(--neutral-dark)' }}>{cat}</span>
                    <span style={{ color: 'var(--neutral-muted)' }}>{count} ({pct}%)</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${pct}%`,
                        height: '100%',
                        background: barColor,
                        borderRadius: '4px',
                        transition: 'width 0.4s ease'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 2: Ticket Status Breakdown */}
        <div style={{ ...cardStyle, padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
                Ticket Status Pipeline
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--neutral-muted)' }}>
                Real-time lifecycle state distribution
              </span>
            </div>
            <PieChart size={18} color="var(--neutral-muted)" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {Object.entries(statusCounts).map(([st, count]) => {
              const pct = tickets.length > 0 ? Math.round((count / tickets.length) * 100) : 0;
              const barColor =
                st === 'Resolved'
                  ? '#10b981'
                  : st === 'In Progress'
                  ? '#3b82f6'
                  : st === 'Assigned'
                  ? '#6366f1'
                  : st === 'AI Classified'
                  ? '#8b5cf6'
                  : '#f59e0b';
              return (
                <div key={st}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 600, color: 'var(--neutral-dark)' }}>{st}</span>
                    <span style={{ color: 'var(--neutral-muted)' }}>{count} ({pct}%)</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${pct}%`,
                        height: '100%',
                        background: barColor,
                        borderRadius: '4px',
                        transition: 'width 0.4s ease'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Chart 3: Block Occupancy Overview */}
        <div style={{ ...cardStyle, padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
                Block Occupancy Overview
              </h3>
              <span style={{ fontSize: '0.75rem', color: 'var(--neutral-muted)' }}>
                Live capacity across residential blocks
              </span>
            </div>
            <Building2 size={18} color="var(--neutral-muted)" />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {blockOccupancy.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: 'var(--neutral-muted)', fontSize: '0.8rem' }}>
                No block records loaded yet.
              </div>
            ) : (
              blockOccupancy.map((b) => (
                <div key={b.block}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.78rem', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 700, color: 'var(--neutral-dark)' }}>{b.block}</span>
                    <span style={{ color: 'var(--neutral-muted)' }}>
                      {b.occupied} / {b.capacity} beds ({b.rate}%)
                    </span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                    <div
                      style={{
                        width: `${b.rate}%`,
                        height: '100%',
                        background: b.rate >= 90 ? '#ef4444' : b.rate >= 70 ? 'var(--brand-blue)' : '#10b981',
                        borderRadius: '4px',
                        transition: 'width 0.4s ease'
                      }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* SMART INSIGHTS & REAL-TIME AUDIT LOG SECTION                 */}
      {/* ============================================================ */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px', marginBottom: '28px' }}>
        {/* Smart Insights (Feature 12) */}
        <div style={{ ...cardStyle, padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ ...iconBoxStyle, width: '30px', height: '30px', background: '#fef3c7', color: '#b45309' }}>
                <Lightbulb size={16} />
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
                Smart Operational Insights
              </h3>
            </div>
            <span style={{ fontSize: '0.72rem', background: '#f8fafc', padding: '2px 8px', borderRadius: '6px', border: '1px solid #e2e8f0', color: 'var(--neutral-muted)' }}>
              Live Analysis
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {smartInsights.length === 0 ? (
              <div style={{ padding: '28px', textAlign: 'center', color: 'var(--neutral-muted)' }}>
                <Sparkles size={24} style={{ opacity: 0.3, margin: '0 auto 8px' }} />
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>Not enough data yet.</div>
                <div style={{ fontSize: '0.75rem', marginTop: '4px' }}>Insights will automatically generate as tickets and allocations accumulate.</div>
              </div>
            ) : (
              smartInsights.map((ins) => (
                <div
                  key={ins.id}
                  style={{
                    padding: '12px 14px',
                    borderRadius: '8px',
                    background: ins.type === 'critical' ? '#fef2f2' : ins.type === 'warning' ? '#fffbeb' : '#f8fafc',
                    border: `1px solid ${ins.type === 'critical' ? '#fecaca' : ins.type === 'warning' ? '#fef08a' : '#e2e8f0'}`
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                    <div style={{ fontWeight: 700, fontSize: '0.825rem', color: ins.type === 'critical' ? '#991b1b' : ins.type === 'warning' ? '#92400e' : '#1e293b' }}>
                      {ins.title}
                    </div>
                    {ins.metric && (
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '1px 6px',
                          borderRadius: '4px',
                          background: ins.type === 'critical' ? '#fee2e2' : '#f1f5f9',
                          color: ins.type === 'critical' ? '#dc2626' : '#475569',
                          flexShrink: 0
                        }}
                      >
                        {ins.metric}
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--neutral-muted)', marginTop: '4px', lineHeight: 1.35 }}>
                    {ins.description}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Activity & Audit Trail (Feature 11) */}
        <div style={{ ...cardStyle, padding: '22px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ ...iconBoxStyle, width: '30px', height: '30px', background: '#e0e7ff', color: '#4338ca' }}>
                <History size={16} />
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
                Live Activity & Audit Trail
              </h3>
            </div>
            <span style={{ fontSize: '0.72rem', background: '#ecfdf5', color: '#065f46', padding: '2px 8px', borderRadius: '6px', fontWeight: 600 }}>
              Immutable
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '280px', overflowY: 'auto' }}>
            {activityLogs.length === 0 ? (
              <div style={{ padding: '28px', textAlign: 'center', color: 'var(--neutral-muted)' }}>
                <Clock size={24} style={{ opacity: 0.3, margin: '0 auto 8px' }} />
                <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>No recent audit events.</div>
                <div style={{ fontSize: '0.75rem', marginTop: '4px' }}>Actions like allocations, ticket transitions, and notices will log here.</div>
              </div>
            ) : (
              activityLogs.map((log) => (
                <div
                  key={log.id}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: '#f8fafc',
                    border: '1px solid #f1f5f9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px'
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--neutral-dark)' }}>
                      <span style={{ color: 'var(--brand-blue)' }}>{log.actorName}</span> • {log.action}
                    </div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--neutral-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      Target: {log.target} {log.details ? `(${log.details})` : ''}
                    </div>
                  </div>
                  <span style={{ fontSize: '0.68rem', color: '#94a3b8', flexShrink: 0 }}>
                    {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* MODULE ENTRY WORKSPACES                                      */}
      {/* ============================================================ */}
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--neutral-dark)', marginBottom: '16px' }}>
          Operations Workspaces
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          {/* HOSTEL MANAGEMENT ENTRY CARD */}
          <div className="card-hostel" style={workspaceCardStyle}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div style={{ ...iconBoxStyle, width: '38px', height: '38px', borderRadius: '10px', background: 'var(--brand-blue-subtle)', color: 'var(--brand-blue)' }}>
                  <Building2 size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
                    Hostel Management
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: 'var(--neutral-muted)' }}>
                    Rooms, Beds, Residents, Blocks & Allocations
                  </span>
                </div>
              </div>
              <p style={{ fontSize: '0.84rem', color: '#4b5563', lineHeight: 1.5, marginBottom: '20px' }}>
                Administer {totalRooms} rooms across campus blocks. Manage allocations, reassign beds, and track resident occupancy status.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <Link to="/admin/hostel/rooms" style={linkBtnStyle}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <DoorOpen size={15} color="var(--brand-blue)" /> Rooms
                  </span>
                  <ArrowRight size={14} color="#94a3b8" />
                </Link>
                <Link to="/admin/hostel/allocation" style={linkBtnStyle}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <KeyRound size={15} color="var(--brand-blue)" /> Bed Allocation
                  </span>
                  <ArrowRight size={14} color="#94a3b8" />
                </Link>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <Link to="/admin/hostel/residents" style={linkBtnStyle}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Users size={15} color="var(--brand-blue)" /> Residents
                  </span>
                  <ArrowRight size={14} color="#94a3b8" />
                </Link>
                <Link to="/admin/hostel/blocks" style={linkBtnStyle}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Layers size={15} color="var(--brand-blue)" /> Blocks & Floors
                  </span>
                  <ArrowRight size={14} color="#94a3b8" />
                </Link>
              </div>

              <Link to="/admin/hostel" style={{ ...actionBtnStyle, background: 'var(--brand-blue)' }}>
                Open Hostel Overview <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* SMART MESS MANAGEMENT ENTRY CARD */}
          <div className="card-mess" style={workspaceCardStyle}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div style={{ ...iconBoxStyle, width: '38px', height: '38px', borderRadius: '10px', background: 'var(--brand-green-subtle)', color: 'var(--brand-green)' }}>
                  <UtensilsCrossed size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
                    Smart Mess Management
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: 'var(--neutral-muted)' }}>
                    Daily Meals, 7-Day Timetable, Timings & Announcements
                  </span>
                </div>
              </div>
              <p style={{ fontSize: '0.84rem', color: '#4b5563', lineHeight: 1.5, marginBottom: '20px' }}>
                Curate daily dining menus (Breakfast, Lunch, Snacks, Dinner), manage 7-day culinary cycles, configure service windows, and broadcast dining alerts.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <Link to="/admin/mess/today" style={linkBtnStyle}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={15} color="var(--brand-green)" /> Today's Menu
                  </span>
                  <ArrowRight size={14} color="#94a3b8" />
                </Link>
                <Link to="/admin/mess/weekly" style={linkBtnStyle}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CalendarDays size={15} color="var(--brand-green)" /> Weekly Menu
                  </span>
                  <ArrowRight size={14} color="#94a3b8" />
                </Link>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <Link to="/admin/mess/schedule" style={linkBtnStyle}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={15} color="var(--brand-green)" /> Meal Schedule
                  </span>
                  <ArrowRight size={14} color="#94a3b8" />
                </Link>
                <Link to="/admin/mess/announcements" style={linkBtnStyle}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Megaphone size={15} color="var(--brand-green)" /> Announcements
                  </span>
                  <ArrowRight size={14} color="#94a3b8" />
                </Link>
              </div>

              <Link to="/admin/mess" style={{ ...actionBtnStyle, background: 'var(--brand-green)' }}>
                Open Mess Overview <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* MAINTENANCE MANAGEMENT ENTRY CARD */}
          <div className="card-maint" style={workspaceCardStyle}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div style={{ ...iconBoxStyle, width: '38px', height: '38px', borderRadius: '10px', background: 'var(--brand-yellow-subtle)', color: 'var(--maint-primary)' }}>
                  <Wrench size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
                    Maintenance Management
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: 'var(--neutral-muted)' }}>
                    Tickets, Contractor Dispatch, Resolution & Categories
                  </span>
                </div>
              </div>
              <p style={{ fontSize: '0.84rem', color: '#4b5563', lineHeight: 1.5, marginBottom: '20px' }}>
                Track complaints across Electrical, Plumbing, Carpentry, Cleaning, and Infrastructure. Assign technicians, track timeline, and resolve issues.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <Link to="/admin/maintenance/tickets" style={linkBtnStyle}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <TicketIcon size={15} color="var(--maint-primary)" /> View Tickets
                  </span>
                  <ArrowRight size={14} color="#94a3b8" />
                </Link>
                <Link to="/admin/maintenance/resolution" style={linkBtnStyle}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={15} color="var(--maint-primary)" /> Resolution
                  </span>
                  <ArrowRight size={14} color="#94a3b8" />
                </Link>
              </div>

              <Link to="/admin/maintenance/categories" style={linkBtnStyle}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FolderKanban size={15} color="var(--maint-primary)" /> Categories Breakdown
                </span>
                <ArrowRight size={14} color="#94a3b8" />
              </Link>

              <Link to="/admin/maintenance" style={{ ...actionBtnStyle, background: 'var(--maint-primary)' }}>
                Open Maintenance Overview <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* ============================================================ */}
      {/* RECENT TICKETS TABLE                                         */}
      {/* ============================================================ */}
      <div style={{ ...cardStyle, padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
              Recent Maintenance Dispatches & Reports
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--neutral-muted)' }}>
              Latest resident issues logged into the system
            </span>
          </div>

          <Link
            to="/admin/maintenance/tickets"
            style={{
              fontSize: '0.82rem',
              fontWeight: 700,
              color: 'var(--brand-purple)',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            All Tickets <ArrowRight size={14} />
          </Link>
        </div>

        <div className="pro-table-wrapper">
          <table className="pro-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Resident</th>
                <th>Room</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Reported</th>
              </tr>
            </thead>
            <tbody>
              {recentTickets.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '24px', color: 'var(--neutral-muted)' }}>
                    No recent maintenance tickets reported.
                  </td>
                </tr>
              ) : (
                recentTickets.map(t => (
                  <tr key={t.id}>
                    <td style={{ fontWeight: 700 }}>#{t.id}</td>
                    <td>{t.residentName}</td>
                    <td>{t.block} - {t.roomNumber || t.room}</td>
                    <td>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '6px',
                          background: '#f1f5f9',
                          color: '#334155'
                        }}
                      >
                        {t.category}
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '6px',
                          background:
                            t.priority === 'Critical'
                              ? '#fef2f2'
                              : t.priority === 'High'
                              ? '#fffbeb'
                              : '#f8fafc',
                          color:
                            t.priority === 'Critical'
                              ? '#dc2626'
                              : t.priority === 'High'
                              ? '#d97706'
                              : '#64748b'
                        }}
                      >
                        {t.priority}
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '12px',
                          background:
                            t.status === 'Resolved'
                              ? '#dcfce7'
                              : t.status === 'In Progress' || t.status === 'Assigned'
                              ? '#dbeafe'
                              : '#fef3c7',
                          color:
                            t.status === 'Resolved'
                              ? '#15803d'
                              : t.status === 'In Progress' || t.status === 'Assigned'
                              ? '#1d4ed8'
                              : '#b45309'
                        }}
                      >
                        ● {t.status}
                      </span>
                    </td>
                    <td style={{ color: 'var(--neutral-muted)', fontSize: '0.78rem' }}>
                      {new Date(t.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
};

// UI Styling Constants
const cardStyle: React.CSSProperties = {
  background: '#ffffff',
  border: '1px solid var(--neutral-border)',
  borderRadius: '14px',
  padding: '20px',
  boxShadow: 'var(--shadow-xs)'
};

const cardHeaderStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '12px'
};

const cardLabelStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  fontWeight: 700,
  color: 'var(--neutral-muted)',
  textTransform: 'uppercase'
};

const iconBoxStyle: React.CSSProperties = {
  width: '36px',
  height: '36px',
  borderRadius: '8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const statValueStyle: React.CSSProperties = {
  fontSize: '1.8rem',
  fontWeight: 800,
  color: 'var(--neutral-dark)',
  lineHeight: 1
};

const subTextStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  color: 'var(--neutral-muted)',
  marginTop: '8px'
};

const workspaceCardStyle: React.CSSProperties = {
  borderRadius: '14px',
  padding: '24px',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between'
};

const linkBtnStyle: React.CSSProperties = {
  padding: '9px 12px',
  borderRadius: '8px',
  background: '#f8fafc',
  border: '1px solid var(--neutral-border)',
  fontSize: '0.82rem',
  fontWeight: 700,
  color: 'var(--neutral-dark)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between'
};

const actionBtnStyle: React.CSSProperties = {
  marginTop: '6px',
  padding: '10px',
  borderRadius: '8px',
  color: '#ffffff',
  fontSize: '0.84rem',
  fontWeight: 700,
  textAlign: 'center',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '6px'
};
