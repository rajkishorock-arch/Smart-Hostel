import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '../../components/layout/AppLayout';
import { RoomRecord } from '../../types';
import { subscribeRooms } from '../../services/storageService';
import {
  Building2,
  Bed,
  DoorOpen,
  Users,
  CheckCircle,
  ArrowRight,
  TrendingUp,
  Layers,
  KeyRound
} from 'lucide-react';

export const HostelOverviewPage: React.FC = () => {
  const [rooms, setRooms] = useState<RoomRecord[]>([]);

  useEffect(() => {
    const unsub = subscribeRooms(all => setRooms(all));
    return () => unsub();
  }, []);

  // Compute metrics
  const totalRooms = rooms.length;
  const occupiedRooms = rooms.filter(r => r.occupied === r.capacity).length;
  const partiallyOccupiedRooms = rooms.filter(r => r.occupied > 0 && r.occupied < r.capacity).length;
  const availableRooms = rooms.filter(r => r.occupied === 0).length;

  const totalBeds = rooms.reduce((acc, r) => acc + r.capacity, 0);
  const occupiedBeds = rooms.reduce((acc, r) => acc + r.occupied, 0);
  const availableBeds = Math.max(0, totalBeds - occupiedBeds);
  const occupancyRate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

  // Block breakdown
  const blocks = ['Block A', 'Block B', 'Block C'];
  const blockStats = blocks.map(b => {
    const bRooms = rooms.filter(r => r.block === b);
    const bBeds = bRooms.reduce((acc, r) => acc + r.capacity, 0);
    const bOccupied = bRooms.reduce((acc, r) => acc + r.occupied, 0);
    const bRate = bBeds > 0 ? Math.round((bOccupied / bBeds) * 100) : 0;
    return {
      block: b,
      rooms: bRooms.length,
      beds: bBeds,
      occupied: bOccupied,
      available: Math.max(0, bBeds - bOccupied),
      rate: bRate
    };
  });

  // Floor breakdown
  const floors = [1, 2, 3];
  const floorStats = floors.map(f => {
    const fRooms = rooms.filter(r => r.floor === f);
    const fBeds = fRooms.reduce((acc, r) => acc + r.capacity, 0);
    const fOccupied = fRooms.reduce((acc, r) => acc + r.occupied, 0);
    const fRate = fBeds > 0 ? Math.round((fOccupied / fBeds) * 100) : 0;
    return {
      floor: `Floor ${f}`,
      rooms: fRooms.length,
      beds: fBeds,
      occupied: fOccupied,
      available: Math.max(0, fBeds - fOccupied),
      rate: fRate
    };
  });

  return (
    <AppLayout
      activeDomain="hostel"
      breadcrumbs={[
        { label: 'Hostel Management', href: '/admin/hostel' },
        { label: 'Hostel Overview' }
      ]}
    >
      {/* Header Banner */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid var(--neutral-border)',
          borderRadius: '16px',
          padding: '24px 28px',
          marginBottom: '28px',
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
              <Building2 size={14} /> Hostel Accommodation Analytics
            </span>
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
            Hostel Capacity & Occupancy Overview
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: 'var(--neutral-muted)' }}>
            Institutional overview of room allocations, capacity ratios, and physical floor distributions.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <Link
            to="/admin/hostel/rooms"
            style={{
              padding: '9px 16px',
              borderRadius: '8px',
              background: '#f8fafc',
              border: '1px solid var(--neutral-border)',
              fontSize: '0.84rem',
              fontWeight: 700,
              color: 'var(--neutral-dark)',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <DoorOpen size={16} color="var(--brand-blue)" /> Rooms Directory
          </Link>
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
              gap: '6px'
            }}
          >
            <KeyRound size={16} /> Allocate Beds
          </Link>
        </div>
      </div>

      {/* Primary KPI Grid (Blue Hostel Accent) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}
      >
        <div
          style={{
            background: '#ffffff',
            border: '1px solid var(--neutral-border)',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: 'var(--shadow-xs)'
          }}
        >
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--neutral-muted)', textTransform: 'uppercase' }}>
            Total Rooms
          </span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--neutral-dark)', marginTop: '8px' }}>
            {totalRooms}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--neutral-muted)', marginTop: '4px' }}>
            {occupiedRooms} full • {partiallyOccupiedRooms} partial • {availableRooms} empty
          </div>
        </div>

        <div
          style={{
            background: '#ffffff',
            border: '1px solid var(--neutral-border)',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: 'var(--shadow-xs)'
          }}
        >
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--neutral-muted)', textTransform: 'uppercase' }}>
            Total Bed Capacity
          </span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--brand-blue)', marginTop: '8px' }}>
            {totalBeds}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--neutral-muted)', marginTop: '4px' }}>
            Standard hostel furnishings
          </div>
        </div>

        <div
          style={{
            background: '#ffffff',
            border: '1px solid var(--neutral-border)',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: 'var(--shadow-xs)'
          }}
        >
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--neutral-muted)', textTransform: 'uppercase' }}>
            Occupied Beds
          </span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#1e3a8a', marginTop: '8px' }}>
            {occupiedBeds}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--neutral-muted)', marginTop: '4px' }}>
            Active resident allocations
          </div>
        </div>

        <div
          style={{
            background: '#ffffff',
            border: '1px solid var(--neutral-border)',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: 'var(--shadow-xs)'
          }}
        >
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--neutral-muted)', textTransform: 'uppercase' }}>
            Available Beds
          </span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#16a34a', marginTop: '8px' }}>
            {availableBeds}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--neutral-muted)', marginTop: '4px' }}>
            Ready for enrollment
          </div>
        </div>

        <div
          style={{
            background: '#ffffff',
            border: '1px solid var(--neutral-border)',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: 'var(--shadow-xs)'
          }}
        >
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--neutral-muted)', textTransform: 'uppercase' }}>
            Occupancy Rate
          </span>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--brand-blue)', marginTop: '8px' }}>
            {occupancyRate}%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--neutral-muted)', marginTop: '4px' }}>
            Optimal target: 85-95%
          </div>
        </div>
      </div>

      {/* Block-wise & Floor-wise Breakdowns (Useful Institutional Charts & Bars) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}
      >
        {/* Block-wise Occupancy Breakdown */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid var(--neutral-border)',
            borderRadius: '14px',
            padding: '24px',
            boxShadow: 'var(--shadow-xs)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
                Block-wise Occupancy
              </h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--neutral-muted)' }}>
                Capacity breakdown per physical building block
              </span>
            </div>
            <Link
              to="/admin/hostel/blocks"
              style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--brand-blue)', display: 'flex', alignItems: 'center', gap: '4px' }}
            >
              Blocks View <ArrowRight size={14} />
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {blockStats.map(b => (
              <div key={b.block}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--neutral-dark)' }}>
                      {b.block}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--neutral-muted)', marginLeft: '8px' }}>
                      ({b.rooms} Rooms • {b.occupied}/{b.beds} Beds)
                    </span>
                  </div>
                  <span style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--brand-blue)' }}>
                    {b.rate}%
                  </span>
                </div>
                {/* Visual Progress Bar */}
                <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${b.rate}%`,
                      height: '100%',
                      background: 'var(--brand-blue)',
                      borderRadius: '4px',
                      transition: 'width 0.3s ease'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Floor-wise Occupancy Breakdown */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid var(--neutral-border)',
            borderRadius: '14px',
            padding: '24px',
            boxShadow: 'var(--shadow-xs)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
                Floor-wise Occupancy
              </h3>
              <span style={{ fontSize: '0.78rem', color: 'var(--neutral-muted)' }}>
                Vertical distribution across all floors
              </span>
            </div>
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: '6px',
                background: '#f1f5f9',
                color: 'var(--neutral-muted)'
              }}
            >
              3 Active Levels
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {floorStats.map(f => (
              <div key={f.floor}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <div>
                    <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--neutral-dark)' }}>
                      {f.floor}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--neutral-muted)', marginLeft: '8px' }}>
                      ({f.rooms} Rooms • {f.occupied}/{f.beds} Beds)
                    </span>
                  </div>
                  <span style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--brand-blue)' }}>
                    {f.rate}%
                  </span>
                </div>
                {/* Visual Progress Bar */}
                <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '4px', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: `${f.rate}%`,
                      height: '100%',
                      background: 'var(--brand-blue)',
                      borderRadius: '4px',
                      transition: 'width 0.3s ease'
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Room Directory Quick Snapshot */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid var(--neutral-border)',
          borderRadius: '14px',
          padding: '24px',
          boxShadow: 'var(--shadow-xs)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
              Recent Room Allocation Activity
            </h3>
            <span style={{ fontSize: '0.78rem', color: 'var(--neutral-muted)' }}>
              Live bed assignment records
            </span>
          </div>
          <Link
            to="/admin/hostel/rooms"
            style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--brand-blue)', display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            Manage All Rooms <ArrowRight size={14} />
          </Link>
        </div>

        <div className="pro-table-wrapper">
          <table className="pro-table">
            <thead>
              <tr>
                <th>Room</th>
                <th>Block</th>
                <th>Floor</th>
                <th>Capacity</th>
                <th>Occupied</th>
                <th>Available</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rooms.slice(0, 6).map(r => {
                const isFull = r.occupied === r.capacity;
                const isEmpty = r.occupied === 0;
                return (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 800 }}>Room {r.roomNumber}</td>
                    <td>{r.block}</td>
                    <td>Floor {r.floor}</td>
                    <td>{r.capacity} Beds</td>
                    <td>{r.occupied}</td>
                    <td>{r.capacity - r.occupied}</td>
                    <td>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '12px',
                          background: isFull ? '#fee2e2' : isEmpty ? '#dcfce7' : '#eff6ff',
                          color: isFull ? '#b91c1c' : isEmpty ? '#15803d' : '#1d4ed8'
                        }}
                      >
                        {isFull ? '● Full' : isEmpty ? '● Vacant' : '● Partial'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </AppLayout>
  );
};
