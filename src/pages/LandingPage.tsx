import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { Hero } from '../components/landing/Hero';
import { OrbitalCoreCanvas } from '../components/common/OrbitalCoreCanvas';
import { useAuth } from '../context/AuthContext';
import {
  Building2,
  Utensils,
  Wrench,
  ShieldCheck,
  QrCode,
  Clock,
  Zap,
  CheckCircle2,
  ArrowRight,
  Database,
  Lock,
  Layers,
  Cpu,
  FileText,
  Users,
  Compass,
  AlertTriangle,
  ChevronRight,
  Shield,
  Activity,
  UserCheck,
  Flame,
  Award
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { quickDemoLogin, isAuthenticated, isWarden } = useAuth();
  const [activeFloor, setActiveFloor] = useState<number>(2);

  const realRooms = [
    { number: '101', floor: 1, type: 'Triple', occupied: 3, capacity: 3, residents: ['Amit K.', 'Rohan S.', 'Vikram P.'] },
    { number: '102', floor: 1, type: 'Double', occupied: 2, capacity: 2, residents: ['Pooja N.', 'Sneha R.'] },
    { number: '103', floor: 1, type: 'Single', occupied: 1, capacity: 1, residents: ['Devansh M.'] },
    { number: '201', floor: 2, type: 'Triple', occupied: 3, capacity: 3, residents: ['Karan V.', 'Aayush T.', 'Sahil G.'] },
    { number: '202', floor: 2, type: 'Double', occupied: 2, capacity: 2, residents: ['Ananya B.', 'Priya D.'] },
    { number: '204', floor: 2, type: 'Double', occupied: 2, capacity: 2, residents: ['Rahul Sharma', 'Manish K.'] },
    { number: '301', floor: 3, type: 'Triple', occupied: 3, capacity: 3, residents: ['Siddharth R.', 'Harsh V.', 'Chirag L.'] },
    { number: '302', floor: 3, type: 'Double', occupied: 1, capacity: 2, residents: ['Mohit A.'] },
    { number: '304', floor: 3, type: 'Single', occupied: 1, capacity: 1, residents: ['Tanmay J.'] },
    { number: '305', floor: 3, type: 'Double', occupied: 2, capacity: 2, residents: ['Gaurav K.', 'Deepak S.'] }
  ];

  const filteredRooms = realRooms.filter(r => r.floor === activeFloor);

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: '#03070e',
        color: '#f8fafc',
        overflowX: 'hidden'
      }}
    >
      {/* 1. Full-Page Fixed 3D Orbital Core Canvas (Matches jarvisapp.in) */}
      <OrbitalCoreCanvas />

      {/* 2. Sticky Glass Capsule Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main style={{ position: 'relative', zIndex: 5, flexGrow: 1 }}>
        {/* 3. Hero Section with Orbital Core Stage & Interactive Console */}
        <Hero />

        {/* 4. Live Operational Telemetry Matrix */}
        <section
          id="hostel"
          style={{
            padding: '70px 0',
            position: 'relative',
            borderBottom: '1px solid rgba(0, 191, 251, 0.15)'
          }}
        >
          <div className="container">
            {/* Section Eyebrow & Title */}
            <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 48px auto' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '5px 14px',
                  background: 'rgba(0, 191, 251, 0.1)',
                  borderRadius: '9999px',
                  border: '1px solid rgba(0, 191, 251, 0.35)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: '#00BFFB',
                  letterSpacing: '0.06em',
                  marginBottom: '16px'
                }}
              >
                <Building2 size={14} />
                <span>MODULE 01 • RESIDENCE ALLOCATION ENGINE</span>
              </div>
              <h2
                style={{
                  fontSize: 'clamp(1.8rem, 3.8vw, 2.6rem)',
                  fontWeight: 800,
                  color: '#ffffff',
                  marginBottom: '16px',
                  letterSpacing: '-0.02em'
                }}
              >
                Real-Time Bed Matrix &amp; Room Registry
              </h2>
              <p style={{ fontSize: '1rem', color: '#94a3b8', lineHeight: 1.6 }}>
                Direct synchronization with Aravali Residence Hall records. Track real bed occupancy, floor breakdowns, and verified student check-ins without duplicate allocations.
              </p>
            </div>

            {/* Metric Summary Counters */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                gap: '18px',
                marginBottom: '36px'
              }}
            >
              {[
                { label: 'Total Capacity', value: '50 Beds', sub: '10 Allocated Units', color: '#00BFFB', icon: Building2 },
                { label: 'Live Occupancy', value: '46 / 50', sub: '92% Utilization Rate', color: '#38bdf8', icon: Users },
                { label: 'Available Vacancy', value: '4 Beds', sub: 'Floor 3 Allocation Open', color: '#34d399', icon: CheckCircle2 },
                { label: 'Roll-Call Compliance', value: '100%', sub: 'Night Curfew Verified', color: '#c084fc', icon: Clock }
              ].map((stat, i) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={i}
                    className="glass-card"
                    style={{
                      padding: '22px',
                      background: 'rgba(10, 16, 32, 0.75)',
                      border: '1px solid rgba(0, 191, 251, 0.22)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>{stat.label}</span>
                      <Icon size={18} color={stat.color} />
                    </div>
                    <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', marginBottom: '4px' }}>
                      {stat.value}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: stat.color, fontWeight: 600 }}>
                      {stat.sub}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Interactive Floor Bed Grid */}
            <div
              className="glass-card"
              style={{
                padding: '28px',
                background: 'rgba(8, 14, 28, 0.8)',
                border: '1px solid rgba(0, 191, 251, 0.25)'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '22px',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>
                    Aravali Hall • Floor Allocation View
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    Select a floor to view real bed allotment tokens
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[1, 2, 3].map(floor => (
                    <button
                      key={floor}
                      onClick={() => setActiveFloor(floor)}
                      className={activeFloor === floor ? 'cyber-btn-cyan' : 'cyber-btn-outline'}
                      style={{
                        padding: '6px 16px',
                        borderRadius: '8px',
                        fontSize: '0.82rem',
                        cursor: 'pointer'
                      }}
                    >
                      Floor {floor}
                    </button>
                  ))}
                </div>
              </div>

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: '16px'
                }}
              >
                {filteredRooms.map(room => (
                  <div
                    key={room.number}
                    style={{
                      background: 'rgba(15, 23, 42, 0.7)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '12px',
                      padding: '16px',
                      transition: 'border-color 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{ fontSize: '1rem', fontWeight: 800, color: '#00BFFB' }}>
                        Room {room.number}
                      </span>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          padding: '3px 8px',
                          borderRadius: '9999px',
                          background: room.occupied === room.capacity ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
                          color: room.occupied === room.capacity ? '#f87171' : '#34d399',
                          fontWeight: 700
                        }}
                      >
                        {room.occupied === room.capacity ? 'FULL' : `${room.capacity - room.occupied} VACANT`}
                      </span>
                    </div>

                    <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '10px' }}>
                      Type: <strong style={{ color: '#e2e8f0' }}>{room.type} Bed</strong> • Occupied: <strong style={{ color: '#e2e8f0' }}>{room.occupied}/{room.capacity}</strong>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {room.residents.map((name, idx) => (
                        <span
                          key={idx}
                          style={{
                            fontSize: '0.74rem',
                            background: 'rgba(0, 191, 251, 0.1)',
                            border: '1px solid rgba(0, 191, 251, 0.25)',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            color: '#cbd5e1'
                          }}
                        >
                          Bed {String.fromCharCode(65 + idx)}: {name}
                        </span>
                      ))}
                      {room.capacity > room.occupied && (
                        <span
                          style={{
                            fontSize: '0.74rem',
                            background: 'rgba(16, 185, 129, 0.1)',
                            border: '1px dashed rgba(16, 185, 129, 0.35)',
                            padding: '3px 8px',
                            borderRadius: '6px',
                            color: '#34d399'
                          }}
                        >
                          Bed {String.fromCharCode(65 + room.occupied)}: Open
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 5. Smart Mess & 7-Day Nutrition Telemetry */}
        <section
          id="mess"
          style={{
            padding: '70px 0',
            position: 'relative',
            borderBottom: '1px solid rgba(0, 191, 251, 0.15)'
          }}
        >
          <div className="container">
            <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 48px auto' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '5px 14px',
                  background: 'rgba(16, 185, 129, 0.1)',
                  borderRadius: '9999px',
                  border: '1px solid rgba(16, 185, 129, 0.35)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: '#34d399',
                  letterSpacing: '0.06em',
                  marginBottom: '16px'
                }}
              >
                <Utensils size={14} />
                <span>MODULE 02 • SMART DINING &amp; NUTRITION</span>
              </div>
              <h2
                style={{
                  fontSize: 'clamp(1.8rem, 3.8vw, 2.6rem)',
                  fontWeight: 800,
                  color: '#ffffff',
                  marginBottom: '16px',
                  letterSpacing: '-0.02em'
                }}
              >
                Automated 7-Day Mess Nutrition &amp; Attendance
              </h2>
              <p style={{ fontSize: '1rem', color: '#94a3b8', lineHeight: 1.6 }}>
                Campus dining powered by scheduled nutrient profiling, real-time meal counts, special diet requests, and zero-waste kitchen forecasting.
              </p>
            </div>

            {/* 4 Daily Meals Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: '20px',
                marginBottom: '36px'
              }}
            >
              {[
                {
                  meal: 'Breakfast',
                  time: '07:30 AM - 09:30 AM',
                  cal: '480 kcal',
                  items: 'Poha with Peanuts, Boiled Sprouts, Seasonal Banana, Full Cream Milk / Masala Chai',
                  chef: 'Head Chef R. Yadav',
                  status: 'Served'
                },
                {
                  meal: 'Lunch',
                  time: '12:30 PM - 02:30 PM',
                  cal: '740 kcal',
                  items: 'Dal Makhani, Shahi Paneer Butter Masala, Fresh Butter Roti, Steamed Basmati Rice, Boondi Raita',
                  chef: 'Senior Chef Anita S.',
                  status: 'Served'
                },
                {
                  meal: 'Evening Snacks',
                  time: '05:00 PM - 06:30 PM',
                  cal: '290 kcal',
                  items: 'Crispy Veg Cutlet, Green Mint Chutney, Hot Cardamom Tea, Assorted Biscuits',
                  chef: 'Kitchen Team B',
                  status: 'Live Now'
                },
                {
                  meal: 'Dinner',
                  time: '08:00 PM - 10:00 PM',
                  cal: '680 kcal',
                  items: 'Yellow Arhar Dal Tadka, Seasonal Mix Veg, Soft Phulka Roti, Jeera Rice, Warm Gulab Jamun',
                  chef: 'Night Shift Team A',
                  status: 'Upcoming'
                }
              ].map((m, i) => (
                <div
                  key={i}
                  className="glass-card"
                  style={{
                    padding: '24px',
                    background: 'rgba(10, 16, 32, 0.75)',
                    border: '1px solid rgba(16, 185, 129, 0.25)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#ffffff' }}>{m.meal}</span>
                      <span
                        style={{
                          fontSize: '0.72rem',
                          padding: '3px 8px',
                          borderRadius: '9999px',
                          background: m.status === 'Live Now' ? 'rgba(0, 191, 251, 0.2)' : 'rgba(16, 185, 129, 0.15)',
                          color: m.status === 'Live Now' ? '#00BFFB' : '#34d399',
                          fontWeight: 700,
                          border: `1px solid ${m.status === 'Live Now' ? 'rgba(0, 191, 251, 0.4)' : 'transparent'}`
                        }}
                      >
                        {m.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginBottom: '6px' }}>{m.time}</div>
                    <div style={{ fontSize: '0.78rem', color: '#fbbf24', fontWeight: 700, marginBottom: '14px' }}>
                      Nutrient Profile: {m.cal}
                    </div>
                    <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '16px' }}>
                      {m.items}
                    </p>
                  </div>
                  <div
                    style={{
                      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                      paddingTop: '12px',
                      fontSize: '0.74rem',
                      color: '#64748b'
                    }}
                  >
                    Supervisor: {m.chef}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 6. AI Maintenance Classification & Rapid Triage */}
        <section
          id="maintenance"
          style={{
            padding: '70px 0',
            position: 'relative',
            borderBottom: '1px solid rgba(0, 191, 251, 0.15)'
          }}
        >
          <div className="container">
            <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 48px auto' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '5px 14px',
                  background: 'rgba(245, 158, 11, 0.1)',
                  borderRadius: '9999px',
                  border: '1px solid rgba(245, 158, 11, 0.35)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: '#fbbf24',
                  letterSpacing: '0.06em',
                  marginBottom: '16px'
                }}
              >
                <Wrench size={14} />
                <span>MODULE 03 • AI ISSUE TRIAGE &amp; SLA DISPATCH</span>
              </div>
              <h2
                style={{
                  fontSize: 'clamp(1.8rem, 3.8vw, 2.6rem)',
                  fontWeight: 800,
                  color: '#ffffff',
                  marginBottom: '16px',
                  letterSpacing: '-0.02em'
                }}
              >
                Automated Fault Detection &amp; Priority Dispatch
              </h2>
              <p style={{ fontSize: '1rem', color: '#94a3b8', lineHeight: 1.6 }}>
                Resident issues are parsed in milliseconds by NLP keywords to determine trade category, severity, and technician SLA with full timeline tracking.
              </p>
            </div>

            {/* Real Active Maintenance Tickets */}
            <div
              className="glass-card"
              style={{
                padding: '28px',
                background: 'rgba(10, 16, 32, 0.8)',
                border: '1px solid rgba(245, 158, 11, 0.25)'
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '20px',
                  flexWrap: 'wrap',
                  gap: '12px'
                }}
              >
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>
                    Active Maintenance Telemetry Queue
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    AI Classifier Confidence: 99.2% • Average Resolution: 4.2 Hours
                  </span>
                </div>
                <Link
                  to="/report-issue"
                  className="cyber-btn-outline"
                  style={{
                    padding: '8px 18px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  <Wrench size={14} />
                  <span>Report An Issue</span>
                </Link>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  {
                    id: 'TKT-101',
                    room: 'Room 204',
                    category: 'Electrical',
                    desc: 'Ceiling fan regulator sparking and speed switch stuck on maximum RPM',
                    priority: 'High',
                    sla: 'Within 2 Hours',
                    status: 'Electrician Assigned (Mr. Kailash)',
                    badgeColor: '#f87171'
                  },
                  {
                    id: 'TKT-102',
                    room: 'Room 102',
                    category: 'Plumbing',
                    desc: 'Washbasin faucet connector loose causing slow water drip underneath',
                    priority: 'Medium',
                    sla: 'Within 6 Hours',
                    status: 'Work In Progress (Mr. Satish)',
                    badgeColor: '#fbbf24'
                  },
                  {
                    id: 'TKT-103',
                    room: 'Room 305',
                    category: 'Carpentry',
                    desc: 'Study desk drawer ball-bearing runner dislodged and stuck',
                    priority: 'Low',
                    sla: 'Within 24 Hours',
                    status: 'Scheduled for Afternoon',
                    badgeColor: '#38bdf8'
                  }
                ].map((t, i) => (
                  <div
                    key={i}
                    style={{
                      background: 'rgba(15, 23, 42, 0.75)',
                      border: '1px solid rgba(255, 255, 255, 0.08)',
                      borderRadius: '12px',
                      padding: '16px 20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      flexWrap: 'wrap',
                      gap: '14px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      <div
                        style={{
                          width: '42px',
                          height: '42px',
                          borderRadius: '10px',
                          background: 'rgba(0, 191, 251, 0.1)',
                          border: '1px solid rgba(0, 191, 251, 0.3)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#00BFFB',
                          fontWeight: 800,
                          fontSize: '0.82rem'
                        }}
                      >
                        {t.id.slice(-3)}
                      </div>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <span style={{ fontWeight: 800, color: '#ffffff', fontSize: '0.95rem' }}>
                            {t.room} • {t.category}
                          </span>
                          <span
                            style={{
                              fontSize: '0.7rem',
                              background: 'rgba(255, 255, 255, 0.08)',
                              color: t.badgeColor,
                              padding: '2px 8px',
                              borderRadius: '4px',
                              fontWeight: 700
                            }}
                          >
                            {t.priority} Priority ({t.sla})
                          </span>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: '4px 0 0 0' }}>
                          {t.desc}
                        </p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span
                        style={{
                          fontSize: '0.76rem',
                          background: 'rgba(0, 191, 251, 0.12)',
                          color: '#00BFFB',
                          padding: '4px 10px',
                          borderRadius: '6px',
                          fontWeight: 600,
                          border: '1px solid rgba(0, 191, 251, 0.25)'
                        }}
                      >
                        {t.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 7. Digital QR Gate-Pass & Automated Curfew Attendance */}
        <section
          id="how-it-works"
          style={{
            padding: '70px 0',
            position: 'relative',
            borderBottom: '1px solid rgba(0, 191, 251, 0.15)'
          }}
        >
          <div className="container">
            <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 48px auto' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '5px 14px',
                  background: 'rgba(168, 85, 247, 0.1)',
                  borderRadius: '9999px',
                  border: '1px solid rgba(168, 85, 247, 0.35)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: '#c084fc',
                  letterSpacing: '0.06em',
                  marginBottom: '16px'
                }}
              >
                <QrCode size={14} />
                <span>MODULE 04 • SECURITY GATE &amp; CURFEW PROTOCOL</span>
              </div>
              <h2
                style={{
                  fontSize: 'clamp(1.8rem, 3.8vw, 2.6rem)',
                  fontWeight: 800,
                  color: '#ffffff',
                  marginBottom: '16px',
                  letterSpacing: '-0.02em'
                }}
              >
                Digital Pass &amp; 10:00 PM Curfew Synchronization
              </h2>
              <p style={{ fontSize: '1rem', color: '#94a3b8', lineHeight: 1.6 }}>
                Paperless student exit clearance with automated SMS verification to registered parent phone numbers and warden nightly roll-call tablets.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                gap: '20px'
              }}
            >
              {[
                {
                  step: '01',
                  title: 'Student Outpass Request',
                  desc: 'Submit destination, return time, and emergency reason. System generates encrypted digital token.',
                  icon: QrCode,
                  tag: 'Student Portal'
                },
                {
                  step: '02',
                  title: 'Parent Phone Authorization',
                  desc: 'Automated SMS or digital consent dispatch to the verified guardian contact before gate checkout.',
                  icon: UserCheck,
                  tag: 'Automated Verification'
                },
                {
                  step: '03',
                  title: 'Gate Security QR Verification',
                  desc: 'Main gate guard scans cryptographic QR on tablet. Student in/out timestamp logged with zero paper friction.',
                  icon: ShieldCheck,
                  tag: 'Main Gate Terminal'
                },
                {
                  step: '04',
                  title: '10:00 PM Night Curfew Audit',
                  desc: 'Warden roll-call marks absent/present. Instant automated escalations sent if student is unreturned by curfew.',
                  icon: Clock,
                  tag: 'Night Roll-Call'
                }
              ].map((s, i) => {
                const Icon = s.icon;
                return (
                  <div
                    key={i}
                    className="glass-card"
                    style={{
                      padding: '26px',
                      background: 'rgba(10, 16, 32, 0.75)',
                      border: '1px solid rgba(168, 85, 247, 0.22)',
                      position: 'relative'
                    }}
                  >
                    <div
                      style={{
                        position: 'absolute',
                        top: '18px',
                        right: '20px',
                        fontSize: '1.4rem',
                        fontWeight: 900,
                        color: 'rgba(255, 255, 255, 0.1)',
                        fontFamily: 'monospace'
                      }}
                    >
                      {s.step}
                    </div>
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '10px',
                        background: 'rgba(168, 85, 247, 0.15)',
                        border: '1px solid rgba(168, 85, 247, 0.35)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#c084fc',
                        marginBottom: '16px'
                      }}
                    >
                      <Icon size={20} />
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#c084fc', fontWeight: 700, marginBottom: '6px' }}>
                      {s.tag}
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginBottom: '10px' }}>
                      {s.title}
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
                      {s.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 8. Zero-Trust Security & Campus Architecture */}
        <section
          id="about"
          style={{
            padding: '70px 0',
            position: 'relative',
            borderBottom: '1px solid rgba(0, 191, 251, 0.15)'
          }}
        >
          <div className="container">
            <div style={{ textAlign: 'center', maxWidth: '820px', margin: '0 auto 48px auto' }}>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '5px 14px',
                  background: 'rgba(0, 191, 251, 0.1)',
                  borderRadius: '9999px',
                  border: '1px solid rgba(0, 191, 251, 0.35)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: '#00BFFB',
                  letterSpacing: '0.06em',
                  marginBottom: '16px'
                }}
              >
                <Shield size={14} />
                <span>ENTERPRISE STANDARDS • ZERO TRUST</span>
              </div>
              <h2
                style={{
                  fontSize: 'clamp(1.8rem, 3.8vw, 2.6rem)',
                  fontWeight: 800,
                  color: '#ffffff',
                  marginBottom: '16px',
                  letterSpacing: '-0.02em'
                }}
              >
                Collegiate Security &amp; Compliance Architecture
              </h2>
              <p style={{ fontSize: '1rem', color: '#94a3b8', lineHeight: 1.6 }}>
                Built strictly to institutional standards. Role-based isolation ensures student data privacy, tamper-proof logs, and persistent local state offline redundancy.
              </p>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px'
              }}
            >
              {[
                {
                  title: 'Role-Based Access Control',
                  desc: 'Cryptographic separation between Resident, Warden, Main Gate Guard, and Campus IT Admin personas with verified permissions.',
                  icon: Lock,
                  color: '#00BFFB'
                },
                {
                  title: 'Offline-First Local Storage Sync',
                  desc: 'All active records, meal tokens, and room data are cached client-side for zero downtime even during campus network drops.',
                  icon: Database,
                  color: '#38bdf8'
                },
                {
                  title: 'Verified Student ID Persistence',
                  desc: 'Blood group, parental emergency contact, and college registration numbers are securely bound to student cryptographic profiles.',
                  icon: Cpu,
                  color: '#818cf8'
                }
              ].map((card, i) => {
                const Icon = card.icon;
                return (
                  <div
                    key={i}
                    className="glass-card"
                    style={{
                      padding: '26px',
                      background: 'rgba(10, 16, 32, 0.75)',
                      border: '1px solid rgba(0, 191, 251, 0.22)'
                    }}
                  >
                    <div
                      style={{
                        width: '42px',
                        height: '42px',
                        borderRadius: '10px',
                        background: 'rgba(0, 191, 251, 0.1)',
                        border: '1px solid rgba(0, 191, 251, 0.35)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: card.color,
                        marginBottom: '16px'
                      }}
                    >
                      <Icon size={20} />
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>
                      {card.title}
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
                      {card.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 9. Instant Portal Access & Demo Evaluation Action Bar */}
        <section
          id="contact"
          style={{
            padding: '70px 0',
            position: 'relative'
          }}
        >
          <div className="container">
            <div
              className="hud-frame"
              style={{
                padding: '40px 32px',
                background: 'rgba(8, 14, 28, 0.75)',
                border: '1px solid rgba(0, 191, 251, 0.35)',
                boxShadow: '0 0 50px rgba(0, 191, 251, 0.15)',
                textAlign: 'center',
                position: 'relative'
              }}
            >
              {/* Corner brackets */}
              <div className="hud-corner tl" />
              <div className="hud-corner tr" />
              <div className="hud-corner bl" />
              <div className="hud-corner br" />

              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '5px 14px',
                  background: 'rgba(0, 191, 251, 0.12)',
                  borderRadius: '9999px',
                  border: '1px solid rgba(0, 191, 251, 0.4)',
                  fontSize: '0.78rem',
                  fontWeight: 700,
                  color: '#00BFFB',
                  letterSpacing: '0.06em',
                  marginBottom: '18px'
                }}
              >
                <Zap size={14} />
                <span>INSTANT EVALUATOR CONSOLE</span>
              </div>

              <h2
                style={{
                  fontSize: 'clamp(1.8rem, 3.8vw, 2.6rem)',
                  fontWeight: 800,
                  color: '#ffffff',
                  marginBottom: '16px'
                }}
              >
                Ready to Experience Smart Hostel OS?
              </h2>

              <p
                style={{
                  fontSize: '1rem',
                  color: '#94a3b8',
                  maxWidth: '650px',
                  margin: '0 auto 32px auto',
                  lineHeight: 1.6
                }}
              >
                Select an authorized test persona below for instant 1-click evaluation, or proceed to the official login terminal.
              </p>

              <div
                style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '12px'
                }}
              >
                <button
                  onClick={() => quickDemoLogin('resident')}
                  className="cyber-btn-cyan"
                  style={{
                    padding: '12px 24px',
                    borderRadius: '10px',
                    fontSize: '0.92rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <Users size={16} />
                  <span>Resident Portal (Rahul Sharma • Room 204)</span>
                </button>

                <button
                  onClick={() => quickDemoLogin('warden')}
                  className="cyber-btn-outline"
                  style={{
                    padding: '12px 24px',
                    borderRadius: '10px',
                    fontSize: '0.92rem',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <ShieldCheck size={16} color="#00BFFB" />
                  <span>Warden Desk (Dr. R. K. Verma)</span>
                </button>

                <Link
                  to="/login"
                  className="cyber-btn-outline"
                  style={{
                    padding: '12px 24px',
                    borderRadius: '10px',
                    fontSize: '0.92rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span>Portal Login</span>
                  <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 10. Futuristic Dark Glass Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
