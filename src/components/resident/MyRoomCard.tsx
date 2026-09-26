import React from 'react';
import { UserProfile, RoomRecord } from '../../types';
import {
  Building2,
  DoorClosed,
  Bed,
  Users,
  Shield,
  Phone,
  Sparkles,
  MapPin
} from 'lucide-react';

interface MyRoomCardProps {
  user: UserProfile;
  roomInfo?: RoomRecord;
}

export const MyRoomCard: React.FC<MyRoomCardProps> = ({ user, roomInfo }) => {
  const roommates = roomInfo?.beds.filter(b => b.residentName && b.residentName !== user.name) || [];

  return (
    <div
      className="card"
      style={{
        padding: '24px',
        background: '#ffffff',
        border: '1.5px solid #e2e8f0',
        borderRadius: '18px',
        boxShadow: 'var(--shadow-sm)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#4338ca'
            }}
          >
            <DoorClosed size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              Room {user.roomNumber || '204'}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: '#64748b' }}>
              <MapPin size={14} />
              <span>{user.block || 'Block A'}, {user.hostel || 'Aravali Boys Hostel'}</span>
            </div>
          </div>
        </div>

        <span
          style={{
            background: '#ecfdf5',
            color: '#065f46',
            border: '1px solid #a7f3d0',
            fontSize: '0.75rem',
            fontWeight: 700,
            padding: '4px 10px',
            borderRadius: '9999px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#10b981' }} />
          Active Allotment
        </span>
      </div>

      {/* Details Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
          gap: '12px',
          background: '#f8fafc',
          padding: '16px',
          borderRadius: '14px',
          marginBottom: '20px'
        }}
      >
        <div>
          <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
            Allocated Bed
          </span>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '2px' }}>
            <Bed size={16} color="#4f46e5" />
            <span>{user.bedNumber || 'Bed 1'}</span>
          </div>
        </div>

        <div>
          <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
            Hostel Wing
          </span>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
            {user.block || 'Block A'}
          </div>
        </div>

        <div>
          <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
            Room Occupancy
          </span>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#059669', marginTop: '2px' }}>
            {roomInfo ? `${roomInfo.occupied} / ${roomInfo.capacity} Beds` : '2 / 2 Beds'}
          </div>
        </div>

        <div>
          <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
            Floor Level
          </span>
          <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>
            Floor {user.roomNumber ? user.roomNumber.charAt(0) : '2'}
          </div>
        </div>
      </div>

      {/* Roommates & Warden Info */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '12px', fontSize: '0.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#475569' }}>
          <Users size={16} color="#6366f1" />
          <span>
            Roommate: <strong>{roommates.length > 0 ? roommates[0].residentName : 'Kabir Mehta (Bed 2)'}</strong>
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b' }}>
          <Shield size={16} color="#10b981" />
          <span>Wing Warden: Dr. Rajeshwar (Ext: 7100)</span>
        </div>
      </div>
    </div>
  );
};
