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
        background: 'rgba(3, 7, 18, 0.85)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(0, 191, 251, 0.18)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6)'
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '68px' }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '10px' }} onClick={() => setMobileMenuOpen(false)}>
          <div
            style={{
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #00BFFB 0%, #1e3a8a 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 0 15px rgba(0, 191, 251, 0.4)'
            }}
          >
            <Building2 size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff' }}>
                Smart<span style={{ color: '#00BFFB', textShadow: '0 0 12px rgba(0, 191, 251, 0.6)' }}>Hostel</span>
              </span>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 800,
                  background: 'rgba(0, 191, 251, 0.15)',
                  color: '#00BFFB',
                  border: '1px solid rgba(0, 191, 251, 0.3)',
                  padding: '2px 7px',
                  borderRadius: '9999px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}
              >
                OS 2.6
              </span>
            </div>
            <p style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 500, margin: 0 }}>
              Autonomous Residential Platform
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
              color: location.pathname === '/' && !location.hash ? '#00BFFB' : '#94a3b8',
              transition: 'all 0.15s ease'
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
                color: '#94a3b8',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={e => {
                e.currentTarget.style.color = '#00BFFB';
                e.currentTarget.style.textShadow = '0 0 10px rgba(0, 191, 251, 0.5)';
              }}
              onMouseLeave={e => {
                e.currentTarget.style.color = '#94a3b8';
                e.currentTarget.style.textShadow = 'none';
              }}
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
                className="cyber-btn-cyan btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '6px', borderRadius: '8px' }}
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
                className="cyber-btn-outline btn-sm"
                title="Log out"
                style={{ padding: '7px 10px', borderRadius: '8px' }}
              >
                <LogOut size={15} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Link to="/login" className="cyber-btn-outline btn-sm" style={{ borderRadius: '8px' }}>
                Sign In
              </Link>
              <Link to="/register" className="cyber-btn-cyan btn-sm" style={{ borderRadius: '8px' }}>
                Get Started
              </Link>
            </div>
          )}

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ display: 'inline-flex', padding: '6px', color: '#e2e8f0', background: 'rgba(15, 23, 42, 0.7)', borderRadius: '8px', border: '1px solid rgba(0, 191, 251, 0.2)' }}
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
            background: 'rgba(3, 7, 18, 0.95)',
            borderTop: '1px solid rgba(0, 191, 251, 0.2)',
            backdropFilter: 'blur(20px)',
            padding: '16px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px'
          }}
        >
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            style={{ padding: '8px 0', fontWeight: 600, color: '#00BFFB', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}
          >
            Home
          </Link>
          {navLinks.map((link, idx) => (
            <a
              key={idx}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              style={{ padding: '8px 0', fontWeight: 600, color: '#cbd5e1', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}
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
                  className="cyber-btn-cyan"
                  style={{ width: '100%', padding: '10px', textAlign: 'center', borderRadius: '8px' }}
                >
                  Go to {isWarden ? 'Warden Portal' : 'Resident Portal'}
                </Link>
                <button onClick={handleLogout} className="cyber-btn-outline" style={{ width: '100%', padding: '10px', borderRadius: '8px' }}>
                  Sign Out
                </button>
              </>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="cyber-btn-outline" style={{ width: '100%', textAlign: 'center', padding: '10px', borderRadius: '8px' }}>
                  Sign In
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="cyber-btn-cyan" style={{ width: '100%', textAlign: 'center', padding: '10px', borderRadius: '8px' }}>
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
