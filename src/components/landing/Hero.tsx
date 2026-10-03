import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ParticleWave } from '../common/ParticleWave';
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
  AlertCircle,
  QrCode,
  Clock,
  Sparkles,
  Activity,
  Layers,
  ChevronRight
} from 'lucide-react';

export const Hero: React.FC = () => {
  const { isAuthenticated, isWarden, quickDemoLogin } = useAuth();
  const [activeTab, setActiveTab] = useState<'rooms' | 'mess' | 'tickets' | 'gatepass'>('rooms');

  return (
    <section
      style={{
        position: 'relative',
        background: '#030712',
        borderBottom: '1px solid rgba(0, 191, 251, 0.2)',
        paddingTop: '72px',
        paddingBottom: '96px',
        overflow: 'hidden',
        minHeight: '85vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}
    >
      {/* 3D Undulating Particle Wave Background Canvas (Jarvis & GEC-IoT style) */}
      <ParticleWave opacity={0.8} />

      {/* Cyberpunk Radial Spotlight */}
      <div
        style={{
          position: 'absolute',
          top: '-10%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '800px',
          height: '500px',
          background: 'radial-gradient(ellipse at center, rgba(0, 191, 251, 0.16) 0%, rgba(30, 58, 138, 0.08) 50%, transparent 75%)',
          pointerEvents: 'none',
          zIndex: 1
        }}
      />

      <div className="container" style={{ position: 'relative', zIndex: 2 }}>
        {/* Top Node Status Pill */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '22px' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '6px 16px',
              background: 'rgba(15, 23, 42, 0.8)',
              borderRadius: '9999px',
              border: '1px solid rgba(0, 191, 251, 0.35)',
              boxShadow: '0 0 15px rgba(0, 191, 251, 0.2)',
              fontSize: '0.8rem',
              fontWeight: 700,
              color: '#00BFFB',
              letterSpacing: '0.06em'
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#00BFFB',
                boxShadow: '0 0 8px #00BFFB'
              }}
              className="pulse-indicator"
            />
            <span>RESIDENTIAL NODE // AUTONOMOUS OS v2.6 ONLINE</span>
          </div>
        </div>

        {/* Hero Title & Supporting Text */}
        <div style={{ textAlign: 'center', maxWidth: '880px', margin: '0 auto 40px auto' }}>
          <h1
            style={{
              fontSize: 'clamp(2.4rem, 5.5vw, 4.2rem)',
              fontWeight: 900,
              lineHeight: 1.12,
              letterSpacing: '-0.03em',
              color: '#ffffff',
              marginBottom: '24px',
              textShadow: '0 2px 20px rgba(0,0,0,0.8)'
            }}
          >
            Next-Gen Living.{' '}
            <span
              style={{
                background: 'linear-gradient(135deg, #00BFFB 0%, #38bdf8 50%, #818cf8 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block'
              }}
              className="text-glow-cyan"
            >
              Powered by Autonomous Intelligence.
            </span>
          </h1>

          <p
            style={{
              fontSize: 'clamp(1rem, 2.2vw, 1.2rem)',
              color: '#94a3b8',
              lineHeight: 1.65,
              marginBottom: '36px',
              maxWidth: '740px',
              margin: '0 auto 36px auto'
            }}
          >
            The unified residential management system for collegiate halls. Featuring real-time digital room allocation, 7-day automated mess nutrition, AI ticket classification, digital QR gate-passes, and curfew roll call.
          </p>

          {/* Glowing Call to Actions */}
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '14px',
              marginBottom: '36px'
            }}
          >
            {isAuthenticated ? (
              <Link
                to={isWarden ? '/admin/dashboard' : '/dashboard'}
                className="cyber-btn-cyan"
                style={{
                  padding: '14px 32px',
                  borderRadius: '12px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontSize: '1rem'
                }}
              >
                <span>Enter Operational Console</span>
                <ArrowRight size={18} />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="cyber-btn-cyan"
                  style={{
                    padding: '14px 30px',
                    borderRadius: '12px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '1rem'
                  }}
                >
                  <span>Student Registration</span>
                  <ArrowRight size={18} />
                </Link>

                <Link
                  to="/login"
                  className="cyber-btn-outline"
                  style={{
                    padding: '14px 28px',
                    borderRadius: '12px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontSize: '1rem'
                  }}
                >
                  <span>Portal Login</span>
                  <ChevronRight size={18} />
                </Link>
              </>
            )}

            {/* Quick 1-Click Competition / Evaluator Access */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                id="hero-demo-resident-btn"
                onClick={() => quickDemoLogin('resident')}
                className="cyber-btn-outline"
                style={{
                  padding: '11px 16px',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                title="Instant access as Rahul Sharma (Room 204)"
              >
                <Zap size={15} color="#00BFFB" />
                <span>Demo Student</span>
              </button>
              <button
                id="hero-demo-warden-btn"
                onClick={() => quickDemoLogin('warden')}
                className="cyber-btn-outline"
                style={{
                  padding: '11px 16px',
                  borderRadius: '10px',
                  fontSize: '0.85rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
                title="Instant access as Chief Warden Dr. R. K. Verma"
              >
                <ShieldCheck size={15} color="#38bdf8" />
                <span>Demo Warden</span>
              </button>
            </div>
          </div>

          {/* Quick HUD Metrics Ribbon */}
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
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1' }}>
              <CheckCircle2 size={16} color="#00BFFB" />
              <span>Real-Time Bed Registry</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1' }}>
              <CheckCircle2 size={16} color="#00BFFB" />
              <span>Live 7-Day Dining Schedule</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1' }}>
              <CheckCircle2 size={16} color="#00BFFB" />
              <span>AI Triage &amp; SLA Tracking</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#cbd5e1' }}>
              <CheckCircle2 size={16} color="#00BFFB" />
              <span>Digital Gate-Pass &amp; Curfew</span>
            </div>
          </div>
        </div>

        {/* Futuristic Cyber Deck Console Showcase */}
        <div
          className="glass-card"
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            padding: '28px',
            border: '1px solid rgba(0, 191, 251, 0.25)',
            boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(0, 191, 251, 0.15)'
          }}
        >
          {/* Deck Header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
              paddingBottom: '20px',
              marginBottom: '24px',
              flexWrap: 'wrap',
              gap: '16px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div
                style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '12px',
                  background: 'rgba(0, 191, 251, 0.1)',
                  border: '1px solid rgba(0, 191, 251, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#00BFFB',
                  boxShadow: '0 0 15px rgba(0, 191, 251, 0.25)'
                }}
              >
                <Building2 size={24} />
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
                    Aravali Residence Hall • Operational HUD
                  </h3>
                  <span
                    style={{
                      background: 'rgba(16, 185, 129, 0.2)',
                      border: '1px solid rgba(16, 185, 129, 0.4)',
                      color: '#34d399',
                      padding: '2px 8px',
                      borderRadius: '9999px',
                      fontSize: '0.72rem',
                      fontWeight: 700
                    }}
                  >
                    SYSTEM NOMINAL
                  </span>
                </div>
                <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                  Block A, Floor 1-3 • Automated Synchronization Enabled
                </span>
              </div>
            </div>

            {/* Interactive Module Selector Tabs */}
            <div
              style={{
                display: 'flex',
                background: 'rgba(15, 23, 42, 0.8)',
                padding: '4px',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                gap: '4px'
              }}
            >
              {[
                { id: 'rooms', label: 'Beds & Rooms', icon: DoorOpen },
                { id: 'mess', label: 'Mess Nutrition', icon: Utensils },
                { id: 'tickets', label: 'AI Maintenance', icon: Wrench },
                { id: 'gatepass', label: 'Gate Pass & Leaves', icon: QrCode }
              ].map(tab => {
                const Icon = tab.icon;
                const isSelected = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    style={{
                      padding: '7px 14px',
                      borderRadius: '8px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      color: isSelected ? '#00BFFB' : '#94a3b8',
                      background: isSelected ? 'rgba(0, 191, 251, 0.15)' : 'transparent',
                      border: isSelected ? '1px solid rgba(0, 191, 251, 0.3)' : '1px solid transparent',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <Icon size={14} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick HUD Metrics Bar */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
              gap: '16px',
              marginBottom: '24px'
            }}
          >
            <div
              style={{
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(0, 191, 251, 0.2)',
                borderRadius: '12px',
                padding: '16px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
                  Bed Allocation
                </span>
                <DoorOpen size={16} color="#00BFFB" />
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>46 / 50 Beds</div>
              <div style={{ fontSize: '0.75rem', color: '#38bdf8', marginTop: '4px' }}>92.0% Occupancy Rate</div>
            </div>

            <div
              style={{
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(16, 185, 129, 0.2)',
                borderRadius: '12px',
                padding: '16px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
                  Mess Meals Served
                </span>
                <Utensils size={16} color="#34d399" />
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>138 / 150 Today</div>
              <div style={{ fontSize: '0.75rem', color: '#34d399', marginTop: '4px' }}>Lunch Active: Special Paneer</div>
            </div>

            <div
              style={{
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(245, 158, 11, 0.2)',
                borderRadius: '12px',
                padding: '16px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
                  AI Maintenance SLA
                </span>
                <Wrench size={16} color="#fbbf24" />
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>98.4% On-Time</div>
              <div style={{ fontSize: '0.75rem', color: '#fbbf24', marginTop: '4px' }}>Avg Resolution: 2.4 Hours</div>
            </div>

            <div
              style={{
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid rgba(168, 85, 247, 0.2)',
                borderRadius: '12px',
                padding: '16px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase' }}>
                  Gate Pass &amp; Curfew
                </span>
                <QrCode size={16} color="#c084fc" />
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>0 Out-of-Campus</div>
              <div style={{ fontSize: '0.75rem', color: '#c084fc', marginTop: '4px' }}>Curfew: 10:00 PM Roll Call</div>
            </div>
          </div>

          {/* Interactive Active Tab Content */}
          <div
            style={{
              background: 'rgba(8, 12, 24, 0.7)',
              border: '1px solid rgba(255, 255, 255, 0.06)',
              borderRadius: '14px',
              padding: '20px'
            }}
          >
            {activeTab === 'rooms' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#e2e8f0' }}>
                    Floor 2 • Aravali Hall Bed Matrix (Real-Time Live Status)
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#00BFFB' }}>Active Node: Room 204 Allocated to Rahul Sharma</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
                  {[
                    { room: '201', type: 'Triple Bed', occupied: 3, capacity: 3, status: 'Full', color: '#ef4444' },
                    { room: '202', type: 'Double Bed', occupied: 2, capacity: 2, status: 'Full', color: '#ef4444' },
                    { room: '203', type: 'Double Bed', occupied: 2, capacity: 2, status: 'Full', color: '#ef4444' },
                    { room: '204', type: 'Double Bed', occupied: 2, capacity: 2, status: 'Demo Resident', color: '#00BFFB' },
                    { room: '205', type: 'Single Bed', occupied: 0, capacity: 1, status: '1 Vacant Bed', color: '#10b981' }
                  ].map((r, i) => (
                    <div
                      key={i}
                      style={{
                        background: 'rgba(15, 23, 42, 0.7)',
                        border: `1px solid ${r.color === '#00BFFB' ? 'rgba(0, 191, 251, 0.6)' : 'rgba(255,255,255,0.08)'}`,
                        borderRadius: '10px',
                        padding: '12px',
                        boxShadow: r.color === '#00BFFB' ? '0 0 15px rgba(0, 191, 251, 0.25)' : 'none'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 800, color: '#ffffff', fontSize: '0.95rem' }}>Room {r.room}</span>
                        <span style={{ fontSize: '0.7rem', color: r.color, fontWeight: 700 }}>{r.status}</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{r.type}</div>
                      <div style={{ marginTop: '8px', display: 'flex', gap: '4px' }}>
                        {Array.from({ length: r.capacity }).map((_, bi) => (
                          <div
                            key={bi}
                            style={{
                              flex: 1,
                              height: '4px',
                              borderRadius: '2px',
                              background: bi < r.occupied ? r.color : 'rgba(255,255,255,0.1)'
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'mess' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#e2e8f0' }}>
                    Today's 4-Meal Dining Schedule (Calorie &amp; Dietary Sync)
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#34d399' }}>Live Meal: Lunch in Progress</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                  {[
                    { meal: 'Breakfast', time: '07:30 - 09:30 AM', items: 'Masala Dosa, Sambar, Coconut Chutney, Banana, Tea/Coffee', cal: '520 kcal' },
                    { meal: 'Lunch', time: '12:30 - 02:30 PM', items: 'Paneer Makhani, Dal Tadka, Jeera Rice, Phulka, Boondi Raita', cal: '780 kcal', active: true },
                    { meal: 'Evening Snacks', time: '05:00 - 06:00 PM', items: 'Vegetable Samosa, Green Chutney, Hot Masala Tea', cal: '310 kcal' },
                    { meal: 'Dinner', time: '07:30 - 09:30 PM', items: 'Mixed Veg Curry, Chapati, Steamed Rice, Yellow Dal, Gulab Jamun', cal: '690 kcal' }
                  ].map((m, i) => (
                    <div
                      key={i}
                      style={{
                        background: 'rgba(15, 23, 42, 0.7)',
                        border: m.active ? '1px solid rgba(16, 185, 129, 0.5)' : '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '10px',
                        padding: '12px',
                        boxShadow: m.active ? '0 0 15px rgba(16, 185, 129, 0.2)' : 'none'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontWeight: 800, color: '#ffffff', fontSize: '0.9rem' }}>{m.meal}</span>
                        {m.active && (
                          <span style={{ fontSize: '0.68rem', background: 'rgba(16,185,129,0.2)', color: '#34d399', padding: '2px 6px', borderRadius: '4px' }}>
                            SERVING NOW
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#94a3b8', marginBottom: '6px' }}>{m.time}</div>
                      <p style={{ fontSize: '0.78rem', color: '#cbd5e1', margin: 0, lineHeight: 1.4 }}>{m.items}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'tickets' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#e2e8f0' }}>
                    AI Ticket Dispatch &amp; Priority Triage Engine
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#fbbf24' }}>Real-Time Classifier Confidence: 99.2%</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {[
                    { id: 'TKT-101', room: 'Room 204', category: 'Electrical', desc: 'Ceiling fan regulator sparking and speed switch stuck on high', priority: 'High', status: 'Assigned to Electrician' },
                    { id: 'TKT-102', room: 'Room 102', category: 'Plumbing', desc: 'Washbasin faucet loose and leaking slow drip underneath', priority: 'Medium', status: 'In Progress' },
                    { id: 'TKT-103', room: 'Room 305', category: 'Carpentry', desc: 'Study table drawer slider stuck and cannot open smoothly', priority: 'Low', status: 'Scheduled' }
                  ].map((t, i) => (
                    <div
                      key={i}
                      style={{
                        background: 'rgba(15, 23, 42, 0.7)',
                        border: '1px solid rgba(255,255,255,0.08)',
                        borderRadius: '10px',
                        padding: '12px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '12px',
                        flexWrap: 'wrap'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <span style={{ fontWeight: 800, color: '#00BFFB', fontSize: '0.85rem' }}>{t.id}</span>
                        <div>
                          <span style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.85rem' }}>{t.room} • {t.category}</span>
                          <p style={{ fontSize: '0.76rem', color: '#94a3b8', margin: 0 }}>{t.desc}</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '0.72rem', background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', padding: '3px 8px', borderRadius: '4px', fontWeight: 700 }}>
                          {t.priority}
                        </span>
                        <span style={{ fontSize: '0.72rem', background: 'rgba(0, 191, 251, 0.15)', color: '#00BFFB', padding: '3px 8px', borderRadius: '4px', fontWeight: 600 }}>
                          {t.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'gatepass' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#e2e8f0' }}>
                    Digital Out-Pass &amp; Curfew Verification Node
                  </span>
                  <span style={{ fontSize: '0.75rem', color: '#c084fc' }}>Curfew Check-in: 10:00 PM</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '12px' }}>
                  <div
                    style={{
                      background: 'rgba(15, 23, 42, 0.7)',
                      border: '1px solid rgba(168, 85, 247, 0.3)',
                      borderRadius: '10px',
                      padding: '14px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <QrCode size={18} color="#c084fc" />
                      <span style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.85rem' }}>Digital Outpass Generation</span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.4 }}>
                      Student requests emergency outpass or home leave. System checks parent phone authorization and issues cryptographically signed QR code for gate security.
                    </p>
                  </div>

                  <div
                    style={{
                      background: 'rgba(15, 23, 42, 0.7)',
                      border: '1px solid rgba(0, 191, 251, 0.3)',
                      borderRadius: '10px',
                      padding: '14px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <Clock size={18} color="#00BFFB" />
                      <span style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.85rem' }}>Night Curfew Attendance</span>
                    </div>
                    <p style={{ fontSize: '0.75rem', color: '#94a3b8', lineHeight: 1.4 }}>
                      Warden tablet terminal for nightly roll-calls by floor/block. Instantly marks Present, Absent, or Authorized On-Leave with instant SMS alert to parents if absent.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
