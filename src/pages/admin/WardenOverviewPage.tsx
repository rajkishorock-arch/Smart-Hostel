import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { AppLayout } from '../../components/layout/AppLayout';
import { Ticket, RoomRecord, UserProfile } from '../../types';
import {
  subscribeTickets,
  subscribeRooms,
  getStoredUsers,
  getStoredMealSchedule,
  getStoredAnnouncements
} from '../../services/storageService';
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
  FolderKanban
} from 'lucide-react';

export const WardenOverviewPage: React.FC = () => {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [rooms, setRooms] = useState<RoomRecord[]>([]);
  const [residents, setResidents] = useState<UserProfile[]>([]);

  useEffect(() => {
    const unsubTickets = subscribeTickets(
      all => setTickets(all),
      { role: 'warden', uid: user?.uid || '' }
    );
    const unsubRooms = subscribeRooms(all => setRooms(all));
    const allUsers = getStoredUsers();
    setResidents(Object.values(allUsers));

    return () => {
      unsubTickets();
      unsubRooms();
    };
  }, [user]);

  // Derived metrics
  const totalRooms = rooms.length;
  const totalBeds = rooms.reduce((acc, r) => acc + r.capacity, 0);
  const occupiedBeds = rooms.reduce((acc, r) => acc + r.occupied, 0);
  const availableBeds = Math.max(0, totalBeds - occupiedBeds);
  const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  const totalResidents = residents.filter(r => r.role === 'resident').length;
  const openTickets = tickets.filter(t => t.status === 'Open').length;
  const inProgressTickets = tickets.filter(t => t.status === 'In Progress').length;
  const urgentTickets = tickets.filter(t => t.priority === 'Urgent' && t.status !== 'Resolved').length;

  const schedule = getStoredMealSchedule();
  const nextMeal = schedule.find(s => s.status === 'Active') || schedule.find(s => s.status === 'Upcoming') || schedule[0];

  const recentTickets = tickets.slice(0, 5);

  return (
    <AppLayout
      activeDomain="dashboard"
      breadcrumbs={[{ label: 'Operations Dashboard' }]}
    >
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
              {user?.hostel || 'Aravali Hostel'} • Executive Authority
            </span>
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
            Hostel Operations Summary
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: 'var(--neutral-muted)' }}>
            Real-time administrative overview across hostel accommodation, smart mess, and campus maintenance.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span
            style={{
              padding: '6px 12px',
              borderRadius: '8px',
              background: '#f8fafc',
              border: '1px solid var(--neutral-border)',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--neutral-dark)'
            }}
          >
            System Status: <strong style={{ color: '#16a34a' }}>● Online (Live)</strong>
          </span>
        </div>
      </div>

      {/* Overview Stat Cards (Summary Statistics) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}
      >
        {/* Total Residents */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid var(--neutral-border)',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: 'var(--shadow-xs)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--neutral-muted)', textTransform: 'uppercase' }}>
              Enrolled Residents
            </span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'var(--brand-purple-subtle)',
                color: 'var(--brand-purple)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Users size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--neutral-dark)', lineHeight: 1 }}>
            {totalResidents}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--neutral-muted)', marginTop: '8px' }}>
            Registered active students
          </div>
        </div>

        {/* Occupancy Rate */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid var(--neutral-border)',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: 'var(--shadow-xs)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--neutral-muted)', textTransform: 'uppercase' }}>
              Hostel Occupancy
            </span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'var(--brand-blue-subtle)',
                color: 'var(--brand-blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Building2 size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--brand-blue)', lineHeight: 1 }}>
            {occupancyRate}%
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--neutral-muted)', marginTop: '8px' }}>
            {occupiedBeds} occupied of {totalBeds} beds
          </div>
        </div>

        {/* Available Beds */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid var(--neutral-border)',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: 'var(--shadow-xs)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--neutral-muted)', textTransform: 'uppercase' }}>
              Available Beds
            </span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: '#ecfdf5',
                color: '#15803d',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Bed size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#15803d', lineHeight: 1 }}>
            {availableBeds}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--neutral-muted)', marginTop: '8px' }}>
            Ready for instant allocation
          </div>
        </div>

        {/* Open Maintenance */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid var(--neutral-border)',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: 'var(--shadow-xs)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--neutral-muted)', textTransform: 'uppercase' }}>
              Open Tickets
            </span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'var(--brand-yellow-subtle)',
                color: '#b45309',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Wrench size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: openTickets > 0 ? '#b45309' : '#15803d', lineHeight: 1 }}>
            {openTickets}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--neutral-muted)', marginTop: '8px' }}>
            {inProgressTickets} in progress • {urgentTickets} urgent
          </div>
        </div>

        {/* Today's Next Meal */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid var(--neutral-border)',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: 'var(--shadow-xs)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--neutral-muted)', textTransform: 'uppercase' }}>
              Mess Status
            </span>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: 'var(--brand-cyan-subtle)',
                color: '#0891b2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <UtensilsCrossed size={18} />
            </div>
          </div>
          <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--neutral-dark)', lineHeight: 1.2 }}>
            {nextMeal ? nextMeal.meal : 'Dinner'}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--neutral-muted)', marginTop: '8px' }}>
            {nextMeal ? `${nextMeal.startTime} - ${nextMeal.endTime}` : 'Serving ongoing'}
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

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '20px'
          }}
        >
          {/* HOSTEL MANAGEMENT ENTRY CARD */}
          <div
            className="card-hostel"
            style={{
              borderRadius: '14px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: 'var(--brand-blue-subtle)',
                    color: 'var(--brand-blue)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
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
                Administer {totalRooms} rooms across {rooms.length > 0 ? 'Blocks A, B, C' : 'Hostel Blocks'}. Manage allocations, reassign beds, and track resident occupancy status.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <Link
                  to="/admin/hostel/rooms"
                  style={{
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
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <DoorOpen size={15} color="var(--brand-blue)" /> Rooms
                  </span>
                  <ArrowRight size={14} color="#94a3b8" />
                </Link>

                <Link
                  to="/admin/hostel/allocation"
                  style={{
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
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <KeyRound size={15} color="var(--brand-blue)" /> Bed Allocation
                  </span>
                  <ArrowRight size={14} color="#94a3b8" />
                </Link>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <Link
                  to="/admin/hostel/residents"
                  style={{
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
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Users size={15} color="var(--brand-blue)" /> Residents
                  </span>
                  <ArrowRight size={14} color="#94a3b8" />
                </Link>

                <Link
                  to="/admin/hostel/blocks"
                  style={{
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
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Layers size={15} color="var(--brand-blue)" /> Blocks & Floors
                  </span>
                  <ArrowRight size={14} color="#94a3b8" />
                </Link>
              </div>

              <Link
                to="/admin/hostel"
                style={{
                  marginTop: '6px',
                  padding: '10px',
                  borderRadius: '8px',
                  background: 'var(--brand-blue)',
                  color: '#ffffff',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                Open Hostel Overview <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* SMART MESS MANAGEMENT ENTRY CARD */}
          <div
            className="card-mess"
            style={{
              borderRadius: '14px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: 'var(--brand-green-subtle)',
                    color: 'var(--brand-green)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
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
                <Link
                  to="/admin/mess/today"
                  style={{
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
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={15} color="var(--brand-green)" /> Today's Menu
                  </span>
                  <ArrowRight size={14} color="#94a3b8" />
                </Link>

                <Link
                  to="/admin/mess/weekly"
                  style={{
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
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CalendarDays size={15} color="var(--brand-green)" /> Weekly Menu
                  </span>
                  <ArrowRight size={14} color="#94a3b8" />
                </Link>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <Link
                  to="/admin/mess/schedule"
                  style={{
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
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={15} color="var(--brand-green)" /> Meal Schedule
                  </span>
                  <ArrowRight size={14} color="#94a3b8" />
                </Link>

                <Link
                  to="/admin/mess/announcements"
                  style={{
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
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Megaphone size={15} color="var(--brand-green)" /> Announcements
                  </span>
                  <ArrowRight size={14} color="#94a3b8" />
                </Link>
              </div>

              <Link
                to="/admin/mess"
                style={{
                  marginTop: '6px',
                  padding: '10px',
                  borderRadius: '8px',
                  background: 'var(--brand-green)',
                  color: '#ffffff',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                Open Mess Overview <ArrowRight size={16} />
              </Link>
            </div>
          </div>

          {/* MAINTENANCE MANAGEMENT ENTRY CARD */}
          <div
            className="card-maint"
            style={{
              borderRadius: '14px',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div
                  style={{
                    width: '38px',
                    height: '38px',
                    borderRadius: '10px',
                    background: 'var(--brand-yellow-subtle)',
                    color: 'var(--maint-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
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
                Track complaints across Electrical, Plumbing, Carpentry, and General. Assign contractors, verify progress, and record resolution notes.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <Link
                  to="/admin/maintenance/tickets"
                  style={{
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
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <TicketIcon size={15} color="var(--maint-primary)" /> View Tickets
                  </span>
                  <ArrowRight size={14} color="#94a3b8" />
                </Link>

                <Link
                  to="/admin/maintenance/resolution"
                  style={{
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
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={15} color="var(--maint-primary)" /> Resolution
                  </span>
                  <ArrowRight size={14} color="#94a3b8" />
                </Link>
              </div>

              <Link
                to="/admin/maintenance/categories"
                style={{
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
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <FolderKanban size={15} color="var(--maint-primary)" /> Categories Breakdown
                </span>
                <ArrowRight size={14} color="#94a3b8" />
              </Link>

              <Link
                to="/admin/maintenance"
                style={{
                  marginTop: '6px',
                  padding: '10px',
                  borderRadius: '8px',
                  background: 'var(--maint-primary)',
                  color: '#ffffff',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  textAlign: 'center',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px'
                }}
              >
                Open Maintenance Overview <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Table */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid var(--neutral-border)',
          borderRadius: '14px',
          padding: '24px',
          boxShadow: 'var(--shadow-xs)'
        }}
      >
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
                    <td>{t.block} - {t.room}</td>
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
                          background: t.priority === 'Urgent' ? '#fef2f2' : t.priority === 'High' ? '#fffbeb' : '#f8fafc',
                          color: t.priority === 'Urgent' ? '#dc2626' : t.priority === 'High' ? '#d97706' : '#64748b'
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
                            t.status === 'Resolved' ? '#dcfce7' : t.status === 'In Progress' ? '#dbeafe' : '#fef3c7',
                          color:
                            t.status === 'Resolved' ? '#15803d' : t.status === 'In Progress' ? '#1d4ed8' : '#b45309'
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
