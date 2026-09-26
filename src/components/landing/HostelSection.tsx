import React, { useState } from 'react';
import {
  Building2,
  Bed,
  DoorOpen,
  Users,
  CheckCircle2,
  Key,
  Shield,
  Layers,
  ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const HostelSection: React.FC = () => {
  const [selectedBlock, setSelectedBlock] = useState<'Block A' | 'Block B'>('Block A');

  // Illustrative demo room sample
  const sampleRooms = [
    { number: '101', block: 'Block A', floor: '1st Floor', type: 'Double Bed', bed: 'Bed 1 & 2', status: 'Occupied', resident: 'Aayush M. & Rohit S.' },
    { number: '102', block: 'Block A', floor: '1st Floor', type: 'Single Bed', bed: 'Bed 1', status: 'Available', resident: 'Unallocated' },
    { number: '204', block: 'Block A', floor: '2nd Floor', type: 'Double Bed', bed: 'Bed 2', status: 'Occupied', resident: 'Karan P. & Neeraj K.' },
    { number: '205', block: 'Block A', floor: '2nd Floor', type: 'Double Bed', bed: 'Bed 1 & 2', status: 'Occupied', resident: 'Vikram J. & Siddharth N.' },
    { number: '301', block: 'Block B', floor: '3rd Floor', type: 'Double Bed', bed: 'Bed 1 & 2', status: 'Occupied', resident: 'Ananya S. & Pooja V.' },
    { number: '302', block: 'Block B', floor: '3rd Floor', type: 'Single Bed', bed: 'Bed 1', status: 'Occupied', resident: 'Meera D.' },
    { number: '303', block: 'Block B', floor: '3rd Floor', type: 'Double Bed', bed: 'Bed 2', status: 'Available', resident: 'Bed 1 Occupied • Bed 2 Open' },
    { number: '304', block: 'Block B', floor: '3rd Floor', type: 'Double Bed', bed: 'Bed 1 & 2', status: 'Occupied', resident: 'Sneha R. & Tanvi M.' },
  ];

  const filteredRooms = sampleRooms.filter(r => r.block === selectedBlock);

  return (
    <section id="hostel" style={{ padding: '80px 0', background: '#ffffff', borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 48px auto' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 12px',
              borderRadius: '9999px',
              background: '#eff6ff',
              border: '1px solid #bfdbfe',
              color: '#1e3a8a',
              fontSize: '0.8rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              marginBottom: '12px'
            }}
          >
            <Building2 size={14} />
            <span>Hostel Management</span>
          </div>

          <h2
            className="font-display"
            style={{
              fontSize: 'clamp(1.85rem, 3.5vw, 2.5rem)',
              fontWeight: 800,
              color: '#0f172a',
              lineHeight: 1.2,
              marginBottom: '16px'
            }}
          >
            Manage Where Residents Live
          </h2>

          <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Eliminate paper ledgers and chaotic room assignments. Smart Hostel organizes residential blocks,
            maps every resident to their specific bed, and gives wardens real-time visibility over room occupancy.
          </p>
        </div>

        {/* 2-Column Showcase */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '36px',
            alignItems: 'start'
          }}
        >
          {/* Left Column: UI Preview Card (Room 204 Highlight) */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              border: '1.5px solid #e2e8f0',
              padding: '28px',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    background: '#eff6ff',
                    border: '1px solid #bfdbfe',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: '#1e3a8a'
                  }}
                >
                  <Key size={20} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                    My Assigned Room
                  </h3>
                  <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                    Resident Digital Access Card
                  </span>
                </div>
              </div>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  padding: '3px 8px',
                  borderRadius: '6px',
                  background: '#f1f5f9',
                  color: '#475569'
                }}
              >
                Demonstration Preview
              </span>
            </div>

            {/* Main Room Card */}
            <div
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                padding: '20px',
                marginBottom: '20px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#1e3a8a', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Aravali Residence Hall
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a' }}>
                    Room 204
                  </div>
                </div>
                <div
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    padding: '4px 10px',
                    borderRadius: '9999px',
                    background: '#ecfdf5',
                    color: '#065f46',
                    fontSize: '0.78rem',
                    fontWeight: 700,
                    border: '1px solid #a7f3d0'
                  }}
                >
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#059669' }} />
                  Status: Occupied
                </div>
              </div>

              {/* Room details grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                  gap: '12px',
                  borderTop: '1px solid #e2e8f0',
                  paddingTop: '16px'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Hostel Block</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>Block A (Wing 2)</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Allocated Bed</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>Bed 2 (Window Side)</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Floor Level</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>2nd Floor</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Capacity</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a' }}>2 Residents</div>
                </div>
              </div>
            </div>

            {/* Operational features list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.88rem', color: '#334155' }}>
                <CheckCircle2 size={16} color="#2563eb" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Instant Bed Allocation:</strong> Wardens assign room numbers and specific bed slots with automatic conflict detection.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.88rem', color: '#334155' }}>
                <CheckCircle2 size={16} color="#2563eb" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Resident Privacy:</strong> Students view only their allocated accommodation details, while wardens hold campus-wide control.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', fontSize: '0.88rem', color: '#2563eb', fontWeight: 600 }}>
                <CheckCircle2 size={16} color="#2563eb" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span><strong>Direct Maintenance Link:</strong> Any repair request logged automatically binds to the resident&apos;s assigned room and bed.</span>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Block & Room Roster Preview */}
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              border: '1.5px solid #e2e8f0',
              padding: '28px',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
                  Live Block &amp; Room Registry
                </h3>
                <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                  Warden real-time inventory preview
                </span>
              </div>

              {/* Block selector buttons */}
              <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', padding: '3px', borderRadius: '8px' }}>
                {(['Block A', 'Block B'] as const).map(block => (
                  <button
                    key={block}
                    onClick={() => setSelectedBlock(block)}
                    style={{
                      padding: '4px 12px',
                      borderRadius: '6px',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer',
                      background: selectedBlock === block ? '#ffffff' : 'transparent',
                      color: selectedBlock === block ? '#1e3a8a' : '#64748b',
                      boxShadow: selectedBlock === block ? 'var(--shadow-sm)' : 'none'
                    }}
                  >
                    {block}
                  </button>
                ))}
              </div>
            </div>

            {/* Room mini table/cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              {filteredRooms.map((room, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 14px',
                    background: room.status === 'Available' ? '#f0fdf4' : '#f8fafc',
                    border: room.status === 'Available' ? '1px solid #bbf7d0' : '1px solid #e2e8f0',
                    borderRadius: '8px',
                    fontSize: '0.85rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        fontWeight: 800,
                        color: '#0f172a',
                        minWidth: '68px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <DoorOpen size={14} color="#64748b" />
                      <span>Rm {room.number}</span>
                    </div>
                    <div style={{ color: '#475569', fontSize: '0.8rem' }}>
                      {room.floor} • {room.bed}
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span
                      style={{
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        background: room.status === 'Available' ? '#dcfce7' : '#e2e8f0',
                        color: room.status === 'Available' ? '#15803d' : '#334155'
                      }}
                    >
                      {room.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center', paddingTop: '8px' }}>
              <Link
                to="/login"
                className="btn btn-outline"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  fontSize: '0.85rem',
                  padding: '8px 18px',
                  borderColor: '#cbd5e1'
                }}
              >
                <span>View Full Room Inventory on Dashboard</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
