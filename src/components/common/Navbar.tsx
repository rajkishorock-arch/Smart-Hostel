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
  Home,
  CheckCircle,
  HelpCircle
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

  const navLinks = [
    { label: 'Hostel', href: '/#hostel' },
    { label: 'Smart Mess', href: '/#mess' },
    { label: 'Maintenance', href: '/#maintenance' },
    { label: 'How It Works', href: '/#how-it-works' },
    { label: 'About', href: '/#about' },
    { label: 'Contact', href: '/#contact' }
  ];

  return (
    <header
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        background: '#ffffff',
        borderBottom: '1px solid var(--border-default)',
        boxShadow: 'var(--shadow-xs)'
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '68px' }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }} onClick={() => setMobileMenuOpen(false)}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '8px',
              background: '#1e3a8a',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}
          >
            <Building2 size={22} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#0f172a' }}>
                Smart<span style={{ color: '#2563eb' }}>Hostel</span>
              </span>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  background: '#eff6ff',
                  color: '#1d4ed8',
                  padding: '2px 6px',
                  borderRadius: '4px',
                  textTransform: 'uppercase'
                }}
              >
                &amp; Mess
              </span>
            </div>
            <p style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 500, margin: 0 }}>
              Campus Living &amp; Dining System
            </p>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'none', alignItems: 'center', gap: '22px' }} className="desktop-nav">
          <Link
            to="/"
            style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              color: location.pathname === '/' && !location.hash ? '#1e3a8a' : '#475569',
              transition: 'color 0.15s ease'
            }}
          >
            Home
          </Link>
          {navLinks.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              style={{
                fontSize: '0.875rem',
                fontWeight: 600,
                color: '#475569',
                transition: 'color 0.15s ease'
              }}
              onMouseEnter={e => (e.currentTarget.style.color = '#1e3a8a')}
              onMouseLeave={e => (e.currentTarget.style.color = '#475569')}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Auth CTA & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {isAuthenticated && user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Link
                to={isWarden ? '/admin/dashboard' : '/dashboard'}
                className="btn btn-primary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
              >
                {isWarden ? (
                  <>
                    <ShieldCheck size={15} /> Warden Desk
                  </>
                ) : (
                  <>
                    <User size={15} /> Room {user.roomNumber || '204'}
                  </>
                )}
              </Link>
              <button
                onClick={handleLogout}
                className="btn btn-secondary btn-sm"
                title="Log out"
                style={{ padding: '7px 10px' }}
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ display: 'inline-flex', padding: '6px', color: '#1e293b', background: '#f8fafc', borderRadius: '6px', border: '1px solid #e2e8f0' }}
            className="mobile-menu-toggle"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            background: '#ffffff',
            borderTop: '1px solid var(--border-default)',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            style={{ padding: '8px 0', fontWeight: 600, color: '#0f172a', borderBottom: '1px solid #f8fafc' }}
          >
            Home
          </Link>
          {navLinks.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              style={{ padding: '8px 0', fontWeight: 600, color: '#475569', borderBottom: '1px solid #f8fafc' }}
            >
              {link.label}
            </a>
          ))}

          <div style={{ paddingTop: '10px', marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {isAuthenticated ? (
              <>
                <Link
                  to={isWarden ? '/admin/dashboard' : '/dashboard'}
                  onClick={() => setMobileMenuOpen(false)}
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                >
                  Go to {isWarden ? 'Warden Portal' : 'Resident Portal'}
                </Link>
                <button onClick={handleLogout} className="btn btn-secondary" style={{ width: '100%' }}>
                  Sign Out
                </button>
              </>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-secondary" style={{ width: '100%' }}>
                  Sign In
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary" style={{ width: '100%' }}>
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 900px) {
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
