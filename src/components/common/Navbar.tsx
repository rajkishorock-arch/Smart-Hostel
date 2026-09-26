import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Building2,
  UtensilsCrossed,
  Wrench,
  ShieldCheck,
  User,
  LogOut,
  Menu,
  X,
  Sparkles,
  Home
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, isAuthenticated, isWarden, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: 'rgba(255, 255, 255, 0.94)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border-subtle)'
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #4f46e5 0%, #312e81 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 4px 10px rgba(79, 70, 229, 0.3)'
            }}
          >
            <Building2 size={24} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#0f172a' }}>
                Smart<span style={{ color: '#4f46e5' }}>Hostel</span>
              </span>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  background: '#e0e7ff',
                  color: '#3730a3',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  textTransform: 'uppercase'
                }}
              >
                Campus Mess & Living
              </span>
            </div>
            <p style={{ fontSize: '0.725rem', color: '#64748b', fontWeight: 500, margin: 0 }}>
              Administration & Resident Portal
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'none', alignItems: 'center', gap: '28px' }} className="desktop-nav">
          <Link
            to="/"
            style={{
              fontSize: '0.925rem',
              fontWeight: 600,
              color: isActive('/') ? '#4f46e5' : '#334155',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Home size={16} /> Overview
          </Link>
          <a
            href="/#how-it-works"
            style={{ fontSize: '0.925rem', fontWeight: 600, color: '#334155' }}
          >
            How It Works
          </a>
          <a
            href="/#mess"
            style={{
              fontSize: '0.925rem',
              fontWeight: 600,
              color: '#334155',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <UtensilsCrossed size={16} /> Mess & Dining
          </a>
          <a
            href="/#maintenance"
            style={{
              fontSize: '0.925rem',
              fontWeight: 600,
              color: '#334155',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Wrench size={16} /> Maintenance AI
          </a>
          <a
            href="/#contact"
            style={{ fontSize: '0.925rem', fontWeight: 600, color: '#334155' }}
          >
            Contact
          </a>
        </nav>

        {/* Auth CTA & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {isAuthenticated && user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Link
                to={isWarden ? '/admin/dashboard' : '/dashboard'}
                className="btn btn-primary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                {isWarden ? (
                  <>
                    <ShieldCheck size={16} /> Warden Admin Console
                  </>
                ) : (
                  <>
                    <User size={16} /> Resident Portal ({user.roomNumber || 'Room'})
                  </>
                )}
              </Link>
              <button
                onClick={handleLogout}
                className="btn btn-secondary btn-sm"
                title="Log out"
                style={{ padding: '8px 12px' }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register Resident
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ display: 'inline-flex', padding: '6px', color: '#334155' }}
            className="mobile-menu-toggle"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            background: '#ffffff',
            borderTop: '1px solid var(--border-subtle)',
            padding: '16px 24px',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px'
          }}
        >
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            style={{ padding: '8px 0', fontWeight: 600, color: '#334155' }}
          >
            Overview
          </Link>
          <a
            href="/#how-it-works"
            onClick={() => setMobileMenuOpen(false)}
            style={{ padding: '8px 0', fontWeight: 600, color: '#334155' }}
          >
            How It Works
          </a>
          <a
            href="/#mess"
            onClick={() => setMobileMenuOpen(false)}
            style={{ padding: '8px 0', fontWeight: 600, color: '#334155' }}
          >
            Mess & Dining
          </a>
          <a
            href="/#maintenance"
            onClick={() => setMobileMenuOpen(false)}
            style={{ padding: '8px 0', fontWeight: 600, color: '#334155' }}
          >
            Maintenance AI
          </a>
          <a
            href="/#contact"
            onClick={() => setMobileMenuOpen(false)}
            style={{ padding: '8px 0', fontWeight: 600, color: '#334155' }}
          >
            Contact
          </a>

          <div style={{ paddingTop: '12px', borderTop: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {isAuthenticated ? (
              <>
                <Link
                  to={isWarden ? '/admin/dashboard' : '/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-primary"
                >
                  Go to {isWarden ? 'Warden Portal' : 'Resident Portal'}
                </Link>
                <button onClick={handleLogout} className="btn btn-secondary">
                  Log Out
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-secondary">
                  Sign In
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary">
                  Resident Signup
                </Link>
              </>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 860px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-menu-toggle {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};
