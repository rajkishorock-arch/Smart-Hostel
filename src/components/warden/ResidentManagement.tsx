import React, { useState } from 'react';
import { UserProfile } from '../../types';
import {
  Users,
  Search,
  Filter,
  Mail,
  Phone,
  DoorClosed,
  Bed,
  CheckCircle,
  Building
} from 'lucide-react';

interface ResidentManagementProps {
  residents: UserProfile[];
}

export const ResidentManagement: React.FC<ResidentManagementProps> = ({ residents }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [blockFilter, setBlockFilter] = useState('All');

  const studentResidents = residents.filter(r => r.role === 'resident');

  const filteredResidents = studentResidents.filter(r => {
    const matchesSearch =
      r.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.roomNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.phone.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesBlock = blockFilter === 'All' || r.block === blockFilter;

    return matchesSearch && matchesBlock;
  });

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
      {/* Header */}
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '16px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: '#eef2ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#4f46e5'
            }}
          >
            <Users size={22} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>
              2. Resident Management Registry
            </h2>
            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>
              Official roster of all registered hostel occupants, allocations, and emergency contacts
            </p>
          </div>
        </div>

        <span style={{ fontSize: '0.825rem', color: '#475569', fontWeight: 600 }}>
          <strong>{filteredResidents.length}</strong> Residents Registered
        </span>
      </div>

      {/* Filter and Search Bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '12px',
          background: '#f8fafc',
          padding: '14px',
          borderRadius: '14px',
          marginBottom: '20px',
          border: '1px solid #e2e8f0'
        }}
      >
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search by student name, room, email..."
            className="form-input"
            style={{ paddingLeft: '36px', height: '40px' }}
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
          />
        </div>

        <select
          className="form-select"
          style={{ height: '40px' }}
          value={blockFilter}
          onChange={e => setBlockFilter(e.target.value)}
        >
          <option value="All">All Hostel Blocks</option>
          <option value="Block A">Block A</option>
          <option value="Block B">Block B</option>
          <option value="Block C">Block C</option>
        </select>
      </div>

      {/* Residents Table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', fontWeight: 700 }}>
              <th style={{ padding: '12px 14px' }}>Resident Student</th>
              <th style={{ padding: '12px 14px' }}>Room &amp; Bed</th>
              <th style={{ padding: '12px 14px' }}>Hostel Wing</th>
              <th style={{ padding: '12px 14px' }}>Contact Details</th>
              <th style={{ padding: '12px 14px' }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredResidents.map(res => (
              <tr
                key={res.uid}
                style={{
                  borderBottom: '1px solid #f1f5f9',
                  transition: 'background-color 0.15s'
                }}
                onMouseEnter={e => (e.currentTarget.style.backgroundColor = '#fafafa')}
                onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <td style={{ padding: '14px' }}>
                  <div style={{ fontWeight: 700, color: '#0f172a' }}>{res.name}</div>
                  <div style={{ fontSize: '0.775rem', color: '#64748b' }}>{res.email}</div>
                </td>

                <td style={{ padding: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: '#1e293b' }}>
                    <DoorClosed size={16} color="#4f46e5" />
                    <span>Room {res.roomNumber}</span>
                  </div>
                  <div style={{ fontSize: '0.775rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Bed size={12} /> {res.bedNumber}
                  </div>
                </td>

                <td style={{ padding: '14px' }}>
                  <div style={{ fontWeight: 600, color: '#334155' }}>{res.block}</div>
                  <div style={{ fontSize: '0.775rem', color: '#64748b' }}>{res.hostel}</div>
                </td>

                <td style={{ padding: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#334155' }}>
                    <Phone size={14} color="#10b981" />
                    <span>{res.phone}</span>
                  </div>
                </td>

                <td style={{ padding: '14px' }}>
                  <span
                    style={{
                      background: '#ecfdf5',
                      color: '#065f46',
                      border: '1px solid #a7f3d0',
                      padding: '3px 8px',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <CheckCircle size={12} color="#10b981" /> Active Resident
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
