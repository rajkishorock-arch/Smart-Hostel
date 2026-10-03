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
  Lock,
  ChevronRight,
  Shield,
  Users,
  DoorOpen,
  Calendar,
  AlertCircle,
  Database,
  Cpu,
  Layers,
  ArrowRight
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { quickDemoLogin } = useAuth();
  const [activeFloor, setActiveFloor] = useState<number>(2);
  const [consoleTab, setConsoleTab] = useState<'rooms' | 'mess' | 'tickets' | 'gatepass'>('rooms');

  // Real Residential Rooms (Aravali Residence Hall)
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
        color: '#e8f6fa',
        overflowX: 'hidden'
      }}
    >
      {/* 1. Full-Page Fixed 3D Particle WebGL Canvas with 4-Stage Scroll Morph */}
      <OrbitalCoreCanvas />

      {/* 2. Compact Sticky Glass Capsule Navbar */}
      <Navbar />

      {/* 3. 400vh Scroll-Driven Pinned 3D Hero (Exact jarvisapp.in 4-Stage Morph) */}
      <Hero />

      {/* 4. Cyber Ticker Marquee */}
      <div className="jarvis-marquee-wrap">
        <div className="jarvis-marquee">
          <div><span>•</span>ARAVALI RESIDENCE HALL: 92% LIVE OCCUPANCY</div>
          <div><span>•</span>4-MEAL SMART DINING &amp; NUTRITION TELEMETRY</div>
          <div><span>•</span>AI ISSUE TRIAGE: 99.2% CLASSIFIER CONFIDENCE</div>
          <div><span>•</span>DIGITAL QR GATE PASS &amp; 10:00 PM CURFEW SYNC</div>
          <div><span>•</span>ZERO-TRUST STUDENT ROLE ISOLATION</div>
          <div><span>•</span>OFFLINE-FIRST LOCAL STATE CACHING</div>
          <div><span>•</span>ARAVALI RESIDENCE HALL: 92% LIVE OCCUPANCY</div>
          <div><span>•</span>4-MEAL SMART DINING &amp; NUTRITION TELEMETRY</div>
          <div><span>•</span>AI ISSUE TRIAGE: 99.2% CLASSIFIER CONFIDENCE</div>
          <div><span>•</span>DIGITAL QR GATE PASS &amp; 10:00 PM CURFEW SYNC</div>
          <div><span>•</span>ZERO-TRUST STUDENT ROLE ISOLATION</div>
        </div>
      </div>

      {/* Main Content Sections (Clean, Professional, Comprehensive Operational Information) */}
      <main style={{ position: 'relative', zIndex: 10, maxWidth: '1240px', margin: '0 auto', padding: '0 24px' }}>
        
        {/* 5. Interactive Operational Console HUD Deck */}
        <section id="console" style={{ padding: '80px 0 60px 0' }}>
          <div
            className="glass-card"
            style={{
              padding: '28px',
              border: '1px solid rgba(0, 191, 251, 0.28)',
              background: 'rgba(8, 14, 28, 0.85)',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.7), 0 0 30px rgba(0, 191, 251, 0.12)'
            }}
          >
            {/* Console Header Bar */}
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
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: 'rgba(0, 191, 251, 0.12)',
                    border: '1px solid rgba(0, 191, 251, 0.4)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#00BFFB'
                  }}
                >
                  <Building2 size={22} />
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#ffffff' }}>
                      Aravali Residence Hall • Live Operational Console
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
                  <span style={{ fontSize: '0.8rem', color: '#8aa6b3' }}>
                    Block A &amp; B, Floors 1–3 • Autonomous IoT Synchronization Active
                  </span>
                </div>
              </div>

              {/* Module Tab Selector */}
              <div
                style={{
                  display: 'flex',
                  background: 'rgba(15, 23, 42, 0.85)',
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
                  const isSelected = consoleTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setConsoleTab(tab.id as any)}
                      style={{
                        padding: '8px 14px',
                        borderRadius: '8px',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        transition: 'all 0.2s ease',
                        background: isSelected ? 'linear-gradient(135deg, #00BFFB 0%, #0284c7 100%)' : 'transparent',
                        color: isSelected ? '#030712' : '#8aa6b3',
                        boxShadow: isSelected ? '0 0 15px rgba(0, 191, 251, 0.35)' : 'none'
                      }}
                    >
                      <Icon size={14} />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Tab 1: Beds & Rooms Console View */}
            {consoleTab === 'rooms' && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginBottom: '20px' }}>
                  <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(0, 191, 251, 0.2)' }}>
                    <span style={{ fontSize: '0.78rem', color: '#8aa6b3' }}>Total Capacity</span>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginTop: '2px' }}>50 Beds</div>
                    <span style={{ fontSize: '0.72rem', color: '#00BFFB' }}>10 Hall Units</span>
                  </div>
                  <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                    <span style={{ fontSize: '0.78rem', color: '#8aa6b3' }}>Allocated Occupancy</span>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399', marginTop: '2px' }}>46 Beds (92%)</div>
                    <span style={{ fontSize: '0.72rem', color: '#34d399' }}>Verified Residents</span>
                  </div>
                  <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '14px', borderRadius: '10px', border: '1px solid rgba(245, 158, 11, 0.2)' }}>
                    <span style={{ fontSize: '0.78rem', color: '#8aa6b3' }}>Available Vacancy</span>
                    <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fbbf24', marginTop: '2px' }}>4 Beds</div>
                    <span style={{ fontSize: '0.72rem', color: '#fbbf24' }}>Floor 3 Single &amp; Double</span>
                  </div>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                  <strong>Live Sample Allotment:</strong> Room 204 (Double) • Bed A: Rahul Sharma (STU-2024-001) • Bed B: Manish K. (STU-2024-002) • Status: Confirmed &amp; Biometric Key Activated.
                </div>
              </div>
            )}

            {/* Tab 2: Mess Nutrition Console View */}
            {consoleTab === 'mess' && (
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
                  {[
                    { meal: 'Breakfast', time: '07:30 - 09:30', cal: '480 kcal', menu: 'Poha & Peanuts, Boiled Sprouts, Seasonal Banana, Full Cream Milk / Masala Chai' },
                    { meal: 'Lunch', time: '12:30 - 14:30', cal: '740 kcal', menu: 'Dal Makhani, Shahi Paneer Butter Masala, Fresh Butter Roti, Basmati Rice, Boondi Raita' },
                    { meal: 'Evening Snacks', time: '17:00 - 18:30', cal: '290 kcal', menu: 'Crispy Veg Cutlet, Green Mint Chutney, Hot Cardamom Tea' },
                    { meal: 'Dinner', time: '20:00 - 22:00', cal: '680 kcal', menu: 'Yellow Dal Tadka, Seasonal Mix Veg, Phulka Roti, Jeera Rice, Warm Gulab Jamun' }
                  ].map((m, i) => (
                    <div key={i} style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '16px', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontWeight: 800, color: '#ffffff', fontSize: '0.95rem' }}>{m.meal}</span>
                        <span style={{ fontSize: '0.72rem', color: '#fbbf24', fontWeight: 700 }}>{m.cal}</span>
                      </div>
                      <span style={{ fontSize: '0.72rem', color: '#8aa6b3', display: 'block', marginBottom: '8px' }}>{m.time}</span>
                      <p style={{ fontSize: '0.8rem', color: '#cbd5e1', margin: 0, lineHeight: 1.4 }}>{m.menu}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tab 3: AI Maintenance Console View */}
            {consoleTab === 'tickets' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {[
                  { id: 'TKT-101', room: 'Room 204', trade: 'Electrical', desc: 'Ceiling fan regulator sparking and speed switch stuck on maximum', priority: 'High', sla: '2h SLA', status: 'Electrician Assigned (Mr. Kailash)' },
                  { id: 'TKT-102', room: 'Room 102', trade: 'Plumbing', desc: 'Washbasin faucet connector loose with slow water drip', priority: 'Medium', sla: '6h SLA', status: 'In Progress (Mr. Satish)' },
                  { id: 'TKT-103', room: 'Room 305', trade: 'Carpentry', desc: 'Study table drawer runner dislodged and stuck', priority: 'Low', sla: '24h SLA', status: 'Scheduled for Afternoon' }
                ].map((t, i) => (
                  <div key={i} style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '14px 18px', borderRadius: '10px', border: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{ fontWeight: 800, color: '#00BFFB', fontSize: '0.85rem' }}>{t.id}</span>
                        <span style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.9rem' }}>{t.room} • {t.trade}</span>
                        <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', fontWeight: 700 }}>{t.priority} ({t.sla})</span>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: '#8aa6b3', margin: '4px 0 0 0' }}>{t.desc}</p>
                    </div>
                    <span style={{ fontSize: '0.76rem', color: '#34d399', background: 'rgba(16, 185, 129, 0.15)', padding: '4px 10px', borderRadius: '6px', fontWeight: 600 }}>{t.status}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Tab 4: Gate Pass & Curfew Console View */}
            {consoleTab === 'gatepass' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '18px', borderRadius: '10px', border: '1px solid rgba(168, 85, 247, 0.3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <QrCode size={18} color="#c084fc" />
                    <span style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.95rem' }}>Digital QR Gate Clearance</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#8aa6b3', lineHeight: 1.5, margin: 0 }}>
                    Emergency and weekend outpass requests generate cryptographically signed QR tokens only after verified SMS authorization from the registered guardian contact.
                  </p>
                </div>
                <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '18px', borderRadius: '10px', border: '1px solid rgba(0, 191, 251, 0.3)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <Clock size={18} color="#00BFFB" />
                    <span style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.95rem' }}>10:00 PM Night Curfew Roll-Call</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#8aa6b3', lineHeight: 1.5, margin: 0 }}>
                    Warden roll-call tablet terminal tracks check-in status per floor. Unreturned students trigger automated escalation alerts directly to warden and parents.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* 6. Section: Room & Bed Registry Engine (#hostel) */}
        <section id="hostel" style={{ padding: '60px 0', borderTop: '1px solid rgba(0, 191, 251, 0.15)' }}>
          <div className="jarvis-eyebrow">MODULE 01 • RESIDENTIAL INVENTORY</div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 700, color: '#ffffff', marginBottom: '14px', letterSpacing: '-1px' }}>
            Aravali Residence Hall Bed Matrix
          </h2>
          <p style={{ fontSize: '1rem', color: '#8aa6b3', maxWidth: '640px', lineHeight: 1.6, marginBottom: '28px' }}>
            Real-time digital room mapping. Track allocated beds, floor layouts, and verified resident check-ins without paperwork conflicts.
          </p>

          {/* Interactive Floor Bed Grid */}
          <div className="glass-card" style={{ padding: '24px', background: 'rgba(8, 14, 28, 0.8)', border: '1px solid rgba(0, 191, 251, 0.22)' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h4 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>Floor Allocation Overview</h4>
                <span style={{ fontSize: '0.78rem', color: '#8aa6b3' }}>Select a floor to view real bed allotment tokens</span>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[1, 2, 3].map(floor => (
                  <button
                    key={floor}
                    onClick={() => setActiveFloor(floor)}
                    className={activeFloor === floor ? 'cyber-btn-cyan' : 'cyber-btn-outline'}
                    style={{ padding: '6px 16px', borderRadius: '8px', fontSize: '0.82rem', cursor: 'pointer' }}
                  >
                    Floor {floor}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '14px' }}>
              {filteredRooms.map(room => (
                <div key={room.number} style={{ background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                    <span style={{ fontSize: '1rem', fontWeight: 800, color: '#00BFFB' }}>Room {room.number}</span>
                    <span style={{ fontSize: '0.72rem', padding: '2px 8px', borderRadius: '9999px', background: room.occupied === room.capacity ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)', color: room.occupied === room.capacity ? '#f87171' : '#34d399', fontWeight: 700 }}>
                      {room.occupied === room.capacity ? 'FULL' : `${room.capacity - room.occupied} VACANT`}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#8aa6b3', marginBottom: '10px' }}>
                    Type: <strong style={{ color: '#ffffff' }}>{room.type}</strong> • Occupied: <strong style={{ color: '#ffffff' }}>{room.occupied}/{room.capacity}</strong>
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {room.residents.map((name, idx) => (
                      <span key={idx} style={{ fontSize: '0.74rem', background: 'rgba(0, 191, 251, 0.1)', border: '1px solid rgba(0, 191, 251, 0.25)', padding: '3px 8px', borderRadius: '6px', color: '#cbd5e1' }}>
                        Bed {String.fromCharCode(65 + idx)}: {name}
                      </span>
                    ))}
                    {room.capacity > room.occupied && (
                      <span style={{ fontSize: '0.74rem', background: 'rgba(16, 185, 129, 0.1)', border: '1px dashed rgba(16, 185, 129, 0.35)', padding: '3px 8px', borderRadius: '6px', color: '#34d399' }}>
                        Bed {String.fromCharCode(65 + room.occupied)}: Open
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 7. Section: Smart Mess & 7-Day Nutrition (#mess) */}
        <section id="mess" style={{ padding: '60px 0', borderTop: '1px solid rgba(0, 191, 251, 0.15)' }}>
          <div className="jarvis-eyebrow">MODULE 02 • SMART DINING &amp; NUTRITION</div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 700, color: '#ffffff', marginBottom: '14px', letterSpacing: '-1px' }}>
            7-Day Mess Nutrition &amp; Attendance
          </h2>
          <p style={{ fontSize: '1rem', color: '#8aa6b3', maxWidth: '640px', lineHeight: 1.6, marginBottom: '28px' }}>
            Scheduled nutrient profiling, live meal counts, and zero-waste kitchen forecasting.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' }}>
            {[
              { meal: 'Breakfast', time: '07:30 - 09:30 AM', cal: '480 kcal', menu: 'Poha with Peanuts, Boiled Sprouts, Seasonal Banana, Full Cream Milk / Masala Chai', chef: 'Supervisor: Head Chef R. Yadav' },
              { meal: 'Lunch', time: '12:30 - 02:30 PM', cal: '740 kcal', menu: 'Dal Makhani, Shahi Paneer Butter Masala, Fresh Butter Roti, Basmati Rice, Boondi Raita', chef: 'Supervisor: Senior Chef Anita S.' },
              { meal: 'Evening Snacks', time: '05:00 - 06:30 PM', cal: '290 kcal', menu: 'Crispy Veg Cutlet, Green Mint Chutney, Hot Cardamom Tea, Assorted Biscuits', chef: 'Supervisor: Kitchen Team B' },
              { meal: 'Dinner', time: '08:00 - 10:00 PM', cal: '680 kcal', menu: 'Yellow Arhar Dal Tadka, Seasonal Mix Veg, Soft Phulka Roti, Jeera Rice, Warm Gulab Jamun', chef: 'Supervisor: Night Shift Team A' }
            ].map((m, i) => (
              <div key={i} className="glass-card" style={{ padding: '22px', background: 'rgba(10, 16, 32, 0.75)', border: '1px solid rgba(16, 185, 129, 0.25)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '1.05rem', fontWeight: 800, color: '#ffffff' }}>{m.meal}</span>
                    <span style={{ fontSize: '0.72rem', color: '#fbbf24', fontWeight: 700 }}>{m.cal}</span>
                  </div>
                  <div style={{ fontSize: '0.76rem', color: '#8aa6b3', marginBottom: '10px' }}>{m.time}</div>
                  <p style={{ fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.5, margin: 0 }}>{m.menu}</p>
                </div>
                <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '10px', marginTop: '14px', fontSize: '0.72rem', color: '#64748b' }}>
                  {m.chef}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 8. Section: AI Maintenance Classification & SLA Triage (#maintenance) */}
        <section id="maintenance" style={{ padding: '60px 0', borderTop: '1px solid rgba(0, 191, 251, 0.15)' }}>
          <div className="jarvis-eyebrow">MODULE 03 • AI ISSUE TRIAGE &amp; DISPATCH</div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 700, color: '#ffffff', marginBottom: '14px', letterSpacing: '-1px' }}>
            Automated Fault Detection &amp; Priority Dispatch
          </h2>
          <p style={{ fontSize: '1rem', color: '#8aa6b3', maxWidth: '640px', lineHeight: 1.6, marginBottom: '28px' }}>
            Resident complaints are classified by AI NLP keywords to determine trade category, severity, and technician SLA timers.
          </p>

          <div className="glass-card" style={{ padding: '24px', background: 'rgba(10, 16, 32, 0.8)', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#ffffff' }}>Active Maintenance Telemetry Queue</span>
              <span style={{ fontSize: '0.78rem', color: '#fbbf24' }}>AI Classifier Confidence: 99.2% • Avg Resolution: 4.2 Hours</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { id: 'TKT-101', room: 'Room 204', trade: 'Electrical', desc: 'Ceiling fan regulator sparking and speed switch stuck on maximum', priority: 'High', sla: 'Within 2 Hours', status: 'Electrician Assigned (Mr. Kailash)' },
                { id: 'TKT-102', room: 'Room 102', trade: 'Plumbing', desc: 'Washbasin faucet connector loose causing slow water drip underneath', priority: 'Medium', sla: 'Within 6 Hours', status: 'Work In Progress (Mr. Satish)' },
                { id: 'TKT-103', room: 'Room 305', trade: 'Carpentry', desc: 'Study desk drawer runner dislodged and stuck', priority: 'Low', sla: 'Within 24 Hours', status: 'Scheduled for Afternoon' }
              ].map((t, i) => (
                <div key={i} style={{ background: 'rgba(15, 23, 42, 0.75)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '10px', padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <span style={{ fontWeight: 800, color: '#00BFFB', fontSize: '0.85rem' }}>{t.id}</span>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 700, color: '#ffffff', fontSize: '0.9rem' }}>{t.room} • {t.trade}</span>
                        <span style={{ fontSize: '0.7rem', padding: '2px 8px', borderRadius: '4px', background: 'rgba(239, 68, 68, 0.2)', color: '#f87171', fontWeight: 700 }}>{t.priority} ({t.sla})</span>
                      </div>
                      <p style={{ fontSize: '0.78rem', color: '#8aa6b3', margin: '3px 0 0 0' }}>{t.desc}</p>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.76rem', color: '#00BFFB', background: 'rgba(0, 191, 251, 0.12)', padding: '4px 10px', borderRadius: '6px', fontWeight: 600 }}>{t.status}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 9. Section: Digital QR Gate-Pass & Night Curfew (#how-it-works) */}
        <section id="how-it-works" style={{ padding: '60px 0', borderTop: '1px solid rgba(0, 191, 251, 0.15)' }}>
          <div className="jarvis-eyebrow">MODULE 04 • GATE CLEARANCE &amp; CURFEW</div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 700, color: '#ffffff', marginBottom: '14px', letterSpacing: '-1px' }}>
            Digital Pass &amp; 10:00 PM Curfew Protocol
          </h2>
          <p style={{ fontSize: '1rem', color: '#8aa6b3', maxWidth: '640px', lineHeight: 1.6, marginBottom: '28px' }}>
            Paperless student exit clearance with automated SMS verification to registered guardian contacts.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
            {[
              { step: '01', title: 'Student Outpass Request', desc: 'Submit destination, return time, and emergency reason. System generates encrypted digital token.' },
              { step: '02', title: 'Guardian Phone Authorization', desc: 'Automated SMS or digital consent dispatch to the verified guardian contact before gate checkout.' },
              { step: '03', title: 'Gate Security QR Verification', desc: 'Main gate guard scans cryptographic QR on tablet. Student in/out timestamp logged with zero paper friction.' },
              { step: '04', title: '10:00 PM Night Curfew Audit', desc: 'Warden roll-call marks absent/present. Instant automated escalations sent if student is unreturned by curfew.' }
            ].map((s, i) => (
              <div key={i} className="glass-card" style={{ padding: '22px', background: 'rgba(10, 16, 32, 0.75)', border: '1px solid rgba(168, 85, 247, 0.22)' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#c084fc', display: 'block', marginBottom: '8px' }}>STEP {s.step}</span>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>{s.title}</h4>
                <p style={{ fontSize: '0.8rem', color: '#8aa6b3', lineHeight: 1.5, margin: 0 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 10. Section: Enterprise Security & Compliance (#about) */}
        <section id="about" style={{ padding: '60px 0', borderTop: '1px solid rgba(0, 191, 251, 0.15)' }}>
          <div className="jarvis-eyebrow">ENTERPRISE STANDARDS • ZERO TRUST</div>
          <h2 style={{ fontSize: 'clamp(1.8rem, 3.5vw, 2.6rem)', fontWeight: 700, color: '#ffffff', marginBottom: '14px', letterSpacing: '-1px' }}>
            Collegiate Security &amp; Compliance Architecture
          </h2>
          <p style={{ fontSize: '1rem', color: '#8aa6b3', maxWidth: '640px', lineHeight: 1.6, marginBottom: '28px' }}>
            Built strictly to institutional standards. Role-based isolation ensures student data privacy, tamper-proof logs, and persistent local state offline redundancy.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
            {[
              { title: 'Role-Based Access Control', desc: 'Cryptographic separation between Resident, Warden, Main Gate Guard, and Campus IT Admin personas with verified permissions.', icon: Lock },
              { title: 'Offline-First Local Storage Sync', desc: 'All active records, meal tokens, and room data are cached client-side for zero downtime even during campus network drops.', icon: Database },
              { title: 'Verified Student ID Persistence', desc: 'Blood group, parental emergency contact, and college registration numbers are securely bound to student cryptographic profiles.', icon: Cpu }
            ].map((card, i) => {
              const Icon = card.icon;
              return (
                <div key={i} className="glass-card" style={{ padding: '24px', background: 'rgba(10, 16, 32, 0.75)', border: '1px solid rgba(0, 191, 251, 0.22)' }}>
                  <Icon size={24} color="#00BFFB" style={{ marginBottom: '14px' }} />
                  <h4 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff', marginBottom: '8px' }}>{card.title}</h4>
                  <p style={{ fontSize: '0.82rem', color: '#8aa6b3', lineHeight: 1.5, margin: 0 }}>{card.desc}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* 11. Section: 1-Click Fast Evaluator Terminal (#contact) */}
        <section id="contact" style={{ padding: '60px 0 100px 0', borderTop: '1px solid rgba(0, 191, 251, 0.15)' }}>
          <div
            className="hud-frame"
            style={{
              padding: '44px 32px',
              background: 'rgba(8, 14, 28, 0.85)',
              border: '1px solid rgba(79, 224, 255, 0.35)',
              boxShadow: '0 0 50px rgba(79, 224, 255, 0.15)',
              textAlign: 'center',
              position: 'relative'
            }}
          >
            <div className="hud-corner tl" />
            <div className="hud-corner tr" />
            <div className="hud-corner bl" />
            <div className="hud-corner br" />

            <div className="jarvis-eyebrow">INSTANT EVALUATOR CONSOLE</div>

            <h2 style={{ fontSize: 'clamp(1.8rem, 3.8vw, 2.6rem)', fontWeight: 800, color: '#ffffff', marginBottom: '14px' }}>
              Experience Smart Hostel OS Live
            </h2>

            <p style={{ fontSize: '1rem', color: '#8aa6b3', maxWidth: '620px', margin: '0 auto 28px auto', lineHeight: 1.6 }}>
              Select an authorized test persona below to instantly launch their real operational dashboard, or sign in with your credentials.
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', gap: '14px' }}>
              <button
                onClick={() => quickDemoLogin('resident')}
                className="cyber-btn-cyan"
                style={{ padding: '13px 26px', borderRadius: '10px', fontSize: '0.92rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px', border: 'none' }}
              >
                <Users size={16} />
                <span>Launch Student Portal (Rahul Sharma • Room 204)</span>
              </button>

              <button
                onClick={() => quickDemoLogin('warden')}
                className="cyber-btn-outline"
                style={{ padding: '13px 26px', borderRadius: '10px', fontSize: '0.92rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <ShieldCheck size={16} color="#4fe0ff" />
                <span>Launch Warden Desk (Dr. R. K. Verma)</span>
              </button>

              <Link
                to="/login"
                className="cyber-btn-outline"
                style={{ padding: '13px 24px', borderRadius: '10px', fontSize: '0.92rem', display: 'inline-flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
              >
                <span>Portal Login</span>
                <ChevronRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* 12. Sleek Dark Glass Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
