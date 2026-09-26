import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  Building2,
  Utensils,
  Wrench,
  ShieldCheck,
  ArrowRight,
  Zap,
  CheckCircle2,
  DoorOpen,
  Calendar,
  AlertCircle
} from 'lucide-react';

export const Hero: React.FC = () => {
  const { isAuthenticated, isWarden, quickDemoLogin } = useAuth();

  return (
    <section
      style={{
        position: 'relative',
        background: '#ffffff',
        borderBottom: '1px solid var(--border-subtle)',
        paddingTop: '64px',
        paddingBottom: '80px',
        overflow: 'hidden'
      }}
    >
      <div className="container">
        {/* Top Domain Badge */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 14px',
              background: '#f8fafc',
              borderRadius: '9999px',
              border: '1px solid #e2e8f0',
              fontSize: '0.825rem',
              fontWeight: 700,
              color: '#1e3a8a'
            }}
          >
            <Building2 size={16} color="#1e3a8a" />
            <span>SMART HOSTEL &amp; MESS ADMINISTRATION</span>
            <span
              style={{
                background: '#1e3a8a',
                color: '#ffffff',
                padding: '2px 8px',
                borderRadius: '9999px',
                fontSize: '0.7rem'
              }}
            >
              Unified System
            </span>
          </div>
        </div>

        {/* Hero Title & Supporting Text */}
        <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 36px auto' }}>
          <h1
            className="font-display"
            style={{
              fontSize: 'clamp(2.1rem, 4.8vw, 3.4rem)',
              fontWeight: 800,
              lineHeight: 1.18,
              letterSpacing: '-0.025em',
              color: '#0f172a',
              marginBottom: '20px'
            }}
          >
            One place to manage hostel rooms, meals and maintenance.
          </h1>

          <p
            style={{
              fontSize: 'clamp(1rem, 2vw, 1.15rem)',
              color: '#475569',
              lineHeight: 1.65,
              marginBottom: '32px',
              maxWidth: '720px',
              margin: '0 auto 32px auto'
            }}
          >
            The centralized operations portal for college residential halls. Streamlines digital room and bed
            allocation for students, publishes live 7-day mess menus, and routes maintenance requests with smart
            classification directly to warden administration.
          </p>

          {/* Call to Actions */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '12px',
              marginBottom: '32px'
            }}
          >
            {isAuthenticated ? (
              <Link
                to={isWarden ? '/admin/dashboard' : '/dashboard'}
                className="btn btn-primary btn-lg"
                style={{ background: '#1e3a8a', borderColor: '#1e3a8a' }}
              >
                <span>Go to My Dashboard</span>
                <ArrowRight size={18} />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="btn btn-primary btn-lg"
                  style={{ background: '#1e3a8a', borderColor: '#1e3a8a' }}
                >
                  <span>Get Started</span>
                  <ArrowRight size={18} />
                </Link>

                <a
                  href="#hostel"
                  className="btn btn-secondary btn-lg"
                  style={{ background: '#ffffff', borderColor: '#cbd5e1', color: '#1e293b' }}
                >
                  <span>Explore Features</span>
                </a>
              </>
            )}

            {/* Quick Demo Access Buttons for Evaluators */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                id="hero-demo-resident-btn"
                onClick={() => quickDemoLogin('resident')}
                className="btn btn-outline"
                style={{
                  background: '#f8fafc',
                  color: '#1e293b',
                  fontSize: '0.85rem',
                  padding: '9px 14px',
                  borderColor: '#cbd5e1'
                }}
                title="Instant access as Demo Resident"
              >
                <Zap size={14} color="#d97706" />
                <span>Demo Resident</span>
              </button>
              <button
                id="hero-demo-warden-btn"
                onClick={() => quickDemoLogin('warden')}
                className="btn btn-outline"
                style={{
                  background: '#f8fafc',
                  color: '#1e293b',
                  fontSize: '0.85rem',
                  padding: '9px 14px',
                  borderColor: '#cbd5e1'
                }}
                title="Instant access as Demo Warden"
              >
                <ShieldCheck size={14} color="#059669" />
                <span>Demo Warden</span>
              </button>
            </div>
          </div>

          {/* Domain Badges Bar */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '24px',
              fontSize: '0.85rem',
              color: '#64748b'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} color="#2563eb" />
              <span>Digital Room &amp; Bed Registry</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} color="#059669" />
              <span>Active 7-Day Mess Timetable</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <CheckCircle2 size={16} color="#d97706" />
              <span>Smart Maintenance Classification</span>
            </div>
          </div>
        </div>

        {/* Coherent Product Illustration Composition (Hero Visual Showcase) */}
        <div
          style={{
            maxWidth: '1080px',
            margin: '0 auto',
            background: '#f8fafc',
            border: '1.5px solid #e2e8f0',
            borderRadius: '20px',
            padding: '32px 24px',
            boxShadow: 'var(--shadow-md)',
            position: 'relative'
          }}
        >
          {/* Hostel Building & Administration Overview Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid #e2e8f0',
              paddingBottom: '20px',
              marginBottom: '24px',
              flexWrap: 'wrap',
              gap: '12px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '12px',
                  background: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#1e3a8a'
                }}
              >
                <Building2 size={24} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                    Aravali Residence Hall • Operational Console
                  </h3>
                </div>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  Unified Operations: Block A &amp; B • Dining Wing • Maintenance Hub
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '4px 10px',
                  borderRadius: '9999px',
                  background: '#ecfdf5',
                  border: '1px solid #a7f3d0',
                  color: '#065f46',
                  fontSize: '0.78rem',
                  fontWeight: 700
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#059669' }} />
                System Active
              </span>
            </div>
          </div>

          {/* Staggered Composition Cards: Room Allocation -> Today's Mess -> Maintenance */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '20px'
            }}
          >
            {/* 1. Room Allocation Card */}
            <div
              style={{
                background: '#ffffff',
                border: '1.5px solid #e2e8f0',
                borderTop: '4px solid #1e3a8a',
                borderRadius: '14px',
                padding: '20px',
                boxShadow: 'var(--shadow-xs)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: '#eff6ff',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#1e3a8a'
                    }}
                  >
                    <DoorOpen size={18} />
                  </div>
                  <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>
                    Room Allocation
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    background: '#f1f5f9',
                    color: '#475569'
                  }}
                >
                  Live Roster
                </span>
              </div>

              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.05rem' }}>Room 204</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', background: '#ecfdf5', padding: '1px 8px', borderRadius: '9999px' }}>
                    Occupied
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#475569' }}>
                  Block A • Floor 2 • Bed 2
                </div>
              </div>

              <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
                <span>Total Block Capacity:</span>
                <strong style={{ color: '#0f172a' }}>92% Occupied</strong>
              </div>
            </div>

            {/* 2. Today's Mess Schedule Card */}
            <div
              style={{
                background: '#ffffff',
                border: '1.5px solid #e2e8f0',
                borderTop: '4px solid #059669',
                borderRadius: '14px',
                padding: '20px',
                boxShadow: 'var(--shadow-xs)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: '#ecfdf5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#059669'
                    }}
                  >
                    <Utensils size={18} />
                  </div>
                  <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>
                    Today&apos;s Mess
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    background: '#ecfdf5',
                    color: '#065f46'
                  }}
                >
                  Lunch Active
                </span>
              </div>

              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>Shahi Paneer Thali</span>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#64748b' }}>12:30 – 2:00 PM</span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#475569' }}>
                  Dal Tadka, Hot Roti, Steamed Rice, Raita
                </div>
              </div>

              <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
                <span>Next Meal:</span>
                <strong style={{ color: '#0f172a' }}>Snacks @ 4:30 PM</strong>
              </div>
            </div>

            {/* 3. Maintenance Status Card */}
            <div
              style={{
                background: '#ffffff',
                border: '1.5px solid #e2e8f0',
                borderTop: '4px solid #d97706',
                borderRadius: '14px',
                padding: '20px',
                boxShadow: 'var(--shadow-xs)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '8px',
                      background: '#fef3c7',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#b45309'
                    }}
                  >
                    <Wrench size={18} />
                  </div>
                  <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>
                    Maintenance
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '9999px',
                    background: '#eff6ff',
                    color: '#1e3a8a'
                  }}
                >
                  Ticket #TK-108
                </span>
              </div>

              <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '10px', marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.95rem' }}>Room Fan Capacitor</span>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#1e3a8a', background: '#dbeafe', padding: '1px 8px', borderRadius: '9999px' }}>
                    In Progress
                  </span>
                </div>
                <div style={{ fontSize: '0.8rem', color: '#475569' }}>
                  Trade: <strong>Electrical</strong> • Electrician Dispatched
                </div>
              </div>

              <div style={{ fontSize: '0.8rem', color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
                <span>Classification:</span>
                <strong style={{ color: '#d97706' }}>Smart Trade Match</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
