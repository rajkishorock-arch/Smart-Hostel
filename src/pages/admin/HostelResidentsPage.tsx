import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AppLayout } from '../../components/layout/AppLayout';
import { UserProfile, Ticket } from '../../types';
import { getStoredUsers, getStoredTickets } from '../../services/storageService';
import {
  Users,
  Search,
  Filter,
  Eye,
  X,
  Phone,
  Mail,
  Building2,
  Bed,
  CheckCircle,
  KeyRound,
  ArrowRight,
  Wrench,
  ShieldCheck
} from 'lucide-react';

export const HostelResidentsPage: React.FC = () => {
  const [residents, setResidents] = useState<UserProfile[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [blockFilter, setBlockFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedResident, setSelectedResident] = useState<UserProfile | null>(null);

  useEffect(() => {
    const all = getStoredUsers();
    setResidents(Object.values(all).filter(u => u.role === 'resident'));
    setTickets(getStoredTickets());
  }, []);

  const filteredResidents = residents.filter(res => {
    const matchesSearch =
      res.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      res.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (res.roomNumber && res.roomNumber.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesBlock = blockFilter === 'All' || res.block === blockFilter;

    let matchesStatus = true;
    if (statusFilter === 'Allocated') {
      matchesStatus = !!res.roomNumber && res.roomNumber !== 'Unassigned';
    } else if (statusFilter === 'Unallocated') {
      matchesStatus = !res.roomNumber || res.roomNumber === 'Unassigned';
    }

    return matchesSearch && matchesBlock && matchesStatus;
  });

  return (
    <AppLayout
      activeDomain="hostel"
      breadcrumbs={[
        { label: 'Hostel Management', href: '/admin/hostel' },
        { label: 'Residents Directory' }
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
              <Users size={14} /> Resident Registry
            </span>
          </div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: 0 }}>
            Hostel Residents Roster
          </h1>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: 'var(--neutral-muted)' }}>
            Search enrolled student profiles, contact details, and their active accommodation status.
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

      {/* Search and Filters */}
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
        <div style={{ flex: '1 1 240px', position: 'relative' }}>
          <Search
            size={16}
            color="#94a3b8"
            style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }}
          />
          <input
            type="text"
            placeholder="Search student name, email, or room..."
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
            <option value="All">All Residents</option>
            <option value="Allocated">Allocated</option>
            <option value="Unallocated">Unallocated / Waiting</option>
          </select>
        </div>
      </div>

      {/* Resident Table */}
      <div className="pro-table-wrapper">
        <table className="pro-table">
          <thead>
            <tr>
              <th>Resident</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Hostel / Block</th>
              <th>Room</th>
              <th>Bed</th>
              <th>Active Tickets</th>
              <th>Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredResidents.length === 0 ? (
              <tr>
                <td colSpan={9} style={{ textAlign: 'center', padding: '36px', color: 'var(--neutral-muted)' }}>
                  No resident records match your search query.
                </td>
              </tr>
            ) : (
              filteredResidents.map(res => {
                const isAllocated = !!res.roomNumber && res.roomNumber !== 'Unassigned';
                const residentTickets = tickets.filter(t => t.residentId === res.uid || t.residentName === res.name);
                const activeComplaints = residentTickets.filter(t => t.status !== 'Resolved').length;

                return (
                  <tr key={res.uid}>
                    <td>
                      <div style={{ fontWeight: 800, color: 'var(--neutral-dark)' }}>{res.name}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--neutral-muted)' }}>UID: {res.uid.slice(0, 8)}...</div>
                    </td>
                    <td style={{ color: 'var(--neutral-dark)' }}>{res.email}</td>
                    <td style={{ color: 'var(--neutral-muted)', fontSize: '0.82rem' }}>{res.phone || '+91 98000 00000'}</td>
                    <td>{res.block || 'Block A'}</td>
                    <td>
                      <strong style={{ color: isAllocated ? 'var(--brand-blue)' : 'var(--neutral-muted)' }}>
                        {isAllocated ? `Room ${res.roomNumber}` : '—'}
                      </strong>
                    </td>
                    <td>{isAllocated ? res.bedNumber || 'Bed 1' : '—'}</td>
                    <td>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '2px 8px',
                          borderRadius: '6px',
                          background: activeComplaints > 0 ? '#fef3c7' : '#f1f5f9',
                          color: activeComplaints > 0 ? '#b45309' : '#64748b'
                        }}
                      >
                        {activeComplaints} active
                      </span>
                    </td>
                    <td>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          padding: '3px 8px',
                          borderRadius: '12px',
                          background: isAllocated ? '#dcfce7' : '#fee2e2',
                          color: isAllocated ? '#15803d' : '#b91c1c'
                        }}
                      >
                        {isAllocated ? '● Allocated' : '● Unallocated'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => setSelectedResident(res)}
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
                        <Eye size={14} /> Profile
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Resident Details Modal */}
      {selectedResident && (
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
          onClick={() => setSelectedResident(null)}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              maxWidth: '500px',
              width: '100%',
              padding: '28px',
              boxShadow: 'var(--shadow-lg)'
            }}
            onClick={e => e.stopPropagation()}
          >
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
                  Resident Profile
                </span>
                <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--neutral-dark)', margin: '4px 0 0 0' }}>
                  {selectedResident.name}
                </h2>
              </div>
              <button
                onClick={() => setSelectedResident(null)}
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

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Mail size={16} color="var(--neutral-muted)" />
                <span style={{ fontSize: '0.86rem', color: 'var(--neutral-dark)' }}>{selectedResident.email}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Phone size={16} color="var(--neutral-muted)" />
                <span style={{ fontSize: '0.86rem', color: 'var(--neutral-dark)' }}>
                  {selectedResident.phone || '+91 98765 43210'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Building2 size={16} color="var(--neutral-muted)" />
                <span style={{ fontSize: '0.86rem', color: 'var(--neutral-dark)' }}>
                  {selectedResident.hostel || 'Aravali Hostel'} • {selectedResident.block || 'Block A'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Bed size={16} color="var(--neutral-muted)" />
                <span style={{ fontSize: '0.86rem', color: 'var(--neutral-dark)' }}>
                  {selectedResident.roomNumber
                    ? `Allocated: Room ${selectedResident.roomNumber} (${selectedResident.bedNumber || 'Bed 1'})`
                    : 'Unallocated (No bed assigned yet)'}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Wrench size={16} color="var(--neutral-muted)" />
                <span style={{ fontSize: '0.86rem', color: 'var(--neutral-dark)' }}>
                  Active Complaints: {tickets.filter(t => (t.residentId === selectedResident.uid || t.residentName === selectedResident.name) && t.status !== 'Resolved').length} pending ticket(s)
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ShieldCheck size={16} color="#16a34a" />
                <span style={{ fontSize: '0.86rem', color: '#16a34a', fontWeight: 600 }}>
                  Account Status: Active Student (Enrolled &amp; Verified)
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button
                onClick={() => setSelectedResident(null)}
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
                Reassign / Allocate <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
};
