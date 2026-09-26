import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '../../components/layout/AppLayout';
import { RoomRecord } from '../../types';
import { subscribeRooms } from '../../services/storageService';
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
  ArrowRight
} from 'lucide-react';

export const HostelRoomsPage: React.FC = () => {
  const [rooms, setRooms] = useState<RoomRecord[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [blockFilter, setBlockFilter] = useState('All');
  const [floorFilter, setFloorFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedRoom, setSelectedRoom] = useState<RoomRecord | null>(null);

  useEffect(() => {
    const unsub = subscribeRooms(all => setRooms(all));
    return () => unsub();
  }, []);

  // Filter logic
  const filteredRooms = rooms.filter(room => {
    const matchesSearch =
      room.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.block.toLowerCase().includes(searchQuery.toLowerCase()) ||
      room.beds.some(b => b.residentName?.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesBlock = blockFilter === 'All' || room.block === blockFilter;
    const matchesFloor = floorFilter === 'All' || room.floor.toString() === floorFilter;

    let matchesStatus = true;
    if (statusFilter === 'Full') {
      matchesStatus = room.occupied === room.capacity;
    } else if (statusFilter === 'Available') {
      matchesStatus = room.occupied < room.capacity;
    } else if (statusFilter === 'Vacant') {
      matchesStatus = room.occupied === 0;
    }

    return matchesSearch && matchesBlock && matchesFloor && matchesStatus;
  });

  return (
    <AppLayout
      activeDomain="hostel"
      breadcrumbs={[
        { label: 'Hostel Management', href: '/admin/hostel' },
        { label: 'Rooms' }
      ]}
    >
      {/* Top Banner */}
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
              <DoorOpen size={14} /> Room Management Console
            </span>
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
            Hostel Rooms Directory
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: 'var(--neutral-muted)' }}>
            Inspect individual room occupancy, bed quotas, and resident resident assignments.
          </p>
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
            gap: '6px'
          }}
        >
          <KeyRound size={16} /> Allocate Beds
        </Link>
      </div>

      {/* Search and Filters Bar */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid var(--neutral-border)',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '24px',
          boxShadow: 'var(--shadow-xs)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '14px'
        }}
      >
        {/* Search */}
        <div style={{ flex: '1 1 240px', position: 'relative' }}>
          <Search
            size={16}
            color="#94a3b8"
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            placeholder="Search room number, resident, block..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '9px 12px 9px 36px',
              borderRadius: '8px',
              border: '1px solid var(--neutral-border)',
              fontSize: '0.85rem',
              outline: 'none',
              background: '#f8fafc'
            }}
          />
        </div>

        {/* Block Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--neutral-muted)' }}>Block:</span>
          <select
            value={blockFilter}
            onChange={e => setBlockFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid var(--neutral-border)',
              fontSize: '0.84rem',
              background: '#ffffff',
              fontWeight: 600
            }}
          >
            <option value="All">All Blocks</option>
            <option value="Block A">Block A</option>
            <option value="Block B">Block B</option>
            <option value="Block C">Block C</option>
          </select>
        </div>

        {/* Floor Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--neutral-muted)' }}>Floor:</span>
          <select
            value={floorFilter}
            onChange={e => setFloorFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid var(--neutral-border)',
              fontSize: '0.84rem',
              background: '#ffffff',
              fontWeight: 600
            }}
          >
            <option value="All">All Floors</option>
            <option value="1">Floor 1</option>
            <option value="2">Floor 2</option>
            <option value="3">Floor 3</option>
          </select>
        </div>

        {/* Status Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--neutral-muted)' }}>Status:</span>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            style={{
              padding: '8px 12px',
              borderRadius: '8px',
              border: '1px solid var(--neutral-border)',
              fontSize: '0.84rem',
              background: '#ffffff',
              fontWeight: 600
            }}
          >
            <option value="All">All Statuses</option>
            <option value="Available">Available Beds</option>
            <option value="Full">Fully Occupied</option>
            <option value="Vacant">Completely Vacant</option>
          </select>
        </div>
      </div>

      {/* Room Table / Grid */}
      <div className="pro-table-wrapper">
        <table className="pro-table">
          <thead>
            <tr>
              <th>Room</th>
              <th>Block</th>
              <th>Floor</th>
              <th>Total Beds</th>
              <th>Occupied</th>
              <th>Available</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredRooms.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '36px', color: 'var(--neutral-muted)' }}>
                  No hostel rooms match the chosen filters.
                </td>
              </tr>
            ) : (
              filteredRooms.map(room => {
                const isFull = room.occupied === room.capacity;
                const isEmpty = room.occupied === 0;
                return (
                  <tr key={room.id}>
                    <td>
                      <div style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--neutral-dark)' }}>
                        Room {room.roomNumber}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--neutral-muted)' }}>
                        {room.hostel}
                      </div>
                    </td>
                    <td>
                      <span style={{ fontWeight: 600 }}>{room.block}</span>
                    </td>
                    <td>Floor {room.floor}</td>
                    <td>{room.capacity}</td>
                    <td>
                      <strong style={{ color: '#1e3a8a' }}>{room.occupied}</strong>
                    </td>
                    <td>
                      <strong style={{ color: room.capacity - room.occupied > 0 ? '#16a34a' : '#64748b' }}>
                        {room.capacity - room.occupied}
                      </strong>
                    </td>
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
                        {isFull ? '● Fully Occupied' : isEmpty ? '● Vacant' : '● Partially Available'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => setSelectedRoom(room)}
                        style={{
                          padding: '6px 12px',
                          borderRadius: '6px',
                          border: '1px solid var(--neutral-border)',
                          background: '#f8fafc',
                          color: 'var(--brand-blue)',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px'
                        }}
                      >
                        <Eye size={14} /> View Details
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Room Detail Modal */}
      {selectedRoom && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15, 23, 42, 0.5)',
            zIndex: 110,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
            backdropFilter: 'blur(3px)'
          }}
          onClick={() => setSelectedRoom(null)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              maxWidth: '540px',
              width: '100%',
              padding: '28px',
              boxShadow: 'var(--shadow-lg)'
            }}
            onClick={e => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <div>
                <span
                  style={{
                    fontSize: '0.72rem',
                    fontWeight: 800,
                    color: 'var(--brand-blue)',
                    background: 'var(--brand-blue-subtle)',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    textTransform: 'uppercase'
                  }}
                >
                  Room Details
                </span>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: '4px 0 0 0' }}>
                  Room {selectedRoom.roomNumber} — {selectedRoom.block}
                </h2>
              </div>
              <button
                onClick={() => setSelectedRoom(null)}
                style={{
                  border: 'none',
                  background: '#f1f5f9',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <X size={16} />
              </button>
            </div>

            {/* Room Specs */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr 1fr',
                gap: '12px',
                padding: '12px',
                background: '#f8fafc',
                borderRadius: '10px',
                marginBottom: '20px'
              }}
            >
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--neutral-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Floor</span>
                <div style={{ fontWeight: 800, color: 'var(--neutral-dark)' }}>Floor {selectedRoom.floor}</div>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--neutral-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Capacity</span>
                <div style={{ fontWeight: 800, color: 'var(--neutral-dark)' }}>{selectedRoom.capacity} Beds</div>
              </div>
              <div>
                <span style={{ fontSize: '0.72rem', color: 'var(--neutral-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Occupied</span>
                <div style={{ fontWeight: 800, color: 'var(--brand-blue)' }}>{selectedRoom.occupied} Beds</div>
              </div>
            </div>

            {/* Bed Breakdown */}
            <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--neutral-dark)', marginBottom: '12px' }}>
              Bed Allocations & Resident Status
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '24px' }}>
              {selectedRoom.beds.map((bed, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '12px 16px',
                    borderRadius: '8px',
                    border: '1px solid var(--neutral-border)',
                    background: bed.residentId ? '#ffffff' : '#f8fafc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '6px',
                        background: bed.residentId ? 'var(--brand-blue-subtle)' : '#f1f5f9',
                        color: bed.residentId ? 'var(--brand-blue)' : '#94a3b8',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Bed size={16} />
                    </div>
                    <div>
                      <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--neutral-dark)' }}>
                        {bed.bedNumber}
                      </div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--neutral-muted)' }}>
                        {bed.residentName ? `${bed.residentName} (${bed.studentId || 'Enrolled'})` : 'No resident assigned'}
                      </div>
                    </div>
                  </div>

                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      padding: '3px 8px',
                      borderRadius: '10px',
                      background: bed.residentId ? '#eff6ff' : '#dcfce7',
                      color: bed.residentId ? '#1d4ed8' : '#15803d'
                    }}
                  >
                    {bed.residentId ? 'Occupied' : 'Available'}
                  </span>
                </div>
              ))}
            </div>

            {/* Footer Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setSelectedRoom(null)}
                style={{
                  padding: '9px 16px',
                  borderRadius: '8px',
                  border: '1px solid var(--neutral-border)',
                  background: '#ffffff',
                  fontSize: '0.84rem',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
              <Link
                to="/admin/hostel/allocation"
                style={{
                  padding: '9px 16px',
                  borderRadius: '8px',
                  background: 'var(--brand-blue)',
                  color: '#ffffff',
                  fontSize: '0.84rem',
                  fontWeight: 700,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                Open Allocation Manager <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
};
