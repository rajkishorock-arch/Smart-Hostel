import React, { useState, useEffect } from 'react';
import { NavLink, Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Building2,
  DoorOpen,
  KeyRound,
  Users,
  Layers,
  UtensilsCrossed,
  CalendarDays,
  Clock,
  Megaphone,
  Wrench,
  Ticket as TicketIcon,
  CheckCircle2,
  FolderKanban,
  UserCheck,
  LogOut,
  Menu,
  X,
  ShieldCheck,
  FileText,
  PlusCircle,
  ChevronRight,
  Bell,
  Home,
  Search,
  TrendingUp,
  BarChart3,
  Sun,
  Moon,
  CreditCard,
  Radio,
  Truck
} from 'lucide-react';
import { SmartHostelAIAssistant } from '../common/SmartHostelAIAssistant';
import { NotificationBell } from '../common/NotificationBell';
import { GlobalSearchModal } from '../common/GlobalSearchModal';

interface AppLayoutProps {
  children: React.ReactNode;
  activeDomain?: 'dashboard' | 'hostel' | 'mess' | 'maintenance' | 'resident';
  breadcrumbs?: { label: string; href?: string }[];
}

export const AppLayout: React.FC<AppLayoutProps> = ({
  children,
  activeDomain = 'dashboard',
  breadcrumbs = []
}) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  // Synchronize dark theme attribute
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  // Global search shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isWarden = user?.role === 'warden';

  const closeMobile = () => setIsMobileOpen(false);

  return (
    <div className="portal-layout">
      {/* Mobile Backdrop */}
      <div
        className={`portal-backdrop ${isMobileOpen ? 'open' : ''}`}
        onClick={closeMobile}
      />

      {/* Sidebar */}
      <aside className={`portal-sidebar ${isMobileOpen ? 'open' : ''}`}>
        {/* Brand Header */}
        <div
          style={{
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 20px',
            borderBottom: '1px solid var(--neutral-border)'
          }}
        >
          <Link
            to={isWarden ? '/admin/dashboard' : '/dashboard'}
            onClick={closeMobile}
            style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
          >
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                background: isWarden ? 'var(--brand-purple)' : 'var(--brand-blue)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}
            >
              {isWarden ? <ShieldCheck size={20} /> : <Home size={18} />}
            </div>
            <div>
              <div style={{ fontSize: '0.96rem', fontWeight: 800, color: 'var(--neutral-dark)', lineHeight: 1.1 }}>
                SmartHostel
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--neutral-muted)', fontWeight: 600 }}>
                {isWarden ? 'Warden Administration' : 'Resident Portal'}
              </div>
            </div>
          </Link>

          <button
            onClick={closeMobile}
            style={{
              display: 'none',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: 'var(--neutral-muted)'
            }}
            className="mobile-close-btn"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation List */}
        <div style={{ flex: 1, padding: '16px 0', overflowY: 'auto' }}>
          {isWarden ? (
            <>
              {/* WARDEN NAVIGATION (Competition Spec Section 8) */}
              <div className="sidebar-nav-section">Operations</div>
              <NavLink
                to="/admin/dashboard"
                end
                className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMobile}
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </NavLink>

              <div className="sidebar-nav-section" style={{ marginTop: '16px' }}>Hostel Management</div>
              <NavLink
                to="/admin/hostel"
                end
                className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active accent-hostel' : ''}`}
                onClick={closeMobile}
              >
                <Building2 size={18} color={location.pathname === '/admin/hostel' ? 'var(--brand-blue)' : undefined} />
                <span>Hostel</span>
              </NavLink>
              <NavLink
                to="/admin/hostel/residents"
                className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active accent-hostel' : ''}`}
                onClick={closeMobile}
              >
                <Users size={18} color={location.pathname.startsWith('/admin/hostel/residents') ? 'var(--brand-blue)' : undefined} />
                <span>Residents</span>
              </NavLink>
              <NavLink
                to="/admin/hostel/allocation"
                className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active accent-hostel' : ''}`}
                onClick={closeMobile}
              >
                <KeyRound size={18} color={location.pathname.startsWith('/admin/hostel/allocation') ? 'var(--brand-blue)' : undefined} />
                <span>Rooms &amp; Allocation</span>
              </NavLink>
              <NavLink
                to="/admin/hostel/rooms"
                className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active accent-hostel' : ''}`}
                onClick={closeMobile}
                style={{ paddingLeft: '28px', fontSize: '0.82rem' }}
              >
                <DoorOpen size={16} />
                <span>Room Inventory</span>
              </NavLink>
              <NavLink
                to="/admin/hostel/blocks"
                className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active accent-hostel' : ''}`}
                onClick={closeMobile}
                style={{ paddingLeft: '28px', fontSize: '0.82rem' }}
              >
                <Layers size={16} />
                <span>Blocks &amp; Floors</span>
              </NavLink>

              <div className="sidebar-nav-section" style={{ marginTop: '16px' }}>Catering</div>
              <NavLink
                to="/admin/mess"
                end
                className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active accent-mess' : ''}`}
                onClick={closeMobile}
              >
                <UtensilsCrossed size={18} color={location.pathname === '/admin/mess' ? 'var(--mess-accent)' : undefined} />
                <span>Smart Mess</span>
              </NavLink>
              <NavLink
                to="/admin/mess/weekly"
                className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active accent-mess' : ''}`}
                onClick={closeMobile}
                style={{ paddingLeft: '28px', fontSize: '0.82rem' }}
              >
                <CalendarDays size={16} />
                <span>Weekly Menu Editor</span>
              </NavLink>
              <NavLink
                to="/admin/mess/today"
                className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active accent-mess' : ''}`}
                onClick={closeMobile}
                style={{ paddingLeft: '28px', fontSize: '0.82rem' }}
              >
                <Clock size={16} />
                <span>Today's Menu</span>
              </NavLink>
              <NavLink
                to="/admin/mess/schedule"
                className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active accent-mess' : ''}`}
                onClick={closeMobile}
                style={{ paddingLeft: '28px', fontSize: '0.82rem' }}
              >
                <Clock size={16} />
                <span>Meal Schedule</span>
              </NavLink>
              <NavLink
                to="/admin/mess/announcements"
                className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active accent-mess' : ''}`}
                onClick={closeMobile}
                style={{ paddingLeft: '28px', fontSize: '0.82rem' }}
              >
                <Megaphone size={16} />
                <span>Announcements</span>
              </NavLink>

              <div className="sidebar-nav-section" style={{ marginTop: '16px' }}>Maintenance Desk</div>
              <NavLink
                to="/admin/maintenance/resolution"
                className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active accent-maint' : ''}`}
                onClick={closeMobile}
              >
                <CheckCircle2 size={18} color={location.pathname.startsWith('/admin/maintenance/resolution') ? 'var(--maint-primary)' : undefined} />
                <span>Maintenance</span>
              </NavLink>
              <NavLink
                to="/admin/maintenance/tickets"
                className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active accent-maint' : ''}`}
                onClick={closeMobile}
                style={{ paddingLeft: '28px', fontSize: '0.82rem' }}
              >
                <TicketIcon size={16} />
                <span>All Tickets Queue</span>
              </NavLink>
              <NavLink
                to="/admin/maintenance/categories"
                className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active accent-maint' : ''}`}
                onClick={closeMobile}
                style={{ paddingLeft: '28px', fontSize: '0.82rem' }}
              >
                <FolderKanban size={16} />
                <span>Categories</span>
              </NavLink>
              <NavLink
                to="/admin/maintenance/preventive"
                className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active accent-maint' : ''}`}
                onClick={closeMobile}
                style={{ paddingLeft: '28px', fontSize: '0.82rem' }}
              >
                <Wrench size={16} />
                <span>Preventive Assets</span>
              </NavLink>

              <div className="sidebar-nav-section" style={{ marginTop: '16px' }}>Intelligence &amp; Reports</div>
              <NavLink
                to="/admin/analytics/predictive"
                className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMobile}
              >
                <TrendingUp size={18} color={location.pathname === '/admin/analytics/predictive' ? 'var(--brand-purple)' : undefined} />
                <span>Predictive AI Engine</span>
              </NavLink>
              <NavLink
                to="/admin/analytics/reports"
                className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMobile}
              >
                <BarChart3 size={18} color={location.pathname === '/admin/analytics/reports' ? 'var(--brand-purple)' : undefined} />
                <span>Advanced Reports &amp; BI</span>
              </NavLink>

              <div className="sidebar-nav-section" style={{ marginTop: '16px' }}>Finance &amp; Smart Operations</div>
              <NavLink
                to="/admin/finance/billing"
                className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMobile}
              >
                <CreditCard size={18} color={location.pathname === '/admin/finance/billing' ? 'var(--brand-purple)' : undefined} />
                <span>Billing &amp; Payments</span>
              </NavLink>
              <NavLink
                to="/admin/iot/infrastructure"
                className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMobile}
              >
                <Radio size={18} color={location.pathname === '/admin/iot/infrastructure' ? 'var(--brand-purple)' : undefined} />
                <span>IoT Smart Telemetry</span>
              </NavLink>
              <NavLink
                to="/admin/vendors"
                className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMobile}
              >
                <Truck size={18} color={location.pathname === '/admin/vendors' ? 'var(--brand-purple)' : undefined} />
                <span>Vendors &amp; Supplies</span>
              </NavLink>
            </>
          ) : (
            <>
              {/* RESIDENT NAVIGATION (Competition Spec Section 8) */}
              <div className="sidebar-nav-section">Resident Portal</div>
              <NavLink
                to="/dashboard"
                end
                className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMobile}
              >
                <LayoutDashboard size={18} />
                <span>Dashboard</span>
              </NavLink>

              <div className="sidebar-nav-section" style={{ marginTop: '16px' }}>Hostel</div>
              <NavLink
                to="/resident/room"
                className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active accent-hostel' : ''}`}
                onClick={closeMobile}
              >
                <DoorOpen size={18} color={location.pathname.startsWith('/resident/room') ? 'var(--brand-blue)' : undefined} />
                <span>My Hostel</span>
              </NavLink>
              <NavLink
                to="/resident/allocation"
                className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active accent-hostel' : ''}`}
                onClick={closeMobile}
                style={{ paddingLeft: '28px', fontSize: '0.82rem' }}
              >
                <KeyRound size={16} />
                <span>Allocation Slip</span>
              </NavLink>

              <div className="sidebar-nav-section" style={{ marginTop: '16px' }}>Dining</div>
              <NavLink
                to="/resident/mess/today"
                className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active accent-mess' : ''}`}
                onClick={closeMobile}
              >
                <UtensilsCrossed size={18} color={location.pathname.startsWith('/resident/mess/today') ? 'var(--mess-accent)' : undefined} />
                <span>Smart Mess</span>
              </NavLink>
              <NavLink
                to="/resident/mess/weekly"
                className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active accent-mess' : ''}`}
                onClick={closeMobile}
                style={{ paddingLeft: '28px', fontSize: '0.82rem' }}
              >
                <CalendarDays size={16} />
                <span>Weekly Menu</span>
              </NavLink>
              <NavLink
                to="/resident/announcements"
                className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active accent-mess' : ''}`}
                onClick={closeMobile}
                style={{ paddingLeft: '28px', fontSize: '0.82rem' }}
              >
                <Megaphone size={16} />
                <span>Announcements</span>
              </NavLink>

              <div className="sidebar-nav-section" style={{ marginTop: '16px' }}>Support</div>
              <NavLink
                to="/resident/maintenance/tickets"
                className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active accent-maint' : ''}`}
                onClick={closeMobile}
              >
                <Wrench size={18} color={location.pathname.startsWith('/resident/maintenance') ? 'var(--maint-primary)' : undefined} />
                <span>Maintenance</span>
              </NavLink>
              <NavLink
                to="/resident/maintenance/report"
                className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active accent-maint' : ''}`}
                onClick={closeMobile}
                style={{ paddingLeft: '28px', fontSize: '0.82rem' }}
              >
                <PlusCircle size={16} />
                <span>Report Issue</span>
              </NavLink>

              <div className="sidebar-nav-section" style={{ marginTop: '16px' }}>Account</div>
              <NavLink
                to="/resident/profile"
                className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMobile}
              >
                <UserCheck size={18} />
                <span>Profile</span>
              </NavLink>
              <NavLink
                to="/resident/billing"
                className={({ isActive }) => `sidebar-nav-link ${isActive ? 'active' : ''}`}
                onClick={closeMobile}
              >
                <CreditCard size={18} />
                <span>Fees &amp; Payments</span>
              </NavLink>
            </>
          )}
        </div>

        {/* Sidebar Footer / User Profile & Logout */}
        <div
          style={{
            padding: '16px',
            borderTop: '1px solid var(--neutral-border)',
            background: '#fafbfc'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: isWarden ? '#e0e7ff' : '#dcfce7',
                  color: isWarden ? '#3730a3' : '#15803d',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  flexShrink: 0
                }}
              >
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div style={{ minWidth: 0 }}>
                <div
                  style={{
                    fontSize: '0.825rem',
                    fontWeight: 700,
                    color: 'var(--neutral-dark)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                  title={user?.name}
                >
                  {user?.name || (isWarden ? 'Chief Warden' : 'Resident')}
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--neutral-muted)' }}>
                  {isWarden ? 'Warden Admin' : `${user?.roomNumber ? `Room ${user.roomNumber}` : 'Resident'}`}
                </div>
              </div>
            </div>
          </div>

          <button
            id="portal-sign-out-btn"
            onClick={handleLogout}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid #fee2e2',
              background: '#fef2f2',
              color: '#dc2626',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'background 0.15s ease'
            }}
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <div className="portal-main">
        {/* Compact Header */}
        <header className="portal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMobileOpen(true)}
              style={{
                display: 'none',
                alignItems: 'center',
                justifyContent: 'center',
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                border: '1px solid var(--neutral-border)',
                background: '#ffffff',
                cursor: 'pointer'
              }}
              className="mobile-menu-toggle-btn"
              aria-label="Toggle Navigation"
            >
              <Menu size={18} />
            </button>

            {/* Breadcrumb Navigation */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}>
              <Link
                to={isWarden ? '/admin/dashboard' : '/dashboard'}
                style={{ color: 'var(--neutral-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '4px' }}
              >
                <span>{isWarden ? 'Admin' : 'Resident'}</span>
              </Link>
              {breadcrumbs.map((crumb, idx) => (
                <React.Fragment key={idx}>
                  <ChevronRight size={14} color="#94a3b8" />
                  {crumb.href ? (
                    <Link to={crumb.href} style={{ color: 'var(--neutral-muted)', textDecoration: 'none' }}>
                      {crumb.label}
                    </Link>
                  ) : (
                    <span style={{ fontWeight: 700, color: 'var(--neutral-dark)' }}>{crumb.label}</span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Right Header Badges & Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {/* Global Search trigger for Warden */}
            {isWarden && (
              <button
                id="global-search-btn"
                onClick={() => setIsSearchOpen(true)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--neutral-border)',
                  background: '#f8fafc',
                  color: 'var(--neutral-muted)',
                  fontSize: '0.78rem',
                  cursor: 'pointer',
                  fontWeight: 600
                }}
                title="Global Warden Search (Ctrl+K)"
              >
                <Search size={14} />
                <span className="search-label">Search...</span>
                <kbd
                  style={{
                    fontSize: '0.65rem',
                    background: '#ffffff',
                    border: '1px solid #cbd5e1',
                    borderRadius: '4px',
                    padding: '1px 4px',
                    color: '#64748b'
                  }}
                >
                  Ctrl K
                </kbd>
              </button>
            )}

            {/* Theme Toggle Button (Dark / Light Mode) */}
            <button
              id="theme-toggle-btn"
              onClick={() => setIsDarkMode(prev => !prev)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '34px',
                height: '34px',
                borderRadius: '8px',
                border: '1px solid var(--border-default)',
                background: isDarkMode ? '#334155' : '#f8fafc',
                color: isDarkMode ? '#facc15' : '#64748b',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle Theme"
            >
              {isDarkMode ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            {/* Real-time Notification Bell */}
            <NotificationBell />

            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: '20px',
                background: isWarden ? '#eff6ff' : '#ecfdf5',
                color: isWarden ? 'var(--brand-blue)' : 'var(--mess-accent)',
                border: `1px solid ${isWarden ? '#bfdbfe' : '#a7f3d0'}`
              }}
            >
              {isWarden ? '🛡️ Campus Authority' : '🎓 Enrolled Resident'}
            </span>

            <span
              style={{
                fontSize: '0.78rem',
                fontWeight: 600,
                color: 'var(--neutral-muted)',
                background: '#f8fafc',
                padding: '4px 10px',
                borderRadius: '8px',
                border: '1px solid var(--neutral-border)'
              }}
            >
              {user?.hostel || 'Aravali Hostel'}
            </span>
          </div>
        </header>

        {/* Workspace Content */}
        <main className="portal-workspace">{children}</main>

        {/* Floating Role-Aware SmartHostel AI Assistant */}
        <SmartHostelAIAssistant />

        {/* Global Search Modal */}
        <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      </div>
    </div>
  );
};
