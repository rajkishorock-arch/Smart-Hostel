import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppLayout } from '../../components/layout/AppLayout';
import { useAuth } from '../../context/AuthContext';
import { Ticket, RoomRecord, Announcement, WeeklyMessMenu, AppNotification } from '../../types';
import {
  subscribeTickets,
  getStoredRooms,
  subscribeAnnouncements,
  getStoredMealSchedule,
  subscribeMessMenu
} from '../../services/storageService';
import { subscribeNotifications } from '../../services/notificationService';
import { LodgeTicketModal } from '../../components/resident/LodgeTicketModal';
import {
  DoorOpen,
  UtensilsCrossed,
  Wrench,
  Clock,
  ArrowRight,
  Megaphone,
  PlusCircle,
  AlertTriangle,
  CheckCircle2,
  Bed,
  Building2,
  CalendarDays,
  Coffee,
  Sun,
  Cookie,
  Moon,
  Layers,
  Check,
  FileText,
  Users,
  Bell,
  Sparkles,
  Bot
} from 'lucide-react';

export const ResidentOverviewPage: React.FC = () => {
  const { user } = useAuth();
  const location = useLocation();
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [rooms, setRooms] = useState<RoomRecord[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [todayMeal, setTodayMeal] = useState<string>('Standard Mess Timings Active');
  const [messMenu, setMessMenu] = useState<WeeklyMessMenu | null>(null);
  const [isLodgeModalOpen, setIsLodgeModalOpen] = useState(false);
  const [showWeeklyMenu, setShowWeeklyMenu] = useState(false);
  const [ticketStatusFilter, setTicketStatusFilter] = useState<'All' | 'Open' | 'In Progress' | 'Resolved'>('All');
  const [successBanner, setSuccessBanner] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(() => {
    return (location.state as any)?.error || null;
  });

  const todayDayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][new Date().getDay()];
  const currentDayMenu = messMenu ? messMenu[todayDayName] || messMenu['Monday'] : null;

  useEffect(() => {
    if ((location.state as any)?.error) {
      const timer = setTimeout(() => setToastMessage(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  useEffect(() => {
    if (!user) return;

    // Real-time tickets matching Firestore security rules (Resident UID scoped)
    const unsubTickets = subscribeTickets(
      all => setTickets(all),
      { role: 'resident', uid: user.uid }
    );

    // Published announcements only
    const unsubAnn = subscribeAnnouncements(all => setAnnouncements(all), true);

    // Real-time mess menu
    const unsubMenu = subscribeMessMenu(menu => setMessMenu(menu));

    // Real-time notifications for resident
    const unsubNotif = subscribeNotifications(
      { uid: user.uid, role: 'resident' },
      notifs => setNotifications(notifs)
    );

    setRooms(getStoredRooms());

    const schedule = getStoredMealSchedule();
    const active = schedule.find(s => s.status === 'Active') || schedule.find(s => s.status === 'Upcoming') || schedule[0];
    if (active) {
      setTodayMeal(`${active.meal} (${active.startTime} - ${active.endTime})`);
    }

    return () => {
      unsubTickets();
      unsubAnn();
      unsubMenu();
      unsubNotif();
    };
  }, [user]);

  const currentRoom = rooms.find(
    r => r.roomNumber === user?.roomNumber && r.block === user?.block
  );

  const roommates = currentRoom
    ? currentRoom.beds.filter(b => b.residentId && b.residentId !== user?.uid)
    : [];

  const openTickets = tickets.filter(t => t.status !== 'Resolved').length;

  return (
    <AppLayout
      activeDomain="resident"
      breadcrumbs={[{ label: 'Resident Portal Overview' }]}
    >
      {/* Toast Alert */}
      {toastMessage && (
        <div
          style={{
            padding: '12px 18px',
            borderRadius: '10px',
            marginBottom: '24px',
            background: '#fef2f2',
            color: '#dc2626',
            border: '1px solid #fecaca',
            fontSize: '0.88rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <AlertTriangle size={18} />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Banner */}
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
                color: 'var(--brand-blue)',
                background: 'var(--brand-blue-subtle)',
                padding: '3px 8px',
                borderRadius: '6px',
                textTransform: 'uppercase',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}
            >
              <DoorOpen size={14} /> Resident Workspace
            </span>
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
            Welcome, {user?.name || 'Resident'}
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: 'var(--neutral-muted)' }}>
            Your personal campus dashboard for hostel accommodation, daily mess menus, and maintenance tracking.
          </p>
        </div>

        <Link
          to="/resident/maintenance/report"
          style={{
            padding: '10px 18px',
            borderRadius: '8px',
            border: 'none',
            background: 'var(--brand-blue)',
            color: '#ffffff',
            fontSize: '0.86rem',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <PlusCircle size={16} /> Report Maintenance Issue
        </Link>
      </div>

      {/* Summary KPI Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}
      >
        {/* My Room Info */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid var(--neutral-border)',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: 'var(--shadow-xs)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--neutral-muted)', textTransform: 'uppercase' }}>
              My Allocation
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: 'var(--brand-blue-subtle)', color: 'var(--brand-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <DoorOpen size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: user?.roomNumber ? 'var(--brand-blue)' : '#d97706' }}>
            {user?.roomNumber ? `Room ${user.roomNumber}` : 'Pending'}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--neutral-muted)', marginTop: '4px' }}>
            {user?.roomNumber ? `${user.block || 'Block A'} • ${user.bedNumber || 'Bed 1'}` : 'Awaiting Warden Allocation'}
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--neutral-muted)', textTransform: 'uppercase' }}>
              Next Meal Service
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: 'var(--brand-green-subtle)', color: 'var(--mess-accent)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <UtensilsCrossed size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--neutral-dark)' }}>
            {todayMeal.split('(')[0]}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--neutral-muted)', marginTop: '4px' }}>
            {todayMeal.includes('(') ? todayMeal.split('(')[1].replace(')', '') : 'Ground Floor Mess'}
          </div>
        </div>

        {/* My Open Tickets */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid var(--neutral-border)',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: 'var(--shadow-xs)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--neutral-muted)', textTransform: 'uppercase' }}>
              My Active Tickets
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: 'var(--brand-yellow-subtle)', color: 'var(--maint-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Wrench size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: openTickets > 0 ? 'var(--maint-primary)' : '#16a34a' }}>
            {openTickets} Open
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--neutral-muted)', marginTop: '4px' }}>
            {tickets.length} total tickets submitted
          </div>
        </div>

        {/* Campus Broadcasts */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid var(--neutral-border)',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: 'var(--shadow-xs)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--neutral-muted)', textTransform: 'uppercase' }}>
              Campus Notices
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '6px', background: 'var(--brand-purple-subtle)', color: 'var(--brand-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Megaphone size={16} />
            </div>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--brand-purple)' }}>
            {announcements.length}
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--neutral-muted)', marginTop: '4px' }}>
            Active verified announcements
          </div>
        </div>
      </div>

      {/* Success Feedback Banner */}
      {successBanner && (
        <div
          style={{
            padding: '12px 18px',
            borderRadius: '10px',
            marginBottom: '24px',
            background: '#ecfdf5',
            color: '#065f46',
            border: '1px solid #a7f3d0',
            fontSize: '0.88rem',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <CheckCircle2 size={18} />
          <span>{successBanner}</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* SECTION A: MY HOSTEL                                         */}
      {/* ============================================================ */}
      <div
        className="card-hostel"
        style={{
          borderRadius: '16px',
          padding: '24px 28px',
          marginBottom: '28px',
          background: '#ffffff'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
                My Hostel &amp; Accommodation Details
              </h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--neutral-muted)' }}>
                Official resident room assignment and residency specifications
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Link
              to="/resident/allocation"
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                background: 'var(--brand-blue)',
                color: '#ffffff',
                fontSize: '0.82rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <FileText size={15} /> Allocation Slip
            </Link>
          </div>
        </div>

        {/* 5 Core Attributes Required by Rules: Room Number, Block, Floor, Bed, Occupancy Status */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '16px',
            background: '#f8fafc',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid var(--neutral-border)'
          }}
        >
          <div>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--neutral-muted)', textTransform: 'uppercase' }}>
              Room Number
            </span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--brand-blue)', marginTop: '4px' }}>
              Room {user?.roomNumber || '204'}
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--neutral-muted)', marginTop: '2px' }}>
              Standard Resident Quarters
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--neutral-muted)', textTransform: 'uppercase' }}>
              Block
            </span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--neutral-dark)', marginTop: '4px' }}>
              {user?.block || 'Block A'}
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--neutral-muted)', marginTop: '2px' }}>
              {user?.hostel || 'Aravali Residence Hall'}
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--neutral-muted)', textTransform: 'uppercase' }}>
              Floor
            </span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--neutral-dark)', marginTop: '4px' }}>
              {currentRoom ? `${currentRoom.floor}${currentRoom.floor === 1 ? 'st' : currentRoom.floor === 2 ? 'nd' : currentRoom.floor === 3 ? 'rd' : 'th'} Floor` : '2nd Floor'}
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--neutral-muted)', marginTop: '2px' }}>
              Elevator &amp; Stairway Accessible
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--neutral-muted)', textTransform: 'uppercase' }}>
              Bed Assignment
            </span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--brand-blue)', marginTop: '4px' }}>
              {user?.bedNumber || 'Bed 2'}
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--neutral-muted)', marginTop: '2px' }}>
              Assigned Verified Bed
            </div>
          </div>

          <div>
            <span style={{ fontSize: '0.74rem', fontWeight: 700, color: 'var(--neutral-muted)', textTransform: 'uppercase' }}>
              Occupancy Status
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
              <span
                style={{
                  fontSize: '0.84rem',
                  fontWeight: 800,
                  padding: '4px 10px',
                  borderRadius: '12px',
                  background: '#dcfce7',
                  color: '#15803d'
                }}
              >
                ● {currentRoom ? `${currentRoom.occupied} / ${currentRoom.capacity} Beds Allocated` : '2 / 2 Beds (Full)'}
              </span>
            </div>
            <div style={{ fontSize: '0.74rem', color: 'var(--neutral-muted)', marginTop: '4px' }}>
              {currentRoom && currentRoom.occupied >= currentRoom.capacity ? 'Fully Occupied' : 'Allocated Active'}
            </div>
          </div>
        </div>

        {/* Roommates Roster (Requirement 7: Room, Bed, Roommates) */}
        <div style={{ marginTop: '16px', padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid var(--neutral-border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
            <Users size={16} color="var(--brand-blue)" />
            <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--neutral-dark)', textTransform: 'uppercase' }}>
              {user?.roomNumber ? `Roommates in Room ${user.roomNumber}` : 'Roommates Roster (Unassigned)'}
            </span>
          </div>
          {roommates.length === 0 ? (
            <div style={{ fontSize: '0.82rem', color: 'var(--neutral-muted)' }}>
              No other roommate is currently assigned to this room.
            </div>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              {roommates.map(m => (
                <div
                  key={m.bedNumber}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '8px',
                    background: '#ffffff',
                    border: '1px solid var(--neutral-border)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span style={{ fontSize: '0.72rem', fontWeight: 800, background: 'var(--brand-blue-subtle)', color: 'var(--brand-blue)', padding: '2px 6px', borderRadius: '4px' }}>
                    {m.bedNumber}
                  </span>
                  <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--neutral-dark)' }}>
                    {m.residentName || 'Resident Student'}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ============================================================ */}
      {/* SECTION B: SMART MESS                                        */}
      {/* ============================================================ */}
      <div
        className="card-mess"
        style={{
          borderRadius: '16px',
          padding: '24px 28px',
          marginBottom: '28px',
          background: '#ffffff'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'var(--brand-green-subtle)',
                color: 'var(--mess-accent)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <UtensilsCrossed size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
                Smart Mess — Today's Dining Menu ({todayDayName})
              </h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--neutral-muted)' }}>
                Freshly prepared balanced nutrition published by Central Catering
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              onClick={() => setShowWeeklyMenu(!showWeeklyMenu)}
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                background: showWeeklyMenu ? 'var(--neutral-dark)' : 'var(--mess-accent)',
                color: '#ffffff',
                border: 'none',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <CalendarDays size={15} /> {showWeeklyMenu ? 'Hide Weekly Menu' : 'View Weekly Menu'}
            </button>
            <Link
              to="/resident/mess/weekly"
              style={{
                padding: '8px 14px',
                borderRadius: '8px',
                background: '#f8fafc',
                border: '1px solid var(--neutral-border)',
                color: 'var(--neutral-dark)',
                fontSize: '0.82rem',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              Full Timetable <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* 4 Daily Meal Courses: Breakfast, Lunch, Snacks, Dinner */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '16px',
            marginBottom: showWeeklyMenu ? '24px' : '0'
          }}
        >
          {/* Breakfast */}
          <div
            style={{
              padding: '16px',
              borderRadius: '12px',
              background: '#f8fafc',
              border: '1px solid var(--neutral-border)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#b45309', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Coffee size={16} /> Breakfast
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--neutral-muted)', background: '#ffffff', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--neutral-border)' }}>
                {currentDayMenu?.breakfast.timing || '07:30 - 09:30'}
              </span>
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--neutral-dark)', lineHeight: 1.4 }}>
              {currentDayMenu?.breakfast.items || 'Idli, Medu Vada, Sambar, Fresh Chutney, Tea & Coffee'}
            </div>
          </div>

          {/* Lunch */}
          <div
            style={{
              padding: '16px',
              borderRadius: '12px',
              background: '#f8fafc',
              border: '1px solid var(--neutral-border)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#15803d', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Sun size={16} /> Lunch
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--neutral-muted)', background: '#ffffff', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--neutral-border)' }}>
                {currentDayMenu?.lunch.timing || '12:30 - 14:30'}
              </span>
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--neutral-dark)', lineHeight: 1.4 }}>
              {currentDayMenu?.lunch.items || 'Paneer Butter Masala, Dal Tadka, Jeera Rice, Chapati, Salad & Curd'}
            </div>
          </div>

          {/* Snacks */}
          <div
            style={{
              padding: '16px',
              borderRadius: '12px',
              background: '#f8fafc',
              border: '1px solid var(--neutral-border)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#d97706', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Cookie size={16} /> Snacks
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--neutral-muted)', background: '#ffffff', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--neutral-border)' }}>
                {currentDayMenu?.snacks.timing || '17:00 - 18:00'}
              </span>
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--neutral-dark)', lineHeight: 1.4 }}>
              {currentDayMenu?.snacks.items || 'Veg Cutlet, Green Chutney, Tea, Coffee & Bournvita'}
            </div>
          </div>

          {/* Dinner */}
          <div
            style={{
              padding: '16px',
              borderRadius: '12px',
              background: '#f8fafc',
              border: '1px solid var(--neutral-border)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#4338ca', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Moon size={16} /> Dinner
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--neutral-muted)', background: '#ffffff', padding: '2px 6px', borderRadius: '4px', border: '1px solid var(--neutral-border)' }}>
                {currentDayMenu?.dinner.timing || '19:30 - 21:30'}
              </span>
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--neutral-dark)', lineHeight: 1.4 }}>
              {currentDayMenu?.dinner.items || 'Mixed Vegetable Curry, Yellow Dal, Phulka, Steamed Rice, Gulab Jamun'}
            </div>
          </div>
        </div>

        {/* Weekly Menu Expanded Panel */}
        {showWeeklyMenu && messMenu && (
          <div
            style={{
              padding: '20px',
              borderRadius: '12px',
              background: '#fafbfc',
              border: '1px solid var(--neutral-border)'
            }}
          >
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--neutral-dark)', marginBottom: '14px' }}>
              Complete 7-Day Weekly Culinary Planner
            </h3>
            <div className="pro-table-wrapper">
              <table className="pro-table">
                <thead>
                  <tr>
                    <th>Day</th>
                    <th>Breakfast</th>
                    <th>Lunch</th>
                    <th>Snacks</th>
                    <th>Dinner</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(messMenu).map(([day, dMenu]) => (
                    <tr key={day} style={{ background: day === todayDayName ? '#f0fdf4' : undefined }}>
                      <td style={{ fontWeight: 800, color: day === todayDayName ? 'var(--mess-accent)' : undefined }}>
                        {day} {day === todayDayName && '(Today)'}
                      </td>
                      <td style={{ fontSize: '0.84rem' }}>{dMenu.breakfast.items}</td>
                      <td style={{ fontSize: '0.84rem' }}>{dMenu.lunch.items}</td>
                      <td style={{ fontSize: '0.84rem' }}>{dMenu.snacks.items}</td>
                      <td style={{ fontSize: '0.84rem' }}>{dMenu.dinner.items}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* SECTION C: MAINTENANCE & ISSUE REPORTING                     */}
      {/* ============================================================ */}
      <div
        className="card-maint"
        style={{
          borderRadius: '16px',
          padding: '24px 28px',
          marginBottom: '28px',
          background: '#ffffff'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
                Room Maintenance &amp; Repair Desk
              </h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--neutral-muted)' }}>
                Report infrastructure issues and track live warden resolution updates
              </span>
            </div>
          </div>

          <button
            onClick={() => setIsLodgeModalOpen(true)}
            style={{
              padding: '10px 18px',
              borderRadius: '8px',
              border: 'none',
              background: 'var(--maint-primary)',
              color: '#ffffff',
              fontSize: '0.86rem',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              boxShadow: '0 2px 4px rgba(217, 119, 6, 0.2)'
            }}
          >
            <PlusCircle size={16} /> Report Issue
          </button>
        </div>

        {/* Filter Pills: All, Open, In Progress, Resolved */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '18px' }}>
          {(['All', 'Open', 'In Progress', 'Resolved'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setTicketStatusFilter(tab)}
              style={{
                padding: '6px 14px',
                borderRadius: '20px',
                border: '1px solid var(--neutral-border)',
                background: ticketStatusFilter === tab ? 'var(--neutral-dark)' : '#ffffff',
                color: ticketStatusFilter === tab ? '#ffffff' : 'var(--neutral-dark)',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              {tab} {tab === 'All' ? `(${tickets.length})` : `(${tickets.filter(t => t.status === tab).length})`}
            </button>
          ))}
        </div>

        {/* Resident's Tickets List (Scoped to Resident UID) */}
        {tickets.filter(t => ticketStatusFilter === 'All' || t.status === ticketStatusFilter).length === 0 ? (
          <div
            style={{
              padding: '32px',
              textAlign: 'center',
              background: '#f8fafc',
              borderRadius: '12px',
              border: '1px dashed var(--neutral-border)'
            }}
          >
            <Wrench size={32} color="#94a3b8" style={{ margin: '0 auto 10px auto' }} />
            <h4 style={{ margin: '0 0 4px 0', color: 'var(--neutral-dark)' }}>No maintenance tickets found</h4>
            <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--neutral-muted)' }}>
              Click the "Report Issue" button above to lodge an electrical, plumbing, carpentry, or general repair request.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {tickets
              .filter(t => ticketStatusFilter === 'All' || t.status === ticketStatusFilter)
              .map(t => (
                <div
                  key={t.id}
                  style={{
                    padding: '16px 20px',
                    borderRadius: '12px',
                    border: '1px solid var(--neutral-border)',
                    background: '#ffffff',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--neutral-dark)' }}>
                        #{t.id}
                      </span>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '6px',
                          background: '#f1f5f9',
                          color: '#334155'
                        }}
                      >
                        {t.category}
                      </span>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '6px',
                          background: t.priority === 'Urgent' ? '#fef2f2' : t.priority === 'High' ? '#fffbeb' : '#f8fafc',
                          color: t.priority === 'Urgent' ? '#dc2626' : t.priority === 'High' ? '#d97706' : '#64748b'
                        }}
                      >
                        {t.priority} Priority
                      </span>
                    </div>

                    {/* Status Pill: Open, In Progress, Resolved */}
                    <span
                      style={{
                        fontSize: '0.76rem',
                        fontWeight: 800,
                        padding: '4px 12px',
                        borderRadius: '12px',
                        background:
                          t.status === 'Resolved' ? '#dcfce7' : t.status === 'In Progress' ? '#dbeafe' : '#fef3c7',
                        color:
                          t.status === 'Resolved' ? '#15803d' : t.status === 'In Progress' ? '#1d4ed8' : '#b45309'
                      }}
                    >
                      ● {t.status}
                    </span>
                  </div>

                  <p style={{ margin: 0, fontSize: '0.88rem', color: '#334155', lineHeight: 1.5 }}>
                    {t.description}
                  </p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.76rem', color: 'var(--neutral-muted)', borderTop: '1px solid #f1f5f9', paddingTop: '8px' }}>
                    <span>Location: {t.block} - Room {t.room}</span>
                    <span>Reported: {new Date(t.createdAt).toLocaleDateString()}</span>
                  </div>

                  {t.wardenNotes && (
                    <div
                      style={{
                        padding: '8px 12px',
                        borderRadius: '8px',
                        background: '#f0fdf4',
                        border: '1px solid #bbf7d0',
                        fontSize: '0.8rem',
                        color: '#166534'
                      }}
                    >
                      <strong>Warden Note:</strong> {t.wardenNotes}
                    </div>
                  )}
                </div>
              ))}
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* SECTION D: UPDATES (Latest Notifications)                    */}
      {/* ============================================================ */}
      <div
        className="card-updates"
        style={{
          borderRadius: '16px',
          padding: '24px 28px',
          marginBottom: '28px',
          background: '#ffffff',
          border: '1px solid var(--neutral-border)',
          boxShadow: 'var(--shadow-xs)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: '#eff6ff',
                color: '#2563eb',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Bell size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
                Updates &amp; Live Alerts
              </h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--neutral-muted)' }}>
                Real-time notifications regarding room allocations, ticket changes, and hostel operations
              </span>
            </div>
          </div>
          {notifications.filter(n => !n.read).length > 0 && (
            <span style={{ fontSize: '0.75rem', fontWeight: 800, background: '#fee2e2', color: '#dc2626', padding: '3px 8px', borderRadius: '6px' }}>
              {notifications.filter(n => !n.read).length} Unread
            </span>
          )}
        </div>

        {notifications.length === 0 ? (
          <div style={{ padding: '28px', textAlign: 'center', color: 'var(--neutral-muted)', background: '#f8fafc', borderRadius: '12px', border: '1px dashed var(--neutral-border)' }}>
            <Bell size={28} style={{ opacity: 0.3, margin: '0 auto 8px' }} />
            <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>No notifications yet</div>
            <div style={{ fontSize: '0.74rem', marginTop: '2px' }}>Real-time updates regarding your tickets and room will appear here.</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {notifications.slice(0, 4).map(n => {
              const isCrit = n.priority === 'Critical' || n.type === 'critical';
              const isHigh = n.priority === 'High';
              return (
                <div
                  key={n.id}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '10px',
                    background: isCrit ? '#fef2f2' : (n.read ? '#ffffff' : '#f8faff'),
                    border: `1px solid ${isCrit ? '#fecaca' : (n.read ? '#f1f5f9' : '#e0e7ff')}`,
                    borderLeft: isCrit ? '4px solid #ef4444' : isHigh ? '4px solid #f59e0b' : (n.read ? '4px solid transparent' : '4px solid #3b82f6'),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ fontSize: '0.84rem', fontWeight: 700, color: isCrit ? '#b91c1c' : 'var(--neutral-dark)' }}>
                        {n.title}
                      </span>
                      {n.priority && (
                        <span style={{ fontSize: '0.62rem', fontWeight: 800, padding: '1px 5px', borderRadius: '4px', background: isCrit ? '#fee2e2' : isHigh ? '#fef3c7' : '#f1f5f9', color: isCrit ? '#991b1b' : isHigh ? '#92400e' : '#64748b' }}>
                          {n.priority}
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: isCrit ? '#7f1d1d' : 'var(--neutral-muted)', marginTop: '2px' }}>
                      {n.message}
                    </div>
                  </div>
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8', flexShrink: 0 }}>
                    {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* SECTION E: IMPORTANT (Active Notices)                        */}
      {/* ============================================================ */}
      <div
        className="card-notices"
        style={{
          borderRadius: '16px',
          padding: '24px 28px',
          marginBottom: '28px',
          background: '#ffffff',
          border: '1px solid var(--neutral-border)',
          boxShadow: 'var(--shadow-xs)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: 'var(--brand-purple-subtle)',
                color: 'var(--brand-purple)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Megaphone size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
                Important Hostel Notices
              </h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--neutral-muted)' }}>
                Official campus directives, mess timings, and administrative bulletins
              </span>
            </div>
          </div>
          <Link
            to="/resident/announcements"
            style={{
              fontSize: '0.82rem',
              color: 'var(--brand-purple)',
              fontWeight: 700,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}
          >
            View All ({announcements.length}) <ArrowRight size={14} />
          </Link>
        </div>

        {announcements.length === 0 ? (
          <div style={{ padding: '28px', textAlign: 'center', color: 'var(--neutral-muted)', background: '#f8fafc', borderRadius: '12px', border: '1px dashed var(--neutral-border)' }}>
            <Megaphone size={28} style={{ opacity: 0.3, margin: '0 auto 8px' }} />
            <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>No active notices</div>
            <div style={{ fontSize: '0.74rem', marginTop: '2px' }}>Campus administrative notices will appear on this board.</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '14px' }}>
            {announcements.slice(0, 3).map(a => {
              const isUrgent = a.priority === 'Critical' || a.priority === 'High';
              return (
                <div
                  key={a.id}
                  style={{
                    padding: '16px',
                    borderRadius: '12px',
                    background: isUrgent ? '#fffaf5' : '#f8fafc',
                    border: `1px solid ${isUrgent ? '#fed7aa' : 'var(--neutral-border)'}`,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    gap: '10px'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span
                        style={{
                          fontSize: '0.68rem',
                          fontWeight: 800,
                          padding: '2px 6px',
                          borderRadius: '4px',
                          background: isUrgent ? '#fee2e2' : '#e0e7ff',
                          color: isUrgent ? '#b91c1c' : '#4338ca',
                          textTransform: 'uppercase'
                        }}
                      >
                        {a.priority || 'Notice'} • {a.category}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                        {new Date(a.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h4 style={{ margin: '0 0 6px 0', fontSize: '0.92rem', fontWeight: 800, color: 'var(--neutral-dark)' }}>
                      {a.title}
                    </h4>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--neutral-muted)', lineHeight: 1.4 }}>
                      {a.content}
                    </p>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#94a3b8', borderTop: '1px solid #f1f5f9', paddingTop: '8px' }}>
                    Author: {a.author}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* SECTION F: SMART HELP (AI Assistant Quick Prompts)           */}
      {/* ============================================================ */}
      <div
        className="card-smarthelp"
        style={{
          borderRadius: '16px',
          padding: '24px 28px',
          marginBottom: '28px',
          background: 'linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 100%)',
          border: '1px solid #bae6fd',
          boxShadow: 'var(--shadow-xs)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '10px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '10px',
                background: '#0284c7',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Bot size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0369a1', margin: 0 }}>
                SmartHelp Copilot
              </h2>
              <span style={{ fontSize: '0.78rem', color: '#0284c7' }}>
                Ask instant natural queries about your room, mess menu, ticket status, and campus safety
              </span>
            </div>
          </div>
          <span style={{ fontSize: '0.72rem', background: '#ffffff', color: '#0284c7', fontWeight: 700, padding: '4px 10px', borderRadius: '20px', border: '1px solid #bae6fd' }}>
            Available 24/7 (Floating in bottom-right)
          </span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {[
            'Which room am I in?',
            'Who are my roommates?',
            "What's today's mess?",
            'Show my pending complaints.',
            'What happened to my complaint?',
            'Are there any important notices?',
            'What should I do if my fan is sparking?'
          ].map(sampleQ => (
            <button
              key={sampleQ}
              onClick={() => {
                const triggerBtn = document.getElementById('ai-assistant-toggle-btn');
                if (triggerBtn) triggerBtn.click();
              }}
              style={{
                padding: '7px 13px',
                borderRadius: '20px',
                background: '#ffffff',
                border: '1px solid #bae6fd',
                color: '#0369a1',
                fontSize: '0.78rem',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
              }}
            >
              <Sparkles size={12} color="#0284c7" />
              {sampleQ}
            </button>
          ))}
        </div>
      </div>

      {/* Lodge Ticket Modal */}
      {user && (
        <LodgeTicketModal
          user={user}
          isOpen={isLodgeModalOpen}
          onClose={() => setIsLodgeModalOpen(false)}
          onSuccess={newTkt => {
            setSuccessBanner(`Ticket #${newTkt.id} successfully created and synchronized to Cloud Firestore!`);
            setTimeout(() => setSuccessBanner(null), 5000);
          }}
        />
      )}
    </AppLayout>
  );
};
