import React from 'react';
import { Ticket, RoomRecord, UserProfile } from '../../types';
import {
  Users,
  Building2,
  Clock,
  AlertCircle,
  CheckCircle2,
  TrendingUp
} from 'lucide-react';

interface MetricsOverviewProps {
  tickets: Ticket[];
  rooms: RoomRecord[];
  residents: UserProfile[];
}

export const MetricsOverview: React.FC<MetricsOverviewProps> = ({
  tickets,
  rooms,
  residents
}) => {
  const totalResidents = residents.filter(r => r.role === 'resident').length;

  // Calculate room capacity and occupancy
  const totalCapacity = rooms.reduce((acc, r) => acc + r.capacity, 0);
  const totalOccupied = rooms.reduce((acc, r) => acc + r.occupied, 0);
  const occupancyRate = totalCapacity > 0 ? Math.round((totalOccupied / totalCapacity) * 100) : 0;

  const countOpen = tickets.filter(t => t.status === 'Open').length;
  const countInProgress = tickets.filter(t => t.status === 'In Progress').length;
  const countResolved = tickets.filter(t => t.status === 'Resolved').length;

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
        gap: '20px',
        marginBottom: '32px'
      }}
    >
      {/* 1. Total Residents */}
      <div
        className="card"
        style={{
          padding: '22px',
          background: '#ffffff',
          borderLeft: '4px solid #4f46e5',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div>
          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
            Total Residents
          </span>
          <div className="font-display" style={{ fontSize: '1.9rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
            {totalResidents}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 600 }}>Active registered students</span>
        </div>
        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#4f46e5' }}>
          <Users size={22} />
        </div>
      </div>

      {/* 2. Room Occupancy */}
      <div
        className="card"
        style={{
          padding: '22px',
          background: '#ffffff',
          borderLeft: '4px solid #06b6d4',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div>
          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
            Room Occupancy
          </span>
          <div className="font-display" style={{ fontSize: '1.9rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
            {occupancyRate}%
          </div>
          <span style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 600 }}>
            {totalOccupied} of {totalCapacity} Beds Filled
          </span>
        </div>
        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#ecfeff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0891b2' }}>
          <Building2 size={22} />
        </div>
      </div>

      {/* 3. Open Issues */}
      <div
        className="card"
        style={{
          padding: '22px',
          background: '#ffffff',
          borderLeft: '4px solid #f59e0b',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div>
          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
            Open Issues
          </span>
          <div className="font-display" style={{ fontSize: '1.9rem', fontWeight: 800, color: '#d97706', marginTop: '4px' }}>
            {countOpen}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#b45309', fontWeight: 600 }}>Needs technician dispatch</span>
        </div>
        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#fef3c7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#d97706' }}>
          <Clock size={22} />
        </div>
      </div>

      {/* 4. In Progress */}
      <div
        className="card"
        style={{
          padding: '22px',
          background: '#ffffff',
          borderLeft: '4px solid #0284c7',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div>
          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
            In Progress
          </span>
          <div className="font-display" style={{ fontSize: '1.9rem', fontWeight: 800, color: '#0284c7', marginTop: '4px' }}>
            {countInProgress}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#0369a1', fontWeight: 600 }}>Technicians assigned</span>
        </div>
        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#0284c7' }}>
          <AlertCircle size={22} />
        </div>
      </div>

      {/* 5. Resolved */}
      <div
        className="card"
        style={{
          padding: '22px',
          background: '#ffffff',
          borderLeft: '4px solid #10b981',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div>
          <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase' }}>
            Resolved
          </span>
          <div className="font-display" style={{ fontSize: '1.9rem', fontWeight: 800, color: '#059669', marginTop: '4px' }}>
            {countResolved}
          </div>
          <span style={{ fontSize: '0.75rem', color: '#15803d', fontWeight: 600 }}>Audit verified</span>
        </div>
        <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#059669' }}>
          <CheckCircle2 size={22} />
        </div>
      </div>
    </div>
  );
};
