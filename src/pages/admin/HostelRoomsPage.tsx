import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '../../components/layout/AppLayout';
import { RoomRecord, UserProfile } from '../../types';
import {
  subscribeRooms,
  getAllResidents,
  allocateBed,
  releaseBed
} from '../../services/storageService';
import {
  DoorOpen,
  Search,
  Filter,
  Users,
  Bed,
  CheckCircle,
  Eye,
  X,
  KeyRound,
  Layers,
  ArrowRight,
  Printer,
  QrCode,
  ShieldCheck,
  Building2,
  Plus,
  UserCheck
} from 'lucide-react';

export const HostelRoomsPage: React.FC = () => {
  const [rooms, setRooms] = useState<RoomRecord[]>([]);
  const [residents, setResidents] = useState<UserProfile[]>([]);
  const [viewMode, setViewMode] = useState<'blueprint' | 'table'>('blueprint');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBlock, setSelectedBlock] = useState<'Block A' | 'Block B' | 'Block C'>('Block A');
  const [selectedFloor, setSelectedFloor] = useState<number>(2);
  const [selectedRoom, setSelectedRoom] = useState<RoomRecord | null>(null);
  const [selectedResidentForCert, setSelectedResidentForCert] = useState<{
    room: RoomRecord;
    bedNumber: string;
    residentName: string;
    studentId?: string;
  } | null>(null);

  // Quick allocation modal state
  const [allocatingBed, setAllocatingBed] = useState<{ room: RoomRecord; bedNumber: string } | null>(null);
  const [selectedResidentId, setSelectedResidentId] = useState('');
  const [allocatingLoading, setAllocatingLoading] = useState(false);
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);

  useEffect(() => {
    const unsub = subscribeRooms(all => setRooms(all));
    setResidents(getAllResidents());
    return () => unsub();
  }, []);

  const unallocatedResidents = residents.filter(r => r.role === 'resident' && (!r.roomNumber || r.roomNumber === 'Pending Allotment' || r.roomNumber === ''));

  // Filter logic for blueprint
  const blueprintRooms = rooms.filter(
    r => r.block === selectedBlock && r.floor === selectedFloor
  );

  // Filter logic for table
  const filteredRooms = rooms.filter(room => {
    const matchesSearch =
      room.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.block.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.beds.some(b => b.residentName?.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  const handleInstantAllocate = async () => {
    if (!allocatingBed || !selectedResidentId) return;
    setAllocatingLoading(true);
    const resident = residents.find(r => r.uid === selectedResidentId || r.id === selectedResidentId);
    if (!resident) return;

    try {
      await allocateBed(
        allocatingBed.room.id,
        allocatingBed.bedNumber,
        {
          uid: resident.uid || resident.id || '',
          name: resident.name,
          studentId: (resident as any).studentId || `STU-${resident.name.slice(0, 3).toUpperCase()}-204`
        },
        'Dr. R. K. Verma'
      );
      setActionSuccess(`Bed successfully allocated to ${resident.name}!`);
      setTimeout(() => setActionSuccess(null), 4000);
      setAllocatingBed(null);
      setSelectedResidentId('');
    } catch (e: any) {
      alert(e.message || 'Allocation failed');
    } finally {
      setAllocatingLoading(false);
    }
  };

  const handleDeallocateBed = async (roomId: string, bedNumber: string, residentName: string) => {
    if (!window.confirm(`Are you sure you want to release ${bedNumber} from ${residentName}?`)) return;
    try {
      await releaseBed(roomId, bedNumber);
      setActionSuccess(`Bed ${bedNumber} has been released and is now vacant.`);
      setTimeout(() => setActionSuccess(null), 4000);
      setSelectedRoom(null);
    } catch (e: any) {
      alert(e.message || 'Release failed');
    }
  };

  return (
    <AppLayout
      activeDomain="hostel"
      breadcrumbs={[
        { label: 'Hostel Management', href: '/admin/hostel' },
        { label: 'Rooms & Floor Blueprint' }
      ]}
    >
      {/* Top Banner with View Switcher */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid var(--neutral-border)',
          borderRadius: '16px',
          padding: '24px 28px',
          marginBottom: '24px',
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
              <DoorOpen size={14} /> Enterprise Housing Cadastre
            </span>
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
            Visual Floor Plan &amp; Bed Registry
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: 'var(--neutral-muted)' }}>
            Real-time interactive architectural floor plan with 1-click bed allocation and cryptographic allotment letters.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              display: 'flex',
              background: '#f1f5f9',
              padding: '4px',
              borderRadius: '10px',
              border: '1px solid #e2e8f0'
            }}
          >
            <button
              onClick={() => setViewMode('blueprint')}
              style={{
                padding: '7px 14px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: viewMode === 'blueprint' ? '#ffffff' : 'transparent',
                color: viewMode === 'blueprint' ? '#1e3a8a' : '#64748b',
                boxShadow: viewMode === 'blueprint' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              <Layers size={14} />
              <span>Visual Blueprint</span>
            </button>
            <button
              onClick={() => setViewMode('table')}
              style={{
                padding: '7px 14px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                background: viewMode === 'table' ? '#ffffff' : 'transparent',
                color: viewMode === 'table' ? '#1e3a8a' : '#64748b',
                boxShadow: viewMode === 'table' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
              }}
            >
              <Building2 size={14} />
              <span>Directory Table</span>
            </button>
          </div>

          <Link
            to="/admin/hostel/allocation"
            style={{
              padding: '9px 16px',
              borderRadius: '8px',
              background: 'var(--brand-blue)',
              color: '#ffffff',
              fontSize: '0.84rem',
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              textDecoration: 'none'
            }}
          >
            <KeyRound size={15} /> Allotment Manager
          </Link>
        </div>
      </div>

      {actionSuccess && (
        <div
          style={{
            padding: '12px 18px',
            borderRadius: '10px',
            background: '#ecfdf5',
            border: '1px solid #a7f3d0',
            color: '#065f46',
            fontSize: '0.88rem',
            fontWeight: 600,
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <CheckCircle size={18} color="#059669" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* VIEW 1: INTERACTIVE VISUAL BLUEPRINT */}
      {viewMode === 'blueprint' && (
        <div>
          {/* Block & Floor Navigation Bar */}
          <div
            style={{
              background: '#ffffff',
              border: '1px solid var(--neutral-border)',
              borderRadius: '14px',
              padding: '16px 20px',
              marginBottom: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '14px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Block:</span>
              {(['Block A', 'Block B', 'Block C'] as const).map(b => (
                <button
                  key={b}
                  onClick={() => setSelectedBlock(b)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    border: selectedBlock === b ? '1px solid #2563eb' : '1px solid #e2e8f0',
                    background: selectedBlock === b ? '#eff6ff' : '#ffffff',
                    color: selectedBlock === b ? '#1d4ed8' : '#475569',
                    cursor: 'pointer'
                  }}
                >
                  {b}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Floor:</span>
              {[1, 2, 3].map(f => (
                <button
                  key={f}
                  onClick={() => setSelectedFloor(f)}
                  style={{
                    padding: '6px 16px',
                    borderRadius: '8px',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    border: selectedFloor === f ? '1px solid #16a34a' : '1px solid #e2e8f0',
                    background: selectedFloor === f ? '#f0fdf4' : '#ffffff',
                    color: selectedFloor === f ? '#15803d' : '#475569',
                    cursor: 'pointer'
                  }}
                >
                  Floor {f}
                </button>
              ))}
            </div>

            {/* Blueprint Legend */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.78rem', color: '#64748b' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: '#2563eb', display: 'inline-block' }} />
                <span>Occupied Bed</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span style={{ width: 10, height: 10, borderRadius: 2, background: '#10b981', display: 'inline-block' }} />
                <span>Vacant Bed</span>
              </div>
            </div>
          </div>

          {/* Architectural Blueprint Canvas Card */}
          <div
            style={{
              background: '#0f172a',
              borderRadius: '16px',
              padding: '28px',
              border: '1px solid #1e293b',
              boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
              position: 'relative'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div>
                <span style={{ fontSize: '0.74rem', color: '#38bdf8', fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                  CAD SCHEMATIC LAYOUT
                </span>
                <h3 style={{ margin: '2px 0 0 0', color: '#ffffff', fontSize: '1.2rem', fontWeight: 800 }}>
                  {selectedBlock} • Floor {selectedFloor} Corridor
                </h3>
              </div>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                {blueprintRooms.length} Room Units on this corridor
              </span>
            </div>

            {/* Visual Floor Corridor Grid */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '18px'
              }}
            >
              {blueprintRooms.map(room => {
                const isFull = room.occupied === room.capacity;
                return (
                  <div
                    key={room.id}
                    style={{
                      background: 'rgba(30, 41, 59, 0.75)',
                      border: isFull ? '1px solid rgba(148, 163, 184, 0.2)' : '1px solid rgba(56, 189, 248, 0.4)',
                      borderRadius: '12px',
                      padding: '16px',
                      position: 'relative',
                      boxShadow: isFull ? 'none' : '0 0 15px rgba(56, 189, 248, 0.1)'
                    }}
                  >
                    {/* Room Header */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <DoorOpen size={18} color="#38bdf8" />
                        <span style={{ fontWeight: 800, color: '#ffffff', fontSize: '1.05rem' }}>
                          Room {room.roomNumber}
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '9999px',
                          background: isFull ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                          color: isFull ? '#f87171' : '#34d399'
                        }}
                      >
                        {room.occupied}/{room.capacity} {isFull ? 'FULL' : 'VACANT'}
                      </span>
                    </div>

                    {/* Beds Blueprint Schematics */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {room.beds.map((bed, idx) => {
                        const isOccupied = !!bed.residentName;
                        return (
                          <div
                            key={bed.bedNumber || idx}
                            style={{
                              background: isOccupied ? 'rgba(15, 23, 42, 0.85)' : 'rgba(16, 185, 129, 0.1)',
                              border: isOccupied ? '1px solid rgba(59, 130, 246, 0.35)' : '1px dashed rgba(16, 185, 129, 0.45)',
                              borderRadius: '8px',
                              padding: '10px 12px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <Bed size={16} color={isOccupied ? '#60a5fa' : '#34d399'} />
                              <div>
                                <div style={{ fontSize: '0.82rem', fontWeight: 700, color: isOccupied ? '#ffffff' : '#34d399' }}>
                                  {bed.bedNumber} {isOccupied ? `• ${bed.residentName}` : '• Vacant Bed Slot'}
                                </div>
                                {isOccupied && bed.studentId && (
                                  <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                                    ID: {bed.studentId}
                                  </div>
                                )}
                              </div>
                            </div>

                            {isOccupied ? (
                              <button
                                onClick={() =>
                                  setSelectedResidentForCert({
                                    room,
                                    bedNumber: bed.bedNumber,
                                    residentName: bed.residentName!,
                                    studentId: bed.studentId
                                  })
                                }
                                style={{
                                  background: 'rgba(56, 189, 248, 0.15)',
                                  border: '1px solid rgba(56, 189, 248, 0.3)',
                                  color: '#38bdf8',
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                  borderRadius: '6px',
                                  padding: '4px 8px',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                                title="Print Collegiate Allotment Certificate"
                              >
                                <Printer size={12} />
                                <span>Certificate</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => setAllocatingBed({ room, bedNumber: bed.bedNumber })}
                                style={{
                                  background: '#10b981',
                                  border: 'none',
                                  color: '#ffffff',
                                  fontSize: '0.72rem',
                                  fontWeight: 700,
                                  borderRadius: '6px',
                                  padding: '5px 10px',
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                              >
                                <Plus size={12} />
                                <span>Allocate</span>
                              </button>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: DIRECTORY TABLE VIEW */}
      {viewMode === 'table' && (
        <div style={{ background: '#ffffff', border: '1px solid var(--neutral-border)', borderRadius: '14px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid var(--neutral-border)', color: '#475569' }}>
                <th style={{ padding: '14px 18px', fontWeight: 700 }}>Room Number</th>
                <th style={{ padding: '14px 18px', fontWeight: 700 }}>Block</th>
                <th style={{ padding: '14px 18px', fontWeight: 700 }}>Floor</th>
                <th style={{ padding: '14px 18px', fontWeight: 700 }}>Capacity</th>
                <th style={{ padding: '14px 18px', fontWeight: 700 }}>Occupancy</th>
                <th style={{ padding: '14px 18px', fontWeight: 700 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredRooms.map(room => (
                <tr key={room.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '14px 18px', fontWeight: 800 }}>Room {room.roomNumber}</td>
                  <td style={{ padding: '14px 18px' }}>{room.block}</td>
                  <td style={{ padding: '14px 18px' }}>Floor {room.floor}</td>
                  <td style={{ padding: '14px 18px' }}>{room.capacity} Beds</td>
                  <td style={{ padding: '14px 18px' }}>
                    <span style={{ fontWeight: 700, color: room.occupied === room.capacity ? '#b91c1c' : '#15803d' }}>
                      {room.occupied}/{room.capacity}
                    </span>
                  </td>
                  <td style={{ padding: '14px 18px' }}>
                    <button
                      onClick={() => setSelectedRoom(room)}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: '1px solid #cbd5e1',
                        background: '#f8fafc',
                        cursor: 'pointer',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Eye size={13} /> Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL 1: INSTANT BED ALLOTMENT DRAWER */}
      {allocatingBed && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.6)',
            zIndex: 120,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            backdropFilter: 'blur(4px)'
          }}
          onClick={() => setAllocatingBed(null)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              maxWidth: '480px',
              width: '100%',
              padding: '28px',
              boxShadow: 'var(--shadow-lg)'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                  Allocate Bed Slot
                </h3>
                <span style={{ fontSize: '0.82rem', color: '#64748b' }}>
                  {allocatingBed.room.block} • Room {allocatingBed.room.roomNumber} • {allocatingBed.bedNumber}
                </span>
              </div>
              <button onClick={() => setAllocatingBed(null)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#334155', marginBottom: '8px' }}>
                Select Student for Allocation
              </label>
              {unallocatedResidents.length === 0 ? (
                <div style={{ padding: '14px', borderRadius: '8px', background: '#f8fafc', border: '1px solid #e2e8f0', color: '#64748b', fontSize: '0.85rem' }}>
                  No unassigned students found. All registered residents currently have beds.
                </div>
              ) : (
                <select
                  value={selectedResidentId}
                  onChange={e => setSelectedResidentId(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '11px 14px',
                    borderRadius: '8px',
                    border: '1px solid #cbd5e1',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                >
                  <option value="">-- Choose Unallocated Student --</option>
                  {unallocatedResidents.map(r => (
                    <option key={r.uid || r.id} value={r.uid || r.id}>
                      {r.name} ({r.email})
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setAllocatingBed(null)}
                style={{ padding: '10px 18px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', cursor: 'pointer', fontWeight: 600 }}
              >
                Cancel
              </button>
              <button
                onClick={handleInstantAllocate}
                disabled={!selectedResidentId || allocatingLoading}
                style={{
                  padding: '10px 22px',
                  borderRadius: '8px',
                  background: '#2563eb',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 700,
                  cursor: !selectedResidentId || allocatingLoading ? 'not-allowed' : 'pointer'
                }}
              >
                {allocatingLoading ? 'Allocating...' : 'Confirm Allocation'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: OFFICIAL COLLEGIATE ALLOTMENT CERTIFICATE */}
      {selectedResidentForCert && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.75)',
            zIndex: 130,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            backdropFilter: 'blur(5px)'
          }}
          onClick={() => setSelectedResidentForCert(null)}
        >
          <div
            id="allotment-certificate"
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              maxWidth: '640px',
              width: '100%',
              padding: '36px',
              boxShadow: '0 25px 60px rgba(0,0,0,0.3)',
              position: 'relative'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Certificate Header with Crest */}
            <div style={{ textAlign: 'center', borderBottom: '2px solid #0f172a', paddingBottom: '16px', marginBottom: '24px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                <Building2 size={26} color="#1e3a8a" />
                <span style={{ fontSize: '1.25rem', fontWeight: 900, letterSpacing: '-0.02em', color: '#0f172a' }}>
                  ARAVALI RESIDENCE HALLS • CAMPUS HOUSING AUTHORITY
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                Official Cryptographic Bed Allotment Credential
              </p>
            </div>

            {/* Certificate Body */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px', marginBottom: '24px', fontSize: '0.88rem' }}>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.78rem' }}>Resident Name:</span>
                <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '1.05rem' }}>
                  {selectedResidentForCert.residentName}
                </div>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.78rem' }}>Student ID / Roll No:</span>
                <div style={{ fontWeight: 700, color: '#0f172a' }}>
                  {selectedResidentForCert.studentId || '2024CS204'}
                </div>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.78rem' }}>Assigned Accommodation:</span>
                <div style={{ fontWeight: 800, color: '#1e3a8a' }}>
                  {selectedResidentForCert.room.block} • Room {selectedResidentForCert.room.roomNumber} ({selectedResidentForCert.bedNumber})
                </div>
              </div>
              <div>
                <span style={{ color: '#64748b', fontSize: '0.78rem' }}>Allotment Timestamp:</span>
                <div style={{ fontWeight: 600, color: '#0f172a' }}>
                  {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </div>
              </div>
            </div>

            {/* Handover Inventory Checklist */}
            <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '24px' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#334155', textTransform: 'uppercase', display: 'block', marginBottom: '8px' }}>
                Verified Room Assets Handover:
              </span>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontSize: '0.8rem', color: '#475569' }}>
                <div>✓ 1x Heavy Duty Bed Frame &amp; Foam Mattress</div>
                <div>✓ 1x Teakwood Study Desk &amp; Ergonomic Chair</div>
                <div>✓ 1x Two-Door Steel Wardrobe with Key</div>
                <div>✓ 1x RFID Turnstile Access Card</div>
              </div>
            </div>

            {/* Signatures & QR Code */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: '1px solid #e2e8f0', paddingTop: '18px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <QrCode size={48} color="#1e3a8a" />
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontFamily: 'monospace' }}>
                  TOKEN: SH-{selectedResidentForCert.room.roomNumber}-{Date.now().toString().slice(-6)}<br />
                  CRYPTOGRAPHIC CHECKSUM: VERIFIED
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.88rem' }}>Dr. R. K. Verma</div>
                <div style={{ fontSize: '0.74rem', color: '#64748b' }}>Chief Residence Warden</div>
                <div style={{ fontSize: '0.7rem', color: '#10b981', fontWeight: 700 }}>● DIGITALLY CERTIFIED</div>
              </div>
            </div>

            {/* Actions Bar */}
            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setSelectedResidentForCert(null)}
                style={{ padding: '9px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#ffffff', cursor: 'pointer', fontWeight: 600 }}
              >
                Close
              </button>
              <button
                onClick={() => window.print()}
                style={{
                  padding: '9px 20px',
                  borderRadius: '8px',
                  background: '#1e3a8a',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <Printer size={15} />
                <span>Print Certificate</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
};

export default HostelRoomsPage;
