import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '../../components/layout/AppLayout';
import { RoomRecord } from '../../types';
import { subscribeRooms } from '../../services/storageService';
import {
  Layers,
  Building2,
  DoorOpen,
  Bed,
  CheckCircle,
  ArrowRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const HostelBlocksPage: React.FC = () => {
  const [rooms, setRooms] = useState<RoomRecord[]>([]);
  const [expandedBlock, setExpandedBlock] = useState<string>('Block A');

  useEffect(() => {
    const unsub = subscribeRooms(all => setRooms(all));
    return () => unsub();
  }, []);

  const blockNames = ['Block A', 'Block B', 'Block C'];

  const blockData = blockNames.map(name => {
    const blockRooms = rooms.filter(r => r.block === name);
    const totalBeds = blockRooms.reduce((sum, r) => sum + r.capacity, 0);
    const occupiedBeds = blockRooms.reduce((sum, r) => sum + r.occupied, 0);
    const availableBeds = Math.max(0, totalBeds - occupiedBeds);
    const rate = totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0;

    // Floor hierarchy
    const floors = [1, 2, 3].map(floorNum => {
      const floorRooms = blockRooms.filter(r => r.floor === floorNum);
      const floorBeds = floorRooms.reduce((sum, r) => sum + r.capacity, 0);
      const floorOccupied = floorRooms.reduce((sum, r) => sum + r.occupied, 0);
      return {
        floorNum,
        rooms: floorRooms,
        totalBeds: floorBeds,
        occupiedBeds: floorOccupied,
        availableBeds: Math.max(0, floorBeds - floorOccupied)
      };
    });

    return {
      name,
      totalRooms: blockRooms.length,
      totalBeds,
      occupiedBeds,
      availableBeds,
      rate,
      floors
    };
  });

  return (
    <AppLayout
      activeDomain="hostel"
      breadcrumbs={[
        { label: 'Hostel Management', href: '/admin/hostel' },
        { label: 'Blocks & Floors Hierarchy' }
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
              <Layers size={14} /> Physical Infrastructure Hierarchy
            </span>
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
            Building Blocks & Vertical Floors
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: 'var(--neutral-muted)' }}>
            Structural view of residential wings, multi-level floor corridors, and bed inventories.
          </p>
        </div>

        <Link
          to="/admin/hostel/rooms"
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
          <DoorOpen size={16} /> All Rooms List
        </Link>
      </div>

      {/* Block Cards Hierarchy */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '32px' }}>
        {blockData.map(b => {
          const isExpanded = expandedBlock === b.name;
          return (
            <div
              key={b.name}
              style={{
                background: '#ffffff',
                border: '1px solid var(--neutral-border)',
                borderRadius: '14px',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-xs)'
              }}
            >
              {/* Block Header Accordion */}
              <div
                style={{
                  padding: '20px 24px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  background: isExpanded ? '#fafcff' : '#ffffff',
                  borderBottom: isExpanded ? '1px solid var(--neutral-border)' : 'none'
                }}
                onClick={() => setExpandedBlock(isExpanded ? '' : b.name)}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      background: 'var(--brand-blue-subtle)',
                      color: 'var(--brand-blue)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}
                  >
                    <Building2 size={22} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
                      {b.name}
                    </h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--neutral-muted)' }}>
                      Aravali Campus Residential Wing • {b.totalRooms} Rooms Registered
                    </span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--brand-blue)' }}>
                      {b.occupiedBeds} / {b.totalBeds} Beds ({b.rate}%)
                    </div>
                    <div style={{ fontSize: '0.74rem', color: '#16a34a', fontWeight: 600 }}>
                      {b.availableBeds} Available Beds
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp size={20} color="#64748b" /> : <ChevronDown size={20} color="#64748b" />}
                </div>
              </div>

              {/* Floors & Rooms Hierarchy Breakdown */}
              {isExpanded && (
                <div style={{ padding: '24px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                    {b.floors.map(floor => (
                      <div
                        key={floor.floorNum}
                        style={{
                          border: '1px solid var(--neutral-border)',
                          borderRadius: '10px',
                          padding: '16px 20px',
                          background: '#f8fafc'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px' }}>
                          <div>
                            <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
                              Level {floor.floorNum} (Floor {floor.floorNum})
                            </h4>
                            <span style={{ fontSize: '0.75rem', color: 'var(--neutral-muted)' }}>
                              {floor.rooms.length} Rooms • {floor.occupiedBeds} of {floor.totalBeds} Beds Occupied
                            </span>
                          </div>

                          <span
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: 700,
                              padding: '2px 8px',
                              borderRadius: '6px',
                              background: '#ffffff',
                              border: '1px solid var(--neutral-border)',
                              color: 'var(--neutral-dark)'
                            }}
                          >
                            {floor.availableBeds} Vacant Beds
                          </span>
                        </div>

                        {/* Room tiles on this floor */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px' }}>
                          {floor.rooms.length === 0 ? (
                            <span style={{ fontSize: '0.8rem', color: 'var(--neutral-muted)' }}>No rooms on this floor.</span>
                          ) : (
                            floor.rooms.map(rm => (
                              <div
                                key={rm.id}
                                style={{
                                  background: '#ffffff',
                                  border: '1px solid var(--neutral-border)',
                                  borderRadius: '8px',
                                  padding: '12px',
                                  boxShadow: 'var(--shadow-xs)'
                                }}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                                  <span style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--neutral-dark)' }}>
                                    Room {rm.roomNumber}
                                  </span>
                                  <span
                                    style={{
                                      fontSize: '0.68rem',
                                      fontWeight: 700,
                                      padding: '2px 6px',
                                      borderRadius: '4px',
                                      background: rm.occupied === rm.capacity ? '#fee2e2' : rm.occupied === 0 ? '#dcfce7' : '#eff6ff',
                                      color: rm.occupied === rm.capacity ? '#b91c1c' : rm.occupied === 0 ? '#15803d' : '#1d4ed8'
                                    }}
                                  >
                                    {rm.occupied}/{rm.capacity}
                                  </span>
                                </div>

                                <div style={{ fontSize: '0.74rem', color: 'var(--neutral-muted)' }}>
                                  {rm.beds.map(bd => (
                                    <div key={bd.bedNumber} style={{ marginTop: '2px' }}>
                                      {bd.bedNumber}: <strong style={{ color: bd.residentId ? 'var(--neutral-dark)' : '#16a34a' }}>{bd.residentId ? bd.residentName : 'Vacant'}</strong>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </AppLayout>
  );
};
