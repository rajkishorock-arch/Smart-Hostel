import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '../../components/layout/AppLayout';
import { useAuth } from '../../context/AuthContext';
import { RoomRecord } from '../../types';
import { getStoredRooms } from '../../services/storageService';
import {
  DoorOpen,
  Building2,
  Bed,
  Users,
  ShieldCheck,
  CheckCircle2,
  FileText,
  KeyRound,
  ArrowRight
} from 'lucide-react';

export const ResidentRoomPage: React.FC = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState<RoomRecord[]>([]);

  useEffect(() => {
    setRooms(getStoredRooms());
  }, []);

  const currentRoom = rooms.find(
    r => r.roomNumber === user?.roomNumber && r.block === user?.block
  );

  const roommates = currentRoom
    ? currentRoom.beds.filter(b => b.residentId && b.residentId !== user?.uid)
    : [];

  return (
    <AppLayout
      activeDomain="resident"
      breadcrumbs={[
        { label: 'My Hostel', href: '/resident/room' },
        { label: 'My Room & Allocation' }
      ]}
    >
      {/* Banner */}
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
              <DoorOpen size={14} /> Living Quarters
            </span>
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
            My Room: {user?.roomNumber || '204'} ({user?.block || 'Block A'})
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: 'var(--neutral-muted)' }}>
            Room details, assigned bed, registered roommates, and campus residential guidelines.
          </p>
        </div>

        <Link
          to="/resident/allocation"
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
          <FileText size={16} /> View Allocation Slip
        </Link>
      </div>

      {/* Grid: Room Details & Roommates */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '24px',
          marginBottom: '32px'
        }}
      >
        {/* Room Specifications Card */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid var(--neutral-border)',
            borderRadius: '14px',
            padding: '24px',
            boxShadow: 'var(--shadow-xs)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--brand-blue-subtle)', color: 'var(--brand-blue)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Building2 size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
                Room Specifications
              </h2>
              <span style={{ fontSize: '0.76rem', color: 'var(--neutral-muted)' }}>
                Official campus residential inventory
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ color: 'var(--neutral-muted)', fontSize: '0.86rem' }}>Hostel Wing</span>
              <strong style={{ color: 'var(--neutral-dark)', fontSize: '0.88rem' }}>{user?.hostel || 'Aravali Boys Hostel'}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ color: 'var(--neutral-muted)', fontSize: '0.86rem' }}>Building Block</span>
              <strong style={{ color: 'var(--neutral-dark)', fontSize: '0.88rem' }}>{user?.block || 'Block A'}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ color: 'var(--neutral-muted)', fontSize: '0.86rem' }}>Floor Level</span>
              <strong style={{ color: 'var(--neutral-dark)', fontSize: '0.88rem' }}>
                Floor {currentRoom ? currentRoom.floor : '2'}
              </strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f1f5f9' }}>
              <span style={{ color: 'var(--neutral-muted)', fontSize: '0.86rem' }}>My Bed Assignment</span>
              <strong style={{ color: 'var(--brand-blue)', fontSize: '0.88rem' }}>{user?.bedNumber || 'Bed 1'}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
              <span style={{ color: 'var(--neutral-muted)', fontSize: '0.86rem' }}>Room Capacity</span>
              <strong style={{ color: 'var(--neutral-dark)', fontSize: '0.88rem' }}>
                {currentRoom ? `${currentRoom.capacity} Beds (${currentRoom.occupied} Occupied)` : '2 Beds'}
              </strong>
            </div>
          </div>
        </div>

        {/* Roommates Card */}
        <div
          style={{
            background: '#ffffff',
            border: '1px solid var(--neutral-border)',
            borderRadius: '14px',
            padding: '24px',
            boxShadow: 'var(--shadow-xs)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '18px' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: 'var(--brand-purple-subtle)', color: 'var(--brand-purple)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Users size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
                My Roommates
              </h2>
              <span style={{ fontSize: '0.76rem', color: 'var(--neutral-muted)' }}>
                Residents assigned to Room {user?.roomNumber || '204'}
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {/* Myself */}
            <div style={{ padding: '12px 16px', borderRadius: '8px', background: 'var(--brand-blue-subtle)', border: '1px solid #bfdbfe', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--brand-blue)' }}>
                  {user?.name} (You)
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--neutral-muted)' }}>
                  {user?.bedNumber || 'Bed 1'} • {user?.email}
                </div>
              </div>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '10px', background: '#ffffff', color: 'var(--brand-blue)' }}>
                Self
              </span>
            </div>

            {/* Other Roommates */}
            {roommates.length === 0 ? (
              <div style={{ padding: '16px', textAlign: 'center', color: 'var(--neutral-muted)', fontSize: '0.84rem' }}>
                No other roommates currently assigned to this room.
              </div>
            ) : (
              roommates.map((rm, idx) => (
                <div key={idx} style={{ padding: '12px 16px', borderRadius: '8px', background: '#f8fafc', border: '1px solid var(--neutral-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: '0.88rem', color: 'var(--neutral-dark)' }}>
                      {rm.residentName}
                    </div>
                    <div style={{ fontSize: '0.76rem', color: 'var(--neutral-muted)' }}>
                      {rm.bedNumber} • Student ID: {rm.studentId || 'Verified'}
                    </div>
                  </div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, padding: '2px 8px', borderRadius: '10px', background: '#dcfce7', color: '#15803d' }}>
                    Active
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Hostel Rules & Conduct */}
      <div
        style={{
          background: '#ffffff',
          border: '1px solid var(--neutral-border)',
          borderRadius: '14px',
          padding: '24px',
          boxShadow: 'var(--shadow-xs)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
          <ShieldCheck size={20} color="var(--brand-purple)" />
          <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
            Hostel Living Guidelines & Rules
          </h2>
        </div>

        <ul style={{ paddingLeft: '20px', fontSize: '0.88rem', color: '#334155', lineHeight: 1.8 }}>
          <li>Quiet study hours are strictly observed between 10:00 PM and 06:00 AM daily.</li>
          <li>High-power electric appliances (induction stoves, immersion heaters) are prohibited in rooms.</li>
          <li>For any plumbing, electrical, or carpentry defects, immediately report a maintenance ticket.</li>
          <li>Mess food is to be consumed inside the dining halls; dining utensils must not be removed.</li>
        </ul>
      </div>
    </AppLayout>
  );
};
